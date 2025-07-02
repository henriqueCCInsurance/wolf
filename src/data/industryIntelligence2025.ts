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
  }
];

export default industryIntelligence2025;