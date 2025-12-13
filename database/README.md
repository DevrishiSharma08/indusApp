# IndusInternalApp Database Documentation

## Overview
This document contains the complete database schema, setup instructions, and migration history for the IndusInternalApp project.

**Last Updated**: December 2024
**Database**: SQL Server
**Entity Framework Core**: 8.x
**Current Schema Version**: 1.0

---

## 📋 Table of Contents
- [Database Setup](#database-setup)
- [Current Schema](#current-schema)
- [Entity Relationships](#entity-relationships)
- [Sample Data](#sample-data)
- [Migration History](#migration-history)
- [Backup Instructions](#backup-instructions)

---

## 🚀 Database Setup

### Prerequisites
- SQL Server 2019 or later
- .NET 8 SDK
- Entity Framework Core Tools

### Initial Setup
1. **Update Connection String** in `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=IndusInternalApp;Trusted_Connection=true;TrustServerCertificate=true;"
  }
}
```

2. **Run Migrations**:
```bash
cd backend/Indus.Api
dotnet ef database update
```

3. **Verify Tables Created**:
Check that all tables are created in your SQL Server database.

---

## 📊 Current Schema

### Core Tables

#### 1. **Employees** (Main employee data)
| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| EmployeeID | int | Primary Key | IDENTITY, NOT NULL |
| EmployeeCode | nvarchar(50) | Unique employee identifier | NOT NULL |
| FullName | nvarchar(100) | Employee full name | NOT NULL |
| Email | nvarchar(100) | Work email address | NOT NULL, UNIQUE |
| PasswordHash | nvarchar(255) | Hashed password for login | NOT NULL |
| PhoneNumber | nvarchar(20) | Contact phone number | NULL |
| PersonalEmail | nvarchar(100) | Personal email address | NULL |
| DateOfBirth | datetime2 | Birth date | NULL |
| Gender | nvarchar(10) | Gender (Male/Female/Other) | NULL |
| BloodGroup | nvarchar(10) | Blood group (A+, B+, etc.) | NULL |
| MaritalStatus | nvarchar(20) | Marital status | NULL |
| WeddingDate | datetime2 | Wedding date (if married) | NULL |
| CurrentAddress | nvarchar(500) | Current residential address | NULL |
| PermanentAddress | nvarchar(500) | Permanent address | NULL |
| DateOfJoining | datetime2 | Employee joining date | NOT NULL |
| ConfirmationDate | datetime2 | Probation confirmation date | NULL |
| EmployeeType | nvarchar(20) | Employment type (Permanent/Contract/Intern) | NULL |
| WorkLocation | nvarchar(100) | Work location/office | NULL |
| UanNumber | nvarchar(50) | UAN number for PF | NULL |
| PanCardNumber | nvarchar(20) | PAN card number | NULL |
| AadharCardNumber | nvarchar(20) | Aadhar card number | NULL |
| IsActive | bit | Active status | DEFAULT 1 |
| Status | nvarchar(20) | Employee status (Active/Inactive/Resigned) | DEFAULT 'Active' |
| IsLoginEnabled | bit | Login permission | DEFAULT 1 |
| PhotoPath | nvarchar(255) | Profile photo file path | NULL |
| CreatedAt | datetime2 | Record creation timestamp | DEFAULT GETUTCDATE() |
| UpdatedAt | datetime2 | Last update timestamp | NULL |
| RoleID | int | Foreign Key to Roles | NOT NULL |
| DepartmentID | int | Foreign Key to Departments | NOT NULL |
| DesignationID | int | Foreign Key to Designations | NOT NULL |
| ReportingManagerID | int | Foreign Key to Employees (self-reference) | NULL |

#### 2. **Roles** (User roles and permissions)
| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| RoleID | int | Primary Key | IDENTITY, NOT NULL |
| RoleName | nvarchar(50) | Role name (Admin, HR, Manager, Employee) | NOT NULL, UNIQUE |
| Description | nvarchar(255) | Role description | NULL |
| CreatedAt | datetime2 | Record creation timestamp | DEFAULT GETUTCDATE() |

#### 3. **Departments** (Company departments)
| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| DepartmentID | int | Primary Key | IDENTITY, NOT NULL |
| DepartmentName | nvarchar(100) | Department name | NOT NULL, UNIQUE |
| DepartmentCode | nvarchar(20) | Department code/abbreviation | NULL |
| Description | nvarchar(255) | Department description | NULL |
| CreatedAt | datetime2 | Record creation timestamp | DEFAULT GETUTCDATE() |

#### 4. **Designations** (Job titles/positions)
| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| DesignationID | int | Primary Key | IDENTITY, NOT NULL |
| DesignationName | nvarchar(100) | Designation/job title | NOT NULL, UNIQUE |
| Level | int | Hierarchy level (1=Junior, 5=Senior) | NULL |
| Description | nvarchar(255) | Designation description | NULL |
| CreatedAt | datetime2 | Record creation timestamp | DEFAULT GETUTCDATE() |

### Extended Tables

#### 5. **FamilyMembers** (Employee family information)
| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| FamilyMemberID | int | Primary Key | IDENTITY, NOT NULL |
| EmployeeID | int | Foreign Key to Employees | NOT NULL |
| FullName | nvarchar(100) | Family member name | NOT NULL |
| Relationship | nvarchar(50) | Relationship (Spouse, Child, Father, etc.) | NOT NULL |
| DateOfBirth | datetime2 | Birth date | NOT NULL |
| Gender | nvarchar(10) | Gender | NOT NULL |
| IsNominee | bit | Nominee for benefits | DEFAULT 0 |
| IsDependent | bit | Dependent for insurance | DEFAULT 0 |
| CreatedAt | datetime2 | Record creation timestamp | DEFAULT GETUTCDATE() |

#### 6. **BankDetails** (Employee banking information)
| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| BankDetailsID | int | Primary Key | IDENTITY, NOT NULL |
| EmployeeID | int | Foreign Key to Employees | NOT NULL, UNIQUE |
| BankName | nvarchar(100) | Bank name | NOT NULL |
| AccountNumber | nvarchar(50) | Bank account number | NOT NULL |
| IFSCCode | nvarchar(20) | IFSC code | NOT NULL |
| BranchName | nvarchar(100) | Bank branch name | NULL |
| AccountHolderName | nvarchar(100) | Account holder name | NULL |
| CreatedAt | datetime2 | Record creation timestamp | DEFAULT GETUTCDATE() |
| UpdatedAt | datetime2 | Last update timestamp | NULL |

#### 7. **SalaryDetails** (Employee salary information)
| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| SalaryDetailsID | int | Primary Key | IDENTITY, NOT NULL |
| EmployeeID | int | Foreign Key to Employees | NOT NULL, UNIQUE |
| AnnualCTC | decimal(18,2) | Annual Cost to Company | NOT NULL |
| BasicSalary | decimal(18,2) | Basic salary component | NOT NULL |
| HRA | decimal(18,2) | House Rent Allowance | NOT NULL |
| PFDeduction | decimal(18,2) | Provident Fund deduction | NOT NULL |
| ProfessionalTax | decimal(18,2) | Professional tax | NOT NULL |
| OtherAllowances | decimal(18,2) | Other allowances | NOT NULL |
| CostRate | decimal(18,2) | Hourly/daily cost rate for projects | NULL |
| CostType | nvarchar(10) | Cost calculation type (hour/day) | DEFAULT 'hour' |
| EffectiveFrom | datetime2 | Salary effective from date | DEFAULT GETUTCDATE() |
| EffectiveTo | datetime2 | Salary effective until date | NULL |
| IsActive | bit | Active salary record | DEFAULT 1 |
| CreatedAt | datetime2 | Record creation timestamp | DEFAULT GETUTCDATE() |
| UpdatedAt | datetime2 | Last update timestamp | NULL |

#### 8. **EmployeeDocuments** (Document management)
| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| DocumentID | int | Primary Key | IDENTITY, NOT NULL |
| EmployeeID | int | Foreign Key to Employees | NOT NULL |
| DocumentType | nvarchar(50) | Document type (AadharCard, PanCard, BankPassbook) | NOT NULL |
| FileName | nvarchar(255) | Original file name | NOT NULL |
| FilePath | nvarchar(500) | File storage path | NOT NULL |
| FileSize | nvarchar(20) | File size | NULL |
| MimeType | nvarchar(100) | File MIME type | NULL |
| UploadedAt | datetime2 | Upload timestamp | DEFAULT GETUTCDATE() |
| UploadedBy | nvarchar(100) | User who uploaded | NULL |

---

## 🔗 Entity Relationships

### Primary Relationships
```
Roles (1) ←→ (Many) Employees
Departments (1) ←→ (Many) Employees
Designations (1) ←→ (Many) Employees
Employees (1) ←→ (Many) Employees (ReportingManager)

Employees (1) ←→ (Many) FamilyMembers
Employees (1) ←→ (1) BankDetails
Employees (1) ←→ (1) SalaryDetails
Employees (1) ←→ (Many) EmployeeDocuments
```

### Foreign Key Constraints
- **Employees.RoleID** → Roles.RoleID
- **Employees.DepartmentID** → Departments.DepartmentID
- **Employees.DesignationID** → Designations.DesignationID
- **Employees.ReportingManagerID** → Employees.EmployeeID (RESTRICT)
- **FamilyMembers.EmployeeID** → Employees.EmployeeID (CASCADE)
- **BankDetails.EmployeeID** → Employees.EmployeeID (CASCADE)
- **SalaryDetails.EmployeeID** → Employees.EmployeeID (CASCADE)
- **EmployeeDocuments.EmployeeID** → Employees.EmployeeID (CASCADE)

---

## 📝 Sample Data

### Required Initial Data
Before adding employees, ensure these reference tables have data:

#### Roles
```sql
INSERT INTO Roles (RoleName, Description) VALUES
('Admin', 'System Administrator'),
('HR', 'Human Resources'),
('Manager', 'Department Manager'),
('Employee', 'Regular Employee');
```

#### Departments
```sql
INSERT INTO Departments (DepartmentName, DepartmentCode, Description) VALUES
('Engineering', 'ENG', 'Software Development Team'),
('Human Resources', 'HR', 'Human Resources Management'),
('Finance', 'FIN', 'Finance and Accounting'),
('Marketing', 'MKT', 'Marketing and Sales'),
('Operations', 'OPS', 'Operations and Support');
```

#### Designations
```sql
INSERT INTO Designations (DesignationName, Level, Description) VALUES
('Software Engineer', 2, 'Junior Software Developer'),
('Senior Software Engineer', 3, 'Senior Software Developer'),
('Tech Lead', 4, 'Technical Team Lead'),
('Engineering Manager', 5, 'Engineering Department Manager'),
('HR Executive', 2, 'HR Operations Executive'),
('HR Manager', 4, 'HR Department Manager');
```

---

## 📈 Migration History

### Version 1.0 (Initial Release)
**Date**: December 2024
**Changes**:
- Created initial database schema
- Added core tables: Employees, Roles, Departments, Designations
- Added extended tables: FamilyMembers, BankDetails, SalaryDetails, EmployeeDocuments
- Configured Entity Framework relationships
- Added foreign key constraints

### Migration Commands Used:
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

---

## 💾 Backup Instructions

### Daily Backup (Recommended)
```sql
BACKUP DATABASE [IndusInternalApp]
TO DISK = 'C:\Backups\IndusInternalApp_' + FORMAT(GETDATE(), 'yyyyMMdd') + '.bak'
WITH FORMAT, INIT;
```

### Restore from Backup
```sql
RESTORE DATABASE [IndusInternalApp]
FROM DISK = 'C:\Backups\IndusInternalApp_20241201.bak'
WITH REPLACE;
```

---

## 🔧 Maintenance

### Regular Tasks
1. **Weekly**: Check database size and performance
2. **Monthly**: Review and clean old employee documents
3. **Quarterly**: Archive inactive employee records
4. **Annually**: Update salary structures and benefits

### Performance Monitoring
- Monitor query execution times
- Check index usage and optimization
- Review connection pool settings
- Analyze slow query logs

---

## 📞 Support

For database-related issues:
1. Check Entity Framework logs
2. Verify connection string
3. Ensure SQL Server is running
4. Review migration history
5. Check foreign key constraints

---

**⚠️ Important Notes:**
- Always backup database before running migrations
- Test schema changes in development environment first
- Update this README when making database changes
- Follow naming conventions for consistency
- Document any custom indexes or stored procedures

---

*This README is maintained as part of the IndusInternalApp project. Please keep it updated with any database schema changes.*