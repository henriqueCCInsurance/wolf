import { SuccessPredictionService } from '@/services/successPrediction';
import { Lead, CallLog } from '@/types';

// Sample leads for testing
const sampleLeads: Lead[] = [
  {
    companyName: 'ABC Manufacturing',
    contactName: 'John Smith',
    contactPhone: '555-123-4567',
    contactEmail: 'john.smith@abcmfg.com',
    industry: 'manufacturing',
    persona: 'cost-conscious-employer'
  },
  {
    companyName: 'Tech Solutions Inc',
    contactName: 'Sarah Johnson',
    contactPhone: '555-987-6543',
    contactEmail: 'sarah@techsolutions.com',
    industry: 'technology',
    persona: 'benefits-optimizer'
  },
  {
    companyName: 'Global Corp',
    contactName: 'Michael Brown',
    contactPhone: '555-456-7890',
    contactEmail: 'mbrown@globalcorp.com',
    industry: 'retail',
    persona: 'roi-focused-executive'
  }
];

// Sample historical call logs
const sampleCallLogs: CallLog[] = [
  {
    id: 'log-1',
    leadId: 'ABC Manufacturing-John Smith',
    outcome: 'meeting-booked',
    intel: 'CEO interested in cost savings',
    bestTalkingPoint: 'ROI calculator',
    keyTakeaway: 'Decision maker engaged',
    createdAt: new Date('2025-01-08T10:00:00Z'),
    callDuration: 480,
    startTime: new Date('2025-01-08T10:00:00Z'),
    endTime: new Date('2025-01-08T10:08:00Z'),
    additionalInfo: {
      companyInsights: 'Manufacturing company, 50+ employees',
      nextSteps: 'Meeting scheduled for next week'
    }
  },
  {
    id: 'log-2',
    leadId: 'Tech Solutions Inc-Sarah Johnson',
    outcome: 'follow-up',
    intel: 'HR Director evaluating options',
    bestTalkingPoint: 'Benefits portfolio',
    keyTakeaway: 'Needs time to review',
    createdAt: new Date('2025-01-07T14:30:00Z'),
    callDuration: 360,
    startTime: new Date('2025-01-07T14:30:00Z'),
    endTime: new Date('2025-01-07T14:36:00Z'),
    additionalInfo: {
      companyInsights: 'Technology company, growth focused',
      nextSteps: 'Follow-up in 2 weeks'
    }
  },
  {
    id: 'log-3',
    leadId: 'Global Corp-Michael Brown',
    outcome: 'disqualified',
    intel: 'Already has coverage',
    bestTalkingPoint: 'N/A',
    keyTakeaway: 'Not interested',
    createdAt: new Date('2025-01-06T16:00:00Z'),
    callDuration: 120,
    startTime: new Date('2025-01-06T16:00:00Z'),
    endTime: new Date('2025-01-06T16:02:00Z'),
    additionalInfo: {
      companyInsights: 'Large corporation, satisfied with current provider',
      nextSteps: 'No follow-up needed'
    }
  },
  {
    id: 'log-4',
    leadId: 'Another Corp-Jane Doe',
    outcome: 'meeting-booked',
    intel: 'Interested in employee benefits',
    bestTalkingPoint: 'Cost savings analysis',
    keyTakeaway: 'Very engaged',
    createdAt: new Date('2025-01-05T11:00:00Z'),
    callDuration: 720,
    startTime: new Date('2025-01-05T11:00:00Z'),
    endTime: new Date('2025-01-05T11:12:00Z'),
    additionalInfo: {
      companyInsights: 'Growing company, looking for better benefits',
      nextSteps: 'Meeting scheduled'
    }
  },
  {
    id: 'log-5',
    leadId: 'Small Business LLC-Bob Wilson',
    outcome: 'nurture',
    intel: 'Small business, budget conscious',
    bestTalkingPoint: 'Small business packages',
    keyTakeaway: 'Interested but timing is off',
    createdAt: new Date('2025-01-04T09:30:00Z'),
    callDuration: 300,
    startTime: new Date('2025-01-04T09:30:00Z'),
    endTime: new Date('2025-01-04T09:35:00Z'),
    additionalInfo: {
      companyInsights: 'Small business, 10 employees',
      nextSteps: 'Follow-up in 3 months'
    }
  }
];

export function runSuccessPredictionDemo(): void {
  console.log('🎯 Running Success Prediction Demo...\n');
  
  const predictionService = SuccessPredictionService.getInstance();
  
  // Test predictions for each sample lead
  sampleLeads.forEach((lead) => {
    console.log(`\n--- Prediction for ${lead.companyName} (${lead.contactName}) ---`);
    console.log(`Persona: ${lead.persona}`);
    console.log(`Industry: ${lead.industry}`);
    
    const prediction = predictionService.calculatePrediction(lead, sampleCallLogs);
    
    console.log(`\n📊 Success Prediction: ${prediction.score}%`);
    console.log(`📈 Confidence: ${prediction.confidence}`);
    console.log(`🎯 Best Time: ${prediction.bestTimeToCall.dayOfWeek}, ${prediction.bestTimeToCall.timeRange}`);
    console.log(`📈 Trend: ${prediction.factors.overallTrend}`);
    
    console.log('\n🔍 Contributing Factors:');
    console.log(`  • Persona Success Rate: ${prediction.factors.personaSuccessRate}%`);
    console.log(`  • Industry Success Rate: ${prediction.factors.industrySuccessRate}%`);
    console.log(`  • Time of Day Score: ${prediction.factors.timeOfDayScore}%`);
    console.log(`  • Day of Week Score: ${prediction.factors.dayOfWeekScore}%`);
    console.log(`  • Previous Interaction Score: ${prediction.factors.previousInteractionScore}%`);
    
    if (prediction.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      prediction.recommendations.forEach((rec, i) => {
        console.log(`  ${i + 1}. ${rec}`);
      });
    }
    
    console.log('\n' + '='.repeat(60));
  });
  
  // Test model update
  console.log('\n🔄 Testing Model Update...');
  const newCallLog: CallLog = {
    id: 'log-new',
    leadId: 'Test Company-Test Contact',
    outcome: 'meeting-booked',
    intel: 'Successful call',
    bestTalkingPoint: 'ROI calculator',
    keyTakeaway: 'Meeting scheduled',
    createdAt: new Date(),
    callDuration: 600,
    startTime: new Date(),
    endTime: new Date(),
    additionalInfo: {
      companyInsights: 'Test company',
      nextSteps: 'Meeting scheduled'
    }
  };
  
  predictionService.updateModel(newCallLog);
  console.log('✅ Model updated with new call outcome');
  
  console.log('\n🎉 Success Prediction Demo Complete!');
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).runSuccessPredictionDemo = runSuccessPredictionDemo;
}