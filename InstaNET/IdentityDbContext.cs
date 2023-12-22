using InstaNET.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace InstaNET
{
    public class IdentityDbContext : IdentityDbContext<ApplicationUser>
    {
        private readonly IConfiguration _config;

        //add-migration accountsmig -context IdentityDbContext  first migration
        public IdentityDbContext(DbContextOptions<IdentityDbContext> options, IConfiguration config)
            : base(options)
        {
            _config = config;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            // connect to sql server with connection string from app settings
            options.UseSqlServer(_config.GetConnectionString("AccountsConstr"));
            // options.UseSqlServer("Data Source= HYDLPT-275P2\\SQLEXPRESS;Initial Catalog= local;trusted_connection=yes;");

        }
        public DbSet<User> Users { get; set; }
        
    }
}
