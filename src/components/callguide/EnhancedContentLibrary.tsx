import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Target, 
  Shield, 
  Brain, 
  TrendingUp,
  MousePointer,
  Flag,
  Search,
  Filter,
  BarChart3,
  Factory,
  Swords,
  DollarSign
} from 'lucide-react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { useAppStore } from '@/store';
import { getContentByCategory, getCategoryCounts, EnhancedContentItem } from '@/data/enhancedContent';
import { ContentItem } from '@/types';

const EnhancedContentLibrary: React.FC = () => {
  const { prospect, selectedContent, addSelectedContent, removeSelectedContent } = useAppStore();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['opener']));
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'success-rate' | 'title'>('default');

  const categories = [
    { id: 'opener', label: 'Conversation Openers', icon: Target, color: 'blue' },
    { id: 'objection-handler', label: 'Objection Handling', icon: Shield, color: 'red' },
    { id: 'thought-leadership', label: 'Thought Leadership', icon: Brain, color: 'purple' },
    { id: 'selling-point', label: 'Key Selling Points', icon: TrendingUp, color: 'green' },
    { id: 'cta', label: 'Call to Actions', icon: MousePointer, color: 'orange' },
    { id: 'closing', label: 'Closing Techniques', icon: Flag, color: 'indigo' },
    { id: 'industry-insight', label: 'Industry Intelligence', icon: Factory, color: 'teal' },
    { id: 'competitive-positioning', label: 'Competitive Intel', icon: Swords, color: 'rose' },
    { id: 'economic-context', label: 'Economic Context', icon: DollarSign, color: 'amber' }
  ];

  if (!prospect) {
    return (
      <Card title="Enhanced Content Library" className="mb-6">
        <div className="text-center py-12">
          <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete Lead Acquisition First</h3>
          <p className="text-gray-500">
            Access personalized conversation strategies tailored to your prospect's persona
          </p>
        </div>
      </Card>
    );
  }

  const categoryCounts = getCategoryCounts(prospect.persona);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const isEnhancedSelected = (item: EnhancedContentItem) => {
    return selectedContent.some(selected => selected.id === item.id);
  };

  const handleToggleEnhancedContent = (item: EnhancedContentItem) => {
    // Convert enhanced content to standard content format
    const contentItem: ContentItem = {
      id: item.id,
      type: item.category === 'opener' ? 'opener' : 
            item.category === 'thought-leadership' ? 'thought-leadership' : 'objection-handler',
      persona: item.persona === 'universal' ? prospect.persona : item.persona as any,
      content: item.content,
      context: item.context
    };

    if (isEnhancedSelected(item)) {
      removeSelectedContent(item.id);
    } else {
      addSelectedContent(contentItem);
    }
  };

  const getFilteredContent = (categoryId: string) => {
    let content = getContentByCategory(categoryId as EnhancedContentItem['category'], prospect.persona);
    
    // Apply search filter
    if (searchTerm) {
      content = content.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.context && item.context.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'success-rate':
        content = content.sort((a, b) => (b.successRate || 0) - (a.successRate || 0));
        break;
      case 'title':
        content = content.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // Keep default order
        break;
    }

    return content;
  };

  const totalSelected = selectedContent.length;
  const totalAvailable = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0);

  return (
    <Card 
      title="Enhanced Content Library" 
      subtitle={`${totalSelected} of ${totalAvailable} items selected for ${prospect.companyName}`}
      className="mb-6"
    >
      {/* Search and Filter Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
            >
              <option value="default">Default Order</option>
              <option value="success-rate">Success Rate</option>
              <option value="title">Alphabetical</option>
            </select>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                if (expandedCategories.size === categories.length) {
                  setExpandedCategories(new Set());
                } else {
                  setExpandedCategories(new Set(categories.map(c => c.id)));
                }
              }}
            >
              {expandedCategories.size === categories.length ? 'Collapse All' : 'Expand All'}
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {categories.map((category) => (
            <div key={category.id} className="text-center p-2 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-900">{categoryCounts[category.id as keyof typeof categoryCounts]}</div>
              <div className="text-xs text-gray-600 truncate">{category.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Categories */}
      <div className="space-y-4">
        {categories.map((category) => {
          const Icon = category.icon;
          const isExpanded = expandedCategories.has(category.id);
          const categoryContent = getFilteredContent(category.id);
          const selectedInCategory = categoryContent.filter(item => isEnhancedSelected(item)).length;

          return (
            <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 text-${category.color}-600`} />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">{category.label}</h3>
                    <p className="text-sm text-gray-600">
                      {categoryContent.length} available • {selectedInCategory} selected
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {selectedInCategory > 0 && (
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full">
                      {selectedInCategory}
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Category Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-white border-t border-gray-100">
                      {categoryContent.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Filter className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          <p>No content found matching your search</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {categoryContent.map((item) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`border rounded-lg p-4 transition-all cursor-pointer ${
                                isEnhancedSelected(item)
                                  ? 'border-primary-300 bg-primary-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => handleToggleEnhancedContent(item)}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center ${
                                  isEnhancedSelected(item)
                                    ? 'border-primary-500 bg-primary-500'
                                    : 'border-gray-300'
                                }`}>
                                  {isEnhancedSelected(item) && (
                                    <Check className="w-3 h-3 text-white" />
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                                    {item.successRate && (
                                      <div className="flex items-center gap-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                        <BarChart3 className="w-3 h-3" />
                                        {item.successRate}%
                                      </div>
                                    )}
                                  </div>
                                  
                                  <p className="text-sm text-gray-700 mb-2">{item.content}</p>
                                  
                                  {item.context && (
                                    <p className="text-xs text-gray-600 italic mb-2">
                                      Context: {item.context}
                                    </p>
                                  )}

                                  {item.tips && item.tips.length > 0 && (
                                    <div className="mt-2">
                                      <div className="text-xs font-medium text-gray-700 mb-1">💡 Tips:</div>
                                      <ul className="text-xs text-gray-600 space-y-1">
                                        {item.tips.map((tip, index) => (
                                          <li key={index} className="flex items-start gap-1">
                                            <span className="text-primary-500 mt-0.5">•</span>
                                            <span>{tip}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Selected Content Summary */}
      {totalSelected > 0 && (
        <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="bg-primary-500 text-white rounded-full p-2">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-medium text-primary-900">
                {totalSelected} Item{totalSelected !== 1 ? 's' : ''} Selected
              </h4>
              <p className="text-sm text-primary-800">
                Your selected content will appear in the battle card and be available during live calls
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default EnhancedContentLibrary;