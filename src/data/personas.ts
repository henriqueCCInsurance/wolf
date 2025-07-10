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
  },
  {
    id: 'strategic-ceo',
    title: 'The Strategic CEO',
    description: 'CEO / President / Managing Director',
    profile: 'Visionary leader focused on growth, culture, and competitive advantage. Makes final decisions on strategic investments including benefits.',
    keyPressures: [
      'Attracting and retaining top talent in competitive market',
      'Building distinctive company culture as competitive differentiator',
      'Managing growth while maintaining profitability and employee satisfaction',
      'Balancing stakeholder interests (employees, shareholders, customers)'
    ],
    language: [
      'Strategic vision',
      'Market positioning',
      'Competitive advantage',
      'Company culture',
      'Talent strategy',
      'Innovation',
      'Stakeholder value',
      'Growth trajectory'
    ],
    digitalExpectations: 'Expects executive dashboards and strategic insights. Values data that connects benefits to business outcomes and competitive positioning.',
    redFlags: [
      'Too much operational detail without strategic context',
      'Cannot connect benefits to business strategy',
      'Lack of industry benchmarking or competitive insights',
      'Cookie-cutter approach without customization'
    ]
  },
  {
    id: 'operations-leader',
    title: 'The Operations Leader',
    description: 'COO / VP Operations / Director of Operations',
    profile: 'Efficiency-focused executive who ensures smooth daily operations. Views benefits through lens of productivity and operational excellence.',
    keyPressures: [
      'Minimizing operational disruptions and downtime',
      'Optimizing workforce productivity and efficiency',
      'Managing remote/hybrid work complexities',
      'Reducing administrative burden on management team'
    ],
    language: [
      'Operational efficiency',
      'Process optimization',
      'Productivity metrics',
      'Downtime reduction',
      'Workflow automation',
      'Resource allocation',
      'Performance indicators',
      'Scalability'
    ],
    digitalExpectations: 'High focus on integration and automation. Values solutions that streamline processes and reduce manual intervention.',
    redFlags: [
      'Complex implementation that disrupts operations',
      'High administrative overhead',
      'Poor integration with existing systems',
      'Inability to scale with business growth'
    ]
  },
  {
    id: 'culture-champion',
    title: 'The Culture Champion',
    description: 'Chief People Officer / VP People & Culture / Director of Culture',
    profile: 'Progressive leader transforming workplace culture. Champions employee experience, diversity, equity, inclusion, and wellbeing initiatives.',
    keyPressures: [
      'Creating inclusive benefits that serve diverse employee needs',
      'Addressing mental health crisis and burnout epidemic',
      'Building employer brand to attract next-gen talent',
      'Measuring and improving employee experience holistically'
    ],
    language: [
      'Employee experience',
      'Diversity, equity & inclusion',
      'Psychological safety',
      'Wellbeing strategy',
      'Culture transformation',
      'Employer value proposition',
      'Belonging',
      'Purpose-driven workplace'
    ],
    digitalExpectations: 'Expects modern, inclusive digital experiences. Values personalization, accessibility, and data-driven insights into employee wellbeing.',
    redFlags: [
      'Outdated or non-inclusive benefit designs',
      'Lack of mental health and wellbeing focus',
      'One-size-fits-all approaches',
      'Cannot discuss DEI considerations in benefits'
    ]
  }
];