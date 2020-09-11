using System.Collections.Generic;
using System.Collections.ObjectModel;
using Domain;
using Microsoft.AspNetCore.Identity;


namespace Domain
{
    public class AppUser : IdentityUser
    {
        public AppUser()
        {
            Photos = new Collection<Photo>();
        }
        
        
        public string DisplayName { get; set; }
        public string Bio { get; set; }

        public virtual ICollection<UserActivity> UserActivities { get; set; }
        public virtual ICollection<Photo> Photos { get; set; }
        public virtual ICollection<Following> Following { get; set; }
        public virtual ICollection<Following> Followers { get; set; }
        public virtual ICollection<RefreshToken> RefreshTokens { get; set; }
    }
}