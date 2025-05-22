using RegistryServiceProject.Data;
using RegistryServiceProject.Models;
using Microsoft.EntityFrameworkCore;
using RegistryService.Models.Enums;
using RegistryService.Models;
using RegistryServiceProject.Models.Dto;
using RegistryService.Models.Dto;
using System.Net.Http;

namespace RegistryServiceProject.Services
{
    public class RegistryService
    {
        private readonly AppDbContext _db;
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;

        public RegistryService(AppDbContext db, HttpClient httpClient, IConfiguration config)
        {
            _db = db;
            _httpClient = httpClient;
            _config = config;
        }

        public async Task<List<Registry>> GetRegistriesAsync(int? userId)
        {
            var registriesQuery = _db.Registries.AsQueryable();

            if (userId == null)
            {
                // Гость: только публичные и по запросу
                registriesQuery = registriesQuery
                    .Where(r => r.DefaultAccessLevel == AccessLevel.Public ||
                                r.DefaultAccessLevel == AccessLevel.Requestable);
            }
            else
            {
                // Авторизованный: 1 и 2 уровень + 3 если есть доступ
                var allowedRegistryIds = await _db.UserRegistryAccesses
                    .Where(a => a.UserId == userId && a.IsApproved)
                    .Select(a => a.RegistryId)
                    .ToListAsync();

                registriesQuery = registriesQuery
                    .Where(r =>
                        r.DefaultAccessLevel == AccessLevel.Public ||
                        r.DefaultAccessLevel == AccessLevel.Requestable ||
                        (r.DefaultAccessLevel == AccessLevel.InternalOrganization &&
                         allowedRegistryIds.Contains(r.Id)));
            }

            return await registriesQuery.ToListAsync();
        }

        public async Task<List<Registry>> GetRegistriesCreatedByUserAsync(int userId)
        {
            return await _db.Registries
                .Where(r => r.CreatedByUserId == userId)
                .ToListAsync();
        }

        public async Task<List<Registry>> GetUserCreatedRegistriesWithAccessLevel2Or3Async(int userId)
        {
            return await _db.Registries
                .Where(r => r.CreatedByUserId == userId &&
                            (r.DefaultAccessLevel == AccessLevel.Requestable || r.DefaultAccessLevel == AccessLevel.InternalOrganization))
                .Include(r => r.Meta)
                .ToListAsync();
        }

        public async Task<List<string>> GetUsernamesWithAccessToRegistryAsync(int registryId)
        {
            var usernames = await _db.UserRegistryAccesses
                .Where(a => a.RegistryId == registryId && a.IsApproved)
                .Include(a => a.User)
                .Select(a => a.User.Username)
                .ToListAsync();

            return usernames;
        }

        public async Task<Registry?> GetRegistryWithMetaByIdAsync(int id)
        {
            return await _db.Registries
                .Include(r => r.Meta) //метаданные включаю я
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<Registry?> GetRegistryWithMetaIfUserHasAccessAsync(int registryId, int userId)
        {
            var registry = await _db.Registries
                .Include(r => r.Meta)
                .FirstOrDefaultAsync(r => r.Id == registryId);

            if (registry == null)
                return null;

            // короче создателю доступ
            if (registry.CreatedByUserId == userId)
                return registry;

            var access = await _db.UserRegistryAccesses
                .FirstOrDefaultAsync(a => a.RegistryId == registryId && a.UserId == userId);

            var hasAccess =
                (access != null && access.IsApproved) ||
                (access == null && (
                    registry.DefaultAccessLevel == AccessLevel.Public ||
                    registry.DefaultAccessLevel == AccessLevel.Requestable
                ));

            return hasAccess ? registry : null;
        }


        public async Task<List<RegistryDto>> GetAvailableRegistryListForUserAsync(int userId)
        {
            var approvedUserRegistries = await _db.UserRegistryAccesses
                .Where(ua => ua.UserId == userId &&
                             ua.IsApproved &&
                             ua.Registry.CreatedByUserId != userId)
                .Select(ua => new RegistryDto(ua.Registry.Id, ua.Registry.Name))
                .ToListAsync();

            return approvedUserRegistries;
        }

        public record RegistryDto(int Id, string Name);

        public async Task<List<string>> GetUsernamesAsync()
        {
            var usernames = await _db.Users
                 .Select(u => u.Username)
                 .Take(1000) // ограничь при необходимости
                 .ToListAsync();
            return usernames;
        }
        

        public async Task<int> AddRegistryAsync(CreateRegistryRequest request, int userId)
        {
            var registry = new Registry
            {
                Name = request.Name,
                Description = request.Description,
                DefaultAccessLevel = request.DefaultAccessLevel,
                CreatedByUserId = userId
            };

            _db.Registries.Add(registry);
            await _db.SaveChangesAsync(); // надо, чтобы получить registry.Id

            //var analyzerUrl = $"{_config["AnalyzerService:BaseUrl"]}/api/v1/file-preview/{request.FileName}";
            var analyzerUrl = $"http://localhost:5008/api/v1/file-preview/{request.FileName}";
            var analysis = await _httpClient.GetFromJsonAsync<FileAnalysisDto>(analyzerUrl);

            var meta = new RegistryMeta
            {
                RegistryId = registry.Id,
                FileFormat = analysis.Extension,
                Organization = request.Organization,
                RowsCount = analysis.RowsCount,
                FileName = request.FileName
            };

            _db.RegistryMetas.Add(meta);

            var userAccess = new UserRegistryAccess
            {
                UserId = userId,
                RegistryId = registry.Id,
                AccessLevel = AccessLevel.InternalOrganization, // полный доступ
                IsApproved = true,
                GrantedAt = DateTime.UtcNow
            };

            _db.UserRegistryAccesses.Add(userAccess);

            await _db.SaveChangesAsync();

            if (request.UserLoginsWithAccess != null && request.UserLoginsWithAccess.Any())
            {
                var users = await _db.Users
                    .Where(u => request.UserLoginsWithAccess.Contains(u.Username) && u.Id != userId) // исключаем создателя
                    .ToListAsync();

                foreach (var user in users)
                {
                    var access = new UserRegistryAccess
                    {
                        UserId = user.Id,
                        RegistryId = registry.Id,
                        AccessLevel = AccessLevel.Requestable, // <-- уровень 2
                        IsApproved = true,
                        GrantedAt = DateTime.UtcNow
                    };
                    _db.UserRegistryAccesses.Add(access);
                }

                await _db.SaveChangesAsync();
            }

            return registry.Id;
        }

        //Выдача доступа к реестру по узернейму
        public async Task<bool> GrantAccessToUserByUsernameAsync(int registryId, string username)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null)
                return false;

            var registry = await _db.Registries.FirstOrDefaultAsync(r => r.Id == registryId);
            if (registry == null)
                return false;

            if (registry.DefaultAccessLevel != AccessLevel.Requestable &&
                registry.DefaultAccessLevel != AccessLevel.InternalOrganization)
                return false; // нельзя выдавать доступ к публичному реестру

            // Проверка: не дублируем доступ
            var exists = await _db.UserRegistryAccesses
                .AnyAsync(a => a.UserId == user.Id && a.RegistryId == registryId);

            if (exists)
                return false;

            var access = new UserRegistryAccess
            {
                UserId = user.Id,
                RegistryId = registry.Id,
                AccessLevel = registry.DefaultAccessLevel, // 2 или 3
                IsApproved = true,
                GrantedAt = DateTime.UtcNow
            };

            _db.UserRegistryAccesses.Add(access);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RevokeAccessFromUserByUsernameAsync(int registryId, string username)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null)
                return false;

            var access = await _db.UserRegistryAccesses
                .FirstOrDefaultAsync(a => a.UserId == user.Id && a.RegistryId == registryId);

            if (access == null)
                return false;

            _db.UserRegistryAccesses.Remove(access);
            await _db.SaveChangesAsync();
            return true;
        }

        //Созданю запрос доступа
        public async Task<bool> CreateAccessRequestAsync(int registryId, int userId, string? message)
        {
            // храню запрос в таблице
            var request = new RegistryAccessRequest
            {
                RegistryId = registryId,
                UserId = userId,
                Message = message,
                RequestedAt = DateTime.UtcNow
            };

            _db.RegistryAccessRequests.Add(request);
            await _db.SaveChangesAsync();
            return true;
        }

        //список запросов на мои реестры
        public async Task<List<RegistryAccessRequestInfoDto>> GetAccessRequestsForUserRegistriesAsync(int ownerUserId)
        {
            var requests = await _db.RegistryAccessRequests
                .Where(r => r.Registry.CreatedByUserId == ownerUserId && r.Status == AccessRequestStatus.Pending)
                .Include(r => r.Registry)
                .Include(r => r.User)
                .Select(r => new RegistryAccessRequestInfoDto(
                    r.Id,
                    r.UserId,
                    r.RegistryId,
                    r.User.Username,
                    r.Registry.Name,
                    r.Message,
                    r.RequestedAt
                ))
                .ToListAsync();

            return requests;
        }

        //список моих запросов к реестрам
        public async Task<List<MyAccessRequestInfoDto>> GetMyAccessRequestsAsync(int userId)
        {
            var requests = await _db.RegistryAccessRequests
                .Where(r => r.UserId == userId)
                .Include(r => r.Registry)
                .Select(r => new MyAccessRequestInfoDto(
                    r.Id,
                    r.RegistryId,
                    r.Registry.Name,
                    r.Message,
                    r.RequestedAt,
                    r.Status,
                    r.RejectReason
                ))
                .ToListAsync();

            return requests;
        }

        //принять запрос
        public async Task<(bool success, string? errorMessage)> ApproveAccessRequestAsync(int requestId, int currentUserId)
        {
            var request = await _db.RegistryAccessRequests
                .Include(r => r.Registry)
                .FirstOrDefaultAsync(r => r.Id == requestId);

            if (request == null)
                return (false, "Запрос не найден");

            if (request.Registry.CreatedByUserId != currentUserId)
                return (false, "Нет доступа");

            if (request.Status != AccessRequestStatus.Pending)
                return (false, "Запрос уже обработан");

            request.Status = AccessRequestStatus.Approved;

            var exists = await _db.UserRegistryAccesses
                .AnyAsync(a => a.RegistryId == request.RegistryId && a.UserId == request.UserId);

            if (!exists)
            {
                _db.UserRegistryAccesses.Add(new UserRegistryAccess
                {
                    RegistryId = request.RegistryId,
                    UserId = request.UserId,
                    AccessLevel = request.Registry.DefaultAccessLevel,
                    IsApproved = true,
                    GrantedAt = DateTime.UtcNow
                });
            }

            await _db.SaveChangesAsync();
            return (true, null);
        }

        //отказ
        public async Task<(bool success, string? errorMessage)> RejectAccessRequestAsync(int requestId, int currentUserId, string? reason)
        {
            var request = await _db.RegistryAccessRequests
                .Include(r => r.Registry)
                .FirstOrDefaultAsync(r => r.Id == requestId);

            if (request == null)
                return (false, "Запрос не найден");

            if (request.Registry.CreatedByUserId != currentUserId)
                return (false, "Нет доступа");

            if (request.Status != AccessRequestStatus.Pending)
                return (false, "Запрос уже обработан");

            request.Status = AccessRequestStatus.Rejected;
            request.RejectReason = reason;

            await _db.SaveChangesAsync();
            return (true, null);
        }

        //удаление запроса
        public async Task<bool> DeleteAccessRequestAsync(int requestId)
        {
            var request = await _db.RegistryAccessRequests.FirstOrDefaultAsync(r => r.Id == requestId);
            if (request == null)
                return false;

            _db.RegistryAccessRequests.Remove(request);
            await _db.SaveChangesAsync();

            return true;
        }


    }
}
