using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using MediatR;
using Persistence;
using Application.User;


namespace Application.Following
{
    public class List
    {
        public class Query : IRequest<List<Profile>>
        {
            public string Username { get; set; }
            public string Predicate { get; set; }
        }


        public class Handler : IRequestHandler<Query, List<Profile>>
        {
            private readonly DataContext _context;
            private readonly IProfileReader _reader;


            public Handler(DataContext context, IProfileReader reader)
            {
                _context = context;
                _reader = reader;
            }


            public async Task<List<Profile>> Handle(Query request, CancellationToken cancellationToken)
            {
                var usernames = new List<string>();
                var profiles = new List<Profile>();

                switch (request.Predicate)
                {
                    case "followers":
                        usernames = (
                            from user in _context.Users
                            join follower in _context.Follows on user.Id equals follower.ObserverId
                            where follower.Target.UserName == request.Username
                            select user.UserName
                        ).ToList();
                        break;
                    
                    case "following":
                        usernames = (
                            from user in _context.Users
                            join follower in _context.Follows on user.Id equals follower.TargetId
                            where follower.Observer.UserName == request.Username
                            select user.UserName
                        ).ToList();
                        break;
                }

                foreach (var username in usernames)
                    profiles.Add(await _reader.ReadProfile(username));

                return profiles;
            }
        }
    }
}