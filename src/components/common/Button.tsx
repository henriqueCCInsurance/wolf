import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  rounded = 'xl'
}) => {
  const baseClasses = 'relative inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white focus:ring-primary-400 shadow-md hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5',
    secondary: 'bg-white/80 hover:bg-white/90 text-gray-700 dark:bg-gray-800/80 dark:hover:bg-gray-700/90 dark:text-gray-200 focus:ring-gray-400 shadow-sm hover:shadow-md border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm hover:-translate-y-0.5',
    outline: 'bg-transparent border-2 border-primary-400 text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/20 focus:ring-primary-400 hover:-translate-y-0.5',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-gray-400',
    glass: 'bg-white/10 dark:bg-gray-800/10 text-gray-900 dark:text-gray-100 backdrop-blur-md border border-white/20 dark:border-gray-600/20 hover:bg-white/20 dark:hover:bg-gray-700/20 focus:ring-white/30 shadow-glass'
  };
  
  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };
  
  const roundedClasses = {
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
    full: 'rounded-full'
  };
  
  const iconSizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  };
  
  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${roundedClasses[rounded]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;
  
  const iconClass = iconSizeClasses[size];
  
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {loading && (
        <Loader2 className={`${iconClass} mr-2 animate-spin`} />
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className={`${iconClass} mr-2`}>{icon}</span>
      )}
      
      <span className={loading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
      
      {!loading && icon && iconPosition === 'right' && (
        <span className={`${iconClass} ml-2`}>{icon}</span>
      )}
      
      {/* Glass effect overlay */}
      {variant === 'glass' && (
        <div className="absolute inset-0 rounded-inherit bg-gradient-to-r from-white/10 to-transparent" />
      )}
    </motion.button>
  );
};

export default Button;

// Button variants for specific use cases
export const PrimaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="primary" {...props} />
);

export const SecondaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="secondary" {...props} />
);

export const OutlineButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="outline" {...props} />
);

export const GhostButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="ghost" {...props} />
);

export const GlassButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="glass" {...props} />
);