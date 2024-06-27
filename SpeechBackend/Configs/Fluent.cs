using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SpeechBackend.Entities;

namespace SpeechBackend.Configs
{
    public class PointConfig : IEntityTypeConfiguration<Point>
    {
        public void Configure(EntityTypeBuilder<Point> builder)
        {
            builder.HasKey(x => x.Id);

            builder.HasOne(x => x.User)
                .WithMany(x => x.UserPoints)
                .HasForeignKey(x => x.UserId)
                .HasConstraintName("PointUserFK");
        }
    }

    public class UserConfig : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(x => x.Id);

            builder.HasMany(x=>x.UserPoints)
                .WithOne(x => x.User)
                .HasForeignKey(x => x.UserId)
                .HasConstraintName("UserPointFK");
        }
    }
}
