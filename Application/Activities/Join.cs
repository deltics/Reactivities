using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Exceptions;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;


namespace Application.Activities
{
    public class Join
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
        }


        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly ICurrentUser _currentUser;


            public Handler(DataContext context, ICurrentUser currentUser)
            {
                _context = context;
                _currentUser = currentUser;
            }


            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(
                    u => u.UserName == _currentUser.Username()
                );

                var activity = await _context.Activities.FindAsync(request.Id);
                if (activity == null)
                    throw new RESTException(HttpStatusCode.NotFound, new {Activity = "Could not find activity"});

                var attendance = await _context.UserActivities.SingleOrDefaultAsync(
                    x => (x.ActivityId == activity.Id) && (x.AppUserId == user.Id)
                );
                if (attendance != null)
                    throw new RESTException(HttpStatusCode.BadRequest, new {Attendance = "Already attending this activity"});
                
                var attendee = new UserActivity
                {
                    AppUser = user,
                    Activity = activity,
                    IsHost = false,
                    DateJoined = DateTime.UtcNow
                };
                _context.UserActivities.Add(attendee);

                var inserted = await _context.SaveChangesAsync(cancellationToken);

                if (inserted == 0)
                    throw new Exception("Problem joining the activity");

                return Unit.Value;
            }
        }
    }
}