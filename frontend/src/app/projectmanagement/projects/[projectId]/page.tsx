
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import { User, Calendar, Flag, CheckSquare, BarChart2, Plus, Edit, Trash2, Eye, MoreVertical, GripVertical, Flame, CheckCircle2, Circle, Bug, AlertTriangle, BookOpen, ArrowLeft, UserPlus, Mic, Square, Paperclip, X, File, Folder, FileText, Image, Music, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FilterExportBar from '@/components/FilterExportBar';
import ColumnToggle, { ColumnConfig } from '@/components/ColumnToggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
// DashboardLayout is already applied in projectmanagement/layout.tsx

const projects = [
    {
      id: 'PROJ-001',
      name: 'Indus Nova - HRMS & CRM Platform',
      status: 'In Progress',
      lead: 'Alia Bhatt',
      startDate: '2023-01-15',
      endDate: '2023-09-30',
      progress: 75,
      description: 'A comprehensive platform for managing human resources and customer relationships. The project is currently in the development phase, with the backend API completed and frontend development in progress.',
      team: [
        { name: 'Ranbir Kapoor', role: 'Backend Lead', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
        { name: 'Deepika Padukone', role: 'Frontend Lead', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
        { name: 'Shah Rukh Khan', role: 'UI/UX Designer', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d' },
        { name: 'Priyanka Chopra', role: 'QA Engineer', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026707d' },
      ],
      sprints: [
        { name: 'Sprint 1 - Backend API', status: 'Completed' },
        { name: 'Sprint 2 - Frontend Boilerplate', status: 'Completed' },
        { name: 'Sprint 3 - HRMS Module', status: 'In Progress' },
        { name: 'Sprint 4 - CRM Module', status: 'Upcoming' },
      ]
    },
];

const statusVariant: { [key: string]: 'default' | 'secondary' | 'outline' } = {
    'Completed': 'default',
    'In Progress': 'secondary',
    'Upcoming': 'outline',
};

// Mock tasks data for Gantt chart (in real app, fetch by projectId)
const projectTasks = [
  {
    id: 'T1',
    name: 'Design Database',
    startDate: '2023-01-15',
    endDate: '2023-02-15',
    progress: 100,
  },
  {
    id: 'T2',
    name: 'Develop API',
    startDate: '2023-02-16',
    endDate: '2023-04-10',
    progress: 100,
  },
  {
    id: 'T3',
    name: 'Design UI',
    startDate: '2023-02-01',
    endDate: '2023-03-15',
    progress: 100,
  },
  {
    id: 'T4',
    name: 'Develop Frontend',
    startDate: '2023-03-16',
    endDate: '2023-06-30',
    progress: 85,
  },
  {
    id: 'T5',
    name: 'Integration Testing',
    startDate: '2023-07-01',
    endDate: '2023-09-30',
    progress: 60,
  },
];

const getDaysBetween = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) + 1;
};

const getOffsetDays = (projectStartDate: string, taskStartDate: string) => {
  const projStart = new Date(projectStartDate);
  const taskStart = new Date(taskStartDate);
  return (taskStart.getTime() - projStart.getTime()) / (1000 * 60 * 60 * 24);
};

// Mock data for Tasks tab
const mockTasks = [
  {
    id: 'TASK-8782',
    title: 'Fix button alignment on the login page',
    status: 'In Progress',
    priority: 'High',
    assignee: { name: 'Alia Bhatt', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    dueDate: '2024-12-15',
  },
  {
    id: 'TASK-5463',
    title: 'Implement new dashboard chart',
    status: 'To Do',
    priority: 'Medium',
    assignee: { name: 'Ranbir Kapoor', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
    dueDate: '2024-12-20',
  },
  {
    id: 'TASK-2344',
    title: 'Update API documentation',
    status: 'Done',
    priority: 'Low',
    assignee: { name: 'Deepika Padukone', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d' },
    dueDate: '2024-11-30',
  },
];

// Mock data for Teams tab
const teamMembers = [
  { id: 'U1', name: 'Alia Bhatt', role: 'Frontend Developer', currentTasks: 3, capacity: 5, avatar: '/avatars/01.png' },
  { id: 'U2', name: 'Ranbir Kapoor', role: 'Backend Developer', currentTasks: 6, capacity: 5, avatar: '/avatars/02.png' },
  { id: 'U3', name: 'Deepika Padukone', role: 'UI/UX Designer', currentTasks: 2, capacity: 4, avatar: '/avatars/03.png' },
  { id: 'U4', name: 'Shah Rukh Khan', role: 'QA Engineer', currentTasks: 4, capacity: 4, avatar: '/avatars/04.png' },
];

// Mock data for Backlogs tab
const backlogItems = [
  {
    id: 'BACK-001',
    module: 'Authentication',
    title: 'User Login & Registration',
    type: 'Epic',
    priority: 'High',
    description: 'Implement complete authentication system with email/password login and user registration',
    icon: Flame,
  },
  {
    id: 'BACK-002',
    module: 'Dashboard',
    title: 'Analytics Dashboard',
    type: 'Story',
    priority: 'Medium',
    description: 'Create analytics dashboard with charts and KPI metrics',
    icon: CheckCircle2,
  },
  {
    id: 'BACK-003',
    module: 'Settings',
    title: 'Password Reset Bug',
    type: 'Bug',
    priority: 'Critical',
    description: 'Password reset email link is not working properly',
    icon: Bug,
  },
  {
    id: 'BACK-004',
    module: 'API',
    title: 'REST API Integration',
    type: 'Task',
    priority: 'High',
    description: 'Integrate third-party REST API for data sync',
    icon: Circle,
  },
];

// Mock data for Roadmap tab
const roadmapQuarters = [
  {
    id: 'Q1-2024',
    quarter: 'Q1 2024',
    projects: [
      { id: 'P1', name: 'Phase 1 - Backend API', status: 'Completed', startDate: '2024-01-01', endDate: '2024-03-31', color: 'bg-primary' },
      { id: 'P2', name: 'Phase 2 - Frontend Development', status: 'In Progress', startDate: '2024-02-01', endDate: '2024-04-30', color: 'bg-secondary' },
    ],
  },
  {
    id: 'Q2-2024',
    quarter: 'Q2 2024',
    projects: [
      { id: 'P3', name: 'Phase 3 - Integration & Testing', status: 'Upcoming', startDate: '2024-04-01', endDate: '2024-06-30', color: 'bg-accent' },
    ],
  },
];

type Status = 'In Progress' | 'To Do' | 'Done' | 'Backlog';
type Priority = 'High' | 'Medium' | 'Low' | 'Critical';
type IssueType = 'Epic' | 'Story' | 'Task' | 'Bug';

const statusVariants: Record<Status, 'default' | 'secondary' | 'outline'> = {
  'In Progress': 'default',
  'To Do': 'secondary',
  'Done': 'outline',
  'Backlog': 'secondary',
};

const priorityVariants: Record<Priority, 'destructive' | 'secondary' | 'outline'> = {
  'Critical': 'destructive',
  'High': 'destructive',
  'Medium': 'secondary',
  'Low': 'outline',
};

const typeVariant: { [key in IssueType]: 'default' | 'secondary' | 'destructive' | 'outline'} = {
  Epic: 'default',
  Story: 'secondary',
  Task: 'outline',
  Bug: 'destructive',
};

const roadmapStatusVariant: { [key: string]: 'secondary' | 'outline' | 'default' } = {
  'In Progress': 'secondary',
  'Planning': 'outline',
  'Upcoming': 'default',
  'Completed': 'outline',
};

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { projectId } = params;

  // State for view modes
  const [tasksViewMode, setTasksViewMode] = useState<'table' | 'card'>('table');
  const [teamsViewMode, setTeamsViewMode] = useState<'table' | 'card'>('table');
  const [backlogsViewMode, setBacklogsViewMode] = useState<'table' | 'card'>('table');
  const [roadmapViewMode, setRoadmapViewMode] = useState<'table' | 'card'>('table');

  // State for search
  const [tasksSearchTerm, setTasksSearchTerm] = useState('');
  const [teamsSearchTerm, setTeamsSearchTerm] = useState('');
  const [backlogsSearchTerm, setBacklogsSearchTerm] = useState('');
  const [roadmapSearchTerm, setRoadmapSearchTerm] = useState('');

  // Column visibility for tables
  const [tasksColumns, setTasksColumns] = useState<ColumnConfig[]>([
    { key: 'checkbox', label: 'Select', visible: true },
    { key: 'id', label: 'Task ID', visible: true },
    { key: 'title', label: 'Title', visible: true },
    { key: 'status', label: 'Status', visible: true },
    { key: 'priority', label: 'Priority', visible: true },
    { key: 'assignee', label: 'Assignee', visible: true },
    { key: 'dueDate', label: 'Due Date', visible: true },
    { key: 'actions', label: 'Actions', visible: true },
  ]);

  // State for active tab
  const [activeTab, setActiveTab] = useState('overview');

  // State for modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // State for selected tasks (for assign)
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [selectedBacklogs, setSelectedBacklogs] = useState<string[]>([]);

  // State for audio recording and file attachments
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Audio recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const deleteAudio = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachedFiles([...attachedFiles, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };

  // State for filters
  const [taskStatusFilter, setTaskStatusFilter] = useState('all');
  const [taskPriorityFilter, setTaskPriorityFilter] = useState('all');

  const project = projects.find(p => p.id === projectId as string);

  // Filter configurations
  const taskFilters = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'all', label: 'All Statuses' },
        { value: 'To Do', label: 'To Do' },
        { value: 'In Progress', label: 'In Progress' },
        { value: 'Done', label: 'Done' },
      ],
      value: taskStatusFilter,
      onChange: setTaskStatusFilter,
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
      value: taskPriorityFilter,
      onChange: setTaskPriorityFilter,
    },
  ];

  if (!project) {
    return (
        
            <div className="py-3 lg:py-4 space-y-3 lg:space-y-4 flex items-center justify-center">
                <p>Project not found.</p>
            </div>
        
    );
  }

  return (
      <div className="py-3 lg:py-4 space-y-2 lg:space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-foreground truncate">{project.name}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">ID: {project.id}</p>
            </div>
          </div>
          {activeTab !== 'overview' && (
            <Button
              onClick={() => {
                if (activeTab === 'teams') {
                  router.push('/projectmanagement/projects/create?tab=team');
                } else if (activeTab === 'roadmap') {
                  router.push('/projectmanagement/projects/create?tab=phases');
                } else {
                  setShowAddModal(true);
                }
              }}
              className="flex items-center justify-center sm:space-x-2 sm:px-4 sm:py-2 bg-primary text-primary-foreground rounded-full sm:rounded-lg hover:bg-primary/90 transition-colors font-medium w-9 h-9 sm:w-auto sm:h-auto flex-shrink-0"
            >
              <Plus className="w-5 h-5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline text-sm">Add</span>
            </Button>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-2 lg:space-y-3">
            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                <TabsList className="inline-flex min-w-max gap-1 p-1">
                    <TabsTrigger value="overview" className="whitespace-nowrap text-xs sm:text-sm">Overview</TabsTrigger>
                    <TabsTrigger value="tasks" className="whitespace-nowrap text-xs sm:text-sm">Tasks</TabsTrigger>
                    <TabsTrigger value="teams" className="whitespace-nowrap text-xs sm:text-sm">Teams</TabsTrigger>
                    <TabsTrigger value="backlogs" className="whitespace-nowrap text-xs sm:text-sm">Backlogs</TabsTrigger>
                    <TabsTrigger value="roadmap" className="whitespace-nowrap text-xs sm:text-sm">Roadmap</TabsTrigger>
                    <TabsTrigger value="wiki" className="whitespace-nowrap text-xs sm:text-sm">Wiki</TabsTrigger>
                </TabsList>
            </div>
            
            <TabsContent value="overview" className="space-y-2 lg:space-y-3">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Gantt Chart */}
                        <Card>
                            <CardHeader><CardTitle>Project Timeline</CardTitle></CardHeader>
                            <CardContent className="p-4 overflow-x-auto">
                                <div className="min-w-[800px]">
                                    {(() => {
                                        const totalProjectDays = getDaysBetween(project.startDate, project.endDate);
                                        return (
                                            <>
                                                {/* Header for Dates */}
                                                <div className="grid grid-cols-[200px_1fr] gap-x-2 pb-2 border-b">
                                                    <div className="font-semibold text-sm text-muted-foreground">Task Name</div>
                                                    <div className="grid" style={{ gridTemplateColumns: `repeat(${Math.min(totalProjectDays, 60)}, minmax(0, 1fr))` }}>
                                                        {Array.from({ length: Math.min(totalProjectDays, 60) }).map((_, i) => {
                                                            const date = new Date(project.startDate);
                                                            date.setDate(date.getDate() + (i * Math.ceil(totalProjectDays / 60)));
                                                            return (
                                                                <div key={i} className="text-center text-xs text-muted-foreground border-l first:border-l-0">
                                                                    <span className={date.getDate() === 1 ? 'font-bold' : ''}>{date.getDate()}</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Task Rows */}
                                                <div className="grid grid-cols-[200px_1fr] gap-x-2 gap-y-3 pt-3">
                                                    {projectTasks.map(task => {
                                                        const taskDays = getDaysBetween(task.startDate, task.endDate);
                                                        const offsetDays = getOffsetDays(project.startDate, task.startDate);

                                                        return (
                                                            <div key={task.id} className="contents">
                                                                <div className="font-medium text-sm truncate pr-2">{task.name}</div>
                                                                <div className="relative h-8 flex items-center">
                                                                    <div
                                                                        className="absolute h-full"
                                                                        style={{
                                                                            left: `${(offsetDays / totalProjectDays) * 100}%`,
                                                                            width: `${(taskDays / totalProjectDays) * 100}%`
                                                                        }}
                                                                    >
                                                                        <div className="relative w-full h-full bg-primary/20 rounded-md border border-primary/50 flex items-center overflow-hidden">
                                                                            <div
                                                                                className="absolute left-0 top-0 h-full bg-primary/60 rounded-md transition-all"
                                                                                style={{ width: `${task.progress}%` }}
                                                                            />
                                                                            <span className="absolute w-full text-center text-xs font-semibold text-foreground px-2 truncate z-10">
                                                                                {task.progress}%
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Description */}
                        <Card>
                            <CardHeader><CardTitle>Description</CardTitle></CardHeader>
                            <CardContent><p className="text-muted-foreground">{project.description}</p></CardContent>
                        </Card>
                    </div>
                    <div className="space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Details</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start"><User className="w-5 h-5 text-muted-foreground mr-3 mt-1" /><div className="flex-1"><p className="text-sm text-muted-foreground">Project Lead</p><p className="font-semibold">{project.lead}</p></div></div>
                                <div className="flex items-start"><Flag className="w-5 h-5 text-muted-foreground mr-3 mt-1" /><div className="flex-1"><p className="text-sm text-muted-foreground">Status</p><p className="font-semibold">{project.status}</p></div></div>
                                <div className="flex items-start"><Calendar className="w-5 h-5 text-muted-foreground mr-3 mt-1" /><div className="flex-1"><p className="text-sm text-muted-foreground">Start Date</p><p className="font-semibold">{project.startDate}</p></div></div>
                                <div className="flex items-start"><CheckSquare className="w-5 h-5 text-muted-foreground mr-3 mt-1" /><div className="flex-1"><p className="text-sm text-muted-foreground">End Date</p><p className="font-semibold">{project.endDate}</p></div></div>
                                <div className="flex items-start"><BarChart2 className="w-5 h-5 text-muted-foreground mr-3 mt-1" /><div className="flex-1"><p className="text-sm text-muted-foreground">Progress</p><Progress value={project.progress} className="mt-2" /></div></div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </TabsContent>

            {/* Tasks Tab */}
            <TabsContent value="tasks" className="space-y-2 lg:space-y-3">
                <div className="flex items-center gap-2">
                    <div className="flex-1">
                        <FilterExportBar
                            filters={taskFilters}
                            showViewToggle={true}
                            viewToggleProps={{
                                currentView: tasksViewMode,
                                onViewChange: setTasksViewMode
                            }}
                            showSearch={true}
                            searchProps={{
                                placeholder: "Search tasks...",
                                value: tasksSearchTerm,
                                onChange: setTasksSearchTerm
                            }}
                        />
                    </div>
                    {tasksViewMode === 'table' && (
                        <ColumnToggle
                            columns={tasksColumns}
                            onColumnChange={setTasksColumns}
                        />
                    )}
                </div>

                {tasksViewMode === 'table' ? (
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-10">
                                                <Checkbox
                                                    checked={selectedTasks.length === mockTasks.length && mockTasks.length > 0}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setSelectedTasks(mockTasks.map(t => t.id));
                                                        } else {
                                                            setSelectedTasks([]);
                                                        }
                                                    }}
                                                />
                                            </TableHead>
                                            <TableHead className="w-28">Task ID</TableHead>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Priority</TableHead>
                                            <TableHead className="hidden md:table-cell">Assignee</TableHead>
                                            <TableHead className="hidden lg:table-cell">Due Date</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {mockTasks.map((task) => (
                                            <TableRow key={task.id}>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedTasks.includes(task.id)}
                                                        onCheckedChange={(checked) => {
                                                            if (checked) {
                                                                setSelectedTasks([...selectedTasks, task.id]);
                                                            } else {
                                                                setSelectedTasks(selectedTasks.filter(id => id !== task.id));
                                                            }
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium text-foreground">{task.id}</TableCell>
                                                <TableCell className="font-medium text-foreground">{task.title}</TableCell>
                                                <TableCell>
                                                    <Badge variant={statusVariants[task.status as Status]}>{task.status}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={priorityVariants[task.priority as Priority]}>{task.priority}</Badge>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                                                            <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <span className="font-medium text-foreground">{task.assignee.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{task.dueDate}</TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem>
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                Edit Task
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                                <Trash2 className="h-4 w-4 mr-2" />
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
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {mockTasks.map((task) => (
                            <Card key={task.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <span className="text-xs text-muted-foreground font-mono">{task.id}</span>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem><Eye className="h-4 w-4 mr-2" />View</DropdownMenuItem>
                                                <DropdownMenuItem><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <h3 className="font-semibold text-foreground mb-2">{task.title}</h3>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <Badge variant={statusVariants[task.status as Status]}>{task.status}</Badge>
                                        <Badge variant={priorityVariants[task.priority as Priority]}>{task.priority}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                                                <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="text-muted-foreground">{task.assignee.name}</span>
                                        </div>
                                        <span className="text-muted-foreground">{task.dueDate}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </TabsContent>

            {/* Teams Tab */}
            <TabsContent value="teams" className="space-y-2 lg:space-y-3">
                <FilterExportBar
                    filters={[]}
                    showViewToggle={true}
                    viewToggleProps={{
                        currentView: teamsViewMode,
                        onViewChange: setTeamsViewMode
                    }}
                    showSearch={true}
                    searchProps={{
                        placeholder: "Search team members...",
                        value: teamsSearchTerm,
                        onChange: setTeamsSearchTerm
                    }}
                />

                {teamsViewMode === 'table' ? (
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Member</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Current Tasks</TableHead>
                                            <TableHead>Workload</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {teamMembers.map(member => {
                                            const workloadPercentage = (member.currentTasks / member.capacity) * 100;
                                            const isOverloaded = member.currentTasks > member.capacity;
                                            return (
                                                <TableRow key={member.id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarImage src={member.avatar} alt={member.name} />
                                                                <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                            </Avatar>
                                                            <span className="font-medium">{member.name}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{member.role}</TableCell>
                                                    <TableCell className={isOverloaded ? 'text-destructive' : ''}>
                                                        {member.currentTasks} / {member.capacity}
                                                    </TableCell>
                                                    <TableCell className="w-40">
                                                        <Progress value={Math.min(workloadPercentage, 100)} className="h-2" />
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="icon"><BarChart2 className="h-4 w-4" /></Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {teamMembers.map(member => {
                            const workloadPercentage = (member.currentTasks / member.capacity) * 100;
                            const isOverloaded = member.currentTasks > member.capacity;
                            return (
                                <Card key={member.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage src={member.avatar} alt={member.name} />
                                                <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold text-foreground">{member.name}</p>
                                                <p className="text-sm text-muted-foreground">{member.role}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Tasks</span>
                                                <span className={isOverloaded ? 'text-destructive font-semibold' : 'font-semibold'}>
                                                    {member.currentTasks} / {member.capacity}
                                                </span>
                                            </div>
                                            <Progress value={Math.min(workloadPercentage, 100)} className="h-2" />
                                            {isOverloaded && (
                                                <p className="text-xs text-destructive flex items-center">
                                                    <AlertTriangle className="w-3 h-3 mr-1" /> Overloaded
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </TabsContent>

            {/* Backlogs Tab */}
            <TabsContent value="backlogs" className="space-y-2 lg:space-y-3">
                <FilterExportBar
                    filters={[]}
                    showViewToggle={true}
                    viewToggleProps={{
                        currentView: backlogsViewMode,
                        onViewChange: setBacklogsViewMode
                    }}
                    showSearch={true}
                    searchProps={{
                        placeholder: "Search backlogs...",
                        value: backlogsSearchTerm,
                        onChange: setBacklogsSearchTerm
                    }}
                />

                {backlogsViewMode === 'table' ? (
                    <Card>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">
                                            <Checkbox
                                                checked={selectedBacklogs.length === backlogItems.length}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setSelectedBacklogs(backlogItems.map(item => item.id));
                                                    } else {
                                                        setSelectedBacklogs([]);
                                                    }
                                                }}
                                            />
                                        </TableHead>
                                        <TableHead>Module</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Priority</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {backlogItems.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedBacklogs.includes(item.id)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setSelectedBacklogs([...selectedBacklogs, item.id]);
                                                        } else {
                                                            setSelectedBacklogs(selectedBacklogs.filter(id => id !== item.id));
                                                        }
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{item.module || 'General'}</TableCell>
                                            <TableCell>{item.title}</TableCell>
                                            <TableCell>
                                                <Badge variant={typeVariant[item.type as IssueType]} className="text-xs">
                                                    {item.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={priorityVariants[item.priority as Priority]} className="text-xs">
                                                    {item.priority}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="max-w-xs truncate">{item.description || '-'}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => { setShowEditModal(true); }}>
                                                            <Eye className="h-4 w-4 mr-2" />View
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => { setShowEditModal(true); }}>
                                                            <Edit className="h-4 w-4 mr-2" />Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => { setShowDeleteModal(true); }} className="text-destructive">
                                                            <Trash2 className="h-4 w-4 mr-2" />Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {backlogItems.map((item) => {
                            const TypedIcon = item.icon;
                            return (
                                <Card key={item.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-3">
                                        <div className="flex items-start justify-between gap-2 mb-3">
                                            <div className="flex items-start gap-2 flex-1 min-w-0">
                                                <Checkbox
                                                    checked={selectedBacklogs.includes(item.id)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setSelectedBacklogs([...selectedBacklogs, item.id]);
                                                        } else {
                                                            setSelectedBacklogs(selectedBacklogs.filter(id => id !== item.id));
                                                        }
                                                    }}
                                                    className="mt-0.5"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <TypedIcon className="w-4 h-4 text-primary flex-shrink-0" />
                                                        <h3 className="text-sm font-semibold text-foreground line-clamp-1">{item.title}</h3>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">{item.module || 'General'}</p>
                                                </div>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => { setShowEditModal(true); }}>
                                                        <Eye className="h-4 w-4 mr-2" />View
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => { setShowEditModal(true); }}>
                                                        <Edit className="h-4 w-4 mr-2" />Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => { setShowDeleteModal(true); }} className="text-destructive">
                                                        <Trash2 className="h-4 w-4 mr-2" />Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Badge variant={typeVariant[item.type as IssueType]} className="text-xs">
                                                    {item.type}
                                                </Badge>
                                                <Badge variant={priorityVariants[item.priority as Priority]} className="text-xs">
                                                    {item.priority}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground line-clamp-2">{item.description || 'No description'}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </TabsContent>

            {/* Roadmap Tab */}
            <TabsContent value="roadmap" className="space-y-2 lg:space-y-3">
                <FilterExportBar
                    filters={[]}
                    showViewToggle={true}
                    viewToggleProps={{
                        currentView: roadmapViewMode,
                        onViewChange: setRoadmapViewMode
                    }}
                    showSearch={true}
                    searchProps={{
                        placeholder: "Search roadmap items...",
                        value: roadmapSearchTerm,
                        onChange: setRoadmapSearchTerm
                    }}
                />

                <Card>
                    <CardHeader><CardTitle>Project Roadmap</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        {roadmapQuarters.map(quarter => (
                            <div key={quarter.id}>
                                <h3 className="text-lg font-semibold text-foreground mb-4">{quarter.quarter}</h3>
                                <div className="space-y-3">
                                    {quarter.projects.map(roadmapProject => (
                                        <div key={roadmapProject.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                                            <div className="flex items-center flex-1">
                                                <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-3 sm:mr-4 ${roadmapProject.color} shrink-0`}></div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-foreground truncate">{roadmapProject.name}</p>
                                                    <p className="text-xs sm:text-sm text-muted-foreground">{roadmapProject.startDate} - {roadmapProject.endDate}</p>
                                                </div>
                                            </div>
                                            <Badge variant={roadmapStatusVariant[roadmapProject.status]} className="w-fit sm:ml-4">
                                                {roadmapProject.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Wiki Tab */}
            <TabsContent value="wiki" className="space-y-2 lg:space-y-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Project Knowledge Base</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            {/* Documents Folder */}
                            <div className="flex flex-col items-center p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors">
                                <Folder className="w-12 h-12 text-blue-500 mb-2" />
                                <span className="text-sm font-medium text-foreground">Documents</span>
                                <span className="text-xs text-muted-foreground">0 files</span>
                            </div>

                            {/* Images Folder */}
                            <div className="flex flex-col items-center p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors">
                                <Folder className="w-12 h-12 text-green-500 mb-2" />
                                <span className="text-sm font-medium text-foreground">Images</span>
                                <span className="text-xs text-muted-foreground">0 files</span>
                            </div>

                            {/* Videos Folder */}
                            <div className="flex flex-col items-center p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors">
                                <Folder className="w-12 h-12 text-purple-500 mb-2" />
                                <span className="text-sm font-medium text-foreground">Videos</span>
                                <span className="text-xs text-muted-foreground">0 files</span>
                            </div>

                            {/* Audios Folder */}
                            <div className="flex flex-col items-center p-4 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors">
                                <Folder className="w-12 h-12 text-orange-500 mb-2" />
                                <span className="text-sm font-medium text-foreground">Audios</span>
                                <span className="text-xs text-muted-foreground">0 files</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>

        {/* Add Modal - Dynamic based on active tab */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="sm:max-w-[750px] max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>
                {activeTab === 'tasks' && 'Add New Task'}
                {activeTab === 'teams' && 'Add Team Member'}
                {activeTab === 'backlogs' && 'Add Backlog Item'}
                {activeTab === 'roadmap' && 'Add Roadmap Item'}
                {activeTab === 'wiki' && 'Add Wiki Document'}
                {activeTab === 'overview' && 'Add Item'}
              </DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new item.
              </DialogDescription>
            </DialogHeader>

            {/* Task Form */}
            {activeTab === 'tasks' && (
              <div className="grid gap-3 py-2 max-h-[65vh] overflow-y-auto pr-1 scrollbar-thin">
                <div className="grid gap-2">
                  <Label htmlFor="taskTitle">Task Title</Label>
                  <Input id="taskTitle" placeholder="Enter task title" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="taskDescription">Description</Label>
                  <Textarea id="taskDescription" placeholder="Enter task description..." rows={2} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="taskModule">Module</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select module" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hrms">HRMS</SelectItem>
                        <SelectItem value="crm">CRM</SelectItem>
                        <SelectItem value="project">Project Management</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="taskReportedBy">Reported By</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select reporter" /></SelectTrigger>
                      <SelectContent>
                        {teamMembers.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="taskCustomer">Customer</Label>
                    <Input id="taskCustomer" placeholder="Customer name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="taskProduct">Product</Label>
                    <Input id="taskProduct" placeholder="Product name" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="taskStatus">Status</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="inprogress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="taskPriority">Priority</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="taskDueDate">Due Date</Label>
                  <Input id="taskDueDate" type="date" />
                </div>

                {/* Audio Recording & File Attachments - Side by Side */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Audio Recording */}
                  <div className="grid gap-2">
                    <Label>Audio Recording</Label>
                    <div className="flex flex-col gap-2">
                      {!isRecording && !audioUrl && (
                        <Button type="button" variant="outline" size="sm" onClick={startRecording}>
                          <Mic className="w-4 h-4 mr-2" />
                          Record
                        </Button>
                      )}
                      {isRecording && (
                        <Button type="button" variant="destructive" size="sm" onClick={stopRecording}>
                          <Square className="w-4 h-4 mr-2" />
                          Stop
                        </Button>
                      )}
                      {audioUrl && (
                        <div className="flex flex-col gap-2">
                          <audio src={audioUrl} controls className="w-full h-8" />
                          <Button type="button" variant="ghost" size="sm" onClick={deleteAudio}>
                            <X className="w-4 h-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* File Attachments */}
                  <div className="grid gap-2">
                    <Label>File Attachments</Label>
                    <div className="space-y-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        multiple
                        onChange={handleFileAttach}
                        className="hidden"
                      />
                      <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                        <Paperclip className="w-4 h-4 mr-2" />
                        Attach
                      </Button>
                      {attachedFiles.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          {attachedFiles.length} file(s) attached
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Attached Files List */}
                {attachedFiles.length > 0 && (
                  <div className="space-y-1">
                    {attachedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md text-xs">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <File className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          <span className="truncate">{file.name}</span>
                          <span className="text-muted-foreground flex-shrink-0">({(file.size / 1024).toFixed(1)} KB)</span>
                        </div>
                        <Button type="button" variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={() => removeFile(index)}>
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Team Member Form */}
            {activeTab === 'teams' && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="memberName">Name</Label>
                  <Input id="memberName" placeholder="Enter member name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="memberRole">Role</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="designer">Designer</SelectItem>
                      <SelectItem value="manager">Project Manager</SelectItem>
                      <SelectItem value="qa">QA Engineer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="memberCapacity">Capacity</Label>
                    <Input id="memberCapacity" type="number" placeholder="e.g. 5" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="memberEmail">Email</Label>
                    <Input id="memberEmail" type="email" placeholder="email@example.com" />
                  </div>
                </div>
              </div>
            )}

            {/* Backlog Form */}
            {activeTab === 'backlogs' && (
              <div className="grid gap-3 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="backlogModule">Module</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select module" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hrms">HRMS</SelectItem>
                      <SelectItem value="crm">CRM</SelectItem>
                      <SelectItem value="project">Project Management</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="backlogTitle">Title</Label>
                  <Input id="backlogTitle" placeholder="Enter backlog item title" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="backlogType">Type</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="epic">Epic</SelectItem>
                        <SelectItem value="story">Story</SelectItem>
                        <SelectItem value="task">Task</SelectItem>
                        <SelectItem value="bug">Bug</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="backlogPriority">Priority</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="backlogDescription">Description</Label>
                  <Textarea id="backlogDescription" placeholder="Enter description..." rows={3} />
                </div>
              </div>
            )}

            {/* Roadmap Form */}
            {activeTab === 'roadmap' && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="roadmapName">Item Name</Label>
                  <Input id="roadmapName" placeholder="Enter roadmap item name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="roadmapStart">Start Date</Label>
                    <Input id="roadmapStart" type="date" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="roadmapEnd">End Date</Label>
                    <Input id="roadmapEnd" type="date" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="roadmapStatus">Status</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="inprogress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Wiki Form */}
            {activeTab === 'wiki' && (
              <div className="grid gap-3 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="wikiTitle">Title</Label>
                  <Input id="wikiTitle" placeholder="Enter title" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="wikiCategory">Folder</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select folder" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="documents">Documents</SelectItem>
                      <SelectItem value="images">Images</SelectItem>
                      <SelectItem value="videos">Videos</SelectItem>
                      <SelectItem value="audios">Audios</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="wikiDescription">Description</Label>
                  <Textarea id="wikiDescription" placeholder="Enter description..." rows={2} />
                </div>
                <div className="grid gap-2">
                  <Label>Upload Files</Label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      multiple
                      onChange={handleFileAttach}
                      className="hidden"
                    />
                    <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="w-full">
                      <Paperclip className="w-4 h-4 mr-2" />
                      Choose Files
                    </Button>
                    {attachedFiles.length > 0 && (
                      <div className="space-y-1">
                        {attachedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md text-xs">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <File className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                              <span className="truncate">{file.name}</span>
                            </div>
                            <Button type="button" variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={() => removeFile(index)}>
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Overview - General Add */}
            {activeTab === 'overview' && (
              <div className="py-4 text-center text-muted-foreground">
                Please select a specific tab (Tasks, Teams, Backlogs, Roadmap, or Wiki) to add items.
              </div>
            )}

            {/* Action Button */}
            {activeTab !== 'overview' && (
              <div className="flex justify-end pt-4 border-t">
                <Button onClick={() => setShowAddModal(false)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add {activeTab === 'tasks' ? 'Task' : activeTab === 'teams' ? 'Member' : activeTab === 'backlogs' ? 'Backlog' : activeTab === 'roadmap' ? 'Roadmap Item' : 'Document'}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Modal - Dynamic based on active tab */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {activeTab === 'tasks' && 'Edit Task'}
                {activeTab === 'teams' && 'Edit Team Member'}
                {activeTab === 'backlogs' && 'Edit Backlog Item'}
                {activeTab === 'roadmap' && 'Edit Roadmap Item'}
                {activeTab === 'wiki' && 'Edit Wiki Document'}
                {activeTab === 'overview' && 'Edit Project'}
              </DialogTitle>
              <DialogDescription>
                Update the details below.
              </DialogDescription>
            </DialogHeader>

            {/* Task Edit Form */}
            {activeTab === 'tasks' && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="editTaskTitle">Task Title</Label>
                  <Input id="editTaskTitle" defaultValue="Fix button alignment on the login page" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="editTaskStatus">Status</Label>
                    <Select defaultValue="inprogress">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="inprogress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="editTaskPriority">Priority</Label>
                    <Select defaultValue="high">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editTaskDueDate">Due Date</Label>
                  <Input id="editTaskDueDate" type="date" defaultValue="2024-01-15" />
                </div>
              </div>
            )}

            {/* Team Edit Form */}
            {activeTab === 'teams' && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="editMemberName">Name</Label>
                  <Input id="editMemberName" defaultValue="Ranbir Kapoor" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editMemberRole">Role</Label>
                  <Select defaultValue="developer">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="designer">Designer</SelectItem>
                      <SelectItem value="manager">Project Manager</SelectItem>
                      <SelectItem value="qa">QA Engineer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editMemberCapacity">Capacity</Label>
                  <Input id="editMemberCapacity" type="number" defaultValue="5" />
                </div>
              </div>
            )}

            {/* Backlog Edit Form */}
            {activeTab === 'backlogs' && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="editBacklogTitle">Title</Label>
                  <Input id="editBacklogTitle" defaultValue="User Authentication Module" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="editBacklogType">Type</Label>
                    <Select defaultValue="epic">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="epic">Epic</SelectItem>
                        <SelectItem value="story">Story</SelectItem>
                        <SelectItem value="task">Task</SelectItem>
                        <SelectItem value="bug">Bug</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="editBacklogPriority">Priority</Label>
                    <Select defaultValue="high">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Roadmap Edit Form */}
            {activeTab === 'roadmap' && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="editRoadmapName">Item Name</Label>
                  <Input id="editRoadmapName" defaultValue="HRMS Module Development" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="editRoadmapStart">Start Date</Label>
                    <Input id="editRoadmapStart" type="date" defaultValue="2024-01-01" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="editRoadmapEnd">End Date</Label>
                    <Input id="editRoadmapEnd" type="date" defaultValue="2024-03-31" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editRoadmapStatus">Status</Label>
                  <Select defaultValue="inprogress">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="inprogress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Wiki Edit Form */}
            {activeTab === 'wiki' && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="editWikiTitle">Document Title</Label>
                  <Input id="editWikiTitle" defaultValue="Getting Started Guide" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editWikiContent">Content</Label>
                  <Textarea id="editWikiContent" defaultValue="This is the getting started guide..." rows={5} />
                </div>
              </div>
            )}

            {/* Overview - Edit Project */}
            {activeTab === 'overview' && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="editProjectName">Project Name</Label>
                  <Input id="editProjectName" defaultValue={project.name} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editProjectDesc">Description</Label>
                  <Textarea id="editProjectDesc" defaultValue={project.description} rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="editProjectStart">Start Date</Label>
                    <Input id="editProjectStart" type="date" defaultValue={project.startDate} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="editProjectEnd">End Date</Label>
                    <Input id="editProjectEnd" type="date" defaultValue={project.endDate} />
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="flex justify-end pt-4 border-t">
              <Button onClick={() => setShowEditModal(false)}>
                <Edit className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="text-destructive">Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this {activeTab === 'tasks' ? 'task' : activeTab === 'teams' ? 'team member' : activeTab === 'backlogs' ? 'backlog item' : activeTab === 'roadmap' ? 'roadmap item' : activeTab === 'wiki' ? 'document' : 'item'}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
              <Button variant="destructive" onClick={() => { setShowDeleteModal(false); }}>Delete</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Assign Task Modal */}
        <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Assign Tasks</DialogTitle>
              <DialogDescription>
                Assign {selectedTasks.length} selected task(s) to a team member.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="assignTo">Assigned To</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select team member" /></SelectTrigger>
                  <SelectContent>
                    {teamMembers.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="assignDepartment">Department</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="qa">Quality Assurance</SelectItem>
                    <SelectItem value="hr">Human Resources</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="assignManager">Reporting Manager</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select reporting manager" /></SelectTrigger>
                  <SelectContent>
                    {teamMembers.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="expectedDate">Expected Date</Label>
                <Input id="expectedDate" type="date" />
              </div>

              <div className="grid gap-2">
                <Label>Expected Time</Label>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <Input id="expectedMonths" type="number" min="0" placeholder="0" />
                    <span className="text-xs text-muted-foreground">Months</span>
                  </div>
                  <div>
                    <Input id="expectedDays" type="number" min="0" max="30" placeholder="0" />
                    <span className="text-xs text-muted-foreground">Days</span>
                  </div>
                  <div>
                    <Input id="expectedHours" type="number" min="0" max="23" placeholder="0" />
                    <span className="text-xs text-muted-foreground">Hours</span>
                  </div>
                  <div>
                    <Input id="expectedMinutes" type="number" min="0" max="59" placeholder="0" />
                    <span className="text-xs text-muted-foreground">Minutes</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={() => { setShowAssignModal(false); setSelectedTasks([]); }}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Assign Tasks
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

  );
}
