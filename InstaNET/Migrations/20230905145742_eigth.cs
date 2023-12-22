using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InstaNET.Migrations
{
    /// <inheritdoc />
    public partial class eigth : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "IsPrivate",
                table: "UserProfile",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPrivate",
                table: "UserProfile");
        }
    }
}
