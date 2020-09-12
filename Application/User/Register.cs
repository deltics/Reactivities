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


namespace Application.User
{
    public class Register
    {
        public class Command : IRequest<UserDto>
        {
            public string DisplayName { get; set; }
            public string Username { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
        }


        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(cmd => cmd.DisplayName).NotEmpty();
                RuleFor(cmd => cmd.Username).NotEmpty();
                RuleFor(cmd => cmd.Email).EmailAddress();
                RuleFor(cmd => cmd.Password).Password();
            }
        }


        public class Handler : IRequestHandler<Command, UserDto>
        {
            private DataContext _context;
            private readonly UserManager<AppUser> _userManager;
            private readonly IJwtGenerator _jwtGenerator;
            private readonly IUserDtoCreator _userDtoCreator;


            public Handler(DataContext context, UserManager<AppUser> userManager, IJwtGenerator jwtGenerator, IUserDtoCreator userDtoCreator)
            {
                _context = context;
                _userManager = userManager;
                _jwtGenerator = jwtGenerator;
                _userDtoCreator = userDtoCreator;
            }


            public async Task<UserDto> Handle(Command request, CancellationToken cancellationToken)
            {
                if (await _context.Users.AnyAsync(u => u.Email == request.Email, cancellationToken))
                    throw new RESTException(HttpStatusCode.BadRequest,
                        new {Email = "Email has already been registered"});

                if (await _context.Users.AnyAsync(u => u.UserName == request.Username, cancellationToken))
                    throw new RESTException(HttpStatusCode.BadRequest,
                        new {Username = "A user has already registered with that name"});

                var user = new AppUser
                {
                    DisplayName = request.DisplayName,
                    Email = request.Email,
                    UserName = request.Username
                };

                var result = await _userManager.CreateAsync(user, request.Password);
                if (!(result.Succeeded))
                {
                    // This is NOT what the course does.  The course uses a custom validator
                    //  to duplicate the validation rules applied by Identity Framework
                    //  (did someone say "DRY" ?)
                    //
                    // But, I also implemented the custom validator from the course, just to
                    //  understand how, so this error reporting should not (currently) be triggered
                    //  in the case of an password not meeting Ident Framework policy.
                    //
                    // This is not ideal however since if the Ident Framework policy changes then
                    //  the app custom validator may not be tripped so reporting of password
                    //  validation failures could be inconsistent (some app errors, some Ident
                    //  Framework errors)
                    // 
                    // Better to consistently report the Ident Framework errors, imho.
                    
                    if (result.Errors.Any())
                    {
                        throw new RESTException(HttpStatusCode.BadRequest, new
                        {
                            Error = "Unable to register user",
                            Errors = result.Errors.Select(e => e.Description).ToArray()
                        });
                    }
                    else
                        throw new Exception("Unexpected error.  Unable to register user");
                }

                return await _userDtoCreator.CreateUserDto(user);
            }
        }
    }
}