'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  UserPlus,
  Building2,
  Award,
  MoreHorizontal,
  CalendarCheck,
  DollarSign,
  UserCheck,
  UserX
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardLayout from '@/components/DashboardLayout';
import KPICard from '@/components/KPICard';
import Modal from '@/components/Modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient, type EmployeeStats } from '@/services/api';

const HRMPage = () => {
  // --- STATE ---
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [stats, setStats] = useState<EmployeeStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch employee stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const employeeStats = await apiClient.getEmployeeStats();
        setStats(employeeStats);
      } catch (error) {
        console.error('Failed to fetch employee stats:', error);
        setStats({
          totalEmployees: 0,
          activeEmployees: 0,
          totalDepartments: 0,
          newThisMonth: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Mock data for HRM performance chart
  const performanceData = [
    { month: 'Jan', hires: 5, leaves: 2 },
    { month: 'Feb', hires: 8, leaves: 1 },
    { month: 'Mar', hires: 6, leaves: 3 },
    { month: 'Apr', hires: 10, leaves: 2 },
  ];

  // Mock data for KPI charts
  const teamChartData = [
    { day: 1, value: 40 },
    { day: 2, value: 42 },
    { day: 3, value: 43 },
    { day: 4, value: 45 },
  ];

  const presentChartData = [
    { day: 1, value: 35 },
    { day: 2, value: 38 },
    { day: 3, value: 36 },
    { day: 4, value: 40 },
  ];

  const absentChartData = [
    { day: 1, value: 5 },
    { day: 2, value: 4 },
    { day: 3, value: 7 },
    { day: 4, value: 5 },
  ];

  // Mock attendance data (dummy data until backend is connected)
  const dummyAttendanceData = {
    present: 38,
    wfh: 7,
    absent: 5
  };

  // KPI data - only 3 for mobile left column
  const getKPIData = () => {
    if (loading || !stats) {
      return [
        { title: "Total Team Members", value: "...", icon: Users, iconColorVar: "--module-blue", chartData: teamChartData, chartColor: "var(--module-blue)" },
        { title: "Present (Office + WFH)", value: "...", icon: UserCheck, iconColorVar: "--module-green", chartData: presentChartData, chartColor: "var(--module-green)" },
        { title: "Absent", value: "...", icon: UserX, iconColorVar: "--module-red", chartData: absentChartData, chartColor: "var(--module-red)" },
      ];
    }

    return [
      { title: "Total Team Members", value: stats.totalEmployees.toString(), icon: Users, iconColorVar: "--module-blue", chartData: teamChartData, chartColor: "var(--module-blue)" },
      { title: "Present (Office + WFH)", value: (dummyAttendanceData.present + dummyAttendanceData.wfh).toString(), icon: UserCheck, iconColorVar: "--module-green", chartData: presentChartData, chartColor: "var(--module-green)" },
      { title: "Absent", value: dummyAttendanceData.absent.toString(), icon: UserX, iconColorVar: "--module-red", chartData: absentChartData, chartColor: "var(--module-red)" },
    ];
  };

  // Color mapping from CSS variables
  const getColorStyle = (colorVar: string) => ({
    backgroundColor: `var(${colorVar})`
  });

  // All quick actions
  const allQuickActions = [
    { name: 'Add Team Member', icon: UserPlus, path: '/hrm/employees/add', colorVar: '--module-blue' },
    { name: 'View Team', icon: Users, path: '/hrm/employees', colorVar: '--module-green' },
    { name: 'Leave', icon: CalendarCheck, path: '/hrm/leave-attendance', colorVar: '--module-indigo' },
    { name: 'Departments', icon: Building2, path: '/hrm/departments', colorVar: '--module-purple' },
    { name: 'Designations', icon: Award, path: '/hrm/designations', colorVar: '--module-teal' },
    { name: 'Payroll', icon: DollarSign, path: '/hrm/payroll', colorVar: '--module-red' },
  ];

  // Show first 3 actions in 2x2 grid (4th slot is More button)
  const displayedActions = allQuickActions.slice(0, 3);

  // Mock data for Recent Activity
  const recentActivities = [
    { description: "John Smith joined as Software Engineer", time: "2h ago" },
    { description: "Sarah Wilson applied for leave", time: "4h ago" },
    { description: "New department 'Data Science' created", time: "1d ago" },
  ];

  // --- RENDER ---
  return (
    <DashboardLayout>
      {/* Main Content - Fully Responsive */}
      <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">

        {/* Header - Mobile Optimized */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">HRM Dashboard</h1>
            </div>
          </div>
        </div>

        {/* Mobile: Left/Right Split | Desktop: Horizontal KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {/* Left Column - KPIs Vertical (Mobile) | Horizontal (Desktop) */}
          <div className="col-span-1 lg:col-span-3 flex flex-col lg:grid lg:grid-cols-3 gap-2 lg:gap-4">
            {getKPIData().map((kpi, index) => (
              <KPICard key={index} {...kpi} variant="minimal" />
            ))}
          </div>

          {/* Right Column - Quick Actions (Mobile Only) */}
          <div className="lg:hidden col-span-1">
            <div className="bg-card rounded-xl p-3 shadow-sm border border-border">
              <div className="grid grid-cols-2 gap-2">
                {displayedActions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <Link key={index} href={action.path} className="flex flex-col items-center justify-center space-y-1.5 p-2 rounded-lg hover:bg-accent transition-colors">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={getColorStyle(action.colorVar)}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-[9px] font-medium text-center text-foreground leading-tight">{action.name}</span>
                    </Link>
                  );
                })}
                {/* More Button */}
                <button
                  onClick={() => setShowActionsModal(true)}
                  className="flex flex-col items-center justify-center space-y-1.5 p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <MoreHorizontal className="w-5 h-5 text-foreground" />
                  </div>
                  <span className="text-[9px] font-medium text-foreground">More</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop: 2-Column Grid Layout like Dashboard */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-6">
          {/* Quick Actions Section */}
          <Card className="bg-card rounded-xl p-0 shadow-sm border border-border">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-lg font-semibold text-foreground">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="grid grid-cols-3 gap-3">
                {allQuickActions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <Link key={index} href={action.path} className="flex flex-col items-center justify-center space-y-2 p-4 rounded-lg hover:bg-accent transition-colors group">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={getColorStyle(action.colorVar)}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs font-medium text-center text-foreground leading-tight">{action.name}</span>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Performance Chart */}
          <Card className="bg-card rounded-xl p-0 shadow-sm border border-border">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-lg font-semibold text-foreground">Team Performance</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: 'currentColor', fontSize: 11 }}
                      className="text-muted-foreground"
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: 'currentColor', fontSize: 11 }}
                      className="text-muted-foreground"
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        color: 'hsl(var(--foreground))',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="hires" fill="var(--chart-hires)" radius={[4, 4, 0, 0]} name="New Hires" />
                    <Bar dataKey="leaves" fill="var(--chart-leaves)" radius={[4, 4, 0, 0]} name="Exits" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile: Performance Chart */}
        <Card className="lg:hidden bg-card rounded-xl p-0 shadow-sm border border-border">
          <CardHeader className="p-3 sm:p-4 pb-0">
            <CardTitle className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Team Performance</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="h-40 sm:h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: 'currentColor', fontSize: 11 }}
                    className="text-muted-foreground"
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'currentColor', fontSize: 11 }}
                    className="text-muted-foreground"
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      color: 'hsl(var(--foreground))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="hires" fill="var(--chart-hires)" radius={[4, 4, 0, 0]} name="New Hires" />
                  <Bar dataKey="leaves" fill="var(--chart-leaves)" radius={[4, 4, 0, 0]} name="Exits" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity - Responsive */}
        <Card className="bg-card rounded-xl p-0 shadow-sm border border-border">
          <CardHeader className="p-3 sm:p-4 lg:p-6 pb-0">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <CardTitle className="text-base sm:text-lg font-semibold text-foreground">Recent Activity</CardTitle>
              <Link href="#" className="text-xs sm:text-sm font-medium text-primary hover:underline">View All</Link>
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
            <div className="space-y-2 sm:space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-2 h-2 bg-primary rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-foreground line-clamp-2">{activity.description}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Quick Actions Modal */}
      <Modal
        isOpen={showActionsModal}
        onClose={() => setShowActionsModal(false)}
        title="All Quick Actions"
        className="max-w-2xl"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {allQuickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Link
                key={index}
                href={action.path}
                onClick={() => setShowActionsModal(false)}
                className="flex flex-col items-center justify-center space-y-3 p-4 sm:p-5 rounded-lg border border-border hover:bg-accent transition-colors group"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center" style={getColorStyle(action.colorVar)}>
                  <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <span className="text-sm sm:text-base font-medium text-center text-foreground">{action.name}</span>
              </Link>
            );
          })}
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default HRMPage;
