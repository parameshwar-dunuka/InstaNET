using Microsoft.EntityFrameworkCore;
using InstaNET.Models;

namespace InstaNET
{
    public class DbConnect:DbContext
    {
        private readonly IConfiguration _config;
        //Database provider sits between EF and database which supports the crud operations on specific databases like sql server, mysql, postgresql,mongodb
        ////1.open pm,
        //2.Install-Package Microsoft.EntityFrameworkCore.Tools
        //3.Add-Migration AddPostClass -context DbConnect
        //4.update-database -context DbConnect
        //this is code first approach
        public DbConnect(DbContextOptions<DbConnect> options, IConfiguration config) : base(options)
        {
            _config = config;
        }

        public DbConnect()
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            // connect to sql server with connection string from app settings
            options.UseSqlServer(_config.GetConnectionString("Constr"));
           // options.UseSqlServer("Data Source= HYDLPT-275P2\\SQLEXPRESS;Initial Catalog= local;trusted_connection=yes;");

        }

        public virtual DbSet<PostData>  Post { get; set; }
        public virtual DbSet<StatusData> Status { get; set; }
        public virtual DbSet<CommonModel> UserInfo { get; set; }
        public virtual DbSet<Relations> Relations { get; set; }
        public virtual DbSet<Comments> Comments { get; set; }
        public virtual DbSet<SavePosts> SavePosts { get; set; }
        public virtual DbSet<LikePosts> LikePosts { get; set; }
        public virtual DbSet<StatusSeen> StatusSees { get; set; }
        public virtual DbSet<ChatData> Chats { get; set; }


    }
}
