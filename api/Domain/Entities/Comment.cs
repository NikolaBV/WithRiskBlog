namespace Domain.Entities;

public class Comment
{
    public Guid Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // Foreign Keys
    public string PostSlug { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    
    // Navigation Properties
    public User User { get; set; } = null!;
}


