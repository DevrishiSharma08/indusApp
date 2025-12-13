
'use client';

import { useState } from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import SearchBar from '@/components/SearchBar';
import FilterExportBar from '@/components/FilterExportBar';
import DataTable from '@/components/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const tasks = [
  {
    id: 'TASK-8782',
    title: 'Fix button alignment on the login page',
    status: 'In Progress',
    priority: 'High',
    assignee: {
      name: 'Jane Doe',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    },
  },
  {
    id: 'TASK-5463',
    title: 'Implement new dashboard chart',
    status: 'To Do',
    priority: 'Medium',
    assignee: {
      name: 'John Smith',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d',
    },
  },
  {
    id: 'TASK-2344',
    title: 'Update API documentation for the /users endpoint',
    status: 'Done',
    priority: 'Low',
    assignee: {
      name: 'Peter Jones',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d',
    },
  },
    {
    id: 'TASK-9876',
    title: 'Refactor authentication service to use JWT',
    status: 'In Progress',
    priority: 'High',
    assignee: {
      name: 'Jane Doe',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    },
  },
  {
    id: 'TASK-1234',
    title: 'Design new icons for the settings page',
    status: 'Backlog',
    priority: 'Medium',
    assignee: {
      name: 'Emily White',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026707d',
    },
  },
];

type Status = 'In Progress' | 'To Do' | 'Done' | 'Backlog';
type Priority = 'High' | 'Medium' | 'Low';

const statusVariant: { [key in Status]: 'secondary' | 'outline' | 'default' } = {
  'In Progress': 'secondary',
  'To Do': 'outline',
  'Done': 'default',
  'Backlog': 'outline',
};

const priorityVariant: { [key in Priority]: 'destructive' | 'secondary' | 'outline' } = {
  'High': 'destructive',
  'Medium': 'secondary',
  'Low': 'outline',
};

export default function TasksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<{ [key: string]: string }>({ 
    status: 'all', 
    priority: 'all', 
    assignee: 'all' 
  });

  const handleFilterChange = (key: string) => (value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filterDefinitions = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'all', label: 'All' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'todo', label: 'To Do' },
        { value: 'done', label: 'Done' },
        { value: 'backlog', label: 'Backlog' },
      ],
    },
    {
      key: 'priority',
      label: 'Priority',
      options: [
        { value: 'all', label: 'All' },
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' },
      ],
    },
    {
      key: 'assignee',
      label: 'Assignee',
      options: [
        { value: 'all', label: 'All' },
        { value: 'jane-doe', label: 'Jane Doe' },
        { value: 'john-smith', label: 'John Smith' },
        { value: 'peter-jones', label: 'Peter Jones' },
        { value: 'emily-white', label: 'Emily White' },
      ],
    },
  ];

  const transformedFilters = filterDefinitions.map(def => ({
    ...def,
    value: filters[def.key],
    onChange: handleFilterChange(def.key),
  }));

  const columns = [
    { key: 'id', label: 'Task ID', className: 'w-24' },
    { key: 'title', label: 'Title', className: 'min-w-[300px]' },
    {
      key: 'status',
      label: 'Status',
      render: (status: Status) => (
        <Badge variant={statusVariant[status]} className="w-28 justify-center">{status}</Badge>
      ),
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (priority: Priority) => (
        <Badge variant={priorityVariant[priority]} className="w-20 justify-center">{priority}</Badge>
      ),
    },
    {
      key: 'assignee',
      label: 'Assignee',
      render: (assignee: { name: string; avatar: string }) => (
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={assignee.avatar} alt={assignee.name} />
            <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{assignee.name}</span>
        </div>
      ),
    },
    {
        key: 'actions',
        label: 'Actions',
        className: 'text-right',
        render: (_: any, row: any) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit Task</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete Task</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }
  ];

  return (
    <div className="pt-20 sm:pt-20 lg:pt-20 pb-20 lg:pb-6 px-4 lg:px-6 space-y-4 lg:space-y-6">
      <PageHeader
        title="Tasks"
        description="Manage all tasks across your projects."
        primaryAction={{
          content: 'Create Task',
          onClick: () => console.log('Create new task'),
          icon: Plus,
        }}
      />

      <SearchBar placeholder="Search tasks..." value={searchTerm} onChange={setSearchTerm} />
      <FilterExportBar filters={transformedFilters} />

      <div className="content-spacing">
        <DataTable columns={columns} data={tasks} />
      </div>
    </div>
  );
}
