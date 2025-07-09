import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  TrendingUp, 
  MessageSquare, 
  Lightbulb, 
  Calendar, 
  Award, 
  BarChart, 
  Database,
  Users,
  Phone,
  Target,
  DollarSign,
  Zap,
  Map,
  Upload,
  History,
  CheckSquare,
  Square,
  Edit,
  Trash2,
  X,
  Clock
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import ExportMenu from '@/components/common/ExportMenu';
import { useAppStore } from '@/store';
import { CallLog } from '@/types';
import { format } from 'date-fns';
import CelebrationSystem from '@/components/gamification/CelebrationSystem';
import EncouragementSystem from '@/components/gamification/EncouragementSystem';
import CallMap from './CallMap';

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
  const { 
    prospect, 
    callLogs, 
    addCallLog,
    activeCallDuration,
    activeCallStartTime,
    activeSequenceId,
    callSequences,
    getCallLogsForContact
  } = useAppStore();
  const [activeTab, setActiveTab] = useState<'log-call' | 'call-history' | 'analytics' | 'map-view' | 'crm-sync'>('log-call');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [celebrationType, setCelebrationType] = useState<'meeting-booked' | 'follow-up' | 'intelligence' | 'referral'>('meeting-booked');
  const [encouragementType, setEncouragementType] = useState<'nurture' | 'disqualified' | 'follow-up'>('nurture');
  
  // Multi-select state for call history
  const [selectedCallIds, setSelectedCallIds] = useState<Set<string>>(new Set());
  const [showBatchEdit, setShowBatchEdit] = useState(false);
  const [batchEditData, setBatchEditData] = useState({
    outcome: '',
    intel: '',
    keyTakeaway: '',
    nextSteps: ''
  });
  
  // Find the current contact if we're in a sequence
  const activeSequence = callSequences.find(seq => seq.id === activeSequenceId);
  const currentContact = activeSequence?.contacts.find(c => 
    c.companyName === prospect?.companyName && c.contactName === prospect?.contactName
  );
  
  const [formData, setFormData] = useState({
    outcome: '',
    intel: '',
    bestTalkingPoint: '',
    keyTakeaway: '',
    callDuration: activeCallDuration || 0,
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
  
  // Update call duration when it changes
  useEffect(() => {
    if (activeCallDuration > 0) {
      setFormData(prev => ({ ...prev, callDuration: activeCallDuration }));
    }
  }, [activeCallDuration]);

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
    
    // Calculate attempt number for this contact
    const previousCalls = currentContact?.id 
      ? getCallLogsForContact(currentContact.id).length 
      : 0;

    const callLog: CallLog = {
      id: Date.now().toString(),
      leadId: prospect.companyName,
      outcome: formData.outcome as any,
      intel: formData.intel,
      bestTalkingPoint: formData.bestTalkingPoint,
      keyTakeaway: formData.keyTakeaway,
      createdAt: new Date(),
      callDuration: formData.callDuration,
      // New fields
      sequenceId: activeSequenceId || undefined,
      contactId: currentContact?.id,
      startTime: activeCallStartTime || undefined,
      endTime: new Date(),
      attemptNumber: previousCalls + 1,
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
    
    // Show appropriate animation based on outcome
    if (formData.outcome === 'meeting-booked') {
      setCelebrationType('meeting-booked');
      setShowSuccessAnimation(true);
    } else if (formData.outcome === 'follow-up') {
      setCelebrationType('follow-up');
      setShowSuccessAnimation(true);
    } else if (formData.referrals) {
      setCelebrationType('referral');
      setShowSuccessAnimation(true);
    } else if (formData.intel) {
      setCelebrationType('intelligence');
      setShowSuccessAnimation(true);
    } else if (formData.outcome === 'nurture') {
      setEncouragementType('nurture');
      setShowEncouragement(true);
    } else if (formData.outcome === 'disqualified') {
      setEncouragementType('disqualified');
      setShowEncouragement(true);
    }
    
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
  };

  const handleExportComplete = (format: string) => {
    console.log(`Export completed in ${format} format`);
  };

  const syncToCRM = () => {
    // Mock CRM sync
    alert('CRM sync would happen here - integrating with Zoho CRM API');
  };

  // Multi-select helpers
  const toggleCallSelection = (callId: string) => {
    const newSelected = new Set(selectedCallIds);
    if (newSelected.has(callId)) {
      newSelected.delete(callId);
    } else {
      newSelected.add(callId);
    }
    setSelectedCallIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedCallIds.size === allCallLogs.length) {
      setSelectedCallIds(new Set());
    } else {
      setSelectedCallIds(new Set(allCallLogs.map(log => log.id)));
    }
  };

  const handleBatchEdit = () => {
    setShowBatchEdit(true);
  };

  const applyBatchEdit = () => {
    selectedCallIds.forEach(callId => {
      const updates: Partial<CallLog> = {};
      if (batchEditData.outcome) updates.outcome = batchEditData.outcome as any;
      if (batchEditData.intel) updates.intel = batchEditData.intel;
      if (batchEditData.keyTakeaway) updates.keyTakeaway = batchEditData.keyTakeaway;
      if (batchEditData.nextSteps) {
        updates.additionalInfo = { 
          ...allCallLogs.find(log => log.id === callId)?.additionalInfo,
          nextSteps: batchEditData.nextSteps 
        };
      }
      
      // Update the call log (this would need to be added to the store)
      // updateCallLog(callId, updates);
    });
    
    setShowBatchEdit(false);
    setSelectedCallIds(new Set());
    setBatchEditData({ outcome: '', intel: '', keyTakeaway: '', nextSteps: '' });
    alert(`Updated ${selectedCallIds.size} call logs`);
  };

  const deleteSelectedCalls = () => {
    if (confirm(`Delete ${selectedCallIds.size} selected call logs?`)) {
      // This would need deleteCallLog function in store
      selectedCallIds.forEach(_callId => {
        // deleteCallLog(callId);
      });
      setSelectedCallIds(new Set());
      alert(`Deleted ${selectedCallIds.size} call logs`);
    }
  };

  const metrics = calculateMetrics();
  const analytics = generateAnalytics();

  const tabs = [
    { id: 'log-call' as const, label: 'Log Call', icon: MessageSquare },
    { id: 'call-history' as const, label: 'Call History', icon: History },
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
                  <h3 className="text-lg font-semibold text-gray-900">Log Results</h3>
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

          {/* Call History Tab */}
          {activeTab === 'call-history' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Call History Management</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Review, edit, and manage your call results
                  </p>
                </div>
                
                {selectedCallIds.size > 0 && (
                  <div className="flex gap-2">
                    <Button onClick={handleBatchEdit} variant="secondary">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Selected ({selectedCallIds.size})
                    </Button>
                    <Button onClick={deleteSelectedCalls} variant="secondary" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>

              {/* Multi-select Controls */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <button
                  onClick={toggleSelectAll}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  {selectedCallIds.size === allCallLogs.length ? (
                    <CheckSquare className="w-4 h-4 text-primary-600" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                  {selectedCallIds.size === allCallLogs.length ? 'Deselect All' : 'Select All'}
                </button>
                
                {selectedCallIds.size > 0 && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedCallIds.size} of {allCallLogs.length} calls selected
                  </span>
                )}
              </div>

              {/* Call History List */}
              <div className="space-y-3">
                {allCallLogs.length > 0 ? (
                  allCallLogs.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 border rounded-lg transition-all ${
                        selectedCallIds.has(log.id)
                          ? 'border-primary-300 bg-primary-50 dark:bg-primary-900/20 shadow-md'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleCallSelection(log.id)}
                          className="mt-1"
                        >
                          {selectedCallIds.has(log.id) ? (
                            <CheckSquare className="w-5 h-5 text-primary-600" />
                          ) : (
                            <Square className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {log.leadId}
                              </h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                log.outcome === 'meeting-booked' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                                log.outcome === 'follow-up' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
                                log.outcome === 'nurture' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
                              }`}>
                                {log.outcome.replace('-', ' ')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <Clock className="w-4 h-4" />
                              <span>{log.callDuration || 0} min</span>
                              <span className="text-gray-300 dark:text-gray-600">•</span>
                              <span>{format(log.createdAt, 'MMM d, yyyy')}</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Intelligence: </span>
                              <span className="text-sm text-gray-600 dark:text-gray-400">{log.intel}</span>
                            </div>
                            
                            {log.bestTalkingPoint && (
                              <div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Best Talking Point: </span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">{log.bestTalkingPoint}</span>
                              </div>
                            )}
                            
                            <div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Key Takeaway: </span>
                              <span className="text-sm text-gray-600 dark:text-gray-400">{log.keyTakeaway}</span>
                            </div>

                            {log.additionalInfo?.nextSteps && (
                              <div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Next Steps: </span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">{log.additionalInfo.nextSteps}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <History className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Call History</h3>
                    <p className="text-gray-500 dark:text-gray-300">
                      Start logging calls to see your history here
                    </p>
                  </div>
                )}
              </div>

              {/* Batch Edit Modal */}
              {showBatchEdit && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          Batch Edit {selectedCallIds.size} Call{selectedCallIds.size !== 1 ? 's' : ''}
                        </h3>
                        <button
                          onClick={() => setShowBatchEdit(false)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                          Update fields for all selected calls. Leave fields empty to keep existing values.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Outcome
                            </label>
                            <select
                              value={batchEditData.outcome}
                              onChange={(e) => setBatchEditData({...batchEditData, outcome: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            >
                              <option value="">Keep existing</option>
                              <option value="meeting-booked">Meeting Booked</option>
                              <option value="follow-up">Follow-up Scheduled</option>
                              <option value="nurture">Added to Nurture</option>
                              <option value="disqualified">Disqualified</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Intelligence
                          </label>
                          <textarea
                            value={batchEditData.intel}
                            onChange={(e) => setBatchEditData({...batchEditData, intel: e.target.value})}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="Leave empty to keep existing intelligence"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Key Takeaway
                          </label>
                          <input
                            type="text"
                            value={batchEditData.keyTakeaway}
                            onChange={(e) => setBatchEditData({...batchEditData, keyTakeaway: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="Leave empty to keep existing takeaway"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Next Steps
                          </label>
                          <input
                            type="text"
                            value={batchEditData.nextSteps}
                            onChange={(e) => setBatchEditData({...batchEditData, nextSteps: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="Leave empty to keep existing next steps"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-6">
                        <Button 
                          onClick={() => setShowBatchEdit(false)}
                          variant="secondary"
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={applyBatchEdit}
                          className="flex-1"
                        >
                          Update {selectedCallIds.size} Call{selectedCallIds.size !== 1 ? 's' : ''}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
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
                  <ExportMenu
                    data={{
                      callLogs: allCallLogs,
                      analytics: analytics
                    }}
                    dataType="analytics"
                    filename="call-analytics"
                    onExportComplete={handleExportComplete}
                  />
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
              
              {/* Sequence Analytics */}
              {activeSequence && (
                <Card title="Active Sequence Performance" className="bg-purple-50 border-purple-200">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-purple-900">{activeSequence.name}</h4>
                      <span className="text-sm text-purple-700">
                        {activeSequence.contacts.filter(c => {
                          const logs = callLogs.filter(log => log.contactId === c.id);
                          return logs.length > 0;
                        }).length} / {activeSequence.contacts.length} contacted
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-purple-700">Success Rate</p>
                        <p className="text-2xl font-bold text-purple-900">
                          {(() => {
                            const sequenceLogs = callLogs.filter(log => log.sequenceId === activeSequence.id);
                            const successful = sequenceLogs.filter(log => 
                              log.outcome === 'meeting-booked' || log.outcome === 'follow-up'
                            );
                            return sequenceLogs.length > 0 
                              ? Math.round((successful.length / sequenceLogs.length) * 100) 
                              : 0;
                          })()}%
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-purple-700">Avg Attempts</p>
                        <p className="text-2xl font-bold text-purple-900">
                          {(() => {
                            const attempts = activeSequence.contacts.map(c => 
                              callLogs.filter(log => log.contactId === c.id).length
                            ).filter(n => n > 0);
                            return attempts.length > 0 
                              ? (attempts.reduce((a, b) => a + b, 0) / attempts.length).toFixed(1)
                              : '0';
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Map View Tab */}
          {activeTab === 'map-view' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Geographic Success Map</h3>
                <div className="text-sm text-gray-600">
                  Click on pins to see call details • Different colors indicate call outcomes
                </div>
              </div>

              {/* Interactive Map */}
              <CallMap callLogs={allCallLogs} />
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
      
      {/* Celebration System */}
      <CelebrationSystem
        isActive={showSuccessAnimation}
        celebrationType={celebrationType}
        onComplete={() => setShowSuccessAnimation(false)}
      />
      
      {/* Encouragement System */}
      <EncouragementSystem
        isActive={showEncouragement}
        outcome={encouragementType}
        onComplete={() => setShowEncouragement(false)}
      />
    </div>
  );
};

export default EnhancedPostGame;