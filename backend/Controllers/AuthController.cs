using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/v1/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto request)
        {
            var result = await _authService.Register(request.Username, request.Email, request.Password);

            if (!result.Success)
                return BadRequest(result.Error);

            return Ok(new { result.Token });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto request)
        {
            var token = await _authService.Login(request.Username, request.Password);
            if (token == null)
                return Unauthorized();

            return Ok(new { Token = token });
        }
    }

    public record RegisterDto(string Username, string Email, string Password);
    public record LoginDto(string Username, string Password);
}
