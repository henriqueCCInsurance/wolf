import React, { useState } from 'react';
import { CheckCircle, Circle, Phone, MessageSquare, Target, Clock, Users, Lightbulb, TrendingUp } from 'lucide-react';
import { PersonaType } from '@/types';

interface CallGuideHelperProps {
  persona: PersonaType;
}

const CallGuideHelper: React.FC<CallGuideHelperProps> = ({ persona }) => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleCheck = (itemId: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(itemId)) {
      newChecked.delete(itemId);
    } else {
      newChecked.add(itemId);
    }
    setCheckedItems(newChecked);
  };

  const callFlow = [
    {
      phase: "Opening (0-2 min)",
      icon: Phone,
      color: "blue",
      items: [
        "Warm greeting with their name and company",
        "State purpose clearly and confidently",
        "Ask permission to continue (respect their time)",
        "Use their preferred communication style"
      ]
    },
    {
      phase: "Discovery (2-8 min)",
      icon: MessageSquare,
      color: "green",
      items: [
        "Ask about current benefits challenges",
        "Listen for pain points and priorities",
        "Probe deeper with follow-up questions",
        "Take notes on their specific language"
      ]
    },
    {
      phase: "Value Building (8-12 min)",
      icon: TrendingUp,
      color: "purple",
      items: [
        "Connect their challenges to your solutions",
        "Share relevant industry insights",
        "Use their language and KPIs",
        "Provide specific examples or case studies"
      ]
    },
    {
      phase: "Closing (12-15 min)",
      icon: Target,
      color: "orange",
      items: [
        "Summarize key points discussed",
        "Ask for the meeting or next step",
        "Handle objections professionally",
        "Confirm next steps and timeline"
      ]
    }
  ];

  const personaSpecificTips = {
    'cost-conscious-employer': [
      "💰 Lead with cost savings and ROI",
      "📊 Use concrete numbers and percentages",
      "⚡ Keep it concise - they value efficiency",
      "🎯 Focus on immediate, practical benefits"
    ],
    'benefits-optimizer': [
      "📈 Discuss employee engagement metrics",
      "🔧 Highlight strategic implementation support",
      "💡 Share innovative benefit solutions",
      "🤝 Position as strategic partnership"
    ],
    'roi-focused-executive': [
      "📊 Lead with financial impact data",
      "📈 Discuss competitive advantage",
      "⏰ Respect their time constraints",
      "🎯 Focus on business outcomes"
    ],
    'gatekeeper': [
      "🙏 Be respectful and professional",
      "⚡ Get to the point quickly",
      "📝 Provide clear value proposition",
      "🤝 Ask for their help/partnership"
    ]
  };

  const redFlags = {
    'cost-conscious-employer': [
      "Talking about 'premium' or 'luxury' features",
      "Long explanations without clear value",
      "Ignoring budget constraints"
    ],
    'benefits-optimizer': [
      "Focusing only on cost without strategy",
      "Generic solutions without customization",
      "Rushing the relationship-building"
    ],
    'roi-focused-executive': [
      "Wasting time on operational details",
      "Lack of concrete financial metrics",
      "Emotional appeals over logical arguments"
    ],
    'gatekeeper': [
      "Being pushy or demanding",
      "Not acknowledging their role",
      "Trying to go around them"
    ]
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-50 border-blue-200 text-blue-800",
      green: "bg-green-50 border-green-200 text-green-800",
      purple: "bg-purple-50 border-purple-200 text-purple-800",
      orange: "bg-orange-50 border-orange-200 text-orange-800"
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="space-y-6">
      {/* Call Flow Checklist */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="w-5 h-5 text-primary-600 mr-2" />
          Call Flow Checklist
        </h3>
        
        <div className="space-y-4">
          {callFlow.map((phase, phaseIndex) => {
            const Icon = phase.icon;
            return (
              <div key={phaseIndex} className={`border rounded-lg p-4 ${getColorClasses(phase.color)}`}>
                <div className="flex items-center mb-3">
                  <Icon className="w-5 h-5 mr-2" />
                  <h4 className="font-semibold">{phase.phase}</h4>
                </div>
                
                <div className="space-y-2">
                  {phase.items.map((item, itemIndex) => {
                    const itemId = `${phaseIndex}-${itemIndex}`;
                    const isChecked = checkedItems.has(itemId);
                    
                    return (
                      <div 
                        key={itemIndex}
                        className="flex items-start space-x-2 cursor-pointer hover:bg-white hover:bg-opacity-50 p-1 rounded"
                        onClick={() => toggleCheck(itemId)}
                      >
                        {isChecked ? (
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${isChecked ? 'line-through text-gray-500' : ''}`}>
                          {item}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Persona-Specific Success Tips */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Lightbulb className="w-5 h-5 text-yellow-600 mr-2" />
          Success Tips for {persona.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-green-900 mb-2">✅ Do This:</h4>
            <ul className="space-y-1">
              {personaSpecificTips[persona].map((tip, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start">
                  <span className="mr-2">{tip.split(' ')[0]}</span>
                  <span>{tip.split(' ').slice(1).join(' ')}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-red-900 mb-2">❌ Avoid This:</h4>
            <ul className="space-y-1">
              {redFlags[persona].map((flag, index) => (
                <li key={index} className="text-sm text-red-700 flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  {flag}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Real-Time Call Coaching */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg border border-primary-200 p-6">
        <h3 className="text-lg font-semibold text-primary-900 mb-4 flex items-center">
          <Users className="w-5 h-5 text-primary-600 mr-2" />
          Live Call Coaching
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-primary-200">
            <h4 className="font-medium text-primary-900 mb-2">🎯 When They Say...</h4>
            <p className="text-sm text-gray-700 mb-2">"We're happy with our current broker"</p>
            <p className="text-xs text-primary-800 font-medium">
              Response: "That's great to hear! What specifically do you like most about them?"
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-primary-200">
            <h4 className="font-medium text-primary-900 mb-2">💡 When They Pause...</h4>
            <p className="text-sm text-gray-700 mb-2">Long silence after your question</p>
            <p className="text-xs text-primary-800 font-medium">
              Wait 3-5 seconds, then: "What thoughts are coming to mind?"
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-primary-200">
            <h4 className="font-medium text-primary-900 mb-2">🚀 When They Engage...</h4>
            <p className="text-sm text-gray-700 mb-2">Asking detailed questions</p>
            <p className="text-xs text-primary-800 font-medium">
              Double down: "It sounds like this is important to you..."
            </p>
          </div>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Call Preparation Progress</span>
          <span className="text-sm text-primary-600 font-semibold">
            {checkedItems.size}/{callFlow.reduce((total, phase) => total + phase.items.length, 0)} Complete
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${(checkedItems.size / callFlow.reduce((total, phase) => total + phase.items.length, 0)) * 100}%` 
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CallGuideHelper;