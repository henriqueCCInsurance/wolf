# Technical Implementation Guide

## 1. Live Intelligence Integration - Detailed Implementation

### 1.1 News Aggregation Service

```typescript
// src/services/intelligence/newsAggregator.ts
import axios from 'axios';
import { Redis } from 'ioredis';

interface NewsProvider {
  name: string;
  apiKey: string;
  baseUrl: string;
  rateLimit: number;
}

class NewsAggregatorService {
  private providers: NewsProvider[] = [
    {
      name: 'newsapi',
      apiKey: process.env.VITE_NEWSAPI_KEY,
      baseUrl: 'https://newsapi.org/v2',
      rateLimit: 500 // requests per day
    },
    {
      name: 'bing',
      apiKey: process.env.VITE_BING_KEY,
      baseUrl: 'https://api.bing.microsoft.com/v7.0',
      rateLimit: 1000
    }
  ];

  private redis: Redis;
  private cacheTimeout = 3600; // 1 hour

  async getIndustryNews(industry: string, company?: string): Promise<NewsItem[]> {
    const cacheKey = `news:${industry}:${company || 'general'}`;
    
    // Check cache first
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    // Aggregate from multiple sources
    const queries = this.buildSearchQueries(industry, company);
    const results = await Promise.allSettled(
      this.providers.map(provider => 
        this.fetchFromProvider(provider, queries)
      )
    );

    // Merge and deduplicate results
    const news = this.mergeAndRankResults(results);
    
    // Cache results
    await this.redis.setex(cacheKey, this.cacheTimeout, JSON.stringify(news));
    
    return news;
  }

  private buildSearchQueries(industry: string, company?: string): string[] {
    const industryKeywords = {
      'healthcare': ['health benefits', 'employee wellness', 'healthcare costs'],
      'technology': ['tech benefits', 'startup culture', 'employee retention'],
      'manufacturing': ['workplace safety', 'union benefits', 'workforce health']
    };

    const baseQueries = industryKeywords[industry] || [industry];
    
    if (company) {
      return baseQueries.map(q => `${company} ${q}`);
    }
    
    return baseQueries;
  }
}
```

### 1.2 AI-Powered Insight Generation

```typescript
// src/services/intelligence/insightGenerator.ts
import { OpenAI } from 'openai';

interface InsightRequest {
  newsItems: NewsItem[];
  persona: PersonaType;
  company: string;
  industry: string;
}

class InsightGeneratorService {
  private openai: OpenAI;

  async generateTalkingPoints(request: InsightRequest): Promise<TalkingPoint[]> {
    const prompt = this.buildPrompt(request);
    
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a sales intelligence assistant specializing in employee benefits. Generate specific, actionable talking points based on current news and industry trends.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return this.parseTalkingPoints(response.choices[0].message.content);
  }

  private buildPrompt(request: InsightRequest): string {
    const { newsItems, persona, company, industry } = request;
    
    return `
      Based on the following recent news about ${company} in the ${industry} industry:
      ${newsItems.map(item => `- ${item.title}: ${item.summary}`).join('\n')}
      
      Generate 3-5 talking points for a benefits consultant speaking to a ${persona} persona.
      Focus on:
      1. How recent events create benefits-related challenges or opportunities
      2. Specific pain points this persona would care about
      3. Actionable solutions Campbell & Co. could provide
      
      Format each talking point with:
      - Hook: Opening statement to grab attention
      - Context: Why this matters now
      - Solution: How we can help
    `;
  }
}
```

## 2. Enhanced Objection Handling System

### 2.1 Database-Driven Content Management

```typescript
// src/services/content/objectionService.ts
import { Pool } from 'pg';

interface ObjectionQuery {
  persona?: PersonaType;
  industry?: string;
  category?: string;
  searchText?: string;
  limit?: number;
}

class ObjectionHandlingService {
  private db: Pool;

  async searchObjections(query: ObjectionQuery): Promise<Objection[]> {
    const sql = `
      SELECT 
        o.id,
        o.objection_text,
        o.category,
        o.persona_type,
        o.industry,
        array_agg(
          json_build_object(
            'id', r.id,
            'response_text', r.response_text,
            'effectiveness_score', r.effectiveness_score,
            'tags', r.tags
          ) ORDER BY r.effectiveness_score DESC
        ) as responses
      FROM objections o
      LEFT JOIN objection_responses r ON o.id = r.objection_id
      WHERE 
        ($1::text IS NULL OR o.persona_type = $1)
        AND ($2::text IS NULL OR o.industry = $2)
        AND ($3::text IS NULL OR o.category = $3)
        AND ($4::text IS NULL OR o.objection_text ILIKE '%' || $4 || '%')
      GROUP BY o.id
      ORDER BY o.severity_level DESC
      LIMIT $5
    `;

    const result = await this.db.query(sql, [
      query.persona,
      query.industry,
      query.category,
      query.searchText,
      query.limit || 10
    ]);

    return result.rows;
  }

  async trackResponseUsage(responseId: string, success: boolean, notes?: string): Promise<void> {
    // Record usage
    await this.db.query(
      `INSERT INTO response_metrics (response_id, success, notes, timestamp)
       VALUES ($1, $2, $3, NOW())`,
      [responseId, success, notes]
    );

    // Update effectiveness score
    await this.updateEffectivenessScore(responseId);
  }

  private async updateEffectivenessScore(responseId: string): Promise<void> {
    const sql = `
      UPDATE objection_responses
      SET 
        effectiveness_score = (
          SELECT AVG(CASE WHEN success THEN 1 ELSE 0 END)::decimal(3,2)
          FROM response_metrics
          WHERE response_id = $1
        ),
        use_count = (
          SELECT COUNT(*)
          FROM response_metrics
          WHERE response_id = $1
        )
      WHERE id = $1
    `;

    await this.db.query(sql, [responseId]);
  }
}
```

### 2.2 Content Contribution System

```typescript
// src/components/content/ContributionForm.tsx
interface ContributionFormProps {
  objectionId?: string;
  onSubmit: (contribution: ResponseContribution) => void;
}

export const ContributionForm: React.FC<ContributionFormProps> = ({ objectionId, onSubmit }) => {
  const [response, setResponse] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [rationale, setRationale] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const contribution: ResponseContribution = {
      objectionId,
      responseText: response,
      tags,
      rationale,
      contributorId: getCurrentUser().id
    };

    await submitContribution(contribution);
    onSubmit(contribution);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Your Response
        </label>
        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          className="w-full h-32 p-3 border rounded-lg"
          placeholder="How would you handle this objection?"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          onChange={(e) => setTags(e.target.value.split(',').map(t => t.trim()))}
          className="w-full p-3 border rounded-lg"
          placeholder="price-focused, roi, competitor-comparison"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Why This Works
        </label>
        <textarea
          value={rationale}
          onChange={(e) => setRationale(e.target.value)}
          className="w-full h-20 p-3 border rounded-lg"
          placeholder="Explain your approach..."
        />
      </div>

      <button
        type="submit"
        className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark"
      >
        Submit Response
      </button>
    </form>
  );
};
```

## 3. Zoho CRM Integration Details

### 3.1 OAuth2 Implementation

```typescript
// src/services/zoho/zohoAuth.ts
class ZohoAuthService {
  private clientId = process.env.VITE_ZOHO_CLIENT_ID;
  private clientSecret = process.env.VITE_ZOHO_CLIENT_SECRET;
  private redirectUri = process.env.VITE_ZOHO_REDIRECT_URI;
  
  async initiateOAuth(): Promise<void> {
    const authUrl = `https://accounts.zoho.com/oauth/v2/auth?` +
      `client_id=${this.clientId}&` +
      `response_type=code&` +
      `access_type=offline&` +
      `redirect_uri=${this.redirectUri}&` +
      `scope=ZohoCRM.modules.ALL,ZohoCRM.settings.ALL`;
    
    window.location.href = authUrl;
  }

  async handleCallback(code: string): Promise<TokenResponse> {
    const tokenUrl = 'https://accounts.zoho.com/oauth/v2/token';
    
    const response = await axios.post(tokenUrl, null, {
      params: {
        grant_type: 'authorization_code',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        code
      }
    });

    // Store tokens securely
    await this.storeTokens(response.data);
    
    return response.data;
  }

  async refreshAccessToken(): Promise<string> {
    const refreshToken = await this.getStoredRefreshToken();
    
    const response = await axios.post('https://accounts.zoho.com/oauth/v2/token', null, {
      params: {
        grant_type: 'refresh_token',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken
      }
    });

    await this.updateAccessToken(response.data.access_token);
    
    return response.data.access_token;
  }
}
```

### 3.2 Data Synchronization

```typescript
// src/services/zoho/zohoSync.ts
class ZohoSyncService {
  async syncProspectData(prospectId: string): Promise<ZohoContact> {
    const token = await this.auth.getAccessToken();
    
    // Fetch contact from Zoho
    const response = await axios.get(
      `https://www.zohoapis.com/crm/v2/Contacts/${prospectId}`,
      {
        headers: { Authorization: `Zoho-oauthtoken ${token}` }
      }
    );

    const zohoContact = response.data.data[0];
    
    // Map to local format
    const localProspect: Prospect = {
      company: zohoContact.Account_Name,
      contactName: `${zohoContact.First_Name} ${zohoContact.Last_Name}`,
      title: zohoContact.Title,
      industry: zohoContact.Industry,
      email: zohoContact.Email,
      phone: zohoContact.Phone,
      // Custom fields
      employeeCount: zohoContact.Employee_Count,
      currentBroker: zohoContact.Current_Broker,
      lastContactDate: zohoContact.Last_Activity_Time
    };

    // Update local store
    useStore.getState().setCurrentProspect(localProspect);
    
    return zohoContact;
  }

  async createCallLog(callData: CallLog): Promise<void> {
    const token = await this.auth.getAccessToken();
    
    const zohoActivity = {
      Subject: `Sales Call - ${callData.outcome}`,
      Call_Type: 'Outbound',
      Call_Start_Time: callData.startTime,
      Call_Duration: callData.duration,
      Description: this.formatCallNotes(callData),
      Who_Id: callData.contactId,
      What_Id: callData.companyId,
      Call_Result: callData.outcome,
      // Custom fields
      Persona_Type: callData.personaType,
      Objections_Faced: callData.objections.join(', '),
      Next_Steps: callData.nextSteps,
      Battle_Card_Used: true
    };

    await axios.post(
      'https://www.zohoapis.com/crm/v2/Calls',
      { data: [zohoActivity] },
      {
        headers: { 
          Authorization: `Zoho-oauthtoken ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
  }

  private formatCallNotes(callData: CallLog): string {
    return `
      Call Summary:
      - Duration: ${callData.duration} seconds
      - Persona: ${callData.personaType}
      - Outcome: ${callData.outcome}
      
      Key Points Discussed:
      ${callData.keyPoints.map(point => `- ${point}`).join('\n')}
      
      Objections Encountered:
      ${callData.objections.map(obj => `- ${obj}`).join('\n')}
      
      Next Steps:
      ${callData.nextSteps}
      
      Generated by W.O.L.F. Den Sales Assistant
    `;
  }
}
```

### 3.3 Real-time Webhooks

```typescript
// src/api/webhooks/zoho.ts
import express from 'express';
import { verifyZohoWebhook } from '../middleware/zohoAuth';

const router = express.Router();

router.post('/zoho/webhook', verifyZohoWebhook, async (req, res) => {
  const { module, operation, data } = req.body;
  
  switch (module) {
    case 'Contacts':
      if (operation === 'update') {
        await handleContactUpdate(data);
      }
      break;
      
    case 'Accounts':
      if (operation === 'update') {
        await handleAccountUpdate(data);
      }
      break;
      
    case 'Tasks':
      if (operation === 'create') {
        await handleNewTask(data);
      }
      break;
  }
  
  res.status(200).send('OK');
});

async function handleContactUpdate(contactData: any) {
  // Update local cache
  await updateContactCache(contactData.id, contactData);
  
  // Notify active users
  broadcastUpdate({
    type: 'CONTACT_UPDATED',
    contactId: contactData.id,
    changes: extractChanges(contactData)
  });
}
```

## 4. Performance Optimization Strategies

### 4.1 Frontend Performance

```typescript
// src/App.tsx - Lazy Loading Implementation
import { lazy, Suspense } from 'react';

const HuntPlanner = lazy(() => import('./components/modules/HuntPlanner'));
const BattleCard = lazy(() => import('./components/modules/BattleCard'));
const PostGame = lazy(() => import('./components/modules/PostGame'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/hunt" element={<HuntPlanner />} />
        <Route path="/battle" element={<BattleCard />} />
        <Route path="/postgame" element={<PostGame />} />
      </Routes>
    </Suspense>
  );
}
```

### 4.2 Caching Strategy

```typescript
// src/services/cache/cacheManager.ts
class CacheManager {
  private memoryCache = new Map<string, CacheEntry>();
  private localStorage = window.localStorage;
  
  async get<T>(key: string, fetcher: () => Promise<T>, options?: CacheOptions): Promise<T> {
    // Check memory cache first
    const memoryHit = this.memoryCache.get(key);
    if (memoryHit && !this.isExpired(memoryHit)) {
      return memoryHit.data as T;
    }
    
    // Check localStorage for persistent cache
    if (options?.persistent) {
      const stored = this.localStorage.getItem(`cache:${key}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!this.isExpired(parsed)) {
          this.memoryCache.set(key, parsed);
          return parsed.data as T;
        }
      }
    }
    
    // Fetch fresh data
    const data = await fetcher();
    
    // Store in cache
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      ttl: options?.ttl || 3600000 // 1 hour default
    };
    
    this.memoryCache.set(key, entry);
    
    if (options?.persistent) {
      this.localStorage.setItem(`cache:${key}`, JSON.stringify(entry));
    }
    
    return data;
  }
  
  invalidate(pattern: string | RegExp): void {
    // Clear matching keys from both caches
    const keys = Array.from(this.memoryCache.keys());
    
    keys.forEach(key => {
      if (typeof pattern === 'string' ? key.includes(pattern) : pattern.test(key)) {
        this.memoryCache.delete(key);
        this.localStorage.removeItem(`cache:${key}`);
      }
    });
  }
}
```

## 5. Security Implementation

### 5.1 API Security Middleware

```typescript
// src/api/middleware/security.ts
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { body, validationResult } from 'express-validator';

// Rate limiting
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

// Input validation
export const validateProspectInput = [
  body('company').trim().isLength({ min: 1, max: 200 }).escape(),
  body('contactName').trim().isLength({ min: 1, max: 100 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('industry').isIn(['healthcare', 'technology', 'manufacturing', 'finance', 'retail']),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Security headers
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.zoho.com", "https://newsapi.org"]
    }
  }
});
```

This implementation guide provides the technical foundation for transforming the W.O.L.F. Den from a demo to a production-ready application with live data, enhanced content management, and full CRM integration.