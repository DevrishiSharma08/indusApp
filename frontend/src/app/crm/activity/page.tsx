'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FilterExportBar from '@/components/FilterExportBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Phone, Mail, MessageSquare, Users, CheckCircle, Clock, MoreVertical, Eye, Edit, Trash2, CalendarPlus, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { mockTeamMembers } from '@/lib/assets-mock-data';

// Mock data with more fields
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

const typeOptions = [
  { label: 'All Types', value: 'all' },
  { label: 'Call', value: 'Call' },
  { label: 'Email', value: 'Email' },
  { label: 'Follow-up', value: 'Follow-up' },
  { label: 'WhatsApp', value: 'WhatsApp' }
];

const statusOptions = [
  { label: 'All Status', value: 'all' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Overdue', value: 'Overdue' }
];

const getStatusBadge = (status: string) => {
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

export default function ActivityPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Dialog states
  const [isLogActivityOpen, setLogActivityOpen] = useState(false);
  const [isScheduleReminderOpen, setScheduleReminderOpen] = useState(false);
  const [isViewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [isEditActivityOpen, setEditActivityOpen] = useState(false);
  const [isMarkDoneOpen, setMarkDoneOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  // Form states
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

  const handleViewDetails = (activity: any) => {
    setSelectedActivity(activity);
    setViewDetailsOpen(true);
  };

  const handleEdit = (activity: any) => {
    setSelectedActivity(activity);
    setEditActivityOpen(true);
  };

  const handleMarkDone = (activity: any) => {
    setSelectedActivity(activity);
    setMarkDoneOpen(true);
  };

  const handleDelete = (activity: any) => {
    setSelectedActivity(activity);
    setDeleteOpen(true);
  };

  const confirmMarkDone = () => {
    toast.success(`Activity marked as completed!`);
    setMarkDoneOpen(false);
    setSelectedActivity(null);
  };

  const confirmDelete = () => {
    toast.success(`Activity deleted successfully!`);
    setDeleteOpen(false);
    setSelectedActivity(null);
  };

  const confirmEdit = () => {
    toast.success(`Activity updated successfully!`);
    setEditActivityOpen(false);
    setSelectedActivity(null);
  };

  const filteredActivities = mockActivities.filter(activity => {
    const matchesSearch = searchQuery === '' ||
      activity.lead_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.contact_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || activity.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || activity.status === statusFilter;
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
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Activity Log</h2>
        </div>
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
      </div>

      {/* Filter Bar */}
      <Card className="border-border shadow-sm rounded-lg sm:rounded-xl">
        <div className="p-2 border-b border-border">
          <FilterExportBar
            filters={[
              {
                key: 'type',
                label: 'Type',
                options: typeOptions,
                value: typeFilter,
                onChange: setTypeFilter
              },
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
              placeholder: 'Search activities...',
              value: searchQuery,
              onChange: setSearchQuery
            }}
          />
        </div>

        <CardContent className="p-0">
          {filteredActivities.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-muted-foreground">
              No activities found
            </div>
          ) : viewMode === 'table' ? (
            /* Table View */
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
                        <Badge variant={getStatusBadge(activity.status)} className="text-xs">
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
                            <DropdownMenuItem onClick={() => handleViewDetails(activity)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(activity)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            {activity.status === 'Pending' && (
                              <DropdownMenuItem onClick={() => handleMarkDone(activity)}>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Mark as Done
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(activity)} className="text-destructive">
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
            /* Card View */
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
                        <Badge variant={getStatusBadge(activity.status)} className="text-xs px-1.5 py-0">
                          {activity.status}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <MoreVertical className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(activity)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(activity)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            {activity.status === 'Pending' && (
                              <DropdownMenuItem onClick={() => handleMarkDone(activity)}>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Mark as Done
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(activity)} className="text-destructive">
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

      {/* View Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setViewDetailsOpen}>
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
                  <Badge variant={getStatusBadge(selectedActivity.status)} className="text-xs">{selectedActivity.status}</Badge>
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
            <Button onClick={confirmEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark as Done Dialog */}
      <Dialog open={isMarkDoneOpen} onOpenChange={setMarkDoneOpen}>
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
            <Button onClick={confirmMarkDone}>Mark as Completed</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Activity</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this activity for "{selectedActivity?.lead_name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
