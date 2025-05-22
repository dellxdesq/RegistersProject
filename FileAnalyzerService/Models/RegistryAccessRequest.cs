using FileAnalyzerService.Models.Enums;

namespace FileAnalyzerService.Models
{
    public class RegistryAccessRequest
    {
        public int Id { get; set; }
        public int RegistryId { get; set; }
        public int UserId { get; set; }
        public AccessRequestStatus Status { get; set; } = AccessRequestStatus.Pending;
        public DateTime RequestedAt { get; set; }
        public string? RejectReason { get; set; }
        public string? Message { get; set; }


        public Registry Registry { get; set; } = null!;
        public User User { get; set; } = null!;
    }
}
