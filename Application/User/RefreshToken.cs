using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Exceptions;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;


namespace Application.User
{
    public class RefreshToken
    {
        public class Command : IRequest<UserDto>
        {
            public string RefreshToken { get; set; }
        }


        public class Handler : IRequestHandler<Command, UserDto>
        {
            private readonly UserManager<AppUser> _userManager;
            private readonly IJwtGenerator _jwtGenerator;
            private readonly ICurrentUser _currentUser;
            private readonly IUserDtoCreator _userDtoCreator;


            public Handler(UserManager<AppUser> userManager, IJwtGenerator jwtGenerator, ICurrentUser currentUser, IUserDtoCreator userDtoCreator)
            {
                _userManager = userManager;
                _jwtGenerator = jwtGenerator;
                _currentUser = currentUser;
                _userDtoCreator = userDtoCreator;
            }

            
            public async Task<UserDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByNameAsync(_currentUser.Username());

                var token = user.RefreshTokens.SingleOrDefault(x => x.Token == request.RefreshToken);
                if ((token == null) || !token.IsValid)
                    throw new RESTException(HttpStatusCode.Unauthorized, new { RefreshToken = "Invalid refresh token"});

                token.Revoked = DateTime.UtcNow;

                return await _userDtoCreator.CreateUserDto(user);
            }
        }
    }
}