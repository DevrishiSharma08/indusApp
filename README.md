# IndusInternalApp

A comprehensive, mobile-first internal business management application built with .NET Core Web API backend and Next.js frontend. Features a modern dashboard with integrated modules for HRM, CRM, Project Management, Task Management, and Finance.

## 🏗️ Architecture

- **Backend**: ASP.NET Core 8.0 Web API
- **Frontend**: Next.js 15.5 with React 19 and Tailwind CSS
- **Database**: SQL Server with Entity Framework Core
- **Authentication**: Cookie-based authentication with secure logout
- **UI Components**: Lucide React icons with responsive design
- **Charts**: Recharts for data visualization

## 📁 Project Structure

```
IndusInternalApp/
├── backend/
│   └── Indus.Api/                  # ASP.NET Core Web API
│       ├── Controllers/            # API Controllers
│       ├── Models/                 # Data Models
│       ├── Data/                   # Database Context
│       ├── Services/               # Business Logic
│       ├── Repositories/           # Data Access Layer
│       └── Migrations/             # EF Core Migrations
├── frontend/                       # Next.js Application
│   ├── src/
│   │   ├── app/                    # Next.js App Router
│   │   │   ├── dashboard/          # Main Dashboard Page
│   │   │   └── login/              # Authentication Pages
│   │   ├── components/             # React Components
│   │   │   ├── DashboardLayout.tsx # Main Layout Component
│   │   │   ├── ProfileDropdown.tsx # User Profile & Logout
│   │   │   └── Sidebar.tsx         # Desktop Navigation
│   │   ├── hooks/                  # Custom React Hooks
│   │   ├── lib/                    # Utilities
│   │   └── services/               # API Services
│   │       └── api.ts              # Backend API Integration
│   └── public/                     # Static Assets
└── IndusInternalApp.sln            # Visual Studio Solution File
```

## ✨ Features

### 🔐 Authentication & Authorization
- **Modern Login Page**: Mobile-first responsive design
- **Cookie-based Authentication**: Secure session management
- **Role-based Access Control**: Admin/Employee permissions
- **Secure Logout**: Backend API integration with automatic redirect
- **Profile Management**: User dropdown with settings access

### 📊 Dashboard & Analytics
- **Mobile-First Design**: Optimized for all screen sizes
- **Key Performance Indicators**: Role-based KPI cards
- **Interactive Charts**: Real-time performance visualization using Recharts
- **Responsive Layout**: Desktop sidebar, mobile bottom navigation
- **Dark Mode Ready**: Full dark/light theme support

### 🏢 Business Modules
- **HRM (Human Resource Management)**: Employee lifecycle & performance
- **CRM (Customer Relationship Management)**: Lead generation & client management
- **Project Management**: Development & implementation tracking
- **Task Management**: Bug fixes, improvements & customizations
- **Finance**: MIS, revenue tracking & expense management

### 🎯 User Experience
- **Compact Mobile Layout**: Applications left, KPIs right on mobile
- **Quick Access Actions**: Create new items, view reports
- **Search Functionality**: Global search across modules
- **Notification System**: Real-time alerts and updates
- **AI Bot Integration**: Floating assistant button

### 👨‍💼 Admin Features
- View all employees
- Update employee roles
- Activate/deactivate employee accounts
- System analytics and reporting

## 🛠️ Tech Stack

### Backend
- **Framework**: ASP.NET Core 8.0
- **Database**: Entity Framework Core with SQL Server
- **Authentication**: ASP.NET Core Identity with Cookies
- **Security**: BCrypt.Net for password hashing
- **API Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: Next.js 15.5 with App Router
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4.0
- **Language**: TypeScript
- **Build Tool**: Turbopack
- **Icons**: Lucide React
- **Charts**: Recharts for data visualization
- **Components**: Custom responsive components

## 🚀 Getting Started

### Prerequisites
- .NET 8.0 SDK
- Node.js 18+ and npm
- SQL Server (LocalDB or SQL Server Express)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend/Indus.Api
```

2. Restore NuGet packages:
```bash
dotnet restore
```

3. Update the connection string in `appsettings.Development.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=IndusInternalDb;Trusted_Connection=true"
  }
}
```

4. Run Entity Framework migrations:
```bash
dotnet ef database update
```

5. Start the API:
```bash
dotnet run
```

The API will be available at `https://localhost:7000` (or the configured port).

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### CORS Configuration
The backend is configured to allow requests from the Next.js frontend running on `http://localhost:3000`. Update the CORS policy in `Program.cs` if your frontend runs on a different port.

### Authentication
- Cookie expiration: 8 hours
- Sliding expiration enabled
- Secure authentication events for API responses
- Automatic logout redirect to login page

## 📊 Database Schema

### Employee Table
- `EmployeeID` (Primary Key)
- `FullName`
- `Email` (Unique)
- `PasswordHash`
- `IsActive`
- `RoleID` (Foreign Key)

### Role Table
- `RoleID` (Primary Key)
- `RoleName` (Admin/Employee)

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Employee registration
- `POST /api/auth/login` - Employee login with role-based response
- `POST /api/auth/logout` - Secure logout with cookie cleanup

### Admin (Requires Admin Role)
- `GET /api/admin/users` - Get all employees with roles
- `PUT /api/admin/users/{id}/role` - Update employee role
- `PUT /api/admin/users/{id}/status` - Activate/deactivate employee

### User Management
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update user profile information

## 🎨 UI/UX Features

### Mobile-First Design
- **Responsive Layout**: Optimized for mobile, tablet, and desktop
- **Touch-Friendly**: Large tap targets and intuitive gestures
- **Compact Views**: Efficient use of mobile screen space

### Desktop Experience
- **Collapsible Sidebar**: Full navigation with module sections
- **Multi-Column Layout**: Side-by-side content organization
- **Keyboard Shortcuts**: Power user accessibility

### Design System
- **Modern UI**: Clean, professional interface
- **Consistent Icons**: Lucide React icon library
- **Dark Mode**: System preference detection
- **Loading States**: Smooth transitions and feedback

## 🧪 Development

### Running Tests
```bash
# Backend tests
cd backend/Indus.Api
dotnet test

# Frontend tests
cd frontend
npm run test
```

### Building for Production
```bash
# Backend
cd backend/Indus.Api
dotnet publish -c Release

# Frontend
cd frontend
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and ensure they pass
5. Submit a pull request

## 📄 License

This project is for internal use only.

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Ensure SQL Server is running
   - Verify connection string in appsettings.json
   - Run `dotnet ef database update` to apply migrations

2. **CORS Errors**
   - Check that frontend URL matches CORS policy in backend
   - Ensure cookies are enabled for cross-origin requests

3. **Authentication Issues**
   - Clear browser cookies and try again
   - Verify that authentication middleware is properly configured
   - Check if environment variables are set correctly

4. **Dashboard Loading Issues**
   - Ensure both backend and frontend servers are running
   - Check browser console for JavaScript errors
   - Verify API endpoints are accessible

5. **Mobile View Problems**
   - Clear browser cache and refresh
   - Test on different mobile browsers
   - Check responsive breakpoints in developer tools

## 🚀 Deployment

### Production Build
```bash
# Frontend production build
cd frontend
npm run build
npm start

# Backend production deployment
cd backend/Indus.Api
dotnet publish -c Release -o ./publish
```

### Environment Configuration
- Update `NEXT_PUBLIC_API_URL` for production backend URL
- Configure production database connection string
- Set up HTTPS certificates for secure communication

## 📱 Mobile App Features

### Responsive Dashboard
- **KPI Cards**: Compact mobile view with essential metrics
- **Application Grid**: Easy access to all business modules
- **Performance Charts**: Touch-friendly data visualization
- **Profile Management**: Quick access to user settings and logout

### Navigation
- **Bottom Navigation**: Primary mobile navigation with 5 key sections
- **Floating Action Button**: Quick create functionality
- **AI Assistant**: Always-accessible help system

## 📞 Support

For technical support or questions about this application, please contact the development team.

## 🎯 Roadmap

### Upcoming Features
- Real-time notifications
- Advanced reporting dashboard
- Mobile app (React Native)
- Integration with external systems
- Advanced user permissions
- Audit trail and logging

### Performance Optimizations
- API response caching
- Database query optimization
- Frontend code splitting
- Image optimization
- Progressive Web App (PWA) features