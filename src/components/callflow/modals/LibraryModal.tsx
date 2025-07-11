import React from 'react';
import { motion } from 'framer-motion';
import { X, Search, BookOpen } from 'lucide-react';
import Button from '@/components/common/Button';
import { ContentItem } from '../types';

interface LibraryModalProps {
  selectedContent: ContentItem[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onClose: () => void;
}

const LibraryModal: React.FC<LibraryModalProps> = ({ 
  selectedContent, 
  searchTerm, 
  onSearchChange, 
  onClose 
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Script Library</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search your selected scripts..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                           placeholder-gray-500 dark:placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          
          {/* Search Results */}
          <div className="space-y-4">
            {selectedContent.length > 0 ? (
              selectedContent.map((content, index) => (
                <div key={content.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-start justify-between mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      content.type === 'opener' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
                      content.type === 'objection-handler' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                      'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
                    }`}>
                      {content.type.replace('-', ' ').toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">#{index + 1}</span>
                  </div>
                  <p className="text-sm text-gray-900 dark:text-gray-100 mb-2 font-medium">
                    {content.content}
                  </p>
                  {content.context && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                      Context: {content.context}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm ? 'No scripts match your search.' : 'No scripts selected. Visit the Guide to select content.'}
                </p>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedContent.length} script{selectedContent.length !== 1 ? 's' : ''} available
              </p>
              <Button
                onClick={onClose}
                variant="secondary"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LibraryModal;