import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store';
import { PersonaType } from '@/types';

interface CallTimerProps {
  persona: PersonaType;
  onTimeUpdate?: (seconds: number) => void;
  onCallEnd?: (duration: number) => void;
  isCallActive?: boolean;
}

const CallTimer: React.FC<CallTimerProps> = ({ persona, onTimeUpdate, onCallEnd, isCallActive = false }) => {
  const { setActiveCallStartTime, setActiveCallDuration } = useAppStore();
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<Date | null>(null);

  // Optimal call duration targets by persona (in seconds)
  const targetDurations = {
    'cost-conscious-employer': { min: 300, optimal: 480, max: 720 }, // 5-8-12 min
    'benefits-optimizer': { min: 600, optimal: 900, max: 1200 }, // 10-15-20 min
    'roi-focused-executive': { min: 480, optimal: 720, max: 900 }, // 8-12-15 min
    'gatekeeper': { min: 120, optimal: 240, max: 360 }, // 2-4-6 min
    'strategic-ceo': { min: 240, optimal: 420, max: 600 }, // 4-7-10 min (shorter for executives)
    'operations-leader': { min: 480, optimal: 780, max: 1080 }, // 8-13-18 min (detailed operational discussions)
    'culture-champion': { min: 540, optimal: 840, max: 1200 } // 9-14-20 min (relationship-focused)
  };

  // Add safety guard for undefined persona or missing target
  const target = targetDurations[persona] || {
    min: 300,
    optimal: 600, 
    max: 900
  };
  
  // Start timer when call becomes active
  useEffect(() => {
    try {
      if (isCallActive) {
        // Start the timer
        if (!intervalRef.current) {
          startTimeRef.current = new Date();
          setActiveCallStartTime(startTimeRef.current);
          setSeconds(0);
          
          intervalRef.current = window.setInterval(() => {
            setSeconds(prev => {
              const newSeconds = prev + 1;
              onTimeUpdate?.(newSeconds);
              return newSeconds;
            });
          }, 1000);
        }
      } else {
        // Stop the timer
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
          
          // Save final duration if there was an active call
          if (startTimeRef.current && seconds > 0) {
            const durationInMinutes = Math.round(seconds / 60);
            setActiveCallDuration(durationInMinutes);
            onCallEnd?.(durationInMinutes);
          }
          
          // Reset state
          startTimeRef.current = null;
          setActiveCallStartTime(null);
          setSeconds(0);
        }
      }
    } catch (error) {
      console.error('CallTimer: Error in timer management:', error);
      // Cleanup on error
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    
    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isCallActive, setActiveCallStartTime, setActiveCallDuration, onTimeUpdate, onCallEnd]);

  // Note: Timer interval is now managed in the main effect above

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeStatus = () => {
    // Safety guard for undefined target
    if (!target || typeof target !== 'object') {
      return 'warming-up';
    }
    
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
    // Safety guard for undefined target
    if (!target || !target.optimal || target.optimal <= 0) {
      return 0;
    }
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
      case 'strategic-ceo':
        return 'Be extremely concise. Focus on strategic vision and competitive advantage.';
      case 'operations-leader':
        return 'Discuss implementation processes and operational efficiency in detail.';
      case 'culture-champion':
        return 'Focus on employee experience and company culture alignment.';
      default:
        return 'Adapt your approach based on the conversation flow.';
    }
  };

  // Final safety wrapper with error boundary
  try {
    // Early validation for invalid persona
    if (!persona || typeof persona !== 'string') {
      console.warn('CallTimer: Invalid persona provided:', persona);
      return (
        <div className="text-center py-4">
          <div className="text-red-600 text-sm">Invalid persona configuration</div>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {/* Timer Display - Clean and Prominent */}
        <div className="text-center">
          <motion.div
            animate={{ scale: isCallActive ? [1, 1.02, 1] : 1 }}
            transition={{ duration: 1, repeat: isCallActive ? Infinity : 0 }}
            className="text-7xl font-mono font-bold text-gray-900 dark:text-white mb-3"
          >
            {formatTime(seconds)}
          </motion.div>
          
          <div className={`inline-flex items-center px-4 py-2 rounded-full border-2 text-sm font-medium ${getStatusColor()}`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              isCallActive ? 'animate-pulse' : ''
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
          <span className="font-medium">Optimal: {Math.floor((target?.optimal || 600) / 60)}min</span>
          <span>{formatTime(target?.max || 900)}</span>
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
  } catch (error) {
    console.error('CallTimer: Render error:', error);
    return (
      <div className="text-center py-4 space-y-2">
        <div className="text-red-600 text-sm">Timer temporarily unavailable</div>
        <div className="text-2xl font-mono text-gray-500">{formatTime(seconds)}</div>
        <div className="text-xs text-gray-400">Basic timer mode</div>
      </div>
    );
  }
};

export default CallTimer;