using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Exceptions;
using Domain;
using FluentValidation;
using Infrastructure.Security;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using CurrentUser = Application.User.CurrentUser;


namespace Application.Activities
{
    public class Leave
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
                if (attendance == null)
                    throw new RESTException(HttpStatusCode.BadRequest, new {Attendance = "Not attending this activity"});
                
                if (attendance.IsHost)
                    throw new RESTException(HttpStatusCode.BadRequest, new {Attendance = "You are the Host of this activity"});
                
                _context.UserActivities.Remove(attendance);

                var deleted = await _context.SaveChangesAsync(cancellationToken);

                if (deleted == 0)
                    throw new Exception("Problem leaving the activity");

                return Unit.Value;
            }
        }
    }
}