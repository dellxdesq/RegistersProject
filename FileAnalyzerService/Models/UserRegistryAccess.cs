using FileAnalyzerService.Models.Enums;
using FileAnalyzerService.Models;

namespace FileAnalyzerService.Models
{//таблица связей пользователей и реестров
    public class UserRegistryAccess
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public int RegistryId { get; set; }
        public Registry Registry { get; set; }

        public AccessLevel AccessLevel { get; set; }

        public bool IsApproved { get; set; } // для персонального доступа
        public DateTime GrantedAt { get; set; }
    }
}
