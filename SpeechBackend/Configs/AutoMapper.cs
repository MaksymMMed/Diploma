using AutoMapper;
using SpeechBackend.DTO.Points;
using SpeechBackend.DTO.Users;
using SpeechBackend.Entities;
using System.Globalization;

namespace SpeechBackend.Configs
{
    public class AutoMapper:Profile
    {
        void UsersMap()
        {
            CreateMap<User, UserInfoDto>();
        }

        void PointsMap()
        {
            CreateMap<CreatePointsDto, Point>()
                .ForMember(dest => dest.Date, opt => opt.MapFrom(_ => DateTime.UtcNow));

            CreateMap<Point, ReadPointsDto>()
                 .ForMember(dest => dest.Date, opt => opt.MapFrom(src => src.Date.ToString("dd-MM-yyyy", CultureInfo.InvariantCulture)));
        }
        public AutoMapper() 
        {
            UsersMap();
            PointsMap();
        }
    }
}
