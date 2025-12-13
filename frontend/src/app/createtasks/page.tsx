'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

// Mock current user - In real app, get from auth context
const currentUser = {
  id: '1',
  name: 'John Doe',
  role: 'admin', // 'admin', 'team-lead', 'team-member'
};

export default function CreateTaskPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [taskType, setTaskType] = useState('meeting');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [project, setProject] = useState('');
  const [client, setClient] = useState('');
  const [priority, setPriority] = useState('medium');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [timeSpent, setTimeSpent] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const isAdminOrLead = currentUser.role === 'admin' || currentUser.role === 'team-lead';
  const isTeamMember = currentUser.role === 'team-member';

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Pre-fill date from URL parameter if coming from calendar
  useEffect(() => {
    const dateParam = searchParams.get('date');
    if (dateParam) {
      setDueDate(dateParam);
    }
  }, [searchParams]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please enter task title');
      return;
    }

    if (!description.trim()) {
      toast.error('Please enter task description');
      return;
    }

    // Build task object
    const task = {
      taskType,
      title,
      description,
      project,
      client,
      priority,
      createdDate: today,
      createdBy: currentUser.name,
      ...(isAdminOrLead && assignedTo && {
        assignedTo,
        dueDate,
        dueTime,
      }),
      ...(isTeamMember && timeSpent && {
        timeSpent,
      }),
      files: files.map(f => f.name),
    };

    console.log('Task Created:', task);
    toast.success('Task created successfully!');

    // Reset form
    setTaskType('meeting');
    setTitle('');
    setDescription('');
    setProject('');
    setClient('');
    setPriority('medium');
    setAssignedTo('');
    setDueDate('');
    setDueTime('');
    setTimeSpent('');
    setFiles([]);

    // Navigate back
    setTimeout(() => {
      router.push('/tasks');
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="fixed inset-0 bg-white/50 z-40 flex items-center justify-center p-4 pt-20 pb-20">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col bg-white dark:bg-background shadow-xl">
          <CardHeader className="pb-2.5 pt-2.5 px-4 flex-row items-center justify-between space-y-0 relative">
            <CardTitle className="text-base">Create Task / Activity</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="h-7 w-7 rounded-full absolute top-1 right-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="overflow-y-auto flex-1 px-4 pt-0 pb-20 sm:pb-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Task Type */}
              <div className="space-y-1">
                <Label htmlFor="taskType" className="text-xs font-medium">
                  Task Type <span className="text-destructive">*</span>
                </Label>
                <select
                  id="taskType"
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value)}
                  className="w-full h-9 px-3 text-sm border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
                >
                  <option value="meeting">Meeting</option>
                  <option value="call">Call</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <Label htmlFor="title" className="text-xs font-medium">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Client discussion for Q4 planning"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-9"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <Label htmlFor="description" className="text-xs font-medium">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the task or activity..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="text-sm resize-none"
                />
              </div>

              {/* Project & Client - Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Project */}
                <div className="space-y-1">
                  <Label htmlFor="project" className="text-xs font-medium">
                    Project
                  </Label>
                  <Input
                    id="project"
                    placeholder="Project name (optional)"
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    className="h-9"
                  />
                </div>

                {/* Client */}
                <div className="space-y-1">
                  <Label htmlFor="client" className="text-xs font-medium">
                    Client
                  </Label>
                  <Input
                    id="client"
                    placeholder="Client name (optional)"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>

              {/* Priority & Created Date - Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Priority */}
                <div className="space-y-1">
                  <Label htmlFor="priority" className="text-xs font-medium">
                    Priority <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full h-9 px-3 text-sm border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                {/* Created Date (Auto-filled, Read-only) */}
                <div className="space-y-1">
                  <Label htmlFor="createdDate" className="text-xs font-medium">
                    Created Date
                  </Label>
                  <Input
                    id="createdDate"
                    type="date"
                    value={today}
                    readOnly
                    className="h-9 bg-muted cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Admin/Team Lead Only Fields */}
              {isAdminOrLead && (
                <>
                  {/* Assigned To */}
                  <div className="space-y-1">
                    <Label htmlFor="assignedTo" className="text-xs font-medium">
                      Assigned To
                    </Label>
                    <select
                      id="assignedTo"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      className="w-full h-9 px-3 text-sm border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground"
                    >
                      <option value="">Select team member...</option>
                      <option value="john-doe">John Doe</option>
                      <option value="jane-smith">Jane Smith</option>
                      <option value="mike-johnson">Mike Johnson</option>
                      <option value="sarah-wilson">Sarah Wilson</option>
                    </select>
                  </div>

                  {/* Due Date & Time - Always visible for scheduling */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Due Date */}
                    <div className="space-y-1">
                      <Label htmlFor="dueDate" className="text-xs font-medium">
                        Due Date
                      </Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        min={today}
                        className="h-9"
                      />
                    </div>

                    {/* Due Time */}
                    <div className="space-y-1">
                      <Label htmlFor="dueTime" className="text-xs font-medium">
                        Due Time
                      </Label>
                      <Input
                        id="dueTime"
                        type="time"
                        value={dueTime}
                        onChange={(e) => setDueTime(e.target.value)}
                        className="h-9"
                      />
                    </div>
                  </div>

                  {/* Estimated Time */}
                  <div className="space-y-1">
                    <Label htmlFor="timeSpent" className="text-xs font-medium">
                      Estimated Time
                    </Label>
                    <Input
                      id="timeSpent"
                      type="text"
                      placeholder="e.g., 30 min, 2 hours, 10 days"
                      value={timeSpent}
                      onChange={(e) => setTimeSpent(e.target.value)}
                      className="h-9"
                    />
                  </div>
                </>
              )}

              {/* Team Member Only - Time Spent */}
              {isTeamMember && (
                <div className="space-y-1">
                  <Label htmlFor="timeSpent" className="text-xs font-medium">
                    Time Spent
                  </Label>
                  <Input
                    id="timeSpent"
                    type="text"
                    placeholder="e.g., 30 min, 2 hours, 3 days"
                    value={timeSpent}
                    onChange={(e) => setTimeSpent(e.target.value)}
                    className="h-9"
                  />
                </div>
              )}

              {/* File Attachments */}
              <div className="space-y-1">
                <Label htmlFor="files" className="text-xs font-medium">
                  File Attachments
                </Label>
                <div className="space-y-2">
                  <label
                    htmlFor="files"
                    className="flex items-center justify-center h-20 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                  >
                    <div className="text-center">
                      <Upload className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        Click to upload files
                      </p>
                    </div>
                    <input
                      id="files"
                      type="file"
                      multiple
                      accept="audio/*,video/*,.pdf,.doc,.docx,.txt,.xls,.xlsx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  {/* File List */}
                  {files.length > 0 && (
                    <div className="space-y-1.5">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-muted rounded-lg"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveFile(index)}
                            className="h-6 w-6 flex-shrink-0 ml-2"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button - Centered */}
              <div className="flex justify-center pt-2">
                <Button type="submit" className="w-full sm:w-48">
                  Create Task
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
