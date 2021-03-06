using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;


namespace Application.User
{
    public class CurrentUser
    {
        public class Query : IRequest<UserDto>
        {
            public Guid Id { get; set; }
        }


        public class Handler : IRequestHandler<Query, UserDto>
        {
            private readonly UserManager<AppUser> _userManager;
            private readonly IJwtGenerator _jwtGenerator;
            private readonly ICurrentUser _currentUser;
            private readonly IMapper _mapper;
            private readonly IUserDtoCreator _userDtoCreator;


            public Handler(UserManager<AppUser> userManager, IJwtGenerator jwtGenerator, ICurrentUser currentUser, IMapper mapper, IUserDtoCreator userDtoCreator)
            {
                _userManager = userManager;
                _jwtGenerator = jwtGenerator;
                _currentUser = currentUser;
                _mapper = mapper;
                _userDtoCreator = userDtoCreator;
            }

            
            public async Task<UserDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByNameAsync(_currentUser.Username());
                
                return await _userDtoCreator.CreateUserDto(user);
            }
        }
    }
}