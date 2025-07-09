import React, { useState, useMemo } from 'react';
import { TrendingUp, Phone, Target, Trophy, Calendar, Clock, Users, BarChart3, ArrowRight, HelpCircle, ChevronRight, Info, Zap, PieChart, DollarSign, AlertTriangle, CheckCircle, Activity, TrendingDown } from 'lucide-react';
import Card from '@/components/common/Card';
import EmptyState from '@/components/common/EmptyState';
import Toggle from '@/components/common/Toggle';
import DealScoreBadge from '@/components/common/DealScoreBadge';
import { useAppStore } from '@/store';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { DealScoringService } from '@/services/dealScoring';
import { TeamActivityFeed } from '@/components/analytics/TeamActivityFeed';
import { 
  calculateRevenueMetrics, 
  calculateSuccessRateMetrics, 
  calculatePersonaPerformance, 
  generateDashboardInsights, 
  generateDashboardAlerts, 
  formatCurrency, 
  calculatePerformanceScore 
} from '@/utils/dashboardMetrics';

const Dashboard: React.FC = () => {
  const { callLogs, battleCards, setCurrentModule, prospect, salesWizardMode, setSalesWizardMode } = useAppStore();
  const { user } = useAuth();
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [showDetailedMetrics, setShowDetailedMetrics] = useState(false);
  
  // Calculate comprehensive metrics
  const revenueMetrics = useMemo(() => calculateRevenueMetrics(callLogs, battleCards, []), [callLogs, battleCards]);
  const successMetrics = useMemo(() => calculateSuccessRateMetrics(callLogs), [callLogs]);
  const personaMetrics = useMemo(() => calculatePersonaPerformance(callLogs, battleCards), [callLogs, battleCards]);
  const insights = useMemo(() => generateDashboardInsights(callLogs, battleCards, revenueMetrics, successMetrics, personaMetrics), [callLogs, battleCards, revenueMetrics, successMetrics, personaMetrics]);
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
    <div className="flex gap-6">
      {/* Main content area */}
      <div className="flex-1 space-y-6">
      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl p-6 border border-primary-200 dark:border-primary-700"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {getGreeting()}, {user?.name || 'Sales Champion'}!
            </h1>
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              Welcome to your W.O.L.F - Your Sales Intelligence Platform
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
              Ready to turn cold calls into warm conversations? Follow the simple workflow below to get started.
            </p>
          </div>
          <div className="ml-4">
            <TrendingUp className="text-primary-600 dark:text-primary-400" size={32} />
          </div>
        </div>
      </motion.div>

      {/* Workflow Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Your Sales Workflow</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
              {salesWizardMode ? 'Follow these four guided steps to sales mastery' : 'Follow these three simple steps to sales success'}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-700 dark:text-gray-300">Standard</span>
              <Toggle
                enabled={salesWizardMode}
                onChange={setSalesWizardMode}
                size="md"
              />
              <div className="flex items-center space-x-1">
                <Zap size={16} className="text-primary-600 dark:text-primary-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sales Wizard</span>
              </div>
            </div>
            <button
              onClick={() => setCurrentModule('help-center')}
              className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              <HelpCircle size={16} />
              <span>Need help?</span>
            </button>
          </div>
        </div>

        <div className={`grid grid-cols-1 gap-4 ${
          salesWizardMode ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-3'
        }`}>
          {workflowSteps.map((step, index) => {
            const Icon = step.icon;
            const isHovered = hoveredStep === step.number;
            
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Connector Line */}
                {index < workflowSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-gray-300 dark:bg-gray-600 z-0 transform -translate-y-1/2">
                    <ChevronRight className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                  </div>
                )}
                
                <motion.button
                  onClick={() => setCurrentModule(step.module)}
                  onMouseEnter={() => setHoveredStep(step.number)}
                  onMouseLeave={() => setHoveredStep(null)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative w-full p-6 rounded-xl border-2 ${step.borderColor} ${step.bgColor} dark:bg-gray-800 transition-all duration-200 cursor-pointer group`}
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg shadow-lg z-10 whitespace-nowrap"
                    >
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900 dark:bg-gray-700"></div>
                      {step.tooltip}
                    </motion.div>
                  )}
                  
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${step.color} rounded-lg flex items-center justify-center text-white shadow-lg`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Step {step.number}</span>
                        <ArrowRight size={14} className="text-gray-400 dark:text-gray-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Tips for New Users */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700"
        >
          <div className="flex items-start space-x-3">
            <Info className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                {salesWizardMode ? 'Sales Wizard Mode - Guided Experience' : 'Pro Tip for New Users'}
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {salesWizardMode 
                  ? 'The Sales Wizard guides you through our proven 4-step process: Plan your strategy, Guide your lead selection, Call with confidence, and Analyze your results. Each step builds upon the last to maximize your sales success.'
                  : 'Start with the Planner to research your prospects and generate personalized battle cards. These cards will be your secret weapon during calls, providing instant access to talking points, objection handlers, and industry insights tailored to each prospect\'s persona.'
                }
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Executive Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Executive Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Revenue-focused KPIs and performance metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">Basic</span>
            <Toggle
              enabled={showDetailedMetrics}
              onChange={setShowDetailedMetrics}
              size="sm"
            />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Executive</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <Clock size={16} />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{stat.value}</p>
                    {stat.trend && (
                      <div className="flex items-center mt-2">
                        {stat.trendUp ? (
                          <TrendingUp size={14} className="text-green-500" />
                        ) : (
                          <TrendingDown size={14} className="text-red-500" />
                        )}
                        <span className={`text-sm ml-1 ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                          {stat.trend}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-300 ml-1">vs last week</span>
                      </div>
                    )}
                    {!stat.trend && isNewUser && (
                      <div className="flex items-center mt-2">
                        <span className="text-sm text-gray-500 dark:text-gray-300">Start tracking your progress</span>
                      </div>
                    )}
                    {stat.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.description}</p>
                    )}
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                    <Icon size={24} className={`${stat.color.replace('bg-', 'text-')}`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
      
      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Performance Alerts</h3>
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`border-l-4 ${
                  alert.severity === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                  alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                  'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle size={20} className={`${
                        alert.severity === 'high' ? 'text-red-500' :
                        alert.severity === 'medium' ? 'text-yellow-500' :
                        'text-blue-500'
                      }`} />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{alert.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{alert.message}</p>
                      </div>
                    </div>
                    {alert.actionRequired && (
                      <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 px-2 py-1 rounded-full">
                        Action Required
                      </span>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      {/* Insights Section */}
      {insights.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Quick Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`${
                  insight.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' :
                  insight.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700' :
                  insight.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700' :
                  'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                }`}>
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      insight.type === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
                      insight.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                      insight.type === 'error' ? 'bg-red-100 dark:bg-red-900/30' :
                      'bg-blue-100 dark:bg-blue-900/30'
                    }`}>
                      {insight.type === 'success' && <CheckCircle size={20} className="text-green-600 dark:text-green-400" />}
                      {insight.type === 'warning' && <AlertTriangle size={20} className="text-yellow-600 dark:text-yellow-400" />}
                      {insight.type === 'error' && <AlertTriangle size={20} className="text-red-600 dark:text-red-400" />}
                      {insight.type === 'info' && <Info size={20} className="text-blue-600 dark:text-blue-400" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{insight.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{insight.message}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Pipeline Chart */}
        {showDetailedMetrics && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Pipeline by Stage</h2>
              <DollarSign size={20} className="text-gray-400 dark:text-gray-500" />
            </div>
            <div className="space-y-4">
              {revenueMetrics.pipelineByStage.map((stage, stageIndex) => {
                const maxValue = Math.max(...revenueMetrics.pipelineByStage.map(s => s.value));
                const widthPercentage = maxValue > 0 ? (stage.value / maxValue) * 100 : 0;
                
                return (
                  <div key={stage.stage} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{stage.stage}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{stage.count} prospects</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-8 overflow-hidden">
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
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Pipeline Value</span>
                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                  {formatCurrency(revenueMetrics.totalPipeline)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">Forecast Accuracy</span>
                <span className="text-xs text-gray-600 dark:text-gray-300">
                  {revenueMetrics.forecastAccuracy.toFixed(1)}%
                </span>
              </div>
            </div>
          </Card>
        )}
        
        {/* Persona Performance Chart */}
        {showDetailedMetrics && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Top Performing Personas</h2>
              <Users size={20} className="text-gray-400 dark:text-gray-500" />
            </div>
            <div className="space-y-4">
              {personaMetrics
                .filter(p => p.totalCalls > 0)
                .sort((a, b) => b.successRate - a.successRate)
                .slice(0, 3)
                .map((persona, personaIndex) => (
                  <div key={persona.persona} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          personaIndex === 0 ? 'bg-green-500' :
                          personaIndex === 1 ? 'bg-blue-500' :
                          'bg-yellow-500'
                        }`}></div>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                          {persona.persona.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {persona.totalCalls} calls
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatCurrency(persona.revenue)} revenue
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {persona.successRate.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        success rate
                      </div>
                    </div>
                  </div>
                ))}
              {personaMetrics.filter(p => p.totalCalls > 0).length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Users size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No persona data available yet</p>
                  <p className="text-sm mt-1">Start making calls to see performance by persona</p>
                </div>
              )}
            </div>
          </Card>
        )}
        
        {/* Weekly Performance (Legacy) */}
        {!showDetailedMetrics && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Weekly Performance</h2>
              <BarChart3 size={20} className="text-gray-400 dark:text-gray-500" />
            </div>
            <div className="space-y-3">
              {weeklyData.map((day) => (
                <div key={day.day} className="flex items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300 w-12">{day.day}</span>
                  <div className="flex-1 flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
                      <div 
                        className="h-full bg-primary-500 rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${(day.calls / 20) * 100}%` }}
                      >
                        <span className="text-xs text-white font-medium">{day.calls}</span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300 w-20">
                      {day.calls > 0 ? ((day.success / day.calls) * 100).toFixed(0) : 0}% success
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
        
        {/* Success Rate Trend */}
        {showDetailedMetrics && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Success Rate Trend</h2>
              <TrendingUp size={20} className="text-gray-400 dark:text-gray-500" />
            </div>
            <div className="space-y-4">
              {successMetrics.weeklyData.slice(-4).map((week) => (
                <div key={week.week} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300 w-16">{week.week}</span>
                    <div className="flex-1 w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
                        style={{ width: `${week.rate}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {week.rate.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {week.calls} calls
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">Current Week</span>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {successMetrics.current.toFixed(1)}%
                  </span>
                  {successMetrics.trend === 'up' && (
                    <span className="text-sm text-green-500 font-medium">↑ {successMetrics.trendPercentage.toFixed(1)}%</span>
                  )}
                  {successMetrics.trend === 'down' && (
                    <span className="text-sm text-red-500 font-medium">↓ {successMetrics.trendPercentage.toFixed(1)}%</span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}
        
        {/* Recent Activity */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Activity</h2>
            <Clock size={20} className="text-gray-400 dark:text-gray-500" />
          </div>
          <div className="space-y-3">
            {recentCalls.length > 0 ? (
              recentCalls.map((call, index) => {
                // Find the battle card for this call to get lead info
                const battleCard = battleCards.find(bc => 
                  bc.generatedAt && 
                  Math.abs(new Date(bc.generatedAt).getTime() - new Date(call.createdAt).getTime()) < 3600000 // Within 1 hour
                );
                const lead = battleCard?.lead;
                const score = lead ? DealScoringService.calculateScore(lead, callLogs) : null;
                
                return (
                  <div key={index} className="flex items-start justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {lead ? lead.companyName : `Call #${callLogs.length - index}`}
                        </p>
                        {score && <DealScoreBadge score={score} size="sm" showDetails={false} />}
                      </div>
                      {lead && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {lead.contactName} • {lead.contactPosition || 'Contact'}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
                      <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                        {new Date(call.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyState
                icon={Users}
                title="No recent calls yet"
                description="Start making calls to see your activity here"
                action={{
                  label: "Start Calling",
                  onClick: () => setCurrentModule('battle-card')
                }}
              />
            )}
          </div>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setCurrentModule('call-planner');
            }}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-200 text-left group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                <Target className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">New Prospect Research</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Start researching a new lead</p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (prospect) {
                setCurrentModule('live-call');
              } else {
                alert('Please select a prospect from Planner before accessing Call Assistance.');
                setCurrentModule('call-planner');
              }
            }}
            className={`p-4 bg-white dark:bg-gray-800 rounded-lg border transition-all duration-200 text-left group ${
              prospect 
                ? 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700' 
                : 'border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                <Phone className="text-green-600 dark:text-green-400" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Call Assistance</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {prospect ? 'Get real-time help during calls' : 'Select a prospect first'}
                </p>
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setCurrentModule('help-center');
            }}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-200 text-left group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                <HelpCircle className="text-purple-600 dark:text-purple-400" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Training & Resources</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Learn tips and best practices</p>
              </div>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Motivational Quote */}
      <Card className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Daily Motivation</h3>
            <p className="text-white/90 italic">
              "Success in sales comes from genuine connections and understanding your client's true needs."
            </p>
            <p className="text-sm text-white/70 mt-2">- Campbell & Co. Sales Excellence</p>
          </div>
          <Trophy size={48} className="text-white/20" />
        </div>
      </Card>
      </div>
      
      {/* Activity Feed Sidebar */}
      <div className="hidden xl:block w-96">
        <div className="sticky top-6">
          <TeamActivityFeed 
            className="h-[calc(100vh-8rem)] overflow-hidden" 
            compact={true}
            limit={15}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;