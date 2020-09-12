using System;
using System.Threading.Tasks;
using Application.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RefreshToken = Domain.RefreshToken;


namespace API.Controllers
{
    public class UserController: ApiController
    {
        private UserDto UserDtoWithRefreshTokenCookie(UserDto user)
        {
            var options = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7)
            };
            Response.Cookies.Append("refresh_token", user.RefreshToken, options);

            return user;
        }
        
        
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<UserDto>> Login(Login.Query query)
        {
            return UserDtoWithRefreshTokenCookie(await Mediator.Send(query));
        }

        
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<UserDto>> Register(Register.Command command)
        {
            return UserDtoWithRefreshTokenCookie(await Mediator.Send(command));
        }

        
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            return UserDtoWithRefreshTokenCookie(await Mediator.Send(new CurrentUser.Query()));
        }


        [AllowAnonymous]
        [HttpPost("facebook")]
        public async Task<ActionResult<UserDto>> FacebookLogin(FacebookLogin.Query query)
        {
            return UserDtoWithRefreshTokenCookie(await Mediator.Send(query));
        }


        [HttpPost("refreshToken")]
        public async Task<ActionResult<UserDto>> RefreshToken(Application.User.RefreshToken.Command command)
        {
            command.RefreshToken = Request.Cookies["refresh_token"];

            return UserDtoWithRefreshTokenCookie(await Mediator.Send(command));
        }
    }
}