import React, { useState, useEffect, useCallback, useMemo, useReducer } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, Square, CheckCircle, Calendar, Phone, MessageSquare, Lightbulb,
  ArrowRight, FileText, Send, UserPlus, Clock, BookOpen,
  Search, ChevronDown, ChevronUp, Download, RotateCcw, ClipboardList, Users
} from 'lucide-react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import CallTimer from '@/components/gamification/CallTimer';
import SuccessButton from '@/components/gamification/SuccessButton';
import CollapsibleSection from '@/components/common/CollapsibleSection';
import ReadyToCallIndicator from '@/components/callflow/ReadyToCallIndicator';
import ClickablePhone from '@/components/common/ClickablePhone';
import TimerErrorBoundary from '@/components/common/TimerErrorBoundary';
import { useAppStore } from '@/store';
import { callObjectives } from '@/data/content';
import { SuccessPredictionService } from '@/services/successPrediction';
import { SuccessPredictionDisplay } from '@/components/common/SuccessPredictionDisplay';
import { useAutoSaveNotes } from './hooks/useAutoSaveNotes';
import { useCallState } from './hooks/useCallState';
import { modalReducer, initialModalState } from './reducers/modalReducer';
import { 
  CalendarModal, FollowUpModal, ResourcesModal, CRMModal, 
  OutcomeModal, SuccessModal, NoGoModal, LibraryModal 
} from './modals';

/**
 * LiveCallAssistance Component - Refactored Version
 * 
 * Key improvements:
 * 1. Reduced state variables from 29 to ~10 through consolidation
 * 2. Extracted custom hooks for auto-save and call state management
 * 3. Consolidated modal state into a single reducer
 * 4. Memoized expensive operations
 * 5. Extracted modal components to separate files
 * 6. Simplified useEffect chains
 */
const LiveCallAssistance: React.FC = () => {
  const { prospect, addCallLog, selectedContent, callSequences, activeSequenceId, callLogs } = useAppStore();
  
  // Consolidated modal state management using reducer
  const [modalState, modalDispatch] = useReducer(modalReducer, initialModalState);
  
  // Custom hook for call state management
  const {
    callState,
    startSession,
    initiateCall,
    endCall,
    resetCall,
    updateCallNotes,
    markStepComplete,
    callFlowSteps
  } = useCallState(prospect, selectedContent);
  
  // Custom hook for auto-save functionality
  const { saveStatus } = useAutoSaveNotes(callState.notes, prospect);
  
  // UI State
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showSequenceDetails, setShowSequenceDetails] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [librarySearchTerm, setLibrarySearchTerm] = useState('');
  
  // Success prediction state
  const [successPrediction, setSuccessPrediction] = useState<ReturnType<typeof SuccessPredictionService.prototype.calculatePrediction> | null>(null);
  
  // Memoized values
  const isCallActive = useMemo(() => callState.isPrepared || callState.isInProgress, [callState.isPrepared, callState.isInProgress]);
  
  const activeSequence = useMemo(() => 
    activeSequenceId ? callSequences.find(seq => seq.id === activeSequenceId) : null,
    [activeSequenceId, callSequences]
  );
  
  const currentContactIndex = useMemo(() => 
    activeSequence ? activeSequence.contacts.findIndex(contact => 
      contact.companyName === prospect?.companyName && contact.contactName === prospect?.contactName
    ) : -1,
    [activeSequence, prospect]
  );
  
  const completedSteps = useMemo(() => 
    callFlowSteps.filter(step => step.completed).length,
    [callFlowSteps]
  );
  
  const progressPercentage = useMemo(() => 
    (completedSteps / callFlowSteps.length) * 100,
    [completedSteps, callFlowSteps.length]
  );
  
  const filteredLibraryContent = useMemo(() => {
    if (!librarySearchTerm) return selectedContent;
    const searchLower = librarySearchTerm.toLowerCase();
    return selectedContent.filter(content => 
      content.content.toLowerCase().includes(searchLower) ||
      (content.context && content.context.toLowerCase().includes(searchLower))
    );
  }, [librarySearchTerm, selectedContent]);
  
  // Calculate success prediction when prospect changes
  useEffect(() => {
    if (prospect && !isCallActive) {
      const predictionService = SuccessPredictionService.getInstance();
      const prediction = predictionService.calculatePrediction(prospect, callLogs);
      setSuccessPrediction(prediction);
    }
  }, [prospect, isCallActive, callLogs]);
  
  // Update prediction model after successful call
  useEffect(() => {
    const latestCallLog = callLogs[callLogs.length - 1];
    if (latestCallLog && latestCallLog.createdAt) {
      const createdAtTime = latestCallLog.createdAt instanceof Date 
        ? latestCallLog.createdAt.getTime() 
        : new Date(latestCallLog.createdAt).getTime();
      
      if (createdAtTime > Date.now() - 5000) {
        const predictionService = SuccessPredictionService.getInstance();
        predictionService.updateModel(latestCallLog);
      }
    }
  }, [callLogs.length, callLogs]);
  
  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showExportMenu && !target.closest('[data-export-menu]')) {
        setShowExportMenu(false);
      }
    };
    
    if (showExportMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showExportMenu]);
  
  // Handler functions
  const handleStartSession = useCallback(() => {
    if (!prospect) {
      alert('No prospect selected. Please go to Planner first to select a prospect.');
      return;
    }
    startSession();
  }, [prospect, startSession]);
  
  const handleInitiateCall = useCallback(async () => {
    if (!prospect) {
      alert('No prospect selected. Please go to Planner first to select a prospect.');
      return;
    }
    if (!prospect.contactPhone) {
      alert('No phone number available for this prospect. Please add a phone number in the Planner.');
      return;
    }
    
    try {
      const result = await initiateCall(prospect);
      if (!result.success) {
        alert('Failed to initiate call. Please check if Zoom Phone is installed and configured.');
      }
    } catch (error) {
      console.error('Error initiating call:', error);
      alert('Error starting call. Please try again or check your phone system configuration.');
    }
  }, [prospect, initiateCall]);
  
  const handleEndCall = useCallback(() => {
    endCall();
    modalDispatch({ type: 'SHOW_MODAL', modalType: 'outcome' });
  }, [endCall, modalDispatch]);
  
  const handleLogResults = useCallback(() => {
    if (!callState.isPrepared && !callState.isInProgress) {
      alert('Please start a call session first before logging results.');
      return;
    }
    modalDispatch({ type: 'SHOW_MODAL', modalType: 'outcome' });
  }, [callState.isPrepared, callState.isInProgress, modalDispatch]);
  
  const handleStepComplete = useCallback((stepIndex: number) => {
    markStepComplete(stepIndex);
  }, [markStepComplete]);
  
  const handleCallSuccess = useCallback((type: 'meeting-booked' | 'follow-up' | 'intelligence' | 'referral', points: number) => {
    setUserPoints(prev => prev + points);
    
    // Add success to call notes
    const successNote = `\n\n🎯 Success: ${type.replace('-', ' ').toUpperCase()} (+${points} points)`;
    updateCallNotes(callState.notes + successNote);
    
    // Create proper call log for success
    if (prospect && callState.startTime) {
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - callState.startTime.getTime()) / 1000);
      
      const callLog = {
        id: `call-${Date.now()}`,
        leadId: `${prospect.companyName}-${prospect.contactName}`,
        outcome: type === 'meeting-booked' ? 'meeting-booked' as const : 
                 type === 'follow-up' ? 'follow-up' as const : 
                 'nurture' as const,
        intel: callState.notes + successNote || 'Successful call completed',
        bestTalkingPoint: 'User-selected content from battle card',
        keyTakeaway: `${type.replace('-', ' ').toUpperCase()} achieved (+${points} points)`,
        createdAt: new Date(),
        callDuration: duration,
        additionalInfo: {
          companyInsights: callState.notes,
          nextSteps: type === 'meeting-booked' ? 'Meeting scheduled' : 
                    type === 'follow-up' ? 'Follow-up scheduled' : 
                    'Continue nurturing relationship',
          outcome: 'success',
          successType: type,
          pointsEarned: points
        }
      };
      
      addCallLog(callLog);
      
      // Clear notes after logging
      if (prospect) {
        const storageKey = `wolf-den-call-notes-${prospect.companyName}-${prospect.contactName}`;
        localStorage.removeItem(storageKey);
      }
    }
    
    // Log analytics
    console.log(`Call success: ${type}, Points: ${points}`);
  }, [prospect, callState.startTime, callState.notes, addCallLog, updateCallNotes]);
  
  const toggleStepExpansion = useCallback((stepId: string) => {
    setExpandedSteps(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(stepId)) {
        newExpanded.delete(stepId);
      } else {
        newExpanded.add(stepId);
      }
      return newExpanded;
    });
  }, []);
  
  const handleExportNotes = useCallback((format: 'txt' | 'pdf' | 'docx') => {
    if (!callState.notes || !prospect) return;
    
    const timestamp = new Date().toLocaleString();
    const header = `Call Notes\n${prospect.companyName} - ${prospect.contactName}\n${timestamp}\n\n`;
    const content = header + callState.notes;
    
    if (format === 'txt') {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `call-notes-${prospect.companyName}-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (format === 'pdf') {
      import('jspdf').then(({ jsPDF }) => {
        const doc = new jsPDF();
        const lines = content.split('\n');
        let y = 20;
        
        lines.forEach(line => {
          if (y > 280) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, 20, y);
          y += 7;
        });
        
        doc.save(`call-notes-${prospect.companyName}-${Date.now()}.pdf`);
      });
    } else if (format === 'docx') {
      const htmlContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
        <head><meta charset="utf-8"><title>Call Notes</title></head>
        <body>
          <h1>Call Notes</h1>
          <h2>${prospect.companyName} - ${prospect.contactName}</h2>
          <p>${timestamp}</p>
          <hr>
          <pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${callState.notes}</pre>
        </body>
        </html>
      `;
      const blob = new Blob([htmlContent], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `call-notes-${prospect.companyName}-${Date.now()}.doc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    
    setShowExportMenu(false);
  }, [callState.notes, prospect]);
  
  // No prospect selected state
  if (!prospect) {
    return (
      <Card title="Call Assistance">
        <div className="text-center py-12">
          <Phone className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Select a Prospect First</h3>
          <p className="text-gray-500 dark:text-gray-300">
            Choose a prospect from Planner to access call assistance
          </p>
        </div>
      </Card>
    );
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column - Call Controls & Status */}
      <div className="space-y-6">
        {/* Ready to Call Indicator */}
        <ReadyToCallIndicator prospect={prospect} className="" />
        
        {/* Success Prediction */}
        {successPrediction && !isCallActive && (
          <SuccessPredictionDisplay prediction={successPrediction} compact={true} />
        )}
        
        {/* Call Status Card */}
        <Card className={`${
          callState.isInProgress ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
          callState.isPrepared ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' :
          'border-gray-200 dark:border-gray-700'
        }`}>
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className={`w-4 h-4 rounded-full ${
                callState.isInProgress ? 'bg-green-500 animate-pulse' :
                callState.isPrepared ? 'bg-blue-500 animate-pulse' :
                'bg-gray-300 dark:bg-gray-600'
              }`} />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {callState.isInProgress ? 'Call in Progress' :
                 callState.isPrepared ? 'Session Active' :
                 'Call Assistant'}
              </h2>
            </div>
            
            <div className="text-gray-600 dark:text-gray-300">
              <div className="font-medium">{prospect.companyName}</div>
              <div className="text-sm">{prospect.contactName}</div>
              {prospect.contactPhone && (
                <div className="mt-1">
                  <ClickablePhone 
                    phoneNumber={prospect.contactPhone}
                    contactName={prospect.contactName}
                    companyName={prospect.companyName}
                    size="sm"
                  />
                </div>
              )}
            </div>
            
            {/* Sequence Progress Display */}
            {activeSequence && currentContactIndex >= 0 && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Call {currentContactIndex + 1} of {activeSequence.contacts.length}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowSequenceDetails(!showSequenceDetails)}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {showSequenceDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
                
                {showSequenceDetails && (
                  <div className="mt-2 space-y-2">
                    <div className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-1">
                      Sequence: {activeSequence.name}
                    </div>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {activeSequence.contacts.map((contact, index) => (
                        <div 
                          key={contact.id} 
                          className={`text-xs p-2 rounded ${index === currentContactIndex 
                            ? 'bg-blue-100 dark:bg-blue-800 text-blue-900 dark:text-blue-100 font-medium' 
                            : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span>{contact.contactName} - {contact.companyName}</span>
                            <span className={`px-1 py-0.5 rounded text-xs ${
                              contact.status === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                              contact.status === 'called' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                              contact.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                              'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                            }`}>
                              {contact.status === 'pending' ? 'Pending' : 
                               contact.status === 'called' ? 'Called' :
                               contact.status === 'success' ? 'Success' : 'Failed'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Enhanced 5-Button Call Controls */}
            <div className="flex justify-center gap-2 flex-wrap">
              {!callState.isPrepared && !callState.isInProgress && (
                <Button onClick={handleStartSession} className="bg-blue-600 hover:bg-blue-700">
                  <Play className="w-4 h-4 mr-2" />
                  <span>Start</span>
                </Button>
              )}
              
              {!callState.isInProgress && (
                <Button onClick={handleInitiateCall} className="bg-green-600 hover:bg-green-700">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>Call</span>
                </Button>
              )}
              
              {(callState.isPrepared || callState.isInProgress) && (
                <Button 
                  onClick={handleEndCall}
                  variant="secondary"
                  className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
                >
                  <Square className="w-4 h-4 mr-2 fill-current" />
                  <span className="font-medium">End</span>
                </Button>
              )}
              
              <Button 
                onClick={resetCall}
                variant="outline"
                disabled={callState.isInProgress}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                <span>Reset</span>
              </Button>
              
              <Button 
                onClick={handleLogResults}
                variant="outline"
                className="border-primary-500 text-primary-600 hover:bg-primary-50 dark:border-primary-400 dark:text-primary-400"
              >
                <ClipboardList className="w-4 h-4 mr-2" />
                <span>Log</span>
              </Button>
            </div>
          </div>
        </Card>
        
        {/* Call Timer */}
        <Card className={isCallActive ? "border-primary-500 shadow-lg" : ""}>
          <TimerErrorBoundary>
            <CallTimer 
              persona={prospect.persona}
              onTimeUpdate={() => {}}
              onCallEnd={handleEndCall}
              isCallActive={isCallActive}
            />
          </TimerErrorBoundary>
        </Card>
        
        {/* Call Notes */}
        <CollapsibleSection 
          title="Call Notes" 
          subtitle="Capture important details during the call"
          defaultExpanded={true}
          badge={callState.notes ? `${callState.notes.length} chars • ${saveStatus === 'saving' ? 'Saving...' : 'Saved'}` : saveStatus === 'saved' ? 'Ready' : undefined}
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  const textarea = document.getElementById('call-notes-textarea') as HTMLTextAreaElement;
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const text = callState.notes;
                  const newText = text.substring(0, start) + '**' + text.substring(start, end) + '**' + text.substring(end);
                  updateCallNotes(newText);
                }}
                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 disabled:opacity-50"
                title="Bold"
              >
                <strong>B</strong>
              </button>
              <button
                onClick={() => {
                  const newText = callState.notes + '\n• ';
                  updateCallNotes(newText);
                  setTimeout(() => {
                    const textarea = document.getElementById('call-notes-textarea') as HTMLTextAreaElement;
                    textarea.focus();
                    textarea.setSelectionRange(newText.length, newText.length);
                  }, 0);
                }}
                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 disabled:opacity-50"
                title="Bullet Point"
              >
                •
              </button>
              <button
                onClick={() => {
                  const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                  const newText = callState.notes + '\n[' + timestamp + '] ';
                  updateCallNotes(newText);
                  setTimeout(() => {
                    const textarea = document.getElementById('call-notes-textarea') as HTMLTextAreaElement;
                    textarea.focus();
                    textarea.setSelectionRange(newText.length, newText.length);
                  }, 0);
                }}
                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 disabled:opacity-50"
                title="Add Timestamp"
              >
                <Clock className="w-4 h-4" />
              </button>
              <div className="flex-1" />
              <div className="relative" data-export-menu>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowExportMenu(!showExportMenu);
                  }}
                  disabled={!callState.notes}
                  className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50 text-sm flex items-center gap-1"
                  title="Export Notes"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
                {showExportMenu && callState.notes && (
                  <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => handleExportNotes('txt')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Export as Text (.txt)
                    </button>
                    <button
                      onClick={() => handleExportNotes('pdf')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Export as PDF
                    </button>
                    <button
                      onClick={() => handleExportNotes('docx')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Export as Word (.docx)
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={() => updateCallNotes('')}
                disabled={!isCallActive || !callState.notes}
                className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 text-sm"
                title="Clear Notes"
              >
                Clear
              </button>
            </div>
            <textarea
              id="call-notes-textarea"
              value={callState.notes}
              onChange={(e) => updateCallNotes(e.target.value)}
              placeholder="Type your notes here... (auto-saved)

Tips:
• Use bullet points for key information
• Add timestamps for important moments
• Note objections and responses
• Capture next steps and commitments"
              className="w-full h-40 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                         placeholder-gray-500 dark:placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                         resize-vertical font-mono text-sm"
            />
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Notes are auto-saved and will be included in call log</span>
              </div>
              {callState.notes && (
                <span className="text-xs">
                  {callState.notes.split(' ').length} words • {callState.notes.split('\n').length} lines
                </span>
              )}
            </div>
          </div>
        </CollapsibleSection>
        
        {/* Call Objectives */}
        <Card title="Call Objectives" subtitle="Primary goals for this conversation">
          <div className="space-y-3">
            {callObjectives.slice(0, 3).map((objective, index) => (
              <div 
                key={objective.id}
                className={`p-3 rounded-lg border ${
                  index === 0 ? 'border-green-300 bg-green-50' :
                  index === 1 ? 'border-blue-300 bg-blue-50' :
                  'border-gray-300 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{objective.icon}</span>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${
                      index === 0 ? 'text-green-900' :
                      index === 1 ? 'text-blue-900' :
                      'text-gray-900'
                    }`}>
                      {objective.title}
                    </h4>
                    <p className="text-sm text-gray-700">{objective.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    index === 0 ? 'bg-green-200 text-green-800' :
                    index === 1 ? 'bg-blue-200 text-blue-800' :
                    'bg-gray-200 text-gray-800'
                  }`}>
                    {objective.priority.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        {/* Quick Actions */}
        <Card title="Quick Actions" subtitle="Common call outcomes and next steps">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => modalDispatch({ type: 'SHOW_MODAL', modalType: 'calendar' })}
                className="bg-green-600 hover:bg-green-700"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book Meeting
              </Button>
              <Button 
                onClick={() => modalDispatch({ type: 'SHOW_MODAL', modalType: 'followUp' })}
                variant="secondary"
              >
                <Clock className="w-4 h-4 mr-2" />
                Schedule Follow-up
              </Button>
              <Button 
                onClick={() => modalDispatch({ type: 'SHOW_MODAL', modalType: 'resources' })}
                variant="secondary"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Resources
              </Button>
              <Button 
                onClick={() => modalDispatch({ type: 'SHOW_MODAL', modalType: 'crm' })}
                variant="secondary"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add to CRM
              </Button>
            </div>
            
            {/* Success Button */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-3 text-center">
                Achieved a win? Log your success!
              </div>
              <SuccessButton 
                onSuccess={handleCallSuccess}
                className="w-full"
              />
              {userPoints > 0 && (
                <div className="mt-3 text-center">
                  <span className="text-sm font-medium text-primary-600">
                    Total Points: {userPoints}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card>
        
        {/* Battle Card Quick Reference */}
        {selectedContent.length > 0 && (
          <CollapsibleSection 
            title="Call Card Content" 
            subtitle="Your selected talking points and strategies"
            defaultExpanded={false}
            badge={`${selectedContent.length} items`}
          >
            <div className="space-y-3">
              {selectedContent.map((item) => (
                <div key={item.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      item.type === 'opener' ? 'bg-blue-100 text-blue-800' :
                      item.type === 'objection-handler' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.type.replace('-', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{item.content}</p>
                  {item.context && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">{item.context}</p>
                  )}
                </div>
              ))}
            </div>
          </CollapsibleSection>
        )}
      </div>
      
      {/* Right Column - Call Flow Checklist */}
      <div className="space-y-6">
        {/* Access Library Button */}
        {selectedContent.length > 0 && (
          <Card title="Script Library" subtitle="Access your scripts and talking points">
            <Button
              onClick={() => modalDispatch({ type: 'SHOW_MODAL', modalType: 'library' })}
              variant="outline"
              className="w-full"
            >
              <Search className="w-4 h-4 mr-2" />
              Access Library (Search Scripts)
            </Button>
          </Card>
        )}
        
        {/* Progress Overview */}
        <Card title="Call Flow Progress" subtitle={`${completedSteps} of ${callFlowSteps.length} steps completed`}>
          <div className="space-y-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <motion.div 
                className="bg-primary-600 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="text-center text-sm text-gray-600 dark:text-gray-300">
              {progressPercentage.toFixed(0)}% Complete
            </div>
          </div>
        </Card>
        
        {/* Call Flow Steps */}
        <Card title="Call Flow Checklist" subtitle="Follow this proven framework">
          <div className="space-y-3">
            {callFlowSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  step.completed 
                    ? 'border-green-300 bg-green-50 dark:bg-green-900/20' 
                    : index === callState.currentStep && isCallActive
                      ? 'border-primary-300 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleStepComplete(index)}
                    disabled={step.completed}
                    className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
                      step.completed
                        ? 'border-green-500 bg-green-500'
                        : index === callState.currentStep && isCallActive
                          ? 'border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-green-400'
                          : 'border-gray-300 dark:border-gray-600 hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                    }`}
                    title={step.completed ? 'Completed' : 'Click to mark as completed'}
                  >
                    {step.completed && <CheckCircle className="w-4 h-4 text-white" />}
                    {!step.completed && index === callState.currentStep && isCallActive && (
                      <ArrowRight className="w-3 h-3 text-primary-600" />
                    )}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-medium ${
                        step.completed ? 'text-green-900 dark:text-green-100' :
                        index === callState.currentStep && isCallActive ? 'text-primary-900 dark:text-primary-100' :
                        'text-gray-900 dark:text-gray-100'
                      }`}>
                        {step.title}
                      </h4>
                      {step.optional && (
                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">
                          Optional
                        </span>
                      )}
                      {step.selectedContent && step.selectedContent.length > 0 && (
                        <button
                          onClick={() => toggleStepExpansion(step.id)}
                          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          {expandedSteps.has(step.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{step.description}</p>
                    
                    {/* Show selected content when expanded */}
                    {step.selectedContent && step.selectedContent.length > 0 && expandedSteps.has(step.id) && (
                      <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded">
                        <div className="flex items-start gap-2 mb-2">
                          <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                          <div className="text-xs font-medium text-blue-800 dark:text-blue-200">Your Selected Scripts:</div>
                        </div>
                        <div className="space-y-2">
                          {step.selectedContent.map((content, contentIndex) => (
                            <div key={content.id} className="text-xs text-blue-700 dark:text-blue-300">
                              <div className="font-medium mb-1">{content.type.replace('-', ' ').toUpperCase()} #{contentIndex + 1}</div>
                              <div className="pl-2 border-l-2 border-blue-300 dark:border-blue-600">
                                {/* Extract and show keywords in large text */}
                                {(() => {
                                  const keywords = content.content.match(/[A-Z][A-Z]+(?:\s+[A-Z]+)*|"[^"]+"|'[^']+'/g) || [];
                                  return keywords.length > 0 ? (
                                    <>
                                      <div className="mb-2">
                                        {keywords.map((keyword, idx) => (
                                          <span key={idx} className="inline-block text-base font-bold text-blue-800 dark:text-blue-200 mr-2 mb-1">
                                            {keyword.replace(/["']/g, '')}
                                          </span>
                                        ))}
                                      </div>
                                      <p className="italic text-xs">{content.content}</p>
                                    </>
                                  ) : (
                                    <p className="italic">{content.content}</p>
                                  );
                                })()}
                                {content.context && (
                                  <p className="text-blue-600 dark:text-blue-400 mt-1">Context: {content.context}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {step.tips && index === callState.currentStep && isCallActive && (
                      <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-xs font-medium text-yellow-800 dark:text-yellow-200 mb-1">Tips:</div>
                            <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
                              {step.tips.map((tip, tipIndex) => (
                                <li key={tipIndex} className="flex items-start gap-1">
                                  <span className="text-yellow-500 dark:text-yellow-400 mt-0.5">•</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Call Flow Tips */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Pro Tips</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Click each step as you complete it to track progress</li>
                  <li>• Focus on listening more than talking in discovery phase</li>
                  <li>• Always confirm next steps before ending the call</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Modals - Using extracted components */}
      {modalState.calendar && (
        <CalendarModal onClose={() => modalDispatch({ type: 'HIDE_MODAL', modalType: 'calendar' })} />
      )}
      
      {modalState.followUp && (
        <FollowUpModal onClose={() => modalDispatch({ type: 'HIDE_MODAL', modalType: 'followUp' })} />
      )}
      
      {modalState.resources && (
        <ResourcesModal onClose={() => modalDispatch({ type: 'HIDE_MODAL', modalType: 'resources' })} />
      )}
      
      {modalState.crm && (
        <CRMModal 
          callNotes={callState.notes}
          onClose={() => modalDispatch({ type: 'HIDE_MODAL', modalType: 'crm' })} 
        />
      )}
      
      {modalState.outcome && (
        <OutcomeModal 
          prospect={prospect}
          callStartTime={callState.startTime}
          onSuccess={() => {
            modalDispatch({ type: 'HIDE_MODAL', modalType: 'outcome' });
            modalDispatch({ type: 'SHOW_MODAL', modalType: 'success' });
          }}
          onNoGo={() => {
            modalDispatch({ type: 'HIDE_MODAL', modalType: 'outcome' });
            modalDispatch({ type: 'SHOW_MODAL', modalType: 'noGo' });
          }}
          onClose={() => modalDispatch({ type: 'HIDE_MODAL', modalType: 'outcome' })}
        />
      )}
      
      {modalState.success && (
        <SuccessModal 
          onSuccess={(type, points) => {
            handleCallSuccess(type, points);
            modalDispatch({ type: 'HIDE_MODAL', modalType: 'success' });
            resetCall();
          }}
          onClose={() => modalDispatch({ type: 'HIDE_MODAL', modalType: 'success' })}
        />
      )}
      
      {modalState.noGo && (
        <NoGoModal 
          prospect={prospect}
          callStartTime={callState.startTime}
          callNotes={callState.notes}
          onSubmit={(noGoReason, additionalContext) => {
            // Handle no-go submission
            if (prospect && callState.startTime) {
              const endTime = new Date();
              const duration = Math.floor((endTime.getTime() - callState.startTime.getTime()) / 1000);
              
              const callLog = {
                id: `call-${Date.now()}`,
                leadId: `${prospect.companyName}-${prospect.contactName}`,
                outcome: 'disqualified' as const,
                intel: callState.notes || 'No answer - unable to connect',
                bestTalkingPoint: 'N/A',
                keyTakeaway: `No Go: ${noGoReason}`,
                createdAt: new Date(),
                callDuration: duration,
                additionalInfo: {
                  companyInsights: callState.notes,
                  nextSteps: 'No follow-up required',
                  outcome: 'no-go',
                  noGoReason: noGoReason,
                  additionalContext: additionalContext || undefined
                }
              };
              
              addCallLog(callLog);
              
              // Clear saved notes
              const storageKey = `wolf-den-call-notes-${prospect.companyName}-${prospect.contactName}`;
              localStorage.removeItem(storageKey);
            }
            
            modalDispatch({ type: 'HIDE_MODAL', modalType: 'noGo' });
            resetCall();
          }}
          onClose={() => modalDispatch({ type: 'HIDE_MODAL', modalType: 'noGo' })}
        />
      )}
      
      {modalState.library && (
        <LibraryModal 
          selectedContent={filteredLibraryContent}
          searchTerm={librarySearchTerm}
          onSearchChange={setLibrarySearchTerm}
          onClose={() => modalDispatch({ type: 'HIDE_MODAL', modalType: 'library' })}
        />
      )}
    </div>
  );
};

export default LiveCallAssistance;