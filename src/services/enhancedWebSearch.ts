import { WebSearchResult } from '@/types';
import axios from 'axios';

// Configuration for different search providers
interface SearchConfig {
  apiKey?: string;
  searchEngineId?: string;
  provider: 'google' | 'bing' | 'serpapi' | 'mock';
  maxResults: number;
  timeout: number;
}

// Enhanced search service with real API integration capabilities
export class EnhancedWebSearchService {
  private static config: SearchConfig = {
    provider: 'mock', // Default to mock for now
    maxResults: 10,
    timeout: 10000
  };

  // Configure the search service
  static configure(config: Partial<SearchConfig>) {
    this.config = { ...this.config, ...config };
  }

  // Main search method that routes to appropriate provider
  static async searchIndustryIntelligence(industry: string): Promise<WebSearchResult[]> {
    const queries = this.generateIndustryQueries(industry);
    let allResults: WebSearchResult[] = [];

    try {
      for (const query of queries) {
        const results = await this.performSearch(query);
        allResults = [...allResults, ...results];
      }

      // Remove duplicates and sort by relevance
      const uniqueResults = this.deduplicateResults(allResults);
      return this.scoreAndSortResults(uniqueResults, industry);
    } catch (error) {
      console.error('Search failed, falling back to mock data:', error);
      return this.getMockResults(industry);
    }
  }

  // Search for company-specific intelligence
  static async searchCompanyIntelligence(companyName: string, industry?: string): Promise<WebSearchResult[]> {
    const queries = this.generateCompanyQueries(companyName, industry);
    let allResults: WebSearchResult[] = [];

    try {
      for (const query of queries) {
        const results = await this.performSearch(query);
        allResults = [...allResults, ...results];
      }

      const uniqueResults = this.deduplicateResults(allResults);
      return this.scoreAndSortResults(uniqueResults, companyName);
    } catch (error) {
      console.error('Company search failed, falling back to mock data:', error);
      return this.getMockCompanyResults(companyName);
    }
  }

  // Perform actual search based on configured provider
  private static async performSearch(query: string): Promise<WebSearchResult[]> {
    switch (this.config.provider) {
      case 'google':
        return this.searchGoogle(query);
      case 'bing':
        return this.searchBing(query);
      case 'serpapi':
        return this.searchSerpApi(query);
      default:
        return this.searchMock(query);
    }
  }

  // Google Custom Search API integration
  private static async searchGoogle(query: string): Promise<WebSearchResult[]> {
    if (!this.config.apiKey || !this.config.searchEngineId) {
      throw new Error('Google API key and search engine ID required');
    }

    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: this.config.apiKey,
        cx: this.config.searchEngineId,
        q: query,
        num: Math.min(this.config.maxResults, 10),
        dateRestrict: 'y1' // Last year
      },
      timeout: this.config.timeout
    });

    return response.data.items?.map((item: any) => ({
      title: item.title || 'No Title',
      snippet: item.snippet || 'No description available',
      url: item.link || '',
      relevanceScore: this.calculateRelevanceScore(item.title + ' ' + item.snippet, query)
    })) || [];
  }

  // Bing Search API integration
  private static async searchBing(query: string): Promise<WebSearchResult[]> {
    if (!this.config.apiKey) {
      throw new Error('Bing API key required');
    }

    const response = await axios.get('https://api.bing.microsoft.com/v7.0/search', {
      headers: {
        'Ocp-Apim-Subscription-Key': this.config.apiKey
      },
      params: {
        q: query,
        count: Math.min(this.config.maxResults, 20),
        freshness: 'Year'
      },
      timeout: this.config.timeout
    });

    return response.data.webPages?.value?.map((item: any) => ({
      title: item.name || 'No Title',
      snippet: item.snippet || 'No description available',
      url: item.url || '',
      relevanceScore: this.calculateRelevanceScore(item.name + ' ' + item.snippet, query)
    })) || [];
  }

  // SerpApi integration (Google results without official API)
  private static async searchSerpApi(query: string): Promise<WebSearchResult[]> {
    if (!this.config.apiKey) {
      throw new Error('SerpApi key required');
    }

    const response = await axios.get('https://serpapi.com/search.json', {
      params: {
        engine: 'google',
        q: query,
        api_key: this.config.apiKey,
        num: Math.min(this.config.maxResults, 10),
        tbs: 'qdr:y' // Last year
      },
      timeout: this.config.timeout
    });

    return response.data.organic_results?.map((item: any) => ({
      title: item.title || 'No Title',
      snippet: item.snippet || 'No description available',
      url: item.link || '',
      relevanceScore: this.calculateRelevanceScore(item.title + ' ' + item.snippet, query)
    })) || [];
  }

  // Enhanced mock search with more realistic data
  private static async searchMock(query: string): Promise<WebSearchResult[]> {
    // Simulate realistic API delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    const mockDatabase = this.getEnhancedMockDatabase();
    const queryLower = query.toLowerCase();
    
    // Find relevant results based on query keywords
    const relevantResults = mockDatabase.filter(result => 
      result.title.toLowerCase().includes(queryLower) ||
      result.snippet.toLowerCase().includes(queryLower) ||
      result.keywords?.some(keyword => queryLower.includes(keyword.toLowerCase()))
    );

    // If no specific matches, return general results
    if (relevantResults.length === 0) {
      return mockDatabase.slice(0, Math.min(3, this.config.maxResults));
    }

    return relevantResults
      .map(result => ({
        title: result.title,
        snippet: result.snippet,
        url: result.url,
        relevanceScore: this.calculateRelevanceScore(result.title + ' ' + result.snippet, query)
      }))
      .slice(0, this.config.maxResults);
  }

  // Generate industry-specific search queries
  private static generateIndustryQueries(industry: string): string[] {
    const currentYear = new Date().getFullYear();
    return [
      `${industry} industry trends ${currentYear}`,
      `${industry} workforce challenges ${currentYear}`,
      `${industry} employee benefits trends`,
      `${industry} talent retention strategies`,
      `${industry} workplace wellness initiatives`,
      `${industry} industry outlook ${currentYear}`
    ];
  }

  // Generate company-specific search queries
  private static generateCompanyQueries(companyName: string, industry?: string): string[] {
    const queries = [
      `${companyName} company news`,
      `${companyName} leadership changes`,
      `${companyName} employee benefits`,
      `${companyName} company culture`,
      `${companyName} recent developments`
    ];

    if (industry) {
      queries.push(`${companyName} ${industry} industry`);
    }

    return queries;
  }

  // Calculate relevance score based on keyword matching
  private static calculateRelevanceScore(text: string, query: string): number {
    const textLower = text.toLowerCase();
    const queryTerms = query.toLowerCase().split(' ');
    
    let score = 0;
    const totalTerms = queryTerms.length;
    
    queryTerms.forEach(term => {
      if (textLower.includes(term)) {
        score += 1;
      }
    });
    
    // Bonus for exact phrase matches
    if (textLower.includes(query.toLowerCase())) {
      score += 0.5;
    }
    
    return Math.min(score / totalTerms + 0.1, 1.0);
  }

  // Remove duplicate results
  private static deduplicateResults(results: WebSearchResult[]): WebSearchResult[] {
    const seen = new Set<string>();
    return results.filter(result => {
      const key = result.url || result.title;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  // Score and sort results by relevance
  private static scoreAndSortResults(results: WebSearchResult[], context: string): WebSearchResult[] {
    return results
      .map(result => ({
        ...result,
        relevanceScore: this.calculateRelevanceScore(result.title + ' ' + result.snippet, context)
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, this.config.maxResults);
  }

  // Enhanced mock database with more realistic data
  private static getEnhancedMockDatabase(): (WebSearchResult & { keywords?: string[] })[] {
    return [
      {
        title: "2025 Workforce Trends: Employee Benefits Take Center Stage",
        snippet: "Companies across industries are reimagining their benefits packages to attract and retain top talent. Mental health, flexible work arrangements, and comprehensive wellness programs are becoming standard offerings.",
        url: "https://example.com/workforce-trends-2025",
        relevanceScore: 0.85,
        keywords: ["benefits", "workforce", "trends", "wellness", "mental health"]
      },
      {
        title: "Manufacturing Sector Faces Critical Talent Shortage",
        snippet: "The manufacturing industry is experiencing its most severe talent shortage in decades, with companies increasing compensation packages by 15-25% to attract skilled workers.",
        url: "https://example.com/manufacturing-talent-shortage",
        relevanceScore: 0.82,
        keywords: ["manufacturing", "talent", "shortage", "compensation"]
      },
      {
        title: "Technology Companies Expand Mental Health Benefits",
        snippet: "Leading tech companies are investing heavily in employee mental health programs, offering on-site counseling, meditation apps, and stress management workshops.",
        url: "https://example.com/tech-mental-health-benefits",
        relevanceScore: 0.88,
        keywords: ["technology", "mental health", "benefits", "counseling"]
      },
      {
        title: "Healthcare Industry Burnout Reaches Crisis Level",
        snippet: "Healthcare workers report unprecedented levels of burnout, prompting organizations to implement comprehensive wellness programs and improved work-life balance initiatives.",
        url: "https://example.com/healthcare-burnout-crisis",
        relevanceScore: 0.89,
        keywords: ["healthcare", "burnout", "wellness", "work-life balance"]
      },
      {
        title: "Financial Services Adapt to Remote Work Revolution",
        snippet: "Financial institutions are restructuring their benefits packages to support hybrid and remote work models, focusing on technology stipends and flexible scheduling.",
        url: "https://example.com/financial-remote-work",
        relevanceScore: 0.81,
        keywords: ["financial", "remote work", "hybrid", "technology"]
      },
      {
        title: "Retail Sector Invests in Employee Retention Programs",
        snippet: "Retail companies are implementing innovative retention strategies including tuition assistance, career development programs, and enhanced healthcare benefits.",
        url: "https://example.com/retail-retention-programs",
        relevanceScore: 0.79,
        keywords: ["retail", "retention", "tuition", "career development"]
      },
      {
        title: "Professional Services Firms Address Work-Life Balance",
        snippet: "Consulting and professional services firms are reducing billable hour requirements and offering sabbatical programs to combat employee burnout.",
        url: "https://example.com/professional-services-balance",
        relevanceScore: 0.84,
        keywords: ["professional services", "consulting", "work-life balance", "sabbatical"]
      },
      {
        title: "Construction Industry Enhances Safety Benefits",
        snippet: "Construction companies are expanding safety-related benefits including additional insurance coverage, safety training programs, and family support services.",
        url: "https://example.com/construction-safety-benefits",
        relevanceScore: 0.77,
        keywords: ["construction", "safety", "insurance", "training"]
      }
    ];
  }

  // Get mock results for specific industry
  private static getMockResults(industry: string): WebSearchResult[] {
    const database = this.getEnhancedMockDatabase();
    return database
      .filter(result => 
        result.keywords?.some(keyword => 
          keyword.toLowerCase().includes(industry.toLowerCase()) ||
          industry.toLowerCase().includes(keyword.toLowerCase())
        )
      )
      .slice(0, 3)
      .map(result => ({
        title: result.title,
        snippet: result.snippet,
        url: result.url,
        relevanceScore: 0.8
      }));
  }

  // Get mock results for specific company
  private static getMockCompanyResults(companyName: string): WebSearchResult[] {
    return [
      {
        title: `${companyName} - Company Overview and Recent News`,
        snippet: `Stay up to date with the latest news and developments from ${companyName}. Find information about company culture, leadership changes, and strategic initiatives.`,
        url: "https://example.com/company-news",
        relevanceScore: 0.75
      },
      {
        title: `${companyName} Employee Benefits and Culture`,
        snippet: `Learn about ${companyName}'s approach to employee benefits, workplace culture, and career development opportunities. Discover what makes this company unique.`,
        url: "https://example.com/company-culture",
        relevanceScore: 0.7
      }
    ];
  }

  // Generate AI-powered talking points from search results
  static generateTalkingPoints(searchResults: WebSearchResult[], industry: string): string[] {
    const points: string[] = [];
    
    // Analyze results for common themes
    const themes = this.extractThemes(searchResults);
    
    themes.forEach(theme => {
      switch (theme) {
        case 'talent-shortage':
          points.push(`I noticed your industry is experiencing significant talent retention challenges - we're helping companies like yours strengthen their competitive advantage through comprehensive benefits packages.`);
          break;
        case 'mental-health':
          points.push(`Mental health and wellness have become critical priorities in ${industry} - our programs are designed to support employee wellbeing while reducing healthcare costs.`);
          break;
        case 'remote-work':
          points.push(`With the shift to hybrid work models, companies in your sector are reimagining their benefits to support distributed teams - we can help you navigate this transition.`);
          break;
        case 'safety':
          points.push(`Safety and risk management are top concerns in ${industry} - our comprehensive coverage can help protect both your employees and your bottom line.`);
          break;
        case 'burnout':
          points.push(`Employee burnout is a significant challenge across ${industry} - we're seeing great results with wellness programs that focus on work-life balance and stress management.`);
          break;
        default:
          points.push(`Recent trends in ${industry} show companies are investing more heavily in employee benefits as a strategic differentiator.`);
      }
    });
    
    // Default talking points if no specific themes found
    if (points.length === 0) {
      points.push(
        `Current market conditions in ${industry} make employee retention more critical than ever.`,
        `We're seeing increased demand for flexible, comprehensive benefits solutions in your sector.`,
        `Cost predictability and employee satisfaction are top priorities for ${industry} companies this year.`
      );
    }
    
    return points.slice(0, 3);
  }

  // Extract themes from search results
  private static extractThemes(results: WebSearchResult[]): string[] {
    const themes: string[] = [];
    const text = results.map(r => r.title + ' ' + r.snippet).join(' ').toLowerCase();
    
    if (text.includes('shortage') || text.includes('retention') || text.includes('talent')) {
      themes.push('talent-shortage');
    }
    if (text.includes('mental health') || text.includes('wellness') || text.includes('stress')) {
      themes.push('mental-health');
    }
    if (text.includes('remote') || text.includes('hybrid') || text.includes('work from home')) {
      themes.push('remote-work');
    }
    if (text.includes('safety') || text.includes('risk') || text.includes('insurance')) {
      themes.push('safety');
    }
    if (text.includes('burnout') || text.includes('work-life balance') || text.includes('overtime')) {
      themes.push('burnout');
    }
    
    return themes;
  }

  // Get provider status for debugging
  static getProviderStatus(): { provider: string; configured: boolean; ready: boolean } {
    const configured = this.config.provider !== 'mock' && !!this.config.apiKey;
    return {
      provider: this.config.provider,
      configured,
      ready: configured || this.config.provider === 'mock'
    };
  }
}

export default EnhancedWebSearchService;