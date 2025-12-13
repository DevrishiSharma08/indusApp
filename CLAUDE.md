# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

IndusInternalApp is a mobile-first business management application with:
- **Backend**: ASP.NET Core 8.0 Web API with Entity Framework Core
- **Frontend**: Next.js 15.5 with React 19, TypeScript, and Tailwind CSS 4.0
- **Database**: SQL Server with comprehensive employee management schema
- **Authentication**: Cookie-based authentication with role-based access control

## Essential Commands

### Backend (ASP.NET Core)

```bash
# Navigate to backend
cd backend/Indus.Api

# Restore packages
dotnet restore

# Run backend (development)
dotnet run

# Build backend
dotnet build

# Entity Framework migrations
dotnet ef migrations add MigrationName
dotnet ef database update
dotnet ef database drop  # Warning: drops entire database

# Publish for production
dotnet publish -c Release -o ./publish
```

**Backend runs on**: `http://localhost:5153` or `https://localhost:7000`

### Frontend (Next.js)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run development server (with Turbopack)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

**Frontend runs on**: `http://localhost:3000`

### Environment Setup

**Backend**: Update `backend/Indus.Api/appsettings.Development.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=IndusInternalDb;Trusted_Connection=true"
  }
}
```

**Frontend**: Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5153
```

## Architecture

### Backend Structure

```
backend/Indus.Api/
├── Controllers/        # API endpoints (Auth, Admin, Employees, Departments, Designations)
├── Models/            # Entity models (Employee, Role, Department, Designation, etc.)
├── Data/              # DbContext and database configuration
├── Services/          # Business logic (AuthService)
├── Repositories/      # Data access layer (EmployeeRepository)
└── Migrations/        # EF Core migrations
```

**Key Architecture Points**:
- **Repository Pattern**: Data access abstracted via `IEmployeeRepository` → `EmployeeRepository`
- **Service Layer**: Business logic in `AuthService` (handles authentication, password hashing with BCrypt)
- **DTOs**: Located in Controllers folder (e.g., `AuthDtos.cs`, `EmployeeDtos.cs`)
- **DbContext**: `IndusDbContext` configures all entity relationships including self-referencing (Employee.ReportingManager)

**Authentication Flow**:
- Cookie-based auth configured in `Program.cs`
- Cookie name: `IndusApp.AuthCookie`
- 8-hour expiration with sliding window
- API returns 401 instead of redirect for unauthorized requests
- CORS configured for `http://localhost:3000`

**Database Relationships**:
- Employee ↔ Role, Department, Designation (many-to-one)
- Employee ↔ Employee (self-referencing for ReportingManager)
- Employee ↔ FamilyMembers (one-to-many, cascade delete)
- Employee ↔ BankDetails (one-to-one, cascade delete)
- Employee ↔ SalaryDetails (one-to-one, cascade delete)
- Employee ↔ EmployeeDocuments (one-to-many, cascade delete)

### Frontend Structure

```
frontend/src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Main dashboard
│   ├── hrm/               # HRM module (employees, leave-attendance, settings)
│   ├── projectmanagement/ # Project management module
│   ├── login/             # Authentication pages
│   └── settings/          # App settings
├── components/            # React components
│   ├── ui/               # shadcn/ui components (accordion, alert-dialog, badge, etc.)
│   └── [custom]/         # Custom components (DashboardLayout, Sidebar, etc.)
├── services/             # API client (api.ts)
├── contexts/             # React contexts (ThemeContext)
└── lib/                  # Utilities (cn function for class merging)
```

**Key Frontend Patterns**:
- **Design System**: shadcn/ui components + custom Tailwind utilities (see `STYLE_GUIDE.md`)
- **Layout**: `DashboardLayout` wraps authenticated pages, provides Sidebar (desktop) and BottomNavigation (mobile)
- **API Client**: Centralized in `services/api.ts` using class-based `ApiClient`
  - All requests include `credentials: 'include'` for cookie auth
  - Base URL from `NEXT_PUBLIC_API_URL` environment variable
- **Theming**: `ThemeContext` provides dark/light mode, uses `next-themes`
- **Mobile-First**: All components start mobile, scale up with breakpoints (sm:, lg:)

**Component Architecture**:
- Use shadcn/ui components from `components/ui/` when available
- Custom reusable components in `components/` root
- Semantic design tokens (text-foreground, bg-card, etc.) instead of raw Tailwind colors
- Page components follow pattern: `DashboardLayout` → page-container → page-header → content

### API Communication

**API Base**: `http://localhost:5153/api/`

**Key Endpoints**:
- `POST /auth/login` - Login with email/password
- `POST /auth/logout` - Logout (clears cookie)
- `POST /auth/register` - Register new employee
- `GET /admin/users` - Get all employees (admin only)
- `PUT /admin/users/{id}/role` - Update employee role
- `PUT /admin/users/{id}/status` - Activate/deactivate employee
- `GET /employees` - Get employees with optional filters (search, department, status)
- `GET /employees/{id}` - Get employee by ID
- `POST /employees` - Create new employee (comprehensive endpoint)
- `GET /employees/stats` - Get employee statistics
- `GET /employees/departments` - Get all departments
- `GET /employees/designations` - Get all designations
- `GET /employees/managers` - Get all managers
- `GET /employees/roles` - Get all roles

## Important Development Guidelines

### Frontend Styling (CRITICAL)

**Read `frontend/STYLE_GUIDE.md` before making UI changes**. Key rules:
- Always use semantic design tokens (e.g., `text-muted-foreground`, `bg-card`)
- Never use hardcoded Tailwind colors (e.g., `text-gray-500`, `bg-blue-600`)
- Start with mobile styles, add responsive breakpoints
- Use utility classes: `page-container`, `page-header`, `page-title`, `section-spacing`, `content-spacing`
- Grid layouts: `card-grid`, `card-grid-2`, `card-grid-3`
- Use shadcn/ui components when available, don't create custom equivalents

### Backend Patterns

**When adding new entities**:
1. Create model in `Models/` folder
2. Add `DbSet<Entity>` to `IndusDbContext`
3. Configure relationships in `OnModelCreating` (be explicit with primary keys, foreign keys, cascade behavior)
4. Run `dotnet ef migrations add MigrationName`
5. Review generated migration before running `dotnet ef database update`

**When adding API endpoints**:
1. Create controller in `Controllers/` folder
2. Use DTOs for request/response (keep in same folder or separate DTO file)
3. Inject dependencies via constructor (repositories, services, DbContext)
4. Use `[Authorize]` for protected endpoints, `[Authorize(Roles = "Admin")]` for admin-only
5. Return proper HTTP status codes (200, 201, 400, 401, 404, 500)

**Repository Pattern**:
- For complex data access, create interface + implementation in `Repositories/`
- Register in `Program.cs`: `builder.Services.AddScoped<IRepository, Repository>()`
- Keep business logic in services, data access in repositories

### Frontend Patterns

**When adding new pages**:
1. Create in appropriate `app/` subfolder
2. Wrap with `<DashboardLayout>` for authenticated pages
3. Use page structure: `page-container` → `page-header` → `section-spacing` → content
4. Import needed shadcn/ui components from `components/ui/`

**When adding API calls**:
1. Add TypeScript interfaces for request/response in `services/api.ts`
2. Add method to `ApiClient` class
3. Use `apiClient.methodName()` in components
4. Handle errors with try/catch, display user-friendly messages

**State Management**:
- Use React hooks (useState, useEffect) for component state
- Use Context for global state (see `ThemeContext` example)
- No external state management library currently used

## Database Schema Overview

**Core Tables**:
- **Employees**: Main employee data (50+ fields including personal, job, government docs)
- **Roles**: User roles (Admin, HR, Manager, Employee)
- **Departments**: Company departments with codes
- **Designations**: Job titles with hierarchy levels
- **FamilyMembers**: Employee family information
- **BankDetails**: Banking information (one-to-one with Employee)
- **SalaryDetails**: Salary breakdown with CTC, allowances, deductions
- **EmployeeDocuments**: Document management (Aadhar, PAN, etc.)

See `database/README.md` for complete schema documentation.

## Common Development Tasks

### Add a new module
1. Create folder in `frontend/src/app/[module-name]/`
2. Add page.tsx with DashboardLayout
3. Update Sidebar.tsx navigation items
4. Create backend controller if needed
5. Add routes to API client

### Modify employee fields
1. Update `Employee` model in `backend/Indus.Api/Models/Employee.cs`
2. Create migration: `dotnet ef migrations add AddFieldToEmployee`
3. Update migration, then `dotnet ef database update`
4. Update DTOs in controllers
5. Update TypeScript interfaces in `frontend/src/services/api.ts`
6. Update frontend forms/displays

### Add authentication to new endpoint
1. Add `[Authorize]` attribute to controller or action
2. For role-based: `[Authorize(Roles = "Admin,HR")]`
3. Test unauthorized access returns 401
4. Frontend will redirect to login on 401 (handle in components)

## Troubleshooting

**"Database does not exist"**: Run `dotnet ef database update` from `backend/Indus.Api/`

**CORS errors**: Verify frontend URL in `Program.cs` CORS policy matches running frontend port

**Authentication not working**: Check cookies are enabled, credentials: 'include' in fetch, CORS allows credentials

**API returning 404**: Verify backend is running, check API_BASE_URL environment variable

**Styles not applying**: Verify using semantic tokens from globals.css, not hardcoded colors

**Component not found**: Check if shadcn/ui component needs to be installed (see components.json)

## Project Status

**Current Branch**: `feature/leave-module`

**Recent Work**:
- Leave and attendance module in progress (`frontend/src/app/hrm/leave-attendance/`)
- HRM module structure established
- Employee CRUD operations implemented
- Multiple UI components added (DataTable, KPICard, PageHeader, StatusBadge, etc.)

**Untracked Files** (potential new features):
- Project management module started
- Theme demo page
- Various new UI components
