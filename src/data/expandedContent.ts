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