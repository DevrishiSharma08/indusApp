using Indus.Api.Interfaces;
using Indus.Api.Models;

namespace Indus.Api.Services
{
    public class DepartmentService : IDepartmentService
    {
        private readonly IDepartmentRepository _departmentRepository;

        public DepartmentService(IDepartmentRepository departmentRepository)
        {
            _departmentRepository = departmentRepository;
        }

        public async Task<IEnumerable<Department>> GetAllDepartmentsAsync()
        {
            return await _departmentRepository.GetAllAsync();
        }

        public async Task<Department?> GetDepartmentByIdAsync(int departmentId)
        {
            return await _departmentRepository.GetByIdAsync(departmentId);
        }

        public async Task<int> GetDepartmentsCountAsync()
        {
            return await _departmentRepository.CountAsync();
        }
    }
}
