using Indus.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;

// Namespace ko is tarah se likhein (bina curly braces ke)
namespace Indus.Api.Controllers;
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
           var employee = await _authService.RegisterAsync(
        dto.FullName,
        dto.Email,
        dto.Password,
        dto.RoleID,
        dto.DepartmentID,
        dto.DesignationID
    );

        if (employee == null)
        {
            return BadRequest("User with this email already exists.");
        }
        return Ok(new { message = "User registered successfully", userId = employee.EmployeeID });
    }

       [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        // Step 1: Service ko call karein aur result prapt karein
        var result = await _authService.LoginAsync(dto.Email, dto.Password);

        // Step 2: Agar login safal nahi hai, to service se mila message return karein
        if (!result.IsSuccess)
        {
            // Ab message dynamic hai (ya to "Invalid..." ya "Your account is inactive...")
            return Unauthorized(new { message = result.Message });
        }

        // Step 3: Agar login safal hai, to cookie set karein aur success response bhejein
        var employee = result.Employee!; // Hum jante hain ki success ke case mein Employee null nahi hoga

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, employee.EmployeeID.ToString()),
            new Claim(ClaimTypes.Name, employee.FullName),
            new Claim(ClaimTypes.Email, employee.Email),
            new Claim(ClaimTypes.Role, employee.Role.RoleName)
        };

        var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        var authProperties = new AuthenticationProperties { IsPersistent = true, ExpiresUtc = DateTimeOffset.UtcNow.AddHours(8) };

        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity), authProperties);

        return Ok(new { message = result.Message, user = new { id = employee.EmployeeID, fullName = employee.FullName, role = employee.Role.RoleName } });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return Ok(new { message = "Logout successful" });
    }
}