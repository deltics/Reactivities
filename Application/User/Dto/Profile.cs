using System.Collections.Generic;
using Domain;

namespace Application.User
{
    public class Profile
    {
        public string DisplayName { get; set; }
        public string Username { get; set; }
        public string Image { get; set; }
        public string Bio { get; set; }
        
        public bool Following { get; set; }        // Is the CURRENT USER following this profile, Y/N
        public int FollowerCount { get; set; }
        public int FollowingCount { get; set; }

        public virtual ICollection<Photo> Photos { get; set; }
    }
}