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
    variant?: 'primary' | 'secondary' | 'outline';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  variant?: 'default' | 'centered' | 'compact';
  size?: 'sm' | 'md' | 'lg';
  illustration?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  action,
  secondaryAction,
  className = '',
  variant = 'default',
  size = 'md',
  illustration
}) => {
  const sizeClasses = {
    sm: {
      container: 'py-8 px-4',
      icon: 'w-8 h-8 p-4',
      iconSize: 'w-8 h-8',
      title: 'text-base',
      description: 'text-sm',
      spacing: 'mb-4'
    },
    md: {
      container: 'py-12 px-6',
      icon: 'w-12 h-12 p-6',
      iconSize: 'w-12 h-12',
      title: 'text-lg',
      description: 'text-sm',
      spacing: 'mb-6'
    },
    lg: {
      container: 'py-16 px-8',
      icon: 'w-16 h-16 p-8',
      iconSize: 'w-16 h-16',
      title: 'text-xl',
      description: 'text-base',
      spacing: 'mb-8'
    }
  };
  
  const variantClasses = {
    default: 'text-center',
    centered: 'text-center max-w-md mx-auto',
    compact: 'text-center'
  };
  
  const currentSize = sizeClasses[size];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`
        flex flex-col items-center justify-center 
        ${currentSize.container}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {/* Icon or Illustration */}
      <div className={`relative ${currentSize.spacing}`}>
        {illustration ? (
          <div className="relative">
            {illustration}
          </div>
        ) : (
          <>
            {/* Background blur effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-100 to-primary-200 dark:from-primary-900/20 dark:to-primary-800/20 rounded-full blur-2xl scale-150 opacity-60"></div>
            
            {/* Icon container */}
            <motion.div 
              className={`relative bg-white/80 dark:bg-gray-800/80 ${currentSize.icon} rounded-full shadow-lg border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Icon className={`${currentSize.iconSize} text-gray-400 dark:text-gray-500`} strokeWidth={1.5} />
            </motion.div>
          </>
        )}
      </div>
      
      {/* Title */}
      <motion.h3 
        className={`font-semibold text-gray-900 dark:text-gray-100 mb-2 ${currentSize.title}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        {title}
      </motion.h3>
      
      {/* Description */}
      <motion.p 
        className={`text-gray-600 dark:text-gray-300 max-w-sm ${currentSize.description} ${currentSize.spacing}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        {description}
      </motion.p>
      
      {/* Actions */}
      {(action || secondaryAction) && (
        <motion.div 
          className="flex flex-col sm:flex-row gap-3 items-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          {action && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.onClick}
              className={`
                px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
                ${action.variant === 'outline' 
                  ? 'border-2 border-primary-400 text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/20 focus:ring-primary-400'
                  : action.variant === 'secondary'
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 focus:ring-gray-400'
                  : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-md hover:shadow-lg focus:ring-primary-400'
                }
              `}
            >
              {action.label}
            </motion.button>
          )}
          
          {secondaryAction && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={secondaryAction.onClick}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              {secondaryAction.label}
            </motion.button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;

// EmptyState variants for specific use cases
export const CompactEmptyState: React.FC<Omit<EmptyStateProps, 'variant'>> = (props) => (
  <EmptyState variant="compact" size="sm" {...props} />
);

export const CenteredEmptyState: React.FC<Omit<EmptyStateProps, 'variant'>> = (props) => (
  <EmptyState variant="centered" {...props} />
);

export const LargeEmptyState: React.FC<Omit<EmptyStateProps, 'size'>> = (props) => (
  <EmptyState size="lg" {...props} />
);