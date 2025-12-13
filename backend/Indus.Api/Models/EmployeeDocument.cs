namespace Indus.Api.Models
{
    public class EmployeeDocument
    {
        public int DocumentID { get; set; }
        public int EmployeeID { get; set; }
        public string DocumentType { get; set; } // AadharCard, PanCard, BankPassbook, etc.
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public string? FileSize { get; set; }
        public string? MimeType { get; set; }
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
        public string? UploadedBy { get; set; }

        // Navigation Properties
        public virtual Employee Employee { get; set; }
    }
}