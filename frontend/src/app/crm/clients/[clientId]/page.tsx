'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Phone, Mail, MapPin, Building2, TrendingUp, FileText } from 'lucide-react';
import { toast } from 'sonner';

// Mock client data
const mockClient = {
  id: '1',
  company_name: 'ABC Corporation',
  contact_name: 'John Doe',
  designation: 'CEO',
  phone: '+91 9876543210',
  email: 'john@abc.com',
  address: '123 Business Park, Mumbai, Maharashtra 400001',
  industry: 'Technology',
  status: 'Active',
  company_size: '50-100 employees',
  website: 'www.abccorp.com',
  gst: 'GSTIN123456789',
  total_projects: 5,
  total_revenue: 5000000,
  joined_date: '2024-01-15'
};

const mockProjects = [
  { id: 1, name: 'ERP Implementation', status: 'Completed', value: 2000000, startDate: '2024-02-01', endDate: '2024-06-30' },
  { id: 2, name: 'Website Redesign', status: 'In Progress', value: 500000, startDate: '2024-11-01', endDate: '2025-01-31' },
  { id: 3, name: 'Mobile App Development', status: 'Completed', value: 1500000, startDate: '2024-07-01', endDate: '2024-10-31' }
];

const mockInteractions = [
  { id: 1, type: 'Meeting', date: '2024-12-05', description: 'Quarterly review meeting', createdBy: 'Sarah Wilson' },
  { id: 2, type: 'Email', date: '2024-11-20', description: 'Sent project proposal', createdBy: 'Mike Johnson' },
  { id: 3, type: 'Call', date: '2024-11-10', description: 'Discussed new requirements', createdBy: 'Sarah Wilson' }
];

export default function ClientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusBadge = (status: string) => {
    return status === 'Active' ? 'default' : 'secondary';
  };

  const getProjectStatusBadge = (status: string) => {
    const variants: any = {
      'Completed': 'default',
      'In Progress': 'secondary',
      'On Hold': 'outline'
    };
    return variants[status] || 'secondary';
  };

  return (
    <div className="space-y-2 lg:space-y-3 py-3 lg:py-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground truncate">{mockClient.company_name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={getStatusBadge(mockClient.status)} className="text-xs">
              {mockClient.status}
            </Badge>
            <span className="text-xs text-muted-foreground">{mockClient.industry}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards - Compact in one row */}
      <div className="grid grid-cols-3 gap-2">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Projects</p>
                <p className="text-xl font-bold mt-0.5">{mockClient.total_projects}</p>
              </div>
              <FileText className="w-6 h-6 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
                <p className="text-xl font-bold mt-0.5">₹{(mockClient.total_revenue / 100000).toFixed(1)}L</p>
              </div>
              <TrendingUp className="w-6 h-6 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Client Since</p>
                <p className="text-xl font-bold mt-0.5">{new Date(mockClient.joined_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
              </div>
              <Building2 className="w-6 h-6 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-2 lg:space-y-3">
        <TabsList className="w-full grid grid-cols-2 h-10">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="projects" className="text-xs sm:text-sm">Projects</TabsTrigger>
        </TabsList>

        {/* Overview Tab - Compact with 2 fields per row */}
        <TabsContent value="overview" className="space-y-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pb-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Company Name</label>
                  <p className="text-sm font-medium mt-1">{mockClient.company_name}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Industry</label>
                  <p className="text-sm font-medium mt-1">{mockClient.industry}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Company Size</label>
                  <p className="text-sm font-medium mt-1">{mockClient.company_size}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Website</label>
                  <p className="text-sm font-medium mt-1 text-primary">{mockClient.website}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">GST Number</label>
                  <p className="text-sm font-medium mt-1">{mockClient.gst}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Contact Name</label>
                  <p className="text-sm font-medium mt-1">{mockClient.contact_name}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Designation</label>
                  <p className="text-sm font-medium mt-1">{mockClient.designation}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Phone</label>
                  <p className="text-sm font-medium mt-1">{mockClient.phone}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Email</label>
                  <p className="text-sm font-medium mt-1">{mockClient.email}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-muted-foreground">Address</label>
                  <p className="text-sm font-medium mt-1">{mockClient.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Tab - No Add Button */}
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockProjects.map((project) => (
                  <div key={project.id} className="flex items-start justify-between gap-3 p-3 rounded-lg border">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold">{project.name}</h4>
                        <Badge variant={getProjectStatusBadge(project.status)} className="text-xs">
                          {project.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {project.startDate} - {project.endDate}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">₹{(project.value / 100000).toFixed(1)}L</p>
                    </div>
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
