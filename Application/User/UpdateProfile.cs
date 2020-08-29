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
using AutoMapper;


namespace Application.User
{
    public class UpdateProfile
    {
        public class Command : IRequest<Profile>
        {
            public string DisplayName { get; set; }
            public string Bio { get; set; }
        }


        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(cmd => cmd.DisplayName).NotEmpty();
            }
        }


        public class Handler : IRequestHandler<Command, Profile>
        {
            private DataContext _context;
            private readonly ICurrentUser _currentUser;
            private readonly IMapper _mapper;


            public Handler(DataContext context, ICurrentUser currentUser, IMapper mapper)
            {
                _context = context;
                _currentUser = currentUser;
                _mapper = mapper;
            }


            public async Task<Profile> Handle(Command request, CancellationToken cancellationToken)
            {
                var username = _currentUser.Username();

                var user = await _context.Users.SingleOrDefaultAsync(u => u.UserName == username, cancellationToken);

                if (user.DisplayName != request.DisplayName || user.Bio != request.Bio)
                {
                    user.DisplayName = request.DisplayName;
                    user.Bio = request.Bio;

                    var success = await _context.SaveChangesAsync(cancellationToken) > 0;
                    if (!success)
                        throw new Exception("Error saving user profile");
                }

                return _mapper.Map<AppUser, Profile>(user);
            }
        }
    }
}