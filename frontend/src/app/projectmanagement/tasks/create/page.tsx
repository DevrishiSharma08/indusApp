
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Paperclip } from 'lucide-react';
// DashboardLayout is already applied in projectmanagement/layout.tsx
import PageHeader from '@/components/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function CreateTaskPage() {
  const router = useRouter();
  const [issueType, setIssueType] = useState('task');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ issueType, summary, description, assignee, priority, dueDate });
    router.back();
  };

  return (
    
      <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">
        <PageHeader
          title="Create New Issue"
          description="Add a new task or issue to your project"
        />

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Issue Type */}
                <div>
                  <Label htmlFor="issueType">Issue Type</Label>
                  <Select value={issueType} onValueChange={setIssueType}>
                    <SelectTrigger id="issueType">
                      <SelectValue placeholder="Select issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="task">Task</SelectItem>
                      <SelectItem value="story">Story</SelectItem>
                      <SelectItem value="bug">Bug</SelectItem>
                      <SelectItem value="epic">Epic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Summary */}
                <div className="md:col-span-2">
                  <Label htmlFor="summary">Summary</Label>
                  <Input
                    type="text"
                    id="summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    required
                    placeholder="Enter issue summary"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    placeholder="Enter detailed description"
                  />
                </div>

                {/* Assignee */}
                <div>
                  <Label htmlFor="assignee">Assignee</Label>
                  <Select value={assignee} onValueChange={setAssignee}>
                    <SelectTrigger id="assignee">
                      <SelectValue placeholder="Select an assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alia-bhatt">Alia Bhatt</SelectItem>
                      <SelectItem value="ranbir-kapoor">Ranbir Kapoor</SelectItem>
                      <SelectItem value="deepika-padukone">Deepika Padukone</SelectItem>
                      <SelectItem value="shah-rukh-khan">Shah Rukh Khan</SelectItem>
                      <SelectItem value="priyanka-chopra">Priyanka Chopra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority */}
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Due Date */}
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    type="date"
                    id="dueDate"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>

                {/* Attachments */}
                <div className="md:col-span-2">
                  <Label>Attachments</Label>
                  <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-border rounded-md bg-muted/50">
                    <div className="space-y-1 text-center">
                      <Paperclip className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div className="flex text-sm text-muted-foreground">
                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Issue</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    
  );
}
