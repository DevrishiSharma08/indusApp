using Indus.Api.Models;

namespace Indus.Api.Interfaces
{
    public interface IDepartmentService
    {
        Task<IEnumerable<Department>> GetAllDepartmentsAsync();
        Task<Department?> GetDepartmentByIdAsync(int departmentId);
        Task<int> GetDepartmentsCountAsync();
    }
}
