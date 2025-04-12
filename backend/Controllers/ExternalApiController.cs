using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/v1/external")]
    public class ExternalApiController : ControllerBase
    {
        private readonly ExternalApiService _service;

        public ExternalApiController(ExternalApiService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetData(string govEndpoint)
        {
            var data = await _service.FetchDataFromGovApiAsync(govEndpoint);
            return Ok(data);
        }
    }
}
