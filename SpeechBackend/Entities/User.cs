using Microsoft.AspNetCore.Identity;

namespace SpeechBackend.Entities
{
    public class User:IdentityUser<Guid>
    {
        public virtual ICollection<Point> UserPoints { get; set; }
    }
}
