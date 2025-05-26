using RegistryService.Models.Dto;

namespace RegistryService.Services
{
    public interface IStorageClient
    {
        Task<PresignedUrlResponse> GetPresignedDownloadUrlAsync(string fileName);
    }
}
