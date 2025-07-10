import { CallLog, BattleCard, CallSequence, PersonaType } from '@/types';

export interface RevenueMetrics {
  totalPotential: number;
  totalPipeline: number;
  averageDealSize: number;
  forecastAccuracy: number;
  expectedRevenue: number;
  pipelineByStage: {
    stage: string;
    value: number;
    count: number;
  }[];
}

export interface SuccessRateMetrics {
  current: number;
  previous: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  weeklyData: {
    week: string;
    rate: number;
    calls: number;
    meetings: number;
  }[];
  monthlyData: {
    month: string;
    rate: number;
    calls: number;
    meetings: number;
  }[];
}

export interface PersonaPerformanceMetrics {
  persona: PersonaType;
  successRate: number;
  totalCalls: number;
  meetings: number;
  revenue: number;
  averageDealSize: number;
  conversionRate: number;
}

export interface DashboardInsights {
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface DashboardAlert {
  id: string;
  type: 'declining-performance' | 'missed-opportunity' | 'high-value-prospect' | 'quota-risk';
  severity: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  actionRequired: boolean;
  createdAt: Date;
}

// Default deal sizes by persona (can be customized)
const DEFAULT_DEAL_SIZES: Record<PersonaType, number> = {
  'roi-focused-executive': 75000,
  'benefits-optimizer': 50000,
  'cost-conscious-employer': 30000,
  'gatekeeper': 25000,
  'strategic-ceo': 100000,
  'operations-leader': 60000,
  'culture-champion': 40000
};

// Revenue calculation utilities
export const calculateRevenueMetrics = (
  callLogs: CallLog[],
  battleCards: BattleCard[],
  _callSequences: CallSequence[]
): RevenueMetrics => {
  const meetingBookedLogs = callLogs.filter(log => log.outcome === 'meeting-booked');
  const followUpLogs = callLogs.filter(log => log.outcome === 'follow-up');
  
  // Calculate total potential revenue
  const totalPotential = meetingBookedLogs.reduce((sum, log) => {
    const battleCard = battleCards.find(bc => {
      if (!bc.generatedAt) return false;
      const bcDate = bc.generatedAt instanceof Date ? bc.generatedAt : new Date(bc.generatedAt);
      const logDate = log.createdAt instanceof Date ? log.createdAt : new Date(log.createdAt);
      return Math.abs(bcDate.getTime() - logDate.getTime()) < 3600000;
    });
    const persona = battleCard?.lead?.persona || 'cost-conscious-employer';
    return sum + DEFAULT_DEAL_SIZES[persona];
  }, 0);

  // Calculate pipeline value (meetings + warm follow-ups)
  const totalPipeline = [...meetingBookedLogs, ...followUpLogs].reduce((sum, log) => {
    const battleCard = battleCards.find(bc => {
      if (!bc.generatedAt) return false;
      const bcDate = bc.generatedAt instanceof Date ? bc.generatedAt : new Date(bc.generatedAt);
      const logDate = log.createdAt instanceof Date ? log.createdAt : new Date(log.createdAt);
      return Math.abs(bcDate.getTime() - logDate.getTime()) < 3600000;
    });
    const persona = battleCard?.lead?.persona || 'cost-conscious-employer';
    const probability = log.outcome === 'meeting-booked' ? 0.8 : 0.4;
    return sum + (DEFAULT_DEAL_SIZES[persona] * probability);
  }, 0);

  // Calculate average deal size
  const averageDealSize = meetingBookedLogs.length > 0 ? 
    totalPotential / meetingBookedLogs.length : 
    Object.values(DEFAULT_DEAL_SIZES).reduce((sum, size) => sum + size, 0) / Object.keys(DEFAULT_DEAL_SIZES).length;

  // Calculate forecast accuracy (simplified - would need historical data in real implementation)
  const forecastAccuracy = Math.min(95, Math.max(65, 80 + (meetingBookedLogs.length * 2)));

  // Calculate expected revenue (pipeline * probability)
  const expectedRevenue = totalPipeline * 0.7; // 70% close rate assumption

  // Pipeline by stage
  const pipelineByStage = [
    {
      stage: 'Prospecting',
      value: callLogs.filter(log => log.outcome === 'nurture').length * 15000,
      count: callLogs.filter(log => log.outcome === 'nurture').length
    },
    {
      stage: 'Qualified',
      value: followUpLogs.length * 35000,
      count: followUpLogs.length
    },
    {
      stage: 'Meeting Booked',
      value: totalPotential,
      count: meetingBookedLogs.length
    }
  ];

  return {
    totalPotential,
    totalPipeline,
    averageDealSize,
    forecastAccuracy,
    expectedRevenue,
    pipelineByStage
  };
};

// Success rate trend analysis
export const calculateSuccessRateMetrics = (callLogs: CallLog[]): SuccessRateMetrics => {
  const now = new Date();
  const currentWeekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  const previousWeekStart = new Date(currentWeekStart);
  previousWeekStart.setDate(currentWeekStart.getDate() - 7);

  // Current week stats
  const currentWeekLogs = callLogs.filter(log => {
    const logDate = log.createdAt instanceof Date ? log.createdAt : new Date(log.createdAt);
    return logDate >= currentWeekStart;
  });
  
  const currentWeekSuccess = currentWeekLogs.filter(log => 
    log.outcome === 'meeting-booked' || log.outcome === 'follow-up'
  ).length;
  
  const currentSuccessRate = currentWeekLogs.length > 0 ? 
    (currentWeekSuccess / currentWeekLogs.length) * 100 : 0;

  // Previous week stats
  const previousWeekEnd = new Date(currentWeekStart);
  previousWeekEnd.setDate(currentWeekStart.getDate() - 1);
  
  const previousWeekLogs = callLogs.filter(log => {
    const logDate = log.createdAt instanceof Date ? log.createdAt : new Date(log.createdAt);
    return logDate >= previousWeekStart && logDate <= previousWeekEnd;
  });
  
  const previousWeekSuccess = previousWeekLogs.filter(log => 
    log.outcome === 'meeting-booked' || log.outcome === 'follow-up'
  ).length;
  
  const previousSuccessRate = previousWeekLogs.length > 0 ? 
    (previousWeekSuccess / previousWeekLogs.length) * 100 : 0;

  // Calculate trend
  let trend: 'up' | 'down' | 'stable' = 'stable';
  let trendPercentage = 0;
  
  if (previousSuccessRate > 0) {
    const change = currentSuccessRate - previousSuccessRate;
    trendPercentage = Math.abs(change);
    
    if (change > 5) trend = 'up';
    else if (change < -5) trend = 'down';
    else trend = 'stable';
  }

  // Generate weekly data for the last 8 weeks
  const weeklyData = [];
  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date(currentWeekStart);
    weekStart.setDate(currentWeekStart.getDate() - (i * 7));
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const weekLogs = callLogs.filter(log => {
      const logDate = log.createdAt instanceof Date ? log.createdAt : new Date(log.createdAt);
      return logDate >= weekStart && logDate <= weekEnd;
    });
    
    const weekSuccess = weekLogs.filter(log => 
      log.outcome === 'meeting-booked' || log.outcome === 'follow-up'
    ).length;
    
    weeklyData.push({
      week: `Week ${8 - i}`,
      rate: weekLogs.length > 0 ? (weekSuccess / weekLogs.length) * 100 : 0,
      calls: weekLogs.length,
      meetings: weekLogs.filter(log => log.outcome === 'meeting-booked').length
    });
  }

  // Generate monthly data for the last 6 months
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    
    const monthLogs = callLogs.filter(log => {
      const logDate = log.createdAt instanceof Date ? log.createdAt : new Date(log.createdAt);
      return logDate >= monthStart && logDate <= monthEnd;
    });
    
    const monthSuccess = monthLogs.filter(log => 
      log.outcome === 'meeting-booked' || log.outcome === 'follow-up'
    ).length;
    
    monthlyData.push({
      month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
      rate: monthLogs.length > 0 ? (monthSuccess / monthLogs.length) * 100 : 0,
      calls: monthLogs.length,
      meetings: monthLogs.filter(log => log.outcome === 'meeting-booked').length
    });
  }

  return {
    current: currentSuccessRate,
    previous: previousSuccessRate,
    trend,
    trendPercentage,
    weeklyData,
    monthlyData
  };
};

// Persona performance analysis
export const calculatePersonaPerformance = (
  callLogs: CallLog[],
  battleCards: BattleCard[]
): PersonaPerformanceMetrics[] => {
  const personas: PersonaType[] = ['roi-focused-executive', 'benefits-optimizer', 'cost-conscious-employer', 'gatekeeper'];
  
  return personas.map(persona => {
    // Find call logs for this persona
    const personaLogs = callLogs.filter(log => {
      const battleCard = battleCards.find(bc => 
        bc.generatedAt && Math.abs(new Date(bc.generatedAt).getTime() - new Date(log.createdAt).getTime()) < 3600000
      );
      return battleCard?.lead?.persona === persona;
    });

    const totalCalls = personaLogs.length;
    const meetings = personaLogs.filter(log => log.outcome === 'meeting-booked').length;
    const successRate = totalCalls > 0 ? (meetings / totalCalls) * 100 : 0;
    const revenue = meetings * DEFAULT_DEAL_SIZES[persona];
    const averageDealSize = DEFAULT_DEAL_SIZES[persona];
    
    // Conversion rate includes both meetings and warm follow-ups
    const conversions = personaLogs.filter(log => 
      log.outcome === 'meeting-booked' || log.outcome === 'follow-up'
    ).length;
    const conversionRate = totalCalls > 0 ? (conversions / totalCalls) * 100 : 0;

    return {
      persona,
      successRate,
      totalCalls,
      meetings,
      revenue,
      averageDealSize,
      conversionRate
    };
  });
};

// Generate actionable insights
export const generateDashboardInsights = (
  callLogs: CallLog[],
  _battleCards: BattleCard[],
  revenueMetrics: RevenueMetrics,
  successMetrics: SuccessRateMetrics,
  personaMetrics: PersonaPerformanceMetrics[]
): DashboardInsights[] => {
  const insights: DashboardInsights[] = [];

  // Success rate insights
  if (successMetrics.trend === 'up' && successMetrics.trendPercentage > 10) {
    insights.push({
      type: 'success',
      title: 'Performance Trending Up',
      message: `Your success rate has improved by ${successMetrics.trendPercentage.toFixed(1)}% this week. Keep up the great work!`
    });
  } else if (successMetrics.trend === 'down' && successMetrics.trendPercentage > 10) {
    insights.push({
      type: 'warning',
      title: 'Performance Declining',
      message: `Your success rate has dropped by ${successMetrics.trendPercentage.toFixed(1)}% this week. Consider reviewing your approach.`
    });
  }

  // Revenue insights
  if (revenueMetrics.totalPipeline > 100000) {
    insights.push({
      type: 'success',
      title: 'Strong Pipeline',
      message: `You have $${(revenueMetrics.totalPipeline / 1000).toFixed(0)}K in your pipeline. Focus on closing these opportunities.`
    });
  } else if (revenueMetrics.totalPipeline < 50000) {
    insights.push({
      type: 'warning',
      title: 'Pipeline Needs Attention',
      message: `Your pipeline is at $${(revenueMetrics.totalPipeline / 1000).toFixed(0)}K. Consider increasing your prospecting activity.`
    });
  }

  // Persona performance insights
  const topPersona = personaMetrics.reduce((prev, current) => 
    prev.successRate > current.successRate ? prev : current
  );
  
  if (topPersona.successRate > 0) {
    insights.push({
      type: 'info',
      title: 'Top Performing Persona',
      message: `${topPersona.persona.replace('-', ' ')} is your strongest persona with ${topPersona.successRate.toFixed(1)}% success rate.`
    });
  }

  // Activity insights
  const recentActivity = callLogs.filter(log => {
    const logDate = log.createdAt instanceof Date ? log.createdAt : new Date(log.createdAt);
    const daysSinceCall = (Date.now() - logDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceCall <= 7;
  }).length;

  if (recentActivity < 5) {
    insights.push({
      type: 'info',
      title: 'Increase Activity',
      message: `Only ${recentActivity} calls this week. Consider setting a daily calling goal to boost your results.`
    });
  }

  return insights;
};

// Generate performance alerts
export const generateDashboardAlerts = (
  callLogs: CallLog[],
  successMetrics: SuccessRateMetrics,
  revenueMetrics: RevenueMetrics
): DashboardAlert[] => {
  const alerts: DashboardAlert[] = [];

  // Declining performance alert
  if (successMetrics.trend === 'down' && successMetrics.trendPercentage > 15) {
    alerts.push({
      id: 'declining-performance',
      type: 'declining-performance',
      severity: 'high',
      title: 'Performance Alert',
      message: `Success rate has declined by ${successMetrics.trendPercentage.toFixed(1)}% this week`,
      actionRequired: true,
      createdAt: new Date()
    });
  }

  // Low pipeline alert
  if (revenueMetrics.totalPipeline < 25000) {
    alerts.push({
      id: 'low-pipeline',
      type: 'missed-opportunity',
      severity: 'medium',
      title: 'Pipeline Warning',
      message: `Pipeline value is below $25K. Consider increasing prospecting efforts.`,
      actionRequired: true,
      createdAt: new Date()
    });
  }

  // High-value prospect alert
  const highValueProspects = callLogs.filter(log => {
    const logDate = log.createdAt instanceof Date ? log.createdAt : new Date(log.createdAt);
    const daysSinceCall = (Date.now() - logDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceCall <= 1 && log.outcome === 'meeting-booked';
  });

  if (highValueProspects.length > 0) {
    alerts.push({
      id: 'high-value-prospect',
      type: 'high-value-prospect',
      severity: 'medium',
      title: 'New High-Value Prospects',
      message: `${highValueProspects.length} new meeting(s) booked in the last 24 hours.`,
      actionRequired: false,
      createdAt: new Date()
    });
  }

  return alerts;
};

// Format currency values
export const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  } else {
    return `$${value.toFixed(0)}`;
  }
};

// Calculate performance score (0-100)
export const calculatePerformanceScore = (
  successRate: number,
  callVolume: number,
  pipelineValue: number
): number => {
  const successScore = Math.min(successRate * 2, 40); // Max 40 points for success rate
  const volumeScore = Math.min(callVolume * 2, 30); // Max 30 points for call volume
  const pipelineScore = Math.min(pipelineValue / 2500, 30); // Max 30 points for pipeline value
  
  return Math.round(successScore + volumeScore + pipelineScore);
};