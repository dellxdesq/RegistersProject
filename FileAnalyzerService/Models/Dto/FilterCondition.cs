namespace FileAnalyzerService.Models.Dto
{
    public class FilterCondition
    {
        public string Column { get; set; } = default!;
        public string Op { get; set; } = "="; // =, >, <, etc.
        public string Value { get; set; } = default!;
    }
}
