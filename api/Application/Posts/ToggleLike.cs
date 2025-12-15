using Application.Core;
using Application.Interfaces;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Posts;

public class ToggleLike
{
    public class Command : IRequest<Result<Unit>>
    {
        public string PostSlug { get; set; } = string.Empty;
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;

        public Handler(DataContext context, IUserAccessor userAccessor)
        {
            _context = context;
            _userAccessor = userAccessor;
        }

        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var userId = _userAccessor.GetUserId();
            if (userId == null)
                return Result<Unit>.Failure("User not authenticated");

            var existingLike = await _context.Likes
                .FirstOrDefaultAsync(l => l.PostSlug == request.PostSlug && l.UserId == userId, cancellationToken);

            if (existingLike != null)
            {
                // Unlike
                _context.Likes.Remove(existingLike);
            }
            else
            {
                // Like
                var like = new Like
                {
                    Id = Guid.NewGuid(),
                    PostSlug = request.PostSlug,
                    UserId = userId.Value,
                    CreatedAt = DateTime.UtcNow
                };
                _context.Likes.Add(like);
            }

            var result = await _context.SaveChangesAsync(cancellationToken) > 0;

            return result
                ? Result<Unit>.Success(Unit.Value)
                : Result<Unit>.Failure("Failed to toggle like");
        }
    }
}


