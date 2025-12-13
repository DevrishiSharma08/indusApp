using Indus.Api.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Indus.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DesignationsController : ControllerBase
    {
        private readonly IDesignationService _designationService;

        public DesignationsController(IDesignationService designationService)
        {
            _designationService = designationService;
        }

        // GET: /api/designations
        /// <summary>
        /// Gets a list of all designations for use in UI dropdowns.
        /// </summary>
        /// <returns>A list of designation objects with id and name.</returns>
        [HttpGet]
        public async Task<IActionResult> GetDesignations()
        {
            var designations = await _designationService.GetAllDesignationsAsync();

            var result = designations.Select(d => new
            {
                id = d.DesignationID,
                name = d.DesignationName
            });

            return Ok(result);
        }
    }
}