using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
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
