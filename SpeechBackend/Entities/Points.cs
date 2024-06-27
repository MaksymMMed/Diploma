namespace SpeechBackend.Entities
{
    public class Point
    {
        public Guid Id { get; set; }
        public int Points { get; set; }
        public DateTime Date { get; set; }
        public Guid UserId { get; set; }   
        public User User { get; set; }
        public string TextToSay { get; set; }
    }
}
