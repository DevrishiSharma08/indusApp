'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  Inbox,
  ShieldCheck,
  UserCheck,
  Clock,
  CheckCircle2,
  TestTube2,
  LifeBuoy,
  BadgeCheck,
  GitMerge,
  Bug,
  CheckCheck,
  RotateCcw,
  PauseCircle,
  Code,
  FlaskConical,
  Plus,
  ListTodo,
  Search,
  FileText,
  X
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import DashboardLayout from '@/components/DashboardLayout';
import Modal from '@/components/Modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TicketManagementDashboard() {
  const [showSubStatusModal, setShowSubStatusModal] = useState(false);
  const [selectedKPI, setSelectedKPI] = useState<string | null>(null);

  // Main 4 KPIs Data with sub-statuses
  const kpiData = {
    all: {
      title: 'All Tickets',
      value: 245,
      icon: Layers,
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      iconColor: 'bg-blue-600',
      description: 'Total tickets across all statuses',
      subStatuses: [] // All tickets - no sub-status breakdown needed
    },
    implementation: {
      title: 'Implementation',
      value: 55,
      icon: Inbox,
      bgColor: 'bg-purple-50 dark:bg-purple-950',
      iconColor: 'bg-purple-600',
      description: 'Tickets in implementation phase',
      subStatuses: [
        { name: 'Pending', count: 32, color: '#F59E0B', icon: Clock },
        { name: 'Assigned', count: 15, color: '#06B6D4', icon: UserCheck },
        { name: 'Escalated', count: 8, color: '#EF4444', icon: ShieldCheck }
      ]
    },
    development: {
      title: 'Development',
      value: 86,
      icon: Code,
      bgColor: 'bg-cyan-50 dark:bg-cyan-950',
      iconColor: 'bg-cyan-600',
      description: 'Tickets in development phase',
      subStatuses: [
        { name: 'In Progress', count: 12, color: '#06B6D4', icon: Clock },
        { name: 'Dev Completed', count: 18, color: '#10B981', icon: CheckCircle2 },
        { name: 'Pending Support', count: 4, color: '#F59E0B', icon: LifeBuoy },
        { name: 'Support Verified', count: 9, color: '#10B981', icon: BadgeCheck },
        { name: 'Pending Merge', count: 5, color: '#F59E0B', icon: GitMerge },
        { name: 'Hold', count: 2, color: '#EF4444', icon: PauseCircle }
      ]
    },
    testing: {
      title: 'Testing',
      value: 55,
      icon: FlaskConical,
      bgColor: 'bg-green-50 dark:bg-green-950',
      iconColor: 'bg-green-600',
      description: 'Tickets in testing phase',
      subStatuses: [
        { name: 'Pending QC', count: 6, color: '#F59E0B', icon: TestTube2 },
        { name: 'In Testing', count: 7, color: '#06B6D4', icon: Bug },
        { name: 'Testing Completed', count: 11, color: '#10B981', icon: CheckCheck },
        { name: 'Closed', count: 28, color: '#10B981', icon: CheckCircle2 },
        { name: 'Reopened', count: 3, color: '#EF4444', icon: RotateCcw }
      ]
    }
  };

  const handleKPIClick = (kpiKey: string) => {
    if (kpiKey === 'all') {
      // Redirect to all tickets page
      window.location.href = '/ticketmanagement/tickets';
    } else {
      setSelectedKPI(kpiKey);
      setShowSubStatusModal(true);
    }
  };

  const getSubStatusData = () => {
    if (!selectedKPI) return { title: '', subStatuses: [] };
    const kpi = kpiData[selectedKPI as keyof typeof kpiData];
    return {
      title: kpi.title,
      description: kpi.description,
      subStatuses: kpi.subStatuses
    };
  };

  // Calculate total and percentages for progress bars
  const calculatePercentage = (count: number, total: number) => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  // Color mapping from CSS variables
  const getColorStyle = (colorVar: string) => ({
    backgroundColor: `var(${colorVar})`
  });

  // Quick Actions
  const allQuickActions = [
    { name: 'Create Ticket', icon: Plus, path: '/ticketmanagement/tickets/create', colorVar: '--module-blue' },
    { name: 'View All Tickets', icon: ListTodo, path: '/ticketmanagement/tickets', colorVar: '--module-green' },
    { name: 'Search Tickets', icon: Search, path: '/ticketmanagement/tickets', colorVar: '--module-purple' },
    { name: 'Reports', icon: FileText, path: '/ticketmanagement/reports', colorVar: '--module-teal' },
  ];

  // Monthly Ticket Trends Chart Data
  const monthlyTrendsData = [
    { month: 'Jan', created: 45, closed: 38 },
    { month: 'Feb', created: 52, closed: 44 },
    { month: 'Mar', created: 48, closed: 50 },
    { month: 'Apr', created: 60, closed: 55 },
  ];

  // Priority Distribution Chart Data
  const priorityDistributionData = [
    { priority: 'High', count: 35 },
    { priority: 'Medium', count: 120 },
    { priority: 'Low', count: 90 },
  ];

  // Recent Activities
  const recentActivities = [
    { description: "Ticket #245 created - Login issue on mobile app", time: "10 min ago" },
    { description: "Ticket #244 assigned to John Smith", time: "1h ago" },
    { description: "Ticket #243 moved to Testing", time: "2h ago" },
    { description: "Ticket #242 closed - Payment gateway fix completed", time: "3h ago" },
  ];

  return (
    <DashboardLayout>
      {/* Main Content - Fully Responsive */}
      <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">

        {/* Header - Mobile Optimized */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Ticket Management</h1>
            </div>
          </div>
        </div>

        {/* Mobile: KPIs in 2x2 Grid */}
        <div className="grid grid-cols-2 gap-3 lg:hidden">
          {Object.entries(kpiData).map(([key, kpi]) => (
            <div
              key={key}
              className={`${kpi.bgColor} rounded-lg p-3 shadow-sm border border-border hover:shadow-md transition-all cursor-pointer group`}
              onClick={() => handleKPIClick(key)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xs font-semibold text-muted-foreground line-clamp-1">
                  {kpi.title}
                </h3>
                <div className={`${kpi.iconColor} w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <kpi.icon className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="text-xl font-bold text-foreground">
                {kpi.value}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: KPIs + Quick Actions in same row */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-4">
          {/* 4 KPIs - Take 8 columns */}
          <div className="col-span-8 grid grid-cols-4 gap-4">
            {Object.entries(kpiData).map(([key, kpi]) => (
              <div
                key={key}
                className={`${kpi.bgColor} rounded-lg p-4 shadow-sm border border-border hover:shadow-md transition-all cursor-pointer group`}
                onClick={() => handleKPIClick(key)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xs font-semibold text-muted-foreground">
                    {kpi.title}
                  </h3>
                  <div className={`${kpi.iconColor} w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <kpi.icon className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {kpi.value}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions - Take 4 columns */}
          <div className="col-span-4">
            <Card className="bg-card rounded-xl p-0 shadow-sm border border-border h-full">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-semibold text-foreground">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="grid grid-cols-2 gap-2">
                  {allQuickActions.map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <Link key={index} href={action.path} className="flex flex-col items-center justify-center space-y-1.5 p-2 rounded-lg hover:bg-accent transition-colors group">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform" style={getColorStyle(action.colorVar)}>
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-[10px] font-medium text-center text-foreground leading-tight">{action.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Charts - 2 Column Grid on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Monthly Trends Chart */}
          <Card className="bg-card rounded-xl p-0 shadow-sm border border-border">
            <CardHeader className="p-4 lg:p-6 pb-4">
              <CardTitle className="text-base lg:text-lg font-semibold text-foreground">Monthly Ticket Trends</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0">
              <div className="h-48 lg:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyTrendsData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
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
                    <Bar dataKey="created" fill="var(--chart-hires)" radius={[4, 4, 0, 0]} name="Created" />
                    <Bar dataKey="closed" fill="var(--chart-leaves)" radius={[4, 4, 0, 0]} name="Closed" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Priority Distribution Chart */}
          <Card className="bg-card rounded-xl p-0 shadow-sm border border-border">
            <CardHeader className="p-4 lg:p-6 pb-4">
              <CardTitle className="text-base lg:text-lg font-semibold text-foreground">Priority Distribution</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0">
              <div className="h-48 lg:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityDistributionData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                    <XAxis
                      dataKey="priority"
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
                    <Bar dataKey="count" fill="var(--module-purple)" radius={[4, 4, 0, 0]} name="Tickets" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity - Responsive */}
        <Card className="bg-card rounded-xl p-0 shadow-sm border border-border">
          <CardHeader className="p-4 lg:p-6 pb-0">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <CardTitle className="text-base lg:text-lg font-semibold text-foreground">Recent Activity</CardTitle>
              <Link href="#" className="text-xs lg:text-sm font-medium text-primary hover:underline">View All</Link>
            </div>
          </CardHeader>
          <CardContent className="p-4 lg:p-6 pt-0">
            <div className="space-y-2 lg:space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-2 lg:space-x-3 p-2 lg:p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-2 h-2 bg-primary rounded-full mt-1.5 lg:mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs lg:text-sm text-foreground line-clamp-2">{activity.description}</p>
                    <p className="text-[10px] lg:text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Sub-Status Modal */}
      <Modal
        isOpen={showSubStatusModal}
        onClose={() => setShowSubStatusModal(false)}
        title={`${getSubStatusData().title} - Status Breakdown`}
      >
        <div className="p-4 space-y-4">
          <p className="text-sm text-muted-foreground">{getSubStatusData().description}</p>

          {/* Sub-Status List with Progress Bars */}
          <div className="space-y-4">
            {getSubStatusData().subStatuses.map((status, index) => {
              const kpi = selectedKPI ? kpiData[selectedKPI as keyof typeof kpiData] : null;
              const total = kpi?.value || 0;
              const percentage = calculatePercentage(status.count, total);
              const StatusIcon = status.icon;

              return (
                <div key={index} className="space-y-2">
                  {/* Status Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: status.color }}
                      >
                        <StatusIcon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{status.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-muted-foreground">{percentage}%</span>
                      <span className="text-sm font-bold text-foreground">{status.count}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: status.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mini Bar Chart */}
          <div className="mt-6 pt-4 border-t border-border">
            <h4 className="text-sm font-semibold text-foreground mb-3">Visual Distribution</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getSubStatusData().subStatuses.map(s => ({ name: s.name, count: s.count }))}
                  margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: 'currentColor', fontSize: 10 }}
                    className="text-muted-foreground"
                    axisLine={false}
                    tickLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={60}
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
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {getSubStatusData().subStatuses.map((status, index) => (
                      <Cell key={`cell-${index}`} fill={status.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
