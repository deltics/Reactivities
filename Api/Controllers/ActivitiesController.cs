using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Activities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace API.Controllers
{
    public class ActivitiesController : ApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<ActivityDto>>> List(CancellationToken ct)
        {
            return await Mediator.Send(new List.Query(), ct);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<ActivityDto>> Details(Guid id)
        {
            return await Mediator.Send(new Details.Query {Id = id});
        }


        [HttpPost]
        public async Task<ActionResult<Unit>> Create(Create.Command command)
        {
            return await Mediator.Send(command);
        }


        [HttpPost("{id}/attend")]
        public async Task<ActionResult<Unit>> Join(Guid id)
        {
            return await Mediator.Send(new Join.Command { Id = id });
        }


        [HttpDelete("{id}/attend")]
        public async Task<ActionResult<Unit>> Leave(Guid id)
        {
            return await Mediator.Send(new Leave.Command { Id = id });
        }


        [HttpPut("{id}")]
        [Authorize(Policy="IsActivityHost")]
        public async Task<ActionResult<Unit>> Update(Guid id, Update.Command command)
        {
            command.Id = id;

            return await Mediator.Send(command);
        }


        [HttpDelete("{id}")]
        [Authorize(Policy="IsActivityHost")]
        public async Task<ActionResult<Unit>> Delete(Guid id)
        {
            var command = new Delete.Command {Id = id};

            return await Mediator.Send(command);
        }
    }
}