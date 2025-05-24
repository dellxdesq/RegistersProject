using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RegistryService.Models;
using RegistryService.Models.Dto;
using RegistryServiceProject.Models.Dto;
using RegistryServiceProject.Services;
using System.Security.Claims;
using System.Text.Json;

namespace RegistryServiceProject.Controllers
{
    [ApiController]
    [Route("/api/v1/registries")]
    public class RegistryController : ControllerBase
    {
        private readonly Services.RegistryService _registryService;

        public RegistryController(Services.RegistryService registryService)
        {
            _registryService = registryService ?? throw new ArgumentNullException(nameof(registryService));
        }

        //все реестры кроме тех к которым не дали доступ
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            int? userId = null;
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdStr, out var parsedId))
                userId = parsedId;

            var registries = await _registryService.GetRegistriesAsync(userId);
            return Ok(registries);
        }

        //список загруженных
        [Authorize]
        [HttpGet("list/uploaded")]
        public async Task<IActionResult> GetUploadedRegistries()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdStr == null || !int.TryParse(userIdStr, out var userId))
                return Unauthorized();

            var registries = await _registryService.GetRegistriesCreatedByUserAsync(userId);
            return Ok(registries);
        }

        //Добавление реестра, метаданных и доступов
        [Authorize]
        [HttpPost("add")]
        public async Task<IActionResult> AddRegistry([FromBody] CreateRegistryRequest request)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdStr == null || !int.TryParse(userIdStr, out var userId))
                return Unauthorized();

            var registryId = await _registryService.AddRegistryAsync(request, userId);
            return Ok(new { RegistryId = registryId });
        }

        //получить список реестров 2-3 уровня доступа созданных текущим пользователем 
        [Authorize]
        [HttpGet("list/uploaded/acces-level/2-3")]
        public async Task<IActionResult> GetAccessibleRegistriesLevel2Or3()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdStr, out var userId))
                return Unauthorized();

            var registries = await _registryService.GetUserCreatedRegistriesWithAccessLevel2Or3Async(userId);
            return Ok(registries);
        }

        //получение узернеймов пользователей которым дали доступ к реестру
        [Authorize]
        [HttpGet("{id}/users/usernames")]
        public async Task<ActionResult<List<string>>> GetUsernamesWithAccessToRegistryAsync(int id)
        {
            var usernames = await _registryService.GetUsernamesWithAccessToRegistryAsync(id);
            return Ok(usernames);
        }

        //Выдача доступа к реестру по узернейму
        [Authorize]
        [HttpPost("{id}/users/access")]
        public async Task<IActionResult> GrantAccessToUserAsync(int id, [FromBody] GrantAccessRequest request)
        {
            var success = await _registryService.GrantAccessToUserByUsernameAsync(id, request.Username);
            if (!success)
                return BadRequest("Пользователь не найден или уже имеет доступ.");
            return Ok("Доступ выдан.");
        }

        //удаляет доступ по username
        [Authorize]
        [HttpDelete("{id}/users/access")]
        public async Task<IActionResult> RevokeAccessFromUserAsync(int id, [FromBody] GrantAccessRequest request)
        {
            var success = await _registryService.RevokeAccessFromUserByUsernameAsync(id, request.Username);
            if (!success)
                return BadRequest("Пользователь не найден.");
            return Ok("Доступ удалён.");
        }

        // Получить конкретный реестр с метаданными
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdStr == null)
                return Unauthorized();

            if (!int.TryParse(userIdStr, out var userId))
                return Unauthorized();

            var registry = await _registryService.GetRegistryWithMetaIfUserHasAccessAsync(id, userId);
            if (registry == null)
                return Forbid(); // доступ есть к системе, но нет к этому реестру

            return Ok(new
            {
                registry.Id,
                registry.Name,
                registry.Description,
                registry.DefaultAccessLevel,
                Meta = registry.Meta == null ? null : new
                {
                    registry.Meta.FileFormat,
                    registry.Meta.Organization,
                    registry.Meta.RowsCount,
                    registry.Meta.FileName
                }

            });
        }

        //получить все реестры по id юзера
        [Authorize]
        [HttpGet("user/{id}")]
        public async Task<IActionResult> GetUserRegistryList(int id)
        {
            var registries = await _registryService.GetAvailableRegistryListForUserAsync(id);
            return Ok(registries);
        }

        //получить все usernames(1000 шт пока)
        [Authorize]
        [HttpGet("users/logins")]
        public async Task<IActionResult> GetUsernames()
        {
            var usernames = await _registryService.GetUsernamesAsync();

            return Ok(usernames);
        }

        //скачивание файла по id реестра
        [Authorize]
        [HttpGet("{id}/download")]
        public async Task<IActionResult> Download(int id)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdStr, out var userId))
                return Unauthorized();

            var registry = await _registryService.GetRegistryWithMetaIfUserHasAccessAsync(id, userId);
            if (registry?.Meta == null || string.IsNullOrEmpty(registry.Meta.FileName))
                return NotFound("Файл не прикреплён к реестру");

            var fileName = registry.Meta.FileName;

            // Запросить ссылку у StorageService
            var httpClient = new HttpClient(); // лучше через IHttpClientFactory
            var response = await httpClient.GetFromJsonAsync<PresignedUrlResponse>(
                $"http://localhost:5002/api/v1/storage/download-link/{fileName}");

            if (response == null || string.IsNullOrEmpty(response.Url))
                return StatusCode(500, "Не удалось получить ссылку на скачивание");

            return Ok(new { DownloadUrl = response.Url });
        }

        //Запрос доступа к реестру
        [Authorize]
        [HttpPost("{id}/request-access")]
        public async Task<IActionResult> RequestAccess(int id, [FromBody] AccessRequestMessageDto dto)
        {
            var callerUserIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(callerUserIdStr, out var callerUserId))
                return Unauthorized();

            var success = await _registryService.CreateAccessRequestAsync(id, callerUserId, dto.Message);

            if (!success)
                return BadRequest("Не удалось отправить запрос на доступ");

            return Ok("Запрос на доступ отправлен");
        }

        //список запросов к моим реестрам
        [Authorize]
        [HttpGet("requests-access")]
        public async Task<IActionResult> GetAccessRequests()
        {
            var callerUserIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(callerUserIdStr, out var callerUserId))
                return Unauthorized();

            var requests = await _registryService.GetAccessRequestsForUserRegistriesAsync(callerUserId);
            return Ok(requests);
        }

        //список моих запросов к реестрам
        [Authorize]
        [HttpGet("my-access-requests")]
        public async Task<IActionResult> GetMyAccessRequests()
        {
            var callerUserIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(callerUserIdStr, out var callerUserId))
                return Unauthorized();

            var requests = await _registryService.GetMyAccessRequestsAsync(callerUserId);
            return Ok(requests);
        }

        private int GetUserId()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdStr == null || !int.TryParse(userIdStr, out var userId))
                throw new UnauthorizedAccessException("Invalid or missing user ID");
            return userId;
        }

        //принять запрос
        [Authorize]
        [HttpPost("access-requests/{id}/approve")]
        public async Task<IActionResult> ApproveAccessRequest(int id)
        {
            var userId = GetUserId();
            var (success, errorMessage) = await _registryService.ApproveAccessRequestAsync(id, userId);

            if (!success)
                return BadRequest(errorMessage);

            return Ok(true);
        }

        //отказать на запрос
        [Authorize]
        [HttpPost("access-requests/{id}/reject")]
        public async Task<IActionResult> RejectAccessRequest(int id, [FromBody] RejectRequestDto dto)
        {
            var userId = GetUserId();
            var (success, errorMessage) = await _registryService.RejectAccessRequestAsync(id, userId, dto.Reason);

            if (!success)
                return BadRequest(errorMessage);

            return Ok(true);
        }

        //удалить запрос
        [Authorize]
        [HttpDelete("access-requests/{id}")]
        public async Task<IActionResult> DeleteAccessRequest(int id)
        {
            GetUserId();
            var deleted = await _registryService.DeleteAccessRequestAsync(id);

            if (!deleted)
                return NotFound("Запрос не найден");

            return Ok();
        }

        [Authorize]
        [HttpPost("{registryId}/slice/save")]
        public async Task<IActionResult> SaveSlice(int registryId, [FromBody] SaveSliceRequestDto dto)
        {
            var entity = new RegistrySlice
            {
                RegistryId = registryId,
                Name = dto.Name,
                FileName = dto.FileName,
                SliceDefinitionJson = JsonSerializer.Serialize(dto.Request)
            };

            await _registryService.SaveSliceAsync(entity);

            return Ok(entity.Id);
        }

    }
}
