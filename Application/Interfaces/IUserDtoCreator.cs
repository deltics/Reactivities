using System.Threading.Tasks;
using Application.User;
using Domain;


namespace Application.Interfaces
{
    public interface IUserDtoCreator
    {
        public Task<UserDto> CreateUserDto(AppUser user);
    }
}