using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RegistryService.Data
{
    /// <inheritdoc />
    public partial class UpdateAppContextCascad : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RegistryAccessRequests_Users_UserId",
                table: "RegistryAccessRequests");

            migrationBuilder.CreateIndex(
                name: "IX_Registries_CreatedByUserId",
                table: "Registries",
                column: "CreatedByUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Registries_Users_CreatedByUserId",
                table: "Registries",
                column: "CreatedByUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RegistryAccessRequests_Users_UserId",
                table: "RegistryAccessRequests",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Registries_Users_CreatedByUserId",
                table: "Registries");

            migrationBuilder.DropForeignKey(
                name: "FK_RegistryAccessRequests_Users_UserId",
                table: "RegistryAccessRequests");

            migrationBuilder.DropIndex(
                name: "IX_Registries_CreatedByUserId",
                table: "Registries");

            migrationBuilder.AddForeignKey(
                name: "FK_RegistryAccessRequests_Users_UserId",
                table: "RegistryAccessRequests",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
