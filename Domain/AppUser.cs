using System.Collections.Generic;
using Domain;
using Microsoft.AspNetCore.Identity;


namespace Domain
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }
        public string Bio { get; set; }

        public virtual ICollection<UserActivity> UserActivities { get; set; }
        public virtual ICollection<Photo> Photos { get; set; }
        public virtual ICollection<Following> Following { get; set; }
        public virtual ICollection<Following> Followers { get; set; }
    }
}