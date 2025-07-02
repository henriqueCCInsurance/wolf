import React, { useState } from 'react';
import { Target, Phone, ArrowRight, Building, User, Briefcase, Users, Search, Database } from 'lucide-react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import { useAppStore } from '@/store';
import { personas } from '@/data/personas';
import { industries } from '@/data/industries';
import { PersonaType } from '@/types';
import { zohoCRMService } from '@/services/zohoCRM';

const SimplifiedHuntPlanner: React.FC = () => {
  const { 
    prospect, 
    setProspect, 
    setCurrentModule 
  } = useAppStore();

  const [formData, setFormData] = useState({
    companyName: prospect?.companyName || '',
    contactName: prospect?.contactName || '',
    contactPhone: prospect?.contactPhone || '',
    industry: prospect?.industry || '',
    persona: prospect?.persona || '' as PersonaType
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showCRMSearch, setShowCRMSearch] = useState(false);
  const [crmSearchTerm, setCrmSearchTerm] = useState('');
  const [crmContacts, setCrmContacts] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.companyName || !formData.contactName || !formData.contactPhone || !formData.industry || !formData.persona) {
      return;
    }

    setIsLoading(true);
    
    // Set prospect data
    setProspect({
      companyName: formData.companyName,
      contactName: formData.contactName,
      contactPhone: formData.contactPhone,
      industry: formData.industry,
      persona: formData.persona
    });

    // Automatically move to call preparation
    setTimeout(() => {
      setIsLoading(false);
      setCurrentModule('battle-card');
    }, 1000);
  };

  const handleCRMSearch = async () => {
    if (!crmSearchTerm.trim()) return;
    
    setIsSearching(true);
    try {
      const contacts = await zohoCRMService.searchContacts(crmSearchTerm);
      setCrmContacts(contacts);
    } catch (error) {
      console.error('Error searching CRM:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectCRMContact = (contact: any) => {
    setFormData({
      companyName: contact.Account_Name || '',
      contactName: `${contact.First_Name} ${contact.Last_Name}`.trim(),
      contactPhone: contact.Phone || '',
      industry: contact.Industry || '',
      persona: '' as PersonaType // User will need to select this
    });
    setShowCRMSearch(false);
    setCrmContacts([]);
    setCrmSearchTerm('');
  };

  const selectedPersona = personas.find(p => p.id === formData.persona);
  const selectedIndustry = industries.find(i => i.id === formData.industry);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ready to Make This Call?</h1>
        <p className="text-lg text-gray-600">
          Let's get you prepped with the right strategy in under 2 minutes
        </p>
      </div>

      {/* CRM Import Option */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-blue-900">Import from CRM</h3>
            <p className="text-sm text-blue-700">Search your Zoho CRM contacts</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowCRMSearch(!showCRMSearch)}
            className="border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            <Database className="w-4 h-4 mr-2" />
            {showCRMSearch ? 'Cancel' : 'Import'}
          </Button>
        </div>

        {showCRMSearch && (
          <div className="mt-4 space-y-3">
            <div className="flex space-x-2">
              <Input
                value={crmSearchTerm}
                onChange={setCrmSearchTerm}
                placeholder="Search by name or company..."
                className="flex-1"
              />
              <Button
                onClick={handleCRMSearch}
                disabled={!crmSearchTerm.trim()}
                loading={isSearching}
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>

            {crmContacts.length > 0 && (
              <div className="max-h-48 overflow-y-auto space-y-2">
                {crmContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => handleSelectCRMContact(contact)}
                    className="w-full text-left p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <div className="font-medium text-blue-900">
                      {contact.First_Name} {contact.Last_Name}
                    </div>
                    <div className="text-sm text-blue-700">
                      {contact.Account_Name} • {contact.Phone}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company & Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-700">
                <Building className="w-4 h-4" />
                <label className="font-medium">Company Name</label>
              </div>
              <Input
                value={formData.companyName}
                onChange={(value) => setFormData({ ...formData, companyName: value })}
                placeholder="ABC Manufacturing"
                className="text-lg p-4"
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-700">
                <User className="w-4 h-4" />
                <label className="font-medium">Contact Name</label>
              </div>
              <Input
                value={formData.contactName}
                onChange={(value) => setFormData({ ...formData, contactName: value })}
                placeholder="John Smith"
                className="text-lg p-4"
                required
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gray-700">
              <Phone className="w-4 h-4" />
              <label className="font-medium">Phone Number</label>
            </div>
            <Input
              value={formData.contactPhone}
              onChange={(value) => setFormData({ ...formData, contactPhone: value })}
              placeholder="+1 (555) 123-4567"
              className="text-lg p-4"
              required
            />
            <p className="text-sm text-gray-500">
              We'll use this to call them directly through Zoom Phone
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Industry */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-700">
                <Briefcase className="w-4 h-4" />
                <label className="font-medium">What industry are they in?</label>
              </div>
              <Select
                value={formData.industry}
                onChange={(value) => setFormData({ ...formData, industry: value })}
                options={industries.map(industry => ({
                  value: industry.id,
                  label: industry.name
                }))}
                placeholder="Select their industry..."
                className="text-lg p-4"
                required
              />
            </div>

            {/* Persona */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-700">
                <Users className="w-4 h-4" />
                <label className="font-medium">Who are you calling?</label>
              </div>
              <Select
                value={formData.persona}
                onChange={(value) => setFormData({ ...formData, persona: value as PersonaType })}
                options={personas.map(persona => ({
                  value: persona.id,
                  label: persona.title
                }))}
                placeholder="Select their role..."
                className="text-lg p-4"
                required
              />
            </div>
          </div>

          {/* Quick Preview */}
          {selectedPersona && selectedIndustry && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <h3 className="font-semibold text-primary-900 mb-2">Quick Strategy Preview</h3>
              <p className="text-sm text-primary-800 mb-2">
                <strong>{selectedPersona.title}</strong> in <strong>{selectedIndustry.name}</strong>
              </p>
              <p className="text-sm text-primary-700">
                {selectedPersona.description}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full text-lg py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
            disabled={!formData.companyName || !formData.contactName || !formData.contactPhone || !formData.industry || !formData.persona}
            loading={isLoading}
          >
            {isLoading ? (
              "Preparing Your Call Strategy..."
            ) : (
              <>
                <Phone className="w-5 h-5 mr-2" />
                Get My Call Strategy
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Quick Tips */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Don't have all the details? No problem! You can always update them later.
        </p>
      </div>
    </div>
  );
};

export default SimplifiedHuntPlanner;