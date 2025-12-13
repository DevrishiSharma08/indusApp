'use client';

import { useState } from 'react';
import { Home, ClipboardList, Plus, MessageSquare, Menu, CheckSquare, Ticket, FolderKanban, Users, UserPlus, Star, X, Pencil, Search, ChevronDown, Check } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import ModuleSidebar from './ModuleSidebar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const BottomNavigation = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isAddShortcutOpen, setIsAddShortcutOpen] = useState(false);
  const [shortcutName, setShortcutName] = useState('');
  const [shortcutPath, setShortcutPath] = useState('');

  // New State for Custom UI
  const [isPageSelectorOpen, setIsPageSelectorOpen] = useState(false);
  const [pageSearchQuery, setPageSearchQuery] = useState('');

  // Custom shortcuts - stored in localStorage (in real app, use backend)
  const [customShortcuts, setCustomShortcuts] = useState<Array<{ id: string, name: string, path: string }>>([]);

  // Quick actions for common tasks
  const quickActions = [
    { id: 'task', name: 'Task', icon: CheckSquare, color: 'text-blue-500', isSpecial: true },
    { id: 'ticket', name: 'Ticket', icon: Ticket, path: '/ticketmanagement/tickets/create', color: 'text-red-500' },
    { id: 'project', name: 'Project', icon: FolderKanban, path: '/projectmanagement/projects/create', color: 'text-purple-500' },
    { id: 'lead', name: 'Lead', icon: UserPlus, path: '/crm/create-lead', color: 'text-green-500' },
    { id: 'member', name: 'Member', icon: Users, path: '/hrm/employees/add', color: 'text-orange-500' },
  ];

  // Department-based task creation
  const [isTaskDepartmentOpen, setIsTaskDepartmentOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const departments = [
    { id: 'all', name: 'All - General Activity', path: '/createtasks' },
    { id: 'marketing', name: 'Marketing', path: '/crm/tasks' },
    // { id: 'sales', name: 'Sales', path: '/crm/leads' },
    // { id: 'hr', name: 'HR', path: '/hrm/tasks' },
    // { id: 'it', name: 'IT', path: '/ticketmanagement' },
    // { id: 'finance', name: 'Finance', path: '/finance/tasks' },
  ];

  const handleQuickAction = (action: any) => {
    setIsQuickActionsOpen(false);

    if (action.isSpecial && action.id === 'task') {
      // Direct redirect to create tasks page
      router.push('/createtasks');
    } else if (action.path) {
      router.push(action.path);
    }
  };

  const handleDepartmentSelect = () => {
    const dept = departments.find(d => d.id === selectedDepartment);
    if (dept) {
      router.push(dept.path);
    }
    setIsTaskDepartmentOpen(false);
    setSelectedDepartment('all');
  };

  // Module configurations for available pages
  const moduleConfigs = {
    dashboard: {
      title: 'Main Menu',
      items: [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'HRM', path: '/hrm' },
        { name: 'CRM', path: '/crm' },
        { name: 'Projects & Tasks', path: '/projectmanagement' },
        { name: 'Ticket Management', path: '/ticketmanagement' },
        { name: 'Assets', path: '/assets' },
        { name: 'Finance', path: '/finance' },
      ]
    },
    hrm: {
      title: 'HRM',
      items: [
        { name: 'HRM Dashboard', path: '/hrm' },
        { name: 'All Team Members', path: '/hrm/employees' },
        { name: 'Add Team Member', path: '/hrm/employees/add' },
        { name: 'Leave & Attendance', path: '/hrm/leave-attendance' },
        { name: 'Payroll', path: '/hrm/payroll' },
        { name: 'HR Settings', path: '/hrm/settings' },
      ]
    },
    crm: {
      title: 'CRM',
      items: [
        { name: 'CRM Dashboard', path: '/crm' },
        { name: 'Leads', path: '/crm/leads' },
        { name: 'Events', path: '/crm/events' },
        { name: 'Drip & Messages', path: '/crm/drip-sequences' },
        { name: 'Proposals', path: '/crm/proposals' },
        { name: 'Reports', path: '/crm/reports' },
        { name: 'Settings', path: '/crm/settings' },
      ]
    },
    projectmanagement: {
      title: 'Project Management',
      items: [
        { name: 'PM Dashboard', path: '/projectmanagement' },
        { name: 'All Projects', path: '/projectmanagement/projects' },
        { name: 'Reports', path: '/projectmanagement/reports' },
        { name: 'Wiki', path: '/projectmanagement/wiki' },
      ]
    },
    finance: {
      title: 'Finance',
      items: [
        { name: 'Finance Dashboard', path: '/finance' },
        { name: 'Expenses', path: '/finance/expenses' },
        { name: 'Sales Management', path: '/finance/sales-mgmt' },
        { name: 'Reports', path: '/finance/reports' },
      ]
    },
    ticketmanagement: {
      title: 'Ticket Management',
      items: [
        { name: 'TM Dashboard', path: '/ticketmanagement' },
        { name: 'All Tickets', path: '/ticketmanagement/tickets' },
        { name: 'Create Ticket', path: '/ticketmanagement/tickets/create' },
        { name: 'My Work', path: '/ticketmanagement/my-work' },
        { name: 'Support Center', path: '/ticketmanagement/support' },
        { name: 'Testing/QC', path: '/ticketmanagement/testing' },
        { name: 'Time Reports', path: '/ticketmanagement/reports' },
      ]
    },
    assets: {
      title: 'Asset Management',
      items: [
        { name: 'Assets Dashboard', path: '/assets' },
        { name: 'All Assets', path: '/assets/all' },
        { name: 'Add Purchase', path: '/assets/add' },
        { name: 'Masters', path: '/assets/categories' },
        { name: 'Reports', path: '/assets/reports' },
      ]
    }
  };

  const handleAddShortcut = () => {
    if (!shortcutName.trim() || !shortcutPath.trim()) {
      toast.error('Please select a page');
      return;
    }
    const newShortcut = {
      id: Date.now().toString(),
      name: shortcutName,
      path: shortcutPath
    };
    setCustomShortcuts([...customShortcuts, newShortcut]);
    toast.success(`Shortcut "${shortcutName}" added!`);
    setShortcutName('');
    setShortcutPath('');
    setIsAddShortcutOpen(false);
  };

  const handleRemoveShortcut = (id: string) => {
    setCustomShortcuts(customShortcuts.filter(s => s.id !== id));
    toast.success('Shortcut removed');
  };

  const handleShortcutClick = (path: string) => {
    setIsQuickActionsOpen(false);
    router.push(path);
  };

  // Determine current module from path
  const getCurrentModule = () => {
    if (pathname.startsWith('/hrm')) return 'hrm';
    if (pathname.startsWith('/crm')) return 'crm';
    if (pathname.startsWith('/projectmanagement')) return 'projectmanagement';
    if (pathname.startsWith('/ticketmanagement')) return 'ticketmanagement';
    if (pathname.startsWith('/tasks')) return 'tasks';
    if (pathname.startsWith('/assets')) return 'assets';
    if (pathname.startsWith('/finance')) return 'finance';
    return 'dashboard';
  };

  const currentModule = getCurrentModule();

  // Check if current path is active
  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/' || pathname === '/dashboard';
    }
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* Bottom Navigation - Mobile Only */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border px-4 py-2 shadow-lg">
        <div className="flex items-center justify-around">
          {/* Home */}
          <Link
            href="/dashboard"
            className={`flex flex-col items-center space-y-1 p-2 ${isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground'
              }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium">Home</span>
          </Link>

          {/* Tasks */}
          <Link
            href="/tasks"
            className={`flex flex-col items-center space-y-1 p-2 ${isActive('/tasks') ? 'text-primary' : 'text-muted-foreground'
              }`}
          >
            <ClipboardList className="w-5 h-5" />
            <span className="text-xs">Tasks</span>
          </Link>

          {/* Create (Center FAB) */}
          <button
            onClick={() => setIsQuickActionsOpen(true)}
            className="w-12 h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg flex items-center justify-center -mt-2 transition-transform active:scale-95"
          >
            <Plus className="w-6 h-6" />
          </button>

          {/* Messages */}
          <Link
            href="/messages"
            className={`flex flex-col items-center space-y-1 p-2 ${isActive('/messages') ? 'text-primary' : 'text-muted-foreground'
              }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs">Messages</span>
          </Link>

          {/* Menu */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex flex-col items-center space-y-1 p-2 ${isMenuOpen ? 'text-primary' : 'text-muted-foreground'
              }`}
          >
            <Menu className="w-5 h-5" />
            <span className="text-xs">Menu</span>
          </button>
        </div>
      </div>

      {/* Module-Specific Sidebar */}
      <ModuleSidebar
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        currentModule={currentModule}
        currentPath={pathname}
      />

      {/* Backdrop */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Quick Actions Dialog - Ultra Compact */}
      <Dialog open={isQuickActionsOpen} onOpenChange={setIsQuickActionsOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md p-4">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-base">Quick Actions</DialogTitle>
          </DialogHeader>

          {/* Quick Create Actions - Grid */}
          <div className="grid grid-cols-3 gap-2">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  <IconComponent className={`w-5 h-5 ${action.color}`} />
                  <span className="text-xs font-medium text-foreground">{action.name}</span>
                </button>
              );
            })}
          </div>

          {/* Custom Shortcuts Section */}
          {customShortcuts.length > 0 && (
            <>
              <div className="border-t pt-3 mt-2">
                <p className="text-xs font-semibold text-muted-foreground mb-2">My Shortcuts</p>
                <div className="grid grid-cols-3 gap-2">
                  {customShortcuts.map((shortcut) => (
                    <div key={shortcut.id} className="relative group">
                      <button
                        onClick={() => handleShortcutClick(shortcut.path)}
                        className="w-full flex flex-col items-center gap-1.5 p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                      >
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-medium text-foreground truncate w-full text-center">
                          {shortcut.name}
                        </span>
                      </button>
                      <button
                        onClick={() => handleRemoveShortcut(shortcut.id)}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Add Shortcut Button */}
          <Button
            onClick={() => {
              setIsQuickActionsOpen(false);
              setIsAddShortcutOpen(true);
            }}
            variant="outline"
            size="sm"
            className="w-full mt-2"
          >
            <Pencil className="w-3 h-3 mr-2" />
            Add Custom Shortcut
          </Button>
        </DialogContent>
      </Dialog>

      {/* Add Custom Shortcut Dialog */}
      <Dialog open={isAddShortcutOpen} onOpenChange={setIsAddShortcutOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md p-4">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-base">Add Custom Shortcut</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">
                Select Page
              </label>

              {/* Custom Searchable Dropdown Trigger */}
              <div
                className="w-full h-9 px-3 flex items-center justify-between text-sm border border-input rounded-lg bg-background text-foreground cursor-pointer hover:bg-accent/50"
                onClick={() => setIsPageSelectorOpen(!isPageSelectorOpen)}
              >
                <span className={shortcutPath ? "text-foreground" : "text-muted-foreground"}>
                  {shortcutName || "Select a page..."}
                </span>
                <ChevronDown className="w-4 h-4 text-muted-foreground opacity-50" />
              </div>

              {/* Custom Dropdown Content */}
              {isPageSelectorOpen && (
                <div className="mt-2 border border-border rounded-lg shadow-lg bg-popover overflow-hidden animate-in fade-in-0 zoom-in-95">
                  {/* Search Input */}
                  <div className="p-2 border-b border-border sticky top-0 bg-popover z-10">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                      <input
                        ref={(input) => input && input.focus()}
                        type="text"
                        placeholder="Search pages..."
                        className="w-full h-8 pl-8 pr-3 text-xs bg-muted/50 border-none rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                        value={pageSearchQuery}
                        onChange={(e) => setPageSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Scrollable Page List */}
                  <div className="max-h-[200px] overflow-y-auto p-1">
                    {Object.entries(moduleConfigs).map(([key, module]) => {
                      // Filter items based on search
                      const filteredItems = module.items.filter(item =>
                        item.name.toLowerCase().includes(pageSearchQuery.toLowerCase())
                      );

                      if (filteredItems.length === 0) return null;

                      return (
                        <div key={key} className="mb-2 last:mb-0">
                          <div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider sticky top-0 bg-popover/95 backdrop-blur-sm">
                            {module.title}
                          </div>
                          <div className="space-y-0.5">
                            {filteredItems.map((item) => (
                              <button
                                key={item.path}
                                onClick={() => {
                                  setShortcutPath(item.path);
                                  setShortcutName(item.name);
                                  setIsPageSelectorOpen(false);
                                  setPageSearchQuery('');
                                }}
                                className={`w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors flex items-center justify-between group ${shortcutPath === item.path
                                  ? 'bg-primary/10 text-primary font-medium'
                                  : 'text-foreground hover:bg-accent'
                                  }`}
                              >
                                {item.name}
                                {shortcutPath === item.path && (
                                  <Check className="w-3.5 h-3.5 text-primary" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                    {/* Empty State */}
                    {Object.values(moduleConfigs).every(module =>
                      module.items.filter(item => item.name.toLowerCase().includes(pageSearchQuery.toLowerCase())).length === 0
                    ) && (
                        <div className="p-4 text-center text-xs text-muted-foreground">
                          No pages found matching "{pageSearchQuery}"
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => {
                  setIsAddShortcutOpen(false);
                  setShortcutName('');
                  setShortcutPath('');
                  setIsPageSelectorOpen(false);
                }}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddShortcut}
                size="sm"
                className="flex-1"
                disabled={!shortcutPath}
              >
                Add Shortcut
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Task Department Selector Dialog */}
      <Dialog open={isTaskDepartmentOpen} onOpenChange={setIsTaskDepartmentOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md p-4">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-base">Select Department</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">
                Choose task category
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full h-9 px-3 text-sm border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1.5">
                {selectedDepartment === 'all'
                  ? 'Create general activities like meetings, calls, etc.'
                  : 'Department-specific task creation'}
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => {
                  setIsTaskDepartmentOpen(false);
                  setSelectedDepartment('all');
                }}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDepartmentSelect}
                size="sm"
                className="flex-1"
              >
                Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BottomNavigation;