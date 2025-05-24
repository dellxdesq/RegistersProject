namespace FileAnalyzerService.Models.Dto
{
    //public class FileSliceRequest
    //{
    //    public List<string>? Columns { get; set; } // какие колонки читать
    //    public Dictionary<string, string>? Filters { get; set; } // какие применять фильтры, вида "Column" -> "Value"
    //    public int? Limit { get; set; } // сколько строк вернуть
    //}
    public class FileSliceRequest
    {
        public List<string>? Columns { get; set; }
        public List<FilterCondition>? Filters { get; set; }
        public int? Limit { get; set; }
    }
}
