using FileAnalyzerService.Data;
using FileAnalyzerService.Models.Dto;
using System.Text.Json;
using System.Xml;
using ClosedXML.Excel;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using System.Xml.Linq;
using System.Net.Http.Headers;

namespace FileAnalyzerService.Services
{
    public class FileAnalyzerService
    {


        //private readonly HttpClient _http;
        private readonly IStorageClient _storageClient;
        //private readonly IConfiguration _config;
        private readonly AppDbContext _db;

        public FileAnalyzerService(AppDbContext db, /*HttpClient http,*/ IStorageClient storage/*IConfiguration config*/)
        {
            _db = db;
            _storageClient = storage; 
            //_http = http;
            //_config = config;
        }

        public async Task<FileAnalysisDto> AnalyzeAsync(string fileName)
        {
            var ext = Path.GetExtension(fileName).ToLowerInvariant().Trim('.');
            //var storageUrl = $"http://localhost:5002/api/v1/storage/download-link/{fileName}";
            //var resp = await _http.GetFromJsonAsync<DownloadUrlDto>(storageUrl);
            //if (resp?.Url == null)
            //    throw new Exception("Не удалось получить ссылку на скачивание");

            //var stream = await _http.GetStreamAsync(resp.Url);
            var stream = await _storageClient.GetFileStreamAsync(fileName);
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
            //var storageUrl = $"http://localhost:5002/api/v1/storage/download-link/{fileName}";
            //var resp = await _http.GetFromJsonAsync<DownloadUrlDto>(storageUrl);
            //if (resp?.Url == null)
            //    throw new Exception("Не удалось получить ссылку на скачивание");

            //var stream = await _http.GetStreamAsync(resp.Url);
            var stream = await _storageClient.GetFileStreamAsync(fileName);

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
            //var storageUrl = $"http://localhost:5002/api/v1/storage/download-link/{fileName}";
            //var resp = await _http.GetFromJsonAsync<DownloadUrlDto>(storageUrl);
            //if (resp?.Url == null)
            //    throw new Exception("Не удалось получить ссылку на скачивание");

            //var stream = await _http.GetStreamAsync(resp.Url);
            var stream = await _storageClient.GetFileStreamAsync(fileName);

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

        //public async Task<FileSliceResult> GetSliceAsync(string fileName, FileSliceRequest request)
        //{
        //    var extension = Path.GetExtension(fileName).ToLowerInvariant();

        //    switch (extension)
        //    {
        //        case ".csv":
        //            return await _csvProcessor.ApplySliceAsync(fileName, request);
        //        case ".xlsx":
        //        case ".xls":
        //            return await _excelProcessor.ApplySliceAsync(fileName, request);
        //        case ".json":
        //            return await _jsonProcessor.ApplySliceAsync(fileName, request);
        //        case ".xml":
        //            return await _xmlProcessor.ApplySliceAsync(fileName, request);
        //        default:
        //            throw new NotSupportedException($"Unsupported file format: {extension}");
        //    }
        //}
        public async Task ApplySliceAndSaveTempAsync(string fileName, FileSliceRequest request)
        {
            var result = await ApplySliceAsync(fileName, request);
            await SaveFileSliceToTempAsync(result);
        }

        public async Task<FileFullContentDto> ApplySliceAsync(string fileName, FileSliceRequest request)
        {
            var full = await GetFullContentAsync(fileName);
            var filteredRows = full.Rows;

            // 1. Фильтрация
            if (request.Filters != null && request.Filters.Any())
            {
                var colIndex = full.Columns
                    .Select((col, idx) => new { col, idx })
                    .ToDictionary(x => x.col, x => x.idx);

                foreach (var filter in request.Filters)
                {
                    if (!colIndex.TryGetValue(filter.Column, out var i)) continue;
                    filteredRows = filteredRows.Where(row =>
                    {
                        if (row.Count <= i) return false;
                        var cell = row[i];

                        if (!double.TryParse(cell, out var cellNum)) return cell == filter.Value;

                        if (!double.TryParse(filter.Value, out var filterNum)) return false;

                        return filter.Op switch
                        {
                            ">" => cellNum > filterNum,
                            "<" => cellNum < filterNum,
                            ">=" => cellNum >= filterNum,
                            "<=" => cellNum <= filterNum,
                            "!=" => cellNum != filterNum,
                            _ => cellNum == filterNum,
                        };
                    }).ToList();
                }
            }

            // 2. Выбор колонок
            if (request.Columns != null && request.Columns.Any())
            {
                var colIndexes = full.Columns
                    .Select((col, idx) => new { col, idx })
                    .Where(x => request.Columns.Contains(x.col))
                    .ToList();

                full.Columns = colIndexes.Select(x => x.col).ToList();
                filteredRows = filteredRows
                    .Select(row => colIndexes.Select(x => row[x.idx]).ToList())
                    .ToList();
            }

            // 3. Ограничение по количеству строк
            if (request.Limit.HasValue)
                filteredRows = filteredRows.Take(request.Limit.Value).ToList();

            return new FileFullContentDto
            {
                FileName = fileName,
                Extension = full.Extension,
                Columns = full.Columns,
                Rows = filteredRows
            };
        }

        //Сохраняет срез во временное хранилище
        public async Task SaveFileSliceToTempAsync(FileFullContentDto dto)
        {
            var tempDir = Path.Combine(Path.GetTempPath(), "file_slices");
            Directory.CreateDirectory(tempDir);

            var tempFilePath = Path.Combine(tempDir, $"{dto.FileName}_slice.{dto.Extension}");

            switch (dto.Extension.ToLower())
            {
                case "csv":
                    await SaveCsvAsync(dto, tempFilePath);
                    break;
                case "json":
                    await SaveJsonAsync(dto, tempFilePath);
                    break;
                case "xml":
                    await SaveXmlAsync(dto, tempFilePath);
                    break;
                case "xlsx":
                case "xls":
                    SaveExcel(dto, tempFilePath);
                    break;
                default:
                    throw new NotSupportedException($"Extension {dto.Extension} not supported.");
            }
        }

        private async Task SaveCsvAsync(FileFullContentDto dto, string path)
        {
            var csv = string.Join('\n', new[] { string.Join(",", dto.Columns) }
                .Concat(dto.Rows.Select(row => string.Join(",", row))));
            await File.WriteAllTextAsync(path, csv);
        }

        private async Task SaveJsonAsync(FileFullContentDto dto, string path)
        {
            var rowObjects = dto.Rows.Select(row =>
                dto.Columns.Select((col, i) => new { col, val = row[i] })
                           .ToDictionary(x => x.col, x => x.val));
            var json = JsonSerializer.Serialize(rowObjects, new JsonSerializerOptions { WriteIndented = true });
            await File.WriteAllTextAsync(path, json);
        }

        private async Task SaveXmlAsync(FileFullContentDto dto, string path)
        {
            var xmlDoc = new XDocument(
                new XElement("records",
                    dto.Rows.Select(row =>
                        new XElement("record",
                            dto.Columns.Select((col, i) =>
                                new XElement(col, row[i]))))));
            await File.WriteAllTextAsync(path, xmlDoc.ToString());
        }

        private void SaveExcel(FileFullContentDto dto, string path)
        {
            using var workbook = new XLWorkbook();
            var ws = workbook.Worksheets.Add("Slice");

            for (int i = 0; i < dto.Columns.Count; i++)
                ws.Cell(1, i + 1).Value = dto.Columns[i];

            for (int r = 0; r < dto.Rows.Count; r++)
                for (int c = 0; c < dto.Columns.Count; c++)
                    ws.Cell(r + 2, c + 1).Value = dto.Rows[r][c];

            workbook.SaveAs(path);
        }

        //Прочесть временный файл 
        public async Task<FileFullContentDto> GetSlicedTempContentAsync(string fileName)
        {
            string extension = fileName.Split('.')[1];
            var tempDir = Path.Combine(Path.GetTempPath(), "file_slices");
            var tempFilePath = Path.Combine(tempDir, $"{fileName}_slice.{extension}");

            return extension.ToLower() switch
            {
                "csv" => await ReadCsvSliceAsync(tempFilePath, fileName, extension),
                "json" => await ReadJsonSliceAsync(tempFilePath, fileName, extension),
                "xml" => await ReadXmlSliceAsync(tempFilePath, fileName, extension),
                "xlsx" or "xls" => ReadExcelSlice(tempFilePath, fileName, extension),
                _ => throw new NotSupportedException($"Extension {extension} not supported.")
            };
        }

        private async Task<FileFullContentDto> ReadCsvSliceAsync(string path, string fileName, string extension)
        {
            var lines = await File.ReadAllLinesAsync(path);
            var columns = lines.First().Split(',').ToList();
            var rows = lines.Skip(1).Select(line => line.Split(',').ToList()).ToList();

            return new FileFullContentDto
            {
                FileName = fileName,
                Extension = extension,
                Columns = columns,
                Rows = rows
            };
        }

        private async Task<FileFullContentDto> ReadJsonSliceAsync(string path, string fileName, string extension)
        {
            var json = await File.ReadAllTextAsync(path);
            var rowObjects = JsonSerializer.Deserialize<List<Dictionary<string, string>>>(json);

            var columns = rowObjects.First().Keys.ToList();
            var rows = rowObjects.Select(dict => columns.Select(col => dict[col]).ToList()).ToList();

            return new FileFullContentDto
            {
                FileName = fileName,
                Extension = extension,
                Columns = columns,
                Rows = rows
            };
        }

        private async Task<FileFullContentDto> ReadXmlSliceAsync(string path, string fileName, string extension)
        {
            var xdoc = await XDocument.LoadAsync(File.OpenRead(path), System.Xml.Linq.LoadOptions.None, CancellationToken.None);
            var records = xdoc.Root.Elements().ToList();
            var columns = records.First().Elements().Select(e => e.Name.LocalName).ToList();
            var rows = records.Select(r => r.Elements().Select(e => e.Value).ToList()).ToList();

            return new FileFullContentDto
            {
                FileName = fileName,
                Extension = extension,
                Columns = columns,
                Rows = rows
            };
        }

        private FileFullContentDto ReadExcelSlice(string path, string fileName, string extension)
        {
            using var workbook = new XLWorkbook(path);
            var ws = workbook.Worksheets.First();

            var columns = ws.Row(1).Cells().Select(c => c.GetString()).ToList();
            var rows = ws.RowsUsed().Skip(1).Select(row =>
                columns.Select((_, i) => row.Cell(i + 1).GetString()).ToList()).ToList();

            return new FileFullContentDto
            {
                FileName = fileName,
                Extension = extension,
                Columns = columns,
                Rows = rows
            };
        }

        public async Task UploadSliceToStorageServiceAsync(string fileName, string jwtToken)
        {
            var tempDir = Path.Combine(Path.GetTempPath(), "file_slices");

            var extensions = new[] { ".csv", ".json", ".xml", ".xlsx", ".xls" };
            var sliceFilePath = extensions
                .Select(ext => Path.Combine(tempDir, $"{fileName}_slice{ext}"))
                .FirstOrDefault(File.Exists);

            if (sliceFilePath == null)
                throw new FileNotFoundException("Slice file not found.");

            using var fileStream = File.OpenRead(sliceFilePath);
            await _storageClient.UploadFileAsync(fileStream, Path.GetFileName(sliceFilePath), jwtToken);
        }
    }
}
