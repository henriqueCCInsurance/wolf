import React, { useState } from 'react';
import { Search, Target, Brain, FileText } from 'lucide-react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import ScriptLibrary from '@/components/callguide/ScriptLibrary';
import EnhancedLiveIntelligence from '@/components/intelligence/EnhancedLiveIntelligence';
import CollapsibleSection from '@/components/common/CollapsibleSection';
import { useAppStore } from '@/store';
import { personas } from '@/data/personas';
import { industries } from '@/data/industries';
import { PersonaType } from '@/types';
import { EnhancedWebSearchService } from '@/services/enhancedWebSearch';
import { CompanyIntelligenceService } from '@/services/companyIntelligence';
import { sanitizeFormData } from '@/utils/sanitization';

const HuntPlanner: React.FC = () => {
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

  const [formData, setFormData] = useState({
    companyName: prospect?.companyName || '',
    contactName: prospect?.contactName || '',
    industry: prospect?.industry || '',
    persona: prospect?.persona || '' as PersonaType
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      // Sanitize form data before submission
      const sanitizedData = sanitizeFormData(formData, {
        companyName: 'name',
        contactName: 'name',
        industry: 'text',
        persona: 'text'
      });
      
      const newProspect = {
        companyName: sanitizedData.companyName,
        contactName: sanitizedData.contactName,
        industry: sanitizedData.industry,
        persona: sanitizedData.persona
      };
      
      setProspect(newProspect);
      
      // Automatically trigger company intelligence gathering when lead is locked
      setIsGeneratingIntelligence(true);
      try {
        const companyIntelligence = await CompanyIntelligenceService.getCompanyIntelligence(newProspect);
        
        // Combine industry intelligence with company-specific intelligence
        const combinedIntelligence = [
          ...companyIntelligence.newsAndUpdates,
          ...companyIntelligence.industryTrends,
          ...companyIntelligence.companyContext
        ];
        
        setDynamicIntelligence(combinedIntelligence);
        
        // Store the full intelligence data in localStorage for later use
        localStorage.setItem('currentCompanyIntelligence', JSON.stringify(companyIntelligence));
        
        console.log('✅ Company intelligence gathered successfully');
        console.log('Company:', companyIntelligence.companyName);
        console.log('Key insights:', companyIntelligence.keyInsights);
        console.log('Talking points:', companyIntelligence.talkingPoints);
      } catch (error) {
        console.error('Failed to gather company intelligence:', error);
        // Fallback to basic industry intelligence
        try {
          const searchResults = await EnhancedWebSearchService.searchIndustryIntelligence(newProspect.industry);
          setDynamicIntelligence(searchResults);
        } catch (fallbackError) {
          console.error('Fallback intelligence also failed:', fallbackError);
        }
      } finally {
        setIsGeneratingIntelligence(false);
      }
    }
  };

  const handleGenerateIntelligence = async () => {
    if (!prospect) return;
    
    setIsGeneratingIntelligence(true);
    try {
      const searchResults = await EnhancedWebSearchService.searchIndustryIntelligence(prospect.industry);
      
      setDynamicIntelligence(searchResults);
      
      // Store talking points in a way that can be used for battle card
      // For now, we'll just display them in the UI
    } catch (error) {
      console.error('Failed to generate intelligence:', error);
    } finally {
      setIsGeneratingIntelligence(false);
    }
  };

  const handleGenerateCallGuide = () => {
    if (prospect && selectedContent.length > 0) {
      setCurrentModule('battle-card');
    }
  };

  const selectedPersona = personas.find(p => p.id === formData.persona);
  const selectedIndustry = industries.find(i => i.id === formData.industry);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">The Hunt Planner</h1>
        <p className="text-lg text-gray-600">
          Build the perfect call strategy with tactical intelligence
        </p>
      </div>

      {/* Step 1: Lead Acquisition */}
      <CollapsibleSection
        title="Step 1: Lead Acquisition"
        subtitle="Identify your prospect and their context"
        defaultExpanded={true}
        priority="high"
        badge={prospect ? "Completed" : "Required"}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <Button onClick={handleSubmit} className="w-full md:w-auto">
            <Target className="w-4 h-4 mr-2" />
            Lock Lead
          </Button>
        </div>
      </CollapsibleSection>

      {/* Persona Insights */}
      {selectedPersona && (
        <CollapsibleSection
          title={`Step 2: Persona Intelligence - ${selectedPersona.title}`}
          subtitle={selectedPersona.description}
          defaultExpanded={!advancedMode}
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

      {/* Industry Intelligence */}
      {selectedIndustry && (
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

      {/* Live Industry Intelligence */}
      {prospect && (
        <Card 
          title="Step 3: Live Industry Intelligence"
          subtitle="2025 market data and thought leadership for your target industry"
        >
          <EnhancedLiveIntelligence industry={prospect.industry} />
        </Card>
      )}

      {/* Dynamic Intelligence */}
      {prospect && (
        <Card 
          title="Step 4: Dynamic Intelligence Briefing"
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

      {/* Content Library */}
      {prospect && (
        <Card 
          title="Step 5: Script Library"
          subtitle="Choose your conversation weapons for this specific engagement"
        >
          <ScriptLibrary />
        </Card>
      )}

      {/* Generate Guide */}
      {prospect && selectedContent.length > 0 && (
        <div className="text-center">
          <Button 
            onClick={handleGenerateCallGuide}
            size="lg"
            className="text-lg px-8 py-3"
          >
            <FileText className="w-5 h-5 mr-2" />
            Generate Guide
          </Button>
        </div>
      )}
    </div>
  );
};

export default HuntPlanner;