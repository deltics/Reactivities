using AutoMapper;
using Domain;


namespace Application.Activities
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Activity, ActivityDto>();
            CreateMap<UserActivity, AttendeeDto>()
                .ForMember(dest => dest.Username, o => o.MapFrom(src => src.AppUser.UserName))
                .ForMember(dest => dest.DisplayName, o => o.MapFrom(src => src.AppUser.DisplayName));
        }
    }
}