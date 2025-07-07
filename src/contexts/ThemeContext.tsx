import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAppStore } from '@/store';

type Theme = 'light' | 'dark';
type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { profile } = useAppStore();
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    return profile.theme || 'system';
  });
  
  const [theme, setThemeState] = useState<Theme>(() => {
    // If profile has a specific theme preference
    if (profile.theme === 'light' || profile.theme === 'dark') {
      return profile.theme;
    }
    
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('wolf-den-theme') as Theme;
    if (savedTheme) {
      return savedTheme;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Save theme preference
    localStorage.setItem('wolf-den-theme', theme);
  }, [theme]);

  useEffect(() => {
    // Listen for profile theme changes
    if (profile.theme) {
      setThemeModeState(profile.theme);
      if (profile.theme === 'light' || profile.theme === 'dark') {
        setThemeState(profile.theme);
      }
    }
  }, [profile.theme]);

  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if theme mode is set to system
      if (themeMode === 'system') {
        setThemeState(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };
  
  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    if (mode === 'light' || mode === 'dark') {
      setThemeState(mode);
    } else if (mode === 'system') {
      // Update to system preference
      const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeState(isDark ? 'dark' : 'light');
    }
  };

  const value: ThemeContextType = {
    theme,
    themeMode,
    toggleTheme,
    setTheme,
    setThemeMode
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;