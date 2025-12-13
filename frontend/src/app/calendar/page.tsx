'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar, ChevronLeft, ChevronRight, Users, Clock, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock team members
const teamMembers = [
  { id: '1', name: 'John Doe', role: 'Admin', department: 'Sales', color: 'bg-blue-500' },
  { id: '2', name: 'Jane Smith', role: 'Team Lead', department: 'Marketing', color: 'bg-purple-500' },
  { id: '3', name: 'Mike Johnson', role: 'Member', department: 'Sales', color: 'bg-green-500' },
  { id: '4', name: 'Emma Davis', role: 'Member', department: 'Support', color: 'bg-orange-500' },
];

// Mock events/meetings
const mockEvents = [
  {
    id: '1',
    title: 'Q4 Planning Meeting',
    date: '2025-12-13',
    startTime: '10:00',
    endTime: '11:30',
    attendees: ['1', '2', '3'],
    type: 'meeting',
    location: 'Conference Room A',
  },
  {
    id: '2',
    title: 'Client Presentation - ABC Corp',
    date: '2025-12-15',
    startTime: '14:00',
    endTime: '15:00',
    attendees: ['1', '2'],
    type: 'client',
    location: 'Virtual - Zoom',
  },
  {
    id: '3',
    title: 'Team Sync',
    date: '2025-12-13',
    startTime: '15:00',
    endTime: '16:00',
    attendees: ['2', '3', '4'],
    type: 'meeting',
    location: 'Conference Room B',
  },
];

export default function CalendarPage() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [selectedMembers, setSelectedMembers] = useState<string[]>(['1']);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getEventsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return mockEvents.filter(event => {
      if (event.date !== dateStr) return false;
      // Filter by selected members
      return event.attendees.some(attendee => selectedMembers.includes(attendee));
    });
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() &&
           month === today.getMonth() &&
           year === today.getFullYear();
  };

  const toggleMember = (memberId: string) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  const renderMonthView = () => {
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="min-h-24 border border-border bg-muted/20" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const events = getEventsForDate(day);
      const isTodayDate = isToday(day);

      days.push(
        <div
          key={day}
          className={cn(
            "min-h-24 border border-border p-1 hover:bg-muted/50 transition-colors cursor-pointer",
            isTodayDate && "bg-primary/5 border-primary"
          )}
          onClick={() => router.push(`/createtasks?date=${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`)}
        >
          <div className={cn(
            "text-xs font-medium mb-1",
            isTodayDate ? "text-primary font-bold" : "text-muted-foreground"
          )}>
            {day}
          </div>
          <div className="space-y-0.5">
            {events.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className={cn(
                  "text-[10px] p-1 rounded text-white truncate",
                  event.type === 'meeting' ? 'bg-blue-500' : 'bg-purple-500'
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  // Open event details
                }}
              >
                {event.startTime} {event.title}
              </div>
            ))}
            {events.length > 3 && (
              <div className="text-[10px] text-muted-foreground pl-1">
                +{events.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Team Calendar</h2>
            <p className="text-sm text-muted-foreground">
              Manage schedules, check availability, and book meetings
            </p>
          </div>
          <Button onClick={() => router.push('/createtasks')}>
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Event
          </Button>
        </div>

        {/* Calendar Controls & Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Month Navigation */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={previousMonth}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h3 className="font-semibold text-lg min-w-48 text-center">
                  {monthNames[month]} {year}
                </h3>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Today
                </Button>
              </div>

              {/* View Mode Tabs */}
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
                <TabsList>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="day">Day</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Team Member Filter */}
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Team Members:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {teamMembers.map((member) => (
                  <Badge
                    key={member.id}
                    variant={selectedMembers.includes(member.id) ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer transition-all",
                      selectedMembers.includes(member.id) && member.color
                    )}
                    onClick={() => toggleMember(member.id)}
                  >
                    {member.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Grid */}
        <Card>
          <CardContent className="p-4">
            {viewMode === 'month' && (
              <>
                {/* Day Names */}
                <div className="grid grid-cols-7 gap-px mb-px">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-px bg-border">
                  {renderMonthView()}
                </div>
              </>
            )}

            {viewMode === 'week' && (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Week view - Coming soon</p>
              </div>
            )}

            {viewMode === 'day' && (
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Day view with time slots - Coming soon</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Legend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Legend</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500"></div>
              <span className="text-xs">Team Meeting</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-purple-500"></div>
              <span className="text-xs">Client Meeting</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-primary"></div>
              <span className="text-xs">Today</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
