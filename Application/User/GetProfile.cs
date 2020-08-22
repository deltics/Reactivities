using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Exceptions;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;


namespace Application.User
{
    public class GetProfile
    {
        public class Query : IRequest<Profile>
        {
            public string Username { get; set; }
        }


        public class Handler : IRequestHandler<Query, Profile>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;


            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            
            public async Task<Profile> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);
                
                if (user == null)
                    throw new RESTException(HttpStatusCode.NotFound, new {user = "Not found"});

                return _mapper.Map<AppUser, Profile>(user);
            }
        }
    }
}