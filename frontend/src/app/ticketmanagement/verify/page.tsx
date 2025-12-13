'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Eye, MoreVertical } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/PageHeader';
import FilterExportBar from '@/components/FilterExportBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
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

// Mock Data - Pending Points
interface PendingPoint {
  id: string;
  ticketId: string;
  title: string;
  customer: string;
  priority: 'High' | 'Medium' | 'Low';
  createdDate: string;
  remark: string;
}

const mockPendingPoints: PendingPoint[] = [
  {
    id: 'PT-001',
    ticketId: 'TKT-001',
    title: 'Fix login authentication bug',
    customer: 'Acme Corp',
    priority: 'High',
    createdDate: '2025-11-20',
    remark: '',
  },
  {
    id: 'PT-002',
    ticketId: 'TKT-002',
    title: 'Implement dark mode toggle',
    customer: 'TechStart Inc',
    priority: 'Medium',
    createdDate: '2025-11-21',
    remark: '',
  },
];

export default function VerifyPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'pending' | 'unactive'>('pending');
  const [pendingPoints, setPendingPoints] = useState<PendingPoint[]>(mockPendingPoints);
  const [unactivePoints, setUnactivePoints] = useState<PendingPoint[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [customerFilter, setCustomerFilter] = useState('all');
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<PendingPoint | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table');

  const currentPoints = activeTab === 'pending' ? pendingPoints : unactivePoints;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(currentPoints.map(p => p.id));
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

  const handleRemarkChange = (id: string, value: string) => {
    setRemarks(prev => ({ ...prev, [id]: value }));
  };

  const handleVerify = () => {
    if (selectedIds.length === 0) {
      toast.error('Please select at least one point to verify');
      return;
    }

    // Confirmation dialog
    if (!confirm(`Are you sure you want to verify ${selectedIds.length} point(s)?`)) {
      return;
    }

    // Save remarks and move to Assign page
    toast.success(`${selectedIds.length} point(s) verified successfully!`);

    // Remove from pending
    setPendingPoints(prev => prev.filter(p => !selectedIds.includes(p.id)));
    setSelectedIds([]);
    setRemarks({});
  };

  const handleUnactive = () => {
    if (selectedIds.length === 0) {
      toast.error('Please select at least one point to mark as unactive');
      return;
    }

    // Check if all selected points have remarks
    const pointsWithoutRemarks = selectedIds.filter(id => !remarks[id]?.trim());
    if (pointsWithoutRemarks.length > 0) {
      toast.error('Please add remark for all selected points');
      return;
    }

    // Confirmation dialog
    if (!confirm(`Are you sure you want to mark ${selectedIds.length} point(s) as unactive?`)) {
      return;
    }

    // Move to unactive with remarks
    const pointsToMove = pendingPoints.filter(p => selectedIds.includes(p.id)).map(p => ({
      ...p,
      remark: remarks[p.id] || ''
    }));

    setUnactivePoints(prev => [...prev, ...pointsToMove]);
    setPendingPoints(prev => prev.filter(p => !selectedIds.includes(p.id)));
    toast.success(`${selectedIds.length} point(s) marked as unactive`);
    setSelectedIds([]);
    setRemarks({});
  };

  const handleViewDetails = (point: PendingPoint) => {
    setSelectedPoint(point);
    setShowDetailsDialog(true);
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
          title="Verify Points"
        />

        {/* Action Buttons */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border border-border">
            <span className="text-sm font-medium">
              {selectedIds.length} point(s) selected
            </span>
            <div className="flex gap-2 ml-auto">
              <Button
                onClick={handleVerify}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Verify
              </Button>
              <Button
                onClick={handleUnactive}
                variant="destructive"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Mark Unactive
              </Button>
            </div>
          </div>
        )}

        {/* Points Table with Integrated Controls */}
        <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
          {/* Tabs and Filter Bar */}
          <div className="border-b border-border">
            <div className="flex gap-2 px-3 sm:px-4 pt-3">
              <button
                onClick={() => {
                  setActiveTab('pending');
                  setSelectedIds([]);
                }}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'pending'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Pending ({pendingPoints.length})
              </button>
              <button
                onClick={() => {
                  setActiveTab('unactive');
                  setSelectedIds([]);
                }}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'unactive'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Unactive ({unactivePoints.length})
              </button>
            </div>
            <div className="p-3 sm:p-4">
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
          </div>
          {/* Table Content */}
          {viewMode === 'table' && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedIds.length === currentPoints.length && currentPoints.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Point ID</TableHead>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead className="min-w-[200px]">Remark</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentPoints.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No points to display
                    </TableCell>
                  </TableRow>
                ) : (
                  currentPoints.map((point) => (
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
                      <TableCell>{point.createdDate}</TableCell>
                      <TableCell>
                        <Input
                          value={remarks[point.id] || point.remark}
                          onChange={(e) => handleRemarkChange(point.id, e.target.value)}
                          placeholder="Add remark..."
                          className="h-8 text-xs"
                          disabled={activeTab === 'unactive'}
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
              {currentPoints.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-muted-foreground">
                  No points to display
                </div>
              ) : (
                currentPoints.map((point) => (
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
                              <span className="text-muted-foreground">Created:</span>
                              <span className="font-medium">{point.createdDate}</span>
                            </div>
                            {point.remark && (
                              <div className="col-span-2 flex items-center gap-1.5">
                                <span className="text-muted-foreground">Remark:</span>
                                <span className="font-medium truncate">{point.remark}</span>
                              </div>
                            )}
                          </div>

                          {/* Remark Input for pending tab */}
                          {activeTab === 'pending' && (
                            <div className="pt-1">
                              <Input
                                value={remarks[point.id] || point.remark}
                                onChange={(e) => handleRemarkChange(point.id, e.target.value)}
                                placeholder="Add remark..."
                                className="h-8 text-xs"
                              />
                            </div>
                          )}
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
                        <span className="text-muted-foreground text-[11px]">Created Date</span>
                        <p className="font-medium text-sm">{selectedPoint.createdDate}</p>
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
                    {selectedPoint.remark && (
                      <div className="pt-1.5">
                        <span className="text-muted-foreground text-[11px]">Remark</span>
                        <p className="text-sm mt-0.5">{selectedPoint.remark}</p>
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
