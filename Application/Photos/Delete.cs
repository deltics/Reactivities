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
    public class Delete
    {
        public class Command : IRequest
        {
            public string Id { get; set; }
        }


        public class Handler : IRequestHandler<Command>
        {
            private DataContext _context;
            private readonly ICurrentUser _currentUser;
            private readonly IPhotoStorage _photoStorage;


            public Handler(DataContext context, ICurrentUser currentUser, IPhotoStorage photoStorage)
            {
                _context = context;
                _currentUser = currentUser;
                _photoStorage = photoStorage;
            }


            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x=> x.UserName == _currentUser.Username(), cancellationToken);

                var photo = user.Photos.FirstOrDefault(x => x.Id == request.Id);
                if (photo == null)
                    throw new RESTException(HttpStatusCode.NotFound, new {photo = "Not found"});
                
                if (photo.IsMain)
                    throw new RESTException(HttpStatusCode.BadRequest, new {error = "This is your main photo and cannot be deleted"});

                 _photoStorage.DeletePhoto(request.Id);
                 
                user.Photos.Remove(photo);

                var success = await _context.SaveChangesAsync(cancellationToken) > 0;
                if (!success)
                    throw new Exception("Unable to add photo");
                
                return Unit.Value;
            }
        }
    }
}