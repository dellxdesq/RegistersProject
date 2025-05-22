@echo off
setlocal

:: Путь к текущей папке (корень проекта)
set ROOT=%~dp0

:: Запуск MinIO (docker-compose) из StorageService
echo Запуск docker-compose (MinIO)...
cd /d "%ROOT%StorageService"
start cmd /k "docker-compose up"

:: Запуск AuthService
echo Запуск AuthService...
cd /d "%ROOT%AuthService"
start cmd /k "dotnet run --launch-profile https"

:: Запуск ExternalApiService
echo Запуск ExternalApiService...
cd /d "%ROOT%ExternalApiService"
start cmd /k "dotnet run --launch-profile https"

:: Запуск FileAnalyzerService
echo Запуск FileAnalyzerService...
cd /d "%ROOT%FileAnalyzerService"
start cmd /k "dotnet run --launch-profile https"

:: Запуск RegistryService
echo Запуск RegistryService...
cd /d "%ROOT%RegistryService"
start cmd /k "dotnet run --launch-profile https"

:: Запуск StorageService
echo Запуск StorageService...
cd /d "%ROOT%StorageService"
start cmd /k "dotnet run --launch-profile https"

:: Запуск ApiGateway
echo Запуск ApiGateway...
cd /d "%ROOT%ApiGateway"
start cmd /k "dotnet run --launch-profile https"

:: Запуск фронтенда
echo Запуск Frontend (npm start)...
cd /d "%ROOT%Frontend"
start cmd /k "npm start"

echo Все сервисы запущены!
endlocal