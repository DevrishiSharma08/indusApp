using Indus.Api.Models;
using Microsoft.EntityFrameworkCore;

// Ensure the namespace is exactly this
namespace Indus.Api.Data
{
    public class IndusDbContext : DbContext
    {
        public IndusDbContext(DbContextOptions<IndusDbContext> options) : base(options)
        {
        }

        public DbSet<Employee> Employees { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Designation> Designations { get; set; }
        public DbSet<FamilyMember> FamilyMembers { get; set; }
        public DbSet<BankDetails> BankDetails { get; set; }
        public DbSet<SalaryDetails> SalaryDetails { get; set; }
        public DbSet<EmployeeDocument> EmployeeDocuments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Explicitly configure primary keys for all entities
            modelBuilder.Entity<Employee>().HasKey(e => e.EmployeeID);
            modelBuilder.Entity<Role>().HasKey(r => r.RoleID);
            modelBuilder.Entity<Department>().HasKey(d => d.DepartmentID);
            modelBuilder.Entity<Designation>().HasKey(d => d.DesignationID);
            modelBuilder.Entity<FamilyMember>().HasKey(f => f.FamilyMemberID);
            modelBuilder.Entity<BankDetails>().HasKey(b => b.BankDetailsID);
            modelBuilder.Entity<SalaryDetails>().HasKey(s => s.SalaryDetailsID);
            modelBuilder.Entity<EmployeeDocument>().HasKey(d => d.DocumentID);

            // Configure Employee relationships
            modelBuilder.Entity<Employee>()
                .HasOne(e => e.ReportingManager)
                .WithMany(e => e.DirectReports)
                .HasForeignKey(e => e.ReportingManagerID)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure one-to-many relationship: Employee -> FamilyMembers
            modelBuilder.Entity<FamilyMember>()
                .HasOne(f => f.Employee)
                .WithMany(e => e.FamilyMembers)
                .HasForeignKey(f => f.EmployeeID)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure one-to-one relationship: Employee -> BankDetails
            modelBuilder.Entity<BankDetails>()
                .HasOne(b => b.Employee)
                .WithOne(e => e.BankDetails)
                .HasForeignKey<BankDetails>(b => b.EmployeeID)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure one-to-one relationship: Employee -> SalaryDetails
            modelBuilder.Entity<SalaryDetails>()
                .HasOne(s => s.Employee)
                .WithOne(e => e.SalaryDetails)
                .HasForeignKey<SalaryDetails>(s => s.EmployeeID)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure EmployeeDocument entity
            modelBuilder.Entity<EmployeeDocument>()
                .HasOne(d => d.Employee)
                .WithMany(e => e.Documents)
                .HasForeignKey(d => d.EmployeeID)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure precision for decimal fields
            modelBuilder.Entity<SalaryDetails>()
                .Property(s => s.AnnualCTC)
                .HasPrecision(18, 2);

            modelBuilder.Entity<SalaryDetails>()
                .Property(s => s.BasicSalary)
                .HasPrecision(18, 2);

            modelBuilder.Entity<SalaryDetails>()
                .Property(s => s.HRA)
                .HasPrecision(18, 2);

            modelBuilder.Entity<SalaryDetails>()
                .Property(s => s.PFDeduction)
                .HasPrecision(18, 2);

            modelBuilder.Entity<SalaryDetails>()
                .Property(s => s.ProfessionalTax)
                .HasPrecision(18, 2);

            modelBuilder.Entity<SalaryDetails>()
                .Property(s => s.OtherAllowances)
                .HasPrecision(18, 2);

            modelBuilder.Entity<SalaryDetails>()
                .Property(s => s.CostRate)
                .HasPrecision(18, 2);
        }

    }
}