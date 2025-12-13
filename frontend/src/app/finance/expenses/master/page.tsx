'use client';
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Edit, Trash2, MoreVertical } from 'lucide-react';
import { toast } from 'sonner';

// Category Data for Master Page
const expenseMasterCategories = [
  { id: 1, name: 'Office Supplies' },
  { id: 2, name: 'Travel' },
  { id: 3, name: 'Food & Beverages' },
  { id: 4, name: 'Software & Subscriptions' },
  { id: 5, name: 'Hardware Purchase' },
  { id: 6, name: 'Cloud Services' },
  { id: 7, name: 'Marketing & Advertising' },
  { id: 8, name: 'Employee Welfare' },
  { id: 9, name: 'Miscellaneous' },
];

// Subcategory Data for Master Page
const expenseMasterSubcategories = [
  { id: 1, category: 'Office Supplies', name: 'Stationery' },
  { id: 2, category: 'Office Supplies', name: 'Pantry Supplies' },
  { id: 3, category: 'Office Supplies', name: 'Cleaning Supplies' },
  { id: 4, category: 'Travel', name: 'Cab Fare' },
  { id: 5, category: 'Travel', name: 'Flight Tickets' },
  { id: 6, category: 'Travel', name: 'Train Tickets' },
  { id: 7, category: 'Travel', name: 'Bus Tickets' },
  { id: 8, category: 'Travel', name: 'Hotel Stay' },
  { id: 9, category: 'Travel', name: 'Client Meal' },
  { id: 10, category: 'Food & Beverages', name: 'Team Lunch' },
  { id: 11, category: 'Food & Beverages', name: 'Snacks & Refreshments' },
  { id: 12, category: 'Food & Beverages', name: 'Office Party' },
  { id: 13, category: 'Software & Subscriptions', name: 'SaaS Tools' },
  { id: 14, category: 'Software & Subscriptions', name: 'Domain & Hosting' },
  { id: 15, category: 'Software & Subscriptions', name: 'Software Licenses' },
  { id: 16, category: 'Hardware Purchase', name: 'Laptops' },
  { id: 17, category: 'Hardware Purchase', name: 'Monitors' },
  { id: 18, category: 'Hardware Purchase', name: 'Peripherals (Mouse, Keyboard)' },
  { id: 19, category: 'Hardware Purchase', name: 'Cables & Adapters' },
  { id: 20, category: 'Cloud Services', name: 'AWS' },
  { id: 21, category: 'Cloud Services', name: 'Azure' },
  { id: 22, category: 'Cloud Services', name: 'Google Cloud' },
  { id: 23, category: 'Marketing & Advertising', name: 'Online Ads' },
  { id: 24, category: 'Marketing & Advertising', name: 'Social Media Promotion' },
  { id: 25, category: 'Marketing & Advertising', name: 'Events & Sponsorships' },
  { id: 26, category: 'Employee Welfare', name: 'Gifts & Rewards' },
  { id: 27, category: 'Employee Welfare', name: 'Health & Wellness' },
  { id: 28, category: 'Miscellaneous', name: 'Courier Charges' },
  { id: 29, category: 'Miscellaneous', name: 'Bank Charges' },
  { id: 30, category: 'Miscellaneous', name: 'Other' },
];

export default function ExpenseMasterPage() {
  const [activeTab, setActiveTab] = useState('categories');

  // States for modals
  const [categoryModal, setCategoryModal] = useState({ isOpen: false, mode: 'add' as 'add' | 'edit', data: null as any });
  const [subcategoryModal, setSubcategoryModal] = useState({ isOpen: false, mode: 'add' as 'add' | 'edit', data: null as any });

  // States for forms
  const [categoryFormData, setCategoryFormData] = useState({ name: '' });
  const [subcategoryFormData, setSubcategoryFormData] = useState({ category: '', name: '' });

  // Effects to populate form data on edit
  useEffect(() => {
    if (categoryModal.isOpen) {
      if (categoryModal.mode === 'edit' && categoryModal.data) {
        setCategoryFormData({ name: categoryModal.data.name });
      } else {
        setCategoryFormData({ name: '' });
      }
    }
  }, [categoryModal]);

  useEffect(() => {
    if (subcategoryModal.isOpen) {
      if (subcategoryModal.mode === 'edit' && subcategoryModal.data) {
        setSubcategoryFormData({ category: subcategoryModal.data.category, name: subcategoryModal.data.name });
      } else {
        setSubcategoryFormData({ category: '', name: '' });
      }
    }
  }, [subcategoryModal]);

  // Modal handlers
  const handleOpenCategoryModal = (mode: 'add' | 'edit', category: any = null) => setCategoryModal({ isOpen: true, mode, data: category });
  const handleCloseCategoryModal = () => setCategoryModal({ isOpen: false, mode: 'add', data: null });
  const handleOpenSubcategoryModal = (mode: 'add' | 'edit', subcategory: any = null) => setSubcategoryModal({ isOpen: true, mode, data: subcategory });
  const handleCloseSubcategoryModal = () => setSubcategoryModal({ isOpen: false, mode: 'add', data: null });

  const handleDeleteCategory = (category: any) => {
    toast.success(`Category "${category.name}" deleted`);
  };

  const handleDeleteSubcategory = (subcategory: any) => {
    toast.success(`Subcategory "${subcategory.name}" deleted`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-2 lg:space-y-3">
        <PageHeader title="Expense Masters" />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-3">
            <TabsList>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="subcategories">Subcategories</TabsTrigger>
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

            {activeTab === 'subcategories' && (
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleOpenSubcategoryModal('add')}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Subcategory
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
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expenseMasterCategories.map((cat) => (
                        <TableRow key={cat.id}>
                          <TableCell className="font-medium">{cat.id}</TableCell>
                          <TableCell className="font-medium">{cat.name}</TableCell>
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

          {/* Subcategories Tab */}
          <TabsContent value="subcategories" className="mt-0">
            <Card className="border-border shadow-sm rounded-lg sm:rounded-xl">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Subcategory Name</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expenseMasterSubcategories.map((sub) => (
                        <TableRow key={sub.id}>
                          <TableCell className="font-medium">{sub.id}</TableCell>
                          <TableCell>{sub.category}</TableCell>
                          <TableCell className="font-medium">{sub.name}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleOpenSubcategoryModal('edit', sub)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDeleteSubcategory(sub)}
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
                onChange={(e) => setCategoryFormData({ name: e.target.value })}
                placeholder="Enter category name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseCategoryModal}>Cancel</Button>
            <Button onClick={handleCloseCategoryModal}>Save Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Subcategory Modal */}
      <Dialog open={subcategoryModal.isOpen} onOpenChange={handleCloseSubcategoryModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{subcategoryModal.mode === 'edit' ? 'Edit Subcategory' : 'Add Subcategory'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sub-category">Main Category *</Label>
              <Select
                value={subcategoryFormData.category}
                onValueChange={(value) => setSubcategoryFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category..." />
                </SelectTrigger>
                <SelectContent>
                  {expenseMasterCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sub-name">Subcategory Name *</Label>
              <Input
                id="sub-name"
                value={subcategoryFormData.name}
                onChange={(e) => setSubcategoryFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter subcategory name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseSubcategoryModal}>Cancel</Button>
            <Button onClick={handleCloseSubcategoryModal}>Save Subcategory</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
