import { IndustryData } from '@/types';

export const industries: IndustryData[] = [
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    emergingRisks: [
      'Supply chain volatility - 65% increasing tech spend by 15% for resilience',
      'Skills gap crisis - 2.1 million jobs unfilled by 2030',
      'AI transformation - 78% planning AI investments in 2025',
      'Rising automation anxiety affecting workforce morale'
    ],
    connectionToBenefits: [
      'Workforce stability critical as automation delivers 23% productivity gains',
      'Mental health support essential for employees navigating AI transition',
      'Reskilling benefits help retain valuable workers through transformation',
      'Competitive benefits crucial to attract scarce skilled trades (43.2% labor obstacles)'
    ]
  },
  {
    id: 'technology',
    name: 'Technology',
    emergingRisks: [
      'Tech worker burnout - 68% report high levels in 2025',
      'Cybersecurity skills gap - 3.5 million unfilled positions globally',
      'Remote work complexity - 87% offering permanent remote options',
      'AI disruption requiring constant reskilling'
    ],
    connectionToBenefits: [
      'Mental health critical with 42% rating wellbeing as poor',
      'Remote-first benefits design supporting distributed teams',
      'Continuous learning benefits to combat skill obsolescence',
      'Competitive packages essential in war for tech talent (61.3% employment)'
    ]
  },
  {
    id: 'professional-services',
    name: 'Professional Services',
    emergingRisks: [
      'Talent exodus - 47% considering leaving within 2 years',
      'Billable hour pressure with 89% expecting flexible work',
      'AI disruption - generative AI changing service delivery',
      'Economic uncertainty affecting 72% of firms'
    ],
    connectionToBenefits: [
      'Work-life integration crucial for retaining top talent',
      'Mental health support for 42% experiencing poor wellbeing',
      'Flexible benefits supporting hybrid workforce expectations',
      'Strategic benefits design to compete with corporate clients for talent'
    ]
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    emergingRisks: [
      'Critical staffing crisis - 117,600 vacancy rate nationally',
      'Healthcare worker burnout - 76% report high stress levels',
      'Budget pressures - healthcare spending at 12.7% of GDP',
      'Aging workforce - 35% eligible to retire within 5 years'
    ],
    connectionToBenefits: [
      'Mental health support essential - 91% increasing investments',
      'Retention-focused benefits to combat 50-200% replacement costs',
      'Wellness programs reducing burnout and improving patient care',
      'Competitive packages crucial with 43.2% facing labor obstacles'
    ]
  },
  {
    id: 'retail',
    name: 'Retail',
    emergingRisks: [
      'E-commerce disruption - 73% of purchases influenced by digital',
      'Labor shortage - 9.2% cite recruitment as top challenge',
      'Rising costs - inflation impacting 13.5% as primary concern',
      'Generational shift - 65% of workforce now Millennials/Gen Z'
    ],
    connectionToBenefits: [
      'Cost-effective benefits within $4,500-$9,000 per employee range',
      'Flexible coverage supporting part-time and gig workers',
      'Mental health support for 42% reporting poor wellbeing',
      'Benefits that attract younger workers expecting modern perks'
    ]
  },
  {
    id: 'construction',
    name: 'Construction',
    emergingRisks: [
      'Skilled trades crisis - 43.2% expect labor obstacles',
      'Safety incidents cost average $42,000 per occurrence',
      'Project workforce volatility with boom-bust cycles',
      'Mental health challenges - 83% report high stress'
    ],
    connectionToBenefits: [
      'Comprehensive safety coverage reducing incident costs by 31%',
      'Mental health support for isolated and high-risk workers',
      'Portable benefits essential for project-based workforce',
      'Competitive packages to attract scarce trades (61.3% employment)'
    ]
  },
  {
    id: 'financial-services',
    name: 'Financial Services',
    emergingRisks: [
      'Cybersecurity threats and data breach liability - average breach costs $4.45M',
      'Regulatory compliance complexity (OSFI, FINTRAC, Privacy Act)',
      'Digital transformation pressure - 50% of transactions going digital by 2025',
      'Talent war with fintech startups offering progressive benefits'
    ],
    connectionToBenefits: [
      'High-stress roles require comprehensive mental health support (42% report poor mental health)',
      'Competitive benefits essential to retain top talent against 43.2% labor obstacles',
      'Work-life balance programs to prevent burnout in 24/7 trading environments',
      'Financial wellness programs addressing employee financial stress'
    ]
  },
  {
    id: 'education',
    name: 'Education',
    emergingRisks: [
      'Budget constraints with declining enrollment and funding cuts',
      'Teacher burnout and retention crisis - replacing costs 50-200% of salary',
      'Mental health crisis among educators and support staff',
      'Adapting to hybrid/remote learning models'
    ],
    connectionToBenefits: [
      'Mental health support critical - 91% of organizations increasing investments',
      'Cost-effective benefits design within tight budgets ($4,500-$9,000 per employee)',
      'Summer coverage considerations for seasonal workforce',
      'Wellness programs to combat educator burnout and improve retention'
    ]
  },
  {
    id: 'government',
    name: 'Government / Public Sector',
    emergingRisks: [
      'Aging workforce and succession planning challenges',
      'Budget pressures and taxpayer scrutiny on spending',
      'Competition with private sector for skilled workers (9.2% cite as top challenge)',
      'Service delivery expectations with limited resources'
    ],
    connectionToBenefits: [
      'Pension integration and retirement planning for aging workforce',
      'Cost-effective benefits that demonstrate fiscal responsibility',
      'Comprehensive coverage to compete with private sector',
      'Mental health support for high-stress public service roles'
    ]
  },
  {
    id: 'energy',
    name: 'Energy & Utilities',
    emergingRisks: [
      'Energy transition and workforce transformation',
      'Safety risks in field operations and remote locations',
      'Skilled trades shortage - 43.2% expect labor obstacles',
      'Regulatory changes and environmental compliance'
    ],
    connectionToBenefits: [
      'Remote workforce benefits and telemedicine for field workers',
      'Comprehensive safety and disability coverage for high-risk roles',
      'Competitive benefits to attract scarce skilled trades (61.3% employment rate)',
      'Mental health support for isolated and shift workers'
    ]
  },
  {
    id: 'non-profit',
    name: 'Non-Profit',
    emergingRisks: [
      'Limited budgets competing with mission spending',
      'High turnover due to burnout and low compensation',
      'Donor expectations for overhead efficiency',
      'Volunteer management and liability'
    ],
    connectionToBenefits: [
      'Cost-effective benefits within 15-30% of limited payroll budgets',
      'Mission-aligned wellness programs supporting staff resilience',
      'Flexible benefits for diverse workforce (full-time, part-time, contract)',
      'Mental health support for emotionally demanding mission work'
    ]
  }
];