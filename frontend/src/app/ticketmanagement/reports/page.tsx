'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/PageHeader';
import FilterExportBar from '@/components/FilterExportBar';
import StatusBadge from '@/components/StatusBadge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Clock, AlertCircle, TrendingUp, MoreVertical, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimeReport {
  id: string;
  title: string;
  customer: string;
  assignedTo: string;
  status: string;
  createdDate: string;
  expectedDate: string;
  expectedMinutes: number;
  developerTime: number;
  developerPauseTime: number;
  supportTime: number;
  testerTime: number;
  delayTime: number;
}

const mockReports: TimeReport[] = [
  {
    id: 'TKT-3001',
    title: 'Login page not loading',
    customer: 'Acme Corp',
    assignedTo: 'John Developer',
    status: 'Completed',
    createdDate: '2025-11-01',
    expectedDate: '2025-11-03',
    expectedMinutes: 480,
    developerTime: 420,
    developerPauseTime: 60,
    supportTime: 45,
    testerTime: 90,
    delayTime: 0
  },
  {
    id: 'TKT-3002',
    title: 'Payment gateway timeout',
    customer: 'Tech Solutions',
    assignedTo: 'Mike Smith',
    status: 'In Progress',
    createdDate: '2025-11-02',
    expectedDate: '2025-11-05',
    expectedMinutes: 720,
    developerTime: 540,
    developerPauseTime: 120,
    supportTime: 0,
    testerTime: 0,
    delayTime: 180
  },
  {
    id: 'TKT-3003',
    title: 'Dashboard widgets not refreshing',
    customer: 'Global Systems',
    assignedTo: 'Emily Chen',
    status: 'Testing',
    createdDate: '2025-10-28',
    expectedDate: '2025-11-01',
    expectedMinutes: 360,
    developerTime: 300,
    developerPauseTime: 45,
    supportTime: 30,
    testerTime: 60,
    delayTime: 720
  },
  {
    id: 'TKT-3004',
    title: 'Export to PDF broken',
    customer: 'Innovate Ltd',
    assignedTo: 'Robert Jones',
    status: 'Completed',
    createdDate: '2025-10-25',
    expectedDate: '2025-10-27',
    expectedMinutes: 240,
    developerTime: 180,
    developerPauseTime: 30,
    supportTime: 20,
    testerTime: 45,
    delayTime: 0
  },
  {
    id: 'TKT-3005',
    title: 'Mobile app crashes on Android 14',
    customer: 'NextGen Inc',
    assignedTo: 'Alex Kumar',
    status: 'In Progress',
    createdDate: '2025-10-30',
    expectedDate: '2025-11-04',
    expectedMinutes: 960,
    developerTime: 780,
    developerPauseTime: 180,
    supportTime: 60,
    testerTime: 0,
    delayTime: 240
  },
  {
    id: 'TKT-3006',
    title: 'Email notifications delayed',
    customer: 'CloudBase',
    assignedTo: 'Sarah Developer',
    status: 'Completed',
    createdDate: '2025-10-20',
    expectedDate: '2025-10-22',
    expectedMinutes: 120,
    developerTime: 90,
    developerPauseTime: 15,
    supportTime: 15,
    testerTime: 30,
    delayTime: 0
  },
  {
    id: 'TKT-3007',
    title: 'Database connection pooling issue',
    customer: 'DataFlow Systems',
    assignedTo: 'John Developer',
    status: 'Support Review',
    createdDate: '2025-10-18',
    expectedDate: '2025-10-22',
    expectedMinutes: 600,
    developerTime: 540,
    developerPauseTime: 90,
    supportTime: 90,
    testerTime: 0,
    delayTime: 360
  },
  {
    id: 'TKT-3008',
    title: 'Search autocomplete too slow',
    customer: 'SearchPro',
    assignedTo: 'Mike Smith',
    status: 'Completed',
    createdDate: '2025-10-15',
    expectedDate: '2025-10-18',
    expectedMinutes: 480,
    developerTime: 420,
    developerPauseTime: 60,
    supportTime: 45,
    testerTime: 75,
    delayTime: 0
  },
  {
    id: 'TKT-3009',
    title: 'User profile update feature',
    customer: 'Acme Corp',
    assignedTo: 'Emily Chen',
    status: 'Testing',
    createdDate: '2025-10-12',
    expectedDate: '2025-10-16',
    expectedMinutes: 540,
    developerTime: 480,
    developerPauseTime: 90,
    supportTime: 0,
    testerTime: 120,
    delayTime: 480
  },
  {
    id: 'TKT-3010',
    title: 'Invoice generation module',
    customer: 'Tech Solutions',
    assignedTo: 'Robert Jones',
    status: 'Completed',
    createdDate: '2025-10-10',
    expectedDate: '2025-10-14',
    expectedMinutes: 840,
    developerTime: 720,
    developerPauseTime: 120,
    supportTime: 60,
    testerTime: 150,
    delayTime: 0
  },
  {
    id: 'TKT-3011',
    title: 'Quick fix: Button alignment',
    customer: 'Acme Corp',
    assignedTo: 'John Developer',
    status: 'Completed',
    createdDate: '2025-11-05',
    expectedDate: '2025-11-05',
    expectedMinutes: 10,
    developerTime: 8,
    developerPauseTime: 2,
    supportTime: 0,
    testerTime: 5,
    delayTime: 0
  },
  {
    id: 'TKT-3012',
    title: 'Quick fix: Text color update',
    customer: 'Tech Solutions',
    assignedTo: 'Emily Chen',
    status: 'Completed',
    createdDate: '2025-11-04',
    expectedDate: '2025-11-04',
    expectedMinutes: 5,
    developerTime: 5,
    developerPauseTime: 0,
    supportTime: 0,
    testerTime: 3,
    delayTime: 0
  },
  {
    id: 'TKT-3013',
    title: 'Quick fix: Tooltip text',
    customer: 'Global Systems',
    assignedTo: 'Mike Smith',
    status: 'Completed',
    createdDate: '2025-11-03',
    expectedDate: '2025-11-03',
    expectedMinutes: 8,
    developerTime: 7,
    developerPauseTime: 1,
    supportTime: 0,
    testerTime: 4,
    delayTime: 0
  },
  {
    id: 'TKT-3014',
    title: 'API integration with third-party',
    customer: 'Innovate Ltd',
    assignedTo: 'Alex Kumar',
    status: 'In Progress',
    createdDate: '2025-10-08',
    expectedDate: '2025-10-15',
    expectedMinutes: 1200,
    developerTime: 960,
    developerPauseTime: 240,
    supportTime: 120,
    testerTime: 0,
    delayTime: 1440
  },
  {
    id: 'TKT-3015',
    title: 'Performance optimization',
    customer: 'NextGen Inc',
    assignedTo: 'Sarah Developer',
    status: 'Completed',
    createdDate: '2025-10-05',
    expectedDate: '2025-10-10',
    expectedMinutes: 720,
    developerTime: 660,
    developerPauseTime: 120,
    supportTime: 45,
    testerTime: 90,
    delayTime: 0
  }
];

const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

export default function TimeReports() {
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('2025-10-01');
  const [dateTo, setDateTo] = useState('2025-11-06');
  const [developerFilter, setDeveloperFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showQuickTasks, setShowQuickTasks] = useState(false);

  // Get unique developers
  const developers = Array.from(new Set(mockReports.map(r => r.assignedTo)));

  // Filter reports
  const filteredReports = mockReports.filter(report => {
    const matchesSearch =
      report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDeveloper = developerFilter === 'all' || report.assignedTo === developerFilter;
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesQuickTask = !showQuickTasks || (report.expectedMinutes >= 5 && report.expectedMinutes <= 10);

    return matchesSearch && matchesDeveloper && matchesStatus && matchesQuickTask;
  });

  // Calculate KPIs
  const totalTickets = filteredReports.length;
  const totalTimeMinutes = filteredReports.reduce((sum, r) => sum + r.developerTime + r.supportTime + r.testerTime, 0);
  const averageTimeMinutes = totalTickets > 0 ? Math.round(totalTimeMinutes / totalTickets) : 0;
  const overdueCount = filteredReports.filter(r => r.delayTime > 0).length;

  // Calculate developer stats
  const developerStats = developers.map(dev => {
    const devTickets = filteredReports.filter(r => r.assignedTo === dev);
    const totalTime = devTickets.reduce((sum, r) => sum + r.developerTime, 0);
    const completedTickets = devTickets.filter(r => r.status === 'Completed').length;
    const completionRate = devTickets.length > 0 ? Math.round((completedTickets / devTickets.length) * 100) : 0;

    return {
      developer: dev,
      totalTickets: devTickets.length,
      completedTickets,
      totalTime,
      avgTime: devTickets.length > 0 ? Math.round(totalTime / devTickets.length) : 0,
      completionRate
    };
  });

  const handleExport = () => {
    console.log('Exporting to Excel...');
    // Implement Excel export logic
  };

  return (
    <DashboardLayout>
      <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">
        <PageHeader
          title="Time Reports"
        />

        {/* Report List with Integrated Controls */}
        <Card className="bg-card rounded-lg sm:rounded-xl shadow-sm border border-border">
          {/* Compact KPI Stats */}
          <div className="p-2 border-b border-border">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="flex flex-col items-center justify-center px-2 py-1.5 rounded-lg bg-muted/50 min-h-[52px]">
                <div className="text-lg font-bold text-foreground">{totalTickets}</div>
                <div className="text-xs text-muted-foreground text-center">Total Tickets</div>
              </div>
              <div className="flex flex-col items-center justify-center px-2 py-1.5 rounded-lg bg-muted/50 min-h-[52px]">
                <div className="text-lg font-bold text-foreground">{formatTime(totalTimeMinutes)}</div>
                <div className="text-xs text-muted-foreground text-center">Total Time</div>
              </div>
              <div className="flex flex-col items-center justify-center px-2 py-1.5 rounded-lg bg-muted/50 min-h-[52px]">
                <div className="text-lg font-bold text-foreground">{formatTime(averageTimeMinutes)}</div>
                <div className="text-xs text-muted-foreground text-center">Avg Time</div>
              </div>
              <div className="flex flex-col items-center justify-center px-2 py-1.5 rounded-lg bg-muted/50 min-h-[52px]">
                <div className="text-lg font-bold text-destructive">{overdueCount}</div>
                <div className="text-xs text-muted-foreground text-center">Overdue</div>
              </div>
            </div>
          </div>

          {/* FilterExportBar with custom filters */}
          <div className="p-2 border-b border-border">
            <div className="space-y-2">
              {/* FilterExportBar Row */}
              <FilterExportBar
                filters={[
                  {
                    key: 'developer',
                    label: 'Developer',
                    value: developerFilter,
                    onChange: setDeveloperFilter,
                    options: [
                      { value: 'all', label: 'All Developers' },
                      ...developers.map(dev => ({ value: dev, label: dev }))
                    ],
                  },
                  {
                    key: 'status',
                    label: 'Status',
                    value: statusFilter,
                    onChange: setStatusFilter,
                    options: [
                      { value: 'all', label: 'All Status' },
                      { value: 'Completed', label: 'Completed' },
                      { value: 'In Progress', label: 'In Progress' },
                      { value: 'Testing', label: 'Testing' },
                      { value: 'Support Review', label: 'Support Review' },
                    ],
                  },
                ]}
                onExport={handleExport}
                showViewToggle={true}
                viewToggleProps={{
                  currentView: viewMode,
                  onViewChange: setViewMode
                }}
                showSearch={true}
                searchProps={{
                  placeholder: "Search by ticket ID, title, customer, or developer...",
                  value: searchQuery,
                  onChange: setSearchQuery
                }}
              />

              {/* Additional Date & Quick Task Filters */}
              <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                <Input
                  id="dateFrom"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="h-9 flex-1"
                  placeholder="From Date"
                />
                <Input
                  id="dateTo"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="h-9 flex-1"
                  placeholder="To Date"
                />
                <Button
                  variant={showQuickTasks ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowQuickTasks(!showQuickTasks)}
                  className="h-9 flex-shrink-0"
                >
                  Quick Tasks (5-10m)
                </Button>
              </div>
            </div>
          </div>

          {/* Data Content */}
          <div className="p-0">
            {/* Table View */}
            {viewMode === 'table' && (
              <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Expected</TableHead>
                    <TableHead>Est. Time</TableHead>
                    <TableHead>Dev Time</TableHead>
                    <TableHead>Pause Time</TableHead>
                    <TableHead>Support</TableHead>
                    <TableHead>Tester</TableHead>
                    <TableHead>Delay</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={14} className="text-center py-8 text-muted-foreground">
                        No reports found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredReports.map((report) => (
                      <TableRow
                        key={report.id}
                        className={cn(
                          report.delayTime > 0 && "bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/30"
                        )}
                      >
                        <TableCell className="font-medium">{report.id}</TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="font-medium truncate">{report.title}</div>
                          </div>
                        </TableCell>
                        <TableCell>{report.customer}</TableCell>
                        <TableCell>{report.assignedTo}</TableCell>
                        <TableCell>
                          <StatusBadge status={report.status} />
                        </TableCell>
                        <TableCell>{report.createdDate}</TableCell>
                        <TableCell>{report.expectedDate}</TableCell>
                        <TableCell>{formatTime(report.expectedMinutes)}</TableCell>
                        <TableCell className="font-medium">{formatTime(report.developerTime)}</TableCell>
                        <TableCell className="text-muted-foreground">{formatTime(report.developerPauseTime)}</TableCell>
                        <TableCell>{report.supportTime > 0 ? formatTime(report.supportTime) : '-'}</TableCell>
                        <TableCell>{report.testerTime > 0 ? formatTime(report.testerTime) : '-'}</TableCell>
                        <TableCell>
                          {report.delayTime > 0 ? (
                            <Badge variant="destructive">{formatTime(report.delayTime)}</Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="font-bold">
                          {formatTime(report.developerTime + report.supportTime + report.testerTime)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Card View */}
          {viewMode === 'card' && (
            <div className="p-3 sm:p-4 space-y-2">
              {filteredReports.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-muted-foreground">
                  No reports found
                </div>
              ) : (
                filteredReports.map((report) => (
                  <Card
                    key={report.id}
                    className={cn(
                      "hover:shadow-md transition-shadow",
                      report.delayTime > 0 && "bg-red-50 dark:bg-red-950/20 border-red-200"
                    )}
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox className="mt-0.5" />
                        <div className="flex-1 min-w-0 space-y-2">
                          {/* Header with ID, Badges, and Actions Menu */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-sm font-semibold text-foreground">{report.id}</h3>
                              <StatusBadge status={report.status} />
                              {report.delayTime > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  Delayed: {formatTime(report.delayTime)}
                                </Badge>
                              )}
                            </div>

                            {/* 3-dot menu in top corner */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="Actions">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* Title */}
                          <p className="text-sm text-muted-foreground line-clamp-2">{report.title}</p>

                          {/* Compact Info Grid - 2 columns */}
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                            <div className="flex items-center gap-1.5">
                              <span className="text-muted-foreground">Customer:</span>
                              <span className="font-medium truncate">{report.customer}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-muted-foreground">Developer:</span>
                              <span className="font-medium truncate">{report.assignedTo}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-muted-foreground">Created:</span>
                              <span className="font-medium">{report.createdDate}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-muted-foreground">Expected:</span>
                              <span className="font-medium">{report.expectedDate}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-muted-foreground">Dev Time:</span>
                              <span className="font-medium">{formatTime(report.developerTime)}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-muted-foreground">Total Time:</span>
                              <span className="font-bold">{formatTime(report.developerTime + report.supportTime + report.testerTime)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
          </div>
        </Card>

        {/* Developer Summary Stats */}
        <Card>
          <CardHeader>
            <Accordion type="single" collapsible>
              <AccordionItem value="stats" className="border-none">
                <AccordionTrigger className="hover:no-underline">
                  <h2 className="text-lg font-semibold text-foreground">Developer Summary Statistics</h2>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Developer</TableHead>
                          <TableHead>Total Tickets</TableHead>
                          <TableHead>Completed</TableHead>
                          <TableHead>Total Time</TableHead>
                          <TableHead>Avg Time/Ticket</TableHead>
                          <TableHead>Completion Rate</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {developerStats.map((stat) => (
                          <TableRow key={stat.developer}>
                            <TableCell className="font-medium">{stat.developer}</TableCell>
                            <TableCell>{stat.totalTickets}</TableCell>
                            <TableCell>{stat.completedTickets}</TableCell>
                            <TableCell>{formatTime(stat.totalTime)}</TableCell>
                            <TableCell>{formatTime(stat.avgTime)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="secondary"
                                  className={cn(
                                    stat.completionRate >= 80 && "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
                                    stat.completionRate >= 50 && stat.completionRate < 80 && "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
                                    stat.completionRate < 50 && "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
                                  )}
                                >
                                  {stat.completionRate}%
                                </Badge>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardHeader>
        </Card>
      </div>
    </DashboardLayout>
  );
}