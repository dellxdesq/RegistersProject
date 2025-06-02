namespace RegistryService.Models.Dto
{
    public class FileSliceRequest
    {
        public List<string>? Columns { get; set; }
        public List<FilterCondition>? Filters { get; set; }
        public int? Limit { get; set; }
    }
}
