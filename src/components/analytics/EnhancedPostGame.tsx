import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  TrendingUp, 
  MessageSquare, 
  Lightbulb, 
  Calendar, 
  Award, 
  BarChart, 
  FileSpreadsheet,
  MapPin,
  Database,
  Users,
  Phone,
  Target,
  DollarSign,
  Zap,
  Map,
  Upload
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import { useAppStore } from '@/store';
import { CallLog } from '@/types';
import { format } from 'date-fns';

interface PerformanceMetrics {
  totalCalls: number;
  successfulCalls: number;
  successRate: number;
  avgCallDuration: number;
  meetingsBooked: number;
  followUpsScheduled: number;
  totalRevenuePotential: number;
}

interface CallAnalytics {
  callsByDay: { date: string; calls: number; meetings: number }[];
  outcomeDistribution: { name: string; value: number; color: string }[];
  personaPerformance: { persona: string; successRate: number; calls: number }[];
  industryPerformance: { industry: string; successRate: number; calls: number }[];
}

const EnhancedPostGame: React.FC = () => {
  const { prospect, callLogs, addCallLog } = useAppStore();
  const [activeTab, setActiveTab] = useState<'log-call' | 'analytics' | 'map-view' | 'crm-sync'>('log-call');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  
  const [formData, setFormData] = useState({
    outcome: '',
    intel: '',
    bestTalkingPoint: '',
    keyTakeaway: '',
    callDuration: 0,
    newContacts: '',
    referrals: '',
    companyInsights: '',
    nextSteps: '',
    meetingType: '',
    followUpDate: '',
    revenuePotential: 0,
    decisionMakerMet: false,
    competitorMentioned: '',
    urgency: 'medium'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock data for demo
  const mockCallLogs: CallLog[] = [
    {
      id: '1',
      leadId: 'lead1',
      outcome: 'meeting-booked',
      intel: 'Looking to reduce costs by 20%, current provider contract expires in Q2',
      bestTalkingPoint: 'Cost optimization without sacrificing coverage',
      keyTakeaway: 'Very interested in our cost-reduction approach',
      createdAt: new Date('2024-06-20'),
      callDuration: 18,
      additionalInfo: {
        newContacts: 'CFO Sarah Williams',
        referrals: 'Recommended by current client TechCorp',
        companyInsights: '200 employees, growing 15% annually',
        nextSteps: 'Discovery meeting scheduled for next Tuesday',
        meetingType: 'discovery'
      }
    },
    {
      id: '2',
      leadId: 'lead2',
      outcome: 'follow-up',
      intel: 'Decision committee meets monthly, next meeting is end of month',
      bestTalkingPoint: 'Industry-specific benefits package customization',
      keyTakeaway: 'Timing is crucial - need proposal by month end',
      createdAt: new Date('2024-06-19'),
      callDuration: 12,
      additionalInfo: {
        nextSteps: 'Send proposal draft by Friday',
        followUpDate: '2024-06-25'
      }
    },
    {
      id: '3',
      leadId: 'lead3',
      outcome: 'nurture',
      intel: 'Happy with current provider but open to future conversations',
      bestTalkingPoint: 'Thought leadership on benefits trends',
      keyTakeaway: 'Keep in nurture campaign, follow up in 6 months',
      createdAt: new Date('2024-06-18'),
      callDuration: 8
    }
  ];

  const allCallLogs = [...callLogs, ...mockCallLogs];

  const calculateMetrics = (): PerformanceMetrics => {
    const successful = allCallLogs.filter(log => 
      log.outcome === 'meeting-booked' || log.outcome === 'follow-up'
    );
    
    return {
      totalCalls: allCallLogs.length,
      successfulCalls: successful.length,
      successRate: allCallLogs.length > 0 ? (successful.length / allCallLogs.length) * 100 : 0,
      avgCallDuration: allCallLogs.reduce((sum, log) => sum + (log.callDuration || 0), 0) / allCallLogs.length || 0,
      meetingsBooked: allCallLogs.filter(log => log.outcome === 'meeting-booked').length,
      followUpsScheduled: allCallLogs.filter(log => log.outcome === 'follow-up').length,
      totalRevenuePotential: successful.length * 50000 // Mock calculation
    };
  };

  const generateAnalytics = (): CallAnalytics => {
    // Mock analytics data
    return {
      callsByDay: [
        { date: '6/17', calls: 8, meetings: 2 },
        { date: '6/18', calls: 12, meetings: 4 },
        { date: '6/19', calls: 15, meetings: 3 },
        { date: '6/20', calls: 10, meetings: 5 },
        { date: '6/21', calls: 18, meetings: 6 },
        { date: '6/22', calls: 14, meetings: 4 },
        { date: '6/23', calls: 16, meetings: 7 }
      ],
      outcomeDistribution: [
        { name: 'Meeting Booked', value: 35, color: '#10B981' },
        { name: 'Follow-up', value: 25, color: '#3B82F6' },
        { name: 'Nurture', value: 30, color: '#F59E0B' },
        { name: 'Disqualified', value: 10, color: '#EF4444' }
      ],
      personaPerformance: [
        { persona: 'Benefits Optimizer', successRate: 75, calls: 12 },
        { persona: 'ROI Executive', successRate: 68, calls: 15 },
        { persona: 'Cost-Conscious', successRate: 62, calls: 18 },
        { persona: 'Gatekeeper', successRate: 45, calls: 8 }
      ],
      industryPerformance: [
        { industry: 'Technology', successRate: 72, calls: 15 },
        { industry: 'Healthcare', successRate: 68, calls: 12 },
        { industry: 'Manufacturing', successRate: 65, calls: 20 },
        { industry: 'Professional Services', successRate: 58, calls: 10 }
      ]
    };
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.outcome) newErrors.outcome = 'Outcome is required';
    if (!formData.intel) newErrors.intel = 'Intelligence is required';
    if (!formData.keyTakeaway) newErrors.keyTakeaway = 'Key takeaway is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!prospect) return;

    const callLog: CallLog = {
      id: Date.now().toString(),
      leadId: prospect.companyName,
      outcome: formData.outcome as any,
      intel: formData.intel,
      bestTalkingPoint: formData.bestTalkingPoint,
      keyTakeaway: formData.keyTakeaway,
      createdAt: new Date(),
      callDuration: formData.callDuration,
      additionalInfo: {
        newContacts: formData.newContacts,
        referrals: formData.referrals,
        companyInsights: formData.companyInsights,
        nextSteps: formData.nextSteps,
        meetingType: formData.meetingType,
        followUpDate: formData.followUpDate
      }
    };

    addCallLog(callLog);
    setShowSuccessAnimation(true);
    
    // Reset form
    setFormData({
      outcome: '',
      intel: '',
      bestTalkingPoint: '',
      keyTakeaway: '',
      callDuration: 0,
      newContacts: '',
      referrals: '',
      companyInsights: '',
      nextSteps: '',
      meetingType: '',
      followUpDate: '',
      revenuePotential: 0,
      decisionMakerMet: false,
      competitorMentioned: '',
      urgency: 'medium'
    });
    setErrors({});

    setTimeout(() => setShowSuccessAnimation(false), 3000);
  };

  const exportToSpreadsheet = () => {
    const data = allCallLogs.map(log => ({
      Date: format(log.createdAt, 'yyyy-MM-dd'),
      Company: log.leadId,
      Outcome: log.outcome,
      Duration: log.callDuration,
      Intelligence: log.intel,
      'Best Talking Point': log.bestTalkingPoint,
      'Key Takeaway': log.keyTakeaway,
      'Next Steps': log.additionalInfo?.nextSteps || '',
      'Revenue Potential': '$50,000' // Mock data
    }));

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `call-analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const syncToCRM = () => {
    // Mock CRM sync
    alert('CRM sync would happen here - integrating with Zoho CRM API');
  };

  const metrics = calculateMetrics();
  const analytics = generateAnalytics();

  const tabs = [
    { id: 'log-call' as const, label: 'Log Call', icon: MessageSquare },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart },
    { id: 'map-view' as const, label: 'Map View', icon: Map },
    { id: 'crm-sync' as const, label: 'CRM Sync', icon: Database }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Success Rate</p>
              <p className="text-2xl font-bold">{metrics.successRate.toFixed(1)}%</p>
            </div>
            <Target className="w-8 h-8 text-green-200" />
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Calls</p>
              <p className="text-2xl font-bold">{metrics.totalCalls}</p>
            </div>
            <Phone className="w-8 h-8 text-blue-200" />
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Meetings Booked</p>
              <p className="text-2xl font-bold">{metrics.meetingsBooked}</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-200" />
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Revenue Pipeline</p>
              <p className="text-2xl font-bold">${(metrics.totalRevenuePotential / 1000).toFixed(0)}K</p>
            </div>
            <DollarSign className="w-8 h-8 text-orange-200" />
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <Card>
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Log Call Tab */}
          {activeTab === 'log-call' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Log Call Results</h3>
                  <p className="text-sm text-gray-600">
                    Record outcomes and insights from your call
                    {prospect && ` with ${prospect.companyName}`}
                  </p>
                </div>
                
                {showSuccessAnimation && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-green-100 text-green-800 px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Award className="w-5 h-5" />
                    Call logged successfully!
                  </motion.div>
                )}
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Call Outcome"
                    value={formData.outcome}
                    onChange={(value) => setFormData({...formData, outcome: value})}
                    options={[
                      { value: 'meeting-booked', label: 'Meeting Booked 🎯' },
                      { value: 'follow-up', label: 'Follow-up Scheduled 📅' },
                      { value: 'nurture', label: 'Added to Nurture 🌱' },
                      { value: 'disqualified', label: 'Disqualified ❌' }
                    ]}
                    error={errors.outcome}
                    required
                  />

                  <Input
                    label="Call Duration (minutes)"
                    type="number"
                    value={formData.callDuration.toString()}
                    onChange={(value) => setFormData({...formData, callDuration: parseInt(value) || 0})}
                    placeholder="e.g., 15"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Key Intelligence Gathered *
                    </label>
                    <textarea
                      value={formData.intel}
                      onChange={(e) => setFormData({...formData, intel: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="What did you learn about their needs, timeline, decision process?"
                    />
                    {errors.intel && <p className="text-red-500 text-sm mt-1">{errors.intel}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Most Effective Talking Point
                    </label>
                    <input
                      type="text"
                      value={formData.bestTalkingPoint}
                      onChange={(e) => setFormData({...formData, bestTalkingPoint: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Which message resonated most with them?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Key Takeaway *
                    </label>
                    <textarea
                      value={formData.keyTakeaway}
                      onChange={(e) => setFormData({...formData, keyTakeaway: e.target.value})}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Main insight or action item from this call"
                    />
                    {errors.keyTakeaway && <p className="text-red-500 text-sm mt-1">{errors.keyTakeaway}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Next Steps
                    </label>
                    <input
                      type="text"
                      value={formData.nextSteps}
                      onChange={(e) => setFormData({...formData, nextSteps: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="What's the agreed next action?"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button type="submit" className="flex items-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>Save Call Log</span>
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Performance Analytics</h3>
                <div className="flex gap-3">
                  <select
                    value={selectedTimeframe}
                    onChange={(e) => setSelectedTimeframe(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                    <option value="all">All Time</option>
                  </select>
                  <Button onClick={exportToSpreadsheet} variant="secondary">
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Call Volume Trend */}
                <Card title="Call Volume & Success Trend" className="col-span-1 lg:col-span-2">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics.callsByDay}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="calls" stroke="#3B82F6" strokeWidth={2} name="Total Calls" />
                      <Line type="monotone" dataKey="meetings" stroke="#10B981" strokeWidth={2} name="Meetings Booked" />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                {/* Outcome Distribution */}
                <Card title="Call Outcomes Distribution">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={analytics.outcomeDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {analytics.outcomeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>

                {/* Persona Performance */}
                <Card title="Success Rate by Persona">
                  <ResponsiveContainer width="100%" height={250}>
                    <RechartsBarChart data={analytics.personaPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="persona" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="successRate" fill="#8884d8" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* Key Insights */}
              <Card title="AI-Powered Insights" className="bg-blue-50 border-blue-200">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-blue-900">Best Performing Day</h4>
                      <p className="text-sm text-blue-800">Friday shows 43% higher meeting booking rate than average</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-green-900">Trending Up</h4>
                      <p className="text-sm text-green-800">Benefits Optimizer persona has 25% improvement this month</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-yellow-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-yellow-900">Optimization Opportunity</h4>
                      <p className="text-sm text-yellow-800">Consider focusing more on Technology industry (72% success rate)</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Map View Tab */}
          {activeTab === 'map-view' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Geographic Success Map</h3>
                <Button variant="secondary">
                  <MapPin className="w-4 h-4 mr-2" />
                  Optimize Route
                </Button>
              </div>

              <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="font-semibold text-gray-600 mb-2">Interactive Map View</h4>
                  <p className="text-gray-500 max-w-md">
                    This would show a map with successful call locations, allowing you to plan efficient routes for in-person follow-ups and identify geographic patterns in your success rate.
                  </p>
                </div>
              </div>

              {/* Successful Calls List */}
              <Card title="Successful Calls for Route Planning">
                <div className="space-y-3">
                  {allCallLogs
                    .filter(log => log.outcome === 'meeting-booked')
                    .map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-green-600" />
                          <div>
                            <div className="font-medium text-green-900">{log.leadId}</div>
                            <div className="text-sm text-green-700">
                              Meeting scheduled • {format(log.createdAt, 'MMM d, yyyy')}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-green-600">📍 Location data would appear here</div>
                      </div>
                    ))}
                </div>
              </Card>
            </div>
          )}

          {/* CRM Sync Tab */}
          {activeTab === 'crm-sync' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">CRM Integration</h3>
                <Button onClick={syncToCRM} className="bg-orange-600 hover:bg-orange-700">
                  <Upload className="w-4 h-4 mr-2" />
                  Sync to Zoho CRM
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Sync Status">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">Connected to Zoho CRM</span>
                      </div>
                      <span className="text-xs text-green-600">Last sync: 2 hours ago</span>
                    </div>
                    
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span>Pending sync:</span>
                        <span className="font-medium">{allCallLogs.length} call logs</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last successful sync:</span>
                        <span className="text-gray-600">12 records</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card title="Sync Settings">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-sync call logs</span>
                      <div className="w-12 h-6 bg-primary-600 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Update lead status</span>
                      <div className="w-12 h-6 bg-primary-600 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Create follow-up tasks</span>
                      <div className="w-12 h-6 bg-gray-300 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <Card title="Recent CRM Activity">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <Database className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Call log synced to Acme Corp lead</div>
                      <div className="text-xs text-gray-500">2 hours ago</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Follow-up task created for TechStart Inc</div>
                      <div className="text-xs text-gray-500">4 hours ago</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <Users className="w-5 h-5 text-purple-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Lead status updated to "Qualified"</div>
                      <div className="text-xs text-gray-500">6 hours ago</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default EnhancedPostGame;