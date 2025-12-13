'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Briefcase,
  KanbanSquare,
  ClipboardCheck,
  Bot,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Package,
  IndianRupee,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardLayout from '@/components/DashboardLayout';
import KPICard from '@/components/KPICard';
import Modal from '@/components/Modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TasksPage from '../projectmanagement/tasks/page';

const Dashboard = () => {
  // --- STATE ---
  const [showAllApps, setShowAllApps] = useState(false);
  const [showAppsModal, setShowAppsModal] = useState(false);
  
  // --- DATA & LOGIC ---

  // Get user from localStorage safely
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;

  // Mock data for charts
  const performanceData = [
    { week: 'W1', tasks: 12, leads: 5 },
    { week: 'W2', tasks: 19, leads: 8 },
    { week: 'W3', tasks: 15, leads: 12 },
    { week: 'W4', tasks: 25, leads: 15 },
  ];

  // Mock data for KPI charts
  const taskChartData = [
    { day: 1, value: 5 },
    { day: 2, value: 7 },
    { day: 3, value: 6 },
    { day: 4, value: 8 },
  ];

  const completedChartData = [
    { day: 1, value: 3 },
    { day: 2, value: 4 },
    { day: 3, value: 3 },
    { day: 4, value: 5 },
  ];

  const pendingChartData = [
    { day: 1, value: 4 },
    { day: 2, value: 3 },
    { day: 3, value: 2 },
    { day: 4, value: 3 },
  ];

  // KPI data based on user role (Preserved your logic)
  const getKPIData = () => {
    const baseKPIs = [
      { title: "My Open Task", value: "8", icon: ClipboardCheck, iconColorVar: "--module-blue", chartData: taskChartData, chartColor: "var(--module-blue)" },
      { title: "Completed Today", value: "5", icon: CheckCircle, iconColorVar: "--module-green", chartData: completedChartData, chartColor: "var(--module-green)" },
      { title: "Pending Approval", value: "3", icon: Clock, iconColorVar: "--module-amber", chartData: pendingChartData, chartColor: "var(--module-amber)" },
    ];

    if (user?.role === 'Admin') {
      return [
        { title: "Total Employees", value: "45", icon: Users, iconColorVar: "--module-blue" },
        { title: "Active Projects", value: "12", icon: KanbanSquare, iconColorVar: "--module-purple" },
        { title: "Pending Tasks", value: "28", icon: ClipboardCheck, iconColorVar: "--module-amber" },
      ];
    }
    return baseKPIs;
  };

  // Color mapping from CSS variables
  const getColorStyle = (colorVar: string) => ({
    backgroundColor: `var(${colorVar})`
  });

  // All available application modules
  const allModules = [
    { name: 'HRM', icon: Users, path: '/hrm', colorVar: '--module-blue' },
    { name: 'CRM', icon: Briefcase, path: '/crm', colorVar: '--module-green' },
    { name: 'Projects & Tasks', icon: KanbanSquare, path: '/projectmanagement', colorVar: '--module-purple' },
    { name: 'Ticket Management', icon: Briefcase, path: '/ticketmanagement',colorVar: '--module-indigo' },
    { name: 'Assets', icon: Package, path: '/assets', colorVar: '--module-teal' },
    { name: 'Finance', icon: IndianRupee, path: '/finance', colorVar: '--module-red' },
    // { name: 'MIS', icon: BarChart3, path: '/mis', colorVar: '--module-indigo' },
  ];
  
  // Show first 3 apps in 2x2 grid (4th slot is More button)
  const displayedModules = allModules.slice(0, 3);
  
  // Mock data for Recent Activity
  const recentActivities = [
    { description: "You completed 'Design new logo'", time: "10m ago" },
    { description: "New task 'Develop homepage' assigned to you", time: "1h ago" },
    { description: "'Review Q3 budget' is due tomorrow", time: "3h ago" },
  ];


  // --- RENDER ---
  return (
    <DashboardLayout>
      {/* Main Content - Fully Responsive */}
      <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">

        {/* Mobile: Left/Right Split | Desktop: Horizontal KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {/* Left Column - KPIs Vertical (Mobile) | Horizontal (Desktop) */}
          <div className="col-span-1 lg:col-span-3 flex flex-col lg:grid lg:grid-cols-3 gap-2 lg:gap-4">
            {getKPIData().map((kpi, index) => (
              <KPICard key={index} {...kpi} variant="minimal" />
            ))}
          </div>

          {/* Right Column - Applications (Mobile Only) */}
          <div className="lg:hidden col-span-1">
            <div className="bg-card rounded-xl p-3 shadow-sm border border-border">
              <div className="grid grid-cols-2 gap-2">
                {displayedModules.map((module, index) => {
                  const IconComponent = module.icon;
                  return (
                    <Link key={index} href={module.path} className="flex flex-col items-center justify-center space-y-1.5 p-2 hover:bg-accent transition-colors">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={getColorStyle(module.colorVar)}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-[9px] font-medium text-center text-foreground leading-tight">{module.name}</span>
                    </Link>
                  );
                })}
                {/* More Button */}
                <button
                  onClick={() => setShowAppsModal(true)}
                  className="flex flex-col items-center justify-center space-y-1.5 p-2 hover:bg-accent transition-colors"
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

        {/* Desktop: 2-Column Grid Layout like HRM */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-6">
          {/* Applications Section */}
          <Card className="bg-card rounded-xl p-0 shadow-sm border border-border">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-lg font-semibold text-foreground">Applications</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="grid grid-cols-3 gap-3">
                {allModules.map((module, index) => {
                  const IconComponent = module.icon;
                  return (
                    <Link key={index} href={module.path} className="flex flex-col items-center justify-center space-y-2 p-4 rounded-lg border border-border hover:bg-accent transition-colors group">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={getColorStyle(module.colorVar)}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs font-medium text-center text-foreground leading-tight">{module.name}</span>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Performance Chart */}
          <Card className="bg-card rounded-xl p-0 shadow-sm border border-border">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-lg font-semibold text-foreground">My Performance</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                    <XAxis
                      dataKey="week"
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
                    <Line type="monotone" dataKey="tasks" stroke="var(--chart-tasks)" strokeWidth={2} name="Tasks" dot={{ fill: 'var(--chart-tasks)', strokeWidth: 2, r: 3 }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="leads" stroke="var(--chart-leads)" strokeWidth={2} name="Leads" dot={{ fill: 'var(--chart-leads)', strokeWidth: 2, r: 3 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile: Performance Chart */}
        <Card className="lg:hidden bg-card rounded-xl p-0 shadow-sm border border-border">
          <CardHeader className="p-3 sm:p-4 pb-0">
            <CardTitle className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">My Performance</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="h-40 sm:h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                  <XAxis
                    dataKey="week"
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
                  <Line type="monotone" dataKey="tasks" stroke="var(--chart-tasks)" strokeWidth={2} name="Tasks" dot={{ fill: 'var(--chart-tasks)', strokeWidth: 2, r: 3 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="leads" stroke="var(--chart-leads)" strokeWidth={2} name="Leads" dot={{ fill: 'var(--chart-leads)', strokeWidth: 2, r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
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

      {/* Floating AI Bot Button - Responsive */}
      <button className="fixed bottom-20 sm:bottom-24 lg:bottom-6 right-4 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-40">
        <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Applications Modal */}
      <Modal
        isOpen={showAppsModal}
        onClose={() => setShowAppsModal(false)}
        title="All Applications"
        className="max-w-2xl"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {allModules.map((module, index) => {
            const IconComponent = module.icon;
            return (
              <Link
                key={index}
                href={module.path}
                onClick={() => setShowAppsModal(false)}
                className="flex flex-col items-center justify-center space-y-3 p-4 sm:p-5 rounded-lg border border-border hover:bg-accent transition-colors group"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center" style={getColorStyle(module.colorVar)}>
                  <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <span className="text-sm sm:text-base font-medium text-center text-foreground">{module.name}</span>
              </Link>
            );
          })}
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Dashboard;