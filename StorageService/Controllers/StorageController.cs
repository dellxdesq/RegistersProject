using Microsoft.AspNetCore.Authorization;
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
        [Authorize]
        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            var fileName = await _minioService.UploadFileAsync(file);
            return Ok(new { Message = "Файл успешно загружен", FileName = fileName });
        }

        [HttpGet("download-link/{objectName}")]
        public async Task<IActionResult> GetPresignedUrl(string objectName)
        {
            var url = await _minioService.GetPresignedDownloadUrlAsync(objectName);
            return Ok(new { Url = url });
        }
    }
}
