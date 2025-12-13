# Backend - Indus Internal App API

ASP.NET Core 8.0 Web API with ADO.NET for employee management system.

## 📁 Project Structure

```
backend/Indus.Api/
├── Controllers/          # API Endpoints
│   ├── AuthController.cs        # Login, Register, Logout
│   ├── AdminController.cs       # User management (Admin only)
│   ├── EmployeesController.cs   # Employee CRUD operations
│   ├── DepartmentsController.cs # Department management
│   ├── DesignationsController.cs# Designation management
│   ├── AuthDtos.cs             # Login/Register DTOs
│   └── EmployeeDtos.cs         # Employee DTOs
│
├── Models/               # Database Models (Entities)
│   ├── Employee.cs             # Main employee entity
│   ├── Role.cs                 # User roles (Admin, HR, Manager, Employee)
│   ├── Department.cs           # Company departments
│   ├── Designation.cs          # Job titles
│   ├── BankDetails.cs          # Employee bank information
│   ├── SalaryDetails.cs        # Salary breakdown
│   ├── FamilyMember.cs         # Family information
│   └── EmployeeDocument.cs     # Document management
│
├── Services/             # Business Logic Layer
│   └── AuthService.cs          # Authentication logic, password hashing
│
├── Repositories/         # Data Access Layer (ADO.NET)
│   ├── IEmployeeRepository.cs  # Interface for employee data access
│   ├── EmployeeRepositoryAdo.cs# ADO.NET implementation
│   ├── IDepartmentRepository.cs# Interface for department data access
│   └── DepartmentRepositoryAdo.cs# ADO.NET implementation
│
├── Data/                 # Database Configuration
│   └── DatabaseConnection.cs   # SQL Server connection management
│
└── Program.cs            # App configuration & DI setup
```

---

## 🔄 Application Flow

### 1️⃣ **Startup Flow (Program.cs)**

```
Application Start
    ↓
Register Services (Dependency Injection)
    ├── DatabaseConnection (Singleton)
    ├── Repositories (Scoped)
    ├── AuthService (Scoped)
    └── Authentication (Cookie-based)
    ↓
Configure Middleware
    ├── CORS (Allow frontend localhost:3000)
    ├── Authentication & Authorization
    ├── Controllers
    └── Swagger (Development only)
    ↓
App Running on https://localhost:7000
```

### 2️⃣ **Request Flow (API Call)**

```
HTTP Request from Frontend
    ↓
[Middleware Pipeline]
    ├── CORS Check
    ├── Authentication Check ([Authorize] attribute)
    └── Route to Controller
    ↓
[Controller Layer] - API Endpoints
    ├── Validate Request
    ├── Call Service/Repository
    └── Return Response (200, 400, 401, etc.)
    ↓
[Service Layer] - Business Logic
    ├── Password Hashing (BCrypt)
    ├── Validation
    └── Call Repository
    ↓
[Repository Layer] - Database Access
    ├── Execute SQL Commands (ADO.NET)
    ├── Map Data to Models
    └── Return Results
    ↓
[Database] - SQL Server
    ↓
Response sent back to Frontend
```

---

## 🔐 Authentication Flow

### **Register Flow**
```
POST /api/auth/register
    ↓
AuthController.Register()
    ├── Validate input (RegisterDto)
    ├── Call AuthService.RegisterAsync()
    │   ├── Check if email already exists
    │   ├── Hash password using BCrypt
    │   ├── Insert into Employees table
    │   └── Return Employee object
    └── Return 200 OK / 400 Bad Request
```

### **Login Flow**
```
POST /api/auth/login
    ↓
AuthController.Login()
    ├── Validate input (LoginDto)
    ├── Call AuthService.LoginAsync()
    │   ├── Find user by email
    │   ├── Verify password with BCrypt
    │   ├── Check if account is active
    │   └── Return login result
    ├── Create Claims (EmployeeID, Email, Role)
    ├── Sign in with Cookie Authentication
    └── Return 200 OK / 401 Unauthorized
```

### **Protected Endpoint Flow**
```
GET /api/employees (with [Authorize] attribute)
    ↓
Check if Cookie exists
    ├── No Cookie → Return 401 Unauthorized
    └── Valid Cookie → Allow access
    ↓
Check Role (if [Authorize(Roles = "Admin")])
    ├── Wrong Role → Return 403 Forbidden
    └── Correct Role → Execute endpoint
```

---

## 🗄️ Database Architecture (ADO.NET)

### **Connection Management**
```csharp
// DatabaseConnection.cs
public class DatabaseConnection
{
    private readonly string _connectionString;

    public SqlConnection GetConnection()
    {
        return new SqlConnection(_connectionString);
    }
}
```

### **Repository Pattern**
```
IEmployeeRepository (Interface)
    ↓
EmployeeRepositoryAdo (Implementation)
    ├── GetAllAsync() - Fetch all employees
    ├── GetByIdAsync() - Fetch single employee
    ├── CreateAsync() - Insert new employee
    ├── UpdateAsync() - Update employee
    ├── DeleteAsync() - Delete employee
    └── GetByEmailAsync() - Find by email
```

### **ADO.NET Query Example**
```csharp
public async Task<Employee?> GetByEmailAsync(string email)
{
    using var conn = _db.GetConnection();
    await conn.OpenAsync();

    string sql = @"SELECT EmployeeID, FullName, Email, PasswordHash, RoleID, IsActive, ...
                   FROM Employees WHERE Email = @Email";

    using var cmd = new SqlCommand(sql, conn);
    cmd.Parameters.AddWithValue("@Email", email);

    using var reader = await cmd.ExecuteReaderAsync();
    if (await reader.ReadAsync())
    {
        return new Employee
        {
            EmployeeID = reader.GetInt32(0),
            FullName = reader.GetString(1),
            Email = reader.GetString(2),
            // ... map all fields
        };
    }
    return null;
}
```

---

## 🛠️ API Endpoints Overview

### **Authentication APIs**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | ❌ No |
| POST | `/api/auth/login` | Login user | ❌ No |
| POST | `/api/auth/logout` | Logout user | ✅ Yes |

### **Admin APIs**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/users` | Get all employees | ✅ Admin only |
| PUT | `/api/admin/users/{id}/role` | Update user role | ✅ Admin only |
| PUT | `/api/admin/users/{id}/status` | Activate/Deactivate user | ✅ Admin only |

### **Employee APIs**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/employees` | Get all employees (with filters) | ✅ Yes |
| GET | `/api/employees/{id}` | Get employee by ID | ✅ Yes |
| POST | `/api/employees` | Create new employee | ✅ Yes |
| PUT | `/api/employees/{id}` | Update employee | ✅ Yes |
| DELETE | `/api/employees/{id}` | Delete employee | ✅ Yes |
| GET | `/api/employees/stats` | Get employee statistics | ✅ Yes |

### **Department APIs**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/departments` | Get all departments | ✅ Yes |
| POST | `/api/departments` | Create department | ✅ Yes |
| PUT | `/api/departments/{id}` | Update department | ✅ Yes |
| DELETE | `/api/departments/{id}` | Delete department | ✅ Yes |

### **Designation APIs**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/designations` | Get all designations | ✅ Yes |
| POST | `/api/designations` | Create designation | ✅ Yes |
| PUT | `/api/designations/{id}` | Update designation | ✅ Yes |
| DELETE | `/api/designations/{id}` | Delete designation | ✅ Yes |

---

## 🔧 Configuration

### **appsettings.json / appsettings.Development.json**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=IndusInternalDb;Trusted_Connection=true"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

### **CORS Configuration**
```csharp
// Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // Important for cookies
    });
});
```

### **Cookie Authentication Configuration**
```csharp
// Program.cs
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.Name = "IndusApp.AuthCookie";
        options.ExpireTimeSpan = TimeSpan.FromHours(8);
        options.SlidingExpiration = true;
        options.Events.OnRedirectToLogin = context =>
        {
            context.Response.StatusCode = 401; // Return 401 instead of redirect
            return Task.CompletedTask;
        };
    });
```

---

## 📦 Dependencies

```xml
<PackageReference Include="BCrypt.Net-Next" Version="4.0.3" />
<PackageReference Include="Microsoft.Data.SqlClient" Version="5.2.2" />
<PackageReference Include="Swashbuckle.AspNetCore" Version="6.4.0" />
```

### **Why these packages?**
- **BCrypt.Net-Next**: Secure password hashing
- **Microsoft.Data.SqlClient**: ADO.NET SQL Server connectivity
- **Swashbuckle.AspNetCore**: Swagger/OpenAPI documentation

---

## 🚀 How to Run

### **1. Setup Database**
```bash
# Navigate to backend folder
cd backend/Indus.Api

# Update connection string in appsettings.Development.json
# Then run SQL scripts from database/ folder to create tables
```

### **2. Restore Dependencies**
```bash
dotnet restore
```

### **3. Run the Application**
```bash
# Development mode
dotnet run

# Or with watch mode (auto-restart on file changes)
dotnet watch run
```

### **4. Access Swagger**
```
https://localhost:7000/swagger
```

---

## 🎯 Key Concepts

### **Dependency Injection (DI)**
```csharp
// Program.cs - Register services
builder.Services.AddSingleton<DatabaseConnection>();
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepositoryAdo>();
builder.Services.AddScoped<AuthService>();

// Controller - Inject services
public class EmployeesController : ControllerBase
{
    private readonly IEmployeeRepository _repository;

    public EmployeesController(IEmployeeRepository repository)
    {
        _repository = repository; // DI automatically provides instance
    }
}
```

### **DTO (Data Transfer Object) Pattern**
```csharp
// AuthDtos.cs
public record LoginDto(string Email, string Password);
public record RegisterDto(string FullName, string Email, string Password, int RoleID, ...);

// Why? Separate API contracts from database models
// - Validation
// - Security (don't expose PasswordHash)
// - Flexibility (API can change without changing DB)
```

### **Repository Pattern**
```
Separation of Concerns:
- Controller: HTTP handling, routing
- Service: Business logic, validation
- Repository: Database access only
- Model: Data structure

Benefits:
✅ Testable (mock repositories)
✅ Maintainable (change DB without touching controllers)
✅ Reusable (same repo used by multiple services)
```

---

## 🔒 Security Features

1. **Password Hashing**: BCrypt with salt (never store plain passwords)
2. **Cookie Authentication**: Secure, HTTP-only cookies
3. **Role-based Authorization**: Admin, HR, Manager, Employee roles
4. **CORS Protection**: Only allow trusted frontend origin
5. **Account Status Check**: Inactive accounts can't login

---

## 📝 Common Tasks

### **Add New Endpoint**
1. Create method in Controller
2. Add `[HttpGet/Post/Put/Delete]` attribute
3. Add `[Authorize]` if protected
4. Call Service/Repository
5. Return appropriate HTTP status code

### **Add New Repository Method**
1. Add method signature in Interface (e.g., IEmployeeRepository)
2. Implement in ADO.NET class (e.g., EmployeeRepositoryAdo)
3. Write SQL query
4. Map SqlDataReader to Model
5. Handle exceptions

### **Add New Model**
1. Create class in Models/ folder
2. Add properties matching database columns
3. Register in DatabaseConnection if needed
4. Create repository if complex queries needed

---

## 🐛 Troubleshooting

**Database Connection Error**
```
Check appsettings.Development.json connection string
Ensure SQL Server is running
Verify database exists
```

**401 Unauthorized Error**
```
Check if user is logged in (cookie exists)
Verify [Authorize] attribute on endpoint
Check role requirements [Authorize(Roles = "Admin")]
```

**CORS Error**
```
Verify frontend URL in Program.cs CORS policy
Ensure AllowCredentials() is set
Check if using correct port (3000)
```

---

## 📚 Additional Resources

- [ASP.NET Core Documentation](https://learn.microsoft.com/en-us/aspnet/core/)
- [ADO.NET Tutorial](https://learn.microsoft.com/en-us/dotnet/framework/data/adonet/)
- [Cookie Authentication](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/cookie)
- [Repository Pattern](https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/infrastructure-persistence-layer-design)

---

**Happy Coding! 🚀**
