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
    public class FacebookLogin
    {
        public class Query : IRequest<UserDto>
        {
            public string AccessToken { get; set; }
        }


        // public class QueryValidator : AbstractValidator<Query, User>
        // {
        //     public QueryValidator()
        //     {
        //         RuleFor(x => x.Email).NotEmpty();
        //         RuleFor(x => x.Password).NotEmpty();
        //     }
        // }


        public class Handler : IRequestHandler<Query, UserDto>
        {
            private readonly UserManager<AppUser> _userManager;
            private readonly IFacebookAccessor _facebookAccessor;
            private readonly IJwtGenerator _jwtGenerator;
            private readonly IUserDtoCreator _userDtoCreator;


            public Handler(UserManager<AppUser> userManager, IFacebookAccessor facebookAccessor,
                IJwtGenerator jwtGenerator, IUserDtoCreator userDtoCreator)
            {
                _userManager = userManager;
                _facebookAccessor = facebookAccessor;
                _jwtGenerator = jwtGenerator;
                _userDtoCreator = userDtoCreator;
            }


            public async Task<UserDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var facebookUser = await _facebookAccessor.FacebookLogin(request.AccessToken);
                if (facebookUser == null)
                    throw new RESTException(HttpStatusCode.Unauthorized);

                var user = await _userManager.FindByEmailAsync(facebookUser.Email);
                if (user == null)
                {
                    user = new AppUser
                    {
                        Id = facebookUser.Id,
                        DisplayName = facebookUser.Name,
                        Email = facebookUser.Email,
                        UserName = "fb_" + facebookUser.Id
                    };

                    var photo = new Photo
                    {
                        Id = "fb_" + facebookUser.Id,
                        Url = facebookUser.Picture.Data.Url,
                        IsMain = true
                    };

                    user.Photos.Add(photo);

                    var result = await _userManager.CreateAsync(user);
                    if (!result.Succeeded)
                        throw new RESTException(HttpStatusCode.BadRequest, new {User = "Unable to create user"});
                }

                return await _userDtoCreator.CreateUserDto(user);
            }
        }
    }
}
