namespace AuthService.Models.Dto
{
    public record UserDto(int Id, string Username, string Email, string? FirstName, string? LastName, string? Organization);
}
