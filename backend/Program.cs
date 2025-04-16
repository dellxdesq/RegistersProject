using backend.Data;
using backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Npgsql;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Сервисы
builder.Services.AddControllers();
builder.Services.AddHttpContextAccessor();
builder.Services.AddLogging();
builder.Services.AddOpenApi();
builder.Services.AddScoped<ExternalApiService>();
builder.Services.AddScoped<RegistryService>();
builder.Services.AddScoped<MinioService>();

// HTTP-клиенты
builder.Services.AddHttpClient<AuthHttpClient>(client =>
{
    client.BaseAddress = new Uri("http://auth-service/");
});

// Аутентификация (ОДИН вызов AddJwtBearer)
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
            ValidateLifetime = true,

            // синхронная валидация
            SignatureValidator = (token, _) =>
            {
                using var scope = builder.Services.BuildServiceProvider().CreateScope();
                var authClient = scope.ServiceProvider.GetRequiredService<AuthHttpClient>();
                return authClient.ValidateToken(token)
                    ? new JwtSecurityToken(token)
                    : null;
            }
        };
    });

builder.Services.AddAuthorization();

// Контекст базы данных
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgreSQL")));

// HTTPS
builder.WebHost.ConfigureKestrel(options => {
    options.ListenLocalhost(8081, listenOptions => {
        listenOptions.UseHttps();
    });
});

var app = builder.Build();

// Инициализация БД
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

// middleware
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Use(async (context, next) =>
{
    try
    {
        await next(context);
    }
    catch (Exception ex)
    {
        context.Response.StatusCode = 500;
        await context.Response.WriteAsync(ex.Message);
    }
});

app.Run();