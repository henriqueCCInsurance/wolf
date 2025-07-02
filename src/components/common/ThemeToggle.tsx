import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  showLabel = false 
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
        isDark 
          ? 'bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700' 
          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
      } ${className}`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <motion.div
        initial={false}
        animate={{ 
          rotate: isDark ? 180 : 0,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 0.3 },
          scale: { duration: 0.2 }
        }}
      >
        {isDark ? (
          <Moon className="w-4 h-4" />
        ) : (
          <Sun className="w-4 h-4" />
        )}
      </motion.div>
      
      {showLabel && (
        <span className="text-sm font-medium">
          {isDark ? 'Dark' : 'Light'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;