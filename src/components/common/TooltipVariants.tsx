import React from 'react';
import Tooltip, { TooltipProps } from './Tooltip';

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