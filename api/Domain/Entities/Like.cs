namespace Domain.Entities;

public class Like
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Foreign Keys
    public string PostSlug { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    
    // Navigation Properties
    public User User { get; set; } = null!;
}


