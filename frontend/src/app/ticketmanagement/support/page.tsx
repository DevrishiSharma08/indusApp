'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Eye, Send, Volume2, MoreVertical } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/PageHeader';
import FilterExportBar from '@/components/FilterExportBar';
import BulkActions, { BulkAction } from '@/components/BulkActions';
import TimeTracker from '@/components/TimeTracker';
import FileUploader from '@/components/FileUploader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface SupportTicket {
  id: string;
  title: string;
  customer: string;
  sentBy: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'PendingSupport' | 'SentToDev' | 'Resolved';
  description: string;
  assignedDeveloper: string;
  createdDate: string;
  audioUrl?: string;
}

const mockTickets: SupportTicket[] = [
  {
    id: 'TKT-1001',
    title: 'Login page not loading',
    customer: 'Acme Corp',
    sentBy: 'John Developer',
    priority: 'Critical',
    status: 'PendingSupport',
    description: 'Users are unable to access the login page. The page shows a blank screen after clicking the login button.',
    assignedDeveloper: 'John Developer',
    createdDate: '2025-11-05',
    audioUrl: '#'
  },
  {
    id: 'TKT-1002',
    title: 'Payment gateway timeout',
    customer: 'Tech Solutions',
    sentBy: 'Sarah Tester',
    priority: 'High',
    status: 'PendingSupport',
    description: 'Payment processing is timing out after 30 seconds, causing transaction failures.',
    assignedDeveloper: 'Mike Smith',
    createdDate: '2025-11-05',
    audioUrl: '#'
  },
  {
    id: 'TKT-1003',
    title: 'Dashboard widgets not refreshing',
    customer: 'Global Systems',
    sentBy: 'John Developer',
    priority: 'Medium',
    status: 'SentToDev',
    description: 'Dashboard data is not auto-refreshing as expected. Users need to manually reload the page.',
    assignedDeveloper: 'Emily Chen',
    createdDate: '2025-11-04',
    audioUrl: '#'
  },
  {
    id: 'TKT-1004',
    title: 'Export to PDF broken',
    customer: 'Innovate Ltd',
    sentBy: 'Sarah Tester',
    priority: 'Medium',
    status: 'PendingSupport',
    description: 'The export to PDF feature is generating corrupted files that cannot be opened.',
    assignedDeveloper: 'Robert Jones',
    createdDate: '2025-11-04',
  },
  {
    id: 'TKT-1005',
    title: 'Mobile app crashes on Android 14',
    customer: 'NextGen Inc',
    sentBy: 'John Developer',
    priority: 'High',
    status: 'Resolved',
    description: 'App crashes immediately after launch on Android 14 devices. Works fine on Android 13 and below.',
    assignedDeveloper: 'Alex Kumar',
    createdDate: '2025-11-03',
    audioUrl: '#'
  },
  {
    id: 'TKT-1006',
    title: 'Email notifications delayed',
    customer: 'CloudBase',
    sentBy: 'Sarah Tester',
    priority: 'Low',
    status: 'PendingSupport',
    description: 'Email notifications are being sent with 2-3 hours delay instead of immediately.',
    assignedDeveloper: 'Mike Smith',
    createdDate: '2025-11-03',
    audioUrl: '#'
  },
  {
    id: 'TKT-1007',
    title: 'Database connection pooling issue',
    customer: 'DataFlow Systems',
    sentBy: 'John Developer',
    priority: 'Critical',
    status: 'SentToDev',
    description: 'Application is running out of database connections during peak hours, causing service disruption.',
    assignedDeveloper: 'Emily Chen',
    createdDate: '2025-11-02',
    audioUrl: '#'
  },
  {
    id: 'TKT-1008',
    title: 'Search autocomplete too slow',
    customer: 'SearchPro',
    sentBy: 'Sarah Tester',
    priority: 'Medium',
    status: 'PendingSupport',
    description: 'Autocomplete suggestions take 5+ seconds to appear, significantly affecting user experience.',
    assignedDeveloper: 'Robert Jones',
    createdDate: '2025-11-02',
    audioUrl: '#'
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

const getStatusVariant = (status: string): 'destructive' | 'default' | 'secondary' | 'outline' => {
  switch (status) {
    case 'PendingSupport':
      return 'default';
    case 'SentToDev':
      return 'outline';
    case 'Resolved':
      return 'secondary';
    default:
      return 'outline';
  }
};

export default function SupportPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showReplyDialog, setShowReplyDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [reply, setReply] = useState('');
  const [remarks, setRemarks] = useState('');

  // Filter states
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
        { value: 'PendingSupport', label: 'Pending Support' },
        { value: 'SentToDev', label: 'Sent to Dev' },
        { value: 'Resolved', label: 'Resolved' },
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

  // Bulk actions
  const bulkActions: BulkAction[] = [
    { value: 'export', label: 'Export Selected' },
    { value: 'sendToDev', label: 'Send to Developer' },
    { value: 'resolve', label: 'Mark as Resolved' },
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

  const handleViewDetails = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setRemarks('');
    setShowDetailsDialog(true);
  };

  const handleView = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setShowReplyDialog(true);
  };

  const handleReply = () => {
    console.log('Sending reply:', reply, 'for ticket:', selectedTicket?.id);
    setReply('');
    setShowReplyDialog(false);
  };

  const handleSendToDev = (id: string) => {
    console.log('Send to developer:', id);
  };

  const handlePlayAudio = (id: string) => {
    console.log('Play audio:', id);
  };

  return (
    <DashboardLayout>
      <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">
        {/* Page Header */}
        <PageHeader
          title="Support Tickets"
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
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedIds.length === filteredTickets.length && filteredTickets.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Ticket ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Sent By</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Audio</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="h-32 text-center text-muted-foreground">
                          No tickets found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTickets.map((ticket) => (
                        <TableRow key={ticket.id} className="hover:bg-muted/50">
                          <TableCell>
                            <Checkbox
                              checked={selectedIds.includes(ticket.id)}
                              onCheckedChange={(checked) => handleSelectOne(ticket.id, checked as boolean)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{ticket.id}</TableCell>
                          <TableCell>
                            <div className="max-w-xs truncate">{ticket.title}</div>
                          </TableCell>
                          <TableCell className="text-sm">{ticket.customer}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{ticket.sentBy}</TableCell>
                          <TableCell>
                            <Badge variant={getPriorityVariant(ticket.priority)} className="text-xs">
                              {ticket.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(ticket.status)} className="text-xs">
                              {ticket.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{ticket.createdDate}</TableCell>
                          <TableCell>
                            {ticket.audioUrl ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handlePlayAudio(ticket.id)}
                                title="Play Audio"
                              >
                                <Volume2 className="h-4 w-4 text-primary" />
                              </Button>
                            ) : (
                              <span className="text-muted-foreground text-xs">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetails(ticket)}
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              {ticket.status === 'PendingSupport' && (
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => handleSendToDev(ticket.id)}
                                  title="Send to Developer"
                                >
                                  <Send className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
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
                                  {ticket.audioUrl && (
                                    <DropdownMenuItem onClick={() => handlePlayAudio(ticket.id)}>
                                      <Volume2 className="w-4 h-4 mr-2" />
                                      Play Audio
                                    </DropdownMenuItem>
                                  )}
                                  {ticket.status === 'PendingSupport' && (
                                    <>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem onClick={() => handleSendToDev(ticket.id)}>
                                        <Send className="w-4 h-4 mr-2" />
                                        Send to Developer
                                      </DropdownMenuItem>
                                    </>
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
                                <span className="text-muted-foreground">Sent By:</span>
                                <span className="font-medium truncate">{ticket.sentBy}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-muted-foreground">Created:</span>
                                <span className="font-medium">{ticket.createdDate}</span>
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

        {/* Ticket Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
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
                        <span className="text-muted-foreground text-[11px]">Sent By</span>
                        <p className="font-medium text-sm truncate">{selectedTicket.sentBy}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-[11px]">Assigned Developer</span>
                        <p className="font-medium text-sm truncate">{selectedTicket.assignedDeveloper}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-[11px]">Created Date</span>
                        <p className="font-medium text-sm">{selectedTicket.createdDate}</p>
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

                {/* Support Notes */}
                <div className="bg-muted/30 rounded-md p-2.5">
                  <Label htmlFor="remarks" className="text-xs font-bold text-foreground uppercase block mb-2 pb-1.5 border-b border-border/50">
                    Support Notes / Remarks
                  </Label>
                  <Textarea
                    id="remarks"
                    rows={2}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Add your support notes, analysis, or instructions for developer..."
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
                onClick={() => setShowDetailsDialog(false)}
                className="flex-1 sm:flex-none h-8 text-xs"
                size="sm"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  console.log('Saving remarks:', remarks);
                  setShowDetailsDialog(false);
                }}
                variant="default"
                className="flex-1 sm:flex-none h-8 text-xs"
                size="sm"
              >
                <Send className="w-3 h-3 mr-1.5" />
                Send to Developer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reply Dialog */}
        <Dialog open={showReplyDialog} onOpenChange={setShowReplyDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ticket Details & Reply</DialogTitle>
            </DialogHeader>
            {selectedTicket && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Ticket ID:</span>
                    <p className="font-medium">{selectedTicket.id}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Customer:</span>
                    <p className="font-medium">{selectedTicket.customer}</p>
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <p className="text-sm mt-1 p-3 bg-muted rounded-lg">{selectedTicket.description}</p>
                </div>
                <div>
                  <Label htmlFor="reply">Your Reply</Label>
                  <Textarea
                    id="reply"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Type your reply to the developer..."
                    className="mt-2"
                    rows={4}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowReplyDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleReply}>Send Reply</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
