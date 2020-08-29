using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Exceptions;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;


namespace Application.Comments
{
    public class Create
    {
        public class Command : IRequest<CommentDto>
        {
            public string Username { get; set; }    // What bollocks is this!?
            public string Body { get; set; }
            public Guid ActivityId { get; set; }
        }


        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(cmd => cmd.Body).NotEmpty();
                RuleFor(cmd => cmd.ActivityId).NotEmpty();
            }
        }


        public class Handler : IRequestHandler<Command, CommentDto>
        {
            private readonly DataContext _context;
            private readonly ICurrentUser _currentUser;
            private readonly IMapper _mapper;


            public Handler(DataContext context, ICurrentUser currentUser, IMapper mapper)
            {
                _context = context;
                _currentUser = currentUser;
                _mapper = mapper;
            }


            public async Task<CommentDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.SingleOrDefaultAsync(
                    a => a.Id == request.ActivityId, cancellationToken
                );
                if (activity == null)
                    throw new RESTException(HttpStatusCode.NotFound, new {Activity = "Activity not found"});

                // Insecure bollocks!
                var user = await _context.Users.SingleOrDefaultAsync(
//                    u => u.UserName == _currentUser.Username(), cancellationToken
                u => u.UserName == request.Username, cancellationToken
                );
                if (user == null)
                    throw new RESTException(HttpStatusCode.NotFound, new {User = "User not found"});
                
                var comment = new Comment
                {
                    Body = request.Body,
                    Author = user,
                    Activity = activity,
                    CreatedAt = DateTime.UtcNow
                };
                _context.Comments.Add(comment);
                activity.Comments.Add(comment);

                var inserted = await _context.SaveChangesAsync(cancellationToken);
                if (inserted == 0)
                    throw new Exception("Problem saving comment");

                return _mapper.Map<CommentDto>(comment);
            }
        }
    }
}