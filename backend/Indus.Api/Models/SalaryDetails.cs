namespace Indus.Api.Models
{
    public class SalaryDetails
    {
        public int SalaryDetailsID { get; set; }
        public int EmployeeID { get; set; }
        public decimal AnnualCTC { get; set; }
        public decimal BasicSalary { get; set; }
        public decimal HRA { get; set; }
        public decimal PFDeduction { get; set; }
        public decimal ProfessionalTax { get; set; }
        public decimal OtherAllowances { get; set; }
        public decimal? CostRate { get; set; } // For project costing
        public string? CostType { get; set; } = "hour"; // hour or day
        public DateTime EffectiveFrom { get; set; } = DateTime.UtcNow;
        public DateTime? EffectiveTo { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation Properties
        public virtual Employee Employee { get; set; }
    }
}