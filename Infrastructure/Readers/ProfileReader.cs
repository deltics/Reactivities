using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Application.Exceptions;
using Application.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Profile = Application.User.Profile;


namespace Infrastructure.Readers
{
    public class ProfileReader : IProfileReader
    {
        private readonly DataContext _context;
        private readonly ICurrentUser _currentUser;
        private readonly IMapper _mapper;


        public ProfileReader(DataContext context, ICurrentUser currentUser, IMapper mapper)
        {
            _context = context;
            _currentUser = currentUser;
            _mapper = mapper;
        }


        public async Task<Profile> ReadProfile(string username)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == username);
            if (user == null)
                throw new RESTException(HttpStatusCode.NotFound, new { User = "User not found" });

            var currentUser = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _currentUser.Username());

            return _mapper.Map<Profile>(user);
        }
    }
}