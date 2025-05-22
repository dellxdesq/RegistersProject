using FileAnalyzerService.Models;

namespace FileAnalyzerService.Models
{
    public class RegistrySliceRequest
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User Users { get; set; }

        public int RegistryId { get; set; }
        public Registry Registry { get; set; }

        public string FilterParameters { get; set; } // JSON или строка
        public DateTime RequestedAt { get; set; }
    }
}
