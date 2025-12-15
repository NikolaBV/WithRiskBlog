using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Posts;

public class GetStats
{
    public class Query : IRequest<Result<PostStatsDto>>
    {
        public string PostSlug { get; set; } = string.Empty;
    }

    public class Handler : IRequestHandler<Query, Result<PostStatsDto>>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;

        public Handler(DataContext context, IUserAccessor userAccessor)
        {
            _context = context;
            _userAccessor = userAccessor;
        }

        public async Task<Result<PostStatsDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var userId = _userAccessor.GetUserId();

            var likesCount = await _context.Likes
                .CountAsync(l => l.PostSlug == request.PostSlug, cancellationToken);

            var viewsCount = await _context.Views
                .CountAsync(v => v.PostSlug == request.PostSlug, cancellationToken);

            var isLikedByUser = userId != null && await _context.Likes
                .AnyAsync(l => l.PostSlug == request.PostSlug && l.UserId == userId, cancellationToken);

            return Result<PostStatsDto>.Success(new PostStatsDto
            {
                PostSlug = request.PostSlug,
                Likes = likesCount,
                Views = viewsCount,
                IsLikedByUser = isLikedByUser
            });
        }
    }
}


