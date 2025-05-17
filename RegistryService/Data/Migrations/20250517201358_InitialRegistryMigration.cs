using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace RegistryService.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialRegistryMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Registries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    DefaultAccessLevel = table.Column<int>(type: "integer", nullable: false, defaultValue: 1),
                    CreatedByUserId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Registries", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Username = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    PasswordHash = table.Column<byte[]>(type: "bytea", nullable: false),
                    PasswordSalt = table.Column<byte[]>(type: "bytea", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RegistryMetas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RegistryId = table.Column<int>(type: "integer", nullable: false),
                    FileFormat = table.Column<string>(type: "text", nullable: false),
                    Organization = table.Column<string>(type: "text", nullable: false),
                    RowsCount = table.Column<int>(type: "integer", nullable: false),
                    FileName = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RegistryMetas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RegistryMetas_Registries_RegistryId",
                        column: x => x.RegistryId,
                        principalTable: "Registries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RegistrySliceRequests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    RegistryId = table.Column<int>(type: "integer", nullable: false),
                    FilterParameters = table.Column<string>(type: "text", nullable: false),
                    RequestedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RegistrySliceRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RegistrySliceRequests_Registries_RegistryId",
                        column: x => x.RegistryId,
                        principalTable: "Registries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RegistrySliceRequests_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserRegistryAccesses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    RegistryId = table.Column<int>(type: "integer", nullable: false),
                    AccessLevel = table.Column<int>(type: "integer", nullable: false),
                    IsApproved = table.Column<bool>(type: "boolean", nullable: false),
                    GrantedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRegistryAccesses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserRegistryAccesses_Registries_RegistryId",
                        column: x => x.RegistryId,
                        principalTable: "Registries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserRegistryAccesses_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RegistryMetas_RegistryId",
                table: "RegistryMetas",
                column: "RegistryId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RegistrySliceRequests_RegistryId",
                table: "RegistrySliceRequests",
                column: "RegistryId");

            migrationBuilder.CreateIndex(
                name: "IX_RegistrySliceRequests_UserId",
                table: "RegistrySliceRequests",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserRegistryAccesses_RegistryId",
                table: "UserRegistryAccesses",
                column: "RegistryId");

            migrationBuilder.CreateIndex(
                name: "IX_UserRegistryAccesses_UserId",
                table: "UserRegistryAccesses",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RegistryMetas");

            migrationBuilder.DropTable(
                name: "RegistrySliceRequests");

            migrationBuilder.DropTable(
                name: "UserRegistryAccesses");

            migrationBuilder.DropTable(
                name: "Registries");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
