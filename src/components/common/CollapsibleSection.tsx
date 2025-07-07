import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CollapsibleSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
  badge?: string | number;
  priority?: 'high' | 'medium' | 'low';
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  subtitle,
  children,
  defaultExpanded = false,
  className = '',
  badge,
  priority
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const getPriorityColor = () => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm ${className}`}>
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-500" />
            )}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          </div>
          
          {/* Badges */}
          <div className="flex items-center space-x-2">
            {priority && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor()}`}>
                {priority.toUpperCase()}
              </span>
            )}
            
            {badge && (
              <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium">
                {badge}
              </span>
            )}
          </div>
        </div>
        
        {/* Expanded State Indicator */}
        <div className="flex items-center space-x-2">
          {!isExpanded && subtitle && (
            <span className="text-sm text-gray-500 hidden md:inline">{subtitle}</span>
          )}
          <div className={`w-2 h-2 rounded-full transition-colors ${
            isExpanded ? 'bg-primary-300' : 'bg-gray-300'
          }`} />
        </div>
      </button>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ 
              duration: 0.3, 
              ease: 'easeInOut',
              opacity: { duration: 0.2 }
            }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">
              {subtitle && (
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">{subtitle}</p>
              )}
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollapsibleSection;