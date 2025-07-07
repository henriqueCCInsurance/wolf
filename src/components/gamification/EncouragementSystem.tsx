import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, TrendingUp, Zap, Shield, Award } from 'lucide-react';
import { useAppStore } from '@/store';

interface EncouragementSystemProps {
  isActive: boolean;
  outcome: 'nurture' | 'disqualified' | 'follow-up';
  onComplete: () => void;
}

const EncouragementSystem: React.FC<EncouragementSystemProps> = ({
  isActive,
  outcome,
  onComplete
}) => {
  const { profile } = useAppStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const encouragementConfig = {
    'nurture': {
      icon: Heart,
      iconColor: '#EC4899',
      messages: [
        "Not every call is a win, but every call is a lesson.",
        "Building relationships takes time. Keep nurturing!",
        "You planted a seed today. Great things grow from patience.",
        "This one needs time. Your persistence will pay off!"
      ],
      quote: "Success is not final, failure is not fatal: it is the courage to continue that counts."
    },
    'disqualified': {
      icon: Shield,
      iconColor: '#6366F1',
      messages: [
        "You just saved valuable time for the right opportunities!",
        "Qualifying out is as important as qualifying in.",
        "Now you can focus on prospects who truly need your help.",
        "Smart selling means knowing when to move on. Well done!"
      ],
      quote: "The difference between successful people and really successful people is that really successful people say no to almost everything."
    },
    'follow-up': {
      icon: TrendingUp,
      iconColor: '#10B981',
      messages: [
        "You kept the conversation going. That's progress!",
        "Follow-ups close more deals than first calls. Keep going!",
        "Persistence is your superpower. This is just the beginning.",
        "Great salespeople follow up. You're on the right track!"
      ],
      quote: "80% of sales require 5 follow-up calls. Most salespeople give up after 2."
    }
  };

  const config = encouragementConfig[outcome];
  const Icon = config.icon;
  const randomMessage = config.messages[Math.floor(Math.random() * config.messages.length)];

  useEffect(() => {
    if (isActive && profile.motivationalImages && profile.motivationalImages.length > 0) {
      setCurrentImageIndex(Math.floor(Math.random() * profile.motivationalImages.length));
    }
  }, [isActive, profile.motivationalImages]);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        onComplete();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 15 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-2xl mx-4"
        >
          <div className="text-center">
            {/* Icon with animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", damping: 10 }}
              className="mb-6"
            >
              <div 
                className="w-24 h-24 mx-auto rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${config.iconColor}20` }}
              >
                <Icon size={48} style={{ color: config.iconColor }} />
              </div>
            </motion.div>

            {/* Encouragement Message */}
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4"
            >
              {randomMessage}
            </motion.h2>

            {/* Motivational Quote */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-gray-600 dark:text-gray-300 italic mb-6"
            >
              "{config.quote}"
            </motion.p>

            {/* User's Why I Sell */}
            {profile.whyISell && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mb-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg"
              >
                <p className="text-sm font-semibold text-primary-700 dark:text-primary-300 mb-2">
                  Remember Your Why:
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  {profile.whyISell}
                </p>
              </motion.div>
            )}

            {/* Motivational Image */}
            {profile.motivationalImages && profile.motivationalImages.length > 0 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1 }}
                className="mb-6"
              >
                <img
                  src={profile.motivationalImages[currentImageIndex]}
                  alt="Your motivation"
                  className="w-full max-w-md h-48 object-cover rounded-lg mx-auto shadow-lg"
                />
              </motion.div>
            )}

            {/* Progress Reminder */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400"
            >
              <div className="flex items-center space-x-2">
                <Award size={16} className="text-yellow-500" />
                <span>Every call brings you closer</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap size={16} className="text-primary-500" />
                <span>Keep up the momentum</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EncouragementSystem;