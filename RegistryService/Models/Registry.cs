namespace RegistryServiceProject.Models
{//Модель реестра
    public class Registry
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
    }
}
