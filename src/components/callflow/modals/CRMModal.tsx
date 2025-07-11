import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';
import Button from '@/components/common/Button';

interface CRMModalProps {
  callNotes: string;
  onClose: () => void;
}

const CRMModal: React.FC<CRMModalProps> = ({ callNotes, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <UserPlus className="w-6 h-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add to CRM</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lead Status
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <option>New Lead</option>
                <option>Qualified</option>
                <option>Meeting Scheduled</option>
                <option>Proposal Sent</option>
                <option>Follow-up Required</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lead Source
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <option>Cold Call</option>
                <option>Referral</option>
                <option>Website</option>
                <option>Event</option>
                <option>Social Media</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority Level
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                rows={3}
                placeholder="Additional notes for CRM record..."
                defaultValue={callNotes}
              />
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
                  alert('Contact added to CRM successfully');
                }}
                className="flex-1"
              >
                Add to CRM
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CRMModal;