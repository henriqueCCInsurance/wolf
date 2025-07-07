import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  variant?: 'text' | 'card' | 'list' | 'profile';
  lines?: number;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  variant = 'text', 
  lines = 3,
  className = '' 
}) => {
  const shimmer = {
    initial: { x: '-100%' },
    animate: { x: '100%' },
    transition: { duration: 1.5, repeat: Infinity, ease: 'linear' }
  };

  const renderTextSkeleton = () => (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="relative overflow-hidden">
          <div 
            className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${
              index === lines - 1 ? 'w-3/4' : 'w-full'
            }`}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"
              {...shimmer}
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderCardSkeleton = () => (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <div className="relative overflow-hidden w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"
              {...shimmer}
            />
          </div>
          <div className="flex-1 space-y-2">
            <div className="relative overflow-hidden h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"
                {...shimmer}
              />
            </div>
            <div className="relative overflow-hidden h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"
                {...shimmer}
              />
            </div>
          </div>
        </div>
        
        {/* Content */}
        {renderTextSkeleton()}
        
        {/* Footer */}
        <div className="flex space-x-2 pt-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="relative overflow-hidden h-8 bg-gray-200 dark:bg-gray-700 rounded-md flex-1">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"
                {...shimmer}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderListSkeleton = () => (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="relative overflow-hidden w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"
              {...shimmer}
            />
          </div>
          <div className="flex-1 space-y-2">
            <div className="relative overflow-hidden h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"
                {...shimmer}
              />
            </div>
            <div className="relative overflow-hidden h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"
                {...shimmer}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderProfileSkeleton = () => (
    <div className={`flex items-center space-x-4 ${className}`}>
      <div className="relative overflow-hidden w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"
          {...shimmer}
        />
      </div>
      <div className="flex-1 space-y-2">
        <div className="relative overflow-hidden h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"
            {...shimmer}
          />
        </div>
        <div className="relative overflow-hidden h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"
            {...shimmer}
          />
        </div>
      </div>
    </div>
  );

  switch (variant) {
    case 'card':
      return renderCardSkeleton();
    case 'list':
      return renderListSkeleton();
    case 'profile':
      return renderProfileSkeleton();
    default:
      return renderTextSkeleton();
  }
};

export default SkeletonLoader;