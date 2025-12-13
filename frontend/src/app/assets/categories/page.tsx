'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { mockUnits, mockCategories } from '@/lib/assets-mock-data';
import { Plus, Edit, Trash2, MoreVertical } from 'lucide-react';
import { toast } from 'sonner';

// Main Page Component
export default function AssetsCategoriesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('categories');

  // States for modals
  const [categoryModal, setCategoryModal] = useState({ isOpen: false, mode: 'add' as 'add' | 'edit', data: null as any });
  const [unitModal, setUnitModal] = useState({ isOpen: false, mode: 'add' as 'add' | 'edit', data: null as any });

  // States for forms
  const [categoryFormData, setCategoryFormData] = useState({ name: '', unit: '', trackingType: 'Individual' });
  const [unitFormData, setUnitFormData] = useState({ name: '' });

  // Effects to populate form data on edit
  useEffect(() => {
    if (categoryModal.isOpen) {
      if (categoryModal.mode === 'edit' && categoryModal.data) {
        setCategoryFormData({ name: categoryModal.data.name, unit: categoryModal.data.unit, trackingType: categoryModal.data.trackingType });
      } else {
        setCategoryFormData({ name: '', unit: '', trackingType: 'Individual' });
      }
    }
  }, [categoryModal]);

  useEffect(() => {
    if (unitModal.isOpen) {
      if (unitModal.mode === 'edit' && unitModal.data) {
        setUnitFormData({ name: unitModal.data.name });
      } else {
        setUnitFormData({ name: '' });
      }
    }
  }, [unitModal]);

  // Modal handlers
  const handleOpenCategoryModal = (mode: 'add' | 'edit', category: any = null) => setCategoryModal({ isOpen: true, mode, data: category });
  const handleCloseCategoryModal = () => setCategoryModal({ isOpen: false, mode: 'add', data: null });
  const handleOpenUnitModal = (mode: 'add' | 'edit', unit: any = null) => setUnitModal({ isOpen: true, mode, data: unit });
  const handleCloseUnitModal = () => setUnitModal({ isOpen: false, mode: 'add', data: null });

  const handleDeleteCategory = (category: any) => {
    toast.success(`Category "${category.name}" deleted`);
  };

  const handleDeleteUnit = (unit: any) => {
    toast.success(`Unit "${unit.name}" deleted`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-3 lg:space-y-4">
        <PageHeader title="Masters" />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-3">
            <TabsList>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="units">Units</TabsTrigger>
            </TabsList>

            {activeTab === 'categories' && (
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleOpenCategoryModal('add')}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Category
              </Button>
            )}

            {activeTab === 'units' && (
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleOpenUnitModal('add')}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Unit
              </Button>
            )}
          </div>

          {/* Categories Tab */}
          <TabsContent value="categories" className="mt-0">
            <Card className="border-border shadow-sm rounded-lg sm:rounded-xl">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Category Name</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Tracking Type</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockCategories.map((cat) => (
                        <TableRow key={cat.id}>
                          <TableCell className="font-medium">{cat.id}</TableCell>
                          <TableCell className="font-medium">{cat.name}</TableCell>
                          <TableCell>{cat.unit}</TableCell>
                          <TableCell>
                            <Badge variant={cat.trackingType === 'Individual' ? 'default' : 'secondary'} className="text-xs">
                              {cat.trackingType}
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
                                <DropdownMenuItem onClick={() => handleOpenCategoryModal('edit', cat)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDeleteCategory(cat)}
                                  className="text-destructive focus:text-destructive"
                                >
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Units Tab */}
          <TabsContent value="units" className="mt-0">
            <Card className="border-border shadow-sm rounded-lg sm:rounded-xl">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Unit Name</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockUnits.map((unit) => (
                        <TableRow key={unit.id}>
                          <TableCell className="font-medium">{unit.id}</TableCell>
                          <TableCell className="font-medium">{unit.name}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleOpenUnitModal('edit', unit)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDeleteUnit(unit)}
                                  className="text-destructive focus:text-destructive"
                                >
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add/Edit Category Modal */}
      <Dialog open={categoryModal.isOpen} onOpenChange={handleCloseCategoryModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{categoryModal.mode === 'edit' ? 'Edit Category' : 'Add Category'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cat-name">Category Name *</Label>
              <Input
                id="cat-name"
                value={categoryFormData.name}
                onChange={(e) => setCategoryFormData(prev => ({...prev, name: e.target.value}))}
                placeholder="Enter category name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-unit">Unit</Label>
              <Select value={categoryFormData.unit} onValueChange={(value) => setCategoryFormData(prev => ({...prev, unit: value}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a unit..." />
                </SelectTrigger>
                <SelectContent>
                  {mockUnits.map(u => (
                    <SelectItem key={u.id} value={u.name}>{u.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Individually Trackable?</Label>
              <div className="flex items-center gap-2">
                <Switch
                  id="tracking-switch"
                  checked={categoryFormData.trackingType === 'Individual'}
                  onCheckedChange={(checked) => setCategoryFormData(prev => ({...prev, trackingType: checked ? 'Individual' : 'Bulk'}))}
                />
                <Label htmlFor="tracking-switch" className="text-xs text-muted-foreground font-normal">
                  Check for items like Laptops. Uncheck for bulk items.
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseCategoryModal}>Cancel</Button>
            <Button onClick={handleCloseCategoryModal}>Save Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Unit Modal */}
      <Dialog open={unitModal.isOpen} onOpenChange={handleCloseUnitModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{unitModal.mode === 'edit' ? 'Edit Unit' : 'Add Unit'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="unit-name">Unit Name *</Label>
              <Input
                id="unit-name"
                value={unitFormData.name}
                onChange={(e) => setUnitFormData({name: e.target.value})}
                placeholder="Enter unit name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseUnitModal}>Cancel</Button>
            <Button onClick={handleCloseUnitModal}>Save Unit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}