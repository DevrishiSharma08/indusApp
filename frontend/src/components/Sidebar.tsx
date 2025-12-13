'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  ClipboardList,
  MessageSquare,
  Settings,
  FileText,
  Users,
  Briefcase,
  KanbanSquare,
  Landmark,
  Ticket,
  Package,
  Calendar,
  IndianRupee,
  BarChart3,
  UserPlus,
  BookOpen,
  Zap,
  Target,
  CalendarCheck,
  ListTodo,
  Clock,
  Network,
  Upload,
  UserCog,
  LifeBuoy,
  TestTube2,
  FileSpreadsheet,
  UsersRound,
  Archive,
  PlusCircle,
  FolderKanban,
  DollarSign,
  CreditCard,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const pathname = usePathname();

  // Detect current module from pathname
  const getCurrentModule = () => {
    if (pathname.startsWith('/hrm')) return 'hrm';
    if (pathname.startsWith('/CRM')) return 'crm';
    if (pathname.startsWith('/projectmanagement')) return 'projectmanagement';
    if (pathname.startsWith('/ticketmanagement')) return 'ticketmanagement';
    if (pathname.startsWith('/assets')) return 'assets';
    if (pathname.startsWith('/finance')) return 'finance';
    return 'dashboard';
  };

  const currentModule = getCurrentModule();

  // Module-specific navigation
  const moduleNavigations = {
    hrm: [
      { icon: Home, label: 'HRM Dashboard', href: '/hrm' },
      { icon: Users, label: 'All Team Members', href: '/hrm/employees' },
      { icon: UserPlus, label: 'Add Team Member', href: '/hrm/employees/add' },
      { icon: Calendar, label: 'Leave & Attendance', href: '/hrm/leave-attendance' },
      { icon: IndianRupee, label: 'Payroll', href: '/hrm/payroll' },
      { icon: Settings, label: 'HR Settings', href: '/hrm/settings' },
    ],
    crm: [
      { icon: Home, label: 'CRM Dashboard', href: '/crm' },
      { icon: Target, label: 'Leads', href: '/crm/leads' },
      // { icon: UserPlus, label: 'Create Lead', href: '/crm/create-lead' },
      { icon: Briefcase, label: 'Clients', href: '/crm/clients' },
      { icon: CalendarCheck, label: 'Activity', href: '/crm/activity' },
      { icon: ListTodo, label: 'Tasks', href: '/crm/tasks' },
      { icon: Calendar, label: 'Events', href: '/crm/events' },
      // { icon: Clock, label: 'Schedule', href: '/CRM/schedule' },
      { icon: Network, label: 'Drip Sequence', href: '/crm/drip-sequence' },
      { icon: FileText, label: 'Proposals', href: '/crm/proposals' },
      { icon: BarChart3, label: 'Reports', href: '/crm/reports' },
      // { icon: MessageSquare, label: 'Messages', href: '/CRM/message-master' },
      // { icon: Upload, label: 'Bulk Upload', href: '/CRM/bulk-upload' },
      // { icon: UserCog, label: 'Manage Users', href: '/CRM/manage-users' },
      { icon: Settings, label: 'Masters', href: '/crm/settings' },
    ],
    projectmanagement: [
      { icon: Home, label: 'PM Dashboard', href: '/projectmanagement/dashboard' },
      { icon: FileText, label: 'All Projects', href: '/projectmanagement/projects' },
      { icon: BarChart3, label: 'Reports', href: '/projectmanagement/reports' },
      { icon: BookOpen, label: 'Wiki', href: '/projectmanagement/wiki' },
      { icon: Zap, label: 'Automation', href: '/projectmanagement/automation' },
    ],
    ticketmanagement: [
      { icon: Home, label: 'TM Dashboard', href: '/ticketmanagement' },   
      { icon: Ticket, label: 'All Tickets', href: '/ticketmanagement/tickets' },
      { icon: UserPlus, label: 'Create Ticket', href: '/ticketmanagement/tickets/create' },
      { icon: ClipboardList, label: 'My Work', href: '/ticketmanagement/my-work' },
      { icon: LifeBuoy, label: 'Support Center', href: '/ticketmanagement/support' },
      { icon: TestTube2, label: 'Testing/QC', href: '/ticketmanagement/testing' },
      { icon: FileSpreadsheet, label: 'Time Reports', href: '/ticketmanagement/reports' },
      // { icon: UsersRound, label: 'Customers', href: '/ticketmanagement/customers' },
    ],
    assets: [
      { icon: Home, label: 'Assets Dashboard', href: '/assets' },
      { icon: Archive, label: 'All Assets', href: '/assets/all' },
      { icon: PlusCircle, label: 'Add Purchase', href: '/assets/add' },
      // { icon: Users, label: 'My Assets', href: '/assets/my-assets' },
      { icon: FolderKanban, label: 'Masters', href: '/assets/categories' },
      // { icon: DollarSign, label: 'Expenses', href: '/assets/expenses' },
      // { icon: CreditCard, label: 'Subscriptions', href: '/assets/subscriptions' },
      { icon: BarChart3, label: 'Reports', href: '/assets/reports' },
    ],
    finance: [
      { icon: Home, label: 'Finance Dashboard', href: '/finance' },
      { icon: IndianRupee, label: 'Expenses', href: '/finance/expenses' },
      { icon: CreditCard, label: 'Subscriptions', href: '/finance/subscriptions' },
      { icon: FileText, label: 'Invoices', href: '/finance/invoices' }, 
      { icon: BarChart3, label: 'Reports', href: '/finance/reports' },
    ],
  };

  const navigationItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: ClipboardList, label: 'My Tasks', href: '/tasks' },
    { icon: MessageSquare, label: 'Messages', href: '/messages' },
  ];

  const moduleItems = [
    { icon: Users, label: 'HRM', href: '/hrm' },
    { icon: Briefcase, label: 'CRM', href: '/crm' },
    { icon: KanbanSquare, label: 'Projects & Tasks', href: '/projectmanagement/dashboard' },
    { icon: Ticket, label: 'Ticket Management', href: '/ticketmanagement' },
    { icon: Package, label: 'Assets', href: '/assets' },
    { icon: Landmark, label: 'Finance', href: '/finance' },
  ];

  const bottomItems = [
    { icon: FileText, label: 'Reports', href: '/reports' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  // Get navigation items based on current module
  const getNavigationItems = () => {
    if (currentModule !== 'dashboard') {
      return moduleNavigations[currentModule as keyof typeof moduleNavigations] || navigationItems;
    }
    return navigationItems;
  };

  const navItems = getNavigationItems();

  return (
    <div className={`fixed left-0 top-14 h-[calc(100vh-3.5rem)] bg-card border-r border-border transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } hidden lg:block z-40`}>
      <div className="flex flex-col h-full">
        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4">
          {/* Show module navigation if in a module, otherwise show default nav */}
          {currentModule !== 'dashboard' ? (
            <nav className="space-y-1 px-3">
              {navItems.map((item, index) => {
                const IconComponent = item.icon;
                const isActive = pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={index}
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-accent'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="ml-3 font-medium">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </nav>
          ) : (
            <>
              <nav className="space-y-1 px-3">
                {navigationItems.map((item, index) => {
                  const IconComponent = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={index}
                      href={item.href}
                      className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground hover:bg-accent'
                      }`}
                    >
                      <IconComponent className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="ml-3 font-medium">{item.label}</span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Modules Section - Only on Dashboard */}
              <div className="mt-6 px-3">
                {!isCollapsed && (
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Modules
                  </h3>
                )}
                <nav className="space-y-1">
                  {moduleItems.map((item, index) => {
                    const IconComponent = item.icon;
                  
                  
                    return (
                      <Link
                        key={index}
                        href={item.href}
                        className="flex items-center px-3 py-2 rounded-lg text-foreground hover:bg-accent transition-colors"
                      >
                        <IconComponent className="w-5 h-5 flex-shrink-0" />
                        {!isCollapsed && (
                          <span className="ml-3 font-medium">{item.label}</span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </>
          )}
        </div>

        {/* Bottom Items */}
        <div className="p-3 border-t border-border">
          {/* Back to Dashboard button when in a module */}
          {currentModule !== 'dashboard' && (
            <nav className="space-y-1 mb-2">
              <Link
                href="/dashboard"
                className="flex items-center px-3 py-2 rounded-lg text-foreground hover:bg-accent transition-colors border border-border"
              >
                <Home className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="ml-3 font-medium">Back to Home</span>
                )}
              </Link>
            </nav>
          )}

          <nav className="space-y-1">
            {bottomItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-center px-3 py-2 rounded-lg text-foreground hover:bg-accent transition-colors"
                >
                  <IconComponent className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="ml-3 font-medium">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;