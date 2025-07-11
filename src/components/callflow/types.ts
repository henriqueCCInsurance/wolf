/**
 * Type definitions for the LiveCallAssistance component
 */

export interface CallFlowStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  optional?: boolean;
  tips?: string[];
  selectedContent?: ContentItem[];
}

export interface ContentItem {
  id: string;
  type: 'opener' | 'thought-leadership' | 'objection-handler';
  persona: string;
  content: string;
  context?: string;
}