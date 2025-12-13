'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Download, UploadCloud, FileCheck2, FileX2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function BulkUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    status: string;
    successful_imports: number;
    errors: string[];
  } | null>(null);

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
    <div className="space-y-3 lg:space-y-4 py-3 lg:py-4">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Bulk Upload Leads</h2>
        <p className="text-sm text-muted-foreground">Import multiple leads at once using an Excel file</p>
      </div>

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
  );
}
