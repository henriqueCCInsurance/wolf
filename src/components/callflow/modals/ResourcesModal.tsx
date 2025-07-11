import React from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import Button from '@/components/common/Button';
import { useAppStore } from '@/store';

interface ResourcesModalProps {
  onClose: () => void;
}

const ResourcesModal: React.FC<ResourcesModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Send className="w-6 h-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Send Resources</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Resources
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded text-primary-600" defaultChecked />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Benefits Overview Deck</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded text-primary-600" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">ROI Calculator</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded text-primary-600" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Case Studies</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded text-primary-600" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Industry Report</span>
                </label>
              </div>
              
              <div className="text-center mt-3">
                <button
                  onClick={() => {
                    onClose();
                    useAppStore.getState().setCurrentModule('resources');
                  }}
                  className="text-sm text-primary-600 hover:text-primary-700 underline"
                >
                  View all marketing materials →
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Personal Message
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                rows={3}
                placeholder="Thanks for your time today..."
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
                  alert('Resources sent via email');
                }}
                className="flex-1"
              >
                Send Email
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResourcesModal;