using FileAnalyzerService.Data;
using FileAnalyzerService.Models.Dto;
using System.Text.Json;
using System.Xml;
using ClosedXML.Excel;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;

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

        public async Task<FilePreviewDto> GetPreviewAsync(string fileName)
        {
            var ext = Path.GetExtension(fileName).ToLowerInvariant().Trim('.');
            var storageUrl = $"http://localhost:5002/api/v1/storage/download-link/{fileName}";
            var resp = await _http.GetFromJsonAsync<DownloadUrlDto>(storageUrl);
            if (resp?.Url == null)
                throw new Exception("Не удалось получить ссылку на скачивание");

            var stream = await _http.GetStreamAsync(resp.Url);

            (List<string> columns, List<List<string>> first, List<List<string>> last) = ext switch
            {
                "csv" => await PreviewCsvAsync(stream),
                "json" => await PreviewJsonAsync(stream),
                "xml" => await PreviewXmlAsync(stream),
                "xlsx" => PreviewXlsx(stream),
                "xls" => PreviewXls(stream),
                _ => (new List<string> { "Unsupported format" }, new(), new())
            };

            return new FilePreviewDto
            {
                FileName = fileName,
                Extension = ext,
                Columns = columns,
                FirstRows = first,
                LastRows = last
            };
        }

        private async Task<(List<string> columns, List<List<string>> first, List<List<string>> last)> PreviewCsvAsync(Stream stream)
        {
            using var reader = new StreamReader(stream);
            var lines = new List<string>();
            while (!reader.EndOfStream)
            {
                var line = await reader.ReadLineAsync();
                if (line != null) lines.Add(line);
            }

            var parsed = lines.Select(l => l.Split(',').Select(s => s.Trim()).ToList()).ToList();

            var columns = parsed.FirstOrDefault() ?? new List<string>();
            var dataRows = parsed.Skip(1).ToList();
            var first = dataRows.Take(5).ToList();
            var last = dataRows.Skip(Math.Max(0, dataRows.Count - 5)).ToList();

            return (columns, first, last);
        }

        private async Task<(List<string> columns, List<List<string>> first, List<List<string>> last)> PreviewJsonAsync(Stream stream)
        {
            using var reader = new StreamReader(stream);
            var content = await reader.ReadToEndAsync();
            var json = JsonDocument.Parse(content);

            if (json.RootElement.ValueKind != JsonValueKind.Array)
            {
                return (
                    new List<string> { "Value" },
                    new List<List<string>> { new() { json.RootElement.ToString() } },
                    new List<List<string>>()
                );
            }

            var elements = json.RootElement.EnumerateArray().ToList();

            var allProps = elements
                .SelectMany(el => el.EnumerateObject().Select(p => p.Name))
                .Distinct()
                .ToList();

            List<string> ExtractRow(JsonElement el) =>
                allProps.Select(p => el.TryGetProperty(p, out var val) ? val.ToString() : "").ToList();

            var first = elements.Take(5).Select(ExtractRow).ToList();
            var last = elements.Skip(Math.Max(0, elements.Count - 5)).Select(ExtractRow).ToList();

            return (allProps, first, last);
        }

        private async Task<(List<string> columns, List<List<string>> first, List<List<string>> last)> PreviewXmlAsync(Stream stream, string tagName = "record")
        {
            var doc = new XmlDocument();
            doc.Load(stream);
            var records = doc.GetElementsByTagName(tagName).Cast<XmlNode>().ToList();

            var allProps = records
                .SelectMany(n => n.ChildNodes.Cast<XmlNode>().Select(c => c.Name))
                .Distinct()
                .ToList();

            List<string> ExtractRow(XmlNode node) =>
                allProps.Select(name =>
                    node.SelectSingleNode(name)?.InnerText ?? "").ToList();

            var first = records.Take(5).Select(ExtractRow).ToList();
            var last = records.Skip(Math.Max(0, records.Count - 5)).Select(ExtractRow).ToList();

            return (allProps, first, last);
        }

        private (List<string> columns, List<List<string>> first, List<List<string>> last) PreviewXlsx(Stream stream)
        {
            using var workbook = new XLWorkbook(stream);
            var ws = workbook.Worksheets.First();
            var rows = ws.RowsUsed().ToList();

            var headerRow = rows.FirstOrDefault();
            var dataRows = rows.Skip(1).ToList();

            List<string> RowToString(IXLRow row) =>
                row.Cells().Select(c => c.GetValue<string>()).ToList();

            var columns = headerRow != null ? RowToString(headerRow) : new List<string>();
            var first = dataRows.Take(5).Select(RowToString).ToList();
            var last = dataRows.Skip(Math.Max(0, dataRows.Count - 5)).Select(RowToString).ToList();

            return (columns, first, last);
        }

        private (List<string> columns, List<List<string>> first, List<List<string>> last) PreviewXls(Stream stream)
        {
            var hssf = new HSSFWorkbook(stream);
            var sheet = hssf.GetSheetAt(0);

            var rows = new List<IRow>();
            for (int i = 0; i <= sheet.LastRowNum; i++)
            {
                var row = sheet.GetRow(i);
                if (row != null)
                    rows.Add(row);
            }

            var headerRow = rows.FirstOrDefault();
            var dataRows = rows.Skip(1).ToList();

            List<string> RowToString(IRow row) =>
                row.Cells.Select(c => c.ToString()).ToList();

            var columns = headerRow != null ? RowToString(headerRow) : new List<string>();
            var first = dataRows.Take(5).Select(RowToString).ToList();
            var last = dataRows.Skip(Math.Max(0, dataRows.Count - 5)).Select(RowToString).ToList();

            return (columns, first, last);
        }

        public async Task<FileFullContentDto> GetFullContentAsync(string fileName)
        {
            var ext = Path.GetExtension(fileName).ToLowerInvariant().Trim('.');
            var storageUrl = $"http://localhost:5002/api/v1/storage/download-link/{fileName}";
            var resp = await _http.GetFromJsonAsync<DownloadUrlDto>(storageUrl);
            if (resp?.Url == null)
                throw new Exception("Не удалось получить ссылку на скачивание");

            var stream = await _http.GetStreamAsync(resp.Url);

            (List<string> columns, List<List<string>> rows) = ext switch
            {
                "csv" => await FullCsvAsync(stream),
                "json" => await FullJsonAsync(stream),
                "xml" => await FullXmlAsync(stream),
                "xlsx" => FullXlsx(stream),
                "xls" => FullXls(stream),
                _ => (new List<string> { "Формат не поддерживатся" }, new())
            };

            return new FileFullContentDto
            {
                FileName = fileName,
                Extension = ext,
                Columns = columns,
                Rows = rows
            };
        }

        private async Task<(List<string> columns, List<List<string>> rows)> FullCsvAsync(Stream stream)
        {
            using var reader = new StreamReader(stream);
            var lines = new List<string>();
            while (!reader.EndOfStream)
            {
                var line = await reader.ReadLineAsync();
                if (line != null) lines.Add(line);
            }

            var parsed = lines.Select(l => l.Split(',').Select(s => s.Trim()).ToList()).ToList();
            var columns = parsed.FirstOrDefault() ?? new();
            var rows = parsed.Skip(1).ToList();
            return (columns, rows);
        }

        private async Task<(List<string> columns, List<List<string>> rows)> FullJsonAsync(Stream stream)
        {
            using var reader = new StreamReader(stream);
            var content = await reader.ReadToEndAsync();
            var json = JsonDocument.Parse(content);

            if (json.RootElement.ValueKind != JsonValueKind.Array)
            {
                return (new List<string> { "Value" }, new List<List<string>> { new() { json.RootElement.ToString() } });
            }

            var elements = json.RootElement.EnumerateArray().ToList();

            var allProps = elements
                .SelectMany(el => el.EnumerateObject().Select(p => p.Name))
                .Distinct()
                .ToList();

            List<string> ExtractRow(JsonElement el) =>
                allProps.Select(p => el.TryGetProperty(p, out var val) ? val.ToString() : "").ToList();

            var rows = elements.Select(ExtractRow).ToList();
            return (allProps, rows);
        }

        private async Task<(List<string> columns, List<List<string>> rows)> FullXmlAsync(Stream stream, string tagName = "record")
        {
            var doc = new XmlDocument();
            doc.Load(stream);
            var records = doc.GetElementsByTagName(tagName).Cast<XmlNode>().ToList();

            var allProps = records
                .SelectMany(n => n.ChildNodes.Cast<XmlNode>().Select(c => c.Name))
                .Distinct()
                .ToList();

            List<string> ExtractRow(XmlNode node) =>
                allProps.Select(name => node.SelectSingleNode(name)?.InnerText ?? "").ToList();

            var rows = records.Select(ExtractRow).ToList();
            return (allProps, rows);
        }

        private (List<string> columns, List<List<string>> rows) FullXlsx(Stream stream)
        {
            using var workbook = new XLWorkbook(stream);
            var ws = workbook.Worksheets.First();
            var rows = ws.RowsUsed().ToList();

            var headerRow = rows.FirstOrDefault();
            var dataRows = rows.Skip(1).ToList();

            List<string> RowToString(IXLRow row) =>
                row.Cells().Select(c => c.GetValue<string>()).ToList();

            var columns = headerRow != null ? RowToString(headerRow) : new();
            var allRows = dataRows.Select(RowToString).ToList();
            return (columns, allRows);
        }

        private (List<string> columns, List<List<string>> rows) FullXls(Stream stream)
        {
            var hssf = new HSSFWorkbook(stream);
            var sheet = hssf.GetSheetAt(0);

            var rows = new List<IRow>();
            for (int i = 0; i <= sheet.LastRowNum; i++)
            {
                var row = sheet.GetRow(i);
                if (row != null)
                    rows.Add(row);
            }

            var headerRow = rows.FirstOrDefault();
            var dataRows = rows.Skip(1).ToList();

            List<string> RowToString(IRow row) =>
                row.Cells.Select(c => c.ToString()).ToList();

            var columns = headerRow != null ? RowToString(headerRow) : new();
            var allRows = dataRows.Select(RowToString).ToList();
            return (columns, allRows);
        }
    }
}
