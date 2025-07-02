import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Phone, Target, Clock, Award, Activity, Lightbulb, X } from 'lucide-react';
import Card from './Card';
import Select from './Select';
import { useAppStore } from '@/store';
import { CallLog } from '@/types';
import { format, subDays } from 'date-fns';

interface AdvancedAnalyticsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PerformanceMetric {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
}

interface TimeSeriesData {
  date: string;
  calls: number;
  meetings: number;
  successRate: number;
}

interface IndustryPerformance {
  industry: string;
  calls: number;
  successRate: number;
  avgDuration: number;
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ isOpen, onClose }) => {
  const { callLogs } = useAppStore();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'insights' | 'performance'>('overview');

  // Filter data based on time range
  const filteredLogs = useMemo(() => {
    if (timeRange === 'all') return callLogs;
    
    const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const cutoffDate = subDays(new Date(), daysBack);
    
    return callLogs.filter(log => new Date(log.createdAt) >= cutoffDate);
  }, [callLogs, timeRange]);

  // Calculate performance metrics
  const metrics = useMemo((): PerformanceMetric[] => {
    const totalCalls = filteredLogs.length;
    const meetingsBooked = filteredLogs.filter(log => log.outcome === 'meeting-booked').length;
    const followUps = filteredLogs.filter(log => log.outcome === 'follow-up').length;
    const avgDuration = filteredLogs.length > 0 
      ? filteredLogs.reduce((sum, log) => sum + (log.callDuration || 0), 0) / filteredLogs.length / 60
      : 0;
    const successRate = totalCalls > 0 ? ((meetingsBooked + followUps) / totalCalls * 100) : 0;

    // Calculate previous period for comparison
    const previousPeriodDays = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    const previousStart = subDays(new Date(), previousPeriodDays * 2);
    const previousEnd = subDays(new Date(), previousPeriodDays);
    
    const previousLogs = callLogs.filter(log => {
      const logDate = new Date(log.createdAt);
      return logDate >= previousStart && logDate <= previousEnd;
    });

    const previousMeetings = previousLogs.filter(log => log.outcome === 'meeting-booked').length;
    const previousFollowUps = previousLogs.filter(log => log.outcome === 'follow-up').length;
    const previousSuccessRate = previousLogs.length > 0 
      ? ((previousMeetings + previousFollowUps) / previousLogs.length * 100) 
      : 0;

    return [
      {
        label: 'Total Calls',
        value: totalCalls,
        change: previousLogs.length > 0 ? ((totalCalls - previousLogs.length) / previousLogs.length * 100) : 0,
        trend: totalCalls >= previousLogs.length ? 'up' : 'down',
        icon: Phone,
        color: 'blue'
      },
      {
        label: 'Meetings Booked',
        value: meetingsBooked,
        change: previousMeetings > 0 ? ((meetingsBooked - previousMeetings) / previousMeetings * 100) : 0,
        trend: meetingsBooked >= previousMeetings ? 'up' : 'down',
        icon: Target,
        color: 'green'
      },
      {
        label: 'Success Rate',
        value: `${successRate.toFixed(1)}%`,
        change: previousSuccessRate > 0 ? (successRate - previousSuccessRate) : 0,
        trend: successRate >= previousSuccessRate ? 'up' : 'down',
        icon: Award,
        color: 'purple'
      },
      {
        label: 'Avg Duration',
        value: `${avgDuration.toFixed(1)}m`,
        change: 0, // Duration change calculation would need more complex logic
        trend: 'neutral',
        icon: Clock,
        color: 'orange'
      }
    ];
  }, [filteredLogs, callLogs, timeRange]);

  // Generate time series data
  const timeSeriesData = useMemo((): TimeSeriesData[] => {
    const data: TimeSeriesData[] = [];
    const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    
    for (let i = daysBack - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayLogs = filteredLogs.filter(log => 
        format(new Date(log.createdAt), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );
      
      const meetings = dayLogs.filter(log => log.outcome === 'meeting-booked').length;
      const followUps = dayLogs.filter(log => log.outcome === 'follow-up').length;
      const successRate = dayLogs.length > 0 ? ((meetings + followUps) / dayLogs.length * 100) : 0;
      
      data.push({
        date: format(date, 'MMM dd'),
        calls: dayLogs.length,
        meetings: meetings,
        successRate: successRate
      });
    }
    
    return data;
  }, [filteredLogs, timeRange]);

  // Industry performance analysis
  const industryPerformance = useMemo((): IndustryPerformance[] => {
    const industryMap = new Map<string, CallLog[]>();
    
    filteredLogs.forEach(log => {
      // Extract industry from leadId or use a default
      const industry = 'General'; // In a real app, this would come from the lead data
      if (!industryMap.has(industry)) {
        industryMap.set(industry, []);
      }
      industryMap.get(industry)?.push(log);
    });

    return Array.from(industryMap.entries()).map(([industry, logs]) => {
      const meetings = logs.filter(log => log.outcome === 'meeting-booked').length;
      const followUps = logs.filter(log => log.outcome === 'follow-up').length;
      const successRate = logs.length > 0 ? ((meetings + followUps) / logs.length * 100) : 0;
      const avgDuration = logs.length > 0 
        ? logs.reduce((sum, log) => sum + (log.callDuration || 0), 0) / logs.length / 60
        : 0;

      return {
        industry,
        calls: logs.length,
        successRate,
        avgDuration
      };
    });
  }, [filteredLogs]);

  // Outcome distribution data for pie chart
  const outcomeData = useMemo(() => {
    const outcomes = filteredLogs.reduce((acc, log) => {
      acc[log.outcome] = (acc[log.outcome] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(outcomes).map(([outcome, count]) => ({
      name: outcome.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: count,
      percentage: ((count / filteredLogs.length) * 100).toFixed(1)
    }));
  }, [filteredLogs]);

  // AI-powered insights
  const generateInsights = useMemo(() => {
    const insights: string[] = [];
    
    const successRate = metrics.find(m => m.label === 'Success Rate');
    if (successRate && typeof successRate.value === 'string') {
      const rate = parseFloat(successRate.value);
      if (rate > 30) {
        insights.push('🎯 Excellent performance! Your success rate is above industry average.');
      } else if (rate > 15) {
        insights.push('📈 Good performance with room for improvement in closing techniques.');
      } else {
        insights.push('💡 Focus on strengthening value propositions and objection handling.');
      }
    }

    const avgDuration = metrics.find(m => m.label === 'Avg Duration');
    if (avgDuration && typeof avgDuration.value === 'string') {
      const duration = parseFloat(avgDuration.value);
      if (duration > 10) {
        insights.push('⏰ Consider streamlining call structure to improve efficiency.');
      } else if (duration < 3) {
        insights.push('🚀 Calls might be too brief for proper relationship building.');
      }
    }

    if (timeSeriesData.length > 7) {
      const recentCalls = timeSeriesData.slice(-7).reduce((sum, day) => sum + day.calls, 0);
      const previousCalls = timeSeriesData.slice(-14, -7).reduce((sum, day) => sum + day.calls, 0);
      
      if (recentCalls > previousCalls * 1.2) {
        insights.push('📞 Call volume has increased significantly this week!');
      } else if (recentCalls < previousCalls * 0.8) {
        insights.push('📉 Call volume has decreased - consider increasing prospecting activity.');
      }
    }

    return insights;
  }, [metrics, timeSeriesData]);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: 'all', label: 'All Time' }
  ];

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: Activity },
    { id: 'trends' as const, label: 'Trends', icon: TrendingUp },
    { id: 'insights' as const, label: 'AI Insights', icon: Lightbulb },
    { id: 'performance' as const, label: 'Performance', icon: Award }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full mx-4 max-h-[95vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Activity className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold text-gray-800">Advanced Analytics</h2>
            </div>
            <div className="flex items-center space-x-4">
              <Select
                value={timeRange}
                onChange={(value) => setTimeRange(value as any)}
                options={timeRangeOptions}
                className="min-w-[140px]"
              />
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors flex-1 justify-center ${
                    activeTab === tab.id
                      ? 'bg-white text-purple-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="space-y-6">
            {activeTab === 'overview' && (
              <>
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {metrics.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                      <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                              {metric.change !== 0 && (
                                <div className="flex items-center mt-2">
                                  {metric.trend === 'up' ? (
                                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                  ) : metric.trend === 'down' ? (
                                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                                  ) : null}
                                  <span className={`text-sm ${
                                    metric.trend === 'up' ? 'text-green-600' : 
                                    metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                                  }`}>
                                    {Math.abs(metric.change).toFixed(1)}% vs prev period
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className={`p-3 rounded-lg bg-${metric.color}-100`}>
                              <Icon className={`w-6 h-6 text-${metric.color}-600`} />
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Call Volume Chart */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Call Volume Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={timeSeriesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="calls" 
                          stroke="#8884d8" 
                          fill="#8884d8" 
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Card>

                  {/* Outcome Distribution */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Call Outcomes</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={outcomeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percentage }) => `${name} (${percentage}%)`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {outcomeData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                </div>
              </>
            )}

            {activeTab === 'trends' && (
              <div className="space-y-6">
                {/* Success Rate Trend */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Success Rate Trend</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="successRate" 
                        stroke="#82ca9d" 
                        strokeWidth={2}
                        name="Success Rate (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                {/* Calls vs Meetings */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Calls vs Meetings Booked</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="calls" fill="#8884d8" name="Total Calls" />
                      <Bar dataKey="meetings" fill="#82ca9d" name="Meetings Booked" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="space-y-6">
                {/* AI Insights */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                    AI-Powered Insights
                  </h3>
                  <div className="space-y-4">
                    {generateInsights.map((insight, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
                      >
                        <p className="text-blue-800">{insight}</p>
                      </motion.div>
                    ))}
                  </div>
                </Card>

                {/* Recommendations */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-800">Optimization Opportunity</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Focus on industries with higher success rates to maximize efficiency.
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-medium text-yellow-800">Best Practices</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Review your most successful calls to identify patterns and replicate them.
                      </p>
                    </div>
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <h4 className="font-medium text-purple-800">Strategic Focus</h4>
                      <p className="text-sm text-purple-700 mt-1">
                        Consider increasing call frequency during your highest-performing days and times.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="space-y-6">
                {/* Performance Summary */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {filteredLogs.filter(log => log.outcome === 'meeting-booked').length}
                      </div>
                      <div className="text-sm text-gray-600">Meetings Booked</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {filteredLogs.filter(log => log.outcome === 'follow-up').length}
                      </div>
                      <div className="text-sm text-gray-600">Follow-ups Scheduled</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">
                        {filteredLogs.filter(log => log.outcome === 'nurture').length}
                      </div>
                      <div className="text-sm text-gray-600">Nurture Prospects</div>
                    </div>
                  </div>
                </Card>

                {/* Industry Performance */}
                {industryPerformance.length > 0 && (
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Performance by Industry</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={industryPerformance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="industry" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="successRate" fill="#82ca9d" name="Success Rate (%)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;