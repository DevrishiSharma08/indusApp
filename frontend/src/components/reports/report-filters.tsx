'use client';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

interface ReportFiltersProps {
    users: Array<{ id: string; name: string }>;
    selectedUserId: string;
    onUserChange: (userId: string) => void;
    dateRange: DateRange | undefined;
    onDateChange: (range: DateRange | undefined) => void;
}

export function ReportFilters({
    users,
    selectedUserId,
    onUserChange,
    dateRange,
    onDateChange
}: ReportFiltersProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
                <Label className="text-xs">Select User</Label>
                <Select value={selectedUserId} onValueChange={onUserChange}>
                    <SelectTrigger className="h-9">
                        <SelectValue placeholder="Choose a team member" />
                    </SelectTrigger>
                    <SelectContent>
                        {users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                                {user.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label className="text-xs">Date Range</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full h-9 justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange?.from ? (
                                dateRange.to ? (
                                    <>
                                        {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                                    </>
                                ) : (
                                    format(dateRange.from, 'LLL dd, y')
                                )
                            ) : (
                                <span>Pick a date range</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="range"
                            selected={dateRange}
                            onSelect={onDateChange}
                            initialFocus
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}
