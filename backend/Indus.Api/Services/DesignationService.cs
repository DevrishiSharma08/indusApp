using Indus.Api.Interfaces;
using Indus.Api.Models;

namespace Indus.Api.Services
{
    public class DesignationService : IDesignationService
    {
        private readonly IDesignationRepository _designationRepository;

        public DesignationService(IDesignationRepository designationRepository)
        {
            _designationRepository = designationRepository;
        }

        public async Task<IEnumerable<Designation>> GetAllDesignationsAsync()
        {
            return await _designationRepository.GetAllAsync();
        }

        public async Task<Designation?> GetDesignationByIdAsync(int designationId)
        {
            return await _designationRepository.GetByIdAsync(designationId);
        }
    }
}
