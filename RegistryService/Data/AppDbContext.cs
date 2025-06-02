using RegistryServiceProject.Models;
using Microsoft.EntityFrameworkCore;
using RegistryService.Models;
using RegistryService.Models.Enums;

namespace RegistryServiceProject.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Registry> Registries { get; set; }
        public DbSet<UserRegistryAccess> UserRegistryAccesses { get; set; }
        public DbSet<RegistryAccessRequest> RegistryAccessRequests { get; set; }
        public DbSet<RegistryMeta> RegistryMetas { get; set; }
        public DbSet<RegistrySlice> RegistrySlices { get; set; }


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
                .HasForeignKey<RegistryMeta>(m => m.RegistryId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RegistryAccessRequest>()
                .HasOne(r => r.Registry)
                .WithMany()
                .HasForeignKey(r => r.RegistryId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Registry>()
                .HasMany(r => r.Slices)
                .WithOne()
                .HasForeignKey(s => s.RegistryId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Registry>()
                .HasMany(r => r.Accesses)
                .WithOne(ua => ua.Registry)
                .HasForeignKey(ua => ua.RegistryId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasMany(u => u.Registries)
                .WithOne()
                .HasForeignKey(r => r.CreatedByUserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasMany(u => u.Accesses)
                .WithOne(ua => ua.User)
                .HasForeignKey(ua => ua.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasMany(u => u.AccessRequests)
                .WithOne(ar => ar.User)
                .HasForeignKey(ar => ar.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}