namespace Indus.Api.Models
{
    public class FamilyMember
    {
        public int FamilyMemberID { get; set; }
        public int EmployeeID { get; set; }
        public string FullName { get; set; }
        public string Relationship { get; set; } // Spouse, Child, Father, Mother, etc.
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; }
        public bool IsNominee { get; set; } = false;
        public bool IsDependent { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public virtual Employee Employee { get; set; }
    }
}