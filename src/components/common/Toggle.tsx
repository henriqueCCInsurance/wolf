import React from 'react';
import { motion } from 'framer-motion';

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  description?: string;
  icon?: React.ReactNode;
  labelPosition?: 'left' | 'right';
  loading?: boolean;
  className?: string;
}

const Toggle: React.FC<ToggleProps> = ({ 
  enabled, 
  onChange, 
  label,
  size = 'md',
  disabled = false,
  variant = 'default',
  description,
  icon,
  labelPosition = 'left',
  loading = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-5 w-9',
    md: 'h-6 w-11',
    lg: 'h-7 w-14'
  };
  
  const thumbSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };
  
  const thumbPositionClasses = {
    sm: enabled ? 'translate-x-4' : 'translate-x-0.5', // TODO: Use for size variants
    md: enabled ? 'translate-x-5' : 'translate-x-0.5',
    lg: enabled ? 'translate-x-7' : 'translate-x-0.5'
  };
  
  // Suppress unused variable warning - TODO: Use for size variants
  void thumbPositionClasses;
  
  const variantClasses = {
    default: enabled ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700',
    success: enabled ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700',
    warning: enabled ? 'bg-yellow-500' : 'bg-gray-200 dark:bg-gray-700',
    error: enabled ? 'bg-red-500' : 'bg-gray-200 dark:bg-gray-700',
    info: enabled ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
  };
  
  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };
  
  const LabelComponent = label && (
    <div className={`flex flex-col ${labelPosition === 'right' ? 'ml-3' : 'mr-3'}`}>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center">
        {icon && (
          <span className={`${iconSizeClasses[size]} mr-2 text-gray-500 dark:text-gray-400`}>
            {icon}
          </span>
        )}
        {label}
      </label>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {description}
        </p>
      )}
    </div>
  );
  
  return (
    <div className={`flex items-center ${className}`}>
      {labelPosition === 'left' && LabelComponent}
      
      <motion.button
        type="button"
        onClick={() => !disabled && !loading && onChange(!enabled)}
        disabled={disabled || loading}
        className={`
          relative inline-flex ${sizeClasses[size]} rounded-full p-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
          ${variantClasses[variant]}
          ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        whileHover={{ scale: disabled || loading ? 1 : 1.05 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
      >
        <motion.span
          className={`
            ${thumbSizeClasses[size]}
            inline-block bg-white rounded-full shadow-lg ring-0 transition-transform duration-200
            flex items-center justify-center
          `}
          animate={{
            x: enabled ? (size === 'sm' ? 16 : size === 'md' ? 20 : 28) : 2
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {loading && (
            <div className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          )}
        </motion.span>
      </motion.button>
      
      {labelPosition === 'right' && LabelComponent}
    </div>
  );
};

export default Toggle;

// Toggle variants for specific use cases
export const SuccessToggle: React.FC<Omit<ToggleProps, 'variant'>> = (props) => (
  <Toggle variant="success" {...props} />
);

export const WarningToggle: React.FC<Omit<ToggleProps, 'variant'>> = (props) => (
  <Toggle variant="warning" {...props} />
);

export const ErrorToggle: React.FC<Omit<ToggleProps, 'variant'>> = (props) => (
  <Toggle variant="error" {...props} />
);

export const InfoToggle: React.FC<Omit<ToggleProps, 'variant'>> = (props) => (
  <Toggle variant="info" {...props} />
);

// Checkbox Toggle (looks more like a checkbox)
interface CheckboxToggleProps extends Omit<ToggleProps, 'variant'> {
  indeterminate?: boolean;
}

export const CheckboxToggle: React.FC<CheckboxToggleProps> = ({
  enabled,
  onChange,
  label,
  disabled = false,
  size = 'md',
  className = '',
  description,
  icon,
  labelPosition = 'left',
  loading = false,
  indeterminate = false
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };
  
  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };
  
  const LabelComponent = label && (
    <div className={`flex flex-col ${labelPosition === 'right' ? 'ml-3' : 'mr-3'}`}>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center cursor-pointer">
        {icon && (
          <span className={`${iconSizeClasses[size]} mr-2 text-gray-500 dark:text-gray-400`}>
            {icon}
          </span>
        )}
        {label}
      </label>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {description}
        </p>
      )}
    </div>
  );
  
  return (
    <div className={`flex items-center ${className}`}>
      {labelPosition === 'left' && LabelComponent}
      
      <motion.button
        type="button"
        onClick={() => !disabled && !loading && onChange(!enabled)}
        disabled={disabled || loading}
        className={`
          ${sizeClasses[size]} rounded-md border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
          flex items-center justify-center
          ${enabled || indeterminate
            ? 'bg-primary-500 border-primary-500 text-white'
            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-transparent'
          }
          ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        whileHover={{ scale: disabled || loading ? 1 : 1.05 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
      >
        {loading ? (
          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : indeterminate ? (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <rect x="4" y="9" width="12" height="2" rx="1" />
          </svg>
        ) : enabled ? (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        ) : null}
      </motion.button>
      
      {labelPosition === 'right' && LabelComponent}
    </div>
  );
};