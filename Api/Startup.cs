using Api.Middleware;
using Application.Activities;
using FluentValidation.AspNetCore;
using Identity;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Persistence;

namespace Api
{
    public class Startup
    {
        private IConfiguration Configuration { get; }

        
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

       
        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // AspNetCore services
            services.AddControllers()
                .AddFluentValidation(config =>
                {
                    config.RegisterValidatorsFromAssemblyContaining<Create>();
                });
            
            // Persistence
            services.AddDbContext<DataContext>(options => options.UseSqlite(Configuration.GetConnectionString("default")));
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy", policy =>
                {
                    policy
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .WithOrigins("http://localhost:3000").Build();
                });
            });

            // We only need to add the ASSEMBLY - the specific type we use to get to that
            //  assembly ref is irrelevant.  We aren't referencing the type, only the 
            //  assembly so that MediatR can discover ALL the types in that assembly.
            services.AddMediatR(typeof(List.Handler).Assembly);
            
            // Configure Identity Framework
            var identity = services.AddIdentityCore<AppUser>();
            var identityBuilder = new IdentityBuilder(identity.UserType, identity.Services);
            identityBuilder.AddEntityFrameworkStores<DataContext>();
            identityBuilder.AddSignInManager<SignInManager<AppUser>>();

            services.AddAuthentication(); // <- Because we are using AddIdentityCore<T>() (see above) we are
                                          //     responsible for adding ALL services.  If we don't then we
                                          //     will get service validation errors at startup.
        }

        
        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseMiddleware<ErrorHandling>();
            
            if (env.IsDevelopment())
            {
                // app.UseDeveloperExceptionPage();
            }

            // app.UseHttpsRedirection(); // Prevent redirection of http->https for the time being

            app.UseCors("CorsPolicy");
            app.UseRouting();
            app.UseAuthorization();
            
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
