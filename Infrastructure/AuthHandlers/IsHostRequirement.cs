using System;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore.Query;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using Persistence;


namespace Infrastructure.Security
{
    public class IsHostRequirement : IAuthorizationRequirement
    {
        // NO-OP
    }


    public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly DataContext _dataContext;


        public IsHostRequirementHandler(IHttpContextAccessor httpContextAccessorAccessor, DataContext dataContext)
        {
            _httpContextAccessor = httpContextAccessorAccessor;
            _dataContext = dataContext;
        }


        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context,
            IsHostRequirement requirement)
        {
            var currentUsername = _httpContextAccessor.HttpContext.User?.Claims
                ?.SingleOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

            // Getting the RouteValue here is very different to that presented in the course.  The course
            //  uses httpCtxAcc.HttpCtx.Request.RouteValues... but this is not available in later
            //  versions of AspNetCore.Http.  Instead we also need AspNetCore.Routing and the approach
            //  found below...

            var routeData = _httpContextAccessor.HttpContext.GetRouteData();
            if (!routeData.Values.TryGetValue("id", out object idParam))
                throw new ApplicationException("IsActivityHost policy incorrectly applied (no activity 'id' param on this end-point)");
        
            var activityId = Guid.Parse(idParam.ToString());
            var activity = _dataContext.Activities.FindAsync(activityId).Result;
            if (activity != null)
            {
                var host = activity.UserActivities.FirstOrDefault(x => x.IsHost);

                if (host?.AppUser?.UserName == currentUsername)
                    context.Succeed(requirement);
            }
            else
                context.Succeed(requirement);

            // Q: Why do we call context.Succeed under two different conditions?
            //
            // A: Because in the event that an ACTIVITY does not exist the requirement that the current
            //  user be the host of that activity cannot be said to have failed.
            //
            // Ideally we would be able to indicate "Not applicable", but we can't so we just "succeed"
            //  as a way of saying "Fine by me I guess", and let other error handling proceed (i.e. NotFound)
            //
            // If we failed the requirement in those conditions then the response would be FORBIDDEN which
            //  would not be semantically correct.  You can't be FORBIDDEN access to something that
            //  doesn't even exist.

            return Task.CompletedTask;
        }
    }
}