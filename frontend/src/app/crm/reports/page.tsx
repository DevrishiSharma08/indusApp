'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, FileSpreadsheet, Loader2, Calendar as CalendarIcon, BarChart2, ArrowLeft } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { mockTeamMembers } from '@/lib/assets-mock-data';

import { KpiCardGrid } from '@/components/reports/kpi-card-grid';
import { ReportCharts } from '@/components/reports/report-charts';
import { ReportDetailModal } from '@/components/reports/report-detail-modal';
import { ReportFilters } from '@/components/reports/report-filters';

// Mock data
const mockUsers = mockTeamMembers.map(m => ({ id: m.id.toString(), name: m.fullName }));

const mockReportData = {
  kpi_summary: {
    new_leads_assigned: 25,
    meetings_completed: 12,
    demos_completed: 8,
    activities_logged: 45,
    tasks_completed: 32,
    deals_won: 3,
    conversion_rate: 12
  },
  detailed_data: {
    leads: [
      { company_name: 'ABC Corp', contact_name: 'John Doe', assigned_date: '2024-12-01' },
      { company_name: 'XYZ Ltd', contact_name: 'Jane Smith', assigned_date: '2024-12-03' },
      { company_name: 'Tech Solutions', contact_name: 'Bob Wilson', assigned_date: '2024-12-05' }
    ],
    meetings: [
      { company_name: 'ABC Corp', date: '2024-12-02', status: 'Completed' },
      { company_name: 'XYZ Ltd', date: '2024-12-04', status: 'Completed' }
    ],
    demos: [
      { company_name: 'ABC Corp', date: '2024-12-03', status: 'Completed' },
      { company_name: 'Tech Solutions', date: '2024-12-06', status: 'Completed' }
    ],
    activities: [
      { activity_type: 'Call', company_name: 'ABC Corp', date: '2024-12-01' },
      { activity_type: 'Email', company_name: 'XYZ Ltd', date: '2024-12-02' },
      { activity_type: 'Meeting', company_name: 'Tech Solutions', date: '2024-12-03' }
    ],
    tasks: [
      { title: 'Follow up with ABC Corp', status: 'Completed', completed_date: '2024-12-02' },
      { title: 'Send proposal to XYZ', status: 'Completed', completed_date: '2024-12-04' }
    ]
  },
  charts: {
    activity_breakdown: [
      { name: 'Calls', value: 15 },
      { name: 'Emails', value: 20 },
      { name: 'Meetings', value: 12 },
      { name: 'Demos', value: 8 }
    ],
    lead_sources: [
      { name: 'Website', value: 10 },
      { name: 'Referral', value: 8 },
      { name: 'Cold Call', value: 5 },
      { name: 'Social Media', value: 2 }
    ],
    trend_data: [
      { date: 'Week 1', leads: 5, meetings: 2 },
      { date: 'Week 2', leads: 8, meetings: 4 },
      { date: 'Week 3', leads: 7, meetings: 3 },
      { date: 'Week 4', leads: 5, meetings: 3 }
    ]
  },
  deals_won: [
    { company_name: 'ABC Corporation', source: 'Website', converted_date: '2024-12-05', time_to_close: 45 },
    { company_name: 'XYZ Ltd', source: 'Referral', converted_date: '2024-12-02', time_to_close: 30 },
    { company_name: 'Tech Solutions Inc', source: 'Cold Call', converted_date: '2024-11-28', time_to_close: 60 }
  ]
};

export default function ReportsPage() {
  const router = useRouter();
  const [selectedUserId, setSelectedUserId] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [reportData, setReportData] = useState<typeof mockReportData | null>(null);
  const [loading, setLoading] = useState(false);

  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; data: any[] | null; dataType: string }>({
    title: '',
    data: null,
    dataType: ''
  });

  const [isPdfExporting, setIsPdfExporting] = useState(false);
  const [isExcelExporting, setIsExcelExporting] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportDateRange, setExportDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  });

  const canGenerate = selectedUserId && dateRange?.from && dateRange?.to;

  const handleGenerateReport = () => {
    if (!canGenerate) {
      toast.error('Please select a user and date range');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setReportData(mockReportData);
      setLoading(false);
      toast.success('Report generated successfully');
    }, 1000);
  };

  const handleKpiCardClick = (title: string, dataType: string) => {
    const dataMap: Record<string, any[]> = {
      leads: mockReportData.detailed_data.leads,
      meetings: mockReportData.detailed_data.meetings,
      demos: mockReportData.detailed_data.demos,
      activities: mockReportData.detailed_data.activities,
      tasks: mockReportData.detailed_data.tasks,
      deals: mockReportData.deals_won
    };

    const data = dataMap[dataType];
    if (!data || data.length === 0) {
      toast.info(`No data available for ${title}`);
      return;
    }

    setModalContent({ title, data, dataType });
    setDetailModalOpen(true);
  };

  const handleExportToPDF = () => {
    if (!reportData) {
      toast.error('Please generate a report first');
      return;
    }
    setIsPdfExporting(true);
    toast.info('PDF export will be implemented with jsPDF');
    setTimeout(() => {
      setIsPdfExporting(false);
      toast.success('PDF exported successfully');
    }, 1500);
  };

  const handleExportSummary = () => {
    if (!exportDateRange?.from || !exportDateRange?.to) {
      toast.error('Please select a valid date range');
      return;
    }
    setIsExcelExporting(true);
    toast.info('Excel export will be implemented with XLSX');
    setTimeout(() => {
      setIsExcelExporting(false);
      setIsExportModalOpen(false);
      toast.success('Excel summary exported successfully');
    }, 1500);
  };

  return (
    <div className="space-y-2 lg:space-y-3 py-3 lg:py-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">User Performance</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleExportToPDF}
            disabled={!reportData || isPdfExporting}
            variant="outline"
            size="sm"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline sm:ml-2">PDF</span>
          </Button>
          <Button
            onClick={() => setIsExportModalOpen(true)}
            disabled={isExcelExporting}
            size="sm"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span className="hidden sm:inline sm:ml-2">Excel</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-3">
          <ReportFilters
            users={mockUsers}
            selectedUserId={selectedUserId}
            onUserChange={setSelectedUserId}
            dateRange={dateRange}
            onDateChange={setDateRange}
          />
          <div className="mt-3">
            <Button onClick={handleGenerateReport} disabled={!canGenerate || loading} className="w-full">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <BarChart2 className="w-4 h-4 mr-2" />}
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="text-center p-6 flex flex-col items-center justify-center">
          <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin" />
        </div>
      )}

      {/* Empty State */}
      {!canGenerate && !loading && !reportData && (
        <Card className="text-center p-6 sm:p-8 border-dashed">
          <BarChart2 className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground mx-auto" />
        </Card>
      )}

      {/* Report Content */}
      {reportData && !loading && (
        <div className="space-y-3">
          <KpiCardGrid kpiData={reportData.kpi_summary} onCardClick={handleKpiCardClick} />

          <ReportCharts
            activityData={reportData.charts.activity_breakdown}
            trendData={reportData.charts.trend_data}
            sourceData={reportData.charts.lead_sources}
          />

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Deals Won Details</CardTitle>
              <CardDescription className="text-xs">Leads converted to clients in this period</CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-6 sm:pt-0">
              {/* Desktop Table */}
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Company</TableHead>
                      <TableHead className="text-xs">Source</TableHead>
                      <TableHead className="text-xs">Date</TableHead>
                      <TableHead className="text-right text-xs">Days</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.deals_won.length > 0 ? (
                      reportData.deals_won.map((deal, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium text-sm py-2">{deal.company_name}</TableCell>
                          <TableCell className="text-sm py-2">{deal.source}</TableCell>
                          <TableCell className="text-sm py-2">{deal.converted_date}</TableCell>
                          <TableCell className="text-right text-sm py-2">{deal.time_to_close}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-16 text-center text-sm">
                          No deals
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="sm:hidden space-y-1.5">
                {reportData.deals_won.length > 0 ? (
                  reportData.deals_won.map((deal, index) => (
                    <div key={index} className="border rounded p-2 space-y-1 bg-card">
                      <div className="font-medium text-xs truncate">{deal.company_name}</div>
                      <div className="grid grid-cols-2 gap-1.5 text-xs">
                        <div>
                          <span className="text-muted-foreground text-[10px]">Source:</span>
                          <p className="font-medium truncate">{deal.source}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-[10px]">Days:</span>
                          <p className="font-medium truncate">{deal.time_to_close}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-xs text-muted-foreground">
                    No deals
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detail Modal */}
      <ReportDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title={modalContent.title}
        data={modalContent.data}
        dataType={modalContent.dataType}
      />

      {/* Export Modal */}
      <Dialog open={isExportModalOpen} onOpenChange={setIsExportModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Summary Report</DialogTitle>
            <DialogDescription>Select a date range for the user performance summary export.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {exportDateRange?.from ? (
                    exportDateRange.to ? (
                      `${format(exportDateRange.from, 'LLL dd, y')} - ${format(exportDateRange.to, 'LLL dd, y')}`
                    ) : (
                      format(exportDateRange.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={exportDateRange}
                  onSelect={setExportDateRange}
                  initialFocus
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
          <DialogFooter>
            <Button onClick={handleExportSummary} disabled={isExcelExporting || !exportDateRange?.from}>
              {isExcelExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              Export to Excel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
