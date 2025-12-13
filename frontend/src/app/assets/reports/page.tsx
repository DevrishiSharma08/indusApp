'use client';
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/PageHeader';
import FilterExportBar from '@/components/FilterExportBar';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockTransactions, mockRepairHistory, mockWarrantyStatus } from '@/lib/assets-mock-data';

export default function AssetsReportsPage() {
  // Filter states
  const [activeTab, setActiveTab] = useState('transactions');
  const [searchQuery, setSearchQuery] = useState('');
  const [warrantyDays, setWarrantyDays] = useState('30');
  const [fromDate, setFromDate] = useState('all');
  const [toDate, setToDate] = useState('all');

  // Export handler
  const handleExport = (format: 'excel' | 'csv' | 'pdf') => {
    console.log(`Exporting ${activeTab} as ${format}`);
    // Add export logic here
  };

  // Get filters based on active tab
  const getFilters = () => {
    if (activeTab === 'warranty') {
      return [
        {
          key: 'warrantyDays',
          label: 'Expiring In',
          options: [
            { value: '30', label: 'Next 30 Days' },
            { value: '60', label: 'Next 60 Days' },
            { value: '90', label: 'Next 90 Days' },
          ],
          value: warrantyDays,
          onChange: setWarrantyDays,
        },
      ];
    }
    // For Transaction Log and Repair History - From Date and To Date filters
    return [
      {
        key: 'fromDate',
        label: 'From Date',
        options: [
          { value: 'all', label: 'All dates' },
          { value: 'today', label: 'Today' },
          { value: 'week', label: '7 days ago' },
          { value: 'month', label: '30 days ago' },
          { value: 'quarter', label: '90 days ago' },
        ],
        value: fromDate,
        onChange: setFromDate,
      },
      {
        key: 'toDate',
        label: 'To Date',
        options: [
          { value: 'all', label: 'All dates' },
          { value: 'today', label: 'Today' },
          { value: 'yesterday', label: 'Yesterday' },
          { value: 'week', label: '7 days ago' },
          { value: 'month', label: '30 days ago' },
        ],
        value: toDate,
        onChange: setToDate,
      },
    ];
  };

  return (
    <DashboardLayout>
      <div className="space-y-2 lg:space-y-3">
        <PageHeader title="Asset Reports" />

        <div className="bg-card rounded-lg sm:rounded-xl shadow-sm border border-border overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Tabs and FilterExportBar */}
            <div className="p-2 sm:p-3 border-b border-border space-y-2">
              <TabsList className="h-9 w-full sm:w-auto">
                <TabsTrigger value="transactions" className="text-xs sm:text-sm">Transaction Log</TabsTrigger>
                <TabsTrigger value="repair" className="text-xs sm:text-sm">Repair History</TabsTrigger>
                <TabsTrigger value="warranty" className="text-xs sm:text-sm">Warranty Status</TabsTrigger>
              </TabsList>
              <FilterExportBar
                filters={getFilters()}
                showExport={true}
                onExport={handleExport}
                showSearch={true}
                searchProps={{
                  placeholder: "Search reports...",
                  value: searchQuery,
                  onChange: setSearchQuery,
                }}
              />
            </div>

              {/* Transaction Log Tab */}
              <TabsContent value="transactions" className="mt-0 space-y-2">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {['AssetID', 'Asset Name', 'Category', 'Member', 'Model No.', 'Serial No.', 'Description', 'Issue Date & Time', 'Qty Issued', 'Return Date & Time', 'Qty Returned'].map(h => (
                          <TableHead key={h}>{h}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockTransactions.map(t => (
                        <TableRow key={t.id}>
                          <TableCell>{t.assetId}</TableCell>
                          <TableCell>{t.assetName}</TableCell>
                          <TableCell>{t.category}</TableCell>
                          <TableCell>{t.member}</TableCell>
                          <TableCell>{t.modelNo || '-'}</TableCell>
                          <TableCell>{t.serialNo || '-'}</TableCell>
                          <TableCell>{t.description || '-'}</TableCell>
                          <TableCell>{t.issueDate}</TableCell>
                          <TableCell>{t.qtyIssued}</TableCell>
                          <TableCell>{t.returnDate || '-'}</TableCell>
                          <TableCell>{t.qtyReturned}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              {/* Repair History Tab */}
              <TabsContent value="repair" className="mt-0 space-y-2">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {['Asset Name', 'Vendor Name', 'Problem Description', 'Sent Date', 'Return Date', 'Cost', 'Handed Over By', 'Received By', 'Bill'].map(h => (
                          <TableHead key={h}>{h}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockRepairHistory.map(r => (
                        <TableRow key={r.id}>
                          <TableCell>{r.assetName}</TableCell>
                          <TableCell>{r.vendorName}</TableCell>
                          <TableCell>{r.problem}</TableCell>
                          <TableCell>{r.sentDate}</TableCell>
                          <TableCell>{r.returnDate}</TableCell>
                          <TableCell>₹{r.cost}</TableCell>
                          <TableCell>{r.handedBy}</TableCell>
                          <TableCell>{r.receivedBy}</TableCell>
                          <TableCell>{r.bill || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Warranty Status Tab */}
              <TabsContent value="warranty" className="mt-0 space-y-2">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {['Asset Name', 'Category Name', 'Serial Number', 'Unit', 'Current Holder', 'Purchase Date', 'Expires On', 'Status'].map(h => (
                          <TableHead key={h}>{h}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockWarrantyStatus.map(w => (
                        <TableRow key={w.id}>
                          <TableCell>{w.assetName}</TableCell>
                          <TableCell>{w.category}</TableCell>
                          <TableCell>{w.serial}</TableCell>
                          <TableCell>{w.unit}</TableCell>
                          <TableCell>{w.holder}</TableCell>
                          <TableCell>{w.purchaseDate}</TableCell>
                          <TableCell>{w.expiresOn}</TableCell>
                          <TableCell>
                            <Badge className="bg-amber-500 hover:bg-amber-600">{w.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}