using RegistryService.Models.Dto;

namespace RegistryService.Services
{
    public interface IFileAnalyzerClient
    {
        Task<FileAnalysisDto?> AnalyzeFileAsync(string fileName);
    }
}
