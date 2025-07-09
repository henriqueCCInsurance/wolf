import { CallLog, PersonaType, Lead } from '@/types';

export interface PredictionFactors {
  personaSuccessRate: number;
  industrySuccessRate: number;
  timeOfDayScore: number;
  dayOfWeekScore: number;
  previousInteractionScore: number;
  overallTrend: 'improving' | 'stable' | 'declining';
}

export interface SuccessPrediction {
  score: number; // 0-100
  confidence: 'high' | 'medium' | 'low';
  factors: PredictionFactors;
  recommendations: string[];
  bestTimeToCall: {
    dayOfWeek: string;
    timeRange: string;
  };
}

export class SuccessPredictionService {
  private static instance: SuccessPredictionService;

  private constructor() {}

  static getInstance(): SuccessPredictionService {
    if (!SuccessPredictionService.instance) {
      SuccessPredictionService.instance = new SuccessPredictionService();
    }
    return SuccessPredictionService.instance;
  }

  /**
   * Calculate success prediction for a lead based on historical data
   */
  calculatePrediction(
    lead: Lead,
    historicalCallLogs: CallLog[],
    currentTime: Date = new Date()
  ): SuccessPrediction {
    // Filter relevant call logs
    const relevantLogs = this.filterRelevantLogs(historicalCallLogs, lead);
    
    // Calculate individual factors
    const personaSuccessRate = this.calculatePersonaSuccessRate(lead.persona, historicalCallLogs);
    const industrySuccessRate = this.calculateIndustrySuccessRate(lead.industry, historicalCallLogs);
    const timeOfDayScore = this.calculateTimeOfDayScore(currentTime, historicalCallLogs);
    const dayOfWeekScore = this.calculateDayOfWeekScore(currentTime, historicalCallLogs);
    const previousInteractionScore = this.calculatePreviousInteractionScore(lead.companyName, historicalCallLogs);
    
    // Calculate overall trend
    const overallTrend = this.calculateOverallTrend(historicalCallLogs);
    
    // Calculate final score (weighted average)
    const score = Math.round(
      personaSuccessRate * 0.25 +
      industrySuccessRate * 0.2 +
      timeOfDayScore * 0.2 +
      dayOfWeekScore * 0.15 +
      previousInteractionScore * 0.2
    );
    
    // Determine confidence level based on data availability
    const confidence = this.calculateConfidence(historicalCallLogs.length, relevantLogs.length);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations({
      personaSuccessRate,
      industrySuccessRate,
      timeOfDayScore,
      dayOfWeekScore,
      previousInteractionScore,
      overallTrend
    }, lead, historicalCallLogs);
    
    // Determine best time to call
    const bestTimeToCall = this.calculateBestTimeToCall(historicalCallLogs);
    
    return {
      score,
      confidence,
      factors: {
        personaSuccessRate,
        industrySuccessRate,
        timeOfDayScore,
        dayOfWeekScore,
        previousInteractionScore,
        overallTrend
      },
      recommendations,
      bestTimeToCall
    };
  }

  private filterRelevantLogs(logs: CallLog[], _lead: Lead): CallLog[] {
    return logs.filter(() => {
      // Include logs from same company, industry, or persona
      // For now, include all logs since we don't have complete lead data in logs
      return true;
    });
  }

  private calculatePersonaSuccessRate(persona: PersonaType, logs: CallLog[]): number {
    // For now, calculate overall success rate since we don't have persona data in logs
    if (logs.length === 0) {
      // Default success rates by persona
      const defaultRates: Record<PersonaType, number> = {
        'roi-focused-executive': 75,
        'benefits-optimizer': 70,
        'cost-conscious-employer': 60,
        'gatekeeper': 45
      };
      return defaultRates[persona];
    }
    
    const successfulCalls = logs.filter(log => 
      log.outcome === 'meeting-booked' || log.outcome === 'follow-up'
    ).length;
    
    return Math.round((successfulCalls / logs.length) * 100);
  }

  private calculateIndustrySuccessRate(_industry: string, logs: CallLog[]): number {
    // For now, calculate overall success rate since we don't have industry data in logs
    if (logs.length === 0) {
      // Default industry success rate
      return 65;
    }
    
    const successfulCalls = logs.filter(log => 
      log.outcome === 'meeting-booked' || log.outcome === 'follow-up'
    ).length;
    
    return Math.round((successfulCalls / logs.length) * 100);
  }

  private calculateTimeOfDayScore(currentTime: Date, logs: CallLog[]): number {
    const currentHour = currentTime.getHours();
    const logsWithTime = logs.filter(log => log.startTime);
    
    if (logsWithTime.length === 0) {
      // Default time scores
      if (currentHour >= 9 && currentHour <= 11) return 85; // Morning prime time
      if (currentHour >= 14 && currentHour <= 16) return 80; // Afternoon prime time
      if (currentHour >= 8 && currentHour <= 17) return 70; // Business hours
      return 30; // Outside business hours
    }
    
    // Calculate success rate for current hour
    const hourLogs = logsWithTime.filter(log => 
      new Date(log.startTime!).getHours() === currentHour
    );
    
    if (hourLogs.length === 0) return 60; // No data for this hour
    
    const successfulHourCalls = hourLogs.filter(log => 
      log.outcome === 'meeting-booked' || log.outcome === 'follow-up'
    ).length;
    
    return Math.round((successfulHourCalls / hourLogs.length) * 100);
  }

  private calculateDayOfWeekScore(currentTime: Date, logs: CallLog[]): number {
    const currentDay = currentTime.getDay();
    const logsWithTime = logs.filter(log => log.startTime);
    
    if (logsWithTime.length === 0) {
      // Default day scores
      const dayScores = [40, 75, 85, 80, 70, 50, 30]; // Sun-Sat
      return dayScores[currentDay];
    }
    
    // Calculate success rate for current day
    const dayLogs = logsWithTime.filter(log => 
      new Date(log.startTime!).getDay() === currentDay
    );
    
    if (dayLogs.length === 0) return 65; // No data for this day
    
    const successfulDayCalls = dayLogs.filter(log => 
      log.outcome === 'meeting-booked' || log.outcome === 'follow-up'
    ).length;
    
    return Math.round((successfulDayCalls / dayLogs.length) * 100);
  }

  private calculatePreviousInteractionScore(companyName: string, logs: CallLog[]): number {
    const companyLogs = logs.filter(log => 
      log.additionalInfo?.companyInsights?.includes(companyName)
    );
    
    if (companyLogs.length === 0) return 60; // No previous interaction (neutral)
    
    // Recent successful interactions boost score
    const recentSuccess = companyLogs
      .slice(-3) // Last 3 interactions
      .some(log => log.outcome === 'meeting-booked');
    
    if (recentSuccess) return 85;
    
    // Multiple nurture calls indicate interest
    const nurtureCalls = companyLogs.filter(log => log.outcome === 'nurture').length;
    if (nurtureCalls >= 2) return 75;
    
    // Previous disqualification lowers score
    const hasDisqualified = companyLogs.some(log => log.outcome === 'disqualified');
    if (hasDisqualified) return 25;
    
    return 65; // Default for previous contact
  }

  private calculateOverallTrend(logs: CallLog[]): 'improving' | 'stable' | 'declining' {
    if (logs.length < 10) return 'stable'; // Not enough data
    
    // Compare recent success rate vs overall
    const recentLogs = logs.slice(-20);
    const olderLogs = logs.slice(0, -20);
    
    if (olderLogs.length === 0) return 'stable'; // Not enough historical data
    
    const recentSuccessRate = this.calculateSuccessRate(recentLogs);
    const olderSuccessRate = this.calculateSuccessRate(olderLogs);
    
    const difference = recentSuccessRate - olderSuccessRate;
    
    if (difference > 5) return 'improving';
    if (difference < -5) return 'declining';
    return 'stable';
  }

  private calculateSuccessRate(logs: CallLog[]): number {
    if (logs.length === 0) return 0;
    
    const successful = logs.filter(log => 
      log.outcome === 'meeting-booked' || log.outcome === 'follow-up'
    ).length;
    
    return (successful / logs.length) * 100;
  }

  private calculateConfidence(totalLogs: number, relevantLogs: number): 'high' | 'medium' | 'low' {
    if (totalLogs >= 100 && relevantLogs >= 20) return 'high';
    if (totalLogs >= 50 && relevantLogs >= 10) return 'medium';
    return 'low';
  }

  private generateRecommendations(
    factors: PredictionFactors,
    lead: Lead,
    _logs: CallLog[]
  ): string[] {
    const recommendations: string[] = [];
    
    // Persona-based recommendations
    if (factors.personaSuccessRate < 50) {
      if (lead.persona === 'gatekeeper') {
        recommendations.push('Consider asking for a warm introduction or referral to bypass gatekeepers');
      } else {
        recommendations.push(`Adjust your approach for ${lead.persona} - focus on their specific pain points`);
      }
    }
    
    // Time-based recommendations
    if (factors.timeOfDayScore < 60) {
      recommendations.push('Current time has lower success rates - consider calling during morning (9-11 AM) or mid-afternoon (2-4 PM)');
    }
    
    // Day-based recommendations
    if (factors.dayOfWeekScore < 60) {
      recommendations.push('This day typically has lower success - Tuesday through Thursday tend to be most effective');
    }
    
    // Previous interaction recommendations
    if (factors.previousInteractionScore > 75) {
      recommendations.push('Previous positive interactions detected - reference past conversations to build rapport');
    } else if (factors.previousInteractionScore < 40) {
      recommendations.push('Previous challenges with this company - consider a fresh approach or different contact');
    }
    
    // Trend-based recommendations
    if (factors.overallTrend === 'improving') {
      recommendations.push('Your success rate is trending upward - maintain current strategies');
    } else if (factors.overallTrend === 'declining') {
      recommendations.push('Success rate declining - consider refreshing your approach or scripts');
    }
    
    // Industry-specific recommendations
    if (factors.industrySuccessRate > 70) {
      recommendations.push(`Strong performance in ${lead.industry} - leverage industry-specific insights`);
    }
    
    return recommendations;
  }

  private calculateBestTimeToCall(logs: CallLog[]): { dayOfWeek: string; timeRange: string } {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const successByDayAndHour: Record<string, Record<number, { success: number; total: number }>> = {};
    
    // Initialize structure
    daysOfWeek.forEach(day => {
      successByDayAndHour[day] = {};
      for (let hour = 0; hour < 24; hour++) {
        successByDayAndHour[day][hour] = { success: 0, total: 0 };
      }
    });
    
    // Analyze logs
    logs.forEach(log => {
      if (log.startTime) {
        const date = new Date(log.startTime);
        const day = daysOfWeek[date.getDay()];
        const hour = date.getHours();
        
        successByDayAndHour[day][hour].total++;
        if (log.outcome === 'meeting-booked' || log.outcome === 'follow-up') {
          successByDayAndHour[day][hour].success++;
        }
      }
    });
    
    // Find best day and time
    let bestDay = 'Tuesday';
    let bestHour = 10;
    let bestSuccessRate = 0;
    
    Object.entries(successByDayAndHour).forEach(([day, hours]) => {
      Object.entries(hours).forEach(([hour, stats]) => {
        if (stats.total >= 5) { // Minimum sample size
          const successRate = stats.success / stats.total;
          if (successRate > bestSuccessRate) {
            bestSuccessRate = successRate;
            bestDay = day;
            bestHour = parseInt(hour);
          }
        }
      });
    });
    
    // Format time range
    const startHour = bestHour;
    const endHour = bestHour + 1;
    const timeRange = `${this.formatHour(startHour)}-${this.formatHour(endHour)}`;
    
    return { dayOfWeek: bestDay, timeRange };
  }

  private formatHour(hour: number): string {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  }

  /**
   * Update prediction model with new call outcome
   */
  updateModel(_callLog: CallLog): void {
    // In a real implementation, this would update ML model weights
    // or statistical models based on the new data point
    console.log('Prediction model updated with new call outcome');
  }
}