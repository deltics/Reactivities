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
using Microsoft.AspNetCore.Http;


namespace Application.Photos
{
    public class Add
    {
        public class Command : IRequest<(string id, string url)>
        {
            public IFormFile File { get; set; }
        }


        public class Handler : IRequestHandler<Command, (string id, string url)>
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


            public async Task<(string id, string url)> Handle(Command request, CancellationToken cancellationToken)
            {
                var (id, url) = _photoStorage.AddPhoto(request.File);
                var user = await _context.Users.SingleOrDefaultAsync(x=> x.UserName == _currentUser.Username(), cancellationToken);

                var photo = new Photo
                {
                    Id = id,
                    Url = url,
                    IsMain = !user.Photos.Any(x => x.IsMain)
                };
                user.Photos.Add(photo);

                var success = await _context.SaveChangesAsync(cancellationToken) > 0;
                if (!success)
                    throw new Exception("Unable to add photo");
                
                return (id, url);
            }
        }
    }
}