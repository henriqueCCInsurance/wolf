import React from 'react';
import { motion } from 'framer-motion';
import { X, Trophy } from 'lucide-react';
import Button from '@/components/common/Button';
import { Prospect } from '@/types';

interface OutcomeModalProps {
  prospect: Prospect | null;
  callStartTime: Date | null;
  onSuccess: () => void;
  onNoGo: () => void;
  onClose: () => void;
}

const OutcomeModal: React.FC<OutcomeModalProps> = ({ 
  prospect, 
  callStartTime, 
  onSuccess, 
  onNoGo, 
  onClose 
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">How did the call go?</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Call Summary */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <div className="font-medium text-gray-900 dark:text-white">{prospect?.contactName}</div>
                <div className="text-sm">{prospect?.companyName}</div>
                <div className="text-xs mt-2">
                  Duration: {callStartTime ? Math.floor((Date.now() - callStartTime.getTime()) / 1000 / 60) : 0} minutes
                </div>
              </div>
            </div>
            
            {/* Contextual Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={onSuccess}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                <Trophy className="w-5 h-5 mr-2" />
                Call Success
              </Button>
              
              <Button 
                onClick={onNoGo}
                variant="secondary"
                className="w-full border-red-300 text-red-700 hover:bg-red-50 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20"
                size="lg"
              >
                <X className="w-5 h-5 mr-2" />
                No Go
              </Button>
            </div>
            
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center pt-2">
              Select the outcome to log your call details
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OutcomeModal;