namespace Indus.Api.Models
{
    public class Employee
    {
        public int EmployeeID { get; set; }
        public string FullName { get; set; }
        public string? FatherName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string? PhoneNumber { get; set; }
        public string? EmergencyContactNumber { get; set; }
        public string? EmergencyContactRelation { get; set; }
        public string? PersonalEmail { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? BloodGroup { get; set; }
        public string? MaritalStatus { get; set; }
        public DateTime? WeddingDate { get; set; }

        // Address Information
        public string? CurrentAddress { get; set; }
        public string? PermanentAddress { get; set; }

        // Job Information
        public DateTime DateOfJoining { get; set; }
        public DateTime? ConfirmationDate { get; set; }
        public string? EmployeeType { get; set; } // Permanent, Contract, Intern
        public string? WorkLocation { get; set; }

        // Government Documents
        public string? UanNumber { get; set; }
        public string? PanCardNumber { get; set; }
        public string? AadharCardNumber { get; set; }

        // System Information
        public bool IsActive { get; set; } = true;
        public string Status { get; set; } = "Active"; // Active, Inactive, Resigned
        public bool IsLoginEnabled { get; set; } = true;
        public string? PhotoPath { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Foreign Keys
        public int RoleID { get; set; }
        public int DepartmentID { get; set; }
        public int DesignationID { get; set; }
        public int? ReportingManagerID { get; set; }

        // Navigation Properties
        public virtual Role Role { get; set; }
        public virtual Department Department { get; set; }
        public virtual Designation Designation { get; set; }
        public virtual Employee? ReportingManager { get; set; }
        public virtual ICollection<Employee> DirectReports { get; set; } = new List<Employee>();
        public virtual ICollection<FamilyMember> FamilyMembers { get; set; } = new List<FamilyMember>();
        public virtual BankDetails? BankDetails { get; set; }
        public virtual SalaryDetails? SalaryDetails { get; set; }
        public virtual ICollection<EmployeeDocument> Documents { get; set; } = new List<EmployeeDocument>();
    }
}