'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Save, User, MapPin, Building2, Camera, CreditCard, Users, IndianRupee, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DashboardLayout from '@/components/DashboardLayout';
import Tabs from '@/components/Tabs';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { calculateSalaryComponents as calculateFromHRSettings, getHRSettings, SalarySettings } from '@/utils/hrSettings';
import { apiClient, type Department, type Designation, type Manager, type Role } from '@/services/api';

export default function EditEmployeePage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params?.id ? Number(params.id) : null;

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [hrSettings, setHrSettings] = useState<SalarySettings | null>(null);

  // Backend data
  const [departments, setDepartments] = useState<Department[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Define types for form data
  interface FamilyMember {
    id: number;
    fullName: string;
    relationship: string;
    dateOfBirth: string;
    gender: string;
    isNominee: boolean;
    isDependent: boolean;
  }

  interface BankDocument {
    file: File;
    name: string;
    size: number;
    type: string;
  }

  // Form data based on your User schema
  const [formData, setFormData] = useState({
    // Basic Information (Users table)
    fullName: '',
    fatherName: '',
    email: '',
    personalEmail: '',
    phoneNumber: '',
    emergencyContactNumber: '',
    emergencyContactRelation: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    maritalStatus: '',
    weddingDate: '',

    // Address Information
    currentAddress: '',
    permanentAddress: '',

    // Job Information (TeamMemberDetails table)
    departmentId: '',
    designationId: '',
    managerId: '',
    joiningDate: '',
    confirmationDate: '',
    employeeType: '',
    workLocation: '',

    // Government Documents
    uanNumber: '',
    panCardNumber: '',
    aadharCardNumber: '',

    // System Information
    roleId: '',
    isLoginEnabled: true,
    status: 'Active',

    // Bank Details
    bankName: '',
    accountNumber: '',
    ifscCode: '',

    // Document uploads (moved from Documents section)
    aadharCardUpload: [] as BankDocument[],
    panCardUpload: [] as BankDocument[],
    bankPassbookUpload: [] as BankDocument[],

    // Family Details (conditional - only for married)
    familyMembers: [] as FamilyMember[],

    // Salary Information
    annualCTC: '',
    basicSalary: '',
    hra: '',
    pfDeduction: '',
    professionalTax: '',
    otherAllowances: '',

    // Project Cost Information (for project management module)
    costType: 'hour', // 'hour' or 'day'
    costRate: ''
  });

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        if (!employeeId) {
          alert('Invalid employee ID');
          router.push('/hrm/employees');
          return;
        }

        const [employeeResponse, depts, desigs, mgrs, rolesList] = await Promise.all([
          apiClient.getEmployeeById(employeeId),
          apiClient.getDepartments(),
          apiClient.getDesignations(),
          apiClient.getManagers(),
          apiClient.getRoles()
        ]);

        setDepartments(depts);
        setDesignations(desigs);
        setManagers(mgrs);
        setRoles(rolesList);
        setHrSettings(getHRSettings());

        // Debug: Log the employee response to see what data we're getting
        console.log('Employee Response:', employeeResponse);
        console.log('Departments:', depts);
        console.log('Designations:', desigs);
        console.log('Managers:', mgrs);
        console.log('Roles:', rolesList);

        // Pre-fill form with employee data
        const formattedData = {
          fullName: employeeResponse.fullName ?? '',
          fatherName: employeeResponse.fatherName ?? '',
          email: employeeResponse.email ?? '',
          personalEmail: employeeResponse.personalEmail ?? '',
          phoneNumber: employeeResponse.phoneNumber ?? '',
          emergencyContactNumber: employeeResponse.emergencyContactNumber ?? '',
          emergencyContactRelation: employeeResponse.emergencyContactRelation ?? '',
          dateOfBirth: employeeResponse.dateOfBirth ?? '',
          gender: employeeResponse.gender ?? '',
          bloodGroup: employeeResponse.bloodGroup ?? '',
          maritalStatus: employeeResponse.maritalStatus ?? '',
          weddingDate: employeeResponse.weddingDate ?? '',
          currentAddress: employeeResponse.currentAddress ?? '',
          permanentAddress: employeeResponse.permanentAddress ?? '',
          departmentId: employeeResponse.departmentId?.toString() ?? '',
          designationId: employeeResponse.designationId?.toString() ?? '',
          managerId: employeeResponse.managerId?.toString() ?? '',
          joiningDate: employeeResponse.joiningDate ?? '',
          confirmationDate: employeeResponse.confirmationDate ?? '',
          employeeType: employeeResponse.employeeType ?? '',
          workLocation: employeeResponse.workLocation ?? '',
          uanNumber: employeeResponse.uanNumber ?? '',
          panCardNumber: employeeResponse.panCardNumber ?? '',
          aadharCardNumber: employeeResponse.aadharCardNumber ?? '',
          roleId: employeeResponse.roleId?.toString() ?? '',
          isLoginEnabled: employeeResponse.isLoginEnabled ?? true,
          status: employeeResponse.status ?? 'Active',
          bankName: employeeResponse.bankName ?? '',
          accountNumber: employeeResponse.accountNumber ?? '',
          ifscCode: employeeResponse.ifscCode ?? '',
          aadharCardUpload: [],
          panCardUpload: [],
          bankPassbookUpload: [],
          familyMembers: [],
          annualCTC: employeeResponse.annualCTC?.toString() ?? '',
          basicSalary: employeeResponse.basicSalary?.toString() ?? '',
          hra: employeeResponse.hra?.toString() ?? '',
          pfDeduction: employeeResponse.pfDeduction?.toString() ?? '',
          professionalTax: employeeResponse.professionalTax?.toString() ?? '',
          otherAllowances: employeeResponse.otherAllowances?.toString() ?? '',
          costType: employeeResponse.costType ?? 'hour',
          costRate: employeeResponse.costRate?.toString() ?? ''
        };

        console.log('Formatted Form Data:', formattedData);
        setFormData(formattedData);

      } catch (error) {
        console.error('Failed to load reference data:', error);
        alert('Failed to load employee data. Please try again.');
        router.push('/hrm/employees');
      } finally {
        setDataLoading(false);
      }
    };

    loadData();
  }, [employeeId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleFileUpload = (files: FileList | null, fieldName: 'aadharCardUpload' | 'panCardUpload' | 'bankPassbookUpload') => {
    if (files) {
      const fileArray: BankDocument[] = Array.from(files).map(file => ({
        file,
        name: file.name,
        size: file.size,
        type: file.type
      }));

      setFormData(prev => ({
        ...prev,
        [fieldName]: [...prev[fieldName], ...fileArray]
      }));
    }
  };

  const removeFile = (fieldName: 'aadharCardUpload' | 'panCardUpload' | 'bankPassbookUpload', index: number) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index)
    }));
  };

  const addFamilyMember = () => {
    const newMember: FamilyMember = {
      id: Date.now(),
      fullName: '',
      relationship: '',
      dateOfBirth: '',
      gender: '',
      isNominee: false,
      isDependent: false
    };

    setFormData(prev => ({
      ...prev,
      familyMembers: [...prev.familyMembers, newMember]
    }));
  };

  const updateFamilyMember = (index: number, field: keyof FamilyMember, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      )
    }));
  };

  const removeFamilyMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!employeeId) {
      alert('Invalid employee ID');
      return;
    }

    setIsLoading(true);

    try {
      // Convert form data to API format - only send fields that can be updated
      const updateData: any = {
        // Basic Information
        fullName: formData.fullName,
        email: formData.email,
      };

      // Add optional fields only if they have values
      if (formData.fatherName?.trim()) updateData.fatherName = formData.fatherName.trim();
      if (formData.phoneNumber?.trim()) updateData.phoneNumber = formData.phoneNumber.trim();
      if (formData.emergencyContactNumber?.trim()) updateData.emergencyContactNumber = formData.emergencyContactNumber.trim();
      if (formData.emergencyContactRelation?.trim()) updateData.emergencyContactRelation = formData.emergencyContactRelation.trim();
      if (formData.personalEmail?.trim()) updateData.personalEmail = formData.personalEmail.trim();
      if (formData.dateOfBirth?.trim()) updateData.dateOfBirth = formData.dateOfBirth.trim();
      if (formData.gender?.trim()) updateData.gender = formData.gender.trim();
      if (formData.bloodGroup?.trim()) updateData.bloodGroup = formData.bloodGroup.trim();
      if (formData.maritalStatus?.trim()) updateData.maritalStatus = formData.maritalStatus.trim();
      if (formData.weddingDate?.trim()) updateData.weddingDate = formData.weddingDate.trim();

      // Address Information
      if (formData.currentAddress?.trim()) updateData.currentAddress = formData.currentAddress.trim();
      if (formData.permanentAddress?.trim()) updateData.permanentAddress = formData.permanentAddress.trim();

      // Job Information
      if (formData.departmentId) updateData.departmentId = parseInt(formData.departmentId);
      if (formData.designationId) updateData.designationId = parseInt(formData.designationId);
      if (formData.joiningDate) updateData.joiningDate = formData.joiningDate;
      if (formData.confirmationDate?.trim()) updateData.confirmationDate = formData.confirmationDate.trim();
      if (formData.employeeType?.trim()) updateData.employeeType = formData.employeeType.trim();
      if (formData.workLocation?.trim()) updateData.workLocation = formData.workLocation.trim();
      if (formData.managerId) updateData.managerId = parseInt(formData.managerId);

      // Government Documents
      if (formData.uanNumber?.trim()) updateData.uanNumber = formData.uanNumber.trim();
      if (formData.panCardNumber?.trim()) updateData.panCardNumber = formData.panCardNumber.trim();
      if (formData.aadharCardNumber?.trim()) updateData.aadharCardNumber = formData.aadharCardNumber.trim();

      // System Information
      if (formData.roleId) updateData.roleId = parseInt(formData.roleId);
      updateData.isLoginEnabled = formData.isLoginEnabled;

      // Bank Details
      if (formData.bankName?.trim()) updateData.bankName = formData.bankName.trim();
      if (formData.accountNumber?.trim()) updateData.accountNumber = formData.accountNumber.trim();
      if (formData.ifscCode?.trim()) updateData.ifscCode = formData.ifscCode.trim();

      // Salary Information - readonly for now, but still send existing values
      if (formData.annualCTC?.trim()) updateData.annualCTC = parseFloat(formData.annualCTC);
      if (formData.basicSalary?.trim()) updateData.basicSalary = parseFloat(formData.basicSalary);
      if (formData.hra?.trim()) updateData.hra = parseFloat(formData.hra);
      if (formData.pfDeduction?.trim()) updateData.pfDeduction = parseFloat(formData.pfDeduction);
      if (formData.professionalTax?.trim()) updateData.professionalTax = parseFloat(formData.professionalTax);
      if (formData.otherAllowances?.trim()) updateData.otherAllowances = parseFloat(formData.otherAllowances);
      if (formData.costRate?.trim()) updateData.costRate = parseFloat(formData.costRate);
      if (formData.costType?.trim()) updateData.costType = formData.costType.trim();

      console.log('Updating employee data:', updateData);
      console.log('Employee ID:', employeeId);

      const response = await apiClient.updateEmployee(employeeId, updateData);

      console.log('Employee updated successfully:', response);

      // Redirect to employee list after successful update
      alert('Employee updated successfully!');
      router.push('/hrm/employees');
    } catch (error: any) {
      console.error('Error updating employee:', error);
      console.error('Error details:', {
        message: error.message,
        error: error,
      });

      // Try to show more detailed error message
      let errorMessage = 'Failed to update employee';
      if (error.message) {
        errorMessage += `: ${error.message}`;
      }

      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Information', shortLabel: 'Basic Info', icon: User },
    { id: 'contact', label: 'Contact & Address', shortLabel: 'Contact', icon: MapPin },
    { id: 'job', label: 'Job Information', shortLabel: 'Job Info', icon: Building2 },
    { id: 'bank', label: 'Bank & Documents', shortLabel: 'Bank & Docs', icon: CreditCard },
    ...(formData.maritalStatus === 'Married' ? [{ id: 'family' as const, label: 'Family Details', shortLabel: 'Family', icon: Users }] : []),
    { id: 'salary', label: 'Salary Information', shortLabel: 'Salary', icon: IndianRupee }
  ];

  return (
    <DashboardLayout>
      <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">
        {/* Header - Mobile Optimized */}
        <div>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-foreground">Edit Team Member</h1>
            </div>
          </div>
        </div>

        {dataLoading ? (
          // Loading state
          <div className="bg-card rounded-lg sm:rounded-xl shadow-sm border border-border p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-10 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4">
          {/* Tab Navigation - Mobile Optimized with Horizontal Scroll */}
          <div className="bg-card rounded-lg sm:rounded-xl shadow-sm border border-border overflow-visible">
            <div className="relative">
              <Tabs
                tabs={tabs}
                activeTab={activeTab}
                onChange={setActiveTab}
                variant="default"
              />
            </div>

            <div className="p-3 sm:p-4 lg:p-6 overflow-visible">
              {/* Basic Information Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                        <Camera className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <button
                        type="button"
                        className="absolute bottom-0 right-0 bg-primary rounded-full p-2 text-primary-foreground hover:bg-primary/90"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                        placeholder="John Smith"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">
                        Father Name
                      </label>
                      <input
                        type="text"
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                        placeholder="Father's name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">
                        Official Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                        placeholder="john.smith@company.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">
                        Personal Email
                      </label>
                      <input
                        type="email"
                        name="personalEmail"
                        value={formData.personalEmail}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                        placeholder="john.smith@gmail.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                        placeholder="+1-234-567-8901"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">
                        Emergency Contact Number
                      </label>
                      <input
                        type="tel"
                        name="emergencyContactNumber"
                        value={formData.emergencyContactNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                        placeholder="+1-234-567-8901"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">
                        Emergency Contact Relation
                      </label>
                      <input
                        type="text"
                        name="emergencyContactRelation"
                        value={formData.emergencyContactRelation}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                        placeholder="e.g., Father, Mother, Spouse"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">
                        Gender *
                      </label>
                      <Select
                        name="gender"
                        value={formData.gender}
                        onValueChange={(value) => handleInputChange({ target: { name: 'gender', value } } as any)}
                        required
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">
                        Blood Group
                      </label>
                      <Select
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onValueChange={(value) => handleInputChange({ target: { name: 'bloodGroup', value } } as any)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Blood Group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">
                        Marital Status *
                      </label>
                      <Select
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onValueChange={(value) => handleInputChange({ target: { name: 'maritalStatus', value } } as any)}
                        required
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Single">Single</SelectItem>
                          <SelectItem value="Married">Married</SelectItem>
                          <SelectItem value="Divorced">Divorced</SelectItem>
                          <SelectItem value="Widowed">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.maritalStatus === 'Married' && (
                      <div>
                        <label className="block text-sm font-medium text-card-foreground mb-2">
                          Wedding Date
                        </label>
                        <input
                          type="date"
                          name="weddingDate"
                          value={formData.weddingDate}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact & Address Tab */}
              {activeTab === 'contact' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">
                      Current Address *
                    </label>
                    <textarea
                      name="currentAddress"
                      value={formData.currentAddress}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                      placeholder="Enter current address"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">
                      Permanent Address
                    </label>
                    <textarea
                      name="permanentAddress"
                      value={formData.permanentAddress}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                      placeholder="Enter permanent address (if different)"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="sameAsCurrentAddress"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({ ...prev, permanentAddress: prev.currentAddress }));
                        }
                      }}
                      className="rounded border-input text-primary focus:ring-primary"
                    />
                    <label htmlFor="sameAsCurrentAddress" className="text-sm text-card-foreground">
                      Same as current address
                    </label>
                  </div>
                </div>
              )}

              {/* Job Information Tab */}
              {activeTab === 'job' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">
                        Department *
                      </label>
                      <select
                        name="departmentId"
                        value={formData.departmentId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                        required
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">
                        Designation *
                      </label>
                      <select
                        name="designationId"
                        value={formData.designationId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                        required
                      >
                        <option value="">Select Designation</option>
                        {designations.map(des => (
                          <option key={des.id} value={des.id}>{des.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">
                        Reporting Manager
                      </label>
                      <select
                        name="managerId"
                        value={formData.managerId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                      >
                        <option value="">Select Manager</option>
                        {managers.map(manager => (
                          <option key={manager.id} value={manager.id}>{manager.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">
                        Role *
                      </label>
                      <select
                        name="roleId"
                        value={formData.roleId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                        required
                      >
                        <option value="">Select Role</option>
                        {roles.map(role => (
                          <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">
                        Joining Date *
                      </label>
                      <input
                        type="date"
                        name="joiningDate"
                        value={formData.joiningDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">
                        Confirmation Date
                      </label>
                      <input
                        type="date"
                        name="confirmationDate"
                        value={formData.confirmationDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">
                        Team Member Type *
                      </label>
                      <select
                        name="employeeType"
                        value={formData.employeeType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="Permanent">Permanent</option>
                        <option value="Contract">Contract</option>
                        <option value="Intern">Intern</option>
                        <option value="Consultant">Consultant</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">
                        Work Location
                      </label>
                      <input
                        type="text"
                        name="workLocation"
                        value={formData.workLocation}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                        placeholder="e.g., New York Office, Remote"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isLoginEnabled"
                      checked={formData.isLoginEnabled}
                      onChange={handleInputChange}
                      className="rounded border-input text-primary focus:ring-primary"
                    />
                    <label className="text-sm text-card-foreground">
                      Enable login access for this employee
                    </label>
                  </div>
                </div>
              )}

              {/* Bank & Documents Tab */}
              {activeTab === 'bank' && (
                <div className="space-y-4">
                  {/* Bank Information Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Bank Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-card-foreground mb-2">
                          Bank Name *
                        </label>
                        <input
                          type="text"
                          name="bankName"
                          value={formData.bankName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                          placeholder="e.g., State Bank of India"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-card-foreground mb-2">
                          Account Number *
                        </label>
                        <input
                          type="text"
                          name="accountNumber"
                          value={formData.accountNumber}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                          placeholder="Enter account number"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-card-foreground mb-2">
                          IFSC Code *
                        </label>
                        <input
                          type="text"
                          name="ifscCode"
                          value={formData.ifscCode}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                          placeholder="e.g., SBIN0001234"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Government Documents Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Government Documents</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-card-foreground mb-2">
                          UAN Number
                        </label>
                        <input
                          type="text"
                          name="uanNumber"
                          value={formData.uanNumber}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                          placeholder="Universal Account Number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-card-foreground mb-2">
                          PAN Card Number
                        </label>
                        <input
                          type="text"
                          name="panCardNumber"
                          value={formData.panCardNumber}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                          placeholder="ABCDE1234F"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-card-foreground mb-2">
                          Aadhar Card Number
                        </label>
                        <input
                          type="text"
                          name="aadharCardNumber"
                          value={formData.aadharCardNumber}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                          placeholder="1234 5678 9012"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Document Uploads Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Document Uploads</h3>
                    <div className="space-y-3">
                      {/* Aadhar Card Upload */}
                      <div>
                        <label className="block text-sm font-medium text-card-foreground mb-2">
                          Aadhar Card
                        </label>
                        <div className="border-2 border-dashed border-input rounded-lg p-3 text-center hover:border-muted-foreground transition-colors">
                          <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                          <div className="mt-2">
                            <label htmlFor="aadharCardUpload" className="cursor-pointer">
                              <span className="text-sm font-medium text-foreground">
                                Upload Aadhar Card
                              </span>
                              <span className="block text-xs text-muted-foreground mt-1">
                                PNG, JPG, PDF up to 10MB
                              </span>
                            </label>
                            <input
                              id="aadharCardUpload"
                              name="aadharCardUpload"
                              type="file"
                              multiple
                              accept=".png,.jpg,.jpeg,.pdf"
                              className="sr-only"
                              onChange={(e) => handleFileUpload(e.target.files, 'aadharCardUpload')}
                            />
                          </div>
                        </div>

                        {formData.aadharCardUpload.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {formData.aadharCardUpload.map((doc, index: number) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center">
                                    <Upload className="w-4 h-4 text-destructive" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-foreground">{doc.name}</p>
                                    <p className="text-xs text-muted-foreground">{(doc.size / 1024).toFixed(1)} KB</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeFile('aadharCardUpload', index)}
                                  className="text-destructive hover:text-destructive/80"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* PAN Card Upload */}
                      <div>
                        <label className="block text-sm font-medium text-card-foreground mb-2">
                          PAN Card
                        </label>
                        <div className="border-2 border-dashed border-input rounded-lg p-3 text-center hover:border-muted-foreground transition-colors">
                          <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                          <div className="mt-2">
                            <label htmlFor="panCardUpload" className="cursor-pointer">
                              <span className="text-sm font-medium text-foreground">
                                Upload PAN Card
                              </span>
                              <span className="block text-xs text-muted-foreground mt-1">
                                PNG, JPG, PDF up to 10MB
                              </span>
                            </label>
                            <input
                              id="panCardUpload"
                              name="panCardUpload"
                              type="file"
                              multiple
                              accept=".png,.jpg,.jpeg,.pdf"
                              className="sr-only"
                              onChange={(e) => handleFileUpload(e.target.files, 'panCardUpload')}
                            />
                          </div>
                        </div>

                        {formData.panCardUpload.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {formData.panCardUpload.map((doc, index: number) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Upload className="w-4 h-4 text-primary" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-foreground">{doc.name}</p>
                                    <p className="text-xs text-muted-foreground">{(doc.size / 1024).toFixed(1)} KB</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeFile('panCardUpload', index)}
                                  className="text-destructive hover:text-destructive/80"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Bank Passbook Upload */}
                      <div>
                        <label className="block text-sm font-medium text-card-foreground mb-2">
                          Bank Passbook/Statement
                        </label>
                        <div className="border-2 border-dashed border-input rounded-lg p-3 text-center hover:border-muted-foreground transition-colors">
                          <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                          <div className="mt-2">
                            <label htmlFor="bankPassbookUpload" className="cursor-pointer">
                              <span className="text-sm font-medium text-foreground">
                                Upload Bank Passbook/Statement
                              </span>
                              <span className="block text-xs text-muted-foreground mt-1">
                                PNG, JPG, PDF up to 10MB
                              </span>
                            </label>
                            <input
                              id="bankPassbookUpload"
                              name="bankPassbookUpload"
                              type="file"
                              multiple
                              accept=".png,.jpg,.jpeg,.pdf"
                              className="sr-only"
                              onChange={(e) => handleFileUpload(e.target.files, 'bankPassbookUpload')}
                            />
                          </div>
                        </div>

                        {formData.bankPassbookUpload.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {formData.bankPassbookUpload.map((doc, index: number) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Upload className="w-4 h-4 text-primary" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-foreground">{doc.name}</p>
                                    <p className="text-xs text-muted-foreground">{(doc.size / 1024).toFixed(1)} KB</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeFile('bankPassbookUpload', index)}
                                  className="text-destructive hover:text-destructive/80"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Family Details Tab - Only for Married */}
              {activeTab === 'family' && formData.maritalStatus === 'Married' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Family Members</h3>
                      <p className="text-sm text-muted-foreground">Add spouse and children details for dependency and nomination</p>
                    </div>
                    <Button
                      type="button"
                      onClick={addFamilyMember}
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <Users className="w-4 h-4" />
                      <span>Add Family Member</span>
                    </Button>
                  </div>

                  {formData.familyMembers.length > 0 ? (
                    <div className="space-y-4">
                      {formData.familyMembers.map((member, index: number) => (
                        <div key={member.id} className="p-4 border border-border rounded-lg space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-foreground">Family Member {index + 1}</h4>
                            <button
                              type="button"
                              onClick={() => removeFamilyMember(index)}
                              className="text-destructive hover:text-destructive/80"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-card-foreground mb-2">
                                Full Name *
                              </label>
                              <input
                                type="text"
                                value={member.fullName}
                                onChange={(e) => updateFamilyMember(index, 'fullName', e.target.value)}
                                className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                                placeholder="Enter full name"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-card-foreground mb-2">
                                Relationship *
                              </label>
                              <select
                                value={member.relationship}
                                onChange={(e) => updateFamilyMember(index, 'relationship', e.target.value)}
                                className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                                required
                              >
                                <option value="">Select Relationship</option>
                                <option value="Spouse">Spouse</option>
                                <option value="Child">Child</option>
                                <option value="Parent">Parent</option>
                                <option value="Sibling">Sibling</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-card-foreground mb-2">
                                Date of Birth *
                              </label>
                              <input
                                type="date"
                                value={member.dateOfBirth}
                                onChange={(e) => updateFamilyMember(index, 'dateOfBirth', e.target.value)}
                                className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-card-foreground mb-2">
                                Gender *
                              </label>
                              <select
                                value={member.gender}
                                onChange={(e) => updateFamilyMember(index, 'gender', e.target.value)}
                                className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
                                required
                              >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex items-center space-x-6">
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={member.isNominee}
                                onChange={(e) => updateFamilyMember(index, 'isNominee', e.target.checked)}
                                className="rounded border-input text-primary focus:ring-primary"
                              />
                              <span className="text-sm text-card-foreground">Nominee</span>
                            </label>

                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={member.isDependent}
                                onChange={(e) => updateFamilyMember(index, 'isDependent', e.target.checked)}
                                className="rounded border-input text-primary focus:ring-primary"
                              />
                              <span className="text-sm text-card-foreground">Dependent</span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-muted/50 rounded-lg">
                      <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-2 text-sm font-medium text-foreground">No family members added</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Click &quot;Add Family Member&quot; to add spouse and children details
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Salary Information Tab - READONLY for now */}
              {activeTab === 'salary' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Salary Structure</h3>
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg mb-4">
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        <strong>Note:</strong> Salary information is currently view-only. Only HR/Admin can modify salary details.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-card-foreground mb-2">
                          Annual CTC
                        </label>
                        <input
                          type="number"
                          name="annualCTC"
                          value={formData.annualCTC}
                          readOnly
                          className="w-full px-3 py-2 border border-input rounded-lg bg-muted/50 text-card-foreground cursor-not-allowed"
                          placeholder="Enter annual CTC amount"
                        />
                      </div>
                    </div>
                  </div>

                  {formData.annualCTC && (
                    <div>
                      <h4 className="text-md font-semibold text-foreground mb-4">Salary Breakdown</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-card-foreground mb-2">
                            Basic Salary ({hrSettings?.basicSalaryPercentage || 40}% of CTC)
                          </label>
                          <input
                            type="number"
                            name="basicSalary"
                            value={formData.basicSalary}
                            readOnly
                            className="w-full px-3 py-2 border border-input rounded-lg bg-muted/50 text-card-foreground cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-card-foreground mb-2">
                            HRA ({hrSettings?.hraPercentage || 50}% of Basic)
                          </label>
                          <input
                            type="number"
                            name="hra"
                            value={formData.hra}
                            readOnly
                            className="w-full px-3 py-2 border border-input rounded-lg bg-muted/50 text-card-foreground cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-card-foreground mb-2">
                            PF Deduction ({hrSettings?.pfDeductionPercentage || 12}% of Basic)
                          </label>
                          <input
                            type="number"
                            name="pfDeduction"
                            value={formData.pfDeduction}
                            readOnly
                            className="w-full px-3 py-2 border border-input rounded-lg bg-muted/50 text-card-foreground cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-card-foreground mb-2">
                            Professional Tax (₹{hrSettings?.professionalTaxAmount?.toLocaleString() || '2,400'} Annual)
                          </label>
                          <input
                            type="number"
                            name="professionalTax"
                            value={formData.professionalTax}
                            readOnly
                            className="w-full px-3 py-2 border border-input rounded-lg bg-muted/50 text-card-foreground cursor-not-allowed"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-card-foreground mb-2">
                            Other Allowances (Remaining Amount)
                          </label>
                          <input
                            type="number"
                            name="otherAllowances"
                            value={formData.otherAllowances}
                            readOnly
                            className="w-full px-3 py-2 border border-input rounded-lg bg-muted/50 text-card-foreground cursor-not-allowed"
                          />
                        </div>
                      </div>

                      {/* Project Cost Information */}
                      <div className="mt-6 pt-6 border-t border-border">
                        <h4 className="text-md font-semibold text-foreground mb-4">Project Cost Information</h4>

                        <div className="space-y-4">
                          {/* Cost Type Toggle - Disabled */}
                          <div>
                            <label className="block text-sm font-medium text-card-foreground mb-3">
                              Cost Calculation Type
                            </label>
                            <div className="flex items-center space-x-1 bg-muted rounded-lg p-1 w-fit opacity-60 cursor-not-allowed">
                              <button
                                type="button"
                                disabled
                                className={`px-4 py-2 text-sm font-medium rounded-md ${
                                  formData.costType === 'hour'
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'text-muted-foreground'
                                }`}
                              >
                                Per Hour
                              </button>
                              <button
                                type="button"
                                disabled
                                className={`px-4 py-2 text-sm font-medium rounded-md ${
                                  formData.costType === 'day'
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'text-muted-foreground'
                                }`}
                              >
                                Per Day
                              </button>
                            </div>
                          </div>

                          {/* Cost Rate Input - Readonly */}
                          <div>
                            <label className="block text-sm font-medium text-card-foreground mb-2">
                              Cost {formData.costType === 'hour' ? 'per Hour' : 'per Day'} (₹)
                            </label>
                            <input
                              type="number"
                              name="costRate"
                              value={formData.costRate}
                              readOnly
                              className="w-full px-3 py-2 border border-input rounded-lg bg-muted/50 text-card-foreground cursor-not-allowed"
                              placeholder={`Enter ${formData.costType === 'hour' ? 'hourly' : 'daily'} cost`}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              {formData.costType === 'hour'
                                ? 'Hourly rate for project cost calculation'
                                : 'Daily rate for project cost calculation (8-hour workday)'}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                          <p className="text-xs text-muted-foreground">
                            💡 <strong>Note:</strong> This rate will be used in the Project Management module for resource cost estimation and project budgeting.
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-primary">Total Annual CTC:</span>
                          <span className="text-lg font-bold text-primary">₹{Number(formData.annualCTC).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-medium text-primary">Monthly Gross Salary:</span>
                          <span className="text-md font-semibold text-primary">₹{Math.round(Number(formData.annualCTC) / 12).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Form Actions - Mobile Responsive - Only show when on last tab (salary) */}
          {activeTab === 'salary' && (
            <div className="bg-card rounded-xl p-4 sm:p-6 shadow-sm border border-border">
              {/* Mobile: Stacked buttons */}
              <div className="flex flex-col sm:hidden space-y-3">
                <Button
                  type="submit"
                  variant="default"
                  disabled={isLoading}
                  className="w-full"
                  size="default"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Updating...' : 'Update Team Member'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="w-full"
                  size="default"
                >
                  Cancel
                </Button>
              </div>

              {/* Desktop: Single row layout */}
              <div className="hidden sm:flex items-center space-x-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.back()}
                  className="flex-1"
                  size="default"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="default"
                  disabled={isLoading}
                  className="flex-1"
                  size="default"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Updating...' : 'Update Team Member'}
                </Button>
              </div>
            </div>
          )}
        </form>
        )}
      </div>
    </DashboardLayout>
  );
}
