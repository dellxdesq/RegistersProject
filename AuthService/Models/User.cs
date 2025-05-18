namespace AuthService.Models
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
    }
}