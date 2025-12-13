using Indus.Api.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Indus.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentsController : ControllerBase
    {
        private readonly IDepartmentService _departmentService;

        public DepartmentsController(IDepartmentService departmentService)
        {
            _departmentService = departmentService;
        }

        [HttpGet]
        public async Task<IActionResult> GetDepartments()
        {
            var departments = await _departmentService.GetAllDepartmentsAsync();

            var result = departments.Select(d => new
            {
                id = d.DepartmentID,
                name = d.DepartmentName
            });

            return Ok(result);
        }
    }
}
