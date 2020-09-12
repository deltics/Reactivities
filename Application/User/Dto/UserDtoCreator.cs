using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using Microsoft.AspNetCore.Identity;


namespace Application.User
{
    public class UserDtoCreator : IUserDtoCreator
    {
        private readonly IJwtGenerator _jwtGenerator;
        private readonly UserManager<AppUser> _userManager;


        public UserDtoCreator(IJwtGenerator jwtGenerator, UserManager<AppUser> userManager)
        {
            _jwtGenerator = jwtGenerator;
            _userManager = userManager;
        }


        public async Task<UserDto> CreateUserDto(AppUser user)
        {
            var token = _jwtGenerator.CreateToken(user);
            var refreshToken = _jwtGenerator.CreateRefreshToken();

            refreshToken.AppUser = user;
            user.RefreshTokens.Add(refreshToken);
            await _userManager.UpdateAsync(user);

            return new UserDto
            {
                DisplayName = user.DisplayName,
                Username = user.UserName,
                Image = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                Token = token,
                RefreshToken = refreshToken.Token,
            };
        }
    }
}