'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Mail, Phone, MapPin, Building2, Award, User, FileText, Users, CreditCard, IndianRupee, Calendar } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import Tabs from '@/components/Tabs';
import StatusBadge from '@/components/StatusBadge';
import KPICard from '@/components/KPICard';
import { Button } from '@/components/ui/button';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { apiClient, type Employee } from '@/services/api';

export default function TeamMemberProfilePage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id as string;
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const employeeData = await apiClient.getEmployeeById(Number(employeeId));
        // Use backend data directly - backend now returns complete employee details
        setEmployee(employeeData);
      } catch (error) {
        console.error('Failed to fetch employee:', error);
        setEmployee(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  // Get family members and documents from API response
  const familyMembers = employee?.familyMembers || [];
  const documents = employee?.documents || [];

  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'personal', label: 'Personal Details', icon: FileText },
    { id: 'job', label: 'Job Information', icon: Building2 },
    { id: 'bank', label: 'Bank Details', icon: CreditCard },
    { id: 'family', label: 'Family Members', icon: Users },
    { id: 'salary', label: 'Salary Information', icon: IndianRupee }
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <DashboardLayout>
      {/* Custom CSS for scrollbar hiding */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">
        {/* Header - Mobile Optimized */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-foreground">Team Member Profile</h1>
              </div>
            </div>
            {!loading && (
              <Button asChild className="w-full sm:w-auto">
                <Link href={`/hrm/employees/${employeeId}/edit`} className="flex items-center space-x-2">
                  <Edit className="w-4 h-4" />
                  <span>Edit Team Member</span>
                </Link>
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          // Loading skeleton
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-card rounded-lg sm:rounded-xl shadow-sm border border-border">
              <div className="p-4 sm:p-6 animate-pulse">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-full self-center sm:self-auto"></div>
                  <div className="text-center sm:text-left flex-1">
                    <div className="h-6 bg-muted rounded w-48 mb-2 mx-auto sm:mx-0"></div>
                    <div className="h-4 bg-muted rounded w-32 mb-2 mx-auto sm:mx-0"></div>
                    <div className="h-3 bg-muted rounded w-40 mx-auto sm:mx-0"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg sm:rounded-xl shadow-sm border border-border">
              <div className="p-4 sm:p-6 animate-pulse">
                <div className="h-8 bg-muted rounded w-32 mb-4"></div>
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-4 bg-muted rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : employee ? (
          <>

        {/* Profile Header Card - Mobile Optimized */}
        <div className="bg-card rounded-lg sm:rounded-xl shadow-sm border border-border">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-full flex items-center justify-center self-center sm:self-auto">
                  <span className="text-primary-foreground font-bold text-lg sm:text-xl">
                    {getInitials(employee.fullName)}
                  </span>
                </div>
                <div className="text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3 sm:mb-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">{employee.fullName}</h2>
                    <StatusBadge status={employee.status} />
                  </div>
                  <div className="space-y-2 sm:space-y-1 text-sm text-muted-foreground">
                    {/* Mobile: Stack vertically, Desktop: Side by side */}
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
                      <span className="flex items-center justify-center sm:justify-start">
                        <Building2 className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="text-center sm:text-left">{employee.department} • {employee.designation}</span>
                      </span>
                      <span className="flex items-center justify-center sm:justify-start">
                        <Award className="w-4 h-4 mr-2 flex-shrink-0" />
                        Employee ID: {employee.userId}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
                      <span className="flex items-center justify-center sm:justify-start">
                        <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{employee.email}</span>
                      </span>
                      {employee.phoneNumber && (
                        <span className="flex items-center justify-center sm:justify-start sm:hidden lg:flex">
                          <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                          {employee.phoneNumber}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 lg:mt-0 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <KPICard
                  title="Joining Date"
                  value={new Date(employee.joiningDate).toLocaleDateString()}
                  icon={Calendar}
                  iconColor="bg-blue-500"
                  variant="compact"
                  className="col-span-1"
                />
                <KPICard
                  title="Experience"
                  value={`${Math.floor((Date.now() - new Date(employee.joiningDate).getTime()) / (1000 * 60 * 60 * 24 * 365))} Years`}
                  icon={Award}
                  iconColor="bg-emerald-500"
                  variant="compact"
                  className="col-span-1"
                />
                <KPICard
                  title="Employee Type"
                  value={employee.employeeType || 'N/A'}
                  icon={User}
                  iconColor="bg-purple-500"
                  variant="compact"
                  className="col-span-1"
                />
                <KPICard
                  title="Location"
                  value={employee.workLocation || 'N/A'}
                  icon={MapPin}
                  iconColor="bg-orange-500"
                  variant="compact"
                  className="col-span-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation and Content */}
        <div className="bg-card rounded-lg sm:rounded-xl shadow-sm border border-border">
          {/* Tab Navigation - Mobile Optimized with Horizontal Scroll */}
          <div className="relative">
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              onChange={setActiveTab}
              variant="default"
            />
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Quick Info */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-foreground">Quick Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-border">
                        <span className="text-xs font-medium text-muted-foreground">Employee ID</span>
                        <span className="text-xs text-foreground">{employee.userId}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-border">
                        <span className="text-xs font-medium text-muted-foreground">Department</span>
                        <span className="text-xs text-foreground">{employee.department || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-border">
                        <span className="text-xs font-medium text-muted-foreground">Designation</span>
                        <span className="text-xs text-foreground">{employee.designation || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-border">
                        <span className="text-xs font-medium text-muted-foreground">Manager</span>
                        <span className="text-xs text-foreground">{employee.managerName || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-border">
                        <span className="text-xs font-medium text-muted-foreground">Work Location</span>
                        <span className="text-xs text-foreground">{employee.workLocation}</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-xs font-medium text-muted-foreground">Login Access</span>
                        <span className={`text-xs ${employee.isLoginEnabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                          {employee.isLoginEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-foreground">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                        <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs font-medium text-foreground">Official Email</p>
                          <p className="text-xs text-muted-foreground">{employee.email}</p>
                        </div>
                      </div>
                      {employee.personalEmail && (
                        <div className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                          <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-foreground">Personal Email</p>
                            <p className="text-xs text-muted-foreground">{employee.personalEmail}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                        <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs font-medium text-foreground">Phone Number</p>
                          <p className="text-xs text-muted-foreground">{employee.phoneNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-xs font-medium text-foreground">Current Address</p>
                          <p className="text-xs text-muted-foreground">{employee.currentAddress}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Personal Details Tab */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-foreground">Personal Information</h3>
                    <div className="space-y-3">
                      {employee.dateOfBirth && (
                        <div className="flex items-center justify-between py-2 border-b border-border">
                          <span className="text-xs font-medium text-muted-foreground">Date of Birth</span>
                          <span className="text-xs text-foreground">
                            {new Date(employee.dateOfBirth).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {employee.gender && (
                        <div className="flex items-center justify-between py-2 border-b border-border">
                          <span className="text-xs font-medium text-muted-foreground">Gender</span>
                          <span className="text-xs text-foreground">{employee.gender}</span>
                        </div>
                      )}
                      {employee.bloodGroup && (
                        <div className="flex items-center justify-between py-2 border-b border-border">
                          <span className="text-xs font-medium text-muted-foreground">Blood Group</span>
                          <span className="text-xs text-foreground">{employee.bloodGroup}</span>
                        </div>
                      )}
                      {employee.maritalStatus && (
                        <div className="flex items-center justify-between py-2 border-b border-border">
                          <span className="text-xs font-medium text-muted-foreground">Marital Status</span>
                          <span className="text-xs text-foreground">{employee.maritalStatus}</span>
                        </div>
                      )}
                      {employee.weddingDate && (
                        <div className="flex items-center justify-between py-2">
                          <span className="text-xs font-medium text-muted-foreground">Wedding Date</span>
                          <span className="text-xs text-foreground">
                            {new Date(employee.weddingDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-foreground">Government Documents</h3>
                    <div className="space-y-3">
                      {employee.panCardNumber && (
                        <div className="flex items-center justify-between py-2 border-b border-border">
                          <span className="text-xs font-medium text-muted-foreground">PAN Card</span>
                          <span className="text-xs text-foreground">{employee.panCardNumber}</span>
                        </div>
                      )}
                      {employee.aadharCardNumber && (
                        <div className="flex items-center justify-between py-2 border-b border-border">
                          <span className="text-xs font-medium text-muted-foreground">Aadhar Card</span>
                          <span className="text-xs text-foreground">{employee.aadharCardNumber}</span>
                        </div>
                      )}
                      {employee.uanNumber && (
                        <div className="flex items-center justify-between py-2">
                          <span className="text-xs font-medium text-muted-foreground">UAN Number</span>
                          <span className="text-xs text-foreground">{employee.uanNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-foreground">Address Information</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {employee.currentAddress && (
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="text-sm font-medium text-foreground mb-2">Current Address</h4>
                        <p className="text-xs text-muted-foreground">{employee.currentAddress}</p>
                      </div>
                    )}
                    {employee.permanentAddress && (
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="text-sm font-medium text-foreground mb-2">Permanent Address</h4>
                        <p className="text-xs text-muted-foreground">{employee.permanentAddress}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Job Information Tab */}
            {activeTab === 'job' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-foreground">Job Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-border">
                        <span className="text-xs font-medium text-muted-foreground">Joining Date</span>
                        <span className="text-xs text-foreground">
                          {new Date(employee.joiningDate).toLocaleDateString()}
                        </span>
                      </div>
                      {employee.confirmationDate && (
                        <div className="flex items-center justify-between py-2 border-b border-border">
                          <span className="text-xs font-medium text-muted-foreground">Confirmation Date</span>
                          <span className="text-xs text-foreground">
                            {new Date(employee.confirmationDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {employee.employeeType && (
                        <div className="flex items-center justify-between py-2 border-b border-border">
                          <span className="text-xs font-medium text-muted-foreground">Team Member Type</span>
                          <span className="text-xs text-foreground">{employee.employeeType}</span>
                        </div>
                      )}
                      {employee.workLocation && (
                        <div className="flex items-center justify-between py-2 border-b border-border">
                          <span className="text-xs font-medium text-muted-foreground">Work Location</span>
                          <span className="text-xs text-foreground">{employee.workLocation}</span>
                        </div>
                      )}
                      {employee.roleName && (
                        <div className="flex items-center justify-between py-2">
                          <span className="text-xs font-medium text-muted-foreground">Role</span>
                          <span className="text-xs text-foreground">{employee.roleName}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-foreground">Reporting Structure</h3>
                    <div className="space-y-3">
                      <div className="p-4 bg-muted/50 rounded-lg border border-border">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-primary-foreground" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Reports To</p>
                            <p className="text-sm font-bold text-foreground">
                              {employee.managerName || 'No Manager Assigned'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bank Details Tab */}
            {activeTab === 'bank' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-foreground">Bank Account Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-border">
                        <span className="text-xs font-medium text-muted-foreground">Bank Name</span>
                        <span className="text-xs text-foreground">{employee.bankDetails?.bankName || employee.bankName || 'Not provided'}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-border">
                        <span className="text-xs font-medium text-muted-foreground">Account Number</span>
                        <span className="text-xs text-foreground font-mono">
                          {(employee.bankDetails?.accountNumber || employee.accountNumber) ? `****${(employee.bankDetails?.accountNumber || employee.accountNumber).slice(-4)}` : 'Not provided'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-xs font-medium text-muted-foreground">IFSC Code</span>
                        <span className="text-xs text-foreground font-mono">{employee.bankDetails?.ifscCode || employee.ifscCode || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>
                  

                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-foreground">Documents</h3>
                    {documents.length > 0 ? (
                      <div className="space-y-2">
                        {documents.map((doc: any) => (
                          <div
                            key={doc.documentId}
                            className="flex items-center justify-between p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => window.open(`http://localhost:5153/api/employees/documents/${doc.documentId}/download`, '_blank')}
                          >
                            <div className="flex items-center space-x-3">
                              <FileText className="w-5 h-5 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium text-foreground">{doc.documentType}</p>
                                <p className="text-xs text-muted-foreground">{doc.fileName}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-muted-foreground">
                                {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : ''}
                              </span>
                              <Button size="sm" variant="outline" className="h-7 px-2">
                                View
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : ( 
                      <div className="p-4 bg-muted/50 rounded-lg text-center">
                        <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">No documents uploaded</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Family Members Tab */}
            {activeTab === 'family' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-foreground">Family Members</h3>
                </div>

                {familyMembers.length > 0 ? (
                  <div className="grid gap-4">
                    {familyMembers.map((member: any) => (
                      <div key={member.id} className="p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-foreground">{member.fullName}</h4>
                              <p className="text-xs text-muted-foreground">{member.relationship} • {member.gender}</p>
                              <p className="text-xs text-muted-foreground">
                                Born: {new Date(member.dateOfBirth).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {member.isNominee && (
                              <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs rounded-full">
                                Nominee
                              </span>
                            )}
                            {member.isDependent && (
                              <span className="px-2 py-1 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs rounded-full">
                                Dependent
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-sm font-medium text-foreground">No family members</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Add family members for emergency contacts and nominee details.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Salary Information Tab */}
            {activeTab === 'salary' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-foreground">Salary Structure</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-border">
                        <span className="text-xs font-medium text-muted-foreground">Annual CTC</span>
                        <span className="text-xs text-foreground font-semibold">
                          ₹{(employee.salaryDetails?.annualCTC || employee.annualCTC)?.toLocaleString() || 'Not specified'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-border">
                        <span className="text-xs font-medium text-muted-foreground">Monthly Gross</span>
                        <span className="text-xs text-foreground">
                          ₹{(employee.salaryDetails?.annualCTC || employee.annualCTC) ? Math.round((employee.salaryDetails?.annualCTC || employee.annualCTC) / 12).toLocaleString() : 'Not specified'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-border">
                        <span className="text-xs font-medium text-muted-foreground">Basic Salary</span>
                        <span className="text-xs text-foreground">
                          ₹{(employee.salaryDetails?.basicSalary || employee.basicSalary)?.toLocaleString() || 'Not specified'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-border">
                        <span className="text-xs font-medium text-muted-foreground">HRA</span>
                        <span className="text-xs text-foreground">
                          ₹{(employee.salaryDetails?.hra || employee.hra)?.toLocaleString() || 'Not specified'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-xs font-medium text-muted-foreground">Other Allowances</span>
                        <span className="text-xs text-foreground">
                          ₹{(employee.salaryDetails?.otherAllowances || employee.otherAllowances)?.toLocaleString() || 'Not specified'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-foreground">Deductions</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-border">
                        <span className="text-xs font-medium text-muted-foreground">PF Deduction</span>
                        <span className="text-xs text-red-600 dark:text-red-400">
                          -₹{(employee.salaryDetails?.pfDeduction || employee.pfDeduction)?.toLocaleString() || 'Not specified'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-border">
                        <span className="text-xs font-medium text-muted-foreground">Professional Tax</span>
                        <span className="text-xs text-red-600 dark:text-red-400">
                          -₹{(employee.salaryDetails?.professionalTax || employee.professionalTax)?.toLocaleString() || 'Not specified'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-xs font-medium text-muted-foreground">Net Monthly Salary</span>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                          ₹{(employee.salaryDetails?.annualCTC || employee.annualCTC) ?
                            Math.round(((employee.salaryDetails?.annualCTC || employee.annualCTC) - (employee.salaryDetails?.pfDeduction || employee.pfDeduction || 0) - (employee.salaryDetails?.professionalTax || employee.professionalTax || 0)) / 12).toLocaleString()
                            : 'Not specified'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Salary Summary Card */}
                <div className="bg-muted/50 p-6 rounded-lg border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-semibold text-foreground">Salary Summary</h4>
                      <p className="text-xs text-muted-foreground mt-1">Complete salary breakdown</p>
                    </div>
                    <IndianRupee className="w-6 h-6 text-primary" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                    <div className="text-center p-3 sm:p-0">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Annual CTC</p>
                      <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-1">
                        ₹{(employee.salaryDetails?.annualCTC || employee.annualCTC)?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <div className="text-center p-3 sm:p-0">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Monthly Gross</p>
                      <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                        ₹{(employee.salaryDetails?.annualCTC || employee.annualCTC) ? Math.round((employee.salaryDetails?.annualCTC || employee.annualCTC) / 12).toLocaleString() : '0'}
                      </p>
                    </div>
                    <div className="text-center p-3 sm:p-0">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Deductions</p>
                      <p className="text-sm font-bold text-red-600 dark:text-red-400 mt-1">
                        ₹{((employee.salaryDetails?.pfDeduction || employee.pfDeduction || 0) + (employee.salaryDetails?.professionalTax || employee.professionalTax || 0)).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center p-3 sm:p-0">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Net Monthly</p>
                      <p className="text-sm font-bold text-purple-600 dark:text-purple-400 mt-1">
                        ₹{(employee.salaryDetails?.annualCTC || employee.annualCTC) ?
                          Math.round(((employee.salaryDetails?.annualCTC || employee.annualCTC) - (employee.salaryDetails?.pfDeduction || employee.pfDeduction || 0) - (employee.salaryDetails?.professionalTax || employee.professionalTax || 0)) / 12).toLocaleString()
                          : '0'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground">Employee not found</div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}