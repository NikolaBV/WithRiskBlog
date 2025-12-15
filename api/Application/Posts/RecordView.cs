using Application.Core;
using Application.Interfaces;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Posts;

public class RecordView
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
                return Result<Unit>.Success(Unit.Value); // Anonymous views are ok, just don't track

            var existingView = await _context.Views
                .FirstOrDefaultAsync(v => v.PostSlug == request.PostSlug && v.UserId == userId, cancellationToken);

            if (existingView != null)
            {
                // Update last view time
                existingView.LastViewAt = DateTime.UtcNow;
            }
            else
            {
                // Record new view
                var view = new View
                {
                    Id = Guid.NewGuid(),
                    PostSlug = request.PostSlug,
                    UserId = userId.Value,
                    CreatedAt = DateTime.UtcNow,
                    LastViewAt = DateTime.UtcNow
                };
                _context.Views.Add(view);
            }

            await _context.SaveChangesAsync(cancellationToken);
            return Result<Unit>.Success(Unit.Value);
        }
    }
}


