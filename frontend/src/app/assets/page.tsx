'use client';
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockAssetStats, mockRecentActivities } from '@/lib/assets-mock-data';
import { Package, CheckSquare, Box, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function AssetsDashboardPage() {
  // Chart data for assets by status with vibrant colors
  const chartData = [
    {
      name: 'In Stock',
      value: mockAssetStats.inStock,
      color: '#10b981' // Green
    },
    {
      name: 'Issued',
      value: mockAssetStats.issued,
      color: '#3b82f6' // Blue
    },
    {
      name: 'In Repair',
      value: mockAssetStats.inRepair,
      color: '#f59e0b' // Amber
    },
    {
      name: 'Scrapped',
      value: mockAssetStats.scrapped,
      color: '#ef4444' // Red
    }
  ];

  const COLORS = chartData.map(item => item.color);

  const getActivityDotColor = (action: string) => {
    switch (action) {
      case 'Issued': return 'bg-primary';
      case 'Created': return 'bg-green-500';
      case 'Returned': return 'bg-yellow-500';
      case 'Repaired': return 'bg-purple-500';
      default: return 'bg-muted-foreground';
    }
  };

  return (
    <DashboardLayout>
      <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">
        <PageHeader title="Asset Management" />

        {/* 4 Compact KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-3">
          <div className="flex flex-col items-center justify-center px-3 py-2.5 rounded-lg bg-card border border-border shadow-sm min-h-[70px]">
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-4 h-4 text-primary" />
              <div className="text-2xl font-bold text-foreground">{mockAssetStats.total}</div>
            </div>
            <div className="text-xs text-muted-foreground text-center">Total Assets</div>
          </div>

          <div className="flex flex-col items-center justify-center px-3 py-2.5 rounded-lg bg-card border border-border shadow-sm min-h-[70px]">
            <div className="flex items-center gap-2 mb-1">
              <CheckSquare className="w-4 h-4 text-green-600" />
              <div className="text-2xl font-bold text-foreground">{mockAssetStats.inStock}</div>
            </div>
            <div className="text-xs text-muted-foreground text-center">In Stock</div>
          </div>

          <div className="flex flex-col items-center justify-center px-3 py-2.5 rounded-lg bg-card border border-border shadow-sm min-h-[70px]">
            <div className="flex items-center gap-2 mb-1">
              <Box className="w-4 h-4 text-blue-600" />
              <div className="text-2xl font-bold text-foreground">{mockAssetStats.issued}</div>
            </div>
            <div className="text-xs text-muted-foreground text-center">Issued</div>
          </div>

          <div className="flex flex-col items-center justify-center px-3 py-2.5 rounded-lg bg-card border border-border shadow-sm min-h-[70px]">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <div className="text-2xl font-bold text-foreground">{mockAssetStats.inRepair + mockAssetStats.scrapped}</div>
            </div>
            <div className="text-xs text-muted-foreground text-center">Repair + Scrapped</div>
          </div>
        </div>

        {/* Assets Distribution Chart */}
        <Card className="bg-card rounded-lg sm:rounded-xl shadow-sm border border-border">
          <CardContent className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">Assets Distribution by Status</h3>
            <div className="w-full h-[280px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="40%"
                    labelLine={false}
                    label={false}
                    outerRadius={80}
                    innerRadius={0}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                    formatter={(value: any) => {
                      const total = chartData.reduce((sum, d) => sum + d.value, 0);
                      const percentage = ((value / total) * 100).toFixed(0);
                      return `${value} (${percentage}%)`;
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={70}
                    layout="horizontal"
                    align="center"
                    wrapperStyle={{
                      paddingTop: '10px',
                      paddingBottom: '10px',
                      fontSize: '12px',
                      lineHeight: '1.5'
                    }}
                    iconType="circle"
                    iconSize={8}
                    formatter={(value: string) => {
                      const item = chartData.find(d => d.name === value);
                      const total = chartData.reduce((sum, d) => sum + d.value, 0);
                      const percentage = item ? ((item.value / total) * 100).toFixed(0) : 0;
                      return `${value}: ${item?.value} (${percentage}%)`;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities - Consistent with other modules */}
        <Card className="bg-card rounded-lg sm:rounded-xl shadow-sm border border-border">
          <div className="p-3 sm:p-4 border-b border-border">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">Recent Activities</h3>
          </div>
          <CardContent className="p-3 sm:p-4">
            <div className="space-y-2">
              {mockRecentActivities.slice(0, 8).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-2.5 sm:p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getActivityDotColor(activity.action)}`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-foreground">
                      <strong className="font-semibold">{activity.assetName}</strong> was{' '}
                      <span className="text-muted-foreground">{activity.action.toLowerCase()}</span> by{' '}
                      <strong className="font-semibold">{activity.user}</strong>
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{activity.timestamp}</p>
                      <Badge variant="secondary" className="text-[9px] sm:text-[10px] px-1.5 py-0.5">
                        {activity.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
