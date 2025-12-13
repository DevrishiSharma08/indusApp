'use client';
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/PageHeader';
import FilterExportBar from '@/components/FilterExportBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { mockSubscriptions } from '@/lib/assets-mock-data';
import { Plus, Edit, Trash2, Save, CreditCard, Calendar, AlertCircle, CheckCircle, MoreVertical, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function SubscriptionsPage() {
  const [modal, setModal] = useState({ isOpen: false, mode: 'add' as 'add' | 'edit' | 'view', data: null as any });
  const [formData, setFormData] = useState({
    serviceName: '',
    plan: '',
    cost: '',
    billingCycle: 'Monthly',
    nextBillingDate: '',
    owner: '',
    status: 'Active',
    vendorName: '',
    gstNumber: '',
    paymentMethod: 'Credit Card',
    paymentDetail: '',
    paymentDate: '',
    transactionId: ''
  });
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table');

  useEffect(() => {
    if (modal.isOpen && modal.mode === 'edit' && modal.data) {
      setFormData(modal.data);
    } else {
      setFormData({
        serviceName: '',
        plan: '',
        cost: '',
        billingCycle: 'Monthly',
        nextBillingDate: '',
        owner: '',
        status: 'Active',
        vendorName: '',
        gstNumber: '',
        paymentMethod: 'Credit Card',
        paymentDetail: '',
        paymentDate: '',
        transactionId: ''
      });
    }
  }, [modal]);

  const handleOpenModal = (mode: 'add' | 'edit' | 'view', sub: any = null) => {
    setModal({ isOpen: true, mode, data: sub });
  };

  const handleCloseModal = () => {
    setModal({ isOpen: false, mode: 'add', data: null });
  };

  const handleDelete = (sub: any) => {
    toast.success(`Subscription "${sub.serviceName}" deleted`);
  };

  const handleExport = (format: 'excel' | 'csv' | 'pdf') => {
    toast.success(`Exporting to ${format.toUpperCase()}`);
  };

  const getStatusBadgeVariant = (status: string) => {
    if (status === 'Active') return 'default';
    if (status === 'Cancelled') return 'destructive';
    return 'secondary';
  };

  const activeCount = mockSubscriptions.filter(s => s.status === 'Active').length;
  const cancelledCount = mockSubscriptions.filter(s => s.status === 'Cancelled').length;
  const totalMonthlyCost = mockSubscriptions
    .filter(s => s.status === 'Active')
    .reduce((sum, s) => sum + (s.billingCycle === 'Monthly' ? s.cost : s.cost / 12), 0);

  // Multi-filter logic with search
  const filteredSubscriptions = mockSubscriptions.filter(sub => {
    const matchesStatus = statusFilter === 'all' || sub.status.toLowerCase() === statusFilter;
    const matchesSearch = searchQuery === '' ||
      sub.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.owner.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const statusFilterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Cancelled', value: 'cancelled' }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-2 lg:space-y-3">
        <PageHeader
          title="Subscriptions"
          primaryAction={{
            label: 'Add Subscription',
            onClick: () => handleOpenModal('add'),
            icon: Plus
          }}
        />

        {/* Compact KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 lg:gap-3">
          <div className="flex flex-col items-center justify-center px-3 py-2.5 rounded-lg bg-card border border-border shadow-sm min-h-[70px]">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <div className="text-2xl font-bold text-foreground">{activeCount}</div>
            </div>
            <div className="text-xs text-muted-foreground text-center">Active Subscriptions</div>
          </div>

          <div className="flex flex-col items-center justify-center px-3 py-2.5 rounded-lg bg-card border border-border shadow-sm min-h-[70px]">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <div className="text-2xl font-bold text-foreground">₹{(totalMonthlyCost / 1000).toFixed(0)}K</div>
            </div>
            <div className="text-xs text-muted-foreground text-center">Monthly Cost</div>
          </div>

          <div className="flex flex-col items-center justify-center px-3 py-2.5 rounded-lg bg-card border border-border shadow-sm min-h-[70px]">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <div className="text-2xl font-bold text-foreground">{cancelledCount}</div>
            </div>
            <div className="text-xs text-muted-foreground text-center">Cancelled</div>
          </div>
        </div>

        {/* Subscriptions List with FilterExportBar */}
        <Card className="border-border shadow-sm rounded-lg sm:rounded-xl">
          <div className="p-2 sm:p-3 border-b border-border">
            <FilterExportBar
              filters={[
                {
                  key: 'status',
                  label: 'Status',
                  options: statusFilterOptions,
                  value: statusFilter,
                  onChange: setStatusFilter
                }
              ]}
              onExport={handleExport}
              showViewToggle={true}
              viewToggleProps={{
                currentView: viewMode,
                onViewChange: setViewMode
              }}
              showSearch={true}
              searchProps={{
                placeholder: 'Search subscriptions...',
                value: searchQuery,
                onChange: setSearchQuery
              }}
            />
          </div>

          <CardContent className="p-0">
            {/* Table View */}
            {viewMode === 'table' && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Cost / Cycle</TableHead>
                      <TableHead>Next Billing</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubscriptions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No subscriptions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSubscriptions.map((sub) => (
                        <TableRow key={sub.id}>
                          <TableCell className="font-medium">{sub.serviceName}</TableCell>
                          <TableCell>
                            <div className="text-sm">{sub.vendorName}</div>
                            {sub.gstNumber && <div className="text-xs text-muted-foreground">{sub.gstNumber}</div>}
                          </TableCell>
                          <TableCell className="font-medium">
                            ₹{sub.cost.toLocaleString()} / {sub.billingCycle}
                          </TableCell>
                          <TableCell>{sub.nextBillingDate}</TableCell>
                          <TableCell>{sub.owner}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(sub.status) as any} className="text-xs">
                              {sub.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleOpenModal('view', sub)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleOpenModal('edit', sub)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDelete(sub)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
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
              <div className="p-3 sm:p-4 space-y-2">
                {filteredSubscriptions.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-muted-foreground">
                    No subscriptions found
                  </div>
                ) : (
                  filteredSubscriptions.map((sub) => (
                    <Card key={sub.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-sm font-semibold text-foreground">{sub.serviceName}</h3>
                                <Badge variant={getStatusBadgeVariant(sub.status) as any} className="text-xs">
                                  {sub.status}
                                </Badge>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleOpenModal('view', sub)}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleOpenModal('edit', sub)}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleDelete(sub)}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-foreground">₹{sub.cost.toLocaleString()}</span>
                              <span className="text-xs text-muted-foreground">/ {sub.billingCycle}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                              <div className="flex items-center gap-1.5">
                                <span className="text-muted-foreground">Vendor:</span>
                                <span className="font-medium truncate">{sub.vendorName}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-muted-foreground">Owner:</span>
                                <span className="font-medium truncate">{sub.owner}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3 h-3 text-muted-foreground" />
                                <span className="text-muted-foreground">Next: {sub.nextBillingDate}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <CreditCard className="w-3 h-3 text-muted-foreground" />
                                <span className="font-medium truncate">{sub.paymentMethod}</span>
                              </div>
                              {sub.gstNumber && (
                                <div className="col-span-2 flex items-center gap-1.5">
                                  <span className="text-muted-foreground">GST:</span>
                                  <span className="font-medium">{sub.gstNumber}</span>
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
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit/View Subscription Modal */}
      <Dialog open={modal.isOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {modal.mode === 'view' ? 'View Subscription Details' : modal.mode === 'edit' ? 'Edit Subscription' : 'Add New Subscription'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Service Name and Vendor Name in one row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Service Name *</Label>
                <Input defaultValue={formData.serviceName} placeholder="e.g., Microsoft 365" disabled={modal.mode === 'view'} />
              </div>
              <div className="space-y-2">
                <Label>Vendor Name</Label>
                <Input defaultValue={formData.vendorName} placeholder="e.g., Microsoft" disabled={modal.mode === 'view'} />
              </div>
            </div>

            {/* Cost and Billing Cycle in one row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cost (INR) *</Label>
                <Input type="number" defaultValue={formData.cost} placeholder="0.00" disabled={modal.mode === 'view'} />
              </div>
              <div className="space-y-2">
                <Label>Billing Cycle *</Label>
                <Select defaultValue={formData.billingCycle} disabled={modal.mode === 'view'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Plan/Tier and Status in one row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Plan / Tier</Label>
                <Input defaultValue={formData.plan} placeholder="e.g., Premium" disabled={modal.mode === 'view'} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select defaultValue={formData.status} disabled={modal.mode === 'view'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Payment Date and Next Billing Date in one row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Payment Date *</Label>
                <Input type="date" defaultValue={formData.paymentDate} disabled={modal.mode === 'view'} />
              </div>
              <div className="space-y-2">
                <Label>Next Billing Date *</Label>
                <Input type="date" defaultValue={formData.nextBillingDate} disabled={modal.mode === 'view'} />
              </div>
            </div>

            {/* Payment Method and Paid By in one row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Payment Method *</Label>
                <Select defaultValue={formData.paymentMethod} disabled={modal.mode === 'view'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Paid By (Team/Dept) *</Label>
                <Input defaultValue={formData.owner} placeholder="e.g., IT Team" disabled={modal.mode === 'view'} />
              </div>
            </div>

            {/* Payment Details and Transaction ID in one row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Payment Details</Label>
                <Input placeholder="e.g., HDFC Card **** 4567" defaultValue={formData.paymentDetail} disabled={modal.mode === 'view'} />
              </div>
              <div className="space-y-2">
                <Label>Transaction ID</Label>
                <Input defaultValue={formData.transactionId} placeholder="Transaction ID" disabled={modal.mode === 'view'} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>GST Number</Label>
              <Input defaultValue={formData.gstNumber} placeholder="GST Number" disabled={modal.mode === 'view'} />
            </div>

            {modal.mode !== 'view' && (
              <div className="space-y-2">
                <Label>Upload Invoice (Multiple files)</Label>
                <Input type="file" multiple />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>
              {modal.mode === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {modal.mode !== 'view' && (
              <Button onClick={handleCloseModal}>
                <Save className="w-4 h-4 mr-2" />
                Save Subscription
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
