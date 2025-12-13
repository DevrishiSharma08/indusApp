'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, Users, Phone, Mail, MapPin, Calendar, FileText } from 'lucide-react';
import { toast } from 'sonner';

// Mock lead data
const mockLead = {
  id: '1',
  company_name: 'ABC Corporation',
  contact_name: 'John Doe',
  designation: 'CEO',
  phone: '+91 9876543210',
  email: 'john@abc.com',
  linkedin: 'linkedin.com/in/johndoe',
  address: '123 Business Park, Mumbai, Maharashtra 400001',
  status: 'Meeting Scheduled',
  lead_type: 'Hot Lead',
  assigned_to: 'Sarah Wilson',
  created_date: '2024-12-01',
  last_activity: 'Meeting scheduled for tomorrow',
  source: 'Website',
  industry: 'Technology',
  company_size: '50-100 employees',
  notes: 'Interested in our enterprise plan. Follow up needed after demo.'
};

const mockActivities = [
  { id: 1, type: 'Meeting', date: '2024-12-05', time: '10:00 AM', description: 'Initial discovery call', createdBy: 'Sarah Wilson' },
  { id: 2, type: 'Email', date: '2024-12-03', time: '02:30 PM', description: 'Sent product brochure', createdBy: 'Sarah Wilson' },
  { id: 3, type: 'Call', date: '2024-12-01', time: '11:00 AM', description: 'First contact - qualified lead', createdBy: 'Sarah Wilson' }
];

const mockNotes = [
  { id: 1, date: '2024-12-04', content: 'Client is interested in enterprise features. Schedule demo for next week.', author: 'Sarah Wilson' },
  { id: 2, date: '2024-12-02', content: 'Budget approved. Moving forward with proposal.', author: 'Sarah Wilson' }
];

export default function LeadDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusBadge = (status: string) => {
    const variants: any = {
      'New': 'default',
      'Meeting Scheduled': 'secondary',
      'Demo Done': 'outline',
      'Won/Deal Done': 'default',
      'Lost': 'destructive'
    };
    return variants[status] || 'secondary';
  };

  const getLeadTypeBadge = (type: string) => {
    const variants: any = {
      'Hot Lead': 'destructive',
      'Warm Lead': 'default',
      'Cold Lead': 'secondary'
    };
    return variants[type] || 'secondary';
  };

  return (
    <div className="space-y-2 lg:space-y-3 py-3 lg:py-4">
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
          <div className="min-w-0 flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground truncate">{mockLead.company_name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={getStatusBadge(mockLead.status)} className="text-xs">
                {mockLead.status}
              </Badge>
              <Badge variant={getLeadTypeBadge(mockLead.lead_type)} className="text-xs">
                {mockLead.lead_type}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-2 lg:space-y-3">
        <TabsList className="w-full grid grid-cols-3 h-10">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="activity" className="text-xs sm:text-sm">Activity</TabsTrigger>
          <TabsTrigger value="notes" className="text-xs sm:text-sm">Notes</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-3">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Contact Information */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pb-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Contact Name</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{mockLead.contact_name}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Designation</label>
                    <p className="text-sm font-medium mt-1">{mockLead.designation}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Phone</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{mockLead.phone}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Email</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium truncate">{mockLead.email}</span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-medium text-muted-foreground">LinkedIn</label>
                    <p className="text-sm font-medium mt-1 text-primary truncate">{mockLead.linkedin}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-medium text-muted-foreground">Address</label>
                    <div className="flex items-start gap-2 mt-1">
                      <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">{mockLead.address}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lead Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Lead Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pb-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Assigned To</label>
                    <p className="text-sm font-medium mt-1">{mockLead.assigned_to}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Source</label>
                    <p className="text-sm font-medium mt-1">{mockLead.source}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Industry</label>
                    <p className="text-sm font-medium mt-1">{mockLead.industry}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Company Size</label>
                    <p className="text-sm font-medium mt-1">{mockLead.company_size}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-medium text-muted-foreground">Created Date</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{mockLead.created_date}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes Section */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Notes</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-sm text-muted-foreground">{mockLead.notes}</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Activity Log</CardTitle>
                <Button size="sm">Add Activity</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-2.5 rounded-lg border">
                    <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold">{activity.type}</span>
                        <span className="text-xs text-muted-foreground">{activity.date} {activity.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">By {activity.createdBy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Notes & Comments</CardTitle>
                <Button size="sm">Add Note</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockNotes.map((note) => (
                  <div key={note.id} className="p-2.5 rounded-lg border bg-muted/30">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-semibold">{note.author}</span>
                      <span className="text-xs text-muted-foreground">{note.date}</span>
                    </div>
                    <p className="text-sm">{note.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
