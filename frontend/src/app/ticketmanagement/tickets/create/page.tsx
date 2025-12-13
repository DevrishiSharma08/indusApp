'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/PageHeader';
import AudioRecorder from '@/components/AudioRecorder';
import FileUploader from '@/components/FileUploader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

// Mock data
const customers = ['Acme Corp', 'TechStart Inc', 'Global Solutions', 'Innovate Ltd'];
const products = ['HRMS', 'CRM', 'ERP', 'Mobile App'];
const modules = ['Authentication', 'Dashboard', 'Reports', 'Settings', 'User Management'];
const categories = ['Bug', 'Feature', 'Enhancement', 'Question'];
const priorities = ['High', 'Medium', 'Low'];
const complexities = ['Easy', 'Medium', 'Hard'];

// Form data interface
interface TicketFormData {
  title: string;
  customer: string;
  product: string;
  module: string;
  category: string;
  priority: string;
  complexity: string;
  expectedMinutes: string;
  expectedDate: string;
  description: string;
}

export default function CreateTicketPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<TicketFormData>({
    title: '',
    customer: '',
    product: '',
    module: '',
    category: '',
    priority: '',
    complexity: '',
    expectedMinutes: '',
    expectedDate: '',
    description: '',
  });

  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Partial<TicketFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleInputChange = (field: keyof TicketFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle audio recording
  const handleAudioComplete = (blob: Blob, url: string) => {
    setAudioBlob(blob);
    setAudioUrl(url);
    console.log('Audio recorded:', { blob, url });
  };

  // Handle file upload
  const handleFilesChange = (files: File[]) => {
    setUploadedFiles(files);
    console.log('Files selected:', files);
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<TicketFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.customer) {
      newErrors.customer = 'Customer is required';
    }

    if (!formData.product) {
      newErrors.product = 'Product is required';
    }

    if (!formData.module) {
      newErrors.module = 'Module is required';
    }

    if (!formData.expectedDate) {
      newErrors.expectedDate = 'Expected date is required';
    }

    if (formData.expectedMinutes && parseInt(formData.expectedMinutes) <= 0) {
      newErrors.expectedMinutes = 'Expected minutes must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      console.log('Form Data:', formData);
      console.log('Audio Blob:', audioBlob);
      console.log('Audio URL:', audioUrl);
      console.log('Uploaded Files:', uploadedFiles);

      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Ticket created successfully!');

      // Redirect to tickets page
      router.push('/ticketmanagement/tickets');
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('Failed to create ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      router.back();
    }
  };

  return (
    <DashboardLayout>
      <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">
        <PageHeader
          title="Create New Ticket"
        />

        <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ticket Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Title - Full Width */}
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter ticket title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={errors.title ? 'border-destructive' : ''}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title}</p>
                  )}
                </div>

                {/* Two Column Grid */}
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  {/* Customer */}
                  <div className="space-y-2">
                    <Label htmlFor="customer">
                      Customer <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.customer}
                      onValueChange={(value) => handleInputChange('customer', value)}
                    >
                      <SelectTrigger id="customer" className={errors.customer ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer} value={customer}>
                            {customer}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.customer && (
                      <p className="text-sm text-destructive">{errors.customer}</p>
                    )}
                  </div>

                  {/* Product */}
                  <div className="space-y-2">
                    <Label htmlFor="product">
                      Product <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.product}
                      onValueChange={(value) => handleInputChange('product', value)}
                    >
                      <SelectTrigger id="product" className={errors.product ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product} value={product}>
                            {product}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.product && (
                      <p className="text-sm text-destructive">{errors.product}</p>
                    )}
                  </div>

                  {/* Module */}
                  <div className="space-y-2">
                    <Label htmlFor="module">
                      Module <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.module}
                      onValueChange={(value) => handleInputChange('module', value)}
                    >
                      <SelectTrigger id="module" className={errors.module ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select module" />
                      </SelectTrigger>
                      <SelectContent>
                        {modules.map((module) => (
                          <SelectItem key={module} value={module}>
                            {module}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.module && (
                      <p className="text-sm text-destructive">{errors.module}</p>
                    )}
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleInputChange('category', value)}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Priority */}
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => handleInputChange('priority', value)}
                    >
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Complexity */}
                  <div className="space-y-2">
                    <Label htmlFor="complexity">Complexity</Label>
                    <Select
                      value={formData.complexity}
                      onValueChange={(value) => handleInputChange('complexity', value)}
                    >
                      <SelectTrigger id="complexity">
                        <SelectValue placeholder="Select complexity" />
                      </SelectTrigger>
                      <SelectContent>
                        {complexities.map((complexity) => (
                          <SelectItem key={complexity} value={complexity}>
                            {complexity}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Expected Minutes */}
                  <div className="space-y-2">
                    <Label htmlFor="expectedMinutes">Expected Minutes</Label>
                    <Input
                      id="expectedMinutes"
                      type="number"
                      min="1"
                      placeholder="Enter expected minutes"
                      value={formData.expectedMinutes}
                      onChange={(e) => handleInputChange('expectedMinutes', e.target.value)}
                      className={errors.expectedMinutes ? 'border-destructive' : ''}
                    />
                    {errors.expectedMinutes && (
                      <p className="text-sm text-destructive">{errors.expectedMinutes}</p>
                    )}
                  </div>

                  {/* Expected Date */}
                  <div className="space-y-2">
                    <Label htmlFor="expectedDate">
                      Expected Date <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="expectedDate"
                      type="date"
                      value={formData.expectedDate}
                      onChange={(e) => handleInputChange('expectedDate', e.target.value)}
                      className={errors.expectedDate ? 'border-destructive' : ''}
                    />
                    {errors.expectedDate && (
                      <p className="text-sm text-destructive">{errors.expectedDate}</p>
                    )}
                  </div>
                </div>

                {/* Description - Full Width */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={6}
                    placeholder="Enter detailed description of the ticket"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Audio Recording */}
          <AudioRecorder
            onRecordingComplete={handleAudioComplete}
            onDelete={() => {
              setAudioBlob(null);
              setAudioUrl(null);
            }}
            maxDuration={300}
          />

          {/* File Attachments */}
          <FileUploader
            onFilesChange={handleFilesChange}
            maxFiles={10}
            maxSizeMB={10}
          />

          {/* Form Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? 'Creating...' : 'Create Ticket'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}