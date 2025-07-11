import { useState } from 'react';

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