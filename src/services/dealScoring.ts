import { Contact, Lead, PersonaType } from '@/types';

export interface DealScore {
  total: number;
  category: 'hot' | 'warm' | 'cool' | 'cold';
  breakdown: {
    personaScore: number;
    companyScore: number;
    industryScore: number;
    completenessScore: number;
    interactionScore: number;
  };
  reasons: string[];
}

export class DealScoringService {
  // Industry priorities for Campbell & Co. (higher score = better fit)
  private static readonly INDUSTRY_SCORES: Record<string, number> = {
    'healthcare': 20,
    'manufacturing': 18,
    'professional-services': 16,
    'technology': 15,
    'construction': 15,
    'financial-services': 14,
    'retail': 12,
    'hospitality': 10,
    'non-profit': 8,
    'other': 5
  };

  // Persona scores (executives and decision makers score higher)
  private static readonly PERSONA_SCORES: Record<PersonaType, number> = {
    'roi-focused-executive': 20,
    'benefits-optimizer': 16,
    'cost-conscious-employer': 12,
    'gatekeeper': 8,
    'strategic-ceo': 22,
    'operations-leader': 18,
    'culture-champion': 14
  };

  // Employee count ranges (larger companies typically have more complex benefits needs)
  private static readonly EMPLOYEE_COUNT_SCORES: Record<string, number> = {
    '1000+': 20,
    '500-999': 18,
    '250-499': 16,
    '100-249': 14,
    '50-99': 12,
    '25-49': 10,
    '10-24': 8,
    '1-9': 5
  };

  // Revenue ranges (higher revenue = higher potential deal value)
  private static readonly REVENUE_SCORES: Record<string, number> = {
    '$100M+': 20,
    '$50M-$99M': 18,
    '$25M-$49M': 16,
    '$10M-$24M': 14,
    '$5M-$9M': 12,
    '$1M-$4M': 10,
    'Under $1M': 5
  };

  /**
   * Calculate the deal score for a contact or lead
   */
  static calculateScore(contact: Contact | Lead, callLogs?: any[]): DealScore {
    const breakdown = {
      personaScore: this.calculatePersonaScore(contact),
      companyScore: this.calculateCompanyScore(contact),
      industryScore: this.calculateIndustryScore(contact),
      completenessScore: this.calculateCompletenessScore(contact),
      interactionScore: this.calculateInteractionScore(contact, callLogs)
    };

    const total = Object.values(breakdown).reduce((sum, score) => sum + score, 0);
    const category = this.getScoreCategory(total);
    const reasons = this.generateReasons(breakdown);

    return {
      total: Math.round(total),
      category,
      breakdown,
      reasons
    };
  }

  /**
   * Calculate persona-based score (max 20 points)
   */
  private static calculatePersonaScore(contact: Contact | Lead): number {
    const persona = 'persona' in contact ? contact.persona : undefined;
    if (!persona) return 0;
    
    return this.PERSONA_SCORES[persona] || 0;
  }

  /**
   * Calculate company-based score (max 20 points)
   */
  private static calculateCompanyScore(contact: Contact | Lead): number {
    let score = 0;
    
    // Check if we have extended Contact data
    if ('employeeCount' in contact && contact.employeeCount) {
      score += this.EMPLOYEE_COUNT_SCORES[contact.employeeCount] || 5;
    }
    
    if ('revenue' in contact && contact.revenue) {
      // Average the employee count and revenue scores if both exist
      const revenueScore = this.REVENUE_SCORES[contact.revenue] || 5;
      score = score > 0 ? (score + revenueScore) / 2 : revenueScore;
    }
    
    // Default score if no company size data
    return score || 10;
  }

  /**
   * Calculate industry-based score (max 20 points)
   */
  private static calculateIndustryScore(contact: Contact | Lead): number {
    if (!contact.industry) return 0;
    
    // Normalize industry string for matching
    const normalizedIndustry = contact.industry.toLowerCase().replace(/\s+/g, '-');
    
    // Check for exact match first
    if (normalizedIndustry in this.INDUSTRY_SCORES) {
      return this.INDUSTRY_SCORES[normalizedIndustry];
    }
    
    // Check for partial matches
    for (const [key, score] of Object.entries(this.INDUSTRY_SCORES)) {
      if (normalizedIndustry.includes(key) || key.includes(normalizedIndustry)) {
        return score;
      }
    }
    
    return this.INDUSTRY_SCORES['other'];
  }

  /**
   * Calculate completeness score based on available contact information (max 20 points)
   */
  private static calculateCompletenessScore(contact: Contact | Lead): number {
    let score = 0;
    const maxScore = 20;
    
    // Essential fields (5 points each)
    if (contact.contactName) score += 5;
    if (contact.companyName) score += 5;
    
    // Contact details (3.5 points each for phone/email)
    if ('contactPhone' in contact && contact.contactPhone) score += 3.5;
    if ('phone' in contact && contact.phone) score += 3.5;
    if ('contactEmail' in contact && contact.contactEmail) score += 3.5;
    if ('email' in contact && contact.email) score += 3.5;
    
    // Position/title (3 points)
    if ('contactPosition' in contact && contact.contactPosition) score += 3;
    if ('position' in contact && contact.position) score += 3;
    if ('title' in contact && contact.title) score += 3;
    
    // Cap at max score
    return Math.min(score, maxScore);
  }

  /**
   * Calculate interaction history score (max 20 points)
   */
  private static calculateInteractionScore(contact: Contact | Lead, callLogs?: any[]): number {
    if (!callLogs || callLogs.length === 0) return 0;
    
    // Filter logs for this contact
    const contactLogs = callLogs.filter(log => {
      if ('id' in contact) {
        return log.contactId === contact.id || log.leadId === contact.id;
      }
      return false;
    });
    
    if (contactLogs.length === 0) return 0;
    
    let score = 0;
    
    // Points for any interaction
    score += 5;
    
    // Points based on outcome
    const successfulCalls = contactLogs.filter(log => 
      log.outcome === 'meeting-booked' || log.outcome === 'follow-up'
    ).length;
    
    if (successfulCalls > 0) {
      score += 10; // Had successful interaction
      score += Math.min(successfulCalls - 1, 5); // Bonus for multiple successes (max 5)
    }
    
    // Recency bonus (calls within last 30 days)
    const recentCalls = contactLogs.filter(log => {
      const callDate = new Date(log.createdAt);
      const daysSince = (Date.now() - callDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysSince <= 30;
    }).length;
    
    if (recentCalls > 0) {
      score += Math.min(recentCalls * 2, 5); // 2 points per recent call, max 5
    }
    
    return Math.min(score, 20);
  }

  /**
   * Determine score category based on total score
   */
  private static getScoreCategory(score: number): 'hot' | 'warm' | 'cool' | 'cold' {
    if (score >= 80) return 'hot';
    if (score >= 60) return 'warm';
    if (score >= 40) return 'cool';
    return 'cold';
  }

  /**
   * Generate human-readable reasons for the score
   */
  private static generateReasons(breakdown: DealScore['breakdown']): string[] {
    const reasons: string[] = [];
    
    // Persona reasons
    if (breakdown.personaScore >= 16) {
      reasons.push('Executive decision maker');
    } else if (breakdown.personaScore >= 12) {
      reasons.push('Key stakeholder');
    } else if (breakdown.personaScore <= 8) {
      reasons.push('Gatekeeper role');
    }
    
    // Company size reasons
    if (breakdown.companyScore >= 18) {
      reasons.push('Large enterprise prospect');
    } else if (breakdown.companyScore >= 14) {
      reasons.push('Mid-market company');
    } else if (breakdown.companyScore <= 10) {
      reasons.push('Small business');
    }
    
    // Industry reasons
    if (breakdown.industryScore >= 18) {
      reasons.push('High-priority industry');
    } else if (breakdown.industryScore >= 14) {
      reasons.push('Target industry');
    } else if (breakdown.industryScore <= 10) {
      reasons.push('Secondary market');
    }
    
    // Completeness reasons
    if (breakdown.completenessScore >= 18) {
      reasons.push('Complete contact info');
    } else if (breakdown.completenessScore <= 10) {
      reasons.push('Missing key details');
    }
    
    // Interaction reasons
    if (breakdown.interactionScore >= 15) {
      reasons.push('Strong engagement history');
    } else if (breakdown.interactionScore >= 10) {
      reasons.push('Previous interactions');
    } else if (breakdown.interactionScore === 0) {
      reasons.push('No prior contact');
    }
    
    return reasons;
  }

  /**
   * Get color classes for score category
   */
  static getCategoryColor(category: DealScore['category']): {
    bg: string;
    text: string;
    border: string;
    gradient: string;
  } {
    switch (category) {
      case 'hot':
        return {
          bg: 'bg-red-50',
          text: 'text-red-700',
          border: 'border-red-200',
          gradient: 'from-red-400 to-red-600'
        };
      case 'warm':
        return {
          bg: 'bg-orange-50',
          text: 'text-orange-700',
          border: 'border-orange-200',
          gradient: 'from-orange-400 to-orange-600'
        };
      case 'cool':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
          gradient: 'from-blue-400 to-blue-600'
        };
      case 'cold':
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          border: 'border-gray-200',
          gradient: 'from-gray-400 to-gray-600'
        };
    }
  }

  /**
   * Get emoji for score category
   */
  static getCategoryEmoji(category: DealScore['category']): string {
    switch (category) {
      case 'hot': return '🔥';
      case 'warm': return '☀️';
      case 'cool': return '❄️';
      case 'cold': return '🧊';
    }
  }
}