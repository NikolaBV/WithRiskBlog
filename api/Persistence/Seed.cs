using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

public class Seed
{
    public static async Task SeedData(DataContext context)
    {
        // Only seed if there are no users
        if (await context.Users.AnyAsync()) return;

        var users = new List<User>
        {
            new User
            {
                Id = Guid.NewGuid(),
                Email = "demo@example.com",
                Username = "demo",
                // In real app, this would be hashed
                PasswordHash = "demo123",
                CreatedAt = DateTime.UtcNow
            }
        };

        await context.Users.AddRangeAsync(users);
        await context.SaveChangesAsync();
    }
}


