import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { designTokens } from '@/styles/tokens';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass' | 'neu' | 'gradient';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  spatial?: boolean; // Enable 3D spatial effects
  glow?: boolean; // Enable glow effects
  ripple?: boolean; // Enable ripple effects
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
  rounded = 'xl',
  spatial = false,
  glow = false,
  ripple = false
}) => {
  const baseClasses = 'relative inline-flex items-center justify-center font-semibold overflow-hidden gpu-accelerated focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 select-none';
  
  // Enhanced variant classes using design tokens
  const variantClasses = {
    primary: `
      text-white
      bg-gradient-to-r from-primary-500 to-primary-600
      hover:from-primary-600 hover:to-primary-700
      active:from-primary-700 active:to-primary-800
      shadow-float hover:shadow-lift
      transition-all duration-300 ease-spring
      ${spatial ? 'hover:translateZ-10' : ''}
      ${glow ? 'hover:shadow-glow' : ''}
    `,
    secondary: `
      text-neutral-700 dark:text-neutral-200
      bg-white/80 hover:bg-white/90
      dark:bg-neutral-800/80 dark:hover:bg-neutral-700/90
      border border-neutral-200/50 dark:border-neutral-600/50
      backdrop-blur-glass
      shadow-xs hover:shadow-float
      transition-all duration-300 ease-spring
      ${spatial ? 'hover:translateZ-5' : ''}
    `,
    outline: `
      text-primary-600 dark:text-primary-400
      bg-transparent hover:bg-primary-50 dark:hover:bg-primary-900/20
      border-2 border-primary-400 hover:border-primary-500
      transition-all duration-300 ease-spring
      ${spatial ? 'hover:translateZ-5' : ''}
      ${glow ? 'hover:shadow-glow' : ''}
    `,
    ghost: `
      text-neutral-700 dark:text-neutral-200
      bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800
      transition-all duration-200 ease-smooth
    `,
    glass: `
      text-white
      bg-white/10 dark:bg-black/30
      hover:bg-white/20 dark:hover:bg-black/40
      border border-white/20 dark:border-white/10
      backdrop-blur-glass hover:backdrop-blur-glass-lg
      shadow-glass hover:shadow-glass-lg
      transition-all duration-300 ease-spring
      ${spatial ? 'hover:translateZ-15' : ''}
    `,
    neu: `
      text-neutral-700 dark:text-neutral-200
      bg-gradient-to-br from-neutral-50 to-neutral-100
      dark:from-neutral-800 dark:to-neutral-900
      shadow-neu-raised hover:shadow-neu-raised active:shadow-neu-inset
      transition-all duration-300 ease-spring
      ${spatial ? 'hover:translateZ-10' : ''}
    `,
    gradient: `
      text-white
      bg-gradient-to-r from-primary-500 via-accent-electric-500 to-accent-violet-500
      hover:from-primary-600 hover:via-accent-electric-600 hover:to-accent-violet-600
      bg-size-200 animate-gradient-shift
      shadow-lift hover:shadow-hover
      transition-all duration-300 ease-spring
      ${spatial ? 'hover:translateZ-20' : ''}
      ${glow ? 'hover:shadow-glow-ai' : ''}
    `
  };
  
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs gap-1',
    sm: 'px-3 py-2 text-sm gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
    xl: 'px-8 py-4 text-lg gap-2.5'
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
  
  // Enhanced animation variants
  const animationVariants = {
    rest: { 
      scale: 1, 
      y: 0, 
      rotateX: 0, 
      rotateY: 0,
      boxShadow: designTokens.boxShadow.float
    },
    hover: { 
      scale: disabled || loading ? 1 : 1.02,
      y: spatial ? -2 : -1,
      rotateX: spatial ? -2 : 0,
      rotateY: spatial ? 2 : 0,
      boxShadow: spatial ? designTokens.boxShadow.lift : designTokens.boxShadow.hover,
      transition: {
        duration: 0.2,
        ease: [0.16, 1, 0.3, 1]
      }
    },
    tap: { 
      scale: disabled || loading ? 1 : 0.98,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      transition: {
        duration: 0.1,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };
  
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
      variants={animationVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      style={{
        perspective: spatial ? '1000px' : 'none',
        transformStyle: spatial ? 'preserve-3d' : 'flat'
      }}
    >
      {/* Ripple effect */}
      {ripple && (
        <motion.div
          className="absolute inset-0 rounded-inherit bg-white/30"
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      )}
      
      {/* Loading state */}
      {loading && (
        <motion.div
          className={`${iconClass} mr-2`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="w-full h-full" />
        </motion.div>
      )}
      
      {/* Left icon */}
      {!loading && icon && iconPosition === 'left' && (
        <motion.span 
          className={`${iconClass} shrink-0`}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          {icon}
        </motion.span>
      )}
      
      {/* Button content */}
      <motion.span 
        className={`relative z-10 ${loading ? 'opacity-0' : 'opacity-100'}`}
        initial={{ opacity: 0, y: 2 }}
        animate={{ opacity: loading ? 0 : 1, y: 0 }}
        transition={{ duration: 0.2, delay: loading ? 0 : 0.1 }}
      >
        {children}
      </motion.span>
      
      {/* Right icon */}
      {!loading && icon && iconPosition === 'right' && (
        <motion.span 
          className={`${iconClass} shrink-0`}
          initial={{ opacity: 0, x: 4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          {icon}
        </motion.span>
      )}
      
      {/* Enhanced glass effect overlay */}
      {variant === 'glass' && (
        <motion.div 
          className="absolute inset-0 rounded-inherit bg-gradient-to-r from-white/10 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* AI gradient overlay for gradient variant */}
      {variant === 'gradient' && (
        <motion.div 
          className="absolute inset-0 rounded-inherit bg-gradient-to-r from-ai-secondary/20 to-ai-accent/20"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Glow effect */}
      {glow && (
        <motion.div 
          className="absolute inset-0 rounded-inherit bg-primary-500/20 blur-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Focus ring */}
      <motion.div
        className="absolute inset-0 rounded-inherit ring-2 ring-primary-400/50 ring-offset-2"
        initial={{ opacity: 0 }}
        whileFocus={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  );
};

export default Button;

// Enhanced Button variants for specific use cases with 2025 features
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

// New 2025 variants
export const NeuButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="neu" {...props} />
);

export const GradientButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="gradient" glow {...props} />
);

// Special effect buttons
export const SpatialButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="primary" spatial glow {...props} />
);

export const AIButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="gradient" spatial glow ripple {...props} />
);

export const FloatingButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="glass" spatial className="floating-element" {...props} />
);