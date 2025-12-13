'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { mockAssets } from '@/lib/assets-mock-data';
import { ArrowLeft, Search, Download, Columns, Filter, Edit, Trash2, ArrowRightLeft, Wrench, History } from 'lucide-react';
import AssetModals from '../AssetModals';

export default function AllAssetsPage() {
  const router = useRouter();
  const [modalState, setModalState] = useState({ open: false, type: null as any, data: null as any });
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [visibleColumns, setVisibleColumns] = useState({
    assetId: true, assetName: true, qty: true, category: true, cost: true, 
    procuredBy: true, serialNumber: true, issuedTo: true, issueDate: true, status: true
  });

  const allColumns = [
    { key: 'assetId', label: 'Asset ID' }, { key: 'assetName', label: 'Asset Name' }, { key: 'qty', label: 'Qty' }, 
    { key: 'category', label: 'Category' }, { key: 'cost', label: 'Cost' }, { key: 'procuredBy', label: 'Procured By' }, 
    { key: 'serialNumber', label: 'Serial Number' }, { key: 'issuedTo', label: 'Issued To' }, 
    { key: 'issueDate', label: 'Issue Date' }, { key: 'status', label: 'Status' }
  ];

  const handleSelectRow = (id: number) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [id]
    );
  };

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked) {
      setSelectedRows(mockAssets.map(asset => asset.id));
    } else {
      setSelectedRows([]);
    }
  };

  const selectedAsset = mockAssets.find(a => a.id === selectedRows[0]);

  const handleEdit = () => {
    if (selectedAsset) {
      const purchaseId = selectedAsset.assetId.split('-')[0];
      router.push(`/assets/edit/${purchaseId}`);
    }
  };

  const handleIssue = () => {
    if (selectedAsset && selectedAsset.status === 'In Stock') {
        setModalState({ open: true, type: 'issue', data: selectedAsset });
    } else {
        alert('Only "In Stock" assets can be issued.');
    }
  };

  const handleReturn = () => {
    if (selectedAsset && selectedAsset.status === 'Issued') {
        setModalState({ open: true, type: 'return', data: selectedAsset });
    } else {
        alert('Only "Issued" assets can be returned.');
    }
  };

  const handleRepair = () => {
    if (selectedAsset) {
        setModalState({ open: true, type: 'repair', data: selectedAsset });
    }
  };

  const handleHistory = () => {
    if (selectedAsset) {
        setModalState({ open: true, type: 'history', data: selectedAsset });
    }
  };

  return (
    <DashboardLayout>
      <div className="py-3 lg:py-4 space-y-3 lg:space-y-4 bg-background min-h-screen">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">All Company Assets</h1>
          </div>
        </div>
        <Card className="p-0">
          <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Button size="sm" variant="outline" onClick={handleIssue} disabled={!selectedAsset || selectedAsset.status !== 'In Stock'}>
                <ArrowRightLeft size={14} className="mr-2" /> Issue
              </Button>
              <Button size="sm" variant="outline" onClick={handleReturn} disabled={!selectedAsset || selectedAsset.status !== 'Issued'}>
                Return
              </Button>
              <Button size="sm" variant="outline" onClick={handleRepair} disabled={!selectedAsset}>
                <Wrench size={14} className="mr-2" /> Send to Repair
              </Button>
              <Button size="sm" variant="outline" onClick={handleHistory} disabled={!selectedAsset}>
                <History size={14} className="mr-2" /> History
              </Button>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-auto"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search all assets..." className="pl-9" /></div>
              <Button size="sm" variant="outline" onClick={handleEdit} disabled={!selectedAsset}>
                <Edit size={14} className="mr-2" /> Edit
              </Button>
              <Button size="sm" variant="destructive" disabled={selectedRows.length === 0}>
                <Trash2 size={14} className="mr-2" /> Delete
              </Button>
              <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" size="icon"><Download size={16} /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem>Export to Excel</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
              <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" size="icon"><Columns size={16} /></Button></DropdownMenuTrigger><DropdownMenuContent align="end">{allColumns.map(col => (<DropdownMenuCheckboxItem key={col.key} checked={(visibleColumns as any)[col.key]} onCheckedChange={(checked) => setVisibleColumns(prev => ({...prev, [col.key]: checked}))}>{col.label}</DropdownMenuCheckboxItem>))}</DropdownMenuContent></DropdownMenu>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"><Checkbox onCheckedChange={handleSelectAll} /></TableHead>
                  {allColumns.filter(c => (visibleColumns as any)[c.key]).map(c => (<TableHead key={c.key}><div className="flex items-center gap-1">{c.label} <Filter size={12} /></div></TableHead>))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAssets.map((asset) => (
                  <TableRow key={asset.id} data-state={selectedRows.includes(asset.id) && "selected"}>
                    <TableCell><Checkbox checked={selectedRows.includes(asset.id)} onCheckedChange={() => handleSelectRow(asset.id)} /></TableCell>
                    { (visibleColumns as any).assetId && <TableCell>{asset.assetId}</TableCell> }
                    { (visibleColumns as any).assetName && <TableCell>{asset.assetName}</TableCell> }
                    { (visibleColumns as any).qty && <TableCell>{asset.qty}</TableCell> }
                    { (visibleColumns as any).category && <TableCell>{asset.category}</TableCell> }
                    { (visibleColumns as any).cost && <TableCell>₹{asset.cost}</TableCell> }
                    { (visibleColumns as any).procuredBy && <TableCell>{asset.procuredBy}</TableCell> }
                    { (visibleColumns as any).serialNumber && <TableCell>{asset.serialNumber || '-'}</TableCell> }
                    { (visibleColumns as any).issuedTo && <TableCell>{asset.issuedTo || '-'}</TableCell> }
                    { (visibleColumns as any).issueDate && <TableCell>{asset.issueDate || '-'}</TableCell> }
                    { (visibleColumns as any).status && <TableCell><Badge>{asset.status}</Badge></TableCell> }
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
      <AssetModals modalState={modalState} setModalState={setModalState} />
    </DashboardLayout>
  );
}