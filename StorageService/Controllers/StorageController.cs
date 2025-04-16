using Microsoft.AspNetCore.Mvc;
using StorageService.Services;

namespace StorageService.Controllers
{
    [ApiController]
    [Route("/api/v1/storage")]
    public class StorageController : ControllerBase
    {
        private readonly MinioService _minioService;

        public StorageController(MinioService minioService)
        {
            _minioService = minioService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            await _minioService.UploadFileAsync(file);
            return Ok(new { Message = "File uploaded successfully" });
        }

        [HttpGet("download/{objectName}")]
        public async Task<IActionResult> Download(string objectName)
        {
            var stream = await _minioService.DownloadFileAsync(objectName);
            return File(stream, "application/octet-stream", objectName);
        }
    }
}
