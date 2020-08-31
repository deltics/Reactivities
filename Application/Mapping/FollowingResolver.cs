using System.Linq;
using Application.Activities;
using Application.Interfaces;
using AutoMapper;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Profile = Application.User.Profile;


namespace Application.Mapping
{
    public class FollowingAttendeeResolver : IValueResolver<UserActivity, Attendee, bool>
    {
        private readonly DataContext _context;
        private readonly ICurrentUser _currentUser;

        public FollowingAttendeeResolver(DataContext context, ICurrentUser currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }
        
        
        public bool Resolve(UserActivity source, Attendee destination, bool destMember, ResolutionContext context)
        {
            var currentUser = _context.Users.SingleOrDefaultAsync(u => u.UserName == _currentUser.Username()).Result;

            return currentUser.Following.Any(f => f.TargetId == source.AppUserId);
        }
    }
    
    
    public class FollowingProfileResolver : IValueResolver<AppUser, Profile, bool>
    {
        private readonly DataContext _context;
        private readonly ICurrentUser _currentUser;

        public FollowingProfileResolver(DataContext context, ICurrentUser currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }
        
        
        public bool Resolve(AppUser source, Profile destination, bool destMember, ResolutionContext context)
        {
            var currentUser = _context.Users.SingleOrDefaultAsync(u => u.UserName == _currentUser.Username()).Result;

            return currentUser.Following.Any(f => f.TargetId == source.Id);
        }
    }
}