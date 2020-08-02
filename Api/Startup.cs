using Application.Activities;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Persistence;

namespace Api
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

       
        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // AspNetCore services
            services.AddControllers();
            
            // Persistence
            services.AddDbContext<DataContext>(options => options.UseSqlite(Configuration.GetConnectionString("default")));
            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
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
        }

        
        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
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
