using RegistryService.Models.Dto;
using System.Net.Http.Headers;

namespace RegistryService.Services
{
    public class StorageClient : IStorageClient
    {
        private readonly HttpClient _http;
        private const string BaseUrl = "http://localhost:5002/api/v1/storage";

        public StorageClient(HttpClient http)
        {
            _http = http;
        }

        public async Task<PresignedUrlResponse> GetPresignedDownloadUrlAsync(string fileName)
        {
            var response = await _http.GetFromJsonAsync<PresignedUrlResponse>(
                $"{BaseUrl}/download-link/{fileName}");

            if (response?.Url == null)
                throw new Exception("Не удалось получить presigned ссылку от StorageService");

            return response;
        }

    }
}
