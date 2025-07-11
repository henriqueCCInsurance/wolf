import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import Button from '@/components/common/Button';
import { Prospect } from '@/types';
import { NO_GO_REASONS } from '../constants';

interface NoGoModalProps {
  prospect: Prospect | null;
  callStartTime: Date | null;
  callNotes: string;
  onSubmit: (reason: string, additionalContext: string) => void;
  onClose: () => void;
}

/**
 * No-go outcome modal for logging unsuccessful calls
 * Extracted from LiveCallAssistance for better maintainability
 */
const NoGoModal: React.FC<NoGoModalProps> = ({ 
  prospect: _prospect, 
  callStartTime: _callStartTime, 
  callNotes: _callNotes, 
  onSubmit, 
  onClose 
}) => {
  const [noGoReason, setNoGoReason] = useState<string>('');
  const [additionalContext, setAdditionalContext] = useState<string>('');
  
  const handleSubmit = () => {
    if (!noGoReason) {
      alert('Please select a reason for No Go');
      return;
    }
    onSubmit(noGoReason, additionalContext);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">No Go - Quick Note</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What happened? <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 gap-2">
                {NO_GO_REASONS.map((reason) => (
                  <button
                    key={reason}
                    onClick={() => setNoGoReason(reason)}
                    className={`p-3 text-left border rounded-lg transition-colors ${
                      noGoReason === reason
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="text-sm font-medium">{reason}</div>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                rows={3}
                placeholder="Any other details..."
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={onClose}
                variant="secondary"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Log No Go
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NoGoModal;