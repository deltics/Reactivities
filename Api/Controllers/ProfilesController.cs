using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Application.User;


namespace API.Controllers
{
    public class ProfilesController: ApiController
    {
        [HttpGet("{username}")]
        public async Task<ActionResult<Profile>> Get(string username)
        {
            return await Mediator.Send(new GetProfile.Query { Username = username });
        }
    }
}