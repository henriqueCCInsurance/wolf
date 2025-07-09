import React, { useState, useEffect } from 'react';
import { Phone, Copy, Check, ExternalLink, AlertCircle, Smartphone } from 'lucide-react';
import { zoomPhoneService } from '@/services/zoomPhone';

interface ClickablePhoneProps {
  phoneNumber: string;
  contactName?: string;
  companyName?: string;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ClickablePhone: React.FC<ClickablePhoneProps> = ({ 
  phoneNumber, 
  contactName = '',
  companyName = '',
  className = '', 
  showIcon = true,
  size = 'md' 
}) => {
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isZoomCompatible, setIsZoomCompatible] = useState<boolean>(false);
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'success' | 'failed'>('idle');
  const [callMethod, setCallMethod] = useState<'zoom' | 'tel' | 'failed' | 'unknown'>('unknown');

  useEffect(() => {
    // Check Zoom Phone compatibility on mount
    const compatible = zoomPhoneService.isZoomPhoneCompatible();
    setIsZoomCompatible(compatible);
    setCallMethod(compatible ? 'zoom' : 'tel');
  }, []);

  const handlePhoneClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setCallStatus('calling');
    
    try {
      const result = await zoomPhoneService.initiateCall({
        phoneNumber,
        contactName,
        companyName,
        leadId: `${companyName}-${contactName}`
      });
      
      setCallMethod(result.method);
      
      if (result.success) {
        setCallStatus('success');
        setTimeout(() => setCallStatus('idle'), 3000);
      } else {
        setCallStatus('failed');
        setTimeout(() => setCallStatus('idle'), 3000);
        console.warn('Call failed:', result.message);
      }
    } catch (error) {
      setCallStatus('failed');
      setTimeout(() => setCallStatus('idle'), 3000);
      console.error('Error initiating call:', error);
    }
  };

  const handleCopyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    navigator.clipboard.writeText(phoneNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const getCallIcon = () => {
    if (callStatus === 'calling') {
      return <Phone className={`${iconSizeClasses[size]} flex-shrink-0 animate-pulse`} />;
    }
    if (callStatus === 'success') {
      return <Check className={`${iconSizeClasses[size]} flex-shrink-0 text-green-600`} />;
    }
    if (callStatus === 'failed') {
      return <AlertCircle className={`${iconSizeClasses[size]} flex-shrink-0 text-red-600`} />;
    }
    if (callMethod === 'tel') {
      return <Smartphone className={`${iconSizeClasses[size]} flex-shrink-0`} />;
    }
    return <Phone className={`${iconSizeClasses[size]} flex-shrink-0`} />;
  };

  const getButtonColor = () => {
    if (callStatus === 'calling') {
      return 'text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300';
    }
    if (callStatus === 'success') {
      return 'text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300';
    }
    if (callStatus === 'failed') {
      return 'text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300';
    }
    return 'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300';
  };

  const getTooltipText = () => {
    if (callStatus === 'calling') {
      return 'Initiating call...';
    }
    if (callStatus === 'success') {
      return `Call opened via ${callMethod === 'zoom' ? 'Zoom Phone' : 'device phone app'}`;
    }
    if (callStatus === 'failed') {
      return 'Failed to open call app';
    }
    if (isZoomCompatible) {
      return 'Click to call with Zoom Phone';
    }
    return 'Click to call with device phone app';
  };

  return (
    <div 
      className={`inline-flex items-center gap-2 group relative ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        onClick={handlePhoneClick}
        disabled={callStatus === 'calling'}
        className={`
          flex items-center gap-1.5 
          ${getButtonColor()}
          underline decoration-dotted underline-offset-2
          transition-colors cursor-pointer
          disabled:opacity-50 disabled:cursor-not-allowed
          ${sizeClasses[size]}
        `}
      >
        {showIcon && getCallIcon()}
        <span className="font-mono">{phoneNumber}</span>
        {callStatus === 'idle' && (
          <ExternalLink className={`${iconSizeClasses[size]} opacity-0 group-hover:opacity-100 transition-opacity`} />
        )}
      </button>
      
      <button
        onClick={handleCopyClick}
        className={`
          p-1.5 rounded-md
          text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200
          hover:bg-gray-100 dark:hover:bg-gray-700
          opacity-0 group-hover:opacity-100 transition-all
        `}
        title="Copy phone number"
      >
        {copied ? (
          <Check className={`${iconSizeClasses[size]} text-green-600 dark:text-green-400`} />
        ) : (
          <Copy className={iconSizeClasses[size]} />
        )}
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-0 mb-2 z-10">
          <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
            {getTooltipText()}
            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClickablePhone;