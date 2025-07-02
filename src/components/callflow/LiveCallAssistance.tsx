import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Square, 
  CheckCircle, 
  XCircle, 
  Calendar,
  Phone,
  MessageSquare,
  Lightbulb,
  AlertTriangle,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import CallTimer from '@/components/gamification/CallTimer';
import SuccessButton from '@/components/gamification/SuccessButton';
import { useAppStore } from '@/store';
import { callObjectives } from '@/data/content';

interface CallFlowStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  optional?: boolean;
  tips?: string[];
}

const LiveCallAssistance: React.FC = () => {
  const { prospect } = useAppStore();
  const [isCallActive, setIsCallActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showNoGoConfirm, setShowNoGoConfirm] = useState(false);
  const [callFlowSteps, setCallFlowSteps] = useState<CallFlowStep[]>([
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
  ]);

  const handleStartCall = () => {
    setIsCallActive(true);
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    // You could trigger post-game analysis here
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

  const handleNoGo = () => {
    setShowNoGoConfirm(true);
  };

  const confirmNoGo = () => {
    setIsCallActive(false);
    setShowNoGoConfirm(false);
    // Log as failed call
    console.log('Call marked as no-go');
  };

  const handleBookMeeting = () => {
    setShowCalendarModal(true);
  };

  const topObjectives = callObjectives.slice(0, 3);
  const completedSteps = callFlowSteps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / callFlowSteps.length) * 100;

  if (!prospect) {
    return (
      <Card title="Live Call Assistance">
        <div className="text-center py-12">
          <Phone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Prospect First</h3>
          <p className="text-gray-500">
            Choose a prospect from Hunt Planner to access live call assistance
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column - Call Controls & Status */}
      <div className="space-y-6">
        {/* Call Status Card */}
        <Card className={`${isCallActive ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className={`w-4 h-4 rounded-full ${isCallActive ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
              <h2 className="text-xl font-bold text-gray-900">
                {isCallActive ? 'Call in Progress' : 'Ready to Call'}
              </h2>
            </div>
            
            <div className="text-gray-600">
              <div className="font-medium">{prospect.companyName}</div>
              <div className="text-sm">{prospect.contactName}</div>
            </div>

            {/* Call Controls */}
            <div className="flex justify-center gap-3">
              {!isCallActive ? (
                <Button 
                  onClick={handleStartCall}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Call
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={handleEndCall}
                    variant="secondary"
                    size="lg"
                  >
                    <Square className="w-5 h-5 mr-2" />
                    End Call
                  </Button>
                  <Button 
                    onClick={handleNoGo}
                    variant="outline"
                    size="lg"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    No Go
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Call Timer */}
        <Card title="Call Timer" subtitle="Track optimal call duration">
          <CallTimer 
            persona={prospect.persona}
            onTimeUpdate={() => {}}
            onCallEnd={() => {}}
          />
        </Card>

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
        <Card title="Quick Actions" subtitle="Common call outcomes">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={handleBookMeeting}
              className="h-16 flex-col bg-green-600 hover:bg-green-700"
              disabled={!isCallActive}
            >
              <Calendar className="w-6 h-6 mb-1" />
              Book Meeting
            </Button>
            
            <div className="h-16">
              <SuccessButton 
                onSuccess={(type, points) => {
                  console.log(`Success: ${type}, Points: ${points}`);
                }}
                className="w-full h-full"
                disabled={!isCallActive}
              />
            </div>
          </div>
        </Card>
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
            <div className="text-center text-sm text-gray-600">
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
                    ? 'border-green-300 bg-green-50' 
                    : index === currentStep && isCallActive
                      ? 'border-primary-300 bg-primary-50'
                      : 'border-gray-200 bg-white'
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
                          : 'border-gray-300'
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
                        step.completed ? 'text-green-900' :
                        index === currentStep && isCallActive ? 'text-primary-900' :
                        'text-gray-900'
                      }`}>
                        {step.title}
                      </h4>
                      {step.optional && (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                          Optional
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                    
                    {step.tips && index === currentStep && isCallActive && (
                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-xs font-medium text-yellow-800 mb-1">Tips:</div>
                            <ul className="text-xs text-yellow-700 space-y-1">
                              {step.tips.map((tip, tipIndex) => (
                                <li key={tipIndex} className="flex items-start gap-1">
                                  <span className="text-yellow-500 mt-0.5">•</span>
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

        {/* Emergency Exit Warning */}
        {showNoGoConfirm && (
          <Card className="border-red-500 bg-red-50">
            <div className="text-center space-y-4">
              <AlertTriangle className="w-12 h-12 text-red-600 mx-auto" />
              <div>
                <h3 className="font-semibold text-red-900 mb-2">Mark Call as No-Go?</h3>
                <p className="text-sm text-red-800 mb-4">
                  This will end the call and mark it as unsuccessful. This data helps improve future targeting.
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <Button 
                  onClick={() => setShowNoGoConfirm(false)}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={confirmNoGo}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Confirm No-Go
                </Button>
              </div>
            </div>
          </Card>
        )}
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
    </div>
  );
};

export default LiveCallAssistance;