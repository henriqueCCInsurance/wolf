import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Prospect, ContentItem, CallLog, BattleCard, WebSearchResult } from '@/types';

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
  
  // Battle cards history
  battleCards: BattleCard[];
  addBattleCard: (card: BattleCard) => void;
  
  // UI state
  currentModule: 'hunt-planner' | 'call-sequence' | 'battle-card' | 'live-call' | 'post-game';
  setCurrentModule: (module: 'hunt-planner' | 'call-sequence' | 'battle-card' | 'live-call' | 'post-game') => void;
  
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
      currentModule: 'hunt-planner',
      isGeneratingIntelligence: false,
      
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
        const { callLogs } = get();
        set({ callLogs: [...callLogs, log] });
      },
      
      // Battle card actions
      addBattleCard: (card) => {
        const { battleCards } = get();
        set({ battleCards: [...battleCards, card] });
      },
      
      // UI actions
      setCurrentModule: (module) => set({ currentModule: module }),
      
      // Loading actions
      setIsGeneratingIntelligence: (loading) => set({ isGeneratingIntelligence: loading }),
      
      // Reset actions
      resetProspect: () => set({ 
        prospect: null,
        lead: null,
        selectedContent: [], 
        dynamicIntelligence: [] 
      }),
      resetAll: () => set({
        prospect: null,
        lead: null,
        selectedContent: [],
        dynamicIntelligence: [],
        currentModule: 'hunt-planner',
        isGeneratingIntelligence: false
      })
    }),
    {
      name: 'wolf-den-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        callLogs: state.callLogs,
        battleCards: state.battleCards
      })
    }
  )
);