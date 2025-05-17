using RegistryServiceProject.Data;
using RegistryServiceProject.Models;
using Microsoft.EntityFrameworkCore;
using RegistryService.Models.Enums;
using RegistryService.Models;
using RegistryServiceProject.Models.Dto;

namespace RegistryServiceProject.Services
{
    public class RegistryService
    {
        private readonly AppDbContext _db;

        public RegistryService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<List<Registry>> GetRegistriesAsync(int userId)
        {
            var allowedRegistryIds = await _db.UserRegistryAccesses
                .Where(a => a.UserId == userId && a.IsApproved)
                .Select(a => a.RegistryId)
                .ToListAsync();

            var registries = await _db.Registries
                .Where(r =>
                    r.DefaultAccessLevel == AccessLevel.Public ||
                    r.DefaultAccessLevel == AccessLevel.Requestable ||
                    (r.DefaultAccessLevel == AccessLevel.InternalOrganization &&
                     allowedRegistryIds.Contains(r.Id))
                )
                .ToListAsync();

            return registries;
        }

        public async Task<List<Registry>> GetRegistriesCreatedByUserAsync(int userId)
        {
            return await _db.Registries
                .Where(r => r.CreatedByUserId == userId)
                .ToListAsync();
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

            var access = await _db.UserRegistryAccesses
                .FirstOrDefaultAsync(a => a.RegistryId == registryId && a.UserId == userId);

            // Если доступ явно не выдан, но реестр публичный — разрешаю доступ
            if (access == null && registry.DefaultAccessLevel == AccessLevel.Public)
                return registry;

            var allowed = access != null && (
                (access.AccessLevel == AccessLevel.Public) ||
                (access.AccessLevel == AccessLevel.Requestable && access.IsApproved) ||
                (access.AccessLevel == AccessLevel.InternalOrganization && access.IsApproved)
            );

            return allowed ? registry : null;
        }

        //public async Task<List<object>> GetAvailableRegistryListForUserAsync(int userId)
        //{
        //    var publicRegistries = await _db.Registries
        //        .Where(r => r.DefaultAccessLevel == AccessLevel.Public)
        //        .Select(r => new { r.Id, r.Name })
        //        .ToListAsync();

        //    var userRegistries = await _db.UserRegistryAccesses
        //        .Include(ua => ua.Registry)
        //        .Where(ua => ua.UserId == userId && ua.IsApproved)
        //        .Select(ua => new { ua.Registry.Id, ua.Registry.Name })
        //        .ToListAsync();

        //    var result = publicRegistries
        //        .Concat(userRegistries)
        //        .GroupBy(r => r.Id)
        //        .Select(g => g.First())
        //        .ToList<object>();

        //    return result;
        //}

        public async Task<List<object>> GetAvailableRegistryListForUserAsync(int userId)
        {
            // 1. Публичные реестры, созданные НЕ этим пользователем
            var publicRegistries = await _db.Registries
                .Where(r => r.DefaultAccessLevel == AccessLevel.Public && r.CreatedByUserId != userId)
                .Select(r => new { r.Id, r.Name })
                .ToListAsync();

            // 2. Реестры, к которым у пользователя есть одобренный доступ, и которые он НЕ создавал
            var approvedUserRegistries = await _db.UserRegistryAccesses
                .Include(ua => ua.Registry)
                .Where(ua => ua.UserId == userId &&
                             ua.IsApproved &&
                             ua.Registry.CreatedByUserId != userId)
                .Select(ua => new { ua.Registry.Id, ua.Registry.Name })
                .ToListAsync();

            // 3. Объединение и исключение дубликатов по Id
            var result = publicRegistries
                .Concat(approvedUserRegistries)
                .GroupBy(r => r.Id)
                .Select(g => g.First())
                .ToList<object>();

            return result;
        }

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

            var meta = new RegistryMeta
            {
                RegistryId = registry.Id,
                FileFormat = request.FileFormat,
                Organization = request.Organization,
                RowsCount = request.RowsCount,
                FileName = request.FileName //имя файла в MinIO
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
    }
}
