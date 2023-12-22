using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InstaNET.Migrations
{
    /// <inheritdoc />
    public partial class fothmigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CommentByUser",
                table: "Comments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CommentByUser",
                table: "Comments");
        }
    }
}
