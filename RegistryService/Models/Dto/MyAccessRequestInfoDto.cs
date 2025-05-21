namespace RegistryService.Models.Dto
{
    public record MyAccessRequestInfoDto(
        int RegistryId,
        string RegistryName,
        string? Message,
        DateTime RequestedAt
    );
}
