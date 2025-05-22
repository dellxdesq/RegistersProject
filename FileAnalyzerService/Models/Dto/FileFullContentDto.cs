namespace FileAnalyzerService.Models.Dto
{
    public class FileFullContentDto
    {
        public string FileName { get; set; } = "";
        public string Extension { get; set; } = "";
        public List<string> Columns { get; set; } = new();
        public List<List<string>> Rows { get; set; } = new();
    }
}
