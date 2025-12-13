'use client';

import { useState } from 'react';
import { DollarSign, FileText, Calculator, Download, Users, TrendingUp, Plus, Filter } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

// Mock data for salary structures
const salaryStructures = [
  {
    id: 1,
    designation: 'Software Engineer',
    grade: 'E1',
    basicSalary: 50000,
    hra: 20000,
    otherAllowances: 10000,
    totalCTC: 80000,
    employeeCount: 15,
  },
  {
    id: 2,
    designation: 'Senior Software Engineer',
    grade: 'E2',
    basicSalary: 80000,
    hra: 32000,
    otherAllowances: 18000,
    totalCTC: 130000,
    employeeCount: 8,
  },
  {
    id: 3,
    designation: 'Team Lead',
    grade: 'M1',
    basicSalary: 120000,
    hra: 48000,
    otherAllowances: 30000,
    totalCTC: 198000,
    employeeCount: 5,
  },
];

// Mock data for monthly computations
const monthlyComputations = [
  {
    id: 1,
    employeeName: 'John Doe',
    employeeId: 'EMP001',
    department: 'Engineering',
    basicSalary: 50000,
    allowances: 30000,
    deductions: 5000,
    netSalary: 75000,
    status: 'Processed',
  },
  {
    id: 2,
    employeeName: 'Jane Smith',
    employeeId: 'EMP002',
    department: 'Engineering',
    basicSalary: 80000,
    allowances: 50000,
    deductions: 8000,
    netSalary: 122000,
    status: 'Processed',
  },
  {
    id: 3,
    employeeName: 'Mike Johnson',
    employeeId: 'EMP003',
    department: 'HR',
    basicSalary: 60000,
    allowances: 35000,
    deductions: 6000,
    netSalary: 89000,
    status: 'Pending',
  },
];

// Mock data for pay slips
const paySlips = [
  {
    id: 1,
    month: 'January 2024',
    employeeCount: 45,
    totalPayout: 4500000,
    status: 'Completed',
    processedDate: '2024-01-31',
  },
  {
    id: 2,
    month: 'February 2024',
    employeeCount: 47,
    totalPayout: 4700000,
    status: 'Completed',
    processedDate: '2024-02-29',
  },
  {
    id: 3,
    month: 'March 2024',
    employeeCount: 48,
    totalPayout: 4800000,
    status: 'In Progress',
    processedDate: null,
  },
];

// Mock data for tax deductions
const taxDeductions = [
  { name: 'Income Tax', amount: 8500, percentage: 18 },
  { name: 'Professional Tax', amount: 2500, percentage: 5 },
  { name: 'Provident Fund', amount: 6000, percentage: 12 },
  { name: 'ESI', amount: 1800, percentage: 3.25 },
];

export default function PayrollPage() {
  const [selectedMonth, setSelectedMonth] = useState('March 2024');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Calculate stats
  const totalEmployees = monthlyComputations.length;
  const totalPayroll = monthlyComputations.reduce((sum, emp) => sum + emp.netSalary, 0);
  const processedCount = monthlyComputations.filter(emp => emp.status === 'Processed').length;
  const pendingCount = monthlyComputations.filter(emp => emp.status === 'Pending').length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">
        <PageHeader
          title="Payroll Management"
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Employees</p>
                  <p className="text-2xl font-bold text-card-foreground mt-1">{totalEmployees}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Payroll</p>
                  <p className="text-2xl font-bold text-card-foreground mt-1">{formatCurrency(totalPayroll)}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Processed</p>
                  <p className="text-2xl font-bold text-card-foreground mt-1">{processedCount}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-card-foreground mt-1">{pendingCount}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="salary-structure" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="salary-structure">Salary Structure</TabsTrigger>
            <TabsTrigger value="monthly-computation">Monthly Computation</TabsTrigger>
            <TabsTrigger value="payslips">Pay Slips</TabsTrigger>
            <TabsTrigger value="tax-deductions">Tax & Deductions</TabsTrigger>
          </TabsList>

          {/* Salary Structure Tab */}
          <TabsContent value="salary-structure" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Salary Structures by Designation</CardTitle>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Structure
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Designation</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead className="hidden md:table-cell">Basic Salary</TableHead>
                      <TableHead className="hidden md:table-cell">HRA</TableHead>
                      <TableHead className="hidden lg:table-cell">Other Allowances</TableHead>
                      <TableHead>Total CTC</TableHead>
                      <TableHead className="hidden sm:table-cell">Employees</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salaryStructures.map((structure) => (
                      <TableRow key={structure.id}>
                        <TableCell className="font-medium">{structure.designation}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{structure.grade}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{formatCurrency(structure.basicSalary)}</TableCell>
                        <TableCell className="hidden md:table-cell">{formatCurrency(structure.hra)}</TableCell>
                        <TableCell className="hidden lg:table-cell">{formatCurrency(structure.otherAllowances)}</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(structure.totalCTC)}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="secondary">{structure.employeeCount}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monthly Computation Tab */}
          <TabsContent value="monthly-computation" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="March 2024">March 2024</SelectItem>
                    <SelectItem value="February 2024">February 2024</SelectItem>
                    <SelectItem value="January 2024">January 2024</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button>
                <Calculator className="w-4 h-4 mr-2" />
                Process Payroll
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead className="hidden lg:table-cell">Department</TableHead>
                      <TableHead className="hidden md:table-cell">Basic</TableHead>
                      <TableHead className="hidden md:table-cell">Allowances</TableHead>
                      <TableHead className="hidden lg:table-cell">Deductions</TableHead>
                      <TableHead>Net Salary</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlyComputations.map((comp) => (
                      <TableRow key={comp.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{comp.employeeName}</div>
                            <div className="text-sm text-muted-foreground">{comp.employeeId}</div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{comp.department}</TableCell>
                        <TableCell className="hidden md:table-cell">{formatCurrency(comp.basicSalary)}</TableCell>
                        <TableCell className="hidden md:table-cell">{formatCurrency(comp.allowances)}</TableCell>
                        <TableCell className="hidden lg:table-cell">{formatCurrency(comp.deductions)}</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(comp.netSalary)}</TableCell>
                        <TableCell>
                          <Badge variant={comp.status === 'Processed' ? 'default' : 'secondary'}>
                            {comp.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pay Slips Tab */}
          <TabsContent value="payslips" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Monthly Pay Slip Records</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download All
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Employees</TableHead>
                      <TableHead className="hidden md:table-cell">Total Payout</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden lg:table-cell">Processed Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paySlips.map((slip) => (
                      <TableRow key={slip.id}>
                        <TableCell className="font-medium">{slip.month}</TableCell>
                        <TableCell>{slip.employeeCount}</TableCell>
                        <TableCell className="hidden md:table-cell">{formatCurrency(slip.totalPayout)}</TableCell>
                        <TableCell>
                          <Badge variant={slip.status === 'Completed' ? 'default' : 'secondary'}>
                            {slip.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground">
                          {slip.processedDate || 'N/A'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tax & Deductions Tab */}
          <TabsContent value="tax-deductions" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Tax & Deduction Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {taxDeductions.map((deduction, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{deduction.name}</span>
                        <div className="text-right">
                          <span className="font-semibold">{formatCurrency(deduction.amount)}</span>
                          <span className="text-xs text-muted-foreground ml-2">({deduction.percentage}%)</span>
                        </div>
                      </div>
                      <Progress value={deduction.percentage * 5} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Statutory Compliance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                    <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">PF Compliance</p>
                      <p className="text-sm text-muted-foreground">All employees enrolled in EPF scheme</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                    <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">ESI Compliance</p>
                      <p className="text-sm text-muted-foreground">ESI contributions up to date</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                    <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">TDS Filing</p>
                      <p className="text-sm text-muted-foreground">Last filed: February 2024</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                    <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Professional Tax</p>
                      <p className="text-sm text-muted-foreground">All state compliances met</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}