'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FilterExportBar from '@/components/FilterExportBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, MoreVertical, Eye, Edit, Trash2, UserCheck, Users as UsersIcon, Phone, Mail, ArrowLeft, MapPin, ArrowRightLeft, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { mockTeamMembers } from '@/lib/assets-mock-data';

// Mock data for Leads
const mockLeads = [
  {
    id: '1',
    company_name: 'ABC Corporation',
    contact_name: 'John Doe',
    phone: '+91 9876543210',
    email: 'john@abc.com',
    status: 'New',
    lead_type: 'Hot Lead',
    assigned_to: 'Sarah Wilson',
    created_date: '2024-12-01',
    last_activity: 'Initial contact made'
  },
  {
    id: '2',
    company_name: 'XYZ Ltd',
    contact_name: 'Jane Smith',
    phone: '+91 9876543211',
    email: 'jane@xyz.com',
    status: 'Meeting Scheduled',
    lead_type: 'Warm Lead',
    assigned_to: 'Mike Johnson',
    created_date: '2024-12-02',
    last_activity: 'Meeting scheduled for tomorrow'
  },
  {
    id: '3',
    company_name: 'Tech Solutions Inc',
    contact_name: 'Bob Williams',
    phone: '+91 9876543212',
    email: 'bob@techsol.com',
    status: 'Demo Done',
    lead_type: 'Hot Lead',
    assigned_to: 'Sarah Wilson',
    created_date: '2024-12-03',
    last_activity: 'Product demo completed'
  },
];

// Mock data for Clients
const mockClients = [
  {
    id: '1',
    company_name: 'ABC Corporation',
    contact_name: 'John Doe',
    phone: '+91 9876543210',
    email: 'john@abc.com',
    address: 'Mumbai, Maharashtra',
    industry: 'Technology',
    status: 'Active',
    total_projects: 5,
    total_revenue: 5000000
  },
  {
    id: '2',
    company_name: 'XYZ Ltd',
    contact_name: 'Jane Smith',
    phone: '+91 9876543211',
    email: 'jane@xyz.com',
    address: 'Delhi, NCR',
    industry: 'Finance',
    status: 'Active',
    total_projects: 3,
    total_revenue: 3500000
  },
  {
    id: '3',
    company_name: 'Tech Solutions Inc',
    contact_name: 'Bob Williams',
    phone: '+91 9876543212',
    email: 'bob@techsol.com',
    address: 'Bangalore, Karnataka',
    industry: 'IT Services',
    status: 'Inactive',
    total_projects: 1,
    total_revenue: 1200000
  },
];

// Filter options for Leads
const leadStatusOptions = [
  { label: 'All Status', value: 'all' },
  { label: 'New', value: 'New' },
  { label: 'Meeting Scheduled', value: 'Meeting Scheduled' },
  { label: 'Demo Scheduled', value: 'Demo Scheduled' },
  { label: 'Demo Done', value: 'Demo Done' },
  { label: 'Proposal Sent', value: 'Proposal Sent' },
  { label: 'Won/Deal Done', value: 'Won/Deal Done' },
  { label: 'Lost', value: 'Lost' }
];

const leadTypeOptions = [
  { label: 'All Types', value: 'all' },
  { label: 'Hot Lead', value: 'Hot Lead' },
  { label: 'Warm Lead', value: 'Warm Lead' },
  { label: 'Cold Lead', value: 'Cold Lead' }
];

// Filter options for Clients
const clientStatusOptions = [
  { label: 'All Status', value: 'all' },
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' }
];

const industryOptions = [
  { label: 'All Industries', value: 'all' },
  { label: 'Technology', value: 'Technology' },
  { label: 'Finance', value: 'Finance' },
  { label: 'IT Services', value: 'IT Services' },
  { label: 'Healthcare', value: 'Healthcare' }
];

const getLeadStatusBadge = (status: string) => {
  const variants: any = {
    'New': 'default',
    'Meeting Scheduled': 'secondary',
    'Demo Scheduled': 'secondary',
    'Demo Done': 'outline',
    'Proposal Sent': 'outline',
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

const getClientStatusBadge = (status: string) => {
  return status === 'Active' ? 'default' : 'secondary';
};

export default function LeadsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'leads' | 'clients'>('leads');

  // Leads states
  const [leadsViewMode, setLeadsViewMode] = useState<'card' | 'table'>('table');
  const [leadsSearchQuery, setLeadsSearchQuery] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState('all');
  const [leadTypeFilter, setLeadTypeFilter] = useState('all');

  // Clients states
  const [clientsViewMode, setClientsViewMode] = useState<'card' | 'table'>('table');
  const [clientsSearchQuery, setClientsSearchQuery] = useState('');
  const [clientStatusFilter, setClientStatusFilter] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');

  // Dialog states for Leads
  const [reassignDialogOpen, setReassignDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState('');

  const handleExport = (format: 'excel' | 'csv' | 'pdf') => {
    toast.success(`Exporting to ${format.toUpperCase()}`);
  };

  // Leads handlers
  const handleEditLead = (lead: any) => {
    const params = new URLSearchParams({
      id: lead.id,
      company_name: lead.company_name,
      contact_name: lead.contact_name,
      phone: lead.phone,
      email: lead.email,
      status: lead.status,
      lead_type: lead.lead_type,
      assigned_to: lead.assigned_to,
      mode: 'edit'
    });
    router.push(`/crm/create-lead?${params.toString()}`);
  };

  const handleReassignClick = (lead: any) => {
    setSelectedLead(lead);
    setSelectedTeamMember(lead.assigned_to);
    setReassignDialogOpen(true);
  };

  const handleReassignConfirm = () => {
    if (selectedLead && selectedTeamMember) {
      toast.success(`Lead "${selectedLead.company_name}" reassigned to ${selectedTeamMember}`);
      setReassignDialogOpen(false);
      setSelectedLead(null);
      setSelectedTeamMember('');
    }
  };

  const handleDeleteLeadClick = (lead: any) => {
    setSelectedLead(lead);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedLead) {
      toast.success(`Lead "${selectedLead.company_name}" deleted successfully`);
      setDeleteDialogOpen(false);
      setSelectedLead(null);
    }
  };

  const handleConvertToClient = (lead: any) => {
    toast.success(`Lead "${lead.company_name}" converted to client successfully!`);
    // In real implementation, this would convert the lead to client
  };

  const handleSendProposal = (lead: any) => {
    // Navigate to proposals page with lead data
    router.push(`/crm/proposals?leadId=${lead.id}&companyName=${lead.company_name}`);
    toast.info('Opening proposal form...');
  };

  // Filtering
  const filteredLeads = mockLeads.filter(lead => {
    const matchesSearch = leadsSearchQuery === '' ||
      lead.company_name.toLowerCase().includes(leadsSearchQuery.toLowerCase()) ||
      lead.contact_name.toLowerCase().includes(leadsSearchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(leadsSearchQuery.toLowerCase());
    const matchesStatus = leadStatusFilter === 'all' || lead.status === leadStatusFilter;
    const matchesType = leadTypeFilter === 'all' || lead.lead_type === leadTypeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const filteredClients = mockClients.filter(client => {
    const matchesSearch = clientsSearchQuery === '' ||
      client.company_name.toLowerCase().includes(clientsSearchQuery.toLowerCase()) ||
      client.contact_name.toLowerCase().includes(clientsSearchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(clientsSearchQuery.toLowerCase());
    const matchesStatus = clientStatusFilter === 'all' || client.status === clientStatusFilter;
    const matchesIndustry = industryFilter === 'all' || client.industry === industryFilter;
    return matchesSearch && matchesStatus && matchesIndustry;
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
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            {activeTab === 'leads' ? 'Leads' : 'Clients'}
          </h2>
        </div>
        {activeTab === 'leads' && (
          <Button
            onClick={() => router.push('/crm/create-lead')}
            className="flex items-center justify-center sm:space-x-2 sm:px-4 sm:py-2 bg-primary text-primary-foreground rounded-full sm:rounded-lg hover:bg-primary/90 transition-colors font-medium w-9 h-9 sm:w-auto sm:h-auto flex-shrink-0"
          >
            <Plus className="w-5 h-5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline text-sm">Add Lead</span>
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'leads' | 'clients')}>
        <TabsList className="w-full grid grid-cols-2 h-10">
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
        </TabsList>

        {/* Leads Tab */}
        <TabsContent value="leads" className="mt-3">
          <Card className="border-border shadow-sm rounded-lg sm:rounded-xl">
            <div className="p-2 border-b border-border">
              <FilterExportBar
                filters={[
                  {
                    key: 'status',
                    label: 'Status',
                    options: leadStatusOptions,
                    value: leadStatusFilter,
                    onChange: setLeadStatusFilter
                  },
                  {
                    key: 'leadType',
                    label: 'Lead Type',
                    options: leadTypeOptions,
                    value: leadTypeFilter,
                    onChange: setLeadTypeFilter
                  }
                ]}
                onExport={handleExport}
                showViewToggle={true}
                viewToggleProps={{
                  currentView: leadsViewMode,
                  onViewChange: setLeadsViewMode
                }}
                showSearch={true}
                searchProps={{
                  placeholder: 'Search leads...',
                  value: leadsSearchQuery,
                  onChange: setLeadsSearchQuery
                }}
              />
            </div>

            <CardContent className="p-0">
              {filteredLeads.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-muted-foreground">
                  No leads found
                </div>
              ) : leadsViewMode === 'table' ? (
                /* Leads Table View */
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead>Last Activity</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLeads.map((lead) => (
                        <TableRow key={lead.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="font-medium">{lead.company_name}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{lead.contact_name}</div>
                              <div className="text-xs text-muted-foreground">{lead.email}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{lead.phone}</TableCell>
                          <TableCell>
                            <Badge variant={getLeadStatusBadge(lead.status)} className="text-xs">
                              {lead.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getLeadTypeBadge(lead.lead_type)} className="text-xs">
                              {lead.lead_type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{lead.assigned_to}</TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                            {lead.last_activity}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => router.push(`/crm/leads/${lead.id}`)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditLead(lead)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Lead
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleReassignClick(lead)}>
                                  <UserCheck className="w-4 h-4 mr-2" />
                                  Reassign
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleConvertToClient(lead)}>
                                  <ArrowRightLeft className="w-4 h-4 mr-2" />
                                  Convert to Client
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSendProposal(lead)}>
                                  <FileText className="w-4 h-4 mr-2" />
                                  Send Proposal
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleDeleteLeadClick(lead)} className="text-destructive">
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
                /* Leads Card View */
                <div className="p-2 sm:p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {filteredLeads.map((lead) => (
                    <Card key={lead.id} className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => router.push(`/crm/leads/${lead.id}`)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Badge variant={getLeadStatusBadge(lead.status)} className="text-xs px-1.5 py-0">
                                {lead.status}
                              </Badge>
                              <Badge variant={getLeadTypeBadge(lead.lead_type)} className="text-xs px-1.5 py-0">
                                {lead.lead_type}
                              </Badge>
                            </div>
                            <h3 className="text-sm font-semibold text-foreground line-clamp-1">{lead.company_name}</h3>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                                <MoreVertical className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); router.push(`/crm/leads/${lead.id}`); }}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditLead(lead); }}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Lead
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleReassignClick(lead); }}>
                                <UserCheck className="w-4 h-4 mr-2" />
                                Reassign
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleConvertToClient(lead); }}>
                                <ArrowRightLeft className="w-4 h-4 mr-2" />
                                Convert to Client
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleSendProposal(lead); }}>
                                <FileText className="w-4 h-4 mr-2" />
                                Send Proposal
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDeleteLeadClick(lead); }} className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-xs">
                            <UsersIcon className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            <span className="text-muted-foreground truncate">{lead.contact_name}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs">
                            <Phone className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            <span className="text-muted-foreground">{lead.phone}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs">
                            <Mail className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            <span className="text-muted-foreground truncate">{lead.email}</span>
                          </div>
                          <div className="pt-1 border-t mt-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Assigned to:</span>
                              <span className="font-medium">{lead.assigned_to}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clients Tab */}
        <TabsContent value="clients" className="mt-3">
          <Card className="border-border shadow-sm rounded-lg sm:rounded-xl">
            <div className="p-2 border-b border-border">
              <FilterExportBar
                filters={[
                  {
                    key: 'status',
                    label: 'Status',
                    options: clientStatusOptions,
                    value: clientStatusFilter,
                    onChange: setClientStatusFilter
                  },
                  {
                    key: 'industry',
                    label: 'Industry',
                    options: industryOptions,
                    value: industryFilter,
                    onChange: setIndustryFilter
                  }
                ]}
                onExport={handleExport}
                showViewToggle={true}
                viewToggleProps={{
                  currentView: clientsViewMode,
                  onViewChange: setClientsViewMode
                }}
                showSearch={true}
                searchProps={{
                  placeholder: 'Search clients...',
                  value: clientsSearchQuery,
                  onChange: setClientsSearchQuery
                }}
              />
            </div>

            <CardContent className="p-0">
              {filteredClients.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-muted-foreground">
                  No clients found
                </div>
              ) : clientsViewMode === 'table' ? (
                /* Clients Table View */
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Industry</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Projects</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClients.map((client) => (
                        <TableRow key={client.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="font-medium">{client.company_name}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{client.contact_name}</div>
                              <div className="text-xs text-muted-foreground">{client.email}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{client.industry}</TableCell>
                          <TableCell className="text-sm">{client.address}</TableCell>
                          <TableCell className="text-sm font-semibold">{client.total_projects}</TableCell>
                          <TableCell className="text-sm font-semibold">₹{(client.total_revenue / 100000).toFixed(1)}L</TableCell>
                          <TableCell>
                            <Badge variant={getClientStatusBadge(client.status)} className="text-xs">
                              {client.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => router.push(`/crm/clients/${client.id}`)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
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
                /* Clients Card View */
                <div className="p-2 sm:p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {filteredClients.map((client) => (
                    <Card key={client.id} className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => router.push(`/crm/clients/${client.id}`)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Badge variant={getClientStatusBadge(client.status)} className="text-xs px-1.5 py-0">
                                {client.status}
                              </Badge>
                            </div>
                            <h3 className="text-sm font-semibold text-foreground line-clamp-1">{client.company_name}</h3>
                            <p className="text-xs text-muted-foreground">{client.industry}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                                <MoreVertical className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); router.push(`/crm/clients/${client.id}`); }}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-xs">
                            <Phone className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            <span className="text-muted-foreground">{client.phone}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs">
                            <Mail className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            <span className="text-muted-foreground truncate">{client.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs">
                            <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            <span className="text-muted-foreground">{client.address}</span>
                          </div>
                          <div className="pt-1 border-t mt-2 grid grid-cols-2 gap-2">
                            <div>
                              <div className="text-xs text-muted-foreground">Projects</div>
                              <div className="text-sm font-bold">{client.total_projects}</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Revenue</div>
                              <div className="text-sm font-bold">₹{(client.total_revenue / 100000).toFixed(1)}L</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Reassign Dialog */}
      <Dialog open={reassignDialogOpen} onOpenChange={setReassignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reassign Lead</DialogTitle>
            <DialogDescription>
              Reassign "{selectedLead?.company_name}" to a different team member
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="team-member">Team Member</Label>
              <Select value={selectedTeamMember} onValueChange={setSelectedTeamMember}>
                <SelectTrigger id="team-member">
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  {mockTeamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.fullName}>
                      {member.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleReassignConfirm}>
              Reassign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Lead</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedLead?.company_name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
