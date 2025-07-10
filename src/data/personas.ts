import { PersonaData } from '@/types';

export const personas: PersonaData[] = [
  {
    id: 'cost-conscious-employer',
    title: 'The Cost-Conscious Employer',
    description: 'Small Business Owner (10-75 employees)',
    profile: 'Founder or owner deeply invested in business success but resource-constrained, wearing multiple hats including HR and finance.',
    keyPressures: [
      'Talent retention in competitive market - skilled recruitment cited as top challenge by 9.2% of Canadian businesses',
      'Rising inflation (13.5% of businesses cite as #1 challenge) and input costs (12.1%) squeezing margins',
      'Administrative burden - average benefits spending 15-30% of payroll ($4,500-$9,000 per employee)',
      'Managing multi-generational workforce expectations - 65% of B2B buyers now Millennials/Gen Z'
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
      'Supporting multi-generational workforce - 65% of B2B buyers now Millennials/Gen Z with different expectations',
      'Mental health crisis deepening - 42% of employees rate mental health as fair/poor, 91% expect employer support',
      'Demonstrating strategic value - 91% with wellness-focused workplaces report job satisfaction',
      'Investment pressure - 91% of organizations anticipating greater mental health solution investments in 2024'
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
      'Cost predictability with market volatility - 72.1% of Canadian businesses optimistic but cautious',
      'Maximizing ROI - corporate wellness market growing from $61B (2023) to $85B (2030), demanding clear returns',
      'Digital transformation imperative - 50% of $1M+ B2B transactions through digital self-serve by 2025',
      'Complex buying decisions - average 6-10 stakeholders, 77% rate B2B purchases as extremely complex'
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
      'Managing complex buying committees - average 6-10 stakeholders across 4+ functions',
      'Protecting decision-makers from 8+ average contact attempts needed to reach prospects',
      'Ensuring important matters reach the right person - 96% of prospects research before conversations',
      'Balancing access with efficiency - 49% of buyers still prefer initial contact via cold call'
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
      'Business transformation driving 99% of B2B purchases - benefits as enabler of change',
      'Talent crisis - 43.2% of Canadian businesses expect labor-related obstacles, 9.2% cite skilled recruitment as top challenge',
      'Building distinctive culture - 91% satisfaction in wellness-focused workplaces vs. average well-being score of 43.7/100',
      'Managing stakeholder complexity - buying committees average 13 people across 2+ departments'
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
      'Managing hybrid workforce expectations - 89% say flexible work improves work-life balance',
      'Optimizing productivity amid well-being crisis - average employee well-being score only 43.7/100',
      'Digital transformation of operations - 80% of B2B sales interactions will be digital by 2025',
      'Reducing complexity - 74% of buyer teams experience unhealthy conflict, need streamlined processes'
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
      'Creating inclusive benefits for 65% Millennial/Gen Z workforce with different expectations',
      'Mental health emergency - 42% rate mental health fair/poor, 91% organizations increasing investment',
      'Building employer brand - 91% satisfaction in wellness-focused workplaces drives talent attraction',
      'Quantifying impact - wellness market $61B→$85B by 2030, demands measurable outcomes'
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