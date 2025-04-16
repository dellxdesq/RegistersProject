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

// �������
builder.Services.AddControllers();
builder.Services.AddHttpContextAccessor();
builder.Services.AddLogging();
builder.Services.AddOpenApi();
builder.Services.AddScoped<ExternalApiService>();
builder.Services.AddScoped<RegistryService>();
builder.Services.AddScoped<MinioService>();

// HTTP-�������
builder.Services.AddHttpClient<AuthHttpClient>(client =>
{
    client.BaseAddress = new Uri("http://auth-service/");
});

// �������������� (���� ����� AddJwtBearer)
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

            // ���������� ���������
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

// �������� ���� ������
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgreSQL")));

// HTTPS
builder.WebHost.ConfigureKestrel(options => {
    options.ListenLocalhost(8081, listenOptions => {
        listenOptions.UseHttps();
    });
});

var app = builder.Build();

// ������������� ��
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