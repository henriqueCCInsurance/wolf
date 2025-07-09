import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, ArrowUp, ArrowDown, CornerDownLeft, Hash, User, FileText, Settings, Zap } from 'lucide-react';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  action: () => void;
  shortcut?: string;
  category?: string;
  keywords?: string[];
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: CommandItem[];
  placeholder?: string;
  className?: string;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  commands,
  placeholder = 'Search for commands...',
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filteredCommands, setFilteredCommands] = useState<CommandItem[]>(commands);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter commands based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCommands(commands);
      setSelectedIndex(0);
      return;
    }

    const filtered = commands.filter(command => {
      const searchLower = searchTerm.toLowerCase();
      const matchesLabel = command.label.toLowerCase().includes(searchLower);
      const matchesDescription = command.description?.toLowerCase().includes(searchLower);
      const matchesKeywords = command.keywords?.some(keyword => 
        keyword.toLowerCase().includes(searchLower)
      );
      const matchesCategory = command.category?.toLowerCase().includes(searchLower);

      return matchesLabel || matchesDescription || matchesKeywords || matchesCategory;
    });

    setFilteredCommands(filtered);
    setSelectedIndex(0);
  }, [searchTerm, commands]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, command) => {
    const category = command.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(command);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'navigation':
        return <Hash className="w-4 h-4" />;
      case 'actions':
        return <Zap className="w-4 h-4" />;
      case 'settings':
        return <Settings className="w-4 h-4" />;
      case 'users':
        return <User className="w-4 h-4" />;
      case 'files':
        return <FileText className="w-4 h-4" />;
      default:
        return <Hash className="w-4 h-4" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`command-palette ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="command-palette-content"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-600">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={placeholder}
                  className="w-full pl-10 pr-4 py-3 text-lg bg-transparent border-none focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Commands */}
            <div className="max-h-96 overflow-y-auto">
              {Object.keys(groupedCommands).length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No results found</p>
                  <p className="text-sm">Try searching with different keywords</p>
                </div>
              ) : (
                <div className="py-2">
                  {Object.entries(groupedCommands).map(([category, categoryCommands]) => (
                    <div key={category} className="mb-4">
                      {/* Category Header */}
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center">
                        {getCategoryIcon(category)}
                        <span className="ml-2">{category}</span>
                      </div>

                      {/* Commands in Category */}
                      {categoryCommands.map((command) => {
                        const globalIndex = filteredCommands.findIndex(c => c.id === command.id);
                        const isSelected = globalIndex === selectedIndex;

                        return (
                          <motion.div
                            key={command.id}
                            className={`px-4 py-3 cursor-pointer transition-colors duration-150 ${
                              isSelected 
                                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                                : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100'
                            }`}
                            onClick={() => {
                              command.action();
                              onClose();
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                {command.icon && (
                                  <span className="mr-3 text-gray-500 dark:text-gray-400">
                                    {command.icon}
                                  </span>
                                )}
                                <div>
                                  <div className="font-medium">{command.label}</div>
                                  {command.description && (
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                      {command.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                              {command.shortcut && (
                                <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                                  {command.shortcut.split('+').map((key, i) => (
                                    <React.Fragment key={i}>
                                      {i > 0 && <span>+</span>}
                                      <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                                        {key}
                                      </kbd>
                                    </React.Fragment>
                                  ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <ArrowUp className="w-3 h-3 mr-1" />
                    <ArrowDown className="w-3 h-3 mr-1" />
                    <span>Navigate</span>
                  </div>
                  <div className="flex items-center">
                    <CornerDownLeft className="w-3 h-3 mr-1" />
                    <span>Select</span>
                  </div>
                  <div className="flex items-center">
                    <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs">
                      ESC
                    </kbd>
                    <span className="ml-1">Close</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <Command className="w-3 h-3 mr-1" />
                  <span>Command Palette</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;

// Hook for using command palette
export const useCommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(!isOpen);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
};