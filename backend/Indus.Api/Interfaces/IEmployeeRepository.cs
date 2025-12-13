using Indus.Api.Models;

namespace Indus.Api.Interfaces
{
    public interface IEmployeeRepository
    {
        Task<Employee?> GetByEmailAsync(string email);
        Task<Employee> AddAsync(Employee employee);
        Task<IEnumerable<Employee>> GetAllAsync();
        Task<Employee?> GetByIdAsync(int employeeId);
        Task UpdateAsync(Employee employee);
    }
}
