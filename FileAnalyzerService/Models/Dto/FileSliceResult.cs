namespace FileAnalyzerService.Models.Dto
{
    public class FileSliceResult
    {
        public List<string> Columns { get; set; } = new();
        public List<Dictionary<string, object>> Data { get; set; } = new();
    }
}
