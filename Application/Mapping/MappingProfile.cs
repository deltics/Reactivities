using System.Linq;
using Domain;
using Application.Activities;
using Application.Comments;
using Application.User;


namespace Application.Mapping
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            CreateMap<Activity, ActivityDto>();
            CreateMap<UserActivity, Attendee>()
                .ForMember(dest => dest.Username, o => o.MapFrom(src => src.AppUser.UserName))
                .ForMember(dest => dest.DisplayName, o => o.MapFrom(src => src.AppUser.DisplayName))
                .ForMember(dest => dest.Image, o => o.MapFrom(src => src.AppUser.Photos.SingleOrDefault(x => x.IsMain).Url))
                .ForMember(dest => dest.Following, o => o.MapFrom<FollowingAttendeeResolver>());

            CreateMap<AppUser, Profile>()
                .ForMember(dest => dest.Image, o => o.MapFrom(src => src.Photos.SingleOrDefault(x => x.IsMain).Url))
                .ForMember(dest => dest.FollowerCount, o => o.MapFrom(src => src.Followers.Count))
                .ForMember(dest => dest.FollowingCount, o => o.MapFrom(src => src.Following.Count))
                .ForMember(dest => dest.Following, o => o.MapFrom<FollowingProfileResolver>());

            CreateMap<AppUser, UserDto>()
                .ForMember(dest => dest.Username, o => o.MapFrom(src => src.UserName))
                .ForMember(dest => dest.Image, o => o.MapFrom(src => src.Photos.SingleOrDefault(x => x.IsMain).Url));
            
            CreateMap<Comment, CommentDto>()
                .ForMember(dest => dest.Username, o => o.MapFrom(src => src.Author.UserName))
                .ForMember(dest => dest.DisplayName, o => o.MapFrom(src => src.Author.DisplayName))
                .ForMember(dest => dest.Image, o => o.MapFrom(src => src.Author.Photos.SingleOrDefault(x => x.IsMain).Url));
        }
    }
}