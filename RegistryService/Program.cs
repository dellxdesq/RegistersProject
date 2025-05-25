using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RegistryServiceProject.Data;
using RegistryServiceProject.Services;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using RegistryService.Services;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient<IStorageClient, StorageClient>();
builder.Services.AddHttpClient<IFileAnalyzerClient, FileAnalyzerClient>();
//builder.Services.AddHttpClient();
builder.Services.AddControllers();
builder.Services.AddScoped<RegistryServiceProject.Services.RegistryService>();

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

            //��������� ����� ������(�������� �� 1 ���)
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero //��� ���� �������� 5 ����� ����, � �������
        };
    });

builder.Services.AddAuthorization();

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5004); 
    options.ListenAnyIP(5005, listenOptions => 
    {
        listenOptions.UseHttps();
    });
});

// �������� ���� ������
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgreSQL")));

var app = builder.Build();

app.MapControllers();
app.Run();