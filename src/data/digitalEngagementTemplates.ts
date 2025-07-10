import { PersonaType } from '@/types';

interface DigitalTemplate {
  id: string;
  type: 'email-sequence' | 'linkedin-outreach' | 'video-script' | 'voicemail' | 'text-message' | 'follow-up';
  persona: PersonaType | 'universal';
  templateName: string;
  subject?: string;
  content: string | string[];
  timing?: string;
  tips: string[];
  bestPractices: string[];
  metrics?: {
    openRate?: string;
    responseRate?: string;
    conversionRate?: string;
  };
}

export const digitalEngagementTemplates: DigitalTemplate[] = [
  // ============ EMAIL SEQUENCES ============
  {
    id: 'email-seq-cce-1',
    type: 'email-sequence',
    persona: 'cost-conscious-employer',
    templateName: 'Cost Savings Introduction Sequence',
    content: [
      // Email 1 - Initial Outreach
      `Subject: Quick question about [Company]'s benefits costs

Hi [Name],

I noticed [Company] has been growing in the [Industry] space. With inflation hitting 13.5% of Canadian businesses hardest, I'm curious - are rising benefits costs impacting your margins?

We've helped similar companies reduce benefits spend by 15-20% while actually improving employee satisfaction. 

Worth a quick call to explore if we could do the same for you?

Best,
[Your Name]
Campbell & Co.`,

      // Email 2 - Value Addition (Day 3)
      `Subject: Re: Quick question about [Company]'s benefits costs

Hi [Name],

I wanted to share a quick insight - did you know most businesses are spending $4,500-$9,000 per employee on benefits, but 40% of that goes to features less than 15% of employees actually use?

Here's a 2-minute video showing how we helped [Similar Company] redirect that waste into high-value benefits: [Link]

Still happy to discuss how this applies to [Company] if you're interested.

Best,
[Your Name]`,

      // Email 3 - Social Proof (Day 7)
      `Subject: How [Similar Company] saved $127K on benefits

Hi [Name],

I'll keep this brief. [Similar Company] was facing the same challenges as [Company]:
- Rising costs eating into margins
- Employees unhappy with current benefits
- No time to manage complex renewals

We helped them save $127K annually while improving employee satisfaction by 34%.

If you'd like to see their case study, just reply "SEND IT" and I'll share the details.

Otherwise, I'll assume benefits aren't a priority right now and won't reach out again.

Best,
[Your Name]`
    ],
    timing: 'Day 1, Day 3, Day 7',
    tips: [
      'Personalize with specific company details and industry challenges',
      'Keep emails under 150 words for mobile readability',
      'Use specific numbers and percentages from research',
      'Always include a clear, simple call-to-action'
    ],
    bestPractices: [
      'Send initial email Tuesday-Thursday, 8-10 AM recipient time',
      'Reference current market data (inflation, labor challenges)',
      'Use "reply with X" CTAs to make response easy',
      'Stop sequence if they engage through another channel'
    ],
    metrics: {
      openRate: '47%',
      responseRate: '12%',
      conversionRate: '3.8%'
    }
  },

  {
    id: 'email-seq-bo-1',
    type: 'email-sequence',
    persona: 'benefits-optimizer',
    templateName: 'Mental Health & Wellness Sequence',
    content: [
      // Email 1
      `Subject: 42% of employees struggling - is [Company] addressing this?

Hi [Name],

With 42% of Canadian employees rating their mental health as fair or poor, HR leaders are scrambling for solutions. 

I noticed [Company] has [X] employees. Are you seeing increased mental health challenges impacting productivity and retention?

We help HR leaders implement comprehensive wellness programs that actually work. Companies using our approach see 91% employee satisfaction vs. the 43.7% average.

Do you have 15 minutes this week to discuss your wellness strategy?

Best,
[Your Name]
Campbell & Co.`,

      // Email 2 - Day 4
      `Subject: 91% of companies increasing mental health spend - here's how to maximize ROI

Hi [Name],

Following up on my previous note. Since 91% of organizations are increasing mental health investments this year, the question isn't whether to invest, but how to get maximum impact.

I've attached a quick framework showing how to:
- Measure current employee wellbeing baseline
- Design targeted interventions
- Track ROI on wellness investments

Would this be helpful for your 2025 benefits planning?

Best,
[Your Name]`,

      // Email 3 - Day 8
      `Subject: Last check-in on wellness strategy

Hi [Name],

I know you're busy managing benefits for [Company]'s diverse workforce. 

Quick question - if you could solve one employee wellbeing challenge this quarter, what would it be?

Happy to share specific strategies other HR leaders are using, or we can connect next quarter if timing is better.

Let me know either way?

Best,
[Your Name]`
    ],
    timing: 'Day 1, Day 4, Day 8',
    tips: [
      'Lead with compelling statistics about mental health crisis',
      'Position yourself as a strategic partner, not vendor',
      'Offer valuable resources even if they don\'t respond',
      'Show understanding of HR-specific pressures'
    ],
    bestPractices: [
      'Reference specific HR metrics (engagement, retention, satisfaction)',
      'Include attachments or links to valuable content',
      'Acknowledge their expertise and busy schedule',
      'Use collaborative language ("explore together", "share strategies")'
    ],
    metrics: {
      openRate: '52%',
      responseRate: '15%',
      conversionRate: '4.2%'
    }
  },

  // ============ LINKEDIN OUTREACH ============
  {
    id: 'linkedin-ceo-1',
    type: 'linkedin-outreach',
    persona: 'strategic-ceo',
    templateName: 'CEO Strategic Benefits Connection',
    subject: 'Connection Request',
    content: `Hi [Name],

I've been following [Company]'s growth in [Industry]. With 99% of B2B purchases driven by organizational change, your transformation strategy caught my attention.

I help CEOs turn benefits from a cost center into a strategic talent advantage. Would love to connect and share insights on how peers are navigating the 43.2% labor obstacle challenge.

Best,
[Your Name]
Campbell & Co.`,
    tips: [
      'Reference specific company achievements or news',
      'Keep under 300 characters for mobile',
      'Focus on strategic business outcomes, not benefits features',
      'Mention peer companies or industry trends'
    ],
    bestPractices: [
      'Connect with 2-3 other employees first for warm introduction',
      'Engage with their content before reaching out',
      'Send requests Tuesday-Thursday, 7-9 AM',
      'Follow up with valuable content, not sales pitch'
    ],
    metrics: {
      responseRate: '28%',
      conversionRate: '8.5%'
    }
  },

  {
    id: 'linkedin-ops-1',
    type: 'linkedin-outreach',
    persona: 'operations-leader',
    templateName: 'Operations Efficiency Message',
    content: `Hi [Name],

I noticed your role in driving operational excellence at [Company]. With 89% of employees demanding flexible work arrangements, I imagine managing benefits for distributed teams is increasingly complex.

I specialize in helping Ops leaders streamline benefits administration - reducing overhead by 40% while improving employee satisfaction.

Worth connecting to share what's working for other operations teams?

Best,
[Your Name]`,
    tips: [
      'Focus on operational efficiency and time savings',
      'Reference specific operational challenges (hybrid work, automation)',
      'Use metrics that matter to operations (efficiency, overhead reduction)',
      'Position as peer sharing best practices'
    ],
    bestPractices: [
      'Message after they post about operational achievements',
      'Reference mutual connections if available',
      'Offer specific insights about their industry',
      'Keep follow-up focused on value, not selling'
    ]
  },

  // ============ VIDEO SCRIPT TEMPLATES ============
  {
    id: 'video-script-universal-1',
    type: 'video-script',
    persona: 'universal',
    templateName: '60-Second Benefits ROI Explainer',
    content: `[SCENE: Professional but warm setting, speaker visible]

Hook (0-5 seconds):
"Did you know companies waste 40% of their benefits budget on unused features?"

Problem (5-15 seconds):
"Most businesses spend $4,500-$9,000 per employee on benefits, but employees only value about 60% of what's offered. That's thousands in wasted dollars."

Solution (15-35 seconds):
"At Campbell & Co., we use data analytics to show exactly what your employees want and use. We help companies like [Example] redirect wasted spend into high-value benefits - saving money while boosting satisfaction."

Proof (35-50 seconds):
"On average, our clients save 15-20% on benefits costs and see employee satisfaction jump by 34%. That's real ROI that impacts your bottom line."

CTA (50-60 seconds):
"Want to see what you could save? Visit [URL] for your free benefits waste analysis, or reply to schedule a quick call."

[END SCENE]`,
    tips: [
      'Keep energy high but professional',
      'Use visual aids (charts, graphics) to illustrate savings',
      'Include captions for silent viewing',
      'Ensure good lighting and clear audio'
    ],
    bestPractices: [
      'Record multiple versions for A/B testing',
      'Keep total length under 90 seconds',
      'Lead with problem, not company introduction',
      'End with clear, specific call-to-action'
    ],
    metrics: {
      openRate: '71%',
      conversionRate: '11%'
    }
  },

  // ============ VOICEMAIL SCRIPTS ============
  {
    id: 'voicemail-gatekeeper-1',
    type: 'voicemail',
    persona: 'gatekeeper',
    templateName: 'Gatekeeper Respect Voicemail',
    content: `Hi [Name], this is [Your Name] from Campbell & Co.

I'm calling because 91% of companies are increasing their benefits investments this year, and I have insights that [Decision Maker] might find valuable for [Company]'s planning.

I specialize in helping companies save 15-20% on benefits costs while improving employee satisfaction. 

Could you help me get 15 minutes on [Decision Maker]'s calendar? My direct line is [Phone] or you can email me at [Email].

Thanks for your help, [Name]. I appreciate everything you do to protect [Decision Maker]'s time.`,
    tips: [
      'Acknowledge their important role',
      'Be specific about time request (15 minutes)',
      'Provide compelling reason for executive attention',
      'Thank them by name at the end'
    ],
    bestPractices: [
      'Keep under 30 seconds',
      'Speak slowly and clearly',
      'Repeat your contact information',
      'Sound confident but respectful'
    ]
  },

  // ============ TEXT MESSAGE TEMPLATES ============
  {
    id: 'text-follow-up-1',
    type: 'text-message',
    persona: 'universal',
    templateName: 'Post-Email Text Follow-Up',
    content: `Hi [Name], it's [Your Name] from Campbell & Co. Just sent you an email about helping [Company] save 15-20% on benefits costs. With 72% of businesses watching expenses, thought this might be timely. Worth a quick chat?`,
    tips: [
      'Only text if you have permission or prior relationship',
      'Keep under 160 characters when possible',
      'Reference the email for context',
      'Include clear value proposition'
    ],
    bestPractices: [
      'Send during business hours only',
      'Wait 24-48 hours after email',
      'Use for high-priority prospects only',
      'Always offer opt-out option'
    ]
  },

  // ============ MULTI-TOUCH FOLLOW-UP SEQUENCES ============
  {
    id: 'follow-up-universal-1',
    type: 'follow-up',
    persona: 'universal',
    templateName: 'No-Response Multi-Channel Sequence',
    content: [
      // Day 1: Initial Email
      'Email with personalized subject line and value proposition',
      
      // Day 3: LinkedIn Connection
      'LinkedIn connection request with reference to email',
      
      // Day 5: Voicemail + Email
      'Voicemail in morning, follow-up email with "left you a voicemail" subject',
      
      // Day 8: Value-Add Email
      'Email with relevant case study or industry report',
      
      // Day 12: Video Email
      'Personalized video message showing specific value for their company',
      
      // Day 16: Final Email
      'Break-up email with "Should I close your file?" subject',
      
      // Day 30: Quarterly Check-in
      'Add to quarterly nurture campaign with industry insights'
    ],
    timing: 'Days 1, 3, 5, 8, 12, 16, then quarterly',
    tips: [
      'Vary your channels to increase visibility',
      'Each touch should provide new value',
      'Reference previous attempts to show persistence',
      'Always maintain professional tone'
    ],
    bestPractices: [
      'Track which message generates response',
      'Stop sequence immediately upon any response',
      'Personalize each touch with new information',
      'Use marketing automation to manage timing'
    ],
    metrics: {
      responseRate: '67%',
      conversionRate: '19%'
    }
  },

  // ============ INDUSTRY-SPECIFIC TEMPLATES ============
  {
    id: 'email-manufacturing-1',
    type: 'email-sequence',
    persona: 'cost-conscious-employer',
    templateName: 'Manufacturing AI Transition Support',
    subject: 'Helping manufacturers navigate the 78% AI adoption wave',
    content: `Hi [Name],

With 78% of manufacturers planning AI investments, I'm curious how [Company] is supporting workers through this transition?

The anxiety is real - employees worry about job security while you need them engaged and productive.

We help manufacturers design benefits that signal long-term commitment to human workers, reducing turnover by 32% during digital transformations.

[Similar Company] used our approach to retain 94% of their skilled workers through a major automation project.

Worth discussing how benefits can support your AI journey?

Best,
[Your Name]`,
    tips: [
      'Address specific industry transformation challenges',
      'Acknowledge employee concerns empathetically',
      'Connect benefits to business transformation success',
      'Use peer company examples'
    ],
    bestPractices: [
      'Research their specific automation/AI initiatives',
      'Time outreach to transformation announcements',
      'Focus on workforce stability during change',
      'Offer insights even if they don\'t respond'
    ]
  },

  // ============ RESPONSE TEMPLATES ============
  {
    id: 'response-objection-1',
    type: 'follow-up',
    persona: 'universal',
    templateName: 'Common Objection Email Responses',
    content: [
      `OBJECTION: "Happy with current provider"
RESPONSE: Thanks for letting me know, [Name]. It's great that you have a trusted partner.

Out of curiosity - do they proactively show you where you might be overspending? Our clients are often surprised to discover they're wasting 40% of benefits budget on unused features.

If you'd ever like a free second opinion on optimization opportunities, I'm here.

Best,
[Your Name]`,

      `OBJECTION: "No budget"
RESPONSE: I understand, [Name]. With inflation hitting 13.5% of businesses, everyone's watching costs.

That's exactly why our approach focuses on savings first - we typically reduce spend by 15-20% while improving coverage.

Would it make sense to explore how we could free up budget for you?

Best,
[Your Name]`,

      `OBJECTION: "Too busy"
RESPONSE: Completely understand, [Name]. That's exactly why busy leaders work with us - we handle the complexity so you can focus on [Core Business].

A 15-minute call could save hours of work and thousands of dollars.

How does [Day] at [Time] work for a brief conversation?

Best,
[Your Name]`,

      `OBJECTION: "Send me information"
RESPONSE: Happy to send information, [Name]. 

To make sure it's relevant, could you share:
- Your biggest benefits challenge right now?
- Approximate number of employees?
- When your renewal comes up?

I'll send targeted insights based on your specific situation.

Best,
[Your Name]`
    ],
    tips: [
      'Acknowledge their objection respectfully',
      'Reframe the conversation around their needs',
      'Provide value even in objection response',
      'Keep door open for future engagement'
    ],
    bestPractices: [
      'Respond within 2 hours during business hours',
      'Mirror their communication style',
      'Never argue or seem pushy',
      'Add to nurture campaign after objection'
    ]
  }
];

// Helper function to get templates by persona
export function getTemplatesByPersona(persona: PersonaType): DigitalTemplate[] {
  return digitalEngagementTemplates.filter(
    template => template.persona === persona || template.persona === 'universal'
  );
}

// Helper function to get templates by type
export function getTemplatesByType(type: DigitalTemplate['type']): DigitalTemplate[] {
  return digitalEngagementTemplates.filter(template => template.type === type);
}

// Helper function to search templates by keyword
export function searchTemplates(keyword: string): DigitalTemplate[] {
  const lowerKeyword = keyword.toLowerCase();
  return digitalEngagementTemplates.filter(template => 
    template.templateName.toLowerCase().includes(lowerKeyword) ||
    JSON.stringify(template.content).toLowerCase().includes(lowerKeyword) ||
    template.tips.some(tip => tip.toLowerCase().includes(lowerKeyword))
  );
}

export default digitalEngagementTemplates;