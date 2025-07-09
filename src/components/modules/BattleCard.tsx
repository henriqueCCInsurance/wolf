import React, { useState, useEffect } from 'react';
import { Download, Printer, ArrowLeft, FileText, Target, TrendingUp, Phone, ChevronLeft, ChevronRight, Lock, Unlock } from 'lucide-react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import CollapsibleSection from '@/components/common/CollapsibleSection';
import EnhancedContentLibrary from '@/components/callguide/EnhancedContentLibrary';
import LiveIndustryIntelligence from '@/components/intelligence/LiveIndustryIntelligence';
import ClickablePhone from '@/components/common/ClickablePhone';
import { useAppStore } from '@/store';
import { personas } from '@/data/personas';
import { industries } from '@/data/industries';
import { callObjectives } from '@/data/content';
import { getClosingsByPersonaAndType, getSuccessRateCategory } from '@/data/strategicClosings';
import { Contact, PersonaType } from '@/types';
import { NetlifyDatabaseService } from '@/services/netlifyDb';

const CallGuide: React.FC = () => {
  const { prospect, selectedContent, setCurrentModule, addBattleCard, setProspect, activeSequenceId, callSequences } = useAppStore();
  const [lockedContacts, setLockedContacts] = useState<Contact[]>([]);
  const [currentContactIndex, setCurrentContactIndex] = useState(0);
  const [isMultiContactMode, setIsMultiContactMode] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(false);

  // Load contacts from active sequence or localStorage on component mount
  useEffect(() => {
    const loadContacts = async () => {
      setLoadingContacts(true);
      
      try {
        // First try to load from active sequence
        if (activeSequenceId) {
          const sequence = callSequences.find(seq => seq.id === activeSequenceId);
          if (sequence) {
            // TODO: Get userId from authentication context
            const userId = 'current-user';
            
            // Load contacts from database if they have IDs
            if (sequence.contactIds && sequence.contactIds.length > 0) {
              const dbContacts = await NetlifyDatabaseService.contactService.getByIds(sequence.contactIds);
              
              // Convert database contacts to UI contacts
              const uiContacts = dbContacts.map(dbContact => ({
                id: dbContact.id,
                companyName: dbContact.company,
                contactName: dbContact.name,
                title: dbContact.title,
                position: dbContact.title,
                phone: dbContact.phone,
                email: dbContact.email,
                industry: dbContact.industry,
                employeeCount: dbContact.employeeCount,
                revenue: dbContact.revenue,
                persona: dbContact.personaType as PersonaType,
                status: dbContact.status
              }));
              
              setLockedContacts(uiContacts);
              setIsMultiContactMode(uiContacts.length > 1);
              
              // If no prospect is set but we have contacts, set the first one
              if (!prospect && uiContacts.length > 0) {
                const firstContact = uiContacts[0];
                setProspect({
                  companyName: firstContact.companyName,
                  contactName: firstContact.contactName,
                  contactPhone: firstContact.phone || '',
                  contactPosition: firstContact.position || '',
                  contactEmail: firstContact.email || '',
                  industry: firstContact.industry || '',
                  persona: firstContact.persona || 'cost-conscious-employer'
                });
              }
              
              setLoadingContacts(false);
              return;
            }
          }
        }
        
        // Fallback to localStorage for backward compatibility
        const savedLockedContacts = localStorage.getItem('wolf-den-locked-contacts');
        if (savedLockedContacts) {
          const contacts = JSON.parse(savedLockedContacts);
          if (Array.isArray(contacts) && contacts.length > 0) {
            setLockedContacts(contacts);
            setIsMultiContactMode(contacts.length > 1);
            
            // If no prospect is set but we have locked contacts, set the first one
            if (!prospect && contacts.length > 0) {
              const firstContact = contacts[0];
              setProspect({
                companyName: firstContact.companyName,
                contactName: firstContact.contactName,
                contactPhone: firstContact.phone || '',
                contactPosition: '',
                contactEmail: firstContact.email || '',
                industry: firstContact.industry || '',
                persona: firstContact.persona || 'cost-conscious-employer'
              });
            }
          }
        }
      } catch (error) {
        console.error('Error loading contacts:', error);
      } finally {
        setLoadingContacts(false);
      }
    };
    
    loadContacts();
  }, [activeSequenceId, callSequences, prospect, setProspect]);

  const getCurrentContact = () => {
    if (isMultiContactMode && lockedContacts.length > 0) {
      return lockedContacts[currentContactIndex];
    }
    return null;
  };

  const getCurrentProspect = () => {
    if (isMultiContactMode) {
      const currentContact = getCurrentContact();
      if (currentContact) {
        return {
          companyName: currentContact.companyName,
          contactName: currentContact.contactName,
          contactPhone: currentContact.phone || '',
          contactPosition: '',
          contactEmail: currentContact.email || '',
          industry: currentContact.industry || '',
          persona: currentContact.persona || 'cost-conscious-employer'
        };
      }
    }
    return prospect;
  };

  const handleNavigateContact = (direction: 'prev' | 'next') => {
    if (!isMultiContactMode) return;
    
    const newIndex = direction === 'prev' 
      ? Math.max(0, currentContactIndex - 1)
      : Math.min(lockedContacts.length - 1, currentContactIndex + 1);
    
    setCurrentContactIndex(newIndex);
    
    // Update the prospect in the store to reflect the current contact
    const newContact = lockedContacts[newIndex];
    setProspect({
      companyName: newContact.companyName,
      contactName: newContact.contactName,
      contactPhone: newContact.phone || '',
      contactPosition: '',
      contactEmail: newContact.email || '',
      industry: newContact.industry || '',
      persona: newContact.persona || 'cost-conscious-employer'
    });
  };

  const handleUnlockContacts = () => {
    // Clear from localStorage (for backward compatibility)
    localStorage.removeItem('wolf-den-locked-contacts');
    localStorage.removeItem('wolf-den-company-intelligence');
    localStorage.removeItem('wolf-den-intelligence-loading');
    
    // Clear active sequence
    useAppStore.getState().setActiveSequence(null);
    
    // Reset local state
    setLockedContacts([]);
    setIsMultiContactMode(false);
    setCurrentContactIndex(0);
  };

  const currentProspect = getCurrentProspect();

  if (!currentProspect) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Lead Selected</h2>
        <p className="text-gray-600 mb-6">Complete the Planner first to generate your Guide</p>
        <Button onClick={() => setCurrentModule('call-planner')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Planner
        </Button>
      </div>
    );
  }

  const selectedPersona = personas.find(p => p.id === currentProspect.persona);
  const selectedIndustry = industries.find(i => i.id === currentProspect.industry);

  const handlePrint = () => {
    window.print();
  };

  const handleGeneratePDF = () => {
    // Create call guide data
    const callGuide = {
      lead: currentProspect, // Updated to use current prospect (could be from locked contacts)
      selectedContent,
      dynamicIntelligence: [], // Will be populated when web search is implemented
      generatedAt: new Date()
    };
    
    // Add battle card to store and database
    addBattleCard(callGuide);
    
    // If we have a contact ID, update the battle card in database
    if (isMultiContactMode && lockedContacts[currentContactIndex]?.id) {
      // The addBattleCard function in store already handles database save
    }
    
    // For now, just trigger print dialog
    // TODO: Implement PDF generation with jsPDF
    handlePrint();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Guide Generator</h1>
          <p className="text-lg text-gray-600">
            Prepare your battle card and reference materials for {currentProspect.companyName}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={() => setCurrentModule('call-planner')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Planner
          </Button>
          <Button onClick={() => setCurrentModule('live-call')} className="bg-green-600 hover:bg-green-700">
            <Phone className="w-4 h-4 mr-2" />
            Start Call
          </Button>
          <Button onClick={handlePrint} variant="secondary">
            <Printer className="w-4 h-4 mr-2" />
            Print Guide
          </Button>
          <Button onClick={handleGeneratePDF}>
            <Download className="w-4 h-4 mr-2" />
            Generate PDF
          </Button>
        </div>
      </div>

      {/* Multi-Contact Navigation */}
      {isMultiContactMode && (
        <Card 
          title="Contact Navigation" 
          subtitle={`Viewing ${currentContactIndex + 1} of ${lockedContacts.length} locked contacts`}
          className="bg-purple-50 border-purple-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-purple-600">
                <Lock className="w-4 h-4 mr-2" />
                <span className="font-medium">Locked Contact Mode</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => handleNavigateContact('prev')}
                  disabled={currentContactIndex === 0}
                  variant="outline"
                  size="sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-600">
                  {currentContactIndex + 1} of {lockedContacts.length}
                </span>
                <Button
                  onClick={() => handleNavigateContact('next')}
                  disabled={currentContactIndex === lockedContacts.length - 1}
                  variant="outline"
                  size="sm"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Current:</span> {currentProspect.companyName}
              </div>
              <Button
                onClick={handleUnlockContacts}
                variant="outline"
                size="sm"
                className="border-purple-600 text-purple-600 hover:bg-purple-50"
              >
                <Unlock className="w-3 h-3 mr-1.5" />
                Unlock All
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Call Objectives */}
      <Card title="Call Objectives" subtitle="Your success outcomes ranked by priority">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {callObjectives.slice(0, 6).map((objective) => (
            <div 
              key={objective.id}
              className={`border rounded-lg p-4 transition-colors ${
                objective.priority === 'highest' ? 'border-green-300 bg-green-50' :
                objective.priority === 'high' ? 'border-blue-300 bg-blue-50' :
                'border-gray-300 bg-gray-50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{objective.icon}</span>
                <div>
                  <h4 className={`font-semibold mb-1 ${
                    objective.priority === 'highest' ? 'text-green-900' :
                    objective.priority === 'high' ? 'text-blue-900' :
                    'text-gray-900'
                  }`}>
                    {objective.title}
                  </h4>
                  <p className="text-sm text-gray-700 mb-2">{objective.description}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    objective.priority === 'highest' ? 'bg-green-200 text-green-800' :
                    objective.priority === 'high' ? 'bg-blue-200 text-blue-800' :
                    'bg-gray-200 text-gray-800'
                  }`}>
                    {objective.priority.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-primary-50 border border-primary-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <TrendingUp className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-primary-900 mb-2">Remember: Every Call is a Success</h4>
              <p className="text-sm text-primary-800">
                Even if you don't book a meeting, gathering intelligence, getting a referral, or qualifying out a bad prospect are all valuable outcomes. 
                Focus on creating value in every conversation.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Live Industry Intelligence */}
      <CollapsibleSection
        title="Live Industry Intelligence"
        subtitle="Real-time market insights and talking points"
        defaultExpanded={false}
        priority="medium"
      >
        <LiveIndustryIntelligence industry={currentProspect.industry} />
      </CollapsibleSection>

      {/* Strategic Closings */}
      <CollapsibleSection
        title="Strategic Closing Techniques"
        subtitle="Outcome-specific closing approaches"
        defaultExpanded={false}
        priority="medium"
      >
        <div className="space-y-6">
          {/* Meeting Booking Closes */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Target className="w-5 h-5 text-green-600 mr-2" />
              Meeting Booking Closes
            </h4>
            <div className="space-y-3">
              {getClosingsByPersonaAndType(currentProspect.persona, 'meeting-booking').slice(0, 2).map((closing) => {
                const successCategory = getSuccessRateCategory(closing.successRate);
                return (
                  <div key={closing.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-gray-900">{closing.title}</h5>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        successCategory === 'excellent' ? 'bg-green-100 text-green-800' :
                        successCategory === 'high' ? 'bg-blue-100 text-blue-800' :
                        successCategory === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {closing.successRate}% Success Rate
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">{closing.content}</p>
                    <p className="text-xs text-gray-600 italic">{closing.context}</p>
                    {closing.followUp && (
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
                        <strong>Follow-up:</strong> {closing.followUp}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Information Gathering Closes */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <FileText className="w-5 h-5 text-blue-600 mr-2" />
              Information Gathering Closes
            </h4>
            <div className="space-y-3">
              {getClosingsByPersonaAndType(currentProspect.persona, 'information-gathering').slice(0, 1).map((closing) => {
                const successCategory = getSuccessRateCategory(closing.successRate);
                return (
                  <div key={closing.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-gray-900">{closing.title}</h5>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        successCategory === 'excellent' ? 'bg-green-100 text-green-800' :
                        successCategory === 'high' ? 'bg-blue-100 text-blue-800' :
                        successCategory === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {closing.successRate}% Success Rate
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">{closing.content}</p>
                    <p className="text-xs text-gray-600 italic">{closing.context}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Enhanced Content Selection */}
      <CollapsibleSection
        title="Enhanced Content Library"
        subtitle="Persona-specific openers, talking points, and objection handlers"
        defaultExpanded={false}
        priority="medium"
      >
        <EnhancedContentLibrary />
      </CollapsibleSection>

      {/* Guide Preview */}
      <Card title="Printable Guide" subtitle="Your complete reference sheet for the call">
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 print:shadow-none print:border-0" id="call-guide">
          {/* Header */}
          <div className="border-b border-gray-200 pb-4 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">W.O.L.F</h1>
                <p className="text-sm text-gray-600">Campbell & Co. Guide</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Generated: {new Date().toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">Target: {currentProspect.companyName}</p>
              </div>
            </div>
          </div>

          {/* Call Objectives Quick Reference */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">CALL OBJECTIVES</h3>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-green-50 border border-green-200 p-2 rounded">
                <span className="font-medium text-green-800">🎯 BEST: Meeting Booked</span>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-2 rounded">
                <span className="font-medium text-blue-800">📅 GOOD: Follow-up Scheduled</span>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-2 rounded">
                <span className="font-medium text-gray-800">💡 WIN: Intelligence Gathered</span>
              </div>
            </div>
          </div>

          {/* Lead Information */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">LEAD PROFILE</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Company:</span> {currentProspect.companyName}</p>
                <p><span className="font-medium">Contact:</span> {currentProspect.contactName}</p>
                {currentProspect.contactPhone && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Phone:</span>
                    <ClickablePhone 
                      phoneNumber={currentProspect.contactPhone}
                      contactName={currentProspect.contactName}
                      companyName={currentProspect.companyName}
                      size="sm"
                      showIcon={false}
                    />
                  </div>
                )}
                <p><span className="font-medium">Industry:</span> {selectedIndustry?.name}</p>
                <p><span className="font-medium">Persona:</span> {selectedPersona?.title}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">KEY PRESSURES</h3>
              <ul className="space-y-1 text-sm">
                {selectedPersona?.keyPressures.slice(0, 3).map((pressure, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-1 h-1 bg-primary-300 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    <span className="text-xs">{pressure}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Selected Content */}
          {selectedContent.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">STRATEGIC CONTENT</h3>
              <div className="space-y-3">
                {selectedContent.map((item) => (
                  <div key={item.id} className="border-l-4 border-primary-300 pl-3">
                    <p className="text-xs font-medium text-primary-700 uppercase tracking-wide">
                      {item.type.replace('-', ' ')}
                    </p>
                    <p className="text-sm text-gray-900 mt-1">{item.content}</p>
                    {item.context && (
                      <p className="text-xs text-gray-600 italic mt-1">{item.context}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Language & Red Flags */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">THEIR LANGUAGE</h3>
              <div className="flex flex-wrap gap-1">
                {selectedPersona?.language.slice(0, 6).map((term, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-0.5 bg-primary-100 text-primary-800 text-xs rounded"
                  >
                    {term}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">RED FLAGS</h3>
              <ul className="space-y-1">
                {selectedPersona?.redFlags.slice(0, 3).map((flag, index) => (
                  <li key={index} className="text-xs text-red-600 flex items-start">
                    <span className="w-1 h-1 bg-red-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-4 mt-6">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <p>Campbell & Co. - Your Trusted Insurance Partner</p>
              <p>W.O.L.F: Wisdom • Opportunity • Leadership • Focus</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Instructions */}
      <Card title="Usage Instructions">
        <div className="prose prose-sm max-w-none">
          <h4>How to use your Battle Card:</h4>
          <ol>
            <li><strong>Review 5 minutes before the call</strong> - Familiarize yourself with the persona pressures and selected content</li>
            <li><strong>Keep it visible during the call</strong> - Reference the language and talking points naturally</li>
            <li><strong>Avoid the red flags</strong> - These are proven conversation killers for this persona type</li>
            <li><strong>Use their language</strong> - Mirror their KPIs and terminology to build rapport</li>
            <li><strong>Record outcomes</strong> - After the call, log your results in the Post-Game Analysis</li>
          </ol>
        </div>
      </Card>
    </div>
  );
};

export default CallGuide;