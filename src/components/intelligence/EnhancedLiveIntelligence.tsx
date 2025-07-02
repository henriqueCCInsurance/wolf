import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Lightbulb, RefreshCw, Calendar, ExternalLink, Globe, Settings } from 'lucide-react';
import { industryIntelligence2025 } from '@/data/industryIntelligence2025';
import { EnhancedWebSearchService } from '@/services/enhancedWebSearch';
import { WebSearchResult } from '@/types';
import { useAppStore } from '@/store';

interface EnhancedLiveIntelligenceProps {
  industry: string;
  className?: string;
}

const EnhancedLiveIntelligence: React.FC<EnhancedLiveIntelligenceProps> = ({ 
  industry, 
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState<'live' | 'stats' | 'trends' | 'insights'>('live');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [liveResults, setLiveResults] = useState<WebSearchResult[]>([]);
  const [loadingLive, setLoadingLive] = useState(false);
  const [talkingPoints, setTalkingPoints] = useState<string[]>([]);
  const { setDynamicIntelligence } = useAppStore();

  const industryData = industryIntelligence2025.find(ind => ind.id === industry);

  useEffect(() => {
    // Simulate real-time data refresh
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 300000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Load live intelligence when component mounts or industry changes
  useEffect(() => {
    loadLiveIntelligence();
  }, [industry]);

  const loadLiveIntelligence = async () => {
    if (liveResults.length > 0) return; // Already loaded
    
    setLoadingLive(true);
    try {
      const results = await EnhancedWebSearchService.searchIndustryIntelligence(industry);
      setLiveResults(results);
      setDynamicIntelligence(results);
    } catch (error) {
      console.error('Failed to load live intelligence:', error);
    } finally {
      setLoadingLive(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Fetch live intelligence
      const results = await EnhancedWebSearchService.searchIndustryIntelligence(industry);
      setLiveResults(results);
      setDynamicIntelligence(results);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to refresh intelligence:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const generateTalkingPoints = () => {
    const points = EnhancedWebSearchService.generateTalkingPoints(liveResults, industry);
    setTalkingPoints(points);
  };

  // Generate relevant source URLs based on source name
  const getSourceUrl = (sourceName: string): string => {
    const sourceMap: Record<string, string> = {
      'Bureau of Labor Statistics': 'https://www.bls.gov/news.release/ecec.nr0.htm',
      'Kaiser Family Foundation': 'https://www.kff.org/health-costs/',
      'Employee Benefit Research Institute': 'https://www.ebri.org/research',
      'Society for Human Resource Management': 'https://www.shrm.org/research-and-insights',
      'Deloitte': 'https://www2.deloitte.com/us/en/insights/focus/human-capital-trends.html',
      'PwC': 'https://www.pwc.com/us/en/services/consulting/workforce-of-the-future.html',
      'McKinsey & Company': 'https://www.mckinsey.com/capabilities/people-and-organizational-performance/our-insights',
      'Gallup': 'https://www.gallup.com/workplace/insights.aspx',
      'Harvard Business Review': 'https://hbr.org/topic/benefits',
      'Willis Towers Watson': 'https://www.wtwco.com/en-US/Insights',
      'Mercer': 'https://www.mercer.com/insights/',
      'Aon': 'https://www.aon.com/insights/',
      'National Association of Insurance Commissioners': 'https://www.naic.org/cipr_topics/topic_health_insurance.htm',
      'Congressional Budget Office': 'https://www.cbo.gov/topics/health-care',
      'Default': 'https://www.benefitnews.com/' // Fallback for unknown sources
    };
    
    return sourceMap[sourceName] || sourceMap['Default'];
  };

  if (!industryData) {
    return (
      <div className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>Industry intelligence not available for this sector.</p>
        </div>
      </div>
    );
  }

  const providerStatus = EnhancedWebSearchService.getProviderStatus();

  const tabs = [
    { id: 'live' as const, label: 'Live Intel', icon: Globe, count: liveResults.length },
    { id: 'stats' as const, label: 'Key Stats', icon: BarChart3, count: industryData.keyStats.length },
    { id: 'trends' as const, label: 'Trends', icon: TrendingUp, count: industryData.trends.length },
    { id: 'insights' as const, label: 'Thought Leadership', icon: Lightbulb, count: industryData.thoughtLeadership.length }
  ];

  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Enhanced Industry Intelligence
          </h3>
          <p className="text-sm text-gray-600">
            Real-time insights for {industryData.name} sector conversations
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-xs text-gray-500 flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            Updated {lastUpdated.toLocaleTimeString()}
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm font-medium disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Live Indicator */}
      <div className="flex items-center justify-between mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-800">
            {providerStatus.provider === 'mock' ? 'DEMO DATA' : 'LIVE DATA'}
          </span>
          <span className="text-xs text-green-600">
            ({providerStatus.provider} provider)
          </span>
        </div>
        <span className="text-xs text-green-700">2025 Market Intelligence</span>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              <span className="bg-gray-300 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'live' && (
          <div className="space-y-4">
            {!providerStatus.ready && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Settings className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Search Configuration Required</span>
                </div>
                <p className="text-sm text-yellow-700">
                  Configure your search provider in Data Management to access live intelligence.
                </p>
              </div>
            )}

            {loadingLive ? (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 mx-auto mb-4 text-gray-400 animate-spin" />
                <p className="text-gray-500">Loading live industry intelligence...</p>
              </div>
            ) : liveResults.length > 0 ? (
              <>
                {liveResults.map((result, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                        {result.title}
                      </h4>
                      <div className="flex items-center space-x-2 ml-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {(result.relevanceScore * 100).toFixed(0)}% Match
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                      {result.snippet}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-500">Live Source</span>
                      </div>
                      <a 
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 transition-colors text-xs"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Read More</span>
                      </a>
                    </div>
                  </motion.div>
                ))}

                {/* Generated Talking Points */}
                {talkingPoints.length > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-3">AI-Generated Talking Points</h4>
                    <div className="space-y-2">
                      {talkingPoints.map((point, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-blue-800">{point}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <Globe className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 mb-2">No live intelligence available</p>
                <p className="text-sm text-gray-400">Try refreshing or check your search configuration</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'stats' && (
          <div className="space-y-4">
            {industryData.keyStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{stat.statistic}</h4>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    2025 Data
                  </span>
                </div>
                
                <div className="text-2xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                
                <p className="text-sm text-gray-700 mb-3">
                  {stat.talkingPoint}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Source: {stat.source}</span>
                  <a 
                    href={getSourceUrl(stat.source)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>View Source</span>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-4">
            {industryData.trends.map((trend, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">{trend.trend}</h4>
                    <p className="text-sm text-gray-700 mb-3">{trend.impact}</p>
                    <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                      <h5 className="font-medium text-primary-900 mb-1">Opportunity Connection:</h5>
                      <p className="text-sm text-primary-800">{trend.opportunityConnection}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-4">
            {industryData.thoughtLeadership.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">{insight.topic}</h4>
                    <blockquote className="text-gray-700 italic mb-3 pl-4 border-l-4 border-gray-200">
                      "{insight.insight}"
                    </blockquote>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <h5 className="font-medium text-green-900 mb-1">Business Connection:</h5>
                      <p className="text-sm text-green-800">{insight.businessConnection}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Ready to Use This Intelligence?</h4>
            <p className="text-sm text-gray-600">
              {activeTab === 'live' ? 
                `${liveResults.length} live insights ready for your ${industryData.name} conversations` :
                `These insights are optimized for ${industryData.name} conversations`
              }
            </p>
          </div>
          <div className="flex space-x-2">
            {activeTab === 'live' && liveResults.length > 0 && (
              <button 
                onClick={generateTalkingPoints}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
              >
                Generate Talking Points
              </button>
            )}
            <button className="bg-primary-300 hover:bg-primary-400 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Add to Call Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLiveIntelligence;