"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardLayout from '@/components/DashboardLayout';
import KPICard from '@/components/KPICard';
import FilterExportBar from '@/components/FilterExportBar';
import ToggleButtons from '@/components/ToggleButtons';
import Modal from '@/components/Modal';
import DataTable from '@/components/DataTable';
import { Calendar, Clock, Users, FileText, Plus, Check, X } from "lucide-react";

type UserRole = "user" | "lead" | "admin";

export default function LeaveAttendancePage() {
  const [activeTab, setActiveTab] = useState("history");
  const [historyToggle, setHistoryToggle] = useState("my");
  const [approvalToggle, setApprovalToggle] = useState("my");
  const [filterType, setFilterType] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewType, setViewType] = useState<'card' | 'grid' | 'table'>('card');

  // Mock user role - would come from auth context
  const [userRole] = useState<UserRole>("lead");

  // Set default view based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setViewType('table'); // Desktop default
      } else {
        setViewType('card'); // Mobile default
      }
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Simple dummy data
  const kpiData = {
    user: {
      leaveBalance: { casual: 8, sick: 10, earned: 15 },
      attendanceMonth: { present: 18, wfh: 2, absent: 1 },
      pendingRequests: 2
    },
    lead: {
      teamOnLeave: 3,
      pendingApprovals: 5,
      teamAttendance: { present: 45, absent: 3, wfh: 8 }
    }
  };

  // History data based on user role and toggle
  const myHistoryData = [
    { date: "2024-01-15", punchIn: "09:00", punchOut: "18:00", totalHours: "9h", status: "Present", employee: "Me" },
    { date: "2024-01-14", punchIn: "09:15", punchOut: "18:00", totalHours: "8h 45m", status: "Late", employee: "Me" },
    { date: "2024-01-13", punchIn: "-", punchOut: "-", totalHours: "-", status: "On Leave", employee: "Me" },
    { date: "2024-01-12", punchIn: "Home", punchOut: "Home", totalHours: "8h", status: "WFH", employee: "Me" },
  ];

  const teamHistoryData = [
    { date: "2024-01-15", punchIn: "09:00", punchOut: "18:00", totalHours: "9h", status: "Present", employee: "John Doe" },
    { date: "2024-01-15", punchIn: "09:30", punchOut: "18:30", totalHours: "9h", status: "Present", employee: "Jane Smith" },
    { date: "2024-01-15", punchIn: "Home", punchOut: "Home", totalHours: "8h", status: "WFH", employee: "Mike Johnson" },
    { date: "2024-01-14", punchIn: "09:45", punchOut: "18:00", totalHours: "8h 15m", status: "Late", employee: "Sarah Wilson" },
    { date: "2024-01-14", punchIn: "-", punchOut: "-", totalHours: "-", status: "On Leave", employee: "Robert Chen" },
  ];

  // Get current history data
  const getCurrentHistoryData = () => {
    if (userRole === "user") {
      return myHistoryData; // Regular users only see their own history
    }
    return historyToggle === "team" ? teamHistoryData : myHistoryData;
  };

  const historyData = getCurrentHistoryData();

  const myApprovalData = [
    { id: 1, type: "Leave", employee: "Me", startDate: "2024-01-20", endDate: "2024-01-22", reason: "Personal work", manager: "Mike Smith", status: "Pending" },
    { id: 2, type: "WFH", employee: "Me", startDate: "2024-01-18", endDate: "2024-01-18", reason: "Internet installation", manager: "Mike Smith", status: "Pending" },
  ];

  const teamApprovalData = [
    { id: 3, type: "Leave", employee: "John Doe", startDate: "2024-01-20", endDate: "2024-01-22", reason: "Personal work", manager: "Mike Smith", status: "Pending" },
    { id: 4, type: "WFH", employee: "Jane Smith", startDate: "2024-01-18", endDate: "2024-01-18", reason: "Internet installation", manager: "Mike Smith", status: "Pending" },
    { id: 5, type: "Leave", employee: "Robert Chen", startDate: "2024-01-25", endDate: "2024-01-26", reason: "Family function", manager: "Mike Smith", status: "Pending" },
  ];

  // Get current approval data based on toggle
  const getCurrentApprovalData = () => {
    return approvalToggle === "team" ? teamApprovalData : myApprovalData;
  };

  // Filter approvals by type
  const approvalData = getCurrentApprovalData().filter(approval => {
    if (filterType === 'all') return true;
    return approval.type.toLowerCase() === filterType.toLowerCase();
  });


  const openDialog = () => {
    setDialogType("");
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setDialogType("");
  };

  const renderForm = () => {
    switch (dialogType) {
      case "leave":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="leaveType">Leave Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">Casual Leave</SelectItem>
                  <SelectItem value="sick">Sick Leave</SelectItem>
                  <SelectItem value="earned">Earned Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input type="date" id="startDate" />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input type="date" id="endDate" />
              </div>
            </div>
            <div>
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for leave"
                rows={3}
              />
            </div>
          </div>
        );
      case "wfh":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input type="date" id="startDate" />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input type="date" id="endDate" />
              </div>
            </div>
            <div>
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for WFH"
                rows={3}
              />
            </div>
          </div>
        );
      case "onsite":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input type="date" id="date" />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                type="text"
                id="location"
                placeholder="Enter location"
              />
            </div>
            <div>
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for on-site duty"
                rows={3}
              />
            </div>
          </div>
        );
      case "regularization":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="dateToCorrect">Date to Correct</Label>
              <Input type="date" id="dateToCorrect" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="punchIn">Punch In Time</Label>
                <Input type="time" id="punchIn" />
              </div>
              <div>
                <Label htmlFor="punchOut">Punch Out Time</Label>
                <Input type="time" id="punchOut" />
              </div>
            </div>
            <div>
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for regularization"
                rows={3}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Export handler
  const handleExport = (format: 'excel' | 'csv' | 'pdf') => {
    alert(`Exporting to ${format.toUpperCase()} format...`);
    console.log('Export format:', format);
  };

  return (
    <DashboardLayout>
      <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">
        {/* Header - Mobile Optimized with Floating Apply Button */}
        <div className="relative">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Leave & Attendance</h1>

            {/* Mobile: Floating + Button | Desktop: Full Button */}
            <Button
              onClick={openDialog}
              className="flex items-center justify-center sm:space-x-2 sm:px-4 sm:py-2.5 rounded-full sm:rounded-lg font-medium w-10 h-10 sm:w-auto sm:h-auto"
            >
              <Plus className="w-5 h-5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline text-sm">Apply</span>
            </Button>
          </div>
        </div>

        {/* KPIs Section - Horizontal Scroll on Mobile */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-3 scrollbar-hide">
          {userRole === "user" ? (
            <>
              <KPICard
                title="Leave Balance"
                value=""
                icon={Calendar}
                iconColor="bg-emerald-500"
                variant="minimal"
                className="w-[calc(33.333%-7px)] min-w-[105px] flex-shrink-0 sm:w-auto"
              >
                <div className="space-y-0.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] text-muted-foreground">Casual</span>
                    <span className="text-[9px] font-bold text-foreground">{kpiData.user.leaveBalance.casual}/12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] text-muted-foreground">Sick</span>
                    <span className="text-[9px] font-bold text-foreground">{kpiData.user.leaveBalance.sick}/12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] text-muted-foreground">Earned</span>
                    <span className="text-[9px] font-bold text-foreground">{kpiData.user.leaveBalance.earned}/20</span>
                  </div>
                </div>
              </KPICard>

              <KPICard
                title="This Month"
                value=""
                icon={Clock}
                iconColor="bg-primary"
                variant="minimal"
                className="w-[calc(33.333%-7px)] min-w-[105px] flex-shrink-0 sm:w-auto"
              >
                <div className="space-y-0.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] text-muted-foreground">Present</span>
                    <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">{kpiData.user.attendanceMonth.present}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] text-muted-foreground">WFH</span>
                    <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400">{kpiData.user.attendanceMonth.wfh}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] text-muted-foreground">Absent</span>
                    <span className="text-[9px] font-bold text-destructive">{kpiData.user.attendanceMonth.absent}</span>
                  </div>
                </div>
              </KPICard>

              <KPICard
                title="Pending Requests"
                value={kpiData.user.pendingRequests}
                subtitle="Awaiting approval"
                icon={FileText}
                iconColor="bg-amber-500"
                variant="minimal"
                className="w-[calc(33.333%-7px)] min-w-[105px] flex-shrink-0 sm:w-auto sm:col-span-2 lg:col-span-1"
              />
            </>
          ) : (
            <>
              <KPICard
                title="Team on Leave Today"
                value={kpiData.lead.teamOnLeave}
                subtitle="Team members"
                icon={Users}
                iconColor="bg-emerald-500"
                variant="minimal"
                className="w-[calc(33.333%-7px)] min-w-[105px] flex-shrink-0 sm:w-auto"
              />

              <KPICard
                title="Pending Approvals"
                value={kpiData.lead.pendingApprovals}
                subtitle="Need attention"
                icon={Clock}
                iconColor="bg-primary"
                variant="minimal"
                className="w-[calc(33.333%-7px)] min-w-[105px] flex-shrink-0 sm:w-auto"
              />

              <KPICard
                title="Team Summary"
                value=""
                icon={Users}
                iconColor="bg-violet-500"
                variant="minimal"
                className="w-[calc(33.333%-7px)] min-w-[105px] flex-shrink-0 sm:w-auto"
              >
                <div className="space-y-0.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] text-muted-foreground">Present</span>
                    <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">{kpiData.lead.teamAttendance.present}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] text-muted-foreground">WFH</span>
                    <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400">{kpiData.lead.teamAttendance.wfh}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] text-muted-foreground">Absent</span>
                    <span className="text-[9px] font-bold text-destructive">{kpiData.lead.teamAttendance.absent}</span>
                  </div>
                </div>
              </KPICard>
            </>
          )}
        </div>

        {/* Custom CSS to hide scrollbar */}
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>

        {/* Request Type Selection Modal */}
        <Modal
          isOpen={dialogOpen && !dialogType}
          onClose={closeDialog}
          title="Select Request Type"
        >
          <div className="space-y-2">
            <button
              onClick={() => setDialogType("leave")}
              className="w-full text-left px-4 py-3 hover:bg-accent rounded-md transition-colors border border-border hover:border-border"
            >
              <div className="font-medium text-foreground">Apply for Leave</div>
              <div className="text-xs text-muted-foreground">Request time off from work</div>
            </button>
            <button
              onClick={() => setDialogType("wfh")}
              className="w-full text-left px-4 py-3 hover:bg-accent rounded-md transition-colors border border-border hover:border-border"
            >
              <div className="font-medium text-foreground">Request WFH</div>
              <div className="text-xs text-muted-foreground">Work from home request</div>
            </button>
            <button
              onClick={() => setDialogType("onsite")}
              className="w-full text-left px-4 py-3 hover:bg-accent rounded-md transition-colors border border-border hover:border-border"
            >
              <div className="font-medium text-foreground">Request On-site Duty</div>
              <div className="text-xs text-muted-foreground">Work from client location</div>
            </button>
            <button
              onClick={() => setDialogType("regularization")}
              className="w-full text-left px-4 py-3 hover:bg-accent rounded-md transition-colors border border-border hover:border-border"
            >
              <div className="font-medium text-foreground">Request Attendance Regularization</div>
              <div className="text-xs text-muted-foreground">Correct punch in/out times</div>
            </button>
          </div>
        </Modal>

        {/* Combined Row: Tabs + My/Team Toggle + Search/Filter/Export/View */}
        <div className="bg-card rounded-xl border border-border p-3 sm:p-4">
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
            {/* Left: Tabs + My/Team Toggle */}
            <div className="flex items-center gap-3">
              {/* History/Approvals Tabs */}
              <ToggleButtons
                options={[
                  { value: "history", label: "History" },
                  { value: "approvals", label: "Approvals" }
                ]}
                value={activeTab}
                onChange={(value) => {
                  if (userRole !== "user" || value === "history") {
                    setActiveTab(value);
                  }
                }}
              />

              {/* My/Team Toggle for History or Approvals */}
              {userRole !== "user" && (
                <ToggleButtons
                  options={
                    activeTab === "history"
                      ? [
                          { value: "my", label: "My" },
                          { value: "team", label: "Team" }
                        ]
                      : [
                          { value: "my", label: "My" },
                          { value: "team", label: "Team" }
                        ]
                  }
                  value={activeTab === "history" ? historyToggle : approvalToggle}
                  onChange={(value) => {
                    if (activeTab === "history") {
                      setHistoryToggle(value);
                    } else {
                      setApprovalToggle(value);
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* FilterExportBar with Search */}
        <FilterExportBar
          filters={[
            {
              key: 'type',
              label: 'Type',
              options: [
                { value: 'all', label: 'All Types' },
                { value: 'leave', label: 'Leave' },
                { value: 'wfh', label: 'WFH' },
                { value: 'onsite', label: 'On-site' },
                { value: 'regularization', label: 'Regularization' }
              ],
              value: filterType,
              onChange: setFilterType
            }
          ]}
          onExport={handleExport}
          showViewToggle={activeTab === "history"}
          viewToggleProps={{
            currentView: viewType,
            onViewChange: setViewType
          }}
          showSearch={true}
          searchProps={{
            placeholder: "Search records...",
            value: searchQuery,
            onChange: setSearchQuery
          }}
          className="shadow-sm"
        />

        {/* Main Content */}
        <div className="bg-card rounded-xl shadow-sm border border-border">
          <div className="p-4 sm:p-6">

            {/* Tab Content */}
            {activeTab === "history" && (
              <div>
                <DataTable
                  columns={[
                    ...(userRole !== "user" && historyToggle === "team" ? [{
                      key: "employee",
                      label: "Employee",
                      className: "font-medium"
                    }] : []),
                    { key: "date", label: "Date" },
                    { key: "punchIn", label: "Punch In" },
                    { key: "punchOut", label: "Punch Out" },
                    { key: "totalHours", label: "Total Hours" },
                    {
                      key: "status",
                      label: "Status",
                      render: (value: string) => (
                        <Badge variant={value === 'Present' ? 'default' : value === 'Absent' ? 'destructive' : 'secondary'}>
                          {value}
                        </Badge>
                      )
                    }
                  ]}
                  data={historyData}
                  emptyMessage="No attendance records found"
                />
              </div>
            )}

            {activeTab === "approvals" && userRole !== "user" && (
              <div className="space-y-3 sm:space-y-4">
                {approvalData.map((request) => (
                  <Card key={request.id} className="border border-border">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex justify-between items-start mb-2 sm:mb-3">
                        <div>
                          <h4 className="text-sm sm:text-base font-medium text-foreground">{request.employee}</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground">{request.type}</p>
                        </div>
                        <Badge variant="outline" className="text-[10px] sm:text-xs px-1.5 sm:px-2">{request.type}</Badge>
                      </div>
                      <div className="text-xs sm:text-sm text-foreground space-y-0.5 sm:space-y-1 mb-2 sm:mb-4">
                        <div><strong>Period:</strong> {request.startDate} to {request.endDate}</div>
                        <div><strong>Reason:</strong> {request.reason}</div>
                        <div><strong>Manager:</strong> {request.manager}</div>
                      </div>
                      <div className="flex gap-1.5 sm:gap-2">
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white flex-1 h-8 sm:h-9 text-xs">
                          <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">Approve</span>
                          <span className="sm:hidden">✓</span>
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 h-8 sm:h-9 text-xs text-red-600 dark:text-red-400 border-red-600 dark:border-red-400 hover:bg-red-50 dark:hover:bg-red-950">
                          <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">Reject</span>
                          <span className="sm:hidden">✗</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Analytics Section */}
        <div className="bg-card rounded-xl shadow-sm border border-border">
          <div className="p-4 sm:p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          </div>
          <div className="p-4 sm:p-6">
            <div className="space-y-3 max-h-48 overflow-y-auto">
              <div className="flex items-center space-x-2 text-sm text-foreground">
                <Users className="w-4 h-4 text-blue-500" />
                <span>John Doe applied for casual leave</span>
                <span className="text-muted-foreground text-xs">2 hours ago</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-foreground">
                <FileText className="w-4 h-4 text-emerald-500" />
                <span>Jane Smith&apos;s WFH request was approved</span>
                <span className="text-muted-foreground text-xs">4 hours ago</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-foreground">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>Mike Johnson punched in late</span>
                <span className="text-muted-foreground text-xs">1 day ago</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-foreground">
                <Calendar className="w-4 h-4 text-purple-500" />
                <span>Sarah Wilson requested attendance regularization</span>
                <span className="text-muted-foreground text-xs">2 days ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Dialog */}
        <Modal
          isOpen={dialogOpen && !!dialogType}
          onClose={closeDialog}
          title={
            dialogType === "leave" ? "Apply for Leave" :
            dialogType === "wfh" ? "Request Work From Home" :
            dialogType === "onsite" ? "Request On-site Duty" :
            dialogType === "regularization" ? "Request Attendance Regularization" : ""
          }
          showBackButton
          onBack={() => setDialogType("")}
          actions={
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={closeDialog}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={closeDialog}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white border-0"
              >
                Submit
              </Button>
            </div>
          }
        >
          {renderForm()}
        </Modal>
      </div>
    </DashboardLayout>
  );
}