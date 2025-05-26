using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using FileAnalyzerService.Data;
using FileAnalyzerService.Services;
using System.Text;
using System.IdentityModel.Tokens.Jwt;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient<IStorageClient, StorageClient>();
//builder.Services.AddHttpClient<FileAnalyzerService.Services.FileAnalyzerService>();
builder.Services.AddControllers();
builder.Services.AddScoped<FileAnalyzerService.Services.FileAnalyzerService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
        Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),

            ValidateIssuer = false,
            ValidateAudience = false,

            //валидирую время токена(настроил на 1 час)
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero //тут типо поблажка 5 минут была, её обнулил
        };
    });

builder.Services.AddAuthorization();

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5008);
    options.ListenAnyIP(5009, listenOptions =>
    {
        listenOptions.UseHttps();
    });
});

// Контекст базы данных
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgreSQL")));

var app = builder.Build();

app.MapControllers();
app.Run();
