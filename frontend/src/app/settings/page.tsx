'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, User, Bell, Shield, Palette, Monitor, Sun, Moon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import Tabs from '@/components/Tabs';
import { useTheme } from '@/contexts/ThemeContext';

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState<any>(null);

  // Get user from localStorage on client side only
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ];

  return (
    <DashboardLayout>
      <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="pills"
          className="mb-6"
        />

        <div className="max-w-4xl mx-auto">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-lg">
                      {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {user?.fullName || 'User'}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {user?.role || 'Employee'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="flex items-center space-x-3 p-4 rounded-lg hover:bg-muted/50 transition-colors text-left">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Profile Information</p>
                      <p className="text-sm text-muted-foreground">Update your personal details</p>
                    </div>
                  </button>

                  <button className="flex items-center space-x-3 p-4 rounded-lg hover:bg-muted/50 transition-colors text-left">
                    <Shield className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Security</p>
                      <p className="text-sm text-muted-foreground">Change password and security settings</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Preferences Section */}
              <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4">Preferences</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Auto-save</p>
                      <p className="text-sm text-muted-foreground">Automatically save your work</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-background after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Compact View</p>
                      <p className="text-sm text-muted-foreground">Use a more compact interface layout</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-background after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <div className="flex items-center space-x-3 mb-6">
                <Bell className="w-6 h-6 text-muted-foreground" />
                <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive notifications for important updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-background after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive email updates for tasks and projects</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-background after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <div className="flex items-center space-x-3 mb-6">
                <Palette className="w-6 h-6 text-muted-foreground" />
                <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
              </div>

              <div className="space-y-6">
                {/* Theme Selection */}
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3">Theme Mode</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose how the interface looks, or sync with your system settings
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Light Mode */}
                    <button
                      onClick={() => setTheme('light')}
                      className={`flex flex-col items-center space-y-3 p-4 rounded-lg border-2 transition-all ${
                        theme === 'light'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        theme === 'light' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        <Sun className="w-6 h-6" />
                      </div>
                      <div className="text-center">
                        <p className={`font-medium ${theme === 'light' ? 'text-primary' : 'text-foreground'}`}>
                          Light
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Bright and clean
                        </p>
                      </div>
                      {theme === 'light' && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </button>

                    {/* Dark Mode */}
                    <button
                      onClick={() => setTheme('dark')}
                      className={`flex flex-col items-center space-y-3 p-4 rounded-lg border-2 transition-all ${
                        theme === 'dark'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        theme === 'dark' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        <Moon className="w-6 h-6" />
                      </div>
                      <div className="text-center">
                        <p className={`font-medium ${theme === 'dark' ? 'text-primary' : 'text-foreground'}`}>
                          Dark
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Easy on the eyes
                        </p>
                      </div>
                      {theme === 'dark' && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </button>

                    {/* System Mode */}
                    <button
                      onClick={() => setTheme('system')}
                      className={`flex flex-col items-center space-y-3 p-4 rounded-lg border-2 transition-all ${
                        theme === 'system'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        theme === 'system' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        <Monitor className="w-6 h-6" />
                      </div>
                      <div className="text-center">
                        <p className={`font-medium ${theme === 'system' ? 'text-primary' : 'text-foreground'}`}>
                          System
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Follow device theme
                        </p>
                      </div>
                      {theme === 'system' && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </button>
                  </div>
                </div>

                {/* Info Box */}
                <div className="p-4 bg-muted/50 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Tip:</span> System theme will automatically switch between light and dark based on your device settings.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}