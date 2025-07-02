import { PersonaData } from '@/types';

export const personas: PersonaData[] = [
  {
    id: 'cost-conscious-employer',
    title: 'The Cost-Conscious Employer',
    description: 'Small Business Owner (10-75 employees)',
    profile: 'Founder or owner deeply invested in business success but resource-constrained, wearing multiple hats including HR and finance.',
    keyPressures: [
      'Talent retention in competitive market - losing key employees to larger competitors',
      'Inflationary and cash flow pressures - every dollar scrutinized',
      'Administrative burden - time lost to benefits questions and management'
    ],
    language: [
      'Headcount',
      'Payroll',
      'Annual budget',
      'Profit margin',
      'Employee turnover rate',
      'Business stability',
      'Growth opportunities'
    ],
    digitalExpectations: 'Modest but focused on efficiency. Values tools that simplify administration, reduce paperwork, and provide clear reporting.',
    redFlags: [
      'Excessive jargon or technical language',
      'Failure to understand financial constraints',
      'One-size-fits-all solutions',
      'Overly slick sales pitches'
    ]
  },
  {
    id: 'benefits-optimizer',
    title: 'The Benefits Optimizer',
    description: 'HR Manager',
    profile: 'Balances employee needs with corporate objectives, frontline for employee concerns, deeply involved in company culture.',
    keyPressures: [
      'Supporting multi-generational and diverse workforce with different expectations',
      'Mental health imperative - 1 in 5 Canadians experience mental health challenges',
      'Demonstrating strategic value - needs to show how benefits contribute to business outcomes'
    ],
    language: [
      'Employee engagement',
      'eNPS (employee Net Promoter Score)',
      'Retention/turnover rates',
      'Absenteeism',
      'Benefits utilization rates',
      'Employee feedback',
      'Employer brand'
    ],
    digitalExpectations: 'High expectations for seamless digital experience. Expects AI-driven analytics, self-service options, and mobile accessibility.',
    redFlags: [
      'Cannot speak about modern wellness trends',
      'Ignoring diversity and inclusion considerations',
      'Purely cost-focused pitch ignoring employee experience',
      'Lack of modern digital tools'
    ]
  },
  {
    id: 'roi-focused-executive',
    title: 'The ROI-Focused Executive',
    description: 'CFO / Finance Lead',
    profile: 'Guardian of company financial health, analytical and data-driven, focused on risk management and long-term sustainability.',
    keyPressures: [
      'Cost predictability and containment in uncertain economic environment',
      'Maximizing ROI - every expenditure must show clear return',
      'Financial risk management - concerned with long-term plan liabilities'
    ],
    language: [
      'P&L statement',
      'Balance sheet',
      'Cash flow',
      'EBITDA',
      'Cost-benefit analysis',
      'Risk mitigation',
      'Budget adherence',
      'Financial stability'
    ],
    digitalExpectations: 'Sophisticated tools for financial analysis. Key audience for predictive cost analytics and benchmarking insights.',
    redFlags: [
      'Cannot speak the language of finance',
      'Makes claims without supporting data',
      'Focuses only on soft benefits without financial metrics',
      'Emotional or relationship-based pitch without business case'
    ]
  },
  {
    id: 'gatekeeper',
    title: 'The Gatekeeper',
    description: 'Administrative Assistant / Office Manager',
    profile: 'Controls access to decision-makers, often the first point of contact, values efficiency and clear communication.',
    keyPressures: [
      'Managing multiple priorities and interruptions',
      'Protecting decision-makers time',
      'Ensuring important matters reach the right person'
    ],
    language: [
      'Scheduling',
      'Priorities',
      'Time management',
      'Important vs urgent',
      'Decision-maker preferences'
    ],
    digitalExpectations: 'Basic but effective. Values clear, concise communication and respect for protocols.',
    redFlags: [
      'Disrespectful of their role',
      'Pushy or aggressive approach',
      'Unclear about the purpose of the call',
      'Attempts to bypass proper channels'
    ]
  }
];