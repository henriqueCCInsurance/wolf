import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  variant?: 'default' | 'dark' | 'light' | 'error' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  delay?: number;
  disabled?: boolean;
  arrow?: boolean;
  className?: string;
  contentClassName?: string;
  trigger?: 'hover' | 'click' | 'focus';
  interactive?: boolean;
  maxWidth?: number;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  placement = 'top',
  variant = 'default',
  size = 'md',
  delay = 200,
  disabled = false,
  arrow = true,
  className = '',
  contentClassName = '',
  trigger = 'hover',
  interactive = false,
  maxWidth = 200
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const variantClasses = {
    default: 'bg-gray-900 text-white dark:bg-gray-800',
    dark: 'bg-gray-900 text-white',
    light: 'bg-white text-gray-900 border border-gray-200 shadow-lg',
    error: 'bg-red-500 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-500 text-white'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const arrowClasses = {
    top: 'border-t-8 border-l-4 border-r-4 border-l-transparent border-r-transparent top-full left-1/2 transform -translate-x-1/2',
    bottom: 'border-b-8 border-l-4 border-r-4 border-l-transparent border-r-transparent bottom-full left-1/2 transform -translate-x-1/2',
    left: 'border-l-8 border-t-4 border-b-4 border-t-transparent border-b-transparent left-full top-1/2 transform -translate-y-1/2',
    right: 'border-r-8 border-t-4 border-b-4 border-t-transparent border-b-transparent right-full top-1/2 transform -translate-y-1/2'
  };

  const arrowColors = {
    default: 'border-gray-900 dark:border-gray-800',
    dark: 'border-gray-900',
    light: 'border-white',
    error: 'border-red-500',
    success: 'border-green-500',
    warning: 'border-yellow-500',
    info: 'border-blue-500'
  };

  const calculatePosition = () => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current?.getBoundingClientRect();
    
    let x = 0;
    let y = 0;

    switch (placement) {
      case 'top':
        x = triggerRect.left + triggerRect.width / 2;
        y = triggerRect.top - (tooltipRect?.height || 0) - 8;
        break;
      case 'bottom':
        x = triggerRect.left + triggerRect.width / 2;
        y = triggerRect.bottom + 8;
        break;
      case 'left':
        x = triggerRect.left - (tooltipRect?.width || 0) - 8;
        y = triggerRect.top + triggerRect.height / 2;
        break;
      case 'right':
        x = triggerRect.right + 8;
        y = triggerRect.top + triggerRect.height / 2;
        break;
    }

    // Adjust for viewport boundaries
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    if (tooltipRect) {
      // Horizontal adjustments
      if (x + tooltipRect.width > viewportWidth) {
        x = viewportWidth - tooltipRect.width - 8;
      }
      if (x < 8) {
        x = 8;
      }
      
      // Vertical adjustments
      if (y + tooltipRect.height > viewportHeight) {
        y = viewportHeight - tooltipRect.height - 8;
      }
      if (y < 8) {
        y = 8;
      }
    }

    setPosition({ x, y });
  };

  const showTooltip = () => {
    if (disabled || !content) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (!interactive) {
      setIsVisible(false);
    } else {
      // Small delay for interactive tooltips
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 100);
    }
  };

  const handleClick = () => {
    if (trigger === 'click') {
      setIsVisible(!isVisible);
    }
  };

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
      window.addEventListener('resize', calculatePosition);
      window.addEventListener('scroll', calculatePosition, true);
      
      return () => {
        window.removeEventListener('resize', calculatePosition);
        window.removeEventListener('scroll', calculatePosition, true);
      };
    }
  }, [isVisible, content]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const tooltipContent = (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={tooltipRef}
          className={`
            fixed z-50 pointer-events-none rounded-lg backdrop-blur-sm
            ${variantClasses[variant]}
            ${sizeClasses[size]}
            ${interactive ? 'pointer-events-auto' : ''}
            ${contentClassName}
          `}
          style={{
            left: placement === 'left' || placement === 'right' ? position.x : position.x - (tooltipRef.current?.offsetWidth || 0) / 2,
            top: placement === 'top' || placement === 'bottom' ? position.y : position.y - (tooltipRef.current?.offsetHeight || 0) / 2,
            maxWidth: `${maxWidth}px`
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          onMouseEnter={interactive ? () => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
          } : undefined}
          onMouseLeave={interactive ? hideTooltip : undefined}
        >
          {content}
          
          {/* Arrow */}
          {arrow && (
            <div
              className={`
                absolute w-0 h-0
                ${arrowClasses[placement]}
                ${arrowColors[variant]}
              `}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div
        ref={triggerRef}
        className={`inline-block ${className}`}
        onMouseEnter={trigger === 'hover' ? showTooltip : undefined}
        onMouseLeave={trigger === 'hover' ? hideTooltip : undefined}
        onFocus={trigger === 'focus' ? showTooltip : undefined}
        onBlur={trigger === 'focus' ? hideTooltip : undefined}
        onClick={trigger === 'click' ? handleClick : undefined}
        tabIndex={trigger === 'focus' ? 0 : undefined}
      >
        {children}
      </div>
      
      {typeof document !== 'undefined' && createPortal(tooltipContent, document.body)}
    </>
  );
};

export default Tooltip;

// Tooltip variants for specific use cases
export const ErrorTooltip: React.FC<Omit<TooltipProps, 'variant'>> = (props) => (
  <Tooltip variant="error" {...props} />
);

export const SuccessTooltip: React.FC<Omit<TooltipProps, 'variant'>> = (props) => (
  <Tooltip variant="success" {...props} />
);

export const WarningTooltip: React.FC<Omit<TooltipProps, 'variant'>> = (props) => (
  <Tooltip variant="warning" {...props} />
);

export const InfoTooltip: React.FC<Omit<TooltipProps, 'variant'>> = (props) => (
  <Tooltip variant="info" {...props} />
);

export const InteractiveTooltip: React.FC<Omit<TooltipProps, 'interactive'>> = (props) => (
  <Tooltip interactive={true} {...props} />
);

// Hook for programmatic tooltip control
export const useTooltip = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  const show = () => setIsVisible(true);
  const hide = () => setIsVisible(false);
  const toggle = () => setIsVisible(!isVisible);
  
  return {
    isVisible,
    show,
    hide,
    toggle
  };
};