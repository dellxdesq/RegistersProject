using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RegistryServiceProject.Models.Dto;
using RegistryServiceProject.Services;
using System.Security.Claims;

namespace RegistryServiceProject.Controllers
{
    [ApiController]
    [Route("/api/v1/registries")]
    [Authorize]
    public class RegistryController : ControllerBase
    {
        private readonly Services.RegistryService _registryService;

        public RegistryController(Services.RegistryService registryService)
        {
            _registryService = registryService ?? throw new ArgumentNullException(nameof(registryService));
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdStr == null || !int.TryParse(userIdStr, out var userId))
                return Unauthorized();

            var registries = await _registryService.GetRegistriesAsync(userId);
            return Ok(registries);
        }

        [HttpGet("uploaded-list")]
        public async Task<IActionResult> GetUploadedRegistries()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdStr == null || !int.TryParse(userIdStr, out var userId))
                return Unauthorized();

            var registries = await _registryService.GetRegistriesCreatedByUserAsync(userId);
            return Ok(registries);
        }

        //Добавление реестра, метаданных и доступов
        [HttpPost("add")]
        public async Task<IActionResult> AddRegistry([FromBody] CreateRegistryRequest request)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdStr == null || !int.TryParse(userIdStr, out var userId))
                return Unauthorized();

            var registryId = await _registryService.AddRegistryAsync(request, userId);
            return Ok(new { RegistryId = registryId });
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

        [HttpGet("user/{id}")]
        public async Task<IActionResult> GetUserRegistryList(int id)
        {
            var registries = await _registryService.GetAvailableRegistryListForUserAsync(id);
            return Ok(registries);
        }

        [HttpGet("users/logins")]
        public async Task<IActionResult> GetUsernames()
        {
            var usernames = await _registryService.GetUsernamesAsync();

            return Ok(usernames);
        }

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
    