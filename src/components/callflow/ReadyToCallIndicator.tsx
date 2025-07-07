import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, XCircle, Phone, User, Building, Briefcase, Clock } from 'lucide-react';
import { Prospect } from '@/types';
import { useAppStore } from '@/store';

interface ReadyToCallIndicatorProps {
  prospect: Prospect | null;
  className?: string;
}

interface ReadyState {
  status: 'ready' | 'missing-optional' | 'not-ready';
  message: string;
  missingItems: MissingItem[];
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
}

interface MissingItem {
  field: string;
  label: string;
  required: boolean;
  action: () => void;
}

const ReadyToCallIndicator: React.FC<ReadyToCallIndicatorProps> = ({ prospect, className = '' }) => {
  const { 
    setCurrentModule, 
    activeCallStartTime, 
    activeCallDuration,
    activeSequenceId,
    callSequences 
  } = useAppStore();
  
  // Find active sequence if any
  const activeSequence = callSequences.find(seq => seq.id === activeSequenceId);

  const navigateToCallPlanner = () => {
    setCurrentModule('call-planner');
  };

  const getReadyState = (): ReadyState => {
    if (!prospect) {
      return {
        status: 'not-ready',
        message: 'No lead selected',
        missingItems: [
          {
            field: 'prospect',
            label: 'Select a lead',
            required: true,
            action: navigateToCallPlanner
          }
        ],
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-300',
        icon: <XCircle className="w-5 h-5" />
      };
    }

    const missingItems: MissingItem[] = [];

    // Check required fields
    if (!prospect.companyName) {
      missingItems.push({
        field: 'companyName',
        label: 'Company name',
        required: true,
        action: navigateToCallPlanner
      });
    }

    if (!prospect.contactName) {
      missingItems.push({
        field: 'contactName',
        label: 'Contact name',
        required: true,
        action: navigateToCallPlanner
      });
    }

    if (!prospect.industry) {
      missingItems.push({
        field: 'industry',
        label: 'Industry',
        required: true,
        action: navigateToCallPlanner
      });
    }

    if (!prospect.persona) {
      missingItems.push({
        field: 'persona',
        label: 'Persona type',
        required: true,
        action: navigateToCallPlanner
      });
    }

    // Check optional fields
    if (!prospect.contactPhone) {
      missingItems.push({
        field: 'contactPhone',
        label: 'Phone number',
        required: false,
        action: navigateToCallPlanner
      });
    }

    // Determine status based on missing items
    const requiredMissing = missingItems.filter(item => item.required);
    const optionalMissing = missingItems.filter(item => !item.required);

    if (requiredMissing.length > 0) {
      return {
        status: 'not-ready',
        message: `Missing ${requiredMissing.length} required field${requiredMissing.length > 1 ? 's' : ''}`,
        missingItems: requiredMissing,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-300',
        icon: <XCircle className="w-5 h-5" />
      };
    }

    if (optionalMissing.length > 0) {
      return {
        status: 'missing-optional',
        message: 'Missing optional info',
        missingItems: optionalMissing,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-300',
        icon: <AlertCircle className="w-5 h-5" />
      };
    }

    return {
      status: 'ready',
      message: 'Ready',
      missingItems: [],
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300',
      icon: <CheckCircle2 className="w-5 h-5" />
    };
  };

  const readyState = getReadyState();
  const isClickable = readyState.status !== 'ready';

  const handleClick = () => {
    if (isClickable && readyState.missingItems.length > 0) {
      // Navigate to the first missing item's action
      readyState.missingItems[0].action();
    }
  };

  const getFieldIcon = (field: string) => {
    switch (field) {
      case 'contactPhone':
        return <Phone className="w-3 h-3" />;
      case 'contactName':
        return <User className="w-3 h-3" />;
      case 'companyName':
        return <Building className="w-3 h-3" />;
      case 'industry':
      case 'persona':
        return <Briefcase className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`
          flex items-center gap-3 px-4 py-3 rounded-lg border-2
          ${readyState.bgColor} ${readyState.borderColor}
          ${isClickable ? 'cursor-pointer hover:shadow-md transition-all' : ''}
        `}
        onClick={handleClick}
      >
        {/* Status Icon with Animation */}
        <div className={`relative ${readyState.color}`}>
          {readyState.status === 'ready' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              {readyState.icon}
            </motion.div>
          )}
          {readyState.status === 'missing-optional' && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              {readyState.icon}
            </motion.div>
          )}
          {readyState.status === 'not-ready' && readyState.icon}
        </div>

        {/* Status Text */}
        <div className="flex-1">
          <div className={`font-semibold ${readyState.color}`}>
            {readyState.message}
          </div>
          
          {/* Show missing items for clickable states */}
          {isClickable && readyState.missingItems.length > 0 && (
            <div className="text-xs text-gray-600 mt-1">
              Click to add: {readyState.missingItems.map(item => item.label).join(', ')}
            </div>
          )}
          
          {/* Show sequence info if active */}
          {activeSequence && prospect && (
            <div className="text-xs text-gray-600 mt-1">
              Part of: {activeSequence.name}
            </div>
          )}
        </div>
        
        {/* Call Timer Status */}
        {activeCallStartTime && (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <Clock className="w-4 h-4 animate-pulse" />
            <span>Call Active</span>
          </div>
        )}
        
        {!activeCallStartTime && activeCallDuration > 0 && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle2 className="w-4 h-4" />
            <span>{activeCallDuration}m</span>
          </div>
        )}

        {/* Clickable Indicator */}
        {isClickable && (
          <div className="text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </motion.div>

      {/* Detailed Tooltip on Hover */}
      {isClickable && readyState.missingItems.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 opacity-0 hover:opacity-100 transition-opacity pointer-events-none z-10">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3">
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Missing Information:
            </div>
            <div className="space-y-1">
              {readyState.missingItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                  {getFieldIcon(item.field)}
                  <span>{item.label}</span>
                  {item.required && (
                    <span className="text-red-500 font-medium">(Required)</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadyToCallIndicator;