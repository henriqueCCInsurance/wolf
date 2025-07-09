import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'elevated' | 'outline';
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | 'glass';
  gradient?: boolean;
  interactive?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ 
  title, 
  subtitle, 
  children, 
  className = '',
  variant = 'default',
  hover = true,
  padding = 'md',
  rounded = 'xl',
  shadow = 'md',
  gradient = false,
  interactive = false,
  onClick
}) => {
  const baseClasses = 'relative transition-all duration-300 border';
  
  const variantClasses = {
    default: 'bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm',
    glass: 'bg-white/10 dark:bg-gray-800/10 border-white/20 dark:border-gray-600/20 backdrop-blur-md',
    elevated: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
    outline: 'bg-transparent border-gray-300 dark:border-gray-600'
  };
  
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };
  
  const roundedClasses = {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
    '2xl': 'rounded-[2rem]'
  };
  
  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    glass: 'shadow-glass'
  };
  
  const hoverClasses = hover ? 'hover:shadow-2xl hover:-translate-y-1' : '';
  const interactiveClasses = interactive ? 'cursor-pointer' : '';
  
  const cardClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${paddingClasses[padding]}
    ${roundedClasses[rounded]}
    ${shadowClasses[shadow]}
    ${hoverClasses}
    ${interactiveClasses}
    ${className}
  `;
  
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { 
      y: hover ? -4 : 0,
      transition: { duration: 0.2 }
    },
    tap: { scale: interactive ? 0.98 : 1 }
  };
  
  const CardComponent = (
    <motion.div
      className={cardClasses}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      transition={{ duration: 0.3 }}
    >
      {/* Glass effect overlay */}
      {variant === 'glass' && (
        <div className="absolute inset-0 rounded-inherit bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      )}
      
      {/* Gradient overlay */}
      {gradient && (
        <div className="absolute inset-0 rounded-inherit bg-gradient-to-br from-primary-500/5 to-primary-600/10 pointer-events-none" />
      )}
      
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-6 relative z-10">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 truncate">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
  
  return CardComponent;
};

export default Card;

// Card variants for specific use cases
export const GlassCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
  <Card variant="glass" {...props} />
);

export const ElevatedCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
  <Card variant="elevated" {...props} />
);

export const OutlineCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
  <Card variant="outline" {...props} />
);

export const InteractiveCard: React.FC<Omit<CardProps, 'interactive'>> = (props) => (
  <Card interactive={true} {...props} />
);