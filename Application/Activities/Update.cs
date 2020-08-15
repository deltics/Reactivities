using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Exceptions;
using FluentValidation;
using MediatR;
using Persistence;


namespace Application.Activities
{
    public class Update
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public string Category { get; set; }
            public DateTime? Date { get; set; }
            public string City { get; set; }
            public string Venue { get; set; }
        }
        
        
        public class CommandValidator: AbstractValidator<Command>
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
            private DataContext _context;

            public Handler(DataContext context)
            {
                this._context = context;
            }

            
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.Id);

                if (activity == null)
                    throw new RESTException(HttpStatusCode.NotFound, new {activity = "Not found"});
                
                activity.Title = request.Title ?? activity.Title;
                activity.Description = request.Description ?? activity.Description;
                activity.Category = request.Category ?? activity.Category;
                activity.Date = request.Date ?? activity.Date;
                activity.City = request.City ?? activity.City;
                activity.Venue = request.Venue ?? activity.Venue;

                var updated = await _context.SaveChangesAsync(cancellationToken);
                if (updated == 0)
                    throw new Exception("Problem saving changes");

                return Unit.Value;
            }
        }
    }
}