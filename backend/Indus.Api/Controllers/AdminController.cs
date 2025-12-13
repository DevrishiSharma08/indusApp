// File: Controllers/AdminController.cs

using Indus.Api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Indus.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")] // <-- Sabse important: Poora controller sirf "Admin" role waale users ke liye secure hai
public class AdminController : ControllerBase
{
    private readonly IEmployeeRepository _employeeRepository;

    // Dependency Injection ke through repository ko access karein
    public AdminController(IEmployeeRepository employeeRepository)
    {
        _employeeRepository = employeeRepository;
    }

    // Task 3.1: Saare users ki list dekhne ke liye endpoint
    // GET /api/admin/users
    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var employees = await _employeeRepository.GetAllAsync();

        // Employee objects ko UserDto mein convert karein taaki password hash expose na ho
        var usersDto = employees.Select(e => new UserDto(
            e.EmployeeID,
            e.FullName,
            e.Email,
            e.IsActive,
            e.Role.RoleName // Humne .Include(e => e.Role) kiya tha isliye ye available hai
        ));

        return Ok(usersDto);
    }

    // PUT /api/admin/users/{id}/role
    [HttpPut("users/{id}/role")]
    public async Task<IActionResult> UpdateUserRole(int id, [FromBody] UpdateUserRoleDto dto)
    {
        // Step 1: User ko database se fetch karein
        var employee = await _employeeRepository.GetByIdAsync(id);
        if (employee == null)
        {
            return NotFound(new { message = "User not found." });
        }

        // Step 2: User ka RoleID update karein
        employee.RoleID = dto.RoleID;

        // Step 3: Database mein changes save karein
        await _employeeRepository.UpdateAsync(employee);

        return Ok(new { message = "User role updated successfully." });
    } 
    
       // PUT /api/admin/users/{id}/status
    [HttpPut("users/{id}/status")]
    public async Task<IActionResult> UpdateUserStatus(int id, [FromBody] UpdateUserStatusDto dto)
    {
        // Step 1: User ko database se fetch karein
        var employee = await _employeeRepository.GetByIdAsync(id);
        if (employee == null)
        {
            return NotFound(new { message = "User not found." });
        }

        // Step 2: User ka IsActive status update karein
        employee.IsActive = dto.IsActive;

        // Step 3: Database mein changes save karein
        await _employeeRepository.UpdateAsync(employee);

        return Ok(new { message = "User status updated successfully." });
    }

}