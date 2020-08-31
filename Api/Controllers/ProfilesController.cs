using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Following;
using Microsoft.AspNetCore.Mvc;
using Application.User;
using MediatR;


namespace API.Controllers
{
    public class ProfilesController: ApiController
    {
        [HttpGet("{username}")]
        public async Task<ActionResult<Profile>> Get(string username)
        {
            return await Mediator.Send(new GetProfile.Query { Username = username });
        }
        

        [HttpPut]
        public async Task<ActionResult<Profile>> UpdateProfile(UpdateProfile.Command command)
        {
            return await Mediator.Send(command);
        }
        
        
        [HttpPost("{username}/follow")]
        public async Task<ActionResult<Unit>> Follow(string username)
        {
            return await Mediator.Send(new Add.Command { UserName = username});
        }
        
        
        [HttpDelete("{username}/follow")]
        public async Task<ActionResult<Unit>> Unfollow(string username)
        {
            return await Mediator.Send(new Delete.Command { UserName = username});
        }
        
        
        [HttpGet("{username}/follow")]
        public async Task<ActionResult<List<Profile>>> GetFollows(string username, string predicate)
        {
            return await Mediator.Send(new List.Query { Username = username, Predicate = predicate });
        }
    }
}