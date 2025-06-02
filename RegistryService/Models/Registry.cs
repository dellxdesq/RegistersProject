using RegistryService.Models;
using RegistryService.Models.Enums;

namespace RegistryService.Models
{//Модель реестра
    public class Registry
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public RegistryMeta? Meta { get; set; }
        public AccessLevel DefaultAccessLevel { get; set; }
        public int CreatedByUserId { get; set; }
        public List<RegistrySlice> Slices { get; set; } = new();
        public List<UserRegistryAccess> Accesses { get; set; } = new();
    }
}