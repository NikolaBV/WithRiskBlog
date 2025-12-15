FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy api folder contents
COPY api/Blog.sln .
COPY api/API/API.csproj API/
COPY api/Application/Application.csproj Application/
COPY api/Domain/Domain.csproj Domain/
COPY api/Persistence/Persistence.csproj Persistence/

# Restore
RUN dotnet restore Blog.sln

# Copy source files
COPY api/API/ API/
COPY api/Application/ Application/
COPY api/Domain/ Domain/
COPY api/Persistence/ Persistence/

# Publish
RUN dotnet publish API/API.csproj -c Release -o /app/publish

# Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "API.dll"]

