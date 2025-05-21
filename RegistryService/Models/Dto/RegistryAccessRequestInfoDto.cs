namespace RegistryService.Models.Dto
{
    public record RegistryAccessRequestInfoDto(
        int UserId,
        int RegistryId,
        string Username,
        string RegistryName,
        string? Message
    );
}
