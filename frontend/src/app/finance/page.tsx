'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IndianRupee, TrendingUp, TrendingDown, CreditCard, FileText, Calendar, BarChart3 } from 'lucide-react';

export default function FinanceDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('expenses');

  // Mock data for finance KPIs
  const financeStats = {
    totalRevenue: 2450000,
    totalExpenses: 1250000,
    activeSubscriptions: 24,
    pendingInvoices: 8,
    monthlyBudget: 500000,
    budgetUsed: 325000
  };

  const recentExpenses = [
    { id: 1, date: '2024-12-01', description: 'Office Supplies', amount: 15000, category: 'Operations', status: 'Approved' },
    { id: 2, date: '2024-12-02', description: 'Software Licenses', amount: 45000, category: 'Technology', status: 'Approved' },
    { id: 3, date: '2024-12-02', description: 'Marketing Campaign', amount: 85000, category: 'Marketing', status: 'Pending' },
    { id: 4, date: '2024-12-03', description: 'Team Lunch', amount: 8500, category: 'Employee Welfare', status: 'Approved' },
  ];

  const activeSubscriptions = [
    { id: 1, service: 'Microsoft 365', amount: 12000, renewalDate: '2025-01-15', status: 'Active' },
    { id: 2, service: 'AWS Cloud Services', amount: 35000, renewalDate: '2025-01-20', status: 'Active' },
    { id: 3, service: 'Salesforce CRM', amount: 28000, renewalDate: '2024-12-25', status: 'Expiring Soon' },
    { id: 4, service: 'Adobe Creative Cloud', amount: 18000, renewalDate: '2025-02-10', status: 'Active' },
  ];

  const budgetUtilization = Math.round((financeStats.budgetUsed / financeStats.monthlyBudget) * 100);

  // Monthly data for chart (last 6 months)
  const monthlyData = [
    { month: 'Jul', revenue: 2100000, expenses: 1100000 },
    { month: 'Aug', revenue: 2300000, expenses: 1200000 },
    { month: 'Sep', revenue: 2200000, expenses: 1150000 },
    { month: 'Oct', revenue: 2400000, expenses: 1300000 },
    { month: 'Nov', revenue: 2350000, expenses: 1250000 },
    { month: 'Dec', revenue: 2450000, expenses: 1250000 },
  ];

  const maxValue = Math.max(...monthlyData.map(d => Math.max(d.revenue, d.expenses)));

  return (
    <DashboardLayout>
      <div className="space-y-3 lg:space-y-4">
        <PageHeader title="Finance Dashboard" />

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-3">
          {/* Total Revenue */}
          <div className="flex flex-col items-center justify-center px-3 py-2.5 rounded-lg bg-card border border-border shadow-sm min-h-[70px]">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <div className="text-2xl font-bold text-foreground">₹{(financeStats.totalRevenue / 100000).toFixed(1)}L</div>
            </div>
            <div className="text-xs text-muted-foreground text-center">Total Revenue</div>
          </div>

          {/* Total Expenses */}
          <div className="flex flex-col items-center justify-center px-3 py-2.5 rounded-lg bg-card border border-border shadow-sm min-h-[70px]">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <div className="text-2xl font-bold text-foreground">₹{(financeStats.totalExpenses / 100000).toFixed(1)}L</div>
            </div>
            <div className="text-xs text-muted-foreground text-center">Total Expenses</div>
          </div>

          {/* Active Subscriptions */}
          <div className="flex flex-col items-center justify-center px-3 py-2.5 rounded-lg bg-card border border-border shadow-sm min-h-[70px]">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <div className="text-2xl font-bold text-foreground">{financeStats.activeSubscriptions}</div>
            </div>
            <div className="text-xs text-muted-foreground text-center">Active Subscriptions</div>
          </div>

          {/* Pending Invoices */}
          <div className="flex flex-col items-center justify-center px-3 py-2.5 rounded-lg bg-card border border-border shadow-sm min-h-[70px]">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-orange-600" />
              <div className="text-2xl font-bold text-foreground">{financeStats.pendingInvoices}</div>
            </div>
            <div className="text-xs text-muted-foreground text-center">Pending Invoices</div>
          </div>
        </div>

        {/* Budget Utilization - Compact */}
        <Card className="bg-card rounded-lg sm:rounded-xl shadow-sm border border-border">
          <CardContent className="p-3 sm:p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Monthly Budget</h3>
                <span className="text-xs font-semibold text-foreground">₹{(financeStats.budgetUsed / 1000).toFixed(0)}K / ₹{(financeStats.monthlyBudget / 1000).toFixed(0)}K</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    budgetUtilization > 80 ? 'bg-red-600' : budgetUtilization > 60 ? 'bg-orange-600' : 'bg-green-600'
                  }`}
                  style={{ width: `${budgetUtilization}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{budgetUtilization}% Used</span>
                <span className="text-xs text-muted-foreground">₹{((financeStats.monthlyBudget - financeStats.budgetUsed) / 1000).toFixed(0)}K Left</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue vs Expenses Chart */}
        <Card className="bg-card rounded-lg sm:rounded-xl shadow-sm border border-border">
          <div className="p-3 sm:p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              <h3 className="text-base sm:text-lg font-semibold text-foreground">Revenue vs Expenses (Last 6 Months)</h3>
            </div>
          </div>
          <CardContent className="p-3 sm:p-4">
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={index} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground w-10">{data.month}</span>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-600"></div>
                        ₹{(data.revenue / 100000).toFixed(1)}L
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-600"></div>
                        ₹{(data.expenses / 100000).toFixed(1)}L
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 items-center">
                    <div className="flex-1 h-6 bg-muted rounded overflow-hidden flex">
                      <div
                        className="bg-green-600 h-full transition-all"
                        style={{ width: `${(data.revenue / maxValue) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex-1 h-6 bg-muted rounded overflow-hidden flex">
                      <div
                        className="bg-red-600 h-full transition-all"
                        style={{ width: `${(data.expenses / maxValue) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-center gap-4 pt-2 border-t border-border text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-green-600"></div>
                  <span className="text-muted-foreground">Revenue</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-red-600"></div>
                  <span className="text-muted-foreground">Expenses</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions with Tabs */}
        <Card className="bg-card rounded-lg sm:rounded-xl shadow-sm border border-border">
          <div className="p-3 sm:p-4 border-b border-border">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">Recent Transactions</h3>
          </div>
          <CardContent className="p-3 sm:p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex items-center justify-between mb-3">
                <TabsList>
                  <TabsTrigger value="expenses">Expenses</TabsTrigger>
                  <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
                </TabsList>
                <button
                  onClick={() => router.push(activeTab === 'expenses' ? '/finance/expenses' : '/finance/subscriptions')}
                  className="text-xs sm:text-sm text-primary hover:underline"
                >
                  View All
                </button>
              </div>

              <TabsContent value="expenses" className="mt-0">
                <div className="space-y-3">
                  {recentExpenses.map((expense) => (
                    <div key={expense.id} className="flex items-start justify-between pb-3 border-b border-border last:border-0 last:pb-0">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-foreground truncate">{expense.description}</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{expense.date}</span>
                          <span>•</span>
                          <span>{expense.category}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end ml-2">
                        <span className="text-sm font-semibold text-foreground">₹{(expense.amount / 1000).toFixed(1)}K</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          expense.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {expense.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="subscriptions" className="mt-0">
                <div className="space-y-3">
                  {activeSubscriptions.map((subscription) => (
                    <div key={subscription.id} className="flex items-start justify-between pb-3 border-b border-border last:border-0 last:pb-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate mb-1">{subscription.service}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>Renews: {subscription.renewalDate}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end ml-2">
                        <span className="text-sm font-semibold text-foreground">₹{(subscription.amount / 1000).toFixed(0)}K</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          subscription.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {subscription.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
