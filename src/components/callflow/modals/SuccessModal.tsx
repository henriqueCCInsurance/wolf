import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import SuccessButton from '@/components/gamification/SuccessButton';

interface SuccessModalProps {
  onSuccess: (type: 'meeting-booked' | 'follow-up' | 'intelligence' | 'referral', points: number) => void;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ onSuccess, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">🎉 Log Your Success!</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <SuccessButton 
            onSuccess={onSuccess}
            className="w-full"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessModal;