import { WebSearchResult, Prospect, Lead } from '@/types';
import { EnhancedWebSearchService } from './enhancedWebSearch';

interface CompanyIntelligenceData {
  companyName: string;
  industry: string;
  lastUpdated: number;
  newsAndUpdates: WebSearchResult[];
  industryTrends: WebSearchResult[];
  companyContext: WebSearchResult[];
  linkedInProfile?: string;
  companyWebsite?: string;
  keyInsights: string[];
  talkingPoints: string[];
  cached: boolean;
}

export class CompanyIntelligenceService {
  private static cache = new Map<string, CompanyIntelligenceData>();
  private static readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  // Main method to get comprehensive company intelligence
  static async getCompanyIntelligence(prospect: Prospect | Lead): Promise<CompanyIntelligenceData> {
    const cacheKey = this.getCacheKey(prospect);
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (Date.now() - cached.lastUpdated < this.CACHE_DURATION) {
        return { ...cached, cached: true };
      }
    }

    try {
      // Gather intelligence from multiple sources
      const [newsAndUpdates, industryTrends, companyContext] = await Promise.all([
        this.getCompanyNews(prospect.companyName),
        this.getIndustryTrends(prospect.industry),
        this.getCompanyContext(prospect.companyName, prospect.industry)
      ]);

      // Try to find LinkedIn and website information
      const linkedInProfile = await this.findLinkedInProfile(prospect.companyName);
      const companyWebsite = await this.findCompanyWebsite(prospect.companyName);

      // Generate insights and talking points
      const allResults = [...newsAndUpdates, ...industryTrends, ...companyContext];
      const keyInsights = this.generateKeyInsights(allResults, prospect);
      const talkingPoints = EnhancedWebSearchService.generateTalkingPoints(allResults, prospect.industry);

      const intelligence: CompanyIntelligenceData = {
        companyName: prospect.companyName,
        industry: prospect.industry,
        lastUpdated: Date.now(),
        newsAndUpdates,
        industryTrends,
        companyContext,
        linkedInProfile,
        companyWebsite,
        keyInsights,
        talkingPoints,
        cached: false
      };

      // Cache the results
      this.cache.set(cacheKey, intelligence);
      
      return intelligence;
    } catch (error) {
      console.error('Error gathering company intelligence:', error);
      
      // Return cached data if available, otherwise return minimal intelligence
      if (this.cache.has(cacheKey)) {
        return { ...this.cache.get(cacheKey)!, cached: true };
      }
      
      return this.getMinimalIntelligence(prospect);
    }
  }

  // Get company news and recent updates
  private static async getCompanyNews(companyName: string): Promise<WebSearchResult[]> {
    const queries = [
      `${companyName} company news 2024 2025`,
      `${companyName} recent developments`,
      `${companyName} leadership changes`,
      `${companyName} expansion growth`
    ];

    const results: WebSearchResult[] = [];
    
    for (const query of queries) {
      try {
        const searchResults = await EnhancedWebSearchService.searchCompanyIntelligence(companyName);
        results.push(...searchResults);
      } catch (error) {
        console.error(`Error searching for: ${query}`, error);
      }
    }

    return this.deduplicateAndLimit(results, 5);
  }

  // Get industry trends and context
  private static async getIndustryTrends(industry: string): Promise<WebSearchResult[]> {
    try {
      const results = await EnhancedWebSearchService.searchIndustryIntelligence(industry);
      return this.deduplicateAndLimit(results, 3);
    } catch (error) {
      console.error('Error getting industry trends:', error);
      return [];
    }
  }

  // Get company-specific context
  private static async getCompanyContext(companyName: string, industry: string): Promise<WebSearchResult[]> {
    const queries = [
      `${companyName} company culture employee benefits`,
      `${companyName} workplace wellness programs`,
      `${companyName} ${industry} industry position`
    ];

    const results: WebSearchResult[] = [];
    
    for (const query of queries) {
      try {
        const searchResults = await EnhancedWebSearchService.searchCompanyIntelligence(companyName, industry);
        results.push(...searchResults);
      } catch (error) {
        console.error(`Error searching for: ${query}`, error);
      }
    }

    return this.deduplicateAndLimit(results, 4);
  }

  // Find LinkedIn company profile
  private static async findLinkedInProfile(companyName: string): Promise<string | undefined> {
    try {
      // Search for LinkedIn profile using enhanced web search
      const results = await EnhancedWebSearchService.searchCompanyIntelligence(companyName);
      
      // Look for LinkedIn URLs in the results
      const linkedInResult = results.find(result => 
        result.url.includes('linkedin.com/company') || 
        result.title.toLowerCase().includes('linkedin')
      );
      
      return linkedInResult?.url;
    } catch (error) {
      console.error('Error finding LinkedIn profile:', error);
      return undefined;
    }
  }

  // Find company website
  private static async findCompanyWebsite(companyName: string): Promise<string | undefined> {
    try {
      const results = await EnhancedWebSearchService.searchCompanyIntelligence(companyName);
      
      // Look for official website (usually first result that's not a directory)
      const websiteResult = results.find(result => 
        !result.url.includes('linkedin.com') &&
        !result.url.includes('facebook.com') &&
        !result.url.includes('twitter.com') &&
        !result.url.includes('instagram.com') &&
        !result.url.includes('wikipedia.org') &&
        !result.url.includes('glassdoor.com') &&
        !result.url.includes('indeed.com')
      );
      
      return websiteResult?.url;
    } catch (error) {
      console.error('Error finding company website:', error);
      return undefined;
    }
  }

  // Generate key insights from all gathered data
  private static generateKeyInsights(results: WebSearchResult[], prospect: Prospect | Lead): string[] {
    const insights: string[] = [];
    const allText = results.map(r => r.title + ' ' + r.snippet).join(' ').toLowerCase();
    
    // Analyze for key business themes
    if (allText.includes('expansion') || allText.includes('growth') || allText.includes('hiring')) {
      insights.push(`${prospect.companyName} appears to be in a growth phase - this could indicate increased need for employee benefits expansion.`);
    }
    
    if (allText.includes('remote') || allText.includes('hybrid') || allText.includes('flexible')) {
      insights.push(`${prospect.companyName} has adopted flexible work arrangements - benefits packages may need to adapt to support distributed teams.`);
    }
    
    if (allText.includes('wellness') || allText.includes('mental health') || allText.includes('employee satisfaction')) {
      insights.push(`${prospect.companyName} shows interest in employee wellness initiatives - this aligns well with comprehensive benefits offerings.`);
    }
    
    if (allText.includes('cost') || allText.includes('efficiency') || allText.includes('budget')) {
      insights.push(`${prospect.companyName} appears cost-conscious - focus on ROI and cost-effective benefits solutions.`);
    }
    
    if (allText.includes('technology') || allText.includes('digital') || allText.includes('automation')) {
      insights.push(`${prospect.companyName} is embracing digital transformation - they may appreciate modern, tech-forward benefits administration.`);
    }
    
    // Add industry-specific insights
    if (prospect.industry.toLowerCase().includes('manufacturing')) {
      insights.push(`Manufacturing companies like ${prospect.companyName} typically prioritize safety benefits and workforce stability.`);
    } else if (prospect.industry.toLowerCase().includes('technology')) {
      insights.push(`Technology companies like ${prospect.companyName} often compete heavily for talent through comprehensive benefits packages.`);
    }
    
    // Default insight if none found
    if (insights.length === 0) {
      insights.push(`${prospect.companyName} operates in the ${prospect.industry} sector, where employee benefits are increasingly important for talent retention.`);
    }
    
    return insights.slice(0, 4);
  }

  // Deduplicate and limit results
  private static deduplicateAndLimit(results: WebSearchResult[], limit: number): WebSearchResult[] {
    const seen = new Set<string>();
    const deduplicated = results.filter(result => {
      const key = result.url || result.title;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    
    return deduplicated.slice(0, limit);
  }

  // Generate cache key
  private static getCacheKey(prospect: Prospect | Lead): string {
    return `${prospect.companyName}-${prospect.industry}`.toLowerCase().replace(/\s+/g, '-');
  }

  // Get minimal intelligence for error cases
  private static getMinimalIntelligence(prospect: Prospect | Lead): CompanyIntelligenceData {
    return {
      companyName: prospect.companyName,
      industry: prospect.industry,
      lastUpdated: Date.now(),
      newsAndUpdates: [],
      industryTrends: [],
      companyContext: [],
      keyInsights: [
        `${prospect.companyName} operates in the ${prospect.industry} industry.`,
        `Employee benefits are increasingly important for talent retention in ${prospect.industry}.`
      ],
      talkingPoints: [
        `I'd like to understand how ${prospect.companyName} is approaching employee benefits in today's competitive market.`,
        `Companies in ${prospect.industry} are facing unique challenges with talent retention.`,
        `We're helping businesses like yours create competitive advantages through strategic benefits planning.`
      ],
      cached: false
    };
  }

  // Clear cache for testing or manual refresh
  static clearCache(): void {
    this.cache.clear();
  }

  // Get cache statistics
  static getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  // Enable real-time web search (activate APIs)
  static enableRealTimeSearch(provider: 'google' | 'bing' | 'serpapi', apiKey: string, searchEngineId?: string): void {
    EnhancedWebSearchService.configure({
      provider,
      apiKey,
      searchEngineId,
      maxResults: 10,
      timeout: 10000
    });
  }

  // Get detailed company intelligence for a contact list
  static async getMultipleCompanyIntelligence(prospects: (Prospect | Lead)[]): Promise<Map<string, CompanyIntelligenceData>> {
    const results = new Map<string, CompanyIntelligenceData>();
    
    // Process companies in batches to avoid overwhelming APIs
    const batchSize = 3;
    for (let i = 0; i < prospects.length; i += batchSize) {
      const batch = prospects.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (prospect) => {
        try {
          const intelligence = await this.getCompanyIntelligence(prospect);
          return { prospect, intelligence };
        } catch (error) {
          console.error(`Error processing ${prospect.companyName}:`, error);
          return { prospect, intelligence: this.getMinimalIntelligence(prospect) };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      batchResults.forEach(({ prospect, intelligence }) => {
        results.set(this.getCacheKey(prospect), intelligence);
      });
      
      // Small delay between batches to be respectful to APIs
      if (i + batchSize < prospects.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return results;
  }
}

export default CompanyIntelligenceService;