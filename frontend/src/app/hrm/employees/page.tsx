'use client';

import { useState, useEffect } from 'react';
import { Users, Plus, Eye, Edit, Trash2, Mail, Phone, Building2, Calendar, MoreVertical } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import FilterExportBar from '@/components/FilterExportBar';
import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { apiClient, type Employee } from '@/services/api';

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewType, setViewType] = useState<'card' | 'grid' | 'table'>('card');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  // Fetch employees and departments from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeeData, departmentData] = await Promise.all([
          apiClient.getEmployees({
            search: searchTerm || undefined,
            department: filterDepartment !== 'all' ? filterDepartment : undefined,
            status: filterStatus !== 'all' ? filterStatus : undefined
          }),
          apiClient.getDepartments()
        ]);
        setEmployees(employeeData);
        setDepartments(departmentData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        // No fallback - show empty arrays if API fails
        setEmployees([]);
        setDepartments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm, filterDepartment, filterStatus]); // Re-fetch when filters change

  // Since backend handles filtering, we can use employees directly
  // But we keep local filtering for immediate UI feedback before API calls
  const filteredEmployees = employees;

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status.toLowerCase()) {
      case 'active':
        return `${baseClasses} bg-emerald-500/10 text-emerald-600 dark:text-emerald-400`;
      case 'inactive':
        return `${baseClasses} bg-destructive/10 text-destructive`;
      case 'resigned':
        return `${baseClasses} bg-muted text-muted-foreground`;
      default:
        return `${baseClasses} bg-muted text-muted-foreground`;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Handle delete employee
  const handleDelete = async () => {
    if (!employeeToDelete) return;

    try {
      await apiClient.deleteEmployee(employeeToDelete.userId);
      // Remove from local state
      setEmployees(employees.filter(emp => emp.userId !== employeeToDelete.userId));
      setDeleteModalOpen(false);
      setEmployeeToDelete(null);
      // Show success message (you can add a toast notification here)
      alert('Employee deleted successfully');
    } catch (error) {
      console.error('Failed to delete employee:', error);
      alert('Failed to delete employee. Please try again.');
    }
  };

  const openDeleteModal = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setDeleteModalOpen(true);
    setOpenMenuId(null); // Close the dropdown menu
  };

  // Handle export functionality
  const handleExport = (format: 'excel' | 'csv' | 'pdf') => {
    const dataToExport = filteredEmployees.map((employee:any) => ({
      'Full Name': employee.fullName,
      'Email': employee.email,
      'Phone Number': employee.phoneNumber,
      'Department': employee.department,
      'Designation': employee.designation,
      'Joining Date': employee.joiningDate,
      'Status': employee.status,
      'Manager Name': employee.managerName || 'N/A'
    }));

    // In a real app, you would use a library like xlsx, csv-writer, or jsPDF
    // For now, we'll just show an alert
    alert(`Exporting ${filteredEmployees.length} team members to ${format.toUpperCase()} format...`);
    console.log('Data to export:', dataToExport);
  };

  // Filter configuration for FilterExportBar
  const filterConfig = [
    {
      key: 'department',
      label: 'Department',
      options: [
        { value: 'all', label: 'All Departments' },
        ...departments.map(dept => ({ value: dept.name, label: dept.name }))
      ],
      value: filterDepartment,
      onChange: setFilterDepartment
    },
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'resigned', label: 'Resigned' }
      ],
      value: filterStatus,
      onChange: setFilterStatus
    }
  ];

  return (
    <DashboardLayout>
      <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">
        {/* Header - Mobile Optimized with Floating Add Button */}
        <div className="relative">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Team Member Directory</h1>

            {/* Mobile: Floating + Button | Desktop: Full Button */}
            <Link
              href="/hrm/employees/add"
              className="flex items-center justify-center sm:space-x-2 sm:px-4 sm:py-2.5 bg-primary text-primary-foreground rounded-full sm:rounded-lg hover:bg-primary/90 transition-colors font-medium w-10 h-10 sm:w-auto sm:h-auto"
            >
              <Plus className="w-5 h-5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline text-sm">Add Team Member</span>
            </Link>
          </div>
        </div>

        {/* Stats - Desktop: All 4 | Mobile: Only 2 (Active + New Hires) */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {/* Total Team Members - Desktop Only */}
          <div className="hidden lg:block bg-card rounded-xl p-4 shadow-sm border border-border">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-primary flex-shrink-0" />
              <div className="ml-3 min-w-0">
                <p className="text-sm text-muted-foreground truncate">Total Team Members</p>
                <p className="text-xl font-bold text-foreground">{employees.length}</p>
              </div>
            </div>
          </div>

          {/* Active - Mobile + Desktop */}
          <div className="bg-card rounded-lg lg:rounded-xl p-3 lg:p-4 shadow-sm border border-border">
            <div className="flex items-center">
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 lg:w-3 lg:h-3 bg-emerald-500 rounded-full"></div>
              </div>
              <div className="ml-2 lg:ml-3 min-w-0">
                <p className="text-xs lg:text-sm text-muted-foreground truncate">Active</p>
                <p className="text-lg lg:text-xl font-bold text-foreground">{employees.filter(e => e.status === 'Active').length}</p>
              </div>
            </div>
          </div>

          {/* Departments - Desktop Only */}
          <div className="hidden lg:block bg-card rounded-xl p-4 shadow-sm border border-border">
            <div className="flex items-center">
              <Building2 className="w-8 h-8 text-violet-500 flex-shrink-0" />
              <div className="ml-3 min-w-0">
                <p className="text-sm text-muted-foreground truncate">Departments</p>
                <p className="text-xl font-bold text-foreground">{departments.length}</p>
              </div>
            </div>
          </div>

          {/* New This Month - Mobile + Desktop */}
          <div className="bg-card rounded-lg lg:rounded-xl p-3 lg:p-4 shadow-sm border border-border">
            <div className="flex items-center">
              <Calendar className="w-6 h-6 lg:w-8 lg:h-8 text-amber-500 flex-shrink-0" />
              <div className="ml-2 lg:ml-3 min-w-0">
                <p className="text-xs lg:text-sm text-muted-foreground truncate">New This Month</p>
                <p className="text-lg lg:text-xl font-bold text-foreground">
                  {employees.filter(e => {
                    const joiningMonth = new Date(e.joiningDate).getMonth();
                    const joiningYear = new Date(e.joiningDate).getFullYear();
                    const currentMonth = new Date().getMonth();
                    const currentYear = new Date().getFullYear();
                    return joiningMonth === currentMonth && joiningYear === currentYear;
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Employee List - Dual View Support with Integrated Controls */}
        <div className="bg-card rounded-lg sm:rounded-xl shadow-sm border border-border">
          {/* Search, Filter, Export, and View Toggle Row */}
          <div className="p-3 sm:p-4 border-b border-border">
            <FilterExportBar
              filters={filterConfig}
              onExport={handleExport}
              showViewToggle={true}
              viewToggleProps={{
                currentView: viewType,
                onViewChange: setViewType
              }}
              showSearch={true}
              searchProps={{
                placeholder: "Search team members by name, code, or email...",
                value: searchTerm,
                onChange: setSearchTerm
              }}
            />
          </div>

          {/* Card View */}
          {viewType === 'card' && (
            <div className="p-4 sm:p-6">
              {loading ? (
                // Loading skeleton - Horizontal compact layout
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="bg-card border border-border rounded-lg p-2.5 sm:p-4 animate-pulse">
                      <div className="flex gap-2.5 sm:gap-3">
                        {/* Avatar skeleton */}
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex-shrink-0"></div>
                        {/* Info skeleton */}
                        <div className="flex-1 space-y-2">
                          <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-2 sm:h-3 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-2 sm:h-3 bg-gray-200 rounded w-2/3"></div>
                          <div className="space-y-1">
                            <div className="h-2 bg-gray-200 rounded"></div>
                            <div className="h-2 bg-gray-200 rounded w-4/5"></div>
                            <div className="h-2 bg-gray-200 rounded w-3/5"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                  {filteredEmployees.map((employee) => (
                  <div key={employee.userId} className="bg-card border border-border rounded-lg p-2.5 sm:p-4 hover:shadow-md hover:border-primary/20 transition-all duration-200 relative">
                    {/* 3-Dot Menu - Top Right */}
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === employee.userId ? null : employee.userId)}
                        className="p-1 hover:bg-accent rounded-md transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </button>
                      {/* Dropdown Menu */}
                      {openMenuId === employee.userId && (
                        <>
                          {/* Backdrop to close menu */}
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenMenuId(null)}
                          />
                          {/* Menu */}
                          <div className="absolute right-0 mt-1 w-36 bg-card border border-border rounded-lg shadow-lg z-20">
                            <Link
                              href={`/hrm/employees/${employee.userId}`}
                              className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-accent rounded-t-lg transition-colors"
                              onClick={() => setOpenMenuId(null)}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View</span>
                            </Link>
                            <Link
                              href={`/hrm/employees/${employee.userId}/edit`}
                              className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-accent transition-colors"
                              onClick={() => setOpenMenuId(null)}
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </Link>
                            <button
                              className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-accent rounded-b-lg transition-colors text-destructive w-full text-left"
                              onClick={() => openDeleteModal(employee)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Horizontal Layout: Avatar Left, Info Right */}
                    <div className="flex gap-2.5 sm:gap-3">
                      {/* Avatar - Left Side */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-primary-foreground font-bold text-sm sm:text-lg">
                            {getInitials(employee.fullName)}
                          </span>
                        </div>
                      </div>

                      {/* Info - Right Side */}
                      <div className="flex-1 min-w-0 pr-6 sm:pr-8">
                        {/* Name and Status */}
                        <div className="mb-1 sm:mb-1.5">
                          <h3 className="text-sm sm:text-base font-semibold text-foreground truncate">
                            {employee.fullName}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`${getStatusBadge(employee.status)} text-[9px] sm:text-[10px] px-1.5 py-0.5`}>
                              {employee.status}
                            </span>
                          </div>
                        </div>

                        {/* Designation & Department */}
                        <div className="mb-1.5 sm:mb-2">
                          <p className="text-xs sm:text-sm text-foreground font-medium truncate">
                            {employee.designation}
                          </p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                            {employee.department}
                          </p>
                        </div>

                        {/* Contact Info - Super Compact */}
                        <div className="space-y-0.5 text-[10px] sm:text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5 truncate">
                            <Mail className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{employee.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 truncate">
                            <Phone className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{employee.phoneNumber}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate text-[9px] sm:text-[10px]">Joined {new Date(employee.joiningDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  ))}
                </div>
              )}

              {/* No Data State for Card View */}
              {!loading && filteredEmployees.length === 0 && (
                <div className="p-4 sm:p-6">
                  <div className="text-center py-12">
                    <Users className="mx-auto h-16 w-16 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-foreground">No Team Members Found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Get started by adding your first team member to the system.
                    </p>
                    <div className="mt-6">
                      <Link
                        href="/hrm/employees/add"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Team Member
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Grid/List View */}
          {viewType === 'grid' && (
            <div className="divide-y divide-border">
              {loading ? (
                // Loading skeleton for grid
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="p-4 sm:p-6 animate-pulse">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="h-8 bg-gray-200 rounded w-16"></div>
                        <div className="h-8 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                filteredEmployees.map((employee) => (
                <div key={employee.userId} className="p-4 sm:p-6 hover:bg-accent">
                  <div className="flex items-start sm:items-center justify-between gap-3">
                    <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                      {/* Profile Picture */}
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-foreground font-bold text-xs sm:text-sm">
                          {getInitials(employee.fullName)}
                        </span>
                      </div>

                      {/* Team Member Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1 sm:mb-2">
                          <h3 className="text-base sm:text-lg font-medium text-foreground truncate">{employee.fullName}</h3>
                          <span className={`${getStatusBadge(employee.status)} text-xs`}>{employee.status}</span>
                        </div>

                        {/* Mobile: Stack info vertically */}
                        <div className="space-y-1 sm:space-y-0 sm:flex sm:flex-col lg:flex-row lg:items-center lg:space-x-6 text-xs sm:text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Building2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{employee.department} • {employee.designation}</span>
                          </span>
                          <span className="flex items-center sm:hidden">
                            <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{employee.email}</span>
                          </span>
                          <span className="hidden sm:flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {employee.email}
                          </span>
                          <span className="hidden sm:flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {employee.phoneNumber}
                          </span>
                        </div>

                        {/* Hide detailed info on mobile, show on desktop */}
                        <div className="mt-1 text-xs sm:text-sm text-muted-foreground hidden sm:block">
                          Team Member •
                          Joined: {new Date(employee.joiningDate).toLocaleDateString()} •
                          {employee.managerName && ` Manager: ${employee.managerName}`}
                        </div>
                      </div>
                    </div>

                    {/* Actions - Vertical on Mobile */}
                    <div className="flex sm:flex-row flex-col sm:items-center sm:space-x-1 space-y-1 sm:space-y-0 flex-shrink-0">
                      <Link
                        href={`/hrm/employees/${employee.userId}`}
                        className="p-1.5 sm:p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/hrm/employees/${employee.userId}/edit`}
                        className="p-1.5 sm:p-2 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-500/10 rounded-lg transition-colors"
                        title="Edit Team Member"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        className="p-1.5 sm:p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        title="Delete Team Member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                ))
              )}

              {/* No Data State for Grid View */}
              {!loading && filteredEmployees.length === 0 && (
                <div className="p-4 sm:p-6">
                  <div className="text-center py-12">
                    <Users className="mx-auto h-16 w-16 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-foreground">No Team Members Found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Get started by adding your first team member to the system.
                    </p>
                    <div className="mt-6">
                      <Link
                        href="/hrm/employees/add"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Team Member
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Modern Table View */}
          {viewType === 'table' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Team Member
                    </th>
                    <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Department
                    </th>
                    <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Joining Date
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.userId} className="hover:bg-accent transition-colors">
                      {/* Team Member Column */}
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-primary-foreground font-bold text-xs sm:text-sm">
                              {getInitials(employee.fullName)}
                            </span>
                          </div>
                          <div className="ml-3 sm:ml-4">
                            <div className="text-sm font-medium text-foreground truncate max-w-[120px] sm:max-w-none">
                              {employee.fullName}
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground truncate max-w-[120px] sm:max-w-none">
                              ID: {employee.userId}
                            </div>
                            {/* Mobile: Show department below name */}
                            <div className="text-xs text-muted-foreground sm:hidden truncate max-w-[120px]">
                              {employee.department}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Department Column - Hidden on mobile */}
                      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-foreground">{employee.department}</div>
                        <div className="text-sm text-muted-foreground">{employee.designation}</div>
                      </td>

                      {/* Contact Column - Hidden on mobile/tablet */}
                      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-foreground truncate max-w-[200px]">{employee.email}</div>
                        <div className="text-sm text-muted-foreground">{employee.phoneNumber}</div>
                      </td>

                      {/* Joining Date Column - Hidden on mobile/tablet */}
                      <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {new Date(employee.joiningDate).toLocaleDateString()}
                        {employee.managerName && (
                          <div className="text-sm text-muted-foreground">Manager: {employee.managerName}</div>
                        )}
                      </td>

                      {/* Status Column */}
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`${getStatusBadge(employee.status)} text-xs`}>
                          {employee.status}
                        </span>
                      </td>

                      {/* Actions Column - 3-Dot Menu */}
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end">
                          <div className="relative">
                            <button
                              onClick={() => setOpenMenuId(openMenuId === employee.userId ? null : employee.userId)}
                              className="p-1.5 hover:bg-accent rounded-md transition-colors"
                            >
                              <MoreVertical className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                            </button>
                            {/* Dropdown Menu */}
                            {openMenuId === employee.userId && (
                              <>
                                {/* Backdrop to close menu */}
                                <div
                                  className="fixed inset-0 z-10"
                                  onClick={() => setOpenMenuId(null)}
                                />
                                {/* Menu */}
                                <div className="absolute right-0 mt-1 w-36 bg-card border border-border rounded-lg shadow-lg z-20">
                                  <Link
                                    href={`/hrm/employees/${employee.userId}`}
                                    className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-accent rounded-t-lg transition-colors"
                                    onClick={() => setOpenMenuId(null)}
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>View</span>
                                  </Link>
                                  <Link
                                    href={`/hrm/employees/${employee.userId}/edit`}
                                    className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-accent transition-colors"
                                    onClick={() => setOpenMenuId(null)}
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                    <span>Edit</span>
                                  </Link>
                                  <button
                                    className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-accent rounded-b-lg transition-colors text-destructive w-full text-left"
                                    onClick={() => openDeleteModal(employee)}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredEmployees.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-foreground">No team members found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Employee"
        actions={
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              className="flex-1"
            >
              No, Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Yes, Delete
            </Button>
          </div>
        }
      >
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Are you sure you want to delete this employee?
          </p>
          {employeeToDelete && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground font-bold text-sm">
                    {getInitials(employeeToDelete.fullName)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{employeeToDelete.fullName}</p>
                  <p className="text-sm text-muted-foreground">{employeeToDelete.email}</p>
                </div>
              </div>
              <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                <p><strong>Department:</strong> {employeeToDelete.department}</p>
                <p><strong>Designation:</strong> {employeeToDelete.designation}</p>
              </div>
            </div>
          )}
          <p className="text-xs text-destructive mt-4">
            ⚠️ This action cannot be undone. All employee data will be permanently deleted.
          </p>
        </div>
      </Modal>
    </DashboardLayout>
  );
}