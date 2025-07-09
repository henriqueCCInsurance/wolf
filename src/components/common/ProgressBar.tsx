import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  striped?: boolean;
  showValue?: boolean;
  label?: string;
  showPercentage?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  className = '',
  variant = 'default',
  size = 'md',
  animated = true,
  striped = false,
  showValue = false,
  label,
  showPercentage = false
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };
  
  const variantClasses = {
    default: 'from-primary-500 to-primary-600',
    success: 'from-green-500 to-green-600',
    warning: 'from-yellow-500 to-yellow-600',
    error: 'from-red-500 to-red-600',
    info: 'from-blue-500 to-blue-600'
  };
  
  const containerClasses = `
    w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden
    ${sizeClasses[size]}
    ${className}
  `;
  
  const fillClasses = `
    h-full bg-gradient-to-r transition-all duration-500 ease-out
    ${variantClasses[variant]}
    ${striped ? 'bg-striped' : ''}
    ${animated ? 'animate-pulse' : ''}
  `;
  
  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </span>
          {showPercentage && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      
      {/* Progress Bar */}
      <div className={containerClasses}>
        <motion.div
          className={fillClasses}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      
      {/* Value Display */}
      {showValue && (
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
          {value} / {max}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;

// Circular Progress Bar
interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  showValue?: boolean;
  label?: string;
  animated?: boolean;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  className = '',
  variant = 'default',
  showValue = true,
  label,
  animated = true
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const colorClasses = {
    default: '#7aa030',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  };
  
  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      {label && (
        <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </div>
      )}
      
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background Circle */}
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          
          {/* Progress Circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colorClasses[variant]}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: animated ? strokeDashoffset : strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          />
        </svg>
        
        {/* Value Display */}
        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {percentage.toFixed(0)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// Steps Progress Bar
interface StepsProgressProps {
  currentStep: number;
  totalSteps: number;
  steps?: Array<{
    title: string;
    description?: string;
    completed?: boolean;
  }>;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  vertical?: boolean;
}

export const StepsProgress: React.FC<StepsProgressProps> = ({
  currentStep,
  totalSteps,
  steps = [],
  className = '',
  variant = 'default',
  vertical = false
}) => {
  const colorClasses = {
    default: 'bg-primary-500 border-primary-500 text-primary-600',
    success: 'bg-green-500 border-green-500 text-green-600',
    warning: 'bg-yellow-500 border-yellow-500 text-yellow-600',
    error: 'bg-red-500 border-red-500 text-red-600',
    info: 'bg-blue-500 border-blue-500 text-blue-600'
  };
  
  const containerClasses = vertical
    ? 'flex flex-col space-y-4'
    : 'flex items-center space-x-4';
  
  const lineClasses = vertical
    ? 'w-0.5 h-8 ml-4'
    : 'h-0.5 flex-1';
  
  return (
    <div className={`${containerClasses} ${className}`}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        const step = steps[index];
        
        return (
          <React.Fragment key={stepNumber}>
            <div className={vertical ? 'flex items-start' : 'flex flex-col items-center'}>
              {/* Step Circle */}
              <motion.div
                className={`
                  w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold
                  ${isCompleted || isCurrent 
                    ? colorClasses[variant] 
                    : 'bg-gray-200 border-gray-300 text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400'
                  }
                  ${isCurrent ? 'ring-4 ring-opacity-20' : ''}
                `}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className={isCompleted || isCurrent ? 'text-white' : ''}>
                    {stepNumber}
                  </span>
                )}
              </motion.div>
              
              {/* Step Content */}
              {step && (
                <div className={`${vertical ? 'ml-4' : 'mt-2'} text-center`}>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {step.title}
                  </div>
                  {step.description && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {step.description}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Connector Line */}
            {index < totalSteps - 1 && (
              <div className={`
                ${lineClasses}
                ${stepNumber < currentStep
                  ? colorClasses[variant].replace('text-', 'bg-').split(' ')[0]
                  : 'bg-gray-200 dark:bg-gray-700'
                }
              `} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};