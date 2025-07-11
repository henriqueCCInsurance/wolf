import { useState, useCallback, useEffect } from 'react';
import { Prospect } from '@/types';
import { zoomPhoneService } from '@/services/zoomPhone';
import { CallFlowStep, ContentItem } from '../types';
import { BASE_CALL_FLOW_STEPS } from '../constants';

interface CallState {
  isPrepared: boolean;
  isInProgress: boolean;
  startTime: Date | null;
  notes: string;
  currentStep: number;
}

/**
 * Custom hook for managing call state and flow
 * Centralizes all call-related state management
 */
export const useCallState = (prospect: Prospect | null, selectedContent: ContentItem[]) => {
  const [callState, setCallState] = useState<CallState>({
    isPrepared: false,
    isInProgress: false,
    startTime: null,
    notes: '',
    currentStep: 0
  });
  
  const [callFlowSteps, setCallFlowSteps] = useState<CallFlowStep[]>([]);
  
  // Initialize call flow steps with selected content
  const initializeCallFlowSteps = useCallback((): CallFlowStep[] => {
    return BASE_CALL_FLOW_STEPS.map(step => {
      const stepContent = selectedContent.filter(content => {
        switch (step.id) {
          case 'opening':
            return content.type === 'opener';
          case 'presentation':
            return content.type === 'thought-leadership';
          case 'objections':
            return content.type === 'objection-handler';
          default:
            return false;
        }
      });
      
      return {
        ...step,
        selectedContent: stepContent.length > 0 ? stepContent : undefined
      };
    });
  }, [selectedContent]);
  
  // Update call flow steps when selected content changes
  useEffect(() => {
    setCallFlowSteps(prevSteps => {
      const previousStepsMap = new Map(prevSteps.map(step => [step.id, step]));
      
      return BASE_CALL_FLOW_STEPS.map(step => {
        const previousStep = previousStepsMap.get(step.id);
        const stepContent = selectedContent.filter(content => {
          switch (step.id) {
            case 'opening':
              return content.type === 'opener';
            case 'presentation':
              return content.type === 'thought-leadership';
            case 'objections':
              return content.type === 'objection-handler';
            default:
              return false;
          }
        });
        
        return {
          ...step,
          completed: previousStep ? previousStep.completed : false,
          selectedContent: stepContent.length > 0 ? stepContent : undefined
        };
      });
    });
  }, [selectedContent]);
  
  // Load saved notes when prospect changes
  useEffect(() => {
    if (prospect) {
      const storageKey = `wolf-den-call-notes-${prospect.companyName}-${prospect.contactName}`;
      const savedNotes = localStorage.getItem(storageKey);
      if (savedNotes && savedNotes !== callState.notes) {
        setCallState(prev => ({ ...prev, notes: savedNotes }));
      }
    } else {
      setCallState(prev => ({ ...prev, notes: '' }));
    }
  }, [prospect, callState.notes]);
  
  // Initialize steps on mount
  useEffect(() => {
    setCallFlowSteps(initializeCallFlowSteps());
  }, [initializeCallFlowSteps]);
  
  const startSession = useCallback(() => {
    setCallState(prev => ({
      ...prev,
      isPrepared: true,
      startTime: new Date()
    }));
  }, []);
  
  const initiateCall = useCallback(async (prospect: Prospect) => {
    // Start timer if not already started
    if (!callState.isPrepared) {
      setCallState(prev => ({
        ...prev,
        isPrepared: true,
        startTime: new Date()
      }));
    }
    
    // Initiate the phone call through Zoom Phone
    const callInitiated = await zoomPhoneService.initiateCall({
      phoneNumber: prospect.contactPhone!,
      contactName: prospect.contactName,
      companyName: prospect.companyName,
      leadId: prospect.companyName + prospect.contactName
    });
    
    if (callInitiated.success) {
      setCallState(prev => ({ ...prev, isInProgress: true }));
    }
    
    return callInitiated;
  }, [callState.isPrepared]);
  
  const endCall = useCallback(() => {
    setCallState(prev => ({
      ...prev,
      isPrepared: false,
      isInProgress: false
    }));
  }, []);
  
  const resetCall = useCallback(() => {
    setCallState({
      isPrepared: false,
      isInProgress: false,
      startTime: null,
      notes: '',
      currentStep: 0
    });
    
    setCallFlowSteps(prevSteps => 
      prevSteps.map(step => ({ ...step, completed: false }))
    );
    
    // Clear saved notes from localStorage
    if (prospect) {
      const storageKey = `wolf-den-call-notes-${prospect.companyName}-${prospect.contactName}`;
      localStorage.removeItem(storageKey);
    }
  }, [prospect]);
  
  const updateCallNotes = useCallback((notes: string) => {
    setCallState(prev => ({ ...prev, notes }));
  }, []);
  
  const markStepComplete = useCallback((stepIndex: number) => {
    const newSteps = [...callFlowSteps];
    newSteps[stepIndex].completed = true;
    
    // Self-stacking: move completed item to bottom
    const completedStep = newSteps[stepIndex];
    const remainingSteps = newSteps.filter((_, index) => index !== stepIndex);
    
    // Separate completed and pending steps
    const pendingSteps = remainingSteps.filter(step => !step.completed);
    const completedSteps = remainingSteps.filter(step => step.completed);
    
    // Reconstruct array with pending steps first, then completed steps
    const reorderedSteps = [...pendingSteps, ...completedSteps, completedStep];
    
    setCallFlowSteps(reorderedSteps);
    
    // Update current step to focus on next pending step
    const nextPendingIndex = pendingSteps.findIndex(step => !step.completed);
    if (nextPendingIndex >= 0) {
      setCallState(prev => ({ ...prev, currentStep: nextPendingIndex }));
    } else {
      setCallState(prev => ({ ...prev, currentStep: 0 }));
    }
  }, [callFlowSteps]);
  
  return {
    callState,
    startSession,
    initiateCall,
    endCall,
    resetCall,
    updateCallNotes,
    markStepComplete,
    callFlowSteps
  };
};