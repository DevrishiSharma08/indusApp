'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, RotateCcw, Eye, MoreVertical } from 'lucide-react';
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

// Mock Data - Pending Merge Points
interface PendingMergePoint {
  id: string;
  ticketId: string;
  title: string;
  customer: string;
  developer: string;
  priority: 'High' | 'Medium' | 'Low';
  completedDate: string;
  remark: string;
}

const mockPendingMergePoints: PendingMergePoint[] = [
  {
    id: 'PT-005',
    ticketId: 'TKT-005',
    title: 'Add user profile page',
    customer: 'Acme Corp',
    developer: 'John Doe',
    priority: 'High',
    completedDate: '2025-11-23',
    remark: '',
  },
  {
    id: 'PT-006',
    ticketId: 'TKT-006',
    title: 'Fix responsive design issues',
    customer: 'TechStart Inc',
    developer: 'Jane Smith',
    priority: 'Medium',
    completedDate: '2025-11-23',
    remark: '',
  },
];

export default function MergePage() {
  const router = useRouter();
  const [points, setPoints] = useState<PendingMergePoint[]>(mockPendingMergePoints);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [developerFilter, setDeveloperFilter] = useState('all');
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<PendingMergePoint | null>(null);
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

  const handleRemarkChange = (id: string, value: string) => {
    setRemarks(prev => ({ ...prev, [id]: value }));
  };

  const handleSendQC = () => {
    if (selectedIds.length === 0) {
      toast.error('Please select at least one point to send to QC');
      return;
    }

    // Send to Testing page
    toast.success(`${selectedIds.length} point(s) sent to Testing/QC successfully!`);

    // Remove from pending merge
    setPoints(prev => prev.filter(p => !selectedIds.includes(p.id)));
    setSelectedIds([]);
    setRemarks({});
  };

  const handleViewDetails = (point: PendingMergePoint) => {
    setSelectedPoint(point);
    setShowDetailsDialog(true);
  };

  const handleReopen = () => {
    if (selectedIds.length === 0) {
      toast.error('Please select at least one point to reopen');
      return;
    }

    // Check if all selected points have remarks
    const pointsWithoutRemarks = selectedIds.filter(id => !remarks[id]?.trim());
    if (pointsWithoutRemarks.length > 0) {
      toast.error('Please add remark for all selected points before reopening');
      return;
    }

    // Get developer names
    const developers = points
      .filter(p => selectedIds.includes(p.id))
      .map(p => p.developer)
      .filter((v, i, a) => a.indexOf(v) === i);

    toast.success(`${selectedIds.length} point(s) reopened and sent back to ${developers.join(', ')}`);

    // Remove from pending merge
    setPoints(prev => prev.filter(p => !selectedIds.includes(p.id)));
    setSelectedIds([]);
    setRemarks({});
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
      key: 'developer',
      label: 'Developer',
      value: developerFilter,
      onChange: setDeveloperFilter,
      options: [
        { value: 'all', label: 'All Developers' },
        { value: 'john', label: 'John Doe' },
        { value: 'jane', label: 'Jane Smith' },
      ],
    },
  ];

  const handleExport = (format: 'excel' | 'csv' | 'pdf') => {
    console.log('Exporting to', format);
    toast.success(`Exporting to ${format.toUpperCase()}`);
  };

  return (
    <DashboardLayout>
      <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">
        <PageHeader
          title="Merge Management"
          description="Review completed work and send to QC or reopen for changes"
        />

        {/* Action Buttons */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border border-border">
            <span className="text-sm font-medium">
              {selectedIds.length} point(s) selected
            </span>
            <div className="flex gap-2 ml-auto">
              <Button
                onClick={handleSendQC}
                className="bg-green-600 hover:bg-green-700"
              >
                <Send className="w-4 h-4 mr-2" />
                Send to QC
              </Button>
              <Button
                onClick={handleReopen}
                variant="destructive"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reopen
              </Button>
            </div>
          </div>
        )}

        {/* Points Table */}
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
                  <TableHead>Developer</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Completed Date</TableHead>
                  <TableHead className="min-w-[200px]">Remark</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {points.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      No points pending merge
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
                        <Badge variant="outline" className="text-xs">
                          {point.developer}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPriorityVariant(point.priority)} className="text-xs">
                          {point.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{point.completedDate}</TableCell>
                      <TableCell>
                        <Input
                          value={remarks[point.id] || point.remark}
                          onChange={(e) => handleRemarkChange(point.id, e.target.value)}
                          placeholder="Add remark (required for reopen)..."
                          className="h-8 text-xs"
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
                  No points pending merge
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
                              <span className="text-muted-foreground">Developer:</span>
                              <Badge variant="outline" className="text-xs">{point.developer}</Badge>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-muted-foreground">Completed:</span>
                              <span className="font-medium">{point.completedDate}</span>
                            </div>
                          </div>

                          {/* Remark Input */}
                          <div className="pt-1">
                            <Input
                              value={remarks[point.id] || point.remark}
                              onChange={(e) => handleRemarkChange(point.id, e.target.value)}
                              placeholder="Add remark (required for reopen)..."
                              className="h-8 text-xs"
                            />
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
                        <span className="text-muted-foreground text-[11px]">Completed Date</span>
                        <p className="font-medium text-sm">{selectedPoint.completedDate}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground text-[11px]">Customer</span>
                        <p className="font-medium text-sm">{selectedPoint.customer}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground text-[11px]">Developer</span>
                        <Badge variant="outline" className="text-xs">
                          {selectedPoint.developer}
                        </Badge>
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
