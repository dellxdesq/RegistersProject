FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 5006
EXPOSE 5007

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["ExternalApiService/ExternalApiService.csproj", "ExternalApiService/"]
RUN dotnet restore "ExternalApiService/ExternalApiService.csproj"
COPY . .
WORKDIR "/src/ExternalApiService"
RUN dotnet build "ExternalApiService.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ExternalApiService.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ExternalApiService.dll"]