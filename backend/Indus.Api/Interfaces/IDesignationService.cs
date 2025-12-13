using Indus.Api.Models;

namespace Indus.Api.Interfaces
{
    public interface IDesignationService
    {
        Task<IEnumerable<Designation>> GetAllDesignationsAsync();
        Task<Designation?> GetDesignationByIdAsync(int designationId);
    }
}
