import { useEffect, useCallback } from 'react';
import { useAppStore } from '@/store';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
  category: string;
}

export const useKeyboardShortcuts = () => {
  const { setCurrentModule, resetProspect } = useAppStore();

  const shortcuts: KeyboardShortcut[] = [
    // Navigation shortcuts
    {
      key: 'd',
      altKey: true,
      action: () => setCurrentModule('dashboard'),
      description: 'Go to Dashboard',
      category: 'Navigation'
    },
    {
      key: '1',
      altKey: true,
      action: () => setCurrentModule('call-planner'),
      description: 'Go to Planner (Step 1)',
      category: 'Navigation'
    },
    {
      key: '2',
      altKey: true,
      action: () => setCurrentModule('call-planner'),
      description: 'Go to Planner (Step 2)',
      category: 'Navigation'
    },
    {
      key: '3',
      altKey: true,
      action: () => setCurrentModule('battle-card'),
      description: 'Go to Guide (Step 3)',
      category: 'Navigation'
    },
    {
      key: '4',
      altKey: true,
      action: () => setCurrentModule('post-game'),
      description: 'Go to Results',
      category: 'Navigation'
    },
    // Quick actions
    {
      key: 'n',
      ctrlKey: true,
      action: () => {
        resetProspect();
        setCurrentModule('call-planner');
      },
      description: 'New prospect',
      category: 'Quick Actions'
    },
    {
      key: 'r',
      ctrlKey: true,
      shiftKey: true,
      action: () => window.location.reload(),
      description: 'Refresh application',
      category: 'Quick Actions'
    },
    // Help
    {
      key: '?',
      shiftKey: true,
      action: () => {
        // This will be handled by the ShortcutsHelp component
        window.dispatchEvent(new CustomEvent('toggleShortcutsHelp'));
      },
      description: 'Show keyboard shortcuts',
      category: 'Help'
    }
  ];

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    if (event.target instanceof HTMLInputElement || 
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement) {
      return;
    }

    // Find matching shortcut
    const shortcut = shortcuts.find(s => 
      s.key.toLowerCase() === event.key.toLowerCase() &&
      !!s.ctrlKey === event.ctrlKey &&
      !!s.altKey === event.altKey &&
      !!s.shiftKey === event.shiftKey &&
      !!s.metaKey === event.metaKey
    );

    if (shortcut) {
      event.preventDefault();
      shortcut.action();
    }
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { shortcuts };
};

export default useKeyboardShortcuts;