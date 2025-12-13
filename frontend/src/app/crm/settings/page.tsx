'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Search, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

// Mock data for different master categories
const mockMasterData: Record<string, string[]> = {
  source: ['Website', 'Referral', 'Social Media', 'Cold Call', 'Email Campaign'],
  segment: ['Enterprise', 'Mid-Market', 'SMB', 'Startup'],
  verticles: ['Technology', 'Finance', 'Healthcare', 'Manufacturing', 'Retail'],
  lead_type: ['Hot Lead', 'Warm Lead', 'Cold Lead'],
  status: ['New', 'Meeting Scheduled', 'Demo Done', 'Proposal Sent', 'Won/Deal Done', 'Lost'],
  current_system: ['Manual', 'Excel', 'Legacy Software', 'ERP', 'None'],
  meeting_type: ['Discovery Call', 'Product Demo', 'Pricing Discussion', 'Follow-up'],
  activity_type: ['Call', 'Email', 'Meeting', 'WhatsApp', 'Follow-up'],
  version: ['Basic', 'Professional', 'Enterprise', 'Custom']
};

const masterCategories = [
  { key: 'source', label: 'Source' },
  { key: 'segment', label: 'Segment' },
  { key: 'verticles', label: 'Verticals' },
  { key: 'lead_type', label: 'Lead Type' },
  { key: 'status', label: 'Status' },
  { key: 'current_system', label: 'Current System' },
  { key: 'meeting_type', label: 'Meeting Type' },
  { key: 'activity_type', label: 'Activity Type' },
  { key: 'version', label: 'Version' }
];

export default function SettingsPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState(masterCategories[0].key);
  const [masterItems, setMasterItems] = useState(mockMasterData);
  const [newItemValue, setNewItemValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemValue.trim()) {
      toast.error('Please enter a value');
      return;
    }

    const currentItems = masterItems[activeCategory] || [];
    if (currentItems.includes(newItemValue.trim())) {
      toast.error('This item already exists');
      return;
    }

    setMasterItems({
      ...masterItems,
      [activeCategory]: [...currentItems, newItemValue.trim()].sort()
    });
    setNewItemValue('');
    toast.success('Item added successfully!');
  };

  const handleDeleteItem = (item: string) => {
    if (!confirm(`Are you sure you want to delete "${item}"?`)) return;

    setMasterItems({
      ...masterItems,
      [activeCategory]: (masterItems[activeCategory] || []).filter(i => i !== item)
    });
    toast.success('Item deleted successfully!');
  };

  const currentItems = masterItems[activeCategory] || [];
  const filteredItems = currentItems.filter(item =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCategoryLabel = masterCategories.find(c => c.key === activeCategory)?.label || 'Items';

  return (
    <div className="space-y-3 py-3 lg:py-4">
      {/* Header with Back Button */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/crm')}
          className="h-8 w-8"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">CRM Settings</h2>
      </div>

      {/* Single Card with Dropdown */}
      <Card>
        <CardContent className="space-y-3 p-0">
          {/* Master Type Dropdown */}
          <div className="p-3 pb-0">
            <Label className="text-sm font-medium mb-2 block">Master Type</Label>
            <Select value={activeCategory} onValueChange={setActiveCategory}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select master type" />
              </SelectTrigger>
              <SelectContent>
                {masterCategories.map((cat) => (
                  <SelectItem key={cat.key} value={cat.key}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Add New Item Form */}
          <form onSubmit={handleAddItem} className="flex items-center gap-2 px-3">
            <Input
              placeholder={`New ${activeCategoryLabel} Name...`}
              value={newItemValue}
              onChange={(e) => setNewItemValue(e.target.value)}
              className="flex-1 h-9"
            />
            <Button
              type="submit"
              size="icon"
              className="h-9 w-9 shrink-0 sm:w-auto sm:px-4"
            >
              <Plus className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Add</span>
            </Button>
          </form>

          {/* Search */}
          <div className="relative px-3">
            <Search className="absolute left-5.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-9"
            />
          </div>

          {/* Items Table */}
          <div className="rounded-md border mx-3 max-h-96 overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-secondary">
                <TableRow>
                  <TableHead className="text-sm">{activeCategoryLabel} Name</TableHead>
                  <TableHead className="text-right w-[80px] sm:w-[100px] text-sm">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium text-sm">{item}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteItem(item)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground text-sm h-24">
                      {searchTerm ? 'No items found matching your search' : 'No items found'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Item Count */}
          <div className="text-xs text-muted-foreground px-3 pb-3">
            Showing {filteredItems.length} of {currentItems.length} items
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
