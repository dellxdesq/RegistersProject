using RegistryServiceProject.Data;
using RegistryServiceProject.Models;
using Microsoft.EntityFrameworkCore;

namespace RegistryServiceProject.Services
{
    public class RegistryService
    {
        private readonly AppDbContext _db;

        public RegistryService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<List<Registry>> GetRegistriesAsync()
        {
            return await _db.Registries.ToListAsync();
        }
    }
}
