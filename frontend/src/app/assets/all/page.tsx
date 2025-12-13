'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/PageHeader';
import FilterExportBar from '@/components/FilterExportBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { mockAssets, Asset } from '@/lib/assets-mock-data';
import {
  Edit,
  Trash2,
  ArrowRightLeft,
  Wrench,
  History,
  MoreVertical,
  RotateCcw,
  Archive
} from 'lucide-react';
import AssetModals from '../AssetModals';
import { toast } from 'sonner';

export default function AllAssetsPage() {
  const router = useRouter();
  const [modalState, setModalState] = useState({ open: false, type: null as any, data: null as any });
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Get unique categories from assets
  const categories = Array.from(new Set(mockAssets.map(a => a.category)));

  // Filter assets
  const filteredAssets = mockAssets.filter(asset => {
    const matchesSearch =
      asset.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || asset.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Filter configuration
  const filterConfig = [
    {
      key: 'category',
      label: 'Category',
      value: categoryFilter,
      onChange: setCategoryFilter,
      options: [
        { value: 'all', label: 'All Categories' },
        ...categories.map(cat => ({ value: cat, label: cat }))
      ],
    },
    {
      key: 'status',
      label: 'Status',
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'In Stock', label: 'In Stock' },
        { value: 'Issued', label: 'Issued' },
        { value: 'In Repair', label: 'In Repair' },
        { value: 'Scrapped', label: 'Scrapped' },
      ],
    },
  ];

  const handleExport = (format: 'excel' | 'csv' | 'pdf') => {
    console.log('Exporting to', format);
    toast.success(`Exporting to ${format.toUpperCase()}`);
  };

  // Action handlers
  const handleEdit = (asset: Asset) => {
    router.push(`/assets/edit/${asset.assetId.split('-')[0]}`);
  };

  const handleIssue = (asset: Asset) => {
    if (asset.status === 'In Stock') {
      setModalState({ open: true, type: 'issue', data: asset });
    } else {
      toast.error('Only "In Stock" assets can be issued.');
    }
  };

  const handleReturn = (asset: Asset) => {
    if (asset.status === 'Issued') {
      setModalState({ open: true, type: 'return', data: asset });
    } else {
      toast.error('Only "Issued" assets can be returned.');
    }
  };

  const handleRepair = (asset: Asset) => {
    setModalState({ open: true, type: 'repair', data: asset });
  };

  const handleHistory = (asset: Asset) => {
    setModalState({ open: true, type: 'history', data: asset });
  };

  const handleScrap = (asset: Asset) => {
    setModalState({ open: true, type: 'scrap', data: asset });
  };

  const handleDelete = (asset: Asset) => {
    toast.error('Delete functionality not implemented');
  };

  const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'In Stock': return 'default';
      case 'Issued': return 'secondary';
      case 'In Repair': return 'outline';
      case 'Scrapped': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <DashboardLayout>
      <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">
        <PageHeader title="All Company Assets" />

        {/* Assets Table with Integrated Controls */}
        <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
          {/* Filter Bar */}
          <div className="p-3 sm:p-4 border-b border-border">
            <FilterExportBar
              filters={filterConfig}
              onExport={handleExport}
              showViewToggle={true}
              viewToggleProps={{
                currentView: viewMode,
                onViewChange: setViewMode
              }}
              showSearch={true}
              searchProps={{
                placeholder: "Search assets by ID, name, or category...",
                value: searchQuery,
                onChange: setSearchQuery
              }}
            />
          </div>

          {/* Table View */}
          {viewMode === 'table' && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset ID</TableHead>
                    <TableHead>Asset Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Issued To</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No assets found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAssets.map((asset) => (
                      <TableRow key={asset.id}>
                        <TableCell className="font-medium">{asset.assetId}</TableCell>
                        <TableCell>{asset.assetName}</TableCell>
                        <TableCell>{asset.category}</TableCell>
                        <TableCell>{asset.qty}</TableCell>
                        <TableCell>₹{asset.cost.toLocaleString()}</TableCell>
                        <TableCell className="text-muted-foreground">{asset.serialNumber || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(asset.status)}>
                            {asset.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{asset.issuedTo || '-'}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(asset)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleHistory(asset)}>
                                <History className="w-4 h-4 mr-2" />
                                History
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {asset.status === 'In Stock' && (
                                <DropdownMenuItem onClick={() => handleIssue(asset)}>
                                  <ArrowRightLeft className="w-4 h-4 mr-2" />
                                  Issue
                                </DropdownMenuItem>
                              )}
                              {asset.status === 'Issued' && (
                                <DropdownMenuItem onClick={() => handleReturn(asset)}>
                                  <RotateCcw className="w-4 h-4 mr-2" />
                                  Return
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleRepair(asset)}>
                                <Wrench className="w-4 h-4 mr-2" />
                                Send to Repair
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleScrap(asset)}>
                                <Archive className="w-4 h-4 mr-2" />
                                Scrap
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(asset)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Card View */}
          {viewMode === 'card' && (
            <div className="p-3 sm:p-4 space-y-2">
              {filteredAssets.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-muted-foreground">
                  No assets found
                </div>
              ) : (
                filteredAssets.map((asset) => (
                  <Card key={asset.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0 space-y-2">
                          {/* Header with ID, Badges, and Actions Menu */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-sm font-semibold text-foreground">{asset.assetId}</h3>
                              <Badge variant={getStatusVariant(asset.status)} className="text-xs">
                                {asset.status}
                              </Badge>
                            </div>

                            {/* 3-dot menu in top corner */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="Actions">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(asset)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleHistory(asset)}>
                                  <History className="w-4 h-4 mr-2" />
                                  History
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {asset.status === 'In Stock' && (
                                  <DropdownMenuItem onClick={() => handleIssue(asset)}>
                                    <ArrowRightLeft className="w-4 h-4 mr-2" />
                                    Issue
                                  </DropdownMenuItem>
                                )}
                                {asset.status === 'Issued' && (
                                  <DropdownMenuItem onClick={() => handleReturn(asset)}>
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    Return
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => handleRepair(asset)}>
                                  <Wrench className="w-4 h-4 mr-2" />
                                  Send to Repair
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleScrap(asset)}>
                                  <Archive className="w-4 h-4 mr-2" />
                                  Scrap
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDelete(asset)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* Asset Name */}
                          <p className="text-sm font-medium text-foreground line-clamp-1">{asset.assetName}</p>

                          {/* Compact Info Grid - 2 columns */}
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                            <div className="flex items-center gap-1.5">
                              <span className="text-muted-foreground">Category:</span>
                              <span className="font-medium truncate">{asset.category}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-muted-foreground">Qty:</span>
                              <span className="font-medium">{asset.qty}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-muted-foreground">Cost:</span>
                              <span className="font-medium">₹{asset.cost.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-muted-foreground">Serial:</span>
                              <span className="font-medium truncate">{asset.serialNumber || '-'}</span>
                            </div>
                            {asset.issuedTo && (
                              <div className="col-span-2 flex items-center gap-1.5">
                                <span className="text-muted-foreground">Issued To:</span>
                                <span className="font-medium">{asset.issuedTo}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Asset Modals */}
      <AssetModals modalState={modalState} setModalState={setModalState} />
    </DashboardLayout>
  );
}
