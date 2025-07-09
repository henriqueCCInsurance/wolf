import React from 'react';
import { motion } from 'framer-motion';
import { designTokens } from '@/styles/tokens';

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'compact' | 'wide';
}

interface BentoItemProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'wide' | 'tall' | 'hero';
  priority?: 'high' | 'medium' | 'low';
  gradient?: boolean;
  glowing?: boolean;
  floating?: boolean;
  interactive?: boolean;
  delay?: number;
}

const BentoGrid: React.FC<BentoGridProps> = ({
  children,
  className = '',
  variant = 'default'
}) => {
  const gridClasses = {
    default: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4',
    compact: 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3',
    wide: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
  };

  return (
    <div className={`${gridClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

const BentoItem: React.FC<BentoItemProps> = ({
  children,
  className = '',
  size = 'md',
  priority = 'medium',
  gradient = false,
  glowing = false,
  floating = false,
  interactive = false,
  delay = 0
}) => {
  const sizeClasses = {
    sm: 'col-span-1 row-span-1',
    md: 'col-span-2 row-span-1',
    lg: 'col-span-2 row-span-2',
    xl: 'col-span-3 row-span-2',
    wide: 'col-span-2 md:col-span-3 lg:col-span-4 row-span-1',
    tall: 'col-span-1 md:col-span-2 row-span-2 md:row-span-3',
    hero: 'col-span-2 md:col-span-3 lg:col-span-4 row-span-2 md:row-span-3'
  };

  const priorityClasses = {
    high: 'z-20 relative',
    medium: 'z-10 relative',
    low: 'z-0 relative'
  };

  const baseClasses = `
    ${sizeClasses[size]} 
    ${priorityClasses[priority]}
    ${interactive ? 'cursor-pointer' : ''}
    ${floating ? 'floating-element' : ''}
    ${className}
  `;

  const animationVariants = {
    hidden: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95,
      rotateX: 5,
      rotateY: 5
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      transition: {
        duration: 0.4,
        ease: designTokens.animation.easing.spring,
        delay: delay
      }
    },
    hover: interactive ? {
      scale: 1.02,
      y: -4,
      rotateX: -2,
      rotateY: 2,
      transition: {
        duration: 0.2,
        ease: designTokens.animation.easing.smooth
      }
    } : {},
    tap: interactive ? {
      scale: 0.98,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      transition: {
        duration: 0.1
      }
    } : {}
  };

  return (
    <motion.div
      className={baseClasses}
      variants={animationVariants}
      initial="hidden"
      animate="visible"
      whileHover={interactive ? "hover" : undefined}
      whileTap={interactive ? "tap" : undefined}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
    >
      <div 
        className={`
          h-full w-full rounded-2xl overflow-hidden gpu-accelerated
          ${gradient ? 'bg-gradient-to-br from-primary-500 to-primary-700' : 'bg-white/80 dark:bg-neutral-800/80'}
          ${glowing ? 'shadow-glow' : 'shadow-float hover:shadow-lift'}
          backdrop-blur-glass border border-white/30 dark:border-neutral-700/30
          transition-all duration-300 ease-spring
          ${interactive ? 'hover:border-primary-400/50 hover:shadow-hover' : ''}
        `}
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
      >
        {gradient && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
        )}
        
        {glowing && (
          <motion.div
            className="absolute inset-0 opacity-50"
            animate={{
              background: [
                'radial-gradient(circle at 20% 50%, rgba(165, 207, 76, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 20%, rgba(125, 211, 252, 0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 40% 80%, rgba(192, 132, 252, 0.1) 0%, transparent 50%)'
              ]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        )}
        
        <div className="relative z-10 h-full">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

// Specialized Bento components for common use cases
const BentoCard: React.FC<{
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  subtitle?: string;
  action?: React.ReactNode;
  size?: BentoItemProps['size'];
  priority?: BentoItemProps['priority'];
  gradient?: boolean;
  glowing?: boolean;
  interactive?: boolean;
  delay?: number;
}> = ({ 
  title, 
  children, 
  icon, 
  subtitle, 
  action, 
  size = 'md',
  priority = 'medium',
  gradient = false,
  glowing = false,
  interactive = false,
  delay = 0
}) => {
  return (
    <BentoItem 
      size={size} 
      priority={priority} 
      gradient={gradient} 
      glowing={glowing} 
      interactive={interactive}
      delay={delay}
    >
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {icon && (
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                {icon}
              </div>
            )}
            <div>
              <h3 className={`font-semibold ${gradient ? 'text-white' : 'text-neutral-900 dark:text-neutral-100'}`}>
                {title}
              </h3>
              {subtitle && (
                <p className={`text-sm ${gradient ? 'text-white/80' : 'text-neutral-600 dark:text-neutral-400'}`}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {action && (
            <div className="flex-shrink-0">
              {action}
            </div>
          )}
        </div>
        <div className="flex-1">
          {children}
        </div>
      </div>
    </BentoItem>
  );
};

const BentoMetric: React.FC<{
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    up: boolean;
  };
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: BentoItemProps['size'];
  delay?: number;
}> = ({ 
  label, 
  value, 
  icon, 
  trend, 
  color = 'primary',
  size = 'sm',
  delay = 0
}) => {
  const colorClasses = {
    primary: 'text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30',
    success: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
    warning: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30',
    error: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30',
    info: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30'
  };

  return (
    <BentoItem size={size} interactive delay={delay}>
      <div className="p-4 h-full flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
          {trend && (
            <div className={`flex items-center text-sm ${trend.up ? 'text-green-600' : 'text-red-600'}`}>
              <span className={`mr-1 ${trend.up ? '↗' : '↘'}`}></span>
              {trend.value}
            </div>
          )}
        </div>
        <div className="mt-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">{label}</p>
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">{value}</p>
        </div>
      </div>
    </BentoItem>
  );
};

const BentoChart: React.FC<{
  title: string;
  children: React.ReactNode;
  size?: BentoItemProps['size'];
  glowing?: boolean;
  delay?: number;
}> = ({ title, children, size = 'lg', glowing = false, delay = 0 }) => {
  return (
    <BentoItem size={size} glowing={glowing} delay={delay}>
      <div className="p-6 h-full">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          {title}
        </h3>
        <div className="h-full">
          {children}
        </div>
      </div>
    </BentoItem>
  );
};

const BentoHero: React.FC<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  backgroundImage?: string;
  gradient?: boolean;
  delay?: number;
}> = ({ title, subtitle, children, backgroundImage, gradient = true, delay = 0 }) => {
  return (
    <BentoItem size="hero" gradient={gradient} glowing priority="high" delay={delay}>
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      <div className="p-8 h-full flex flex-col justify-center relative z-10">
        <div className="max-w-md">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display">
            {title}
          </h1>
          {subtitle && (
            <p className="text-white/90 text-lg mb-6">
              {subtitle}
            </p>
          )}
          <div>
            {children}
          </div>
        </div>
      </div>
    </BentoItem>
  );
};

export { BentoGrid, BentoItem, BentoCard, BentoMetric, BentoChart, BentoHero };
export default BentoGrid;