namespace RegistryService.Models
{
    public class RegistrySlice
    {
        public int Id { get; set; }
        public int RegistryId { get; set; }
        public string Name { get; set; } = null!;
        public string FileName { get; set; } = null!;
        public string SliceDefinitionJson { get; set; } = null!; // сериализованный FileSliceRequest
    }
}
