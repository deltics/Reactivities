using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;


namespace Application.Activities
{
    public class Delete
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
        }
        
        
        public class Handler: IRequestHandler<Command>
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
                    return Unit.Value;
                
                _context.Activities.Remove(activity);
                var deleted = await _context.SaveChangesAsync(cancellationToken);
                if (deleted == 0)
                    throw new Exception("Problem removing Activity");

                return Unit.Value;
            }
        }
    }
}