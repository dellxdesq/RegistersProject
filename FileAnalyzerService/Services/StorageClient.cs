using FileAnalyzerService.Models.Dto;
using System.Net.Http.Headers;

namespace FileAnalyzerService.Services
{
    public class StorageClient : IStorageClient
    {
        private readonly HttpClient _http;
        private const string BaseUrl = "http://localhost:5002";

        public StorageClient(HttpClient http)
        {
            _http = http;
        }

        public async Task<Stream> GetFileStreamAsync(string fileName)
        {
            var storageUrl = $"{BaseUrl}/api/v1/storage/download-link/{fileName}";
            var resp = await _http.GetFromJsonAsync<DownloadUrlDto>(storageUrl);

            if (resp?.Url == null)
                throw new Exception("Не удалось получить ссылку на скачивание");

            return await _http.GetStreamAsync(resp.Url);
        }

        public async Task UploadFileAsync(Stream fileStream, string fileName, string jwtToken)
        {
            using var content = new MultipartFormDataContent();
            content.Add(new StreamContent(fileStream), "file", fileName);

            var request = new HttpRequestMessage(HttpMethod.Post, $"{BaseUrl}/api/v1/storage/upload")
            {
                Content = content
            };

            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", jwtToken);

            var response = await _http.SendAsync(request);
            response.EnsureSuccessStatusCode();
        }
    }
}
