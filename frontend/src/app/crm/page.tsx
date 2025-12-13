'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, CheckSquare, Calendar, TrendingUp, Monitor, ClipboardList, CalendarCheck } from 'lucide-react';

// Mock data for dashboard stats
const mockStats = {
  totalLeads: 145,
  myLeads: 28,
  totalTasks: 15,
  totalEvents: 13,
  conversionRate: 23.5,
};

const mockLeadsByStatus = [
  { status: 'New', count: 45, color: 'bg-blue-500' },
  { status: 'Meeting Scheduled', count: 20, color: 'bg-cyan-500' },
  { status: 'Demo Done', count: 15, color: 'bg-purple-500' },
  { status: 'Won/Deal Done', count: 35, color: 'bg-green-500' },
  { status: 'Lost', count: 12, color: 'bg-red-500' }
];

const mockLeadsBySource = [
  { source: 'Website', count: 52, percentage: 36 },
  { source: 'Referral', count: 38, percentage: 26 },
  { source: 'Social Media', count: 29, percentage: 20 },
  { source: 'Cold Call', count: 18, percentage: 12 },
  { source: 'Others', count: 8, percentage: 6 }
];

// Today's schedule data with different types
const mockTodayMeetings = [
  { id: 1, company: 'ABC Corp', contact: 'John Doe', time: '10:00 AM', type: 'Discovery Call' },
  { id: 2, company: 'Tech Solutions', contact: 'Sarah Wilson', time: '02:30 PM', type: 'Follow-up' },
];

const mockTodayDemos = [
  { id: 1, company: 'XYZ Ltd', contact: 'Jane Smith', time: '11:00 AM', type: 'Product Demo' },
  { id: 2, company: 'Innovation Inc', contact: 'Bob Johnson', time: '04:00 PM', type: 'Technical Demo' },
];

const mockTodayActivities = [
  { id: 1, company: 'Global Systems', contact: 'Mike Davis', time: '09:00 AM', activity: 'Email Follow-up' },
  { id: 2, company: 'Smart Tech', contact: 'Lisa Brown', time: '01:00 PM', activity: 'WhatsApp Message' },
  { id: 3, company: 'Digital Corp', contact: 'Tom Wilson', time: '05:00 PM', activity: 'Phone Call' },
];

const mockTodayTasks = [
  { id: 1, task: 'Send proposal to ABC Corp', priority: 'High', due: '11:00 AM' },
  { id: 2, task: 'Prepare demo presentation', priority: 'Medium', due: '03:00 PM' },
  { id: 3, task: 'Follow up on quotation', priority: 'High', due: '06:00 PM' },
];

// Overdue data (missed meetings, demos, activities, tasks)
const mockOverdueMeetings = [
  { id: 1, company: 'Retail Corp', contact: 'Alex Johnson', time: 'Yesterday, 03:00 PM', type: 'Follow-up Call', daysOverdue: 1 },
];

const mockOverdueDemos = [
  { id: 1, company: 'Finance Ltd', contact: 'Emma Davis', time: '2 days ago, 11:00 AM', type: 'Product Demo', daysOverdue: 2 },
];

const mockOverdueActivities = [
  { id: 1, company: 'Marketing Inc', contact: 'Chris Brown', time: 'Yesterday, 10:00 AM', activity: 'Email Follow-up', daysOverdue: 1 },
  { id: 2, company: 'Sales Corp', contact: 'Nina Wilson', time: '3 days ago, 02:00 PM', activity: 'Phone Call', daysOverdue: 3 },
];

const mockOverdueTasks = [
  { id: 1, task: 'Send quotation to Finance Ltd', priority: 'High', due: 'Yesterday, 09:00 AM', daysOverdue: 1 },
  { id: 2, task: 'Follow up with Marketing Inc', priority: 'Medium', due: '2 days ago, 11:00 AM', daysOverdue: 2 },
];

export default function CRMDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data
    const userData = { username: 'User', role: 'admin' };
    setUser(userData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="space-y-2 lg:space-y-3">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 lg:space-y-3 py-3 lg:py-4">
      {/* Header */}
      <h2 className="text-xl sm:text-2xl font-bold text-foreground">CRM Dashboard</h2>

      {/* Ultra Compact KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <Link href="/crm/leads">
          <Card className="hover:shadow-md transition-shadow cursor-pointer bg-primary/5 border-primary/20">
            <CardContent className="p-2 lg:p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">
                    {user?.role === 'admin' ? 'Total Leads' : 'My Leads'}
                  </p>
                  <p className="text-lg lg:text-xl font-bold">
                    {user?.role === 'admin' ? mockStats.totalLeads : mockStats.myLeads}
                  </p>
                </div>
                <Users className="w-6 h-6 lg:w-7 lg:h-7 text-primary/50 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/crm/tasks">
          <Card className="hover:shadow-md transition-shadow cursor-pointer bg-blue-500/5 border-blue-500/20">
            <CardContent className="p-2 lg:p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">My Tasks</p>
                  <p className="text-lg lg:text-xl font-bold">{mockStats.totalTasks}</p>
                </div>
                <CheckSquare className="w-6 h-6 lg:w-7 lg:h-7 text-blue-500/50 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/crm/events">
          <Card className="hover:shadow-md transition-shadow cursor-pointer bg-purple-500/5 border-purple-500/20">
            <CardContent className="p-2 lg:p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">Events</p>
                  <p className="text-lg lg:text-xl font-bold">{mockStats.totalEvents}</p>
                </div>
                <Calendar className="w-6 h-6 lg:w-7 lg:h-7 text-purple-500/50 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card className="hover:shadow-md transition-shadow bg-green-500/5 border-green-500/20">
          <CardContent className="p-2 lg:p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground">Conversion</p>
                <p className="text-lg lg:text-xl font-bold">{mockStats.conversionRate}%</p>
              </div>
              <TrendingUp className="w-6 h-6 lg:w-7 lg:h-7 text-green-500/50 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
        {/* Lead Status Distribution */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-base">Lead Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
            <div className="space-y-3">
              {mockLeadsByStatus.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color} flex-shrink-0`} />
                    <span className="text-sm font-medium truncate">{item.status}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 sm:w-32 bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width: `${(item.count / mockStats.totalLeads) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold min-w-[2rem] text-right">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lead Source Distribution */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-base">Lead Source Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
            <div className="space-y-3">
              {mockLeadsBySource.map((item) => (
                <div key={item.source} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <span className="text-sm font-medium truncate">{item.source}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 sm:w-32 bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold min-w-[3rem] text-right">{item.count} ({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule with Tabs */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Schedule</CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-4 pt-0">
          <Tabs defaultValue="today" className="w-full">
            <TabsList className="w-full grid grid-cols-2 h-9 sm:h-10 mb-3">
              <TabsTrigger value="today" className="text-xs sm:text-sm">
                Today's Schedule
              </TabsTrigger>
              <TabsTrigger value="overdue" className="text-xs sm:text-sm">
                Overdue
              </TabsTrigger>
            </TabsList>

            {/* Today's Schedule Tab */}
            <TabsContent value="today" className="mt-0">
              <Tabs defaultValue="meetings" className="w-full">
                <TabsList className="w-full grid grid-cols-4 h-9 sm:h-10">
                  <TabsTrigger value="meetings" className="text-xs sm:text-sm">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="hidden sm:inline">Meetings</span>
                    <span className="sm:hidden">Meet</span>
                  </TabsTrigger>
                  <TabsTrigger value="demos" className="text-xs sm:text-sm">
                    <Monitor className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="hidden sm:inline">Demos</span>
                    <span className="sm:hidden">Demo</span>
                  </TabsTrigger>
                  <TabsTrigger value="activities" className="text-xs sm:text-sm">
                    <CalendarCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="hidden sm:inline">Activity</span>
                    <span className="sm:hidden">Act</span>
                  </TabsTrigger>
                  <TabsTrigger value="tasks" className="text-xs sm:text-sm">
                    <ClipboardList className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="hidden sm:inline">Tasks</span>
                    <span className="sm:hidden">Task</span>
                  </TabsTrigger>
                </TabsList>

            {/* Meetings Tab */}
            <TabsContent value="meetings" className="mt-2">
              <div className="space-y-2">
                {mockTodayMeetings.length > 0 ? (
                  mockTodayMeetings.map((meeting) => (
                    <div
                      key={meeting.id}
                      className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => router.push('/crm/events')}
                    >
                      <Users className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold truncate">{meeting.company}</p>
                          <span className="text-xs font-semibold text-primary flex-shrink-0">{meeting.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{meeting.contact}</p>
                        <p className="text-xs text-muted-foreground mt-1">Type: {meeting.type}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No meetings scheduled for today</p>
                )}
              </div>
            </TabsContent>

            {/* Demos Tab */}
            <TabsContent value="demos" className="mt-2">
              <div className="space-y-2">
                {mockTodayDemos.length > 0 ? (
                  mockTodayDemos.map((demo) => (
                    <div
                      key={demo.id}
                      className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => router.push('/crm/events')}
                    >
                      <Monitor className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold truncate">{demo.company}</p>
                          <span className="text-xs font-semibold text-primary flex-shrink-0">{demo.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{demo.contact}</p>
                        <p className="text-xs text-muted-foreground mt-1">Type: {demo.type}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No demos scheduled for today</p>
                )}
              </div>
            </TabsContent>

            {/* Activities Tab */}
            <TabsContent value="activities" className="mt-2">
              <div className="space-y-2">
                {mockTodayActivities.length > 0 ? (
                  mockTodayActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => router.push('/crm/activity')}
                    >
                      <CalendarCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold truncate">{activity.company}</p>
                          <span className="text-xs font-semibold text-primary flex-shrink-0">{activity.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{activity.contact}</p>
                        <p className="text-xs text-muted-foreground mt-1">Activity: {activity.activity}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No activities scheduled for today</p>
                )}
              </div>
            </TabsContent>

            {/* Tasks Tab */}
            <TabsContent value="tasks" className="mt-2">
              <div className="space-y-2">
                {mockTodayTasks.length > 0 ? (
                  mockTodayTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => router.push('/crm/tasks')}
                    >
                      <ClipboardList className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold truncate">{task.task}</p>
                          <span className="text-xs font-semibold text-primary flex-shrink-0">{task.due}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            task.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No tasks scheduled for today</p>
                )}
              </div>
            </TabsContent>
              </Tabs>
            </TabsContent>

            {/* Overdue Tab */}
            <TabsContent value="overdue" className="mt-0">
              <Tabs defaultValue="meetings" className="w-full">
                <TabsList className="w-full grid grid-cols-4 h-9 sm:h-10">
                  <TabsTrigger value="meetings" className="text-xs sm:text-sm">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="hidden sm:inline">Meetings</span>
                    <span className="sm:hidden">Meet</span>
                  </TabsTrigger>
                  <TabsTrigger value="demos" className="text-xs sm:text-sm">
                    <Monitor className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="hidden sm:inline">Demos</span>
                    <span className="sm:hidden">Demo</span>
                  </TabsTrigger>
                  <TabsTrigger value="activities" className="text-xs sm:text-sm">
                    <CalendarCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="hidden sm:inline">Activity</span>
                    <span className="sm:hidden">Act</span>
                  </TabsTrigger>
                  <TabsTrigger value="tasks" className="text-xs sm:text-sm">
                    <ClipboardList className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="hidden sm:inline">Tasks</span>
                    <span className="sm:hidden">Task</span>
                  </TabsTrigger>
                </TabsList>

                {/* Overdue Meetings */}
                <TabsContent value="meetings" className="mt-2">
                  <div className="space-y-2">
                    {mockOverdueMeetings.length > 0 ? (
                      mockOverdueMeetings.map((meeting) => (
                        <div
                          key={meeting.id}
                          className="flex items-start space-x-3 p-3 rounded-lg border border-red-200 bg-red-50/50 hover:bg-red-100/50 transition-colors cursor-pointer"
                          onClick={() => router.push('/crm/events')}
                        >
                          <Users className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-semibold truncate">{meeting.company}</p>
                              <span className="text-xs font-semibold text-red-600 flex-shrink-0">{meeting.daysOverdue}d overdue</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{meeting.contact}</p>
                            <p className="text-xs text-red-600 mt-1">Scheduled: {meeting.time}</p>
                            <p className="text-xs text-muted-foreground">Type: {meeting.type}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-8">No overdue meetings</p>
                    )}
                  </div>
                </TabsContent>

                {/* Overdue Demos */}
                <TabsContent value="demos" className="mt-2">
                  <div className="space-y-2">
                    {mockOverdueDemos.length > 0 ? (
                      mockOverdueDemos.map((demo) => (
                        <div
                          key={demo.id}
                          className="flex items-start space-x-3 p-3 rounded-lg border border-red-200 bg-red-50/50 hover:bg-red-100/50 transition-colors cursor-pointer"
                          onClick={() => router.push('/crm/events')}
                        >
                          <Monitor className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-semibold truncate">{demo.company}</p>
                              <span className="text-xs font-semibold text-red-600 flex-shrink-0">{demo.daysOverdue}d overdue</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{demo.contact}</p>
                            <p className="text-xs text-red-600 mt-1">Scheduled: {demo.time}</p>
                            <p className="text-xs text-muted-foreground">Type: {demo.type}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-8">No overdue demos</p>
                    )}
                  </div>
                </TabsContent>

                {/* Overdue Activities */}
                <TabsContent value="activities" className="mt-2">
                  <div className="space-y-2">
                    {mockOverdueActivities.length > 0 ? (
                      mockOverdueActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start space-x-3 p-3 rounded-lg border border-red-200 bg-red-50/50 hover:bg-red-100/50 transition-colors cursor-pointer"
                          onClick={() => router.push('/crm/tasks')}
                        >
                          <CalendarCheck className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-semibold truncate">{activity.company}</p>
                              <span className="text-xs font-semibold text-red-600 flex-shrink-0">{activity.daysOverdue}d overdue</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{activity.contact}</p>
                            <p className="text-xs text-red-600 mt-1">Scheduled: {activity.time}</p>
                            <p className="text-xs text-muted-foreground">Activity: {activity.activity}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-8">No overdue activities</p>
                    )}
                  </div>
                </TabsContent>

                {/* Overdue Tasks */}
                <TabsContent value="tasks" className="mt-2">
                  <div className="space-y-2">
                    {mockOverdueTasks.length > 0 ? (
                      mockOverdueTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-start space-x-3 p-3 rounded-lg border border-red-200 bg-red-50/50 hover:bg-red-100/50 transition-colors cursor-pointer"
                          onClick={() => router.push('/crm/tasks')}
                        >
                          <ClipboardList className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-semibold truncate">{task.task}</p>
                              <span className="text-xs font-semibold text-red-600 flex-shrink-0">{task.daysOverdue}d overdue</span>
                            </div>
                            <p className="text-xs text-red-600 mt-1">Due: {task.due}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                task.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {task.priority}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-8">No overdue tasks</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
