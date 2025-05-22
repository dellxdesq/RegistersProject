using FileAnalyzerService.Data;
using FileAnalyzerService.Models.Dto;
using System.Text.Json;
using System.Xml;
using ClosedXML.Excel;
using NPOI.HSSF.UserModel;

namespace FileAnalyzerService.Services
{
    public class FileAnalyzerService
    {


        private readonly HttpClient _http;
        //private readonly IConfiguration _config;
        private readonly AppDbContext _db;

        public FileAnalyzerService(AppDbContext db, HttpClient http, IConfiguration config)
        {
            _db = db;
            _http = http;
            //_config = config;
        }

        public async Task<FileAnalysisDto> AnalyzeAsync(string fileName)
        {
            var ext = Path.GetExtension(fileName).ToLowerInvariant().Trim('.');
            var storageUrl = $"http://localhost:5002/api/v1/storage/download-link/{fileName}";
            var resp = await _http.GetFromJsonAsync<DownloadUrlDto>(storageUrl);
            if (resp?.Url == null)
                throw new Exception("Не удалось получить ссылку на скачивание");

            var stream = await _http.GetStreamAsync(resp.Url);
            int rows = ext switch
            {
                "csv" => await CountCsvLinesAsync(stream),
                "json" => await CountJsonItemsAsync(stream),
                "xml" => await CountXmlRecordsAsync(stream),
                "xlsx" => CountXlsxRows(stream),
                "xls" => CountXlsRows(stream),
                _ => -1 // неизвестный или неподдерживаемый формат
            };

            return new FileAnalysisDto
            {
                FileName = fileName,
                Extension = ext,
                RowsCount = rows
            };
        }

        private async Task<int> CountCsvLinesAsync(Stream stream)
        {
            using var reader = new StreamReader(stream);
            int count = 0;
            while (await reader.ReadLineAsync() is not null) count++;
            return count > 0 ? count - 1 : 0;
        }

        private async Task<int> CountJsonItemsAsync(Stream stream)
        {
            using var reader = new StreamReader(stream);
            var content = await reader.ReadToEndAsync();
            var json = JsonDocument.Parse(content);
            return json.RootElement.ValueKind == JsonValueKind.Array
                ? json.RootElement.GetArrayLength()
                : 1;
        }

        private async Task<int> CountXmlRecordsAsync(Stream stream, string tagName = "record")
        {
            var xmlDoc = new XmlDocument();
            xmlDoc.Load(stream);
            return xmlDoc.GetElementsByTagName(tagName).Count;
        }

        private int CountXlsxRows(Stream stream)
        {
            using var workbook = new XLWorkbook(stream);
            var worksheet = workbook.Worksheets.First();
            return worksheet.LastRowUsed()?.RowNumber() - 1 ?? 0;
        }

        private int CountXlsRows(Stream stream)
        {
            var hssfWorkbook = new HSSFWorkbook(stream);
            var sheet = hssfWorkbook.GetSheetAt(0);
            return sheet.LastRowNum;
        }
    }
}
