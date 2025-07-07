import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  message = 'Loading...',
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const content = (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        {/* Outer ring */}
        <motion.div
          className={`${sizeClasses[size]} rounded-full border-2 border-gray-200 dark:border-gray-700`}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner spinning segment */}
        <motion.div
          className={`absolute inset-0 ${sizeClasses[size]} rounded-full border-2 border-transparent border-t-primary-500 border-r-primary-400`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-2 h-2 bg-primary-500 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>
      </div>
      
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-sm text-gray-600 dark:text-gray-300"
        >
          {message}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center"
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

export default LoadingSpinner;