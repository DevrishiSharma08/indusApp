# EmployeesController Conversion TODO

## Status: NEEDS MANUAL CONVERSION

The `EmployeesController.cs` file is the most complex controller and requires careful conversion to ADO.NET.

## Current State
- Uses DbContext directly with complex LINQ queries
- Has multiple JOIN operations (Include statements)
- Uses transactions for employee creation
- Returns nested objects (BankDetails, SalaryDetails, FamilyMembers)

## Endpoints that Need Conversion:

### 1. GET /api/employees/stats
- Queries: Multiple COUNT queries
- Tables: Employees, Departments

### 2. GET /api/employees
- Queries: Complex SELECT with multiple JOINs and WHERE clauses
- Tables: Employees, Departments, Designations, ReportingManager (self-join)

### 3. POST /api/employees
- Uses transaction
- Inserts into: Employees, BankDetails, SalaryDetails, FamilyMembers
- Returns nested object

### 4. GET /api/employees/{id}
- Queries: SELECT with 6 JOINs
- Returns: Full employee object with all related data

### 5. GET /api/employees/departments
- Simple SELECT from Departments

### 6. GET /api/employees/designations
- Simple SELECT from Designations

### 7. GET /api/employees/managers
- SELECT with JOINs to Departments and Designations

### 8. GET /api/employees/roles
- Simple SELECT from Roles

## Conversion Options:

### Option 1: Create Comprehensive Repository (RECOMMENDED)
Create `IEmployeeExtendedRepository` with methods like:
- `GetEmployeesWithFiltersAsync(search, department, status)`
- `GetEmployeeWithDetailsAsync(id)` - returns employee with all related data
- `CreateEmployeeWithDetailsAsync(employee, bankDetails, salaryDetails, familyMembers)`
- `GetStatsAsync()`

### Option 2: Convert to Direct ADO.NET in Controller
Write SQL queries directly in the controller methods.

### Option 3: Partial Conversion
- Keep simple endpoints (departments, designations, roles)
- Convert complex ones gradually

## Suggested Approach:

1. Start with simple endpoints (managers, roles) - just SELECT queries
2. Convert GET /api/employees (complex JOIN but no transaction)
3. Convert GET /api/employees/stats (multiple simple queries)
4. Finally convert POST /api/employees (requires transaction handling)

## Example: Converting GET /api/employees/managers

**Before:**
```csharp
[HttpGet("managers")]
public async Task<IActionResult> GetManagers()
{
    var managers = await _context.Employees
        .Where(e => e.IsActive)
        .Select(e => new {
            Id = e.EmployeeID,
            Name = e.FullName,
            Department = e.Department.DepartmentName,
            Designation = e.Designation.DesignationName
        })
        .ToListAsync();

    return Ok(managers);
}
```

**After:**
```csharp
[HttpGet("managers")]
public async Task<IActionResult> GetManagers()
{
    List<object> managers = new List<object>();

    using (SqlConnection conn = _dbConnection.GetConnection())
    {
        await conn.OpenAsync();

        string query = @"
            SELECT
                e.EmployeeID,
                e.FullName,
                d.DepartmentName,
                des.DesignationName
            FROM Employees e
            INNER JOIN Departments d ON e.DepartmentID = d.DepartmentID
            INNER JOIN Designations des ON e.DesignationID = des.DesignationID
            WHERE e.IsActive = 1
            ORDER BY e.FullName";

        using (SqlCommand cmd = new SqlCommand(query, conn))
        {
            using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
            {
                while (await reader.ReadAsync())
                {
                    managers.Add(new
                    {
                        Id = reader.GetInt32(0),
                        Name = reader.GetString(1),
                        Department = reader.GetString(2),
                        Designation = reader.GetString(3)
                    });
                }
            }
        }
    }

    return Ok(managers);
}
```

## Important Notes:

1. **Transaction Example** for POST endpoint:
```csharp
using (SqlConnection conn = _dbConnection.GetConnection())
{
    await conn.OpenAsync();
    using (SqlTransaction transaction = conn.BeginTransaction())
    {
        try
        {
            // Insert employee
            string insertEmployeeQuery = "INSERT INTO Employees (...) VALUES (...); SELECT CAST(SCOPE_IDENTITY() AS INT);";
            SqlCommand cmd1 = new SqlCommand(insertEmployeeQuery, conn, transaction);
            int newEmployeeId = (int)await cmd1.ExecuteScalarAsync();

            // Insert bank details
            string insertBankQuery = "INSERT INTO BankDetails (...) VALUES (...)";
            SqlCommand cmd2 = new SqlCommand(insertBankQuery, conn, transaction);
            cmd2.Parameters.AddWithValue("@EmployeeID", newEmployeeId);
            await cmd2.ExecuteNonQueryAsync();

            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}
```

2. **NULL Handling** is critical for optional fields
3. **Parameter binding** prevents SQL injection
4. **Test thoroughly** - this is the most important controller

## Priority: LOW

The application can function with just AuthController and AdminController working.
Convert EmployeesController when you need those specific features.
