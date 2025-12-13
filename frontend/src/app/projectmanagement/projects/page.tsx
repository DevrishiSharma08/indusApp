'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, Edit, Plus, Trash2, MoreVertical } from 'lucide-react';

// DashboardLayout is already applied in projectmanagement/layout.tsx
import FilterExportBar from '@/components/FilterExportBar';
import ColumnToggle, { ColumnConfig } from '@/components/ColumnToggle';
import BulkActions, { BulkAction } from '@/components/BulkActions';
import { Button } from '@/components/ui/button';
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
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// --- MOCK DATA ---
const mockProjects = [
  {
    id: 'PROJ-001',
    name: 'Indus Nova - HRMS & CRM Platform',
    status: 'In Progress',
    lead: 'Alia Bhatt',
    startDate: '2023-01-15',
    endDate: '2023-09-30',
    progress: 75,
    tasksCompleted: 45,
    tasksTotal: 60,
  },
  {
    id: 'PROJ-002',
    name: 'Project Phoenix - Mobile App',
    status: 'On Hold',
    lead: 'Ranbir Kapoor',
    startDate: '2023-03-01',
    endDate: '2023-12-31',
    progress: 40,
    tasksCompleted: 20,
    tasksTotal: 50,
  },
  {
    id: 'PROJ-003',
    name: 'Quantum Leap - AI Integration',
    status: 'Completed',
    lead: 'Deepika Padukone',
    startDate: '2022-09-01',
    endDate: '2023-06-30',
    progress: 100,
    tasksCompleted: 80,
    tasksTotal: 80,
  },
  {
    id: 'PROJ-004',
    name: 'E-commerce Platform Upgrade',
    status: 'In Progress',
    lead: 'Shah Rukh Khan',
    startDate: '2023-05-20',
    endDate: '2024-01-15',
    progress: 60,
    tasksCompleted: 30,
    tasksTotal: 50,
  },
  {
    id: 'PROJ-005',
    name: 'Data Analytics Dashboard',
    status: 'Planning',
    lead: 'Priyanka Chopra',
    startDate: '2023-08-01',
    endDate: '2024-02-28',
    progress: 10,
    tasksCompleted: 5,
    tasksTotal: 45,
  },
];

const statusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  'In Progress': 'default',
  'On Hold': 'secondary',
  'Completed': 'outline',
  'Planning': 'secondary',
};

// --- END MOCK DATA ---

export default function ProjectsListPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [projects, setProjects] = useState(mockProjects);
  const [loading, setLoading] = useState(true);

  // View state
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

  // Column visibility state
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: 'checkbox', label: 'Select', visible: true },
    { key: 'name', label: 'Project Name', visible: true },
    { key: 'status', label: 'Status', visible: true },
    { key: 'lead', label: 'Project Lead', visible: true },
    { key: 'timeline', label: 'Timeline', visible: true },
    { key: 'progress', label: 'Progress', visible: true },
    { key: 'tasks', label: 'No. of Tasks', visible: true },
    { key: 'actions', label: 'Actions', visible: true },
  ]);

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    const filtered = mockProjects
      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(p => statusFilter === 'all' || p.status === statusFilter);
    setProjects(filtered);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter]);

  // Filter configuration
  const filterConfig = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'all', label: 'All Statuses' },
        { value: 'Planning', label: 'Planning' },
        { value: 'In Progress', label: 'In Progress' },
        { value: 'On Hold', label: 'On Hold' },
        { value: 'Completed', label: 'Completed' },
      ],
      value: statusFilter,
      onChange: setStatusFilter,
    },
  ];

  // Bulk actions configuration
  const bulkActions: BulkAction[] = [
    { value: 'export', label: 'Export Selected' },
    { value: 'archive', label: 'Archive Selected' },
    { value: 'delete', label: 'Delete Selected', variant: 'destructive' },
  ];

  // Handle bulk action
  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on`, selectedIds);
    // Implement actual bulk action logic here
    if (action === 'delete') {
      if (confirm(`Delete ${selectedIds.length} projects?`)) {
        setProjects(prev => prev.filter(p => !selectedIds.includes(p.id)));
        setSelectedIds([]);
      }
    }
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(projects.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  // Handle single select
  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(pid => pid !== id));
    }
  };

  // Handle row actions
  const handleView = (id: string) => {
    router.push(`/projectmanagement/projects/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/projectmanagement/projects/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this project?')) {
      setProjects(prev => prev.filter(p => p.id !== id));
      console.log('Deleted project:', id);
    }
  };

  // Handle row click to view details
  const handleRowClick = (id: string, e: React.MouseEvent) => {
    // Don't navigate if clicking on checkbox, buttons, or dropdown
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('[role="checkbox"]') ||
      target.closest('.dropdown-trigger')
    ) {
      return;
    }
    handleView(id);
  };

  // Check if column is visible
  const isColumnVisible = (key: string) => {
    const col = columns.find(c => c.key === key);
    return col ? col.visible : true;
  };

  return (
      <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">
        {/* Header */}
        <div className="relative">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Projects</h1>

            {/* Mobile: Floating + Button | Desktop: Full Button */}
            <Link
              href="/projectmanagement/projects/create"
              className="flex items-center justify-center sm:space-x-2 sm:px-4 sm:py-2.5 bg-primary text-primary-foreground rounded-full sm:rounded-lg hover:bg-primary/90 transition-colors font-medium w-10 h-10 sm:w-auto sm:h-auto"
            >
              <Plus className="w-5 h-5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline text-sm">Create Project</span>
            </Link>
          </div>
        </div>

        {/* Project List */}
        <div className="bg-card rounded-lg sm:rounded-xl shadow-sm border border-border">
          {/* Search, Filter, Export, View Toggle, and Column Toggle Row */}
          <div className="p-3 sm:p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <FilterExportBar
                  filters={filterConfig}
                  showViewToggle={true}
                  viewToggleProps={{
                    currentView: viewMode,
                    onViewChange: setViewMode
                  }}
                  showSearch={true}
                  searchProps={{
                    placeholder: "Search projects by name or ID...",
                    value: searchTerm,
                    onChange: setSearchTerm
                  }}
                />
              </div>
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
            <div className="px-3 sm:px-4">
              <BulkActions
                selectedCount={selectedIds.length}
                totalCount={projects.length}
                actions={bulkActions}
                onAction={handleBulkAction}
                onClearSelection={() => setSelectedIds([])}
              />
            </div>
          )}

          {/* Data Display */}
          <div className="p-0">
            {viewMode === 'table' && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {isColumnVisible('checkbox') && (
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedIds.length === projects.length && projects.length > 0}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                      )}
                      {isColumnVisible('name') && <TableHead>Project Name</TableHead>}
                      {isColumnVisible('status') && <TableHead>Status</TableHead>}
                      {isColumnVisible('lead') && <TableHead className="hidden md:table-cell">Project Lead</TableHead>}
                      {isColumnVisible('timeline') && <TableHead className="hidden lg:table-cell">Timeline</TableHead>}
                      {isColumnVisible('progress') && <TableHead>Progress</TableHead>}
                      {isColumnVisible('tasks') && <TableHead className="hidden xl:table-cell">No. of Tasks</TableHead>}
                      {isColumnVisible('actions') && <TableHead className="text-right">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i} className="animate-pulse">
                          {isColumnVisible('checkbox') && <TableCell><div className="h-4 w-4 bg-muted rounded"></div></TableCell>}
                          {isColumnVisible('name') && <TableCell><div className="h-4 bg-muted rounded"></div></TableCell>}
                          {isColumnVisible('status') && <TableCell><div className="h-4 bg-muted rounded"></div></TableCell>}
                          {isColumnVisible('lead') && <TableCell className="hidden md:table-cell"><div className="h-4 bg-muted rounded"></div></TableCell>}
                          {isColumnVisible('timeline') && <TableCell className="hidden lg:table-cell"><div className="h-4 bg-muted rounded"></div></TableCell>}
                          {isColumnVisible('progress') && <TableCell><div className="h-4 bg-muted rounded"></div></TableCell>}
                          {isColumnVisible('tasks') && <TableCell className="hidden xl:table-cell"><div className="h-4 bg-muted rounded"></div></TableCell>}
                          {isColumnVisible('actions') && <TableCell><div className="h-4 bg-muted rounded"></div></TableCell>}
                        </TableRow>
                      ))
                    ) : projects.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                          No projects found
                        </TableCell>
                      </TableRow>
                    ) : (
                      projects.map((project) => (
                        <TableRow
                          key={project.id}
                          className={`cursor-pointer hover:bg-muted/50 transition-colors ${selectedIds.includes(project.id) ? 'bg-muted/50' : ''}`}
                          onClick={(e) => handleRowClick(project.id, e)}
                        >
                          {isColumnVisible('checkbox') && (
                            <TableCell>
                              <Checkbox
                                checked={selectedIds.includes(project.id)}
                                onCheckedChange={(checked) => handleSelectOne(project.id, checked as boolean)}
                              />
                            </TableCell>
                          )}
                          {isColumnVisible('name') && (
                            <TableCell>
                              <div className="font-medium text-foreground">{project.name}</div>
                              <div className="text-sm text-muted-foreground">{project.id}</div>
                            </TableCell>
                          )}
                          {isColumnVisible('status') && (
                            <TableCell>
                              <Badge variant={statusVariants[project.status] || 'default'}>
                                {project.status}
                              </Badge>
                            </TableCell>
                          )}
                          {isColumnVisible('lead') && (
                            <TableCell className="hidden md:table-cell text-foreground">{project.lead}</TableCell>
                          )}
                          {isColumnVisible('timeline') && (
                            <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                              <div>{project.startDate}</div>
                              <div>{project.endDate}</div>
                            </TableCell>
                          )}
                          {isColumnVisible('progress') && (
                            <TableCell>
                              <div className="flex items-center gap-2 min-w-[120px]">
                                <Progress value={project.progress} className="h-2 flex-1" />
                                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                                  {project.progress}%
                                </span>
                              </div>
                            </TableCell>
                          )}
                          {isColumnVisible('tasks') && (
                            <TableCell className="hidden xl:table-cell text-sm text-muted-foreground">
                              {project.tasksCompleted}/{project.tasksTotal}
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
                                  <DropdownMenuItem onClick={() => handleView(project.id)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEdit(project.id)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Project
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleDelete(project.id)}
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
                ) : projects.length === 0 ? (
                  <div className="col-span-full h-32 flex items-center justify-center text-muted-foreground">
                    No projects found
                  </div>
                ) : (
                  projects.map((project) => (
                    <Card key={project.id} className={selectedIds.includes(project.id) ? 'ring-2 ring-primary' : ''}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <Checkbox
                              checked={selectedIds.includes(project.id)}
                              onCheckedChange={(checked) => handleSelectOne(project.id, checked as boolean)}
                              className="mt-1"
                            />
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-base font-semibold truncate">{project.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">{project.id}</p>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleView(project.id)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(project.id)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(project.id)}
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
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge variant={statusVariants[project.status] || 'default'}>
                            {project.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Lead:</span>
                          <span className="font-medium">{project.lead}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Tasks:</span>
                          <span className="font-medium">{project.tasksCompleted}/{project.tasksTotal}</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress:</span>
                            <span className="font-medium">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>
                        <div className="pt-2 text-xs text-muted-foreground">
                          {project.startDate} - {project.endDate}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}

            {/* Card View */}
            {viewMode === 'card' && (
              <div className="p-3 sm:p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-3">
                        <div className="h-4 bg-muted rounded mb-2"></div>
                        <div className="h-4 bg-muted rounded w-2/3"></div>
                      </CardContent>
                    </Card>
                  ))
                ) : projects.length === 0 ? (
                  <div className="col-span-full h-32 flex items-center justify-center text-muted-foreground">
                    No projects found
                  </div>
                ) : (
                  projects.map((project) => (
                    <Card
                      key={project.id}
                      className={`hover:shadow-md transition-shadow ${selectedIds.includes(project.id) ? 'ring-2 ring-primary' : ''}`}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-start gap-2 flex-1 min-w-0">
                            <Checkbox
                              checked={selectedIds.includes(project.id)}
                              onCheckedChange={(checked) => handleSelectOne(project.id, checked as boolean)}
                              className="mt-0.5"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-semibold text-foreground line-clamp-1">{project.name}</h3>
                              <p className="text-xs text-muted-foreground">{project.id}</p>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleView(project.id)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(project.id)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(project.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant={statusVariants[project.status] || 'default'} className="text-xs">
                              {project.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-muted-foreground">Lead:</span>
                              <p className="font-medium truncate">{project.lead}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Tasks:</span>
                              <p className="font-medium">{project.tasksCompleted}/{project.tasksTotal}</p>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-1.5" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
  );
}
