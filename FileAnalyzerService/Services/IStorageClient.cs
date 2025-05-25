namespace FileAnalyzerService.Services
{
    public interface IStorageClient
    {
        Task<Stream> GetFileStreamAsync(string fileName);
        Task UploadFileAsync(Stream fileStream, string fileName, string jwtToken);
    }
}
