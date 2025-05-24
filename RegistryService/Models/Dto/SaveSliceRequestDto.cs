namespace RegistryService.Models.Dto
{
    public class SaveSliceRequestDto
    {
        public string Name { get; set; } = null!;
        public string FileName { get; set; } = null!;
        public FileSliceRequest Request { get; set; } = null!;
    }
}
