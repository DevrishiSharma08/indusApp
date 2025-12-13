'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import FilterExportBar from '@/components/FilterExportBar';
import { ArrowLeft, Calendar, AlertCircle, CheckCircle2, Clock, User, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Mock current user - In real app, get from auth context
const currentUser = {
  id: '1',
  name: 'John Doe',
  role: 'admin', // 'admin' or 'user'
  department: 'Sales'
};

// Mock tasks data
const mockTasks = [
  {
    id: '1',
    title: 'Follow up with ABC Corp',
    description: 'Send proposal and pricing details',
    assignedTo: '1',
    assignedToName: 'John Doe',
    department: 'Sales',
    dueDate: '2025-12-11', // Today
    status: 'in-progress',
    priority: 'high',
    createdBy: 'Admin',
    createdAt: '2025-12-10'
  },
  {
    id: '2',
    title: 'Prepare Q4 Sales Report',
    description: 'Compile all sales data for Q4 presentation',
    assignedTo: '1',
    assignedToName: 'John Doe',
    department: 'Sales',
    dueDate: '2025-12-09', // Overdue
    status: 'pending',
    priority: 'high',
    createdBy: 'Manager',
    createdAt: '2025-12-08'
  },
  {
    id: '3',
    title: 'Client Demo - XYZ Ltd',
    description: 'Product demonstration for potential client',
    assignedTo: '2',
    assignedToName: 'Sarah Wilson',
    department: 'Sales',
    dueDate: '2025-12-11', // Today
    status: 'in-progress',
    priority: 'medium',
    createdBy: 'Admin',
    createdAt: '2025-12-10'
  },
  {
    id: '4',
    title: 'Update CRM Database',
    description: 'Add new leads from marketing campaign',
    assignedTo: '3',
    assignedToName: 'Mike Johnson',
    department: 'Marketing',
    dueDate: '2025-12-08', // Overdue
    status: 'pending',
    priority: 'medium',
    createdBy: 'Admin',
    createdAt: '2025-12-07'
  },
  {
    id: '5',
    title: 'Team Meeting Preparation',
    description: 'Prepare agenda for weekly team sync',
    assignedTo: '1',
    assignedToName: 'John Doe',
    department: 'Sales',
    dueDate: '2025-12-15', // Upcoming
    status: 'pending',
    priority: 'low',
    createdBy: 'Manager',
    createdAt: '2025-12-10'
  },
  {
    id: '6',
    title: 'Review Marketing Strategy',
    description: 'Analyze current marketing campaigns performance',
    assignedTo: '4',
    assignedToName: 'Emma Davis',
    department: 'Marketing',
    dueDate: '2025-12-12', // Upcoming
    status: 'in-progress',
    priority: 'medium',
    createdBy: 'Admin',
    createdAt: '2025-12-09'
  }
];

const departments = ['All', 'Sales', 'Marketing', 'HR', 'IT', 'Finance'];
const teamMembers = [
  { id: 'all', name: 'All Members' },
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Sarah Wilson' },
  { id: '3', name: 'Mike Johnson' },
  { id: '4', name: 'Emma Davis' }
];

export default function TasksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [memberFilter, setMemberFilter] = useState('all');
  const [activeFilter, setActiveFilter] = useState<'all' | 'today' | 'overdue' | 'upcoming' | 'pending' | 'completed'>('all');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [highlightedDueDate, setHighlightedDueDate] = useState<string | null>(null);

  const isAdmin = currentUser.role === 'admin';

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Handle due date filter from calendar
  useEffect(() => {
    const dueDateParam = searchParams.get('dueDate');
    if (dueDateParam) {
      setHighlightedDueDate(dueDateParam);
      // Scroll to tasks with this due date
      toast.info(`Showing tasks due on ${new Date(dueDateParam).toLocaleDateString()}`);
    }
  }, [searchParams]);

  // Filter tasks based on user role
  const visibleTasks = useMemo(() => {
    let tasks = mockTasks;

    // If not admin, show only assigned tasks
    if (!isAdmin) {
      tasks = tasks.filter(task => task.assignedTo === currentUser.id);
    } else {
      // Admin filters
      if (departmentFilter !== 'all') {
        tasks = tasks.filter(task => task.department === departmentFilter);
      }
      if (memberFilter !== 'all') {
        tasks = tasks.filter(task => task.assignedTo === memberFilter);
      }
    }

    // Due date filter from calendar
    if (highlightedDueDate) {
      tasks = tasks.filter(task => task.dueDate === highlightedDueDate);
    }

    // Search filter
    if (searchQuery) {
      tasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return tasks;
  }, [searchQuery, departmentFilter, memberFilter, highlightedDueDate, isAdmin]);

  // Categorize tasks
  const categorizedTasks = useMemo(() => {
    const todayTasks = visibleTasks.filter(task => task.dueDate === today && task.status !== 'completed');
    const overdueTasks = visibleTasks.filter(task => task.dueDate < today && task.status !== 'completed');
    const upcomingTasks = visibleTasks.filter(task => task.dueDate > today && task.status !== 'completed');
    const pendingTasks = visibleTasks.filter(task => task.status === 'pending' || task.status === 'in-progress');
    const completedTasks = visibleTasks.filter(task => task.status === 'completed');

    return {
      today: todayTasks,
      overdue: overdueTasks,
      upcoming: upcomingTasks,
      pending: pendingTasks,
      completed: completedTasks,
      all: visibleTasks
    };
  }, [visibleTasks, today]);

  const getFilteredTasks = () => {
    if (activeFilter === 'all') return categorizedTasks.all;
    return categorizedTasks[activeFilter] || [];
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'low': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-600';
      case 'in-progress': return 'bg-blue-500/10 text-blue-600';
      case 'pending': return 'bg-yellow-500/10 text-yellow-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const isTaskOverdue = (dueDate: string) => dueDate < today;
  const isTaskToday = (dueDate: string) => dueDate === today;

  const handleExport = (format: 'excel' | 'csv' | 'pdf') => {
    toast.success(`Exporting tasks as ${format.toUpperCase()}...`);
  };

  // Build filters for FilterExportBar (only for admin)
  const filters = isAdmin ? [
    {
      key: 'department',
      label: 'Department',
      options: departments.map(dept => ({ value: dept.toLowerCase(), label: dept })),
      value: departmentFilter,
      onChange: setDepartmentFilter
    },
    {
      key: 'member',
      label: 'Team Member',
      options: teamMembers.map(member => ({ value: member.id, label: member.name })),
      value: memberFilter,
      onChange: setMemberFilter
    }
  ] : [];

  return (
    <DashboardLayout>
    <div className="space-y-3 py-3 lg:py-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-8 w-8"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          {isAdmin ? 'All Tasks' : 'My Tasks'}
        </h2>
      </div>

      {/* Stats Cards - Ultra Compact & Clickable */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
        <Card
          className={cn(
            "bg-card border cursor-pointer transition-all hover:shadow-md",
            activeFilter === 'overdue' && "ring-2 ring-primary"
          )}
          onClick={() => setActiveFilter('overdue')}
        >
          <CardContent className="p-2">
            <div className="flex flex-col items-center gap-1">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <p className="text-xs text-muted-foreground leading-none">Overdue</p>
              <p className="text-lg font-bold text-foreground leading-none">{categorizedTasks.overdue.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "bg-card border cursor-pointer transition-all hover:shadow-md",
            activeFilter === 'today' && "ring-2 ring-primary"
          )}
          onClick={() => setActiveFilter('today')}
        >
          <CardContent className="p-2">
            <div className="flex flex-col items-center gap-1">
              <Calendar className="w-4 h-4 text-blue-500" />
              <p className="text-xs text-muted-foreground leading-none">Today</p>
              <p className="text-lg font-bold text-foreground leading-none">{categorizedTasks.today.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "bg-card border cursor-pointer transition-all hover:shadow-md",
            activeFilter === 'upcoming' && "ring-2 ring-primary"
          )}
          onClick={() => setActiveFilter('upcoming')}
        >
          <CardContent className="p-2">
            <div className="flex flex-col items-center gap-1">
              <Clock className="w-4 h-4 text-purple-500" />
              <p className="text-xs text-muted-foreground leading-none">Upcoming</p>
              <p className="text-lg font-bold text-foreground leading-none">{categorizedTasks.upcoming.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "bg-card border cursor-pointer transition-all hover:shadow-md",
            activeFilter === 'pending' && "ring-2 ring-primary"
          )}
          onClick={() => setActiveFilter('pending')}
        >
          <CardContent className="p-2">
            <div className="flex flex-col items-center gap-1">
              <Clock className="w-4 h-4 text-yellow-500" />
              <p className="text-xs text-muted-foreground leading-none">Pending</p>
              <p className="text-lg font-bold text-foreground leading-none">{categorizedTasks.pending.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "bg-card border cursor-pointer transition-all hover:shadow-md",
            activeFilter === 'completed' && "ring-2 ring-primary"
          )}
          onClick={() => setActiveFilter('completed')}
        >
          <CardContent className="p-2">
            <div className="flex flex-col items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <p className="text-xs text-muted-foreground leading-none">Done</p>
              <p className="text-lg font-bold text-foreground leading-none">{categorizedTasks.completed.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "bg-card border cursor-pointer transition-all hover:shadow-md",
            activeFilter === 'all' && "ring-2 ring-primary"
          )}
          onClick={() => setActiveFilter('all')}
        >
          <CardContent className="p-2">
            <div className="flex flex-col items-center gap-1">
              {isAdmin ? <Users className="w-4 h-4 text-primary" /> : <User className="w-4 h-4 text-primary" />}
              <p className="text-xs text-muted-foreground leading-none">All</p>
              <p className="text-lg font-bold text-foreground leading-none">{visibleTasks.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FilterExportBar - Inline Minimal */}
      {/* <Card className="w-fit">
        <CardContent className="p-0"> */}
          <FilterExportBar
            filters={filters}
            onExport={handleExport}
            showExport={true}
            showViewToggle={true}
            viewToggleProps={{
              currentView: viewMode,
              onViewChange: setViewMode
            }}
            showSearch={true}
            searchProps={{
              placeholder: 'Search tasks...',
              value: searchQuery,
              onChange: setSearchQuery
            }}
          />
        {/* </CardContent>
      </Card> */}

      {/* Tasks Display */}
      {getFilteredTasks().length > 0 ? (
        viewMode === 'card' ? (
          /* Card View */
          <div className="space-y-2">
            {getFilteredTasks().map((task) => (
              <Card
                key={task.id}
                className={cn(
                  "bg-card border transition-all hover:shadow-md",
                  highlightedDueDate && task.dueDate === highlightedDueDate && "ring-2 ring-primary shadow-lg"
                )}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm truncate">{task.title}</h3>
                        <Badge
                          variant="outline"
                          className={cn("text-xs", getPriorityColor(task.priority))}
                        >
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                        {task.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <Badge variant="secondary" className={getStatusColor(task.status)}>
                          {task.status.replace('-', ' ')}
                        </Badge>
                        {isAdmin && (
                          <>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <User className="w-3 h-3" />
                              <span>{task.assignedToName}</span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Users className="w-3 h-3" />
                              <span>{task.department}</span>
                            </div>
                          </>
                        )}
                        <div className={cn(
                          "flex items-center gap-1 ml-auto",
                          isTaskOverdue(task.dueDate) ? "text-red-500" :
                          isTaskToday(task.dueDate) ? "text-blue-500" :
                          "text-muted-foreground"
                        )}>
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(task.dueDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}</span>
                          {isTaskOverdue(task.dueDate) && (
                            <AlertCircle className="w-3 h-3 ml-1" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="text-sm font-semibold">Task</TableHead>
                  <TableHead className="text-sm font-semibold">Status</TableHead>
                  <TableHead className="text-sm font-semibold">Priority</TableHead>
                  {isAdmin && <TableHead className="text-sm font-semibold">Assigned To</TableHead>}
                  {isAdmin && <TableHead className="text-sm font-semibold">Department</TableHead>}
                  <TableHead className="text-sm font-semibold">Due Date</TableHead>
                  <TableHead className="text-sm font-semibold">Created By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getFilteredTasks().map((task) => (
                  <TableRow
                    key={task.id}
                    className={cn(
                      "transition-colors",
                      isTaskOverdue(task.dueDate) && "bg-red-500/5",
                      isTaskToday(task.dueDate) && "bg-blue-500/5"
                    )}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{task.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{task.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn("text-xs", getStatusColor(task.status))}>
                        {task.status.replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-xs", getPriorityColor(task.priority))}>
                        {task.priority}
                      </Badge>
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="text-sm">{task.assignedToName}</TableCell>
                    )}
                    {isAdmin && (
                      <TableCell className="text-sm">{task.department}</TableCell>
                    )}
                    <TableCell>
                      <div className={cn(
                        "flex items-center gap-1 text-xs",
                        isTaskOverdue(task.dueDate) ? "text-red-500 font-semibold" :
                        isTaskToday(task.dueDate) ? "text-blue-500 font-semibold" :
                        "text-muted-foreground"
                      )}>
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(task.dueDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}</span>
                        {isTaskOverdue(task.dueDate) && (
                          <AlertCircle className="w-3 h-3 ml-1" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{task.createdBy}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No tasks in this category</p>
        </div>
      )}
    </div>
    </DashboardLayout>
  );
}
