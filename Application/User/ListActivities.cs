using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Exceptions;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;


namespace Application.User
{
    public class ListActivities
    {
        public class Query : IRequest<List<UserActivityDto>>
        {
            public string Username { get; set; }
            public string Predicate { get; set; }
        }

        
        public class Handler : IRequestHandler<Query, List<UserActivityDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;


            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            
            public async Task<List<UserActivityDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username, cancellationToken);

                if (user == null)
                    throw new RESTException(HttpStatusCode.NotFound, new { User = "Not found" });

                var queryable = user.UserActivities
                    .OrderBy(a => a.Activity.Date)
                    .AsQueryable();

                switch (request.Predicate)
                {
                    case "past":
                        queryable = queryable.Where(a => a.Activity.Date <= DateTime.UtcNow);
                        break;
                    
                    case "hosting":
                        queryable = queryable.Where(a => a.IsHost);
                        break;
                    
                    case "future":
                        queryable = queryable.Where(a => a.Activity.Date >= DateTime.UtcNow);
                        break;
                    
                    default:
                        throw new RESTException(HttpStatusCode.BadRequest, new { Predicate = "Unsupported value for predicate"});
                }

                var activities = queryable.ToList();
                var activitiesToReturn = new List<UserActivityDto>();

                foreach (var activity in activities)
                    activitiesToReturn.Add(_mapper.Map<UserActivityDto>(activity));

                return activitiesToReturn;
            }
        }
    }
}