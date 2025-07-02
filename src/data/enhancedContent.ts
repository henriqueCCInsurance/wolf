import { PersonaType } from '@/types';

export interface EnhancedContentItem {
  id: string;
  category: 'opener' | 'objection-handler' | 'thought-leadership' | 'selling-point' | 'cta' | 'closing' | 'industry-insight' | 'competitive-positioning' | 'economic-context';
  persona: PersonaType | 'universal';
  title: string;
  content: string;
  context?: string;
  tips?: string[];
  successRate?: number;
  industry?: string;
  source?: string;
}

export const enhancedContentLibrary: EnhancedContentItem[] = [
  // ENHANCED OPENERS - Based on Psychological Research
  {
    id: 'opener-strategic-1',
    category: 'opener',
    persona: 'cost-conscious-employer',
    title: 'Insight-Based Cost Opening (2025)',
    content: "Hi [Name], Colin Chalmers from Campbell & Co. I'm calling because the latest BDC report highlighted talent retention as the #1 challenge for SMEs in Ontario, and I noticed [Company] has been growing in the competitive [Industry] space. We've developed a specific approach that helps businesses like yours turn their benefits investment into a talent magnet that actually reduces costs. How have you been thinking about benefits as a strategic tool for growth?",
    context: 'Establishes authority through research insights, connects to business growth',
    tips: ['Reference specific reports/data', 'Connect to business growth', 'End with open question'],
    successRate: 78,
    source: 'Campbell & Co. Research 2025'
  },
  {
    id: 'opener-2',
    category: 'opener',
    persona: 'roi-focused-executive',
    title: 'ROI-Driven Opening',
    content: "Good morning [Name], I noticed [Company] has been growing rapidly. We've helped similar companies turn their benefits programs into talent magnets that reduce turnover by 30% and recruiting costs by $50K annually.",
    context: 'Lead with business impact and growth',
    tips: ['Focus on talent acquisition/retention', 'Quantify business metrics'],
    successRate: 72
  },
  {
    id: 'opener-hr-1',
    category: 'opener',
    persona: 'benefits-optimizer',
    title: 'Benefits Optimizer Strategic Opening (2025)',
    content: "Hi [Name], Trevor McLachlan from Campbell & Co. I noticed your LinkedIn post about employee engagement challenges. What we're showing HR leaders across Southwestern Ontario is that while traditional benefits plans cover the basics, they often miss the mark on what today's multi-generational workforce actually values - like robust mental health support and flexible wellness options. Companies making this shift are seeing 40% increases in employee NPS scores. What's your current strategy for benefits that truly resonate with your diverse workforce?",
    context: 'Reference their thought leadership, focus on modern workforce needs',
    tips: ['Personalize with LinkedIn activity', 'Highlight generational diversity', 'Focus on engagement metrics'],
    successRate: 79,
    source: 'Campbell & Co. Workforce Intelligence 2025'
  },

  // ENHANCED OBJECTION HANDLERS - Psychological Frameworks
  {
    id: 'objection-status-quo-1',
    category: 'objection-handler',
    persona: 'universal',
    title: '"We\'re happy with our current provider" - Challenger Approach',
    content: "That's great to hear – a strong partnership is essential, and I respect that relationship. What I'm curious about is this: most of our clients initially felt the same way. The question they found valuable wasn't whether to change providers, but whether they truly understand what they might be missing. For instance, our analysis often uncovers that companies are unknowingly losing 10-15% of their benefits spend to underutilized features or misaligned plan design. Would it be worth a quick, no-obligation review to ensure that's not happening here?",
    context: 'Overcome status quo bias using loss aversion psychology',
    tips: ['Acknowledge their satisfaction', 'Introduce potential loss concept', 'Use social proof', 'Offer risk-free review'],
    successRate: 73,
    source: 'Campbell & Co. Challenger Sales Training 2025'
  },
  {
    id: 'objection-2',
    category: 'objection-handler',
    persona: 'cost-conscious-employer',
    title: '"We don\'t have budget for changes"',
    content: "I completely understand budget constraints. Actually, that's exactly why this conversation could be valuable. Many of our clients have found that our solutions either cost the same or less than what they're currently paying, while delivering better results. Would it make sense to explore whether that might be possible for [Company]?",
    context: 'Address budget concerns directly',
    tips: ['Emphasize potential savings', 'Remove financial pressure'],
    successRate: 61
  },

  // THOUGHT LEADERSHIP
  {
    id: 'thought-1',
    category: 'thought-leadership',
    persona: 'benefits-optimizer',
    title: 'Future of Benefits Strategy',
    content: "We're seeing a major shift in how progressive companies approach benefits. Instead of just offering standard packages, they're using benefits as a strategic tool for culture building and competitive differentiation. Companies that make this shift are seeing measurable impacts on retention and recruitment.",
    context: 'Position benefits as strategic business tool',
    tips: ['Connect to business strategy', 'Reference industry trends'],
    successRate: 69
  },
  {
    id: 'thought-2',
    category: 'thought-leadership',
    persona: 'roi-focused-executive',
    title: 'Data-Driven Benefits ROI',
    content: "The most successful executives we work with are treating benefits like any other business investment – they want clear metrics and ROI. We've developed frameworks that let you track everything from cost-per-hire savings to retention-based ROI. It's transforming how companies think about benefits.",
    context: 'Appeal to analytical mindset',
    tips: ['Emphasize measurement and metrics', 'Business-focused language'],
    successRate: 74
  },

  // SELLING POINTS
  {
    id: 'selling-1',
    category: 'selling-point',
    persona: 'universal',
    title: 'Personalized Employee Experience',
    content: "What makes us different is our personalized approach. Instead of one-size-fits-all benefits, we create customized packages that reflect what your specific workforce values. This typically increases employee satisfaction by 35% while often reducing costs.",
    context: 'Differentiate from generic providers',
    tips: ['Emphasize customization', 'Reference specific outcomes'],
    successRate: 71
  },
  {
    id: 'selling-2',
    category: 'selling-point',
    persona: 'cost-conscious-employer',
    title: 'Cost Optimization Without Sacrifice',
    content: "Our specialty is finding hidden efficiencies in benefits programs. We typically reduce total benefits costs by 10-20% while maintaining or improving coverage. It's not about cutting benefits – it's about smart optimization.",
    context: 'Address cost concerns while maintaining quality',
    tips: ['Focus on efficiency, not cuts', 'Maintain quality messaging'],
    successRate: 66
  },

  // CALL TO ACTIONS
  {
    id: 'cta-1',
    category: 'cta',
    persona: 'universal',
    title: 'Benefits Assessment Meeting',
    content: "I'd love to show you specifically how this might work for [Company]. Could we schedule a brief 20-minute call next week where I can share some ideas tailored to your situation? I have openings Tuesday or Wednesday afternoon.",
    context: 'Low-commitment next step',
    tips: ['Specify short duration', 'Offer specific times'],
    successRate: 73
  },
  {
    id: 'cta-2',
    category: 'cta',
    persona: 'benefits-optimizer',
    title: 'Benefits Strategy Review',
    content: "What I'd like to do is conduct a complimentary benefits strategy review for [Company]. We'll analyze your current approach and identify 2-3 specific opportunities for improvement. It's a 30-minute investment that typically uncovers significant value. Does next Friday work?",
    context: 'Position as strategic consultation',
    tips: ['Emphasize strategy and value', 'Offer specific deliverables'],
    successRate: 76
  },

  // CLOSINGS
  {
    id: 'closing-1',
    category: 'closing',
    persona: 'universal',
    title: 'Assumption Close',
    content: "Based on our conversation, it sounds like this could be exactly what [Company] needs. Let me send you a calendar link right now so we can dive deeper into how this would work for your specific situation. What's the best email to send that to?",
    context: 'When prospect shows strong interest',
    tips: ['Act as if meeting is confirmed', 'Ask for email to send calendar'],
    successRate: 68
  },
  {
    id: 'closing-2',
    category: 'closing',
    persona: 'roi-focused-executive',
    title: 'ROI-Focused Close',
    content: "I think there's real potential for [Company] to see significant ROI from this approach. The next step would be a brief meeting where I can show you the specific numbers and projections for your situation. I typically see executives walk away from that conversation with a clear picture of the potential impact. Shall we schedule that for next week?",
    context: 'Focus on business impact and metrics',
    tips: ['Emphasize ROI and metrics', 'Reference other executives'],
    successRate: 71
  },
  {
    id: 'closing-3',
    category: 'closing',
    persona: 'cost-conscious-employer',
    title: 'Risk-Free Close',
    content: "Given your focus on cost management, I think you'd find value in seeing how we might optimize your current spend. There's no cost to explore this, and I can usually identify 2-3 immediate opportunities in our first conversation. Would next Tuesday or Wednesday work better for a quick call?",
    context: 'Remove risk and emphasize cost focus',
    tips: ['Emphasize no cost/risk', 'Promise immediate value'],
    successRate: 64
  },

  // INDUSTRY INSIGHTS - 2025 Economic Intelligence
  {
    id: 'industry-manufacturing-1',
    category: 'industry-insight',
    persona: 'universal',
    title: 'Manufacturing Supply Chain Risk',
    content: "Manufacturing companies are facing unprecedented supply chain volatility and geopolitical instability. What many leaders don't realize is how this directly impacts their workforce strategy. Disruptions can affect production schedules and revenue, making employee productivity and presence even more critical. We're helping manufacturing clients design proactive health and wellness programs that reduce absenteeism and disability claims during these volatile periods - essentially protecting the bottom line when operations are most vulnerable.",
    context: 'Connect industry challenges to benefits strategy',
    tips: ['Link external risks to internal workforce needs', 'Position benefits as business continuity tool'],
    industry: 'Manufacturing',
    successRate: 85,
    source: 'Campbell & Co. Industry Intelligence 2025'
  },
  {
    id: 'industry-tech-1',  
    category: 'industry-insight',
    persona: 'benefits-optimizer',
    title: 'Tech Sector Burnout Prevention',
    content: "The technology sector faces massive cybersecurity threats and data privacy regulations. What's often overlooked is the human cost - IT teams are experiencing unprecedented stress levels trying to prevent or respond to cyber incidents. A major breach can cause significant financial and reputational damage, but the burnout among key technical staff is equally dangerous. We're positioning robust mental health support, stress management resources, and comprehensive therapy coverage as crucial tools for supporting the resilience of teams on the front lines of cyber risk.",
    context: 'Connect cybersecurity stress to mental health benefits',
    tips: ['Focus on employee resilience', 'Position mental health as business risk mitigation'],
    industry: 'Technology',
    successRate: 82,
    source: 'Campbell & Co. Sector Analysis 2025'
  },

  // COMPETITIVE POSITIONING - Strategic Counter-Positioning
  {
    id: 'competitive-hub-1',
    category: 'competitive-positioning',
    persona: 'benefits-optimizer',
    title: 'Against HUB International - Human Strategy Focus',
    content: "I understand HUB has impressive data platforms. What we're finding is that while powerful dashboards provide lots of information, they often leave HR leaders asking 'So what do I do with all this data?' Our approach combines modern analytical tools with a dedicated strategic partner who knows your business and helps translate insights into actionable strategies specifically tailored to Southwestern Ontario companies. How does your current advisor help you interpret data and turn it into strategic decisions?",
    context: 'When prospect mentions HUB or large national firms',
    tips: ['Acknowledge their tech capabilities', 'Highlight human interpretation gap', 'Emphasize local knowledge'],
    successRate: 76,
    source: 'Campbell & Co. Competitive Intelligence 2025'
  },
  {
    id: 'competitive-cowan-1',
    category: 'competitive-positioning', 
    persona: 'roi-focused-executive',
    title: 'Against Cowan - ROI Measurement Focus',
    content: "A focus on wellness is absolutely critical, and Cowan does good work in that space. The question I'd ask is: how does your current partner use data and analytics to measure the ROI of your wellness programs? Can they show you tangible business outcomes like reduced absenteeism, improved productivity metrics, or quantified retention benefits? We're passionate about wellness, and we back that passion with hard data that proves value to leadership teams. What metrics are you currently using to evaluate your wellness investment?",
    context: 'When competing against wellness-focused providers',
    tips: ['Acknowledge their wellness strength', 'Probe for ROI measurement', 'Emphasize data-driven results'],
    successRate: 78,
    source: 'Campbell & Co. Competitive Analysis 2025'
  },

  // ECONOMIC CONTEXT - 2025 Market Intelligence
  {
    id: 'economic-inflation-1',
    category: 'economic-context',
    persona: 'cost-conscious-employer',
    title: 'Inflation Impact on Employee Compensation',
    content: "With Canada's CPI showing 3.1% year-over-year increases, particularly in housing and food costs, your employees' salaries aren't stretching as far as they used to. This makes a comprehensive and well-understood benefits package more critical than ever as a key part of their total compensation. We're also seeing inflation directly impact healthcare and dental service costs, which makes proactive cost-containment strategies essential to avoid significant renewal shocks. How are you thinking about benefits as protection against inflation pressures?",
    context: 'Use current economic data to demonstrate benefits value',
    tips: ['Reference specific inflation data', 'Connect to employee financial stress', 'Position benefits as compensation protection'],
    successRate: 74,
    source: 'Campbell & Co. Economic Dashboard 2025'
  },
  {
    id: 'economic-rates-1',
    category: 'economic-context',
    persona: 'roi-focused-executive', 
    title: 'Interest Rate Impact on Business Planning',
    content: "With the Bank of Canada holding rates at 4.75%, the higher cost of capital is putting pressure on cash flow for many businesses. This makes finding efficiencies and maximizing ROI on every dollar spent - including benefits - a top priority for the finance leaders I'm speaking with. Predictability is especially key in this environment. An unexpected double-digit increase on your benefits renewal can be particularly damaging to a tight budget. How are you building predictability into your benefits cost planning?",
    context: 'Connect interest rate environment to benefits ROI focus',
    tips: ['Reference current Bank of Canada rates', 'Emphasize cash flow pressures', 'Focus on predictability'],
    successRate: 81,
    source: 'Campbell & Co. Financial Intelligence 2025'
  }
];

export const getContentByCategory = (category: EnhancedContentItem['category'], persona?: PersonaType) => {
  return enhancedContentLibrary.filter(item => {
    if (item.category !== category) return false;
    if (!persona) return true;
    return item.persona === persona || item.persona === 'universal';
  });
};

export const getCategoryCounts = (persona?: PersonaType) => {
  const categories: EnhancedContentItem['category'][] = ['opener', 'objection-handler', 'thought-leadership', 'selling-point', 'cta', 'closing', 'industry-insight', 'competitive-positioning', 'economic-context'];
  
  return categories.reduce((counts, category) => {
    counts[category] = getContentByCategory(category, persona).length;
    return counts;
  }, {} as Record<EnhancedContentItem['category'], number>);
};