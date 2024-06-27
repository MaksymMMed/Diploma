using SpeechBackend.DTO.Users;

namespace SpeechBackend.DTO.Points
{
    public class ReadPointsDto
    {
        public Guid Id { get; set; }
        //public Guid UserId { get; set; }
        //public UserInfoDto User { get; set; }
        public int Points { get; set; }
        public string Date { get; set; }
        //public string TextToSay { get; set; }
    }
}
