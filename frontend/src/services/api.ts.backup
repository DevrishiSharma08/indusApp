const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5153';

// Types for API requests and responses
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  roleID: number;
}

export interface UpdateUserRoleRequest {
  roleID: number;
}

export interface UpdateUserStatusRequest {
  isActive: boolean;
}

export interface LoginResponse {
  message: string;
  user: {
    id: number;
    fullName: string;
    role: string;
  };
}

export interface User {
  employeeID: number;
  fullName: string;
  email: string;
  isActive: boolean;
  roleName: string;
}

export interface ApiError {
  message: string;
}

// Employee types
export interface Employee {
  userId: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  department: string;
  designation: string;
  joiningDate: string;
  status: string;
  managerName?: string;
  photoPath?: string;
}

export interface CreateEmployeeRequest {
  // Basic Information
  fullName: string;
  fatherName?: string;
  email: string;
  password: string;
  phoneNumber?: string;
  emergencyContactNumber?: string;
  emergencyContactRelation?: string;
  personalEmail?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string;
  maritalStatus?: string;
  weddingDate?: string;

  // Address Information
  currentAddress?: string;
  permanentAddress?: string;

  // Job Information
  departmentId: number;
  designationId: number;
  joiningDate: string;
  confirmationDate?: string;
  employeeType?: string;
  workLocation?: string;
  reportingManagerId?: number;

  // Government Documents
  uanNumber?: string;
  panCardNumber?: string;
  aadharCardNumber?: string;

  // System Information
  roleId?: number;
  isLoginEnabled: boolean;
  status: string;

  // Bank Details
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;

  // Salary Information
  annualCTC?: number;
  basicSalary?: number;
  hra?: number;
  pfDeduction?: number;
  professionalTax?: number;
  otherAllowances?: number;
  costRate?: number;
  costType?: string;

  // Family Members
  familyMembers?: CreateFamilyMemberRequest[];
}

export interface CreateFamilyMemberRequest {
  fullName: string;
  relationship: string;
  dateOfBirth: string;
  gender: string;
  isNominee: boolean;
  isDependent: boolean;
}

export interface Department {
  id: number;
  name: string;
}

export interface Designation {
  id: number;
  name: string;
}

export interface Manager {
  id: number;
  name: string;
  department: string;
  designation: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface EmployeeStats {
  totalEmployees: number;
  activeEmployees: number;
  totalDepartments: number;
  newThisMonth: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}/api/${endpoint}`;

    const config: RequestInit = {
      credentials: 'include', // Important for cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.makeRequest<LoginResponse>('auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<{ message: string; userId: number }> {
    return this.makeRequest<{ message: string; userId: number }>('auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>('auth/logout', {
      method: 'POST',
    });
  }

  // Admin endpoints
  async getAllUsers(): Promise<User[]> {
    return this.makeRequest<User[]>('admin/users');
  }

  async updateUserRole(userId: number, roleData: UpdateUserRoleRequest): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>(`admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify(roleData),
    });
  }

  async updateUserStatus(userId: number, statusData: UpdateUserStatusRequest): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>(`admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    });
  }

  // Employee endpoints
  async getEmployeeStats(): Promise<EmployeeStats> {
    return this.makeRequest<EmployeeStats>('employees/stats');
  }

  async getEmployees(params?: {
    search?: string;
    department?: string;
    status?: string;
  }): Promise<Employee[]> {
    const queryParams = new URLSearchParams();

    if (params?.search) queryParams.append('search', params.search);
    if (params?.department) queryParams.append('department', params.department);
    if (params?.status) queryParams.append('status', params.status);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `employees?${queryString}` : 'employees';

    return this.makeRequest<Employee[]>(endpoint);
  }

  async getEmployeeById(id: number): Promise<Employee> {
    return this.makeRequest<Employee>(`employees/${id}`);
  }

  async createEmployee(employeeData: CreateEmployeeRequest): Promise<Employee> {
    return this.makeRequest<Employee>('employees', {
      method: 'POST',
      body: JSON.stringify(employeeData),
    });
  }

  // Reference data endpoints
  async getDepartments(): Promise<Department[]> {
    return this.makeRequest<Department[]>('employees/departments');
  }

  async getDesignations(): Promise<Designation[]> {
    return this.makeRequest<Designation[]>('employees/designations');
  }

  async getManagers(): Promise<Manager[]> {
    return this.makeRequest<Manager[]>('employees/managers');
  }

  async getRoles(): Promise<Role[]> {
    return this.makeRequest<Role[]>('employees/roles');
  }
}

export const apiClient = new ApiClient();