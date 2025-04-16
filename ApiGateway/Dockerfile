FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["ApiGAteway/ApiGAteway.csproj", "ApiGAteway/"]
RUN dotnet restore "ApiGAteway/ApiGAteway.csproj"
COPY . .
WORKDIR "/src/ApiGAteway"
RUN dotnet build "ApiGAteway.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ApiGAteway.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ApiGAteway.dll"]