'use client';

import { X, Home, Users, UserPlus, Building2, Award, Calendar, FileText, IndianRupee, BarChart3, Settings, KanbanSquare, ListTodo, Clock, GitBranch, Zap, BookOpen, Share2, MapPin, Ticket, ClipboardList, LifeBuoy, TestTube2, FileSpreadsheet, UsersRound, Package, Archive, PlusCircle, CreditCard, FolderKanban, DollarSign, Briefcase, Target, Upload, MessageSquare, Video, CalendarCheck, FileBarChart, Network, Mail, UserCog } from 'lucide-react';
import Link from 'next/link';

interface ModuleSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentModule: string;
  currentPath: string;                   
}

const ModuleSidebar = ({ isOpen, onClose, currentModule, currentPath }: ModuleSidebarProps) => {
  // Module configurations
  const moduleConfigs = {
    dashboard: {
      title: 'Main Menu',
      items: [
        { name: 'Home', icon: Home, path: '/dashboard' },
        { name: 'HRM', icon: Users, path: '/hrm' },
        { name: 'CRM', icon: Building2, path: '/crm' },
        { name: 'Projects & Tasks', icon: FileText, path: '/projectmanagement' },
        { name: 'Ticket Management', icon: Ticket, path: '/ticketmanagement' },
        { name: 'Assets', icon: Package, path: '/assets' },
        { name: 'Finance', icon: IndianRupee, path: '/finance' },
      ]
    },
    hrm: {
      title: 'HRM Menu',
      items: [
        { name: 'HRM Dashboard', icon: Home, path: '/hrm' },
        { name: 'All Team Members', icon: Users, path: '/hrm/employees' },
        { name: 'Add Team Member', icon: UserPlus, path: '/hrm/employees/add' },
        { name: 'Leave & Attendance', icon: Calendar, path: '/hrm/leave-attendance' },
        { name: 'Payroll', icon: IndianRupee, path: '/hrm/payroll' },
        // { name: 'Departments', icon: Building2, path: '/hrm/departments' },
        // { name: 'Designations', icon: Award, path: '/hrm/designations' },
        { name: 'HR Settings', icon: Settings, path: '/hrm/settings' },
      ]
    },
   crm: {
      title: 'CRM Menu',
      items: [
        { name: 'CRM Dashboard', icon: Home, path: '/crm' },
        { name: 'Leads', icon: Target, path: '/crm/leads' },
        // { name: 'Create Lead', icon: UserPlus, path: '/crm/create-lead' },
       
        
        // { name: 'Tasks', icon: ListTodo, path: '/crm/tasks' },
        { name: 'Events', icon: Calendar, path: '/crm/events' },
        // { name: 'Schedule', icon: Clock, path: '/crm/schedule' },
        { name: 'Drip & Messages', icon: MessageSquare, path: '/crm/drip-sequences' },
        { name: 'Proposals', icon: FileText, path: '/crm/proposals' },
        { name: 'Reports', icon: BarChart3, path: '/crm/reports' },
        // { name: 'Bulk Upload', icon: Upload, path: '/crm/bulk-upload' },
        { name: 'Settings', icon: Settings, path: '/crm/settings' },
      ]
    },
     projectmanagement: {
      title: 'Project Management',
      items: [
        { name: 'PM Dashboard', icon: Home, path: '/projectmanagement' },
        { name: 'All Projects', icon: FileText, path: '/projectmanagement/projects' },
        // { name: 'Board View', icon: KanbanSquare, path: '/projectmanagement/board' },
        // { name: 'Sprints', icon: Zap, path: '/projectmanagement/sprints' },
        // { name: 'Gantt Chart', icon: GitBranch, path: '/projectmanagement/gantt' },
        // { name: 'Time Log', icon: Clock, path: '/projectmanagement/time-log' },
        { name: 'Reports', icon: BarChart3, path: '/projectmanagement/reports' },
        { name: 'Wiki', icon: BookOpen, path: '/projectmanagement/wiki' },
        // { name: 'Integrations', icon: Share2, path: '/projectmanagement/integrations' },
        // { name: 'Automation', icon: Zap, path: '/projectmanagement/automation' },
      ]
    },
    // tasks: {
    //   title: 'Tasks Menu',
    //   items: [
    //     { name: 'Tasks Dashboard', icon: Home, path: '/tasks' },
    //     { name: 'My Tasks', icon: Calendar, path: '/tasks/my' },
    //     { name: 'Create Task', icon: UserPlus, path: '/tasks/create' },
    //     { name: 'Task Reports', icon: BarChart3, path: '/tasks/reports' },
    //   ]
    // },
    finance: {
      title: 'Finance Menu',
      items: [
        { name: 'Finance Dashboard', icon: Home, path: '/finance' },
        { name: 'Expenses', icon: IndianRupee, path: '/finance/expenses' },
        { name: 'Sales Management', icon: DollarSign, path: '/finance/sales-mgmt' },
        // { name: 'Invoices', icon: FileText, path: '/finance/invoices' },
        { name: 'Reports', icon: BarChart3, path: '/finance/reports' },
      ]
    },
    ticketmanagement: {
      title: 'Ticket Management',
      items: [
        { name: 'TM Dashboard', icon: Home, path: '/ticketmanagement' },    
        { name: 'All Tickets', icon: Ticket, path: '/ticketmanagement/tickets' },
        { name: 'Create Ticket', icon: UserPlus, path: '/ticketmanagement/tickets/create' },
        { name: 'My Work', icon: ClipboardList, path: '/ticketmanagement/my-work' },
        { name: 'Support Center', icon: LifeBuoy, path: '/ticketmanagement/support' },
        { name: 'Testing/QC', icon: TestTube2, path: '/ticketmanagement/testing' },
        { name: 'Time Reports', icon: FileSpreadsheet, path: '/ticketmanagement/reports' },
        // { name: 'Customers', icon: UsersRound, path: '/ticketmanagement/customers' },
      ]
    },
    assets: {
      title: 'Asset Management',
      items: [
        { name: 'Assets Dashboard', icon: Home, path: '/assets' },
        { name: 'All Assets', icon: Archive, path: '/assets/all' },
        { name: 'Add Purchase', icon: PlusCircle, path: '/assets/add' },
        // { name: 'My Assets', icon: Users, path: '/assets/my-assets' },
        { name: 'Masters', icon: FolderKanban, path: '/assets/categories' },
        // { name: 'Expenses', icon: DollarSign, path: '/assets/expenses' },
        // { name: 'Subscriptions', icon: CreditCard, path: '/assets/subscriptions' },
        { name: 'Reports', icon: BarChart3, path: '/assets/reports' },
      ]
    }
  };

  const config = moduleConfigs[currentModule as keyof typeof moduleConfigs] || moduleConfigs.dashboard;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 transform transition-transform duration-300 ease-in-out">
      {/* Modern Bottom Sheet - Compact */}
      <div className="bg-card rounded-t-xl shadow-2xl border-t border-border max-h-[70vh] flex flex-col">
        {/* Drag Handle */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 bg-muted rounded-full"></div>
        </div>

        {/* Header - Compact */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">{config.title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-accent transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Menu Items - Compact Mobile-First */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3">
            {/* Compact List for Mobile */}
            <div className="space-y-1">
              {config.items.map((item, index) => {
                const IconComponent = item.icon;
                const isActive = currentPath === item.path ||
                                (item.path !== '/dashboard' && currentPath.startsWith(item.path));

                return (
                  <Link
                    key={index}
                    href={item.path}
                    onClick={onClose}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-foreground hover:bg-accent border border-transparent hover:border-border'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                      isActive ? 'bg-primary/20' : 'bg-muted'
                    }`}>
                      <IconComponent className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <span className={`font-medium text-sm ${isActive ? 'text-primary' : 'text-foreground'}`}>
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer - Ultra Compact */}
        <div className="px-4 py-2.5 border-t border-border bg-muted/50">
          <div className="flex items-center justify-between">
            {/* Current Module Badge */}
            <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
              currentModule === 'dashboard' ? 'bg-muted text-muted-foreground' :
              currentModule === 'hrm' ? 'bg-primary/10 text-primary' :
              currentModule === 'crm' ? 'bg-primary/10 text-primary border border-primary/20' :
              currentModule === 'projects' ? 'bg-primary/10 text-primary border border-primary/20' :
              currentModule === 'tasks' ? 'bg-primary/10 text-primary border border-primary/20' :
              'bg-primary/10 text-primary border border-primary/20'
            }`}>
              {currentModule.toUpperCase()}
            </div>

            {/* Quick Dashboard Access */}
            {currentModule !== 'dashboard' && (
              <Link
                href="/dashboard"
                onClick={onClose}
                className="flex items-center space-x-1 px-2.5 py-1 bg-muted hover:bg-accent rounded-md transition-colors text-xs font-medium text-foreground"
              >
                <Home className="w-3 h-3" />
                <span>Home</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleSidebar;