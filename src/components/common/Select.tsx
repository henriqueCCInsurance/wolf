import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  variant?: 'default' | 'glass' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  success?: boolean;
  searchable?: boolean;
  multiple?: boolean;
  maxHeight?: number;
}

const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option...',
  required = false,
  disabled = false,
  error,
  className = '',
  variant = 'default',
  size = 'md',
  success = false,
  searchable = false,
  multiple = false, // TODO: Implement multiple selection
  maxHeight = 200
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Suppress unused variable warning - TODO: Implement multiple selection
  void multiple;
  
  const selectedOption = options.find(option => option.value === value);
  
  const filteredOptions = searchable
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;
  
  const baseClasses = 'relative w-full transition-all duration-200 focus:outline-none cursor-pointer';
  
  const variantClasses = {
    default: 'bg-white/80 dark:bg-gray-800/80 border border-gray-300/50 dark:border-gray-600/50 backdrop-blur-sm',
    glass: 'bg-white/10 dark:bg-gray-800/10 border border-white/20 dark:border-gray-600/20 backdrop-blur-md text-gray-900 dark:text-gray-100',
    minimal: 'bg-transparent border-b-2 border-gray-300 dark:border-gray-600 rounded-none'
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
  
  const selectClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${stateClasses[currentState]}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${variant === 'minimal' ? 'rounded-none' : 'rounded-xl'}
  `;
  
  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };
  
  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };
  
  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          {label}
          {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
        </label>
      )}
      
      {/* Select Button */}
      <motion.div
        className={selectClasses}
        onClick={handleToggle}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {selectedOption?.icon && (
              <span className="mr-2 text-gray-500 dark:text-gray-400">
                {selectedOption.icon}
              </span>
            )}
            <span className={selectedOption ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </motion.div>
        </div>
      </motion.div>
      
      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`absolute z-50 w-full mt-1 ${variant === 'glass' ? 'bg-white/10 dark:bg-gray-800/10 backdrop-blur-md border border-white/20 dark:border-gray-600/20' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600'} rounded-xl shadow-lg`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{ maxHeight: `${maxHeight}px` }}
          >
            {/* Search Input */}
            {searchable && (
              <div className="p-2 border-b border-gray-200 dark:border-gray-600">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search options..."
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  autoFocus
                />
              </div>
            )}
            
            {/* Options */}
            <div className="overflow-y-auto" style={{ maxHeight: `${maxHeight - (searchable ? 60 : 0)}px` }}>
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <motion.div
                    key={option.value}
                    className={`px-4 py-3 text-sm cursor-pointer transition-colors duration-150 ${
                      option.disabled
                        ? 'opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-500'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100'
                    } ${value === option.value ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : ''}`}
                    onClick={() => !option.disabled && handleSelect(option.value)}
                    whileHover={{ scale: option.disabled ? 1 : 1.02 }}
                    whileTap={{ scale: option.disabled ? 1 : 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {option.icon && (
                          <span className="mr-2 text-gray-500 dark:text-gray-400">
                            {option.icon}
                          </span>
                        )}
                        <span>{option.label}</span>
                      </div>
                      {value === option.value && (
                        <Check className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Error Message */}
      {error && (
        <motion.p
          className="mt-2 text-xs text-red-600 dark:text-red-400"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
      
      {/* Overlay to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default Select;

// Select variants for specific use cases
export const GlassSelect: React.FC<Omit<SelectProps, 'variant'>> = (props) => (
  <Select variant="glass" {...props} />
);

export const MinimalSelect: React.FC<Omit<SelectProps, 'variant'>> = (props) => (
  <Select variant="minimal" {...props} />
);

export const SearchableSelect: React.FC<Omit<SelectProps, 'searchable'>> = (props) => (
  <Select searchable={true} {...props} />
);