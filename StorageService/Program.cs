using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using StorageService.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddScoped<MinioService>();

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
            //валидирую время токена
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero // убрал 5 минут поблажки
        };
    });

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5002);
    options.ListenAnyIP(5003, listenOptions => 
    {
        listenOptions.UseHttps();
    });
});

var app = builder.Build();

app.MapControllers();
app.Run();