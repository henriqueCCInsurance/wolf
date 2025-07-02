import { IndustryData } from '@/types';

export const industries: IndustryData[] = [
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    emergingRisks: [
      'Supply chain volatility and geopolitical instability',
      'Skilled labor shortage and aging workforce',
      'Automation and technological disruption'
    ],
    connectionToBenefits: [
      'Healthy, present workforce critical for production uptime',
      'Ergonomic risks require specialized coverage',
      'Retention of skilled workers through competitive benefits'
    ]
  },
  {
    id: 'technology',
    name: 'Technology',
    emergingRisks: [
      'Cybersecurity threats and data privacy regulations',
      'Rapid technological change and skill obsolescence',
      'High-stress environment and burnout'
    ],
    connectionToBenefits: [
      'Mental health support for high-stress roles',
      'Flexible benefits for diverse, remote workforce',
      'Progressive benefits to attract top talent'
    ]
  },
  {
    id: 'professional-services',
    name: 'Professional Services',
    emergingRisks: [
      'Professional burnout and "Great Resignation" echo',
      'Client pressure and billing targets',
      'Regulatory compliance and liability'
    ],
    connectionToBenefits: [
      'Work-life balance support to prevent turnover',
      'Mental health and stress management resources',
      'Competitive benefits to retain billable professionals'
    ]
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    emergingRisks: [
      'Staff shortages and burnout',
      'Regulatory changes and compliance costs',
      'Aging population and increased demand'
    ],
    connectionToBenefits: [
      'Comprehensive wellness programs for healthcare workers',
      'Stress management and mental health support',
      'Competitive benefits to attract and retain staff'
    ]
  },
  {
    id: 'retail',
    name: 'Retail',
    emergingRisks: [
      'E-commerce competition and changing consumer behavior',
      'Minimum wage increases and labor costs',
      'Seasonal workforce management'
    ],
    connectionToBenefits: [
      'Cost-effective benefits for hourly workers',
      'Flexible coverage for seasonal employees',
      'Wellness programs to reduce absenteeism'
    ]
  },
  {
    id: 'construction',
    name: 'Construction',
    emergingRisks: [
      'Safety regulations and liability concerns',
      'Skilled trade worker shortage',
      'Project-based workforce challenges'
    ],
    connectionToBenefits: [
      'Comprehensive injury and disability coverage',
      'Safety and wellness programs',
      'Portable benefits for mobile workforce'
    ]
  }
];