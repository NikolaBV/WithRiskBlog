using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments;

public class Create
{
    public class Command : IRequest<Result<CommentDto>>
    {
        public string PostSlug { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? AuthorName { get; set; } // For anonymous comments
    }

    public class CommandValidator : AbstractValidator<Command>
    {
        public CommandValidator()
        {
            RuleFor(x => x.PostSlug).NotEmpty();
            RuleFor(x => x.Content).NotEmpty().MaximumLength(1000);
        }
    }

    public class Handler : IRequestHandler<Command, Result<CommentDto>>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IUserAccessor _userAccessor;

        public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
        {
            _context = context;
            _mapper = mapper;
            _userAccessor = userAccessor;
        }

        public async Task<Result<CommentDto>> Handle(Command request, CancellationToken cancellationToken)
        {
            var userId = _userAccessor.GetUserId();
            User? user = null;

            if (userId != null)
            {
                user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
            }

            // If no authenticated user, get or create an anonymous user
            if (user == null)
            {
                var authorName = string.IsNullOrWhiteSpace(request.AuthorName) 
                    ? "Anonymous" 
                    : request.AuthorName.Trim();

                // Use a consistent anonymous user for simplicity
                user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Username == "anonymous", cancellationToken);

                if (user == null)
                {
                    user = new User
                    {
                        Id = Guid.NewGuid(),
                        Email = "anonymous@blog.local",
                        Username = "anonymous",
                        PasswordHash = "",
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.Users.Add(user);
                    await _context.SaveChangesAsync(cancellationToken);
                }
            }

            var comment = new Comment
            {
                Id = Guid.NewGuid(),
                Content = request.Content,
                PostSlug = request.PostSlug,
                UserId = user.Id,
                User = user,
                CreatedAt = DateTime.UtcNow
            };

            _context.Comments.Add(comment);
            var result = await _context.SaveChangesAsync(cancellationToken) > 0;

            if (!result)
                return Result<CommentDto>.Failure("Failed to create comment");

            // Return with the display name
            var dto = _mapper.Map<CommentDto>(comment);
            if (!string.IsNullOrWhiteSpace(request.AuthorName))
                dto.UserName = request.AuthorName.Trim();
            
            return Result<CommentDto>.Success(dto);
        }
    }
}

