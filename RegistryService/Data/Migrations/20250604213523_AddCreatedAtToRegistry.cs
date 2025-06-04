using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RegistryService.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddCreatedAtToRegistry : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Registries",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "OriginalRegistryId",
                table: "Registries",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Registries");

            migrationBuilder.DropColumn(
                name: "OriginalRegistryId",
                table: "Registries");
        }
    }
}
