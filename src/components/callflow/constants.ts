/**
 * Constants for the LiveCallAssistance component
 */

export const NO_GO_REASONS = [
  'Already have coverage',
  'Budget constraints',
  'Not decision maker',
  'Wrong timing',
  'Competitor locked in',
  'Not interested in benefits',
  'Company too small/large',
  'Geographic restrictions',
  'Other priorities',
  'Hung up/Rude'
];

export const BASE_CALL_FLOW_STEPS = [
  {
    id: 'opening',
    title: 'Opening & Rapport',
    description: 'Establish connection and set the tone',
    completed: false,
    tips: ['Use their name', 'Reference something personal', 'Be enthusiastic but professional']
  },
  {
    id: 'permission',
    title: 'Permission to Proceed',
    description: 'Confirm they have time and interest',
    completed: false,
    tips: ['Ask for specific time commitment', 'Confirm decision-making authority']
  },
  {
    id: 'discovery',
    title: 'Discovery Questions',
    description: 'Understand their current situation and needs',
    completed: false,
    tips: ['Ask open-ended questions', 'Listen for pain points', 'Take notes on key details']
  },
  {
    id: 'presentation',
    title: 'Value Presentation',
    description: 'Present solutions tailored to their needs',
    completed: false,
    tips: ['Connect to discovered needs', 'Use specific examples', 'Focus on outcomes']
  },
  {
    id: 'objections',
    title: 'Handle Objections',
    description: 'Address concerns and build confidence',
    completed: false,
    optional: true,
    tips: ['Acknowledge their concern', 'Ask clarifying questions', 'Provide relevant examples']
  },
  {
    id: 'close',
    title: 'Close for Next Step',
    description: 'Secure commitment for follow-up action',
    completed: false,
    tips: ['Be specific about next steps', 'Confirm their commitment', 'Set clear expectations']
  }
];