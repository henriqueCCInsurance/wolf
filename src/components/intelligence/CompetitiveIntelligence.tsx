import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  MessageSquare, 
  Award, 
  AlertCircle,
  Search,
  BarChart3,
  Users,
  Zap
} from 'lucide-react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import { CompetitiveIntelligenceService } from '@/services/competitiveIntelligence';
import { CompetitiveAnalytics } from '@/types';

interface CompetitiveIntelligenceProps {
  showFilters?: boolean;
  maxCompetitors?: number;
}

const CompetitiveIntelligence: React.FC<CompetitiveIntelligenceProps> = ({
  showFilters = true,
  maxCompetitors = 5
}) => {
  const [competitiveService] = useState(() => CompetitiveIntelligenceService.getInstance());
  const [topCompetitors, setTopCompetitors] = useState<CompetitiveAnalytics[]>([]);
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [battleCard, setBattleCard] = useState<ReturnType<typeof competitiveService.getBattleCardComparison> | null>(null);
  const [view, setView] = useState<'overview' | 'detailed' | 'battle-card'>('overview');

  useEffect(() => {
    const competitors = competitiveService.getTopCompetitors(maxCompetitors);
    setTopCompetitors(competitors);
  }, [competitiveService, maxCompetitors]);

  useEffect(() => {
    if (selectedCompetitor) {
      const comparison = competitiveService.getBattleCardComparison(selectedCompetitor);
      setBattleCard(comparison);
    }
  }, [selectedCompetitor, competitiveService]);

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'national-carrier', label: 'National Carriers' },
    { value: 'regional-carrier', label: 'Regional Carriers' },
    { value: 'local-broker', label: 'Local Brokers' },
    { value: 'peo', label: 'PEO Services' },
    { value: 'other', label: 'Other' }
  ];

  const filteredCompetitors = competitiveService.getCompetitors().filter(comp => {
    const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         comp.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || comp.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getWinRateColor = (winRate: number) => {
    if (winRate >= 70) return 'text-green-600';
    if (winRate >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getWinRateIcon = (winRate: number) => {
    if (winRate >= 70) return <TrendingUp className="w-4 h-4" />;
    if (winRate >= 50) return <BarChart3 className="w-4 h-4" />;
    return <TrendingDown className="w-4 h-4" />;
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Top Competitors Dashboard */}
      <Card title="Top Competitors" subtitle="Most frequently encountered competitors">
        {topCompetitors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topCompetitors.map(competitor => (
              <div 
                key={competitor.competitorId}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => {
                  setSelectedCompetitor(competitor.competitorId);
                  setView('detailed');
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{competitor.competitorName}</h4>
                  <div className={`flex items-center space-x-1 ${getWinRateColor(competitor.winRate)}`}>
                    {getWinRateIcon(competitor.winRate)}
                    <span className="text-sm font-medium">{competitor.winRate.toFixed(1)}%</span>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Encounters:</span>
                    <span className="font-medium">{competitor.totalEncounters}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Win Rate:</span>
                    <span className={`font-medium ${getWinRateColor(competitor.winRate)}`}>
                      {competitor.winRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                {competitor.recentTrends.length > 0 && (
                  <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                    <div className="flex items-center space-x-1 text-blue-700">
                      <Eye className="w-3 h-3" />
                      <span className="font-medium">Recent Trend:</span>
                    </div>
                    <p className="text-blue-600 mt-1">{competitor.recentTrends[0].trend}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No competitive encounters logged yet.</p>
            <p className="text-sm mt-2">Start tracking competitors in your call logs to see analytics here.</p>
          </div>
        )}
      </Card>

      {/* Quick Battle Cards */}
      <Card title="Quick Call Cards" subtitle="Ready-to-use competitive positioning">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCompetitors.slice(0, 4).map(competitor => (
            <div key={competitor.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{competitor.name}</h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedCompetitor(competitor.id);
                    setView('battle-card');
                  }}
                >
                  <Target className="w-3 h-3 mr-1" />
                  Call Card
                </Button>
              </div>
              
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Top Weakness:</span>
                  <p className="text-gray-600 text-xs mt-1">{competitor.weaknesses[0]}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Our Advantage:</span>
                  <p className="text-gray-600 text-xs mt-1">{competitor.differentiators[0]}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderDetailed = () => {
    if (!selectedCompetitor) return null;
    
    const analytics = topCompetitors.find(c => c.competitorId === selectedCompetitor);
    const competitor = competitiveService.getCompetitor(selectedCompetitor);
    
    if (!analytics || !competitor) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{competitor.name}</h3>
            <p className="text-gray-600">{competitor.description}</p>
          </div>
          <Button variant="outline" onClick={() => setView('overview')}>
            Back to Overview
          </Button>
        </div>

        {/* Performance Metrics */}
        <Card title="Performance Against This Competitor">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{analytics.totalEncounters}</div>
              <div className="text-sm text-gray-600">Total Encounters</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className={`text-2xl font-bold ${getWinRateColor(analytics.winRate)}`}>
                {analytics.winRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Win Rate</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{analytics.lossRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Loss Rate</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{analytics.recentTrends.length}</div>
              <div className="text-sm text-gray-600">Recent Trends</div>
            </div>
          </div>
        </Card>

        {/* Common Objections */}
        <Card title="Common Objections & Responses">
          {analytics.commonObjections.length > 0 ? (
            <div className="space-y-4">
              {analytics.commonObjections.map((objection, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{objection.objection}</h4>
                    <span className="text-sm text-gray-500">
                      Frequency: {objection.frequency}
                    </span>
                  </div>
                  
                  {/* Get responses for this objection */}
                  {(() => {
                    const responses = competitiveService.getObjectionResponses(selectedCompetitor, objection.objection);
                    return responses.length > 0 ? (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                        <div className="flex items-center space-x-2 mb-2">
                          <MessageSquare className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-blue-900">Proven Response:</span>
                        </div>
                        <p className="text-sm text-blue-800">{responses[0].response}</p>
                        {responses[0].talkingPoints.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs font-medium text-blue-700">Key Points:</span>
                            <ul className="text-xs text-blue-700 mt-1 space-y-1">
                              {responses[0].talkingPoints.slice(0, 3).map((point, i) => (
                                <li key={i}>• {point}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : null;
                  })()}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No objections logged for this competitor yet.</p>
            </div>
          )}
        </Card>

        {/* Effective Responses */}
        <Card title="Most Effective Responses">
          {analytics.effectiveResponses.length > 0 ? (
            <div className="space-y-3">
              {analytics.effectiveResponses.map((response, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">Response Strategy</span>
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-green-600">
                        {response.successRate.toFixed(1)}% Success Rate
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{response.response}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Award className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No response effectiveness data available yet.</p>
            </div>
          )}
        </Card>

        {/* Recent Trends */}
        {analytics.recentTrends.length > 0 && (
          <Card title="Recent Trends">
            <div className="space-y-3">
              {analytics.recentTrends.map((trend, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded">
                  <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">{trend.trend}</p>
                    <p className="text-xs text-blue-700">{trend.timeframe}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    );
  };

  const renderBattleCard = () => {
    if (!battleCard) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {battleCard.competitor.name} Call Card
            </h3>
            <p className="text-gray-600">Competitive positioning and responses</p>
          </div>
          <Button variant="outline" onClick={() => setView('overview')}>
            Back to Overview
          </Button>
        </div>

        {/* Competitive Positioning */}
        <Card title="Competitive Positioning">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Their Strengths */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Shield className="w-5 h-5 text-blue-600 mr-2" />
                Their Strengths
              </h4>
              <ul className="space-y-2">
                {battleCard.strengths.map((strength, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="w-1 h-1 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            {/* Their Weaknesses */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                Their Weaknesses
              </h4>
              <ul className="space-y-2">
                {battleCard.weaknesses.map((weakness, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="w-1 h-1 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {weakness}
                  </li>
                ))}
              </ul>
            </div>

            {/* Our Differentiators */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Zap className="w-5 h-5 text-green-600 mr-2" />
                Our Advantages
              </h4>
              <ul className="space-y-2">
                {battleCard.differentiators.map((diff, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="w-1 h-1 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {diff}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        {/* Proven Responses */}
        <Card title="Proven Responses">
          <div className="space-y-4">
            {battleCard.responses.map((response, index) => (
              <div key={response.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Response #{index + 1}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      response.tone === 'collaborative' ? 'bg-blue-100 text-blue-800' :
                      response.tone === 'assertive' ? 'bg-red-100 text-red-800' :
                      response.tone === 'consultative' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {response.tone}
                    </span>
                    <span className="text-sm text-gray-500">
                      {response.effectivenessRating}/5 ⭐
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 mb-3">{response.response}</p>
                
                {response.talkingPoints.length > 0 && (
                  <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded">
                    <h5 className="font-medium text-gray-900 mb-2">Key Talking Points:</h5>
                    <ul className="space-y-1">
                      {response.talkingPoints.map((point, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start">
                          <span className="w-1 h-1 bg-gray-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {response.followUpQuestions && response.followUpQuestions.length > 0 && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                    <h5 className="font-medium text-blue-900 mb-2">Follow-up Questions:</h5>
                    <ul className="space-y-1">
                      {response.followUpQuestions.map((question, i) => (
                        <li key={i} className="text-sm text-blue-700">
                          • {question}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {showFilters && (
        <Card title="Competitive Intelligence" subtitle="Track, analyze, and respond to competitive threats">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search competitors..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={categoryOptions}
              placeholder="Filter by category"
            />
            <div className="flex space-x-2">
              <Button
                variant={view === 'overview' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setView('overview')}
              >
                <Users className="w-4 h-4 mr-1" />
                Overview
              </Button>
              {selectedCompetitor && (
                <>
                  <Button
                    variant={view === 'detailed' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setView('detailed')}
                  >
                    <BarChart3 className="w-4 h-4 mr-1" />
                    Detailed
                  </Button>
                  <Button
                    variant={view === 'battle-card' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setView('battle-card')}
                  >
                    <Shield className="w-4 h-4 mr-1" />
                    Call Card
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>
      )}

      {view === 'overview' && renderOverview()}
      {view === 'detailed' && renderDetailed()}
      {view === 'battle-card' && renderBattleCard()}
    </div>
  );
};

export default CompetitiveIntelligence;