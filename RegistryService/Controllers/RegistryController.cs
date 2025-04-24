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
            var registries = await _registryService.GetRegistriesAsync();
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
    }
}
    