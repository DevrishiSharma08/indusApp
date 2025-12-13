
'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const timeLogs = [
  {
    id: 'TL-001',
    task: 'Design Database',
    project: 'Indus Nova',
    date: '2023-10-10',
    hours: 4,
    description: 'Worked on ER diagram and table definitions.',
  },
  {
    id: 'TL-002',
    task: 'Develop API',
    project: 'Indus Nova',
    date: '2023-10-11',
    hours: 6,
    description: 'Implemented user authentication endpoints.',
  },
  {
    id: 'TL-003',
    task: 'Design UI',
    project: 'Project Phoenix',
    date: '2023-10-12',
    hours: 3,
    description: 'Created wireframes for dashboard.',
  },
];

export default function TimeLogPage() {
  const [newLog, setNewLog] = useState({
    task: '',
    project: '',
    date: '',
    hours: '',
    description: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewLog(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New Time Log:', newLog);
    setNewLog({
      task: '',
      project: '',
      date: '',
      hours: '',
      description: '',
    });
  };

  return (
    <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">
      <PageHeader
        title="Time Log"
        description="Track and manage time spent on tasks"
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Log New Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="task">Task</Label>
                <Input
                  type="text"
                  id="task"
                  name="task"
                  value={newLog.task}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project">Project</Label>
                <Input
                  type="text"
                  id="project"
                  name="project"
                  value={newLog.project}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  type="date"
                  id="date"
                  name="date"
                  value={newLog.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours">Hours</Label>
                <Input
                  type="number"
                  id="hours"
                  name="hours"
                  value={newLog.hours}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newLog.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">
                <Plus className="w-4 h-4 mr-2" />
                Log Hours
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Time Logs</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Project</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead className="hidden lg:table-cell">Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeLogs.map(log => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.task}</TableCell>
                  <TableCell className="text-muted-foreground">{log.project}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{log.date}</TableCell>
                  <TableCell className="font-semibold">{log.hours}h</TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">{log.description}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}