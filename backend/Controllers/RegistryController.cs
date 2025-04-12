using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/v1/registries")]
    public class RegistryController : ControllerBase
    {
        private readonly RegistryService _service;

        public RegistryController(RegistryService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var registries = await _service.GetRegistriesAsync();
            return Ok(registries);
        }
    }
}
