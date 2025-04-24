using RegistryServiceProject.Models;
using Microsoft.EntityFrameworkCore;
using RegistryService.Models;
using RegistryService.Models.Enums;

namespace RegistryServiceProject.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Registry> Registries { get; set; }
        public DbSet<UserRegistryAccess> UserRegistryAccesses { get; set; }
        public DbSet<RegistryMeta> RegistryMetas { get; set; }
        public DbSet<RegistrySliceRequest> RegistrySliceRequests { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // по дефолту все реестры публичные
            modelBuilder.Entity<Registry>()
                .Property(r => r.DefaultAccessLevel)
                .HasDefaultValue(AccessLevel.Public);

            // связал 1 к 1 = Registry и RegistryMeta
            modelBuilder.Entity<Registry>()
                .HasOne(r => r.Meta)
                .WithOne(m => m.Registry)
                .HasForeignKey<RegistryMeta>(m => m.RegistryId);
        }
    }
}