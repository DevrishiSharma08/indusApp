using Indus.Api.Data;
using Indus.Api.Models;
using Microsoft.EntityFrameworkCore;

// Ensure the namespace is exactly this
namespace Indus.Api.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly IndusDbContext _context;

        public EmployeeRepository(IndusDbContext context)
        {
            _context = context;
        }

        public async Task<Employee?> GetByEmailAsync(string email)
        {
            return await _context.Employees
                .Include(e => e.Role)
                .FirstOrDefaultAsync(e => e.Email == email);
        }

        public async Task<Employee> AddAsync(Employee employee)
        {
            await _context.Employees.AddAsync(employee);
            await _context.SaveChangesAsync();
            return employee;
        }
        public async Task<IEnumerable<Employee>> GetAllAsync()
        {
            return await _context.Employees
                .Include(e => e.Role) // Role ki details bhi saath mein fetch karein
                .ToListAsync();
        } 
            // Yeh naya method implement karein
        public async Task<Employee?> GetByIdAsync(int employeeId)
        {
            return await _context.Employees.FindAsync(employeeId);
        }

        // Yeh naya method implement karein
        public async Task UpdateAsync(Employee employee)
        {
            _context.Employees.Update(employee);
            await _context.SaveChangesAsync();
        }

    }
}