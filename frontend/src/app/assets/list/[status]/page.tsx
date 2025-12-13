'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { mockAssets } from '@/lib/assets-mock-data';
import { ArrowLeft, Search, Download, Columns, Filter, List, LayoutGrid } from 'lucide-react';

// Custom Hook to check screen size
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) { setMatches(media.matches); }
    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);
  return matches;
};

export default function AssetListPage() {
  const router = useRouter();
  const params = useParams();
  const status = params.status as string;
  
  const [currentView, setCurrentView] = useState<'table' | 'card'>('table');
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (!isDesktop) {
      setCurrentView('card');
    } else {
      setCurrentView('table');
    }
  }, [isDesktop]);

  const pageTitle = status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  const filteredAssets = status === 'all' ? mockAssets : mockAssets.filter(a => a.status.toLowerCase().replace(' ', '-') === status);

  const allColumns = [
    { key: 'assetId', label: 'Asset ID' }, { key: 'assetName', label: 'Asset Name' }, { key: 'qty', label: 'Qty' }, 
    { key: 'category', label: 'Category' }, { key: 'cost', label: 'Cost' }, { key: 'procuredBy', label: 'Procured By' }, 
    { key: 'serialNumber', label: 'Serial Number' }, { key: 'issuedTo', label: 'Issued To' }, 
    { key: 'issueDate', label: 'Issue Date' }, { key: 'status', label: 'Status' }
  ];
  const [visibleColumns, setVisibleColumns] = useState(
    allColumns.reduce((acc, col) => ({ ...acc, [col.key]: true }), {})
  );

  return (
    <DashboardLayout>
      <div className="py-3 lg:py-4 space-y-3 lg:space-y-4 bg-background min-h-screen">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{pageTitle} Assets</h1>
            <p className="text-muted-foreground">A list of all assets with the status '{pageTitle}'.</p>
          </div>
        </div>
        <Card className="p-0">
          <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="relative flex-1 w-full sm:max-w-xs">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder={`Search in ${pageTitle}...`} className="pl-9" />
            </div>
            <div className="flex items-center gap-2">
              {/* ===== VIEW TOGGLE BUTTON YAHAN HAI ===== */}
              <div className="inline-flex rounded-md border bg-background p-0.5">
                  <Button variant={currentView === 'table' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setCurrentView('table')}><List className="h-4 w-4" /></Button>
                  <Button variant={currentView === 'card' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setCurrentView('card')}><LayoutGrid className="h-4 w-4" /></Button>
              </div>
              <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" size="icon"><Download size={16} /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem>Export to Excel</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
              <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" size="icon"><Columns size={16} /></Button></DropdownMenuTrigger><DropdownMenuContent align="end">{allColumns.map(col => (<DropdownMenuCheckboxItem key={col.key} checked={(visibleColumns as any)[col.key]} onCheckedChange={(checked) => setVisibleColumns(prev => ({...prev, [col.key]: checked}))}>{col.label}</DropdownMenuCheckboxItem>))}</DropdownMenuContent></DropdownMenu>
            </div>
          </div>
          
          {currentView === 'table' ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>{allColumns.filter(c => (visibleColumns as any)[c.key]).map(c => <TableHead key={c.key}><div className="flex items-center gap-1">{c.label} <Filter size={12} /></div></TableHead>)}</TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssets.map((asset) => (
                    <TableRow key={asset.id}>
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
          ) : (
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAssets.map(asset => (
                <Card key={asset.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div><p className="font-bold">{asset.assetName}</p><p className="text-sm text-muted-foreground">{asset.assetId}</p></div>
                    <Badge>{asset.status}</Badge>
                  </div>
                  <div className="mt-4 text-sm space-y-1 border-t pt-3">
                    <p><strong>Category:</strong> {asset.category}</p>
                    <p><strong>Issued To:</strong> {asset.issuedTo || 'N/A'}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}