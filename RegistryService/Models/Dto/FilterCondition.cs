namespace RegistryService.Models.Dto
{
    public class FilterCondition
    {
        public string Column { get; set; } = null!;
        public string Op { get; set; } = "=";
        public string Value { get; set; } = null!;
    }
}
