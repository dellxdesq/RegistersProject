# Список сервисов
$services = @(
    "ApiGateway",
    "AuthService",
    "RegistryService",
    "StorageService",
    "ExternalApiService"
)

foreach ($service in $services) {
    Write-Host "🚀 Открытие окна для $service..." -ForegroundColor Cyan

    Start-Process powershell -ArgumentList @(
        "-NoExit",
        "-Command",
        "cd `"$PWD\$service`"; dotnet run --launch-profile https"
    )
    
    Start-Sleep -Seconds 2  # Небольшая пауза между запусками
}

