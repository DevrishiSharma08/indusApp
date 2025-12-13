'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  variant?: 'dropdown' | 'simple' | 'icon-only';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export default function ThemeToggle({
  variant = 'dropdown',
  size = 'default',
  className
}: ThemeToggleProps) {
  const { theme, actualTheme, setTheme, toggleTheme } = useTheme();

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  };

  const themeLabels = {
    light: 'Light Mode',
    dark: 'Dark Mode',
    system: 'System Theme',
  };

  // Simple toggle button (switches between light/dark only)
  if (variant === 'simple') {
    const CurrentIcon = actualTheme === 'light' ? Sun : Moon;

    return (
      <Button
        variant="ghost"
        size={size}
        onClick={toggleTheme}
        className={cn('w-9 h-9', className)}
        aria-label={`Switch to ${actualTheme === 'light' ? 'dark' : 'light'} mode`}
      >
        <CurrentIcon className="h-4 w-4" />
      </Button>
    );
  }

  // Icon-only button that shows current theme
  if (variant === 'icon-only') {
    const CurrentIcon = themeIcons[theme];

    return (
      <Button
        variant="ghost"
        size={size}
        onClick={() => {
          // Cycle through themes: light -> dark -> system -> light
          const themeOrder: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
          const currentIndex = themeOrder.indexOf(theme);
          const nextIndex = (currentIndex + 1) % themeOrder.length;
          setTheme(themeOrder[nextIndex]);
        }}
        className={cn('w-9 h-9', className)}
        aria-label={`Current theme: ${themeLabels[theme]}`}
      >
        <CurrentIcon className="h-4 w-4" />
      </Button>
    );
  }

  // Dropdown menu with all theme options
  const CurrentIcon = themeIcons[theme];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={size}
          className={cn('w-9 h-9', className)}
          aria-label="Toggle theme"
        >
          <CurrentIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className="flex items-center gap-2"
        >
          <Sun className="h-4 w-4" />
          <span>Light</span>
          {theme === 'light' && <div className="w-2 h-2 bg-primary rounded-full ml-auto" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className="flex items-center gap-2"
        >
          <Moon className="h-4 w-4" />
          <span>Dark</span>
          {theme === 'dark' && <div className="w-2 h-2 bg-primary rounded-full ml-auto" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className="flex items-center gap-2"
        >
          <Monitor className="h-4 w-4" />
          <span>System</span>
          {theme === 'system' && <div className="w-2 h-2 bg-primary rounded-full ml-auto" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Simplified component for mobile/compact areas
export function SimpleThemeToggle({ className }: { className?: string }) {
  return <ThemeToggle variant="simple" size="sm" className={className} />;
}

// Component that shows current theme status
export function ThemeStatus() {
  const { theme, actualTheme } = useTheme();

  const CurrentIcon = theme === 'system' ? Monitor : actualTheme === 'light' ? Sun : Moon;
  const label = theme === 'system' ? `System (${actualTheme})` : actualTheme === 'light' ? 'Light' : 'Dark';

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <CurrentIcon className="h-4 w-4" />
      <span>{label}</span>
    </div>
  );
}