using System;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;


namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DbSet<Activity> Activities { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Following> Follows { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<UserActivity> UserActivities { get; set; }


        public DataContext(DbContextOptions options)
            : base(options)
        {
        }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<UserActivity>(
                x => x.HasKey(ua => new {ua.AppUserId, ua.ActivityId})
            );
            builder.Entity<UserActivity>()
                .HasOne(ua => ua.AppUser)
                .WithMany(user => user.UserActivities)
                .HasForeignKey(u => u.AppUserId);

            builder.Entity<UserActivity>()
                .HasOne(ua => ua.Activity)
                .WithMany(activity => activity.UserActivities)
                .HasForeignKey(ua => ua.ActivityId);

            // This is why the '___Id' convention doesn't need to be followed (and indeed CAN'T be followed).
            //  The PK is explicitly defined and there are two FK references each to the same PK in the
            //  AppUser table (and we can't have two separate columns both called AppUserId!
            builder.Entity<Following>(
                entity =>
                {
                    entity.HasKey(key => new {key.ObserverId, key.TargetId});

                    entity.HasOne(following => following.Observer)
                        .WithMany(following => following.Following)
                        .HasForeignKey(following => following.ObserverId)
                        .OnDelete(DeleteBehavior.Restrict);

                    entity.HasOne(following => following.Target)
                        .WithMany(following => following.Followers)
                        .HasForeignKey(following => following.TargetId)
                        .OnDelete(DeleteBehavior.Restrict);
                });
        }
    }
}