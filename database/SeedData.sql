-- =============================================
-- IndusInternalApp Seed Data
-- Insert Master Data
-- =============================================

USE IndusInternalDb;
GO

-- =============================================
-- Insert Roles
-- =============================================
INSERT INTO Roles (RoleName) VALUES
    ('Admin'),
    ('HR'),
    ('Manager'),
    ('Employee');
GO

-- =============================================
-- Insert Departments
-- =============================================
INSERT INTO Departments (DepartmentName) VALUES
    ('Engineering'),
    ('Human Resources'),
    ('Sales'),
    ('Marketing'),
    ('Finance'),
    ('Operations'),
    ('IT Support'),
    ('Product Management');
GO

-- =============================================
-- Insert Designations
-- =============================================
INSERT INTO Designations (DesignationName) VALUES
    ('CEO'),
    ('CTO'),
    ('HR Manager'),
    ('Senior Software Engineer'),
    ('Software Engineer'),
    ('Junior Developer'),
    ('Sales Manager'),
    ('Sales Executive'),
    ('Marketing Manager'),
    ('Accountant'),
    ('Operations Manager'),
    ('Product Manager');
GO

-- =============================================
-- Insert Sample Employees
-- Password: Admin@123 (plain text for now)
-- =============================================
INSERT INTO Employees (
    FullName, Email, PasswordHash, PhoneNumber,
    DateOfJoining, RoleID, DepartmentID, DesignationID,
    IsActive, Status, IsLoginEnabled, Gender, EmployeeType
) VALUES
    -- Admin User
    ('Admin User', 'admin@indus.com', 'Admin@123', '+91-9876543210',
     GETUTCDATE(), 1, 2, 1, 1, 'Active', 1, 'Male', 'Permanent'),

    -- HR Manager
    ('Priya Sharma', 'priya.sharma@indus.com', 'Hr@123', '+91-9876543211',
     GETUTCDATE(), 2, 2, 3, 1, 'Active', 1, 'Female', 'Permanent'),

    -- Engineering Manager
    ('Rajesh Kumar', 'rajesh.kumar@indus.com', 'Manager@123', '+91-9876543212',
     GETUTCDATE(), 3, 1, 2, 1, 'Active', 1, 'Male', 'Permanent'),

    -- Software Engineers
    ('Amit Patel', 'amit.patel@indus.com', 'Employee@123', '+91-9876543213',
     GETUTCDATE(), 4, 1, 4, 1, 'Active', 1, 'Male', 'Permanent'),

    ('Sneha Reddy', 'sneha.reddy@indus.com', 'Employee@123', '+91-9876543214',
     GETUTCDATE(), 4, 1, 5, 1, 'Active', 1, 'Female', 'Permanent');
GO

-- Update ReportingManagerID (employees report to managers)
UPDATE Employees SET ReportingManagerID = 1 WHERE EmployeeID = 2; -- HR reports to Admin
UPDATE Employees SET ReportingManagerID = 1 WHERE EmployeeID = 3; -- Eng Manager reports to Admin
UPDATE Employees SET ReportingManagerID = 3 WHERE EmployeeID IN (4, 5); -- Engineers report to Eng Manager
GO

PRINT 'Seed data inserted successfully!';
PRINT 'Default Users Created:';
PRINT '  Admin: admin@indus.com / Admin@123';
PRINT '  HR: priya.sharma@indus.com / Hr@123';
PRINT '  Manager: rajesh.kumar@indus.com / Manager@123';
PRINT '  Employee: amit.patel@indus.com / Employee@123';
GO
