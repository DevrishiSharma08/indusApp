using Indus.Api.Models;

namespace Indus.Api.Interfaces
{
    public interface IEmployeeService
    {
        Task<IEnumerable<Employee>> GetAllEmployeesAsync();
        Task<Employee?> GetEmployeeByIdAsync(int employeeId);
        Task<Employee?> GetEmployeeByEmailAsync(string email);
        Task<Employee> CreateEmployeeAsync(Employee employee);
        Task UpdateEmployeeAsync(Employee employee);
        Task<int> GetTotalEmployeesCountAsync();
        Task<int> GetActiveEmployeesCountAsync();
        Task<int> GetNewEmployeesThisMonthAsync();
    }
}
