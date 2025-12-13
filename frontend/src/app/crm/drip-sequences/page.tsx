'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FilterExportBar from '@/components/FilterExportBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, MoreVertical, Eye, Edit, Trash2, Users, Check, ChevronsUpDown, X, Clock, Calendar, FileText, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Types
interface DripSequenceStep {
  id: string;
  message_id: string;
  message_name: string;
  day_to_send: number;
  time_to_send: string;
  sequence_order: number;
}

interface DripSequence {
  id: string;
  drip_name: string;
  drip_code: string;
  total_steps: number;
  active_leads: number;
  status: 'Active' | 'Inactive';
  created_date: string;
  created_by: string;
  steps: DripSequenceStep[];
}

interface MessageTemplate {
  id: string;
  message_name: string;
  message_code: string;
  message_type: 'Email' | 'WhatsApp' | 'SMS';
  message_content: string;
  created_date: string;
  created_by: string;
  uploaded_files?: string[];
  file_caption?: string;
}

interface Lead {
  id: string;
  company_name: string;
  email?: string;
  status: string;
}

// Mock data for Message Templates
const mockMessages: MessageTemplate[] = [
  {
    id: '1',
    message_name: 'Welcome Email',
    message_code: 'MSG001',
    message_type: 'Email',
    message_content: 'Dear {name},\n\nWelcome to {company}! We are excited to have you on board. Our team will reach out to you shortly to discuss how we can help transform your business.\n\nBest regards,\nThe Team',
    created_date: '2024-12-01',
    created_by: 'admin',
    uploaded_files: ['welcome_brochure.pdf', 'company_profile.pdf'],
    file_caption: 'Company introduction materials'
  },
  {
    id: '2',
    message_name: 'Follow-up WhatsApp',
    message_code: 'MSG002',
    message_type: 'WhatsApp',
    message_content: 'Hi {name},\n\nJust following up on our previous conversation. Have you had a chance to review our proposal?\n\nLet me know if you have any questions!',
    created_date: '2024-11-28',
    created_by: 'admin'
  },
  {
    id: '3',
    message_name: 'Demo Invitation',
    message_code: 'MSG003',
    message_type: 'Email',
    message_content: 'Dear {name},\n\nWe would like to invite you for a personalized product demonstration. Our solution can help {company} achieve:\n\n• Increased productivity\n• Reduced operational costs\n• Better customer satisfaction\n\nPlease let us know your preferred time slot.\n\nBest regards',
    created_date: '2024-11-20',
    created_by: 'admin'
  },
  {
    id: '4',
    message_name: 'Pricing Information SMS',
    message_code: 'MSG004',
    message_type: 'SMS',
    message_content: 'Hi {name}, Thank you for your interest! Our pricing starts from Rs. 50,000/- per module. Contact us for detailed quote. - Team',
    created_date: '2024-11-15',
    created_by: 'admin'
  },
  {
    id: '5',
    message_name: 'Case Study Email',
    message_code: 'MSG005',
    message_type: 'Email',
    message_content: 'Dear {name},\n\nThought you might find this case study interesting! We recently helped a company similar to {company} increase their efficiency by 40%.\n\nWould love to discuss how we can help you achieve similar results.\n\nView the full case study here: [Link]\n\nBest regards',
    created_date: '2024-11-10',
    created_by: 'admin'
  },
  {
    id: '6',
    message_name: 'Re-engagement WhatsApp',
    message_code: 'MSG006',
    message_type: 'WhatsApp',
    message_content: 'Hi {name},\n\nIt\'s been a while since we last connected. Are you still interested in improving your business operations?\n\nWe have some exciting new features that might interest {company}!',
    created_date: '2024-11-05',
    created_by: 'admin'
  },
  {
    id: '7',
    message_name: 'Thank You Email',
    message_code: 'MSG007',
    message_type: 'Email',
    message_content: 'Dear {name},\n\nThank you for taking the time to meet with us. We truly appreciate the opportunity to learn more about {company}\'s needs.\n\nAs discussed, I\'m sending over the information we talked about. Please feel free to reach out if you have any questions.\n\nLooking forward to working together!\n\nBest regards',
    created_date: '2024-11-01',
    created_by: 'admin'
  },
  {
    id: '8',
    message_name: 'Feature Update SMS',
    message_code: 'MSG008',
    message_type: 'SMS',
    message_content: 'Hi {name}! We just launched new features that can help {company}. Schedule a quick call to learn more: [link]',
    created_date: '2024-10-28',
    created_by: 'admin'
  },
  {
    id: '9',
    message_name: 'Trial Offer Email',
    message_code: 'MSG009',
    message_type: 'Email',
    message_content: 'Dear {name},\n\nExciting news! We\'re offering {company} a FREE 30-day trial of our complete platform.\n\nThis is a limited-time offer that includes:\n✓ Full platform access\n✓ Dedicated support\n✓ Free training sessions\n✓ No credit card required\n\nInterested? Let\'s get you started today!\n\nBest regards',
    created_date: '2024-10-25',
    created_by: 'admin'
  },
  {
    id: '10',
    message_name: 'Testimonial Share WhatsApp',
    message_code: 'MSG010',
    message_type: 'WhatsApp',
    message_content: 'Hi {name},\n\nOne of our clients just shared an amazing review! They mentioned how our solution helped them save 20 hours per week.\n\nThought this might resonate with the challenges at {company}. Would you like to see how we did it?',
    created_date: '2024-10-20',
    created_by: 'admin'
  },
];

// Mock data for Drip Sequences
const mockDripSequences: DripSequence[] = [
  {
    id: '1',
    drip_name: 'New Lead Onboarding',
    drip_code: 'DRP001',
    total_steps: 5,
    active_leads: 12,
    status: 'Active',
    created_date: '2024-12-01',
    created_by: 'admin',
    steps: [
      { id: '1', message_id: '1', message_name: 'Welcome Email', day_to_send: 0, time_to_send: '09:00', sequence_order: 1 },
      { id: '2', message_id: '3', message_name: 'Demo Invitation', day_to_send: 2, time_to_send: '10:00', sequence_order: 2 },
      { id: '3', message_id: '2', message_name: 'Follow-up WhatsApp', day_to_send: 4, time_to_send: '14:00', sequence_order: 3 },
      { id: '4', message_id: '4', message_name: 'Pricing Information SMS', day_to_send: 7, time_to_send: '11:00', sequence_order: 4 },
      { id: '5', message_id: '7', message_name: 'Thank You Email', day_to_send: 10, time_to_send: '09:30', sequence_order: 5 },
    ]
  },
  {
    id: '2',
    drip_name: 'Follow-up Campaign',
    drip_code: 'DRP002',
    total_steps: 3,
    active_leads: 8,
    status: 'Active',
    created_date: '2024-11-25',
    created_by: 'admin',
    steps: [
      { id: '6', message_id: '5', message_name: 'Case Study Email', day_to_send: 0, time_to_send: '09:00', sequence_order: 1 },
      { id: '7', message_id: '2', message_name: 'Follow-up WhatsApp', day_to_send: 3, time_to_send: '15:00', sequence_order: 2 },
      { id: '8', message_id: '9', message_name: 'Trial Offer Email', day_to_send: 7, time_to_send: '10:00', sequence_order: 3 },
    ]
  },
  {
    id: '3',
    drip_name: 'Re-engagement Series',
    drip_code: 'DRP003',
    total_steps: 4,
    active_leads: 0,
    status: 'Inactive',
    created_date: '2024-11-15',
    created_by: 'admin',
    steps: [
      { id: '9', message_id: '6', message_name: 'Re-engagement WhatsApp', day_to_send: 0, time_to_send: '11:00', sequence_order: 1 },
      { id: '10', message_id: '10', message_name: 'Testimonial Share WhatsApp', day_to_send: 3, time_to_send: '14:00', sequence_order: 2 },
      { id: '11', message_id: '8', message_name: 'Feature Update SMS', day_to_send: 5, time_to_send: '10:30', sequence_order: 3 },
      { id: '12', message_id: '9', message_name: 'Trial Offer Email', day_to_send: 7, time_to_send: '09:00', sequence_order: 4 },
    ]
  },
  {
    id: '4',
    drip_name: 'Product Demo Series',
    drip_code: 'DRP004',
    total_steps: 3,
    active_leads: 5,
    status: 'Active',
    created_date: '2024-11-10',
    created_by: 'admin',
    steps: [
      { id: '13', message_id: '3', message_name: 'Demo Invitation', day_to_send: 0, time_to_send: '10:00', sequence_order: 1 },
      { id: '14', message_id: '7', message_name: 'Thank You Email', day_to_send: 1, time_to_send: '09:00', sequence_order: 2 },
      { id: '15', message_id: '4', message_name: 'Pricing Information SMS', day_to_send: 3, time_to_send: '11:00', sequence_order: 3 },
    ]
  },
  {
    id: '5',
    drip_name: 'Enterprise Outreach',
    drip_code: 'DRP005',
    total_steps: 6,
    active_leads: 15,
    status: 'Active',
    created_date: '2024-11-05',
    created_by: 'admin',
    steps: [
      { id: '16', message_id: '1', message_name: 'Welcome Email', day_to_send: 0, time_to_send: '09:00', sequence_order: 1 },
      { id: '17', message_id: '5', message_name: 'Case Study Email', day_to_send: 2, time_to_send: '10:00', sequence_order: 2 },
      { id: '18', message_id: '3', message_name: 'Demo Invitation', day_to_send: 5, time_to_send: '11:00', sequence_order: 3 },
      { id: '19', message_id: '2', message_name: 'Follow-up WhatsApp', day_to_send: 7, time_to_send: '14:00', sequence_order: 4 },
      { id: '20', message_id: '9', message_name: 'Trial Offer Email', day_to_send: 10, time_to_send: '09:30', sequence_order: 5 },
      { id: '21', message_id: '7', message_name: 'Thank You Email', day_to_send: 14, time_to_send: '10:00', sequence_order: 6 },
    ]
  },
  {
    id: '6',
    drip_name: 'Quick Win Campaign',
    drip_code: 'DRP006',
    total_steps: 2,
    active_leads: 3,
    status: 'Active',
    created_date: '2024-10-30',
    created_by: 'admin',
    steps: [
      { id: '22', message_id: '8', message_name: 'Feature Update SMS', day_to_send: 0, time_to_send: '12:00', sequence_order: 1 },
      { id: '23', message_id: '2', message_name: 'Follow-up WhatsApp', day_to_send: 2, time_to_send: '15:00', sequence_order: 2 },
    ]
  },
];

// Mock leads data
const mockLeads: Lead[] = [
  { id: '1', company_name: 'Acme Corporation', email: 'contact@acme.com', status: 'New' },
  { id: '2', company_name: 'TechStart Inc', email: 'hello@techstart.com', status: 'Qualified' },
  { id: '3', company_name: 'Global Solutions Ltd', email: 'info@globalsol.com', status: 'New' },
  { id: '4', company_name: 'Innovative Systems', email: 'contact@innosys.com', status: 'Proposal Sent' },
  { id: '5', company_name: 'Digital Dynamics', email: 'sales@digitaldyn.com', status: 'New' },
  { id: '6', company_name: 'Future Enterprises', email: 'info@future-ent.com', status: 'Qualified' },
  { id: '7', company_name: 'Smart Industries', email: 'contact@smartind.com', status: 'New' },
  { id: '8', company_name: 'NextGen Services', email: 'hello@nextgen.com', status: 'Qualified' },
];

const statusOptions = [
  { label: 'All Status', value: 'all' },
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' }
];

const messageTypeOptions = [
  { label: 'All Types', value: 'all' },
  { label: 'Email', value: 'Email' },
  { label: 'WhatsApp', value: 'WhatsApp' },
  { label: 'SMS', value: 'SMS' }
];

const getStatusBadge = (status: string) => {
  return status === 'Active' ? 'default' : 'secondary';
};

const getMessageTypeBadge = (type: string) => {
  switch (type) {
    case 'Email':
      return 'default';
    case 'WhatsApp':
      return 'outline';
    case 'SMS':
      return 'secondary';
    default:
      return 'outline';
  }
};

export default function DripSequencesPage() {
  const [activeTab, setActiveTab] = useState('drips');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [messageTypeFilter, setMessageTypeFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // State for drip sequences and messages
  const [dripSequences, setDripSequences] = useState<DripSequence[]>(mockDripSequences);
  const [messageTemplates, setMessageTemplates] = useState<MessageTemplate[]>(mockMessages);
  const [leads, setLeads] = useState<Lead[]>(mockLeads);

  // Drip Sequence Modals
  const [showCreateDripModal, setShowCreateDripModal] = useState(false);
  const [showEditDripModal, setShowEditDripModal] = useState(false);
  const [showViewDripModal, setShowViewDripModal] = useState(false);
  const [showAssignDripModal, setShowAssignDripModal] = useState(false);
  const [selectedDrip, setSelectedDrip] = useState<DripSequence | null>(null);

  // Message Template Modals
  const [showCreateMessageModal, setShowCreateMessageModal] = useState(false);
  const [showEditMessageModal, setShowEditMessageModal] = useState(false);
  const [showViewMessageModal, setShowViewMessageModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<MessageTemplate | null>(null);

  // Drip Form State
  const [dripFormData, setDripFormData] = useState({
    drip_name: '',
    drip_code: '',
    status: 'Active' as 'Active' | 'Inactive',
    steps: [] as Array<{
      message_id: string;
      day_to_send: number;
      time_to_send: string;
      sequence_order: number;
    }>
  });

  // Message Form State
  const [messageFormData, setMessageFormData] = useState({
    message_name: '',
    message_code: '',
    message_type: 'Email' as 'Email' | 'WhatsApp' | 'SMS',
    message_content: '',
    uploaded_files: [] as File[],
    file_caption: ''
  });

  // Assign Drip State
  const [selectedLeads, setSelectedLeads] = useState<Lead[]>([]);
  const [leadSearchOpen, setLeadSearchOpen] = useState(false);

  const handleExport = (format: 'excel' | 'csv' | 'pdf') => {
    toast.success(`Exporting to ${format.toUpperCase()}`);
  };

  // Drip CRUD Operations
  const handleCreateDrip = () => {
    if (!dripFormData.drip_name || !dripFormData.drip_code) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (dripFormData.steps.length === 0) {
      toast.error('Please add at least one step to the drip sequence');
      return;
    }

    // Check for duplicate drip code
    if (dripSequences.some(d => d.drip_code === dripFormData.drip_code)) {
      toast.error('Drip code already exists');
      return;
    }

    const newDrip: DripSequence = {
      id: String(dripSequences.length + 1),
      drip_name: dripFormData.drip_name,
      drip_code: dripFormData.drip_code,
      total_steps: dripFormData.steps.length,
      active_leads: 0,
      status: dripFormData.status,
      created_date: new Date().toISOString().split('T')[0],
      created_by: 'admin',
      steps: dripFormData.steps.map((step, index) => {
        const message = messageTemplates.find(m => m.id === step.message_id);
        return {
          id: String(index + 1),
          message_id: step.message_id,
          message_name: message?.message_name || '',
          day_to_send: step.day_to_send,
          time_to_send: step.time_to_send,
          sequence_order: step.sequence_order
        };
      })
    };

    setDripSequences([...dripSequences, newDrip]);
    toast.success('Drip sequence created successfully');
    setShowCreateDripModal(false);
    resetDripForm();
  };

  const handleEditDrip = () => {
    if (!selectedDrip || !dripFormData.drip_name || !dripFormData.drip_code) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (dripFormData.steps.length === 0) {
      toast.error('Please add at least one step to the drip sequence');
      return;
    }

    // Check for duplicate drip code (excluding current drip)
    if (dripSequences.some(d => d.id !== selectedDrip.id && d.drip_code === dripFormData.drip_code)) {
      toast.error('Drip code already exists');
      return;
    }

    const updatedDrips = dripSequences.map(drip =>
      drip.id === selectedDrip.id
        ? {
          ...drip,
          drip_name: dripFormData.drip_name,
          drip_code: dripFormData.drip_code,
          status: dripFormData.status,
          total_steps: dripFormData.steps.length,
          steps: dripFormData.steps.map((step, index) => {
            const message = messageTemplates.find(m => m.id === step.message_id);
            return {
              id: String(index + 1),
              message_id: step.message_id,
              message_name: message?.message_name || '',
              day_to_send: step.day_to_send,
              time_to_send: step.time_to_send,
              sequence_order: step.sequence_order
            };
          })
        }
        : drip
    );

    setDripSequences(updatedDrips);
    toast.success('Drip sequence updated successfully');
    setShowEditDripModal(false);
    setSelectedDrip(null);
    resetDripForm();
  };

  const handleDeleteDrip = (drip: DripSequence) => {
    if (confirm(`Are you sure you want to delete "${drip.drip_name}"? This action cannot be undone.`)) {
      setDripSequences(dripSequences.filter(d => d.id !== drip.id));
      toast.success('Drip sequence deleted successfully');
    }
  };

  const resetDripForm = () => {
    setDripFormData({
      drip_name: '',
      drip_code: '',
      status: 'Active',
      steps: []
    });
  };

  const openEditDripModal = (drip: DripSequence) => {
    setSelectedDrip(drip);
    setDripFormData({
      drip_name: drip.drip_name,
      drip_code: drip.drip_code,
      status: drip.status,
      steps: drip.steps.map(step => ({
        message_id: step.message_id,
        day_to_send: step.day_to_send,
        time_to_send: step.time_to_send,
        sequence_order: step.sequence_order
      }))
    });
    setShowEditDripModal(true);
  };

  // Message CRUD Operations
  const handleCreateMessage = () => {
    if (!messageFormData.message_name || !messageFormData.message_code || !messageFormData.message_content) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Check for duplicate message code
    if (messageTemplates.some(m => m.message_code === messageFormData.message_code)) {
      toast.error('Message code already exists');
      return;
    }

    const newMessage: MessageTemplate = {
      id: String(messageTemplates.length + 1),
      message_name: messageFormData.message_name,
      message_code: messageFormData.message_code,
      message_type: messageFormData.message_type,
      message_content: messageFormData.message_content,
      created_date: new Date().toISOString().split('T')[0],
      created_by: 'admin'
    };

    setMessageTemplates([...messageTemplates, newMessage]);
    toast.success('Message template created successfully');
    setShowCreateMessageModal(false);
    resetMessageForm();
  };

  const handleEditMessage = () => {
    if (!selectedMessage || !messageFormData.message_name || !messageFormData.message_code || !messageFormData.message_content) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Check for duplicate message code (excluding current message)
    if (messageTemplates.some(m => m.id !== selectedMessage.id && m.message_code === messageFormData.message_code)) {
      toast.error('Message code already exists');
      return;
    }

    const updatedMessages = messageTemplates.map(msg =>
      msg.id === selectedMessage.id
        ? {
          ...msg,
          message_name: messageFormData.message_name,
          message_code: messageFormData.message_code,
          message_type: messageFormData.message_type,
          message_content: messageFormData.message_content
        }
        : msg
    );

    setMessageTemplates(updatedMessages);
    toast.success('Message template updated successfully');
    setShowEditMessageModal(false);
    setSelectedMessage(null);
    resetMessageForm();
  };

  const handleDeleteMessage = (message: MessageTemplate) => {
    // Check if message is used in any drip sequence
    const isUsedInDrip = dripSequences.some(drip =>
      drip.steps.some(step => step.message_id === message.id)
    );

    if (isUsedInDrip) {
      toast.error('Cannot delete message template. It is being used in one or more drip sequences.');
      return;
    }

    if (confirm(`Are you sure you want to delete "${message.message_name}"? This action cannot be undone.`)) {
      setMessageTemplates(messageTemplates.filter(m => m.id !== message.id));
      toast.success('Message template deleted successfully');
    }
  };

  const resetMessageForm = () => {
    setMessageFormData({
      message_name: '',
      message_code: '',
      message_type: 'Email',
      message_content: '',
      uploaded_files: [],
      file_caption: ''
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setMessageFormData({
        ...messageFormData,
        uploaded_files: [...messageFormData.uploaded_files, ...newFiles]
      });
    }
  };

  const removeFile = (index: number) => {
    setMessageFormData({
      ...messageFormData,
      uploaded_files: messageFormData.uploaded_files.filter((_, i) => i !== index)
    });
  };

  const openEditMessageModal = (message: MessageTemplate) => {
    setSelectedMessage(message);
    setMessageFormData({
      message_name: message.message_name,
      message_code: message.message_code,
      message_type: message.message_type,
      message_content: message.message_content,
      uploaded_files: [],
      file_caption: ''
    });
    setShowEditMessageModal(true);
  };

  // Drip Step Management
  const addDripStep = () => {
    const newStep = {
      message_id: '',
      day_to_send: 0,
      time_to_send: '09:00',
      sequence_order: dripFormData.steps.length + 1
    };
    setDripFormData({
      ...dripFormData,
      steps: [...dripFormData.steps, newStep]
    });
  };

  const removeDripStep = (index: number) => {
    const updatedSteps = dripFormData.steps.filter((_, i) => i !== index);
    // Reorder sequence_order
    const reorderedSteps = updatedSteps.map((step, i) => ({
      ...step,
      sequence_order: i + 1
    }));
    setDripFormData({
      ...dripFormData,
      steps: reorderedSteps
    });
  };

  const updateDripStep = (index: number, field: string, value: any) => {
    const updatedSteps = dripFormData.steps.map((step, i) =>
      i === index ? { ...step, [field]: value } : step
    );
    setDripFormData({
      ...dripFormData,
      steps: updatedSteps
    });
  };

  // Assign Drip to Leads
  const handleAssignDrip = () => {
    if (selectedLeads.length === 0) {
      toast.error('Please select at least one lead');
      return;
    }

    if (!selectedDrip) {
      toast.error('No drip sequence selected');
      return;
    }

    // Update active leads count
    const updatedDrips = dripSequences.map(drip =>
      drip.id === selectedDrip.id
        ? { ...drip, active_leads: drip.active_leads + selectedLeads.length }
        : drip
    );

    setDripSequences(updatedDrips);
    toast.success(`Drip sequence assigned to ${selectedLeads.length} lead(s) successfully`);
    setShowAssignDripModal(false);
    setSelectedDrip(null);
    setSelectedLeads([]);
  };

  const openAssignDripModal = (drip: DripSequence) => {
    setSelectedDrip(drip);
    setSelectedLeads([]);
    setShowAssignDripModal(true);
  };

  // Filtering
  const filteredDrips = dripSequences.filter(drip => {
    const matchesSearch = searchQuery === '' ||
      drip.drip_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drip.drip_code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || drip.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredMessages = messageTemplates.filter(msg => {
    const matchesSearch = searchQuery === '' ||
      msg.message_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message_code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = messageTypeFilter === 'all' || msg.message_type === messageTypeFilter;
    return matchesSearch && matchesType;
  });

  const router = useRouter();

  return (
    <div className="space-y-2 lg:space-y-3 py-3 lg:py-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Drip Sequences</h2>
        </div>
        <Button
          onClick={() => activeTab === 'drips' ? setShowCreateDripModal(true) : setShowCreateMessageModal(true)}
          className="flex items-center justify-center sm:space-x-2 sm:px-4 sm:py-2 bg-primary text-primary-foreground rounded-full sm:rounded-lg hover:bg-primary/90 transition-colors font-medium w-9 h-9 sm:w-auto sm:h-auto flex-shrink-0"
        >
          <Plus className="w-5 h-5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline text-sm">
            {activeTab === 'drips' ? 'Create Drip' : 'Create Message'}
          </span>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-2 lg:space-y-3">
        <TabsList className="w-full grid grid-cols-2 h-10">
          <TabsTrigger value="drips" className="text-xs sm:text-sm">Drip Sequences</TabsTrigger>
          <TabsTrigger value="messages" className="text-xs sm:text-sm">Message Templates</TabsTrigger>
        </TabsList>

        {/* Drip Sequences Tab */}
        <TabsContent value="drips">
          <Card className="border-border shadow-sm rounded-lg sm:rounded-xl">
            <div className="p-2 border-b border-border">
              <FilterExportBar
                filters={[
                  {
                    key: 'status',
                    label: 'Status',
                    options: statusOptions,
                    value: statusFilter,
                    onChange: setStatusFilter
                  }
                ]}
                onExport={handleExport}
                showViewToggle={true}
                viewToggleProps={{
                  currentView: viewMode,
                  onViewChange: setViewMode
                }}
                showSearch={true}
                searchProps={{
                  placeholder: 'Search drip sequences...',
                  value: searchQuery,
                  onChange: setSearchQuery
                }}
              />
            </div>

            <CardContent className="p-0">
              {filteredDrips.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-muted-foreground">
                  No drip sequences found
                </div>
              ) : viewMode === 'table' ? (
                /* Table View */
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Drip Name</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Steps</TableHead>
                        <TableHead>Active Leads</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDrips.map((drip) => (
                        <TableRow key={drip.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="font-medium">{drip.drip_name}</TableCell>
                          <TableCell className="text-sm">{drip.drip_code}</TableCell>
                          <TableCell className="text-sm">{drip.total_steps}</TableCell>
                          <TableCell className="text-sm font-semibold">{drip.active_leads}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadge(drip.status)} className="text-xs">
                              {drip.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{drip.created_date}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => { setSelectedDrip(drip); setShowViewDripModal(true); }}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openEditDripModal(drip)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Drip
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openAssignDripModal(drip)}>
                                  <Users className="w-4 h-4 mr-2" />
                                  Assign to Leads
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleDeleteDrip(drip)} className="text-destructive">
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
              ) : (
                /* Card View */
                <div className="p-2 sm:p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {filteredDrips.map((drip) => (
                    <Card key={drip.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Badge variant={getStatusBadge(drip.status)} className="text-xs px-1.5 py-0">
                                {drip.status}
                              </Badge>
                            </div>
                            <h3 className="text-sm font-semibold text-foreground line-clamp-1">{drip.drip_name}</h3>
                            <p className="text-xs text-muted-foreground">{drip.drip_code}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                                <MoreVertical className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setSelectedDrip(drip); setShowViewDripModal(true); }}>
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditDripModal(drip)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openAssignDripModal(drip)}>
                                <Users className="w-4 h-4 mr-2" />
                                Assign
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteDrip(drip)} className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="space-y-1.5 mt-3">
                          <div className="pt-1 border-t grid grid-cols-2 gap-2">
                            <div>
                              <div className="text-xs text-muted-foreground">Total Steps</div>
                              <div className="text-sm font-bold">{drip.total_steps}</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Active Leads</div>
                              <div className="text-sm font-bold">{drip.active_leads}</div>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground pt-1">
                            Created: {drip.created_date}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Message Templates Tab */}
        <TabsContent value="messages">
          <Card className="border-border shadow-sm rounded-lg sm:rounded-xl">
            <div className="p-2 border-b border-border">
              <FilterExportBar
                filters={[
                  {
                    key: 'messageType',
                    label: 'Type',
                    options: messageTypeOptions,
                    value: messageTypeFilter,
                    onChange: setMessageTypeFilter
                  }
                ]}
                onExport={handleExport}
                showViewToggle={true}
                viewToggleProps={{
                  currentView: viewMode,
                  onViewChange: setViewMode
                }}
                showSearch={true}
                searchProps={{
                  placeholder: 'Search messages...',
                  value: searchQuery,
                  onChange: setSearchQuery
                }}
              />
            </div>

            <CardContent className="p-0">
              {filteredMessages.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-muted-foreground">
                  No message templates found
                </div>
              ) : viewMode === 'table' ? (
                /* Table View */
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Message Name</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Content Preview</TableHead>
                        <TableHead>Created Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMessages.map((msg) => (
                        <TableRow key={msg.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="font-medium">{msg.message_name}</TableCell>
                          <TableCell className="text-sm">{msg.message_code}</TableCell>
                          <TableCell>
                            <Badge variant={getMessageTypeBadge(msg.message_type)} className="text-xs">
                              {msg.message_type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                            {msg.message_content}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{msg.created_date}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => { setSelectedMessage(msg); setShowViewMessageModal(true); }}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Full Message
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openEditMessageModal(msg)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Message
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleDeleteMessage(msg)} className="text-destructive">
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
              ) : (
                /* Card View */
                <div className="p-2 sm:p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {filteredMessages.map((msg) => (
                    <Card key={msg.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Badge variant={getMessageTypeBadge(msg.message_type)} className="text-xs px-1.5 py-0">
                                {msg.message_type}
                              </Badge>
                            </div>
                            <h3 className="text-sm font-semibold text-foreground line-clamp-1">{msg.message_name}</h3>
                            <p className="text-xs text-muted-foreground">{msg.message_code}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                                <MoreVertical className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setSelectedMessage(msg); setShowViewMessageModal(true); }}>
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditMessageModal(msg)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteMessage(msg)} className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="space-y-1.5 mt-2">
                          <div className="text-xs text-muted-foreground line-clamp-3 pt-1 border-t">
                            {msg.message_content}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Created: {msg.created_date}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Drip Modal */}
      <Dialog open={showCreateDripModal} onOpenChange={(open) => { setShowCreateDripModal(open); if (!open) resetDripForm(); }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Drip Sequence</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="drip_name">Drip Name <span className="text-destructive">*</span></Label>
              <Input
                id="drip_name"
                placeholder="e.g., Welcome Series"
                value={dripFormData.drip_name}
                onChange={(e) => setDripFormData({ ...dripFormData, drip_name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="drip_code">Drip Code <span className="text-destructive">*</span></Label>
                <Input
                  id="drip_code"
                  placeholder="e.g., WEL001"
                  value={dripFormData.drip_code}
                  onChange={(e) => setDripFormData({ ...dripFormData, drip_code: e.target.value.toUpperCase() })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={dripFormData.status} onValueChange={(value: 'Active' | 'Inactive') => setDripFormData({ ...dripFormData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between">
                <Label className="text-base">Drip Steps <span className="text-destructive">*</span></Label>
                <Button type="button" variant="outline" size="sm" onClick={addDripStep}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Step
                </Button>
              </div>

              {dripFormData.steps.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-4 border-2 border-dashed rounded-lg">
                  No steps added yet. Click "Add Step" to create your first step.
                </div>
              )}

              <div className="space-y-3">
                {dripFormData.steps.map((step, index) => (
                  <Card key={index} className="p-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs">Message Template</Label>
                          <Select
                            value={step.message_id}
                            onValueChange={(value) => updateDripStep(index, 'message_id', value)}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select message" />
                            </SelectTrigger>
                            <SelectContent>
                              {messageTemplates.map(msg => (
                                <SelectItem key={msg.id} value={msg.id}>
                                  {msg.message_name} ({msg.message_type})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Days After Start
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            className="h-9"
                            value={step.day_to_send}
                            onChange={(e) => updateDripStep(index, 'day_to_send', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Time to Send
                          </Label>
                          <Input
                            type="time"
                            className="h-9"
                            value={step.time_to_send}
                            onChange={(e) => updateDripStep(index, 'time_to_send', e.target.value)}
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeDripStep(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateDrip}>Create Drip Sequence</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Drip Modal */}
      <Dialog open={showEditDripModal} onOpenChange={(open) => { setShowEditDripModal(open); if (!open) { setSelectedDrip(null); resetDripForm(); } }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Drip Sequence</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit_drip_name">Drip Name <span className="text-destructive">*</span></Label>
              <Input
                id="edit_drip_name"
                placeholder="e.g., Welcome Series"
                value={dripFormData.drip_name}
                onChange={(e) => setDripFormData({ ...dripFormData, drip_name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_drip_code">Drip Code <span className="text-destructive">*</span></Label>
                <Input
                  id="edit_drip_code"
                  placeholder="e.g., WEL001"
                  value={dripFormData.drip_code}
                  onChange={(e) => setDripFormData({ ...dripFormData, drip_code: e.target.value.toUpperCase() })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_status">Status</Label>
                <Select value={dripFormData.status} onValueChange={(value: 'Active' | 'Inactive') => setDripFormData({ ...dripFormData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between">
                <Label className="text-base">Drip Steps <span className="text-destructive">*</span></Label>
                <Button type="button" variant="outline" size="sm" onClick={addDripStep}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Step
                </Button>
              </div>

              {dripFormData.steps.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-4 border-2 border-dashed rounded-lg">
                  No steps added yet. Click "Add Step" to create your first step.
                </div>
              )}

              <div className="space-y-3">
                {dripFormData.steps.map((step, index) => (
                  <Card key={index} className="p-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs">Message Template</Label>
                          <Select
                            value={step.message_id}
                            onValueChange={(value) => updateDripStep(index, 'message_id', value)}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select message" />
                            </SelectTrigger>
                            <SelectContent>
                              {messageTemplates.map(msg => (
                                <SelectItem key={msg.id} value={msg.id}>
                                  {msg.message_name} ({msg.message_type})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Days After Start
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            className="h-9"
                            value={step.day_to_send}
                            onChange={(e) => updateDripStep(index, 'day_to_send', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Time to Send
                          </Label>
                          <Input
                            type="time"
                            className="h-9"
                            value={step.time_to_send}
                            onChange={(e) => updateDripStep(index, 'time_to_send', e.target.value)}
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeDripStep(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEditDrip}>Update Drip Sequence</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Drip Details Modal */}
      <Dialog open={showViewDripModal} onOpenChange={(open) => { setShowViewDripModal(open); if (!open) setSelectedDrip(null); }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Drip Sequence Details</DialogTitle>
          </DialogHeader>
          {selectedDrip && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Drip Name</Label>
                  <p className="text-sm font-medium">{selectedDrip.drip_name}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Drip Code</Label>
                  <p className="text-sm font-medium">{selectedDrip.drip_code}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <Badge variant={getStatusBadge(selectedDrip.status)}>{selectedDrip.status}</Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Active Leads</Label>
                  <p className="text-sm font-medium">{selectedDrip.active_leads}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Total Steps</Label>
                  <p className="text-sm font-medium">{selectedDrip.total_steps}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Created Date</Label>
                  <p className="text-sm font-medium">{selectedDrip.created_date}</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <Label className="text-base">Sequence Steps</Label>
                <div className="space-y-2">
                  {selectedDrip.steps.map((step, index) => (
                    <Card key={step.id} className="p-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold">{step.message_name}</h4>
                          <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Day {step.day_to_send}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {step.time_to_send}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Assign Drip to Leads Modal */}
      <Dialog open={showAssignDripModal} onOpenChange={(open) => { setShowAssignDripModal(open); if (!open) { setSelectedDrip(null); setSelectedLeads([]); } }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assign Drip to Leads</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Leads</Label>
              <Popover open={leadSearchOpen} onOpenChange={setLeadSearchOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={leadSearchOpen} className="w-full justify-between">
                    <span className="truncate">
                      {selectedLeads.length > 0 ? `${selectedLeads.length} lead(s) selected` : "Select leads..."}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search leads by company name..." />
                    <CommandList>
                      <CommandEmpty>No leads found.</CommandEmpty>
                      <CommandGroup>
                        {leads.map((lead) => {
                          const isSelected = selectedLeads.some(sl => sl.id === lead.id);
                          return (
                            <CommandItem
                              key={lead.id}
                              value={lead.company_name}
                              onSelect={() => {
                                if (isSelected) {
                                  setSelectedLeads(selectedLeads.filter(sl => sl.id !== lead.id));
                                } else {
                                  setSelectedLeads([...selectedLeads, lead]);
                                }
                              }}
                            >
                              <Check className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
                              <div className="flex-1">
                                <div className="font-medium">{lead.company_name}</div>
                                {lead.email && <div className="text-xs text-muted-foreground">{lead.email}</div>}
                              </div>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {selectedLeads.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Selected Leads ({selectedLeads.length})</Label>
                <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg max-h-40 overflow-y-auto">
                  {selectedLeads.map(lead => (
                    <Badge key={lead.id} variant="secondary" className="pl-2 pr-1">
                      {lead.company_name}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 hover:bg-destructive/20"
                        onClick={() => setSelectedLeads(selectedLeads.filter(sl => sl.id !== lead.id))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleAssignDrip} disabled={selectedLeads.length === 0}>
              Assign to {selectedLeads.length || ''} Lead(s)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Message Modal */}
      <Dialog open={showCreateMessageModal} onOpenChange={(open) => { setShowCreateMessageModal(open); if (!open) resetMessageForm(); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Message Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="message_name">Message Name <span className="text-destructive">*</span></Label>
              <Input
                id="message_name"
                placeholder="e.g., Initial Contact"
                value={messageFormData.message_name}
                onChange={(e) => setMessageFormData({ ...messageFormData, message_name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="message_type">Message Type <span className="text-destructive">*</span></Label>
                <Select value={messageFormData.message_type} onValueChange={(value: 'Email' | 'WhatsApp' | 'SMS') => setMessageFormData({ ...messageFormData, message_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                    <SelectItem value="SMS">SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message_code">Message Code <span className="text-destructive">*</span></Label>
                <Input
                  id="message_code"
                  placeholder="e.g., MSG001"
                  value={messageFormData.message_code}
                  onChange={(e) => setMessageFormData({ ...messageFormData, message_code: e.target.value.toUpperCase() })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message_content">
                Message Content <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="message_content"
                placeholder="Enter your message content here..."
                rows={6}
                value={messageFormData.message_content}
                onChange={(e) => setMessageFormData({ ...messageFormData, message_content: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message_files">Attachments</Label>
              <Input
                id="message_files"
                type="file"
                multiple
                accept="*/*"
                className="cursor-pointer"
                onChange={handleFileUpload}
              />

              {messageFormData.uploaded_files.length > 0 && (
                <div className="mt-3 space-y-2">
                  <Label className="text-xs text-muted-foreground">Uploaded Files ({messageFormData.uploaded_files.length})</Label>
                  <div className="space-y-1.5">
                    {messageFormData.uploaded_files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded border">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm truncate">{file.name}</span>
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive hover:bg-destructive/10 flex-shrink-0"
                          onClick={() => removeFile(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="file_caption">File Caption</Label>
              <Input
                id="file_caption"
                placeholder="Add a caption for your attachments..."
                value={messageFormData.file_caption}
                onChange={(e) => setMessageFormData({ ...messageFormData, file_caption: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateMessage}>Create Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Message Modal */}
      <Dialog open={showEditMessageModal} onOpenChange={(open) => { setShowEditMessageModal(open); if (!open) { setSelectedMessage(null); resetMessageForm(); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Message Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit_message_name">Message Name <span className="text-destructive">*</span></Label>
              <Input
                id="edit_message_name"
                placeholder="e.g., Initial Contact"
                value={messageFormData.message_name}
                onChange={(e) => setMessageFormData({ ...messageFormData, message_name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_message_type">Message Type <span className="text-destructive">*</span></Label>
                <Select value={messageFormData.message_type} onValueChange={(value: 'Email' | 'WhatsApp' | 'SMS') => setMessageFormData({ ...messageFormData, message_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                    <SelectItem value="SMS">SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_message_code">Message Code <span className="text-destructive">*</span></Label>
                <Input
                  id="edit_message_code"
                  placeholder="e.g., MSG001"
                  value={messageFormData.message_code}
                  onChange={(e) => setMessageFormData({ ...messageFormData, message_code: e.target.value.toUpperCase() })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_message_content">
                Message Content <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="edit_message_content"
                placeholder="Enter your message content here..."
                rows={8}
                value={messageFormData.message_content}
                onChange={(e) => setMessageFormData({ ...messageFormData, message_content: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use placeholders: <code className="bg-muted px-1 py-0.5 rounded">{'{ name}'}</code> for contact name, <code className="bg-muted px-1 py-0.5 rounded">{'{ company}'}</code> for company name
              </p>
            </div>

            {selectedMessage?.uploaded_files && selectedMessage.uploaded_files.length > 0 && (
              <div className="space-y-2 pt-2 border-t">
                <Label className="text-sm">Existing Files ({selectedMessage.uploaded_files.length})</Label>
                <div className="space-y-1.5">
                  {selectedMessage.uploaded_files.map((fileName, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded border">
                      <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm">{fileName}</span>
                    </div>
                  ))}
                </div>
                {selectedMessage.file_caption && (
                  <div className="mt-2">
                    <Label className="text-xs text-muted-foreground">Caption:</Label>
                    <p className="text-sm mt-1">{selectedMessage.file_caption}</p>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleEditMessage}>Update Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Message Modal */}
      <Dialog open={showViewMessageModal} onOpenChange={(open) => { setShowViewMessageModal(open); if (!open) setSelectedMessage(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Message Template Details</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Message Name</Label>
                  <p className="text-sm font-medium">{selectedMessage.message_name}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Message Code</Label>
                  <p className="text-sm font-medium">{selectedMessage.message_code}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Message Type</Label>
                  <div className="mt-1">
                    <Badge variant={getMessageTypeBadge(selectedMessage.message_type)}>{selectedMessage.message_type}</Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Created Date</Label>
                  <p className="text-sm font-medium">{selectedMessage.created_date}</p>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Label className="text-sm">Message Content</Label>
                <div className="bg-muted/50 p-4 rounded-lg whitespace-pre-wrap text-sm">
                  {selectedMessage.message_content}
                </div>
              </div>

              {selectedMessage.uploaded_files && selectedMessage.uploaded_files.length > 0 && (
                <div className="space-y-2 pt-4 border-t">
                  <Label className="text-sm">Uploaded Files ({selectedMessage.uploaded_files.length})</Label>
                  <div className="space-y-1.5">
                    {selectedMessage.uploaded_files.map((fileName, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded border">
                        <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm">{fileName}</span>
                      </div>
                    ))}
                  </div>
                  {selectedMessage.file_caption && (
                    <div className="mt-2">
                      <Label className="text-xs text-muted-foreground">Caption:</Label>
                      <p className="text-sm mt-1">{selectedMessage.file_caption}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
