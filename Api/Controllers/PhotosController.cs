using System;
using System.ComponentModel.Design;
using System.Threading.Tasks;
using Application.Photos;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;


namespace API.Controllers
{
    public class PhotosController: ApiController
    {
        [HttpPost]
        public async Task<ActionResult<Object>> Add([FromForm]Add.Command command)
        {
            var (id, url) = await Mediator.Send(command);
            
            return new
            {
                Id = id,
                Url= url
            };
        }

        
        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> Delete(string id)
        {
            return await Mediator.Send(new Delete.Command {Id = id});
        }
        
        
        [HttpPost("{id}/setmain")]
        public async Task<ActionResult<Unit>> SetMain(string id)
        {
            return await Mediator.Send(new SetMain.Command {Id = id});
        }
    }
}