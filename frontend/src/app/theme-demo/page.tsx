'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ThemeToggle, { SimpleThemeToggle, ThemeStatus } from '@/components/ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';
import { Palette, Sun, Moon, Monitor } from 'lucide-react';

export default function ThemeDemoPage() {
  const { theme, actualTheme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
            <Palette className="w-8 h-8 text-primary" />
            Theme Demo Page
          </h1>
          <p className="text-muted-foreground">
            Test the dark/light mode functionality and theme persistence
          </p>
        </div>

        {/* Current Theme Status */}
        <Card>
          <CardHeader>
            <CardTitle>Current Theme Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">User Preference</div>
                <div className="font-semibold capitalize flex items-center justify-center gap-2 mt-1">
                  {theme === 'system' && <Monitor className="w-4 h-4" />}
                  {theme === 'light' && <Sun className="w-4 h-4" />}
                  {theme === 'dark' && <Moon className="w-4 h-4" />}
                  {theme}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Applied Theme</div>
                <div className="font-semibold capitalize flex items-center justify-center gap-2 mt-1">
                  {actualTheme === 'light' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {actualTheme}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Persistence</div>
                <div className="font-semibold text-emerald-600 mt-1">
                  ✓ Saved to localStorage
                </div>
              </div>
            </div>
            <div className="pt-4 border-t">
              <ThemeStatus />
            </div>
          </CardContent>
        </Card>

        {/* Theme Toggle Components */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dropdown Toggle</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Full dropdown with all theme options
              </p>
              <ThemeToggle variant="dropdown" />
              <code className="text-xs bg-muted px-2 py-1 rounded">
                {`<ThemeToggle variant="dropdown" />`}
              </code>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Simple Toggle</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Simple light/dark toggle
              </p>
              <SimpleThemeToggle />
              <code className="text-xs bg-muted px-2 py-1 rounded">
                {`<SimpleThemeToggle />`}
              </code>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Icon Only</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Cycles through all themes
              </p>
              <ThemeToggle variant="icon-only" />
              <code className="text-xs bg-muted px-2 py-1 rounded">
                {`<ThemeToggle variant="icon-only" />`}
              </code>
            </CardContent>
          </Card>
        </div>

        {/* Quick Theme Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Theme Switch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => setTheme('light')}
                variant={theme === 'light' ? 'default' : 'outline'}
                className="flex items-center gap-2"
              >
                <Sun className="w-4 h-4" />
                Light
              </Button>
              <Button
                onClick={() => setTheme('dark')}
                variant={theme === 'dark' ? 'default' : 'outline'}
                className="flex items-center gap-2"
              >
                <Moon className="w-4 h-4" />
                Dark
              </Button>
              <Button
                onClick={() => setTheme('system')}
                variant={theme === 'system' ? 'default' : 'outline'}
                className="flex items-center gap-2"
              >
                <Monitor className="w-4 h-4" />
                System
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Theme Demonstration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Light Theme Elements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-4 bg-slate-100 rounded animate-pulse"></div>
                <div className="h-4 bg-slate-300 rounded animate-pulse"></div>
              </div>
              <Button>Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dark Theme Elements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-muted-foreground">
                This card automatically adapts to the current theme.
                Switch themes to see the difference!
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-muted-foreground">Muted background area</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p>Border container</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">For Users:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Click the theme toggle in the top bar</li>
                  <li>• Choose Light, Dark, or System theme</li>
                  <li>• Your preference is saved automatically</li>
                  <li>• System theme follows your OS preference</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">For Developers:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Use <code className="text-xs bg-muted px-1 rounded">useTheme()</code> hook</li>
                  <li>• Theme persists in localStorage</li>
                  <li>• Automatic system theme detection</li>
                  <li>• CSS variables update automatically</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}