namespace RegistryService.Models.Dto
{
    public class CreateRegistryVersionRequest
    {
        public string Description { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
    }
}
