import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Upload, 
  Database, 
  Users, 
  Phone,
  MapPin,
  Printer,
  Download,
  X,
  Clock,
  CheckCircle,
  PhoneCall
} from 'lucide-react';
import { CallSequence, Contact } from '@/types';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import ContactImporter from './ContactImporter';
import ClickablePhone from '@/components/common/ClickablePhone';
import { useAppStore } from '@/store';

type PlanningMode = 'standalone' | 'imported' | 'crm-sync';

const CallSequencePlanner: React.FC = () => {
  const { 
    callSequences, 
    activeSequenceId, 
    addCallSequence, 
    setActiveSequence,
    callLogs 
  } = useAppStore();
  
  const [mode, setMode] = useState<PlanningMode>('standalone');
  const [currentSequence, setCurrentSequence] = useState<CallSequence | null>(null);
  const [showImporter, setShowImporter] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  
  // Load active sequence on mount
  useEffect(() => {
    if (activeSequenceId) {
      const sequence = callSequences.find(s => s.id === activeSequenceId);
      if (sequence) {
        setCurrentSequence(sequence);
        setContacts(sequence.contacts);
      }
    }
  }, [activeSequenceId, callSequences]);

  const sprintSizes = [2, 3, 5, 8, 10, 15, 20];

  const handleModeChange = (newMode: PlanningMode) => {
    setMode(newMode);
    setContacts([]);
    setSelectedContacts(new Set());
    setCurrentSequence(null);
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
      createdBy: 'current-user', // Would be actual user ID
      createdAt: new Date(),
      status: 'active',
      sprintSize,
      mode
    };

    setCurrentSequence(sequence);
    addCallSequence(sequence);
    setActiveSequence(sequence.id);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Call Planner</h1>
          <p className="text-gray-600 mt-1">
            Plan your call sequences with strategic sprint-based approach
          </p>
        </div>
      </div>

      {/* Planning Mode Selection */}
      <Card title="Planning Mode" subtitle="Choose your call sequence approach">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleModeChange('standalone')}
            className={`p-6 border-2 rounded-lg text-left transition-all ${
              mode === 'standalone' 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Phone className="w-8 h-8 text-primary-600 mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Standalone Calls</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Manual entry for business cards and individual contacts
            </p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleModeChange('imported')}
            className={`p-6 border-2 rounded-lg text-left transition-all ${
              mode === 'imported' 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Upload className="w-8 h-8 text-primary-600 mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Import Contact List</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              CSV import from Apollo, ZoomInfo, or other platforms
            </p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleModeChange('crm-sync')}
            className={`p-6 border-2 rounded-lg text-left transition-all ${
              mode === 'crm-sync' 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Database className="w-8 h-8 text-primary-600 mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">CRM Sync</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Import leads directly from Zoho CRM
            </p>
          </motion.button>
        </div>
      </Card>

      {/* Contact Management */}
      <Card 
        title="Contact Management" 
        subtitle={`Managing contacts for ${mode === 'imported' ? 'import' : mode.replace('-', ' ')} mode`}
      >
        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          {mode === 'standalone' && (
            <Button onClick={addStandaloneContact}>
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          )}
          
          {mode === 'imported' && (
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
        </div>

        {/* Contacts List */}
        {contacts.length > 0 ? (
          <div className="space-y-3">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {contacts.length} contact{contacts.length !== 1 ? 's' : ''} • {selectedContacts.size} selected
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
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
                  
                  {mode === 'standalone' ? (
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
                  ) : (
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">{contact.companyName}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {contact.contactName} • {contact.industry}
                        {contact.email && ` • ${contact.email}`}
                        {contact.phone && (
                          <>
                            {' • '}
                            <ClickablePhone
                              phoneNumber={contact.phone}
                              contactName={contact.contactName}
                              companyName={contact.companyName}
                              size="sm"
                              showIcon={false}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  )}
                  
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
          <div className="text-center py-12 text-gray-500 dark:text-gray-300">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p>No contacts added yet</p>
            <p className="text-sm">
              {mode === 'standalone' && 'Add contacts manually or switch to import mode'}
              {mode === 'imported' && 'Import a CSV file to get started'}
              {mode === 'crm-sync' && 'Sync with your CRM to load contacts'}
            </p>
          </div>
        )}
      </Card>

      {/* Sprint Planning */}
      {contacts.length > 0 && selectedContacts.size > 0 && (
        <Card title="Sprint Planning" subtitle="Create focused call sequences">
          <div className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-300">
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
                  {size} Calls
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
                <h3 className="font-semibold text-gray-900 dark:text-white">{currentSequence.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Created: {new Date(currentSequence.createdAt).toLocaleDateString()} • 
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
            
            {/* Progress Indicator */}
            {(() => {
              const completedContacts = currentSequence.contacts.filter(contact => {
                const contactLogs = callLogs.filter(log => log.contactId === contact.id);
                return contactLogs.some(log => 
                  log.outcome === 'meeting-booked' || 
                  log.outcome === 'disqualified'
                );
              }).length;
              const progress = (completedContacts / currentSequence.contacts.length) * 100;
              
              return (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Sequence Progress</span>
                    <span className="text-sm text-gray-600">
                      {completedContacts} of {currentSequence.contacts.length} completed
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  {progress === 100 && (
                    <div className="mt-2 flex items-center text-green-600 text-sm">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Sequence completed!
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Contact List */}
            <div className="space-y-2">
              {currentSequence.contacts.map((contact, index) => {
                const contactCallLogs = callLogs.filter(log => log.contactId === contact.id);
                const hasBeenCalled = contactCallLogs.length > 0;
                const latestCall = contactCallLogs[contactCallLogs.length - 1];
                
                return (
                  <div key={contact.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">{contact.companyName}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {contact.contactName} • {contact.industry}
                          {contact.phone && (
                            <>
                              {' • '}
                              <ClickablePhone
                                phoneNumber={contact.phone}
                                contactName={contact.contactName}
                                companyName={contact.companyName}
                                size="sm"
                                showIcon={false}
                              />
                            </>
                          )}
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
                          latestCall?.outcome === 'meeting-booked' ? 'bg-green-100 text-green-800' :
                          latestCall?.outcome === 'follow-up' ? 'bg-blue-100 text-blue-800' :
                          latestCall?.outcome === 'nurture' ? 'bg-yellow-100 text-yellow-800' :
                          latestCall?.outcome === 'disqualified' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {latestCall?.outcome || contact.status}
                        </div>
                      </div>
                    </div>
                    
                    {/* Call History */}
                    {hasBeenCalled && (
                      <div className="mt-3 pl-12">
                        <div className="text-xs text-gray-500 mb-2">
                          Call History ({contactCallLogs.length} attempt{contactCallLogs.length !== 1 ? 's' : ''})
                        </div>
                        <div className="space-y-1">
                          {contactCallLogs.slice(-3).map((log, idx) => (
                            <div key={log.id} className="flex items-center gap-2 text-xs">
                              <PhoneCall className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-600">
                                Attempt {log.attemptNumber || idx + 1}:
                              </span>
                              <span className={`font-medium ${
                                log.outcome === 'meeting-booked' ? 'text-green-600' :
                                log.outcome === 'follow-up' ? 'text-blue-600' :
                                log.outcome === 'nurture' ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>
                                {log.outcome}
                              </span>
                              {log.callDuration && (
                                <span className="text-gray-500">
                                  • {log.callDuration} min
                                </span>
                              )}
                              <span className="text-gray-500">
                                • {new Date(log.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
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

export default CallSequencePlanner;