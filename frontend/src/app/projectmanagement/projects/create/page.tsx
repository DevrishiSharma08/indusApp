'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Mic,
  Paperclip,
  X,
  Plus,
  Trash2,
  User,
  Users,
  Building2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Target,
  CheckCircle2
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface TeamMember {
  id: string;
  name: string;
  title: string;
  work: string;
  hoursPerDay: number;
  fromDate: string;
  toDate: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  assignedTo: string[];
  fromDate: string;
  toDate: string;
  percentage: number;
}

interface Phase {
  id: string;
  title: string;
  description: string;
  duration: string;
  durationType: 'months' | 'quarters';
  outputPercentage: number;
  milestones: Milestone[];
}

export default function CreateProjectPage() {
  const router = useRouter();

  // Basic Details State
  const [projectName, setProjectName] = useState('');
  const [projectKey, setProjectKey] = useState('');
  const [projectLead, setProjectLead] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  // Customer Details State
  const [customerName, setCustomerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  // Team State
  const [devTeam, setDevTeam] = useState<TeamMember[]>([]);
  const [implTeam, setImplTeam] = useState<TeamMember[]>([]);

  // Phases & Milestones State
  const [phases, setPhases] = useState<Phase[]>([]);

  const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setProjectName(name);
    const key = name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 4);
    setProjectKey(key);
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachedFiles([...attachedFiles, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Implement audio recording logic here
  };

  // Team Management Functions
  const addTeamMember = (team: 'dev' | 'impl') => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: '',
      title: '',
      work: '',
      hoursPerDay: 8,
      fromDate: '',
      toDate: '',
    };
    if (team === 'dev') {
      setDevTeam([...devTeam, newMember]);
    } else {
      setImplTeam([...implTeam, newMember]);
    }
  };

  const updateTeamMember = (team: 'dev' | 'impl', id: string, field: keyof TeamMember, value: any) => {
    const updateTeam = (members: TeamMember[]) =>
      members.map(m => m.id === id ? { ...m, [field]: value } : m);

    if (team === 'dev') {
      setDevTeam(updateTeam(devTeam));
    } else {
      setImplTeam(updateTeam(implTeam));
    }
  };

  const removeTeamMember = (team: 'dev' | 'impl', id: string) => {
    if (team === 'dev') {
      setDevTeam(devTeam.filter(m => m.id !== id));
    } else {
      setImplTeam(implTeam.filter(m => m.id !== id));
    }
  };

  // Phase & Milestone Management Functions
  const addPhase = () => {
    const newPhase: Phase = {
      id: Date.now().toString(),
      title: '',
      description: '',
      duration: '',
      durationType: 'months',
      outputPercentage: 0,
      milestones: [],
    };
    setPhases([...phases, newPhase]);
  };

  const updatePhase = (id: string, field: keyof Phase, value: any) => {
    setPhases(phases.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const removePhase = (id: string) => {
    setPhases(phases.filter(p => p.id !== id));
  };

  const addMilestone = (phaseId: string) => {
    const newMilestone: Milestone = {
      id: Date.now().toString(),
      title: '',
      description: '',
      assignedTo: [],
      fromDate: '',
      toDate: '',
      percentage: 0,
    };
    setPhases(phases.map(p =>
      p.id === phaseId
        ? { ...p, milestones: [...p.milestones, newMilestone] }
        : p
    ));
  };

  const updateMilestone = (phaseId: string, milestoneId: string, field: keyof Milestone, value: any) => {
    setPhases(phases.map(p =>
      p.id === phaseId
        ? {
            ...p,
            milestones: p.milestones.map(m =>
              m.id === milestoneId ? { ...m, [field]: value } : m
            )
          }
        : p
    ));
  };

  const removeMilestone = (phaseId: string, milestoneId: string) => {
    setPhases(phases.map(p =>
      p.id === phaseId
        ? { ...p, milestones: p.milestones.filter(m => m.id !== milestoneId) }
        : p
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      basic: { projectName, projectKey, projectLead, startDate, endDate, description, attachedFiles },
      customer: { customerName, companyName, contactPerson, customerPhone, customerEmail, customerAddress },
      team: { devTeam, implTeam },
      phases
    });
    router.push('/projectmanagement/projects');
  };

  return (
    <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">
      <PageHeader
        title="Create New Project"
       
      />

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList className="inline-flex w-full sm:w-auto gap-1 p-1">
            <TabsTrigger value="basic" className="flex-1 sm:flex-initial">Basic</TabsTrigger>
            <TabsTrigger value="customer" className="flex-1 sm:flex-initial">Customer</TabsTrigger>
            <TabsTrigger value="team" className="flex-1 sm:flex-initial">Team</TabsTrigger>
            <TabsTrigger value="phases" className="flex-1 sm:flex-initial">Phases</TabsTrigger>
          </TabsList>

          {/* Basic Details Tab */}
          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {/* Project Name */}
                  <div className="col-span-2 lg:col-span-4">
                    <Label htmlFor="projectName">Project Name *</Label>
                    <Input
                      type="text"
                      id="projectName"
                      value={projectName}
                      onChange={handleProjectNameChange}
                      required
                      placeholder="Enter project name"
                    />
                  </div>

                  {/* Project Key */}
                  <div>
                    <Label htmlFor="projectKey">Key *</Label>
                    <Input
                      type="text"
                      id="projectKey"
                      value={projectKey}
                      onChange={(e) => setProjectKey(e.target.value.toUpperCase())}
                      maxLength={4}
                      required
                      placeholder="AUTO"
                      className="bg-muted"
                    />
                  </div>

                  {/* Project Lead */}
                  <div>
                    <Label htmlFor="projectLead">Lead *</Label>
                    <Select value={projectLead} onValueChange={setProjectLead} required>
                      <SelectTrigger id="projectLead">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dev">Dev</SelectItem>
                        <SelectItem value="shubham">Shubham</SelectItem>
                        <SelectItem value="geet">Geet</SelectItem>
                        <SelectItem value="gyanii">Gyanii</SelectItem>
                        <SelectItem value="hemant">Hemant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status */}
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select defaultValue="planning">
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="on-hold">On Hold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Priority */}
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger id="priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Start Date */}
                  <div>
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      type="date"
                      id="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      type="date"
                      id="endDate"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="col-span-2 lg:col-span-4">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      placeholder="Enter project description"
                    />
                  </div>
                </div>

                {/* Audio Recording & File Attachments */}
                <div className="space-y-3 pt-4 border-t">
                  <h3 className="text-sm font-semibold text-foreground">Attachments</h3>

                  <div className="flex flex-wrap gap-2">
                    {/* Audio Record Button */}
                    <Button
                      type="button"
                      variant={isRecording ? "destructive" : "outline"}
                      size="sm"
                      onClick={toggleRecording}
                      className="flex items-center gap-2"
                    >
                      <Mic className="w-4 h-4" />
                      {isRecording ? 'Stop Recording' : 'Record Audio'}
                    </Button>

                    {/* File Attach Button */}
                    <label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        <Paperclip className="w-4 h-4" />
                        Attach Files
                      </Button>
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        onChange={handleFileAttach}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Attached Files List */}
                  {attachedFiles.length > 0 && (
                    <div className="space-y-2">
                      {attachedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Paperclip className="w-4 h-4 text-muted-foreground shrink-0" />
                            <span className="text-sm truncate">{file.name}</span>
                            <span className="text-xs text-muted-foreground shrink-0">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customer Details Tab */}
          <TabsContent value="customer" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="customerName">Customer Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="text"
                        id="customerName"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Name"
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="text"
                        id="companyName"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Company"
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="contactPerson">Contact Person</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="text"
                        id="contactPerson"
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                        placeholder="Contact"
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="customerPhone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="tel"
                        id="customerPhone"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+91 XXXXX"
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="customerEmail">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="email"
                        id="customerEmail"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="customer@company.com"
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div className="col-span-2 lg:col-span-4">
                    <Label htmlFor="customerAddress">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Textarea
                        id="customerAddress"
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        placeholder="Enter complete address"
                        rows={2}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-4">
            {/* Development Team */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Development Team
                  </CardTitle>
                  <Button type="button" size="sm" onClick={() => addTeamMember('dev')}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {devTeam.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No team members added yet. Click "Add Member" to start.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {devTeam.map((member, index) => (
                      <div key={member.id} className="p-4 border rounded-lg space-y-3 bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">Member {index + 1}</Badge>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTeamMember('dev', member.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 gap-2 sm:gap-3">
                          <div>
                            <Label className="text-xs">Name</Label>
                            <Input
                              type="text"
                              value={member.name}
                              onChange={(e) => updateTeamMember('dev', member.id, 'name', e.target.value)}
                              placeholder="Name"
                              className="h-9"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Role</Label>
                            <Input
                              type="text"
                              value={member.title}
                              onChange={(e) => updateTeamMember('dev', member.id, 'title', e.target.value)}
                              placeholder="Role"
                              className="h-9"
                            />
                          </div>
                          <div className="col-span-2">
                            <Label className="text-xs">Work Description</Label>
                            <Input
                              type="text"
                              value={member.work}
                              onChange={(e) => updateTeamMember('dev', member.id, 'work', e.target.value)}
                              placeholder="What they'll work on"
                              className="h-9"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Hours/Day</Label>
                            <Input
                              type="number"
                              value={member.hoursPerDay}
                              onChange={(e) => updateTeamMember('dev', member.id, 'hoursPerDay', Number(e.target.value))}
                              min="1"
                              max="24"
                              className="h-9"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">From</Label>
                            <Input
                              type="date"
                              value={member.fromDate}
                              onChange={(e) => updateTeamMember('dev', member.id, 'fromDate', e.target.value)}
                              className="h-9"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">To</Label>
                            <Input
                              type="date"
                              value={member.toDate}
                              onChange={(e) => updateTeamMember('dev', member.id, 'toDate', e.target.value)}
                              className="h-9"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Implementation Team */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Implementation Team
                  </CardTitle>
                  <Button type="button" size="sm" onClick={() => addTeamMember('impl')}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {implTeam.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No team members added yet. Click "Add Member" to start.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {implTeam.map((member, index) => (
                      <div key={member.id} className="p-4 border rounded-lg space-y-3 bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">Member {index + 1}</Badge>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTeamMember('impl', member.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 gap-2 sm:gap-3">
                          <div>
                            <Label className="text-xs">Name</Label>
                            <Input
                              type="text"
                              value={member.name}
                              onChange={(e) => updateTeamMember('impl', member.id, 'name', e.target.value)}
                              placeholder="Name"
                              className="h-9"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Role</Label>
                            <Input
                              type="text"
                              value={member.title}
                              onChange={(e) => updateTeamMember('impl', member.id, 'title', e.target.value)}
                              placeholder="Role"
                              className="h-9"
                            />
                          </div>
                          <div className="col-span-2">
                            <Label className="text-xs">Work Description</Label>
                            <Input
                              type="text"
                              value={member.work}
                              onChange={(e) => updateTeamMember('impl', member.id, 'work', e.target.value)}
                              placeholder="What they'll work on"
                              className="h-9"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Hours/Day</Label>
                            <Input
                              type="number"
                              value={member.hoursPerDay}
                              onChange={(e) => updateTeamMember('impl', member.id, 'hoursPerDay', Number(e.target.value))}
                              min="1"
                              max="24"
                              className="h-9"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">From</Label>
                            <Input
                              type="date"
                              value={member.fromDate}
                              onChange={(e) => updateTeamMember('impl', member.id, 'fromDate', e.target.value)}
                              className="h-9"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">To</Label>
                            <Input
                              type="date"
                              value={member.toDate}
                              onChange={(e) => updateTeamMember('impl', member.id, 'toDate', e.target.value)}
                              className="h-9"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Phases & Milestones Tab */}
          <TabsContent value="phases" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Project Phases & Milestones
                  </CardTitle>
                  <Button type="button" size="sm" onClick={addPhase}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Phase
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {phases.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No phases created yet. Click "Add Phase" to start planning your project.</p>
                  </div>
                ) : (
                  <Accordion type="multiple" className="space-y-3">
                    {phases.map((phase, phaseIndex) => (
                      <AccordionItem
                        key={phase.id}
                        value={phase.id}
                        className="border rounded-lg overflow-hidden"
                      >
                        <AccordionTrigger className="px-4 hover:bg-muted/50">
                          <div className="flex items-center gap-3 flex-1">
                            <Badge>Phase {phaseIndex + 1}</Badge>
                            <span className="font-semibold">
                              {phase.title || 'Untitled Phase'}
                            </span>
                            {phase.outputPercentage > 0 && (
                              <Badge variant="secondary">{phase.outputPercentage}%</Badge>
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 space-y-4">
                          {/* Phase Details */}
                          <div className="space-y-3 pt-2">
                            <div className="flex justify-end">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removePhase(phase.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Remove Phase
                              </Button>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                              <div className="col-span-2">
                                <Label className="text-xs">Phase Title</Label>
                                <Input
                                  type="text"
                                  value={phase.title}
                                  onChange={(e) => updatePhase(phase.id, 'title', e.target.value)}
                                  placeholder="Planning & Design"
                                  className="h-9"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Duration</Label>
                                <Input
                                  type="text"
                                  value={phase.duration}
                                  onChange={(e) => updatePhase(phase.id, 'duration', e.target.value)}
                                  placeholder="3"
                                  className="h-9"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Type</Label>
                                <Select
                                  value={phase.durationType}
                                  onValueChange={(value) => updatePhase(phase.id, 'durationType', value)}
                                >
                                  <SelectTrigger className="h-9">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="months">Months</SelectItem>
                                    <SelectItem value="quarters">Quarters</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="col-span-2 lg:col-span-3">
                                <Label className="text-xs">Description</Label>
                                <Textarea
                                  value={phase.description}
                                  onChange={(e) => updatePhase(phase.id, 'description', e.target.value)}
                                  placeholder="Describe this phase..."
                                  rows={2}
                                  className="text-sm"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Output %</Label>
                                <Input
                                  type="number"
                                  value={phase.outputPercentage}
                                  onChange={(e) => updatePhase(phase.id, 'outputPercentage', Number(e.target.value))}
                                  min="0"
                                  max="100"
                                  placeholder="25"
                                  className="h-9"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Milestones Section */}
                          <div className="space-y-3 pt-4 border-t">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" />
                                Milestones ({phase.milestones.length})
                              </h4>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addMilestone(phase.id)}
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Add Milestone
                              </Button>
                            </div>

                            {phase.milestones.length === 0 ? (
                              <div className="text-center py-6 text-sm text-muted-foreground bg-muted/30 rounded-md">
                                No milestones yet. Add milestones to track progress.
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {phase.milestones.map((milestone, milestoneIndex) => (
                                  <div
                                    key={milestone.id}
                                    className="p-3 border rounded-md bg-background space-y-3"
                                  >
                                    <div className="flex items-center justify-between">
                                      <Badge variant="outline" className="text-xs">
                                        M{milestoneIndex + 1}
                                      </Badge>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeMilestone(phase.id, milestone.id)}
                                      >
                                        <X className="w-3 h-3" />
                                      </Button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                      <div className="sm:col-span-2">
                                        <Label className="text-xs">Milestone Title</Label>
                                        <Input
                                          type="text"
                                          value={milestone.title}
                                          onChange={(e) =>
                                            updateMilestone(phase.id, milestone.id, 'title', e.target.value)
                                          }
                                          placeholder="e.g. UI Design Complete"
                                          className="h-9 text-sm"
                                        />
                                      </div>
                                      <div>
                                        <Label className="text-xs">% of Phase</Label>
                                        <Input
                                          type="number"
                                          value={milestone.percentage}
                                          onChange={(e) =>
                                            updateMilestone(phase.id, milestone.id, 'percentage', Number(e.target.value))
                                          }
                                          min="0"
                                          max="100"
                                          className="h-9 text-sm"
                                        />
                                      </div>
                                      <div className="sm:col-span-2 lg:col-span-3">
                                        <Label className="text-xs">Description</Label>
                                        <Textarea
                                          value={milestone.description}
                                          onChange={(e) =>
                                            updateMilestone(phase.id, milestone.id, 'description', e.target.value)
                                          }
                                          placeholder="Describe this milestone..."
                                          rows={2}
                                          className="text-sm"
                                        />
                                      </div>
                                      <div>
                                        <Label className="text-xs">From Date</Label>
                                        <Input
                                          type="date"
                                          value={milestone.fromDate}
                                          onChange={(e) =>
                                            updateMilestone(phase.id, milestone.id, 'fromDate', e.target.value)
                                          }
                                          className="h-9 text-sm"
                                        />
                                      </div>
                                      <div>
                                        <Label className="text-xs">To Date</Label>
                                        <Input
                                          type="date"
                                          value={milestone.toDate}
                                          onChange={(e) =>
                                            updateMilestone(phase.id, milestone.id, 'toDate', e.target.value)
                                          }
                                          className="h-9 text-sm"
                                        />
                                      </div>
                                      <div>
                                        <Label className="text-xs">Assigned To</Label>
                                        <Select>
                                          <SelectTrigger className="h-9 text-sm">
                                            <SelectValue placeholder="Select users" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="dev">Dev</SelectItem>
                                            <SelectItem value="shubham">Shubham</SelectItem>
                                            <SelectItem value="geet">Geet</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
            </Card>

            {/* Form Actions - Only on last tab */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                  <p className="text-sm text-muted-foreground">
                    All fields marked with * are required
                  </p>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      Create Project
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}
