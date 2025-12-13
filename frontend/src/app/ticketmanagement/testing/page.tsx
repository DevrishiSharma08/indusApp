'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/PageHeader';
import FilterExportBar from '@/components/FilterExportBar';
import StatusBadge from '@/components/StatusBadge';
import TimeTracker from '@/components/TimeTracker';
import FileUploader from '@/components/FileUploader';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Volume2, Eye, CheckCircle, XCircle, MoreVertical } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TestingTicket {
  id: string;
  title: string;
  customer: string;
  assignedDeveloper: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'PendingQC' | 'In-Testing';
  description: string;
  sentToQCDate: string;
  createdDate: string;
  audioUrl?: string;
  developerNotes?: string;
}

const mockTickets: TestingTicket[] = [
  {
    id: 'TKT-2001',
    title: 'User profile update feature',
    customer: 'Acme Corp',
    assignedDeveloper: 'John Developer',
    priority: 'High',
    status: 'PendingQC',
    description: 'Implemented new feature allowing users to update their profile information including avatar upload.',
    sentToQCDate: '2025-11-06',
    createdDate: '2025-11-02',
    audioUrl: '#',
    developerNotes: 'All validations implemented. Test with different file formats for avatar.'
  },
  {
    id: 'TKT-2002',
    title: 'Invoice generation module',
    customer: 'Tech Solutions',
    assignedDeveloper: 'Mike Smith',
    priority: 'Critical',
    status: 'In-Testing',
    description: 'New invoice generation system with PDF export and email functionality.',
    sentToQCDate: '2025-11-05',
    createdDate: '2025-10-30',
    audioUrl: '#',
    developerNotes: 'PDF generation tested locally. Email templates ready.'
  },
  {
    id: 'TKT-2003',
    title: 'Dark mode implementation',
    customer: 'Global Systems',
    assignedDeveloper: 'Emily Chen',
    priority: 'Medium',
    status: 'PendingQC',
    description: 'Implemented dark mode theme across the entire application with user preference storage.',
    sentToQCDate: '2025-11-05',
    createdDate: '2025-11-01',
    audioUrl: '#',
    developerNotes: 'Theme switcher in header. Check all pages for proper contrast.'
  },
  {
    id: 'TKT-2004',
    title: 'Real-time notifications',
    customer: 'Innovate Ltd',
    assignedDeveloper: 'Robert Jones',
    priority: 'High',
    status: 'PendingQC',
    description: 'WebSocket-based real-time notification system for user alerts and updates.',
    sentToQCDate: '2025-11-04',
    createdDate: '2025-10-28',
    audioUrl: '#',
    developerNotes: 'Test with multiple browser tabs. Check notification persistence.'
  },
  {
    id: 'TKT-2005',
    title: 'Advanced search filters',
    customer: 'NextGen Inc',
    assignedDeveloper: 'Alex Kumar',
    priority: 'Medium',
    status: 'In-Testing',
    description: 'Enhanced search functionality with multiple filters, date ranges, and saved searches.',
    sentToQCDate: '2025-11-04',
    createdDate: '2025-10-25',
    audioUrl: '#',
    developerNotes: 'All filter combinations tested. Check performance with large datasets.'
  },
  {
    id: 'TKT-2006',
    title: 'Two-factor authentication',
    customer: 'CloudBase',
    assignedDeveloper: 'Sarah Developer',
    priority: 'Critical',
    status: 'PendingQC',
    description: 'Implemented 2FA using TOTP (Time-based One-Time Password) with QR code generation.',
    sentToQCDate: '2025-11-03',
    createdDate: '2025-10-20',
    audioUrl: '#',
    developerNotes: 'Test with Google Authenticator and Microsoft Authenticator apps.'
  },
  {
    id: 'TKT-2007',
    title: 'Bulk data import',
    customer: 'DataFlow Systems',
    assignedDeveloper: 'John Developer',
    priority: 'High',
    status: 'PendingQC',
    description: 'CSV and Excel file import with validation, error reporting, and progress tracking.',
    sentToQCDate: '2025-11-03',
    createdDate: '2025-10-22',
    audioUrl: '#',
    developerNotes: 'Test with files up to 10MB. Check error handling for invalid data.'
  },
  {
    id: 'TKT-2008',
    title: 'API rate limiting',
    customer: 'SearchPro',
    assignedDeveloper: 'Mike Smith',
    priority: 'Medium',
    status: 'In-Testing',
    description: 'Implemented rate limiting on all API endpoints to prevent abuse and ensure fair usage.',
    sentToQCDate: '2025-11-02',
    createdDate: '2025-10-18',
    audioUrl: '#',
    developerNotes: 'Limits set per user role. Test rate limit headers in response.'
  },
  {
    id: 'TKT-2009',
    title: 'Mobile responsive dashboard',
    customer: 'Acme Corp',
    assignedDeveloper: 'Emily Chen',
    priority: 'High',
    status: 'PendingQC',
    description: 'Fully responsive dashboard design optimized for mobile devices with touch gestures.',
    sentToQCDate: '2025-11-02',
    createdDate: '2025-10-15',
    audioUrl: '#',
    developerNotes: 'Test on iOS and Android devices. Check landscape orientation.'
  },
  {
    id: 'TKT-2010',
    title: 'Activity audit log',
    customer: 'Tech Solutions',
    assignedDeveloper: 'Robert Jones',
    priority: 'Medium',
    status: 'PendingQC',
    description: 'Comprehensive activity logging system tracking all user actions with timestamp and IP address.',
    sentToQCDate: '2025-11-01',
    createdDate: '2025-10-12',
    audioUrl: '#',
    developerNotes: 'Logs stored securely. Test export functionality.'
  }
];

const getPriorityVariant = (priority: string): 'destructive' | 'default' | 'secondary' | 'outline' => {
  switch (priority) {
    case 'Critical':
      return 'destructive';
    case 'High':
      return 'destructive';
    case 'Medium':
      return 'default';
    case 'Low':
      return 'secondary';
    default:
      return 'outline';
  }
};

export default function TestingWorkflow() {
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<TestingTicket | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Filter config
  const filterConfig = [
    {
      key: 'status',
      label: 'Status',
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: 'all', label: 'All Statuses' },
        { value: 'PendingQC', label: 'Pending QC' },
        { value: 'In-Testing', label: 'In Testing' },
      ],
    },
    {
      key: 'priority',
      label: 'Priority',
      value: priorityFilter,
      onChange: setPriorityFilter,
      options: [
        { value: 'all', label: 'All Priorities' },
        { value: 'Critical', label: 'Critical' },
        { value: 'High', label: 'High' },
        { value: 'Medium', label: 'Medium' },
        { value: 'Low', label: 'Low' },
      ],
    },
  ];

  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch =
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.assignedDeveloper.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleStartTesting = (ticket: TestingTicket) => {
    setSelectedTicket(ticket);
    setRemarks('');
    setIsDialogOpen(true);
  };

  const handlePass = () => {
    console.log('Test Passed:', selectedTicket?.id, remarks);
    setIsDialogOpen(false);
    setSelectedTicket(null);
  };

  const handleFail = () => {
    console.log('Test Failed:', selectedTicket?.id, remarks);
    setIsDialogOpen(false);
    setSelectedTicket(null);
  };

  const playAudio = (audioUrl: string) => {
    console.log('Playing audio:', audioUrl);
    // Implement audio playback logic
  };

  const getStatusBadgeText = (status: string) => {
    if (status === 'PendingQC') return 'Pending';
    if (status === 'In-Testing') return 'In Testing';
    return status;
  };

  return (
    <DashboardLayout>
      <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">
        <PageHeader
          title="Testing/QC Workflow"
        />

        {/* Ticket List with Integrated Controls */}
        <div className="bg-card rounded-lg sm:rounded-xl shadow-sm border border-border">
          {/* Search, Filter, Export, and View Toggle Row */}
          <div className="p-3 sm:p-4 border-b border-border">
            <FilterExportBar
              filters={filterConfig}
              onExport={(format) => console.log('Export as:', format)}
              showViewToggle={true}
              viewToggleProps={{
                currentView: viewMode,
                onViewChange: setViewMode
              }}
              showSearch={true}
              searchProps={{
                placeholder: "Search tickets by ID, title, customer, or developer...",
                value: searchQuery,
                onChange: setSearchQuery
              }}
            />
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
                      <TableHead>Developer</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sent to QC</TableHead>
                      <TableHead>Audio</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          No tickets found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell className="font-medium">{ticket.id}</TableCell>
                          <TableCell>
                            <div className="max-w-xs">
                              <div className="font-medium truncate">{ticket.title}</div>
                            </div>
                          </TableCell>
                          <TableCell>{ticket.customer}</TableCell>
                          <TableCell>{ticket.assignedDeveloper}</TableCell>
                          <TableCell>
                            <Badge variant={getPriorityVariant(ticket.priority)} className="text-xs">
                              {ticket.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={getStatusBadgeText(ticket.status)} />
                          </TableCell>
                          <TableCell>{ticket.sentToQCDate}</TableCell>
                          <TableCell>
                            {ticket.audioUrl ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => playAudio(ticket.audioUrl!)}
                                title="Play Audio"
                              >
                                <Volume2 className="h-4 w-4 text-primary" />
                              </Button>
                            ) : (
                              <span className="text-muted-foreground text-xs">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStartTesting(ticket)}
                              title="Start Testing"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
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
                {filteredTickets.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-muted-foreground">
                    No tickets found
                  </div>
                ) : (
                  filteredTickets.map((ticket) => (
                    <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox className="mt-0.5" />
                          <div className="flex-1 min-w-0 space-y-2">
                            {/* Header with ID, Badges, and Actions Menu */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-sm font-semibold text-foreground">{ticket.id}</h3>
                                <Badge variant={getPriorityVariant(ticket.priority)} className="text-xs">
                                  {ticket.priority}
                                </Badge>
                                <StatusBadge status={getStatusBadgeText(ticket.status)} />
                              </div>

                              {/* 3-dot menu in top corner */}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="Actions">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleStartTesting(ticket)}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    {ticket.status === 'In-Testing' ? 'View Details' : 'Start Testing'}
                                  </DropdownMenuItem>
                                  {ticket.audioUrl && (
                                    <DropdownMenuItem onClick={() => playAudio(ticket.audioUrl!)}>
                                      <Volume2 className="w-4 h-4 mr-2" />
                                      Play Audio
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            {/* Title */}
                            <p className="text-sm text-muted-foreground line-clamp-2">{ticket.title}</p>

                            {/* Compact Info Grid - 2 columns */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                              <div className="flex items-center gap-1.5">
                                <span className="text-muted-foreground">Customer:</span>
                                <span className="font-medium truncate">{ticket.customer}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-muted-foreground">Developer:</span>
                                <span className="font-medium truncate">{ticket.assignedDeveloper}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-muted-foreground">Sent to QC:</span>
                                <span className="font-medium">{ticket.sentToQCDate}</span>
                              </div>
                              {ticket.audioUrl && (
                                <div className="flex items-center gap-1.5">
                                  <Volume2 className="w-3 h-3 text-primary" />
                                  <span className="font-medium">Audio</span>
                                </div>
                              )}
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
        </div>

        {/* Testing Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden w-[96vw] sm:w-full p-0 gap-0">
            <DialogHeader className="px-3 sm:px-4 pt-3 sm:pt-4 pb-2 border-b">
              <DialogTitle className="text-sm sm:text-base">Testing Center - {selectedTicket?.id}</DialogTitle>
            </DialogHeader>

            {selectedTicket && (
              <div className="overflow-y-auto max-h-[calc(90vh-8rem)] px-3 sm:px-4 py-3 space-y-3">
                {/* Ticket Information */}
                <div className="bg-muted/30 rounded-md p-2.5">
                  <h3 className="text-xs font-bold text-foreground uppercase mb-2 pb-1.5 border-b border-border/50">Ticket Details</h3>
                  <div className="space-y-1.5">
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                      <div>
                        <span className="text-muted-foreground text-[11px]">Status</span>
                        <StatusBadge status={getStatusBadgeText(selectedTicket.status)} />
                      </div>
                      <div>
                        <span className="text-muted-foreground text-[11px]">Priority</span>
                        <Badge variant={getPriorityVariant(selectedTicket.priority)} className="text-[10px] h-4 mt-0.5">
                          {selectedTicket.priority}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-[11px]">Customer</span>
                        <p className="font-medium text-sm truncate">{selectedTicket.customer}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-[11px]">Developer</span>
                        <p className="font-medium text-sm truncate">{selectedTicket.assignedDeveloper}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-[11px]">Created Date</span>
                        <p className="font-medium text-sm">{selectedTicket.createdDate}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-[11px]">Sent to QC</span>
                        <p className="font-medium text-sm">{selectedTicket.sentToQCDate}</p>
                      </div>
                    </div>
                    <div className="pt-1.5">
                      <span className="text-muted-foreground text-[11px]">Title</span>
                      <p className="font-medium text-sm mt-0.5">{selectedTicket.title}</p>
                    </div>
                    <div className="pt-1.5">
                      <span className="text-muted-foreground text-[11px]">Description</span>
                      <p className="text-sm mt-0.5">{selectedTicket.description}</p>
                    </div>
                    {selectedTicket.developerNotes && (
                      <div className="pt-1.5">
                        <span className="text-muted-foreground text-[11px]">Developer Notes</span>
                        <p className="text-sm mt-0.5 italic">{selectedTicket.developerNotes}</p>
                      </div>
                    )}
                    {selectedTicket.audioUrl && (
                      <div className="pt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => playAudio(selectedTicket.audioUrl!)}
                          className="h-7 text-[10px]"
                        >
                          <Volume2 className="w-3 h-3 mr-1" />
                          Play Audio
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Time Tracking */}
                <div className="bg-muted/30 rounded-md p-2.5">
                  <h3 className="text-xs font-bold text-foreground uppercase mb-2 pb-1.5 border-b border-border/50">Testing Time Tracking</h3>
                  <TimeTracker ticketId={selectedTicket.id} />
                </div>

                {/* Testing Remarks */}
                <div className="bg-muted/30 rounded-md p-2.5">
                  <Label htmlFor="remarks" className="text-xs font-bold text-foreground uppercase block mb-2 pb-1.5 border-b border-border/50">
                    Testing Remarks
                  </Label>
                  <Textarea
                    id="remarks"
                    rows={2}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter test results, issues found, edge cases tested, or reasons for failure..."
                    className="resize-none text-sm min-h-[60px]"
                  />
                </div>

                {/* Attachments */}
                <div className="bg-muted/30 rounded-md p-2.5">
                  <h3 className="text-xs font-bold text-foreground uppercase mb-2 pb-1.5 border-b border-border/50">Attachments</h3>
                  <FileUploader />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <DialogFooter className="gap-2 px-3 sm:px-4 py-2.5 border-t bg-muted/20">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1 sm:flex-none h-8 text-xs"
                size="sm"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleFail}
                className="flex-1 sm:flex-none h-8 text-xs"
                size="sm"
              >
                <XCircle className="w-3 h-3 mr-1.5" />
                Fail - Reopen
              </Button>
              <Button
                onClick={handlePass}
                variant="default"
                className="flex-1 sm:flex-none h-8 text-xs"
                size="sm"
              >
                <CheckCircle className="w-3 h-3 mr-1.5" />
                Pass - Complete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}