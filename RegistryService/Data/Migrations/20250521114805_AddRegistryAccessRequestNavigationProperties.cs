using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RegistryService.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddRegistryAccessRequestNavigationProperties : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_RegistryAccessRequests_RegistryId",
                table: "RegistryAccessRequests",
                column: "RegistryId");

            migrationBuilder.CreateIndex(
                name: "IX_RegistryAccessRequests_UserId",
                table: "RegistryAccessRequests",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_RegistryAccessRequests_Registries_RegistryId",
                table: "RegistryAccessRequests",
                column: "RegistryId",
                principalTable: "Registries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RegistryAccessRequests_Users_UserId",
                table: "RegistryAccessRequests",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RegistryAccessRequests_Registries_RegistryId",
                table: "RegistryAccessRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_RegistryAccessRequests_Users_UserId",
                table: "RegistryAccessRequests");

            migrationBuilder.DropIndex(
                name: "IX_RegistryAccessRequests_RegistryId",
                table: "RegistryAccessRequests");

            migrationBuilder.DropIndex(
                name: "IX_RegistryAccessRequests_UserId",
                table: "RegistryAccessRequests");
        }
    }
}
