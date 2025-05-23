using FileAnalyzerService.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FileAnalyzerService.Controllers
{
    [ApiController]
    [Route("/api/v1/file-preview")]
    public class FileAnalyzerController : ControllerBase
    {
        private readonly Services.FileAnalyzerService _fileAnalyzerService;

        public FileAnalyzerController(Services.FileAnalyzerService fileAnalyzerService)
        {
            _fileAnalyzerService = fileAnalyzerService ?? throw new ArgumentNullException(nameof(fileAnalyzerService));
        }

        [HttpGet("{fileName}")]
        public async Task<IActionResult> Analyze(string fileName)
        {
            var result = await _fileAnalyzerService.AnalyzeAsync(fileName);
            return Ok(result);
        }

        [HttpGet("{fileName}/preview")]
        public async Task<IActionResult> Preview(string fileName)
        {
            var result = await _fileAnalyzerService.GetPreviewAsync(fileName);
            return Ok(result);
        }

        [HttpGet("{fileName}/full")]
        public async Task<IActionResult> FullContent(string fileName)
        {
            var result = await _fileAnalyzerService.GetFullContentAsync(fileName);
            return Ok(result);
        }
    }
}
