'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FilterExportBar from '@/components/FilterExportBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ArrowLeft, Plus, CheckSquare, Clock, MoreVertical, Eye, Edit, Trash2, Play, Check,
  Phone, Mail, MessageSquare, CheckCircle, CalendarPlus, PlusCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { mockTeamMembers } from '@/lib/assets-mock-data';

// Mock data for Tasks
const mockTasks = [
  {
    id: '1',
    title: 'Prepare demo presentation',
    description: 'Create slides for product demo',
    lead_name: 'ABC Corporation',
    due_date: '2024-12-08',
    priority: 'High',
    status: 'In Progress',
    assigned_to: 'Sarah Wilson'
  },
  {
    id: '2',
    title: 'Send proposal document',
    description: 'Draft and send project proposal',
    lead_name: 'XYZ Ltd',
    due_date: '2024-12-10',
    priority: 'Medium',
    status: 'Pending',
    assigned_to: 'Mike Johnson'
  },
  {
    id: '3',
    title: 'Follow up on quotation',
    description: 'Check if client reviewed the quote',
    lead_name: 'Tech Solutions',
    due_date: '2024-12-06',
    priority: 'High',
    status: 'Completed',
    assigned_to: 'Sarah Wilson'
  },
];

// Mock data for Activity
const mockActivities = [
  {
    id: '1',
    type: 'Call',
    lead_name: 'ABC Corporation',
    contact_name: 'John Doe',
    activity_date: '2024-12-06',
    due_time: '10:00 AM',
    assigned_to: 'Sarah Wilson',
    status: 'Completed',
    logged_or_scheduled: 'Logged',
    notes: 'Discussed project requirements and timeline'
  },
  {
    id: '2',
    type: 'Email',
    lead_name: 'XYZ Ltd',
    contact_name: 'Jane Smith',
    activity_date: '2024-12-08',
    due_time: '02:00 PM',
    assigned_to: 'Mike Johnson',
    status: 'Pending',
    logged_or_scheduled: 'Scheduled',
    notes: 'Send proposal document and pricing'
  },
  {
    id: '3',
    type: 'Follow-up',
    lead_name: 'Tech Solutions',
    contact_name: 'Bob Williams',
    activity_date: '2024-12-07',
    due_time: '11:30 AM',
    assigned_to: 'Sarah Wilson',
    status: 'Pending',
    logged_or_scheduled: 'Scheduled',
    notes: 'Check on demo feedback and next steps'
  },
];

// Filter options for Tasks
const taskPriorityOptions = [
  { label: 'All Priorities', value: 'all' },
  { label: 'High', value: 'High' },
  { label: 'Medium', value: 'Medium' },
  { label: 'Low', value: 'Low' }
];

const taskStatusOptions = [
  { label: 'All Status', value: 'all' },
  { label: 'Pending', value: 'Pending' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Completed', value: 'Completed' }
];

// Filter options for Activity
const activityTypeOptions = [
  { label: 'All Types', value: 'all' },
  { label: 'Call', value: 'Call' },
  { label: 'Email', value: 'Email' },
  { label: 'Follow-up', value: 'Follow-up' },
  { label: 'WhatsApp', value: 'WhatsApp' }
];

const activityStatusOptions = [
  { label: 'All Status', value: 'all' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Overdue', value: 'Overdue' }
];

const getTaskStatusBadge = (status: string) => {
  const variants: any = {
    'Pending': 'secondary',
    'In Progress': 'default',
    'Completed': 'outline'
  };
  return variants[status] || 'secondary';
};

const getPriorityBadge = (priority: string) => {
  const variants: any = {
    'High': 'destructive',
    'Medium': 'default',
    'Low': 'secondary'
  };
  return variants[priority] || 'secondary';
};

const getActivityStatusBadge = (status: string) => {
  const variants: any = {
    'Pending': 'secondary',
    'Completed': 'default',
    'Overdue': 'destructive'
  };
  return variants[status] || 'secondary';
};

const getActivityIcon = (type: string) => {
  const icons: any = {
    'Call': <Phone className="w-4 h-4 text-green-500" />,
    'Email': <Mail className="w-4 h-4 text-blue-500" />,
    'Follow-up': <CheckCircle className="w-4 h-4 text-purple-500" />,
    'WhatsApp': <MessageSquare className="w-4 h-4 text-teal-500" />
  };
  return icons[type] || <Clock className="w-4 h-4 text-muted-foreground" />;
};

export default function TasksPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'tasks' | 'activity'>('tasks');

  // Tasks states
  const [tasksViewMode, setTasksViewMode] = useState<'card' | 'table'>('table');
  const [tasksSearchQuery, setTasksSearchQuery] = useState('');
  const [taskPriorityFilter, setTaskPriorityFilter] = useState('all');
  const [taskStatusFilter, setTaskStatusFilter] = useState('all');

  // Activity states
  const [activityViewMode, setActivityViewMode] = useState<'card' | 'table'>('table');
  const [activitySearchQuery, setActivitySearchQuery] = useState('');
  const [activityTypeFilter, setActivityTypeFilter] = useState('all');
  const [activityStatusFilter, setActivityStatusFilter] = useState('all');

  // Tasks Dialog states
  const [isCreateTaskOpen, setCreateTaskOpen] = useState(false);
  const [isViewTaskDetailsOpen, setViewTaskDetailsOpen] = useState(false);
  const [isEditTaskOpen, setEditTaskOpen] = useState(false);
  const [isMarkTaskCompleteOpen, setMarkTaskCompleteOpen] = useState(false);
  const [isDeleteTaskOpen, setDeleteTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  // Activity Dialog states
  const [isLogActivityOpen, setLogActivityOpen] = useState(false);
  const [isScheduleReminderOpen, setScheduleReminderOpen] = useState(false);
  const [isViewActivityDetailsOpen, setViewActivityDetailsOpen] = useState(false);
  const [isEditActivityOpen, setEditActivityOpen] = useState(false);
  const [isMarkActivityDoneOpen, setMarkActivityDoneOpen] = useState(false);
  const [isDeleteActivityOpen, setDeleteActivityOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  // Tasks Form state
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    lead_name: '',
    due_date: '',
    priority: 'Medium',
    assigned_to: ''
  });

  // Activity Form states
  const [logFormData, setLogFormData] = useState({
    type: 'Call',
    lead_name: '',
    contact_name: '',
    activity_date: '',
    due_time: '',
    assigned_to: '',
    notes: ''
  });

  const [scheduleFormData, setScheduleFormData] = useState({
    type: 'Call',
    lead_name: '',
    contact_name: '',
    activity_date: '',
    due_time: '',
    assigned_to: '',
    notes: ''
  });

  const handleExport = (format: 'excel' | 'csv' | 'pdf') => {
    toast.success(`Exporting to ${format.toUpperCase()}`);
  };

  // Tasks handlers
  const handleCreateTask = () => {
    toast.success('Task created successfully!');
    setCreateTaskOpen(false);
    setTaskFormData({
      title: '',
      description: '',
      lead_name: '',
      due_date: '',
      priority: 'Medium',
      assigned_to: ''
    });
  };

  const handleViewTaskDetails = (task: any) => {
    setSelectedTask(task);
    setViewTaskDetailsOpen(true);
  };

  const handleEditTask = (task: any) => {
    setSelectedTask(task);
    setEditTaskOpen(true);
  };

  const handleStartTask = (task: any) => {
    toast.success(`Task "${task.title}" moved to In Progress!`);
  };

  const handleMarkTaskComplete = (task: any) => {
    setSelectedTask(task);
    setMarkTaskCompleteOpen(true);
  };

  const handleDeleteTask = (task: any) => {
    setSelectedTask(task);
    setDeleteTaskOpen(true);
  };

  const confirmMarkTaskComplete = () => {
    toast.success(`Task "${selectedTask?.title}" marked as completed!`);
    setMarkTaskCompleteOpen(false);
    setSelectedTask(null);
  };

  const confirmDeleteTask = () => {
    toast.success(`Task "${selectedTask?.title}" deleted successfully!`);
    setDeleteTaskOpen(false);
    setSelectedTask(null);
  };

  const confirmEditTask = () => {
    toast.success(`Task "${selectedTask?.title}" updated successfully!`);
    setEditTaskOpen(false);
    setSelectedTask(null);
  };

  // Activity handlers
  const handleLogActivity = () => {
    toast.success('Activity logged successfully!');
    setLogActivityOpen(false);
    setLogFormData({
      type: 'Call',
      lead_name: '',
      contact_name: '',
      activity_date: '',
      due_time: '',
      assigned_to: '',
      notes: ''
    });
  };

  const handleScheduleReminder = () => {
    toast.success('Reminder scheduled successfully!');
    setScheduleReminderOpen(false);
    setScheduleFormData({
      type: 'Call',
      lead_name: '',
      contact_name: '',
      activity_date: '',
      due_time: '',
      assigned_to: '',
      notes: ''
    });
  };

  const handleViewActivityDetails = (activity: any) => {
    setSelectedActivity(activity);
    setViewActivityDetailsOpen(true);
  };

  const handleEditActivity = (activity: any) => {
    setSelectedActivity(activity);
    setEditActivityOpen(true);
  };

  const handleMarkActivityDone = (activity: any) => {
    setSelectedActivity(activity);
    setMarkActivityDoneOpen(true);
  };

  const handleDeleteActivity = (activity: any) => {
    setSelectedActivity(activity);
    setDeleteActivityOpen(true);
  };

  const confirmMarkActivityDone = () => {
    toast.success(`Activity marked as completed!`);
    setMarkActivityDoneOpen(false);
    setSelectedActivity(null);
  };

  const confirmDeleteActivity = () => {
    toast.success(`Activity deleted successfully!`);
    setDeleteActivityOpen(false);
    setSelectedActivity(null);
  };

  const confirmEditActivity = () => {
    toast.success(`Activity updated successfully!`);
    setEditActivityOpen(false);
    setSelectedActivity(null);
  };

  // Filtering
  const filteredTasks = mockTasks.filter(task => {
    const matchesSearch = tasksSearchQuery === '' ||
      task.title.toLowerCase().includes(tasksSearchQuery.toLowerCase()) ||
      task.lead_name.toLowerCase().includes(tasksSearchQuery.toLowerCase());
    const matchesPriority = taskPriorityFilter === 'all' || task.priority === taskPriorityFilter;
    const matchesStatus = taskStatusFilter === 'all' || task.status === taskStatusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const filteredActivities = mockActivities.filter(activity => {
    const matchesSearch = activitySearchQuery === '' ||
      activity.lead_name.toLowerCase().includes(activitySearchQuery.toLowerCase()) ||
      activity.contact_name.toLowerCase().includes(activitySearchQuery.toLowerCase());
    const matchesType = activityTypeFilter === 'all' || activity.type === activityTypeFilter;
    const matchesStatus = activityStatusFilter === 'all' || activity.status === activityStatusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-2 lg:space-y-3 py-3 lg:py-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            {activeTab === 'tasks' ? 'Tasks' : 'Activity Log'}
          </h2>
        </div>
        {activeTab === 'tasks' ? (
          <Button
            onClick={() => setCreateTaskOpen(true)}
            className="flex items-center justify-center sm:space-x-2 sm:px-4 sm:py-2 bg-primary text-primary-foreground rounded-full sm:rounded-lg hover:bg-primary/90 transition-colors font-medium w-9 h-9 sm:w-auto sm:h-auto flex-shrink-0"
          >
            <Plus className="w-5 h-5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline text-sm">Add Task</span>
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLogActivityOpen(true)}
              className="flex items-center"
            >
              <PlusCircle className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Log Activity</span>
            </Button>
            <Button
              size="sm"
              onClick={() => setScheduleReminderOpen(true)}
              className="flex items-center"
            >
              <CalendarPlus className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Schedule Reminder</span>
            </Button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'tasks' | 'activity')}>
        <TabsList className="w-full grid grid-cols-2 h-10">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="mt-3">
          <Card className="border-border shadow-sm rounded-lg sm:rounded-xl">
            <div className="p-2 border-b border-border">
              <FilterExportBar
                filters={[
                  {
                    key: 'priority',
                    label: 'Priority',
                    options: taskPriorityOptions,
                    value: taskPriorityFilter,
                    onChange: setTaskPriorityFilter
                  },
                  {
                    key: 'status',
                    label: 'Status',
                    options: taskStatusOptions,
                    value: taskStatusFilter,
                    onChange: setTaskStatusFilter
                  }
                ]}
                onExport={handleExport}
                showViewToggle={true}
                viewToggleProps={{
                  currentView: tasksViewMode,
                  onViewChange: setTasksViewMode
                }}
                showSearch={true}
                searchProps={{
                  placeholder: 'Search tasks...',
                  value: tasksSearchQuery,
                  onChange: setTasksSearchQuery
                }}
              />
            </div>

            <CardContent className="p-0">
              {filteredTasks.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-muted-foreground">
                  No tasks found
                </div>
              ) : tasksViewMode === 'table' ? (
                /* Tasks Table View */
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Task</TableHead>
                        <TableHead>Lead/Company</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTasks.map((task) => (
                        <TableRow key={task.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell>
                            <div>
                              <div className="font-medium">{task.title}</div>
                              <div className="text-xs text-muted-foreground">{task.description}</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{task.lead_name}</TableCell>
                          <TableCell className="text-sm">{task.due_date}</TableCell>
                          <TableCell>
                            <Badge variant={getPriorityBadge(task.priority)} className="text-xs">
                              {task.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getTaskStatusBadge(task.status)} className="text-xs">
                              {task.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{task.assigned_to}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewTaskDetails(task)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditTask(task)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                {task.status === 'Pending' && (
                                  <DropdownMenuItem onClick={() => handleStartTask(task)}>
                                    <Play className="w-4 h-4 mr-2" />
                                    Start Task
                                  </DropdownMenuItem>
                                )}
                                {task.status !== 'Completed' && (
                                  <DropdownMenuItem onClick={() => handleMarkTaskComplete(task)}>
                                    <Check className="w-4 h-4 mr-2" />
                                    Mark as Complete
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleDeleteTask(task)} className="text-destructive">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                /* Tasks Card View */
                <div className="p-2 sm:p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {filteredTasks.map((task) => (
                    <Card key={task.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Badge variant={getPriorityBadge(task.priority)} className="text-xs px-1.5 py-0">
                                {task.priority}
                              </Badge>
                              <Badge variant={getTaskStatusBadge(task.status)} className="text-xs px-1.5 py-0">
                                {task.status}
                              </Badge>
                            </div>
                            <h3 className="text-sm font-semibold text-foreground line-clamp-1">{task.title}</h3>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{task.description}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                                <MoreVertical className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewTaskDetails(task)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditTask(task)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              {task.status === 'Pending' && (
                                <DropdownMenuItem onClick={() => handleStartTask(task)}>
                                  <Play className="w-4 h-4 mr-2" />
                                  Start Task
                                </DropdownMenuItem>
                              )}
                              {task.status !== 'Completed' && (
                                <DropdownMenuItem onClick={() => handleMarkTaskComplete(task)}>
                                  <Check className="w-4 h-4 mr-2" />
                                  Mark as Complete
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDeleteTask(task)} className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="space-y-1.5 mt-3">
                          <div className="flex items-center gap-1.5 text-xs">
                            <CheckSquare className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            <span className="text-muted-foreground truncate">{task.lead_name}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs">
                            <Clock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            <span className="text-muted-foreground">Due: {task.due_date}</span>
                          </div>
                          <div className="pt-1 border-t mt-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Assigned to:</span>
                              <span className="font-medium">{task.assigned_to}</span>
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
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="mt-3">
          <Card className="border-border shadow-sm rounded-lg sm:rounded-xl">
            <div className="p-2 border-b border-border">
              <FilterExportBar
                filters={[
                  {
                    key: 'type',
                    label: 'Type',
                    options: activityTypeOptions,
                    value: activityTypeFilter,
                    onChange: setActivityTypeFilter
                  },
                  {
                    key: 'status',
                    label: 'Status',
                    options: activityStatusOptions,
                    value: activityStatusFilter,
                    onChange: setActivityStatusFilter
                  }
                ]}
                onExport={handleExport}
                showViewToggle={true}
                viewToggleProps={{
                  currentView: activityViewMode,
                  onViewChange: setActivityViewMode
                }}
                showSearch={true}
                searchProps={{
                  placeholder: 'Search activities...',
                  value: activitySearchQuery,
                  onChange: setActivitySearchQuery
                }}
              />
            </div>

            <CardContent className="p-0">
              {filteredActivities.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-muted-foreground">
                  No activities found
                </div>
              ) : activityViewMode === 'table' ? (
                /* Activity Table View */
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Lead/Company</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredActivities.map((activity) => (
                        <TableRow key={activity.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getActivityIcon(activity.type)}
                              <span className="font-medium text-sm">{activity.type}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{activity.lead_name}</TableCell>
                          <TableCell className="text-sm">{activity.contact_name}</TableCell>
                          <TableCell className="text-sm">
                            <div>
                              <div className="font-medium">{activity.activity_date}</div>
                              <div className="text-xs text-muted-foreground">{activity.due_time}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{activity.assigned_to}</TableCell>
                          <TableCell>
                            <Badge variant={getActivityStatusBadge(activity.status)} className="text-xs">
                              {activity.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                            {activity.notes}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewActivityDetails(activity)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditActivity(activity)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                {activity.status === 'Pending' && (
                                  <DropdownMenuItem onClick={() => handleMarkActivityDone(activity)}>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Mark as Done
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleDeleteActivity(activity)} className="text-destructive">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                /* Activity Card View */
                <div className="p-2 sm:p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {filteredActivities.map((activity) => (
                    <Card key={activity.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            {getActivityIcon(activity.type)}
                            <span className="text-sm font-semibold">{activity.type}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={getActivityStatusBadge(activity.status)} className="text-xs px-1.5 py-0">
                              {activity.status}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                  <MoreVertical className="h-3.5 w-3.5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewActivityDetails(activity)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditActivity(activity)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                {activity.status === 'Pending' && (
                                  <DropdownMenuItem onClick={() => handleMarkActivityDone(activity)}>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Mark as Done
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleDeleteActivity(activity)} className="text-destructive">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <h3 className="text-sm font-semibold text-foreground mb-1">{activity.lead_name}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{activity.contact_name}</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Date:</span>
                            <span className="font-medium">{activity.activity_date}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Time:</span>
                            <span className="font-medium">{activity.due_time}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Assigned:</span>
                            <span className="font-medium">{activity.assigned_to}</span>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t">
                          <p className="text-xs text-muted-foreground line-clamp-2">{activity.notes}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Tasks Dialogs */}
      {/* Create Task Dialog */}
      <Dialog open={isCreateTaskOpen} onOpenChange={setCreateTaskOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>Add a new task to your workflow</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Task Title *</Label>
              <Input placeholder="e.g., Prepare demo presentation" value={taskFormData.title} onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Task details..." rows={3} value={taskFormData.description} onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={taskFormData.priority} onValueChange={(val) => setTaskFormData({ ...taskFormData, priority: val })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input type="date" value={taskFormData.due_date} onChange={(e) => setTaskFormData({ ...taskFormData, due_date: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Related Lead/Company</Label>
              <Input placeholder="ABC Corporation" value={taskFormData.lead_name} onChange={(e) => setTaskFormData({ ...taskFormData, lead_name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Assign To</Label>
              <Select value={taskFormData.assigned_to} onValueChange={(val) => setTaskFormData({ ...taskFormData, assigned_to: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  {mockTeamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.fullName}>{member.fullName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateTask}>Create Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Task Details Dialog */}
      <Dialog open={isViewTaskDetailsOpen} onOpenChange={setViewTaskDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-3 py-4">
              <div>
                <Label className="text-xs text-muted-foreground">Title</Label>
                <p className="font-medium">{selectedTask.title}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Description</Label>
                <p className="text-sm">{selectedTask.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Priority</Label>
                  <Badge variant={getPriorityBadge(selectedTask.priority)} className="text-xs">{selectedTask.priority}</Badge>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <Badge variant={getTaskStatusBadge(selectedTask.status)} className="text-xs">{selectedTask.status}</Badge>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Lead/Company</Label>
                <p className="font-medium">{selectedTask.lead_name}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Due Date</Label>
                  <p className="font-medium">{selectedTask.due_date}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Assigned To</Label>
                  <p className="font-medium">{selectedTask.assigned_to}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={isEditTaskOpen} onOpenChange={setEditTaskOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Update task details</DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input defaultValue={selectedTask.title} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea defaultValue={selectedTask.description} rows={3} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={confirmEditTask}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark Task as Complete Dialog */}
      <Dialog open={isMarkTaskCompleteOpen} onOpenChange={setMarkTaskCompleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Task as Complete</DialogTitle>
            <DialogDescription>
              Mark "{selectedTask?.title}" as completed
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Completion Notes (Optional)</Label>
              <Textarea placeholder="Add any completion notes..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={confirmMarkTaskComplete}>Mark as Completed</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Task Confirmation Dialog */}
      <Dialog open={isDeleteTaskOpen} onOpenChange={setDeleteTaskOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedTask?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" onClick={confirmDeleteTask}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Activity Dialogs */}
      {/* Log Activity Dialog */}
      <Dialog open={isLogActivityOpen} onOpenChange={setLogActivityOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Log Activity</DialogTitle>
            <DialogDescription>Record a past activity with a lead</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Activity Type</Label>
                <Select value={logFormData.type} onValueChange={(val) => setLogFormData({ ...logFormData, type: val })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Call">Call</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Follow-up">Follow-up</SelectItem>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={logFormData.activity_date} onChange={(e) => setLogFormData({ ...logFormData, activity_date: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Lead/Company Name</Label>
              <Input placeholder="ABC Corporation" value={logFormData.lead_name} onChange={(e) => setLogFormData({ ...logFormData, lead_name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Contact Name</Label>
              <Input placeholder="John Doe" value={logFormData.contact_name} onChange={(e) => setLogFormData({ ...logFormData, contact_name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea placeholder="Activity details..." rows={3} value={logFormData.notes} onChange={(e) => setLogFormData({ ...logFormData, notes: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleLogActivity}>Log Activity</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Reminder Dialog */}
      <Dialog open={isScheduleReminderOpen} onOpenChange={setScheduleReminderOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Reminder</DialogTitle>
            <DialogDescription>Schedule a future activity reminder</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Activity Type</Label>
                <Select value={scheduleFormData.type} onValueChange={(val) => setScheduleFormData({ ...scheduleFormData, type: val })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Call">Call</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Follow-up">Follow-up</SelectItem>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={scheduleFormData.activity_date} onChange={(e) => setScheduleFormData({ ...scheduleFormData, activity_date: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Time</Label>
                <Input type="time" value={scheduleFormData.due_time} onChange={(e) => setScheduleFormData({ ...scheduleFormData, due_time: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Assign To</Label>
                <Select value={scheduleFormData.assigned_to} onValueChange={(val) => setScheduleFormData({ ...scheduleFormData, assigned_to: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTeamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.fullName}>{member.fullName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Lead/Company Name</Label>
              <Input placeholder="ABC Corporation" value={scheduleFormData.lead_name} onChange={(e) => setScheduleFormData({ ...scheduleFormData, lead_name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Contact Name</Label>
              <Input placeholder="John Doe" value={scheduleFormData.contact_name} onChange={(e) => setScheduleFormData({ ...scheduleFormData, contact_name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea placeholder="Reminder details..." rows={3} value={scheduleFormData.notes} onChange={(e) => setScheduleFormData({ ...scheduleFormData, notes: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleScheduleReminder}>Schedule Reminder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Activity Details Dialog */}
      <Dialog open={isViewActivityDetailsOpen} onOpenChange={setViewActivityDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Activity Details</DialogTitle>
          </DialogHeader>
          {selectedActivity && (
            <div className="space-y-3 py-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Type</Label>
                  <p className="font-medium">{selectedActivity.type}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <Badge variant={getActivityStatusBadge(selectedActivity.status)} className="text-xs">{selectedActivity.status}</Badge>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Lead/Company</Label>
                <p className="font-medium">{selectedActivity.lead_name}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Contact</Label>
                <p className="font-medium">{selectedActivity.contact_name}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Date</Label>
                  <p className="font-medium">{selectedActivity.activity_date}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Time</Label>
                  <p className="font-medium">{selectedActivity.due_time}</p>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Assigned To</Label>
                <p className="font-medium">{selectedActivity.assigned_to}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Notes</Label>
                <p className="text-sm">{selectedActivity.notes}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Activity Dialog */}
      <Dialog open={isEditActivityOpen} onOpenChange={setEditActivityOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Activity</DialogTitle>
            <DialogDescription>Update activity details</DialogDescription>
          </DialogHeader>
          {selectedActivity && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea defaultValue={selectedActivity.notes} rows={4} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={confirmEditActivity}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark Activity as Done Dialog */}
      <Dialog open={isMarkActivityDoneOpen} onOpenChange={setMarkActivityDoneOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Done</DialogTitle>
            <DialogDescription>
              Mark "{selectedActivity?.lead_name}" activity as completed
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Completion Notes (Optional)</Label>
              <Textarea placeholder="Add any completion notes..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={confirmMarkActivityDone}>Mark as Completed</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Activity Confirmation Dialog */}
      <Dialog open={isDeleteActivityOpen} onOpenChange={setDeleteActivityOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Activity</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this activity for "{selectedActivity?.lead_name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" onClick={confirmDeleteActivity}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
