import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, ArrowUp, ArrowDown, CornerDownLeft, Hash, User, FileText, Settings, Zap, Sparkles, Bot } from 'lucide-react';
import { designTokens } from '@/styles/tokens';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  action: () => void;
  shortcut?: string;
  category?: string;
  keywords?: string[];
  isAI?: boolean; // AI-generated content indicator
  priority?: 'high' | 'medium' | 'low';
  badge?: string; // Optional badge text
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
          className={`fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: designTokens.animation.easing.spring }}
          style={{
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            background: 'rgba(0, 0, 0, 0.5)'
          }}
        >
          <motion.div
            className="w-full max-w-2xl gpu-accelerated"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ 
              duration: 0.3, 
              ease: designTokens.animation.easing.spring,
              type: 'spring',
              stiffness: 300,
              damping: 30
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: designTokens.borderRadius['2xl'],
              boxShadow: designTokens.boxShadow['glass-lg']
            }}
          >
            {/* Header */}
            <div className="p-6 border-b border-white/20">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={placeholder}
                  className="w-full pl-12 pr-4 py-4 text-lg bg-transparent border-none focus:outline-none text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 font-sans tracking-tight"
                />
                {/* AI indicator */}
                {searchTerm && (
                  <motion.div
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Sparkles className="w-4 h-4 text-primary-500" />
                    <span className="text-xs text-primary-600 font-medium">AI</span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Commands */}
            <div className="max-h-96 overflow-y-auto">
              {Object.keys(groupedCommands).length === 0 ? (
                <motion.div 
                  className="p-8 text-center text-neutral-500 dark:text-neutral-400"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-semibold mb-2 font-display">No results found</p>
                  <p className="text-sm opacity-75">Try searching with different keywords</p>
                </motion.div>
              ) : (
                <div className="py-3">
                  {Object.entries(groupedCommands).map(([category, categoryCommands], categoryIndex) => (
                    <motion.div 
                      key={category} 
                      className="mb-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: categoryIndex * 0.05 }}
                    >
                      {/* Category Header */}
                      <div className="px-6 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider flex items-center">
                        {getCategoryIcon(category)}
                        <span className="ml-2 font-mono">{category}</span>
                      </div>

                      {/* Commands in Category */}
                      {categoryCommands.map((command, commandIndex) => {
                        const globalIndex = filteredCommands.findIndex(c => c.id === command.id);
                        const isSelected = globalIndex === selectedIndex;

                        return (
                          <motion.div
                            key={command.id}
                            className={`mx-2 px-4 py-3 cursor-pointer transition-all duration-200 rounded-xl relative overflow-hidden gpu-accelerated ${
                              isSelected 
                                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 shadow-float' 
                                : 'hover:bg-white/60 dark:hover:bg-neutral-800/60 text-neutral-900 dark:text-neutral-100 hover:shadow-float'
                            }`}
                            onClick={() => {
                              command.action();
                              onClose();
                            }}
                            whileHover={{ 
                              scale: 1.02, 
                              y: -1,
                              transition: { duration: 0.2 }
                            }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (categoryIndex * 0.05) + (commandIndex * 0.02) }}
                          >
                            {/* AI glow effect */}
                            {command.isAI && (
                              <motion.div
                                className="absolute inset-0 rounded-xl opacity-20"
                                style={{
                                  background: 'linear-gradient(90deg, #a5cf4c, #7dd3fc, #c084fc)'
                                }}
                                animate={{
                                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                                }}
                                transition={{
                                  duration: 3,
                                  repeat: Infinity,
                                  ease: 'linear'
                                }}
                              />
                            )}
                            
                            <div className="flex items-center justify-between relative z-10">
                              <div className="flex items-center flex-1">
                                {command.icon && (
                                  <span className="mr-3 text-neutral-500 dark:text-neutral-400">
                                    {command.icon}
                                  </span>
                                )}
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-semibold font-sans">{command.label}</span>
                                    {command.isAI && (
                                      <motion.div
                                        className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-primary-500 to-accent-electric-500 text-white shadow-glow-sm"
                                        whileHover={{ scale: 1.05 }}
                                      >
                                        <Bot className="w-3 h-3" />
                                        <span>AI</span>
                                      </motion.div>
                                    )}
                                    {command.badge && (
                                      <span className="px-2 py-1 text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 rounded-full">
                                        {command.badge}
                                      </span>
                                    )}
                                  </div>
                                  {command.description && (
                                    <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 font-sans">
                                      {command.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                              {command.shortcut && (
                                <div className="flex items-center space-x-1 text-xs text-neutral-500 dark:text-neutral-400">
                                  {command.shortcut.split('+').map((key, i) => (
                                    <React.Fragment key={i}>
                                      {i > 0 && <span>+</span>}
                                      <kbd className="px-2 py-1 bg-neutral-100 dark:bg-neutral-700 rounded text-xs font-mono shadow-neu-inset">
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
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <motion.div 
              className="p-4 border-t border-white/20 bg-white/30 dark:bg-neutral-900/30 backdrop-blur-glass"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <ArrowUp className="w-3 h-3 mr-1" />
                    <ArrowDown className="w-3 h-3 mr-1" />
                    <span className="font-mono">Navigate</span>
                  </div>
                  <div className="flex items-center">
                    <CornerDownLeft className="w-3 h-3 mr-1" />
                    <span className="font-mono">Select</span>
                  </div>
                  <div className="flex items-center">
                    <kbd className="px-2 py-1 bg-neutral-100 dark:bg-neutral-700 rounded text-xs font-mono shadow-neu-inset">
                      ESC
                    </kbd>
                    <span className="ml-1 font-mono">Close</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <Command className="w-3 h-3 mr-1" />
                  <span className="font-mono">Command Palette</span>
                </div>
              </div>
            </motion.div>
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