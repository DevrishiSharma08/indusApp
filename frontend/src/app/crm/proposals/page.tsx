'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FilterExportBar from '@/components/FilterExportBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, MoreVertical, Eye, Edit, Trash2, Upload, FileText, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { mockTeamMembers } from '@/lib/assets-mock-data';

// Mock data for Proposals
const mockProposals = [
  {
    id: '1',
    lead_name: 'ABC Corporation',
    contact_name: 'John Doe',
    phone: '+91 9876543210',
    email: 'john@abc.com',
    assigned_to: 'Sarah Wilson',
    proposal_date: '2024-12-05',
    status: 'Sent',
    follow_up_date: '2024-12-10'
  },
  {
    id: '2',
    lead_name: 'XYZ Ltd',
    contact_name: 'Jane Smith',
    phone: '+91 9876543211',
    email: 'jane@xyz.com',
    assigned_to: 'Mike Johnson',
    proposal_date: '2024-12-03',
    status: 'Under Review',
    follow_up_date: '2024-12-08'
  },
  {
    id: '3',
    lead_name: 'Tech Solutions Inc',
    contact_name: 'Bob Williams',
    phone: '+91 9876543212',
    email: 'bob@techsol.com',
    assigned_to: 'Sarah Wilson',
    proposal_date: '2024-11-28',
    status: 'Accepted',
    follow_up_date: null
  },
];

const statusOptions = [
  { label: 'All Status', value: 'all' },
  { label: 'Sent', value: 'Sent' },
  { label: 'Under Review', value: 'Under Review' },
  { label: 'Accepted', value: 'Accepted' },
  { label: 'Rejected', value: 'Rejected' }
];

const getStatusBadge = (status: string) => {
  const variants: any = {
    'Sent': 'default',
    'Under Review': 'secondary',
    'Accepted': 'outline',
    'Rejected': 'destructive'
  };
  return variants[status] || 'secondary';
};

export default function ProposalsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('proposals');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Upload Quotation Form
  const [uploadForm, setUploadForm] = useState({
    lead_id: '',
    details: '',
    file: null as File | null
  });

  const handleExport = (format: 'excel' | 'csv' | 'pdf') => {
    toast.success(`Exporting to ${format.toUpperCase()}`);
  };

  const handleDelete = (proposal: any) => {
    toast.success(`Proposal for "${proposal.lead_name}" deleted`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadForm({ ...uploadForm, file: e.target.files[0] });
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.lead_id || !uploadForm.details || !uploadForm.file) {
      toast.error('Please fill all fields and select a file');
      return;
    }
    toast.success('Quotation uploaded successfully!');
    setUploadForm({ lead_id: '', details: '', file: null });
  };

  const filteredProposals = mockProposals.filter(proposal => {
    const matchesSearch = searchQuery === '' ||
      proposal.lead_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.contact_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter;
    return matchesSearch && matchesStatus;
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
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Proposals & Quotations</h2>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-2 lg:space-y-3">
        <TabsList className="w-full grid grid-cols-2 h-10">
          <TabsTrigger value="proposals" className="text-xs sm:text-sm">Proposals Sent</TabsTrigger>
          <TabsTrigger value="upload" className="text-xs sm:text-sm">Upload Quotation</TabsTrigger>
        </TabsList>

        {/* Proposals Tab */}
        <TabsContent value="proposals">
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
                  placeholder: 'Search proposals...',
                  value: searchQuery,
                  onChange: setSearchQuery
                }}
              />
            </div>

            <CardContent className="p-0">
              {filteredProposals.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-muted-foreground">
                  No proposals found
                </div>
              ) : viewMode === 'table' ? (
                /* Table View */
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Lead Name</TableHead>
                        <TableHead>Contact Person</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead>Proposal Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProposals.map((proposal) => (
                        <TableRow key={proposal.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="font-medium">{proposal.lead_name}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-sm">{proposal.contact_name}</div>
                              <div className="text-xs text-muted-foreground">{proposal.email}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{proposal.assigned_to}</TableCell>
                          <TableCell className="text-sm">{proposal.proposal_date}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadge(proposal.status)} className="text-xs">
                              {proposal.status}
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
                                <DropdownMenuItem onClick={() => router.push(`/crm/proposals/${proposal.id}`)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toast.info(`Viewing quotations for ${proposal.lead_name}`)}>
                                  <FileText className="w-4 h-4 mr-2" />
                                  View Quotations
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push(`/crm/proposals/${proposal.id}/edit`)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Proposal
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleDelete(proposal)} className="text-destructive">
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
                  {filteredProposals.map((proposal) => (
                    <Card key={proposal.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Badge variant={getStatusBadge(proposal.status)} className="text-xs px-1.5 py-0">
                                {proposal.status}
                              </Badge>
                            </div>
                            <h3 className="text-sm font-semibold text-foreground line-clamp-1">{proposal.lead_name}</h3>
                            <p className="text-xs text-muted-foreground">{proposal.contact_name}</p>
                          </div>
                        </div>

                        <div className="space-y-1.5 mt-3">
                          <div className="text-xs">
                            <span className="text-muted-foreground">Email:</span>
                            <span className="ml-1 font-medium truncate block">{proposal.email}</span>
                          </div>
                          <div className="text-xs">
                            <span className="text-muted-foreground">Assigned to:</span>
                            <span className="ml-1 font-medium">{proposal.assigned_to}</span>
                          </div>
                          <div className="pt-1 border-t text-xs">
                            <span className="text-muted-foreground">Proposal Date:</span>
                            <span className="ml-1 font-medium">{proposal.proposal_date}</span>
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

        {/* Upload Quotation Tab */}
        <TabsContent value="upload">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                <form onSubmit={handleUploadSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="lead">Select Lead *</Label>
                    <Select value={uploadForm.lead_id} onValueChange={(val) => setUploadForm({ ...uploadForm, lead_id: val })}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select or search for a lead..." />
                      </SelectTrigger>
                      <SelectContent>
                        {mockProposals.map((proposal) => (
                          <SelectItem key={proposal.id} value={proposal.id}>
                            {proposal.lead_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="details">Activity Details / Remarks *</Label>
                    <Textarea
                      id="details"
                      value={uploadForm.details}
                      onChange={(e) => setUploadForm({ ...uploadForm, details: e.target.value })}
                      placeholder="e.g., Sent initial quotation V1 as discussed on call."
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="file">Quotation File *</Label>
                    <Input
                      id="file"
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.xlsx,.xls"
                      className="h-9"
                    />
                    {uploadForm.file && (
                      <p className="text-xs text-muted-foreground">Selected: {uploadForm.file.name}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Quotation
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
