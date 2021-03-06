using System;
using System.Text;
using System.Threading.Tasks;
using Api.Middleware;
using Api.SignalR;
using Application.Activities;
using Application.Interfaces;
using Application.User;
using AutoMapper;
using FluentValidation.AspNetCore;
using Domain;
using Infrastructure.Email;
using Infrastructure.PhotoStorage;
using Infrastructure.Readers;
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
using CurrentUser = Infrastructure.Security.CurrentUser;


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
        public void ConfigureDevelopmentServices(IServiceCollection services)
        {
            Console.WriteLine("DEVELOPMENT SERVER");
            
            // Persistence services
            services.AddDbContext<DataContext>(options =>
            {
                options.UseLazyLoadingProxies();
//                options.UseMySQL(Configuration.GetConnectionString("mysql"));
//                options.UseSqlite(Configuration.GetConnectionString("sqlite"));
                options.UseSqlServer(Configuration.GetConnectionString(Configuration["Database:UseConnection"] ?? "default"));
            });

            ConfigureServices(services);
        }
        

        public void ConfigureProductionServices(IServiceCollection services)
        {
            Console.WriteLine("PRODUCTION SERVER");
            
            // Persistence services
            services.AddDbContext<DataContext>(options =>
            {
                options.UseLazyLoadingProxies();
//                options.UseMySQL(Configuration.GetConnectionString("mysql"));
//                options.UseSqlite(Configuration.GetConnectionString("sqlite"));
                options.UseSqlServer(Configuration.GetConnectionString(Configuration["Database:UseConnection"] ?? "default"));
            });

            ConfigureServices(services);
        }

        
        public void ConfigureServices(IServiceCollection services)
        {
            // AspNetCore services
            services.AddControllers()
                .AddFluentValidation(config => { config.RegisterValidatorsFromAssemblyContaining<Create>(); });

            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy", policy =>
                {
                    policy
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .WithExposedHeaders("WWW-Authenticate")     // This ensures that token validation errors are
                                                                    //  available in the response headers to the client
                                                                    //  (so that we can detect expired tokens, eg.) 
                        .AllowCredentials()                         // This is needed for SignalR
                        .WithOrigins("http://localhost:3000")    // Need to list origins that are not the same as the Api host - this is for the client app running locally on :3000 (vs host on :5000)
                        .Build();
                });
            });

            // We only need to add the ASSEMBLY when setting up MediatR and AutoMapper.  We can use
            //  any available type in the required assembly and since both MediatR and AutoMapper
            //  need the Application assembly, we'll get that ref once and re-use it for each service.
            var applicationAssembly = typeof(List.Handler).Assembly;

            // MediatR services.
            services.AddMediatR(applicationAssembly);
            
            // AutoMapper
            services.AddAutoMapper(applicationAssembly);

            // SignalR
            services.AddSignalR();
            

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
            var identity = services.AddIdentityCore<AppUser>(options =>
            {
                options.SignIn.RequireConfirmedEmail = true;
            });
            var identityBuilder = new IdentityBuilder(identity.UserType, identity.Services);
            identityBuilder.AddEntityFrameworkStores<DataContext>();
            identityBuilder.AddSignInManager<SignInManager<AppUser>>();
            identityBuilder.AddDefaultTokenProviders();    // For email verification via SendGrid

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(opt =>
                {
                    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["TokenKey"]));

                    opt.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = key,
                        ValidateAudience = false,
                        ValidateIssuer = false,
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero    // Remove the default 5 minute grace period on token expiry 
                    };
                    
                    // Now we plug into the authentication events so that when we are presented with
                    //  an access_token with a request to the /comments endpoint, we extract that
                    //  token and apply it to the message context.
                    //
                    // This hook into Events is only needed to make the user Jwt available to the context
                    //  for the SignalR endpoint.  Regular controller endpoints automatically object this
                    //  through the HttpContext support for bearer tokens.
                    
                    opt.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"];
                            var path = context.HttpContext.Request.Path;
                            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/comments"))
                            {
                                context.Token = accessToken;
                            }

                            return Task.CompletedTask;
                        }
                    };
                });

            services.AddAuthorization(opt =>
            {
                opt.AddPolicy("IsActivityHost", policy =>
                {
                    policy.Requirements.Add(new IsHostRequirement());
                });
            });
            services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>();

            // Infrastructure services
            services.AddScoped<IJwtGenerator, JwtGenerator>();
            services.AddScoped<ICurrentUser, CurrentUser>();
            services.AddScoped<IProfileReader, ProfileReader>();
            services.AddScoped<IPhotoStorage, CloudinaryPhotoStorage>();
            services.AddScoped<IFacebookAccessor, FacebookAccessor>();
            services.AddScoped<IEmailSender, EmailSender>();
            services.AddScoped<IUserDtoCreator, UserDtoCreator>();
            
            // Cloudinary configuration (for PhotoStorage)
            services.Configure<CloudinarySettings>(Configuration.GetSection("Cloudinary"));

            // Facebook Login configuration
            services.Configure<FacebookAppSettings>(Configuration.GetSection("Authentication:Facebook"));

            // SendGrid configuration
            services.Configure<SendGridSettings>(Configuration.GetSection("SendGrid"));
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

            // For serving static files (bad idea imho: should be a separate app)
            app.UseDefaultFiles();
            app.UseStaticFiles();

            // Routing and Cors
            app.UseRouting();
            app.UseCors("CorsPolicy");

            // Authentication/Authorization must come AFTER UseRouting and UseCors but BEFORE UseEndpoints
            app.UseAuthentication();
            app.UseAuthorization();

            // Setup endpoints
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();                  // REST Api routing
                endpoints.MapHub<CommentHub>("comments");    // SignalR routing
                endpoints.MapFallbackToController("Index", "Fallback");    // Fallback routing for static files (serving the React app)
            });
        }
    }
}