// Mock data for Assets module

export interface AssetStats {
  total: number;
  active: number;
  inStock: number;
  issued: number;
  inRepair: number;
  scrapped: number;
}

export interface RecentActivity {
  id: string;
  type: 'issued' | 'returned' | 'repair' | 'purchase' | 'scrapped';
  action: string;
  assetName: string;
  category: string;
  message: string;
  timestamp: string;
  user: string;
}

export interface Asset {
  id: string;
  assetId: string;
  assetName: string;
  category: string;
  serialNumber: string;
  modelNumber: string;
  qty: number;
  unit: string;
  cost: number;
  status: 'In Stock' | 'Issued' | 'In Repair' | 'Scrapped';
  procuredBy: string;
  issuedTo?: string;
  issueDate?: string;
  warrantyType?: string;
  warrantyDays?: number;
  expiryDate?: string;
  description?: string;
  assetType?: 'New' | 'Used' | 'Refurbished';
}

export interface Category {
  id: number;
  name: string;
  unit: string;
  trackingType: 'Individual' | 'Bulk';
}

export interface MeasurementUnit {
  id: number;
  name: string;
}

export interface TeamMember {
  id: number;
  name: string;
  fullName: string;
  email: string;
  department: string;
}

export interface Expense {
  id: string;
  date: string;
  category: string;
  subcategory: string;
  description: string;
  amount: number;
  paidBy: string;
  paymentMethod: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  rejectionReason?: string;
  rejectedBy?: string;
  bill?: string;
}

export interface ExpenseCategory {
  id: number;
  name: string;
}

export interface ExpenseSubcategory {
  id: number;
  name: string;
  categoryId: number;
}

export interface Subscription {
  id: string;
  serviceName: string;
  vendorName: string;
  gstNumber: string;
  plan: string;
  cost: number;
  billingCycle: string;
  paymentDate: string;
  nextBillingDate: string;
  paymentMethod: string;
  transactionId?: string;
  owner: string;
  status: 'Active' | 'Cancelled';
}

export interface Purchase {
  entryNumber: string;
  purchaseDate: string;
  supplierName: string;
  billNumber: string;
  billDate: string;
  challanNumber: string;
  challanDate: string;
  procuredBy: string;
  attachments?: string[];
  items: PurchaseItem[];
}

export interface PurchaseItem {
  id: string;
  assetId: string;
  assetName: string;
  category: string;
  unit: string;
  modelNumber: string;
  serialNumber: string;
  warrantyType: string;
  warrantyDays: number;
  qty: number;
  rate: number;
  amount: number;
}

export interface TransactionLog {
  id: string;
  assetName: string;
  assetId: string;
  action: 'Issued' | 'Returned' | 'Repair' | 'Scrapped';
  from?: string;
  to?: string;
  date: string;
  remarks?: string;
}

export interface RepairHistory {
  id: string;
  assetName: string;
  assetId: string;
  vendor: string;
  problemDescription: string;
  cost: number;
  sentDate: string;
  returnDate?: string;
  status: 'In Repair' | 'Completed';
}

export interface WarrantyStatus {
  id: string;
  assetName: string;
  assetId: string;
  category: string;
  warrantyType: string;
  expiryDate: string;
  daysRemaining: number;
  status: 'Active' | 'Expiring Soon' | 'Expired';
}

export interface AssetHistory {
  id: string;
  action: string;
  timestamp: string;
  description: string;
}

// Mock Stats Data
export const mockAssetStats: AssetStats = {
  total: 245,
  active: 245,
  inStock: 128,
  issued: 89,
  inRepair: 15,
  scrapped: 13
};

// Mock Recent Activities
export const mockRecentActivities: RecentActivity[] = [
  {
    id: '1',
    type: 'issued',
    action: 'Issued',
    assetName: 'Laptop Dell Latitude 5420',
    category: 'Electronics',
    message: 'Laptop Dell Latitude 5420 issued to John Doe',
    timestamp: '2 hours ago',
    user: 'John Doe'
  },
  {
    id: '2',
    type: 'returned',
    action: 'Returned',
    assetName: 'Monitor Samsung 24"',
    category: 'Electronics',
    message: 'Monitor Samsung 24" returned by Jane Smith',
    timestamp: '5 hours ago',
    user: 'Jane Smith'
  },
  {
    id: '3',
    type: 'repair',
    action: 'Repaired',
    assetName: 'Printer HP LaserJet',
    category: 'Electronics',
    message: 'Printer HP LaserJet sent for repair',
    timestamp: '1 day ago',
    user: 'IT Support'
  },
  {
    id: '4',
    type: 'purchase',
    action: 'Created',
    assetName: 'Wireless Mouse Logitech M185',
    category: 'Electronics',
    message: 'New purchase: 10 Wireless Mouse Logitech M185',
    timestamp: '2 days ago',
    user: 'Purchase Manager'
  },
  {
    id: '5',
    type: 'scrapped',
    action: 'Scrapped',
    assetName: 'Desktop Dell OptiPlex 3020',
    category: 'Electronics',
    message: 'Old Desktop Dell OptiPlex 3020 marked as scrapped',
    timestamp: '3 days ago',
    user: 'Admin User'
  }
];

// Mock Assets Data
export const mockAssets: Asset[] = [
  {
    id: '1',
    assetId: 'AST-001',
    assetName: 'Laptop Dell Latitude 5420',
    category: 'Electronics',
    serialNumber: 'DL5420-2024-001',
    modelNumber: 'Latitude 5420',
    qty: 1,
    unit: 'Piece',
    cost: 65000,
    status: 'Issued',
    procuredBy: 'IT Department',
    issuedTo: 'John Doe',
    issueDate: '2024-10-15',
    warrantyType: 'Manufacturer',
    warrantyDays: 730,
    expiryDate: '2026-10-15',
    assetType: 'New'
  },
  {
    id: '2',
    assetId: 'AST-002',
    assetName: 'Monitor Samsung 24"',
    category: 'Electronics',
    serialNumber: 'SM24-2024-045',
    modelNumber: 'S24R350',
    qty: 1,
    unit: 'Piece',
    cost: 12000,
    status: 'In Stock',
    procuredBy: 'IT Department',
    warrantyType: 'Manufacturer',
    warrantyDays: 365,
    expiryDate: '2025-11-20',
    assetType: 'New'
  },
  {
    id: '3',
    assetId: 'AST-003',
    assetName: 'Printer HP LaserJet Pro M404dn',
    category: 'Electronics',
    serialNumber: 'HP404-2023-012',
    modelNumber: 'M404dn',
    qty: 1,
    unit: 'Piece',
    cost: 18500,
    status: 'In Repair',
    procuredBy: 'Admin Department',
    warrantyType: 'Extended',
    warrantyDays: 1095,
    expiryDate: '2026-08-30',
    assetType: 'New'
  }
];

// Mock Categories
export const mockCategories: Category[] = [
  { id: 1, name: 'Electronics', unit: 'Piece', trackingType: 'Individual' },
  { id: 2, name: 'Furniture', unit: 'Piece', trackingType: 'Individual' },
  { id: 3, name: 'Stationery', unit: 'Box', trackingType: 'Bulk' },
  { id: 4, name: 'Software License', unit: 'License', trackingType: 'Individual' },
  { id: 5, name: 'Office Supplies', unit: 'Pack', trackingType: 'Bulk' }
];

// Mock Measurement Units
export const mockUnits: MeasurementUnit[] = [
  { id: 1, name: 'Piece' },
  { id: 2, name: 'Box' },
  { id: 3, name: 'Pack' },
  { id: 4, name: 'License' },
  { id: 5, name: 'Set' },
  { id: 6, name: 'Unit' }
];

// Mock Expenses
export const mockExpenses: Expense[] = [
  {
    id: '1',
    date: '2024-11-06',
    category: 'Office Supplies',
    subcategory: 'Stationery',
    description: 'A4 Paper - 10 Reams',
    amount: 2500,
    paidBy: 'Petty Cash',
    paymentMethod: 'Cash',
    status: 'Pending'
  },
  {
    id: '2',
    date: '2024-11-05',
    category: 'Travel',
    subcategory: 'Local Transport',
    description: 'Client meeting travel',
    amount: 850,
    paidBy: 'John Doe',
    paymentMethod: 'UPI',
    status: 'Approved'
  },
  {
    id: '3',
    date: '2024-11-04',
    category: 'Utilities',
    subcategory: 'Internet',
    description: 'Monthly internet bill',
    amount: 1200,
    paidBy: 'Company Account',
    paymentMethod: 'Auto-debit',
    status: 'Approved'
  }
];

// Mock Expense Categories
export const mockExpenseCategories: ExpenseCategory[] = [
  { id: 1, name: 'Office Supplies' },
  { id: 2, name: 'Travel' },
  { id: 3, name: 'Utilities' },
  { id: 4, name: 'Food & Beverages' },
  { id: 5, name: 'Maintenance' }
];

// Mock Expense Subcategories
export const mockExpenseSubcategories: ExpenseSubcategory[] = [
  { id: 1, name: 'Stationery', categoryId: 1 },
  { id: 2, name: 'Pantry Items', categoryId: 1 },
  { id: 3, name: 'Local Transport', categoryId: 2 },
  { id: 4, name: 'Outstation Travel', categoryId: 2 },
  { id: 5, name: 'Electricity', categoryId: 3 },
  { id: 6, name: 'Internet', categoryId: 3 },
  { id: 7, name: 'Team Lunch', categoryId: 4 },
  { id: 8, name: 'Client Dinner', categoryId: 4 },
  { id: 9, name: 'AC Service', categoryId: 5 },
  { id: 10, name: 'Plumbing', categoryId: 5 }
];

// Mock Subscriptions
export const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    serviceName: 'Microsoft 365 Business',
    vendorName: 'Microsoft Corporation',
    gstNumber: '29AABCT1332L1ZT',
    plan: 'Business Premium',
    cost: 12500,
    billingCycle: 'Monthly',
    paymentDate: '2024-11-01',
    nextBillingDate: '2024-12-01',
    paymentMethod: 'Credit Card',
    transactionId: 'TXN-MS-001',
    owner: 'IT Department',
    status: 'Active'
  },
  {
    id: '2',
    serviceName: 'Adobe Creative Cloud',
    vendorName: 'Adobe Systems',
    gstNumber: '27AABCA1234M1Z5',
    plan: 'All Apps',
    cost: 3999,
    billingCycle: 'Monthly',
    paymentDate: '2024-11-05',
    nextBillingDate: '2024-12-05',
    paymentMethod: 'Credit Card',
    transactionId: 'TXN-ADO-002',
    owner: 'Design Team',
    status: 'Active'
  }
];

// Mock Transaction Logs
export const mockTransactionLogs: TransactionLog[] = [
  {
    id: '1',
    assetName: 'Laptop Dell Latitude 5420',
    assetId: 'AST-001',
    action: 'Issued',
    to: 'John Doe',
    date: '2024-10-15',
    remarks: 'Regular assignment'
  },
  {
    id: '2',
    assetName: 'Monitor Samsung 24"',
    assetId: 'AST-002',
    action: 'Returned',
    from: 'Jane Smith',
    date: '2024-11-06',
    remarks: 'Project completed'
  }
];

// Mock Repair History
export const mockRepairHistory: RepairHistory[] = [
  {
    id: '1',
    assetName: 'Printer HP LaserJet Pro M404dn',
    assetId: 'AST-003',
    vendor: 'HP Service Center',
    problemDescription: 'Paper jam issue, needs roller replacement',
    cost: 2500,
    sentDate: '2024-11-04',
    status: 'In Repair'
  }
];

// Mock Warranty Status
export const mockWarrantyStatus: WarrantyStatus[] = [
  {
    id: '1',
    assetName: 'Laptop Dell Latitude 5420',
    assetId: 'AST-001',
    category: 'Electronics',
    warrantyType: 'Manufacturer',
    expiryDate: '2026-10-15',
    daysRemaining: 678,
    status: 'Active'
  },
  {
    id: '2',
    assetName: 'Monitor Samsung 24"',
    assetId: 'AST-002',
    category: 'Electronics',
    warrantyType: 'Manufacturer',
    expiryDate: '2025-11-20',
    daysRemaining: 14,
    status: 'Expiring Soon'
  }
];

// Mock Team Members
export const mockTeamMembers: TeamMember[] = [
  { id: 1, name: 'Dev', fullName: 'Dev', email: 'john.doe@company.com', department: 'IT' },
  { id: 2, name: 'Shubham', fullName: 'Shubham', email: 'jane.smith@company.com', department: 'HR' },
  { id: 3, name: 'Geet', fullName: 'Geet', email: 'mike.johnson@company.com', department: 'Finance' },
  { id: 4, name: 'Gyanii', fullName: 'Gyanii', email: 'sarah.williams@company.com', department: 'Marketing' },
  { id: 5, name: 'Praveen', fullName: 'Praveen', email: 'david.brown@company.com', department: 'IT' },
  { id: 6, name: 'Raj', fullName: 'Raj', email: 'emily.davis@company.com', department: 'Operations' },
  { id: 7, name: 'Robert Miller', fullName: 'Robert Miller', email: 'robert.miller@company.com', department: 'Sales' },
  { id: 8, name: 'Lisa Anderson', fullName: 'Lisa Anderson', email: 'lisa.anderson@company.com', department: 'Admin' },
  { id: 9, name: 'James Wilson', fullName: 'James Wilson', email: 'james.wilson@company.com', department: 'IT' },
  { id: 10, name: 'Maria Garcia', fullName: 'Maria Garcia', email: 'maria.garcia@company.com', department: 'HR' }
];

// Mock Asset History
export const mockAssetHistory: AssetHistory[] = [
  {
    id: '1',
    action: 'Asset Created',
    timestamp: '2024-10-15 10:00 AM',
    description: 'Asset added to inventory by IT Department'
  },
  {
    id: '2',
    action: 'Issued',
    timestamp: '2024-10-15 02:30 PM',
    description: 'Asset issued to John Doe for regular assignment'
  },
  {
    id: '3',
    action: 'Returned',
    timestamp: '2024-11-01 09:15 AM',
    description: 'Asset returned by John Doe - project completed'
  },
  {
    id: '4',
    action: 'Repair',
    timestamp: '2024-11-02 11:00 AM',
    description: 'Asset sent for repair - hardware malfunction'
  },
  {
    id: '5',
    action: 'Repair Completed',
    timestamp: '2024-11-05 04:00 PM',
    description: 'Asset repaired and ready for reuse'
  }
];

// Alias for compatibility
export const mockTransactions = mockTransactionLogs;
