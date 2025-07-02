import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Clock, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface CallTimerProps {
  persona: 'cost-conscious-employer' | 'benefits-optimizer' | 'roi-focused-executive' | 'gatekeeper';
  onTimeUpdate?: (seconds: number) => void;
  onCallEnd?: (duration: number) => void;
}

const CallTimer: React.FC<CallTimerProps> = ({ persona, onTimeUpdate, onCallEnd }) => {
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

  const handleStart = () => {
    setIsRunning(true);
    setHasStarted(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    onCallEnd?.(seconds);
    // Don't reset immediately to allow user to see final time
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
    setHasStarted(false);
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
    <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 p-6 max-w-md mx-auto">
      {/* Timer Display */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          <Clock className="w-6 h-6 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Call Timer</h3>
        </div>
        
        <motion.div
          animate={{ scale: isRunning ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 1, repeat: isRunning ? Infinity : 0 }}
          className="text-6xl font-mono font-bold text-gray-900 mb-2"
        >
          {formatTime(seconds)}
        </motion.div>
        
        <div className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor()}`}>
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
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Start</span>
          <span>Optimal ({Math.floor(target.optimal / 60)}min)</span>
          <span>Max ({Math.floor(target.max / 60)}min)</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full transition-colors duration-300 ${
              getTimeStatus() === 'optimal' ? 'bg-green-500' :
              getTimeStatus() === 'getting-long' ? 'bg-yellow-500' :
              getTimeStatus() === 'too-long' ? 'bg-red-500' : 'bg-blue-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${getProgressPercentage()}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-3 mb-6">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Play className="w-4 h-4" />
            <span>{hasStarted ? 'Resume' : 'Start Call'}</span>
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Pause className="w-4 h-4" />
            <span>Pause</span>
          </button>
        )}
        
        <button
          onClick={handleStop}
          disabled={!hasStarted}
          className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Square className="w-4 h-4" />
          <span>End Call</span>
        </button>
        
        <button
          onClick={handleReset}
          disabled={isRunning}
          className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Guidance */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Target className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-primary-900 mb-1">
              {persona.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Timing
            </h4>
            <p className="text-sm text-primary-800">
              {getPersonaGuidance()}
            </p>
            <div className="mt-2 text-xs text-primary-700">
              Target: {Math.floor(target.min / 60)}-{Math.floor(target.optimal / 60)}-{Math.floor(target.max / 60)} minutes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallTimer;