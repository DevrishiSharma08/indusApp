'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, Upload, Download, UploadCloud, FileCheck2, FileX2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { mockTeamMembers } from '@/lib/assets-mock-data';

export default function CreateLeadPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('mode') === 'edit';
  const leadId = searchParams.get('id');

  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    contact_name: '',
    designation: '',
    phone: '',
    email: '',
    linkedin: '',
    address: '',
    lead_type: 'Hot Lead',
    status: 'New',
    source: 'Website',
    industry: '',
    company_size: '',
    assigned_to: '',
    notes: ''
  });

  // Prefill form data in edit mode
  useEffect(() => {
    if (isEditMode) {
      setFormData({
        company_name: searchParams.get('company_name') || '',
        contact_name: searchParams.get('contact_name') || '',
        designation: searchParams.get('designation') || '',
        phone: searchParams.get('phone') || '',
        email: searchParams.get('email') || '',
        linkedin: searchParams.get('linkedin') || '',
        address: searchParams.get('address') || '',
        lead_type: searchParams.get('lead_type') || 'Hot Lead',
        status: searchParams.get('status') || 'New',
        source: searchParams.get('source') || 'Website',
        industry: searchParams.get('industry') || '',
        company_size: searchParams.get('company_size') || '',
        assigned_to: searchParams.get('assigned_to') || '',
        notes: searchParams.get('notes') || ''
      });
    }
  }, [isEditMode, searchParams]);

  // Bulk upload states
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    status: string;
    successful_imports: number;
    errors: string[];
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode) {
      toast.success('Lead updated successfully!');
    } else {
      toast.success('Lead created successfully!');
    }
    router.push('/crm/leads');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    // Simulate upload process
    setTimeout(() => {
      // Mock successful upload
      const mockResult = {
        status: 'Success',
        successful_imports: 45,
        errors: [
          'Row 12: Missing required field "phone"',
          'Row 25: Invalid email format',
          'Row 38: Assigned user not found'
        ]
      };

      setUploadResult(mockResult);
      setIsUploading(false);
      toast.success(`Successfully imported ${mockResult.successful_imports} leads!`);
    }, 2000);
  };

  const handleDownloadTemplate = () => {
    toast.success('Downloading Excel template...');
    // In real implementation, this would download the template file
  };

  return (
    <div className="space-y-3 lg:space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (showBulkUpload) {
              setShowBulkUpload(false);
            } else {
              router.back();
            }
          }}
          className="flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          {showBulkUpload ? 'Bulk Upload Leads' : (isEditMode ? 'Edit Lead' : 'Create New Lead')}
        </h2>
      </div>

      {!showBulkUpload ? (
        // Manual Form Entry
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Lead Information</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBulkUpload(true)}
                  className="flex items-center gap-1.5 h-8 px-3"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span className="text-xs">Bulk Upload</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5 pb-4">
              {/* Row 1: Company and Contact */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs whitespace-nowrap">Company Name *</Label>
                  <Input
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    placeholder="Enter company name"
                    required
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs whitespace-nowrap">Contact Name *</Label>
                  <Input
                    value={formData.contact_name}
                    onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                    placeholder="Enter contact name"
                    required
                    className="h-9"
                  />
                </div>
              </div>

              {/* Row 2: Designation and Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs whitespace-nowrap">Designation</Label>
                  <Input
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g., CEO, Manager"
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs whitespace-nowrap">Phone *</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 XXXXXXXXXX"
                    required
                    className="h-9"
                  />
                </div>
              </div>

              {/* Row 3: Email and LinkedIn */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs whitespace-nowrap">Email *</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    required
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs whitespace-nowrap">LinkedIn</Label>
                  <Input
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    placeholder="linkedin.com/in/profile"
                    className="h-9"
                  />
                </div>
              </div>

              {/* Row 4: Lead Type and Status */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs whitespace-nowrap">Lead Type *</Label>
                  <Select value={formData.lead_type} onValueChange={(val) => setFormData({ ...formData, lead_type: val })}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hot Lead">Hot Lead</SelectItem>
                      <SelectItem value="Warm Lead">Warm Lead</SelectItem>
                      <SelectItem value="Cold Lead">Cold Lead</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs whitespace-nowrap">Status *</Label>
                  <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Meeting Scheduled">Meeting Scheduled</SelectItem>
                      <SelectItem value="Demo Scheduled">Demo Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 5: Source and Industry */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs whitespace-nowrap">Source</Label>
                  <Select value={formData.source} onValueChange={(val) => setFormData({ ...formData, source: val })}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Website">Website</SelectItem>
                      <SelectItem value="Referral">Referral</SelectItem>
                      <SelectItem value="Social Media">Social Media</SelectItem>
                      <SelectItem value="Cold Call">Cold Call</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs whitespace-nowrap">Industry</Label>
                  <Input
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    placeholder="e.g., Technology, Finance"
                    className="h-9"
                  />
                </div>
              </div>

              {/* Row 6: Company Size and Assigned To */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs whitespace-nowrap">Company Size</Label>
                  <Input
                    value={formData.company_size}
                    onChange={(e) => setFormData({ ...formData, company_size: e.target.value })}
                    placeholder="50-100"
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs whitespace-nowrap">Assigned To *</Label>
                  <Select value={formData.assigned_to} onValueChange={(val) => setFormData({ ...formData, assigned_to: val })}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select member" className="text-xs" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTeamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.fullName}>
                          {member.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <Label className="text-xs whitespace-nowrap">Address</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Complete address"
                  className="h-9"
                />
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <Label className="text-xs whitespace-nowrap">Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes..."
                  rows={3}
                  className="resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3">
                <Button type="submit" className="flex-1 sm:flex-initial">
                  {isEditMode ? 'Update Lead' : 'Create Lead'}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      ) : (
        // Bulk Upload UI
        <div className="space-y-3 lg:space-y-4">

          {/* Instructions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-primary" />
                Important Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                <li>Download the template and fill it with your lead data</li>
                <li>Required columns: <span className="font-semibold text-foreground">company_name, contact_name, phone, assigned_to, source</span></li>
                <li>Optional columns: email, address, designation, LinkedIn, and more</li>
                <li>Ensure assigned_to matches existing team member names</li>
                <li>File formats supported: .xlsx, .xls</li>
              </ul>
            </CardContent>
          </Card>

          {/* Step 1: Download Template */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Step 1: Download Template</CardTitle>
              <CardDescription>Download the Excel template and fill it with your lead data</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={handleDownloadTemplate}>
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>
            </CardContent>
          </Card>

          {/* Step 2: Upload File */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Step 2: Upload File</CardTitle>
              <CardDescription>Select the completed Excel file from your computer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file-input">Excel File (.xlsx, .xls)</Label>
                <Input
                  id="file-input"
                  type="file"
                  onChange={handleFileChange}
                  accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  className="h-9"
                />
                {file && (
                  <p className="text-xs text-muted-foreground">Selected: {file.name}</p>
                )}
              </div>

              <Button
                onClick={handleUpload}
                disabled={isUploading || !file}
                className="w-full sm:w-auto"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4 mr-2" />
                    Upload and Process File
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Upload Result */}
          {uploadResult && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Upload Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Success Alert */}
                {uploadResult.successful_imports > 0 && (
                  <Alert className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
                    <FileCheck2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertTitle className="text-green-800 dark:text-green-400">Success</AlertTitle>
                    <AlertDescription className="text-green-700 dark:text-green-500">
                      Successfully imported <strong>{uploadResult.successful_imports}</strong> leads.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Errors Alert */}
                {uploadResult.errors && uploadResult.errors.length > 0 && (
                  <Alert variant="destructive">
                    <FileX2 className="h-4 w-4" />
                    <AlertTitle>Errors Encountered ({uploadResult.errors.length})</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
                        {uploadResult.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {uploadResult.status === 'Failed' && uploadResult.successful_imports === 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Upload Failed</AlertTitle>
                    <AlertDescription>
                      No leads could be imported. Please check the file format and try again.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
