namespace Indus.Api.Controllers
{
    // For sending employee data to the frontend
    public record EmployeeDto(
        int UserId,
        string FullName,
        string Email,
        string? PhoneNumber,
        string Department,
        string Designation,
        string JoiningDate,
        string Status,
        string? ManagerName,
        string? PhotoPath
    );

    // For creating a new employee
    public record CreateEmployeeDto(
        // Basic Information
        string FullName,
        string? FatherName,
        string Email,
        string Password,
        string? PhoneNumber,
        string? EmergencyContactNumber,
        string? EmergencyContactRelation,
        string? PersonalEmail,
        DateTime? DateOfBirth,
        string? Gender,
        string? BloodGroup,
        string? MaritalStatus,
        DateTime? WeddingDate,

        // Address Information
        string? CurrentAddress,
        string? PermanentAddress,

        // Job Information
        int DepartmentId,
        int DesignationId,
        DateTime JoiningDate,
        DateTime? ConfirmationDate,
        string? EmployeeType,
        string? WorkLocation,
        int? ReportingManagerId,

        // Government Documents
        string? UanNumber,
        string? PanCardNumber,
        string? AadharCardNumber,

        // System Information
        int? RoleId,
        bool IsLoginEnabled,
        string Status,

        // Bank Details
        string? BankName,
        string? AccountNumber,
        string? IFSCCode,

        // Salary Information
        decimal? AnnualCTC,
        decimal? BasicSalary,
        decimal? HRA,
        decimal? PFDeduction,
        decimal? ProfessionalTax,
        decimal? OtherAllowances,
        decimal? CostRate,
        string? CostType,

        // Family Members
        List<CreateFamilyMemberDto>? FamilyMembers,

        // Documents
        List<CreateDocumentDto>? Documents
    );

    // For document creation
    public record CreateDocumentDto(
        string DocumentType,
        string FileName,
        string? FilePath,
        long? FileSize,
        string? MimeType
    );

    // For family member creation
    public record CreateFamilyMemberDto(
        string FullName,
        string Relationship,
        DateTime DateOfBirth,
        string Gender,
        bool IsNominee,
        bool IsDependent
    );
    
    // For updating an existing employee
    public record UpdateEmployeeDto(
        string FullName,
        string? PhoneNumber,
        int DepartmentId,
        int DesignationId,
        DateTime JoiningDate,
        string Status, // "Active", "Inactive", "Resigned"
        int? ReportingManagerId
    );

    // For the dashboard stats cards
    public record StatsDto(
        int TotalEmployees,
        int ActiveEmployees,
        int TotalDepartments,
        int NewThisMonth
    );
}