'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock current user
const currentUser = {
  id: '1',
  name: 'John Doe',
  role: 'admin'
};

// Mock tasks with due dates
const mockTasks = [
  {
    id: '1',
    title: 'Follow up with ABC Corp',
    dueDate: new Date(2025, 11, 13), // Dec 13, 2025
    status: 'in-progress',
    userId: '1',
  },
  {
    id: '2',
    title: 'Send proposal to XYZ Inc',
    dueDate: new Date(2025, 11, 15),
    status: 'pending',
    userId: '1',
  },
  {
    id: '3',
    title: 'Q4 Planning Meeting',
    dueDate: new Date(2025, 11, 20),
    status: 'upcoming',
    userId: '1',
  },
];

const CalendarDropdown = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const getTasksForDate = (checkDate: Date) => {
    return mockTasks.filter(task =>
      task.userId === currentUser.id &&
      task.dueDate.toDateString() === checkDate.toDateString()
    );
  };

  const handleDayClick = (clickedDate: Date | undefined) => {
    if (!clickedDate) return;

    const tasks = getTasksForDate(clickedDate);

    if (tasks.length > 0) {
      // Navigate to tasks page with due date filter
      const dateStr = clickedDate.toISOString().split('T')[0];
      router.push(`/tasks?dueDate=${dateStr}`);
    } else {
      // Navigate to create task page with pre-filled date
      const dateStr = clickedDate.toISOString().split('T')[0];
      router.push(`/createtasks?date=${dateStr}`);
    }
  };

  // Modifiers for highlighting dates
  const modifiers = {
    hasTasks: (date: Date) => getTasksForDate(date).length > 0,
  };

  const modifiersClassNames = {
    hasTasks: 'bg-orange-500/10 border border-orange-500/30 font-medium hover:bg-orange-500/20',
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 rounded-lg hover:bg-accent relative">
          <CalendarIcon className="w-5 h-5 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDayClick}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          className="rounded-md border"
        />
        <div className="p-3 border-t space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary"></div>
            <span className="text-muted-foreground">Selected Date</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-500/10 border border-orange-500/30"></div>
            <span className="text-muted-foreground">Tasks Due</span>
          </div>
          <p className="text-muted-foreground pt-1">
            Click orange dates to view tasks, any date to schedule
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CalendarDropdown;
