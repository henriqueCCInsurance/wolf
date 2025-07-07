import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  action,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}
    >
      <div className="relative mb-6">
        {/* Background circle */}
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-full blur-xl scale-150"></div>
        
        {/* Icon container */}
        <div className="relative bg-white dark:bg-gray-900 p-6 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
          <Icon className="w-12 h-12 text-gray-400 dark:text-gray-500" strokeWidth={1.5} />
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>
      
      <p className="text-sm text-gray-600 dark:text-gray-300 max-w-sm mb-6">
        {description}
      </p>
      
      {action && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={action.onClick}
          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium text-sm transition-colors"
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptyState;