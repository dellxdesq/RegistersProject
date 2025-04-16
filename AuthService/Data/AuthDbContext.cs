using AuthService.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace AuthService.Data
{
    public class AuthDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }

        public AuthDbContext(DbContextOptions<AuthDbContext> options)
            : base(options) { }
    }
}