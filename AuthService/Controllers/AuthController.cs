using AuthService.Services;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace AuthService.Controllers
{
    [ApiController]
    [Route("api/v1/auth")]
    public class AuthController : ControllerBase
    {
        private readonly Services.AuthService _authService;

        public AuthController(Services.AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto request)
        {
            var result = await _authService.Register(
                request.Username,
                request.Email,
                request.Password
            );

            if (!result.Success)
                return BadRequest(result.Error);

            return Ok(new { result.Token });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto request)
        {
            var token = await _authService.Login(
                request.Username,
                request.Password
            );

            return token == null
                ? Unauthorized()
                : Ok(new { Token = token });
        }

        [HttpGet("validate")]
        public IActionResult ValidateToken()
        {
            try
            {
                var authHeader = HttpContext.Request.Headers["Authorization"].ToString();

                if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                    return Unauthorized(new { Error = "Missing or invalid Authorization header" });

                var token = authHeader.Substring("Bearer ".Length).Trim();

                var isValid = _authService.ValidateToken(token);
                if (!isValid)
                    return Unauthorized(new { Error = "Invalid token" });

                var handler = new JwtSecurityTokenHandler();
                var jwt = handler.ReadJwtToken(token);

                return Ok(new
                {
                    UserId = jwt.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value,
                    IsValid = true
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }
    }

    public record RegisterDto(string Username, string Email, string Password);
    public record LoginDto(string Username, string Password);
}