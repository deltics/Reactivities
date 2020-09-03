using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;


namespace Application.Activities
{
    public class List
    {
        public class ActivitiesEnvelope
        {
            public List<ActivityDto> Activities { get; set; }
            public int ActivityCount { get; set; }
        }


        public class Query : IRequest<ActivitiesEnvelope>
        {
            public bool IsGoing { get; }
            public bool IsHost { get; }
            public DateTime? StartDate { get; }
            public int Limit { get; }
            public int Offset { get; }

            public Query(int? limit, int? offset, bool isGoing, bool isHost, DateTime? startDate)
            {
                Limit = limit ?? 3;
                Offset = offset ?? 0;
                IsGoing = isGoing;
                IsHost = isHost;
                StartDate = startDate ?? DateTime.UtcNow;
            }
        }


        public class Handler : IRequestHandler<Query, ActivitiesEnvelope>
        {
            private readonly DataContext _context;
            private readonly ILogger<List> _logger;
            private readonly IMapper _mapper;
            private readonly ICurrentUser _currentUser;


            public Handler(DataContext context, ILogger<List> logger, IMapper mapper, ICurrentUser currentUser)
            {
                _context = context;
                _logger = logger;
                _mapper = mapper;
                _currentUser = currentUser;
            }


            public async Task<ActivitiesEnvelope> Handle(Query request, CancellationToken cancellationToken)
            {
                var queryable = _context.Activities
                    .Where(a => a.Date >= request.StartDate)
                    .OrderBy(a => a.Date)
                    .AsQueryable();

                if (request.IsGoing || request.IsHost)
                {
                    var user = _currentUser.Username();

                    if (!request.IsHost)
                        queryable = queryable.Where(a => a.UserActivities.Any(ua => ua.AppUser.UserName == user));

                    if (!request.IsGoing)
                        queryable = queryable.Where(a =>
                            a.UserActivities.Any(ua => ua.AppUser.UserName == user && ua.IsHost));
                }

                var activities = await queryable
                    .Skip(request.Offset)
                    .Take(request.Limit).ToListAsync(cancellationToken);

                return new ActivitiesEnvelope
                {
                    Activities = _mapper.Map<List<Activity>, List<ActivityDto>>(activities),
                    ActivityCount = queryable.Count()
                };
            }
        }
    }
}