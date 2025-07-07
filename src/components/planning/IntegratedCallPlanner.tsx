import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Upload, 
  Database, 
  Users, 
  MapPin,
  Printer,
  Download,
  X,
  Clock,
  Target,
  Brain,
  FileText,
  Search
} from 'lucide-react';
import { CallSequence, Contact, PersonaType, ContentItem } from '@/types';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import CollapsibleSection from '@/components/common/CollapsibleSection';
import ContentLibrary from '@/components/common/ContentLibrary';
import EnhancedLiveIntelligence from '@/components/intelligence/EnhancedLiveIntelligence';
import ContactImporter from './ContactImporter';
import { useAppStore } from '@/store';
import { personas } from '@/data/personas';
import { industries } from '@/data/industries';
import { EnhancedWebSearchService } from '@/services/enhancedWebSearch';

type PlanningMode = 'single-prospect' | 'imported-list' | 'crm-sync';

const IntegratedCallPlanner: React.FC = () => {
  const { 
    prospect, 
    setProspect, 
    selectedContent, 
    isGeneratingIntelligence,
    setIsGeneratingIntelligence,
    dynamicIntelligence,
    setDynamicIntelligence,
    setCurrentModule,
    advancedMode
  } = useAppStore();

  const [mode, setMode] = useState<PlanningMode | null>(null);
  const [currentSequence, setCurrentSequence] = useState<CallSequence | null>(null);
  const [showImporter, setShowImporter] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());

  // Single prospect form data
  const [formData, setFormData] = useState({
    companyName: prospect?.companyName || '',
    contactName: prospect?.contactName || '',
    contactPhone: prospect?.contactPhone || '',
    contactPosition: prospect?.contactPosition || '',
    contactEmail: prospect?.contactEmail || '',
    industry: prospect?.industry || '',
    persona: prospect?.persona || '' as PersonaType
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const sprintSizes = [1, 2, 3, 5, 8, 10, 15, 20];

  const handleModeChange = (newMode: PlanningMode) => {
    setMode(newMode);
    setContacts([]);
    setSelectedContacts(new Set());
    setCurrentSequence(null);
    
    // If single prospect mode, prepare for Planner flow
    if (newMode === 'single-prospect') {
      // Reset form if no existing prospect
      if (!prospect) {
        setFormData({
          companyName: '',
          contactName: '',
          contactPhone: '',
          contactPosition: '',
          contactEmail: '',
          industry: '',
          persona: '' as PersonaType
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (!formData.contactName.trim()) {
      newErrors.contactName = 'Contact name is required';
    }
    
    if (!formData.industry) {
      newErrors.industry = 'Industry selection is required';
    }
    
    if (!formData.persona) {
      newErrors.persona = 'Persona selection is required';
    }

    // Phone validation (required field with format check)
    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = 'Phone number is required';
    } else {
      // Basic phone format validation (allows various formats)
      const phoneRegex = /^[\d\s\-())+.]+$/;
      if (!phoneRegex.test(formData.contactPhone) || formData.contactPhone.replace(/\D/g, '').length < 10) {
        newErrors.contactPhone = 'Please enter a valid phone number (at least 10 digits)';
      }
    }

    // Email validation (optional but format check if provided)
    if (formData.contactEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.contactEmail)) {
        newErrors.contactEmail = 'Please enter a valid email address';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitProspect = () => {
    if (validateForm()) {
      const newProspect = {
        companyName: formData.companyName,
        contactName: formData.contactName,
        contactPhone: formData.contactPhone,
        contactPosition: formData.contactPosition,
        contactEmail: formData.contactEmail,
        industry: formData.industry,
        persona: formData.persona
      };
      
      setProspect(newProspect);
      
      // Create a single contact for the sequence
      const contact: Contact = {
        id: Date.now().toString(),
        companyName: formData.companyName,
        contactName: formData.contactName,
        industry: formData.industry,
        persona: formData.persona,
        source: 'manual',
        status: 'pending'
      };
      
      setContacts([contact]);
      setSelectedContacts(new Set([contact.id]));
    }
  };

  const handleGenerateIntelligence = async () => {
    if (!prospect) return;
    
    setIsGeneratingIntelligence(true);
    try {
      const searchResults = await EnhancedWebSearchService.searchIndustryIntelligence(prospect.industry);
      setDynamicIntelligence(searchResults);
    } catch (error) {
      console.error('Failed to generate intelligence:', error);
    } finally {
      setIsGeneratingIntelligence(false);
    }
  };

  const handleGenerateCallGuide = () => {
    if (!prospect) return;
    
    // In simple mode, we need to auto-select some basic content
    if (!advancedMode && selectedContent.length === 0) {
      // Import content data to auto-select basics
      import('@/data/content').then(({ contentLibrary }) => {
        const basicContent: ContentItem[] = [];
        
        // Select one opener for the persona
        const opener = contentLibrary.find((item: ContentItem) => 
          item.type === 'opener' && item.persona === prospect.persona
        );
        if (opener) basicContent.push(opener);
        
        // Select one thought leadership item
        const thoughtLeadership = contentLibrary.find((item: ContentItem) => 
          item.type === 'thought-leadership' && item.persona === prospect.persona
        );
        if (thoughtLeadership) basicContent.push(thoughtLeadership);
        
        // Select one objection handler
        const objectionHandler = contentLibrary.find((item: ContentItem) => 
          item.type === 'objection-handler' && item.persona === prospect.persona
        );
        if (objectionHandler) basicContent.push(objectionHandler);
        
        // Set the selected content before navigating
        useAppStore.getState().setSelectedContent(basicContent);
        setCurrentModule('battle-card');
      });
    } else if (selectedContent.length > 0) {
      setCurrentModule('battle-card');
    }
  };

  const handleContactsImported = (importedContacts: Contact[]) => {
    setContacts(importedContacts);
    setShowImporter(false);
  };

  const handleContactSelect = (contactId: string) => {
    const newSelected = new Set(selectedContacts);
    if (newSelected.has(contactId)) {
      newSelected.delete(contactId);
    } else {
      newSelected.add(contactId);
    }
    setSelectedContacts(newSelected);
  };

  const createSequence = (sprintSize: number) => {
    const selectedContactList = contacts.filter(c => selectedContacts.has(c.id));
    
    if (selectedContactList.length === 0) {
      alert('Please select contacts for your sequence');
      return;
    }

    const sequence: CallSequence = {
      id: Date.now().toString(),
      name: `${mode} Sequence - ${new Date().toLocaleDateString()}`,
      contacts: selectedContactList.slice(0, sprintSize),
      createdBy: 'current-user',
      createdAt: new Date(),
      status: 'planned',
      sprintSize,
      mode: mode === 'single-prospect' ? 'standalone' : mode === 'imported-list' ? 'imported' : 'crm-sync'
    };

    setCurrentSequence(sequence);
  };

  const addStandaloneContact = () => {
    const newContact: Contact = {
      id: Date.now().toString(),
      companyName: '',
      contactName: '',
      industry: '',
      source: 'manual',
      status: 'pending'
    };
    setContacts([...contacts, newContact]);
  };

  const updateContact = (id: string, updates: Partial<Contact>) => {
    setContacts(contacts.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const removeContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
    const newSelected = new Set(selectedContacts);
    newSelected.delete(id);
    setSelectedContacts(newSelected);
  };

  const exportSequence = () => {
    if (!currentSequence) return;
    
    const data = {
      sequence: currentSequence,
      exportedAt: new Date().toISOString(),
      type: 'call-sequence'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `call-sequence-${currentSequence.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printSequence = () => {
    if (!currentSequence) return;
    window.print();
  };

  const selectedPersona = personas.find(p => p.id === formData.persona);
  const selectedIndustry = industries.find(i => i.id === formData.industry);

  // Show planning mode selection if no mode is selected
  if (!mode) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Planner</h1>
          <p className="text-lg text-gray-600">
            Choose your approach to plan strategic call sequences
          </p>
        </div>

        {/* Planning Mode Selection */}
        <Card title="Select Call Planning Mode" subtitle="Choose how you want to build your call sequence">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleModeChange('single-prospect')}
              className="p-6 border-2 border-gray-200 hover:border-primary-400 hover:bg-primary-50 rounded-lg text-left transition-all"
            >
              <Target className="w-8 h-8 text-primary-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Single Prospect</h3>
              <p className="text-sm text-gray-600">
                Deep dive research and preparation for a high-value target
              </p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleModeChange('imported-list')}
              className="p-6 border-2 border-gray-200 hover:border-primary-400 hover:bg-primary-50 rounded-lg text-left transition-all"
            >
              <Upload className="w-8 h-8 text-primary-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Import Contact List</h3>
              <p className="text-sm text-gray-600">
                CSV import from Apollo, ZoomInfo, or other lead sources
              </p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleModeChange('crm-sync')}
              className="p-6 border-2 border-gray-200 hover:border-primary-400 hover:bg-primary-50 rounded-lg text-left transition-all"
            >
              <Database className="w-8 h-8 text-primary-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">CRM Sync</h3>
              <p className="text-sm text-gray-600">
                Import leads directly from your Zoho CRM integration
              </p>
            </motion.button>
          </div>
        </Card>
      </div>
    );
  }

  // Single Prospect Mode (Planner Flow)
  if (mode === 'single-prospect') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Planner - Single Prospect</h1>
          <p className="text-lg text-gray-600">
            {advancedMode 
              ? "Build the perfect call strategy with tactical intelligence" 
              : "Quick and easy call preparation"}
          </p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setMode(null)}
            >
              ← Change Mode
            </Button>
          </div>
        </div>

        {/* Step 1: Lead Acquisition */}
        <CollapsibleSection
          title="Step 1: Prospect Information"
          subtitle="Identify your prospect and their context"
          defaultExpanded={true}
          priority="high"
          badge={prospect ? "Completed" : "Required"}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Company Name"
              value={formData.companyName}
              onChange={(value) => setFormData({ ...formData, companyName: value })}
              placeholder="e.g., ABC Manufacturing Inc."
              required
              error={errors.companyName}
            />
            
            <Input
              label="Contact Name"
              value={formData.contactName}
              onChange={(value) => setFormData({ ...formData, contactName: value })}
              placeholder="e.g., John Smith"
              required
              error={errors.contactName}
            />

            <Input
              label="Phone Number"
              value={formData.contactPhone}
              onChange={(value) => setFormData({ ...formData, contactPhone: value })}
              placeholder="e.g., (555) 123-4567"
              required
              error={errors.contactPhone}
              type="tel"
            />

            <Input
              label="Position/Title"
              value={formData.contactPosition}
              onChange={(value) => setFormData({ ...formData, contactPosition: value })}
              placeholder="e.g., HR Director, CFO"
              error={errors.contactPosition}
            />

            <Input
              label="Email Address"
              value={formData.contactEmail}
              onChange={(value) => setFormData({ ...formData, contactEmail: value })}
              placeholder="e.g., john.smith@company.com"
              error={errors.contactEmail}
              type="email"
            />
            
            <Select
              label="Industry"
              value={formData.industry}
              onChange={(value) => setFormData({ ...formData, industry: value })}
              options={industries.map(industry => ({
                value: industry.id,
                label: industry.name
              }))}
              placeholder="Select industry..."
              required
              error={errors.industry}
            />
            
            <Select
              label="Stakeholder Persona"
              value={formData.persona}
              onChange={(value) => setFormData({ ...formData, persona: value as PersonaType })}
              options={personas.map(persona => ({
                value: persona.id,
                label: persona.title
              }))}
              placeholder="Select persona..."
              required
              error={errors.persona}
            />
          </div>
          
          <div className="mt-4">
            <Button onClick={handleSubmitProspect} className="w-full md:w-auto">
              <Target className="w-4 h-4 mr-2" />
              Lock Prospect
            </Button>
          </div>
        </CollapsibleSection>

        {/* Persona Insights - Only in Advanced Mode */}
        {selectedPersona && advancedMode && (
          <CollapsibleSection
            title={`Step 2: Persona Intelligence - ${selectedPersona.title}`}
            subtitle={selectedPersona.description}
            defaultExpanded={true}
            priority="high"
            badge="Intelligence"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Profile</h4>
                <p className="text-gray-700 text-sm mb-4">{selectedPersona.profile}</p>
                
                <h4 className="font-semibold text-gray-900 mb-2">Key Pressures (2025)</h4>
                <ul className="space-y-1">
                  {selectedPersona.keyPressures.map((pressure, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="w-2 h-2 bg-primary-300 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {pressure}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Language & KPIs</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedPersona.language.map((term, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                    >
                      {term}
                    </span>
                  ))}
                </div>
                
                <h4 className="font-semibold text-gray-900 mb-2">Red Flags</h4>
                <ul className="space-y-1">
                  {selectedPersona.redFlags.map((flag, index) => (
                    <li key={index} className="text-sm text-red-600 flex items-start">
                      <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CollapsibleSection>
        )}

        {/* Industry Intelligence - Only in Advanced Mode */}
        {selectedIndustry && advancedMode && (
          <Card 
            title={`Step 3: Industry Intelligence - ${selectedIndustry.name}`}
            subtitle="Current risks and opportunities in this sector"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Emerging Risks</h4>
                <ul className="space-y-2">
                  {selectedIndustry.emergingRisks.map((risk, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Connection to Benefits</h4>
                <ul className="space-y-2">
                  {selectedIndustry.connectionToBenefits.map((connection, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="w-2 h-2 bg-primary-300 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {connection}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        )}

        {/* Live Industry Intelligence - Only in Advanced Mode */}
        {prospect && advancedMode && (
          <Card 
            title="Step 4: Live Industry Intelligence"
            subtitle="2025 market data and thought leadership for your target industry"
          >
            <EnhancedLiveIntelligence industry={prospect.industry} />
          </Card>
        )}

        {/* Dynamic Intelligence - Only in Advanced Mode */}
        {prospect && advancedMode && (
          <Card 
            title="Step 5: Dynamic Intelligence Briefing"
            subtitle="Real-time web search intelligence (Demo)"
          >
            {dynamicIntelligence.length === 0 ? (
              <div className="text-center py-8">
                <Brain className="w-12 h-12 text-primary-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Gathering fresh intelligence about {selectedIndustry?.name} sector...
                </p>
                <Button 
                  loading={isGeneratingIntelligence}
                  onClick={handleGenerateIntelligence}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Generate Intelligence
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Real-time industry insights and talking points
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Fresh Intelligence ({dynamicIntelligence.length} insights)</h4>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleGenerateIntelligence}
                    loading={isGeneratingIntelligence}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>
                
                {dynamicIntelligence.map((result, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">{result.title}</h5>
                    <p className="text-sm text-gray-700 mb-2">{result.snippet}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Relevance: {Math.round(result.relevanceScore * 100)}%</span>
                      <span className="text-primary-600">Talking point ready</span>
                    </div>
                  </div>
                ))}
                
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <h5 className="font-medium text-primary-900 mb-2">Suggested Talking Points:</h5>
                  <ul className="space-y-1 text-sm text-primary-800">
                    {EnhancedWebSearchService.generateTalkingPoints(dynamicIntelligence, prospect.industry).map((point, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-primary-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Content Library - Only in Advanced Mode */}
        {prospect && advancedMode && (
          <Card 
            title="Step 6: Strategic Content Selection"
            subtitle="Choose your conversation weapons for this specific engagement"
          >
            <ContentLibrary />
          </Card>
        )}

        {/* Quick Summary for Simple Mode */}
        {prospect && !advancedMode && (
          <Card 
            title="Quick Guide"
            subtitle="Essential information for your call"
            className="bg-primary-50 border-primary-200"
          >
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Your Prospect</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Company:</span>
                    <p className="font-medium">{prospect.companyName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Contact:</span>
                    <p className="font-medium">{prospect.contactName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Industry:</span>
                    <p className="font-medium">{selectedIndustry?.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Role Type:</span>
                    <p className="font-medium">{selectedPersona?.title}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Key Talking Points</h4>
                <ul className="space-y-1">
                  {selectedPersona?.keyPressures.slice(0, 3).map((pressure, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="w-2 h-2 bg-primary-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                      {pressure}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <span className="font-semibold">Quick Tip:</span> Focus on {selectedPersona?.language[0]} and {selectedPersona?.language[1]} when speaking with this persona type.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Generate Guide */}
        {prospect && (advancedMode ? selectedContent.length > 0 : true) && (
          <div className="text-center">
            <Button 
              onClick={handleGenerateCallGuide}
              size="lg"
              className="text-lg px-8 py-3"
            >
              <FileText className="w-5 h-5 mr-2" />
              {advancedMode ? "Generate Guide" : "Generate Quick Guide"}
            </Button>
            {!advancedMode && (
              <p className="text-sm text-gray-500 mt-2">
                Switch to Advanced Mode for content customization and deeper intelligence
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  // Imported List and CRM Sync Modes
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Planner - {mode === 'imported-list' ? 'Import List' : 'CRM Sync'}</h1>
            <p className="text-gray-600 mt-1">
              Plan your call sequences with strategic sprint-based approach
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setMode(null)}
          >
            ← Change Mode
          </Button>
        </div>
      </div>

      {/* Contact Management */}
      <Card 
        title="Contact Management" 
        subtitle={`Managing contacts for ${mode === 'imported-list' ? 'imported list' : 'CRM sync'}`}
      >
        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          {mode === 'imported-list' && (
            <Button onClick={() => setShowImporter(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Import CSV
            </Button>
          )}
          
          {mode === 'crm-sync' && (
            <Button>
              <Database className="w-4 h-4 mr-2" />
              Sync from Zoho CRM
            </Button>
          )}
          
          <Button variant="outline" onClick={addStandaloneContact}>
            <Plus className="w-4 h-4 mr-2" />
            Add Manual Contact
          </Button>
        </div>

        {/* Contacts List */}
        {contacts.length > 0 ? (
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              {contacts.length} contact{contacts.length !== 1 ? 's' : ''} • {selectedContacts.size} selected
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {contacts.map((contact) => (
                <div 
                  key={contact.id}
                  className={`flex items-center gap-4 p-3 border rounded-lg ${
                    selectedContacts.has(contact.id) 
                      ? 'border-primary-300 bg-primary-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedContacts.has(contact.id)}
                    onChange={() => handleContactSelect(contact.id)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Company name"
                      value={contact.companyName}
                      onChange={(e) => updateContact(contact.id, { companyName: e.target.value })}
                      className="px-3 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Contact name"
                      value={contact.contactName}
                      onChange={(e) => updateContact(contact.id, { contactName: e.target.value })}
                      className="px-3 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Industry"
                      value={contact.industry}
                      onChange={(e) => updateContact(contact.id, { industry: e.target.value })}
                      className="px-3 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  
                  <button
                    onClick={() => removeContact(contact.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No contacts added yet</p>
            <p className="text-sm">
              {mode === 'imported-list' && 'Import a CSV file to get started'}
              {mode === 'crm-sync' && 'Sync with your CRM to load contacts'}
            </p>
          </div>
        )}
      </Card>

      {/* Sprint Planning */}
      {contacts.length > 0 && selectedContacts.size > 0 && (
        <Card title="Sprint Planning" subtitle="Create focused call sequences">
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              Create sprints from {selectedContacts.size} selected contact{selectedContacts.size !== 1 ? 's' : ''}
            </div>
            
            <div className="flex flex-wrap gap-3">
              {sprintSizes.map((size) => (
                <Button
                  key={size}
                  onClick={() => createSequence(size)}
                  disabled={selectedContacts.size < size}
                  variant={selectedContacts.size >= size ? 'primary' : 'secondary'}
                  size="sm"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  {size} Call{size !== 1 ? 's' : ''}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Current Sequence */}
      {currentSequence && (
        <Card 
          title="Active Call Sequence" 
          subtitle={`${currentSequence.contacts.length} contacts in sequence`}
          className="print:block"
        >
          <div className="space-y-4">
            {/* Sequence Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">{currentSequence.name}</h3>
                <p className="text-sm text-gray-600">
                  Created: {currentSequence.createdAt.toLocaleDateString()} • 
                  Mode: {currentSequence.mode.replace('-', ' ')} • 
                  Sprint size: {currentSequence.sprintSize}
                </p>
              </div>
              
              <div className="flex gap-2 print:hidden">
                <Button onClick={printSequence} variant="secondary" size="sm">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button onClick={exportSequence} variant="secondary" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Contact List */}
            <div className="space-y-2">
              {currentSequence.contacts.map((contact, index) => (
                <div key={contact.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{contact.companyName}</div>
                    <div className="text-sm text-gray-600">
                      {contact.contactName} • {contact.industry}
                      {contact.phone && ` • ${contact.phone}`}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {contact.address && (
                      <div className="text-xs text-gray-500 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        Location
                      </div>
                    )}
                    
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      contact.status === 'success' ? 'bg-green-100 text-green-800' :
                      contact.status === 'called' ? 'bg-blue-100 text-blue-800' :
                      contact.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {contact.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Route Planning Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Route Planning Available</h4>
                  <p className="text-sm text-blue-800 mt-1">
                    For successful meetings, we can help optimize your visit route. 
                    Contact information with addresses will be used for route planning.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Contact Importer Modal */}
      <ContactImporter
        isOpen={showImporter}
        onClose={() => setShowImporter(false)}
        onContactsImported={handleContactsImported}
      />
    </div>
  );
};

export default IntegratedCallPlanner;