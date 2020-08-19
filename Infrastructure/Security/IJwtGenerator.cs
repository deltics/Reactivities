using Domain;


namespace Infrastructure.Security
{
    public interface IJwtGenerator
    {
        string CreateToken(AppUser user);
    }
}