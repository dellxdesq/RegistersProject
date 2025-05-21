using Minio;
using Minio.DataModel.Args;

namespace StorageService.Services
{
    public class MinioService
    {
        private readonly MinioClient _minio;
        private readonly string _bucketName;
        private readonly ILogger<MinioService> _logger;

        public MinioService(IConfiguration config, ILogger<MinioService> logger)
        {
            _minio = (MinioClient?)new MinioClient()
                .WithEndpoint(config["MinIO:Endpoint"] ?? throw new ArgumentNullException())
                .WithCredentials(
                    config["MinIO:AccessKey"] ?? throw new ArgumentNullException(),
                    config["MinIO:SecretKey"] ?? throw new ArgumentNullException())
                .Build();
            _bucketName = config["MinIO:BucketName"] ?? throw new ArgumentNullException();
            _logger = logger;
        }

        public async Task<string> UploadFileAsync(IFormFile file)
        {
            var beArgs = new BucketExistsArgs().WithBucket(_bucketName);
            var exist = await _minio.BucketExistsAsync(beArgs);

            if (!exist)
            {
                var mbArgs = new MakeBucketArgs().WithBucket(_bucketName);
                await _minio.MakeBucketAsync(mbArgs);
            }

            var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";

            var poArgs = new PutObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(uniqueFileName)
                .WithStreamData(file.OpenReadStream())
                .WithObjectSize(file.Length);

            await _minio.PutObjectAsync(poArgs);
            return uniqueFileName;
        }

        //public async Task<Stream> DownloadFileAsync(string objectName)
        //{
        //    var stream = new MemoryStream();
        //    var args = new GetObjectArgs()
        //        .WithBucket(_bucketName)
        //        .WithObject(objectName)
        //        .WithCallbackStream(data => data.CopyTo(stream));

        //    await _minio.GetObjectAsync(args);
        //    stream.Position = 0;
        //    return stream;
        //}

        //отдаёт ссылку на скачивание
        public async Task<string> GetPresignedDownloadUrlAsync(string objectName, int expireSeconds = 60)
        {
            var args = new PresignedGetObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(objectName)
                .WithExpiry(expireSeconds);

            return await _minio.PresignedGetObjectAsync(args);
        }
    }
}