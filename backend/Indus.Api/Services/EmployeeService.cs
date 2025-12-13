using Indus.Api.Data;
using Indus.Api.Interfaces;
using Indus.Api.Models;
using Microsoft.Data.SqlClient;

namespace Indus.Api.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _employeeRepository;
        private readonly DatabaseConnection _dbConnection;

        public EmployeeService(IEmployeeRepository employeeRepository, DatabaseConnection dbConnection)
        {
            _employeeRepository = employeeRepository;
            _dbConnection = dbConnection;
        }

        public async Task<IEnumerable<Employee>> GetAllEmployeesAsync()
        {
            return await _employeeRepository.GetAllAsync();
        }

        public async Task<Employee?> GetEmployeeByIdAsync(int employeeId)
        {
            return await _employeeRepository.GetByIdAsync(employeeId);
        }

        public async Task<Employee?> GetEmployeeByEmailAsync(string email)
        {
            return await _employeeRepository.GetByEmailAsync(email);
        }

        public async Task<Employee> CreateEmployeeAsync(Employee employee)
        {
            return await _employeeRepository.AddAsync(employee);
        }

        public async Task UpdateEmployeeAsync(Employee employee)
        {
            await _employeeRepository.UpdateAsync(employee);
        }

        public async Task<int> GetTotalEmployeesCountAsync()
        {
            using (SqlConnection conn = _dbConnection.GetConnection())
            {
                await conn.OpenAsync();
                using (SqlCommand cmd = new SqlCommand("SELECT COUNT(*) FROM Employees", conn))
                {
                    return (int)await cmd.ExecuteScalarAsync();
                }
            }
        }

        public async Task<int> GetActiveEmployeesCountAsync()
        {
            using (SqlConnection conn = _dbConnection.GetConnection())
            {
                await conn.OpenAsync();
                using (SqlCommand cmd = new SqlCommand("SELECT COUNT(*) FROM Employees WHERE IsActive = 1", conn))
                {
                    return (int)await cmd.ExecuteScalarAsync();
                }
            }
        }

        public async Task<int> GetNewEmployeesThisMonthAsync()
        {
            using (SqlConnection conn = _dbConnection.GetConnection())
            {
                await conn.OpenAsync();
                using (SqlCommand cmd = new SqlCommand(
                    "SELECT COUNT(*) FROM Employees WHERE MONTH(DateOfJoining) = @Month AND YEAR(DateOfJoining) = @Year", conn))
                {
                    cmd.Parameters.AddWithValue("@Month", DateTime.UtcNow.Month);
                    cmd.Parameters.AddWithValue("@Year", DateTime.UtcNow.Year);
                    return (int)await cmd.ExecuteScalarAsync();
                }
            }
        }
    }
}
