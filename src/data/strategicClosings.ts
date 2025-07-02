import { PersonaType } from '@/types';

interface StrategicClosing {
  id: string;
  type: 'meeting-booking' | 'information-gathering' | 'follow-up-scheduling' | 'referral-request';
  persona: PersonaType;
  title: string;
  content: string;
  context: string;
  successRate: number; // Percentage based on historical data
  followUp?: string;
}

export const strategicClosings: StrategicClosing[] = [
  // MEETING BOOKING CLOSES
  {
    id: 'cce-meeting-1',
    type: 'meeting-booking',
    persona: 'cost-conscious-employer',
    title: 'ROI Analysis Close',
    content: 'Based on what you\'ve shared, I can see some immediate opportunities to optimize your benefits spend. Would it make sense to schedule 30 minutes next week where I can show you a preliminary analysis of potential savings for a business your size?',
    context: 'Use when they\'ve expressed cost concerns',
    successRate: 78,
    followUp: 'Perfect! I\'ll bring a customized analysis showing exactly how much you could save while maintaining or improving coverage.'
  },
  {
    id: 'cce-meeting-2',
    type: 'meeting-booking',
    persona: 'cost-conscious-employer',
    title: 'Time-Saving Close',
    content: 'It sounds like benefits administration is taking up too much of your valuable time. What if I could show you how to cut that time in half while also reducing costs? Would 20 minutes next Tuesday work to explore this?',
    context: 'Use when they mention administrative burden',
    successRate: 82,
    followUp: 'Excellent! I\'ll prepare some specific time-saving strategies that other business owners in your situation have used successfully.'
  },
  {
    id: 'bo-meeting-1',
    type: 'meeting-booking',
    persona: 'benefits-optimizer',
    title: 'Strategic Value Close',
    content: 'You clearly understand the strategic importance of benefits for employee engagement. I\'d love to share some benchmarking data that shows how your plan compares to industry leaders and discuss opportunities to enhance your strategic impact. Would 45 minutes next week be valuable?',
    context: 'Use when they\'ve shown strategic thinking',
    successRate: 85,
    followUp: 'Great! I\'ll bring industry benchmarking data and some case studies of HR leaders who\'ve achieved measurable ROI improvements.'
  },
  {
    id: 'rfe-meeting-1',
    type: 'meeting-booking',
    persona: 'roi-focused-executive',
    title: 'Financial Analysis Close',
    content: 'From a CFO perspective, what you\'re describing suggests there\'s definitely room for financial optimization in your benefits strategy. Would it be worth 30 minutes to review a cost-benefit analysis and show you how other finance leaders are improving their benefits ROI?',
    context: 'Use when they\'ve engaged on financial topics',
    successRate: 88,
    followUp: 'Perfect! I\'ll prepare a financial impact analysis with specific ROI projections for your review.'
  },

  // INFORMATION GATHERING CLOSES
  {
    id: 'cce-info-1',
    type: 'information-gathering',
    persona: 'cost-conscious-employer',
    title: 'Benchmark Study Close',
    content: 'I completely understand wanting to do your research first. What would be helpful is if I sent you a benchmark study showing how businesses your size are handling benefits costs in this economic climate. Should I focus on cost optimization or employee retention strategies?',
    context: 'Use when they want to "think about it"',
    successRate: 65,
    followUp: 'I\'ll send that over today. It includes some eye-opening comparisons that most business owners find valuable for their planning.'
  },
  {
    id: 'bo-info-1',
    type: 'information-gathering',
    persona: 'benefits-optimizer',
    title: 'Industry Report Close',
    content: 'I have an exclusive HR report on benefits trends specific to your industry that most HR leaders find extremely valuable for strategic planning. Would that be useful for your upcoming planning sessions?',
    context: 'Use when they need to review internally',
    successRate: 72,
    followUp: 'Perfect! This report includes engagement metrics and retention strategies that are working particularly well in your sector.'
  },

  // FOLLOW-UP SCHEDULING CLOSES
  {
    id: 'cce-followup-1',
    type: 'follow-up-scheduling',
    persona: 'cost-conscious-employer',
    title: 'Next Quarter Close',
    content: 'I understand timing isn\'t right for any changes now. Many business owners find it valuable to review their options before renewal season hits. Would it make sense to reconnect in 3 months to discuss your renewal strategy?',
    context: 'Use when timing is the objection',
    successRate: 58,
    followUp: 'Great! I\'ll put a reminder to call you in early [month] so we can discuss renewal strategies before you\'re under time pressure.'
  },
  {
    id: 'bo-followup-1',
    type: 'follow-up-scheduling',
    persona: 'benefits-optimizer',
    title: 'Budget Cycle Close',
    content: 'That makes perfect sense about budget timing. Most HR leaders find it helpful to have strategic options ready before budget planning begins. When does your budget planning typically start for next year?',
    context: 'Use when budget cycle is the constraint',
    successRate: 68,
    followUp: 'Perfect! I\'ll reach out about 6 weeks before your budget planning starts with some strategic options and ROI projections.'
  },

  // REFERRAL REQUEST CLOSES
  {
    id: 'cce-referral-1',
    type: 'referral-request',
    persona: 'cost-conscious-employer',
    title: 'Business Network Close',
    content: 'I appreciate your honesty about your situation. You obviously know other business owners who might benefit from cost optimization strategies. Who comes to mind that might value a conversation about reducing their benefits spend?',
    context: 'Use when they\'re not a fit but had good conversation',
    successRate: 35,
    followUp: 'Thank you! I\'ll mention that you suggested I reach out and make sure to highlight the cost-saving focus.'
  },
  {
    id: 'gk-referral-1',
    type: 'referral-request',
    persona: 'gatekeeper',
    title: 'Network Introduction Close',
    content: 'I understand [Decision Maker] isn\'t available, and I respect that. You probably know other companies that might benefit from the cost savings we provide. Is there anyone you\'d feel comfortable having me reach out to?',
    context: 'Use when unable to reach decision maker',
    successRate: 28,
    followUp: 'I appreciate that! I\'ll make sure to mention you suggested I reach out when I contact them.'
  },

  // ADVANCED CLOSES FOR DIFFICULT SITUATIONS
  {
    id: 'cce-objection-1',
    type: 'meeting-booking',
    persona: 'cost-conscious-employer',
    title: 'Risk Reversal Close',
    content: 'I understand you\'re hesitant about taking time for another meeting. How about this - if I can\'t show you at least one specific way to save money or reduce your administrative burden in 15 minutes, I\'ll end the meeting early and recommend you stick with your current approach. Fair enough?',
    context: 'Use when they\'re resistant to meetings',
    successRate: 71,
    followUp: 'Perfect! That takes all the risk off you. I\'ll come prepared with specific savings opportunities for businesses exactly your size.'
  },
  {
    id: 'bo-strategic-1',
    type: 'meeting-booking',
    persona: 'benefits-optimizer',
    title: 'Competitive Intelligence Close',
    content: 'You mentioned wanting to stay competitive in the talent market. I have some confidential benchmarking data on what leading companies in your industry are doing with benefits that might surprise you. Would 30 minutes to review this competitive intelligence be valuable?',
    context: 'Use when they\'re competitive-minded',
    successRate: 79,
    followUp: 'Excellent! I\'ll bring the latest competitive analysis - some of this data isn\'t available publicly and gives you a real strategic advantage.'
  },
  {
    id: 'rfe-financial-1',
    type: 'meeting-booking',
    persona: 'roi-focused-executive',
    title: 'Financial Impact Close',
    content: 'As a CFO, you\'ll appreciate this - I can show you exactly how much money you\'re leaving on the table with your current benefits structure and provide a detailed financial model for optimization. Would 30 minutes to review the numbers be worthwhile?',
    context: 'Use when they\'re numbers-focused',
    successRate: 91,
    followUp: 'Perfect! I\'ll prepare a comprehensive financial analysis with clear ROI projections and cost optimization opportunities.'
  }
];

// Helper function to get closes by type and persona
export const getClosingsByPersonaAndType = (
  persona: PersonaType, 
  type?: StrategicClosing['type']
): StrategicClosing[] => {
  return strategicClosings.filter(closing => {
    const personaMatch = closing.persona === persona;
    const typeMatch = type ? closing.type === type : true;
    return personaMatch && typeMatch;
  }).sort((a, b) => b.successRate - a.successRate); // Sort by success rate
};

// Success rate categories for visual indicators
export const getSuccessRateCategory = (rate: number): 'low' | 'medium' | 'high' | 'excellent' => {
  if (rate >= 80) return 'excellent';
  if (rate >= 65) return 'high';
  if (rate >= 45) return 'medium';
  return 'low';
};

export default strategicClosings;