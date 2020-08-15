using Identity;


namespace Infrastructure.Security
{
    public interface IJwtGenerator
    {
        string CreateToken(AppUser user);
    }
}