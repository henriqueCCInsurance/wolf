import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ExternalLink } from 'lucide-react';
import Button from '@/components/common/Button';

interface CalendarModalProps {
  onClose: () => void;
}

/**
 * Calendar integration modal for booking meetings
 * Extracted from LiveCallAssistance for better maintainability
 */
const CalendarModal: React.FC<CalendarModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-md"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">Book Meeting</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Type
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option>Discovery Call (30 min)</option>
                <option>Strategy Session (45 min)</option>
                <option>Proposal Review (60 min)</option>
              </select>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <ExternalLink className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Outlook Integration</h4>
                  <p className="text-sm text-blue-800">
                    This would integrate with Outlook Calendar to instantly book the meeting and send calendar invites.
                  </p>
                </div>
              </div>
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
                  // Here you would integrate with Outlook Calendar API
                  alert('Meeting booking integration would trigger here');
                }}
                className="flex-1"
              >
                Book Meeting
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CalendarModal;