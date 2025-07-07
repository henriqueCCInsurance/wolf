import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, Lightbulb, Users, Zap } from 'lucide-react';
import CelebrationSystem from './CelebrationSystem';

interface SuccessButtonProps {
  onSuccess: (type: 'meeting-booked' | 'follow-up' | 'intelligence' | 'referral', points: number) => void;
  disabled?: boolean;
  className?: string;
}

const SuccessButton: React.FC<SuccessButtonProps> = ({ 
  onSuccess, 
  disabled = false, 
  className = '' 
}) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [activeCelebration, setActiveCelebration] = useState<{
    type: 'meeting-booked' | 'follow-up' | 'intelligence' | 'referral';
    show: boolean;
  }>({ type: 'meeting-booked', show: false });

  const successOptions = [
    {
      id: 'meeting-booked' as const,
      title: 'Meeting Booked!',
      subtitle: 'Locked in a discovery meeting',
      icon: Trophy,
      color: 'from-green-400 to-green-600',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100',
      borderColor: 'border-green-200',
      points: 100,
      description: 'The ultimate win - a committed meeting in their calendar'
    },
    {
      id: 'follow-up' as const,
      title: 'Follow-up Scheduled',
      subtitle: 'Secured next conversation',
      icon: Calendar,
      color: 'from-blue-400 to-blue-600',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      borderColor: 'border-blue-200',
      points: 75,
      description: 'Great progress - they committed to a specific next step'
    },
    {
      id: 'intelligence' as const,
      title: 'Intelligence Gathered',
      subtitle: 'Valuable insights collected',
      icon: Lightbulb,
      color: 'from-yellow-400 to-yellow-600',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50 hover:bg-yellow-100',
      borderColor: 'border-yellow-200',
      points: 50,
      description: 'Information that makes future conversations more effective'
    },
    {
      id: 'referral' as const,
      title: 'Referral Received',
      subtitle: 'Got introduction to new prospect',
      icon: Users,
      color: 'from-purple-400 to-purple-600',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      borderColor: 'border-purple-200',
      points: 90,
      description: 'Excellent! Referrals convert much higher than cold calls'
    }
  ];

  const handleSuccessClick = () => {
    if (disabled) return;
    setShowSuccessModal(true);
  };

  const handleSuccessTypeSelect = (type: typeof successOptions[0]['id']) => {
    const selectedOption = successOptions.find(opt => opt.id === type);
    if (selectedOption) {
      setShowSuccessModal(false);
      setActiveCelebration({ type, show: true });
      onSuccess(type, selectedOption.points);
    }
  };

  const handleCelebrationComplete = () => {
    setActiveCelebration({ ...activeCelebration, show: false });
  };

  return (
    <>
      {/* Main Success Button */}
      <motion.button
        onClick={handleSuccessClick}
        disabled={disabled}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        className={`relative overflow-hidden ${className} ${
          disabled 
            ? 'opacity-50 cursor-not-allowed bg-gray-300' 
            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 cursor-pointer'
        } text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-50`}
      >
        <div className="flex items-center space-x-3">
          <Zap className="w-6 h-6" />
          <span className="text-xl">Call Success!</span>
          <Trophy className="w-6 h-6" />
        </div>
        
        {!disabled && (
          <motion.div
            className="absolute inset-0 bg-white opacity-0"
            animate={{ 
              opacity: [0, 0.3, 0],
              scale: [1, 1.5, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.button>

      {/* Success Type Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Congratulations!</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">What type of success did you achieve?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {successOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <motion.button
                    key={option.id}
                    onClick={() => handleSuccessTypeSelect(option.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`${option.bgColor} ${option.borderColor} border-2 rounded-xl p-6 text-left transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-opacity-50`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${option.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold text-lg ${option.textColor} mb-1`}>
                          {option.title}
                        </h3>
                        <p className="text-gray-700 text-sm mb-2">
                          {option.subtitle}
                        </p>
                        <p className="text-xs text-gray-600 mb-3">
                          {option.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className={`font-bold ${option.textColor}`}>
                            +{option.points} Points
                          </span>
                          <div className="flex items-center space-x-1">
                            {[...Array(Math.ceil(option.points / 25))].map((_, i) => (
                              <div key={i} className={`w-2 h-2 rounded-full bg-gradient-to-r ${option.color}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="text-gray-500 hover:text-gray-700 font-medium"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Celebration System */}
      <CelebrationSystem
        isActive={activeCelebration.show}
        celebrationType={activeCelebration.type}
        onComplete={handleCelebrationComplete}
      />
    </>
  );
};

export default SuccessButton;