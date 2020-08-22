using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;


namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public string Category { get; set; }
            public DateTime Date { get; set; }
            public string City { get; set; }
            public string Venue { get; set; }
        }


        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(cmd => cmd.Title).NotEmpty();
                RuleFor(cmd => cmd.Description).NotEmpty();
                RuleFor(cmd => cmd.Category).NotEmpty();
                RuleFor(cmd => cmd.Date).NotEmpty();
                RuleFor(cmd => cmd.City).NotEmpty();
                RuleFor(cmd => cmd.Venue).NotEmpty();
            }
        }


        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly ICurrentUser _currentUser;


            public Handler(DataContext context, ICurrentUser currentUser)
            {
                _context = context;
                _currentUser = currentUser;
            }


            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = new Activity
                {
                    Id = request.Id,
                    Title = request.Title,
                    Description = request.Description,
                    Category = request.Category,
                    Date = request.Date,
                    City = request.City,
                    Venue = request.Venue
                };
                _context.Activities.Add(activity);

                var user = await _context.Users.SingleOrDefaultAsync(
                    u => u.UserName == _currentUser.Username()
                );
                var attendee = new UserActivity
                {
                    AppUser = user,
                    Activity = activity,
                    IsHost = true,
                    DateJoined = DateTime.UtcNow
                };
                _context.UserActivities.Add(attendee);

                var inserted = await _context.SaveChangesAsync(cancellationToken);

                if (inserted == 0)
                    throw new Exception("Problem saving new Activity");

                return Unit.Value;
            }
        }
    }
}