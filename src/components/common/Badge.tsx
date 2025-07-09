import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  removable?: boolean;
  onRemove?: () => void;
  animated?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon,
  iconPosition = 'left',
  removable = false,
  onRemove,
  animated = true
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full';
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };
  
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100',
    primary: 'bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100',
    success: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
    error: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
    outline: 'border-2 border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300'
  };
  
  const iconClass = 'flex-shrink-0 w-4 h-4';
  
  const BadgeComponent = (
    <motion.span
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      initial={animated ? { opacity: 0, scale: 0.8 } : {}}
      animate={animated ? { opacity: 1, scale: 1 } : {}}
      exit={animated ? { opacity: 0, scale: 0.8 } : {}}
      transition={{ duration: 0.2 }}
      whileHover={animated ? { scale: 1.05 } : {}}
      whileTap={animated ? { scale: 0.95 } : {}}
    >
      {icon && iconPosition === 'left' && (
        <span className={`${iconClass} mr-1`}>
          {icon}
        </span>
      )}
      
      <span>{children}</span>
      
      {icon && iconPosition === 'right' && (
        <span className={`${iconClass} ml-1`}>
          {icon}
        </span>
      )}
      
      {removable && (
        <button
          onClick={onRemove}
          className={`${iconClass} ml-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors`}
        >
          <X />
        </button>
      )}
    </motion.span>
  );
  
  return BadgeComponent;
};

export default Badge;

// Badge variants for specific use cases
export const PrimaryBadge: React.FC<Omit<BadgeProps, 'variant'>> = (props) => (
  <Badge variant="primary" {...props} />
);

export const SuccessBadge: React.FC<Omit<BadgeProps, 'variant'>> = (props) => (
  <Badge variant="success" {...props} />
);

export const WarningBadge: React.FC<Omit<BadgeProps, 'variant'>> = (props) => (
  <Badge variant="warning" {...props} />
);

export const ErrorBadge: React.FC<Omit<BadgeProps, 'variant'>> = (props) => (
  <Badge variant="error" {...props} />
);

export const InfoBadge: React.FC<Omit<BadgeProps, 'variant'>> = (props) => (
  <Badge variant="info" {...props} />
);

export const OutlineBadge: React.FC<Omit<BadgeProps, 'variant'>> = (props) => (
  <Badge variant="outline" {...props} />
);

// Notification Badge
interface NotificationBadgeProps {
  count: number;
  max?: number;
  className?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  showZero?: boolean;
  animated?: boolean;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  max = 99,
  className = '',
  variant = 'error',
  size = 'md',
  showZero = false,
  animated = true
}) => {
  if (count === 0 && !showZero) return null;
  
  const displayCount = count > max ? `${max}+` : count.toString();
  
  const sizeClasses = {
    sm: 'min-w-[16px] h-4 text-xs',
    md: 'min-w-[20px] h-5 text-xs',
    lg: 'min-w-[24px] h-6 text-sm'
  };
  
  const variantClasses = {
    default: 'bg-gray-500 text-white',
    primary: 'bg-primary-500 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white'
  };
  
  return (
    <motion.span
      className={`
        inline-flex items-center justify-center px-1 rounded-full font-medium
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      initial={animated ? { opacity: 0, scale: 0 } : {}}
      animate={animated ? { opacity: 1, scale: 1 } : {}}
      exit={animated ? { opacity: 0, scale: 0 } : {}}
      transition={{ 
        type: 'spring',
        stiffness: 500,
        damping: 30
      }}
    >
      {displayCount}
    </motion.span>
  );
};

// Status Badge
interface StatusBadgeProps {
  status: 'online' | 'offline' | 'away' | 'busy';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  withLabel?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = '',
  size = 'md',
  animated = true,
  withLabel = false
}) => {
  const statusConfig = {
    online: { color: 'bg-green-500', label: 'Online' },
    offline: { color: 'bg-gray-500', label: 'Offline' },
    away: { color: 'bg-yellow-500', label: 'Away' },
    busy: { color: 'bg-red-500', label: 'Busy' }
  };
  
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };
  
  const config = statusConfig[status];
  
  return (
    <div className={`inline-flex items-center ${className}`}>
      <motion.div
        className={`
          ${sizeClasses[size]}
          ${config.color}
          rounded-full
          ${animated ? 'animate-pulse' : ''}
        `}
        initial={animated ? { opacity: 0, scale: 0 } : {}}
        animate={animated ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.2 }}
      />
      {withLabel && (
        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
          {config.label}
        </span>
      )}
    </div>
  );
};