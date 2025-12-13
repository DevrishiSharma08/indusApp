namespace Indus.Api.Models
{
    public class BankDetails
    {
        public int BankDetailsID { get; set; }
        public int EmployeeID { get; set; }
        public string BankName { get; set; }
        public string AccountNumber { get; set; }
        public string IFSCCode { get; set; }
        public string? BranchName { get; set; }
        public string? AccountHolderName { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation Properties
        public virtual Employee Employee { get; set; }
    }
}