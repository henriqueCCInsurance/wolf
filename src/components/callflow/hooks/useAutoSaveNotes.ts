import { useState, useEffect } from 'react';
import { Prospect } from '@/types';

/**
 * Custom hook for auto-saving call notes to localStorage
 * Includes debouncing to prevent excessive saves
 */
export const useAutoSaveNotes = (notes: string, prospect: Prospect | null) => {
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  
  useEffect(() => {
    if (prospect && notes) {
      setSaveStatus('saving');
      const timeoutId = setTimeout(() => {
        try {
          const storageKey = `wolf-den-call-notes-${prospect.companyName}-${prospect.contactName}`;
          // Validate the key to prevent injection attacks
          const sanitizedKey = storageKey.replace(/[^a-zA-Z0-9-_]/g, '-');
          
          // Store with metadata for cleanup
          const noteData = {
            notes,
            timestamp: new Date().toISOString(),
            prospectId: `${prospect.companyName}-${prospect.contactName}`
          };
          
          localStorage.setItem(sanitizedKey, JSON.stringify(noteData));
          setSaveStatus('saved');
          
          // Clean up old notes (older than 7 days)
          cleanupOldNotes();
        } catch (error) {
          console.error('Failed to save notes:', error);
          setSaveStatus('unsaved');
        }
      }, 1000); // Save after 1 second of inactivity
      
      return () => clearTimeout(timeoutId);
    }
  }, [notes, prospect]);
  
  return { saveStatus };
};

/**
 * Clean up notes older than 7 days
 */
function cleanupOldNotes() {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // Get all keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('wolf-den-call-notes-')) {
        try {
          const item = localStorage.getItem(key);
          if (item) {
            const data = JSON.parse(item);
            if (data.timestamp && new Date(data.timestamp) < sevenDaysAgo) {
              localStorage.removeItem(key);
            }
          }
        } catch {
          // Remove invalid entries
          localStorage.removeItem(key);
        }
      }
    }
  } catch (error) {
    console.error('Error cleaning up old notes:', error);
  }
}

/**
 * Load saved notes for a prospect
 */
export function loadAutoSavedNotes(prospect: Prospect | null): string | null {
  if (!prospect) return null;
  
  try {
    const storageKey = `wolf-den-call-notes-${prospect.companyName}-${prospect.contactName}`;
    const sanitizedKey = storageKey.replace(/[^a-zA-Z0-9-_]/g, '-');
    const item = localStorage.getItem(sanitizedKey);
    
    if (item) {
      const data = JSON.parse(item);
      return data.notes || null;
    }
  } catch (error) {
    console.error('Failed to load saved notes:', error);
  }
  
  return null;
}