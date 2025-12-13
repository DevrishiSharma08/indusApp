'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Eye, Edit, Trash2, MoreVertical } from 'lucide-react';

// DashboardLayout is already applied in projectmanagement/layout.tsx
import PageHeader from '@/components/PageHeader';
import SearchBar from '@/components/SearchBar';
import FilterExportBar from '@/components/FilterExportBar';
import ViewToggle, { ViewMode } from '@/components/ViewToggle';
import ColumnToggle, { ColumnConfig } from '@/components/ColumnToggle';
import BulkActions, { BulkAction } from '@/components/BulkActions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// --- MOCK DATA ---
const mockTasks = [
  {
    id: 'TASK-8782',
    title: 'Fix button alignment on the login page',
    description: 'Buttons are misaligned on mobile devices',
    status: 'In Progress',
    priority: 'High',
    assignee: {
      name: 'Jane Doe',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    },
    dueDate: '2024-12-15',
    project: 'Indus Nova',
  },
  {
    id: 'TASK-5463',
    title: 'Implement new dashboard chart',
    description: 'Add analytics chart to main dashboard',
    status: 'To Do',
    priority: 'Medium',
    assignee: {
      name: 'John Smith',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d',
    },
    dueDate: '2024-12-20',
    project: 'Indus Nova',
  },
  {
    id: 'TASK-2344',
    title: 'Update API documentation',
    description: 'Document /users endpoint with examples',
    status: 'Done',
    priority: 'Low',
    assignee: {
      name: 'Peter Jones',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d',
    },
    dueDate: '2024-11-30',
    project: 'API Docs',
  },
  {
    id: 'TASK-9876',
    title: 'Refactor authentication service',
    description: 'Convert to JWT-based authentication',
    status: 'In Progress',
    priority: 'High',
    assignee: {
      name: 'Jane Doe',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    },
    dueDate: '2024-12-10',
    project: 'Phoenix',
  },
  {
    id: 'TASK-1234',
    title: 'Design new icons for settings',
    description: 'Create modern icon set for settings page',
    status: 'Backlog',
    priority: 'Medium',
    assignee: {
      name: 'Emily White',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026707d',
    },
    dueDate: '2024-12-25',
    project: 'Design System',
  },
];

type Status = 'In Progress' | 'To Do' | 'Done' | 'Backlog';
type Priority = 'High' | 'Medium' | 'Low';

const statusVariants: Record<Status, 'default' | 'secondary' | 'outline'> = {
  'In Progress': 'default',
  'To Do': 'secondary',
  'Done': 'outline',
  'Backlog': 'secondary',
};

const priorityVariants: Record<Priority, 'destructive' | 'secondary' | 'outline'> = {
  'High': 'destructive',
  'Medium': 'secondary',
  'Low': 'outline',
};

// --- END MOCK DATA ---

export default function TasksPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [tasks, setTasks] = useState(mockTasks);
  const [loading, setLoading] = useState(true);

  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  // Column visibility state
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: 'checkbox', label: 'Select', visible: true },
    { key: 'id', label: 'Task ID', visible: true },
    { key: 'title', label: 'Title', visible: true },
    { key: 'status', label: 'Status', visible: true },
    { key: 'priority', label: 'Priority', visible: true },
    { key: 'assignee', label: 'Assignee', visible: true },
    { key: 'dueDate', label: 'Due Date', visible: true },
    { key: 'project', label: 'Project', visible: true },
    { key: 'actions', label: 'Actions', visible: true },
  ]);

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    // Simulate API call with filtering
    setLoading(true);
    const filtered = mockTasks
      .filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(t => statusFilter === 'all' || t.status === statusFilter)
      .filter(t => priorityFilter === 'all' || t.priority === priorityFilter)
      .filter(t => assigneeFilter === 'all' || t.assignee.name === assigneeFilter);
    setTasks(filtered);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter, priorityFilter, assigneeFilter]);

  // Filter configuration
  const filterConfig = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'all', label: 'All Statuses' },
        { value: 'To Do', label: 'To Do' },
        { value: 'In Progress', label: 'In Progress' },
        { value: 'Done', label: 'Done' },
        { value: 'Backlog', label: 'Backlog' },
      ],
      value: statusFilter,
      onChange: setStatusFilter,
    },
    {
      key: 'priority',
      label: 'Priority',
      options: [
        { value: 'all', label: 'All Priorities' },
        { value: 'High', label: 'High' },
        { value: 'Medium', label: 'Medium' },
        { value: 'Low', label: 'Low' },
      ],
      value: priorityFilter,
      onChange: setPriorityFilter,
    },
    {
      key: 'assignee',
      label: 'Assignee',
      options: [
        { value: 'all', label: 'All Assignees' },
        { value: 'Jane Doe', label: 'Jane Doe' },
        { value: 'John Smith', label: 'John Smith' },
        { value: 'Peter Jones', label: 'Peter Jones' },
        { value: 'Emily White', label: 'Emily White' },
      ],
      value: assigneeFilter,
      onChange: setAssigneeFilter,
    },
  ];

  // Bulk actions configuration
  const bulkActions: BulkAction[] = [
    { value: 'export', label: 'Export Selected' },
    { value: 'assign', label: 'Assign to...' },
    { value: 'status', label: 'Change Status...' },
    { value: 'delete', label: 'Delete Selected', variant: 'destructive' },
  ];

  // Handle bulk action
  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on`, selectedIds);
    if (action === 'delete') {
      if (confirm(`Delete ${selectedIds.length} tasks?`)) {
        setTasks(prev => prev.filter(t => !selectedIds.includes(t.id)));
        setSelectedIds([]);
      }
    }
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(tasks.map(t => t.id));
    } else {
      setSelectedIds([]);
    }
  };

  // Handle single select
  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(tid => tid !== id));
    }
  };

  // Handle row actions
  const handleView = (id: string) => {
    router.push(`/projectmanagement/tasks/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/projectmanagement/tasks/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this task?')) {
      setTasks(prev => prev.filter(t => t.id !== id));
      console.log('Deleted task:', id);
    }
  };

  // Check if column is visible
  const isColumnVisible = (key: string) => {
    const col = columns.find(c => c.key === key);
    return col ? col.visible : true;
  };

  return (
      <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">
        <PageHeader
          title="Tasks"
          primaryAction={{
            content: 'Create Task',
            onClick: () => console.log('Create new task'),
            icon: Plus,
          }}
        />

        <SearchBar
          placeholder="Search tasks by ID, title, or description..."
          value={searchTerm}
          onChange={setSearchTerm}
        />

        {/* Toolbar Row - All in one line */}
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <FilterExportBar filters={filterConfig} />

          <div className="flex items-center gap-2">
            <ViewToggle
              view={viewMode}
              onViewChange={setViewMode}
              modes={['table', 'grid', 'card']}
            />
            {viewMode === 'table' && (
              <ColumnToggle
                columns={columns}
                onColumnChange={setColumns}
              />
            )}
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedIds.length > 0 && (
          <BulkActions
            selectedCount={selectedIds.length}
            totalCount={tasks.length}
            actions={bulkActions}
            onAction={handleBulkAction}
            onClearSelection={() => setSelectedIds([])}
          />
        )}

        {/* Data Display */}
        <Card>
          <CardContent className="p-0">
            {viewMode === 'table' && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {isColumnVisible('checkbox') && (
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedIds.length === tasks.length && tasks.length > 0}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                      )}
                      {isColumnVisible('id') && <TableHead className="w-28">Task ID</TableHead>}
                      {isColumnVisible('title') && <TableHead>Title</TableHead>}
                      {isColumnVisible('status') && <TableHead>Status</TableHead>}
                      {isColumnVisible('priority') && <TableHead>Priority</TableHead>}
                      {isColumnVisible('assignee') && <TableHead className="hidden md:table-cell">Assignee</TableHead>}
                      {isColumnVisible('dueDate') && <TableHead className="hidden lg:table-cell">Due Date</TableHead>}
                      {isColumnVisible('project') && <TableHead className="hidden xl:table-cell">Project</TableHead>}
                      {isColumnVisible('actions') && <TableHead className="text-right">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i} className="animate-pulse">
                          {isColumnVisible('checkbox') && <TableCell><div className="h-4 w-4 bg-muted rounded"></div></TableCell>}
                          {isColumnVisible('id') && <TableCell><div className="h-4 bg-muted rounded"></div></TableCell>}
                          {isColumnVisible('title') && <TableCell><div className="h-4 bg-muted rounded"></div></TableCell>}
                          {isColumnVisible('status') && <TableCell><div className="h-4 bg-muted rounded"></div></TableCell>}
                          {isColumnVisible('priority') && <TableCell><div className="h-4 bg-muted rounded"></div></TableCell>}
                          {isColumnVisible('assignee') && <TableCell className="hidden md:table-cell"><div className="h-4 bg-muted rounded"></div></TableCell>}
                          {isColumnVisible('dueDate') && <TableCell className="hidden lg:table-cell"><div className="h-4 bg-muted rounded"></div></TableCell>}
                          {isColumnVisible('project') && <TableCell className="hidden xl:table-cell"><div className="h-4 bg-muted rounded"></div></TableCell>}
                          {isColumnVisible('actions') && <TableCell><div className="h-4 bg-muted rounded"></div></TableCell>}
                        </TableRow>
                      ))
                    ) : tasks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                          No tasks found
                        </TableCell>
                      </TableRow>
                    ) : (
                      tasks.map((task) => (
                        <TableRow key={task.id} className={selectedIds.includes(task.id) ? 'bg-muted/50' : ''}>
                          {isColumnVisible('checkbox') && (
                            <TableCell>
                              <Checkbox
                                checked={selectedIds.includes(task.id)}
                                onCheckedChange={(checked) => handleSelectOne(task.id, checked as boolean)}
                              />
                            </TableCell>
                          )}
                          {isColumnVisible('id') && (
                            <TableCell className="font-medium text-foreground">{task.id}</TableCell>
                          )}
                          {isColumnVisible('title') && (
                            <TableCell>
                              <div className="font-medium text-foreground">{task.title}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">{task.description}</div>
                            </TableCell>
                          )}
                          {isColumnVisible('status') && (
                            <TableCell>
                              <Badge variant={statusVariants[task.status as Status]} className="w-28 justify-center">
                                {task.status}
                              </Badge>
                            </TableCell>
                          )}
                          {isColumnVisible('priority') && (
                            <TableCell>
                              <Badge variant={priorityVariants[task.priority as Priority]} className="w-20 justify-center">
                                {task.priority}
                              </Badge>
                            </TableCell>
                          )}
                          {isColumnVisible('assignee') && (
                            <TableCell className="hidden md:table-cell">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                                  <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-foreground">{task.assignee.name}</span>
                              </div>
                            </TableCell>
                          )}
                          {isColumnVisible('dueDate') && (
                            <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                              {task.dueDate}
                            </TableCell>
                          )}
                          {isColumnVisible('project') && (
                            <TableCell className="hidden xl:table-cell text-sm text-muted-foreground">
                              {task.project}
                            </TableCell>
                          )}
                          {isColumnVisible('actions') && (
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleView(task.id)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEdit(task.id)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Task
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleDelete(task.id)}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-4">
                        <div className="h-4 bg-muted rounded mb-2"></div>
                        <div className="h-4 bg-muted rounded w-2/3"></div>
                      </CardContent>
                    </Card>
                  ))
                ) : tasks.length === 0 ? (
                  <div className="col-span-full h-32 flex items-center justify-center text-muted-foreground">
                    No tasks found
                  </div>
                ) : (
                  tasks.map((task) => (
                    <Card key={task.id} className={selectedIds.includes(task.id) ? 'ring-2 ring-primary' : ''}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <Checkbox
                              checked={selectedIds.includes(task.id)}
                              onCheckedChange={(checked) => handleSelectOne(task.id, checked as boolean)}
                              className="mt-1"
                            />
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-base font-semibold">{task.title}</CardTitle>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">{task.id}</p>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleView(task.id)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(task.id)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(task.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge variant={statusVariants[task.status as Status]}>
                            {task.status}
                          </Badge>
                          <Badge variant={priorityVariants[task.priority as Priority]}>
                            {task.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                            <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{task.assignee.name}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Due:</span>
                          <span className="font-medium">{task.dueDate}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Project:</span>
                          <span className="font-medium">{task.project}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}

            {/* Card View */}
            {viewMode === 'card' && (
              <div className="p-4 space-y-3">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-4">
                        <div className="h-4 bg-muted rounded mb-2"></div>
                        <div className="h-4 bg-muted rounded w-2/3"></div>
                      </CardContent>
                    </Card>
                  ))
                ) : tasks.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-muted-foreground">
                    No tasks found
                  </div>
                ) : (
                  tasks.map((task) => (
                    <Card key={task.id} className={selectedIds.includes(task.id) ? 'ring-2 ring-primary' : ''}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={selectedIds.includes(task.id)}
                            onCheckedChange={(checked) => handleSelectOne(task.id, checked as boolean)}
                            className="mt-1"
                          />
                          <div className="flex-1 min-w-0 space-y-3">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-foreground">{task.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                                <p className="text-xs text-muted-foreground mt-1">{task.id}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={statusVariants[task.status as Status]}>
                                  {task.status}
                                </Badge>
                                <Badge variant={priorityVariants[task.priority as Priority]}>
                                  {task.priority}
                                </Badge>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                                <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{task.assignee.name}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <span className="text-muted-foreground">Due Date:</span>
                                <p className="font-medium">{task.dueDate}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Project:</span>
                                <p className="font-medium">{task.project}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                              <Button variant="outline" size="sm" onClick={() => handleView(task.id)}>
                                <Eye className="h-4 w-4 mr-1.5" />
                                View
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleEdit(task.id)}>
                                <Edit className="h-4 w-4 mr-1.5" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(task.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-1.5" />
                                Delete
                              </Button>
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
  );
}
