'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FilterExportBar from '@/components/FilterExportBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ArrowLeft, MoreVertical, Eye, Phone, Mail, MapPin, Building2 } from 'lucide-react';
import { toast } from 'sonner';

// Mock data
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

const statusOptions = [
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

const getStatusBadge = (status: string) => {
  return status === 'Active' ? 'default' : 'secondary';
};

export default function ClientsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');

  const handleExport = (format: 'excel' | 'csv' | 'pdf') => {
    toast.success(`Exporting to ${format.toUpperCase()}`);
  };

  const handleDelete = (client: any) => {
    toast.success(`Client "${client.company_name}" deleted`);
  };

  const filteredClients = mockClients.filter(client => {
    const matchesSearch = searchQuery === '' ||
      client.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contact_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
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
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Clients</h2>
        </div>
      </div>

      {/* Filter Bar */}
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
              currentView: viewMode,
              onViewChange: setViewMode
            }}
            showSearch={true}
            searchProps={{
              placeholder: 'Search clients...',
              value: searchQuery,
              onChange: setSearchQuery
            }}
          />
        </div>

        <CardContent className="p-0">
          {filteredClients.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-muted-foreground">
              No clients found
            </div>
          ) : viewMode === 'table' ? (
            /* Table View */
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
                        <Badge variant={getStatusBadge(client.status)} className="text-xs">
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
            /* Card View */
            <div className="p-2 sm:p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {filteredClients.map((client) => (
                <Card key={client.id} className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/crm/clients/${client.id}`)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Badge variant={getStatusBadge(client.status)} className="text-xs px-1.5 py-0">
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
    </div>
  );
}
