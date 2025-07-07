import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store';

interface CallTimerProps {
  persona: 'cost-conscious-employer' | 'benefits-optimizer' | 'roi-focused-executive' | 'gatekeeper';
  onTimeUpdate?: (seconds: number) => void;
  onCallEnd?: (duration: number) => void;
  isCallActive?: boolean;
}

const CallTimer: React.FC<CallTimerProps> = ({ persona, onTimeUpdate, onCallEnd, isCallActive = false }) => {
  const { setActiveCallStartTime, setActiveCallDuration } = useAppStore();
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Optimal call duration targets by persona (in seconds)
  const targetDurations = {
    'cost-conscious-employer': { min: 300, optimal: 480, max: 720 }, // 5-8-12 min
    'benefits-optimizer': { min: 600, optimal: 900, max: 1200 }, // 10-15-20 min
    'roi-focused-executive': { min: 480, optimal: 720, max: 900 }, // 8-12-15 min
    'gatekeeper': { min: 120, optimal: 240, max: 360 } // 2-4-6 min
  };

  const target = targetDurations[persona];

  // Sync timer with call state
  useEffect(() => {
    if (isCallActive && !isRunning) {
      setIsRunning(true);
      setHasStarted(true);
      setActiveCallStartTime(new Date());
    } else if (!isCallActive && isRunning) {
      setIsRunning(false);
      // Store the final duration when call ends
      const durationInMinutes = Math.round(seconds / 60);
      setActiveCallDuration(durationInMinutes);
      onCallEnd?.(durationInMinutes);
    }
  }, [isCallActive, isRunning, seconds, setActiveCallStartTime, setActiveCallDuration, onCallEnd]);

  // Reset timer when call ends
  useEffect(() => {
    if (!isCallActive && !isRunning && hasStarted) {
      setSeconds(0);
      setHasStarted(false);
      setActiveCallStartTime(null);
    }
  }, [isCallActive, isRunning, hasStarted, setActiveCallStartTime]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setSeconds(prev => {
          const newSeconds = prev + 1;
          onTimeUpdate?.(newSeconds);
          return newSeconds;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, onTimeUpdate]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeStatus = () => {
    if (seconds <= target.min) return 'warming-up';
    if (seconds <= target.optimal) return 'optimal';
    if (seconds <= target.max) return 'getting-long';
    return 'too-long';
  };

  const getStatusColor = () => {
    const status = getTimeStatus();
    switch (status) {
      case 'warming-up': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'optimal': return 'text-green-600 bg-green-50 border-green-200';
      case 'getting-long': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'too-long': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusMessage = () => {
    const status = getTimeStatus();
    switch (status) {
      case 'warming-up': return 'Building rapport...';
      case 'optimal': return 'Perfect timing!';
      case 'getting-long': return 'Consider wrapping up';
      case 'too-long': return 'Time to close!';
      default: return 'Ready to start';
    }
  };

  const getProgressPercentage = () => {
    return Math.min((seconds / target.optimal) * 100, 100);
  };


  const getPersonaGuidance = () => {
    switch (persona) {
      case 'cost-conscious-employer':
        return 'Keep it concise and practical. Focus on immediate value and ROI.';
      case 'benefits-optimizer':
        return 'Dive deeper into strategic value and employee engagement metrics.';
      case 'roi-focused-executive':
        return 'Present data-driven insights and financial impact quickly.';
      case 'gatekeeper':
        return 'Be respectful and brief. Get to the point quickly.';
      default:
        return 'Adapt your approach based on the conversation flow.';
    }
  };

  return (
    <div className="space-y-4">
      {/* Timer Display - Clean and Prominent */}
      <div className="text-center">
        <motion.div
          animate={{ scale: isRunning ? [1, 1.02, 1] : 1 }}
          transition={{ duration: 1, repeat: isRunning ? Infinity : 0 }}
          className="text-7xl font-mono font-bold text-gray-900 dark:text-white mb-3"
        >
          {formatTime(seconds)}
        </motion.div>
        
        <div className={`inline-flex items-center px-4 py-2 rounded-full border-2 text-sm font-medium ${getStatusColor()}`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${
            isRunning ? 'animate-pulse' : ''
          } ${
            getTimeStatus() === 'optimal' ? 'bg-green-500' :
            getTimeStatus() === 'getting-long' ? 'bg-yellow-500' :
            getTimeStatus() === 'too-long' ? 'bg-red-500' : 'bg-blue-500'
          }`} />
          {getStatusMessage()}
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <motion.div
            className={`h-3 rounded-full transition-colors duration-300 ${
              getTimeStatus() === 'optimal' ? 'bg-green-500' :
              getTimeStatus() === 'getting-long' ? 'bg-yellow-500' :
              getTimeStatus() === 'too-long' ? 'bg-red-500' : 'bg-blue-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${getProgressPercentage()}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>{formatTime(0)}</span>
          <span className="font-medium">Optimal: {Math.floor(target.optimal / 60)}min</span>
          <span>{formatTime(target.max)}</span>
        </div>
      </div>

      {/* Timing Guidance */}
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {getPersonaGuidance()}
        </p>
      </div>
    </div>
  );
};

export default CallTimer;