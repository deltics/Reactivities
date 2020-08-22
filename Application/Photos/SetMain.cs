using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Exceptions;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Application.Validators;
using Castle.Core.Resource;
using Microsoft.AspNetCore.Http;


namespace Application.Photos
{
    public class SetMain
    {
        public class Command : IRequest
        {
            public string Id { get; set; }
        }


        public class Handler : IRequestHandler<Command>
        {
            private DataContext _context;
            private readonly ICurrentUser _currentUser;


            public Handler(DataContext context, ICurrentUser currentUser)
            {
                _context = context;
                _currentUser = currentUser;
            }


            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x=> x.UserName == _currentUser.Username(), cancellationToken);

                var newMainPhoto = user.Photos.FirstOrDefault(x => x.Id == request.Id);
                if (newMainPhoto == null)
                    throw new RESTException(HttpStatusCode.NotFound, new {photo = "Not found"});
                
                if (newMainPhoto.IsMain)
                    return Unit.Value;

                var currentMainPhoto = user.Photos.SingleOrDefault(x => x.IsMain);
                if (currentMainPhoto != null)
                    currentMainPhoto.IsMain = false;
                
                newMainPhoto.IsMain = true;

                var success = await _context.SaveChangesAsync(cancellationToken) > 0;
                if (!success)
                    throw new Exception("Unable to set main photo");
                
                return Unit.Value;
            }
        }
    }
}