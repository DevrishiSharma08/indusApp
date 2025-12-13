using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

// Ensure the namespace is exactly this
namespace Indus.Api.Data
{
    public class DbContextFactory : IDesignTimeDbContextFactory<IndusDbContext>
    {
        public IndusDbContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.Development.json")
                .Build();

            var builder = new DbContextOptionsBuilder<IndusDbContext>();
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            builder.UseSqlServer(connectionString);

            return new IndusDbContext(builder.Options);
        }
    }
}