'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, Eye, MoreVertical } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/PageHeader';
import FilterExportBar from '@/components/FilterExportBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

// Mock Data - Verified Points
interface VerifiedPoint {
  id: string;
  ticketId: string;
  title: string;
  customer: string;
  priority: 'High' | 'Medium' | 'Low';
  verifiedDate: string;
  expectedTime: string;
  expectedDate: string;
}

const mockVerifiedPoints: VerifiedPoint[] = [
  {
    id: 'PT-001',
    ticketId: 'TKT-001',
    title: 'Fix login authentication bug',
    customer: 'Acme Corp',
    priority: 'High',
    verifiedDate: '2025-11-22',
    expectedTime: '',
    expectedDate: '',
  },
  {
    id: 'PT-002',
    ticketId: 'TKT-002',
    title: 'Implement dark mode toggle',
    customer: 'TechStart Inc',
    priority: 'Medium',
    verifiedDate: '2025-11-22',
    expectedTime: '',
    expectedDate: '',
  },
];

// Mock team members
const teamMembers = [
  { id: '1', name: 'John Doe', role: 'Senior Developer' },
  { id: '2', name: 'Jane Smith', role: 'Developer' },
  { id: '3', name: 'Mike Johnson', role: 'Junior Developer' },
];

export default function AssignPage() {
  const router = useRouter();
  const [points, setPoints] = useState<VerifiedPoint[]>(mockVerifiedPoints);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expectedTimes, setExpectedTimes] = useState<Record<string, string>>({});
  const [expectedDates, setExpectedDates] = useState<Record<string, string>>({});
  const [assignedTo, setAssignedTo] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [customerFilter, setCustomerFilter] = useState('all');
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<VerifiedPoint | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table');

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(points.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    }
  };

  const handleExpectedTimeChange = (id: string, value: string) => {
    setExpectedTimes(prev => ({ ...prev, [id]: value }));
  };

  const handleExpectedDateChange = (id: string, value: string) => {
    setExpectedDates(prev => ({ ...prev, [id]: value }));
  };

  const handleViewDetails = (point: VerifiedPoint) => {
    setSelectedPoint(point);
    setShowDetailsDialog(true);
  };

  const handleAssign = () => {
    if (selectedIds.length === 0) {
      toast.error('Please select at least one point to assign');
      return;
    }

    if (!assignedTo) {
      toast.error('Please select a team member to assign');
      return;
    }

    // Validate expected time and date for all selected points
    const invalidPoints = selectedIds.filter(
      id => !expectedTimes[id]?.trim() || !expectedDates[id]?.trim()
    );

    if (invalidPoints.length > 0) {
      toast.error('Please fill expected time and date for all selected points');
      return;
    }

    // Confirmation dialog
    const memberName = teamMembers.find(m => m.id === assignedTo)?.name || '';
    if (!confirm(`Are you sure you want to assign ${selectedIds.length} point(s) to ${memberName}?`)) {
      return;
    }

    // Assign points
    toast.success(`${selectedIds.length} point(s) assigned to ${memberName}`);

    // Remove assigned points
    setPoints(prev => prev.filter(p => !selectedIds.includes(p.id)));
    setSelectedIds([]);
    setExpectedTimes({});
    setExpectedDates({});
    setAssignedTo('');
  };

  const getPriorityVariant = (priority: string): 'destructive' | 'default' | 'secondary' => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary';
      default: return 'default';
    }
  };

  // Filter configuration
  const filterConfig = [
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
      ],
    },
  ];

  const handleExport = (format: 'excel' | 'csv' | 'pdf') => {
    console.log('Exporting to', format);
    toast.success(`Exporting to ${format.toUpperCase()}`);
  };

  return (
    <DashboardLayout>
      <div className="py-2 lg:py-3 space-y-3 lg:space-y-4">
        <PageHeader
          title="Assign Points"
        />

        {/* Assignment Panel */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg border border-border">
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger className="w-[220px] h-9">
                <SelectValue placeholder="Assign To" />
              </SelectTrigger>
              <SelectContent>
                {teamMembers.map(member => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleAssign}
              size="sm"
              className="h-9"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Assign Points
            </Button>
          </div>
        )}

        {/* Points Table with Integrated Controls */}
        <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
          {/* Filter Bar */}
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
                placeholder: "Search points...",
                value: searchQuery,
                onChange: setSearchQuery
              }}
            />
          </div>
          {viewMode === 'table' && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedIds.length === points.length && points.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Point ID</TableHead>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Verified Date</TableHead>
                  <TableHead className="min-w-[150px]">
                    Expected Time <span className="text-destructive">*</span>
                  </TableHead>
                  <TableHead className="min-w-[150px]">
                    Expected Date <span className="text-destructive">*</span>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {points.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      No verified points available for assignment
                    </TableCell>
                  </TableRow>
                ) : (
                  points.map((point) => (
                    <TableRow key={point.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(point.id)}
                          onCheckedChange={(checked) => handleSelectOne(point.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{point.id}</TableCell>
                      <TableCell>{point.ticketId}</TableCell>
                      <TableCell className="max-w-xs truncate">{point.title}</TableCell>
                      <TableCell>{point.customer}</TableCell>
                      <TableCell>
                        <Badge variant={getPriorityVariant(point.priority)} className="text-xs">
                          {point.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{point.verifiedDate}</TableCell>
                      <TableCell>
                        <Select
                          value={expectedTimes[point.id] || ''}
                          onValueChange={(value) => handleExpectedTimeChange(point.id, value)}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30min">30 Minutes</SelectItem>
                            <SelectItem value="1h">1 Hour</SelectItem>
                            <SelectItem value="2h">2 Hours</SelectItem>
                            <SelectItem value="4h">4 Hours</SelectItem>
                            <SelectItem value="1d">1 Day</SelectItem>
                            <SelectItem value="2d">2 Days</SelectItem>
                            <SelectItem value="3d">3 Days</SelectItem>
                            <SelectItem value="1w">1 Week</SelectItem>
                            <SelectItem value="2w">2 Weeks</SelectItem>
                            <SelectItem value="1m">1 Month</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="date"
                          value={expectedDates[point.id] || ''}
                          onChange={(e) => handleExpectedDateChange(point.id, e.target.value)}
                          className="h-8 text-xs"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(point)}
                          title="View Details"
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
              {points.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-muted-foreground">
                  No verified points available for assignment
                </div>
              ) : (
                points.map((point) => (
                  <Card key={point.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedIds.includes(point.id)}
                          onCheckedChange={(checked) => handleSelectOne(point.id, checked as boolean)}
                          className="mt-0.5"
                        />
                        <div className="flex-1 min-w-0 space-y-2">
                          {/* Header with ID, Badges, and Actions Menu */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-sm font-semibold text-foreground">{point.id}</h3>
                              <Badge variant={getPriorityVariant(point.priority)} className="text-xs">
                                {point.priority}
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
                                <DropdownMenuItem onClick={() => handleViewDetails(point)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* Title */}
                          <p className="text-sm text-muted-foreground line-clamp-2">{point.title}</p>

                          {/* Compact Info Grid - 2 columns */}
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                            <div className="flex items-center gap-1.5">
                              <span className="text-muted-foreground">Ticket ID:</span>
                              <span className="font-medium">{point.ticketId}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-muted-foreground">Customer:</span>
                              <span className="font-medium truncate">{point.customer}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-muted-foreground">Verified:</span>
                              <span className="font-medium">{point.verifiedDate}</span>
                            </div>
                          </div>

                          {/* Expected Time and Date Selection */}
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Expected Time *</Label>
                              <Select
                                value={expectedTimes[point.id] || ''}
                                onValueChange={(value) => handleExpectedTimeChange(point.id, value)}
                              >
                                <SelectTrigger className="h-8 text-xs">
                                  <SelectValue placeholder="Select time" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="30min">30 Minutes</SelectItem>
                                  <SelectItem value="1h">1 Hour</SelectItem>
                                  <SelectItem value="2h">2 Hours</SelectItem>
                                  <SelectItem value="4h">4 Hours</SelectItem>
                                  <SelectItem value="1d">1 Day</SelectItem>
                                  <SelectItem value="2d">2 Days</SelectItem>
                                  <SelectItem value="3d">3 Days</SelectItem>
                                  <SelectItem value="1w">1 Week</SelectItem>
                                  <SelectItem value="2w">2 Weeks</SelectItem>
                                  <SelectItem value="1m">1 Month</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Expected Date *</Label>
                              <Input
                                type="date"
                                value={expectedDates[point.id] || ''}
                                onChange={(e) => handleExpectedDateChange(point.id, e.target.value)}
                                className="h-8 text-xs"
                                min={new Date().toISOString().split('T')[0]}
                              />
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

        {/* Point Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden w-[96vw] sm:w-full p-0 gap-0">
            <DialogHeader className="px-3 sm:px-4 pt-3 sm:pt-4 pb-2 border-b">
              <DialogTitle className="text-sm sm:text-base">Point Details - {selectedPoint?.id}</DialogTitle>
            </DialogHeader>

            {selectedPoint && (
              <div className="overflow-y-auto max-h-[calc(90vh-8rem)] px-3 sm:px-4 py-3 space-y-3">
                {/* Point Information */}
                <div className="bg-muted/30 rounded-md p-2.5">
                  <h3 className="text-xs font-bold text-foreground uppercase mb-2 pb-1.5 border-b border-border/50">Point Information</h3>
                  <div className="space-y-1.5">
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                      <div>
                        <span className="text-muted-foreground text-[11px]">Point ID</span>
                        <p className="font-medium text-sm">{selectedPoint.id}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-[11px]">Ticket ID</span>
                        <p className="font-medium text-sm">{selectedPoint.ticketId}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-[11px]">Priority</span>
                        <Badge variant={getPriorityVariant(selectedPoint.priority)} className="text-[10px] h-4 mt-0.5">
                          {selectedPoint.priority}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-[11px]">Verified Date</span>
                        <p className="font-medium text-sm">{selectedPoint.verifiedDate}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground text-[11px]">Customer</span>
                        <p className="font-medium text-sm">{selectedPoint.customer}</p>
                      </div>
                    </div>
                    <div className="pt-1.5">
                      <span className="text-muted-foreground text-[11px]">Title</span>
                      <p className="font-medium text-sm mt-0.5">{selectedPoint.title}</p>
                    </div>
                    {(selectedPoint.expectedTime || selectedPoint.expectedDate) && (
                      <div className="pt-1.5">
                        <span className="text-muted-foreground text-[11px]">Expected Completion</span>
                        <p className="text-sm mt-0.5">
                          {selectedPoint.expectedTime && `Time: ${selectedPoint.expectedTime}`}
                          {selectedPoint.expectedTime && selectedPoint.expectedDate && ' | '}
                          {selectedPoint.expectedDate && `Date: ${selectedPoint.expectedDate}`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="gap-2 px-3 sm:px-4 py-2.5 border-t bg-muted/20">
              <Button
                variant="outline"
                onClick={() => setShowDetailsDialog(false)}
                className="flex-1 sm:flex-none h-8 text-xs"
                size="sm"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
