'use client';

import { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Download, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import SearchBar from '@/components/SearchBar';
import ConfirmDialog from '@/components/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Type definitions
interface Customer {
  id: string;
  customerName: string;
  companyName: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  isActive: boolean;
  dateCreated: string;
}

interface FormErrors {
  customerName?: string;
  companyName?: string;
  contactEmail?: string;
  contactPhone?: string;
}

// Mock data - 10 customers
const MOCK_CUSTOMERS: Customer[] = [
  {
    id: '1',
    customerName: 'Acme Corporation',
    companyName: 'Acme Inc.',
    contactPerson: 'John Smith',
    contactEmail: 'john.smith@acme.com',
    contactPhone: '+1-555-0101',
    isActive: true,
    dateCreated: '2024-01-15',
  },
  {
    id: '2',
    customerName: 'Global Tech Solutions',
    companyName: 'Global Tech Ltd.',
    contactPerson: 'Sarah Johnson',
    contactEmail: 'sarah.j@globaltech.com',
    contactPhone: '+1-555-0102',
    isActive: true,
    dateCreated: '2024-02-10',
  },
  {
    id: '3',
    customerName: 'Premier Consulting Group',
    companyName: 'Premier Consulting',
    contactPerson: 'Michael Chen',
    contactEmail: 'mchen@premiercon.com',
    contactPhone: '+1-555-0103',
    isActive: true,
    dateCreated: '2024-02-20',
  },
  {
    id: '4',
    customerName: 'Digital Enterprise Services',
    companyName: 'Digital Enterprise',
    contactPerson: 'Emma Wilson',
    contactEmail: 'emma.wilson@digent.com',
    contactPhone: '+1-555-0104',
    isActive: false,
    dateCreated: '2024-03-05',
  },
  {
    id: '5',
    customerName: 'Innovative Systems Inc.',
    companyName: 'InnovateSys',
    contactPerson: 'David Martinez',
    contactEmail: 'd.martinez@innovatesys.com',
    contactPhone: '+1-555-0105',
    isActive: true,
    dateCreated: '2024-03-12',
  },
  {
    id: '6',
    customerName: 'Future-Forward Industries',
    companyName: 'FutureFwd Ind.',
    contactPerson: 'Rachel Brown',
    contactEmail: 'rbrown@futurefwd.com',
    contactPhone: '+1-555-0106',
    isActive: true,
    dateCreated: '2024-04-01',
  },
  {
    id: '7',
    customerName: 'NextGen Capital Partners',
    companyName: 'NextGen Capital',
    contactPerson: 'James Anderson',
    contactEmail: 'james.a@nextgencap.com',
    contactPhone: '+1-555-0107',
    isActive: true,
    dateCreated: '2024-04-18',
  },
  {
    id: '8',
    customerName: 'Quantum Business Solutions',
    companyName: 'Quantum Business',
    contactPerson: 'Lisa Taylor',
    contactEmail: 'lisa.taylor@quantumbus.com',
    contactPhone: '+1-555-0108',
    isActive: false,
    dateCreated: '2024-05-02',
  },
  {
    id: '9',
    customerName: 'Strategic Growth Partners',
    companyName: 'Strategic Growth',
    contactPerson: 'Robert Lee',
    contactEmail: 'rlee@strategicgrowth.com',
    contactPhone: '+1-555-0109',
    isActive: true,
    dateCreated: '2024-05-15',
  },
  {
    id: '10',
    customerName: 'Nexus Technology Group',
    companyName: 'Nexus Tech Group',
    contactPerson: 'Amanda Garcia',
    contactEmail: 'agarcia@nexustech.com',
    contactPhone: '+1-555-0110',
    isActive: true,
    dateCreated: '2024-06-01',
  },
];

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Form state
  const [formData, setFormData] = useState({
    customerName: '',
    companyName: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    isActive: true,
  });

  // Filter customers based on search
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        customer.customerName.toLowerCase().includes(searchLower) ||
        customer.companyName.toLowerCase().includes(searchLower) ||
        customer.contactPerson.toLowerCase().includes(searchLower) ||
        customer.contactEmail.toLowerCase().includes(searchLower)
      );
    });
  }, [customers, searchTerm]);

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true; // Phone is optional
    const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.customerName.trim()) {
      errors.customerName = 'Customer Name is required';
    }

    if (!formData.companyName.trim()) {
      errors.companyName = 'Company Name is required';
    }

    if (formData.contactEmail && !validateEmail(formData.contactEmail)) {
      errors.contactEmail = 'Please enter a valid email address';
    }

    if (formData.contactPhone && !validatePhone(formData.contactPhone)) {
      errors.contactPhone = 'Please enter a valid phone number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenDialog = (customer?: Customer) => {
    if (customer) {
      setEditingId(customer.id);
      setFormData({
        customerName: customer.customerName,
        companyName: customer.companyName,
        contactPerson: customer.contactPerson,
        contactEmail: customer.contactEmail,
        contactPhone: customer.contactPhone,
        isActive: customer.isActive,
      });
    } else {
      setEditingId(null);
      setFormData({
        customerName: '',
        companyName: '',
        contactPerson: '',
        contactEmail: '',
        contactPhone: '',
        isActive: true,
      });
    }
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingId(null);
    setFormData({
      customerName: '',
      companyName: '',
      contactPerson: '',
      contactEmail: '',
      contactPhone: '',
      isActive: true,
    });
    setFormErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (editingId) {
      // Update existing customer
      setCustomers(
        customers.map((c) =>
          c.id === editingId
            ? {
                ...c,
                ...formData,
              }
            : c
        )
      );
    } else {
      // Add new customer
      const newCustomer: Customer = {
        id: `${Math.max(...customers.map((c) => parseInt(c.id)), 0) + 1}`,
        ...formData,
        dateCreated: new Date().toISOString().split('T')[0],
      };
      setCustomers([...customers, newCustomer]);
    }

    handleCloseDialog();
  };

  const handleDeleteClick = (customer: Customer) => {
    setCustomerToDelete(customer);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (customerToDelete) {
      setCustomers(customers.filter((c) => c.id !== customerToDelete.id));
      setDeleteConfirmOpen(false);
      setCustomerToDelete(null);
    }
  };

  const handleExport = () => {
    const dataToExport = filteredCustomers.map((customer) => ({
      'Customer Name': customer.customerName,
      'Company Name': customer.companyName,
      'Contact Person': customer.contactPerson,
      'Email': customer.contactEmail,
      'Phone': customer.contactPhone,
      'Status': customer.isActive ? 'Active' : 'Inactive',
      'Date Created': customer.dateCreated,
    }));

    // For now, show a confirmation - in real app, would export to CSV/Excel
    alert(
      `Export functionality would export ${dataToExport.length} customer(s). In production, this would download a CSV or Excel file.`
    );
    console.log('Export data:', dataToExport);
  };

  const handleToggleStatus = (customer: Customer) => {
    setCustomers(
      customers.map((c) =>
        c.id === customer.id ? { ...c, isActive: !c.isActive } : c
      )
    );
  };

  return (
    <DashboardLayout>
      <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">
        {/* Header */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                Customer Management
              </h1>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleExport}
                variant="outline"
                className="flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
              <Button
                onClick={() => handleOpenDialog()}
                className="flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Customer</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-card rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-border">
          <SearchBar
            placeholder="Search customers by name, company, contact person, or email..."
            value={searchTerm}
            onChange={setSearchTerm}
            className="w-full"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <div className="bg-card rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-border">
            <div className="flex items-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full"></div>
              </div>
              <div className="ml-2 sm:ml-3 min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  Total Customers
                </p>
                <p className="text-lg sm:text-xl font-bold text-foreground">
                  {customers.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-border">
            <div className="flex items-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full"></div>
              </div>
              <div className="ml-2 sm:ml-3 min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  Active
                </p>
                <p className="text-lg sm:text-xl font-bold text-foreground">
                  {customers.filter((c) => c.isActive).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-border">
            <div className="flex items-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-destructive/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-destructive rounded-full"></div>
              </div>
              <div className="ml-2 sm:ml-3 min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  Inactive
                </p>
                <p className="text-lg sm:text-xl font-bold text-foreground">
                  {customers.filter((c) => !c.isActive).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-border">
            <div className="flex items-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full"></div>
              </div>
              <div className="ml-2 sm:ml-3 min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  This Month
                </p>
                <p className="text-lg sm:text-xl font-bold text-foreground">
                  {
                    customers.filter((c) => {
                      const date = new Date(c.dateCreated);
                      const now = new Date();
                      return (
                        date.getMonth() === now.getMonth() &&
                        date.getFullYear() === now.getFullYear()
                      );
                    }).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-card rounded-lg sm:rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border">
            <h2 className="text-base sm:text-lg font-semibold text-foreground">
              Customers ({filteredCustomers.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Customer Name
                  </th>
                  <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Company
                  </th>
                  <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Contact Person
                  </th>
                  <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="hidden xl:table-cell px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Date Created
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-accent transition-colors">
                      {/* Customer Name */}
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-primary-foreground font-bold text-xs sm:text-sm">
                              {customer.customerName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()
                                .slice(0, 2)}
                            </span>
                          </div>
                          <div className="ml-3 sm:ml-4">
                            <div className="text-sm font-medium text-foreground truncate max-w-[120px] sm:max-w-none">
                              {customer.customerName}
                            </div>
                            <div className="text-xs text-muted-foreground sm:hidden truncate max-w-[120px]">
                              {customer.companyName}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Company - Hidden on mobile */}
                      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-foreground truncate">
                          {customer.companyName}
                        </div>
                      </td>

                      {/* Contact Person - Hidden on mobile/tablet */}
                      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-foreground truncate max-w-[150px]">
                          {customer.contactPerson}
                        </div>
                      </td>

                      {/* Contact Info - Hidden on mobile/tablet */}
                      <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-foreground truncate max-w-[200px]">
                          {customer.contactEmail}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {customer.contactPhone}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(customer)}
                          className="cursor-pointer"
                        >
                          {customer.isActive ? (
                            <Badge variant="default">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              Inactive
                            </Badge>
                          )}
                        </button>
                      </td>

                      {/* Date Created - Hidden on mobile/tablet */}
                      <td className="hidden xl:table-cell px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {new Date(customer.dateCreated).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-1 sm:space-x-2">
                          <button
                            onClick={() => handleOpenDialog(customer)}
                            className="p-1 sm:p-1.5 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-500/10 rounded-md transition-colors"
                            title="Edit Customer"
                          >
                            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(customer)}
                            className="p-1 sm:p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                            title="Delete Customer"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 sm:px-6 py-8">
                      <div className="text-center">
                        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                        <h3 className="text-sm font-medium text-foreground mb-1">
                          No customers found
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Try adjusting your search criteria or add a new customer.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Customer Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Edit Customer' : 'Add New Customer'}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? 'Update customer information'
                : 'Create a new customer record'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer Name */}
              <div className="space-y-2">
                <Label htmlFor="customerName">
                  Customer Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="customerName"
                  placeholder="Enter customer name"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      customerName: e.target.value,
                    })
                  }
                  className={
                    formErrors.customerName
                      ? 'border-destructive focus:ring-destructive/20'
                      : ''
                  }
                />
                {formErrors.customerName && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {formErrors.customerName}
                  </p>
                )}
              </div>

              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="companyName">
                  Company Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="companyName"
                  placeholder="Enter company name"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      companyName: e.target.value,
                    })
                  }
                  className={
                    formErrors.companyName
                      ? 'border-destructive focus:ring-destructive/20'
                      : ''
                  }
                />
                {formErrors.companyName && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {formErrors.companyName}
                  </p>
                )}
              </div>

              {/* Contact Person */}
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input
                  id="contactPerson"
                  placeholder="Enter contact person name"
                  value={formData.contactPerson}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactPerson: e.target.value,
                    })
                  }
                />
              </div>

              {/* Contact Email */}
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="Enter contact email"
                  value={formData.contactEmail}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactEmail: e.target.value,
                    })
                  }
                  className={
                    formErrors.contactEmail
                      ? 'border-destructive focus:ring-destructive/20'
                      : ''
                  }
                />
                {formErrors.contactEmail && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {formErrors.contactEmail}
                  </p>
                )}
              </div>

              {/* Contact Phone */}
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  placeholder="Enter contact phone"
                  value={formData.contactPhone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactPhone: e.target.value,
                    })
                  }
                  className={
                    formErrors.contactPhone
                      ? 'border-destructive focus:ring-destructive/20'
                      : ''
                  }
                />
                {formErrors.contactPhone && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {formErrors.contactPhone}
                  </p>
                )}
              </div>

              {/* Is Active Switch */}
              <div className="space-y-2">
                <Label htmlFor="isActive" className="flex items-center justify-between">
                  <span>Active Status</span>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        isActive: checked,
                      })
                    }
                  />
                </Label>
              </div>
            </div>

            {/* Dialog Footer */}
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {editingId ? 'Update' : 'Create'} Customer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        variant="danger"
        title="Delete Customer"
        description={`Are you sure you want to delete "${customerToDelete?.customerName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
      />
    </DashboardLayout>
  );
}