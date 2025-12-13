'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { mockTeamMembers, mockAssets, mockCategories, mockAssetHistory } from '@/lib/assets-mock-data';
import { Plus, PlusCircle, Search, Edit, Check, Trash2, Filter, Columns, List, LayoutGrid, ArrowRightLeft, Wrench, History } from 'lucide-react';

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

// Type definitions
type ModalType = 'issue' | 'repair' | 'history' | 'list' | 'return';
interface ModalState { open: boolean; type: ModalType | null; data?: any; }
interface AssetModalsProps { modalState: ModalState; setModalState: React.Dispatch<React.SetStateAction<ModalState>>; }

// 1. Issue Asset Dialog
function IssueAssetDialog({ open, onClose, data }: { open: boolean; onClose: () => void; data: any }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>Issue Asset</DialogTitle></DialogHeader>
        <div className="py-4 space-y-4">
          <div><span className="font-semibold">Asset:</span> {data?.assetName}</div>
          <div><span className="font-semibold">Tag:</span> {data?.assetId}</div>
          <div className="space-y-2">
            <Label>Select Employee: *</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent>{mockTeamMembers.map(t => <SelectItem key={t.id} value={t.fullName}>{t.fullName}</SelectItem>)}</SelectContent></Select>
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">Cancel</Button>
          <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">Issue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// 2. Send for Repair Dialog
function RepairAssetDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader><DialogTitle>Send Asset for Repair</DialogTitle></DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="space-y-2"><Label htmlFor="vendor-name">Vendor Name: *</Label><Input id="vendor-name" /></div>
                    <div className="space-y-2"><Label htmlFor="handed-by">Handed Over By: *</Label>
                        <Select><SelectTrigger id="handed-by"><SelectValue placeholder="Select an employee..." /></SelectTrigger><SelectContent>{mockTeamMembers.map(t => <SelectItem key={t.id} value={t.fullName}>{t.fullName}</SelectItem>)}</SelectContent></Select>
                    </div>
                    <div className="space-y-2"><Label htmlFor="problem">Problem Description:</Label><Textarea id="problem" /></div>
                    <div className="space-y-2"><Label htmlFor="sent-date">Sent Date: *</Label><Input id="sent-date" type="date" defaultValue="2025-10-03" /></div>
                    <div className="space-y-2"><Label htmlFor="return-date">Expected Return Date:</Label><Input id="return-date" type="date" /></div>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">Cancel</Button>
                    <Button className="w-full sm:w-auto"><Check size={16} className="mr-2" /> Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// 3. Confirm Return Dialog
function ConfirmReturnDialog({ open, onClose, onConfirm, data }: { open: boolean; onClose: () => void; onConfirm: () => void; data: any }) {
    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Return</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to return '{data?.assetName}' from {data?.issuedTo}?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>No</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>Yes</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

// 4. History Dialog
function HistoryDialog({ open, onClose, data }: { open: boolean; onClose: () => void; data: any }) {
    const getActivityIcon = (action: string) => {
        switch (action) {
            case 'Created': return { Icon: PlusCircle, color: 'bg-green-500 dark:bg-green-400' };
            case 'Issued': return { Icon: ArrowRightLeft, color: 'bg-blue-500 dark:bg-blue-400' };
            case 'Repair': return { Icon: Wrench, color: 'bg-yellow-500 dark:bg-yellow-400' };
            case 'Repaired': return { Icon: Check, color: 'bg-cyan-500 dark:bg-cyan-400' };
            default: return { Icon: History, color: 'bg-muted-foreground' };
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader><DialogTitle>History for: {data?.assetName} ({data?.assetId})</DialogTitle></DialogHeader>
                <div className="py-4 max-h-[60vh] overflow-y-auto">
                    <div className="relative pl-8">
                        <div className="absolute left-4 top-0 h-full w-0.5 bg-border"></div>
                        {mockAssetHistory.map(item => {
                            const { Icon, color } = getActivityIcon(item.action);
                            return (
                                <div key={item.id} className="relative mb-8">
                                    <div className={`absolute -left-1.5 top-1.5 size-7 rounded-full text-white flex items-center justify-center ring-8 ring-background ${color}`}>
                                        <Icon size={16} />
                                    </div>
                                    <Card className="ml-8">
                                        <CardContent className="p-3">
                                            <p className="font-semibold">{item.action}</p>
                                            <p className="text-sm text-muted-foreground">{item.timestamp}</p>
                                            <p className="text-sm mt-1">{item.description}</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// 5. Asset List Dialog (Responsive)
function AssetListDialog({ open, onClose, data }: { open: boolean; onClose: () => void; data: any }) {
    const [currentView, setCurrentView] = useState<'table' | 'card'>('table');
    const isDesktop = useMediaQuery("(min-width: 768px)");

    useEffect(() => {
        if (!isDesktop) { setCurrentView('card'); } 
        else { setCurrentView('table'); }
    }, [isDesktop, open]);

    const getStatusBadgeClass = (status: string) => {
        if (status === 'In Stock') return 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-900';
        if (status === 'Issued') return 'bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900';
        return 'bg-muted text-muted-foreground border border-border';
    };

    const headers = ['Asset Tag', 'Asset Name', 'Category Name', 'Serial Number', 'Quantity', 'Issued To', 'Status'];
    
    const content = (
        <>
            <div className="p-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <DialogTitle>{data?.title}</DialogTitle>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-auto">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="Search assets..." className="pl-9 h-8 w-full sm:w-48" />
                    </div>
                    <div className="inline-flex rounded-md border bg-background p-0.5">
                        <Button variant={currentView === 'table' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setCurrentView('table')}><List className="h-4 w-4" /></Button>
                        <Button variant={currentView === 'card' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setCurrentView('card')}><LayoutGrid className="h-4 w-4" /></Button>
                    </div>
                </div>
            </div>
            <div className="flex-1 overflow-auto">
                {currentView === 'card' && (
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data?.assets?.map((asset: any) => (
                            <Card key={asset.id} className="p-4">
                                <div className="flex justify-between items-start">
                                    <div><p className="font-bold">{asset.assetName}</p><p className="text-sm text-muted-foreground">{asset.assetId}</p></div>
                                    <Badge className={getStatusBadgeClass(asset.status)}>{asset.status}</Badge>
                                </div>
                                <div className="mt-4 text-sm border-t pt-3 space-y-1">
                                    <p><strong>Category:</strong> {asset.category}</p>
                                    <p><strong>Issued To:</strong> {asset.issuedTo || 'N/A'}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
                {currentView === 'table' && (
                    <Table>
                        <TableHeader className="sticky top-0 bg-card z-10">
                            <TableRow>{headers.map(h => (<TableHead key={h} className="font-bold"><div className="flex items-center gap-1">{h} <Filter size={12} className="text-muted-foreground" /></div></TableHead>))}</TableRow>
                            <TableRow className="bg-muted/50">{headers.map(h => (<TableHead key={`${h}-filter`} className="p-1 align-top"><div className="relative"><Input className="h-7 text-xs" /><Search size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" /></div></TableHead>))}</TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.assets?.length > 0 ? data.assets.map((asset: any) => (
                                <TableRow key={asset.id}>
                                    <TableCell>{asset.assetId}</TableCell><TableCell>{asset.assetName}</TableCell><TableCell>{asset.category}</TableCell><TableCell>{asset.serialNumber || '-'}</TableCell><TableCell>{asset.qty}</TableCell><TableCell>{asset.issuedTo || '-'}</TableCell>
                                    <TableCell><Badge className={getStatusBadgeClass(asset.status)}>{asset.status}</Badge></TableCell>
                                </TableRow>
                            )) : (<TableRow><TableCell colSpan={headers.length} className="text-center h-48 text-muted-foreground">No data</TableCell></TableRow>)}
                        </TableBody>
                    </Table>
                )}
            </div>
        </>
    );

    if (!isDesktop) {
        return (
            <Sheet open={open} onOpenChange={onClose}>
                <SheetContent side="bottom" className="h-[85vh] flex flex-col p-0">{content}</SheetContent>
            </Sheet>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-5xl h-full max-h-[90vh] flex flex-col p-0">{content}</DialogContent>
        </Dialog>
    );
}

// Main Component to Render Modals
export default function AssetModals({ modalState, setModalState }: AssetModalsProps) {
  const { open, type, data } = modalState;
  const onClose = () => setModalState({ open: false, type: null, data: null });

  if (!open) return null;

  switch (type) {
    case 'issue': return <IssueAssetDialog open={true} onClose={onClose} data={data} />;
    case 'repair': return <RepairAssetDialog open={true} onClose={onClose} />;
    case 'history': return <HistoryDialog open={true} onClose={onClose} data={data} />;
    case 'list': return <AssetListDialog open={true} onClose={onClose} data={data} />;
    case 'return': return <ConfirmReturnDialog open={true} onClose={onClose} onConfirm={() => console.log("Returned!")} data={data} />;
    default: return null;
  }
}