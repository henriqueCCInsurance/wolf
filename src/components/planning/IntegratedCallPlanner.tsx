import React, { useState, useEffect } from 'react';
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
  Search,
  Lock,
  Unlock,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { CallSequence, Contact, PersonaType, ContentItem, ContactRelationship, DatabaseContact } from '@/types';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import CollapsibleSection from '@/components/common/CollapsibleSection';
import ContentLibrary from '@/components/common/ContentLibrary';
import EnhancedLiveIntelligence from '@/components/intelligence/EnhancedLiveIntelligence';
import RelationshipMap from '@/components/intelligence/RelationshipMap';
import ContactImporter from './ContactImporter';
import DealScoreBadge from '@/components/common/DealScoreBadge';
import { useAppStore } from '@/store';
import { personas } from '@/data/personas';
import { industries } from '@/data/industries';
import { EnhancedWebSearchService } from '@/services/enhancedWebSearch';
import { NetlifyDatabaseService } from '@/services/netlifyDb';
import { DealScoringService } from '@/services/dealScoring';

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
    advancedMode,
    activeSequenceId,
    callSequences,
    callLogs
  } = useAppStore();

  const [mode, setMode] = useState<PlanningMode | null>(null);
  const [currentSequence, setCurrentSequence] = useState<CallSequence | null>(null);
  const [showImporter, setShowImporter] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [contactsLocked, setContactsLocked] = useState(false);
  const [showGuideSection, setShowGuideSection] = useState(false);
  const [gatheringIntelligence, setGatheringIntelligence] = useState(false);
  const [sortBy, setSortBy] = useState<'score' | 'name' | 'company'>('score');

  // Function to calculate scores for all contacts
  const calculateContactScores = (contactList: Contact[]) => {
    const { callLogs } = useAppStore.getState();
    return contactList.map(contact => {
      const score = DealScoringService.calculateScore(contact, callLogs);
      return {
        ...contact,
        score: score.total,
        scoreCategory: score.category
      };
    });
  };

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

  // Load contacts from active sequence on component mount
  useEffect(() => {
    const loadSequenceContacts = async () => {
      if (activeSequenceId) {
        // Find the active sequence
        const sequence = callSequences.find(seq => seq.id === activeSequenceId);
        if (sequence) {
          try {
            // TODO: Get userId from authentication context
            // const userId = 'current-user';
            
            // Load contacts from database if they have IDs
            if (sequence.contactIds && sequence.contactIds.length > 0) {
              const dbContacts = await NetlifyDatabaseService.contactService.getByIds(sequence.contactIds);
              
              // Convert database contacts to UI contacts
              const uiContacts = dbContacts.map((dbContact: DatabaseContact): Contact => ({
                id: dbContact.id,
                companyName: dbContact.company,
                contactName: dbContact.name,
                title: dbContact.title,
                position: dbContact.title,
                phone: dbContact.phone,
                email: dbContact.email,
                industry: dbContact.industry || '',
                employeeCount: dbContact.employeeCount,
                revenue: dbContact.revenue,
                persona: dbContact.personaType as PersonaType,
                status: dbContact.status as Contact['status'],
                source: sequence.mode === 'imported' ? 'csv' : sequence.mode === 'crm-sync' ? 'crm' : 'manual',
                notes: dbContact.notes
              }));
              
              setContacts(uiContacts);
              setSelectedContacts(new Set(uiContacts.map((c: Contact) => c.id)));
              setContactsLocked(true);
              setShowGuideSection(true);
              setCurrentSequence(sequence);
              
              // Set mode based on sequence mode
              if (sequence.mode === 'imported') {
                setMode('imported-list');
              } else if (sequence.mode === 'crm-sync') {
                setMode('crm-sync');
              } else {
                setMode('single-prospect');
              }
            } else if (sequence.contacts && sequence.contacts.length > 0) {
              // Fallback to legacy contacts array
              setContacts(sequence.contacts);
              setSelectedContacts(new Set(sequence.contacts.map(c => c.id)));
              setContactsLocked(true);
              setShowGuideSection(true);
              setCurrentSequence(sequence);
              setMode(sequence.mode === 'imported' ? 'imported-list' : 
                     sequence.mode === 'crm-sync' ? 'crm-sync' : 'single-prospect');
            }
          } catch (error) {
            console.error('Error loading contacts from database:', error);
          }
        }
      }
      
      // Check for legacy localStorage contacts (for backward compatibility)
      const savedLockedContacts = localStorage.getItem('wolf-den-locked-contacts');
      if (savedLockedContacts && !activeSequenceId) {
        try {
          const contacts = JSON.parse(savedLockedContacts);
          if (Array.isArray(contacts) && contacts.length > 0) {
            setContacts(contacts);
            setSelectedContacts(new Set(contacts.map(c => c.id)));
            setContactsLocked(true);
            setShowGuideSection(true);
            
            // Set mode based on contact source
            if (contacts.length > 0) {
              const firstContact = contacts[0];
              if (firstContact.source === 'csv') {
                setMode('imported-list');
              } else if (firstContact.source === 'crm') {
                setMode('crm-sync');
              } else {
                setMode('single-prospect');
              }
            }
          }
        } catch (error) {
          console.error('Error parsing locked contacts:', error);
        }
      }
    };
    
    loadSequenceContacts();
  }, [activeSequenceId, callSequences]);

  const handleModeChange = (newMode: PlanningMode) => {
    setMode(newMode);
    setContacts([]);
    setSelectedContacts(new Set());
    setCurrentSequence(null);
    setContactsLocked(false);
    setShowGuideSection(false);
    setGatheringIntelligence(false);
    
    // Only clear locked contacts if explicitly switching modes (not on initial load)
    if (mode !== null) {
      localStorage.removeItem('wolf-den-locked-contacts');
      localStorage.removeItem('wolf-den-company-intelligence');
      localStorage.removeItem('wolf-den-intelligence-loading');
      // Clear active sequence when switching modes
      useAppStore.getState().setActiveSequence(null);
    }
    
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

  const handleSubmitProspect = async () => {
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
        phone: formData.contactPhone,
        email: formData.contactEmail,
        industry: formData.industry,
        persona: formData.persona,
        source: 'manual',
        status: 'pending'
      };
      
      // Calculate score for the contact
      const scoredContacts = calculateContactScores([contact]);
      setContacts(scoredContacts);
      setSelectedContacts(new Set([contact.id]));
      
      // Auto-lock the prospect in single prospect mode
      setContactsLocked(true);
      setGatheringIntelligence(true);
      
      // Save locked contact to localStorage
      localStorage.setItem('wolf-den-locked-contacts', JSON.stringify([contact]));
      
      // Trigger intelligence gathering
      try {
        const { CompanyIntelligenceService } = await import('@/services/companyIntelligence');
        
        const intelligencePromise = CompanyIntelligenceService.getMultipleCompanyIntelligence([newProspect]);
        
        localStorage.setItem('wolf-den-intelligence-loading', 'true');
        
        intelligencePromise.then(intelligence => {
          localStorage.setItem('wolf-den-company-intelligence', JSON.stringify(Object.fromEntries(intelligence)));
          localStorage.removeItem('wolf-den-intelligence-loading');
          setGatheringIntelligence(false);
        }).catch(error => {
          console.error('Error gathering company intelligence:', error);
          localStorage.removeItem('wolf-den-intelligence-loading');
          setGatheringIntelligence(false);
        });
        
        // Show guide section after a brief delay
        setTimeout(() => {
          setShowGuideSection(true);
        }, 500);
        
      } catch (error) {
        console.error('Error loading CompanyIntelligenceService:', error);
        setGatheringIntelligence(false);
        setShowGuideSection(true);
      }
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
    const scoredContacts = calculateContactScores(importedContacts);
    setContacts(scoredContacts);
    setShowImporter(false);
  };

  const handleLockContacts = async () => {
    setContactsLocked(true);
    setGatheringIntelligence(true);
    
    try {
      // Get selected contacts
      const contactsToLock = contacts.filter(c => selectedContacts.has(c.id));
      
      // TODO: Get userId from authentication context
      const userId = 'current-user';
      
      // If we don't have an active sequence, create one
      if (!currentSequence) {
        // Save contacts to database if they don't have IDs yet
        const savedContacts = await Promise.all(
          contactsToLock.map(async (contact) => {
            if (!contact.id || contact.id.startsWith('temp-')) {
              // Create new contact in database
              const dbContact = await NetlifyDatabaseService.contactService.create({
                userId,
                company: contact.companyName,
                name: contact.contactName,
                title: contact.position || contact.title,
                phone: contact.phone,
                email: contact.email,
                industry: contact.industry,
                employeeCount: contact.employeeCount,
                revenue: contact.revenue,
                personaType: contact.persona,
                status: 'new' as const,
                tags: [],
                notes: contact.notes
              });
              return dbContact;
            }
            // Contact already exists, convert to DatabaseContact format
            return {
              id: contact.id,
              userId,
              company: contact.companyName,
              name: contact.contactName,
              title: contact.title,
              phone: contact.phone,
              email: contact.email,
              industry: contact.industry,
              employeeCount: contact.employeeCount,
              revenue: contact.revenue,
              personaType: contact.persona,
              status: contact.status as DatabaseContact['status'],
              tags: [],
              notes: contact.notes,
              createdAt: new Date(),
              updatedAt: new Date()
            } as DatabaseContact;
          })
        );
        
        // Create a new sequence with these contacts
        const sequence = await NetlifyDatabaseService.callSequenceService.create({
          userId,
          name: `Planning Session ${new Date().toLocaleDateString()}`,
          contacts: savedContacts.map(c => ({
            id: c.id,
            companyName: 'company' in c ? c.company : c.companyName,
            contactName: 'name' in c ? c.name : c.contactName,
            status: 'pending' as const,
            industry: 'industry' in c ? c.industry || '' : c.industry || '',
            source: 'manual' as const
          })),
          contactIds: savedContacts.map(c => c.id),
          totalContacts: savedContacts.length,
          status: 'planned' as const,
          sprintSize: 10, // Default sprint size
          mode: mode === 'imported-list' ? 'imported' : mode === 'crm-sync' ? 'crm-sync' : 'standalone',
          updatedAt: new Date(),
          contactedCount: 0,
          qualifiedCount: 0
        });
        
        setCurrentSequence(sequence);
        useAppStore.getState().setActiveSequence(sequence.id);
      }
      
      // Trigger real-time company intelligence gathering
      const { CompanyIntelligenceService } = await import('@/services/companyIntelligence');
      
      // Convert contacts to prospects for intelligence gathering
      const contactsAsProspects = contactsToLock.map(contact => ({
        ...contact,
        persona: contact.persona || 'cost-conscious-employer' as PersonaType
      }));
      
      const intelligencePromise = CompanyIntelligenceService.getMultipleCompanyIntelligence(contactsAsProspects);
      
      // Store the promise for later use
      localStorage.setItem('wolf-den-intelligence-loading', 'true');
      
      // Process intelligence in background
      intelligencePromise.then(intelligence => {
        localStorage.setItem('wolf-den-company-intelligence', JSON.stringify(Object.fromEntries(intelligence)));
        localStorage.removeItem('wolf-den-intelligence-loading');
        setGatheringIntelligence(false);
      }).catch(error => {
        console.error('Error gathering company intelligence:', error);
        localStorage.removeItem('wolf-den-intelligence-loading');
        setGatheringIntelligence(false);
      });
      
      // After a brief delay, show the guide section
      setTimeout(() => {
        setShowGuideSection(true);
      }, 500);
      
    } catch (error) {
      console.error('Error loading CompanyIntelligenceService:', error);
      setGatheringIntelligence(false);
      setShowGuideSection(true);
    }
  };

  const handleLockAllContacts = async () => {
    // Select all contacts first
    const allContactIds = new Set(contacts.map(c => c.id));
    setSelectedContacts(allContactIds);
    
    // Use existing lock logic
    await handleLockContacts();
  };

  const handleUnlockContacts = () => {
    setContactsLocked(false);
    setShowGuideSection(false);
    localStorage.removeItem('wolf-den-locked-contacts');
    localStorage.removeItem('wolf-den-company-intelligence');
    localStorage.removeItem('wolf-den-intelligence-loading');
  };

  const handleProceedToGuide = () => {
    // In advanced mode, hide guide section to show intelligence gathering steps
    if (advancedMode) {
      setShowGuideSection(false);
    } else {
      // In simple mode, navigate directly to battle card
      // For import mode, set the first locked contact as the current prospect
      if (mode === 'imported-list' && contactsLocked) {
        const lockedContacts = localStorage.getItem('wolf-den-locked-contacts');
        if (lockedContacts) {
          try {
            const contacts = JSON.parse(lockedContacts);
            if (contacts.length > 0) {
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
          } catch (error) {
            console.error('Error parsing locked contacts:', error);
          }
        }
      }
      setCurrentModule('battle-card');
    }
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
      mode: mode === 'single-prospect' ? 'standalone' : mode === 'imported-list' ? 'imported' : 'crm-sync',
      contactIds: selectedContactList.slice(0, sprintSize).map(c => c.id)
    };

    setCurrentSequence(sequence);
  };

  const addStandaloneContact = () => {
    const newContact: Contact = {
      id: Date.now().toString(),
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      position: '',
      industry: '',
      source: 'manual',
      status: 'pending'
    };
    setContacts([...contacts, newContact]);
  };

  const updateContact = (id: string, updates: Partial<Contact>) => {
    if (!contactsLocked) {
      setContacts(contacts.map(c => c.id === id ? { ...c, ...updates } : c));
    }
  };

  const removeContact = (id: string) => {
    if (!contactsLocked) {
      setContacts(contacts.filter(c => c.id !== id));
      const newSelected = new Set(selectedContacts);
      newSelected.delete(id);
      setSelectedContacts(newSelected);
    }
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
              disabled={contactsLocked}
            />
            
            <Input
              label="Contact Name"
              value={formData.contactName}
              onChange={(value) => setFormData({ ...formData, contactName: value })}
              placeholder="e.g., John Smith"
              required
              error={errors.contactName}
              disabled={contactsLocked}
            />

            <Input
              label="Phone Number"
              value={formData.contactPhone}
              onChange={(value) => setFormData({ ...formData, contactPhone: value })}
              placeholder="e.g., (555) 123-4567"
              required
              error={errors.contactPhone}
              type="tel"
              disabled={contactsLocked}
            />

            <Input
              label="Position/Title"
              value={formData.contactPosition}
              onChange={(value) => setFormData({ ...formData, contactPosition: value })}
              placeholder="e.g., HR Director, CFO"
              error={errors.contactPosition}
              disabled={contactsLocked}
            />

            <Input
              label="Email Address"
              value={formData.contactEmail}
              onChange={(value) => setFormData({ ...formData, contactEmail: value })}
              placeholder="e.g., john.smith@company.com"
              error={errors.contactEmail}
              type="email"
              disabled={contactsLocked}
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
              disabled={contactsLocked}
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
              disabled={contactsLocked}
            />
          </div>
          
          <div className="mt-4 flex items-center gap-4">
            {!contactsLocked ? (
              <Button onClick={handleSubmitProspect} className="w-full md:w-auto">
                <Target className="w-4 h-4 mr-2" />
                Lock Prospect
              </Button>
            ) : (
              <>
                <div className="flex items-center text-sm text-purple-600 bg-purple-50 px-4 py-2 rounded-lg">
                  <Lock className="w-4 h-4 mr-2" />
                  <span className="font-medium">Prospect Locked</span>
                </div>
                <Button 
                  onClick={handleUnlockContacts}
                  variant="outline"
                  size="sm"
                  className="border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  <Unlock className="w-3 h-3 mr-1.5" />
                  Unlock
                </Button>
              </>
            )}
          </div>
        </CollapsibleSection>

        {/* Guide Section for Single Prospect Mode */}
        {contactsLocked && showGuideSection && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card 
              title="Call Preparation Guide" 
              subtitle="Your prospect is locked. Let's prepare for a successful call."
              className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200"
            >
              <div className="space-y-6">
                {/* Progress Indicator */}
                <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                      <span className="text-sm font-medium text-gray-900">Prospect Locked</span>
                    </div>
                    <div className="text-gray-400">→</div>
                    <div className="flex items-center">
                      <Brain className="w-6 h-6 text-purple-500 mr-2" />
                      <span className="text-sm font-medium text-gray-900">
                        {gatheringIntelligence ? 'Gathering Intelligence...' : 'Intelligence Ready'}
                      </span>
                    </div>
                    <div className="text-gray-400">→</div>
                    <div className="flex items-center">
                      <Target className="w-6 h-6 text-blue-500 mr-2" />
                      <span className="text-sm font-medium text-gray-900">Ready to Call</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="text-center pt-4">
                  <Button
                    onClick={handleProceedToGuide}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    disabled={gatheringIntelligence}
                  >
                    <ArrowRight className="w-5 h-5 mr-2" />
                    {advancedMode ? 'Continue to Intelligence Gathering' : 'Generate Call Guide'}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Persona Insights - Only in Advanced Mode */}
        {selectedPersona && advancedMode && !showGuideSection && (
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
        {selectedIndustry && advancedMode && !showGuideSection && (
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
        {prospect && advancedMode && !showGuideSection && (
          <Card 
            title="Step 4: Live Industry Intelligence"
            subtitle="2025 market data and thought leadership for your target industry"
          >
            <EnhancedLiveIntelligence industry={prospect.industry} />
          </Card>
        )}

        {/* Dynamic Intelligence - Only in Advanced Mode */}
        {prospect && advancedMode && !showGuideSection && (
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
        {prospect && advancedMode && !showGuideSection && (
          <Card 
            title="Step 6: Strategic Content Selection"
            subtitle="Choose your conversation weapons for this specific engagement"
          >
            <ContentLibrary />
          </Card>
        )}

        {/* Quick Summary for Simple Mode */}
        {prospect && !advancedMode && !showGuideSection && (
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
        {prospect && (advancedMode ? selectedContent.length > 0 : true) && !showGuideSection && (
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
        <div className="space-y-4 mb-6">
          {/* Import/Add Buttons */}
          <div className="flex gap-3 flex-wrap">
            {mode === 'imported-list' && !contactsLocked && (
              <Button onClick={() => setShowImporter(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Import CSV
              </Button>
            )}
            
            {mode === 'crm-sync' && !contactsLocked && (
              <Button>
                <Database className="w-4 h-4 mr-2" />
                Sync from Zoho CRM
              </Button>
            )}
            
            {!contactsLocked && (
              <Button variant="outline" onClick={addStandaloneContact}>
                <Plus className="w-4 h-4 mr-2" />
                Add Manual Contact
              </Button>
            )}
          </div>
          
          {/* Lock Buttons */}
          {contacts.length > 0 && (
            <div className="flex gap-3 flex-wrap">
              {!contactsLocked ? (
                <>
                  {/* Lock All Leads button for mass import modes */}
                  {(mode === 'imported-list' || mode === 'crm-sync') && (
                    <Button 
                      onClick={handleLockAllContacts}
                      className="bg-purple-600 hover:bg-purple-700 shadow-md"
                      disabled={gatheringIntelligence}
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      {gatheringIntelligence ? 'Gathering Intelligence...' : `Lock All ${contacts.length} Leads`}
                    </Button>
                  )}
                  
                  {/* Lock Selected button */}
                  <Button 
                    onClick={handleLockContacts}
                    className="bg-purple-600 hover:bg-purple-700 shadow-md"
                    disabled={gatheringIntelligence || selectedContacts.size === 0}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    {gatheringIntelligence ? 'Gathering Intelligence...' : `Lock ${selectedContacts.size} Selected`}
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={handleUnlockContacts}
                  variant="outline"
                  className="border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  <Unlock className="w-4 h-4 mr-2" />
                  Unlock Leads
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Contacts List */}
        {contacts.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  {contacts.length} contact{contacts.length !== 1 ? 's' : ''} • {selectedContacts.size} selected
                </div>
                <Select
                  value={sortBy}
                  onChange={(value) => setSortBy(value as 'score' | 'name' | 'company')}
                  options={[
                    { value: 'score', label: 'Sort by Score' },
                    { value: 'name', label: 'Sort by Name' },
                    { value: 'company', label: 'Sort by Company' }
                  ]}
                  className="w-40"
                />
              </div>
              {contactsLocked && (
                <div className="flex items-center text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                  <Lock className="w-3 h-3 mr-1.5" />
                  Leads Locked
                </div>
              )}
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {/* Sort contacts based on selected criteria */}
              {[...contacts]
                .sort((a, b) => {
                  switch (sortBy) {
                    case 'score':
                      return (b.score || 0) - (a.score || 0);
                    case 'name':
                      return a.contactName.localeCompare(b.contactName);
                    case 'company':
                      return a.companyName.localeCompare(b.companyName);
                    default:
                      return 0;
                  }
                })
                .map((contact) => {
                  const score = DealScoringService.calculateScore(contact, callLogs);
                  return (
                <div 
                  key={contact.id}
                  className={`p-4 border rounded-lg transition-all ${
                    selectedContacts.has(contact.id) 
                      ? 'border-primary-300 bg-primary-50 shadow-sm' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={selectedContacts.has(contact.id)}
                      onChange={() => handleContactSelect(contact.id)}
                      disabled={contactsLocked}
                      className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
                    />
                    
                    <div className="flex-1 space-y-3">
                      {/* Score Badge */}
                      <div className="flex justify-between items-start mb-2">
                        <DealScoreBadge score={score} size="sm" />
                      </div>
                      {/* Row 1: Company and Contact Name */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Company Name</label>
                          <input
                            type="text"
                            placeholder="Company name"
                            value={contact.companyName}
                            onChange={(e) => updateContact(contact.id, { companyName: e.target.value })}
                            disabled={contactsLocked}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Contact Name</label>
                          <input
                            type="text"
                            placeholder="Contact name"
                            value={contact.contactName}
                            onChange={(e) => updateContact(contact.id, { contactName: e.target.value })}
                            disabled={contactsLocked}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      {/* Row 2: Industry and Position */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Industry</label>
                          <input
                            type="text"
                            placeholder="Industry"
                            value={contact.industry || ''}
                            onChange={(e) => updateContact(contact.id, { industry: e.target.value })}
                            disabled={contactsLocked}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Position/Title</label>
                          <input
                            type="text"
                            placeholder="Position/Title"
                            value={contact.position || ''}
                            onChange={(e) => updateContact(contact.id, { position: e.target.value })}
                            disabled={contactsLocked}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      {/* Row 3: Phone and Email */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Phone Number</label>
                          <input
                            type="tel"
                            placeholder="Phone number"
                            value={contact.phone || ''}
                            onChange={(e) => updateContact(contact.id, { phone: e.target.value })}
                            disabled={contactsLocked}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Email Address</label>
                          <input
                            type="email"
                            placeholder="Email address"
                            value={contact.email || ''}
                            onChange={(e) => updateContact(contact.id, { email: e.target.value })}
                            disabled={contactsLocked}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      {/* Contact Status Badge */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            contact.status === 'success' ? 'bg-green-100 text-green-800' :
                            contact.status === 'called' ? 'bg-blue-100 text-blue-800' :
                            contact.status === 'failed' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {contact.status}
                          </span>
                          {contact.source && (
                            <span className="text-xs text-gray-500">
                              Source: {contact.source}
                            </span>
                          )}
                        </div>
                        
                        <button
                          onClick={() => removeContact(contact.id)}
                          disabled={contactsLocked}
                          className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed p-1 rounded-md hover:bg-red-50 transition-colors"
                          title="Remove contact"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                  );
                })}
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

      {/* Relationship Map - Show when we have multiple contacts from the same company */}
      {contactsLocked && (() => {
        // Group contacts by company
        const companyGroups = contacts.reduce((acc, contact) => {
          if (!acc[contact.companyName]) {
            acc[contact.companyName] = [];
          }
          acc[contact.companyName].push(contact);
          return acc;
        }, {} as Record<string, Contact[]>);

        // Find companies with multiple contacts
        const companiesWithMultipleContacts = Object.entries(companyGroups)
          .filter(([_, contacts]) => contacts.length > 1)
          .map(([companyName, contacts]) => ({ companyName, contacts }));

        return companiesWithMultipleContacts.length > 0 && (
          <div className="space-y-4">
            {companiesWithMultipleContacts.map(({ companyName, contacts: companyContacts }) => (
              <Card
                key={companyName}
                title={`${companyName} - Organizational Structure`}
                subtitle={`${companyContacts.length} contacts mapped`}
              >
                <RelationshipMap
                  contacts={companyContacts}
                  companyName={companyName}
                  onUpdateRelationships={(relationships: ContactRelationship[]) => {
                    // Update relationships in the contacts
                    const updatedContacts = contacts.map(contact => {
                      if (contact.companyName === companyName) {
                        const contactRelationships = relationships.filter(
                          r => r.fromContactId === contact.id
                        );
                        return {
                          ...contact,
                          relationships: contactRelationships
                        };
                      }
                      return contact;
                    });
                    setContacts(updatedContacts);
                    
                    // Also update in localStorage for persistence
                    localStorage.setItem('wolf-den-locked-contacts', JSON.stringify(updatedContacts));
                  }}
                  editable={true}
                />
              </Card>
            ))}
          </div>
        );
      })()}

      {/* Guide Section - Shows after locking contacts */}
      {contactsLocked && showGuideSection && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card 
            title="Call Preparation Guide" 
            subtitle="Your leads are locked. Let's prepare for successful calls."
            className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200"
          >
            <div className="space-y-6">
              {/* Progress Indicator */}
              <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                    <span className="text-sm font-medium text-gray-900">
                      {selectedContacts.size} Lead{selectedContacts.size !== 1 ? 's' : ''} Locked
                    </span>
                  </div>
                  <div className="text-gray-400">→</div>
                  <div className="flex items-center">
                    <Brain className="w-6 h-6 text-purple-500 mr-2" />
                    <span className="text-sm font-medium text-gray-900">
                      {gatheringIntelligence ? 'Gathering Intelligence...' : 'Intelligence Ready'}
                    </span>
                  </div>
                  <div className="text-gray-400">→</div>
                  <div className="flex items-center">
                    <Target className="w-6 h-6 text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-gray-900">Ready to Call</span>
                  </div>
                </div>
              </div>

              {/* Guide Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    What We're Preparing
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Persona-specific conversation starters
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Industry insights and talking points
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Objection handling strategies
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Real-time company intelligence
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-purple-600" />
                    Intelligence Status
                  </h3>
                  {gatheringIntelligence ? (
                    <div className="space-y-3">
                      <div className="animate-pulse">
                        <div className="h-2 bg-purple-200 rounded mb-2"></div>
                        <div className="h-2 bg-purple-200 rounded mb-2 w-4/5"></div>
                        <div className="h-2 bg-purple-200 rounded w-3/5"></div>
                      </div>
                      <p className="text-sm text-gray-600">
                        Gathering real-time intelligence for your locked leads...
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span className="font-medium">Intelligence gathered successfully</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Company insights, industry trends, and conversation hooks are ready for your calls.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4 pt-6">
                <Button
                  onClick={handleProceedToGuide}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
                  disabled={gatheringIntelligence}
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  {contacts.length === 1 ? 'Generate Call Guide' : 'View Call Guides'}
                </Button>
                
                {(
                  <Button
                    onClick={() => setShowGuideSection(false)}
                    variant="outline"
                    size="lg"
                  >
                    Continue to Sprint Planning
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Sprint Planning */}
      {contacts.length > 0 && selectedContacts.size > 0 && !showGuideSection && (
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
            <div className="space-y-3">
              {currentSequence.contacts.map((contact, index) => (
                <div key={contact.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      {/* Primary Info */}
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900 text-lg">{contact.companyName}</h4>
                          <p className="text-primary-600 font-medium">{contact.contactName}</p>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          contact.status === 'success' ? 'bg-green-100 text-green-800' :
                          contact.status === 'called' ? 'bg-blue-100 text-blue-800' :
                          contact.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {contact.status}
                        </div>
                      </div>
                      
                      {/* Contact Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                        {contact.industry && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">Industry:</span>
                            <span className="font-medium text-gray-900">{contact.industry}</span>
                          </div>
                        )}
                        
                        {contact.position && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">Position:</span>
                            <span className="font-medium text-gray-900">{contact.position}</span>
                          </div>
                        )}
                        
                        {contact.phone && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">Phone:</span>
                            <span className="font-medium text-gray-900">{contact.phone}</span>
                          </div>
                        )}
                        
                        {contact.email && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">Email:</span>
                            <span className="font-medium text-gray-900 truncate">{contact.email}</span>
                          </div>
                        )}
                        
                        {contact.address && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3 text-gray-500" />
                            <span className="text-gray-500">Address:</span>
                            <span className="font-medium text-gray-900 truncate">{contact.address}</span>
                          </div>
                        )}
                        
                        {contact.source && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">Source:</span>
                            <span className="font-medium text-gray-900">{contact.source}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Persona Badge */}
                      {contact.persona && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {contact.persona.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                      )}
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