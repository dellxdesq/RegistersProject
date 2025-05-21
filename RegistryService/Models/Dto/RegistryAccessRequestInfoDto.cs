using RegistryService.Models.Enums;

namespace RegistryService.Models.Dto
{
    public record RegistryAccessRequestInfoDto(
        int RequestId,
        int UserId,
        int RegistryId,
        string Username,
        string RegistryName,
        string? Message,
        DateTime RequestedAt
    );
}
