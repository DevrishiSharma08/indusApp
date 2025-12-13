'use client';

import { useState } from 'react';
import { Plus, Eye, Pencil, Trash2, MoreVertical, FileDown } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/PageHeader';
import FilterExportBar from '@/components/FilterExportBar';
import { Card, CardContent } from '@/components/ui/card';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock data
const mockTickets = [
  {
    id: 'TKT-001',
    title: 'Login authentication not working',
    customer: 'Acme Corp',
    assignedTo: 'John Doe',
    priority: 'High',
    status: 'In Progress',
    createdDate: '2025-01-15',
    expectedDate: '2025-01-20',
  },
  {
    id: 'TKT-002',
    title: 'Dashboard loading slowly',
    customer: 'TechStart Inc',
    assignedTo: 'Jane Smith',
    priority: 'Medium',
    status: 'Pending QC',
    createdDate: '2025-01-16',
    expectedDate: '2025-01-22',
  },
  {
    id: 'TKT-003',
    title: 'Export to Excel feature not generating report',
    customer: 'Global Solutions',
    assignedTo: 'Mike Johnson',
    priority: 'High',
    status: 'Assigned',
    createdDate: '2025-01-14',
    expectedDate: '2025-01-19',
  },
  {
    id: 'TKT-004',
    title: 'Add dark mode toggle',
    customer: 'Innovate Ltd',
    assignedTo: 'Sarah Williams',
    priority: 'Low',
    status: 'Open',
    createdDate: '2025-01-17',
    expectedDate: '2025-01-30',
  },
  {
    id: 'TKT-005',
    title: 'User profile image upload failing',
    customer: 'Acme Corp',
    assignedTo: 'John Doe',
    priority: 'High',
    status: 'Testing',
    createdDate: '2025-01-13',
    expectedDate: '2025-01-18',
  },
  {
    id: 'TKT-006',
    title: 'Email notification not sending',
    customer: 'TechStart Inc',
    assignedTo: 'Emily Davis',
    priority: 'Medium',
    status: 'In Progress',
    createdDate: '2025-01-15',
    expectedDate: '2025-01-21',
  },
  {
    id: 'TKT-007',
    title: 'Mobile responsive issues on tablet',
    customer: 'Global Solutions',
    assignedTo: 'Mike Johnson',
    priority: 'Medium',
    status: 'Assigned',
    createdDate: '2025-01-16',
    expectedDate: '2025-01-25',
  },
  {
    id: 'TKT-008',
    title: 'Search functionality returning no results',
    customer: 'Innovate Ltd',
    assignedTo: 'Sarah Williams',
    priority: 'High',
    status: 'Cancelled',
    createdDate: '2025-01-12',
    expectedDate: '2025-01-17',
  },
  {
    id: 'TKT-009',
    title: 'Add multi-language support',
    customer: 'Acme Corp',
    assignedTo: 'John Doe',
    priority: 'Low',
    status: 'Open',
    createdDate: '2025-01-18',
    expectedDate: '2025-02-15',
  },
  {
    id: 'TKT-010',
    title: 'API timeout on large data requests',
    customer: 'TechStart Inc',
    assignedTo: 'Jane Smith',
    priority: 'High',
    status: 'Completed',
    createdDate: '2025-01-10',
    expectedDate: '2025-01-15',
  },
  {
    id: 'TKT-011',
    title: 'Payment gateway integration',
    customer: 'Global Solutions',
    assignedTo: 'Emily Davis',
    priority: 'High',
    status: 'In Progress',
    createdDate: '2025-01-14',
    expectedDate: '2025-01-20',
  },
  {
    id: 'TKT-012',
    title: 'Form validation not working on mobile',
    customer: 'Innovate Ltd',
    assignedTo: 'Mike Johnson',
    priority: 'Medium',
    status: 'Pending QC',
    createdDate: '2025-01-17',
    expectedDate: '2025-01-23',
  },
  {
    id: 'TKT-013',
    title: 'Database backup automation',
    customer: 'Acme Corp',
    assignedTo: 'Sarah Williams',
    priority: 'Medium',
    status: 'Assigned',
    createdDate: '2025-01-15',
    expectedDate: '2025-01-28',
  },
  {
    id: 'TKT-014',
    title: 'Calendar integration with Outlook',
    customer: 'TechStart Inc',
    assignedTo: 'John Doe',
    priority: 'Low',
    status: 'Open',
    createdDate: '2025-01-18',
    expectedDate: '2025-02-10',
  },
  {
    id: 'TKT-015',
    title: 'Session timeout warning notification',
    customer: 'Global Solutions',
    assignedTo: 'Jane Smith',
    priority: 'Medium',
    status: 'Testing',
    createdDate: '2025-01-16',
    expectedDate: '2025-01-24',
  },
  {
    id: 'TKT-016',
    title: 'Implement two-factor authentication',
    customer: 'Innovate Ltd',
    assignedTo: 'Emily Davis',
    priority: 'High',
    status: 'In Progress',
    createdDate: '2025-01-13',
    expectedDate: '2025-01-19',
  },
  {
    id: 'TKT-017',
    title: 'Reduce page load time',
    customer: 'Acme Corp',
    assignedTo: 'Mike Johnson',
    priority: 'Medium',
    status: 'Completed',
    createdDate: '2025-01-11',
    expectedDate: '2025-01-16',
  },
  {
    id: 'TKT-018',
    title: 'Custom report builder',
    customer: 'TechStart Inc',
    assignedTo: 'Sarah Williams',
    priority: 'Low',
    status: 'Open',
    createdDate: '2025-01-19',
    expectedDate: '2025-02-20',
  },
  {
    id: 'TKT-019',
    title: 'Password reset link expired issue',
    customer: 'Global Solutions',
    assignedTo: 'John Doe',
    priority: 'High',
    status: 'Assigned',
    createdDate: '2025-01-17',
    expectedDate: '2025-01-22',
  },
  {
    id: 'TKT-020',
    title: 'Add bulk user import feature',
    customer: 'Innovate Ltd',
    assignedTo: 'Jane Smith',
    priority: 'Medium',
    status: 'Pending QC',
    createdDate: '2025-01-15',
    expectedDate: '2025-01-26',
  },
];

// Status badge colors
const getStatusBadge = (status: string) => {
  const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', className?: string }> = {
    'Open': { variant: 'secondary' },
    'Assigned': { variant: 'default', className: 'bg-blue-500 hover:bg-blue-600 text-white' },
    'In Progress': { variant: 'default', className: 'bg-yellow-500 hover:bg-yellow-600 text-white' },
    'Pending QC': { variant: 'default', className: 'bg-purple-500 hover:bg-purple-600 text-white' },
    'Testing': { variant: 'default', className: 'bg-orange-500 hover:bg-orange-600 text-white' },
    'Completed': { variant: 'default', className: 'bg-green-500 hover:bg-green-600 text-white' },
    'Cancelled': { variant: 'destructive' },
  };
  const config = variants[status] || { variant: 'secondary' };
  return <Badge variant={config.variant} className={config.className}>{status}</Badge>;
};

// Priority badge colors
const getPriorityBadge = (priority: string) => {
  const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', className?: string }> = {
    'High': { variant: 'destructive' },
    'Medium': { variant: 'default', className: 'bg-orange-500 hover:bg-orange-600 text-white' },
    'Low': { variant: 'secondary' },
  };
  const config = variants[priority] || { variant: 'secondary' };
  return <Badge variant={config.variant} className={config.className}>{priority}</Badge>;
};

export default function AllTicketsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [customerFilter, setCustomerFilter] = useState('all');
  const [developerFilter, setDeveloperFilter] = useState('all');
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState('10');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table');

  // Filter configuration
  const filterConfig = [
    {
      key: 'status',
      label: 'Status',
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: 'all', label: 'All Statuses' },
        { value: 'open', label: 'Open' },
        { value: 'assigned', label: 'Assigned' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'pending-qc', label: 'Pending QC' },
        { value: 'testing', label: 'Testing' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
      ],
    },
    {
      key: 'priority',
      label: 'Priority',
      value: priorityFilter,
      onChange: setPriorityFilter,
      options: [
        { value: 'all', label: 'All Priorities' },
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' },
      ],
    },
    {
      key: 'customer',
      label: 'Customer',
      value: customerFilter,
      onChange: setCustomerFilter,
      options: [
        { value: 'all', label: 'All Customers' },
        { value: 'acme', label: 'Acme Corp' },
        { value: 'techstart', label: 'TechStart Inc' },
        { value: 'global', label: 'Global Solutions' },
        { value: 'innovate', label: 'Innovate Ltd' },
      ],
    },
    {
      key: 'developer',
      label: 'Developer',
      value: developerFilter,
      onChange: setDeveloperFilter,
      options: [
        { value: 'all', label: 'All Developers' },
        { value: 'john', label: 'John Doe' },
        { value: 'jane', label: 'Jane Smith' },
        { value: 'mike', label: 'Mike Johnson' },
        { value: 'sarah', label: 'Sarah Williams' },
        { value: 'emily', label: 'Emily Davis' },
      ],
    },
  ];

  // Filter tickets
  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status.toLowerCase().replace(' ', '-') === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority.toLowerCase() === priorityFilter;
    const matchesCustomer = customerFilter === 'all' || ticket.customer.toLowerCase().includes(customerFilter);
    const matchesDeveloper = developerFilter === 'all' || ticket.assignedTo.toLowerCase().includes(developerFilter);

    return matchesSearch && matchesStatus && matchesPriority && matchesCustomer && matchesDeveloper;
  });

  // Handle export
  const handleExport = (format: 'excel' | 'csv' | 'pdf') => {
    console.log('Exporting to', format);
    alert(`Exporting ${filteredTickets.length} tickets to ${format.toUpperCase()}`);
  };

  // Handle bulk selection
  const toggleTicketSelection = (ticketId: string) => {
    setSelectedTickets((prev) =>
      prev.includes(ticketId) ? prev.filter((id) => id !== ticketId) : [...prev, ticketId]
    );
  };

  const toggleAllTickets = () => {
    if (selectedTickets.length === filteredTickets.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(filteredTickets.map((t) => t.id));
    }
  };

  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on`, selectedTickets);
    alert(`${action} applied to ${selectedTickets.length} ticket(s)`);
    setSelectedTickets([]);
  };

  // Handle individual actions
  const handleView = (ticketId: string) => {
    console.log('View ticket:', ticketId);
    alert(`Viewing ticket: ${ticketId}`);
  };

  const handleEdit = (ticketId: string) => {
    console.log('Edit ticket:', ticketId);
    alert(`Editing ticket: ${ticketId}`);
  };

  const handleDelete = (ticketId: string) => {
    console.log('Delete ticket:', ticketId);
    if (confirm(`Are you sure you want to delete ${ticketId}?`)) {
      alert(`Deleted ticket: ${ticketId}`);
    }
  };

  return (
    <DashboardLayout>
      <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">
        <PageHeader
          title="All Tickets"
          primaryAction={{
            content: 'Create Ticket',
            href: '/ticketmanagement/tickets/create',
            icon: Plus,
          }}
        />

        {/* Admin KPIs - Verify, Assign, and Merge */}
        <div className="grid grid-cols-3 gap-3">
          <div
            onClick={() => window.location.href = '/ticketmanagement/verify'}
            className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg p-3 shadow-sm border border-blue-200 dark:border-blue-800 hover:shadow-md transition-all cursor-pointer group"
          >
            <div>
              <h3 className="text-xs font-semibold text-blue-900 dark:text-blue-100">Verify</h3>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">24</p>
            </div>
          </div>

          <div
            onClick={() => window.location.href = '/ticketmanagement/assign'}
            className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-lg p-3 shadow-sm border border-purple-200 dark:border-purple-800 hover:shadow-md transition-all cursor-pointer group"
          >
            <div>
              <h3 className="text-xs font-semibold text-purple-900 dark:text-purple-100">Assign</h3>
              <p className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-1">18</p>
            </div>
          </div>

          <div
            onClick={() => window.location.href = '/ticketmanagement/merge'}
            className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg p-3 shadow-sm border border-green-200 dark:border-green-800 hover:shadow-md transition-all cursor-pointer group"
          >
            <div>
              <h3 className="text-xs font-semibold text-green-900 dark:text-green-100">Merge</h3>
              <p className="text-xl font-bold text-green-600 dark:text-green-400 mt-1">12</p>
            </div>
          </div>
        </div>

        {/* Ticket List with Integrated Controls */}
        <div className="bg-card rounded-lg sm:rounded-xl shadow-sm border border-border">
          {/* Search, Filter, Export, and View Toggle Row */}
          <div className="p-3 sm:p-4 border-b border-border">
            <FilterExportBar
              filters={filterConfig}
              onExport={handleExport}
              showViewToggle={true}
              viewToggleProps={{
                currentView: viewMode,
                onViewChange: setViewMode
              }}
              showSearch={true}
              searchProps={{
                placeholder: "Search tickets by ID or title...",
                value: searchQuery,
                onChange: setSearchQuery
              }}
            />
          </div>

          {/* Bulk Actions */}
          {selectedTickets.length > 0 && (
            <div className="px-4 py-3 border-b border-border bg-muted/30">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="text-sm text-foreground">
                  <span className="font-semibold">{selectedTickets.length}</span> ticket(s) selected
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Select onValueChange={handleBulkAction}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Bulk Actions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="assign">Assign</SelectItem>
                      <SelectItem value="change-status">Change Status</SelectItem>
                      <SelectItem value="change-priority">Change Priority</SelectItem>
                      <SelectItem value="delete">Delete</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTickets([])}
                  >
                    Clear
                  </Button>
                </div>
              </div>
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
                      <input
                        type="checkbox"
                        checked={selectedTickets.length === filteredTickets.length && filteredTickets.length > 0}
                        onChange={toggleAllTickets}
                        className="w-4 h-4 rounded border-input"
                      />
                    </TableHead>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Expected Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                        No tickets found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTickets.map((ticket) => (
                      <TableRow key={ticket.id} className="hover:bg-muted/50">
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedTickets.includes(ticket.id)}
                            onChange={() => toggleTicketSelection(ticket.id)}
                            className="w-4 h-4 rounded border-input"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{ticket.id}</TableCell>
                        <TableCell className="max-w-xs truncate">{ticket.title}</TableCell>
                        <TableCell>{ticket.customer}</TableCell>
                        <TableCell>{ticket.assignedTo}</TableCell>
                        <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                        <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                        <TableCell>{ticket.createdDate}</TableCell>
                        <TableCell>{ticket.expectedDate}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleView(ticket.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(ticket.id)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(ticket.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
            <div className="divide-y divide-border">
              {filteredTickets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No tickets found
                </div>
              ) : (
                filteredTickets.map((ticket) => (
                  <div key={ticket.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={selectedTickets.includes(ticket.id)}
                          onChange={() => toggleTicketSelection(ticket.id)}
                          className="w-4 h-4 rounded border-input mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-foreground truncate">{ticket.id}</div>
                          <div className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {ticket.title}
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(ticket.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(ticket.id)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(ticket.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Customer:</span>
                        <div className="font-medium">{ticket.customer}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Assigned To:</span>
                        <div className="font-medium">{ticket.assignedTo}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {getPriorityBadge(ticket.priority)}
                      {getStatusBadge(ticket.status)}
                    </div>

                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Created: {ticket.createdDate}</span>
                      <span>Due: {ticket.expectedDate}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            )}

            {/* Pagination */}
            <div className="border-t border-border p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Showing</span>
                  <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
                    <SelectTrigger className="w-[70px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                  <span>of {filteredTickets.length} tickets</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    1
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}