using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InstaNET.Migrations
{
    /// <inheritdoc />
    public partial class FifthMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Bio",
                table: "UserProfile",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "Comments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReplyTo = table.Column<int>(type: "int", nullable: false),
                    ForPost = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Comment = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Createdon = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Comments", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "LikePosts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ForPost = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LikeBy = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LikePosts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Relations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    From = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    To = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsBlocked = table.Column<bool>(type: "bit", nullable: false),
                    Createdon = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Relations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SavePosts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ForPost = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SavedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TaggedTo = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SavePosts", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Comments");

            migrationBuilder.DropTable(
                name: "LikePosts");

            migrationBuilder.DropTable(
                name: "Relations");

            migrationBuilder.DropTable(
                name: "SavePosts");

            migrationBuilder.DropColumn(
                name: "Bio",
                table: "UserProfile");
        }
    }
}
