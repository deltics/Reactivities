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


namespace Application.User
{
    public class Login
    {
        public class Query : IRequest<UserDto>
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }


        public class QueryValidator : AbstractValidator<Query>
        {
            public QueryValidator()
            {
                RuleFor(x => x.Email).NotEmpty();
                RuleFor(x => x.Password).NotEmpty();
            }
        }


        public class Handler : IRequestHandler<Query, UserDto>
        {
            private readonly UserManager<AppUser> _userManager;
            private readonly SignInManager<AppUser> _signInManager;
            private readonly IJwtGenerator _jwtGenerator;


            public Handler(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IJwtGenerator jwtGenerator)
            {
                _userManager = userManager;
                _signInManager = signInManager;
                _jwtGenerator = jwtGenerator;
            }


            public async Task<UserDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByEmailAsync(request.Email);
                if (user == null)
                    throw new RESTException(HttpStatusCode.Unauthorized); // NOPE!  Should be not found, surely

                var signIn = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
                if (!(signIn.Succeeded))
                    throw new RESTException(HttpStatusCode.Unauthorized);

                var image = user.Photos.SingleOrDefault(x => x.IsMain);
                
                return new UserDto
                {
                    DisplayName = user.DisplayName,
                    Username = user.Email,
                    Image = image?.Url,
                    Token = _jwtGenerator.CreateToken(user)
                };
            }
        }
    }
}