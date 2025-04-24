using RegistryService.Models.Enums;

namespace RegistryServiceProject.Models.Dto
{
    public class CreateRegistryRequest
    {
        public required string Name { get; set; }
        public required string Description { get; set; }
        public required string FileFormat { get; set; }
        public required string Organization { get; set; }
        public int RowsCount { get; set; }
        public AccessLevel DefaultAccessLevel { get; set; }
    }
}
