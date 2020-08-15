using System.Text;
using Api.Middleware;
using Application.Activities;
using FluentValidation.AspNetCore;
using Identity;
using Infrastructure.Security;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
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
                .AddFluentValidation(config => { config.RegisterValidatorsFromAssemblyContaining<Create>(); });

            // Persistence services
            services.AddDbContext<DataContext>(options =>
                options.UseSqlite(Configuration.GetConnectionString("default")));
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

            // MediatR services.
            //
            // We only need to add the ASSEMBLY when setting this up.  We can use any available type in
            //  the required assembly as MediatR will discover ALL types in that assembly.
            services.AddMediatR(typeof(List.Handler).Assembly); 

            // Add Mvc with an authorization policy to protect ALL endpoints with an Authorization policy.
            //  This means that any endpoints that should NOT be authorized MUST now be decorated with
            //  an AllowAnonymous attribute (e.g. user/login)
            services.AddMvc(opt =>
            {
                var policy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .Build();

                opt.Filters.Add(new AuthorizeFilter(policy));
            });

            // Identity services (Identity Framework)
            var identity = services.AddIdentityCore<AppUser>();
            var identityBuilder = new IdentityBuilder(identity.UserType, identity.Services);
            identityBuilder.AddEntityFrameworkStores<DataContext>();
            identityBuilder.AddSignInManager<SignInManager<AppUser>>();

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(opt =>
                {
                    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["TokenKey"]));

                    opt.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = key,
                        ValidateAudience = false,
                        ValidateIssuer = false
                    };
                });

            // Infrastructure services
            services.AddScoped<IJwtGenerator, JwtGenerator>();
            services.AddScoped<ICurrentUser, CurrentUser>();
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

            // Authentication/Authorization must come AFTER UseRouting and UseCors but BEFORE UseEndpoints
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
        }
    }
}