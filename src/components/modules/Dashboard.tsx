import React, { useState, useMemo, useEffect } from 'react';
import { Phone, Target, Trophy, Calendar, Clock, Users, Zap, PieChart, DollarSign, AlertTriangle, Activity, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Toggle from '@/components/common/Toggle';
import { useAppStore } from '@/store';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { TeamActivityFeed } from '@/components/analytics/TeamActivityFeed';
import { BentoGrid, BentoCard, BentoMetric, BentoChart, BentoHero } from '@/components/common/BentoGrid';
import { 
  calculateRevenueMetrics, 
  calculateSuccessRateMetrics, 
  generateDashboardAlerts, 
  formatCurrency, 
  calculatePerformanceScore 
} from '@/utils/dashboardMetrics';

const Dashboard: React.FC = () => {
  const { callLogs, battleCards, setCurrentModule, salesWizardMode, setSalesWizardMode } = useAppStore();
  const { user } = useAuth();
  const [showDetailedMetrics, setShowDetailedMetrics] = useState(false);
  const [showActivityFeed, setShowActivityFeed] = useState(() => {
    // Load preference from localStorage
    const saved = localStorage.getItem('showActivityFeed');
    return saved !== null ? JSON.parse(saved) : false; // Default to hidden
  });
  
  // Save preference when it changes
  useEffect(() => {
    localStorage.setItem('showActivityFeed', JSON.stringify(showActivityFeed));
  }, [showActivityFeed]);
  
  // Calculate comprehensive metrics
  const revenueMetrics = useMemo(() => calculateRevenueMetrics(callLogs, battleCards, []), [callLogs, battleCards]);
  const successMetrics = useMemo(() => calculateSuccessRateMetrics(callLogs), [callLogs]);
  const alerts = useMemo(() => generateDashboardAlerts(callLogs, successMetrics, revenueMetrics), [callLogs, successMetrics, revenueMetrics]);
  
  // Legacy statistics for backward compatibility
  const totalCalls = callLogs.length;
  const successfulCalls = callLogs.filter(log => log.outcome === 'meeting-booked').length;
  const successRate = totalCalls > 0 ? (successfulCalls / totalCalls * 100) : 0;
  const todayCalls = callLogs.filter(log => {
    const today = new Date().toDateString();
    return new Date(log.createdAt).toDateString() === today;
  }).length;
  
  // Calculate performance score
  const performanceScore = calculatePerformanceScore(successRate, totalCalls, revenueMetrics.totalPipeline);
  
  // Get recent activity
  const recentCalls = callLogs.slice(-5).reverse();
  
  // Get current hour for personalized greeting
  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return 'Good morning';
    if (currentHour < 17) return 'Good afternoon';
    return 'Good evening';
  };
  
  // Standard 3-step workflow
  const standardWorkflowSteps = [
    {
      number: 1,
      title: 'Plan Your Call',
      description: 'Research prospects, generate battle cards, and prepare your strategy',
      icon: Target,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      module: 'call-planner' as const,
      tooltip: 'Start here to research your prospects and create personalized call strategies'
    },
    {
      number: 2,
      title: 'Select Leads',
      description: 'Organize your call sequence and prioritize high-value prospects',
      icon: Calendar,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      module: 'call-planner' as const,
      tooltip: 'Plan your call sequence and organize prospects for maximum efficiency'
    },
    {
      number: 3,
      title: 'Make Calls',
      description: 'Use your battle cards and live assistance during calls',
      icon: Phone,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      module: 'battle-card' as const,
      tooltip: 'View your battle cards and access live call support tools'
    }
  ];

  // Sales Wizard 4-step workflow
  const salesWizardWorkflowSteps = [
    {
      number: 1,
      title: 'Plan',
      description: 'Research prospects and gather intelligence for strategic preparation',
      icon: Target,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      module: 'call-planner' as const,
      tooltip: 'Hunt Planner: Research prospects and create personalized call strategies'
    },
    {
      number: 2,
      title: 'Guide',
      description: 'Select leads and organize your call sequence for maximum impact',
      icon: Calendar,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      module: 'call-planner' as const,
      tooltip: 'Lead Selection: Plan your call sequence and prioritize high-value prospects'
    },
    {
      number: 3,
      title: 'Call',
      description: 'Execute calls with battle cards and live assistance support',
      icon: Phone,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      module: 'live-call' as const,
      tooltip: 'Call Assistance: Use your battle cards and get real-time support'
    },
    {
      number: 4,
      title: 'Analyze',
      description: 'Review call results and extract insights for continuous improvement',
      icon: PieChart,
      color: 'from-orange-400 to-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      module: 'post-game' as const,
      tooltip: 'Post-Game Analysis: Log outcomes and analyze performance for better results'
    }
  ];

  // Use the appropriate workflow based on mode
  const workflowSteps = salesWizardMode ? salesWizardWorkflowSteps : standardWorkflowSteps;
  
  // Generate weekly performance data from actual call logs
  const generateWeeklyData = () => {
    const today = new Date();
    const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    
    const weeklyData = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      
      const dayLogs = callLogs.filter(log => {
        const logDate = new Date(log.createdAt);
        return logDate.toDateString() === day.toDateString();
      });
      
      const successfulCalls = dayLogs.filter(log => 
        log.outcome === 'meeting-booked' || log.outcome === 'follow-up'
      ).length;
      
      weeklyData.push({
        day: dayNames[i],
        calls: dayLogs.length,
        success: successfulCalls
      });
    }
    
    return weeklyData;
  };
  
  const weeklyData = generateWeeklyData();
  
  // Calculate trends based on actual data
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return { trend: '0%', trendUp: false };
    const change = ((current - previous) / previous) * 100;
    const trend = change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
    return { trend, trendUp: change > 0 };
  };
  
  // Calculate previous week's stats for trend comparison
  const getPreviousWeekStats = () => {
    const today = new Date();
    const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() - 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const previousWeekLogs = callLogs.filter(log => {
      const logDate = new Date(log.createdAt);
      return logDate >= weekStart && logDate <= weekEnd;
    });
    
    const previousWeekSuccessful = previousWeekLogs.filter(log => 
      log.outcome === 'meeting-booked' || log.outcome === 'follow-up'
    ).length;
    
    return {
      calls: previousWeekLogs.length,
      successRate: previousWeekLogs.length > 0 ? (previousWeekSuccessful / previousWeekLogs.length * 100) : 0
    };
  };
  
  const previousWeekStats = getPreviousWeekStats();
  const currentWeekCalls = weeklyData.reduce((sum, day) => sum + day.calls, 0);
  const currentWeekSuccess = weeklyData.reduce((sum, day) => sum + day.success, 0);
  const currentWeekSuccessRate = currentWeekCalls > 0 ? (currentWeekSuccess / currentWeekCalls * 100) : 0;
  
  const callsTrend = calculateTrend(currentWeekCalls, previousWeekStats.calls);
  const successTrend = calculateTrend(currentWeekSuccessRate, previousWeekStats.successRate);
  
  // For new users, don't show trends until they have some data
  const isNewUser = callLogs.length === 0;
  
  // Executive-level metrics
  const executiveStats = [
    {
      label: 'Revenue Pipeline',
      value: formatCurrency(revenueMetrics.totalPipeline),
      icon: DollarSign,
      color: 'bg-green-500',
      trend: null,
      trendUp: false,
      description: 'Total weighted pipeline value'
    },
    {
      label: 'Success Rate',
      value: `${successMetrics.current.toFixed(1)}%`,
      icon: Trophy,
      color: 'bg-blue-500',
      trend: successMetrics.trend === 'up' ? `+${successMetrics.trendPercentage.toFixed(1)}%` : 
             successMetrics.trend === 'down' ? `-${successMetrics.trendPercentage.toFixed(1)}%` : null,
      trendUp: successMetrics.trend === 'up',
      description: 'Weekly success rate trend'
    },
    {
      label: 'Avg Deal Size',
      value: formatCurrency(revenueMetrics.averageDealSize),
      icon: Target,
      color: 'bg-purple-500',
      trend: null,
      trendUp: false,
      description: 'Average potential deal value'
    },
    {
      label: 'Performance Score',
      value: performanceScore,
      icon: Activity,
      color: 'bg-orange-500',
      trend: null,
      trendUp: false,
      description: 'Overall performance rating'
    }
  ];
  
  // Legacy stats for basic view
  const basicStats = [
    {
      label: 'Total Calls',
      value: totalCalls,
      icon: Phone,
      color: 'bg-blue-500',
      trend: isNewUser ? null : callsTrend.trend,
      trendUp: callsTrend.trendUp,
      description: 'All calls made'
    },
    {
      label: 'Success Rate',
      value: `${successRate.toFixed(1)}%`,
      icon: Trophy,
      color: 'bg-green-500',
      trend: isNewUser ? null : successTrend.trend,
      trendUp: successTrend.trendUp,
      description: 'Meeting booking rate'
    },
    {
      label: 'Today\'s Calls',
      value: todayCalls,
      icon: Calendar,
      color: 'bg-purple-500',
      trend: null,
      trendUp: false,
      description: 'Calls made today'
    },
    {
      label: 'Battle Cards',
      value: battleCards.length,
      icon: Target,
      color: 'bg-orange-500',
      trend: null,
      trendUp: false,
      description: 'Battle cards created'
    }
  ];
  
  const stats = showDetailedMetrics ? executiveStats : basicStats;
  
  return (
    <div className="flex gap-6 relative">
      {/* Main content area */}
      <div className={`${showActivityFeed ? 'flex-1' : 'w-full'} transition-all duration-300`}>
        <BentoGrid variant="default" className="mb-6">
          {/* Welcome Hero */}
          <BentoHero
            title={`${getGreeting()}, ${user?.name || 'Sales Champion'}!`}
            subtitle="Welcome to your W.O.L.F - Your Sales Intelligence Platform"
            delay={0}
          >
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => setCurrentModule('call-planner')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl font-semibold transition-all duration-200 backdrop-blur-sm"
              >
                Start Planning
              </motion.button>
              <motion.button
                onClick={() => setCurrentModule('help-center')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-transparent border border-white/30 hover:border-white/50 text-white rounded-xl font-semibold transition-all duration-200"
              >
                Learn More
              </motion.button>
            </div>
          </BentoHero>
          
          {/* Key Metrics */}
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <BentoMetric
                key={stat.label}
                label={stat.label}
                value={stat.value}
                icon={<Icon size={20} />}
                trend={stat.trend ? {
                  value: stat.trend,
                  up: stat.trendUp
                } : undefined}
                color={
                  stat.color.includes('green') ? 'success' :
                  stat.color.includes('blue') ? 'info' :
                  stat.color.includes('purple') ? 'primary' :
                  stat.color.includes('orange') ? 'warning' :
                  'primary'
                }
                size={index === 0 ? 'md' : 'sm'}
                delay={0.1 + index * 0.05}
              />
            );
          })}
          
          {/* Workflow Steps */}
          <BentoCard
            title="Your Sales Workflow"
            subtitle={salesWizardMode ? 'Follow these four guided steps to sales mastery' : 'Follow these three simple steps to sales success'}
            size="wide"
            delay={0.2}
            action={
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-neutral-600 dark:text-neutral-400">Standard</span>
                  <Toggle
                    enabled={salesWizardMode}
                    onChange={setSalesWizardMode}
                    size="sm"
                  />
                  <div className="flex items-center space-x-1">
                    <Zap size={14} className="text-primary-600 dark:text-primary-400" />
                    <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Sales Wizard</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-neutral-600 dark:text-neutral-400">Basic</span>
                  <Toggle
                    enabled={showDetailedMetrics}
                    onChange={setShowDetailedMetrics}
                    size="sm"
                  />
                  <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Executive</span>
                </div>
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {workflowSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.button
                    key={step.number}
                    onClick={() => setCurrentModule(step.module)}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 rounded-xl bg-white/60 dark:bg-neutral-800/60 border border-white/30 dark:border-neutral-700/30 hover:border-primary-400/50 transition-all duration-200 text-left group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${step.color} rounded-lg flex items-center justify-center text-white shadow-lg`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Step {step.number}</span>
                        </div>
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </BentoCard>
          
        </BentoGrid>
        
        {/* Additional Sections */}
        <BentoGrid variant="default" className="mb-6">
          
          {/* Alerts Section */}
          {alerts.length > 0 && (
            <BentoCard
              title="Performance Alerts"
              icon={<AlertTriangle size={20} className="text-red-500" />}
              size="lg"
              delay={0.3}
            >
              <div className="space-y-3">
                {alerts.slice(0, 3).map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border-l-4 ${
                      alert.severity === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                      alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                      'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm text-neutral-900 dark:text-neutral-100">{alert.title}</h4>
                        <p className="text-xs text-neutral-600 dark:text-neutral-300">{alert.message}</p>
                      </div>
                      {alert.actionRequired && (
                        <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 px-2 py-1 rounded-full">
                          Action Required
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </BentoCard>
          )}
          
          {/* Pipeline Chart */}
          {showDetailedMetrics && (
            <BentoChart
              title="Pipeline by Stage"
              size="lg"
              glowing
              delay={0.4}
            >
              <div className="space-y-4">
                {revenueMetrics.pipelineByStage.map((stage, stageIndex) => {
                  const maxValue = Math.max(...revenueMetrics.pipelineByStage.map(s => s.value));
                  const widthPercentage = maxValue > 0 ? (stage.value / maxValue) * 100 : 0;
                  
                  return (
                    <div key={stage.stage} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">{stage.stage}</span>
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">{stage.count} prospects</span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-6 overflow-hidden">
                        <div 
                          className={`h-full rounded-full flex items-center justify-between px-3 transition-all duration-500 ${
                            stageIndex === 0 ? 'bg-yellow-500' :
                            stageIndex === 1 ? 'bg-blue-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${Math.max(widthPercentage, 10)}%` }}
                        >
                          <span className="text-xs text-white font-medium">{formatCurrency(stage.value)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </BentoChart>
          )}
          
          {/* Recent Activity */}
          <BentoCard
            title="Recent Activity"
            icon={<Clock size={20} className="text-neutral-500" />}
            size="lg"
            delay={0.5}
          >
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {recentCalls.length > 0 ? (
                recentCalls.slice(0, 5).map((call, index) => {
                  const battleCard = battleCards.find(bc => 
                    bc.generatedAt && 
                    Math.abs(new Date(bc.generatedAt).getTime() - new Date(call.createdAt).getTime()) < 3600000
                  );
                  const lead = battleCard?.lead;
                  
                  return (
                    <div key={index} className="flex items-start justify-between py-2 border-b border-neutral-100 dark:border-neutral-700 last:border-0">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-neutral-900 dark:text-neutral-100">
                          {lead ? lead.companyName : `Call #${callLogs.length - index}`}
                        </p>
                        {lead && (
                          <p className="text-xs text-neutral-600 dark:text-neutral-300">
                            {lead.contactName} • {lead.contactPosition || 'Contact'}
                          </p>
                        )}
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                          {call.keyTakeaway}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          call.outcome === 'meeting-booked' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : call.outcome === 'follow-up'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {call.outcome}
                        </span>
                        <p className="text-xs text-neutral-500 dark:text-neutral-300 mt-1">
                          {new Date(call.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                  <Users size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No recent calls yet</p>
                  <p className="text-sm mt-1">Start making calls to see your activity here</p>
                </div>
              )}
            </div>
          </BentoCard>
          
        </BentoGrid>
        
      </div>
      
      {/* Toggle Button for Activity Feed */}
      <motion.button
        onClick={() => setShowActivityFeed(!showActivityFeed)}
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-l-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 ${
          showActivityFeed ? 'translate-x-0' : 'translate-x-0'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {showActivityFeed ? (
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        ) : (
          <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        )}
      </motion.button>
      
      {/* Activity Feed Sidebar - Now Toggleable */}
      <AnimatePresence>
        {showActivityFeed && (
          <motion.div 
            className="w-80"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="sticky top-6 h-[calc(100vh-8rem)]">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden h-full">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                    <Users className="w-5 h-5 mr-2 text-primary-600" />
                    Team Activity
                  </h3>
                  <button
                    onClick={() => setShowActivityFeed(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <TeamActivityFeed 
                  className="h-[calc(100%-65px)]" 
                  compact={true}
                  limit={20}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
