using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RegistryService.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddRegistryAccessRequestFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RejectReason",
                table: "RegistryAccessRequests",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "RegistryAccessRequests",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RejectReason",
                table: "RegistryAccessRequests");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "RegistryAccessRequests");
        }
    }
}
