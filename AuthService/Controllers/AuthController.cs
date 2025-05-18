using AuthService.Models.Dto;
using AuthService.Services;
using Microsoft.AspNetCore.Authorization;
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
            var result = await _authService.Login(request.Username, request.Password);

            if (!result.Success)
                return Unauthorized(new { error = result.Error });

            return Ok(new
            {
                accessToken = result.Token,
                refreshToken = result.RefreshToken
            });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh(RefreshTokenDto request)
        {
            var result = await _authService.RefreshAccessToken(request.RefreshToken);

            if (!result.Success)
                return Unauthorized(new { error = result.Error });

            return Ok(new
            {
                accessToken = result.Token,
                refreshToken = result.RefreshToken
            });
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            await _authService.LogoutAsync(userId);
            return Ok(new { message = "Logged out successfully" });
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

        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var profile = await _authService.GetUserProfileAsync(userId);
            return profile == null ? NotFound() : Ok(profile);
        }

        [Authorize]
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile(UpdateUserDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var result = await _authService.UpdateUserProfileAsync(userId, dto);
            return result ? Ok() : NotFound();
        }

        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword(ChangePasswordDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var (success, error) = await _authService.ChangePasswordAsync(userId, dto.CurrentPassword, dto.NewPassword);
            return success ? Ok() : BadRequest(error);
        }
    }

    public record RegisterDto(string Username, string Email, string Password);
    public record LoginDto(string Username, string Password);
}