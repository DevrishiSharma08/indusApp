using Indus.Api.Models;

namespace Indus.Api.Interfaces
{
    public interface IDesignationRepository
    {
        Task<IEnumerable<Designation>> GetAllAsync();
        Task<Designation?> GetByIdAsync(int designationId);
    }
}
