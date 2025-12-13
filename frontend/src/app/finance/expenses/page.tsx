'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/PageHeader';
import FilterExportBar from '@/components/FilterExportBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { mockExpenses, mockTeamMembers } from '@/lib/assets-mock-data';
import { Plus, Edit, Trash2, Save, IndianRupee, Clock, Check, X, Settings, MoreVertical, Calendar, Eye } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

// Expense Categories
const expenseCategories = {
  'Office Supplies': ['Stationery', 'Pantry Supplies', 'Cleaning Supplies'],
  'Travel': ['Cab Fare', 'Flight Tickets', 'Train Tickets', 'Bus Tickets', 'Hotel Stay', 'Client Meal'],
  'Food & Beverages': ['Team Lunch', 'Snacks & Refreshments', 'Office Party'],
  'Software & Subscriptions': ['SaaS Tools', 'Domain & Hosting', 'Software Licenses'],
  'Hardware Purchase': ['Laptops', 'Monitors', 'Peripherals (Mouse, Keyboard)', 'Cables & Adapters'],
  'Cloud Services': ['AWS', 'Azure', 'Google Cloud'],
  'Marketing & Advertising': ['Online Ads', 'Social Media Promotion', 'Events & Sponsorships'],
  'Employee Welfare': ['Gifts & Rewards', 'Health & Wellness'],
  'Miscellaneous': ['Courier Charges', 'Bank Charges', 'Other'],
};

// Category-specific form fields configuration
const categoryFormFields: Record<string, any[]> = {
  'Software & Subscriptions': [
    { name: 'serviceName', label: 'Service Name', type: 'text', placeholder: 'e.g., GitHub, AWS', required: true },
    { name: 'plan', label: 'Plan/Tier', type: 'text', placeholder: 'e.g., Pro, Enterprise', required: false },
    { name: 'billingCycle', label: 'Billing Cycle', type: 'select', options: ['Monthly', 'Quarterly', 'Yearly'], required: true },
    { name: 'nextBillingDate', label: 'Next Billing Date', type: 'date', required: false },
    { name: 'vendorName', label: 'Vendor Name', type: 'text', placeholder: 'Company/Provider name', required: false },
    { name: 'gstNumber', label: 'GST Number', type: 'text', placeholder: 'Vendor GST', required: false },
    { name: 'transactionId', label: 'Transaction ID', type: 'text', placeholder: 'Payment transaction ID', required: false },
  ],
  'Travel': [
    { name: 'from', label: 'From', type: 'text', placeholder: 'Origin city/location', required: true },
    { name: 'to', label: 'To', type: 'text', placeholder: 'Destination city/location', required: true },
    { name: 'distance', label: 'Distance (km)', type: 'number', placeholder: '0', required: false },
    { name: 'vehicle', label: 'Vehicle/Transport', type: 'select', options: ['Cab', 'Bus', 'Train', 'Flight', 'Personal Car'], required: false },
    { name: 'travelDate', label: 'Travel Date', type: 'date', required: true },
    { name: 'purpose', label: 'Purpose', type: 'text', placeholder: 'Client meeting, Site visit, etc.', required: true },
  ],
  'Hardware Purchase': [
    { name: 'itemName', label: 'Item Name', type: 'text', placeholder: 'e.g., Laptop, Mouse', required: true },
    { name: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g., Dell, HP', required: false },
    { name: 'model', label: 'Model', type: 'text', placeholder: 'Model number/name', required: false },
    { name: 'quantity', label: 'Quantity', type: 'number', placeholder: '1', required: true },
    { name: 'warranty', label: 'Warranty Period', type: 'text', placeholder: 'e.g., 1 year, 3 years', required: false },
    { name: 'vendorName', label: 'Vendor', type: 'text', placeholder: 'Seller/Shop name', required: false },
    { name: 'invoiceNumber', label: 'Invoice Number', type: 'text', placeholder: 'Invoice/Bill number', required: false },
  ],
  'Cloud Services': [
    { name: 'serviceName', label: 'Service Name', type: 'text', placeholder: 'e.g., AWS EC2, Azure Storage', required: true },
    { name: 'provider', label: 'Cloud Provider', type: 'select', options: ['AWS', 'Azure', 'Google Cloud', 'DigitalOcean', 'Other'], required: true },
    { name: 'billingCycle', label: 'Billing Cycle', type: 'select', options: ['Monthly', 'Pay-as-you-go'], required: true },
    { name: 'region', label: 'Region', type: 'text', placeholder: 'e.g., us-east-1, ap-south-1', required: false },
    { name: 'resourceType', label: 'Resource Type', type: 'text', placeholder: 'e.g., Compute, Storage, Database', required: false },
  ],
  'Marketing & Advertising': [
    { name: 'campaignName', label: 'Campaign Name', type: 'text', placeholder: 'Campaign/Ad name', required: true },
    { name: 'platform', label: 'Platform', type: 'select', options: ['Google Ads', 'Facebook', 'Instagram', 'LinkedIn', 'Twitter', 'Other'], required: true },
    { name: 'duration', label: 'Duration', type: 'text', placeholder: 'e.g., 7 days, 1 month', required: false },
    { name: 'targetAudience', label: 'Target Audience', type: 'text', placeholder: 'Demographics/Location', required: false },
  ],
  'Food & Beverages': [
    { name: 'occasion', label: 'Occasion', type: 'text', placeholder: 'e.g., Team lunch, Client dinner', required: true },
    { name: 'restaurant', label: 'Restaurant/Vendor', type: 'text', placeholder: 'Name of restaurant', required: false },
    { name: 'numberOfPeople', label: 'Number of People', type: 'number', placeholder: '0', required: false },
  ],
};

export default function DailyExpensesPage() {
  const [modal, setModal] = useState({ isOpen: false, mode: 'add' as 'add' | 'edit' | 'view', data: null as any });
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [formData, setFormData] = useState<any>({ date: '', category: '', subcategory: '', description: '', amount: '', paidBy: '', paymentMethod: 'UPI', status: 'Pending' });
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [subcategoryFilter, setSubcategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table');
  const [categorySpecificData, setCategorySpecificData] = useState<any>({});

  useEffect(() => {
    if (modal.isOpen) {
      if (modal.mode === 'edit' && modal.data) {
        setFormData(modal.data);
        setSelectedCategory(modal.data.category);
      } else {
        const today = new Date().toISOString().split('T')[0];
        setFormData({ date: today, category: '', subcategory: '', description: '', amount: '', paidBy: '', paymentMethod: 'UPI', status: 'Pending' });
        setSelectedCategory('');
      }
    }
  }, [modal]);

  const handleOpenModal = (mode: 'add' | 'edit' | 'view', expense: any = null) => {
    setModal({ isOpen: true, mode, data: expense });
  };

  const handleCloseModal = () => {
    setModal({ isOpen: false, mode: 'add', data: null });
  };

  const handleOpenRejectModal = (expense: any) => {
    setSelectedExpense(expense);
    setIsRejectModalOpen(true);
  };

  const handleApprove = (expense: any) => {
    toast.success(`Expense of ₹${expense.amount} approved`);
  };

  const handleReject = () => {
    toast.success('Expense rejected');
    setIsRejectModalOpen(false);
  };

  const handleDelete = (expense: any) => {
    toast.success(`Expense deleted`);
  };

  const handleExport = (format: 'excel' | 'csv' | 'pdf') => {
    toast.success(`Exporting to ${format.toUpperCase()}`);
  };

  const totalSpent = mockExpenses.reduce((sum, exp) => exp.status === 'Approved' ? sum + exp.amount : sum, 0);
  const pendingAmount = mockExpenses.reduce((sum, exp) => exp.status === 'Pending' ? sum + exp.amount : sum, 0);
  const rejectedCount = mockExpenses.filter(exp => exp.status === 'Rejected').length;
  const approvedCount = mockExpenses.filter(exp => exp.status === 'Approved').length;
  const pendingCount = mockExpenses.filter(exp => exp.status === 'Pending').length;

  // Multi-filter logic with search
  const filteredExpenses = mockExpenses.filter(exp => {
    const matchesStatus = statusFilter === 'all' || exp.status.toLowerCase() === statusFilter;
    const matchesCategory = categoryFilter === 'all' || exp.category === categoryFilter;
    const matchesSubcategory = subcategoryFilter === 'all' || exp.subcategory === subcategoryFilter;
    const matchesSearch = searchQuery === '' ||
      exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.paidBy.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesCategory && matchesSubcategory && matchesSearch;
  });

  const subcategories = expenseCategories[selectedCategory as keyof typeof expenseCategories] || [];

  // Get all available subcategories for the selected category filter
  const availableSubcategories = categoryFilter === 'all'
    ? []
    : expenseCategories[categoryFilter as keyof typeof expenseCategories] || [];

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setFormData((prev: any) => ({ ...prev, category: value, subcategory: '' }));
    setCategorySpecificData({}); // Clear category-specific data when category changes
  };

  const handleSubcategoryChange = (value: string) => {
    setFormData((prev: any) => ({ ...prev, subcategory: value }));
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      'Pending': 'secondary',
      'Approved': 'default',
      'Rejected': 'destructive'
    };
    return variants[status] || 'secondary';
  };

  const statusFilterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' }
  ];

  const categoryFilterOptions = [
    { label: 'All Categories', value: 'all' },
    ...Object.keys(expenseCategories).map(cat => ({ label: cat, value: cat }))
  ];

  const subcategoryFilterOptions = [
    { label: 'All Subcategories', value: 'all' },
    ...availableSubcategories.map(sub => ({ label: sub, value: sub }))
  ];

  return (
    <DashboardLayout>
      <div className="space-y-2 lg:space-y-3">
        <PageHeader
          title="Expenses"
          primaryAction={{
            label: 'Add Expense',
            onClick: () => handleOpenModal('add'),
            icon: Plus
          }}
        />

        {/* Compact KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-3">
          <div className="flex flex-col items-center justify-center px-3 py-2.5 rounded-lg bg-card border border-border shadow-sm min-h-[70px]">
            <div className="flex items-center gap-2 mb-1">
              <IndianRupee className="w-4 h-4 text-green-600" />
              <div className="text-2xl font-bold text-foreground">₹{(totalSpent / 1000).toFixed(0)}K</div>
            </div>
            <div className="text-xs text-muted-foreground text-center">Approved ({approvedCount})</div>
          </div>

          <div className="flex flex-col items-center justify-center px-3 py-2.5 rounded-lg bg-card border border-border shadow-sm min-h-[70px]">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-orange-600" />
              <div className="text-2xl font-bold text-foreground">₹{(pendingAmount / 1000).toFixed(0)}K</div>
            </div>
            <div className="text-xs text-muted-foreground text-center">Pending ({pendingCount})</div>
          </div>

          <div className="flex flex-col items-center justify-center px-3 py-2.5 rounded-lg bg-card border border-border shadow-sm min-h-[70px]">
            <div className="flex items-center gap-2 mb-1">
              <X className="w-4 h-4 text-red-600" />
              <div className="text-2xl font-bold text-foreground">{rejectedCount}</div>
            </div>
            <div className="text-xs text-muted-foreground text-center">Rejected</div>
          </div>

          <div className="flex flex-col items-center justify-center px-3 py-2.5 rounded-lg bg-card border border-border shadow-sm min-h-[70px]">
            <Link href="/finance/expenses/master" className="flex flex-col items-center justify-center w-full h-full">
              <Settings className="w-5 h-5 text-primary mb-1" />
              <div className="text-xs text-primary text-center">Manage Masters</div>
            </Link>
          </div>
        </div>

        {/* Expenses List with FilterExportBar */}
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
                },
                {
                  key: 'category',
                  label: 'Category',
                  options: categoryFilterOptions,
                  value: categoryFilter,
                  onChange: (value) => {
                    setCategoryFilter(value);
                    setSubcategoryFilter('all'); // Reset subcategory when category changes
                  }
                },
                {
                  key: 'subcategory',
                  label: 'Subcategory',
                  options: subcategoryFilterOptions,
                  value: subcategoryFilter,
                  onChange: setSubcategoryFilter
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
                placeholder: 'Search expenses...',
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
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Paid By</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExpenses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No expenses found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredExpenses.map((exp) => (
                        <TableRow key={exp.id}>
                          <TableCell>{exp.date}</TableCell>
                          <TableCell>
                            <div className="text-sm font-medium">{exp.category}</div>
                            {exp.subcategory && <div className="text-xs text-muted-foreground">{exp.subcategory}</div>}
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[200px]">
                              <p className="text-sm font-medium truncate">{exp.description}</p>
                              {exp.rejectionReason && (
                                <p className="text-xs text-red-600 mt-1">Reason: {exp.rejectionReason}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">₹{exp.amount.toLocaleString()}</TableCell>
                          <TableCell>{exp.paidBy}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadge(exp.status)} className="text-xs">
                              {exp.status}
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
                                <DropdownMenuItem onClick={() => handleOpenModal('view', exp)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {exp.status === 'Pending' && (
                                  <>
                                    <DropdownMenuItem onClick={() => handleApprove(exp)}>
                                      <Check className="w-4 h-4 mr-2 text-green-600" />
                                      Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleOpenRejectModal(exp)}>
                                      <X className="w-4 h-4 mr-2 text-red-600" />
                                      Reject
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                  </>
                                )}
                                <DropdownMenuItem onClick={() => handleOpenModal('edit', exp)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDelete(exp)}
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
                {filteredExpenses.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-muted-foreground">
                    No expenses found
                  </div>
                ) : (
                  filteredExpenses.map((exp) => (
                    <Card key={exp.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant={getStatusBadge(exp.status)} className="text-xs">
                                  {exp.status}
                                </Badge>
                                <span className="text-lg font-bold text-foreground">₹{exp.amount.toLocaleString()}</span>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleOpenModal('view', exp)}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {exp.status === 'Pending' && (
                                    <>
                                      <DropdownMenuItem onClick={() => handleApprove(exp)}>
                                        <Check className="w-4 h-4 mr-2 text-green-600" />
                                        Approve
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleOpenRejectModal(exp)}>
                                        <X className="w-4 h-4 mr-2 text-red-600" />
                                        Reject
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                    </>
                                  )}
                                  <DropdownMenuItem onClick={() => handleOpenModal('edit', exp)}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleDelete(exp)}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <p className="text-sm font-medium text-foreground">{exp.description}</p>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3 h-3 text-muted-foreground" />
                                <span className="text-muted-foreground">{exp.date}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-muted-foreground">By:</span>
                                <span className="font-medium truncate">{exp.paidBy}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-muted-foreground">Category:</span>
                                <span className="font-medium truncate">{exp.category}</span>
                              </div>
                              {exp.subcategory && (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-muted-foreground">Sub:</span>
                                  <span className="font-medium truncate">{exp.subcategory}</span>
                                </div>
                              )}
                            </div>
                            {exp.rejectionReason && (
                              <div className="mt-2 p-2 bg-red-50 border-l-2 border-red-500 text-xs text-red-800">
                                <strong>Rejected:</strong> {exp.rejectionReason}
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
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit/View Expense Modal */}
      <Dialog open={modal.isOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {modal.mode === 'view' ? 'View Expense Details' : modal.mode === 'edit' ? 'Edit Expense' : 'Add New Expense'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {/* Row 1: Date and Amount */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Date *</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  disabled={modal.mode === 'view'}
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Amount (INR) *</Label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  placeholder="0.00"
                  disabled={modal.mode === 'view'}
                  className="h-9"
                />
              </div>
            </div>

            {/* Row 2: Category and Subcategory */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Category *</Label>
                <Select value={selectedCategory} onValueChange={handleCategoryChange} disabled={modal.mode === 'view'}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(expenseCategories).map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Subcategory {subcategories.length > 0 ? '*' : ''}</Label>
                <Select value={formData.subcategory} onValueChange={handleSubcategoryChange} disabled={modal.mode === 'view' || subcategories.length === 0}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder={subcategories.length > 0 ? "Select subcategory" : "Select category first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategories.map((sc) => (
                      <SelectItem key={sc} value={sc}>{sc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dynamic Category-Specific Fields */}
            {selectedCategory && categoryFormFields[selectedCategory] && (
              <div className="space-y-3 p-3 bg-muted/30 rounded-lg border-2 border-dashed border-primary/20">
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-border"></div>
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                    {selectedCategory} Details
                  </span>
                  <div className="h-px flex-1 bg-border"></div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {categoryFormFields[selectedCategory].map((field: any) => (
                    <div key={field.name} className={field.name.includes('purpose') || field.name.includes('targetAudience') ? 'col-span-2' : ''}>
                      <div className="space-y-1.5">
                        <Label className="text-xs">{field.label} {field.required && '*'}</Label>
                        {field.type === 'select' ? (
                          <Select
                            value={categorySpecificData[field.name] || ''}
                            onValueChange={(val) => setCategorySpecificData({...categorySpecificData, [field.name]: val})}
                            disabled={modal.mode === 'view'}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder={`Select ${field.label.toLowerCase()}...`} />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options.map((opt: string) => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            type={field.type}
                            placeholder={field.placeholder}
                            value={categorySpecificData[field.name] || ''}
                            onChange={(e) => setCategorySpecificData({...categorySpecificData, [field.name]: e.target.value})}
                            disabled={modal.mode === 'view'}
                            className="h-9"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-xs">Description *</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter description"
                disabled={modal.mode === 'view'}
                className="h-9"
              />
            </div>

            {/* Row 3: Payment Method and Paid By */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Payment Method *</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(val) => setFormData({...formData, paymentMethod: val})}
                  disabled={modal.mode === 'view'}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Paid By *</Label>
                <Select
                  value={formData.paidBy}
                  onValueChange={(val) => setFormData({...formData, paidBy: val})}
                  disabled={modal.mode === 'view'}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTeamMembers.map((t) => (
                      <SelectItem key={t.id} value={t.fullName}>{t.fullName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Upload Bill/Receipt */}
            {modal.mode !== 'view' && (
              <div className="space-y-1.5">
                <Label className="text-xs">Upload Bill/Receipt (Multiple files)</Label>
                <Input type="file" multiple className="h-9" />
              </div>
            )}

            {/* Status Display in View Mode */}
            {modal.mode === 'view' && formData.status && (
              <div className="space-y-1.5">
                <Label className="text-xs">Status</Label>
                <div className="p-2 bg-muted rounded-md">
                  <Badge variant={getStatusBadge(formData.status)} className="text-xs">
                    {formData.status}
                  </Badge>
                </div>
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
                Save Expense
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Modal */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Expense</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this expense request from {selectedExpense?.paidBy}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <Label htmlFor="rejection-reason">Reason for Rejection *</Label>
            <Textarea
              id="rejection-reason"
              placeholder="e.g., Bill not attached, Expense exceeds policy limit..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject}>Confirm Rejection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
