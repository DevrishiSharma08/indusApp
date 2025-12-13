'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FilterExportBar from '@/components/FilterExportBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Plus, Users, Monitor, Calendar, Clock, User, MoreVertical, Eye, Edit, XCircle, FileEdit, CalendarIcon, Check, ChevronsUpDown, X, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

// Types
interface Event {
  id: string;
  type: 'meeting' | 'demo';
  company_name: string;
  contact_name: string;
  assigned_to: string;
  meeting_type?: string;
  date: string;
  time: string;
  duration: number;
  status: 'Pending' | 'Completed' | 'Overdue' | 'Canceled';
  attendees: string[];
  notes?: string;
}

// Mock data
const mockTeamMembers = [
  { id: '1', name: 'Sarah Wilson' },
  { id: '2', name: 'Mike Johnson' },
  { id: '3', name: 'Emma Davis' },
  { id: '4', name: 'James Brown' },
  { id: '5', name: 'Lisa Anderson' },
];

const mockLeads = [
  { id: '1', company_name: 'ABC Corporation', contact_name: 'John Doe' },
  { id: '2', company_name: 'XYZ Ltd', contact_name: 'Jane Smith' },
  { id: '3', company_name: 'Tech Solutions Inc', contact_name: 'Bob Williams' },
  { id: '4', company_name: 'Global Systems', contact_name: 'Alice Johnson' },
  { id: '5', company_name: 'Innovation Labs', contact_name: 'Charlie Brown' },
];

const meetingTypes = ['Discussion', 'Presentation', 'Follow-up', 'Negotiation', 'Closing'];

const mockMeetings: Event[] = [
  {
    id: '1',
    type: 'meeting',
    company_name: 'ABC Corporation',
    contact_name: 'John Doe',
    assigned_to: 'Sarah Wilson',
    meeting_type: 'Discussion',
    date: '2024-12-08',
    time: '10:00 AM',
    duration: 60,
    status: 'Pending',
    attendees: ['Sarah Wilson', 'Mike Johnson'],
  },
  {
    id: '2',
    type: 'meeting',
    company_name: 'XYZ Ltd',
    contact_name: 'Jane Smith',
    assigned_to: 'Mike Johnson',
    meeting_type: 'Follow-up',
    date: '2024-12-09',
    time: '02:00 PM',
    duration: 45,
    status: 'Pending',
    attendees: ['Mike Johnson'],
  },
  {
    id: '3',
    type: 'meeting',
    company_name: 'Tech Solutions Inc',
    contact_name: 'Bob Williams',
    assigned_to: 'Emma Davis',
    meeting_type: 'Presentation',
    date: '2024-12-05',
    time: '11:00 AM',
    duration: 90,
    status: 'Completed',
    attendees: ['Emma Davis', 'Sarah Wilson', 'James Brown'],
    notes: 'Great meeting! Client showed high interest in our premium package. Next steps: Send detailed proposal by EOD tomorrow.',
  },
  {
    id: '4',
    type: 'meeting',
    company_name: 'Global Systems',
    contact_name: 'Alice Johnson',
    assigned_to: 'Lisa Anderson',
    meeting_type: 'Negotiation',
    date: '2024-12-01',
    time: '03:00 PM',
    duration: 120,
    status: 'Overdue',
    attendees: ['Lisa Anderson', 'Mike Johnson'],
  },
  {
    id: '5',
    type: 'meeting',
    company_name: 'Innovation Labs',
    contact_name: 'Charlie Brown',
    assigned_to: 'Sarah Wilson',
    meeting_type: 'Discussion',
    date: '2024-12-10',
    time: '09:00 AM',
    duration: 60,
    status: 'Canceled',
    attendees: ['Sarah Wilson'],
    notes: 'Client requested to postpone indefinitely due to internal budget review.',
  },
];

const mockDemos: Event[] = [
  {
    id: '1',
    type: 'demo',
    company_name: 'Tech Solutions Inc',
    contact_name: 'Bob Williams',
    assigned_to: 'Sarah Wilson',
    date: '2024-12-10',
    time: '11:00 AM',
    duration: 90,
    status: 'Pending',
    attendees: ['Sarah Wilson', 'Emma Davis'],
  },
  {
    id: '2',
    type: 'demo',
    company_name: 'Global Systems',
    contact_name: 'Alice Johnson',
    assigned_to: 'James Brown',
    date: '2024-12-11',
    time: '02:00 PM',
    duration: 60,
    status: 'Pending',
    attendees: ['James Brown', 'Mike Johnson'],
  },
  {
    id: '3',
    type: 'demo',
    company_name: 'Innovation Labs',
    contact_name: 'Charlie Brown',
    assigned_to: 'Emma Davis',
    date: '2024-12-06',
    time: '10:00 AM',
    duration: 120,
    status: 'Completed',
    attendees: ['Emma Davis', 'Sarah Wilson', 'Lisa Anderson'],
    notes: 'Excellent demo session! Covered all key features. Client particularly interested in automation capabilities. Follow-up meeting scheduled for proposal presentation.',
  },
  {
    id: '4',
    type: 'demo',
    company_name: 'ABC Corporation',
    contact_name: 'John Doe',
    assigned_to: 'Mike Johnson',
    date: '2024-12-02',
    time: '04:00 PM',
    duration: 75,
    status: 'Overdue',
    attendees: ['Mike Johnson', 'Sarah Wilson'],
  },
];

const statusOptions = [
  { label: 'All Status', value: 'all' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Overdue', value: 'Overdue' },
  { label: 'Canceled', value: 'Canceled' }
];

const getStatusBadge = (status: string) => {
  const variants: any = {
    'Pending': 'secondary',
    'Completed': 'default',
    'Overdue': 'destructive',
    'Canceled': 'outline'
  };
  return variants[status] || 'secondary';
};

export default function EventsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'meetings' | 'demos'>('meetings');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Schedule Modal States
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    lead_id: '',
    assigned_to: '',
    meeting_type: 'Discussion',
    start_date_time: '',
    duration: '60',
    attendees: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Action Modal States
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isEditNotesModalOpen, setIsEditNotesModalOpen] = useState(false);

  // Action Form States
  const [rescheduleForm, setRescheduleForm] = useState({ start_date_time: '', duration: '60' });
  const [reassignForm, setReassignForm] = useState({ assigned_to: '' });
  const [cancelForm, setCancelForm] = useState({ reason: '' });
  const [notesForm, setNotesForm] = useState({ notes: '' });

  const handleExport = (format: 'excel' | 'csv' | 'pdf') => {
    toast.success(`Exporting ${activeTab} to ${format.toUpperCase()}`);
  };

  const currentData = activeTab === 'meetings' ? mockMeetings : mockDemos;

  const filteredEvents = currentData.filter(event => {
    const matchesSearch = searchQuery === '' ||
      event.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.contact_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate end time based on start time and duration
  const calculateEndTime = (startDateTime: string, duration: string) => {
    if (!startDateTime || !duration) return '';
    const start = new Date(startDateTime);
    const durationInMinutes = parseInt(duration, 10);
    if (isNaN(durationInMinutes)) return '';
    const end = new Date(start.getTime() + durationInMinutes * 60 * 1000);
    return end.toLocaleString();
  };

  // Schedule Modal Handlers
  const handleOpenScheduleModal = () => {
    setScheduleForm({
      lead_id: '',
      assigned_to: '',
      meeting_type: 'Discussion',
      start_date_time: '',
      duration: '60',
      attendees: [],
    });
    setIsScheduleModalOpen(true);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsScheduleModalOpen(false);
      toast.success(`${activeTab === 'meetings' ? 'Meeting' : 'Demo'} scheduled successfully!`);
    }, 1000);
  };

  const toggleAttendee = (name: string) => {
    setScheduleForm(prev => ({
      ...prev,
      attendees: prev.attendees.includes(name)
        ? prev.attendees.filter(a => a !== name)
        : [...prev.attendees, name]
    }));
  };

  const removeAttendee = (name: string) => {
    setScheduleForm(prev => ({
      ...prev,
      attendees: prev.attendees.filter(a => a !== name)
    }));
  };

  // Action Handlers
  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  const handleReschedule = (event: Event) => {
    setSelectedEvent(event);
    setRescheduleForm({
      start_date_time: `${event.date}T${event.time.replace(' ', '')}`,
      duration: event.duration.toString(),
    });
    setIsRescheduleModalOpen(true);
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsRescheduleModalOpen(false);
      toast.success('Event rescheduled successfully!');
    }, 1000);
  };

  const handleReassign = (event: Event) => {
    setSelectedEvent(event);
    setReassignForm({ assigned_to: event.assigned_to });
    setIsReassignModalOpen(true);
  };

  const handleReassignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsReassignModalOpen(false);
      toast.success('Event reassigned successfully!');
    }, 1000);
  };

  const handleCancelEvent = (event: Event) => {
    setSelectedEvent(event);
    setCancelForm({ reason: '' });
    setIsCancelModalOpen(true);
  };

  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelForm.reason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsCancelModalOpen(false);
      toast.success('Event canceled successfully!');
    }, 1000);
  };

  const handleEditNotes = (event: Event) => {
    setSelectedEvent(event);
    setNotesForm({ notes: event.notes || '' });
    setIsEditNotesModalOpen(true);
  };

  const handleEditNotesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsEditNotesModalOpen(false);
      toast.success('Notes updated successfully!');
    }, 1000);
  };

  // Render Event Card
  const renderEventCard = (event: Event) => (
    <Card key={event.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            {event.type === 'meeting' ? (
              <Users className="w-4 h-4 text-blue-500 flex-shrink-0" />
            ) : (
              <Monitor className="w-4 h-4 text-purple-500 flex-shrink-0" />
            )}
            <Badge variant={getStatusBadge(event.status)} className="text-xs px-1.5 py-0">
              {event.status}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-7 w-7 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewDetails(event)}>
                <Eye className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>
              {event.status !== 'Completed' && event.status !== 'Canceled' && (
                <>
                  <DropdownMenuItem onClick={() => handleReschedule(event)}>
                    <CalendarIcon className="mr-2 h-4 w-4" /> Reschedule
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleReassign(event)}>
                    <User className="mr-2 h-4 w-4" /> Reassign
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleCancelEvent(event)} className="text-destructive">
                    <XCircle className="mr-2 h-4 w-4" /> Cancel Event
                  </DropdownMenuItem>
                </>
              )}
              {event.status === 'Completed' && (
                <DropdownMenuItem onClick={() => handleEditNotes(event)}>
                  <FileEdit className="mr-2 h-4 w-4" /> Edit Notes
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <h3 className="text-sm font-semibold text-foreground mb-1">{event.company_name}</h3>
        <p className="text-xs text-muted-foreground mb-2">{event.contact_name}</p>

        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs">
            <User className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">{event.assigned_to}</span>
          </div>
          {event.meeting_type && (
            <div className="flex items-center gap-1.5 text-xs">
              <Users className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">{event.meeting_type}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs">
            <Calendar className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">{event.date} at {event.time}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <Clock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">{event.duration} minutes</span>
          </div>
          <div className="pt-1 border-t mt-2">
            <div className="flex flex-wrap gap-1">
              <span className="text-xs text-muted-foreground">Attendees:</span>
              {event.attendees.map(attendee => (
                <Badge key={attendee} variant="secondary" className="text-xs px-1.5 py-0">
                  {attendee}
                </Badge>
              ))}
            </div>
          </div>
          {event.notes && (
            <div className="pt-2 border-t mt-2">
              <p className="text-xs text-muted-foreground line-clamp-2">{event.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

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
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Events</h2>
        </div>
        <Button
          onClick={handleOpenScheduleModal}
          className="flex items-center justify-center sm:space-x-2 sm:px-4 sm:py-2 bg-primary text-primary-foreground rounded-full sm:rounded-lg hover:bg-primary/90 transition-colors font-medium w-9 h-9 sm:w-auto sm:h-auto flex-shrink-0"
        >
          <Plus className="w-5 h-5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline text-sm">Schedule {activeTab === 'meetings' ? 'Meeting' : 'Demo'}</span>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'meetings' | 'demos')} className="space-y-2 lg:space-y-3">
        <TabsList className="w-full grid grid-cols-2 h-10">
          <TabsTrigger value="meetings" className="text-xs sm:text-sm">
            <Users className="w-4 h-4 mr-2 hidden sm:inline" />
            Meetings
          </TabsTrigger>
          <TabsTrigger value="demos" className="text-xs sm:text-sm">
            <Monitor className="w-4 h-4 mr-2 hidden sm:inline" />
            Demos
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card className="border-border shadow-sm rounded-lg sm:rounded-xl">
            <div className="p-2 border-b border-border">
              <FilterExportBar
                filters={[
                  {
                    key: 'status',
                    label: 'Status',
                    options: statusOptions,
                    value: statusFilter,
                    onChange: setStatusFilter
                  }
                ]}
                onExport={handleExport}
                showViewToggle={true}
                viewToggleProps={{
                  currentView: viewMode,
                  onViewChange: setViewMode
                }}
                showSearch={true}
                searchProps={{
                  placeholder: `Search ${activeTab}...`,
                  value: searchQuery,
                  onChange: setSearchQuery
                }}
              />
            </div>

            <CardContent className="p-0">
              {filteredEvents.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-muted-foreground">
                  No {activeTab} found
                </div>
              ) : viewMode === 'table' ? (
                /* Table View */
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Assigned To</TableHead>
                        {activeTab === 'meetings' && <TableHead>Meeting Type</TableHead>}
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Attendees</TableHead>
                        {viewMode === 'table' && <TableHead className="text-right">Actions</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEvents.map((event) => (
                        <TableRow key={event.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="font-medium">{event.company_name}</TableCell>
                          <TableCell className="text-sm">{event.contact_name}</TableCell>
                          <TableCell className="text-sm">{event.assigned_to}</TableCell>
                          {activeTab === 'meetings' && (
                            <TableCell className="text-sm">{event.meeting_type || '-'}</TableCell>
                          )}
                          <TableCell className="text-sm">
                            <div>
                              <div className="font-medium">{event.date}</div>
                              <div className="text-xs text-muted-foreground">{event.time}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{event.duration} min</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadge(event.status)} className="text-xs">
                              {event.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                              {event.attendees.map(attendee => (
                                <Badge key={attendee} variant="secondary" className="text-xs px-1.5 py-0">
                                  {attendee}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewDetails(event)}>
                                  <Eye className="mr-2 h-4 w-4" /> View Details
                                </DropdownMenuItem>
                                {event.status !== 'Completed' && event.status !== 'Canceled' && (
                                  <>
                                    <DropdownMenuItem onClick={() => handleReschedule(event)}>
                                      <CalendarIcon className="mr-2 h-4 w-4" /> Reschedule
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleReassign(event)}>
                                      <User className="mr-2 h-4 w-4" /> Reassign
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleCancelEvent(event)} className="text-destructive">
                                      <XCircle className="mr-2 h-4 w-4" /> Cancel Event
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {event.status === 'Completed' && (
                                  <DropdownMenuItem onClick={() => handleEditNotes(event)}>
                                    <FileEdit className="mr-2 h-4 w-4" /> Edit Notes
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                /* Card View */
                <div className="p-2 sm:p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {filteredEvents.map(renderEventCard)}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Schedule Modal */}
      <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule {activeTab === 'meetings' ? 'Meeting' : 'Demo'}</DialogTitle>
            <DialogDescription>
              Fill in the details to schedule a new {activeTab === 'meetings' ? 'meeting' : 'demo'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleScheduleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lead_id">Lead / Company *</Label>
              <Select
                value={scheduleForm.lead_id}
                onValueChange={(value) => setScheduleForm({ ...scheduleForm, lead_id: value })}
                required
              >
                <SelectTrigger id="lead_id">
                  <SelectValue placeholder="Select a lead..." />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-[200px]">
                    {mockLeads.map(lead => (
                      <SelectItem key={lead.id} value={lead.id}>
                        {lead.company_name} - {lead.contact_name}
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assigned_to">Assigned To *</Label>
                <Select
                  value={scheduleForm.assigned_to}
                  onValueChange={(value) => setScheduleForm({ ...scheduleForm, assigned_to: value })}
                  required
                >
                  <SelectTrigger id="assigned_to">
                    <SelectValue placeholder="Select team member..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTeamMembers.map(member => (
                      <SelectItem key={member.id} value={member.name}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {activeTab === 'meetings' && (
                <div className="space-y-2">
                  <Label htmlFor="meeting_type">Meeting Type *</Label>
                  <Select
                    value={scheduleForm.meeting_type}
                    onValueChange={(value) => setScheduleForm({ ...scheduleForm, meeting_type: value })}
                    required
                  >
                    <SelectTrigger id="meeting_type">
                      <SelectValue placeholder="Select type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {meetingTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date_time">Start Date & Time *</Label>
                <Input
                  id="start_date_time"
                  type="datetime-local"
                  value={scheduleForm.start_date_time}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, start_date_time: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes) *</Label>
                <Input
                  id="duration"
                  type="number"
                  min="15"
                  step="15"
                  value={scheduleForm.duration}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, duration: e.target.value })}
                  required
                />
              </div>
            </div>

            {scheduleForm.start_date_time && scheduleForm.duration && (
              <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
                <strong>End Time:</strong> {calculateEndTime(scheduleForm.start_date_time, scheduleForm.duration)}
              </div>
            )}

            <div className="space-y-2">
              <Label>Attendees (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between h-auto min-h-[2.5rem]"
                  >
                    <div className="flex gap-1 flex-wrap">
                      {scheduleForm.attendees.length === 0 && (
                        <span className="font-normal text-muted-foreground">Select attendees...</span>
                      )}
                      {scheduleForm.attendees.map(name => (
                        <Badge
                          key={name}
                          variant="secondary"
                          className="mr-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeAttendee(name);
                          }}
                        >
                          {name}
                          <X className="ml-1 h-3 w-3" />
                        </Badge>
                      ))}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search team members..." />
                    <CommandEmpty>No team member found.</CommandEmpty>
                    <CommandGroup>
                      <ScrollArea className="h-[200px]">
                        {mockTeamMembers
                          .filter(m => m.name !== scheduleForm.assigned_to)
                          .map((member) => (
                            <CommandItem
                              key={member.id}
                              value={member.name}
                              onSelect={() => toggleAttendee(member.name)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  scheduleForm.attendees.includes(member.name) ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {member.name}
                            </CommandItem>
                          ))}
                      </ScrollArea>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsScheduleModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Schedule {activeTab === 'meetings' ? 'Meeting' : 'Demo'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Details Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedEvent?.type === 'meeting' ? 'Meeting' : 'Demo'} Details
            </DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm font-medium text-muted-foreground">Status:</div>
                <div className="col-span-2">
                  <Badge variant={getStatusBadge(selectedEvent.status)}>{selectedEvent.status}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm font-medium text-muted-foreground">Company:</div>
                <div className="col-span-2 text-sm">{selectedEvent.company_name}</div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm font-medium text-muted-foreground">Contact:</div>
                <div className="col-span-2 text-sm">{selectedEvent.contact_name}</div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm font-medium text-muted-foreground">Assigned To:</div>
                <div className="col-span-2 text-sm">{selectedEvent.assigned_to}</div>
              </div>

              {selectedEvent.meeting_type && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-sm font-medium text-muted-foreground">Meeting Type:</div>
                  <div className="col-span-2 text-sm">{selectedEvent.meeting_type}</div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm font-medium text-muted-foreground">Date & Time:</div>
                <div className="col-span-2 text-sm">{selectedEvent.date} at {selectedEvent.time}</div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm font-medium text-muted-foreground">Duration:</div>
                <div className="col-span-2 text-sm">{selectedEvent.duration} minutes</div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-sm font-medium text-muted-foreground">Attendees:</div>
                <div className="col-span-2 flex flex-wrap gap-1">
                  {selectedEvent.attendees.map(attendee => (
                    <Badge key={attendee} variant="secondary" className="text-xs">
                      {attendee}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedEvent.notes && (
                <div className="pt-4 border-t">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Notes:</div>
                  <div className="text-sm bg-muted p-3 rounded-md">{selectedEvent.notes}</div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reschedule Modal */}
      <Dialog open={isRescheduleModalOpen} onOpenChange={setIsRescheduleModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reschedule {selectedEvent?.type === 'meeting' ? 'Meeting' : 'Demo'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRescheduleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reschedule_date_time">New Start Date & Time *</Label>
              <Input
                id="reschedule_date_time"
                type="datetime-local"
                value={rescheduleForm.start_date_time}
                onChange={(e) => setRescheduleForm({ ...rescheduleForm, start_date_time: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reschedule_duration">Duration (minutes) *</Label>
              <Input
                id="reschedule_duration"
                type="number"
                min="15"
                step="15"
                value={rescheduleForm.duration}
                onChange={(e) => setRescheduleForm({ ...rescheduleForm, duration: e.target.value })}
                required
              />
            </div>

            {rescheduleForm.start_date_time && rescheduleForm.duration && (
              <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
                <strong>New End Time:</strong> {calculateEndTime(rescheduleForm.start_date_time, rescheduleForm.duration)}
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsRescheduleModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reassign Modal */}
      <Dialog open={isReassignModalOpen} onOpenChange={setIsReassignModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reassign {selectedEvent?.type === 'meeting' ? 'Meeting' : 'Demo'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleReassignSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reassign_to">New Assignee *</Label>
              <Select
                value={reassignForm.assigned_to}
                onValueChange={(value) => setReassignForm({ ...reassignForm, assigned_to: value })}
                required
              >
                <SelectTrigger id="reassign_to">
                  <SelectValue placeholder="Select team member..." />
                </SelectTrigger>
                <SelectContent>
                  {mockTeamMembers.map(member => (
                    <SelectItem key={member.id} value={member.name}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsReassignModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reassign
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Cancel Event Modal */}
      <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Cancel {selectedEvent?.type === 'meeting' ? 'Meeting' : 'Demo'}</DialogTitle>
            <DialogDescription>
              Please provide a reason for canceling this event.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCancelSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cancel_reason">Reason for Cancellation *</Label>
              <Textarea
                id="cancel_reason"
                value={cancelForm.reason}
                onChange={(e) => setCancelForm({ ...cancelForm, reason: e.target.value })}
                placeholder="e.g., Client requested to postpone..."
                rows={4}
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCancelModalOpen(false)}>
                Back
              </Button>
              <Button type="submit" variant="destructive" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm Cancellation
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Notes Modal */}
      <Dialog open={isEditNotesModalOpen} onOpenChange={setIsEditNotesModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Notes</DialogTitle>
            <DialogDescription>
              Update the post-event notes for this completed {selectedEvent?.type}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditNotesSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit_notes">Post-Event Notes *</Label>
              <Textarea
                id="edit_notes"
                value={notesForm.notes}
                onChange={(e) => setNotesForm({ ...notesForm, notes: e.target.value })}
                placeholder="Add detailed notes about the event..."
                rows={10}
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditNotesModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
