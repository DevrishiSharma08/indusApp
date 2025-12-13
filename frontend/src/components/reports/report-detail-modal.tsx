'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

interface ReportDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    data: any[] | null;
    dataType: string;
}

export function ReportDetailModal({ isOpen, onClose, title, data, dataType }: ReportDetailModalProps) {
    if (!data || data.length === 0) return null;

    const renderTableContent = () => {
        switch (dataType) {
            case 'leads':
                return (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Company Name</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Assigned Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="font-medium">{item.company_name}</TableCell>
                                    <TableCell>{item.contact_name}</TableCell>
                                    <TableCell>{format(new Date(item.assigned_date), 'LLL dd, y')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                );

            case 'meetings':
            case 'demos':
                return (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Company Name</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="font-medium">{item.company_name}</TableCell>
                                    <TableCell>{format(new Date(item.date), 'LLL dd, y')}</TableCell>
                                    <TableCell>{item.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                );

            case 'activities':
                return (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Activity Type</TableHead>
                                <TableHead>Company</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="font-medium">{item.activity_type}</TableCell>
                                    <TableCell>{item.company_name}</TableCell>
                                    <TableCell>{format(new Date(item.date), 'LLL dd, y')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                );

            case 'tasks':
                return (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Task Title</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Completed Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item, idx) => (
                                <TableRow key={idx}>
                                    <TableCell className="font-medium">{item.title}</TableCell>
                                    <TableCell>{item.status}</TableCell>
                                    <TableCell>{format(new Date(item.completed_date), 'LLL dd, y')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                );

            default:
                return <p className="text-sm text-muted-foreground p-4">No data available</p>;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{title} Details</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    {renderTableContent()}
                </div>
            </DialogContent>
        </Dialog>
    );
}
