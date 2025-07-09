import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';

interface InputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'tel' | 'search';
  required?: boolean;
  disabled?: boolean;
  error?: string;
  success?: boolean;
  className?: string;
  variant?: 'default' | 'floating' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  helperText?: string;
  maxLength?: number;
  autoComplete?: string;
  autoFocus?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  disabled = false,
  error,
  success = false,
  className = '',
  variant = 'default',
  size = 'md',
  icon,
  iconPosition = 'left',
  helperText,
  maxLength,
  autoComplete,
  autoFocus,
  onFocus,
  onBlur
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const hasValue = value.length > 0;
  const isFloating = variant === 'floating';
  
  const baseClasses = 'w-full transition-all duration-200 focus:outline-none';
  
  const variantClasses = {
    default: 'bg-white/80 dark:bg-gray-800/80 border border-gray-300/50 dark:border-gray-600/50 backdrop-blur-sm',
    floating: 'bg-white/80 dark:bg-gray-800/80 border border-gray-300/50 dark:border-gray-600/50 backdrop-blur-sm',
    glass: 'bg-white/10 dark:bg-gray-800/10 border border-white/20 dark:border-gray-600/20 backdrop-blur-md text-gray-900 dark:text-gray-100'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-5 py-4 text-base'
  };
  
  const stateClasses = {
    default: 'border-gray-300/50 dark:border-gray-600/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
    error: 'border-red-500 dark:border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20',
    success: 'border-green-500 dark:border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
  };
  
  const currentState = error ? 'error' : success ? 'success' : 'default';
  
  const inputClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${stateClasses[currentState]}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${icon && iconPosition === 'left' ? 'pl-10' : ''}
    ${icon && iconPosition === 'right' ? 'pr-10' : ''}
    ${type === 'password' ? 'pr-10' : ''}
    ${isFloating ? 'placeholder-transparent' : ''}
    rounded-xl
  `;
  
  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  
  const iconPositionClasses = {
    left: 'left-3',
    right: 'right-3'
  };
  
  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };
  
  const inputType = type === 'password' && showPassword ? 'text' : type;
  
  return (
    <div className={`relative ${className}`}>
      {/* Traditional Label */}
      {label && !isFloating && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          {label}
          {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
        </label>
      )}
      
      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {icon && iconPosition === 'left' && (
          <div className={`absolute ${iconPositionClasses.left} top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 ${iconSizeClasses[size]}`}>
            {icon}
          </div>
        )}
        
        {/* Input */}
        <motion.input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isFloating ? ' ' : placeholder}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={inputClasses}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        />
        
        {/* Floating Label */}
        {label && isFloating && (
          <motion.label
            className={`absolute left-4 pointer-events-none transition-all duration-200 text-gray-500 dark:text-gray-400 ${
              isFocused || hasValue
                ? '-top-2 text-xs bg-white dark:bg-gray-800 px-1 rounded text-primary-600 dark:text-primary-400'
                : 'top-1/2 transform -translate-y-1/2 text-sm'
            }`}
            animate={{
              y: isFocused || hasValue ? -20 : 0,
              scale: isFocused || hasValue ? 0.875 : 1,
              color: isFocused || hasValue ? (error ? '#ef4444' : '#7aa030') : '#6b7280'
            }}
            transition={{ duration: 0.2 }}
          >
            {label}
            {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
          </motion.label>
        )}
        
        {/* Right Icon */}
        {icon && iconPosition === 'right' && (
          <div className={`absolute ${iconPositionClasses.right} top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 ${iconSizeClasses[size]}`}>
            {icon}
          </div>
        )}
        
        {/* Password Toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 ${iconSizeClasses[size]}`}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        )}
        
        {/* Status Icons */}
        {error && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 dark:text-red-400">
            <AlertCircle className={iconSizeClasses[size]} />
          </div>
        )}
        
        {success && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 dark:text-green-400">
            <Check className={iconSizeClasses[size]} />
          </div>
        )}
      </div>
      
      {/* Helper Text */}
      {helperText && !error && (
        <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">{helperText}</p>
      )}
      
      {/* Error Message */}
      {error && (
        <motion.p
          className="mt-2 text-xs text-red-600 dark:text-red-400 flex items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <AlertCircle className="w-3 h-3 mr-1" />
          {error}
        </motion.p>
      )}
      
      {/* Character Count */}
      {maxLength && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
          {value.length}/{maxLength}
        </p>
      )}
    </div>
  );
};

export default Input;

// Input variants for specific use cases
export const FloatingInput: React.FC<Omit<InputProps, 'variant'>> = (props) => (
  <Input variant="floating" {...props} />
);

export const GlassInput: React.FC<Omit<InputProps, 'variant'>> = (props) => (
  <Input variant="glass" {...props} />
);

export const SearchInput: React.FC<Omit<InputProps, 'type'>> = (props) => (
  <Input type="search" {...props} />
);