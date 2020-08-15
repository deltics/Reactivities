using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Exceptions;
using Identity;
using Infrastructure.Security;
using MediatR;
using Microsoft.AspNetCore.Identity;


namespace Application.User
{
    public class CurrentUser
    {
        public class Query : IRequest<User>
        {
            public Guid Id { get; set; }
        }


        public class Handler : IRequestHandler<Query, User>
        {
            private readonly UserManager<AppUser> _userManager;
            private readonly IJwtGenerator _jwtGenerator;
            private readonly ICurrentUser _currentUser;

            
            public Handler(UserManager<AppUser> userManager, IJwtGenerator jwtGenerator, ICurrentUser currentUser)
            {
                _userManager = userManager;
                _jwtGenerator = jwtGenerator;
                _currentUser = currentUser;
            }

            
            public async Task<User> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByNameAsync(_currentUser.Username());
                
                return new User
                {
                    DisplayName = user.DisplayName,
                    Username = user.UserName,
                    Token = _jwtGenerator.CreateToken(user),
                    Image = null
                };
            }
        }
    }
}