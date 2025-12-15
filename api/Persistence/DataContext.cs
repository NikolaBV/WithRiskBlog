using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<Like> Likes { get; set; }
    public DbSet<View> Views { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // User configuration
        builder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.HasIndex(u => u.Email).IsUnique();
            entity.HasIndex(u => u.Username).IsUnique();
        });

        // Comment configuration
        builder.Entity<Comment>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.HasIndex(c => c.PostSlug);
            entity
                .HasOne(c => c.User)
                .WithMany(u => u.Comments)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Like configuration - unique constraint on PostSlug + UserId
        builder.Entity<Like>(entity =>
        {
            entity.HasKey(l => l.Id);
            entity.HasIndex(l => new { l.PostSlug, l.UserId }).IsUnique();
            entity
                .HasOne(l => l.User)
                .WithMany(u => u.Likes)
                .HasForeignKey(l => l.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // View configuration - unique constraint on PostSlug + UserId
        builder.Entity<View>(entity =>
        {
            entity.HasKey(v => v.Id);
            entity.HasIndex(v => new { v.PostSlug, v.UserId }).IsUnique();
            entity
                .HasOne(v => v.User)
                .WithMany(u => u.Views)
                .HasForeignKey(v => v.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}


