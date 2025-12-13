using Indus.Api.Models;

namespace Indus.Api.Interfaces
{
    public interface IDepartmentRepository
    {
        Task<IEnumerable<Department>> GetAllAsync();
        Task<Department?> GetByIdAsync(int departmentId);
        Task<int> CountAsync();
    }
}
