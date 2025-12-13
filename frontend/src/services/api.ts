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
  fatherName?: string;
  email: string;
  phoneNumber?: string;
  emergencyContactNumber?: string;
  emergencyContactRelation?: string;
  personalEmail?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string;
  maritalStatus?: string;
  weddingDate?: string;
  currentAddress?: string;
  permanentAddress?: string;
  department: string;
  departmentId?: number;
  designation: string;
  designationId?: number;
  joiningDate: string;
  confirmationDate?: string;
  employeeType?: string;
  workLocation?: string;
  status: string;
  managerName?: string;
  managerId?: number;
  photoPath?: string;
  uanNumber?: string;
  panCardNumber?: string;
  aadharCardNumber?: string;
  roleId?: number;
  roleName?: string;
  isLoginEnabled?: boolean;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  annualCTC?: number;
  basicSalary?: number;
  hra?: number;
  pfDeduction?: number;
  professionalTax?: number;
  otherAllowances?: number;
  costRate?: number;
  costType?: string;
  createdAt?: string;
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
  currentAddress?: string;
  permanentAddress?: string;

  // Professional Information
  departmentId: number;
  designationId: number;
  joiningDate: string;
  confirmationDate?: string;
  employeeType?: string;
  workLocation?: string;
  managerId?: number;

  // Document Information
  uanNumber?: string;
  panCardNumber?: string;
  aadharCardNumber?: string;

  // Login Information
  roleId?: number;
  isLoginEnabled?: boolean;

  // Banking Information
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

  // Documents
  documents?: CreateDocumentRequest[];
}

export interface CreateDocumentRequest {
  documentType: string;
  fileName: string;
  filePath?: string;
  fileSize?: number;
  mimeType?: string;
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

      // Check if response has content before parsing JSON
      const contentType = response.headers.get('content-type');
      let data: any = null;

      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        if (text) {
          data = JSON.parse(text);
        }
      }

      if (!response.ok) {
        throw new Error(data?.message || `HTTP error! status: ${response.status}`);
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

    const query = queryParams.toString();
    return this.makeRequest<Employee[]>(`employees${query ? `?${query}` : ''}`);
  }

  async getEmployeeById(userId: number): Promise<Employee> {
    return this.makeRequest<Employee>(`employees/${userId}`);
  }

  async createEmployee(employeeData: CreateEmployeeRequest): Promise<{ message: string; userId: number }> {
    return this.makeRequest<{ message: string; userId: number }>('employees', {
      method: 'POST',
      body: JSON.stringify(employeeData),
    });
  }

  async updateEmployee(userId: number, employeeData: Partial<CreateEmployeeRequest>): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>(`employees/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(employeeData),
    });
  }

  async deleteEmployee(userId: number): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>(`employees/${userId}`, {
      method: 'DELETE',
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

  // Document upload
  async uploadDocument(employeeId: number, file: File, documentType: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);

    const response = await fetch(`${this.baseUrl}/api/employees/${employeeId}/documents/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Get document download URL
  getDocumentDownloadUrl(documentId: number): string {
    return `${this.baseUrl}/api/employees/documents/${documentId}/download`;
  }
}

export const apiClient = new ApiClient();
