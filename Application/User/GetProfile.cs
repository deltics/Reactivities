using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Exceptions;
using Application.Interfaces;
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
            private readonly IProfileReader _reader;


            public Handler(DataContext context, IMapper mapper, IProfileReader reader)
            {
                _context = context;
                _mapper = mapper;
                _reader = reader;
            }

            
            public async Task<Profile> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);
                
                if (user == null)
                    throw new RESTException(HttpStatusCode.NotFound, new {user = "Not found"});

                return await _reader.ReadProfile(request.Username);
            }
        }
    }
}