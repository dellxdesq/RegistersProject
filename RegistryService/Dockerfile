FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 5002
EXPOSE 5003

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["RegistryService/RegistryService.csproj", "RegistryService/"]
RUN dotnet restore "RegistryService/RegistryService.csproj"
COPY . .
WORKDIR "/src/RegistryService"
RUN dotnet build "RegistryService.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "RegistryService.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "RegistryService.dll"]