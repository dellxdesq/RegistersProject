using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RegistryServiceProject.Models.Dto;
using RegistryServiceProject.Services;
using System.Security.Claims;

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
                Meta = registry.Meta == null ? null : new
                {
                    registry.Meta.FileFormat,
                    registry.Meta.Organization,
                    registry.Meta.RowsCount
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

            // Скачиваем файл с MinIO через StorageService
            var httpClient = new HttpClient(); // лучше через DI
            var stream = await httpClient.GetStreamAsync($"http://localhost:5002/api/v1/storage/download/{fileName}");

            return File(stream, "application/octet-stream", fileName);
        }
    }
}
    