import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Square, 
  CheckCircle, 
  Calendar,
  Phone,
  MessageSquare,
  Lightbulb,
  ArrowRight,
  ExternalLink,
  FileText,
  Send,
  UserPlus,
  Clock,
  X,
  BookOpen,
  Search,
  ChevronDown,
  ChevronUp,
  Trophy
} from 'lucide-react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import CallTimer from '@/components/gamification/CallTimer';
import SuccessButton from '@/components/gamification/SuccessButton';
import CollapsibleSection from '@/components/common/CollapsibleSection';
import ReadyToCallIndicator from '@/components/callflow/ReadyToCallIndicator';
import { useAppStore } from '@/store';
import { callObjectives } from '@/data/content';
import { zoomPhoneService } from '@/services/zoomPhone';


const NO_GO_REASONS = [
  'Already have coverage',
  'Budget constraints',
  'Not decision maker',
  'Wrong timing',
  'Competitor locked in',
  'Not interested in benefits',
  'Company too small/large',
  'Geographic restrictions',
  'Other priorities',
  'Hung up/Rude'
];

interface CallFlowStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  optional?: boolean;
  tips?: string[];
  selectedContent?: ContentItem[];
}

interface ContentItem {
  id: string;
  type: 'opener' | 'thought-leadership' | 'objection-handler';
  persona: string;
  content: string;
  context?: string;
}

const LiveCallAssistance: React.FC = () => {
  const { prospect, addCallLog, selectedContent } = useAppStore();
  
  // Call states - more granular control
  const [callPrepared, setCallPrepared] = useState(false); // Timer started, ready to call
  const [callInProgress, setCallInProgress] = useState(false); // Zoom call initiated
  const [currentStep, setCurrentStep] = useState(0);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [showResourcesModal, setShowResourcesModal] = useState(false);
  const [showCRMModal, setShowCRMModal] = useState(false);
  const [callNotes, setCallNotes] = useState('');
  const [callStartTime, setCallStartTime] = useState<Date | null>(null);
  const [userPoints, setUserPoints] = useState(0);
  const [showOutcomeModal, setShowOutcomeModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showNoGoModal, setShowNoGoModal] = useState(false);
  const [noGoReason, setNoGoReason] = useState<string>('');
  const [additionalContext, setAdditionalContext] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [librarySearchTerm, setLibrarySearchTerm] = useState('');
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  
  // Computed call states for easier logic
  const isCallActive = callPrepared || callInProgress;
  
  // Auto-save notes to localStorage with debouncing
  useEffect(() => {
    if (prospect) {
      setSaveStatus('saving');
      const timeoutId = setTimeout(() => {
        const storageKey = `wolf-den-call-notes-${prospect.companyName}-${prospect.contactName}`;
        localStorage.setItem(storageKey, callNotes);
        setSaveStatus('saved');
      }, 1000); // Save after 1 second of inactivity
      
      return () => clearTimeout(timeoutId);
    }
  }, [callNotes, prospect]);
  
  // Load saved notes when prospect changes
  useEffect(() => {
    if (prospect) {
      const storageKey = `wolf-den-call-notes-${prospect.companyName}-${prospect.contactName}`;
      const savedNotes = localStorage.getItem(storageKey);
      if (savedNotes) {
        setCallNotes(savedNotes);
      } else {
        setCallNotes('');
      }
    }
  }, [prospect]);
  
  // Initialize call flow steps with selected content integration
  const initializeCallFlowSteps = (): CallFlowStep[] => {
    const baseSteps = [
      {
        id: 'opening',
        title: 'Opening & Rapport',
        description: 'Establish connection and set the tone',
        completed: false,
        tips: ['Use their name', 'Reference something personal', 'Be enthusiastic but professional']
      },
      {
        id: 'permission',
        title: 'Permission to Proceed',
        description: 'Confirm they have time and interest',
        completed: false,
        tips: ['Ask for specific time commitment', 'Confirm decision-making authority']
      },
      {
        id: 'discovery',
        title: 'Discovery Questions',
        description: 'Understand their current situation and needs',
        completed: false,
        tips: ['Ask open-ended questions', 'Listen for pain points', 'Take notes on key details']
      },
      {
        id: 'presentation',
        title: 'Value Presentation',
        description: 'Present solutions tailored to their needs',
        completed: false,
        tips: ['Connect to discovered needs', 'Use specific examples', 'Focus on outcomes']
      },
      {
        id: 'objections',
        title: 'Handle Objections',
        description: 'Address concerns and build confidence',
        completed: false,
        optional: true,
        tips: ['Acknowledge their concern', 'Ask clarifying questions', 'Provide relevant examples']
      },
      {
        id: 'close',
        title: 'Close for Next Step',
        description: 'Secure commitment for follow-up action',
        completed: false,
        tips: ['Be specific about next steps', 'Confirm their commitment', 'Set clear expectations']
      }
    ];

    // Integrate selected content into appropriate steps
    return baseSteps.map(step => {
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
  };

  const [callFlowSteps, setCallFlowSteps] = useState<CallFlowStep[]>(initializeCallFlowSteps());

  // Update call flow steps when selected content changes
  useEffect(() => {
    setCallFlowSteps(initializeCallFlowSteps());
  }, [selectedContent]); // initializeCallFlowSteps is stable as it only depends on selectedContent

  // Start the call session (timer) without Zoom
  const handleStartSession = () => {
    if (!prospect) {
      alert('No prospect selected. Please go to Planner first to select a prospect.');
      return;
    }

    setCallPrepared(true);
    setCallStartTime(new Date());
    console.log('Call session started for:', prospect.contactName);
  };

  // Initiate the actual Zoom Phone call
  const handleInitiateCall = () => {
    if (!prospect) {
      alert('No prospect selected. Please go to Planner first to select a prospect.');
      return;
    }

    if (!prospect.contactPhone) {
      alert('No phone number available for this prospect. Please add a phone number in the Planner.');
      return;
    }

    try {
      // Start timer if not already started
      if (!callPrepared) {
        setCallPrepared(true);
        setCallStartTime(new Date());
      }

      // Initiate the phone call through Zoom Phone
      const callInitiated = zoomPhoneService.initiateCall({
        phoneNumber: prospect.contactPhone,
        contactName: prospect.contactName,
        companyName: prospect.companyName,
        leadId: prospect.companyName + prospect.contactName // Simple ID generation
      });

      if (callInitiated) {
        setCallInProgress(true);
        console.log('Zoom call initiated successfully for:', prospect.contactName, prospect.contactPhone);
      } else {
        alert('Failed to initiate call. Please check if Zoom Phone is installed and configured.');
      }
    } catch (error) {
      console.error('Error initiating call:', error);
      alert('Error starting call. Please try again or check your phone system configuration.');
    }
  };

  // End the call and show outcome options
  const handleEndCall = () => {
    setCallPrepared(false);
    setCallInProgress(false);
    // Show contextual outcome options instead of generic modal
    setShowOutcomeModal(true);
  };


  const handleStepComplete = (stepIndex: number) => {
    const newSteps = [...callFlowSteps];
    newSteps[stepIndex].completed = true;
    setCallFlowSteps(newSteps);
    
    // Auto-advance to next step
    if (stepIndex === currentStep && stepIndex < callFlowSteps.length - 1) {
      setCurrentStep(stepIndex + 1);
    }
  };

  const handleReset = () => {
    setCallPrepared(false);
    setCallInProgress(false);
    setCurrentStep(0);
    setCallFlowSteps(callFlowSteps.map(step => ({ ...step, completed: false })));
    setCallNotes('');
    setCallStartTime(null);
    
    // Clear the saved notes from localStorage
    if (prospect) {
      const storageKey = `wolf-den-call-notes-${prospect.companyName}-${prospect.contactName}`;
      localStorage.removeItem(storageKey);
    }
  };

  // Handle call success outcome
  const handleCallSuccessAction = () => {
    setShowOutcomeModal(false);
    setShowSuccessModal(true);
  };

  // Handle no-go outcome
  const handleNoGoAction = () => {
    setShowOutcomeModal(false);
    setShowNoGoModal(true);
  };

  // Handle no-go submission
  const handleNoGoSubmit = () => {
    if (!noGoReason) {
      alert('Please select a reason for No Go');
      return;
    }
    
    // Clear the saved notes from localStorage
    if (prospect) {
      const storageKey = `wolf-den-call-notes-${prospect.companyName}-${prospect.contactName}`;
      localStorage.removeItem(storageKey);
    }
    
    // Create call log with no-go outcome
    if (prospect && callStartTime) {
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - callStartTime.getTime()) / 1000);
      
      const callLog = {
        id: `call-${Date.now()}`,
        leadId: `${prospect.companyName}-${prospect.contactName}`,
        outcome: 'disqualified' as 'meeting-booked' | 'nurture' | 'disqualified' | 'follow-up',
        intel: callNotes || 'No answer - unable to connect',
        bestTalkingPoint: 'N/A',
        keyTakeaway: `No Go: ${noGoReason}`,
        createdAt: new Date(),
        callDuration: duration,
        additionalInfo: {
          companyInsights: callNotes,
          nextSteps: 'No follow-up required',
          outcome: 'no-go',
          noGoReason: noGoReason,
          additionalContext: additionalContext || undefined
        }
      };
      
      addCallLog(callLog);
    }
    
    // Reset state
    setCallStartTime(null);
    setShowNoGoModal(false);
    setNoGoReason('');
    setAdditionalContext('');
    handleReset(); // Use the existing reset function
  };

  const handleBookMeeting = () => {
    setShowCalendarModal(true);
  };

  const handleScheduleFollowUp = () => {
    setShowFollowUpModal(true);
  };

  const handleSendResources = () => {
    setShowResourcesModal(true);
  };

  const handleAddToCRM = () => {
    setShowCRMModal(true);
  };

  const handleCallSuccess = (type: 'meeting-booked' | 'follow-up' | 'intelligence' | 'referral', points: number) => {
    setUserPoints(prev => prev + points);
    
    // Add success to call notes
    const successNote = `\n\n🎯 Success: ${type.replace('-', ' ').toUpperCase()} (+${points} points)`;
    setCallNotes(prev => prev + successNote);
    
    // Log analytics
    console.log(`Call success: ${type}, Points: ${points}`);
  };

  const toggleStepExpansion = (stepId: string) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  const handleAccessLibrary = () => {
    setShowLibraryModal(true);
  };

  const getFilteredLibraryContent = () => {
    if (!librarySearchTerm) return selectedContent;
    
    return selectedContent.filter(content => 
      content.content.toLowerCase().includes(librarySearchTerm.toLowerCase()) ||
      (content.context && content.context.toLowerCase().includes(librarySearchTerm.toLowerCase()))
    );
  };

  const topObjectives = callObjectives.slice(0, 3);
  const completedSteps = callFlowSteps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / callFlowSteps.length) * 100;

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
        {/* Ready to Call Indicator - Prominent at top */}
        <ReadyToCallIndicator 
          prospect={prospect} 
          className=""
        />

        {/* Call Status Card */}
        <Card className={`${
          callInProgress ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
          callPrepared ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' :
          'border-gray-200 dark:border-gray-700'
        }`}>
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className={`w-4 h-4 rounded-full ${
                callInProgress ? 'bg-green-500 animate-pulse' :
                callPrepared ? 'bg-blue-500 animate-pulse' :
                'bg-gray-300 dark:bg-gray-600'
              }`} />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {callInProgress ? 'Call in Progress' :
                 callPrepared ? 'Session Active' :
                 'Call Assistant'}
              </h2>
            </div>
            
            <div className="text-gray-600 dark:text-gray-300">
              <div className="font-medium">{prospect.companyName}</div>
              <div className="text-sm">{prospect.contactName}</div>
            </div>

            {/* Call Controls */}
            <div className="flex justify-center gap-3">
              {!callPrepared && !callInProgress ? (
                <>
                  {/* Initial state - show Start button */}
                  <Button 
                    onClick={handleStartSession}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start
                  </Button>
                  {(callNotes || callFlowSteps.some(step => step.completed)) && (
                    <Button 
                      onClick={handleReset}
                      variant="outline"
                      size="lg"
                    >
                      Reset
                    </Button>
                  )}
                </>
              ) : callPrepared && !callInProgress ? (
                <>
                  {/* Session started - show Call and End buttons */}
                  <Button 
                    onClick={handleInitiateCall}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Call
                  </Button>
                  <Button 
                    onClick={handleEndCall}
                    variant="secondary"
                    size="lg"
                  >
                    <Square className="w-5 h-5 mr-2" />
                    End
                  </Button>
                </>
              ) : (
                <>
                  {/* Call in progress - show End button only */}
                  <Button 
                    onClick={handleEndCall}
                    variant="secondary"
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Square className="w-5 h-5 mr-2" />
                    End Call
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Call Timer */}
        <Card className={isCallActive ? "border-primary-500 shadow-lg" : ""}>
          <CallTimer 
            persona={prospect.persona}
            onTimeUpdate={() => {}}
            onCallEnd={handleEndCall}
            isCallActive={isCallActive}
          />
        </Card>

        {/* Call Notes */}
        <CollapsibleSection 
          title="Call Notes" 
          subtitle="Capture important details during the call"
          defaultExpanded={true}
          badge={callNotes ? `${callNotes.length} chars • ${saveStatus === 'saving' ? 'Saving...' : 'Saved'}` : saveStatus === 'saved' ? 'Ready' : undefined}
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  const textarea = document.getElementById('call-notes-textarea') as HTMLTextAreaElement;
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const text = callNotes;
                  const newText = text.substring(0, start) + '**' + text.substring(start, end) + '**' + text.substring(end);
                  setCallNotes(newText);
                }}
                className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 disabled:opacity-50"
                title="Bold"
              >
                <strong>B</strong>
              </button>
              <button
                onClick={() => {
                  const newText = callNotes + '\n• ';
                  setCallNotes(newText);
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
                  const newText = callNotes + '\n[' + timestamp + '] ';
                  setCallNotes(newText);
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
              <button
                onClick={() => setCallNotes('')}
                disabled={!isCallActive || !callNotes}
                className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 text-sm"
                title="Clear Notes"
              >
                Clear
              </button>
            </div>
            <textarea
              id="call-notes-textarea"
              value={callNotes}
              onChange={(e) => setCallNotes(e.target.value)}
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
              {callNotes && (
                <span className="text-xs">{callNotes.split(' ').length} words • {callNotes.split('\n').length} lines</span>
              )}
            </div>
          </div>
        </CollapsibleSection>

        {/* Call Objectives */}
        <Card title="Call Objectives" subtitle="Primary goals for this conversation">
          <div className="space-y-3">
            {topObjectives.map((objective, index) => (
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
                onClick={handleBookMeeting}
                className="bg-green-600 hover:bg-green-700"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book Meeting
              </Button>
              <Button 
                onClick={handleScheduleFollowUp}
                variant="secondary"
              >
                <Clock className="w-4 h-4 mr-2" />
                Schedule Follow-up
              </Button>
              <Button 
                onClick={handleSendResources}
                variant="secondary"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Resources
              </Button>
              <Button 
                onClick={handleAddToCRM}
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
            title="Battle Card Content" 
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
        {/* Progress Overview */}
        <Card title="Call Flow Progress" subtitle={`${completedSteps} of ${callFlowSteps.length} steps completed`}>
          <div className="space-y-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
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
                    : index === currentStep && isCallActive
                      ? 'border-primary-300 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleStepComplete(index)}
                    disabled={step.completed || !isCallActive}
                    className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      step.completed
                        ? 'border-green-500 bg-green-500'
                        : index === currentStep && isCallActive
                          ? 'border-primary-500 hover:bg-primary-50'
                          : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {step.completed && <CheckCircle className="w-4 h-4 text-white" />}
                    {!step.completed && index === currentStep && isCallActive && (
                      <ArrowRight className="w-3 h-3 text-primary-600" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-medium ${
                        step.completed ? 'text-green-900 dark:text-green-100' :
                        index === currentStep && isCallActive ? 'text-primary-900 dark:text-primary-100' :
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
                                <p className="italic">{content.content}</p>
                                {content.context && (
                                  <p className="text-blue-600 dark:text-blue-400 mt-1">Context: {content.context}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {step.tips && index === currentStep && isCallActive && (
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

          {/* Access Library Button */}
          {selectedContent.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={handleAccessLibrary}
                variant="outline"
                className="w-full"
              >
                <Search className="w-4 h-4 mr-2" />
                Access Library (Search Scripts)
              </Button>
            </div>
          )}

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

      {/* Calendar Integration Modal */}
      {showCalendarModal && (
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
                    onClick={() => setShowCalendarModal(false)}
                    variant="secondary"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => {
                      setShowCalendarModal(false);
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
      )}

      {/* Follow-up Modal */}
      {showFollowUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Schedule Follow-up</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Follow-up Type
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                    <option>Phone Call</option>
                    <option>Email Check-in</option>
                    <option>Send Proposal</option>
                    <option>Decision Follow-up</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    When
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                    <option>Tomorrow</option>
                    <option>In 2 days</option>
                    <option>Next week</option>
                    <option>In 2 weeks</option>
                  </select>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={() => setShowFollowUpModal(false)}
                    variant="secondary"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => {
                      setShowFollowUpModal(false);
                      alert('Follow-up scheduled in CRM');
                    }}
                    className="flex-1"
                  >
                    Schedule
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Resources Modal */}
      {showResourcesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Send className="w-6 h-6 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Send Resources</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Resources
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded text-primary-600" defaultChecked />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Benefits Overview Deck</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded text-primary-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">ROI Calculator</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded text-primary-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Case Studies</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded text-primary-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Industry Report</span>
                    </label>
                  </div>
                  
                  <div className="text-center mt-3">
                    <button
                      onClick={() => {
                        setShowResourcesModal(false);
                        useAppStore.getState().setCurrentModule('resources');
                      }}
                      className="text-sm text-primary-600 hover:text-primary-700 underline"
                    >
                      View all marketing materials →
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Personal Message
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    rows={3}
                    placeholder="Thanks for your time today..."
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={() => setShowResourcesModal(false)}
                    variant="secondary"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => {
                      setShowResourcesModal(false);
                      alert('Resources sent via email');
                    }}
                    className="flex-1"
                  >
                    Send Email
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* CRM Integration Modal */}
      {showCRMModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <UserPlus className="w-6 h-6 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add to CRM</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Lead Status
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                    <option>New Lead</option>
                    <option>Qualified</option>
                    <option>Meeting Scheduled</option>
                    <option>Proposal Sent</option>
                    <option>Follow-up Required</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Lead Source
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                    <option>Cold Call</option>
                    <option>Referral</option>
                    <option>Website</option>
                    <option>Event</option>
                    <option>Social Media</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priority Level
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    rows={3}
                    placeholder="Additional notes for CRM record..."
                    defaultValue={callNotes}
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={() => setShowCRMModal(false)}
                    variant="secondary"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => {
                      setShowCRMModal(false);
                      alert('Contact added to CRM successfully');
                    }}
                    className="flex-1"
                  >
                    Add to CRM
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Call Outcome Modal - Contextual Options */}
      {showOutcomeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">How did the call go?</h3>
                <button
                  onClick={() => setShowOutcomeModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Call Summary */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <div className="font-medium text-gray-900 dark:text-white">{prospect?.contactName}</div>
                    <div className="text-sm">{prospect?.companyName}</div>
                    <div className="text-xs mt-2">
                      Duration: {callStartTime ? Math.floor((Date.now() - callStartTime.getTime()) / 1000 / 60) : 0} minutes
                    </div>
                  </div>
                </div>

                {/* Contextual Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    onClick={handleCallSuccessAction}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                  >
                    <Trophy className="w-5 h-5 mr-2" />
                    Call Success
                  </Button>
                  
                  <Button 
                    onClick={handleNoGoAction}
                    variant="secondary"
                    className="w-full border-red-300 text-red-700 hover:bg-red-50 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20"
                    size="lg"
                  >
                    <X className="w-5 h-5 mr-2" />
                    No Go
                  </Button>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400 text-center pt-2">
                  Select the outcome to log your call details
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Success Modal - Uses existing SuccessButton component */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">🎉 Log Your Success!</h3>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <SuccessButton 
                onSuccess={(type, points) => {
                  handleCallSuccess(type, points);
                  setShowSuccessModal(false);
                  handleReset(); // Reset the call state after logging success
                }}
                className="w-full"
              />
            </div>
          </motion.div>
        </div>
      )}

      {/* No Go Modal */}
      {showNoGoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">No Go - Quick Note</h3>
                <button
                  onClick={() => setShowNoGoModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    What happened? <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {NO_GO_REASONS.map((reason) => (
                      <button
                        key={reason}
                        onClick={() => setNoGoReason(reason)}
                        className={`p-3 text-left border rounded-lg transition-colors ${
                          noGoReason === reason
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <div className="text-sm font-medium">{reason}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={additionalContext}
                    onChange={(e) => setAdditionalContext(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    rows={3}
                    placeholder="Any other details..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={() => setShowNoGoModal(false)}
                    variant="secondary"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleNoGoSubmit}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    Log No Go
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Library Search Modal */}
      {showLibraryModal && (
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
                  onClick={() => setShowLibraryModal(false)}
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
                    value={librarySearchTerm}
                    onChange={(e) => setLibrarySearchTerm(e.target.value)}
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
                {getFilteredLibraryContent().length > 0 ? (
                  getFilteredLibraryContent().map((content, index) => (
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
                      {librarySearchTerm ? 'No scripts match your search.' : 'No scripts selected. Visit the Guide to select content.'}
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
                    onClick={() => setShowLibraryModal(false)}
                    variant="secondary"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default LiveCallAssistance;