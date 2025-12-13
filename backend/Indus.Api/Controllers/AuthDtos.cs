using Indus.Api.Models;

namespace Indus.Api.Controllers;

public record RegisterDto(string FullName, string Email, string Password,int RoleID,   int DepartmentID, int DesignationID);
public record LoginDto(string Email, string Password);
public record UserDto(int EmployeeID, string FullName, string Email, bool IsActive, string RoleName);
public record UpdateUserRoleDto(int RoleID);
public record UpdateUserStatusDto(bool IsActive); 
public record LoginResult(bool IsSuccess, string Message, Employee? Employee = null);