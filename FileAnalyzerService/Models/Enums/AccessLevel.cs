namespace FileAnalyzerService.Models.Enums
{
    public enum AccessLevel//уровни доступа
    {
        Public = 1,             // Обычный доступ
        Requestable = 2,        // По заявке
        InternalOrganization = 3 // Внутри организации
    }
}
