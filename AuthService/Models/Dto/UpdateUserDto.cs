namespace AuthService.Models.Dto
{

    public class UpdateUserDto
    {
        public string Email { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Organization { get; set; }
    }
}
