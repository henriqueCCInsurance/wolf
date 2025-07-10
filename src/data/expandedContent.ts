import { ContentItem } from '@/types';

export const expandedContentLibrary: ContentItem[] = [
  // ============ CONVERSATION OPENERS ============
  
  // Cost-Conscious Employer Openers (Business Owners)
  {
    id: 'cce-opener-1',
    type: 'opener',
    persona: 'cost-conscious-employer',
    content: 'I work with local business owners to get more value from the money they\'re already spending on benefits. With costs rising, is that something on your mind?',
    context: 'Focus on immediate cost concerns and value optimization'
  },
  {
    id: 'cce-opener-2',
    type: 'opener',
    persona: 'cost-conscious-employer',
    content: 'Hi [Name], I\'m calling because I noticed you\'re in the [Industry] space in our area. We\'ve helped businesses like yours reduce their benefits costs by 15-20% while actually improving employee satisfaction. Would that interest you?',
    context: 'Specific benefit with measurable outcome'
  },
  {
    id: 'cce-opener-3',
    type: 'opener',
    persona: 'cost-conscious-employer',
    content: 'Many business owners don\'t realize they\'re overpaying for benefits that employees don\'t even value. I help companies like yours design plans that employees actually use and appreciate, often at lower cost. Worth a conversation?',
    context: 'Challenges assumptions about current benefits'
  },
  {
    id: 'cce-opener-4',
    type: 'opener',
    persona: 'cost-conscious-employer',
    content: 'I specialize in helping growing companies avoid the benefits renewal shock that typically hits businesses when they reach 15-50 employees. Is predictable benefits budgeting important to your planning?',
    context: 'Addresses growth-stage concerns and predictability'
  },
  {
    id: 'cce-opener-5',
    type: 'opener',
    persona: 'cost-conscious-employer',
    content: 'Quick question - when was the last time someone showed you exactly what you\'re paying for in your benefits plan and whether employees are actually using those features? Most owners are surprised by what they find.',
    context: 'Creates curiosity about current plan efficiency'
  },
  {
    id: 'cce-opener-6',
    type: 'opener',
    persona: 'cost-conscious-employer',
    content: 'I\'m calling local business owners because we\'ve developed a way to turn your benefits plan from a necessary expense into a competitive advantage for recruiting. Is attracting good people a challenge for you right now?',
    context: 'Reframes benefits as recruitment tool'
  },

  // Benefits Optimizer Openers (HR Managers)
  {
    id: 'bo-opener-1',
    type: 'opener',
    persona: 'benefits-optimizer',
    content: 'I\'m reaching out to HR leaders who are looking to make their benefits program more strategic. We help companies like yours demonstrate clear ROI on benefits spend while improving employee engagement. Is that a priority for you this year?',
    context: 'Focus on strategic value and measurable outcomes'
  },
  {
    id: 'bo-opener-2',
    type: 'opener',
    persona: 'benefits-optimizer',
    content: 'Many HR managers are finding that traditional benefits plans aren\'t keeping up with employee needs around mental health and wellness. We\'re helping companies build more comprehensive support systems. Is this resonating with what you\'re seeing?',
    context: 'Addresses current wellness trends and employee needs'
  },
  {
    id: 'bo-opener-3',
    type: 'opener',
    persona: 'benefits-optimizer',
    content: 'I help HR professionals turn their benefits program into a measurable driver of employee retention and satisfaction. Are you currently able to show leadership how your benefits investments are performing?',
    context: 'Challenges ability to demonstrate value to leadership'
  },
  {
    id: 'bo-opener-4',
    type: 'opener',
    persona: 'benefits-optimizer',
    content: 'We\'ve been working with HR teams to address the growing mental health crisis in the workplace. Recent data shows 48% of employees report work-related stress, but most benefits don\'t adequately address this. How is your organization handling this challenge?',
    context: 'Leads with compelling mental health statistics'
  },
  {
    id: 'bo-opener-5',
    type: 'opener',
    persona: 'benefits-optimizer',
    content: 'I\'m calling because we\'ve developed analytics tools that help HR leaders benchmark their benefits against industry standards and identify gaps. Would having that kind of competitive intelligence be valuable for your planning?',
    context: 'Offers valuable benchmarking data'
  },
  {
    id: 'bo-opener-6',
    type: 'opener',
    persona: 'benefits-optimizer',
    content: 'Quick question - are you able to predict which employees are at risk of leaving based on their benefits utilization patterns? We\'ve found this to be a powerful early warning system for retention issues.',
    context: 'Introduces predictive analytics concept'
  },

  // ROI-Focused Executive Openers (CFOs)
  {
    id: 'rfe-opener-1',
    type: 'opener',
    persona: 'roi-focused-executive',
    content: 'I work with CFOs to turn benefits from an unpredictable expense into a strategic investment with measurable ROI. Given the current economic climate, is cost predictability important to your planning?',
    context: 'Focus on financial predictability and ROI'
  },
  {
    id: 'rfe-opener-2',
    type: 'opener',
    persona: 'roi-focused-executive',
    content: 'Our analysis shows companies in your industry typically overspend on benefits by 12-18% due to poor plan design. We help finance leaders optimize this spend while improving employee outcomes. Would a quick analysis be worthwhile?',
    context: 'Data-driven approach with industry-specific insights'
  },
  {
    id: 'rfe-opener-3',
    type: 'opener',
    persona: 'roi-focused-executive',
    content: 'I help CFOs model the financial impact of employee turnover and show how strategic benefits design can protect the bottom line. Are you currently able to quantify the cost of turnover in your organization?',
    context: 'Focuses on turnover cost modeling'
  },
  {
    id: 'rfe-opener-4',
    type: 'opener',
    persona: 'roi-focused-executive',
    content: 'Quick question - do you have visibility into how much your current benefits plan is actually saving or costing you compared to industry benchmarks? Most finance leaders are surprised by what they discover.',
    context: 'Creates curiosity about current plan performance'
  },
  {
    id: 'rfe-opener-5',
    type: 'opener',
    persona: 'roi-focused-executive',
    content: 'We help finance leaders turn benefits data into strategic insights for the C-suite. Things like predicting renewal costs, modeling growth scenarios, and quantifying employee retention ROI. Is this level of analytics something you currently have?',
    context: 'Offers sophisticated financial analytics'
  },

  // Gatekeeper Openers
  {
    id: 'gk-opener-1',
    type: 'opener',
    persona: 'gatekeeper',
    content: 'Hi, this is [Your Name] from Campbell & Co. I\'m calling to speak with [Decision Maker] about a benefits review that typically saves companies 10-15% on their current spend. Is this something they\'d want to hear about?',
    context: 'Clear value proposition with specific savings'
  },
  {
    id: 'gk-opener-2',
    type: 'opener',
    persona: 'gatekeeper',
    content: 'I have some industry benchmarking data that [Decision Maker] might find valuable for their benefits planning. It\'s a 15-minute conversation. When would be a good time to reach them?',
    context: 'Offers valuable information with time commitment'
  },
  {
    id: 'gk-opener-3',
    type: 'opener',
    persona: 'gatekeeper',
    content: 'I help companies optimize their employee benefits to reduce costs and improve satisfaction. Many businesses are reviewing their plans right now due to rising costs. Is this something [Decision Maker] is looking at?',
    context: 'Explains value clearly and creates urgency'
  },

  // ============ THOUGHT LEADERSHIP ============
  
  // Cost-Conscious Employer Thought Leadership
  {
    id: 'cce-thought-1',
    type: 'thought-leadership',
    persona: 'cost-conscious-employer',
    content: 'Did you know that replacing a good employee costs 50-200% of their annual salary? A well-designed benefits plan can reduce turnover by up to 40%, often paying for itself in reduced recruitment costs alone.',
    context: 'Quantifies the cost of turnover and benefits ROI'
  },
  {
    id: 'cce-thought-2',
    type: 'thought-leadership',
    persona: 'cost-conscious-employer',
    content: 'Recent studies show that 67% of employees would accept a lower salary for better benefits. This means you can potentially attract better talent without increasing your payroll budget.',
    context: 'Reframes benefits as recruitment tool'
  },
  {
    id: 'cce-thought-3',
    type: 'thought-leadership',
    persona: 'cost-conscious-employer',
    content: 'Small businesses lose an average of $3,500 per employee annually to stress-related absenteeism. Companies with comprehensive wellness programs see 28% less sick time.',
    context: 'Links wellness investment to reduced absenteeism costs'
  },
  {
    id: 'cce-thought-4',
    type: 'thought-leadership',
    persona: 'cost-conscious-employer',
    content: 'Most business owners don\'t realize that 40% of their benefits spending goes to features that less than 15% of employees actually use. Strategic plan design can redirect this waste into high-value benefits.',
    context: 'Reveals inefficiency in current spending'
  },

  // Benefits Optimizer Thought Leadership
  {
    id: 'bo-thought-1',
    type: 'thought-leadership',
    persona: 'benefits-optimizer',
    content: '48% of employees report work-related mental health issues, but only 23% feel their benefits adequately address this. Companies with robust mental health support see 21% higher productivity and 38% lower absenteeism.',
    context: 'Mental health statistics and business impact'
  },
  {
    id: 'bo-thought-2',
    type: 'thought-leadership',
    persona: 'benefits-optimizer',
    content: 'Employee engagement scores are 2.3x higher in companies where employees understand and value their benefits. Yet 82% of employees can\'t explain their coverage. Communication strategy is as important as plan design.',
    context: 'Emphasizes importance of benefits communication'
  },
  {
    id: 'bo-thought-3',
    type: 'thought-leadership',
    persona: 'benefits-optimizer',
    content: 'The latest research shows that flexible benefits options increase employee satisfaction by 43%, but implementation complexity often prevents companies from offering them. Modern platforms have solved this challenge.',
    context: 'Addresses flexibility demands and solutions'
  },
  {
    id: 'bo-thought-4',
    type: 'thought-leadership',
    persona: 'benefits-optimizer',
    content: 'Gen Z and Millennial employees prioritize mental health benefits 3x more than previous generations. Companies that don\'t adapt their benefits strategy will struggle with retention in the next 5 years.',
    context: 'Generational differences in benefits priorities'
  },

  // ROI-Focused Executive Thought Leadership
  {
    id: 'rfe-thought-1',
    type: 'thought-leadership',
    persona: 'roi-focused-executive',
    content: 'Our benchmarking shows that companies with strategic benefits design achieve 12-18% better cost predictability and 25% higher employee satisfaction scores, directly impacting retention and productivity metrics.',
    context: 'Financial benchmarking data with business outcomes'
  },
  {
    id: 'rfe-thought-2',
    type: 'thought-leadership',
    persona: 'roi-focused-executive',
    content: 'CFOs report that unexpected benefits renewals are among their top budget challenges. Companies using predictive modeling for benefits planning reduce budget variance by 67% and improve cash flow forecasting.',
    context: 'Addresses budget predictability concerns'
  },
  {
    id: 'rfe-thought-3',
    type: 'thought-leadership',
    persona: 'roi-focused-executive',
    content: 'The average cost of employee turnover is $15,000 per person. Companies that invest strategically in benefits see 31% lower turnover, creating measurable bottom-line impact that most finance leaders can\'t currently quantify.',
    context: 'Quantifies turnover costs and benefits ROI'
  },
  {
    id: 'rfe-thought-4',
    type: 'thought-leadership',
    persona: 'roi-focused-executive',
    content: 'Leading companies are using benefits analytics to predict workforce trends, model growth scenarios, and optimize compensation strategies. This data-driven approach delivers 23% better financial outcomes.',
    context: 'Positions benefits as strategic financial tool'
  },

  // ============ OBJECTION HANDLING ============
  
  // "We're happy with our current provider"
  {
    id: 'happy-objection-cce',
    type: 'objection-handler',
    persona: 'cost-conscious-employer',
    content: 'That\'s great to hear - a good partner is essential. Out of curiosity, do they typically show you where you might be overspending, or is the relationship more focused on renewals and claims? I ask because many business owners are surprised to learn they\'re leaving money on the table.',
    context: 'Probes for value beyond basic service without attacking current provider'
  },
  {
    id: 'happy-objection-bo',
    type: 'objection-handler',
    persona: 'benefits-optimizer',
    content: 'That\'s wonderful - maintaining good partnerships is important. Do they provide you with employee engagement analytics and benchmarking data to help you demonstrate ROI to leadership, or is it more of a traditional renewal-focused relationship?',
    context: 'Challenges them to think about strategic value vs. transactional service'
  },
  {
    id: 'happy-objection-rfe',
    type: 'objection-handler',
    persona: 'roi-focused-executive',
    content: 'Excellent - strong vendor relationships are valuable. Are they providing you with predictive cost analytics and competitive benchmarking to help with budget planning, or do you primarily work with them on renewals?',
    context: 'Probes for sophisticated financial analysis capabilities'
  },

  // "We don't have budget"
  {
    id: 'budget-objection-cce',
    type: 'objection-handler',
    persona: 'cost-conscious-employer',
    content: 'I completely understand - tight budgets are reality for most businesses right now. What if I could show you how to optimize your current spend to get better outcomes without increasing costs? Sometimes the issue isn\'t budget size, but budget efficiency.',
    context: 'Reframes as optimization rather than additional expense'
  },
  {
    id: 'budget-objection-bo',
    type: 'objection-handler',
    persona: 'benefits-optimizer',
    content: 'That makes sense - budgets are definitely constrained. Many HR leaders find that strategic benefits redesign actually reduces costs while improving employee satisfaction. Would you be open to seeing how that might work for your situation?',
    context: 'Positions as cost reduction opportunity'
  },
  {
    id: 'budget-objection-rfe',
    type: 'objection-handler',
    persona: 'roi-focused-executive',
    content: 'I hear that from many CFOs. What if I could demonstrate how to reduce your current benefits spend by 10-15% while actually improving employee outcomes? The analysis itself would show you exactly where the savings opportunities are.',
    context: 'Offers specific cost reduction with proof'
  },

  // "Send me information"
  {
    id: 'info-objection-cce',
    type: 'objection-handler',
    persona: 'cost-conscious-employer',
    content: 'I\'d be happy to send something relevant. So I don\'t waste your time with generic information, should I focus on cost optimization strategies or recruitment advantages of better benefits? What\'s more pressing for you right now?',
    context: 'Makes information relevant and creates choice'
  },
  {
    id: 'info-objection-bo',
    type: 'objection-handler',
    persona: 'benefits-optimizer',
    content: 'Absolutely. To make it relevant, should I focus on employee engagement strategies or competitive benchmarking data for your industry? I want to make sure what I send addresses your biggest priorities.',
    context: 'Customizes information while maintaining engagement'
  },
  {
    id: 'info-objection-rfe',
    type: 'objection-handler',
    persona: 'roi-focused-executive',
    content: 'Of course. So I can make it valuable, should I focus on the cost optimization analysis or the ROI modeling capabilities? I want to send you something that directly addresses your financial planning needs.',
    context: 'Offers specific financial tools and maintains control'
  },

  // "We just renewed"
  {
    id: 'renewed-objection-cce',
    type: 'objection-handler',
    persona: 'cost-conscious-employer',
    content: 'Perfect timing actually. You\'re locked in for the year, which means you have time to properly evaluate your options without pressure. Many smart business owners use this time to explore improvements for next year. Would a no-pressure review be valuable?',
    context: 'Reframes timing as advantage and removes pressure'
  },
  {
    id: 'renewed-objection-bo',
    type: 'objection-handler',
    persona: 'benefits-optimizer',
    content: 'That\'s actually ideal. With your renewal behind you, this is the perfect time to evaluate how your current plan is performing and identify opportunities for improvement. No pressure, just strategic planning for next year.',
    context: 'Positions as strategic planning opportunity'
  },
  {
    id: 'renewed-objection-rfe',
    type: 'objection-handler',
    persona: 'roi-focused-executive',
    content: 'Great - that means you have a full year to evaluate performance and plan strategically. Smart CFOs use this time to benchmark their spend and identify optimization opportunities for the next renewal cycle.',
    context: 'Appeals to strategic planning mindset'
  },

  // "We're too small"
  {
    id: 'size-objection-cce',
    type: 'objection-handler',
    persona: 'cost-conscious-employer',
    content: 'Actually, smaller companies often have the most to gain from strategic benefits design. You have more flexibility to implement changes, and the cost savings can have a bigger proportional impact on your bottom line.',
    context: 'Reframes size as advantage'
  },

  // "No time"
  {
    id: 'time-objection-cce',
    type: 'objection-handler',
    persona: 'cost-conscious-employer',
    content: 'I totally get it - time is your most valuable resource. That\'s exactly why busy owners work with us - we handle the complexity so you can focus on running your business. A 15-minute conversation could save you hours of work and thousands of dollars.',
    context: 'Acknowledges time constraint and offers solution'
  },
  {
    id: 'time-objection-bo',
    type: 'objection-handler',
    persona: 'benefits-optimizer',
    content: 'I understand completely. Many HR leaders tell us they\'re overwhelmed with benefits administration. Our approach actually reduces your workload by streamlining processes and providing better tools. Worth 15 minutes to explore?',
    context: 'Offers to reduce their workload'
  },

  // ============ NEW RESEARCH-BACKED OBJECTION HANDLERS (2025) ============
  
  // Cost-Conscious Employer - Enhanced Objection Handlers
  {
    id: 'cost-objection-cce-2',
    type: 'objection-handler',
    persona: 'cost-conscious-employer',
    content: 'I hear you. With inflation affecting 13.5% of businesses as their top challenge, everyone\'s watching costs. That\'s why we focus on reducing your current spend by 15-20% while actually improving coverage. Can I show you examples from similar businesses?',
    context: 'Uses inflation data to acknowledge cost concerns while promising savings',
    source: 'Statistics Canada Business Conditions Survey 2025',
    dataPoints: [
      { statistic: 'Inflation as top challenge', value: '13.5%', source: 'Statistics Canada', year: '2025' },
      { statistic: 'Average savings', value: '15-20%', source: 'Campbell & Co. Client Analytics', year: '2024-2025' }
    ]
  },
  {
    id: 'market-objection-cce',
    type: 'objection-handler',
    persona: 'cost-conscious-employer',
    content: 'Actually, 72% of Canadian businesses are optimistic about growth right now. Smart benefits design helps you capture that opportunity without adding risk. Plus, with average benefits costing $4,500-$9,000 per employee, even small improvements create big savings.',
    context: 'Counters pessimism with market optimism data'
  },
  {
    id: 'recruitment-objection-cce',
    type: 'objection-handler',
    persona: 'cost-conscious-employer',
    content: 'You\'re not alone - 9.2% of businesses cite skilled recruitment as their top challenge. The right benefits package can be your secret weapon. We help companies your size compete for talent without matching big company budgets.',
    context: 'Validates recruitment struggles with data'
  },
  {
    id: 'complexity-objection-cce',
    type: 'objection-handler',
    persona: 'cost-conscious-employer',
    content: 'I get it - with buying committees averaging 6-10 people, benefits decisions feel overwhelming. As the owner, you need simple, clear recommendations. We cut through the complexity with straightforward analysis and guaranteed savings.',
    context: 'Acknowledges decision complexity, offers simplification'
  },

  // Benefits Optimizer - Enhanced Objection Handlers
  {
    id: 'mental-health-objection-bo',
    type: 'objection-handler',
    persona: 'benefits-optimizer',
    content: 'That\'s concerning, because 42% of employees rate their mental health as fair or poor, and 91% of organizations are increasing mental health investments. Without action, you risk falling behind both employee needs and market standards. Let me show you cost-effective solutions.',
    context: 'Creates urgency with mental health statistics'
  },
  {
    id: 'generational-objection-bo',
    type: 'objection-handler',
    persona: 'benefits-optimizer',
    content: 'Here\'s the challenge - 65% of your workforce is now Millennials and Gen Z with completely different expectations. Companies seeing 91% satisfaction rates have adapted their benefits. I can show you how to modernize without overspending.',
    context: 'Uses generational data to highlight adaptation need'
  },
  {
    id: 'wellness-roi-objection-bo',
    type: 'objection-handler',
    persona: 'benefits-optimizer',
    content: 'Actually, the wellness market is exploding from $61B to $85B by 2030 because the ROI is proven. Companies with wellness focus see 91% employee satisfaction versus the 43.7% average. That translates directly to retention and productivity gains.',
    context: 'Counters ROI skepticism with market growth data'
  },
  {
    id: 'committee-objection-bo',
    type: 'objection-handler',
    persona: 'benefits-optimizer',
    content: 'You\'re right - with 74% of buying teams experiencing unhealthy conflict, getting consensus is tough. We provide data and tools that help committees align quickly. Plus, teams using our approach are 2.5x more likely to make quality decisions.',
    context: 'Validates committee challenges, offers consensus solution'
  },

  // ROI-Focused Executive - Enhanced Objection Handlers
  {
    id: 'cost-predictability-objection-rfe',
    type: 'objection-handler',
    persona: 'roi-focused-executive',
    content: 'Understandable concern. With 77% rating B2B purchases as extremely complex, CFOs need certainty. Our predictive analytics model benefits costs across multiple scenarios, giving you the visibility to plan confidently even in volatile markets.',
    context: 'Addresses complexity with predictive analytics solution'
  },
  {
    id: 'digital-transformation-objection-rfe',
    type: 'objection-handler',
    persona: 'roi-focused-executive',
    content: 'You\'re ahead of the curve - 50% of major B2B transactions will be digital by 2025. We offer complete transparency with AI-powered analytics that high-performing teams are 4.9x more likely to use. Ready to modernize your benefits approach?',
    context: 'Positions digital solution as competitive advantage'
  },
  {
    id: 'labor-cost-objection-rfe',
    type: 'objection-handler',
    persona: 'roi-focused-executive',
    content: 'Valid point. With 43% of businesses expecting labor obstacles and recruitment costs skyrocketing, benefits ROI is critical. Our data shows strategic benefits design reduces turnover by 32%, directly impacting your bottom line. Worth quantifying for your organization?',
    context: 'Links benefits to labor cost management'
  },
  {
    id: 'transformation-objection-rfe',
    type: 'objection-handler',
    persona: 'roi-focused-executive',
    content: 'Actually, 99% of B2B purchases are driven by organizational change. If you\'re transforming any aspect of your business, benefits alignment is crucial for success. We help CFOs model the financial impact of benefits changes on transformation initiatives.',
    context: 'Connects benefits to broader transformation goals'
  },

  // Gatekeeper - Enhanced Objection Handlers
  {
    id: 'timing-objection-gk',
    type: 'objection-handler',
    persona: 'gatekeeper',
    content: 'I understand their schedule is packed. With benefits averaging $4,500-$9,000 per employee and 91% of companies increasing investments, this deserves executive attention. Could you check if they have 15 minutes this week for potential significant savings?',
    context: 'Uses cost magnitude to justify time request'
  },
  {
    id: 'vendor-fatigue-objection-gk',
    type: 'objection-handler',
    persona: 'gatekeeper',
    content: 'I appreciate that - executives get 8+ contact attempts on average. This is different. I have data showing how companies like yours are saving 15-20% on benefits while improving employee satisfaction. That\'s worth 15 minutes of their time, isn\'t it?',
    context: 'Acknowledges vendor fatigue while emphasizing unique value'
  },
  {
    id: 'not-priority-objection-gk',
    type: 'objection-handler',
    persona: 'gatekeeper',
    content: 'That\'s surprising, because 42% of employees are struggling with mental health and 72% of businesses are looking for cost savings. Benefits impacts both. Would [Decision Maker] want to know about solutions addressing these critical issues?',
    context: 'Reframes benefits as addressing multiple priorities'
  },
  {
    id: 'wrong-person-objection-gk',
    type: 'objection-handler',
    persona: 'gatekeeper',
    content: 'Thanks for clarifying. With buying committees averaging 6-10 people, I\'d love to connect with the right person. Benefits decisions typically involve HR, Finance, and Operations. Who would be best to discuss optimizing your $[X] annual benefits investment?',
    context: 'Uses committee data to identify correct contact'
  },

  // ============ NEW RESEARCH-BACKED OPENERS (2025) ============
  
  // Cost-Conscious Employer - New Research-Backed Openers
  {
    id: 'cce-opener-7',
    type: 'opener',
    persona: 'cost-conscious-employer',
    content: 'I\'m calling because inflation and rising input costs are squeezing margins for 25% of Canadian businesses. We\'re helping companies like yours reduce benefits costs by 15-30% while keeping employees happy. Is cost control a priority right now?',
    context: 'Uses current inflation data (13.5% cite as #1 challenge)',
    source: 'Canadian Business Conditions Survey 2025',
    dataPoints: [
      { statistic: 'Inflation impact', value: '13.5%', source: 'Statistics Canada Business Survey', year: '2025' },
      { statistic: 'Cost reduction', value: '15-30%', source: 'Campbell & Co. Client Results', year: '2024-2025' }
    ]
  },
  {
    id: 'cce-opener-8',
    type: 'opener',
    persona: 'cost-conscious-employer',
    content: 'Quick question - are you struggling to find skilled workers? 9.2% of Canadian businesses say it\'s their top challenge. We help companies create benefits packages that actually attract talent without breaking the budget.',
    context: 'Addresses skilled recruitment challenge with Canadian data',
    source: 'Canadian Survey on Business Conditions Q1 2025',
    dataPoints: [
      { statistic: 'Skilled recruitment challenge', value: '9.2%', source: 'Statistics Canada', year: '2025' }
    ]
  },
  {
    id: 'cce-opener-9',
    type: 'opener',
    persona: 'cost-conscious-employer',
    content: 'Most business owners don\'t realize they\'re spending $4,500-$9,000 per employee on benefits. I help companies optimize that investment to get better results for less. Would knowing exactly where your money goes be valuable?',
    context: 'Specific Canadian benefits spending data'
  },
  {
    id: 'cce-opener-10',
    type: 'opener',
    persona: 'cost-conscious-employer',
    content: 'With 72% of Canadian businesses optimistic about growth, many are looking at benefits as a way to support expansion without adding risk. I help companies design scalable plans. Planning to grow your team?',
    context: 'Leverages business optimism data for growth angle'
  },
  {
    id: 'cce-opener-11',
    type: 'opener',
    persona: 'cost-conscious-employer',
    content: 'I noticed you\'re managing a team of [X] people. With 43% of businesses expecting labor challenges, smart benefits design is becoming crucial for retention. Can I share what\'s working for similar companies?',
    context: 'Uses labor obstacle statistics to create urgency'
  },
  {
    id: 'cce-opener-12',
    type: 'opener',
    persona: 'cost-conscious-employer',
    content: 'Research shows replacing an employee costs 50-200% of their salary. I help businesses protect that investment with benefits that actually reduce turnover by up to 32%. Worth exploring?',
    context: 'Combines turnover cost with risk reversal statistics'
  },
  {
    id: 'cce-opener-13',
    type: 'opener',
    persona: 'cost-conscious-employer',
    content: 'Did you know 65% of your future customers and employees are Millennials or Gen Z? They have completely different benefits expectations. I help businesses adapt without overspending. Is this on your radar?',
    context: 'Highlights generational shift in workforce'
  },
  {
    id: 'cce-opener-14',
    type: 'opener',
    persona: 'cost-conscious-employer',
    content: 'I work with business owners who are tired of benefits costs rising 5-10% every year with no added value. We typically stabilize costs while improving coverage. Sound like something you need?',
    context: 'Addresses cost creep frustration'
  },
  {
    id: 'cce-opener-15',
    type: 'opener',
    persona: 'cost-conscious-employer',
    content: 'With average employee well-being scores at just 43.7%, smart employers are using targeted benefits to boost productivity. I show companies how to do this cost-effectively. Interested in learning more?',
    context: 'Links well-being scores to productivity'
  },
  {
    id: 'cce-opener-16',
    type: 'opener',
    persona: 'cost-conscious-employer',
    content: 'I specialize in helping companies navigate benefits decisions without the usual 6-10 person committee drama. As the owner, you need clear, actionable recommendations. Can I show you our streamlined approach?',
    context: 'Acknowledges decision-making complexity'
  },

  // Benefits Optimizer - New Research-Backed Openers
  {
    id: 'bo-opener-7',
    type: 'opener',
    persona: 'benefits-optimizer',
    content: 'With 42% of employees rating their mental health as fair or poor, HR leaders are scrambling for solutions. We help companies implement comprehensive wellness programs that actually work. Is mental health support a priority for your organization?',
    context: 'Leading with mental health crisis statistics',
    source: 'Canadian Mental Health Index 2025',
    dataPoints: [
      { statistic: 'Poor mental health', value: '42%', source: 'LifeWorks Mental Health Index', year: '2025' }
    ]
  },
  {
    id: 'bo-opener-8',
    type: 'opener',
    persona: 'benefits-optimizer',
    content: 'I\'m reaching out because 91% of organizations are increasing mental health investments this year. We help HR leaders maximize the impact of that spend with data-driven programs. Are you part of that 91%?',
    context: 'Uses investment trend data to create FOMO'
  },
  {
    id: 'bo-opener-9',
    type: 'opener',
    persona: 'benefits-optimizer',
    content: 'Research shows 91% job satisfaction in wellness-focused workplaces versus the average. I help HR leaders build those environments without breaking the budget. Worth a conversation about your workplace culture?',
    context: 'Powerful satisfaction statistics for wellness programs'
  },
  {
    id: 'bo-opener-10',
    type: 'opener',
    persona: 'benefits-optimizer',
    content: 'Managing benefits for a 65% Millennial and Gen Z workforce requires a completely different approach. We help HR leaders modernize their programs for maximum engagement. How are you adapting to generational shifts?',
    context: 'Addresses generational workforce changes'
  },
  {
    id: 'bo-opener-11',
    type: 'opener',
    persona: 'benefits-optimizer',
    content: 'With the corporate wellness market growing from $61B to $85B by 2030, employees expect more. I help HR leaders stay ahead of these expectations while controlling costs. Are you feeling this pressure?',
    context: 'Market growth creates expectation pressure'
  },
  {
    id: 'bo-opener-12',
    type: 'opener',
    persona: 'benefits-optimizer',
    content: 'Did you know 89% of employees say flexible work improves work-life balance? I help companies design benefits that support hybrid teams effectively. How are you adapting your benefits for the new workplace?',
    context: 'Addresses hybrid work benefits challenges'
  },
  {
    id: 'bo-opener-13',
    type: 'opener',
    persona: 'benefits-optimizer',
    content: 'Average employee well-being scores are just 43.7 out of 100. Progressive HR leaders are using targeted benefits to move that needle. Can I share what\'s working for companies like yours?',
    context: 'Uses well-being score as improvement opportunity'
  },
  {
    id: 'bo-opener-14',
    type: 'opener',
    persona: 'benefits-optimizer',
    content: 'I work with HR teams navigating the complexity of 6-10 stakeholder buying committees. We simplify benefits decisions with clear data and consensus-building tools. Would that help your process?',
    context: 'Acknowledges committee complexity challenges'
  },
  {
    id: 'bo-opener-15',
    type: 'opener',
    persona: 'benefits-optimizer',
    content: 'With 96% of prospects researching before vendor calls, I\'m guessing you\'ve already looked into benefits optimization. I\'d love to share insights you might not find online. Worth 15 minutes?',
    context: 'Acknowledges their research, offers unique value'
  },
  {
    id: 'bo-opener-16',
    type: 'opener',
    persona: 'benefits-optimizer',
    content: 'HR leaders using our approach see 32% better outcomes when they use risk reversal language with employees. I can show you how to position benefits changes for maximum acceptance. Interested?',
    context: 'Offers communication strategy insights'
  },

  // ROI-Focused Executive - New Research-Backed Openers
  {
    id: 'rfe-opener-6',
    type: 'opener',
    persona: 'roi-focused-executive',
    content: 'With 77% of B2B purchases rated as extremely complex, CFOs need clear benefits ROI data. We provide predictive analytics showing exactly how benefits investments impact your bottom line. Is this visibility you currently have?',
    context: 'Addresses purchase complexity with data solution'
  },
  {
    id: 'rfe-opener-7',
    type: 'opener',
    persona: 'roi-focused-executive',
    content: 'The corporate wellness market is growing from $61B to $85B by 2030. Smart CFOs are getting ahead of this cost curve. I help model scenarios to optimize your investment. Worth exploring?',
    context: 'Market growth creates cost pressure'
  },
  {
    id: 'rfe-opener-8',
    type: 'opener',
    persona: 'roi-focused-executive',
    content: 'With 50% of major B2B transactions going digital by 2025, benefits procurement is changing. We offer transparent, data-driven pricing models CFOs love. Ready for a modern approach?',
    context: 'Digital transformation angle for finance leaders'
  },
  {
    id: 'rfe-opener-9',
    type: 'opener',
    persona: 'roi-focused-executive',
    content: '72% of Canadian businesses are optimistic but cautious about growth. I help CFOs design benefits that scale efficiently without adding financial risk. Is scalability part of your planning?',
    context: 'Addresses growth planning with risk management'
  },
  {
    id: 'rfe-opener-10',
    type: 'opener',
    persona: 'roi-focused-executive',
    content: 'Average benefits spending is $4,500-$9,000 per employee - that\'s 15-30% of payroll. I help CFOs optimize this massive line item for better ROI. Can I show you our benchmarking data?',
    context: 'Specific cost data creates optimization opportunity'
  },
  {
    id: 'rfe-opener-11',
    type: 'opener',
    persona: 'roi-focused-executive',
    content: 'With inflation hitting 13.5% of businesses hardest, controlling benefits costs is critical. We typically reduce spend by 15-20% while improving outcomes. Would that impact be meaningful?',
    context: 'Inflation pressure creates urgency for savings'
  },
  {
    id: 'rfe-opener-12',
    type: 'opener',
    persona: 'roi-focused-executive',
    content: '99% of B2B purchases are driven by organizational change. If you\'re transforming any part of your business, benefits alignment is crucial. Can we discuss your transformation goals?',
    context: 'Links benefits to broader transformation'
  },
  {
    id: 'rfe-opener-13',
    type: 'opener',
    persona: 'roi-focused-executive',
    content: 'Managing a 13-person average buying committee is expensive and time-consuming. We streamline benefits decisions with clear financial models. Would simplifying this process create value?',
    context: 'Committee complexity creates cost'
  },
  {
    id: 'rfe-opener-14',
    type: 'opener',
    persona: 'roi-focused-executive',
    content: 'With 43% of businesses expecting labor obstacles, smart benefits design protects against turnover costs. I can model the financial impact for your organization. Interested in the data?',
    context: 'Labor challenges create financial risk'
  },
  {
    id: 'rfe-opener-15',
    type: 'opener',
    persona: 'roi-focused-executive',
    content: 'High-performing teams are 4.9x more likely to use AI for optimization. We bring AI-powered benefits analytics to help CFOs make smarter decisions. Ready to explore next-gen tools?',
    context: 'AI angle appeals to innovative finance leaders'
  },

  // Gatekeeper - New Research-Backed Openers
  {
    id: 'gk-opener-4',
    type: 'opener',
    persona: 'gatekeeper',
    content: 'Hi, I\'m calling about the benefits cost pressure affecting 25% of Canadian businesses. I have a 15-minute solution overview that [Decision Maker] might find valuable. When do they typically review vendor information?',
    context: 'Current market pressure creates relevance'
  },
  {
    id: 'gk-opener-5',
    type: 'opener',
    persona: 'gatekeeper',
    content: 'I help companies navigate the complex benefits buying process - average committees have 6-10 people now. I\'d like to share our streamlined approach with [Decision Maker]. What\'s their preferred meeting format?',
    context: 'Acknowledges complexity, offers simplification'
  },
  {
    id: 'gk-opener-6',
    type: 'opener',
    persona: 'gatekeeper',
    content: 'With 91% of companies increasing mental health investments, benefits decisions are getting executive attention. I have insights [Decision Maker] should see. Can you help me get 15 minutes on their calendar?',
    context: 'Executive-level trend creates importance'
  },
  {
    id: 'gk-opener-7',
    type: 'opener',
    persona: 'gatekeeper',
    content: 'I know [Decision Maker] is busy - it typically takes 8 attempts to reach executives these days. I have cost-saving data that\'s worth their time. What\'s the best way to share this information?',
    context: 'Acknowledges contact difficulty, promises value'
  },
  {
    id: 'gk-opener-8',
    type: 'opener',
    persona: 'gatekeeper',
    content: '72% of businesses are optimistic but watching costs carefully. I help companies reduce benefits expenses by 15-20%. Would [Decision Maker] want to explore this before your next renewal?',
    context: 'Timely cost reduction opportunity'
  },
  {
    id: 'gk-opener-9',
    type: 'opener',
    persona: 'gatekeeper',
    content: 'I have benchmarking data showing how similar companies are handling the skilled worker shortage. This could help with your recruitment challenges. How does [Decision Maker] prefer to receive this type of information?',
    context: 'Valuable competitive intelligence'
  },
  {
    id: 'gk-opener-10',
    type: 'opener',
    persona: 'gatekeeper',
    content: 'Quick question - is [Decision Maker] involved in benefits decisions? With spending at $4,500-$9,000 per employee, most executives want visibility. I can provide a brief cost analysis.',
    context: 'Cost magnitude creates executive interest'
  },
  {
    id: 'gk-opener-11',
    type: 'opener',
    persona: 'gatekeeper',
    content: 'I specialize in helping companies with [X] employees optimize their benefits spend. The savings typically fund other priorities. Would this be relevant to [Decision Maker]\'s current initiatives?',
    context: 'Links savings to other business needs'
  },
  {
    id: 'gk-opener-12',
    type: 'opener',
    persona: 'gatekeeper',
    content: 'With 42% of employees struggling with mental health, many executives are prioritizing wellness benefits. I have solutions [Decision Maker] should know about. What\'s their availability like this week?',
    context: 'Urgent employee wellness angle'
  },
  {
    id: 'gk-opener-13',
    type: 'opener',
    persona: 'gatekeeper',
    content: 'I help executives prepare for benefits renewals without the usual stress and surprises. With renewals coming up, [Decision Maker] might appreciate our approach. Can you check their calendar?',
    context: 'Renewal timing creates urgency'
  },

  // ============ STRATEGIC CEO OPENERS (2025) ============
  
  {
    id: 'strategic-ceo-opener-1',
    type: 'opener',
    persona: 'strategic-ceo',
    content: 'I\'m calling because 99% of B2B purchases are driven by organizational change. As you transform [Company] to capture the 72% business optimism in Canada, aligning your benefits strategy is crucial. Can we discuss how benefits support your transformation goals?',
    context: 'Links benefits to business transformation strategy',
    source: 'Gartner B2B Buying Journey Research 2025',
    dataPoints: [
      { statistic: 'B2B purchases driven by change', value: '99%', source: 'Gartner Research', year: '2025' },
      { statistic: 'Business optimism', value: '72%', source: 'Canadian Business Outlook Survey', year: '2025' }
    ]
  },
  {
    id: 'strategic-ceo-opener-2',
    type: 'opener',
    persona: 'strategic-ceo',
    content: 'With 43.2% of Canadian businesses expecting labor obstacles and 9.2% citing skilled recruitment as their top challenge, strategic benefits design is becoming a CEO imperative. I help leaders turn this challenge into competitive advantage. Worth exploring?',
    context: 'Positions benefits as solution to talent crisis'
  },
  {
    id: 'strategic-ceo-opener-3',
    type: 'opener',
    persona: 'strategic-ceo',
    content: 'I noticed [Company] is competing for talent where 65% of the workforce is now Millennials and Gen Z. Their benefits expectations are completely different. I help CEOs build magnetic employer brands without overspending. Is talent strategy on your agenda?',
    context: 'Addresses generational workforce shift'
  },
  {
    id: 'strategic-ceo-opener-4',
    type: 'opener',
    persona: 'strategic-ceo',
    content: 'Research shows companies with wellness-focused workplaces achieve 91% employee satisfaction versus the 43.7% average. As CEO, you can turn benefits into a strategic differentiator. Can I share how industry leaders are doing this?',
    context: 'Wellness as competitive advantage'
  },
  {
    id: 'strategic-ceo-opener-5',
    type: 'opener',
    persona: 'strategic-ceo',
    content: 'With the mental health crisis affecting 42% of employees, forward-thinking CEOs are leading the charge on comprehensive wellness. I help executives build cultures that attract top talent while managing costs. Is employee wellbeing part of your strategic vision?',
    context: 'Mental health leadership opportunity'
  },
  {
    id: 'strategic-ceo-opener-6',
    type: 'opener',
    persona: 'strategic-ceo',
    content: 'I work with CEOs who view the $4,500-$9,000 per employee benefits spend as a strategic investment, not just a cost. With proper design, it drives retention, productivity, and growth. How are you thinking about benefits ROI?',
    context: 'Reframes benefits as strategic investment'
  },
  {
    id: 'strategic-ceo-opener-7',
    type: 'opener',
    persona: 'strategic-ceo',
    content: 'As [Company] grows, managing 13-person buying committees becomes costly. I help CEOs streamline benefits decisions while ensuring stakeholder alignment. We reduce complexity by 75%. Would simpler decision-making create value?',
    context: 'Addresses decision-making complexity'
  },
  {
    id: 'strategic-ceo-opener-8',
    type: 'opener',
    persona: 'strategic-ceo',
    content: 'The corporate wellness market is exploding from $61B to $85B by 2030. Smart CEOs are positioning their companies ahead of this curve. I help leaders build world-class benefits programs that become recruiting weapons. Interested?',
    context: 'Market growth creates opportunity'
  },
  {
    id: 'strategic-ceo-opener-9',
    type: 'opener',
    persona: 'strategic-ceo',
    content: 'With inflation hitting 13.5% of businesses hardest, CEOs need benefits strategies that control costs while supporting growth. I help leaders save 15-20% while actually improving employee satisfaction. Worth a strategic discussion?',
    context: 'Balances cost control with growth'
  },
  {
    id: 'strategic-ceo-opener-10',
    type: 'opener',
    persona: 'strategic-ceo',
    content: 'I\'m reaching out because high-performing companies are 4.9x more likely to use AI and data analytics for optimization. We bring these tools to benefits strategy, giving CEOs unprecedented visibility. Ready to modernize your approach?',
    context: 'Technology and innovation angle'
  },
  {
    id: 'strategic-ceo-opener-11',
    type: 'opener',
    persona: 'strategic-ceo',
    content: 'Research shows replacing key employees costs 50-200% of their salary. Strategic benefits design reduces turnover by up to 32%. As CEO, protecting your talent investment directly impacts shareholder value. Can we discuss your retention strategy?',
    context: 'Turnover cost and shareholder value'
  },
  {
    id: 'strategic-ceo-opener-12',
    type: 'opener',
    persona: 'strategic-ceo',
    content: 'With 89% of employees demanding flexible work arrangements, benefits must evolve. I help CEOs design programs that support hybrid teams while maintaining culture and productivity. How are you adapting to the new workplace?',
    context: 'Hybrid work and culture challenges'
  },
  {
    id: 'strategic-ceo-opener-13',
    type: 'opener',
    persona: 'strategic-ceo',
    content: 'I noticed [Company] operates in [Industry] where specific risks are emerging. Strategic benefits design can mitigate these risks while strengthening your employer brand. Can I share what successful CEOs in your industry are doing?',
    context: 'Industry-specific risk mitigation'
  },
  {
    id: 'strategic-ceo-opener-14',
    type: 'opener',
    persona: 'strategic-ceo',
    content: '50% of major B2B transactions will be digital by 2025. Progressive CEOs are demanding the same transparency in benefits. We provide executive dashboards showing real-time ROI. Is visibility into benefits performance important to you?',
    context: 'Digital transformation and transparency'
  },
  {
    id: 'strategic-ceo-opener-15',
    type: 'opener',
    persona: 'strategic-ceo',
    content: 'With 91% of organizations increasing mental health investments, CEOs who lead here gain competitive advantage. I help executives build comprehensive wellness strategies that attract talent and boost performance. Ready to lead in this space?',
    context: 'Mental health investment leadership'
  },
  {
    id: 'strategic-ceo-opener-16',
    type: 'opener',
    persona: 'strategic-ceo',
    content: 'Canadian employment rates at 61.3% mean the war for talent is intensifying. CEOs using strategic benefits design win this war. I help leaders build magnetic employer brands. Is talent acquisition keeping you up at night?',
    context: 'Talent war and employer branding'
  },
  {
    id: 'strategic-ceo-opener-17',
    type: 'opener',
    persona: 'strategic-ceo',
    content: 'I work with CEOs navigating the complexity of 77% of B2B purchases being rated extremely difficult. Benefits doesn\'t have to be. We simplify decisions with clear strategic frameworks. Would streamlined benefits planning help you focus on growth?',
    context: 'Simplifying complex decisions'
  },
  {
    id: 'strategic-ceo-opener-18',
    type: 'opener',
    persona: 'strategic-ceo',
    content: 'As [Company] scales, benefits become either a growth enabler or a constraint. I help CEOs design programs that scale efficiently while maintaining culture. Planning significant growth? Let\'s discuss scalable benefits strategy.',
    context: 'Scalability and growth enablement'
  },
  {
    id: 'strategic-ceo-opener-19',
    type: 'opener',
    persona: 'strategic-ceo',
    content: 'With average well-being scores at just 43.7/100, there\'s massive opportunity for competitive differentiation. CEOs who invest strategically here see 91% employee satisfaction. Can I show you the business case?',
    context: 'Well-being as differentiator'
  },
  {
    id: 'strategic-ceo-opener-20',
    type: 'opener',
    persona: 'strategic-ceo',
    content: 'I\'m calling because 74% of buying teams experience unhealthy conflict, wasting executive time. I help CEOs achieve benefits consensus quickly with data-driven frameworks. Would reducing internal friction create value?',
    context: 'Reducing internal decision friction'
  },
  {
    id: 'strategic-ceo-opener-21',
    type: 'opener',
    persona: 'strategic-ceo',
    content: 'The best CEOs use benefits as a strategic lever for cultural transformation. With proper design, your benefits program reinforces values and drives behavior. How aligned are your current benefits with your cultural vision?',
    context: 'Culture transformation through benefits'
  },
  {
    id: 'strategic-ceo-opener-22',
    type: 'opener',
    persona: 'strategic-ceo',
    content: 'With skilled labor shortages affecting 43.2% of businesses, CEOs need every advantage. Strategic benefits design makes you the employer of choice without breaking the budget. Can we discuss your talent acquisition challenges?',
    context: 'Addressing skilled labor shortage'
  },
  {
    id: 'strategic-ceo-opener-23',
    type: 'opener',
    persona: 'strategic-ceo',
    content: 'I help CEOs turn the 15-30% of payroll spent on benefits into measurable business outcomes. Things like reduced turnover, higher productivity, and better recruitment. Are you getting strategic value from your benefits investment?',
    context: 'Benefits spend optimization'
  },
  {
    id: 'strategic-ceo-opener-24',
    type: 'opener',
    persona: 'strategic-ceo',
    content: 'Research shows 2.5x better outcomes when teams achieve consensus. I help CEOs build benefits strategies that unite stakeholders around common goals. Would faster, better decisions accelerate your strategic initiatives?',
    context: 'Consensus building for better outcomes'
  },
  {
    id: 'strategic-ceo-opener-25',
    type: 'opener',
    persona: 'strategic-ceo',
    content: 'As CEO, you\'re balancing growth ambitions with risk management. Smart benefits design supports both - attracting talent for growth while controlling costs. Can I share how peer companies achieve this balance?',
    context: 'Balancing growth and risk'
  },

  // ============ OPERATIONS LEADER OPENERS (2025) ============
  
  {
    id: 'operations-leader-opener-1',
    type: 'opener',
    persona: 'operations-leader',
    content: 'With 89% of employees saying flexible work improves work-life balance, operations leaders face unique challenges. I help streamline benefits administration for hybrid teams while maintaining operational efficiency. Is managing distributed workforce benefits a pain point?',
    context: 'Hybrid workforce operational challenges'
  },
  {
    id: 'operations-leader-opener-2',
    type: 'opener',
    persona: 'operations-leader',
    content: 'I\'m calling because average employee well-being scores are just 43.7%, directly impacting productivity. Operations leaders using targeted benefits see 20-30% efficiency gains. Can I share how to optimize your workforce performance?',
    context: 'Well-being linked to operational efficiency'
  },
  {
    id: 'operations-leader-opener-3',
    type: 'opener',
    persona: 'operations-leader',
    content: 'With 80% of B2B interactions going digital by 2025, operations must adapt. I help leaders implement digital benefits platforms that reduce admin time by 60%. Ready to automate your benefits operations?',
    context: 'Digital transformation of benefits operations'
  },
  {
    id: 'operations-leader-opener-4',
    type: 'opener',
    persona: 'operations-leader',
    content: 'Research shows 74% of buying teams experience unhealthy conflict, disrupting operations. I provide frameworks that streamline benefits decisions and reduce committee drama. Would smoother decision-making improve your operational flow?',
    context: 'Reducing decision-making friction'
  },
  {
    id: 'operations-leader-opener-5',
    type: 'opener',
    persona: 'operations-leader',
    content: 'I work with operations leaders managing the complexity of 6-10 stakeholder committees. Our approach reduces benefits administration overhead by 40% while improving outcomes. Worth exploring for your team?',
    context: 'Simplifying stakeholder management'
  },
  {
    id: 'operations-leader-opener-6',
    type: 'opener',
    persona: 'operations-leader',
    content: 'With benefits costing $4,500-$9,000 per employee, inefficient administration wastes resources. I help operations leaders optimize this spend while reducing manual processes. How much time does benefits admin currently take?',
    context: 'Cost and time optimization'
  },
  {
    id: 'operations-leader-opener-7',
    type: 'opener',
    persona: 'operations-leader',
    content: 'The 42% of employees with poor mental health directly impacts your operational metrics - absenteeism, errors, productivity. Strategic benefits design addresses root causes. Can we discuss improving your workforce resilience?',
    context: 'Mental health impact on operations'
  },
  {
    id: 'operations-leader-opener-8',
    type: 'opener',
    persona: 'operations-leader',
    content: 'High-performing operations teams are 4.9x more likely to use AI and analytics. We bring these tools to benefits management, giving you predictive insights on workforce risks. Ready to modernize?',
    context: 'AI and analytics for operations'
  },
  {
    id: 'operations-leader-opener-9',
    type: 'opener',
    persona: 'operations-leader',
    content: 'With 43.2% of businesses facing labor obstacles, operational continuity is at risk. Smart benefits design helps retain critical staff and reduce disruptions. How are you protecting against workforce volatility?',
    context: 'Workforce stability and continuity'
  },
  {
    id: 'operations-leader-opener-10',
    type: 'opener',
    persona: 'operations-leader',
    content: 'I noticed [Company] manages [X] employees across multiple locations. Standardizing benefits while allowing local flexibility is complex. I help operations leaders achieve both. Is this a challenge you\'re facing?',
    context: 'Multi-location operational complexity'
  },
  {
    id: 'operations-leader-opener-11',
    type: 'opener',
    persona: 'operations-leader',
    content: 'Replacing skilled workers costs 50-200% of salary and disrupts operations for months. Strategic benefits reduce turnover by 32%, protecting your operational stability. Worth quantifying for your team?',
    context: 'Turnover disruption prevention'
  },
  {
    id: 'operations-leader-opener-12',
    type: 'opener',
    persona: 'operations-leader',
    content: 'With inflation affecting 13.5% of businesses, operations leaders need cost-efficient solutions. I help reduce benefits costs by 15-20% while actually improving employee satisfaction and productivity. Interested?',
    context: 'Cost efficiency without compromise'
  },
  {
    id: 'operations-leader-opener-13',
    type: 'opener',
    persona: 'operations-leader',
    content: 'Operations excellence requires healthy, engaged teams. Companies with wellness focus achieve 91% satisfaction versus 43.7% average. I help build benefits that drive operational performance. Can we explore this?',
    context: 'Wellness driving operational excellence'
  },
  {
    id: 'operations-leader-opener-14',
    type: 'opener',
    persona: 'operations-leader',
    content: 'The shift to 65% Millennial/Gen Z workforce changes operational dynamics. Their benefits expectations differ completely. I help operations leaders adapt without disrupting workflows. How are you managing this transition?',
    context: 'Generational workforce operations'
  },
  {
    id: 'operations-leader-opener-15',
    type: 'opener',
    persona: 'operations-leader',
    content: 'With 99% of B2B purchases driven by organizational change, your benefits must support operational transformation. I help align benefits strategy with operational goals. What changes are you implementing?',
    context: 'Transformation alignment'
  },
  {
    id: 'operations-leader-opener-16',
    type: 'opener',
    persona: 'operations-leader',
    content: 'I work with operations leaders who view benefits administration as a time drain. Our platform automates 80% of routine tasks, freeing your team for strategic work. Would this efficiency gain help?',
    context: 'Automation and efficiency'
  },
  {
    id: 'operations-leader-opener-17',
    type: 'opener',
    persona: 'operations-leader',
    content: 'Canadian employment at 61.3% means recruiting and retaining operational staff is harder than ever. Strategic benefits give you competitive advantage. How are you addressing workforce scarcity?',
    context: 'Talent scarcity operational impact'
  },
  {
    id: 'operations-leader-opener-18',
    type: 'opener',
    persona: 'operations-leader',
    content: 'With 72% business optimism driving growth, operations must scale efficiently. I help design benefits programs that grow smoothly with your workforce. Planning expansion? Let\'s discuss scalable solutions.',
    context: 'Scalable operations growth'
  },
  {
    id: 'operations-leader-opener-19',
    type: 'opener',
    persona: 'operations-leader',
    content: 'Benefits decisions shouldn\'t disrupt operations. With 77% rating B2B purchases as complex, you need simple solutions. I provide clear frameworks that minimize operational impact. Worth exploring?',
    context: 'Minimizing decision disruption'
  },
  {
    id: 'operations-leader-opener-20',
    type: 'opener',
    persona: 'operations-leader',
    content: 'I help operations leaders turn benefits from administrative burden into strategic advantage. Things like predictive absence management and proactive wellness interventions. Ready to be more proactive?',
    context: 'Proactive operational management'
  },
  {
    id: 'operations-leader-opener-21',
    type: 'opener',
    persona: 'operations-leader',
    content: 'With 91% of organizations increasing mental health investments, operations leaders who act now avoid future disruptions. I help build resilient workforces. Is workforce resilience on your radar?',
    context: 'Building operational resilience'
  },
  {
    id: 'operations-leader-opener-22',
    type: 'opener',
    persona: 'operations-leader',
    content: 'The $61B-$85B wellness market growth reflects real operational needs. Healthy employees are productive employees. I help operations leaders capture this value efficiently. Can we discuss your wellness strategy?',
    context: 'Wellness market operational opportunity'
  },
  {
    id: 'operations-leader-opener-23',
    type: 'opener',
    persona: 'operations-leader',
    content: 'Managing benefits for remote, hybrid, and on-site workers creates operational complexity. I provide unified solutions that work across all work models. How are you standardizing across work arrangements?',
    context: 'Unified multi-modal workforce solutions'
  },
  {
    id: 'operations-leader-opener-24',
    type: 'opener',
    persona: 'operations-leader',
    content: 'With 50% of B2B transactions going digital, operations leaders expect the same from benefits. Our platform provides real-time dashboards and automated workflows. Ready for digital benefits operations?',
    context: 'Digital operations transformation'
  },
  {
    id: 'operations-leader-opener-25',
    type: 'opener',
    persona: 'operations-leader',
    content: 'I noticed [Company] operates in [Industry] where operational efficiency is critical. Strategic benefits design reduces friction and improves performance metrics. Can I share industry-specific operational improvements?',
    context: 'Industry-specific operational benefits'
  },

  // ============ CULTURE CHAMPION OPENERS (2025) ============
  
  {
    id: 'culture-champion-opener-1',
    type: 'opener',
    persona: 'culture-champion',
    content: 'With 42% of employees rating mental health as fair or poor and 91% expecting employer support, culture leaders face unprecedented challenges. I help build comprehensive wellness cultures that attract and retain talent. Is employee wellbeing a strategic priority?',
    context: 'Mental health crisis leadership opportunity'
  },
  {
    id: 'culture-champion-opener-2',
    type: 'opener',
    persona: 'culture-champion',
    content: 'I\'m reaching out because 91% of organizations are increasing mental health investments. Culture champions who lead this charge see 91% employee satisfaction versus the 43.7% average. Ready to transform your workplace culture?',
    context: 'Mental health investment as culture driver'
  },
  {
    id: 'culture-champion-opener-3',
    type: 'opener',
    persona: 'culture-champion',
    content: 'Managing a 65% Millennial and Gen Z workforce requires completely reimagined benefits. They expect purpose, flexibility, and genuine care. I help culture leaders build benefits that resonate. How are you adapting?',
    context: 'Generational culture transformation'
  },
  {
    id: 'culture-champion-opener-4',
    type: 'opener',
    persona: 'culture-champion',
    content: 'The wellness market exploding from $61B to $85B reflects employee expectations. Culture champions who act now shape industry-leading workplaces. Can I share how to position [Company] as an employer of choice?',
    context: 'Market growth creating culture opportunity'
  },
  {
    id: 'culture-champion-opener-5',
    type: 'opener',
    persona: 'culture-champion',
    content: 'With 89% saying flexible work improves work-life balance, inclusive benefits design is crucial. I help culture leaders create programs that work for everyone - remote, hybrid, and on-site. Is inclusivity driving your benefits strategy?',
    context: 'Inclusive benefits for diverse work models'
  },
  {
    id: 'culture-champion-opener-6',
    type: 'opener',
    persona: 'culture-champion',
    content: 'Average employee well-being scores of 43.7% signal a culture crisis. Progressive culture leaders use targeted benefits to transform this metric. I can show you how to move the needle dramatically. Interested?',
    context: 'Well-being scores as culture metric'
  },
  {
    id: 'culture-champion-opener-7',
    type: 'opener',
    persona: 'culture-champion',
    content: 'I work with culture champions building employer brands that attract top talent. With 9.2% of businesses citing recruitment as their top challenge, benefits become your secret weapon. Ready to differentiate?',
    context: 'Employer brand differentiation'
  },
  {
    id: 'culture-champion-opener-8',
    type: 'opener',
    persona: 'culture-champion',
    content: 'Research shows companies with wellness-focused cultures achieve 91% satisfaction. As a culture champion, you can lead this transformation. Can I share proven strategies for building wellness-first workplaces?',
    context: 'Wellness-first culture building'
  },
  {
    id: 'culture-champion-opener-9',
    type: 'opener',
    persona: 'culture-champion',
    content: 'With 99% of B2B purchases driven by organizational change, culture transformation requires aligned benefits. I help leaders design programs that reinforce desired behaviors and values. What culture shifts are you driving?',
    context: 'Benefits supporting culture change'
  },
  {
    id: 'culture-champion-opener-10',
    type: 'opener',
    persona: 'culture-champion',
    content: 'The $4,500-$9,000 per employee benefits spend should drive measurable culture outcomes. I help culture leaders track impact on engagement, retention, and satisfaction. How do you currently measure benefits ROI?',
    context: 'Measuring culture impact of benefits'
  },
  {
    id: 'culture-champion-opener-11',
    type: 'opener',
    persona: 'culture-champion',
    content: 'With Canadian employment at 61.3%, creating magnetic workplace cultures is essential. Strategic benefits design helps you win the talent war. How are you positioning [Company] as the employer of choice?',
    context: 'Talent war through culture'
  },
  {
    id: 'culture-champion-opener-12',
    type: 'opener',
    persona: 'culture-champion',
    content: 'I help culture champions address the reality that 74% of buying teams experience unhealthy conflict. Building consensus around inclusive benefits creates organizational harmony. Would unified benefits strategy help?',
    context: 'Consensus through inclusive design'
  },
  {
    id: 'culture-champion-opener-13',
    type: 'opener',
    persona: 'culture-champion',
    content: 'Progressive culture leaders are using AI and analytics to understand employee needs. High-performing teams are 4.9x more likely to leverage these tools. Ready to use data for culture transformation?',
    context: 'Data-driven culture building'
  },
  {
    id: 'culture-champion-opener-14',
    type: 'opener',
    persona: 'culture-champion',
    content: 'With 43.2% of businesses facing labor obstacles, culture becomes your retention strategy. I help design benefits that make employees want to stay. Can we discuss building a sticky culture?',
    context: 'Culture as retention strategy'
  },
  {
    id: 'culture-champion-opener-15',
    type: 'opener',
    persona: 'culture-champion',
    content: 'The shift to digital benefits engagement mirrors broader culture changes. 50% of B2B transactions will be digital by 2025. I help culture leaders create seamless, modern employee experiences. Ready to modernize?',
    context: 'Digital culture transformation'
  },
  {
    id: 'culture-champion-opener-16',
    type: 'opener',
    persona: 'culture-champion',
    content: 'I\'m calling because inflation affects 13.5% of businesses, creating stress that impacts culture. Strategic benefits design can ease employee financial anxiety while controlling costs. How are you supporting employees through economic uncertainty?',
    context: 'Economic stress and culture support'
  },
  {
    id: 'culture-champion-opener-17',
    type: 'opener',
    persona: 'culture-champion',
    content: 'Culture champions using our approach see 32% better outcomes through risk reversal messaging. I can show you how to communicate benefits changes in ways that build trust and engagement. Interested?',
    context: 'Communication strategies for culture'
  },
  {
    id: 'culture-champion-opener-18',
    type: 'opener',
    persona: 'culture-champion',
    content: 'With 72% business optimism, now\'s the time to invest in culture. I help leaders design benefits that scale with growth while maintaining cultural integrity. Planning expansion? Let\'s discuss culture-first benefits.',
    context: 'Scaling culture through growth'
  },
  {
    id: 'culture-champion-opener-19',
    type: 'opener',
    persona: 'culture-champion',
    content: 'Replacing employees costs 50-200% of salary and damages culture. Strategic benefits reduce turnover by 32%, protecting your cultural investments. Can I show you how to build a more stable culture?',
    context: 'Turnover impact on culture'
  },
  {
    id: 'culture-champion-opener-20',
    type: 'opener',
    persona: 'culture-champion',
    content: 'I help culture champions navigate complex stakeholder dynamics. With buying committees averaging 13 people, getting cultural buy-in is crucial. Would frameworks for building consensus help your initiatives?',
    context: 'Stakeholder alignment for culture'
  },
  {
    id: 'culture-champion-opener-21',
    type: 'opener',
    persona: 'culture-champion',
    content: 'The best culture champions view benefits as values in action. Every benefit choice communicates what you stand for. How aligned are your current benefits with your stated values?',
    context: 'Values-based benefits design'
  },
  {
    id: 'culture-champion-opener-22',
    type: 'opener',
    persona: 'culture-champion',
    content: 'With 96% of prospects researching before vendor calls, your employees do the same with benefits. I help create transparent, easy-to-understand programs that build trust. Ready for radical benefits transparency?',
    context: 'Transparency building trust'
  },
  {
    id: 'culture-champion-opener-23',
    type: 'opener',
    persona: 'culture-champion',
    content: 'Culture champions face the challenge of 77% rating B2B purchases as extremely complex. I simplify benefits design while maximizing cultural impact. Would clearer benefits decisions accelerate your culture goals?',
    context: 'Simplifying for cultural impact'
  },
  {
    id: 'culture-champion-opener-24',
    type: 'opener',
    persona: 'culture-champion',
    content: 'I noticed [Company]\'s commitment to [Value/Mission]. Strategic benefits design can reinforce this daily. I help culture leaders embed values into every benefit decision. Can we explore this alignment?',
    context: 'Mission-aligned benefits strategy'
  },
  {
    id: 'culture-champion-opener-25',
    type: 'opener',
    persona: 'culture-champion',
    content: 'Leading culture change requires addressing the whole person. With mental, physical, and financial wellness interconnected, I help design holistic benefits that transform lives. Ready to lead comprehensive wellness?',
    context: 'Holistic wellness culture leadership'
  }
];

// Import all additional content
import { allAdditionalContent } from './additionalContent';

// Export combined content library with all variations
export const completeExpandedContentLibrary: ContentItem[] = [
  ...expandedContentLibrary,
  ...allAdditionalContent
];
// Export success outcomes for clear call objectives
export const callObjectives = [
  {
    id: 'meeting-booked',
    title: 'Meeting Booked',
    priority: 'highest',
    description: 'Schedule a detailed benefits review meeting',
    icon: '🎯',
    successMessage: 'Perfect! This is exactly what we want - a chance to dive deep into their specific situation.'
  },
  {
    id: 'follow-up-scheduled',
    title: 'Follow-up Scheduled',
    priority: 'high',
    description: 'Agreed to specific next contact date/time',
    icon: '📅',
    successMessage: 'Great progress! A committed follow-up is much better than "call me back sometime."'
  },
  {
    id: 'information-sent',
    title: 'Information Sent',
    priority: 'medium',
    description: 'Requested specific, relevant materials',
    icon: '📋',
    successMessage: 'Good outcome! You\'ve provided value and maintained engagement.'
  },
  {
    id: 'intelligence-gathered',
    title: 'Intelligence Gathered',
    priority: 'medium',
    description: 'Learned valuable information about their situation',
    icon: '💡',
    successMessage: 'Valuable! Every piece of intelligence makes future conversations more effective.'
  },
  {
    id: 'referral-received',
    title: 'Referral Received',
    priority: 'high',
    description: 'Got introduction to decision maker or other prospect',
    icon: '🤝',
    successMessage: 'Excellent! Referrals are often easier to convert than cold calls.'
  },
  {
    id: 'not-qualified',
    title: 'Not Qualified',
    priority: 'low',
    description: 'Determined they\'re not a good fit - saved time',
    icon: '✋',
    successMessage: 'This is actually a win! You\'ve saved time and can focus on better prospects.'
  }
];