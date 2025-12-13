using Indus.Api.Data;
using Indus.Api.Interfaces;
using Indus.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace Indus.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;
        private readonly IDepartmentService _departmentService;
        private readonly IDesignationService _designationService;
        private readonly IRoleService _roleService;
        private readonly DatabaseConnection _dbConnection;

        public EmployeesController(
            IEmployeeService employeeService,
            IDepartmentService departmentService,
            IDesignationService designationService,
            IRoleService roleService,
            DatabaseConnection dbConnection)
        {
            _employeeService = employeeService;
            _departmentService = departmentService;
            _designationService = designationService;
            _roleService = roleService;
            _dbConnection = dbConnection;
        }

        // GET: /api/employees/stats
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            int total = await _employeeService.GetTotalEmployeesCountAsync();
            int active = await _employeeService.GetActiveEmployeesCountAsync();
            int departments = await _departmentService.GetDepartmentsCountAsync();
            int newThisMonth = await _employeeService.GetNewEmployeesThisMonthAsync();

            var stats = new StatsDto(total, active, departments, newThisMonth);
            return Ok(stats);
        }

        // GET: /api/employees
        [HttpGet]
        public async Task<IActionResult> GetEmployees(
            [FromQuery] string? search,
            [FromQuery] string? department,
            [FromQuery] string? status)
        {
            List<EmployeeDto> employees = new List<EmployeeDto>();

            using (SqlConnection conn = _dbConnection.GetConnection())
            {
                await conn.OpenAsync();

                string query = @"
                    SELECT
                        e.EmployeeID,
                        e.FullName,
                        e.Email,
                        e.PhoneNumber,
                        d.DepartmentName,
                        des.DesignationName,
                        e.DateOfJoining,
                        e.Status,
                        m.FullName AS ManagerName,
                        e.PhotoPath
                    FROM Employees e
                    INNER JOIN Departments d ON e.DepartmentID = d.DepartmentID
                    INNER JOIN Designations des ON e.DesignationID = des.DesignationID
                    LEFT JOIN Employees m ON e.ReportingManagerID = m.EmployeeID
                    WHERE 1=1";

                List<SqlParameter> parameters = new List<SqlParameter>();

                if (!string.IsNullOrEmpty(search))
                {
                    query += " AND (e.FullName LIKE @Search OR e.Email LIKE @Search)";
                    parameters.Add(new SqlParameter("@Search", "%" + search + "%"));
                }

                if (!string.IsNullOrEmpty(department) && department.ToLower() != "all")
                {
                    query += " AND d.DepartmentName = @Department";
                    parameters.Add(new SqlParameter("@Department", department));
                }

                if (!string.IsNullOrEmpty(status) && status.ToLower() != "all")
                {
                    query += " AND e.Status = @Status";
                    parameters.Add(new SqlParameter("@Status", status));
                }

                query += " ORDER BY e.EmployeeID";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddRange(parameters.ToArray());

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            employees.Add(new EmployeeDto(
                                reader.GetInt32(0), // EmployeeID
                                reader.GetString(1), // FullName
                                reader.GetString(2), // Email
                                reader.IsDBNull(3) ? null : reader.GetString(3), // PhoneNumber
                                reader.GetString(4), // DepartmentName
                                reader.GetString(5), // DesignationName
                                reader.GetDateTime(6).ToString("yyyy-MM-dd"), // DateOfJoining
                                reader.GetString(7), // Status
                                reader.IsDBNull(8) ? null : reader.GetString(8), // ManagerName
                                reader.IsDBNull(9) ? null : reader.GetString(9) // PhotoPath
                            ));
                        }
                    }
                }
            }

            return Ok(employees);
        }

        // GET: /api/employees/departments
        [HttpGet("departments")]
        public async Task<IActionResult> GetDepartments()
        {
            var departments = await _departmentService.GetAllDepartmentsAsync();

            var result = departments.Select(d => new
            {
                Id = d.DepartmentID,
                Name = d.DepartmentName
            });

            return Ok(result);
        }

        // GET: /api/employees/designations
        [HttpGet("designations")]
        public async Task<IActionResult> GetDesignations()
        {
            var designations = await _designationService.GetAllDesignationsAsync();

            var result = designations.Select(d => new
            {
                Id = d.DesignationID,
                Name = d.DesignationName
            });

            return Ok(result);
        }

        // GET: /api/employees/managers
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

        // GET: /api/employees/roles
        [HttpGet("roles")]
        public async Task<IActionResult> GetRoles()
        {
            var roles = await _roleService.GetAllRolesAsync();

            var result = roles.Select(r => new
            {
                Id = r.RoleID,
                Name = r.RoleName
            });

            return Ok(result);
        }

        // GET: /api/employees/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetEmployeeById(int id)
        {
            using (SqlConnection conn = _dbConnection.GetConnection())
            {
                await conn.OpenAsync();

                // Main employee query with related data
                string query = @"
                    SELECT
                        e.EmployeeID, e.FullName, e.FatherName, e.Email, e.PhoneNumber,
                        e.EmergencyContactNumber, e.EmergencyContactRelation, e.PersonalEmail,
                        e.DateOfBirth, e.Gender, e.BloodGroup, e.MaritalStatus, e.WeddingDate,
                        e.CurrentAddress, e.PermanentAddress, e.DateOfJoining, e.ConfirmationDate,
                        e.EmployeeType, e.WorkLocation, e.UanNumber, e.PanCardNumber, e.AadharCardNumber,
                        e.Status, e.IsLoginEnabled, e.PhotoPath,
                        d.DepartmentName,
                        des.DesignationName,
                        r.RoleName,
                        m.FullName AS ManagerName,
                        b.BankName, b.AccountNumber, b.IFSCCode, b.AccountHolderName,
                        s.AnnualCTC, s.BasicSalary, s.HRA, s.PFDeduction, s.ProfessionalTax,
                        s.OtherAllowances, s.CostRate, s.CostType
                    FROM Employees e
                    LEFT JOIN Departments d ON e.DepartmentID = d.DepartmentID
                    LEFT JOIN Designations des ON e.DesignationID = des.DesignationID
                    LEFT JOIN Roles r ON e.RoleID = r.RoleID
                    LEFT JOIN Employees m ON e.ReportingManagerID = m.EmployeeID
                    LEFT JOIN BankDetails b ON e.EmployeeID = b.EmployeeID
                    LEFT JOIN SalaryDetails s ON e.EmployeeID = s.EmployeeID
                    WHERE e.EmployeeID = @EmployeeID";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@EmployeeID", id);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if (!await reader.ReadAsync())
                        {
                            return NotFound();
                        }

                        // Build response object
                        var response = new
                        {
                            UserId = reader.GetInt32(reader.GetOrdinal("EmployeeID")),
                            FullName = reader.GetString(reader.GetOrdinal("FullName")),
                            FatherName = reader.IsDBNull(reader.GetOrdinal("FatherName")) ? null : reader.GetString(reader.GetOrdinal("FatherName")),
                            Email = reader.GetString(reader.GetOrdinal("Email")),
                            PhoneNumber = reader.IsDBNull(reader.GetOrdinal("PhoneNumber")) ? null : reader.GetString(reader.GetOrdinal("PhoneNumber")),
                            EmergencyContactNumber = reader.IsDBNull(reader.GetOrdinal("EmergencyContactNumber")) ? null : reader.GetString(reader.GetOrdinal("EmergencyContactNumber")),
                            EmergencyContactRelation = reader.IsDBNull(reader.GetOrdinal("EmergencyContactRelation")) ? null : reader.GetString(reader.GetOrdinal("EmergencyContactRelation")),
                            PersonalEmail = reader.IsDBNull(reader.GetOrdinal("PersonalEmail")) ? null : reader.GetString(reader.GetOrdinal("PersonalEmail")),
                            DateOfBirth = reader.IsDBNull(reader.GetOrdinal("DateOfBirth")) ? null : reader.GetDateTime(reader.GetOrdinal("DateOfBirth")).ToString("yyyy-MM-dd"),
                            Gender = reader.IsDBNull(reader.GetOrdinal("Gender")) ? null : reader.GetString(reader.GetOrdinal("Gender")),
                            BloodGroup = reader.IsDBNull(reader.GetOrdinal("BloodGroup")) ? null : reader.GetString(reader.GetOrdinal("BloodGroup")),
                            MaritalStatus = reader.IsDBNull(reader.GetOrdinal("MaritalStatus")) ? null : reader.GetString(reader.GetOrdinal("MaritalStatus")),
                            WeddingDate = reader.IsDBNull(reader.GetOrdinal("WeddingDate")) ? null : reader.GetDateTime(reader.GetOrdinal("WeddingDate")).ToString("yyyy-MM-dd"),
                            CurrentAddress = reader.IsDBNull(reader.GetOrdinal("CurrentAddress")) ? null : reader.GetString(reader.GetOrdinal("CurrentAddress")),
                            PermanentAddress = reader.IsDBNull(reader.GetOrdinal("PermanentAddress")) ? null : reader.GetString(reader.GetOrdinal("PermanentAddress")),
                            Department = reader.IsDBNull(reader.GetOrdinal("DepartmentName")) ? null : reader.GetString(reader.GetOrdinal("DepartmentName")),
                            Designation = reader.IsDBNull(reader.GetOrdinal("DesignationName")) ? null : reader.GetString(reader.GetOrdinal("DesignationName")),
                            JoiningDate = reader.GetDateTime(reader.GetOrdinal("DateOfJoining")).ToString("yyyy-MM-dd"),
                            ConfirmationDate = reader.IsDBNull(reader.GetOrdinal("ConfirmationDate")) ? null : reader.GetDateTime(reader.GetOrdinal("ConfirmationDate")).ToString("yyyy-MM-dd"),
                            EmployeeType = reader.IsDBNull(reader.GetOrdinal("EmployeeType")) ? null : reader.GetString(reader.GetOrdinal("EmployeeType")),
                            WorkLocation = reader.IsDBNull(reader.GetOrdinal("WorkLocation")) ? null : reader.GetString(reader.GetOrdinal("WorkLocation")),
                            ManagerName = reader.IsDBNull(reader.GetOrdinal("ManagerName")) ? null : reader.GetString(reader.GetOrdinal("ManagerName")),
                            UanNumber = reader.IsDBNull(reader.GetOrdinal("UanNumber")) ? null : reader.GetString(reader.GetOrdinal("UanNumber")),
                            PanCardNumber = reader.IsDBNull(reader.GetOrdinal("PanCardNumber")) ? null : reader.GetString(reader.GetOrdinal("PanCardNumber")),
                            AadharCardNumber = reader.IsDBNull(reader.GetOrdinal("AadharCardNumber")) ? null : reader.GetString(reader.GetOrdinal("AadharCardNumber")),
                            Status = reader.GetString(reader.GetOrdinal("Status")),
                            IsLoginEnabled = reader.GetBoolean(reader.GetOrdinal("IsLoginEnabled")),
                            Role = reader.IsDBNull(reader.GetOrdinal("RoleName")) ? null : reader.GetString(reader.GetOrdinal("RoleName")),
                            PhotoPath = reader.IsDBNull(reader.GetOrdinal("PhotoPath")) ? null : reader.GetString(reader.GetOrdinal("PhotoPath")),

                            // Bank Details (flat properties for easy access)
                            BankName = reader.IsDBNull(reader.GetOrdinal("BankName")) ? null : reader.GetString(reader.GetOrdinal("BankName")),
                            AccountNumber = reader.IsDBNull(reader.GetOrdinal("AccountNumber")) ? null : reader.GetString(reader.GetOrdinal("AccountNumber")),
                            IfscCode = reader.IsDBNull(reader.GetOrdinal("IFSCCode")) ? null : reader.GetString(reader.GetOrdinal("IFSCCode")),

                            // Salary Details (flat properties for easy access)
                            AnnualCTC = reader.IsDBNull(reader.GetOrdinal("AnnualCTC")) ? (decimal?)null : reader.GetDecimal(reader.GetOrdinal("AnnualCTC")),
                            BasicSalary = reader.IsDBNull(reader.GetOrdinal("BasicSalary")) ? (decimal?)null : reader.GetDecimal(reader.GetOrdinal("BasicSalary")),
                            HRA = reader.IsDBNull(reader.GetOrdinal("HRA")) ? (decimal?)null : reader.GetDecimal(reader.GetOrdinal("HRA")),
                            PFDeduction = reader.IsDBNull(reader.GetOrdinal("PFDeduction")) ? (decimal?)null : reader.GetDecimal(reader.GetOrdinal("PFDeduction")),
                            ProfessionalTax = reader.IsDBNull(reader.GetOrdinal("ProfessionalTax")) ? (decimal?)null : reader.GetDecimal(reader.GetOrdinal("ProfessionalTax")),
                            OtherAllowances = reader.IsDBNull(reader.GetOrdinal("OtherAllowances")) ? (decimal?)null : reader.GetDecimal(reader.GetOrdinal("OtherAllowances")),
                            CostRate = reader.IsDBNull(reader.GetOrdinal("CostRate")) ? (decimal?)null : reader.GetDecimal(reader.GetOrdinal("CostRate")),
                            CostType = reader.IsDBNull(reader.GetOrdinal("CostType")) ? null : reader.GetString(reader.GetOrdinal("CostType")),

                            // Nested objects for backward compatibility
                            BankDetails = reader.IsDBNull(reader.GetOrdinal("BankName")) ? null : new
                            {
                                BankName = reader.GetString(reader.GetOrdinal("BankName")),
                                AccountNumber = reader.IsDBNull(reader.GetOrdinal("AccountNumber")) ? null : reader.GetString(reader.GetOrdinal("AccountNumber")),
                                IFSCCode = reader.IsDBNull(reader.GetOrdinal("IFSCCode")) ? null : reader.GetString(reader.GetOrdinal("IFSCCode")),
                                AccountHolderName = reader.IsDBNull(reader.GetOrdinal("AccountHolderName")) ? null : reader.GetString(reader.GetOrdinal("AccountHolderName"))
                            },

                            SalaryDetails = reader.IsDBNull(reader.GetOrdinal("AnnualCTC")) ? null : new
                            {
                                AnnualCTC = reader.GetDecimal(reader.GetOrdinal("AnnualCTC")),
                                BasicSalary = reader.IsDBNull(reader.GetOrdinal("BasicSalary")) ? (decimal?)null : reader.GetDecimal(reader.GetOrdinal("BasicSalary")),
                                HRA = reader.IsDBNull(reader.GetOrdinal("HRA")) ? (decimal?)null : reader.GetDecimal(reader.GetOrdinal("HRA")),
                                PFDeduction = reader.IsDBNull(reader.GetOrdinal("PFDeduction")) ? (decimal?)null : reader.GetDecimal(reader.GetOrdinal("PFDeduction")),
                                ProfessionalTax = reader.IsDBNull(reader.GetOrdinal("ProfessionalTax")) ? (decimal?)null : reader.GetDecimal(reader.GetOrdinal("ProfessionalTax")),
                                OtherAllowances = reader.IsDBNull(reader.GetOrdinal("OtherAllowances")) ? (decimal?)null : reader.GetDecimal(reader.GetOrdinal("OtherAllowances")),
                                CostRate = reader.IsDBNull(reader.GetOrdinal("CostRate")) ? (decimal?)null : reader.GetDecimal(reader.GetOrdinal("CostRate")),
                                CostType = reader.IsDBNull(reader.GetOrdinal("CostType")) ? null : reader.GetString(reader.GetOrdinal("CostType"))
                            },

                            FamilyMembers = new List<object>() // Will fetch separately
                        };

                        // Close the first reader
                        reader.Close();

                        // Now fetch family members
                        string familyQuery = @"
                            SELECT FamilyMemberID, FullName, Relationship, DateOfBirth, Gender, IsNominee, IsDependent
                            FROM FamilyMembers
                            WHERE EmployeeID = @EmployeeID";

                        var familyMembers = new List<object>();
                        using (SqlCommand familyCmd = new SqlCommand(familyQuery, conn))
                        {
                            familyCmd.Parameters.AddWithValue("@EmployeeID", id);

                            using (SqlDataReader familyReader = await familyCmd.ExecuteReaderAsync())
                            {
                                while (await familyReader.ReadAsync())
                                {
                                    familyMembers.Add(new
                                    {
                                        Id = familyReader.GetInt32(0),
                                        FullName = familyReader.GetString(1),
                                        Relationship = familyReader.GetString(2),
                                        DateOfBirth = familyReader.GetDateTime(3).ToString("yyyy-MM-dd"),
                                        Gender = familyReader.IsDBNull(4) ? null : familyReader.GetString(4),
                                        IsNominee = familyReader.GetBoolean(5),
                                        IsDependent = familyReader.GetBoolean(6)
                                    });
                                }
                            }
                        }

                        // Fetch employee documents
                        string docsQuery = @"
                            SELECT DocumentID, DocumentType, FileName, FilePath, FileSize, MimeType, UploadedAt, UploadedBy
                            FROM EmployeeDocuments
                            WHERE EmployeeID = @EmployeeID";

                        var documents = new List<object>();
                        using (SqlCommand docsCmd = new SqlCommand(docsQuery, conn))
                        {
                            docsCmd.Parameters.AddWithValue("@EmployeeID", id);

                            using (SqlDataReader docsReader = await docsCmd.ExecuteReaderAsync())
                            {
                                while (await docsReader.ReadAsync())
                                {
                                    documents.Add(new
                                    {
                                        DocumentId = docsReader.GetInt32(0),
                                        DocumentType = docsReader.GetString(1),
                                        FileName = docsReader.GetString(2),
                                        FilePath = docsReader.IsDBNull(3) ? null : docsReader.GetString(3),
                                        FileSize = docsReader.IsDBNull(4) ? null : docsReader.GetValue(4)?.ToString(),
                                        MimeType = docsReader.IsDBNull(5) ? null : docsReader.GetString(5),
                                        UploadedAt = docsReader.GetDateTime(6).ToString("yyyy-MM-dd HH:mm:ss"),
                                        UploadedBy = docsReader.IsDBNull(7) ? (int?)null : docsReader.GetInt32(7)
                                    });
                                }
                            }
                        }

                        // Create final response with family members and documents
                        var finalResponse = new
                        {
                            response.UserId,
                            response.FullName,
                            response.Email,
                            response.PhoneNumber,
                            response.PersonalEmail,
                            response.DateOfBirth,
                            response.Gender,
                            response.BloodGroup,
                            response.MaritalStatus,
                            response.WeddingDate,
                            response.CurrentAddress,
                            response.PermanentAddress,
                            response.Department,
                            response.Designation,
                            response.JoiningDate,
                            response.ConfirmationDate,
                            response.EmployeeType,
                            response.WorkLocation,
                            response.ManagerName,
                            response.UanNumber,
                            response.PanCardNumber,
                            response.AadharCardNumber,
                            response.Status,
                            response.IsLoginEnabled,
                            response.Role,
                            response.PhotoPath,
                            response.BankDetails,
                            response.SalaryDetails,
                            FamilyMembers = familyMembers,
                            Documents = documents
                        };

                        return Ok(finalResponse);
                    }
                }
            }
        }

        // POST: /api/employees
        [HttpPost]
        public async Task<IActionResult> CreateEmployee([FromBody] CreateEmployeeDto employeeDto)
        {
            if (employeeDto == null)
            {
                return BadRequest(new { message = "Employee data is required" });
            }

            using (SqlConnection conn = _dbConnection.GetConnection())
            {
                await conn.OpenAsync();
                using (SqlTransaction transaction = conn.BeginTransaction())
                {
                    try
                    {
                        // 1. Insert Employee
                        string insertEmployeeQuery = @"
                            INSERT INTO Employees (
                                FullName, FatherName, Email, PasswordHash, PhoneNumber,
                                EmergencyContactNumber, EmergencyContactRelation, PersonalEmail,
                                DateOfBirth, Gender, BloodGroup, MaritalStatus, WeddingDate,
                                CurrentAddress, PermanentAddress, DateOfJoining, ConfirmationDate,
                                EmployeeType, WorkLocation, UanNumber, PanCardNumber, AadharCardNumber,
                                RoleID, IsLoginEnabled, Status, DepartmentID, DesignationID, ReportingManagerID,
                                IsActive, CreatedAt
                            )
                            VALUES (
                                @FullName, @FatherName, @Email, @PasswordHash, @PhoneNumber,
                                @EmergencyContactNumber, @EmergencyContactRelation, @PersonalEmail,
                                @DateOfBirth, @Gender, @BloodGroup, @MaritalStatus, @WeddingDate,
                                @CurrentAddress, @PermanentAddress, @DateOfJoining, @ConfirmationDate,
                                @EmployeeType, @WorkLocation, @UanNumber, @PanCardNumber, @AadharCardNumber,
                                @RoleID, @IsLoginEnabled, @Status, @DepartmentID, @DesignationID, @ReportingManagerID,
                                1, GETDATE()
                            );
                            SELECT CAST(SCOPE_IDENTITY() AS INT);";

                        using (SqlCommand cmd = new SqlCommand(insertEmployeeQuery, conn, transaction))
                        {
                            // Hash the password (simple hash for now, use BCrypt in production)
                            string passwordHash = BCrypt.Net.BCrypt.HashPassword(employeeDto.Password);

                            cmd.Parameters.AddWithValue("@FullName", employeeDto.FullName);
                            cmd.Parameters.AddWithValue("@FatherName", (object?)employeeDto.FatherName ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@Email", employeeDto.Email);
                            cmd.Parameters.AddWithValue("@PasswordHash", passwordHash);
                            cmd.Parameters.AddWithValue("@PhoneNumber", (object?)employeeDto.PhoneNumber ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@EmergencyContactNumber", (object?)employeeDto.EmergencyContactNumber ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@EmergencyContactRelation", (object?)employeeDto.EmergencyContactRelation ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@PersonalEmail", (object?)employeeDto.PersonalEmail ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@DateOfBirth", (object?)employeeDto.DateOfBirth ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@Gender", (object?)employeeDto.Gender ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@BloodGroup", (object?)employeeDto.BloodGroup ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@MaritalStatus", (object?)employeeDto.MaritalStatus ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@WeddingDate", (object?)employeeDto.WeddingDate ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@CurrentAddress", (object?)employeeDto.CurrentAddress ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@PermanentAddress", (object?)employeeDto.PermanentAddress ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@DateOfJoining", employeeDto.JoiningDate);
                            cmd.Parameters.AddWithValue("@ConfirmationDate", (object?)employeeDto.ConfirmationDate ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@EmployeeType", (object?)employeeDto.EmployeeType ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@WorkLocation", (object?)employeeDto.WorkLocation ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@UanNumber", (object?)employeeDto.UanNumber ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@PanCardNumber", (object?)employeeDto.PanCardNumber ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@AadharCardNumber", (object?)employeeDto.AadharCardNumber ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@RoleID", (object?)employeeDto.RoleId ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@IsLoginEnabled", employeeDto.IsLoginEnabled);
                            cmd.Parameters.AddWithValue("@Status", employeeDto.Status);
                            cmd.Parameters.AddWithValue("@DepartmentID", employeeDto.DepartmentId);
                            cmd.Parameters.AddWithValue("@DesignationID", employeeDto.DesignationId);
                            cmd.Parameters.AddWithValue("@ReportingManagerID", (object?)employeeDto.ReportingManagerId ?? DBNull.Value);

                            int newEmployeeId = (int)await cmd.ExecuteScalarAsync();

                            // 2. Insert Bank Details (if provided)
                            if (!string.IsNullOrEmpty(employeeDto.BankName))
                            {
                                string insertBankQuery = @"
                                    INSERT INTO BankDetails (EmployeeID, BankName, AccountNumber, IFSCCode, CreatedAt)
                                    VALUES (@EmployeeID, @BankName, @AccountNumber, @IFSCCode, GETDATE())";

                                using (SqlCommand bankCmd = new SqlCommand(insertBankQuery, conn, transaction))
                                {
                                    bankCmd.Parameters.AddWithValue("@EmployeeID", newEmployeeId);
                                    bankCmd.Parameters.AddWithValue("@BankName", employeeDto.BankName);
                                    bankCmd.Parameters.AddWithValue("@AccountNumber", (object?)employeeDto.AccountNumber ?? DBNull.Value);
                                    bankCmd.Parameters.AddWithValue("@IFSCCode", (object?)employeeDto.IFSCCode ?? DBNull.Value);
                                    await bankCmd.ExecuteNonQueryAsync();
                                }
                            }

                            // 3. Insert Salary Details (if provided)
                            if (employeeDto.AnnualCTC.HasValue)
                            {
                                string insertSalaryQuery = @"
                                    INSERT INTO SalaryDetails (
                                        EmployeeID, AnnualCTC, BasicSalary, HRA, PFDeduction,
                                        ProfessionalTax, OtherAllowances, CostRate, CostType, EffectiveFrom, IsActive, CreatedAt
                                    )
                                    VALUES (
                                        @EmployeeID, @AnnualCTC, @BasicSalary, @HRA, @PFDeduction,
                                        @ProfessionalTax, @OtherAllowances, @CostRate, @CostType, @EffectiveFrom, 1, GETDATE()
                                    )";

                                using (SqlCommand salaryCmd = new SqlCommand(insertSalaryQuery, conn, transaction))
                                {
                                    salaryCmd.Parameters.AddWithValue("@EmployeeID", newEmployeeId);
                                    salaryCmd.Parameters.AddWithValue("@AnnualCTC", employeeDto.AnnualCTC.Value);
                                    salaryCmd.Parameters.AddWithValue("@BasicSalary", (object?)employeeDto.BasicSalary ?? DBNull.Value);
                                    salaryCmd.Parameters.AddWithValue("@HRA", (object?)employeeDto.HRA ?? DBNull.Value);
                                    salaryCmd.Parameters.AddWithValue("@PFDeduction", (object?)employeeDto.PFDeduction ?? DBNull.Value);
                                    salaryCmd.Parameters.AddWithValue("@ProfessionalTax", (object?)employeeDto.ProfessionalTax ?? DBNull.Value);
                                    salaryCmd.Parameters.AddWithValue("@OtherAllowances", (object?)employeeDto.OtherAllowances ?? DBNull.Value);
                                    salaryCmd.Parameters.AddWithValue("@CostRate", (object?)employeeDto.CostRate ?? DBNull.Value);
                                    salaryCmd.Parameters.AddWithValue("@CostType", (object?)employeeDto.CostType ?? DBNull.Value);
                                    salaryCmd.Parameters.AddWithValue("@EffectiveFrom", employeeDto.JoiningDate); // Salary effective from joining date
                                    await salaryCmd.ExecuteNonQueryAsync();
                                }
                            }

                            // 4. Insert Family Members (if provided)
                            if (employeeDto.FamilyMembers != null && employeeDto.FamilyMembers.Count > 0)
                            {
                                string insertFamilyQuery = @"
                                    INSERT INTO FamilyMembers (
                                        EmployeeID, FullName, Relationship, DateOfBirth, Gender, IsNominee, IsDependent, CreatedAt
                                    )
                                    VALUES (
                                        @EmployeeID, @FullName, @Relationship, @DateOfBirth, @Gender, @IsNominee, @IsDependent, GETDATE()
                                    )";

                                foreach (var familyMember in employeeDto.FamilyMembers)
                                {
                                    using (SqlCommand familyCmd = new SqlCommand(insertFamilyQuery, conn, transaction))
                                    {
                                        familyCmd.Parameters.AddWithValue("@EmployeeID", newEmployeeId);
                                        familyCmd.Parameters.AddWithValue("@FullName", familyMember.FullName);
                                        familyCmd.Parameters.AddWithValue("@Relationship", familyMember.Relationship);
                                        familyCmd.Parameters.AddWithValue("@DateOfBirth", familyMember.DateOfBirth);
                                        familyCmd.Parameters.AddWithValue("@Gender", familyMember.Gender);
                                        familyCmd.Parameters.AddWithValue("@IsNominee", familyMember.IsNominee);
                                        familyCmd.Parameters.AddWithValue("@IsDependent", familyMember.IsDependent);
                                        await familyCmd.ExecuteNonQueryAsync();
                                    }
                                }
                            }

                            // 5. Insert Documents (if provided)
                            if (employeeDto.Documents != null && employeeDto.Documents.Count > 0)
                            {
                                string insertDocQuery = @"
                                    INSERT INTO EmployeeDocuments (
                                        EmployeeID, DocumentType, FileName, FilePath, FileSize, MimeType, UploadedAt
                                    )
                                    VALUES (
                                        @EmployeeID, @DocumentType, @FileName, @FilePath, @FileSize, @MimeType, GETDATE()
                                    )";

                                foreach (var doc in employeeDto.Documents)
                                {
                                    using (SqlCommand docCmd = new SqlCommand(insertDocQuery, conn, transaction))
                                    {
                                        docCmd.Parameters.AddWithValue("@EmployeeID", newEmployeeId);
                                        docCmd.Parameters.AddWithValue("@DocumentType", doc.DocumentType);
                                        docCmd.Parameters.AddWithValue("@FileName", doc.FileName);
                                        docCmd.Parameters.AddWithValue("@FilePath", doc.FilePath ?? $"/uploads/documents/{doc.FileName}");
                                        docCmd.Parameters.AddWithValue("@FileSize", (object?)doc.FileSize ?? DBNull.Value);
                                        docCmd.Parameters.AddWithValue("@MimeType", (object?)doc.MimeType ?? DBNull.Value);
                                        await docCmd.ExecuteNonQueryAsync();
                                    }
                                }
                            }

                            await transaction.CommitAsync();

                            // Return the created employee
                            return Ok(new { message = "Employee created successfully", employeeId = newEmployeeId });
                        }
                    }
                    catch (Exception ex)
                    {
                        await transaction.RollbackAsync();
                        return StatusCode(500, new { message = "Failed to create employee", error = ex.Message });
                    }
                }
            }
        }

        // POST: /api/employees/{employeeId}/documents/upload
        [HttpPost("{employeeId}/documents/upload")]
        public async Task<IActionResult> UploadDocument(int employeeId, IFormFile file, [FromForm] string documentType)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "No file uploaded" });
            }

            try
            {
                // Create uploads directory if not exists
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "documents");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // Generate unique filename
                var uniqueFileName = $"{employeeId}_{documentType}_{DateTime.Now:yyyyMMddHHmmss}_{file.FileName}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);
                var relativePath = $"/uploads/documents/{uniqueFileName}";

                // Save file to disk
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Save to database
                using (SqlConnection conn = _dbConnection.GetConnection())
                {
                    await conn.OpenAsync();

                    string insertQuery = @"
                        INSERT INTO EmployeeDocuments (EmployeeID, DocumentType, FileName, FilePath, FileSize, MimeType, UploadedAt)
                        OUTPUT INSERTED.DocumentID
                        VALUES (@EmployeeID, @DocumentType, @FileName, @FilePath, @FileSize, @MimeType, GETDATE())";

                    using (SqlCommand cmd = new SqlCommand(insertQuery, conn))
                    {
                        cmd.Parameters.AddWithValue("@EmployeeID", employeeId);
                        cmd.Parameters.AddWithValue("@DocumentType", documentType);
                        cmd.Parameters.AddWithValue("@FileName", file.FileName);
                        cmd.Parameters.AddWithValue("@FilePath", relativePath);
                        cmd.Parameters.AddWithValue("@FileSize", file.Length.ToString());
                        cmd.Parameters.AddWithValue("@MimeType", file.ContentType);

                        var documentId = await cmd.ExecuteScalarAsync();

                        return Ok(new
                        {
                            message = "Document uploaded successfully",
                            documentId = documentId,
                            fileName = file.FileName,
                            filePath = relativePath
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to upload document", error = ex.Message });
            }
        }

        // GET: /api/employees/documents/{documentId}/download
        [HttpGet("documents/{documentId}/download")]
        public async Task<IActionResult> DownloadDocument(int documentId)
        {
            try
            {
                using (SqlConnection conn = _dbConnection.GetConnection())
                {
                    await conn.OpenAsync();

                    string query = "SELECT FileName, FilePath, MimeType FROM EmployeeDocuments WHERE DocumentID = @DocumentID";

                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@DocumentID", documentId);

                        using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            if (!await reader.ReadAsync())
                            {
                                return NotFound(new { message = "Document not found" });
                            }

                            var fileName = reader.GetString(0);
                            var relativePath = reader.GetString(1);
                            var mimeType = reader.IsDBNull(2) ? "application/octet-stream" : reader.GetString(2);

                            var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", relativePath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));

                            if (!System.IO.File.Exists(fullPath))
                            {
                                return NotFound(new { message = "File not found on server" });
                            }

                            var fileBytes = await System.IO.File.ReadAllBytesAsync(fullPath);
                            return File(fileBytes, mimeType, fileName);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to download document", error = ex.Message });
            }
        }

        // PUT: /api/employees/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, [FromBody] UpdateEmployeeDto employeeDto)
        {
            if (employeeDto == null)
            {
                return BadRequest(new { message = "Employee data is required" });
            }

            using (SqlConnection conn = _dbConnection.GetConnection())
            {
                await conn.OpenAsync();

                try
                {
                    // Check if employee exists
                    string checkQuery = "SELECT COUNT(*) FROM Employees WHERE EmployeeID = @EmployeeID";
                    using (SqlCommand checkCmd = new SqlCommand(checkQuery, conn))
                    {
                        checkCmd.Parameters.AddWithValue("@EmployeeID", id);
                        int count = (int)await checkCmd.ExecuteScalarAsync();
                        
                        if (count == 0)
                        {
                            return NotFound(new { message = "Employee not found" });
                        }
                    }

                    // Update employee
                    string updateQuery = @"
                        UPDATE Employees
                        SET FullName = @FullName,
                            PhoneNumber = @PhoneNumber,
                            DepartmentID = @DepartmentID,
                            DesignationID = @DesignationID,
                            DateOfJoining = @DateOfJoining,
                            Status = @Status,
                            ReportingManagerID = @ReportingManagerID,
                            UpdatedAt = GETDATE()
                        WHERE EmployeeID = @EmployeeID";

                    using (SqlCommand cmd = new SqlCommand(updateQuery, conn))
                    {
                        cmd.Parameters.AddWithValue("@EmployeeID", id);
                        cmd.Parameters.AddWithValue("@FullName", employeeDto.FullName);
                        cmd.Parameters.AddWithValue("@PhoneNumber", (object?)employeeDto.PhoneNumber ?? DBNull.Value);
                        cmd.Parameters.AddWithValue("@DepartmentID", employeeDto.DepartmentId);
                        cmd.Parameters.AddWithValue("@DesignationID", employeeDto.DesignationId);
                        cmd.Parameters.AddWithValue("@DateOfJoining", employeeDto.JoiningDate);
                        cmd.Parameters.AddWithValue("@Status", employeeDto.Status);
                        cmd.Parameters.AddWithValue("@ReportingManagerID", (object?)employeeDto.ReportingManagerId ?? DBNull.Value);

                        int rowsAffected = await cmd.ExecuteNonQueryAsync();

                        if (rowsAffected == 0)
                        {
                            return StatusCode(500, new { message = "Failed to update employee" });
                        }

                        return Ok(new { message = "Employee updated successfully", employeeId = id });
                    }
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "Failed to update employee", error = ex.Message });
                }
            }
        }

        // DELETE: /api/employees/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            using (SqlConnection conn = _dbConnection.GetConnection())
            {
                await conn.OpenAsync();

                try
                {
                    // Check if employee exists
                    string checkQuery = "SELECT COUNT(*) FROM Employees WHERE EmployeeID = @EmployeeID";
                    using (SqlCommand checkCmd = new SqlCommand(checkQuery, conn))
                    {
                        checkCmd.Parameters.AddWithValue("@EmployeeID", id);
                        int count = (int)await checkCmd.ExecuteScalarAsync();
                        
                        if (count == 0)
                        {
                            return NotFound(new { message = "Employee not found" });
                        }
                    }

                    // Soft delete - set IsActive to false
                    string deleteQuery = @"
                        UPDATE Employees
                        SET IsActive = 0,
                            Status = 'Inactive',
                            UpdatedAt = GETDATE()
                        WHERE EmployeeID = @EmployeeID";

                    using (SqlCommand cmd = new SqlCommand(deleteQuery, conn))
                    {
                        cmd.Parameters.AddWithValue("@EmployeeID", id);
                        await cmd.ExecuteNonQueryAsync();
                        
                        return Ok(new { message = "Employee deleted successfully" });
                    }
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "Failed to delete employee", error = ex.Message });
                }
            }
        }
    }
}
