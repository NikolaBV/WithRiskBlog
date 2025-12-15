using Application.Comments;
using AutoMapper;
using Domain.Entities;

namespace Application.Core;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<Comment, CommentDto>()
            .ForMember(d => d.UserName, o => o.MapFrom(s => s.User.Username))
            .ForMember(d => d.UserImage, o => o.MapFrom(s => s.User.ProfileImage));
    }
}


