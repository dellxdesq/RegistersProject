using RegistryService.Models;

namespace RegistryService.Models
{//метаданные реестра
    public class RegistryMeta
    {
        public int Id { get; set; }

        public int RegistryId { get; set; }
        public Registry Registry { get; set; }

        public string FileFormat { get; set; } = string.Empty;
        public string Organization { get; set; } = string.Empty;
        public int RowsCount { get; set; }

        public string? FileName { get; set; } // имя файла в MinIO
    }
}
