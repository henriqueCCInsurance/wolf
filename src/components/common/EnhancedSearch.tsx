import React, { useState, useMemo } from 'react';
import { Search, Filter, X, Calendar, Target, Building, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// import Input from './Input'; // Not used currently
import Select from './Select';
import { CallLog, BattleCard } from '@/types';
import { isAfter, isBefore, parseISO } from 'date-fns';

interface SearchFilters {
  searchTerm: string;
  outcome?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  industry?: string;
  persona?: string;
}

interface EnhancedSearchProps {
  data: (CallLog | BattleCard)[];
  onFilteredData: (filtered: (CallLog | BattleCard)[]) => void;
  type: 'calls' | 'battlecards';
  className?: string;
}

const EnhancedSearch: React.FC<EnhancedSearchProps> = ({
  data,
  onFilteredData,
  type,
  className = ''
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    outcome: '',
    dateRange: undefined,
    industry: '',
    persona: ''
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Filter options based on data type
  const outcomeOptions = type === 'calls' ? [
    { value: '', label: 'All Outcomes' },
    { value: 'meeting-booked', label: 'Meeting Booked' },
    { value: 'follow-up', label: 'Follow-up' },
    { value: 'nurture', label: 'Nurture' },
    { value: 'disqualified', label: 'Disqualified' }
  ] : [];

  const personaOptions = [
    { value: '', label: 'All Personas' },
    { value: 'cost-conscious-employer', label: 'Cost-Conscious Employer' },
    { value: 'benefits-optimizer', label: 'Benefits Optimizer' },
    { value: 'roi-focused-executive', label: 'ROI-Focused Executive' },
    { value: 'gatekeeper', label: 'Gatekeeper' }
  ];

  // Extract unique industries from data
  const industryOptions = useMemo(() => {
    const industries = new Set<string>();
    industries.add(''); // Add empty option
    
    data.forEach(item => {
      if ('leadId' in item) {
        // For call logs, we'd need to extract industry from lead data
        // For now, we'll use placeholder industries
        industries.add('technology');
        industries.add('manufacturing');
        industries.add('healthcare');
        industries.add('financial');
      } else if ('lead' in item) {
        // For battle cards
        if (item.lead?.industry) {
          industries.add(item.lead.industry);
        }
      }
    });

    return Array.from(industries).map(industry => ({
      value: industry,
      label: industry ? industry.charAt(0).toUpperCase() + industry.slice(1) : 'All Industries'
    }));
  }, [data]);

  // Filter the data based on current filters
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(item => {
        if ('leadId' in item) {
          // Call log search
          const callLog = item as CallLog;
          return (
            callLog.leadId.toLowerCase().includes(searchLower) ||
            callLog.intel.toLowerCase().includes(searchLower) ||
            callLog.bestTalkingPoint.toLowerCase().includes(searchLower) ||
            callLog.keyTakeaway.toLowerCase().includes(searchLower) ||
            (callLog.additionalInfo?.companyInsights?.toLowerCase().includes(searchLower)) ||
            (callLog.additionalInfo?.nextSteps?.toLowerCase().includes(searchLower))
          );
        } else {
          // Battle card search
          const battleCard = item as BattleCard;
          return (
            battleCard.lead.companyName.toLowerCase().includes(searchLower) ||
            battleCard.lead.contactName.toLowerCase().includes(searchLower) ||
            battleCard.selectedContent.some(content => 
              content.content.toLowerCase().includes(searchLower)
            ) ||
            battleCard.dynamicIntelligence.some(intel => 
              intel.toLowerCase().includes(searchLower)
            )
          );
        }
      });
    }

    // Outcome filter (for call logs)
    if (filters.outcome && type === 'calls') {
      filtered = filtered.filter(item => {
        return 'outcome' in item && item.outcome === filters.outcome;
      });
    }

    // Persona filter
    if (filters.persona) {
      filtered = filtered.filter(item => {
        if ('leadId' in item) {
          // For call logs, we'd need persona data from the lead
          return true; // Placeholder
        } else {
          const battleCard = item as BattleCard;
          return battleCard.lead.persona === filters.persona;
        }
      });
    }

    // Industry filter
    if (filters.industry) {
      filtered = filtered.filter(item => {
        if ('leadId' in item) {
          // For call logs, we'd need industry data from the lead
          return true; // Placeholder
        } else {
          const battleCard = item as BattleCard;
          return battleCard.lead.industry === filters.industry;
        }
      });
    }

    // Date range filter
    if (filters.dateRange?.start && filters.dateRange?.end) {
      const startDate = parseISO(filters.dateRange.start);
      const endDate = parseISO(filters.dateRange.end);
      
      filtered = filtered.filter(item => {
        const itemDate = 'createdAt' in item 
          ? new Date(item.createdAt)
          : new Date((item as BattleCard).generatedAt);
        
        return isAfter(itemDate, startDate) && isBefore(itemDate, endDate);
      });
    }

    return filtered;
  }, [data, filters, type]);

  // Update parent component with filtered data
  React.useEffect(() => {
    onFilteredData(filteredData);
  }, [filteredData, onFilteredData]);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      outcome: '',
      dateRange: undefined,
      industry: '',
      persona: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => {
    if (typeof value === 'string') return value !== '';
    if (typeof value === 'object' && value !== null) return true;
    return false;
  });

  const activeFilterCount = [
    filters.searchTerm,
    filters.outcome,
    filters.industry,
    filters.persona,
    filters.dateRange
  ].filter(filter => {
    if (typeof filter === 'string') return filter !== '';
    if (typeof filter === 'object' && filter !== null) return true;
    return false;
  }).length;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main search bar */}
      <div className="flex items-center space-x-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={filters.searchTerm}
            onChange={(e) => updateFilter('searchTerm', e.target.value)}
            placeholder={`Search ${type === 'calls' ? 'call logs' : 'battle cards'}...`}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
            showAdvancedFilters || hasActiveFilters
              ? 'bg-primary-50 border-primary-300 text-primary-700'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            title="Clear all filters"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>

      {/* Advanced filters */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-gray-50 rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Outcome filter (for call logs only) */}
                {type === 'calls' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Target className="w-4 h-4 inline mr-1" />
                      Outcome
                    </label>
                    <Select
                      value={filters.outcome || ''}
                      onChange={(value) => updateFilter('outcome', value)}
                      options={outcomeOptions}
                    />
                  </div>
                )}

                {/* Industry filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Building className="w-4 h-4 inline mr-1" />
                    Industry
                  </label>
                  <Select
                    value={filters.industry || ''}
                    onChange={(value) => updateFilter('industry', value)}
                    options={industryOptions}
                  />
                </div>

                {/* Persona filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <User className="w-4 h-4 inline mr-1" />
                    Persona
                  </label>
                  <Select
                    value={filters.persona || ''}
                    onChange={(value) => updateFilter('persona', value)}
                    options={personaOptions}
                  />
                </div>

                {/* Date range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date Range
                  </label>
                  <div className="space-y-2">
                    <input
                      type="date"
                      value={filters.dateRange?.start || ''}
                      onChange={(e) => updateFilter('dateRange', {
                        ...filters.dateRange,
                        start: e.target.value
                      })}
                      className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="date"
                      value={filters.dateRange?.end || ''}
                      onChange={(e) => updateFilter('dateRange', {
                        ...filters.dateRange,
                        end: e.target.value
                      })}
                      className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Results summary */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <span className="text-sm text-gray-600">
                  Showing {filteredData.length} of {data.length} {type === 'calls' ? 'call logs' : 'battle cards'}
                </span>
                
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedSearch;