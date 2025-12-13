'use client';

import { useState } from 'react';
import { Plus, Eye, Pencil, Trash2, Play, Calendar, Target, Users, TrendingUp } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import SearchBar from '@/components/SearchBar';
import FilterExportBar from '@/components/FilterExportBar';
import ViewToggle, { ViewMode } from '@/components/ViewToggle';
import ColumnToggle, { ColumnConfig } from '@/components/ColumnToggle';
import BulkActions, { BulkAction } from '@/components/BulkActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

// Mock data
interface Sprint {
  id: string;
  name: string;
  goal: string;
  status: 'Planning' | 'Active' | 'Completed' | 'Cancelled';
  startDate: string;
  endDate: string;
  totalStoryPoints: number;
  completedStoryPoints: number;
  tasksTotal: number;
  tasksCompleted: number;
  team: string[];
  project: string;
}

const mockSprints: Sprint[] = [
  {
    id: '1',
    name: 'Sprint 5 - Q4 Goals',
    goal: 'Complete user authentication and profile management',
    status: 'Active',
    startDate: '2025-11-01',
    endDate: '2025-11-14',
    totalStoryPoints: 45,
    completedStoryPoints: 28,
    tasksTotal: 15,
    tasksCompleted: 9,
    team: ['John Doe', 'Jane Smith', 'Mike Johnson'],
    project: 'IndusApp'
  },
  {
    id: '2',
    name: 'Sprint 4 - October',
    goal: 'Dashboard improvements and reporting features',
    status: 'Completed',
    startDate: '2025-10-18',
    endDate: '2025-10-31',
    totalStoryPoints: 52,
    completedStoryPoints: 52,
    tasksTotal: 18,
    tasksCompleted: 18,
    team: ['John Doe', 'Jane Smith'],
    project: 'IndusApp'
  },
  {
    id: '3',
    name: 'Sprint 6 - Planning',
    goal: 'Advanced search and filtering capabilities',
    status: 'Planning',
    startDate: '2025-11-15',
    endDate: '2025-11-28',
    totalStoryPoints: 38,
    completedStoryPoints: 0,
    tasksTotal: 12,
    tasksCompleted: 0,
    team: ['Mike Johnson', 'Sarah Wilson'],
    project: 'IndusApp'
  },
  {
    id: '4',
    name: 'Sprint 3 - September',
    goal: 'Mobile responsiveness and UI polish',
    status: 'Completed',
    startDate: '2025-09-20',
    endDate: '2025-10-03',
    totalStoryPoints: 48,
    completedStoryPoints: 45,
    tasksTotal: 16,
    tasksCompleted: 15,
    team: ['Jane Smith', 'Sarah Wilson'],
    project: 'IndusApp'
  },
  {
    id: '5',
    name: 'Sprint 2 - August',
    goal: 'Core backend API development',
    status: 'Completed',
    startDate: '2025-08-15',
    endDate: '2025-08-28',
    totalStoryPoints: 60,
    completedStoryPoints: 58,
    tasksTotal: 20,
    tasksCompleted: 19,
    team: ['John Doe', 'Mike Johnson'],
    project: 'IndusApp'
  },
];

const statusVariant: Record<Sprint['status'], 'default' | 'secondary' | 'outline' | 'destructive'> = {
  'Planning': 'outline',
  'Active': 'default',
  'Completed': 'secondary',
  'Cancelled': 'destructive'
};

export default function SprintsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');

  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: 'checkbox', label: 'Select', visible: true },
    { key: 'name', label: 'Sprint Name', visible: true },
    { key: 'status', label: 'Status', visible: true },
    { key: 'dates', label: 'Start - End Date', visible: true },
    { key: 'progress', label: 'Progress', visible: true },
    { key: 'storyPoints', label: 'Story Points', visible: true },
    { key: 'tasks', label: 'Tasks', visible: true },
    { key: 'team', label: 'Team', visible: true },
    { key: 'actions', label: 'Actions', visible: true },
  ]);

  // Filter config
  const filterConfig = [
    {
      key: 'status',
      label: 'Status',
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: 'all', label: 'All Statuses' },
        { value: 'planning', label: 'Planning' },
        { value: 'active', label: 'Active' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
      ],
    },
    {
      key: 'project',
      label: 'Project',
      value: projectFilter,
      onChange: setProjectFilter,
      options: [
        { value: 'all', label: 'All Projects' },
        { value: 'indusapp', label: 'IndusApp' },
        { value: 'mobile', label: 'Mobile App' },
      ],
    },
  ];

  // Bulk actions
  const bulkActions: BulkAction[] = [
    { value: 'export', label: 'Export Selected' },
    { value: 'archive', label: 'Archive Selected' },
    { value: 'delete', label: 'Delete Selected', variant: 'destructive' },
  ];

  // Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(mockSprints.map(sprint => sprint.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    }
  };

  const handleBulkAction = (action: string) => {
    console.log('Bulk action:', action, 'for IDs:', selectedIds);
    // TODO: Implement bulk actions
    setSelectedIds([]);
  };

  const handleView = (id: string) => {
    console.log('View sprint:', id);
    // router.push(`/projectmanagement/sprints/${id}`);
  };

  const handleEdit = (id: string) => {
    console.log('Edit sprint:', id);
    // router.push(`/projectmanagement/sprints/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    console.log('Delete sprint:', id);
    // TODO: Implement delete
  };

  const handleStartSprint = (id: string) => {
    console.log('Start sprint:', id);
    // TODO: Implement start sprint
  };

  const getProgressPercentage = (sprint: Sprint) => {
    if (sprint.totalStoryPoints === 0) return 0;
    return Math.round((sprint.completedStoryPoints / sprint.totalStoryPoints) * 100);
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const end = new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${start} - ${end}`;
  };

  const getVisibleColumns = () => columns.filter(col => col.visible);

  return (
    <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">
      {/* Page Header */}
      <PageHeader
        title="Sprints"
        primaryAction={{
          content: 'Create Sprint',
          onClick: () => console.log('Create sprint'),
          icon: Plus,
        }}
      />

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search sprints..."
      />

      {/* Toolbar Row - Filters + View Controls */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <FilterExportBar
          filters={filterConfig}
          onExport={(format) => console.log('Export as:', format)}
        />
        <div className="flex items-center gap-2">
          <ViewToggle
            view={viewMode}
            onViewChange={setViewMode}
            modes={['table', 'grid', 'card']}
          />
          {viewMode === 'table' && (
            <ColumnToggle columns={columns} onColumnChange={setColumns} />
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <BulkActions
          selectedCount={selectedIds.length}
          totalCount={mockSprints.length}
          actions={bulkActions}
          onAction={handleBulkAction}
          onClearSelection={() => setSelectedIds([])}
        />
      )}

      {/* Data Display */}
      <Card>
        <CardContent className="p-0">
          {/* Table View */}
          {viewMode === 'table' && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {getVisibleColumns().map((column) => {
                      if (column.key === 'checkbox') {
                        return (
                          <TableHead key={column.key} className="w-12">
                            <Checkbox
                              checked={selectedIds.length === mockSprints.length}
                              onCheckedChange={handleSelectAll}
                            />
                          </TableHead>
                        );
                      }
                      return <TableHead key={column.key}>{column.label}</TableHead>;
                    })}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSprints.map((sprint) => (
                    <TableRow key={sprint.id}>
                      {getVisibleColumns().map((column) => {
                        if (column.key === 'checkbox') {
                          return (
                            <TableCell key={column.key}>
                              <Checkbox
                                checked={selectedIds.includes(sprint.id)}
                                onCheckedChange={(checked) => handleSelectOne(sprint.id, checked as boolean)}
                              />
                            </TableCell>
                          );
                        }
                        if (column.key === 'name') {
                          return (
                            <TableCell key={column.key}>
                              <div>
                                <div className="font-medium text-foreground">{sprint.name}</div>
                                <div className="text-sm text-muted-foreground line-clamp-1">{sprint.goal}</div>
                              </div>
                            </TableCell>
                          );
                        }
                        if (column.key === 'status') {
                          return (
                            <TableCell key={column.key}>
                              <Badge variant={statusVariant[sprint.status]}>{sprint.status}</Badge>
                            </TableCell>
                          );
                        }
                        if (column.key === 'dates') {
                          return (
                            <TableCell key={column.key} className="text-sm">
                              {formatDateRange(sprint.startDate, sprint.endDate)}
                            </TableCell>
                          );
                        }
                        if (column.key === 'progress') {
                          const percentage = getProgressPercentage(sprint);
                          return (
                            <TableCell key={column.key}>
                              <div className="flex items-center gap-2">
                                <Progress value={percentage} className="h-2 w-24" />
                                <span className="text-sm text-muted-foreground">{percentage}%</span>
                              </div>
                            </TableCell>
                          );
                        }
                        if (column.key === 'storyPoints') {
                          return (
                            <TableCell key={column.key}>
                              <span className="text-sm">
                                <span className="font-medium text-primary">{sprint.completedStoryPoints}</span>
                                <span className="text-muted-foreground">/{sprint.totalStoryPoints} SP</span>
                              </span>
                            </TableCell>
                          );
                        }
                        if (column.key === 'tasks') {
                          return (
                            <TableCell key={column.key}>
                              <span className="text-sm">
                                <span className="font-medium">{sprint.tasksCompleted}</span>
                                <span className="text-muted-foreground">/{sprint.tasksTotal}</span>
                              </span>
                            </TableCell>
                          );
                        }
                        if (column.key === 'team') {
                          return (
                            <TableCell key={column.key}>
                              <div className="text-sm text-muted-foreground">
                                {sprint.team.length} members
                              </div>
                            </TableCell>
                          );
                        }
                        if (column.key === 'actions') {
                          return (
                            <TableCell key={column.key} className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleView(sprint.id)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEdit(sprint.id)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit Sprint
                                  </DropdownMenuItem>
                                  {sprint.status === 'Planning' && (
                                    <DropdownMenuItem onClick={() => handleStartSprint(sprint.id)}>
                                      <Play className="mr-2 h-4 w-4" />
                                      Start Sprint
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleDelete(sprint.id)}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          );
                        }
                        return null;
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {mockSprints.map((sprint) => (
                <Card key={sprint.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <Checkbox
                        checked={selectedIds.includes(sprint.id)}
                        onCheckedChange={(checked) => handleSelectOne(sprint.id, checked as boolean)}
                      />
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base line-clamp-1">{sprint.name}</CardTitle>
                        <CardDescription className="text-sm line-clamp-2 mt-1">
                          {sprint.goal}
                        </CardDescription>
                      </div>
                      <Badge variant={statusVariant[sprint.status]} className="shrink-0">
                        {sprint.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDateRange(sprint.startDate, sprint.endDate)}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{getProgressPercentage(sprint)}%</span>
                      </div>
                      <Progress value={getProgressPercentage(sprint)} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Target className="w-4 h-4" />
                          <span className="text-xs">Story Points</span>
                        </div>
                        <div className="text-sm font-medium">
                          <span className="text-primary">{sprint.completedStoryPoints}</span>
                          <span className="text-muted-foreground">/{sprint.totalStoryPoints}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span className="text-xs">Team</span>
                        </div>
                        <div className="text-sm font-medium">{sprint.team.length} members</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(sprint.id)}
                        className="flex-1"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(sprint.id)}
                        className="flex-1"
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {sprint.status === 'Planning' && (
                            <>
                              <DropdownMenuItem onClick={() => handleStartSprint(sprint.id)}>
                                <Play className="mr-2 h-4 w-4" />
                                Start Sprint
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleDelete(sprint.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Card View */}
          {viewMode === 'card' && (
            <div className="p-6 space-y-4">
              {mockSprints.map((sprint) => (
                <Card key={sprint.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={selectedIds.includes(sprint.id)}
                        onCheckedChange={(checked) => handleSelectOne(sprint.id, checked as boolean)}
                        className="mt-1"
                      />
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-semibold text-foreground">{sprint.name}</h3>
                              <Badge variant={statusVariant[sprint.status]}>{sprint.status}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{sprint.goal}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleView(sprint.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(sprint.id)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Sprint
                              </DropdownMenuItem>
                              {sprint.status === 'Planning' && (
                                <DropdownMenuItem onClick={() => handleStartSprint(sprint.id)}>
                                  <Play className="mr-2 h-4 w-4" />
                                  Start Sprint
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(sprint.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <span>Duration</span>
                            </div>
                            <div className="text-sm font-medium">{formatDateRange(sprint.startDate, sprint.endDate)}</div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <TrendingUp className="w-4 h-4" />
                              <span>Progress</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Progress value={getProgressPercentage(sprint)} className="h-2 flex-1" />
                              <span className="text-sm font-medium">{getProgressPercentage(sprint)}%</span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Target className="w-4 h-4" />
                              <span>Story Points</span>
                            </div>
                            <div className="text-sm font-medium">
                              <span className="text-primary">{sprint.completedStoryPoints}</span>
                              <span className="text-muted-foreground">/{sprint.totalStoryPoints} SP</span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Users className="w-4 h-4" />
                              <span>Team Size</span>
                            </div>
                            <div className="text-sm font-medium">{sprint.team.length} members</div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(sprint.id)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(sprint.id)}
                          >
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit Sprint
                          </Button>
                          {sprint.status === 'Planning' && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleStartSprint(sprint.id)}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Start Sprint
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
