import { 
  Competitor, 
  CompetitiveEncounter, 
  CompetitiveIntelligence, 
  CompetitiveAnalytics, 
  CompetitiveResponse,
  CallLog 
} from '@/types';

// Common competitors in the benefits industry
const COMPETITORS: Competitor[] = [
  {
    id: 'humana',
    name: 'Humana',
    category: 'national-carrier',
    description: 'Large national health insurance provider with focus on Medicare and employer plans',
    strengths: [
      'Strong brand recognition',
      'Comprehensive wellness programs',
      'Medicare expertise',
      'Technology platform',
      'National provider network'
    ],
    weaknesses: [
      'Less personalized service',
      'Complex bureaucracy',
      'Limited local presence',
      'Generic solutions',
      'Slow claims processing'
    ],
    differentiators: [
      'Local broker expertise vs. national account management',
      'Personalized service vs. call centers',
      'Flexible plan design vs. one-size-fits-all',
      'Direct access to decision makers',
      'Community involvement and relationships'
    ],
    marketShare: 15.2,
    targetMarket: ['large-groups', 'medicare', 'individual'],
    commonObjections: [
      {
        id: 'humana-pricing',
        objection: 'Humana has better pricing',
        frequency: 'high',
        context: 'Often raised during initial pricing discussions',
        responses: [
          {
            id: 'humana-pricing-1',
            response: 'While Humana may have competitive rates, true value comes from plan design that fits your specific workforce. Let me show you how our customized approach often delivers better overall value.',
            effectivenessRating: 4,
            tone: 'consultative',
            talkingPoints: [
              'Total cost of ownership vs. premium cost',
              'Employee satisfaction and retention',
              'Claims management and advocacy',
              'Preventive care emphasis'
            ],
            followUpQuestions: [
              'What specific challenges have you had with your current plan?',
              'How important is employee satisfaction vs. just cost?'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'unitedhealth',
    name: 'UnitedHealthcare',
    category: 'national-carrier',
    description: 'Largest health insurance company in the US with broad employer coverage',
    strengths: [
      'Largest provider network',
      'Comprehensive data analytics',
      'Technology solutions',
      'Financial stability',
      'Diverse product portfolio'
    ],
    weaknesses: [
      'Impersonal service model',
      'Complex administration',
      'Limited flexibility',
      'High deductible focus',
      'Difficult claims appeals'
    ],
    differentiators: [
      'Relationship-based service vs. transactional',
      'Proactive employee education vs. reactive support',
      'Local market knowledge vs. national averages',
      'Flexible plan options vs. standard packages',
      'Direct broker advocacy vs. call center support'
    ],
    marketShare: 28.1,
    targetMarket: ['large-groups', 'small-groups', 'individual'],
    commonObjections: [
      {
        id: 'united-network',
        objection: 'UnitedHealthcare has the largest network',
        frequency: 'high',
        context: 'Common concern about provider access',
        responses: [
          {
            id: 'united-network-1',
            response: 'Network size matters less than network quality. Our carriers provide excellent access to top-tier providers in your area, and we help employees navigate to the best care, not just the most options.',
            effectivenessRating: 4,
            tone: 'educational',
            talkingPoints: [
              'Quality metrics of network providers',
              'Employee utilization patterns',
              'Local provider relationships',
              'Care coordination services'
            ],
            followUpQuestions: [
              'Which specific providers are most important to your employees?',
              'Have you had issues with network adequacy in your area?'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'anthem',
    name: 'Anthem (Elevance Health)',
    category: 'national-carrier',
    description: 'Blue Cross Blue Shield affiliate with strong regional presence',
    strengths: [
      'Blue Cross brand recognition',
      'Regional market knowledge',
      'Strong provider relationships',
      'Comprehensive benefits',
      'Established claims processing'
    ],
    weaknesses: [
      'Slow to innovate',
      'Limited wellness programs',
      'Complex pricing structure',
      'Bureaucratic processes',
      'Generic employee communications'
    ],
    differentiators: [
      'Personalized employee engagement vs. standard communications',
      'Proactive wellness vs. reactive claims processing',
      'Flexible plan design vs. rigid structures',
      'Local expertise vs. regional management',
      'Direct decision-maker access vs. account management layers'
    ],
    marketShare: 12.8,
    targetMarket: ['large-groups', 'small-groups', 'individual'],
    commonObjections: [
      {
        id: 'anthem-stability',
        objection: 'Anthem has been our carrier for years - why change?',
        frequency: 'medium',
        context: 'Comfort with status quo',
        responses: [
          {
            id: 'anthem-stability-1',
            response: 'Stability is important, but stagnation can be costly. The benefits landscape is evolving rapidly, and we help you stay ahead of trends while maintaining the stability you value.',
            effectivenessRating: 3,
            tone: 'consultative',
            talkingPoints: [
              'Market evolution and new opportunities',
              'Employee expectations changing',
              'Cost management strategies',
              'Technology and service improvements'
            ],
            followUpQuestions: [
              'What has changed in your workforce over the past few years?',
              'Are your current benefits meeting employee needs?'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'aetna',
    name: 'Aetna (CVS Health)',
    category: 'national-carrier',
    description: 'Health insurance provider with integrated CVS health services',
    strengths: [
      'Integrated health services',
      'CVS pharmacy network',
      'Technology platform',
      'Preventive care focus',
      'Data analytics capabilities'
    ],
    weaknesses: [
      'Limited local presence',
      'CVS-centric solutions',
      'Complex integration',
      'High administrative costs',
      'Generic approach to small groups'
    ],
    differentiators: [
      'Local broker relationships vs. corporate account management',
      'Customized wellness programs vs. CVS-focused solutions',
      'Independent pharmacy choice vs. CVS preference',
      'Flexible plan design vs. integrated packages',
      'Personal service vs. digital-first approach'
    ],
    marketShare: 11.3,
    targetMarket: ['large-groups', 'small-groups', 'medicare'],
    commonObjections: [
      {
        id: 'aetna-integration',
        objection: 'Aetna\'s integration with CVS provides better value',
        frequency: 'medium',
        context: 'Highlighting CVS ecosystem benefits',
        responses: [
          {
            id: 'aetna-integration-1',
            response: 'Integration can be valuable, but choice is better. We provide access to the best solutions from multiple sources, not just one ecosystem, giving your employees more options and better outcomes.',
            effectivenessRating: 4,
            tone: 'collaborative',
            talkingPoints: [
              'Choice and flexibility in providers',
              'Best-in-class solutions vs. integrated solutions',
              'Employee preferences and convenience',
              'Cost effectiveness of open systems'
            ],
            followUpQuestions: [
              'How important is pharmacy choice to your employees?',
              'What has been your experience with integrated systems?'
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'local-brokers',
    name: 'Local Brokers',
    category: 'local-broker',
    description: 'Regional and local insurance brokers with community presence',
    strengths: [
      'Local market knowledge',
      'Personal relationships',
      'Community involvement',
      'Flexibility and responsiveness',
      'Competitive pricing'
    ],
    weaknesses: [
      'Limited resources',
      'Smaller carrier networks',
      'Less technology support',
      'Limited expertise breadth',
      'Capacity constraints'
    ],
    differentiators: [
      'Campbell & Co. reputation and track record',
      'Specialized benefits expertise vs. generalist approach',
      'Technology platform and tools',
      'Carrier relationships and negotiating power',
      'Comprehensive service model vs. transactional'
    ],
    marketShare: 35.4,
    targetMarket: ['small-groups', 'mid-market', 'individual'],
    commonObjections: [
      {
        id: 'local-relationships',
        objection: 'We have a long relationship with our current broker',
        frequency: 'high',
        context: 'Loyalty to existing local broker',
        responses: [
          {
            id: 'local-relationships-1',
            response: 'Relationships matter, and that\'s exactly why we focus on building deep, strategic partnerships. Let me show you how our specialized expertise and resources can enhance the service you value.',
            effectivenessRating: 4,
            tone: 'collaborative',
            talkingPoints: [
              'Specialized benefits expertise',
              'Enhanced service capabilities',
              'Technology and resources',
              'Market intelligence and benchmarking'
            ],
            followUpQuestions: [
              'What do you value most about your current broker relationship?',
              'Where do you see opportunities for improvement?'
            ]
          }
        ]
      }
    ]
  }
];

export class CompetitiveIntelligenceService {
  private static instance: CompetitiveIntelligenceService;
  private competitors: Map<string, Competitor>;
  private encounters: CompetitiveEncounter[];
  private intelligenceItems: CompetitiveIntelligence[];

  private constructor() {
    this.competitors = new Map();
    this.encounters = [];
    this.intelligenceItems = [];
    
    // Initialize with default competitors
    COMPETITORS.forEach(competitor => {
      this.competitors.set(competitor.id, competitor);
    });
    
    // Load from localStorage
    this.loadFromStorage();
  }

  public static getInstance(): CompetitiveIntelligenceService {
    if (!CompetitiveIntelligenceService.instance) {
      CompetitiveIntelligenceService.instance = new CompetitiveIntelligenceService();
    }
    return CompetitiveIntelligenceService.instance;
  }

  private loadFromStorage(): void {
    try {
      const encounters = localStorage.getItem('wolf-den-competitive-encounters');
      if (encounters) {
        const parsed = JSON.parse(encounters);
        // Validate and clean data
        this.encounters = parsed
          .filter((encounter: any) => encounter && encounter.id && encounter.competitorId)
          .map((encounter: any) => ({
            ...encounter,
            encounteredAt: new Date(encounter.encounteredAt)
          }))
          .filter((encounter: any) => !isNaN(encounter.encounteredAt.getTime()));
        
        // Apply retention policy - keep only last 90 days
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        this.encounters = this.encounters.filter(e => e.encounteredAt > ninetyDaysAgo);
      }

      const intelligence = localStorage.getItem('wolf-den-competitive-intelligence');
      if (intelligence) {
        const parsed = JSON.parse(intelligence);
        // Validate and clean data
        this.intelligenceItems = parsed
          .filter((item: any) => item && item.id && item.competitorId)
          .map((item: any) => ({
            ...item,
            capturedAt: new Date(item.capturedAt)
          }))
          .filter((item: any) => !isNaN(item.capturedAt.getTime()));
        
        // Keep only last 1000 items
        if (this.intelligenceItems.length > 1000) {
          this.intelligenceItems = this.intelligenceItems
            .sort((a, b) => b.capturedAt.getTime() - a.capturedAt.getTime())
            .slice(0, 1000);
        }
      }
    } catch (error) {
      console.error('Error loading competitive intelligence from storage:', error);
      // Reset to clean state on error
      this.encounters = [];
      this.intelligenceItems = [];
    }
  }

  private saveToStorage(): void {
    try {
      // Apply size limits before saving
      const limitedEncounters = this.encounters.slice(-500); // Keep last 500
      const limitedIntelligence = this.intelligenceItems.slice(-1000); // Keep last 1000
      
      localStorage.setItem('wolf-den-competitive-encounters', JSON.stringify(limitedEncounters));
      localStorage.setItem('wolf-den-competitive-intelligence', JSON.stringify(limitedIntelligence));
    } catch (error) {
      console.error('Error saving competitive intelligence to storage:', error);
      
      // If quota exceeded, try to clear old data and retry
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        try {
          // Keep only last 100 of each
          const criticalEncounters = this.encounters.slice(-100);
          const criticalIntelligence = this.intelligenceItems.slice(-100);
          
          localStorage.setItem('wolf-den-competitive-encounters', JSON.stringify(criticalEncounters));
          localStorage.setItem('wolf-den-competitive-intelligence', JSON.stringify(criticalIntelligence));
          
          console.warn('Storage quota exceeded - saved reduced dataset');
        } catch (retryError) {
          console.error('Failed to save even reduced dataset:', retryError);
        }
      }
    }
  }

  public getCompetitors(): Competitor[] {
    return Array.from(this.competitors.values());
  }

  public getCompetitor(id: string): Competitor | undefined {
    return this.competitors.get(id);
  }

  public getCompetitorByName(name: string): Competitor | undefined {
    return Array.from(this.competitors.values()).find(
      comp => comp.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  public addCompetitiveEncounter(encounter: Omit<CompetitiveEncounter, 'id'>): CompetitiveEncounter {
    const newEncounter: CompetitiveEncounter = {
      ...encounter,
      id: Date.now().toString(),
      encounteredAt: new Date()
    };
    
    this.encounters.push(newEncounter);
    this.saveToStorage();
    return newEncounter;
  }

  public addCompetitiveIntelligence(intelligence: Omit<CompetitiveIntelligence, 'id' | 'capturedAt'>): CompetitiveIntelligence {
    const newIntelligence: CompetitiveIntelligence = {
      ...intelligence,
      id: Date.now().toString(),
      capturedAt: new Date()
    };
    
    this.intelligenceItems.push(newIntelligence);
    this.saveToStorage();
    return newIntelligence;
  }

  public processCallLogForCompetitiveIntel(callLog: CallLog): void {
    if (!callLog.competitiveEncounter?.competitorMentioned) {
      return;
    }

    const competitor = this.getCompetitorByName(callLog.competitiveEncounter.competitorMentioned);
    if (!competitor) {
      return;
    }

    // Create competitive encounter
    this.addCompetitiveEncounter({
      callLogId: callLog.id,
      competitorId: competitor.id,
      competitorName: competitor.name,
      encounteredAt: callLog.createdAt,
      outcome: callLog.outcome === 'meeting-booked' ? 'won' : 
               callLog.outcome === 'disqualified' ? 'lost' : 'ongoing',
      objectionsFaced: callLog.competitiveEncounter.competitorStrengths ? 
                      [callLog.competitiveEncounter.competitorStrengths] : [],
      responsesUsed: callLog.competitiveEncounter.competitiveResponse ? 
                    [callLog.competitiveEncounter.competitiveResponse] : [],
      keyFactors: callLog.competitiveEncounter.decisionFactors ? 
                 [callLog.competitiveEncounter.decisionFactors] : [],
      intelligence: callLog.intel,
      lessons: callLog.keyTakeaway,
      prospectFeedback: callLog.competitiveEncounter.switchingReasons
    });

    // Add intelligence items
    if (callLog.competitiveEncounter.competitorStrengths) {
      this.addCompetitiveIntelligence({
        competitorId: competitor.id,
        source: 'call-feedback',
        intelligence: `Prospect highlighted strength: ${callLog.competitiveEncounter.competitorStrengths}`,
        reliability: 'high',
        category: 'market-position',
        prospectContext: `${callLog.leadId} - ${callLog.createdAt.toLocaleDateString()}`
      });
    }

    if (callLog.competitiveEncounter.competitorWeaknesses) {
      this.addCompetitiveIntelligence({
        competitorId: competitor.id,
        source: 'call-feedback',
        intelligence: `Prospect noted weakness: ${callLog.competitiveEncounter.competitorWeaknesses}`,
        reliability: 'high',
        category: 'service',
        prospectContext: `${callLog.leadId} - ${callLog.createdAt.toLocaleDateString()}`
      });
    }
  }

  public getCompetitiveAnalytics(competitorId: string): CompetitiveAnalytics {
    const competitor = this.getCompetitor(competitorId);
    if (!competitor) {
      throw new Error(`Competitor not found: ${competitorId}`);
    }

    const encounters = this.encounters.filter(e => e.competitorId === competitorId);
    const totalEncounters = encounters.length;
    const wins = encounters.filter(e => e.outcome === 'won').length;
    const losses = encounters.filter(e => e.outcome === 'lost').length;
    
    const winRate = totalEncounters > 0 ? (wins / totalEncounters) * 100 : 0;
    const lossRate = totalEncounters > 0 ? (losses / totalEncounters) * 100 : 0;

    // Analyze common objections
    const objectionFrequency = new Map<string, number>();
    encounters.forEach(encounter => {
      encounter.objectionsFaced.forEach(objection => {
        objectionFrequency.set(objection, (objectionFrequency.get(objection) || 0) + 1);
      });
    });

    const commonObjections = Array.from(objectionFrequency.entries())
      .map(([objection, frequency]) => ({ objection, frequency }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5);

    // Analyze effective responses
    const responseEffectiveness = new Map<string, { used: number, successful: number }>();
    encounters.forEach(encounter => {
      encounter.responsesUsed.forEach(response => {
        if (!responseEffectiveness.has(response)) {
          responseEffectiveness.set(response, { used: 0, successful: 0 });
        }
        const stats = responseEffectiveness.get(response)!;
        stats.used++;
        if (encounter.outcome === 'won') {
          stats.successful++;
        }
      });
    });

    const effectiveResponses = Array.from(responseEffectiveness.entries())
      .map(([response, stats]) => ({
        response,
        successRate: stats.used > 0 ? (stats.successful / stats.used) * 100 : 0
      }))
      .sort((a, b) => b.successRate - a.successRate)
      .slice(0, 5);

    // Recent trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentEncounters = encounters.filter(e => e.encounteredAt >= thirtyDaysAgo);
    const recentIntelligence = this.intelligenceItems.filter(
      i => i.competitorId === competitorId && i.capturedAt >= thirtyDaysAgo
    );

    const recentTrends = [];
    if (recentEncounters.length > 0) {
      const recentWinRate = (recentEncounters.filter(e => e.outcome === 'won').length / recentEncounters.length) * 100;
      const overallWinRate = winRate;
      
      if (recentWinRate > overallWinRate + 10) {
        recentTrends.push({ trend: 'Improving win rate against this competitor', timeframe: 'Last 30 days' });
      } else if (recentWinRate < overallWinRate - 10) {
        recentTrends.push({ trend: 'Declining win rate against this competitor', timeframe: 'Last 30 days' });
      }
    }

    if (recentIntelligence.length > 0) {
      const pricingIntel = recentIntelligence.filter(i => i.category === 'pricing');
      if (pricingIntel.length > 0) {
        recentTrends.push({ trend: 'New pricing intelligence gathered', timeframe: 'Last 30 days' });
      }
    }

    return {
      competitorId,
      competitorName: competitor.name,
      totalEncounters,
      winRate,
      lossRate,
      commonObjections,
      effectiveResponses,
      recentTrends
    };
  }

  public getTopCompetitors(limit: number = 5): CompetitiveAnalytics[] {
    const competitorIds = Array.from(new Set(this.encounters.map(e => e.competitorId)));
    
    return competitorIds
      .map(id => this.getCompetitiveAnalytics(id))
      .sort((a, b) => b.totalEncounters - a.totalEncounters)
      .slice(0, limit);
  }

  public getObjectionResponses(competitorId: string, objection: string): CompetitiveResponse[] {
    const competitor = this.getCompetitor(competitorId);
    if (!competitor) {
      return [];
    }

    const matchingObjection = competitor.commonObjections.find(
      obj => obj.objection.toLowerCase().includes(objection.toLowerCase())
    );

    return matchingObjection?.responses || [];
  }

  public getBattleCardComparison(competitorId: string): {
    competitor: Competitor;
    strengths: string[];
    weaknesses: string[];
    differentiators: string[];
    responses: CompetitiveResponse[];
  } | null {
    const competitor = this.getCompetitor(competitorId);
    if (!competitor) {
      return null;
    }

    const topResponses = competitor.commonObjections
      .flatMap(obj => obj.responses)
      .sort((a, b) => b.effectivenessRating - a.effectivenessRating)
      .slice(0, 3);

    return {
      competitor,
      strengths: competitor.strengths,
      weaknesses: competitor.weaknesses,
      differentiators: competitor.differentiators,
      responses: topResponses
    };
  }

  public searchCompetitors(query: string): Competitor[] {
    const queryLower = query.toLowerCase();
    return Array.from(this.competitors.values()).filter(
      comp => 
        comp.name.toLowerCase().includes(queryLower) ||
        comp.category.toLowerCase().includes(queryLower) ||
        comp.description.toLowerCase().includes(queryLower)
    );
  }

  public getRecentIntelligence(competitorId?: string, limit: number = 10): CompetitiveIntelligence[] {
    let intelligence = this.intelligenceItems;
    
    if (competitorId) {
      intelligence = intelligence.filter(i => i.competitorId === competitorId);
    }
    
    return intelligence
      .sort((a, b) => b.capturedAt.getTime() - a.capturedAt.getTime())
      .slice(0, limit);
  }
}