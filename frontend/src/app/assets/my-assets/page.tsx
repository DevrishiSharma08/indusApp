'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from "@/components/ui/checkbox";
import { mockAssets, mockCategories } from '@/lib/assets-mock-data';
import { ArrowLeft, Plus, Wrench, Send, Search, List, LayoutGrid } from 'lucide-react';

// Custom Hook to check screen size
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);
  return matches;
};

// Mock data for the logged-in employee's assets
// In a real app, you would fetch this data based on the logged-in user's ID
const myAssignedAssets = [
    mockAssets.find(a => a.assetName === 'Logitech Mouse'),
    mockAssets.find(a => a.assetName === 'Logitech Keyboard'),
    mockAssets.find(a => a.assetId === 'IN000024-25-1'), // Example: HP ELITEBOOK
].filter(Boolean); // filter(Boolean) removes any undefined items if not found

// Main Page Component
export default function MyAssetsPage() {
  const router = useRouter();
  
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [currentView, setCurrentView] = useState<'table' | 'card'>('table');
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (!isDesktop) {
      setCurrentView('card');
    } else {
      setCurrentView('table');
    }
  }, [isDesktop]);

  const handleOpenReportModal = (asset: any) => {
    setSelectedAsset(asset);
    setIsReportModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="py-3 lg:py-4 space-y-3 lg:space-y-4 bg-background min-h-screen">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Assets</h1>
            <p className="text-muted-foreground">A list of all assets currently assigned to you.</p>
          </div>
          <Button onClick={() => setIsRequestModalOpen(true)} className="bg-green-600 hover:bg-green-700">
            <Plus size={16} className="mr-2" /> Request New Asset
          </Button>
        </div>
        
        <Card>
          <CardHeader className="flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <CardTitle>Assets Assigned to Me ({myAssignedAssets.length})</CardTitle>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search my assets..." className="pl-9" />
              </div>
              <div className="inline-flex rounded-md border bg-background p-0.5">
                <Button variant={currentView === 'table' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setCurrentView('table')}><List className="h-4 w-4" /></Button>
                <Button variant={currentView === 'card' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setCurrentView('card')}><LayoutGrid className="h-4 w-4" /></Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {currentView === 'table' ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset Name</TableHead><TableHead>Asset ID</TableHead><TableHead>Category</TableHead>
                      <TableHead>Serial Number</TableHead><TableHead>Issue Date</TableHead><TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myAssignedAssets.length > 0 ? myAssignedAssets.map(asset => (
                      <TableRow key={asset!.id}>
                        <TableCell>{asset!.assetName}</TableCell><TableCell>{asset!.assetId}</TableCell><TableCell>{asset!.category}</TableCell>
                        <TableCell>{asset!.serialNumber || '-'}</TableCell><TableCell>{asset!.issueDate}</TableCell>
                        <TableCell><Button variant="outline" size="sm" onClick={() => handleOpenReportModal(asset)}><Wrench size={14} className="mr-2" /> Report Issue</Button></TableCell>
                      </TableRow>
                    )) : (<TableRow><TableCell colSpan={6} className="text-center h-24">No assets assigned to you.</TableCell></TableRow>)}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="space-y-3">
                {myAssignedAssets.length > 0 ? myAssignedAssets.map(asset => (
                  <Card key={asset!.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div><p className="font-bold">{asset!.assetName}</p><p className="text-sm text-muted-foreground">{asset!.assetId}</p></div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-2" onClick={() => handleOpenReportModal(asset)}><Wrench size={16} /></Button>
                    </div>
                    <div className="mt-3 text-sm border-t pt-2 space-y-1">
                      <p><strong>Category:</strong> {asset!.category}</p>
                      <p><strong>Serial:</strong> {asset!.serialNumber || 'N/A'}</p>
                      <p><strong>Issued On:</strong> {asset!.issueDate}</p>
                    </div>
                  </Card>
                )) : (<div className="text-center text-muted-foreground py-12">No assets assigned to you.</div>)}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Request New Asset Modal */}
      <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader><DialogTitle>Request a New Asset</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="req-category">Asset Category *</Label>
              <Select>
                <SelectTrigger id="req-category"><SelectValue placeholder="Select a category..." /></SelectTrigger>
                <SelectContent>{mockCategories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="req-reason">Reason / Justification *</Label>
              <Textarea id="req-reason" placeholder="Please provide a reason for your request..." />
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="email-notification" defaultChecked />
              <Label htmlFor="email-notification" className="text-sm font-normal">
                Send email notification to admin
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRequestModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsRequestModalOpen(false)} className="bg-green-600 hover:bg-green-700">
              <Send size={16} className="mr-2" /> Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report an Issue Modal */}
      <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader><DialogTitle>Report an Issue</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Asset</p>
              <p className="font-semibold">{selectedAsset?.assetName} ({selectedAsset?.assetId})</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="issue-desc">Problem Description *</Label>
              <Textarea id="issue-desc" placeholder="e.g., Mouse is not working, Laptop battery is not charging..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReportModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsReportModalOpen(false)} className="bg-green-600 hover:bg-green-700">
              <Send size={16} className="mr-2" /> Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}