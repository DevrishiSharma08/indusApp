'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark'; // The actual theme being applied
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  // Get system theme preference
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Calculate actual theme based on user preference
  const calculateActualTheme = (userTheme: Theme): 'light' | 'dark' => {
    if (userTheme === 'system') {
      return getSystemTheme();
    }
    return userTheme;
  };

  // Set theme and update DOM
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    const actual = calculateActualTheme(newTheme);
    setActualTheme(actual);

    // Update localStorage
    localStorage.setItem('theme-preference', newTheme);

    // Update DOM
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(actual);

    // Update data attribute for compatibility
    root.setAttribute('data-theme', actual);
  };

  // Toggle between light and dark (skipping system)
  const toggleTheme = () => {
    const newTheme = actualTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Initialize theme on mount
  useEffect(() => {
    // Get saved theme or default to system
    const savedTheme = localStorage.getItem('theme-preference') as Theme;
    const initialTheme = savedTheme || 'system';

    const actual = calculateActualTheme(initialTheme);
    setThemeState(initialTheme);
    setActualTheme(actual);

    // Apply theme to DOM
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(actual);
    root.setAttribute('data-theme', actual);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        const newActual = getSystemTheme();
        setActualTheme(newActual);

        // Update DOM
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(newActual);
        root.setAttribute('data-theme', newActual);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, actualTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}