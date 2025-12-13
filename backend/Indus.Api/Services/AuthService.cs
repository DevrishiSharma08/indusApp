using Indus.Api.Models;
using Indus.Api.Interfaces;
using Indus.Api.Controllers;

// Ensure the namespace is exactly this
namespace Indus.Api.Services
{
    public class AuthService
    {
        private readonly IEmployeeRepository _employeeRepository;

        public AuthService(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }

  public async Task<Employee?> RegisterAsync(string fullName, string email, string password, int roleID, int departmentID, int designationID)
{
    var existingUser = await _employeeRepository.GetByEmailAsync(email);
    if (existingUser != null) return null;

    var newEmployee = new Employee
    {
        FullName = fullName,
        Email = email,
        PasswordHash = password,
        RoleID = roleID,
        DepartmentID = departmentID,
        DesignationID = designationID,
        DateOfJoining = DateTime.UtcNow,
        Status = "Active",
        IsActive = true,
        IsLoginEnabled = true,
        CreatedAt = DateTime.UtcNow
    };

    return await _employeeRepository.AddAsync(newEmployee);
}


        public async Task<LoginResult> LoginAsync(string email, string password)
        {
            var employee = await _employeeRepository.GetByEmailAsync(email);

            // Case 1: User not found or password doesn't match (plain text comparison)
            if (employee == null || employee.PasswordHash != password)
            {
                return new LoginResult(false, "Invalid email or password.");
            }

            // Case 2: User found but account is inactive
            if (!employee.IsActive)
            {
                return new LoginResult(false, "Your account is inactive. Please contact the administrator.");
            }

            // Case 3: Login successful
            return new LoginResult(true, "Login successful", employee);
        }
    
    }
}