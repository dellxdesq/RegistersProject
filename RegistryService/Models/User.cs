namespace RegistryService.Models
{
    public class User
    {
        public int Id { get; set; }
        public required string Username { get; set; }
        public required string Email { get; set; }
        public required byte[] PasswordHash { get; set; }
        public required byte[] PasswordSalt { get; set; }

        public string? FirstName { get; set; }   
        public string? LastName { get; set; }    
        public string? Organization { get; set; }

        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiry { get; set; }

        public List<Registry> Registries { get; set; } = new();
        public List<UserRegistryAccess> Accesses { get; set; } = new();
        public List<RegistryAccessRequest> AccessRequests { get; set; } = new();
    }
}