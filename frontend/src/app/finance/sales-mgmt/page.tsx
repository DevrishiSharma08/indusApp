'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import FilterExportBar from '@/components/FilterExportBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, MoreVertical, Eye, Edit, Trash2, IndianRupee, Calendar, User, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { mockTeamMembers } from '@/lib/assets-mock-data';
import { useRouter } from 'next/navigation';

// Mock sales data
const mockSales = [
  { id: 'SALE-001', client: 'ABC Corp', project: 'ERP System', type: 'AMC', consignee: 'John Doe', cost: 100000, gst: 18000, total: 118000, dueDate: '2024-12-31', paidDate: '2024-12-25', receivedBy: 'Jane Smith', paymentMethod: 'Bank Transfer', status: 'Paid' },
  { id: 'SALE-002', client: 'XYZ Ltd', project: 'Website Development', type: 'One Time', consignee: 'Mike Johnson', cost: 50000, gst: 9000, total: 59000, dueDate: '2024-12-20', paidDate: null, receivedBy: null, paymentMethod: 'UPI', status: 'Pending' },
  { id: 'SALE-003', client: 'Tech Solutions', project: 'Cloud Hosting', type: 'Subscriptions', consignee: 'Sarah Wilson', cost: 25000, gst: 4500, total: 29500, dueDate: '2025-01-15', paidDate: null, receivedBy: null, paymentMethod: 'Credit Card', status: 'Overdue', paymentCycle: 'Monthly' },
];

export default function SalesManagementPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('AMC');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modal, setModal] = useState({ isOpen: false, mode: 'add' as 'add' | 'edit' | 'view', data: null as any });
  const [formData, setFormData] = useState<any>({
    client: '',
    project: '',
    type: 'AMC',
    consignee: '',
    cost: '',
    gst: '',
    totalAmount: '',
    dueDate: '',
    paidDate: '',
    receivedBy: '',
    paymentMethod: 'Bank Transfer',
    paymentCycle: 'Monthly',
    otherDetails: '',
    remark: ''
  });

  const handleOpenModal = (mode: 'add' | 'edit' | 'view', sale: any = null) => {
    if (sale) {
      // Convert null values to empty strings to avoid React warnings
      setFormData({
        ...sale,
        paidDate: sale.paidDate || '',
        receivedBy: sale.receivedBy || '',
        otherDetails: sale.otherDetails || '',
        remark: sale.remark || ''
      });
    } else {
      setFormData({
        ...formData,
        type: activeTab,
        client: '',
        project: '',
        consignee: '',
        cost: '',
        gst: '',
        totalAmount: '',
        dueDate: '',
        paidDate: '',
        receivedBy: '',
        otherDetails: '',
        remark: ''
      });
    }
    setModal({ isOpen: true, mode, data: sale });
  };

  const handleCloseModal = () => {
    setModal({ isOpen: false, mode: 'add', data: null });
  };

  const handleSave = () => {
    toast.success(`Sale ${modal.mode === 'add' ? 'added' : 'updated'} successfully`);
    handleCloseModal();
  };

  const handleDelete = (sale: any) => {
    toast.success('Sale deleted successfully');
  };

  const handleExport = (format: 'excel' | 'csv' | 'pdf') => {
    toast.success(`Exporting to ${format.toUpperCase()}`);
  };

  const filteredSales = mockSales.filter(sale => {
    const matchesTab = sale.type === activeTab;
    const matchesStatus = statusFilter === 'all' || sale.status.toLowerCase() === statusFilter;
    const matchesSearch = searchQuery === '' ||
      sale.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesStatus && matchesSearch;
  });

  const statusFilterOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Paid', value: 'paid' },
    { label: 'Pending', value: 'pending' },
    { label: 'Overdue', value: 'overdue' }
  ];

  const getStatusBadge = (status: string) => {
    const variants: any = {
      'Paid': 'default',
      'Pending': 'secondary',
      'Overdue': 'destructive'
    };
    return variants[status] || 'secondary';
  };

  // Calculate total and GST amount automatically
  const handleCostChange = (value: string) => {
    const cost = parseFloat(value) || 0;
    const gst = cost * 0.18; // 18% GST
    const total = cost + gst;
    setFormData({
      ...formData,
      cost: value,
      gst: gst.toFixed(2),
      totalAmount: total.toFixed(2)
    });
  };

  return (
    <DashboardLayout>
      <div className="py-3 lg:py-4 space-y-2 lg:space-y-3">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Sales Management</h1>
          </div>
          <Button
            onClick={() => handleOpenModal('add')}
            className="flex items-center justify-center sm:space-x-2 sm:px-4 sm:py-2 bg-primary text-primary-foreground rounded-full sm:rounded-lg hover:bg-primary/90 transition-colors font-medium w-9 h-9 sm:w-auto sm:h-auto flex-shrink-0"
          >
            <Plus className="w-5 h-5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline text-sm">Add Sale</span>
          </Button>
        </div>

        {/* Tabs - Full Width */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-2 lg:space-y-3">
          <TabsList className="w-full grid grid-cols-3 h-10">
            <TabsTrigger value="AMC" className="text-xs sm:text-sm">AMC</TabsTrigger>
            <TabsTrigger value="One Time" className="text-xs sm:text-sm">One Time</TabsTrigger>
            <TabsTrigger value="Subscriptions" className="text-xs sm:text-sm">Subscriptions</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-2 lg:space-y-3">
            <Card className="border-border shadow-sm rounded-lg sm:rounded-xl">
              <div className="p-2 border-b border-border">
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
                    placeholder: 'Search by client, project, or ID...',
                    value: searchQuery,
                    onChange: setSearchQuery
                  }}
                />
              </div>

              <CardContent className="p-0">
                {filteredSales.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-muted-foreground">
                    No sales found
                  </div>
                ) : viewMode === 'table' ? (
                  /* Table View */
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Sale ID</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead>Project</TableHead>
                          <TableHead>Consignee</TableHead>
                          <TableHead>Total Amount</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Status</TableHead>
                          {activeTab === 'Subscriptions' && <TableHead>Cycle</TableHead>}
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSales.map((sale) => (
                          <TableRow key={sale.id}>
                            <TableCell className="font-medium">{sale.id}</TableCell>
                            <TableCell>{sale.client}</TableCell>
                            <TableCell>{sale.project}</TableCell>
                            <TableCell>{sale.consignee}</TableCell>
                            <TableCell className="font-semibold">₹{sale.total.toLocaleString()}</TableCell>
                            <TableCell>{sale.dueDate}</TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadge(sale.status)} className="text-xs">
                                {sale.status}
                              </Badge>
                            </TableCell>
                            {activeTab === 'Subscriptions' && (
                              <TableCell>
                                <Badge variant="outline" className="text-xs">{sale.paymentCycle}</Badge>
                              </TableCell>
                            )}
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleOpenModal('view', sale)}>
                                    <Eye className="w-4 h-4 mr-2" />View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleOpenModal('edit', sale)}>
                                    <Edit className="w-4 h-4 mr-2" />Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleDelete(sale)} className="text-destructive">
                                    <Trash2 className="w-4 h-4 mr-2" />Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  /* Card View - Compact */
                  <div className="p-2 sm:p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {filteredSales.map((sale) => (
                      <Card key={sale.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-2.5">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <Badge variant={getStatusBadge(sale.status)} className="text-xs px-1.5 py-0">
                                  {sale.status}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{sale.id}</span>
                              </div>
                              <h3 className="text-sm font-semibold text-foreground line-clamp-1">{sale.client}</h3>
                              <p className="text-xs text-muted-foreground line-clamp-1">{sale.project}</p>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                                  <MoreVertical className="h-3.5 w-3.5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleOpenModal('view', sale)}>
                                  <Eye className="w-4 h-4 mr-2" />View
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleOpenModal('edit', sale)}>
                                  <Edit className="w-4 h-4 mr-2" />Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleDelete(sale)} className="text-destructive">
                                  <Trash2 className="w-4 h-4 mr-2" />Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className="space-y-1.5 mt-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">Amount</span>
                              <span className="text-base font-bold text-primary">₹{sale.total.toLocaleString()}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                              <div className="flex items-center gap-1 min-w-0">
                                <User className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                                <span className="text-muted-foreground truncate">{sale.consignee}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                                <span className="text-muted-foreground">{sale.dueDate}</span>
                              </div>
                              {sale.type === 'Subscriptions' && (
                                <div className="col-span-2 mt-0.5">
                                  <Badge variant="outline" className="text-xs px-1.5 py-0">{sale.paymentCycle}</Badge>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add/Edit/View Sale Modal */}
      <Dialog open={modal.isOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {modal.mode === 'view' ? 'View Sale Details' : modal.mode === 'edit' ? 'Edit Sale' : 'Add New Sale'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {/* Row 1: Client and Project */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs whitespace-nowrap">Client Name *</Label>
                <Input
                  value={formData.client}
                  onChange={(e) => setFormData({...formData, client: e.target.value})}
                  placeholder="Enter client name"
                  disabled={modal.mode === 'view'}
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs whitespace-nowrap">Project Name *</Label>
                <Input
                  value={formData.project}
                  onChange={(e) => setFormData({...formData, project: e.target.value})}
                  placeholder="Enter project name"
                  disabled={modal.mode === 'view'}
                  className="h-9"
                />
              </div>
            </div>

            {/* Row 2: Type and Consignee */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs whitespace-nowrap">Type of Sale *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(val) => setFormData({...formData, type: val})}
                  disabled={modal.mode === 'view'}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AMC">AMC</SelectItem>
                    <SelectItem value="One Time">One Time</SelectItem>
                    <SelectItem value="Subscriptions">Subscriptions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs whitespace-nowrap">Consignee *</Label>
                <Select
                  value={formData.consignee}
                  onValueChange={(val) => setFormData({...formData, consignee: val})}
                  disabled={modal.mode === 'view'}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTeamMembers.map((t) => (
                      <SelectItem key={t.id} value={t.fullName}>{t.fullName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 3: Cost, GST, Total */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs whitespace-nowrap">Cost (INR) *</Label>
                <Input
                  type="number"
                  value={formData.cost}
                  onChange={(e) => handleCostChange(e.target.value)}
                  placeholder="0.00"
                  disabled={modal.mode === 'view'}
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs whitespace-nowrap">GST (18%) *</Label>
                <Input
                  type="number"
                  value={formData.gst}
                  disabled
                  className="h-9 bg-muted"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs whitespace-nowrap">Total Amount *</Label>
                <Input
                  type="number"
                  value={formData.totalAmount}
                  disabled
                  className="h-9 bg-muted font-semibold"
                />
              </div>
            </div>

            {/* Row 4: Due Date and Paid Date */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs whitespace-nowrap">Due Date *</Label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  disabled={modal.mode === 'view'}
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs whitespace-nowrap">Paid Date</Label>
                <Input
                  type="date"
                  value={formData.paidDate}
                  onChange={(e) => setFormData({...formData, paidDate: e.target.value})}
                  disabled={modal.mode === 'view'}
                  className="h-9"
                />
              </div>
            </div>

            {/* Row 5: Received By and Payment Method */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs whitespace-nowrap">Received By</Label>
                <Select
                  value={formData.receivedBy}
                  onValueChange={(val) => setFormData({...formData, receivedBy: val})}
                  disabled={modal.mode === 'view'}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTeamMembers.map((t) => (
                      <SelectItem key={t.id} value={t.fullName}>{t.fullName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs whitespace-nowrap">Payment Method *</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(val) => setFormData({...formData, paymentMethod: val})}
                  disabled={modal.mode === 'view'}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Subscription-specific: Payment Cycle */}
            {formData.type === 'Subscriptions' && (
              <div className="space-y-1.5">
                <Label className="text-xs whitespace-nowrap">Payment Cycle *</Label>
                <Select
                  value={formData.paymentCycle}
                  onValueChange={(val) => setFormData({...formData, paymentCycle: val})}
                  disabled={modal.mode === 'view'}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Half Yearly">Half Yearly</SelectItem>
                    <SelectItem value="Yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Other Details */}
            <div className="space-y-1.5">
              <Label className="text-xs whitespace-nowrap">Other Details</Label>
              <Textarea
                value={formData.otherDetails}
                onChange={(e) => setFormData({...formData, otherDetails: e.target.value})}
                placeholder="Additional details..."
                disabled={modal.mode === 'view'}
                rows={2}
                className="resize-none"
              />
            </div>

            {/* Remark */}
            <div className="space-y-1.5">
              <Label className="text-xs whitespace-nowrap">Remark</Label>
              <Textarea
                value={formData.remark}
                onChange={(e) => setFormData({...formData, remark: e.target.value})}
                placeholder="Any remarks..."
                disabled={modal.mode === 'view'}
                rows={2}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            {modal.mode === 'view' ? (
              <Button variant="outline" onClick={handleCloseModal}>
                Close
              </Button>
            ) : (
              <Button onClick={handleSave}>
                <Plus className="w-4 h-4 mr-2" />
                {modal.mode === 'add' ? 'Add Sale' : 'Save Changes'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
