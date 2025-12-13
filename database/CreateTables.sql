-- =============================================
-- IndusInternalApp Database Schema
-- Pure ADO.NET Implementation
-- =============================================

USE master;
GO

-- Drop database if exists (CAUTION: This will delete all data)
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'IndusInternalDb')
BEGIN
    ALTER DATABASE IndusInternalDb SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE IndusInternalDb;
END
GO

-- Create database
CREATE DATABASE IndusInternalDb;
GO

USE IndusInternalDb;
GO

-- =============================================
-- Create Roles Table
-- =============================================
CREATE TABLE Roles (
    RoleID INT PRIMARY KEY IDENTITY(1,1),
    RoleName NVARCHAR(50) NOT NULL UNIQUE
);
GO

-- =============================================
-- Create Departments Table
-- =============================================
CREATE TABLE Departments (
    DepartmentID INT PRIMARY KEY IDENTITY(1,1),
    DepartmentName NVARCHAR(100) NOT NULL UNIQUE
);
GO

-- =============================================
-- Create Designations Table
-- =============================================
CREATE TABLE Designations (
    DesignationID INT PRIMARY KEY IDENTITY(1,1),
    DesignationName NVARCHAR(100) NOT NULL UNIQUE
);
GO

-- =============================================
-- Create Employees Table
-- =============================================
CREATE TABLE Employees (
    EmployeeID INT PRIMARY KEY IDENTITY(1,1),
    FullName NVARCHAR(200) NOT NULL,
    Email NVARCHAR(256) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    PhoneNumber NVARCHAR(20) NULL,
    PersonalEmail NVARCHAR(256) NULL,
    DateOfBirth DATETIME2 NULL,
    Gender NVARCHAR(10) NULL,
    BloodGroup NVARCHAR(5) NULL,
    MaritalStatus NVARCHAR(20) NULL,
    WeddingDate DATETIME2 NULL,

    -- Address Information
    CurrentAddress NVARCHAR(500) NULL,
    PermanentAddress NVARCHAR(500) NULL,

    -- Job Information
    DateOfJoining DATETIME2 NOT NULL,
    ConfirmationDate DATETIME2 NULL,
    EmployeeType NVARCHAR(50) NULL, -- Permanent, Contract, Intern
    WorkLocation NVARCHAR(100) NULL,

    -- Government Documents
    UanNumber NVARCHAR(50) NULL,
    PanCardNumber NVARCHAR(20) NULL,
    AadharCardNumber NVARCHAR(20) NULL,

    -- System Information
    IsActive BIT NOT NULL DEFAULT 1,
    Status NVARCHAR(20) NOT NULL DEFAULT 'Active', -- Active, Inactive, Resigned
    IsLoginEnabled BIT NOT NULL DEFAULT 1,
    PhotoPath NVARCHAR(500) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,

    -- Foreign Keys
    RoleID INT NOT NULL,
    DepartmentID INT NOT NULL,
    DesignationID INT NOT NULL,
    ReportingManagerID INT NULL,

    -- Constraints
    CONSTRAINT FK_Employees_Roles FOREIGN KEY (RoleID) REFERENCES Roles(RoleID),
    CONSTRAINT FK_Employees_Departments FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID),
    CONSTRAINT FK_Employees_Designations FOREIGN KEY (DesignationID) REFERENCES Designations(DesignationID),
    CONSTRAINT FK_Employees_ReportingManager FOREIGN KEY (ReportingManagerID) REFERENCES Employees(EmployeeID)
);
GO

-- =============================================
-- Create FamilyMembers Table
-- =============================================
CREATE TABLE FamilyMembers (
    FamilyMemberID INT PRIMARY KEY IDENTITY(1,1),
    EmployeeID INT NOT NULL,
    FullName NVARCHAR(200) NOT NULL,
    Relationship NVARCHAR(50) NOT NULL, -- Father, Mother, Spouse, Child, etc.
    DateOfBirth DATETIME2 NULL,
    PhoneNumber NVARCHAR(20) NULL,
    Occupation NVARCHAR(100) NULL,

    CONSTRAINT FK_FamilyMembers_Employees FOREIGN KEY (EmployeeID)
        REFERENCES Employees(EmployeeID) ON DELETE CASCADE
);
GO

-- =============================================
-- Create BankDetails Table
-- =============================================
CREATE TABLE BankDetails (
    BankDetailsID INT PRIMARY KEY IDENTITY(1,1),
    EmployeeID INT NOT NULL UNIQUE,
    BankName NVARCHAR(100) NULL,
    AccountNumber NVARCHAR(50) NULL,
    IFSCCode NVARCHAR(20) NULL,
    BranchName NVARCHAR(100) NULL,
    AccountHolderName NVARCHAR(200) NULL,

    CONSTRAINT FK_BankDetails_Employees FOREIGN KEY (EmployeeID)
        REFERENCES Employees(EmployeeID) ON DELETE CASCADE
);
GO

-- =============================================
-- Create SalaryDetails Table
-- =============================================
CREATE TABLE SalaryDetails (
    SalaryDetailsID INT PRIMARY KEY IDENTITY(1,1),
    EmployeeID INT NOT NULL UNIQUE,
    AnnualCTC DECIMAL(18,2) NULL,
    BasicSalary DECIMAL(18,2) NULL,
    HRA DECIMAL(18,2) NULL,
    PFDeduction DECIMAL(18,2) NULL,
    ProfessionalTax DECIMAL(18,2) NULL,
    OtherAllowances DECIMAL(18,2) NULL,
    CostRate DECIMAL(18,2) NULL,
    EffectiveDate DATETIME2 NULL,

    CONSTRAINT FK_SalaryDetails_Employees FOREIGN KEY (EmployeeID)
        REFERENCES Employees(EmployeeID) ON DELETE CASCADE
);
GO

-- =============================================
-- Create EmployeeDocuments Table
-- =============================================
CREATE TABLE EmployeeDocuments (
    DocumentID INT PRIMARY KEY IDENTITY(1,1),
    EmployeeID INT NOT NULL,
    DocumentType NVARCHAR(50) NOT NULL, -- Aadhar, PAN, Resume, Offer Letter, etc.
    DocumentName NVARCHAR(200) NOT NULL,
    FilePath NVARCHAR(500) NOT NULL,
    UploadedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),

    CONSTRAINT FK_EmployeeDocuments_Employees FOREIGN KEY (EmployeeID)
        REFERENCES Employees(EmployeeID) ON DELETE CASCADE
);
GO

-- =============================================
-- Create Indexes for Performance
-- =============================================
CREATE INDEX IX_Employees_Email ON Employees(Email);
CREATE INDEX IX_Employees_RoleID ON Employees(RoleID);
CREATE INDEX IX_Employees_DepartmentID ON Employees(DepartmentID);
CREATE INDEX IX_Employees_DesignationID ON Employees(DesignationID);
CREATE INDEX IX_Employees_ReportingManagerID ON Employees(ReportingManagerID);
CREATE INDEX IX_Employees_Status ON Employees(Status);
CREATE INDEX IX_FamilyMembers_EmployeeID ON FamilyMembers(EmployeeID);
CREATE INDEX IX_EmployeeDocuments_EmployeeID ON EmployeeDocuments(EmployeeID);
GO

PRINT 'Database schema created successfully!';
GO
