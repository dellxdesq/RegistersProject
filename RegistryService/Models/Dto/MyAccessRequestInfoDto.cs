using RegistryService.Models.Enums;

namespace RegistryService.Models.Dto
{
    public record MyAccessRequestInfoDto(
    int RequestId,
    int RegistryId,
    string RegistryName,
    string? Message,
    DateTime RequestedAt,
    AccessRequestStatus Status,
    string? RejectReason
    );
}
