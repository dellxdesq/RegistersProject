namespace RegistryService.Models.Dto
{
    //public class FileSliceRequest
    //{
    //    public List<string>? SelectedColumns { get; set; } // какие колонки оставить
    //    public Dictionary<string, string>? Filters { get; set; } // ключ = имя колонки, значение = фильтр (например, ">=100", "==ABC")
    //    public int? Limit { get; set; }
    //}

    public class FileSliceRequest
    {
        public List<string>? Columns { get; set; }
        public List<FilterCondition>? Filters { get; set; }
        public int? Limit { get; set; }
    }
}
