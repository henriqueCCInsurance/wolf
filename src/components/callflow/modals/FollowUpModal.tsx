import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import Button from '@/components/common/Button';

interface FollowUpModalProps {
  onClose: () => void;
}

const FollowUpModal: React.FC<FollowUpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Schedule Follow-up</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Follow-up Type
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <option>Phone Call</option>
                <option>Email Check-in</option>
                <option>Send Proposal</option>
                <option>Decision Follow-up</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                When
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <option>Tomorrow</option>
                <option>In 2 days</option>
                <option>Next week</option>
                <option>In 2 weeks</option>
              </select>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={onClose}
                variant="secondary"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  onClose();
                  alert('Follow-up scheduled in CRM');
                }}
                className="flex-1"
              >
                Schedule
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FollowUpModal;