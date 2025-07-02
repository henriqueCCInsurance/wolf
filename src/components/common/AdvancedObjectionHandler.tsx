import React, { useState, useMemo } from 'react';
import { Search, Shield, Star, Clock, Users, DollarSign, CheckCircle, Plus } from 'lucide-react';
import { ContentItem, PersonaType } from '@/types';
import { useAppStore } from '@/store';
import { contentLibrary } from '@/data/content';

interface AdvancedObjectionHandlerProps {
  persona: PersonaType;
}

type ObjectionCategory = 'price' | 'competition' | 'timing' | 'authority' | 'need' | 'trust' | 'all';

interface ObjectionFilter {
  category: ObjectionCategory;
  severity: 'low' | 'medium' | 'high' | 'all';
  searchTerm: string;
}

const AdvancedObjectionHandler: React.FC<AdvancedObjectionHandlerProps> = ({ persona }) => {
  const { selectedContent, addSelectedContent, removeSelectedContent } = useAppStore();
  const [filter, setFilter] = useState<ObjectionFilter>({
    category: 'all',
    severity: 'all',
    searchTerm: ''
  });
  const [customObjection, setCustomObjection] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);

  // Get all objection handlers for the persona
  const objectionHandlers = useMemo(() => {
    return contentLibrary.filter(item => 
      item.type === 'objection-handler' && 
      (item.persona === persona || item.persona === 'gatekeeper')
    );
  }, [persona]);

  // Categorize objections (this would normally come from the data)
  const categorizeObjection = (content: string): ObjectionCategory => {
    const lower = content.toLowerCase();
    if (lower.includes('price') || lower.includes('cost') || lower.includes('budget') || lower.includes('expensive')) return 'price';
    if (lower.includes('competitor') || lower.includes('current') || lower.includes('already have')) return 'competition';
    if (lower.includes('time') || lower.includes('busy') || lower.includes('later') || lower.includes('not now')) return 'timing';
    if (lower.includes('decision') || lower.includes('boss') || lower.includes('approval') || lower.includes('authority')) return 'authority';
    if (lower.includes('need') || lower.includes('happy') || lower.includes('satisfied') || lower.includes('working')) return 'need';
    if (lower.includes('trust') || lower.includes('unknown') || lower.includes('heard') || lower.includes('reputation')) return 'trust';
    return 'need';
  };

  // Assign severity based on content complexity
  const getSeverity = (content: string): 'low' | 'medium' | 'high' => {
    if (content.length > 200) return 'high';
    if (content.length > 100) return 'medium';
    return 'low';
  };

  // Filter objections based on current filter
  const filteredObjections = useMemo(() => {
    return objectionHandlers.filter(item => {
      const category = categorizeObjection(item.content);
      const severity = getSeverity(item.content);
      
      // Category filter
      if (filter.category !== 'all' && category !== filter.category) return false;
      
      // Severity filter
      if (filter.severity !== 'all' && severity !== filter.severity) return false;
      
      // Search filter
      if (filter.searchTerm && !item.content.toLowerCase().includes(filter.searchTerm.toLowerCase()) && 
          !item.context?.toLowerCase().includes(filter.searchTerm.toLowerCase())) return false;
      
      return true;
    });
  }, [objectionHandlers, filter]);

  const categories = [
    { id: 'all' as const, label: 'All Categories', icon: Shield, color: 'gray' },
    { id: 'price' as const, label: 'Price/Budget', icon: DollarSign, color: 'red' },
    { id: 'competition' as const, label: 'Competition', icon: Users, color: 'blue' },
    { id: 'timing' as const, label: 'Timing', icon: Clock, color: 'yellow' },
    { id: 'authority' as const, label: 'Authority', icon: Star, color: 'purple' },
    { id: 'need' as const, label: 'Need/Satisfaction', icon: CheckCircle, color: 'green' },
    { id: 'trust' as const, label: 'Trust/Credibility', icon: Shield, color: 'indigo' }
  ];

  const severityLevels = [
    { id: 'all' as const, label: 'All Levels' },
    { id: 'low' as const, label: 'Low Complexity' },
    { id: 'medium' as const, label: 'Medium Complexity' },
    { id: 'high' as const, label: 'High Complexity' }
  ];

  const isSelected = (item: ContentItem) => {
    return selectedContent.some(selected => selected.id === item.id);
  };

  const handleToggleContent = (item: ContentItem) => {
    if (isSelected(item)) {
      removeSelectedContent(item.id);
    } else {
      addSelectedContent(item);
    }
  };

  const handleCustomObjection = () => {
    if (!customObjection.trim()) return;
    
    // Create a custom objection handler (this would normally call an AI service)
    const customItem: ContentItem = {
      id: `custom-${Date.now()}`,
      type: 'objection-handler',
      persona: persona,
      content: `For the objection "${customObjection}", try this approach: "I understand your concern about [specific issue]. Many of our most successful clients initially had similar thoughts. What if I could show you specifically how we address [specific concern] in a way that actually [specific benefit]? Would that be worth a brief conversation?"`,
      context: `Custom response for: "${customObjection}"`
    };
    
    addSelectedContent(customItem);
    setCustomObjection('');
    setShowCustomForm(false);
  };

  const getCategoryColor = (categoryId: ObjectionCategory) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.color || 'gray';
  };

  const getCategoryColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      gray: 'bg-gray-100 text-gray-800 border-gray-300',
      red: 'bg-red-100 text-red-800 border-red-300',
      blue: 'bg-blue-100 text-blue-800 border-blue-300',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      purple: 'bg-purple-100 text-purple-800 border-purple-300',
      green: 'bg-green-100 text-green-800 border-green-300',
      indigo: 'bg-indigo-100 text-indigo-800 border-indigo-300'
    };
    return colorMap[color] || colorMap.gray;
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search objections or responses..."
            value={filter.searchTerm}
            onChange={(e) => setFilter({ ...filter, searchTerm: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Objection Category</label>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = filter.category === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setFilter({ ...filter, category: category.id })}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                    isActive 
                      ? getCategoryColorClasses(category.color)
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Severity Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Complexity Level</label>
          <div className="flex space-x-2">
            {severityLevels.map((level) => (
              <button
                key={level.id}
                onClick={() => setFilter({ ...filter, severity: level.id })}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter.severity === level.id
                    ? 'bg-primary-300 text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Objection Handlers ({filteredObjections.length} found)
        </h3>
        <button
          onClick={() => setShowCustomForm(!showCustomForm)}
          className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Objection</span>
        </button>
      </div>

      {/* Custom Objection Form */}
      {showCustomForm && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <h4 className="font-medium text-primary-900 mb-2">Create Custom Objection Handler</h4>
          <div className="space-y-3">
            <textarea
              value={customObjection}
              onChange={(e) => setCustomObjection(e.target.value)}
              placeholder="Enter the specific objection you need help with..."
              className="w-full p-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              rows={3}
            />
            <div className="flex space-x-3">
              <button
                onClick={handleCustomObjection}
                disabled={!customObjection.trim()}
                className="bg-primary-300 hover:bg-primary-400 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate Response
              </button>
              <button
                onClick={() => setShowCustomForm(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Objection Handlers List */}
      <div className="space-y-3">
        {filteredObjections.map((item) => {
          const category = categorizeObjection(item.content);
          const severity = getSeverity(item.content);
          const selected = isSelected(item);
          
          return (
            <div
              key={item.id}
              className={`border rounded-lg p-4 transition-all ${
                selected ? 'border-primary-300 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColorClasses(getCategoryColor(category))}`}>
                    {categories.find(c => c.id === category)?.label}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    severity === 'high' ? 'bg-red-100 text-red-800' :
                    severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {severity} complexity
                  </span>
                </div>
                <button
                  onClick={() => handleToggleContent(item)}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selected 
                      ? 'bg-primary-300 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {selected ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Selected</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </>
                  )}
                </button>
              </div>
              
              <p className="text-gray-900 font-medium mb-2">{item.content}</p>
              
              {item.context && (
                <p className="text-sm text-gray-600 italic">{item.context}</p>
              )}
            </div>
          );
        })}
        
        {filteredObjections.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No objection handlers found matching your criteria.</p>
            <p className="text-sm">Try adjusting your filters or create a custom objection handler.</p>
          </div>
        )}
      </div>

      {/* Selected Summary */}
      {selectedContent.filter(item => item.type === 'objection-handler').length > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <h4 className="font-semibold text-primary-900 mb-2">
            Selected Objection Handlers ({selectedContent.filter(item => item.type === 'objection-handler').length})
          </h4>
          <div className="space-y-2">
            {selectedContent
              .filter(item => item.type === 'objection-handler')
              .map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm bg-white rounded-lg p-2 border border-primary-200">
                  <span className="text-primary-800">
                    {item.content.substring(0, 60)}...
                  </span>
                  <button
                    onClick={() => removeSelectedContent(item.id)}
                    className="text-primary-600 hover:text-primary-800 ml-2"
                  >
                    Remove
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedObjectionHandler;