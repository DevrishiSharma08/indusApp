
'use client';

import { useState } from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const initialTasks = {
  todo: [
    { id: 'TASK-001', title: 'Design the database schema', priority: 'High' },
    { id: 'TASK-002', title: 'Set up the development environment', priority: 'Medium' },
  ],
  inProgress: [
    { id: 'TASK-003', title: 'Develop the user authentication API', priority: 'High' },
  ],
  review: [
    { id: 'TASK-004', title: 'Implement the password reset functionality', priority: 'Medium' },
  ],
  done: [
    { id: 'TASK-005', title: 'Create the project boilerplate', priority: 'Low' },
  ],
};

type Task = {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
};

type TaskStatus = 'todo' | 'inProgress' | 'review' | 'done';

const priorityVariant: { [key in Task['priority']]: 'destructive' | 'secondary' | 'outline' } = {
  High: 'destructive',
  Medium: 'secondary',
  Low: 'outline',
};

function TaskCard({ task }: { task: Task }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{task.id}</span>
          <Badge variant={priorityVariant[task.priority]}>{task.priority}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

const columnNames: { [key in TaskStatus]: string } = {
  todo: 'To-Do',
  inProgress: 'In Progress',
  review: 'Review',
  done: 'Done',
};

export default function BoardPage() {
  const [tasks, setTasks] = useState(initialTasks);

  return (
    <div className="py-3 lg:py-4 space-y-2 lg:space-y-3">
      <PageHeader
        title="Scrum Board"
        primaryAction={{
          content: 'Create Task',
          onClick: () => console.log('Create new task'),
          icon: Plus,
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {(Object.keys(tasks) as TaskStatus[]).map((status) => (
          <Card key={status} className="bg-muted/40">
            <CardHeader>
              <CardTitle className="text-base">{columnNames[status]} ({tasks[status].length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {tasks[status].map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
