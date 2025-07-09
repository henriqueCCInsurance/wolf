import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  fullScreen?: boolean;
  className?: string;
  color?: string;
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars' | 'ring' | 'bounce';
  text?: string;
  overlay?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  message = 'Loading...',
  fullScreen = false,
  className = '',
  color = 'text-primary-500',
  variant = 'spinner',
  text,
  overlay = false
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };
  
  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };
  
  const SpinnerVariant = () => (
    <div className="relative">
      {/* Outer ring */}
      <motion.div
        className={`${sizeClasses[size]} rounded-full border-2 border-gray-200 dark:border-gray-700`}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Inner spinning segment */}
      <motion.div
        className={`absolute inset-0 ${sizeClasses[size]} rounded-full border-2 border-transparent border-t-primary-500 border-r-primary-400`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Center dot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-2 h-2 bg-primary-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>
    </div>
  );
  
  const DotsVariant = () => {
    const dotSize = size === 'xs' ? 'w-1.5 h-1.5' : size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-5 h-5';
    
    return (
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`${dotSize} ${color.replace('text-', 'bg-')} rounded-full`}
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>
    );
  };
  
  const PulseVariant = () => (
    <motion.div
      className={`${sizeClasses[size]} ${color.replace('text-', 'bg-')} rounded-full`}
      animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
      transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
  
  const BarsVariant = () => {
    const barCount = 5;
    const barWidth = size === 'xs' ? 'w-0.5' : size === 'sm' ? 'w-1' : size === 'md' ? 'w-1.5' : size === 'lg' ? 'w-2' : 'w-3';
    const barHeight = size === 'xs' ? 'h-4' : size === 'sm' ? 'h-6' : size === 'md' ? 'h-8' : size === 'lg' ? 'h-10' : 'h-12';
    
    return (
      <div className="flex items-end space-x-1">
        {Array.from({ length: barCount }).map((_, i) => (
          <motion.div
            key={i}
            className={`${barWidth} ${barHeight} ${color.replace('text-', 'bg-')} rounded-sm`}
            animate={{ scaleY: [1, 0.5, 1] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>
    );
  };
  
  const RingVariant = () => {
    const ringSize = size === 'xs' ? 'w-4 h-4' : size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-16 h-16';
    
    return (
      <motion.div
        className={`${ringSize} border-2 border-gray-200 dark:border-gray-700 rounded-full`}
        style={{
          borderTopColor: color.includes('primary') ? '#7aa030' : '#3b82f6'
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    );
  };
  
  const BounceVariant = () => {
    const ballSize = size === 'xs' ? 'w-2 h-2' : size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : size === 'lg' ? 'w-5 h-5' : 'w-6 h-6';
    
    return (
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`${ballSize} ${color.replace('text-', 'bg-')} rounded-full`}
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>
    );
  };
  
  const renderVariant = () => {
    switch (variant) {
      case 'dots':
        return <DotsVariant />;
      case 'pulse':
        return <PulseVariant />;
      case 'bars':
        return <BarsVariant />;
      case 'ring':
        return <RingVariant />;
      case 'bounce':
        return <BounceVariant />;
      default:
        return <SpinnerVariant />;
    }
  };
  
  const displayText = text || message;
  
  const LoadingComponent = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {renderVariant()}
      {displayText && (
        <motion.p
          className={`mt-4 font-medium text-gray-600 dark:text-gray-300 ${textSizeClasses[size]}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {displayText}
        </motion.p>
      )}
    </div>
  );
  
  if (fullScreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center"
      >
        {LoadingComponent}
      </motion.div>
    );
  }
  
  if (overlay) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm"
      >
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
          {LoadingComponent}
        </div>
      </motion.div>
    );
  }
  
  return LoadingComponent;
};

export default LoadingSpinner;

// Loading spinner variants for specific use cases
export const SmallSpinner: React.FC<Omit<LoadingSpinnerProps, 'size'>> = (props) => (
  <LoadingSpinner size="sm" {...props} />
);

export const LargeSpinner: React.FC<Omit<LoadingSpinnerProps, 'size'>> = (props) => (
  <LoadingSpinner size="lg" {...props} />
);

export const DotsSpinner: React.FC<Omit<LoadingSpinnerProps, 'variant'>> = (props) => (
  <LoadingSpinner variant="dots" {...props} />
);

export const PulseSpinner: React.FC<Omit<LoadingSpinnerProps, 'variant'>> = (props) => (
  <LoadingSpinner variant="pulse" {...props} />
);

export const BarsSpinner: React.FC<Omit<LoadingSpinnerProps, 'variant'>> = (props) => (
  <LoadingSpinner variant="bars" {...props} />
);

export const FullScreenLoader: React.FC<Omit<LoadingSpinnerProps, 'fullScreen'>> = (props) => (
  <LoadingSpinner fullScreen={true} {...props} />
);

export const OverlayLoader: React.FC<Omit<LoadingSpinnerProps, 'overlay'>> = (props) => (
  <LoadingSpinner overlay={true} {...props} />
);