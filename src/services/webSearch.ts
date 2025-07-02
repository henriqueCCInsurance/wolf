import { WebSearchResult } from '@/types';

// Mock web search service - In production, this would integrate with a real search API
export class WebSearchService {
  static async searchIndustryIntelligence(industry: string): Promise<WebSearchResult[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock results based on industry
    const mockResults: Record<string, WebSearchResult[]> = {
      manufacturing: [
        {
          title: "Manufacturing Supply Chain Disruptions Continue in 2025",
          snippet: "Ontario manufacturers face ongoing challenges with supply chain volatility, impacting production schedules and employee retention strategies.",
          url: "https://example.com/manufacturing-news",
          relevanceScore: 0.9
        },
        {
          title: "Skilled Labor Shortage Reaches Critical Point",
          snippet: "Manufacturing companies are increasing benefits packages by 15-20% to attract and retain skilled workers in competitive market.",
          url: "https://example.com/labor-shortage",
          relevanceScore: 0.85
        },
        {
          title: "Workplace Safety Regulations Tightened",
          snippet: "New provincial regulations require enhanced workplace safety measures, affecting insurance and benefits considerations.",
          url: "https://example.com/safety-regulations",
          relevanceScore: 0.8
        }
      ],
      technology: [
        {
          title: "Tech Worker Burnout Rates Spike to 68%",
          snippet: "New study reveals unprecedented burnout levels among tech workers, with mental health benefits becoming critical for retention.",
          url: "https://example.com/tech-burnout",
          relevanceScore: 0.92
        },
        {
          title: "Cybersecurity Threats Drive Employee Stress",
          snippet: "IT professionals report increased stress levels due to rising cyber threats, impacting workplace wellness needs.",
          url: "https://example.com/cyber-stress",
          relevanceScore: 0.87
        },
        {
          title: "Remote Work Benefits Evolution",
          snippet: "Tech companies adapting benefits packages to support hybrid and remote work models, focusing on flexibility and wellness.",
          url: "https://example.com/remote-benefits",
          relevanceScore: 0.83
        }
      ],
      'professional-services': [
        {
          title: "Professional Services Turnover Hits 25%",
          snippet: "Accounting and consulting firms see highest turnover rates in decade, with work-life balance benefits becoming priority.",
          url: "https://example.com/professional-turnover",
          relevanceScore: 0.9
        },
        {
          title: "Billable Hour Pressure Increases Mental Health Claims",
          snippet: "Professional services firms report 30% increase in mental health benefit utilization amid pressure to meet targets.",
          url: "https://example.com/billable-pressure",
          relevanceScore: 0.88
        }
      ]
    };
    
    return mockResults[industry] || [
      {
        title: `${industry.charAt(0).toUpperCase() + industry.slice(1)} Industry Update`,
        snippet: `Recent developments in the ${industry} sector suggest increased focus on employee benefits and wellness programs.`,
        url: "https://example.com/industry-update",
        relevanceScore: 0.7
      }
    ];
  }
  
  static async searchCompanyIntelligence(companyName: string): Promise<WebSearchResult[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock company-specific results
    return [
      {
        title: `${companyName} - Recent Company News`,
        snippet: `Recent developments and news about ${companyName} that could be relevant for your conversation.`,
        url: "https://example.com/company-news",
        relevanceScore: 0.75
      },
      {
        title: `${companyName} Leadership Changes`,
        snippet: `Understanding leadership structure and recent changes at ${companyName} can provide valuable context.`,
        url: "https://example.com/leadership",
        relevanceScore: 0.7
      }
    ];
  }
  
  static generateTalkingPoints(searchResults: WebSearchResult[], industry: string): string[] {
    const points: string[] = [];
    
    searchResults.forEach(result => {
      if (result.relevanceScore > 0.8) {
        if (result.title.includes('burnout') || result.title.includes('stress')) {
          points.push(`I noticed your industry is dealing with increased stress levels - we're helping companies address this through comprehensive mental health benefits.`);
        }
        
        if (result.title.includes('shortage') || result.title.includes('retention')) {
          points.push(`With the current talent shortage in ${industry}, a competitive benefits package has become essential for retention.`);
        }
        
        if (result.title.includes('supply chain') || result.title.includes('disruption')) {
          points.push(`Supply chain challenges in your sector make employee stability even more critical - let's discuss how benefits can support workforce resilience.`);
        }
      }
    });
    
    // Default talking points if no specific patterns found
    if (points.length === 0) {
      points.push(
        `Recent industry trends show companies in ${industry} are prioritizing employee wellness more than ever.`,
        `We're seeing increased demand for flexible benefits solutions in your sector.`,
        `Cost predictability has become a top concern for ${industry} companies this year.`
      );
    }
    
    return points.slice(0, 3); // Return top 3 talking points
  }
}

export default WebSearchService;