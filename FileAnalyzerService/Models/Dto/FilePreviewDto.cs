namespace FileAnalyzerService.Models.Dto
{
    public class FilePreviewDto
    {
        public string FileName { get; set; } = default!;
        public string Extension { get; set; } = default!;
        public List<string> Columns { get; set; } = new();       
        public List<List<string>> FirstRows { get; set; } = new();
        public List<List<string>> LastRows { get; set; } = new();
    }
}
