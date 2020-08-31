using System;
using System.Net;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Application.Exceptions;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Following
{
    public class Delete
    {
        public class Command : IRequest
        {
            public string UserName { get; set; }
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
                var user = await _context.Users.SingleOrDefaultAsync(u => u.UserName == _currentUser.Username(),
                    cancellationToken);

                var target = await _context.Users.SingleOrDefaultAsync(u => u.UserName == request.UserName, cancellationToken);
                if (target == null)
                    throw new RESTException(HttpStatusCode.NotFound, new {User = "User not found"});

                var following = await _context.Follows.SingleOrDefaultAsync(f =>
                    f.TargetId == target.Id && f.ObserverId == user.Id);
                if (following == null)
                    throw new RESTException(HttpStatusCode.BadRequest, new {Error = "User is not being followed"});

                _context.Follows.Remove(following);

                var success = await _context.SaveChangesAsync(cancellationToken) > 0;
                if (!success)
                    throw new RESTException(HttpStatusCode.InternalServerError, new { Error = "Problem deleting following"});
                
                return Unit.Value;
            }
        }
    }
}