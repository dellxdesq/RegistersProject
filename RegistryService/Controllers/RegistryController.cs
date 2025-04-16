using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RegistryServiceProject.Services;

namespace RegistryServiceProject.Controllers
{
    [ApiController]
    [Route("/api/v1/registries")]
    [Authorize]
    public class RegistryController : ControllerBase
    {
        private readonly RegistryService _registryService;

        public RegistryController(RegistryService registryService)
        {
            _registryService = registryService ?? throw new ArgumentNullException(nameof(registryService));
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var registries = await _registryService.GetRegistriesAsync();
            return Ok(registries);
        }
    }
}
    