using System.Linq;
using System.Text.Json.Serialization;
using Domain;


namespace Application.User
{
    public class UserDto
    {
        public string DisplayName { get; set; }
        public string Token { get; set; }
        public string Username { get; set; }
        public string Image { get; set; }
        
        [JsonIgnore]
        public string RefreshToken { get; set; }
    }
}