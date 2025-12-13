'use client';

import Link from 'next/link';
import {
  Briefcase,
  CheckSquare,
  AlertOctagon,
  Clock,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PMSDashboardPage() {
  // 4 Important KPIs for project management
  const kpiData = [
    {
      title: "Active Projects",
      value: 12,
      icon: Briefcase,
      iconColor: "text-blue-600",
    },
    {
      title: "Total Tasks",
      value: 234,
      icon: CheckSquare,
      iconColor: "text-green-600",
    },
    {
      title: "Issues Overdue",
      value: 8,
      icon: AlertOctagon,
      iconColor: "text-destructive",
    },
    {
      title: "Hours Logged",
      value: 156,
      icon: Clock,
      iconColor: "text-orange-600",
    },
  ];

  // Active Projects data for bar chart
  const activeProjectsData = [
    { name: 'Indus Nova', progress: 75 },
    { name: 'Project Phoenix', progress: 40 },
    { name: 'Quantum Leap', progress: 90 },
    { name: 'Alpha Release', progress: 65 },
    { name: 'Beta Testing', progress: 30 },
    { name: 'Cloud Migration', progress: 85 },
  ];

  // Recent activities
  const recentActivities = [
    { description: "New commit on Indus Nova by John Doe", time: "2m ago" },
    { description: "Sprint 2 of Project Phoenix completed", time: "1h ago" },
    { description: "Deadline for Quantum Leap is tomorrow", time: "4h ago" },
  ];

  return (
    <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">
      <PageHeader title="Projects Dashboard" />

      {/* 4 KPIs in 2x2 Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-3">
        {kpiData.map((kpi, index) => {
          const IconComponent = kpi.icon;
          return (
            <div key={index} className="flex flex-col items-center justify-center px-3 py-2.5 rounded-lg bg-card border border-border shadow-sm min-h-[70px]">
              <div className="flex items-center gap-2 mb-1">
                <IconComponent className={`w-4 h-4 ${kpi.iconColor}`} />
                <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
              </div>
              <div className="text-xs text-muted-foreground text-center">{kpi.title}</div>
            </div>
          );
        })}
      </div>

      {/* Active Projects Bar Chart */}
      <Card className="bg-card rounded-lg sm:rounded-xl shadow-sm border border-border">
        <CardHeader className="p-3 sm:p-4 border-b border-border">
          <CardTitle className="text-base sm:text-lg font-semibold text-foreground">Active Projects Progress</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4">
          <div className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeProjectsData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border" />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fill: 'currentColor', fontSize: 11 }}
                  className="text-muted-foreground"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: 'currentColor', fontSize: 11 }}
                  className="text-muted-foreground"
                  axisLine={false}
                  tickLine={false}
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    color: 'hsl(var(--foreground))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value) => [`${value}%`, 'Progress']}
                />
                <Bar dataKey="progress" fill="var(--chart-projects)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-card rounded-lg sm:rounded-xl shadow-sm border border-border">
        <div className="p-3 sm:p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">Recent Activity</h3>
            <Link href="#" className="text-xs sm:text-sm font-medium text-primary hover:underline">View All</Link>
          </div>
        </div>
        <CardContent className="p-3 sm:p-4">
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
  );
}
