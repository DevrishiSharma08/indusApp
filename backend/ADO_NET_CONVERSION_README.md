# ADO.NET Conversion Complete Guide

## Overview
Your backend has been converted from Entity Framework Core to pure ADO.NET with SQL queries.

## What Was Changed

### 1. **Package Dependencies** ([Indus.Api.csproj](backend/Indus.Api/Indus.Api.csproj))
- ❌ Removed: Entity Framework Core packages
- ✅ Added: `Microsoft.Data.SqlClient` v5.2.0

### 2. **Database Scripts** (New folder: `database/`)
- **CreateTables.sql**: Complete database schema with all tables, indexes, and relationships
- **SeedData.sql**: Initial data (roles, departments, designations, sample users)

### 3. **New Infrastructure**
- **DatabaseConnection.cs**: Manages SQL Server connections
- **EmployeeRepositoryAdo.cs**: Pure ADO.NET implementation of employee operations
- **DepartmentRepositoryAdo.cs**: Pure ADO.NET implementation for departments

### 4. **Removed Files** (To be deleted)
- ❌ `Data/IndusDbContext.cs`
- ❌ `Data/DbContextFactory.cs`
- ❌ `Repositories/EmployeeRepository.cs` (old EF version)
- ❌ `Migrations/` folder (entire folder)

### 5. **Updated Files**
- **Program.cs**: Changed from EF DbContext to ADO.NET connection
- Models remain the same (no changes needed)

---

## Setup Instructions

### Step 1: Run Database Scripts

**Option A: Using SQL Server Management Studio (SSMS)**
1. Open SSMS and connect to your SQL Server
2. Open and execute `database/CreateTables.sql`
3. Open and execute `database/SeedData.sql`

**Option B: Using sqlcmd (Command Line)**
```bash
cd database
sqlcmd -S (localdb)\mssqllocaldb -i CreateTables.sql
sqlcmd -S (localdb)\mssqllocaldb -i SeedData.sql
```

### Step 2: Verify Connection String

Check `backend/Indus.Api/appsettings.Development.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=IndusInternalDb;Trusted_Connection=true"
  }
}
```

### Step 3: Clean and Restore Backend

```bash
cd backend/Indus.Api
dotnet clean
dotnet restore
dotnet build
```

### Step 4: Run Backend

```bash
cd backend/Indus.Api
dotnet run
```

Backend will start on:
- HTTP: `http://localhost:5153`
- HTTPS: `https://localhost:7000`

---

## What Still Needs Conversion

The following controllers still use DbContext directly and need manual conversion:

### Controllers to Convert:
1. **DesignationsController.cs** - Uses `_context.Designations`
2. **DepartmentsController.cs** - Uses `_context.Departments`
3. **EmployeesController.cs** - Uses `_context` for complex queries with transactions

### How to Convert Them:

#### Option 1: Create Additional Repositories (Recommended)
Create repositories for Designations, Roles, etc. following the pattern in `EmployeeRepositoryAdo.cs`

#### Option 2: Direct ADO.NET in Controllers (Quick Fix)
Inject `DatabaseConnection` directly into controllers and write SQL queries there.

---

## Example: Converting DesignationsController

**Before (Entity Framework):**
```csharp
public class DesignationsController : ControllerBase
{
    private readonly IndusDbContext _context;

    public DesignationsController(IndusDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetDesignations()
    {
        var designations = await _context.Designations
            .Select(d => new { id = d.DesignationID, name = d.DesignationName })
            .ToListAsync();
        return Ok(designations);
    }
}
```

**After (Pure ADO.NET):**
```csharp
public class DesignationsController : ControllerBase
{
    private readonly DatabaseConnection _dbConnection;

    public DesignationsController(DatabaseConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    [HttpGet]
    public async Task<IActionResult> GetDesignations()
    {
        List<object> designations = new List<object>();

        using (SqlConnection conn = _dbConnection.GetConnection())
        {
            await conn.OpenAsync();

            string query = "SELECT DesignationID, DesignationName FROM Designations ORDER BY DesignationName";

            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        designations.Add(new
                        {
                            id = reader.GetInt32(0),
                            name = reader.GetString(1)
                        });
                    }
                }
            }
        }

        return Ok(designations);
    }
}
```

---

## Testing the API

### Default Test Users (from SeedData.sql)

| Email | Password | Role |
|-------|----------|------|
| admin@indus.com | Admin@123 | Admin |
| priya.sharma@indus.com | Hr@123 | HR |
| rajesh.kumar@indus.com | Manager@123 | Manager |
| amit.patel@indus.com | Employee@123 | Employee |

### Test Endpoints:

**1. Login**
```bash
POST http://localhost:5153/api/auth/login
Content-Type: application/json

{
  "email": "admin@indus.com",
  "password": "Admin@123"
}
```

**2. Get All Users (Admin only)**
```bash
GET http://localhost:5153/api/admin/users
```

**3. Get Departments**
```bash
GET http://localhost:5153/api/departments
```

---

## Key Differences: EF Core vs ADO.NET

| Feature | Entity Framework | ADO.NET |
|---------|-----------------|---------|
| **Query Style** | LINQ (C# syntax) | Raw SQL strings |
| **Object Mapping** | Automatic | Manual with SqlDataReader |
| **Relationships** | Automatic with `.Include()` | Manual with JOIN queries |
| **Migrations** | Code-first migrations | Manual SQL scripts |
| **Transactions** | `_context.Database.BeginTransaction()` | `SqlConnection.BeginTransaction()` |
| **Performance** | Slightly slower (overhead) | Faster (direct SQL) |
| **Code Verbosity** | Less code | More code |
| **SQL Control** | Limited | Full control |

---

## Advantages of ADO.NET

✅ **Better Performance**: No ORM overhead
✅ **Full SQL Control**: Write optimized queries
✅ **Simpler Debugging**: See exact SQL being executed
✅ **No Migration Complexity**: Direct database changes
✅ **Smaller Package Size**: Fewer dependencies

## Disadvantages of ADO.NET

❌ **More Boilerplate Code**: Manual mapping required
❌ **SQL Injection Risk**: Must use parameterized queries carefully
❌ **No Type Safety**: SQL queries are strings
❌ **Manual Schema Management**: No automatic migrations
❌ **More Testing Needed**: More code paths to test

---

## Common ADO.NET Patterns

### 1. Safe Parameter Handling (Prevent SQL Injection)
```csharp
// ✅ CORRECT - Parameterized
cmd.Parameters.AddWithValue("@Email", email);

// ❌ WRONG - SQL Injection Risk
string query = $"SELECT * FROM Users WHERE Email = '{email}'";
```

### 2. Handling NULL Values
```csharp
// When reading from database
string? value = reader.IsDBNull(ordinal) ? null : reader.GetString(ordinal);

// When inserting to database
cmd.Parameters.AddWithValue("@PhoneNumber", (object?)phoneNumber ?? DBNull.Value);
```

### 3. Transactions
```csharp
using (SqlConnection conn = _dbConnection.GetConnection())
{
    await conn.OpenAsync();
    using (SqlTransaction transaction = conn.BeginTransaction())
    {
        try
        {
            // Execute multiple commands
            await cmd1.ExecuteNonQueryAsync();
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

### 4. Getting Auto-Generated IDs
```csharp
string query = @"
    INSERT INTO Employees (FullName, Email) VALUES (@FullName, @Email);
    SELECT CAST(SCOPE_IDENTITY() AS INT);";

int newId = (int)await cmd.ExecuteScalarAsync();
```

---

## Troubleshooting

### Error: "Cannot open database"
**Solution**: Run `CreateTables.sql` first

### Error: "Package 'Microsoft.Data.SqlClient' not found"
**Solution**:
```bash
cd backend/Indus.Api
dotnet restore
```

### Error: "Invalid column name"
**Solution**: Check that your SQL scripts created all columns. Re-run `CreateTables.sql`

### Error: "Login failed for user"
**Solution**: Update connection string in `appsettings.Development.json` with correct server name

---

## Next Steps

1. ✅ Run database scripts (`CreateTables.sql` and `SeedData.sql`)
2. ✅ Test login endpoint with default users
3. ⏳ Convert remaining controllers (Designations, Departments, Employees)
4. ⏳ Delete old EF files (DbContext, Migrations)
5. ⏳ Test all API endpoints thoroughly
6. ⏳ Update frontend if any API response formats changed

---

## Support

If you encounter issues:
1. Check database connection string
2. Verify database tables exist: `SELECT * FROM INFORMATION_SCHEMA.TABLES`
3. Check backend console for SQL errors
4. Review `EmployeeRepositoryAdo.cs` for ADO.NET patterns

Good luck with your ADO.NET implementation! 🚀
