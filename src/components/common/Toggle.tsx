import React from 'react';
import { motion } from 'framer-motion';

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({ 
  enabled, 
  onChange, 
  label,
  size = 'md',
  disabled = false 
}) => {
  const sizes = {
    sm: {
      switch: 'h-5 w-9',
      toggle: 'h-4 w-4',
      translate: 'translate-x-4'
    },
    md: {
      switch: 'h-6 w-11',
      toggle: 'h-5 w-5',
      translate: 'translate-x-5'
    },
    lg: {
      switch: 'h-7 w-14',
      toggle: 'h-6 w-6',
      translate: 'translate-x-7'
    }
  };

  const currentSize = sizes[size];

  return (
    <label className="flex items-center space-x-3 cursor-pointer">
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && onChange(!enabled)}
          className={`
            ${currentSize.switch}
            ${enabled ? 'bg-primary-600' : 'bg-gray-300'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            relative inline-flex items-center rounded-full transition-colors
          `}
          disabled={disabled}
        >
          <motion.span
            className={`
              ${currentSize.toggle}
              ${enabled ? currentSize.translate : 'translate-x-0.5'}
              inline-block transform rounded-full bg-white shadow-lg transition-transform
            `}
            layout
            transition={{
              type: "spring",
              stiffness: 700,
              damping: 30
            }}
          />
        </button>
      </div>
      {label && (
        <span className={`text-sm font-medium text-gray-700 ${disabled ? 'opacity-50' : ''}`}>
          {label}
        </span>
      )}
    </label>
  );
};

export default Toggle;