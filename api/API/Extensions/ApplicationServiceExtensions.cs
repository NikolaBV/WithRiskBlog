using Application.Comments;
using Application.Core;
using Application.Interfaces;
using API.Services;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Extensions;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services,
        IConfiguration config
    )
    {
        // Swagger
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();

        // Database - PostgreSQL for production
        services.AddDbContext<DataContext>(opt =>
        {
            opt.UseNpgsql(config.GetConnectionString("DefaultConnection"));
        });

        // CORS - Allow Astro frontend (local and production)
        services.AddCors(opt =>
        {
            opt.AddPolicy("CorsPolicy", policy =>
            {
                policy
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .WithOrigins(
                        "http://localhost:4321",           // Astro dev server
                        "http://localhost:3000",           // Alternative port
                        "https://withrisk.netlify.app"     // Netlify production
                    );
            });
        });

        // MediatR for CQRS
        services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssembly(typeof(List.Handler).Assembly)
        );

        // AutoMapper
        services.AddAutoMapper(typeof(MappingProfiles).Assembly);

        // FluentValidation
        services.AddFluentValidationAutoValidation();
        services.AddValidatorsFromAssemblyContaining<Create>();

        // Services
        services.AddHttpContextAccessor();
        services.AddScoped<IUserAccessor, UserAccessor>();

        return services;
    }
}


