import React, { useState, useEffect } from 'react';
import { Save, TrendingUp, MessageSquare, Lightbulb, Calendar, Clock, Award, BarChart, Download, FileSpreadsheet, Trash2, AlertCircle } from 'lucide-react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import EnhancedSearch from '@/components/common/EnhancedSearch';
import { useAppStore } from '@/store';
import { CallLog } from '@/types';
import { format } from 'date-fns';
import { exportCallLogsToCSV, exportPerformanceMetricsToCSV, exportCompleteDataset, generateCallInsights } from '@/utils/exportUtils';
import { useAuth } from '@/contexts/AuthContext';
import { trackCallMade, trackMeetingBooked } from '@/services/activityTracking';

const PostGame: React.FC = () => {
  const { prospect, callLogs, addCallLog, battleCards, activeCallDuration, clearCallLogs } = useAppStore();
  const { user } = useAuth();
  
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
    // Competitive intelligence fields
    competitorMentioned: '',
    competitorStrengths: '',
    competitorWeaknesses: '',
    switchingReasons: '',
    decisionFactors: '',
    competitiveResponse: ''
  });
  
  const [showDemoData, setShowDemoData] = useState(false);
  const [filteredCallLogs, setFilteredCallLogs] = useState<CallLog[]>(callLogs);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update filtered logs when callLogs change
  useEffect(() => {
    setFilteredCallLogs(callLogs);
  }, [callLogs]);

  // Update call duration when it changes
  useEffect(() => {
    if (activeCallDuration > 0) {
      setFormData(prev => ({ ...prev, callDuration: activeCallDuration }));
    }
  }, [activeCallDuration]);

  const outcomeOptions = [
    { value: 'meeting-booked', label: 'Meeting Booked 🎯' },
    { value: 'follow-up', label: 'Follow-up Scheduled 📅' },
    { value: 'nurture', label: 'Added to Nurture Campaign 🌱' },
    { value: 'disqualified', label: 'Disqualified/Not a Fit ❌' }
  ];
  
  const meetingTypeOptions = [
    { value: 'discovery', label: 'Discovery Meeting' },
    { value: 'benefits-review', label: 'Benefits Review' },
    { value: 'proposal', label: 'Proposal Presentation' },
    { value: 'renewal', label: 'Renewal Discussion' },
    { value: 'referral', label: 'Referral Introduction' }
  ];
  
  // Demo data for showcasing functionality
  const demoCallData = {
    prospect: {
      companyName: "TechFlow Industries",
      contactName: "Sarah Mitchell",
      industry: "technology",
      persona: "benefits-optimizer" as const
    },
    callDuration: 847, // 14 minutes 7 seconds
    outcome: "meeting-booked",
    intel: "Company is growing rapidly (200 to 350 employees in 18 months). Current broker relationship is transactional. CFO is concerned about rising costs but Sarah wants better engagement tools.",
    bestTalkingPoint: "The employee engagement platform demo - she got excited about the wellness challenges and said 'This is exactly what our people need right now'",
    keyTakeaway: "They're ready to switch brokers for the right strategic partner. Decision timeline is their January renewal.",
    additionalInfo: {
      newContacts: "Mark Rodriguez (CFO) - final decision maker, David Kim (IT Director) - implementation",
      referrals: "She mentioned her sister's company might need help - CloudVision Systems",
      companyInsights: "Remote-first culture, young workforce (avg age 28), high turnover in Q1 last year",
      nextSteps: "Send benefits audit worksheet, schedule all-hands demo for next Friday",
      meetingType: "discovery",
      followUpDate: "2025-07-02"
    },
    competitiveEncounter: {
      competitorMentioned: "UnitedHealthcare",
      competitorStrengths: "They mentioned United's large network and technology platform",
      competitorWeaknesses: "Complained about poor customer service and generic solutions",
      switchingReasons: "Looking for more personalized service and better employee engagement",
      decisionFactors: "Service quality is more important than just cost",
      competitiveResponse: "Emphasized our local expertise and personalized approach vs. call centers"
    }
  };
  
  useEffect(() => {
    if (showDemoData) {
      setFormData({
        outcome: demoCallData.outcome,
        intel: demoCallData.intel,
        bestTalkingPoint: demoCallData.bestTalkingPoint,
        keyTakeaway: demoCallData.keyTakeaway,
        callDuration: demoCallData.callDuration,
        newContacts: demoCallData.additionalInfo.newContacts || '',
        referrals: demoCallData.additionalInfo.referrals || '',
        companyInsights: demoCallData.additionalInfo.companyInsights || '',
        nextSteps: demoCallData.additionalInfo.nextSteps || '',
        meetingType: demoCallData.additionalInfo.meetingType || '',
        followUpDate: demoCallData.additionalInfo.followUpDate || '',
        // Competitive intelligence
        competitorMentioned: demoCallData.competitiveEncounter?.competitorMentioned || '',
        competitorStrengths: demoCallData.competitiveEncounter?.competitorStrengths || '',
        competitorWeaknesses: demoCallData.competitiveEncounter?.competitorWeaknesses || '',
        switchingReasons: demoCallData.competitiveEncounter?.switchingReasons || '',
        decisionFactors: demoCallData.competitiveEncounter?.decisionFactors || '',
        competitiveResponse: demoCallData.competitiveEncounter?.competitiveResponse || ''
      });
    }
  }, [showDemoData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.outcome) {
      newErrors.outcome = 'Call outcome is required';
    }
    
    if (!formData.keyTakeaway.trim()) {
      newErrors.keyTakeaway = 'Key takeaway is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    const callLog: CallLog = {
      id: Date.now().toString(),
      leadId: prospect?.companyName || 'unknown',
      outcome: formData.outcome as CallLog['outcome'],
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
      },
      competitiveEncounter: formData.competitorMentioned ? {
        competitorMentioned: formData.competitorMentioned,
        competitorStrengths: formData.competitorStrengths,
        competitorWeaknesses: formData.competitorWeaknesses,
        switchingReasons: formData.switchingReasons,
        decisionFactors: formData.decisionFactors,
        competitiveResponse: formData.competitiveResponse
      } : undefined
    };
    
    try {
      await addCallLog(callLog);
      
      // Track activity based on outcome
      if (user) {
        trackCallMade(user, {
          companyName: prospect?.companyName || 'Unknown',
          contactName: prospect?.contactName || 'Unknown',
          outcome: formData.outcome,
          duration: formData.callDuration
        });
        
        if (formData.outcome === 'meeting-booked') {
          trackMeetingBooked(user, {
            companyName: prospect?.companyName || 'Unknown',
            contactName: prospect?.contactName || 'Unknown',
            meetingType: formData.meetingType
          });
        }
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
        // Competitive intelligence fields
        competitorMentioned: '',
        competitorStrengths: '',
        competitorWeaknesses: '',
        switchingReasons: '',
        decisionFactors: '',
        competitiveResponse: ''
      });
      setShowDemoData(false);
      
      // Show success message (could be improved with a toast)
      alert('Call log saved successfully!');
    } catch (error) {
      console.error('Error saving call log:', error);
      alert('Call log saved locally, but failed to sync to database. Check console for details.');
    }
  };

  // const recentLogs = callLogs.slice(-5).reverse(); // Now using filteredCallLogs
  
  // KPI Calculations
  const totalCalls = callLogs.length;
  const meetingsBooked = callLogs.filter(log => log.outcome === 'meeting-booked').length;
  const followUps = callLogs.filter(log => log.outcome === 'follow-up').length;
  const nurtures = callLogs.filter(log => log.outcome === 'nurture').length;
  const avgCallDuration = callLogs.length > 0 
    ? callLogs.reduce((sum, log) => sum + (log.callDuration || 0), 0) / callLogs.length 
    : 0;
  const successRate = totalCalls > 0 ? ((meetingsBooked + followUps) / totalCalls * 100) : 0;
  
  // Generate insights
  const callInsights = generateCallInsights(callLogs);
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleExportCallLogs = () => {
    exportCallLogsToCSV(callLogs);
  };
  
  const handleExportPerformance = () => {
    exportPerformanceMetricsToCSV(callLogs);
  };
  
  const handleExportComplete = () => {
    exportCompleteDataset(callLogs, battleCards);
  };

  const handleClearHistory = () => {
    // Clear all call logs from the store
    clearCallLogs();
    setShowClearConfirm(false);
    setFilteredCallLogs([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Post-Game Analysis</h1>
        <p className="text-lg text-gray-600">
          Capture intelligence and reinforce your winning mindset
        </p>
        {/* Demo Data Toggle and Export Options */}
        <div className="mt-4 space-y-3">
          <div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowDemoData(!showDemoData)}
              className="text-sm"
            >
              {showDemoData ? 'Clear Demo Data' : 'Load Demo Data'}
            </Button>
            <p className="text-xs text-gray-500 mt-1">Experience the full functionality with sample data</p>
          </div>
          
          {callLogs.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportCallLogs}
                className="text-sm flex items-center space-x-1"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Export Call Logs</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportPerformance}
                className="text-sm flex items-center space-x-1"
              >
                <BarChart className="w-4 h-4" />
                <span>Export Metrics</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExportComplete}
                className="text-sm flex items-center space-x-1"
              >
                <Download className="w-4 h-4" />
                <span>Export All</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Current Call Log */}
      <Card 
        title="Call Debrief" 
        subtitle={prospect ? `Log your call with ${prospect.companyName}` : 'Complete a hunt first to log call results'}
      >
        {prospect ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Call Outcome"
                value={formData.outcome}
                onChange={(value) => setFormData({ ...formData, outcome: value })}
                options={outcomeOptions}
                placeholder="Select outcome..."
                required
                error={errors.outcome}
              />
              
              <Input
                label="Call Duration (seconds)"
                type="number"
                value={formData.callDuration.toString()}
                onChange={(value) => setFormData({ ...formData, callDuration: parseInt(value) || 0 })}
                placeholder="e.g., 847 (14 min 7 sec)"
              />
            </div>
            
            <Input
              label="New Intel Gathered"
              value={formData.intel}
              onChange={(value) => setFormData({ ...formData, intel: value })}
              placeholder="What did you learn about their business, challenges, or decision-making process?"
            />
            
            <Input
              label="Best Talking Point / Objection Breaker"
              value={formData.bestTalkingPoint}
              onChange={(value) => setFormData({ ...formData, bestTalkingPoint: value })}
              placeholder="Which talking point or objection handler resonated most?"
            />
            
            <Input
              label="Key Takeaway"
              value={formData.keyTakeaway}
              onChange={(value) => setFormData({ ...formData, keyTakeaway: value })}
              placeholder="What's the single most important thing you learned from this call?"
              required
              error={errors.keyTakeaway}
            />
            
            {/* Additional Success Information */}
            {formData.outcome === 'meeting-booked' && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-3">🎯 Meeting Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Meeting Type"
                    value={formData.meetingType}
                    onChange={(value) => setFormData({ ...formData, meetingType: value })}
                    options={meetingTypeOptions}
                    placeholder="Select meeting type..."
                  />
                  <Input
                    label="Follow-up Date"
                    type="date"
                    value={formData.followUpDate}
                    onChange={(value) => setFormData({ ...formData, followUpDate: value })}
                    placeholder="Meeting date"
                  />
                </div>
              </div>
            )}
            
            {/* Advanced Intelligence Gathering */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-3">💡 Advanced Intelligence</h4>
              <div className="space-y-4">
                <Input
                  label="New Contacts Discovered"
                  value={formData.newContacts}
                  onChange={(value) => setFormData({ ...formData, newContacts: value })}
                  placeholder="Names, titles, and roles of new contacts mentioned"
                />
                <Input
                  label="Referrals Received"
                  value={formData.referrals}
                  onChange={(value) => setFormData({ ...formData, referrals: value })}
                  placeholder="Any referrals or connections they mentioned"
                />
                <Input
                  label="Company Insights"
                  value={formData.companyInsights}
                  onChange={(value) => setFormData({ ...formData, companyInsights: value })}
                  placeholder="Growth plans, challenges, company culture insights"
                />
                <Input
                  label="Next Steps"
                  value={formData.nextSteps}
                  onChange={(value) => setFormData({ ...formData, nextSteps: value })}
                  placeholder="Specific actions you committed to take"
                />
              </div>
            </div>

            {/* Competitive Intelligence */}
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="font-semibold text-orange-900 mb-3">🛡️ Competitive Intelligence</h4>
              <div className="space-y-4">
                <Input
                  label="Competitor Mentioned"
                  value={formData.competitorMentioned}
                  onChange={(value) => setFormData({ ...formData, competitorMentioned: value })}
                  placeholder="e.g., UnitedHealthcare, Humana, local broker name"
                />
                <Input
                  label="Competitor Strengths Mentioned"
                  value={formData.competitorStrengths}
                  onChange={(value) => setFormData({ ...formData, competitorStrengths: value })}
                  placeholder="What did they say the competitor does well?"
                />
                <Input
                  label="Competitor Weaknesses Mentioned"
                  value={formData.competitorWeaknesses}
                  onChange={(value) => setFormData({ ...formData, competitorWeaknesses: value })}
                  placeholder="What complaints or issues did they mention?"
                />
                <Input
                  label="Reasons for Switching"
                  value={formData.switchingReasons}
                  onChange={(value) => setFormData({ ...formData, switchingReasons: value })}
                  placeholder="Why are they considering a change?"
                />
                <Input
                  label="Decision Factors"
                  value={formData.decisionFactors}
                  onChange={(value) => setFormData({ ...formData, decisionFactors: value })}
                  placeholder="What factors are most important in their decision?"
                />
                <Input
                  label="Your Competitive Response"
                  value={formData.competitiveResponse}
                  onChange={(value) => setFormData({ ...formData, competitiveResponse: value })}
                  placeholder="How did you position against the competitor?"
                />
              </div>
            </div>
            
            <Button onClick={handleSubmit} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Call Log
            </Button>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No active prospect. Complete the Planner first.</p>
          </div>
        )}
      </Card>

      {/* Enhanced Call History with Search */}
      <Card 
        title="Call History" 
        subtitle={`${filteredCallLogs.length} of ${callLogs.length} calls`}
      >
        {callLogs.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-6">
              <EnhancedSearch
                data={callLogs}
                onFilteredData={(filtered) => setFilteredCallLogs(filtered as CallLog[])}
                type="calls"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowClearConfirm(true)}
                className="text-red-600 hover:text-red-700 ml-4"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear History
              </Button>
            </div>
          </>
        )}
        
        {/* Filtered Call History */}
        {filteredCallLogs.length > 0 ? (
          <div className="space-y-4">
            {filteredCallLogs.slice(0, 10).map((log) => (
              <div 
                key={log.id} 
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{log.leadId}</h4>
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{format(log.createdAt, 'MMM d, yyyy')}</span>
                      </div>
                      {log.startTime && log.endTime && (
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>
                            {format(log.startTime, 'h:mm a')} - {format(log.endTime, 'h:mm a')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    log.outcome === 'meeting-booked' 
                      ? 'bg-green-100 text-green-800'
                      : log.outcome === 'follow-up'
                      ? 'bg-blue-100 text-blue-800'
                      : log.outcome === 'nurture'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {outcomeOptions.find(opt => opt.value === log.outcome)?.label || log.outcome}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  {log.callDuration && (
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Duration: {formatDuration(log.callDuration)}</span>
                      </div>
                      {log.attemptNumber && (
                        <span>Attempt #{log.attemptNumber}</span>
                      )}
                    </div>
                  )}
                  
                  {log.intel && (
                    <div>
                      <span className="font-medium text-gray-700">Intel:</span>
                      <span className="text-gray-600 ml-2">{log.intel}</span>
                    </div>
                  )}
                  
                  {log.bestTalkingPoint && (
                    <div>
                      <span className="font-medium text-gray-700">Best Point:</span>
                      <span className="text-gray-600 ml-2">{log.bestTalkingPoint}</span>
                    </div>
                  )}
                  
                  <div>
                    <span className="font-medium text-gray-700">Key Takeaway:</span>
                    <span className="text-gray-600 ml-2">{log.keyTakeaway}</span>
                  </div>
                  
                  {/* Additional Info */}
                  {log.additionalInfo && (
                    <div className="mt-3 pt-2 border-t border-gray-100">
                      {log.additionalInfo.newContacts && (
                        <div className="mb-1">
                          <span className="font-medium text-gray-700">New Contacts:</span>
                          <span className="text-gray-600 ml-2 text-xs">{log.additionalInfo.newContacts}</span>
                        </div>
                      )}
                      {log.additionalInfo.referrals && (
                        <div className="mb-1">
                          <span className="font-medium text-gray-700">Referrals:</span>
                          <span className="text-gray-600 ml-2 text-xs">{log.additionalInfo.referrals}</span>
                        </div>
                      )}
                      {log.additionalInfo.nextSteps && (
                        <div>
                          <span className="font-medium text-gray-700">Next Steps:</span>
                          <span className="text-gray-600 ml-2 text-xs">{log.additionalInfo.nextSteps}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Competitive Intelligence */}
                  {log.competitiveEncounter && log.competitiveEncounter.competitorMentioned && (
                    <div className="mt-3 pt-2 border-t border-orange-100">
                      <div className="mb-2">
                        <span className="font-medium text-orange-700">🛡️ Competitor:</span>
                        <span className="text-orange-600 ml-2 text-xs font-medium">{log.competitiveEncounter.competitorMentioned}</span>
                      </div>
                      {log.competitiveEncounter.competitorWeaknesses && (
                        <div className="mb-1">
                          <span className="font-medium text-gray-700">Weakness:</span>
                          <span className="text-gray-600 ml-2 text-xs">{log.competitiveEncounter.competitorWeaknesses}</span>
                        </div>
                      )}
                      {log.competitiveEncounter.competitiveResponse && (
                        <div>
                          <span className="font-medium text-gray-700">Response:</span>
                          <span className="text-gray-600 ml-2 text-xs">{log.competitiveEncounter.competitiveResponse}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No call logs yet. Complete your first call debrief to start tracking your performance.</p>
          </div>
        )}
      </Card>

      {/* Clear History Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Clear Call History?
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              This will permanently delete all {callLogs.length} call logs. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowClearConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={handleClearHistory}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All History
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Performance Dashboard */}
      {callLogs.length > 0 && (
        <Card title="Performance Dashboard" subtitle="Your calling performance and KPIs">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {meetingsBooked}
              </div>
              <div className="text-sm text-green-800">Meetings Booked</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {followUps}
              </div>
              <div className="text-sm text-blue-800">Follow-ups</div>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {nurtures}
              </div>
              <div className="text-sm text-yellow-800">Nurtures</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {successRate.toFixed(1)}%
              </div>
              <div className="text-sm text-purple-800">Success Rate</div>
            </div>
            
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">
                {formatDuration(Math.round(avgCallDuration))}
              </div>
              <div className="text-sm text-indigo-800">Avg Duration</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">
                {totalCalls}
              </div>
              <div className="text-sm text-gray-800">Total Calls</div>
            </div>
          </div>
          
          {/* Success Rate Analysis */}
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <Award className="w-6 h-6 text-primary-600" />
              <h4 className="font-semibold text-primary-900">Performance Analysis</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-primary-800">• <strong>Positive Outcomes:</strong> {meetingsBooked + followUps} calls ({((meetingsBooked + followUps) / Math.max(totalCalls, 1) * 100).toFixed(1)}%)</p>
                <p className="text-primary-800">• <strong>Meeting Conversion:</strong> {(meetingsBooked / Math.max(totalCalls, 1) * 100).toFixed(1)}% of all calls</p>
              </div>
              <div>
                <p className="text-primary-800">• <strong>Pipeline Building:</strong> {nurtures} prospects in nurture</p>
                <p className="text-primary-800">• <strong>Call Efficiency:</strong> {avgCallDuration > 0 ? `${formatDuration(Math.round(avgCallDuration))} average` : 'Track durations for insights'}</p>
              </div>
            </div>
            
            {/* Call Insights */}
            {callInsights.length > 0 && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Lightbulb className="w-6 h-6 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">Performance Insights</h4>
                </div>
                <div className="space-y-2">
                  {callInsights.map((insight, index) => (
                    <p key={index} className="text-sm text-blue-800">{insight}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Success Mindset Reinforcement */}
      <Card title="Success Mindset" subtitle="Remember: Every call is a victory">
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Lightbulb className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-primary-900 mb-2">Every Call Yields Value</h4>
              <ul className="space-y-1 text-sm text-primary-800">
                <li>• <strong>Meeting Booked:</strong> Direct path to new business</li>
                <li>• <strong>Follow-up Scheduled:</strong> Relationship building opportunity</li>
                <li>• <strong>Nurture Campaign:</strong> Long-term pipeline development</li>
                <li>• <strong>Disqualified:</strong> Time saved, focus sharpened</li>
              </ul>
              <p className="text-sm text-primary-700 mt-3 italic">
                "The goal isn't just to make a sale—it's to become smarter, more strategic, and more valuable with every conversation."
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PostGame;