import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Prospect, ContentItem, CallLog, BattleCard, WebSearchResult, CallSequence, Contact } from '@/types';

interface ProfileData {
  userName?: string;
  email?: string;
  phone?: string;
  theme?: 'light' | 'dark' | 'system';
  complexityPreference?: 'simple' | 'advanced';
  whyISell?: string;
  motivationalImages?: string[];
}

interface AppState {
  // Current lead data (keeping prospect for backward compatibility)
  prospect: Prospect | null;
  setProspect: (prospect: Prospect) => void;
  // New lead methods
  lead: Prospect | null;
  setLead: (lead: Prospect) => void;
  
  // Selected content for battle card
  selectedContent: ContentItem[];
  setSelectedContent: (content: ContentItem[]) => void;
  addSelectedContent: (content: ContentItem) => void;
  removeSelectedContent: (contentId: string) => void;
  
  // Dynamic intelligence from web search
  dynamicIntelligence: WebSearchResult[];
  setDynamicIntelligence: (results: WebSearchResult[]) => void;
  
  // Call logs
  callLogs: CallLog[];
  addCallLog: (log: CallLog) => void;
  updateCallLog: (id: string, updates: Partial<CallLog>) => void;
  getCallLogsForContact: (contactId: string) => CallLog[];
  
  // Battle cards history
  battleCards: BattleCard[];
  addBattleCard: (card: BattleCard) => void;
  
  // Call sequences
  callSequences: CallSequence[];
  activeSequenceId: string | null;
  addCallSequence: (sequence: CallSequence) => void;
  updateCallSequence: (id: string, updates: Partial<CallSequence>) => void;
  setActiveSequence: (id: string | null) => void;
  updateContactInSequence: (sequenceId: string, contactId: string, updates: Partial<Contact>) => void;
  
  // Call timer state
  activeCallStartTime: Date | null;
  activeCallDuration: number;
  setActiveCallStartTime: (time: Date | null) => void;
  setActiveCallDuration: (duration: number) => void;
  
  // UI state
  currentModule: 'dashboard' | 'call-planner' | 'battle-card' | 'live-call' | 'post-game' | 'help-center' | 'profile' | 'resources';
  setCurrentModule: (module: 'dashboard' | 'call-planner' | 'battle-card' | 'live-call' | 'post-game' | 'help-center' | 'profile' | 'resources') => void;
  
  // UI preferences
  advancedMode: boolean;
  setAdvancedMode: (mode: boolean) => void;
  salesWizardMode: boolean;
  setSalesWizardMode: (mode: boolean) => void;
  
  // Profile data
  profile: ProfileData;
  updateProfile: (updates: Partial<ProfileData>) => void;
  
  // Loading states
  isGeneratingIntelligence: boolean;
  setIsGeneratingIntelligence: (loading: boolean) => void;
  
  // Reset functions
  resetProspect: () => void;
  resetAll: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      prospect: null,
      lead: null,
      selectedContent: [],
      dynamicIntelligence: [],
      callLogs: [],
      battleCards: [],
      callSequences: [],
      activeSequenceId: null,
      activeCallStartTime: null,
      activeCallDuration: 0,
      currentModule: 'dashboard',
      advancedMode: false,
      salesWizardMode: false,
      isGeneratingIntelligence: false,
      profile: {},
      
      // Lead/Prospect actions
      setProspect: (prospect) => set({ prospect, lead: prospect }),
      setLead: (lead) => set({ lead, prospect: lead }),
      
      // Content selection actions
      setSelectedContent: (content) => set({ selectedContent: content }),
      addSelectedContent: (content) => {
        const { selectedContent } = get();
        if (!selectedContent.find(item => item.id === content.id)) {
          set({ selectedContent: [...selectedContent, content] });
        }
      },
      removeSelectedContent: (contentId) => {
        const { selectedContent } = get();
        set({ selectedContent: selectedContent.filter(item => item.id !== contentId) });
      },
      
      // Dynamic intelligence actions
      setDynamicIntelligence: (results) => set({ dynamicIntelligence: results }),
      
      // Call log actions
      addCallLog: (log) => {
        const { callLogs, activeSequenceId, callSequences } = get();
        set({ callLogs: [...callLogs, log] });
        
        // Update contact status in active sequence if applicable
        if (activeSequenceId && log.sequenceId === activeSequenceId) {
          const sequence = callSequences.find(s => s.id === activeSequenceId);
          if (sequence && log.contactId) {
            const updatedSequences = callSequences.map(seq => {
              if (seq.id === activeSequenceId) {
                return {
                  ...seq,
                  contacts: seq.contacts.map(contact => {
                    if (contact.id === log.contactId) {
                      return {
                        ...contact,
                        status: (log.outcome === 'meeting-booked' ? 'success' : 'called') as 'success' | 'called',
                        callResult: log
                      };
                    }
                    return contact;
                  })
                };
              }
              return seq;
            });
            set({ callSequences: updatedSequences });
          }
        }
      },
      updateCallLog: (id, updates) => {
        const { callLogs } = get();
        set({ 
          callLogs: callLogs.map(log => 
            log.id === id ? { ...log, ...updates } : log
          )
        });
      },
      getCallLogsForContact: (contactId) => {
        const { callLogs } = get();
        return callLogs.filter(log => log.contactId === contactId);
      },
      
      // Battle card actions
      addBattleCard: (card) => {
        const { battleCards } = get();
        set({ battleCards: [...battleCards, card] });
      },
      
      // Call sequence actions
      addCallSequence: (sequence) => {
        const { callSequences } = get();
        set({ callSequences: [...callSequences, sequence] });
      },
      updateCallSequence: (id, updates) => {
        const { callSequences } = get();
        set({
          callSequences: callSequences.map(seq =>
            seq.id === id ? { ...seq, ...updates } : seq
          )
        });
      },
      setActiveSequence: (id) => set({ activeSequenceId: id }),
      updateContactInSequence: (sequenceId, contactId, updates) => {
        const { callSequences } = get();
        set({
          callSequences: callSequences.map(seq => {
            if (seq.id === sequenceId) {
              return {
                ...seq,
                contacts: seq.contacts.map(contact =>
                  contact.id === contactId ? { ...contact, ...updates } : contact
                )
              };
            }
            return seq;
          })
        });
      },
      
      // Call timer actions
      setActiveCallStartTime: (time) => set({ activeCallStartTime: time }),
      setActiveCallDuration: (duration) => set({ activeCallDuration: duration }),
      
      // UI actions
      setCurrentModule: (module) => set({ currentModule: module }),
      setAdvancedMode: (mode) => set({ advancedMode: mode }),
      setSalesWizardMode: (mode) => set({ salesWizardMode: mode }),
      
      // Profile actions
      updateProfile: (updates) => {
        const { profile } = get();
        set({ profile: { ...profile, ...updates } });
      },
      
      // Loading actions
      setIsGeneratingIntelligence: (loading) => set({ isGeneratingIntelligence: loading }),
      
      // Reset actions
      resetProspect: () => set({ 
        prospect: null,
        lead: null,
        selectedContent: [], 
        dynamicIntelligence: [],
        activeCallStartTime: null,
        activeCallDuration: 0
      }),
      resetAll: () => set({
        prospect: null,
        lead: null,
        selectedContent: [],
        dynamicIntelligence: [],
        currentModule: 'dashboard',
        isGeneratingIntelligence: false,
        activeCallStartTime: null,
        activeCallDuration: 0
      })
    }),
    {
      name: 'wolf-den-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        callLogs: state.callLogs,
        battleCards: state.battleCards,
        callSequences: state.callSequences,
        activeSequenceId: state.activeSequenceId,
        advancedMode: state.advancedMode,
        salesWizardMode: state.salesWizardMode,
        profile: state.profile
      })
    }
  )
);