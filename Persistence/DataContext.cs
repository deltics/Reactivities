using System;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;


namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DbSet<Activity> Activities { get; set; }
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
        }
    }
}