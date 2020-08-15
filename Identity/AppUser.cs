using Microsoft.AspNetCore.Identity;


namespace Identity
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }        
    }
}