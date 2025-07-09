import React, { useState } from 'react';
import { Phone, Clock, CheckCircle, ArrowLeft, Target, MessageSquare, Lightbulb, ExternalLink } from 'lucide-react';
import Button from '@/components/common/Button';
import ClickablePhone from '@/components/common/ClickablePhone';
import { useAppStore } from '@/store';
import { personas } from '@/data/personas';
import { industries } from '@/data/industries';
import { contentLibrary } from '@/data/content';
import { zoomPhoneService } from '@/services/zoomPhone';
import { SuccessPredictionService } from '@/services/successPrediction';
import { SuccessPredictionDisplay } from '@/components/common/SuccessPredictionDisplay';

const SimplifiedCallGuide: React.FC = () => {
  const { prospect, setCurrentModule, callLogs } = useAppStore();
  const [callStarted, setCallStarted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callTimer, setCallTimer] = useState<NodeJS.Timeout | null>(null);
  const [successPrediction, setSuccessPrediction] = useState<ReturnType<typeof SuccessPredictionService.prototype.calculatePrediction> | null>(null);

  if (!prospect) {
    return (
      <div className="text-center py-12">
        <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Call Strategy Ready</h2>
        <p className="text-gray-600 mb-6">Let's get you set up first</p>
        <Button onClick={() => setCurrentModule('call-planner')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Setup
        </Button>
      </div>
    );
  }

  const selectedPersona = personas.find(p => p.id === prospect.persona);
  const selectedIndustry = industries.find(i => i.id === prospect.industry);
  const personaContent = contentLibrary.filter((c: any) => c.persona === prospect.persona);

  // Calculate success prediction when component mounts or prospect changes
  React.useEffect(() => {
    if (prospect && !callStarted) {
      const predictionService = SuccessPredictionService.getInstance();
      const prediction = predictionService.calculatePrediction(prospect, callLogs);
      setSuccessPrediction(prediction);
    }
  }, [prospect, callLogs, callStarted]);

  const handleStartCall = async () => {
    if (!prospect?.contactPhone) {
      alert('No phone number available for this contact');
      return;
    }

    // Initiate Zoom Phone call
    const callSuccess = await zoomPhoneService.initiateCall({
      phoneNumber: prospect.contactPhone,
      contactName: prospect.contactName,
      companyName: prospect.companyName,
      leadId: `${prospect.companyName}-${prospect.contactName}`
    });

    if (callSuccess.success) {
      setCallStarted(true);
      const timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      setCallTimer(timer);
    } else {
      alert('Failed to initiate call. Make sure Zoom Phone is installed.');
    }
  };

  const handleEndCall = () => {
    setCallStarted(false);
    if (callTimer) {
      clearInterval(callTimer);
      setCallTimer(null);
    }
    
    // End call tracking in Zoom service
    const callEvent = zoomPhoneService.endCall();
    console.log('Call ended:', callEvent);
    
    // Move to call results
    setCurrentModule('post-game');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const openers = personaContent.filter((c: any) => c.type === 'opener').slice(0, 2);
  const objectionHandlers = personaContent.filter((c: any) => c.type === 'objection-handler').slice(0, 2);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      {/* Success Prediction - Show before call starts */}
      {successPrediction && !callStarted && (
        <div className="mb-6">
          <SuccessPredictionDisplay prediction={successPrediction} />
        </div>
      )}

      {/* Header with Call Controls */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ready to Call {prospect.contactName}?</h1>
            <p className="text-gray-600">{prospect.companyName} • {selectedIndustry?.name}</p>
            {prospect.contactPhone && (
              <div className="mt-1">
                <ClickablePhone 
                  phoneNumber={prospect.contactPhone}
                  contactName={prospect.contactName}
                  companyName={prospect.companyName}
                />
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:space-x-4 w-full sm:w-auto">
            {callStarted && (
              <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <Clock className="w-4 h-4" />
                <span className="font-mono font-semibold">{formatTime(callDuration)}</span>
              </div>
            )}
            
            {!callStarted ? (
              <Button 
                onClick={handleStartCall}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-lg px-6 sm:px-8 py-3 w-full sm:w-auto"
              >
                <Phone className="w-5 h-5 mr-2" />
                Start Call
              </Button>
            ) : (
              <Button 
                onClick={handleEndCall}
                size="lg"
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50 text-lg px-6 sm:px-8 py-3 w-full sm:w-auto"
              >
                End Call & Log Results
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Left Column - Call Strategy */}
        <div className="space-y-4 lg:space-y-6">
          {/* Who You're Calling */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-primary-600" />
              Who You're Calling
            </h2>
            {selectedPersona && (
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-gray-900">{selectedPersona.title}</h3>
                  <p className="text-sm text-gray-600">{selectedPersona.description}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">They Care About:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {selectedPersona.keyPressures.slice(0, 3).map((pressure, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {pressure}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Perfect Openers */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
              Perfect Conversation Starters
            </h2>
            <div className="space-y-4">
              {openers.map((opener: any, index: number) => (
                <div key={opener.id} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900 font-medium mb-2">Option {index + 1}:</p>
                  <p className="text-blue-800">{opener.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Support Tools */}
        <div className="space-y-4 lg:space-y-6">
          {/* Industry Insights */}
          {selectedIndustry && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
                Industry Hot Topics
              </h2>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Current Challenges:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {selectedIndustry.emergingRisks.slice(0, 2).map((risk, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">How We Help:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {selectedIndustry.connectionToBenefits.slice(0, 2).map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Objection Handlers */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-red-600" />
              If They Say No...
            </h2>
            <div className="space-y-4">
              {objectionHandlers.map((handler: any) => (
                <div key={handler.id} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-900 font-medium mb-2">{handler.title}:</p>
                  <p className="text-red-800 text-sm">{handler.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 lg:p-6">
            <h3 className="font-medium text-gray-900 mb-3">Quick Actions During Call:</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Schedule Follow-up</span>
                  <ExternalLink className="w-4 h-4 text-gray-500" />
                </div>
              </button>
              <button className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Send Resources</span>
                  <ExternalLink className="w-4 h-4 text-gray-500" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-8 text-center">
        <Button 
          variant="outline" 
          onClick={() => setCurrentModule('call-planner')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Setup
        </Button>
      </div>
    </div>
  );
};

export default SimplifiedCallGuide;