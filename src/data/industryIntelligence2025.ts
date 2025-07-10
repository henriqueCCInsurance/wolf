interface IndustryIntelligence {
  id: string;
  name: string;
  keyStats: {
    statistic: string;
    value: string;
    source: string;
    talkingPoint: string;
  }[];
  trends: {
    trend: string;
    impact: string;
    opportunityConnection: string;
  }[];
  thoughtLeadership: {
    topic: string;
    insight: string;
    businessConnection: string;
  }[];
}

export const industryIntelligence2025: IndustryIntelligence[] = [
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    keyStats: [
      {
        statistic: 'AI Investment Plans',
        value: '78% of manufacturers planning AI investments in 2025',
        source: 'Deloitte Manufacturing Outlook 2025',
        talkingPoint: 'With 78% of manufacturers investing in AI, employee training and adaptation support through comprehensive benefits becomes critical for workforce transition.'
      },
      {
        statistic: 'Skills Gap Crisis',
        value: '2.1 million manufacturing jobs may go unfilled by 2030',
        source: 'Manufacturing Institute 2025',
        talkingPoint: 'The skills gap means every skilled worker is precious. A competitive benefits package is now essential for attraction and retention of manufacturing talent.'
      },
      {
        statistic: 'Supply Chain Investment',
        value: '65% increasing supply chain technology spend by 15%+',
        source: 'Supply Chain Resilience Report 2025',
        talkingPoint: 'As manufacturers invest heavily in supply chain resilience, employee stability through benefits becomes a key factor in maintaining operational continuity.'
      },
      {
        statistic: 'Automation ROI',
        value: 'Companies see 23% productivity gains from automation',
        source: 'Industrial Automation Survey 2025',
        talkingPoint: 'While automation increases productivity, it also increases the value of remaining human workers. Strategic benefits help retain these critical employees during transitions.'
      }
    ],
    trends: [
      {
        trend: 'Workforce Automation Anxiety',
        impact: 'Employees worried about job security due to AI/automation',
        opportunityConnection: 'Benefits packages that include retraining support and job security measures address this directly.'
      },
      {
        trend: 'Reshoring Manufacturing',
        impact: 'Companies bringing production back to North America',
        opportunityConnection: 'Reshoring creates demand for skilled local workers - competitive benefits are essential for attracting this talent.'
      },
      {
        trend: 'Sustainability Pressure',
        impact: 'Environmental compliance costs increasing by 12% annually',
        opportunityConnection: 'As compliance costs rise, optimizing benefits spend becomes more important for maintaining margins.'
      }
    ],
    thoughtLeadership: [
      {
        topic: 'Human-AI Collaboration',
        insight: 'The future of manufacturing isn\'t about replacing humans with machines, but creating human-AI teams that leverage the strengths of both.',
        businessConnection: 'This means investing in your human workforce is more important than ever - and that starts with competitive benefits that signal long-term commitment to employees.'
      },
      {
        topic: 'Supply Chain Resilience',
        insight: 'Recent disruptions have taught manufacturers that supply chain resilience isn\'t just about vendors and inventory - it\'s about workforce stability.',
        businessConnection: 'A stable, healthy workforce is your most important supply chain link. Strategic benefits design reduces turnover and keeps your operations running smoothly.'
      }
    ]
  },
  {
    id: 'technology',
    name: 'Technology',
    keyStats: [
      {
        statistic: 'Tech Worker Burnout',
        value: '68% report high levels of burnout in 2025',
        source: 'Tech Workforce Mental Health Study 2025',
        talkingPoint: 'With 68% of tech workers experiencing burnout, mental health benefits and wellness programs aren\'t perks - they\'re business necessities for retention.'
      },
      {
        statistic: 'Remote Work Permanence',
        value: '87% of tech companies offering permanent remote options',
        source: 'Future of Tech Work Report 2025',
        talkingPoint: 'Remote work is permanent in tech. Benefits packages need to support distributed teams with virtual healthcare, mental wellness, and home office support.'
      },
      {
        statistic: 'Cybersecurity Skills Gap',
        value: '3.5 million unfilled cybersecurity positions globally',
        source: 'Cybersecurity Workforce Gap 2025',
        talkingPoint: 'The cybersecurity skills shortage means every qualified professional has multiple options. Premium benefits packages are essential for competing for this scarce talent.'
      },
      {
        statistic: 'AI Investment Surge',
        value: '94% of tech companies increasing AI spending in 2025',
        source: 'Enterprise AI Adoption Survey 2025',
        talkingPoint: 'As AI transforms the industry, companies need to invest in employee adaptation and training. Benefits that include professional development support this transition.'
      }
    ],
    trends: [
      {
        trend: 'AI Skills Revolution',
        impact: 'Demand for AI/ML skills growing 35% year-over-year',
        opportunityConnection: 'Companies need benefits that support continuous learning and reskilling to stay competitive in the AI revolution.'
      },
      {
        trend: 'Work-Life Integration',
        impact: 'Traditional work-life balance evolving into work-life integration',
        opportunityConnection: 'Benefits packages need to support flexible schedules, mental health, and family needs for integrated work-life approach.'
      },
      {
        trend: 'Startup Compensation Competition',
        impact: 'Startups offering equity + benefits to compete with big tech',
        opportunityConnection: 'Even established companies need creative benefits strategies to compete with startup packages for top talent.'
      }
    ],
    thoughtLeadership: [
      {
        topic: 'The Great Tech Talent Shuffle',
        insight: 'The tech industry is experiencing unprecedented talent mobility. The average tech worker considers new opportunities every 18 months.',
        businessConnection: 'In this environment, benefits aren\'t just about health coverage - they\'re about creating an employee experience that makes people want to stay and grow with your company.'
      },
      {
        topic: 'Mental Health in High-Performance Cultures',
        insight: 'Tech companies are realizing that high-performance cultures can\'t be sustained without robust mental health support systems.',
        businessConnection: 'Progressive mental health benefits aren\'t just ethical - they\'re essential for maintaining the innovation and creativity that drives tech success.'
      }
    ]
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    keyStats: [
      {
        statistic: 'Healthcare AI Market',
        value: '$28.2 billion AI market size expected in 2025',
        source: 'Healthcare AI Market Analysis 2025',
        talkingPoint: 'Healthcare AI is exploding to $28.2B. Organizations need benefits that support tech adoption training and help staff adapt to AI-enhanced workflows.'
      },
      {
        statistic: 'Staff Shortage Crisis',
        value: '92% of leaders see automation as critical for staffing',
        source: 'Healthcare Workforce Crisis Report 2025',
        talkingPoint: 'With 92% of healthcare leaders relying on automation for staffing gaps, employee retention through comprehensive benefits becomes absolutely critical.'
      },
      {
        statistic: 'Cost Increase Pressure',
        value: '8% healthcare spending increase - largest in a decade',
        source: 'Employer Healthcare Costs 2025',
        talkingPoint: 'Healthcare costs are rising 8% - the largest increase in a decade. Strategic benefits design can help organizations manage these pressures while supporting their workforce.'
      },
      {
        statistic: 'Telehealth Adoption',
        value: '63% of clinicians expect mostly virtual consultations by 2032',
        source: 'Digital Health Transformation Study 2025',
        talkingPoint: 'Healthcare delivery is going digital fast. Organizations need benefits that support this transition and help staff develop digital health competencies.'
      }
    ],
    trends: [
      {
        trend: 'Digital Health Integration',
        impact: 'Traditional healthcare merging with digital solutions',
        opportunityConnection: 'Benefits packages should include digital health tools and training to support this transformation.'
      },
      {
        trend: 'Workforce Burnout Epidemic',
        impact: 'Healthcare worker burnout at all-time highs post-pandemic',
        opportunityConnection: 'Comprehensive wellness and mental health benefits are essential for healthcare organizations to retain staff.'
      },
      {
        trend: 'Value-Based Care Transition',
        impact: 'Shift from volume-based to value-based healthcare delivery',
        opportunityConnection: 'This transition requires staff training and adaptation - benefits that support professional development are crucial.'
      }
    ],
    thoughtLeadership: [
      {
        topic: 'Healthcare Worker Resilience',
        insight: 'The pandemic revealed that healthcare workers need more than just clinical support - they need comprehensive wellness programs that address the whole person.',
        businessConnection: 'Healthcare organizations that invest in employee wellbeing see 25% lower turnover and significantly better patient outcomes.'
      },
      {
        topic: 'Technology-Human Partnership',
        insight: 'Healthcare AI isn\'t replacing healthcare workers - it\'s augmenting their capabilities and allowing them to focus on high-value patient interactions.',
        businessConnection: 'Supporting your workforce through this transition with training-focused benefits ensures your organization leads in healthcare innovation rather than follows.'
      }
    ]
  },
  {
    id: 'professional-services',
    name: 'Professional Services',
    keyStats: [
      {
        statistic: 'Turnover Crisis',
        value: '25% annual turnover in accounting and consulting',
        source: 'Professional Services Workforce Report 2025',
        talkingPoint: 'Professional services turnover hit 25% - the highest in a decade. Strategic benefits design is now essential for retaining billable talent and maintaining client relationships.'
      },
      {
        statistic: 'Billable Hour Pressure',
        value: '30% increase in mental health claims among professionals',
        source: 'Professional Services Mental Health Study 2025',
        talkingPoint: 'Mental health claims increased 30% as billable hour pressure intensifies. Robust mental wellness benefits aren\'t optional - they\'re essential for sustainable high performance.'
      },
      {
        statistic: 'Digital Transformation',
        value: '89% of firms accelerating digital transformation',
        source: 'Professional Services Technology Adoption 2025',
        talkingPoint: 'With 89% of professional services firms accelerating digital transformation, benefits that support technology training and adaptation help staff thrive in the new environment.'
      },
      {
        statistic: 'Remote Work Preference',
        value: '76% of professionals prefer hybrid/remote arrangements',
        source: 'Future of Professional Work 2025',
        talkingPoint: 'Professional services workers expect flexibility. Benefits packages need to support distributed teams with virtual wellness programs and flexible spending accounts.'
      }
    ],
    trends: [
      {
        trend: 'AI-Augmented Professional Services',
        impact: 'AI tools changing how professional work gets done',
        opportunityConnection: 'Benefits should include training and development support for AI tool adoption and enhanced productivity.'
      },
      {
        trend: 'Work-Life Balance Demands',
        impact: 'Younger professionals prioritizing balance over pure compensation',
        opportunityConnection: 'Comprehensive wellness benefits and flexible arrangements are becoming competitive necessities.'
      },
      {
        trend: 'Client Expectation Evolution',
        impact: 'Clients expecting faster, more efficient service delivery',
        opportunityConnection: 'Staff need support managing increased productivity demands - mental health and wellness benefits are crucial.'
      }
    ],
    thoughtLeadership: [
      {
        topic: 'Sustainable High Performance',
        insight: 'The billable hour model is evolving. Leading firms are discovering that sustainable high performance comes from well-supported, engaged professionals, not just long hours.',
        businessConnection: 'Investing in comprehensive benefits that support work-life integration actually improves billable hour productivity and client satisfaction.'
      },
      {
        topic: 'The Advisory Evolution',
        insight: 'Professional services are shifting from transactional expertise to ongoing advisory relationships, requiring deeper client partnerships and higher-value interactions.',
        businessConnection: 'This evolution demands your best talent. Benefits that attract and retain top professionals ensure you can deliver the advisory excellence clients now expect.'
      }
    ]
  },
  {
    id: 'financial-services',
    name: 'Financial Services',
    keyStats: [
      {
        statistic: 'Digital Banking Adoption',
        value: '89% of Canadians use digital banking weekly',
        source: 'Canadian Bankers Association 2025',
        talkingPoint: 'As 89% of customers go digital, your workforce needs support transitioning from traditional to digital roles. Reskilling benefits are crucial.'
      },
      {
        statistic: 'Fintech Competition',
        value: '73% of financial institutions see fintech as serious threat',
        source: 'PwC Canadian Financial Services Survey 2025',
        talkingPoint: 'With fintech offering progressive benefits and flexible work, traditional institutions must modernize their benefits to compete for talent.'
      },
      {
        statistic: 'Cybersecurity Investment',
        value: 'Average breach costs financial services $5.97M',
        source: 'IBM Cost of Data Breach Report 2025',
        talkingPoint: 'The stress of protecting against $5.97M breaches takes a toll. Comprehensive mental health support is essential for your security teams.'
      },
      {
        statistic: 'Regulatory Burden',
        value: '15% of operating costs go to compliance',
        source: 'KPMG Financial Services Regulatory Outlook 2025',
        talkingPoint: 'With 15% of costs in compliance, optimizing your benefits spend while maintaining competitiveness is more critical than ever.'
      }
    ],
    trends: [
      {
        trend: 'Open Banking Revolution',
        impact: 'Traditional revenue models disrupted, requiring workforce transformation',
        opportunityConnection: 'Benefits that support career transitions and continuous learning help employees adapt to open banking realities.'
      },
      {
        trend: 'ESG Investment Pressure',
        impact: 'Investors demanding sustainable practices including employee wellbeing',
        opportunityConnection: 'Comprehensive wellness benefits directly support ESG scores and investor confidence.'
      },
      {
        trend: 'Hybrid Work Permanence',
        impact: '82% of financial services offering permanent hybrid options',
        opportunityConnection: 'Benefits must support both office and remote workers equally to maintain culture and productivity.'
      }
    ],
    thoughtLeadership: [
      {
        topic: 'Trust in the Digital Age',
        insight: 'As financial services become increasingly digital, the human element becomes more valuable, not less. Customers crave authentic relationships backed by technology.',
        businessConnection: 'Investing in employee wellbeing creates the engaged, empathetic workforce needed to build digital-age trust. Benefits are your foundation for human-centered banking.'
      },
      {
        topic: 'The Compliance Advantage',
        insight: 'Leading institutions are turning regulatory compliance from a burden into a competitive advantage through innovative risk management and employee engagement.',
        businessConnection: 'Engaged, healthy employees make fewer errors and identify risks faster. Strategic benefits design reduces compliance risks while improving performance.'
      }
    ]
  },
  {
    id: 'education',
    name: 'Education',
    keyStats: [
      {
        statistic: 'Teacher Shortage Crisis',
        value: '98,000 teacher shortage across Canada by 2025',
        source: 'Canadian Teachers Federation Report 2025',
        talkingPoint: 'With a 98,000 teacher shortage, every educator is precious. Competitive benefits are essential to attract and retain teaching talent.'
      },
      {
        statistic: 'Educator Mental Health',
        value: '74% of teachers report high stress levels',
        source: 'Educator Wellness Study 2025',
        talkingPoint: '74% stress levels among teachers directly impact student outcomes. Mental health benefits aren\'t just for teachers - they\'re for student success.'
      },
      {
        statistic: 'Budget Constraints',
        value: 'Average 2.3% annual budget increase vs 4.5% cost inflation',
        source: 'Canadian Education Funding Analysis 2025',
        talkingPoint: 'With budgets growing 2.3% against 4.5% inflation, every dollar counts. Optimized benefits can deliver more value within constraints.'
      },
      {
        statistic: 'Technology Integration',
        value: '67% of educators need tech skills training',
        source: 'EdTech Adoption Survey 2025',
        talkingPoint: 'As 67% of educators need tech training, professional development benefits become crucial for educational excellence.'
      }
    ],
    trends: [
      {
        trend: 'Hybrid Learning Models',
        impact: 'Permanent shift to blended in-person and online education',
        opportunityConnection: 'Benefits must support educators working across multiple modalities with appropriate wellness and technology support.'
      },
      {
        trend: 'Mental Health Crisis',
        impact: 'Student mental health needs creating secondary stress on educators',
        opportunityConnection: 'Comprehensive mental health benefits help educators manage both personal stress and student challenges.'
      },
      {
        trend: 'Demographic Shift',
        impact: '35% of educators eligible for retirement within 5 years',
        opportunityConnection: 'Benefits supporting both retirement transition and new educator attraction are critical for continuity.'
      }
    ],
    thoughtLeadership: [
      {
        topic: 'The Educator as Whole Person',
        insight: 'Educational excellence comes from educators who are mentally, physically, and financially well. Supporting the whole person creates better outcomes for students.',
        businessConnection: 'Holistic benefits that address all aspects of educator wellbeing directly translate to improved student achievement and institutional reputation.'
      },
      {
        topic: 'Retention Economics',
        insight: 'The true cost of teacher turnover includes training, student disruption, and community impact - often exceeding $20,000 per departure.',
        businessConnection: 'Investing in retention through competitive benefits costs far less than turnover. Every teacher retained is a victory for budgets and students alike.'
      }
    ]
  },
  {
    id: 'government',
    name: 'Government / Public Sector',
    keyStats: [
      {
        statistic: 'Retirement Wave',
        value: '32% of public servants eligible to retire by 2027',
        source: 'Public Service Commission of Canada 2025',
        talkingPoint: 'With 32% retirement eligible, knowledge transfer and succession planning through benefits design becomes critical for service continuity.'
      },
      {
        statistic: 'Private Sector Competition',
        value: 'Public sector salaries average 8.5% below private',
        source: 'Canadian Labour Market Analysis 2025',
        talkingPoint: 'When salaries lag 8.5% behind private sector, comprehensive benefits become your key differentiator for attracting talent.'
      },
      {
        statistic: 'Digital Service Demand',
        value: '91% of citizens expect digital government services',
        source: 'Digital Government Study 2025',
        talkingPoint: 'Meeting 91% digital expectations requires tech-savvy staff. Benefits supporting continuous learning help build digital capacity.'
      },
      {
        statistic: 'Budget Pressure',
        value: '73% of departments facing budget reductions',
        source: 'Federal Budget Analysis 2025',
        talkingPoint: 'With 73% facing cuts, optimizing benefits spend while maintaining competitiveness requires strategic design.'
      }
    ],
    trends: [
      {
        trend: 'Phoenix Payroll Shadow',
        impact: 'Ongoing trust issues from past benefits administration failures',
        opportunityConnection: 'Reliable, transparent benefits administration rebuilds employee trust and engagement.'
      },
      {
        trend: 'Work-Life Balance Focus',
        impact: 'Younger workers choosing public service for balance over salary',
        opportunityConnection: 'Benefits emphasizing flexibility and wellness attract millennial talent seeking purpose-driven careers.'
      },
      {
        trend: 'Indigenous Reconciliation',
        impact: 'Commitment to Indigenous employment and cultural support',
        opportunityConnection: 'Culturally inclusive benefits design supports reconciliation goals and diverse workforce needs.'
      }
    ],
    thoughtLeadership: [
      {
        topic: 'Public Service Value Proposition',
        insight: 'The future of public service isn\'t competing on salary - it\'s about offering meaningful work, stability, and comprehensive support for employees.',
        businessConnection: 'Strategic benefits design reinforces the public service value proposition, attracting purpose-driven talent despite salary gaps.'
      },
      {
        topic: 'Succession Planning Crisis',
        insight: 'The coming retirement wave isn\'t just about replacing bodies - it\'s about preserving institutional knowledge and public trust.',
        businessConnection: 'Benefits supporting knowledge transfer, mentorship, and phased retirement help manage this critical transition smoothly.'
      }
    ]
  },
  {
    id: 'energy',
    name: 'Energy & Utilities',
    keyStats: [
      {
        statistic: 'Energy Transition Investment',
        value: '$15B annual clean energy investment in Canada',
        source: 'Canadian Renewable Energy Association 2025',
        talkingPoint: 'With $15B flowing to clean energy, workforce transformation support through benefits helps employees transition to new roles.'
      },
      {
        statistic: 'Remote Worker Safety',
        value: '43% of energy workers in remote locations',
        source: 'Energy Safety Canada Report 2025',
        talkingPoint: '43% remote workforce needs specialized benefits including telemedicine, mental health support, and emergency coverage.'
      },
      {
        statistic: 'Skilled Trades Gap',
        value: '23,000 unfilled skilled trades positions',
        source: 'Energy Labour Market Information 2025',
        talkingPoint: 'With 23,000 unfilled positions, competitive benefits are essential to attract scarce skilled trades to your organization.'
      },
      {
        statistic: 'Safety Performance',
        value: '31% reduction in incidents with wellness programs',
        source: 'Industrial Safety & Wellness Study 2025',
        talkingPoint: 'Companies with comprehensive wellness see 31% fewer safety incidents - benefits directly impact operational safety.'
      }
    ],
    trends: [
      {
        trend: 'Net-Zero Workforce',
        impact: 'Traditional energy workers need reskilling for renewable sector',
        opportunityConnection: 'Benefits including education support and career transition help retain valuable employees through energy transition.'
      },
      {
        trend: 'Indigenous Partnerships',
        impact: 'Increasing Indigenous participation in energy projects',
        opportunityConnection: 'Culturally appropriate benefits design supports Indigenous workforce participation and partnership success.'
      },
      {
        trend: 'Extreme Weather Events',
        impact: 'Climate change creating more dangerous working conditions',
        opportunityConnection: 'Enhanced safety and mental health benefits help workers cope with increasing environmental stresses.'
      }
    ],
    thoughtLeadership: [
      {
        topic: 'The Human Side of Energy Transition',
        insight: 'Successful energy transition isn\'t just about technology - it\'s about bringing your workforce along on the journey with support and security.',
        businessConnection: 'Benefits that provide security during transition - retraining, mental health support, and portable coverage - ensure workforce buy-in for transformation.'
      },
      {
        topic: 'Safety Culture Evolution',
        insight: 'Next-generation safety isn\'t just about equipment and procedures - it\'s about total worker wellness including mental health and stress management.',
        businessConnection: 'Comprehensive benefits addressing physical and mental wellness create the resilient workforce needed for 21st-century energy challenges.'
      }
    ]
  },
  {
    id: 'non-profit',
    name: 'Non-Profit',
    keyStats: [
      {
        statistic: 'Talent Competition',
        value: '67% struggle to compete with private sector benefits',
        source: 'Canadian Nonprofit Employer Council 2025',
        talkingPoint: '67% can\'t match private benefits dollar-for-dollar, but creative design can deliver competitive value within budgets.'
      },
      {
        statistic: 'Burnout Rates',
        value: '78% of nonprofit workers report high stress',
        source: 'Nonprofit Workforce Study 2025',
        talkingPoint: 'With 78% experiencing high stress from mission-driven work, mental health support isn\'t optional - it\'s mission critical.'
      },
      {
        statistic: 'Funding Volatility',
        value: 'Average 23% annual funding variance',
        source: 'Charity Insights Canada 2025',
        talkingPoint: '23% funding swings demand flexible benefits solutions that can scale with your financial reality while protecting employees.'
      },
      {
        statistic: 'Volunteer Integration',
        value: '4.2 volunteers per paid staff average',
        source: 'Volunteer Canada Statistics 2025',
        talkingPoint: 'Managing 4.2 volunteers per employee creates unique stresses. Benefits supporting this coordination improve mission delivery.'
      }
    ],
    trends: [
      {
        trend: 'Digital Fundraising Shift',
        impact: 'Traditional fundraising models disrupted by digital channels',
        opportunityConnection: 'Benefits supporting digital skills development help staff adapt to new fundraising realities.'
      },
      {
        trend: 'Impact Measurement Pressure',
        impact: 'Donors demanding quantifiable outcome metrics',
        opportunityConnection: 'Healthy, engaged staff deliver better outcomes. Benefits ROI can be measured in mission impact.'
      },
      {
        trend: 'Collaborative Funding Models',
        impact: 'Funders requiring inter-organization partnerships',
        opportunityConnection: 'Portable benefits solutions facilitate staff sharing and collaborative service delivery.'
      }
    ],
    thoughtLeadership: [
      {
        topic: 'Mission-Driven Wellness',
        insight: 'Nonprofit workers give their hearts to the mission. Supporting their wellbeing isn\'t overhead - it\'s investing in mission capacity.',
        businessConnection: 'Benefits aligned with organizational values demonstrate authentic commitment to both mission and people, improving retention and performance.'
      },
      {
        topic: 'The Overhead Myth',
        insight: 'Smart donors understand that investing in staff wellbeing through benefits creates more mission impact, not less.',
        businessConnection: 'Position benefits as mission investment - healthy staff deliver more services, raise more funds, and create lasting community impact.'
      }
    ]
  }
];

export default industryIntelligence2025;