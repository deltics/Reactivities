using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;


namespace Api.SignalR
{
    public class CommentHub : Hub
    {
        private readonly IMediator _mediator;

        
        public CommentHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        
        public async Task SendComment(Create.Command command)
        {
            command.Username = Context.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

            var comment = await _mediator.Send(command);

            await Clients.Group(command.ActivityId.ToString()).SendAsync("NewComment", comment);
        }


        public async Task Join(string activityId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, activityId);

            var username = Context.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            
            await Clients.Group(activityId).SendAsync("Info", $"{username} has joined the chat for activity {activityId}");
        }
        

        public async Task Leave(string activityId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, activityId);

            var username = Context.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            
            await Clients.Group(activityId).SendAsync("Info", $"{username} has left the chat for activity {activityId}");
        }

    }
}