'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { mockTeamMembers, mockCategories } from '@/lib/assets-mock-data';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface AssetItem {
  id: string;
  assetId: string;
  assetName: string;
  category: string;
  unit: string;
  modelNumber: string;
  serialNumber: string;
  warrantyType: string;
  warrantyDays: string;
  expiryDate: string;
  description: string;
  assetType: string;
  qty: number;
  rate: number;
  amount: number;
}

export default function AddAssetPage() {
  const router = useRouter();
  const [items, setItems] = useState<AssetItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AssetItem | null>(null);

  // Form state for dialog
  const [formData, setFormData] = useState<Partial<AssetItem>>({
    assetId: `IN000121-25-${items.length + 1}`,
    assetName: '',
    category: '',
    unit: 'Piece',
    modelNumber: '',
    serialNumber: '',
    warrantyType: 'None',
    warrantyDays: '',
    expiryDate: '',
    description: '',
    assetType: 'New',
    qty: 1,
    rate: 0,
    amount: 0
  });

  const warrantyTypes = ['None', 'Warranty', 'Guaranty'];
  const assetTypes = ['New', 'Used', 'Refurbished'];

  const handleOpenDialog = (item?: AssetItem) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        assetId: `IN000121-25-${items.length + 1}`,
        assetName: '',
        category: '',
        unit: 'Piece',
        modelNumber: '',
        serialNumber: '',
        warrantyType: 'None',
        warrantyDays: '',
        expiryDate: '',
        description: '',
        assetType: 'New',
        qty: 1,
        rate: 0,
        amount: 0
      });
    }
    setDialogOpen(true);
  };

  const handleSaveItem = () => {
    if (!formData.assetName || !formData.category) {
      toast.error('Please fill in Asset Name and Category');
      return;
    }

    const newItem: AssetItem = {
      id: editingItem?.id || Date.now().toString(),
      assetId: formData.assetId || `IN000121-25-${items.length + 1}`,
      assetName: formData.assetName || '',
      category: formData.category || '',
      unit: formData.unit || 'Piece',
      modelNumber: formData.modelNumber || '',
      serialNumber: formData.serialNumber || '',
      warrantyType: formData.warrantyType || 'None',
      warrantyDays: formData.warrantyDays || '',
      expiryDate: formData.expiryDate || '',
      description: formData.description || '',
      assetType: formData.assetType || 'New',
      qty: formData.qty || 1,
      rate: formData.rate || 0,
      amount: (formData.qty || 1) * (formData.rate || 0)
    };

    if (editingItem) {
      setItems(items.map(item => item.id === editingItem.id ? newItem : item));
      toast.success('Item updated successfully');
    } else {
      setItems([...items, newItem]);
      toast.success('Item added successfully');
    }

    setDialogOpen(false);
  };


  return (
    <DashboardLayout>
      <div className="space-y-3 lg:space-y-4">
        <PageHeader title="Add New Asset Purchase" />

        {/* Purchase Information Section - Compact Form */}
        <Card className="border-border shadow-sm rounded-lg sm:rounded-xl">
          <div className="px-3 sm:px-4 py-2 sm:py-2.5 border-b border-border">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">Purchase Information</h3>
          </div>
          <CardContent className="p-3 sm:p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Entry Number</Label>
                <Input defaultValue="IN000121" disabled className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Purchase Date *</Label>
                <Input type="date" className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Supplier Name *</Label>
                <Input className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Bill Number</Label>
                <Input className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Bill Date</Label>
                <Input type="date" className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Challan Number</Label>
                <Input className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Challan Date</Label>
                <Input type="date" className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Procured By *</Label>
                <Select>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTeamMembers.map(t => (
                      <SelectItem key={t.id} value={t.fullName}>{t.fullName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 md:col-span-3 lg:col-span-4 space-y-1.5">
                <Label className="text-xs sm:text-sm">Attachments</Label>
                <Input type="file" className="h-9" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-end gap-2 sticky bottom-0 bg-background py-3 border-t border-border">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button variant="default" className="bg-blue-600 hover:bg-blue-700" onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4 mr-1.5" />
            Add Item
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            Save Purchase
          </Button>
        </div>

        {/* Add/Edit Item Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Asset Item' : 'Add Asset Item'}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 py-4">
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Asset ID</Label>
                <Input
                  value={formData.assetId}
                  onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
                  className="h-9"
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs sm:text-sm">Asset Name *</Label>
                <Input
                  value={formData.assetName}
                  onChange={(e) => setFormData({ ...formData, assetName: e.target.value })}
                  className="h-9"
                  placeholder="Enter asset name"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCategories.map(c => (
                      <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Unit</Label>
                <Input
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Asset Type</Label>
                <Select
                  value={formData.assetType}
                  onValueChange={(value) => setFormData({ ...formData, assetType: value })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {assetTypes.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Model Number</Label>
                <Input
                  value={formData.modelNumber}
                  onChange={(e) => setFormData({ ...formData, modelNumber: e.target.value })}
                  className="h-9"
                  placeholder="Model number"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Serial Number</Label>
                <Input
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                  className="h-9"
                  placeholder="Serial number"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Warranty Type</Label>
                <Select
                  value={formData.warrantyType}
                  onValueChange={(value) => setFormData({ ...formData, warrantyType: value })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {warrantyTypes.map(w => (
                      <SelectItem key={w} value={w}>{w}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Warranty (Days)</Label>
                <Input
                  value={formData.warrantyDays}
                  onChange={(e) => setFormData({ ...formData, warrantyDays: e.target.value })}
                  className="h-9"
                  placeholder="e.g., 365"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Expiry Date</Label>
                <Input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Quantity</Label>
                <Input
                  type="number"
                  value={formData.qty}
                  onChange={(e) => setFormData({
                    ...formData,
                    qty: parseInt(e.target.value) || 1,
                    amount: (parseInt(e.target.value) || 1) * (formData.rate || 0)
                  })}
                  className="h-9"
                  min="1"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Rate (₹)</Label>
                <Input
                  type="number"
                  value={formData.rate}
                  onChange={(e) => setFormData({
                    ...formData,
                    rate: parseFloat(e.target.value) || 0,
                    amount: (formData.qty || 1) * (parseFloat(e.target.value) || 0)
                  })}
                  className="h-9"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Amount (₹)</Label>
                <Input
                  value={`₹${formData.amount?.toLocaleString() || '0.00'}`}
                  disabled
                  className="h-9 bg-muted"
                />
              </div>
              <div className="col-span-2 md:col-span-3 space-y-1.5">
                <Label className="text-xs sm:text-sm">Description</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="h-9"
                  placeholder="Optional description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveItem}>
                {editingItem ? 'Update Item' : 'Add Item'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
