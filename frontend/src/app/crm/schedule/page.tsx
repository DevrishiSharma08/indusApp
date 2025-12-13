'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar, Users, Monitor, Phone, CheckSquare } from 'lucide-react';

// Mock data for the week
const mockSchedule = [
  { id: '1', type: 'Meeting', title: 'Product Demo', lead: 'ABC Corp', date: '2024-12-09', time: '10:00 AM', duration: '1h' },
  { id: '2', type: 'Call', title: 'Follow-up Call', lead: 'XYZ Ltd', date: '2024-12-09', time: '02:00 PM', duration: '30m' },
  { id: '3', type: 'Demo', title: 'Feature Demo', lead: 'Tech Solutions', date: '2024-12-10', time: '11:00 AM', duration: '1.5h' },
  { id: '4', type: 'Meeting', title: 'Requirements', lead: 'InnovateCo', date: '2024-12-10', time: '03:00 PM', duration: '1h' },
  { id: '5', type: 'Task', title: 'Send Proposal', lead: 'StartupHub', date: '2024-12-11', time: '09:00 AM', duration: '2h' },
];

const getActivityIcon = (type: string) => {
  const icons: any = {
    'Meeting': <Users className="w-3.5 h-3.5 text-blue-500" />,
    'Demo': <Monitor className="w-3.5 h-3.5 text-purple-500" />,
    'Call': <Phone className="w-3.5 h-3.5 text-green-500" />,
    'Task': <CheckSquare className="w-3.5 h-3.5 text-orange-500" />
  };
  return icons[type] || <Calendar className="w-3.5 h-3.5 text-muted-foreground" />;
};

const getActivityColor = (type: string) => {
  const colors: any = {
    'Meeting': 'bg-blue-100 border-blue-300 text-blue-700',
    'Demo': 'bg-purple-100 border-purple-300 text-purple-700',
    'Call': 'bg-green-100 border-green-300 text-green-700',
    'Task': 'bg-orange-100 border-orange-300 text-orange-700'
  };
  return colors[type] || 'bg-gray-100 border-gray-300 text-gray-700';
};

export default function SchedulePage() {
  const [currentWeek, setCurrentWeek] = useState('Dec 9 - Dec 15, 2024');

  const weekDays = [
    { date: '09', day: 'Mon', fullDate: '2024-12-09' },
    { date: '10', day: 'Tue', fullDate: '2024-12-10' },
    { date: '11', day: 'Wed', fullDate: '2024-12-11' },
    { date: '12', day: 'Thu', fullDate: '2024-12-12' },
    { date: '13', day: 'Fri', fullDate: '2024-12-13' },
  ];

  const getEventsForDay = (date: string) => {
    return mockSchedule.filter(event => event.date === date);
  };

  return (
    <div className="space-y-3 lg:space-y-4 py-3 lg:py-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Schedule</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Today
          </Button>
        </div>
      </div>

      {/* Week Navigation */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <CardTitle className="text-base">{currentWeek}</CardTitle>
            <Button variant="ghost" size="sm">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Week View */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 lg:gap-3">
        {weekDays.map((day) => {
          const events = getEventsForDay(day.fullDate);
          const isToday = day.fullDate === '2024-12-09'; // Mock today

          return (
            <Card key={day.fullDate} className={`${isToday ? 'border-primary' : ''}`}>
              <CardHeader className="pb-2">
                <div className="text-center">
                  <div className={`text-xs font-medium ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                    {day.day}
                  </div>
                  <div className={`text-2xl font-bold ${isToday ? 'text-primary' : ''}`}>
                    {day.date}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {events.length > 0 ? (
                  events.map((event) => (
                    <div
                      key={event.id}
                      className={`p-2 rounded-lg border cursor-pointer hover:shadow-sm transition-shadow ${getActivityColor(event.type)}`}
                    >
                      <div className="flex items-start gap-1.5 mb-1">
                        {getActivityIcon(event.type)}
                        <span className="text-xs font-semibold line-clamp-1">{event.title}</span>
                      </div>
                      <div className="text-xs opacity-90 truncate">{event.lead}</div>
                      <div className="text-xs font-medium mt-1">{event.time}</div>
                      <div className="text-xs opacity-75">{event.duration}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-xs text-muted-foreground">
                    No events
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Upcoming Events Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockSchedule.slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-center justify-between p-2 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getActivityIcon(event.type)}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{event.title}</div>
                    <div className="text-xs text-muted-foreground">{event.lead}</div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-medium">{event.time}</div>
                  <div className="text-xs text-muted-foreground">{event.date}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
