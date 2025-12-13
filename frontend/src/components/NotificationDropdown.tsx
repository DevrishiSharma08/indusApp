'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCheck, AlertCircle, Calendar, User } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock current user
const currentUser = {
  id: '1',
  name: 'John Doe',
};

// Mock notifications data
const mockNotifications = [
  {
    id: '1',
    type: 'task',
    title: 'Task Due Today',
    message: 'Follow up with ABC Corp is due today',
    timestamp: '10 min ago',
    read: false,
    userId: '1',
  },
  {
    id: '2',
    type: 'task',
    title: 'New Task Assigned',
    message: 'You have been assigned to "Q4 Planning Meeting"',
    timestamp: '1 hour ago',
    read: false,
    userId: '1',
  },
  {
    id: '3',
    type: 'task',
    title: 'Task Overdue',
    message: 'Send proposal to XYZ Inc is overdue',
    timestamp: '2 hours ago',
    read: false,
    userId: '1',
  },
  {
    id: '4',
    type: 'message',
    title: 'New Message',
    message: 'Sarah sent you a message',
    timestamp: '3 hours ago',
    read: true,
    userId: '1',
  },
  {
    id: '5',
    type: 'reminder',
    title: 'Upcoming Meeting',
    message: 'Team sync meeting starts in 30 minutes',
    timestamp: '5 hours ago',
    read: true,
    userId: '1',
  },
];

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState(mockNotifications);

  // Filter notifications for current user
  const userNotifications = notifications.filter(n => n.userId === currentUser.id);
  const unreadCount = userNotifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'message':
        return <User className="w-4 h-4 text-blue-500" />;
      case 'reminder':
        return <Calendar className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 rounded-lg hover:bg-accent relative">
          <Bell className="w-5 h-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-3 border-b">
          <div>
            <h3 className="font-semibold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              <CheckCheck className="w-3 h-3" />
              Mark all read
            </button>
          )}
        </div>

        <ScrollArea className="h-96">
          {userNotifications.length > 0 ? (
            userNotifications.map((notification) => (
              <div key={notification.id}>
                <DropdownMenuItem
                  onClick={() => markAsRead(notification.id)}
                  className={cn(
                    "p-3 cursor-pointer focus:bg-muted",
                    !notification.read && "bg-muted/50"
                  )}
                >
                  <div className="flex gap-3 w-full">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-medium truncate">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <Badge variant="default" className="h-2 w-2 p-0 rounded-full" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.timestamp}
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-0" />
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 mx-auto mb-2 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          )}
        </ScrollArea>

        <div className="p-2 border-t">
          <button className="w-full text-center text-xs text-primary hover:underline py-2">
            View all notifications
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
