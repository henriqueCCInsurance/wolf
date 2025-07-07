import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Calendar, ArrowLeft, Trophy, Target, Phone } from 'lucide-react';
import Button from '@/components/common/Button';
import { useAppStore } from '@/store';
import { CallLog } from '@/types';
import { zohoCRMService } from '@/services/zohoCRM';

const SimplifiedPostGame: React.FC = () => {
  const { 
    prospect, 
    addCallLog, 
    setCurrentModule, 
    activeCallDuration, 
    activeCallStartTime,
    activeSequenceId,
    callSequences 
  } = useAppStore();
  const [selectedOutcome, setSelectedOutcome] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Find the current contact if we're in a sequence
  const activeSequence = callSequences.find(seq => seq.id === activeSequenceId);
  const currentContact = activeSequence?.contacts.find(c => 
    c.companyName === prospect?.companyName && c.contactName === prospect?.contactName
  );

  const outcomes = [
    {
      id: 'meeting-booked',
      label: 'Meeting Booked! 🎉',
      description: 'They want to learn more',
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      icon: Trophy
    },
    {
      id: 'follow-up',
      label: 'Follow-up Scheduled',
      description: 'Good conversation, need more time',
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      icon: Calendar
    },
    {
      id: 'intelligence',
      label: 'Valuable Intel Gathered',
      description: 'Learned something useful',
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-800',
      icon: Target
    },
    {
      id: 'no-interest',
      label: 'Not Interested Right Now',
      description: 'Maybe later, timing off',
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      icon: Clock
    },
    {
      id: 'not-a-fit',
      label: 'Not a Good Fit',
      description: 'Wrong contact or company',
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      icon: XCircle
    }
  ];

  const handleSubmit = async () => {
    if (!selectedOutcome || !prospect) return;

    setIsSubmitting(true);
    
    // Calculate attempt number for this contact
    const previousCalls = currentContact?.id 
      ? useAppStore.getState().getCallLogsForContact(currentContact.id).length 
      : 0;

    const callLog: CallLog = {
      id: Date.now().toString(),
      leadId: `${prospect.companyName}-${prospect.contactName}`,
      outcome: selectedOutcome as any,
      intel: notes,
      bestTalkingPoint: '',
      keyTakeaway: notes,
      createdAt: new Date(),
      callDuration: activeCallDuration || 0,
      // New fields
      sequenceId: activeSequenceId || undefined,
      contactId: currentContact?.id,
      startTime: activeCallStartTime || undefined,
      endTime: new Date(),
      attemptNumber: previousCalls + 1
    };

    addCallLog(callLog);

    // Sync with CRM
    try {
      const success = await zohoCRMService.syncCallResults(
        prospect,
        selectedOutcome,
        notes,
        activeCallDuration || 0
      );
      
      if (success) {
        console.log('Call results synced to CRM successfully');
      }
    } catch (error) {
      console.error('Failed to sync with CRM:', error);
    }

    setIsSubmitting(false);
    
    // Show success and return to planning
    setTimeout(() => {
      setCurrentModule('call-planner');
    }, 1000);
  };

  if (!prospect) {
    return (
      <div className="text-center py-12">
        <Phone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Call to Log</h2>
        <p className="text-gray-600 mb-6">Make a call first, then come back here</p>
        <Button onClick={() => setCurrentModule('call-planner')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Start New Call
        </Button>
      </div>
    );
  }

  const selectedOutcomeData = outcomes.find(o => o.id === selectedOutcome);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">How Did It Go?</h1>
        <p className="text-lg text-gray-600">
          Quick log for your call with <strong>{prospect.contactName}</strong> at <strong>{prospect.companyName}</strong>
        </p>
      </div>

      {/* Outcome Selection */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">What was the outcome?</h2>
        
        <div className="grid grid-cols-1 gap-3">
          {outcomes.map((outcome) => {
            const Icon = outcome.icon;
            const isSelected = selectedOutcome === outcome.id;
            
            return (
              <button
                key={outcome.id}
                onClick={() => setSelectedOutcome(outcome.id)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  isSelected 
                    ? `${outcome.bgColor} ${outcome.borderColor} ${outcome.textColor} ring-2 ring-offset-2 ring-${outcome.color.replace('bg-', '')}`
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isSelected ? outcome.color : 'bg-gray-300'
                  }`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{outcome.label}</h3>
                    <p className={`text-sm ${isSelected ? outcome.textColor : 'text-gray-500'}`}>
                      {outcome.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes Section */}
      {selectedOutcome && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Any quick notes?</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What did you learn? Any next steps? (Optional)"
            className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={4}
          />
        </div>
      )}

      {/* Success Preview */}
      {selectedOutcomeData && (
        <div className={`${selectedOutcomeData.bgColor} ${selectedOutcomeData.borderColor} border rounded-xl p-6 mb-6`}>
          <div className="flex items-center space-x-3 mb-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedOutcomeData.color}`}>
              <selectedOutcomeData.icon className="w-4 h-4 text-white" />
            </div>
            <h3 className={`font-semibold ${selectedOutcomeData.textColor}`}>
              Great job on this call!
            </h3>
          </div>
          <p className={`text-sm ${selectedOutcomeData.textColor}`}>
            Your CRM will be updated automatically with this outcome and any notes.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button
          variant="outline"
          onClick={() => setCurrentModule('battle-card')}
          className="flex-1"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Call
        </Button>
        
        <Button
          onClick={handleSubmit}
          disabled={!selectedOutcome}
          loading={isSubmitting}
          className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
        >
          {isSubmitting ? 'Syncing with CRM...' : 'Log Call & Continue'}
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Every call makes you better. Keep it up! 💪
        </p>
      </div>
    </div>
  );
};

export default SimplifiedPostGame;