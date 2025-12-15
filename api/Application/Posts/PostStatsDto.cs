namespace Application.Posts;

public class PostStatsDto
{
    public string PostSlug { get; set; } = string.Empty;
    public int Likes { get; set; }
    public int Views { get; set; }
    public bool IsLikedByUser { get; set; }
}


