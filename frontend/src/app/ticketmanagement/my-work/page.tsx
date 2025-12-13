'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Pause, CheckCircle, RotateCcw, Eye, MoreVertical, Plus, Volume2, Send } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/PageHeader';
import FilterExportBar from '@/components/FilterExportBar';
import ColumnToggle, { ColumnConfig } from '@/components/ColumnToggle';
import BulkActions, { BulkAction } from '@/components/BulkActions';
import TimeTracker from '@/components/TimeTracker';
import FileUploader from '@/components/FileUploader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

// Types
interface Ticket {
  id: string;
  title: string;
  customer: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Assigned' | 'In Progress' | 'Paused' | 'DevCompleted';
  expectedDate: string;
  hasAudio: boolean;
  startDate: string | null;
  totalTime: number; // in minutes
  pauseTime: number; // in minutes
  isOverdue?: boolean;
  description?: string;
  audioUrl?: string;
  developerNotes?: string;
  createdDate?: string;
  assignedDate?: string;
  product?: string;
  module?: string;
}

// Mock Data
const mockTickets: Ticket[] = [
  {
    id: 'TKT-001',
    title: 'Fix login authentication bug',
    customer: 'Acme Corp',
    priority: 'High',
    status: 'Assigned',
    expectedDate: '2025-11-08',
    hasAudio: true,
    startDate: null,
    totalTime: 0,
    pauseTime: 0,
    isOverdue: false,
    description: 'Users are unable to login with correct credentials. Need to debug authentication flow and fix the issue.',
    audioUrl: '#',
    createdDate: '2025-11-01',
    assignedDate: '2025-11-02',
    product: 'ERP System',
    module: 'Authentication',
  },
  {
    id: 'TKT-002',
    title: 'Implement dark mode toggle',
    customer: 'TechStart Inc',
    priority: 'Medium',
    status: 'In Progress',
    expectedDate: '2025-11-10',
    hasAudio: true,
    startDate: '2025-11-06',
    totalTime: 240,
    pauseTime: 0,
    isOverdue: false,
  },
  {
    id: 'TKT-003',
    title: 'Update database schema for users',
    customer: 'Global Solutions',
    priority: 'High',
    status: 'In Progress',
    expectedDate: '2025-11-05',
    hasAudio: false,
    startDate: '2025-11-04',
    totalTime: 480,
    pauseTime: 60,
    isOverdue: true,
  },
  {
    id: 'TKT-004',
    title: 'Create API documentation',
    customer: 'Acme Corp',
    priority: 'Low',
    status: 'Paused',
    expectedDate: '2025-11-12',
    hasAudio: true,
    startDate: '2025-11-02',
    totalTime: 120,
    pauseTime: 120,
    isOverdue: false,
  },
  {
    id: 'TKT-005',
    title: 'Fix responsive design issues',
    customer: 'TechStart Inc',
    priority: 'Medium',
    status: 'Assigned',
    expectedDate: '2025-11-09',
    hasAudio: false,
    startDate: null,
    totalTime: 0,
    pauseTime: 0,
    isOverdue: false,
  },
  {
    id: 'TKT-006',
    title: 'Implement payment gateway integration',
    customer: 'Global Solutions',
    priority: 'High',
    status: 'In Progress',
    expectedDate: '2025-11-15',
    hasAudio: true,
    startDate: '2025-11-03',
    totalTime: 360,
    pauseTime: 0,
    isOverdue: false,
  },
  {
    id: 'TKT-007',
    title: 'Write unit tests for auth module',
    customer: 'CloudFirst',
    priority: 'Medium',
    status: 'Assigned',
    expectedDate: '2025-11-11',
    hasAudio: false,
    startDate: null,
    totalTime: 0,
    pauseTime: 0,
    isOverdue: false,
  },
  {
    id: 'TKT-008',
    title: 'Optimize database queries',
    customer: 'Acme Corp',
    priority: 'Low',
    status: 'DevCompleted',
    expectedDate: '2025-11-07',
    hasAudio: false,
    startDate: '2025-11-01',
    totalTime: 180,
    pauseTime: 0,
    isOverdue: false,
    product: 'CRM System',
    module: 'Database',
    description: 'Optimize slow running queries in the reports module to improve performance.',
  },
];

// Utility Functions
const getPriorityVariant = (priority: string): 'destructive' | 'default' | 'secondary' => {
  switch (priority) {
    case 'High':
      return 'destructive';
    case 'Medium':
      return 'default';
    case 'Low':
      return 'secondary';
    default:
      return 'default';
  }
};

const getStatusVariant = (status: string): 'destructive' | 'default' | 'secondary' | 'outline' => {
  switch (status) {
    case 'Assigned':
      return 'outline';
    case 'In Progress':
      return 'default';
    case 'Paused':
      return 'secondary';
    case 'DevCompleted':
      return 'secondary';
    default:
      return 'outline';
  }
};

const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

export default function MyWorkPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [remarks, setRemarks] = useState('');

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: 'checkbox', label: 'Select', visible: true },
    { key: 'id', label: 'Ticket ID', visible: true },
    { key: 'title', label: 'Title', visible: true },
    { key: 'customer', label: 'Customer', visible: true },
    { key: 'priority', label: 'Priority', visible: true },
    { key: 'status', label: 'Status', visible: true },
    { key: 'expectedDate', label: 'Expected Date', visible: true },
    { key: 'totalTime', label: 'Time Spent', visible: true },
    { key: 'audio', label: 'Audio', visible: true },
    { key: 'actions', label: 'Actions', visible: true },
  ]);

  // Filter config
  const filterConfig = [
    {
      key: 'status',
      label: 'Status',
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: 'all', label: 'All Statuses' },
        { value: 'Assigned', label: 'Assigned' },
        { value: 'In Progress', label: 'In Progress' },
        { value: 'Paused', label: 'Paused' },
        { value: 'DevCompleted', label: 'Dev Completed' },
      ],
    },
    {
      key: 'priority',
      label: 'Priority',
      value: priorityFilter,
      onChange: setPriorityFilter,
      options: [
        { value: 'all', label: 'All Priorities' },
        { value: 'High', label: 'High' },
        { value: 'Medium', label: 'Medium' },
        { value: 'Low', label: 'Low' },
      ],
    },
  ];

  // Bulk actions
  const bulkActions: BulkAction[] = [
    { value: 'export', label: 'Export Selected' },
    { value: 'complete', label: 'Mark as Completed' },
    { value: 'delete', label: 'Delete Selected', variant: 'destructive' },
  ];

  // Filter tickets
  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesSearch =
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Sort tickets to show DevCompleted first (highlighted at top)
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    if (a.status === 'DevCompleted' && b.status !== 'DevCompleted') return -1;
    if (a.status !== 'DevCompleted' && b.status === 'DevCompleted') return 1;
    return 0;
  });

  // Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredTickets.map(t => t.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(tid => tid !== id));
    }
  };

  const handleBulkAction = (action: string) => {
    console.log('Bulk action:', action, 'for IDs:', selectedIds);
    setSelectedIds([]);
  };

  const handleViewDetails = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setRemarks('');
    setIsDialogOpen(true);
  };

  const handleView = (id: string) => {
    console.log('View ticket:', id);
    router.push(`/ticketmanagement/tickets/${id}`);
  };

  const handleStartTicket = (id: string) => {
    console.log('Start ticket:', id);
    // TODO: Implement start ticket
  };

  const handlePauseTicket = (id: string) => {
    console.log('Pause ticket:', id);
    // TODO: Implement pause ticket
  };

  const handleResumeTicket = (id: string) => {
    console.log('Resume ticket:', id);
    // TODO: Implement resume ticket
  };

  const handleCompleteTicket = (id: string) => {
    console.log('Complete ticket:', id);
    // TODO: Implement complete ticket
  };

  const handlePlayAudio = (id: string) => {
    console.log('Play audio for ticket:', id);
    // TODO: Implement audio playback
  };

  const getVisibleColumns = () => columns.filter(col => col.visible);

  // Action buttons based on status
  const getActionButton = (ticket: Ticket) => {
    switch (ticket.status) {
      case 'Assigned':
        return (
          <Button
            size="sm"
            variant="default"
            onClick={() => handleStartTicket(ticket.id)}
            className="bg-primary hover:bg-primary/90"
          >
            <Play className="w-4 h-4 mr-1" />
            Start
          </Button>
        );
      case 'In Progress':
        return (
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handlePauseTicket(ticket.id)}
            >
              <Pause className="w-4 h-4 mr-1" />
              Pause
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={() => handleCompleteTicket(ticket.id)}
              className="bg-primary hover:bg-primary/90"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Complete
            </Button>
          </div>
        );
      case 'Paused':
        return (
          <Button
            size="sm"
            variant="default"
            onClick={() => handleResumeTicket(ticket.id)}
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Resume
          </Button>
        );
      case 'DevCompleted':
        return (
          <Badge variant="secondary" className="px-3 py-1">
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">
        {/* Page Header */}
        <PageHeader
          title="My Work"
        />

        {/* Ticket List with Integrated Controls */}
        <div className="bg-card rounded-lg sm:rounded-xl shadow-sm border border-border">
          {/* Summary Stats - Compact */}
          <div className="p-2 border-b border-border">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-muted/50">
                <div className="text-lg font-bold text-foreground">
                  {filteredTickets.filter((t) => t.status === 'Assigned').length}
                </div>
                <div className="text-xs text-muted-foreground">Assigned</div>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-muted/50">
                <div className="text-lg font-bold text-foreground">
                  {filteredTickets.filter((t) => t.status === 'In Progress').length}
                </div>
                <div className="text-xs text-muted-foreground">In Progress</div>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-muted/50">
                <div className="text-lg font-bold text-destructive">
                  {filteredTickets.filter((t) => t.isOverdue).length}
                </div>
                <div className="text-xs text-muted-foreground">Overdue</div>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-muted/50">
                <div className="text-sm font-bold text-foreground">
                  {formatTime(filteredTickets.reduce((sum, t) => sum + t.totalTime, 0))}
                </div>
                <div className="text-xs text-muted-foreground">Total Time</div>
              </div>
            </div>
          </div>

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
                placeholder: "Search tickets by ID, title, or customer...",
                value: searchQuery,
                onChange: setSearchQuery
              }}
            />
          </div>

          {/* Bulk Actions */}
          {selectedIds.length > 0 && (
            <div className="px-4 py-3 border-b border-border bg-muted/30">
              <BulkActions
                selectedCount={selectedIds.length}
                totalCount={filteredTickets.length}
                actions={bulkActions}
                onAction={handleBulkAction}
                onClearSelection={() => setSelectedIds([])}
              />
            </div>
          )}

          {/* Data Content */}
          <div className="p-0">
            {/* Table View */}
            {viewMode === 'table' && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {getVisibleColumns().map((column) => {
                        if (column.key === 'checkbox') {
                          return (
                            <TableHead key={column.key} className="w-12">
                              <Checkbox
                                checked={selectedIds.length === filteredTickets.length && filteredTickets.length > 0}
                                onCheckedChange={handleSelectAll}
                              />
                            </TableHead>
                          );
                        }
                        return <TableHead key={column.key}>{column.label}</TableHead>;
                      })}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTickets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={getVisibleColumns().length} className="h-32 text-center text-muted-foreground">
                          No tickets found
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedTickets.map((ticket) => (
                        <TableRow
                          key={ticket.id}
                          className={`
                            ${ticket.isOverdue ? 'bg-destructive/5' : ''}
                            ${ticket.status === 'DevCompleted' ? 'bg-green-50 dark:bg-green-950/20 border-l-4 border-green-600' : ''}
                          `}
                        >
                          {getVisibleColumns().map((column) => {
                            if (column.key === 'checkbox') {
                              return (
                                <TableCell key={column.key}>
                                  <Checkbox
                                    checked={selectedIds.includes(ticket.id)}
                                    onCheckedChange={(checked) => handleSelectOne(ticket.id, checked as boolean)}
                                  />
                                </TableCell>
                              );
                            }
                            if (column.key === 'id') {
                              return (
                                <TableCell key={column.key} className="font-medium">
                                  {ticket.id}
                                </TableCell>
                              );
                            }
                            if (column.key === 'title') {
                              return (
                                <TableCell key={column.key}>
                                  <div className="max-w-xs truncate">{ticket.title}</div>
                                </TableCell>
                              );
                            }
                            if (column.key === 'customer') {
                              return (
                                <TableCell key={column.key} className="text-sm text-muted-foreground">
                                  {ticket.customer}
                                </TableCell>
                              );
                            }
                            if (column.key === 'priority') {
                              return (
                                <TableCell key={column.key}>
                                  <Badge variant={getPriorityVariant(ticket.priority)} className="text-xs">
                                    {ticket.priority}
                                  </Badge>
                                </TableCell>
                              );
                            }
                            if (column.key === 'status') {
                              return (
                                <TableCell key={column.key}>
                                  <Badge variant={getStatusVariant(ticket.status)} className="text-xs">
                                    {ticket.status}
                                  </Badge>
                                </TableCell>
                              );
                            }
                            if (column.key === 'expectedDate') {
                              return (
                                <TableCell key={column.key} className="text-sm">
                                  {ticket.expectedDate}
                                </TableCell>
                              );
                            }
                            if (column.key === 'totalTime') {
                              return (
                                <TableCell key={column.key} className="text-sm">
                                  {formatTime(ticket.totalTime)}
                                </TableCell>
                              );
                            }
                            if (column.key === 'audio') {
                              return (
                                <TableCell key={column.key}>
                                  {ticket.hasAudio ? (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() => handlePlayAudio(ticket.id)}
                                      title="Play Audio"
                                    >
                                      <Play className="h-4 w-4 text-primary" />
                                    </Button>
                                  ) : (
                                    <span className="text-muted-foreground text-xs">-</span>
                                  )}
                                </TableCell>
                              );
                            }
                            if (column.key === 'actions') {
                              return (
                                <TableCell key={column.key}>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleViewDetails(ticket)}
                                      title="View Details"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                    {ticket.status === 'DevCompleted' && (
                                      <Button
                                        size="sm"
                                        variant="default"
                                        onClick={() => handleCompleteTicket(ticket.id)}
                                        className="bg-green-600 hover:bg-green-700"
                                        title="Send to Support"
                                      >
                                        <Send className="w-4 h-4" />
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                              );
                            }
                            return null;
                          })}
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
                {sortedTickets.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-muted-foreground">
                    No tickets found
                  </div>
                ) : (
                  sortedTickets.map((ticket) => (
                    <Card
                      key={ticket.id}
                      className={`
                        hover:shadow-md transition-shadow
                        ${ticket.isOverdue ? 'border-destructive' : ''}
                        ${ticket.status === 'DevCompleted' ? 'bg-green-50 dark:bg-green-950/20 border-l-4 border-green-600' : ''}
                      `}
                    >
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={selectedIds.includes(ticket.id)}
                            onCheckedChange={(checked) => handleSelectOne(ticket.id, checked as boolean)}
                            className="mt-0.5"
                          />
                          <div className="flex-1 min-w-0 space-y-2">
                            {/* Header with ID, Badges, and Actions Menu */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-sm font-semibold text-foreground">{ticket.id}</h3>
                                <Badge variant={getPriorityVariant(ticket.priority)} className="text-xs">
                                  {ticket.priority}
                                </Badge>
                                <Badge variant={getStatusVariant(ticket.status)} className="text-xs">
                                  {ticket.status}
                                </Badge>
                              </div>

                              {/* 3-dot menu in top corner */}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="Actions">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleViewDetails(ticket)}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  {ticket.hasAudio && (
                                    <DropdownMenuItem onClick={() => handlePlayAudio(ticket.id)}>
                                      <Volume2 className="w-4 h-4 mr-2" />
                                      Play Audio
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuSeparator />
                                  {ticket.status === 'Assigned' && (
                                    <DropdownMenuItem onClick={() => handleStartTicket(ticket.id)}>
                                      <Play className="w-4 h-4 mr-2" />
                                      Start
                                    </DropdownMenuItem>
                                  )}
                                  {ticket.status === 'In Progress' && (
                                    <>
                                      <DropdownMenuItem onClick={() => handlePauseTicket(ticket.id)}>
                                        <Pause className="w-4 h-4 mr-2" />
                                        Pause
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleCompleteTicket(ticket.id)}>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Complete
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  {ticket.status === 'Paused' && (
                                    <DropdownMenuItem onClick={() => handleResumeTicket(ticket.id)}>
                                      <RotateCcw className="w-4 h-4 mr-2" />
                                      Resume
                                    </DropdownMenuItem>
                                  )}
                                  {ticket.status === 'DevCompleted' && (
                                    <DropdownMenuItem onClick={() => handleCompleteTicket(ticket.id)}>
                                      <Send className="w-4 h-4 mr-2" />
                                      Send to Support
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
                                <span className="text-muted-foreground">Due:</span>
                                <span className="font-medium">{ticket.expectedDate}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-muted-foreground">Time:</span>
                                <span className="font-medium">{formatTime(ticket.totalTime)}</span>
                              </div>
                              {ticket.hasAudio && (
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

        {/* Ticket Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden w-[96vw] sm:w-full p-0 gap-0">
            <DialogHeader className="px-3 sm:px-4 pt-3 sm:pt-4 pb-2 border-b">
              <DialogTitle className="text-sm sm:text-base">Ticket Details - {selectedTicket?.id}</DialogTitle>
            </DialogHeader>

            {selectedTicket && (
              <div className="overflow-y-auto max-h-[calc(90vh-8rem)] px-3 sm:px-4 py-3 space-y-3">
                {/* Ticket Information */}
                <div className="bg-muted/30 rounded-md p-2.5">
                  <h3 className="text-xs font-bold text-foreground uppercase mb-2 pb-1.5 border-b border-border/50">Ticket Information</h3>
                  <div className="space-y-1.5">
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                      <div>
                        <span className="text-muted-foreground text-[11px]">Status</span>
                        <Badge variant={getStatusVariant(selectedTicket.status)} className="text-[10px] h-4 mt-0.5">
                          {selectedTicket.status}
                        </Badge>
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
                        <span className="text-muted-foreground text-[11px]">Due Date</span>
                        <p className="font-medium text-sm">{selectedTicket.expectedDate}</p>
                      </div>
                      {selectedTicket.product && (
                        <div>
                          <span className="text-muted-foreground text-[11px]">Product</span>
                          <p className="font-medium text-sm">{selectedTicket.product}</p>
                        </div>
                      )}
                      {selectedTicket.module && (
                        <div>
                          <span className="text-muted-foreground text-[11px]">Module</span>
                          <p className="font-medium text-sm">{selectedTicket.module}</p>
                        </div>
                      )}
                      {selectedTicket.createdDate && (
                        <div>
                          <span className="text-muted-foreground text-[11px]">Created</span>
                          <p className="font-medium text-sm">{selectedTicket.createdDate}</p>
                        </div>
                      )}
                      {selectedTicket.assignedDate && (
                        <div>
                          <span className="text-muted-foreground text-[11px]">Assigned</span>
                          <p className="font-medium text-sm">{selectedTicket.assignedDate}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-muted-foreground text-[11px]">Time Spent</span>
                        <p className="font-medium text-sm">{formatTime(selectedTicket.totalTime)}</p>
                      </div>
                    </div>
                    <div className="pt-1.5">
                      <span className="text-muted-foreground text-[11px]">Title</span>
                      <p className="font-medium text-sm mt-0.5">{selectedTicket.title}</p>
                    </div>
                    {selectedTicket.description && (
                      <div className="pt-1.5">
                        <span className="text-muted-foreground text-[11px]">Description</span>
                        <p className="text-sm mt-0.5">{selectedTicket.description}</p>
                      </div>
                    )}
                    {selectedTicket.audioUrl && (
                      <div className="pt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePlayAudio(selectedTicket.id)}
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
                  <h3 className="text-xs font-bold text-foreground uppercase mb-2 pb-1.5 border-b border-border/50">Time Tracking</h3>
                  <TimeTracker ticketId={selectedTicket.id} />
                </div>

                {/* Work Notes */}
                <div className="bg-muted/30 rounded-md p-2.5">
                  <Label htmlFor="remarks" className="text-xs font-bold text-foreground uppercase block mb-2 pb-1.5 border-b border-border/50">
                    Work Notes / Remarks
                  </Label>
                  <Textarea
                    id="remarks"
                    rows={2}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Add your work notes..."
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
                Close
              </Button>
              <Button
                onClick={() => {
                  if (confirm('Are you sure you want to send this to Support?')) {
                    console.log('Sending to support:', selectedTicket?.id, remarks);
                    toast.success('Ticket sent to Support successfully!');
                    setIsDialogOpen(false);
                    router.push('/ticketmanagement/support');
                  }
                }}
                variant="default"
                className="flex-1 sm:flex-none h-8 text-xs"
                size="sm"
              >
                <Send className="w-3 h-3 mr-1.5" />
                Send to Support
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
