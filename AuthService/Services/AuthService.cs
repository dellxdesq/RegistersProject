using AuthService.Data;
using AuthService.Models;
using AuthService.Models.Dto;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace AuthService.Services
{
    public class AuthService
    {
        private readonly AuthDbContext _context;
        private readonly IConfiguration _config;

        public AuthService(AuthDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<AuthResult> Register(string username, string email, string password)
        {
            if (password.Length < 6)
                return new AuthResult(false, Error: "Password must be at least 6 characters");

            if (await _context.Users.AnyAsync(u => u.Username == username))
                return new AuthResult(false, "Username already exists");

            using var hmac = new HMACSHA512();
            var user = new User
            {
                Username = username,
                Email = email,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password)),
                PasswordSalt = hmac.Key
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new AuthResult(true, CreateToken(user));
        }

        public record AuthResult(bool Success, string Token = null, string Error = null);

        public async Task<string> Login(string username, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null || !VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
                return null;

            return CreateToken(user);
        }

        private string CreateToken(User user)
        {
            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(_config["Jwt:ExpiryInMinutes"])),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private void CreatePasswordHash(string password, out byte[] hash, out byte[] salt)
        {
            using var hmac = new HMACSHA512();
            salt = hmac.Key;
            hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        }

        private bool VerifyPasswordHash(string password, byte[] hash, byte[] salt)
        {
            using var hmac = new HMACSHA512(salt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            return computedHash.SequenceEqual(hash);
        }

        public bool ValidateToken(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"])),
                    ValidateIssuer = true,
                    ValidIssuer = _config["Jwt:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = _config["Jwt:Audience"],
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };

                tokenHandler.ValidateToken(token, validationParameters, out _);
                return true;
            }
            catch
            {
                return false;
            }
        }

        //Действия с учёткой
        public async Task<UserDto?> GetUserProfileAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            return user == null ? null : new UserDto(
                user.Id, user.Username, user.Email,
                user.FirstName, user.LastName, user.Organization
            );
        }

        public async Task<bool> UpdateUserProfileAsync(int userId, UpdateUserDto dto)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            user.Email = dto.Email;
            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.Organization = dto.Organization;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<(bool Success, string Error)> ChangePasswordAsync(int userId, string currentPassword, string newPassword)
        {
            if (newPassword.Length < 6)
                return (false, "New password must be at least 6 characters");

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return (false, "User not found");

            if (!VerifyPasswordHash(currentPassword, user.PasswordHash, user.PasswordSalt))
                return (false, "Incorrect current password");

            CreatePasswordHash(newPassword, out var newHash, out var newSalt);
            user.PasswordHash = newHash;
            user.PasswordSalt = newSalt;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return (true, null);
        }
    }
}