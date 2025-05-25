using RegistryService.Models.Dto;
using System.Net.Http.Headers;

namespace RegistryService.Services
{
    public class FileAnalyzerClient : IFileAnalyzerClient
    {
        private readonly HttpClient _http;
        private const string BaseUrl = "http://localhost:5008/api/v1/file-preview";

        public FileAnalyzerClient(HttpClient http)
        {
            _http = http;
        }

        public async Task<FileAnalysisDto?> AnalyzeFileAsync(string fileName)
        {
            var url = $"{BaseUrl}/{fileName}";
            return await _http.GetFromJsonAsync<FileAnalysisDto>(url);
        }

    }
}
