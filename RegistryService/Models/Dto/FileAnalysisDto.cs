namespace RegistryService.Models.Dto
{
    public class FileAnalysisDto
    {
        public string FileName { get; set; } = "";
        public string Extension { get; set; } = "";
        public int RowsCount { get; set; }
    }
}
