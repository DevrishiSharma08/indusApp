'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import ProfileDropdown from './ProfileDropdown';
import BottomNavigation from './BottomNavigation';
import SearchBar from './SearchBar';
import NotificationDropdown from './NotificationDropdown';
import CalendarDropdown from './CalendarDropdown';
import {
  Menu as MenuIcon
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border h-14 box-border">
        <div className="flex items-center justify-between h-full px-4">
          {/* Left Side */}
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">I</span>
              </div>
              <span className="font-semibold text-foreground hidden sm:block">Indus</span>
            </div>

            {/* Desktop Sidebar Toggle */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-2 rounded-lg hover:bg-accent"
            >
              <MenuIcon className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden sm:flex flex-1 max-w-md mx-4">
            <SearchBar
              placeholder="Search tasks, clients..."
              className="w-full"
            />
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Calendar Dropdown */}
            <CalendarDropdown />

            {/* Notification Dropdown */}
            <NotificationDropdown />

            {/* Profile Dropdown */}
            <ProfileDropdown />
          </div>
        </div>
      </div>

      {/* Sidebar for Desktop */}
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      {/* Main Content - Scrollable */}
      <div className={`flex-1 overflow-y-auto overflow-x-hidden pt-14 pb-16 lg:pb-6 transition-all duration-300 ml-0 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        <div className="px-3 lg:px-4">
          {children}
        </div>
      </div>

      {/* Bottom Navigation for Mobile - Fixed */}
      <BottomNavigation />
    </div>
  );
};

export default DashboardLayout;