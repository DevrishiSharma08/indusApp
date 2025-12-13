'use client';
import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockCategories } from '@/lib/assets-mock-data';
import { ArrowLeft, Edit, Save } from 'lucide-react';

export default function EditAssetPage() {
  const router = useRouter();
  const params = useParams();
  const purchaseId = params.id; // URL se ID milegi, jaise 'IN000120'

  // Aap yahan real data fetch karenge, abhi hum mock data use kar rahe hain
  const purchaseDetails = {
    billNumber: '',
    billDate: '',
    challanNumber: '3529',
    challanDate: '2025-09-24',
    assets: [
      { id: 1, assetId: 'IN000120-25-2', assetName: 'HP Charger', category: 'Chargers', unit: 'Pcs', qty: 2, rate: 1500 },
      { id: 2, assetId: 'IN000120-25-1', assetName: 'HP Touch', category: 'LAPTOPS', unit: 'Pcs', qty: 2, rate: 75000 },
    ]
  };

  return (
    <DashboardLayout>
      <div className="py-3 lg:py-4 space-y-3 lg:space-y-4 bg-background min-h-screen">
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Edit Purchase: {purchaseId}</h1>
            <p className="text-muted-foreground">Update the details for this purchase entry.</p>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Assets in this Purchase</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow>{['Asset ID', 'Asset Name', 'Category', 'Unit', 'Model', 'Serial', 'Warranty Type', 'Qty', 'Rate', ''].map(h => <TableHead key={h}>{h}</TableHead>)}</TableRow></TableHeader>
                  <TableBody>
                    {purchaseDetails.assets.map(asset => (
                      <TableRow key={asset.id}>
                        <TableCell>{asset.assetId}</TableCell>
                        <TableCell><Input defaultValue={asset.assetName} /></TableCell>
                        <TableCell><Select defaultValue={asset.category}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{mockCategories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent></Select></TableCell>
                        <TableCell><Input defaultValue={asset.unit} /></TableCell>
                        <TableCell><Input /></TableCell>
                        <TableCell><Input /></TableCell>
                        <TableCell><Select defaultValue="Warranty"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Warranty">Warranty</SelectItem></SelectContent></Select></TableCell>
                        <TableCell><Input type="number" defaultValue={asset.qty} /></TableCell>
                        <TableCell><Input type="number" defaultValue={asset.rate} /></TableCell>
                        <TableCell><Button variant="ghost" size="icon" className="h-8 w-8"><Edit size={16} /></Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Purchase Details</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2"><Label>Bill Number</Label><Input defaultValue={purchaseDetails.billNumber} /></div>
              <div className="space-y-2"><Label>Bill Date</Label><Input type="date" defaultValue={purchaseDetails.billDate} /></div>
              <div className="space-y-2"><Label>Challan Number</Label><Input defaultValue={purchaseDetails.challanNumber} /></div>
              <div className="space-y-2"><Label>Challan Date</Label><Input type="date" defaultValue={purchaseDetails.challanDate} /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Manage Attachments</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div><Label>Existing Attachments</Label><div className="mt-2 p-4 border rounded-md min-h-[60px] text-sm text-muted-foreground">No attachments found.</div></div>
              <div><Label>Upload New Attachments</Label><Input type="file" className="mt-2" /></div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 p-4 bg-white rounded-lg shadow-sm border mt-6">
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button className="bg-green-600 hover:bg-green-700">
              <Save size={16} className="mr-2" /> Save Changes
            </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}