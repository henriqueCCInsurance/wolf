import { PersonaType } from '@/types';

export interface EnhancedContentItem {
  id: string;
  category: 'opener' | 'objection-handler' | 'thought-leadership' | 'selling-point' | 'cta' | 'closing' | 'industry-insight' | 'competitive-positioning' | 'economic-context';
  persona: PersonaType | 'universal';
  title: string;
  keywords: string[];
  context: string;
  content: string;
  tips?: string[];
  avoidSaying?: string[];
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
    keywords: ['TALENT RETENTION', 'COMPETITIVE ADVANTAGE', 'COST REDUCTION', 'STRATEGIC BENEFITS'],
    context: 'Opens with authority by referencing BDC research data. Connects benefits to business growth and competitive positioning rather than just cost savings. Positions Campbell & Co. as strategic partner who understands their specific industry challenges.',
    content: "Hi [Name], Colin Chalmers from Campbell & Co. I'm calling because the latest BDC report highlighted talent retention as the #1 challenge for SMEs in Ontario, and I noticed [Company] has been growing in the competitive [Industry] space. We've developed a specific approach that helps businesses like yours turn their benefits investment into a talent magnet that actually reduces costs. How have you been thinking about benefits as a strategic tool for growth?",
    tips: ['Reference specific reports/data', 'Connect to business growth', 'End with open question', 'Pause after stating the research insight'],
    avoidSaying: ['We sell insurance', 'I want to save you money', 'Are you the decision maker?', 'When is your renewal?'],
    successRate: 78,
    source: 'Campbell & Co. Research 2025'
  },
  {
    id: 'opener-2',
    category: 'opener',
    persona: 'roi-focused-executive',
    title: 'ROI-Driven Opening',
    keywords: ['MEASURABLE ROI', 'COST REDUCTION', 'TALENT MAGNET', 'QUANTIFIED RESULTS'],
    context: 'Immediately establishes credibility with specific, quantifiable results. Appeals to CFO mindset by leading with financial metrics rather than relationship building. Positions benefits as strategic investment with measurable returns.',
    content: "Good morning [Name], I noticed [Company] has been growing rapidly. We've helped similar companies turn their benefits programs into talent magnets that reduce turnover by 30% and recruiting costs by $50K annually. Given your focus on financial performance, I'd love to share how this impacts the bottom line. Do you have a moment to discuss the ROI framework we use?",
    tips: ['Lead with specific percentages and dollar amounts', 'Reference their company growth', 'Connect to financial performance', 'Ask about ROI frameworks'],
    avoidSaying: ['We offer great service', 'Benefits are important', 'Are you happy with your current provider?', 'Let me tell you about our company'],
    successRate: 72
  },
  {
    id: 'opener-hr-1',
    category: 'opener',
    persona: 'benefits-optimizer',
    title: 'Benefits Optimizer Strategic Opening (2025)',
    keywords: ['EMPLOYEE ENGAGEMENT', 'MULTI-GENERATIONAL WORKFORCE', 'MENTAL HEALTH', 'STRATEGIC HR'],
    context: 'Personalizes outreach by referencing their LinkedIn thought leadership. Demonstrates understanding of modern HR challenges with multi-generational workforce. Positions Campbell & Co. as strategic partner who understands evolving employee needs and can measure engagement impact.',
    content: "Hi [Name], Trevor McLachlan from Campbell & Co. I noticed your LinkedIn post about employee engagement challenges. What we're showing HR leaders across Southwestern Ontario is that while traditional benefits plans cover the basics, they often miss the mark on what today's multi-generational workforce actually values - like robust mental health support and flexible wellness options. Companies making this shift are seeing 40% increases in employee NPS scores. What's your current strategy for benefits that truly resonate with your diverse workforce?",
    tips: ['Reference specific LinkedIn posts/activity', 'Highlight generational diversity challenges', 'Focus on engagement metrics like eNPS', 'Emphasize mental health priority'],
    avoidSaying: ['Standard benefits packages', 'One-size-fits-all solutions', 'Basic coverage', 'Traditional insurance'],
    successRate: 79,
    source: 'Campbell & Co. Workforce Intelligence 2025'
  },

  // ENHANCED OBJECTION HANDLERS - Psychological Frameworks
  {
    id: 'objection-status-quo-1',
    category: 'objection-handler',
    persona: 'universal',
    title: '"We\'re happy with our current provider" - Challenger Approach',
    keywords: ['STATUS QUO CHALLENGE', 'LOSS AVERSION', 'HIDDEN COSTS', 'RISK-FREE REVIEW'],
    context: 'Uses challenger sales methodology to overcome status quo bias. Leverages loss aversion psychology by highlighting potential hidden costs. Creates urgency without pressure by offering no-obligation review. Respects existing relationship while introducing doubt about optimization.',
    content: "That's great to hear – a strong partnership is essential, and I respect that relationship. What I'm curious about is this: most of our clients initially felt the same way. The question they found valuable wasn't whether to change providers, but whether they truly understand what they might be missing. For instance, our analysis often uncovers that companies are unknowingly losing 10-15% of their benefits spend to underutilized features or misaligned plan design. Would it be worth a quick, no-obligation review to ensure that's not happening here?",
    tips: ['Acknowledge their satisfaction first', 'Introduce potential loss concept', 'Use social proof from similar clients', 'Offer risk-free review', 'Focus on optimization not replacement'],
    avoidSaying: ['You should switch providers', 'We\'re better than them', 'Are you sure you\'re happy?', 'Let me tell you what\'s wrong'],
    successRate: 73,
    source: 'Campbell & Co. Challenger Sales Training 2025'
  },
  {
    id: 'objection-2',
    category: 'objection-handler',
    persona: 'cost-conscious-employer',
    title: '"We don\'t have budget for changes"',
    keywords: ['BUDGET CONSTRAINTS', 'COST NEUTRAL', 'VALUE OPTIMIZATION', 'SMART SPENDING'],
    context: 'Addresses budget objection by reframing from additional cost to optimized spending. Uses loss aversion psychology to highlight potential waste in current spending. Positions review as cost-neutral exploration.',
    content: "I completely understand budget constraints. Actually, that's exactly why this conversation could be valuable. Many of our clients have found that our solutions either cost the same or less than what they're currently paying, while delivering better results. Would it make sense to explore whether that might be possible for [Company]?",
    tips: ['Emphasize potential savings over new costs', 'Remove financial pressure with cost-neutral language', 'Focus on optimization not addition'],
    avoidSaying: ['You need to spend more', 'This will cost extra', 'Your budget is too small', 'You can\'t afford not to'],
    successRate: 61
  },

  // COMPREHENSIVE OBJECTION HANDLERS BY PERSONA

  // Cost-Conscious Employer Objections
  {
    id: 'obj-cost-employer-1',
    category: 'objection-handler',
    persona: 'cost-conscious-employer',
    title: '"We just renewed our plan"',
    keywords: ['RENEWAL TIMING', 'PLANNING AHEAD', 'FUTURE SAVINGS', 'SMART PREPARATION'],
    context: 'Reframes renewal timing as opportunity for future planning. Positions early conversations as strategic preparation for next renewal cycle.',
    content: "That's actually perfect timing. The best decisions are made when you're not under renewal pressure. This gives us the opportunity to do a thorough analysis of what's working and what could be improved for your next renewal. Most of our clients wish they had started this conversation 6-8 months before their renewal. Would it make sense to get ahead of the curve this time?",
    tips: ['Position timing as advantage', 'Remove renewal pressure', 'Focus on future planning'],
    avoidSaying: ['You made a mistake', 'You should have called us first', 'It\'s not too late to change', 'Your current plan is wrong'],
    successRate: 68
  },
  {
    id: 'obj-cost-employer-2',
    category: 'objection-handler',
    persona: 'cost-conscious-employer',
    title: '"I don\'t have time for this"',
    keywords: ['TIME SAVINGS', 'EFFICIENCY', 'SIMPLIFIED PROCESS', 'QUICK WINS'],
    context: 'Acknowledges time constraints while positioning benefits review as time-saving investment. Uses specific time commitments to reduce perceived burden.',
    content: "I completely understand - time is your most valuable resource. That's exactly why I wanted to reach out. What we do is actually designed to save you time in the long run. A 20-minute conversation now could save you hours of benefits administration headaches later. Plus, many of our clients find we actually reduce the time they spend on HR issues by 30-40%. Would a brief 15-minute call next week be worth it if it could free up hours of your time each month?",
    tips: ['Acknowledge their time constraints', 'Quantify time savings', 'Offer specific short time commitment'],
    avoidSaying: ['This won\'t take long', 'You need to make time', 'Everyone has time for this', 'It\'s worth the time investment'],
    successRate: 72
  },
  {
    id: 'obj-cost-employer-3',
    category: 'objection-handler',
    persona: 'cost-conscious-employer',
    title: '"We work with family/friend in insurance"',
    keywords: ['RELATIONSHIP RESPECT', 'ADDITIONAL PERSPECTIVE', 'SECOND OPINION', 'COMPLEMENT NOT COMPETE'],
    context: 'Respects existing relationships while positioning as complementary resource. Uses social proof to normalize getting second opinions in business.',
    content: "I completely respect that relationship - personal trust is invaluable in business. What many of our best clients have found is that getting a second perspective actually strengthens their relationship with their current advisor. It either confirms they're on the right track or gives them valuable insights to discuss. We're not looking to interfere with that relationship, but rather to provide an independent review that helps you make the most informed decisions. Would a brief, no-obligation assessment be valuable just to confirm you're maximizing your investment?",
    tips: ['Respect the existing relationship', 'Position as complementary not competitive', 'Use second opinion framing'],
    avoidSaying: ['Friends/family aren\'t professionals', 'That\'s a conflict of interest', 'You need a real expert', 'Personal relationships cloud judgment'],
    successRate: 65
  },
  {
    id: 'obj-cost-employer-4',
    category: 'objection-handler',
    persona: 'cost-conscious-employer',
    title: '"Benefits aren\'t a priority right now"',
    keywords: ['HIDDEN COSTS', 'EMPLOYEE RETENTION', 'COMPETITIVE ADVANTAGE', 'BUSINESS IMPACT'],
    context: 'Reframes benefits from HR expense to business strategy tool. Connects benefits to core business priorities like retention and competition.',
    content: "I hear that from a lot of business owners, and it makes sense when you're focused on growth. What we've found is that the companies who treat benefits as a business strategy rather than just an HR expense are the ones that grow faster. For example, losing just one key employee can cost you $50,000-$75,000 in replacement costs and lost productivity. Would it be worth exploring how a strategic benefits approach could actually support your growth priorities rather than distract from them?",
    tips: ['Connect benefits to business growth', 'Quantify hidden costs of poor benefits', 'Reframe as strategic tool'],
    avoidSaying: ['Benefits should be a priority', 'Your employees need better benefits', 'You\'re making a mistake', 'Benefits are essential'],
    successRate: 69
  },
  {
    id: 'obj-cost-employer-5',
    category: 'objection-handler',
    persona: 'cost-conscious-employer',
    title: '"Send me some information"',
    keywords: ['TAILORED INFORMATION', 'SPECIFIC RELEVANCE', 'TARGETED INSIGHTS', 'CUSTOM ANALYSIS'],
    context: 'Avoids generic email trap by offering specific, relevant information. Creates need for follow-up conversation through customization.',
    content: "Absolutely, I'd be happy to send you relevant information. To make sure it's valuable and not just another generic brochure, could you help me understand what would be most useful? Are you more interested in cost optimization strategies, employee retention approaches, or compliance updates? Also, what industry benchmarks would be most relevant for a company your size? This way I can send you something that's actually worth your time to review.",
    tips: ['Offer customized information', 'Ask qualifying questions', 'Position as valuable not generic'],
    avoidSaying: ['Here\'s our standard brochure', 'I\'ll send everything', 'You can read about us online', 'Our website has all the information'],
    successRate: 58
  },

  // Benefits Optimizer (HR Manager) Objections
  {
    id: 'obj-hr-1',
    category: 'objection-handler',
    persona: 'benefits-optimizer',
    title: '"We have a great relationship with our broker"',
    keywords: ['RELATIONSHIP RESPECT', 'ENHANCED PARTNERSHIP', 'BENCHMARK COMPARISON', 'STRATEGIC VALIDATION'],
    context: 'Acknowledges existing relationship while introducing concept of strategic benchmarking. Positions as enhancement to existing partnership.',
    content: "That's wonderful - a strong broker relationship is so valuable in HR. The best HR leaders I work with actually use us as a strategic sounding board to benchmark their current programs and validate their broker's recommendations. It's not about replacing anyone, but about having an independent perspective on whether you're getting the strategic HR support you deserve. For instance, do they provide you with engagement metrics and wellness ROI data, or is it more focused on renewals and claims? A quick benchmarking conversation could actually strengthen your current relationship.",
    tips: ['Acknowledge their satisfaction', 'Position as benchmarking tool', 'Ask about strategic vs transactional support'],
    avoidSaying: ['Your broker isn\'t strategic enough', 'You\'re not getting good service', 'We\'re better than them', 'That relationship is limiting you'],
    successRate: 71
  },
  {
    id: 'obj-hr-2',
    category: 'objection-handler',
    persona: 'benefits-optimizer',
    title: '"Our employees seem satisfied with current benefits"',
    keywords: ['ENGAGEMENT MEASUREMENT', 'UNTAPPED POTENTIAL', 'STRATEGIC OPTIMIZATION', 'EMPLOYEE EXPERIENCE'],
    context: 'Challenges assumption about satisfaction while introducing measurement concepts. Positions benefits as strategic employee experience tool.',
    content: "That's great to hear! Satisfied employees are definitely the goal. What's interesting is that many HR leaders are surprised when they start measuring engagement more deeply. For example, do you track benefits utilization rates by demographic, or measure how benefits impact employee Net Promoter Scores? We often find that while employees seem satisfied, there are opportunities to turn satisfied employees into engaged advocates. Companies making this shift are seeing 40% increases in employee referrals. How do you currently measure the strategic impact of your benefits on employee engagement?",
    tips: ['Validate their assessment', 'Introduce measurement concepts', 'Differentiate satisfaction vs engagement'],
    avoidSaying: ['Your employees aren\'t really satisfied', 'Satisfaction isn\'t enough', 'You\'re not measuring correctly', 'There are hidden problems'],
    successRate: 74
  },
  {
    id: 'obj-hr-3',
    category: 'objection-handler',
    persona: 'benefits-optimizer',
    title: '"We don\'t have executive buy-in for benefits changes"',
    keywords: ['EXECUTIVE COMMUNICATION', 'BUSINESS CASE', 'ROI DEMONSTRATION', 'STRATEGIC ALIGNMENT'],
    context: 'Addresses executive alignment challenge by providing tools for internal selling. Offers business case framework for executive communication.',
    content: "That's one of the most common challenges HR leaders face - getting executives to see benefits as strategic rather than just a cost center. What we've done is develop frameworks that help HR leaders speak the executive language. For instance, we can show how benefits improvements translate to measurable ROI through reduced turnover, improved productivity, and stronger recruitment. We've helped HR leaders present business cases that resulted in 75% of executives approving strategic benefits investments. Would it be helpful to explore how to build that business case for your leadership team?",
    tips: ['Acknowledge common challenge', 'Offer executive communication tools', 'Provide success metrics'],
    avoidSaying: ['Your executives don\'t understand benefits', 'You need to push harder', 'Executives should prioritize this', 'That\'s not a valid concern'],
    successRate: 68
  },
  {
    id: 'obj-hr-4',
    category: 'objection-handler',
    persona: 'benefits-optimizer',
    title: '"We\'re focusing on other HR priorities right now"',
    keywords: ['INTEGRATED STRATEGY', 'COMPETITIVE ADVANTAGE', 'TALENT STRATEGY', 'HOLISTIC APPROACH'],
    context: 'Connects benefits to broader HR strategy rather than treating as separate initiative. Shows how benefits support other HR priorities.',
    content: "That makes complete sense - there's always so much on the HR plate. What's interesting is how benefits strategy actually supports most other HR priorities. For example, if you're working on diversity and inclusion, benefits can be a powerful tool for creating inclusive employee experiences. If retention is a focus, strategic benefits design can reduce turnover by 25-30%. Rather than being another priority, benefits can actually accelerate progress on your existing initiatives. What are your top HR priorities this year? I'd love to show you how benefits strategy could support those goals.",
    tips: ['Acknowledge competing priorities', 'Connect benefits to their priorities', 'Position as accelerator not addition'],
    avoidSaying: ['Benefits should be the priority', 'You\'re missing an opportunity', 'Other priorities can wait', 'Benefits affect everything'],
    successRate: 72
  },
  {
    id: 'obj-hr-5',
    category: 'objection-handler',
    persona: 'benefits-optimizer',
    title: '"We need to see a detailed proposal first"',
    keywords: ['DISCOVERY FIRST', 'TAILORED SOLUTIONS', 'STRATEGIC ASSESSMENT', 'CUSTOMIZED APPROACH'],
    context: 'Explains why discovery is essential for meaningful proposals. Positions discovery process as valuable strategic exercise.',
    content: "I absolutely understand wanting to see something concrete. The challenge with benefits is that a meaningful proposal really depends on understanding your unique workforce, culture, and strategic goals. A generic proposal wouldn't do justice to what you're trying to achieve. What we've found works best is a strategic discovery process that results in a truly customized recommendation. This process itself often provides valuable insights that HR leaders find worth the time investment. Would you be open to a strategic benefits assessment that would result in a tailored proposal specifically designed for your organization's needs?",
    tips: ['Validate their desire for proposals', 'Explain need for discovery', 'Position discovery as valuable'],
    avoidSaying: ['We don\'t do proposals upfront', 'You need to trust us first', 'Standard proposals don\'t work', 'That\'s not how we operate'],
    successRate: 66
  },

  // ROI-Focused Executive (CFO) Objections
  {
    id: 'obj-cfo-1',
    category: 'objection-handler',
    persona: 'roi-focused-executive',
    title: '"Show me the ROI numbers first"',
    keywords: ['QUANTIFIABLE METRICS', 'FINANCIAL MODELING', 'BENCHMARK DATA', 'MEASURABLE RETURNS'],
    context: 'Provides specific ROI framework while acknowledging need for company-specific analysis. Uses concrete financial metrics.',
    content: "Absolutely - ROI is the foundation of any strategic investment. Here's what we typically see: companies implementing our strategic benefits approach achieve 15-25% reduction in turnover costs, which for a 100-employee company averages $150,000-$250,000 in annual savings. Add reduced recruitment costs, decreased absenteeism, and improved productivity, and we're seeing 200-400% ROI in year two. However, your specific ROI depends on your current costs and turnover rates. Would it make sense to run a preliminary ROI analysis based on your actual numbers to see what's realistic for your organization?",
    tips: ['Provide specific ROI ranges', 'Offer to customize analysis', 'Use concrete dollar amounts'],
    avoidSaying: ['ROI is hard to measure', 'Trust us on the returns', 'You\'ll see benefits eventually', 'Some things can\'t be quantified'],
    successRate: 78
  },
  {
    id: 'obj-cfo-2',
    category: 'objection-handler',
    persona: 'roi-focused-executive',
    title: '"Benefits costs are already too high"',
    keywords: ['COST OPTIMIZATION', 'EFFICIENCY IMPROVEMENT', 'SPEND ANALYSIS', 'VALUE ENGINEERING'],
    context: 'Reframes from cost reduction to cost optimization. Introduces concept of benefits efficiency and value engineering.',
    content: "That's exactly why this conversation could be valuable. High costs often indicate inefficiencies rather than comprehensive coverage. We specialize in benefits value engineering - maintaining or improving coverage while optimizing spend. For example, we recently helped a similar company reduce their per-employee benefits costs by 18% while actually improving employee satisfaction scores. The key is analyzing utilization data, plan design efficiency, and carrier performance. Would a cost optimization analysis be valuable to identify potential savings in your current spend?",
    tips: ['Acknowledge cost concerns', 'Focus on optimization not reduction', 'Provide specific savings examples'],
    avoidSaying: ['You need to spend more', 'Costs are reasonable', 'You get what you pay for', 'Cheap benefits don\'t work'],
    successRate: 75
  },
  {
    id: 'obj-cfo-3',
    category: 'objection-handler',
    persona: 'roi-focused-executive',
    title: '"We need predictable costs, not variables"',
    keywords: ['COST PREDICTABILITY', 'FINANCIAL PLANNING', 'BUDGET CERTAINTY', 'RISK MANAGEMENT'],
    context: 'Addresses predictability concerns by introducing advanced financial modeling and risk management approaches.',
    content: "Predictability is absolutely critical for financial planning. That's why we've developed advanced financial modeling that provides 3-year cost projections with 95% accuracy. We also structure plans with cost corridors and risk-sharing mechanisms that virtually eliminate surprise renewals. For instance, we can design cost caps that ensure your benefits spend never exceeds budget parameters. Additionally, our predictive analytics help forecast claim trends before they impact renewals. Would a financial risk assessment showing how to achieve cost predictability be valuable for your planning process?",
    tips: ['Acknowledge predictability needs', 'Offer specific financial tools', 'Mention cost protection mechanisms'],
    avoidSaying: ['Healthcare costs are unpredictable', 'You have to accept some risk', 'Predictions aren\'t possible', 'That\'s just how insurance works'],
    successRate: 73
  },
  {
    id: 'obj-cfo-4',
    category: 'objection-handler',
    persona: 'roi-focused-executive',
    title: '"Benefits don\'t directly impact our P&L"',
    keywords: ['P&L IMPACT', 'OPERATIONAL EFFICIENCY', 'PRODUCTIVITY METRICS', 'FINANCIAL PERFORMANCE'],
    context: 'Challenges assumption by demonstrating direct P&L connections through productivity, retention, and operational efficiency.',
    content: "That's a common perception, but the data tells a different story. Strategic benefits directly impact your P&L through several channels: reduced turnover saves $50K-$75K per retained employee, decreased absenteeism improves productivity by 8-12%, and strategic wellness programs reduce healthcare claims by 15-20%. We track these metrics for our clients. For example, one client saw a $180,000 improvement in their EBITDA solely from benefits optimization. Would it be valuable to see how benefits strategy could directly improve your operational efficiency and bottom line?",
    tips: ['Challenge the assumption with data', 'Connect to specific P&L metrics', 'Provide concrete examples'],
    avoidSaying: ['Benefits are strategic anyway', 'You should care about employees', 'Not everything is about money', 'It\'s the right thing to do'],
    successRate: 71
  },
  {
    id: 'obj-cfo-5',
    category: 'objection-handler',
    persona: 'roi-focused-executive',
    title: '"This isn\'t the right time financially"',
    keywords: ['FINANCIAL TIMING', 'COST-NEUTRAL APPROACH', 'EFFICIENCY GAINS', 'SMART INVESTMENT'],
    context: 'Addresses timing concerns by positioning as cost-neutral efficiency improvement rather than additional investment.',
    content: "I understand timing concerns, especially in uncertain economic periods. What's interesting is that economic pressure is exactly when benefits optimization becomes most valuable. We can often improve your benefits program cost-neutrally by eliminating inefficiencies and redirecting existing spend more strategically. This isn't about increasing investment - it's about maximizing the ROI on dollars you're already spending. In fact, tight economic times are when our cost optimization expertise delivers the highest value. Would a cost-neutral efficiency analysis make sense to explore during this period?",
    tips: ['Acknowledge economic concerns', 'Position as efficiency not investment', 'Emphasize cost-neutral approach'],
    avoidSaying: ['You need to invest now', 'This is the perfect time', 'Economic concerns aren\'t valid', 'You can\'t afford not to'],
    successRate: 69
  },

  // Strategic CEO Objections
  {
    id: 'obj-ceo-1',
    category: 'objection-handler',
    persona: 'strategic-ceo',
    title: '"Benefits aren\'t strategic to our vision"',
    keywords: ['STRATEGIC ALIGNMENT', 'COMPETITIVE ADVANTAGE', 'TALENT STRATEGY', 'VISION EXECUTION'],
    context: 'Reframes benefits from operational expense to strategic enabler of business vision. Connects benefits to CEO priorities like growth, competition, and talent.',
    content: "I hear that perspective often, and it usually means benefits haven't been positioned strategically. What the most successful CEOs are discovering is that benefits can be a powerful tool for executing their vision. For instance, if your vision includes rapid growth, strategic benefits become your talent acquisition and retention engine. If it's about innovation, benefits support the employee experience that attracts creative talent. Companies using benefits strategically are seeing 25% faster revenue growth because they can attract and keep the people who execute their vision. How might strategic benefits support your specific growth objectives?",
    tips: ['Connect benefits to business vision', 'Reference CEO peer success', 'Focus on execution enablement'],
    avoidSaying: ['Benefits are always strategic', 'You should care about employees', 'All CEOs prioritize benefits', 'It\'s about being a good employer'],
    successRate: 77
  },
  {
    id: 'obj-ceo-2',
    category: 'objection-handler',
    persona: 'strategic-ceo',
    title: '"We need to focus on revenue growth first"',
    keywords: ['GROWTH ENABLEMENT', 'REVENUE SUPPORT', 'TALENT ACQUISITION', 'COMPETITIVE POSITIONING'],
    context: 'Positions benefits as growth enabler rather than cost center. Shows how strategic benefits accelerate revenue growth through talent strategy.',
    content: "Revenue growth is absolutely the priority - that's exactly why this conversation is relevant. The fastest-growing companies we work with use benefits as a competitive weapon for talent acquisition. When you can attract top performers 30% faster and retain them 40% longer, it directly accelerates revenue growth. For example, one client credits their strategic benefits approach with enabling them to hire the sales team that drove $2M in new revenue last year. Rather than competing with growth priorities, strategic benefits fuel them. What's your biggest talent challenge in achieving your revenue goals?",
    tips: ['Position benefits as growth tool', 'Connect to talent challenges', 'Provide revenue-focused examples'],
    avoidSaying: ['Revenue isn\'t everything', 'You need balance', 'Growth requires good benefits', 'Take care of people first'],
    successRate: 74
  },
  {
    id: 'obj-ceo-3',
    category: 'objection-handler',
    persona: 'strategic-ceo',
    title: '"I delegate benefits to HR/finance"',
    keywords: ['STRATEGIC OVERSIGHT', 'COMPETITIVE INTELLIGENCE', 'EXECUTIVE ALIGNMENT', 'BUSINESS IMPACT'],
    context: 'Acknowledges delegation while positioning CEO involvement as strategic oversight for competitive advantage.',
    content: "That delegation makes complete sense for day-to-day management. What I've found is that the most successful CEOs maintain strategic oversight of benefits because it's such a powerful competitive tool. For instance, when Amazon or Google makes benefits moves, it affects the entire talent market. Your benefits strategy can be a differentiator that supports your competitive positioning. We work with your team on execution while providing you with strategic intelligence on how benefits impact your market position. Would it be valuable to understand how your benefits compare competitively and what strategic opportunities might exist?",
    tips: ['Respect delegation while emphasizing strategic role', 'Use competitive framing', 'Position as market intelligence'],
    avoidSaying: ['You should be more involved', 'CEOs need to care about benefits', 'Don\'t delegate important decisions', 'Your team isn\'t strategic enough'],
    successRate: 68
  },
  {
    id: 'obj-ceo-4',
    category: 'objection-handler',
    persona: 'strategic-ceo',
    title: '"We\'re too small for sophisticated benefits"',
    keywords: ['COMPETITIVE LEVERAGE', 'DAVID VS GOLIATH', 'STRATEGIC ADVANTAGE', 'SMART SCALING'],
    context: 'Reframes size as advantage for agility and strategic benefits implementation. Positions sophisticated benefits as competitive equalizer.',
    content: "Actually, size can be your competitive advantage here. While large companies are constrained by bureaucracy and legacy plans, you have the agility to implement cutting-edge benefits strategies quickly. Some of our most successful implementations are with companies your size who use sophisticated benefits to compete for talent against much larger competitors. We've seen 50-person companies win talent from 500-person companies because they offer a more strategic, personalized benefits experience. Your size allows for innovation that larger companies can't match. Would it be interesting to explore how to turn your size into a competitive advantage in the talent market?",
    tips: ['Reframe size as advantage', 'Emphasize agility benefits', 'Use competitive positioning'],
    avoidSaying: ['Size doesn\'t matter', 'Small companies need benefits too', 'You can afford this', 'Start simple and grow'],
    successRate: 71
  },
  {
    id: 'obj-ceo-5',
    category: 'objection-handler',
    persona: 'strategic-ceo',
    title: '"Show me how this impacts market valuation"',
    keywords: ['MARKET VALUATION', 'INVESTOR APPEAL', 'ESG METRICS', 'STRATEGIC ASSET'],
    context: 'Addresses valuation impact through investor relations, ESG metrics, and strategic asset positioning of benefits programs.',
    content: "That's a sophisticated question that many investors are starting to ask. Strategic benefits programs impact valuation through several channels: they reduce key-person risk by improving retention, demonstrate strong ESG governance that investors value, and create sustainable competitive advantages. For example, companies with strategic benefits see 23% lower voluntary turnover, which investors view as operational stability. Additionally, modern investors increasingly evaluate companies on their ability to attract and retain talent - especially in knowledge-based industries. Would it be valuable to explore how to position your benefits strategy as a strategic asset that enhances investor confidence?",
    tips: ['Connect to investor concerns', 'Mention ESG factors', 'Focus on risk reduction'],
    avoidSaying: ['Valuation isn\'t affected by benefits', 'Investors don\'t care about this', 'Focus on operations not valuation', 'Benefits don\'t impact enterprise value'],
    successRate: 72
  },

  // Operations Leader Objections
  {
    id: 'obj-ops-1',
    category: 'objection-handler',
    persona: 'operations-leader',
    title: '"We can\'t afford operational disruption"',
    keywords: ['SEAMLESS TRANSITION', 'MINIMAL DISRUPTION', 'OPERATIONAL CONTINUITY', 'EFFICIENT IMPLEMENTATION'],
    context: 'Addresses disruption concerns by emphasizing seamless implementation methodology and operational continuity focus.',
    content: "Operational continuity is absolutely critical - that's exactly how we approach every implementation. Our methodology is specifically designed for operational leaders who can't afford disruption. We typically implement changes during natural break points, with parallel systems running until seamless transition. Most clients experience zero operational disruption because we handle all the complexity behind the scenes. In fact, our streamlined administration often reduces your team's operational burden within 30 days. Would it be helpful to review our implementation methodology to see how we ensure operational continuity?",
    tips: ['Acknowledge operational priorities', 'Emphasize seamless methodology', 'Promise reduced burden'],
    avoidSaying: ['Change is always disruptive', 'You\'ll adapt quickly', 'Some disruption is worth it', 'Your team can handle it'],
    successRate: 76
  },
  {
    id: 'obj-ops-2',
    category: 'objection-handler',
    persona: 'operations-leader',
    title: '"Benefits administration takes too much management time"',
    keywords: ['TIME EFFICIENCY', 'AUTOMATED SYSTEMS', 'REDUCED ADMIN', 'OPERATIONAL LEVERAGE'],
    context: 'Positions modern benefits as time-saving operational tool through automation and streamlined administration.',
    content: "That's exactly the problem we solve. Traditional benefits administration is incredibly time-intensive, but modern benefits technology can actually free up management time. Our clients typically see 60-70% reduction in benefits-related administrative tasks through automation, self-service portals, and streamlined processes. For example, instead of managers fielding benefits questions, employees access everything through mobile apps. Instead of chasing paper forms, everything is digital and automated. Would a time-savings analysis showing exactly how many management hours we could recover be valuable?",
    tips: ['Acknowledge current time burden', 'Quantify time savings', 'Emphasize automation'],
    avoidSaying: ['Administration isn\'t that hard', 'You should invest more time', 'Good benefits require effort', 'Your team should handle this'],
    successRate: 79
  },
  {
    id: 'obj-ops-3',
    category: 'objection-handler',
    persona: 'operations-leader',
    title: '"Integration with our systems is too complex"',
    keywords: ['SEAMLESS INTEGRATION', 'API CONNECTIVITY', 'SYSTEM COMPATIBILITY', 'TECHNICAL SIMPLICITY'],
    context: 'Addresses integration concerns by highlighting modern API connectivity and proven integration methodology.',
    content: "System integration is a valid concern, but modern benefits platforms are designed for seamless connectivity. We integrate with virtually every HRIS, payroll, and accounting system through robust APIs. Our integration team has connected with systems ranging from QuickBooks to SAP, usually within 2-3 weeks with minimal IT involvement. Most importantly, we handle all the technical complexity so your operations team doesn't have to. Would it be helpful to have our integration specialist review your current systems to confirm compatibility and timeline?",
    tips: ['Acknowledge integration complexity', 'Emphasize API capabilities', 'Offer technical review'],
    avoidSaying: ['Integration is easy', 'Your systems don\'t matter', 'You should upgrade your systems', 'Manual processes work fine'],
    successRate: 73
  },
  {
    id: 'obj-ops-4',
    category: 'objection-handler',
    persona: 'operations-leader',
    title: '"We need consistent, predictable processes"',
    keywords: ['PROCESS STANDARDIZATION', 'PREDICTABLE WORKFLOWS', 'OPERATIONAL CONSISTENCY', 'RELIABLE SYSTEMS'],
    context: 'Emphasizes how strategic benefits improve process consistency and operational predictability through standardization.',
    content: "Process consistency is fundamental to operational excellence. That's why we focus heavily on standardizing and documenting every benefits workflow. Our approach typically results in more predictable processes than most companies have today. For example, we create standard operating procedures for enrollment, claims, and employee communications that eliminate variability. Our clients often tell us that benefits administration becomes their most predictable HR process. Would it be valuable to see examples of how we standardize benefits operations to improve consistency?",
    tips: ['Emphasize standardization focus', 'Promise improved predictability', 'Offer process examples'],
    avoidSaying: ['Flexibility is more important', 'Processes will evolve', 'You\'re too rigid', 'Standardization limits options'],
    successRate: 75
  },
  {
    id: 'obj-ops-5',
    category: 'objection-handler',
    persona: 'operations-leader',
    title: '"ROI on operational efficiency isn\'t clear"',
    keywords: ['OPERATIONAL METRICS', 'EFFICIENCY GAINS', 'PRODUCTIVITY MEASUREMENT', 'QUANTIFIED IMPACT'],
    context: 'Provides specific operational efficiency metrics and measurement frameworks for benefits optimization.',
    content: "Operational ROI is absolutely measurable in benefits optimization. We track specific metrics: reduction in help desk tickets (typically 40-50%), decrease in payroll processing time (usually 20-30%), and elimination of manual tasks (often saving 15-20 hours per month). For a company your size, this typically translates to $25,000-$40,000 in annual operational cost savings, plus improved employee productivity. We provide monthly operational efficiency reports so you can track the impact. Would it be helpful to model the specific operational ROI based on your current processes?",
    tips: ['Provide specific operational metrics', 'Quantify time and cost savings', 'Offer measurement framework'],
    avoidSaying: ['Efficiency is hard to measure', 'Benefits improve everything', 'ROI isn\'t the point', 'Trust that it works'],
    successRate: 77
  },

  // Culture Champion Objections
  {
    id: 'obj-culture-1',
    category: 'objection-handler',
    persona: 'culture-champion',
    title: '"Our culture is unique, standard benefits won\'t work"',
    keywords: ['CULTURE CUSTOMIZATION', 'UNIQUE VALUES', 'PERSONALIZED APPROACH', 'AUTHENTIC ALIGNMENT'],
    context: 'Acknowledges culture uniqueness while positioning benefits as tool to reinforce and express cultural values.',
    content: "You're absolutely right - unique cultures require unique approaches, and that's exactly what we specialize in. Rather than standard benefits, we design programs that authentically reflect your cultural values. For example, if innovation is core to your culture, we might include learning stipends and sabbatical programs. If community matters, we'd emphasize volunteer time and local giving programs. The most successful culture champions we work with use benefits as a way to reinforce what makes their organization special. What are the core values that define your culture?",
    tips: ['Validate culture uniqueness', 'Offer customization examples', 'Ask about core values'],
    avoidSaying: ['All cultures are similar', 'Standard benefits work everywhere', 'Culture doesn\'t affect benefits', 'You\'re overthinking this'],
    successRate: 81
  },
  {
    id: 'obj-culture-2',
    category: 'objection-handler',
    persona: 'culture-champion',
    title: '"Benefits feel transactional, not authentic"',
    keywords: ['AUTHENTIC ENGAGEMENT', 'MEANINGFUL CONNECTION', 'VALUE ALIGNMENT', 'GENUINE CARE'],
    context: 'Addresses authenticity concerns by positioning benefits as expression of genuine organizational values and care.',
    content: "That's a really important distinction, and it's exactly why we focus on benefits that authentically express your organization's values rather than just checking boxes. The most meaningful benefits programs we've designed feel like natural extensions of the company's character. For instance, instead of generic wellness programs, we might create initiatives that reflect how your organization really thinks about well-being. The goal is benefits that employees experience as genuine expressions of care, not HR compliance. How do you currently express your organization's values in ways that feel authentic to employees?",
    tips: ['Acknowledge authenticity concerns', 'Focus on value expression', 'Ask about current authentic practices'],
    avoidSaying: ['All benefits show you care', 'Employees appreciate any benefits', 'Authenticity isn\'t important', 'Just focus on coverage'],
    successRate: 78
  },
  {
    id: 'obj-culture-3',
    category: 'objection-handler',
    persona: 'culture-champion',
    title: '"We need more focus on diversity and inclusion"',
    keywords: ['INCLUSIVE BENEFITS', 'DIVERSE NEEDS', 'EQUITY FOCUS', 'BELONGING SUPPORT'],
    context: 'Positions benefits as powerful tool for advancing diversity, equity, and inclusion goals through inclusive design.',
    content: "DEI is fundamental to modern benefits design, and it's an area where benefits can be one of your most powerful tools. We specialize in creating inclusive benefits that serve diverse family structures, cultural backgrounds, and life stages. For example, we design fertility support that includes adoption and surrogacy, mental health resources that are culturally competent, and flexible time off that respects different cultural traditions. The most progressive organizations we work with use benefits to demonstrate their commitment to inclusion in tangible ways. What are your biggest DEI priorities where benefits could make an impact?",
    tips: ['Emphasize DEI expertise', 'Provide inclusive examples', 'Ask about DEI priorities'],
    avoidSaying: ['Standard benefits are inclusive enough', 'DEI is too complicated', 'Focus on the majority', 'Special needs are expensive'],
    successRate: 82
  },
  {
    id: 'obj-culture-4',
    category: 'objection-handler',
    persona: 'culture-champion',
    title: '"Employees want meaningful work, not just benefits"',
    keywords: ['PURPOSE ALIGNMENT', 'MEANINGFUL SUPPORT', 'HOLISTIC EXPERIENCE', 'VALUE INTEGRATION'],
    context: 'Positions benefits as supporting meaningful work rather than replacing it. Shows how benefits can enhance purpose and engagement.',
    content: "You're absolutely right - meaningful work is fundamental, and great benefits actually support that sense of purpose rather than replace it. When people aren't worried about healthcare costs or struggling with work-life balance, they can focus more fully on meaningful contributions. The best benefits programs we design help remove barriers to engagement and purpose. For instance, mental health support helps people bring their best selves to work, learning benefits help them grow in their roles, and family support lets them be present for what matters. How might benefits remove obstacles to the meaningful work your team wants to do?",
    tips: ['Agree about meaningful work priority', 'Position benefits as supporting purpose', 'Ask about engagement obstacles'],
    avoidSaying: ['Benefits are meaningful too', 'Work isn\'t everything', 'People need security first', 'Benefits motivate people'],
    successRate: 79
  },
  {
    id: 'obj-culture-5',
    category: 'objection-handler',
    persona: 'culture-champion',
    title: '"Mental health support isn\'t comprehensive enough"',
    keywords: ['COMPREHENSIVE WELLNESS', 'MENTAL HEALTH PRIORITY', 'HOLISTIC SUPPORT', 'STIGMA REDUCTION'],
    context: 'Addresses mental health as strategic priority with comprehensive, stigma-free support systems and measurement.',
    content: "Mental health is absolutely critical, and it's an area where most traditional benefits fall short. We design comprehensive mental health ecosystems that go far beyond basic EAPs. This includes on-demand therapy, peer support networks, mental health days, manager training on psychological safety, and destigmatization programs. We also measure impact through engagement surveys and wellbeing assessments. The most forward-thinking culture leaders we work with are making mental health support a cornerstone of their employee experience. What gaps do you see in current mental health support that we should prioritize addressing?",
    tips: ['Acknowledge mental health priority', 'Describe comprehensive approach', 'Ask about current gaps'],
    avoidSaying: ['EAPs are sufficient', 'Mental health is too complex', 'Focus on physical health first', 'That\'s too expensive'],
    successRate: 84
  },

  // Gatekeeper Objections
  {
    id: 'obj-gate-1',
    category: 'objection-handler',
    persona: 'gatekeeper',
    title: '"They\'re too busy for sales calls"',
    keywords: ['RESPECT FOR TIME', 'VALUABLE CONTENT', 'BRIEF COMMITMENT', 'RELEVANT PRIORITY'],
    context: 'Acknowledges time constraints while positioning call as valuable business discussion rather than sales pitch.',
    content: "I completely understand how busy they are, and I really appreciate you protecting their time - that's so important. This isn't a sales call, but rather a brief business discussion about cost optimization strategies that could save significant time and money. Most executives find this type of strategic conversation valuable, especially when it's focused on their specific challenges. Would a brief 10-minute call about operational efficiency in their area be something they might find worthwhile, or would you recommend a different approach?",
    tips: ['Acknowledge their protective role', 'Reframe from sales to business value', 'Offer brief time commitment'],
    avoidSaying: ['Everyone has time for this', 'This is really important', 'They should want to hear this', 'Can you just put me through?'],
    successRate: 67
  },
  {
    id: 'obj-gate-2',
    category: 'objection-handler',
    persona: 'gatekeeper',
    title: '"Send information and they\'ll review it"',
    keywords: ['TARGETED INFORMATION', 'RELEVANT CONTENT', 'SPECIFIC VALUE', 'FOLLOW-UP PLAN'],
    context: 'Offers specific, relevant information while maintaining potential for meaningful follow-up conversation.',
    content: "That makes perfect sense, and I'd be happy to send relevant information. To make sure it's valuable and not just another email they have to delete, could you help me understand what would be most useful? Are they more focused on cost control, operational efficiency, or employee-related challenges right now? This way I can send something specifically relevant to their current priorities. Would it be helpful if I also included a brief summary they could review in just 2-3 minutes?",
    tips: ['Offer targeted information', 'Ask qualifying questions', 'Position as time-efficient'],
    avoidSaying: ['Information isn\'t enough', 'They need to talk to me', 'Emails don\'t work', 'This requires a conversation'],
    successRate: 71
  },
  {
    id: 'obj-gate-3',
    category: 'objection-handler',
    persona: 'gatekeeper',
    title: '"We\'re not interested in insurance sales"',
    keywords: ['BUSINESS CONSULTATION', 'STRATEGIC ADVICE', 'OPERATIONAL FOCUS', 'VALUE BEYOND PRODUCTS'],
    context: 'Reframes from insurance sales to business consultation and operational efficiency discussion.',
    content: "I completely understand - and honestly, this isn't really an insurance sales call. We work with business leaders on operational efficiency and cost optimization strategies. Many of our conversations end up having nothing to do with insurance and everything to do with streamlining processes and reducing administrative burdens. We often help companies identify savings and efficiencies they didn't know existed. Does that type of business consultation sound more relevant to their current priorities?",
    tips: ['Reframe from insurance to business consultation', 'Focus on operational value', 'Emphasize efficiency gains'],
    avoidSaying: ['This isn\'t really sales', 'Insurance is important', 'Everyone needs insurance', 'You\'re missing out'],
    successRate: 69
  },
  {
    id: 'obj-gate-4',
    category: 'objection-handler',
    persona: 'gatekeeper',
    title: '"They handle all vendor decisions"',
    keywords: ['DECISION MAKER RESPECT', 'PROPER CHANNELS', 'RELEVANT TIMING', 'APPROPRIATE APPROACH'],
    context: 'Acknowledges decision-making authority while requesting guidance on appropriate timing and approach.',
    content: "That's exactly why I'm calling you first - I want to make sure I approach this properly and respectfully. I have information that could be valuable for their decision-making, but I want to present it at the right time and in the right way. In your experience, when are they typically most open to discussions about operational improvements or cost optimization? Would it be better to reach out during a specific time of month or year, or is there a particular format they prefer for business discussions?",
    tips: ['Acknowledge their decision-making authority', 'Ask for timing guidance', 'Show respect for proper process'],
    avoidSaying: ['I need to talk to the decision maker', 'You can\'t help with this', 'This is above your level', 'I only deal with executives'],
    successRate: 73
  },
  {
    id: 'obj-gate-5',
    category: 'objection-handler',
    persona: 'gatekeeper',
    title: '"We work with someone for this already"',
    keywords: ['RELATIONSHIP RESPECT', 'ADDITIONAL PERSPECTIVE', 'SECOND OPINION', 'STRATEGIC REVIEW'],
    context: 'Respects existing relationships while positioning as complementary strategic review for business optimization.',
    content: "That's great that they have a trusted relationship - those partnerships are really valuable. What many executives find helpful is occasionally getting a second opinion or strategic review, not to replace anyone, but to confirm they're maximizing their investment and identifying any opportunities they might be missing. It's similar to getting a second opinion on any important business decision. Would they potentially be interested in a brief strategic review just to validate their current approach, or do you think they prefer to focus exclusively on their current relationship?",
    tips: ['Respect existing relationships', 'Position as second opinion', 'Emphasize validation not replacement'],
    avoidSaying: ['Their current provider isn\'t good enough', 'We\'re better', 'They should switch', 'That relationship is limiting them'],
    successRate: 68
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