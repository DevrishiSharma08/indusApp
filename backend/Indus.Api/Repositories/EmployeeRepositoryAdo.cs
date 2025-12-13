using Indus.Api.Data;
using Indus.Api.Interfaces;
using Indus.Api.Models;
using Microsoft.Data.SqlClient;

namespace Indus.Api.Repositories
{
    /// <summary>
    /// Employee Repository using pure ADO.NET
    /// </summary>
    public class EmployeeRepositoryAdo : IEmployeeRepository
    {
        private readonly DatabaseConnection _dbConnection;

        public EmployeeRepositoryAdo(DatabaseConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        /// <summary>
        /// Get employee by email with role information
        /// </summary>
        public async Task<Employee?> GetByEmailAsync(string email)
        {
            using (SqlConnection conn = _dbConnection.GetConnection())
            {
                await conn.OpenAsync();

                string query = @"
                    SELECT
                        e.EmployeeID, e.FullName, e.Email, e.PasswordHash, e.PhoneNumber,
                        e.PersonalEmail, e.DateOfBirth, e.Gender, e.BloodGroup, e.MaritalStatus,
                        e.WeddingDate, e.CurrentAddress, e.PermanentAddress, e.DateOfJoining,
                        e.ConfirmationDate, e.EmployeeType, e.WorkLocation, e.UanNumber,
                        e.PanCardNumber, e.AadharCardNumber, e.IsActive, e.Status, e.IsLoginEnabled,
                        e.PhotoPath, e.CreatedAt, e.UpdatedAt, e.RoleID, e.DepartmentID,
                        e.DesignationID, e.ReportingManagerID,
                        r.RoleID AS Role_RoleID, r.RoleName AS Role_RoleName
                    FROM Employees e
                    LEFT JOIN Roles r ON e.RoleID = r.RoleID
                    WHERE e.Email = @Email";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Email", email);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return MapEmployeeFromReader(reader, includeRole: true);
                        }
                    }
                }
            }

            return null;
        }

        /// <summary>
        /// Add new employee
        /// </summary>
        public async Task<Employee> AddAsync(Employee employee)
        {
            using (SqlConnection conn = _dbConnection.GetConnection())
            {
                await conn.OpenAsync();

                string query = @"
                    INSERT INTO Employees (
                        FullName, Email, PasswordHash, PhoneNumber, PersonalEmail, DateOfBirth,
                        Gender, BloodGroup, MaritalStatus, WeddingDate, CurrentAddress, PermanentAddress,
                        DateOfJoining, ConfirmationDate, EmployeeType, WorkLocation, UanNumber,
                        PanCardNumber, AadharCardNumber, IsActive, Status, IsLoginEnabled, PhotoPath,
                        CreatedAt, UpdatedAt, RoleID, DepartmentID, DesignationID, ReportingManagerID
                    )
                    VALUES (
                        @FullName, @Email, @PasswordHash, @PhoneNumber, @PersonalEmail, @DateOfBirth,
                        @Gender, @BloodGroup, @MaritalStatus, @WeddingDate, @CurrentAddress, @PermanentAddress,
                        @DateOfJoining, @ConfirmationDate, @EmployeeType, @WorkLocation, @UanNumber,
                        @PanCardNumber, @AadharCardNumber, @IsActive, @Status, @IsLoginEnabled, @PhotoPath,
                        @CreatedAt, @UpdatedAt, @RoleID, @DepartmentID, @DesignationID, @ReportingManagerID
                    );
                    SELECT CAST(SCOPE_IDENTITY() AS INT);";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    AddEmployeeParameters(cmd, employee);

                    int newId = (int)await cmd.ExecuteScalarAsync();
                    employee.EmployeeID = newId;

                    return employee;
                }
            }
        }

        /// <summary>
        /// Get all employees with role information
        /// </summary>
        public async Task<IEnumerable<Employee>> GetAllAsync()
        {
            List<Employee> employees = new List<Employee>();

            using (SqlConnection conn = _dbConnection.GetConnection())
            {
                await conn.OpenAsync();

                string query = @"
                    SELECT
                        e.EmployeeID, e.FullName, e.Email, e.PasswordHash, e.PhoneNumber,
                        e.PersonalEmail, e.DateOfBirth, e.Gender, e.BloodGroup, e.MaritalStatus,
                        e.WeddingDate, e.CurrentAddress, e.PermanentAddress, e.DateOfJoining,
                        e.ConfirmationDate, e.EmployeeType, e.WorkLocation, e.UanNumber,
                        e.PanCardNumber, e.AadharCardNumber, e.IsActive, e.Status, e.IsLoginEnabled,
                        e.PhotoPath, e.CreatedAt, e.UpdatedAt, e.RoleID, e.DepartmentID,
                        e.DesignationID, e.ReportingManagerID,
                        r.RoleID AS Role_RoleID, r.RoleName AS Role_RoleName
                    FROM Employees e
                    LEFT JOIN Roles r ON e.RoleID = r.RoleID
                    ORDER BY e.EmployeeID";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            employees.Add(MapEmployeeFromReader(reader, includeRole: true));
                        }
                    }
                }
            }

            return employees;
        }

        /// <summary>
        /// Get employee by ID
        /// </summary>
        public async Task<Employee?> GetByIdAsync(int employeeId)
        {
            using (SqlConnection conn = _dbConnection.GetConnection())
            {
                await conn.OpenAsync();

                string query = @"
                    SELECT
                        EmployeeID, FullName, Email, PasswordHash, PhoneNumber, PersonalEmail,
                        DateOfBirth, Gender, BloodGroup, MaritalStatus, WeddingDate, CurrentAddress,
                        PermanentAddress, DateOfJoining, ConfirmationDate, EmployeeType, WorkLocation,
                        UanNumber, PanCardNumber, AadharCardNumber, IsActive, Status, IsLoginEnabled,
                        PhotoPath, CreatedAt, UpdatedAt, RoleID, DepartmentID, DesignationID,
                        ReportingManagerID
                    FROM Employees
                    WHERE EmployeeID = @EmployeeID";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@EmployeeID", employeeId);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return MapEmployeeFromReader(reader, includeRole: false);
                        }
                    }
                }
            }

            return null;
        }

        /// <summary>
        /// Update existing employee
        /// </summary>
        public async Task UpdateAsync(Employee employee)
        {
            using (SqlConnection conn = _dbConnection.GetConnection())
            {
                await conn.OpenAsync();

                string query = @"
                    UPDATE Employees SET
                        FullName = @FullName,
                        Email = @Email,
                        PasswordHash = @PasswordHash,
                        PhoneNumber = @PhoneNumber,
                        PersonalEmail = @PersonalEmail,
                        DateOfBirth = @DateOfBirth,
                        Gender = @Gender,
                        BloodGroup = @BloodGroup,
                        MaritalStatus = @MaritalStatus,
                        WeddingDate = @WeddingDate,
                        CurrentAddress = @CurrentAddress,
                        PermanentAddress = @PermanentAddress,
                        DateOfJoining = @DateOfJoining,
                        ConfirmationDate = @ConfirmationDate,
                        EmployeeType = @EmployeeType,
                        WorkLocation = @WorkLocation,
                        UanNumber = @UanNumber,
                        PanCardNumber = @PanCardNumber,
                        AadharCardNumber = @AadharCardNumber,
                        IsActive = @IsActive,
                        Status = @Status,
                        IsLoginEnabled = @IsLoginEnabled,
                        PhotoPath = @PhotoPath,
                        UpdatedAt = @UpdatedAt,
                        RoleID = @RoleID,
                        DepartmentID = @DepartmentID,
                        DesignationID = @DesignationID,
                        ReportingManagerID = @ReportingManagerID
                    WHERE EmployeeID = @EmployeeID";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@EmployeeID", employee.EmployeeID);
                    AddEmployeeParameters(cmd, employee);

                    await cmd.ExecuteNonQueryAsync();
                }
            }
        }

        #region Helper Methods

        /// <summary>
        /// Map SqlDataReader to Employee object
        /// </summary>
        private Employee MapEmployeeFromReader(SqlDataReader reader, bool includeRole)
        {
            var employee = new Employee
            {
                EmployeeID = reader.GetInt32(reader.GetOrdinal("EmployeeID")),
                FullName = reader.GetString(reader.GetOrdinal("FullName")),
                Email = reader.GetString(reader.GetOrdinal("Email")),
                PasswordHash = reader.GetString(reader.GetOrdinal("PasswordHash")),
                PhoneNumber = reader.IsDBNull(reader.GetOrdinal("PhoneNumber")) ? null : reader.GetString(reader.GetOrdinal("PhoneNumber")),
                PersonalEmail = reader.IsDBNull(reader.GetOrdinal("PersonalEmail")) ? null : reader.GetString(reader.GetOrdinal("PersonalEmail")),
                DateOfBirth = reader.IsDBNull(reader.GetOrdinal("DateOfBirth")) ? null : reader.GetDateTime(reader.GetOrdinal("DateOfBirth")),
                Gender = reader.IsDBNull(reader.GetOrdinal("Gender")) ? null : reader.GetString(reader.GetOrdinal("Gender")),
                BloodGroup = reader.IsDBNull(reader.GetOrdinal("BloodGroup")) ? null : reader.GetString(reader.GetOrdinal("BloodGroup")),
                MaritalStatus = reader.IsDBNull(reader.GetOrdinal("MaritalStatus")) ? null : reader.GetString(reader.GetOrdinal("MaritalStatus")),
                WeddingDate = reader.IsDBNull(reader.GetOrdinal("WeddingDate")) ? null : reader.GetDateTime(reader.GetOrdinal("WeddingDate")),
                CurrentAddress = reader.IsDBNull(reader.GetOrdinal("CurrentAddress")) ? null : reader.GetString(reader.GetOrdinal("CurrentAddress")),
                PermanentAddress = reader.IsDBNull(reader.GetOrdinal("PermanentAddress")) ? null : reader.GetString(reader.GetOrdinal("PermanentAddress")),
                DateOfJoining = reader.GetDateTime(reader.GetOrdinal("DateOfJoining")),
                ConfirmationDate = reader.IsDBNull(reader.GetOrdinal("ConfirmationDate")) ? null : reader.GetDateTime(reader.GetOrdinal("ConfirmationDate")),
                EmployeeType = reader.IsDBNull(reader.GetOrdinal("EmployeeType")) ? null : reader.GetString(reader.GetOrdinal("EmployeeType")),
                WorkLocation = reader.IsDBNull(reader.GetOrdinal("WorkLocation")) ? null : reader.GetString(reader.GetOrdinal("WorkLocation")),
                UanNumber = reader.IsDBNull(reader.GetOrdinal("UanNumber")) ? null : reader.GetString(reader.GetOrdinal("UanNumber")),
                PanCardNumber = reader.IsDBNull(reader.GetOrdinal("PanCardNumber")) ? null : reader.GetString(reader.GetOrdinal("PanCardNumber")),
                AadharCardNumber = reader.IsDBNull(reader.GetOrdinal("AadharCardNumber")) ? null : reader.GetString(reader.GetOrdinal("AadharCardNumber")),
                IsActive = reader.GetBoolean(reader.GetOrdinal("IsActive")),
                Status = reader.GetString(reader.GetOrdinal("Status")),
                IsLoginEnabled = reader.GetBoolean(reader.GetOrdinal("IsLoginEnabled")),
                PhotoPath = reader.IsDBNull(reader.GetOrdinal("PhotoPath")) ? null : reader.GetString(reader.GetOrdinal("PhotoPath")),
                CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                UpdatedAt = reader.IsDBNull(reader.GetOrdinal("UpdatedAt")) ? null : reader.GetDateTime(reader.GetOrdinal("UpdatedAt")),
                RoleID = reader.GetInt32(reader.GetOrdinal("RoleID")),
                DepartmentID = reader.GetInt32(reader.GetOrdinal("DepartmentID")),
                DesignationID = reader.GetInt32(reader.GetOrdinal("DesignationID")),
                ReportingManagerID = reader.IsDBNull(reader.GetOrdinal("ReportingManagerID")) ? null : reader.GetInt32(reader.GetOrdinal("ReportingManagerID"))
            };

            // Include Role if requested
            if (includeRole && !reader.IsDBNull(reader.GetOrdinal("Role_RoleID")))
            {
                employee.Role = new Role
                {
                    RoleID = reader.GetInt32(reader.GetOrdinal("Role_RoleID")),
                    RoleName = reader.GetString(reader.GetOrdinal("Role_RoleName"))
                };
            }

            return employee;
        }

        /// <summary>
        /// Add employee parameters to SQL command
        /// </summary>
        private void AddEmployeeParameters(SqlCommand cmd, Employee employee)
        {
            cmd.Parameters.AddWithValue("@FullName", employee.FullName);
            cmd.Parameters.AddWithValue("@Email", employee.Email);
            cmd.Parameters.AddWithValue("@PasswordHash", employee.PasswordHash);
            cmd.Parameters.AddWithValue("@PhoneNumber", (object?)employee.PhoneNumber ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@PersonalEmail", (object?)employee.PersonalEmail ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@DateOfBirth", (object?)employee.DateOfBirth ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Gender", (object?)employee.Gender ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@BloodGroup", (object?)employee.BloodGroup ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@MaritalStatus", (object?)employee.MaritalStatus ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@WeddingDate", (object?)employee.WeddingDate ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@CurrentAddress", (object?)employee.CurrentAddress ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@PermanentAddress", (object?)employee.PermanentAddress ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@DateOfJoining", employee.DateOfJoining);
            cmd.Parameters.AddWithValue("@ConfirmationDate", (object?)employee.ConfirmationDate ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@EmployeeType", (object?)employee.EmployeeType ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@WorkLocation", (object?)employee.WorkLocation ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@UanNumber", (object?)employee.UanNumber ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@PanCardNumber", (object?)employee.PanCardNumber ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@AadharCardNumber", (object?)employee.AadharCardNumber ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@IsActive", employee.IsActive);
            cmd.Parameters.AddWithValue("@Status", employee.Status);
            cmd.Parameters.AddWithValue("@IsLoginEnabled", employee.IsLoginEnabled);
            cmd.Parameters.AddWithValue("@PhotoPath", (object?)employee.PhotoPath ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@CreatedAt", employee.CreatedAt);
            cmd.Parameters.AddWithValue("@UpdatedAt", (object?)employee.UpdatedAt ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@RoleID", employee.RoleID);
            cmd.Parameters.AddWithValue("@DepartmentID", employee.DepartmentID);
            cmd.Parameters.AddWithValue("@DesignationID", employee.DesignationID);
            cmd.Parameters.AddWithValue("@ReportingManagerID", (object?)employee.ReportingManagerID ?? DBNull.Value);
        }

        #endregion
    }
}
