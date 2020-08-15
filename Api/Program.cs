using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Identity;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();

            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {
                    var ctx = services.GetRequiredService<DataContext>();
                    var um = services.GetRequiredService<UserManager<AppUser>>();
                    ctx.Database.Migrate();
                    
                    Seed.SeedData(ctx, um);
                }
                catch (Exception e)
                {
                    var log = services.GetRequiredService<ILogger<Program>>();
                    log.LogError(e, "An error occured during db migration");
                    throw;
                }
            }
            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
