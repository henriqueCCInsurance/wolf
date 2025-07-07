import { CallLog, BattleCard, ExportableData } from '@/types';
import { format } from 'date-fns';

export interface ExportData {
  callLogs: CallLog[];
  battleCards: BattleCard[];
  performanceMetrics: PerformanceMetrics;
  exportVersion: string;
  exportTimestamp: string;
  appVersion: string;
}

export interface ImportResult {
  success: boolean;
  message: string;
  data?: ExportData;
  errors?: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface PerformanceMetrics {
  totalCalls: number;
  meetingsBooked: number;
  followUps: number;
  nurtures: number;
  successRate: number;
  avgCallDuration: number;
  exportDate: string;
}

// Convert data to CSV format
export const convertToCSV = (data: ExportableData[], headers: string[]): string => {
  const csvHeaders = headers.join(',');
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header];
      // Handle values that might contain commas or quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value || '';
    }).join(',')
  );
  
  return [csvHeaders, ...csvRows].join('\n');
};

// Export call logs to CSV
export const exportCallLogsToCSV = (callLogs: CallLog[]): void => {
  const headers = [
    'Date',
    'Time',
    'Lead Company',
    'Outcome',
    'Duration (min)',
    'Intel Gathered',
    'Best Talking Point',
    'Key Takeaway',
    'New Contacts',
    'Referrals',
    'Company Insights',
    'Next Steps',
    'Meeting Type',
    'Follow-up Date'
  ];

  const csvData = callLogs.map(log => ({
    'Date': format(new Date(log.createdAt), 'yyyy-MM-dd'),
    'Time': format(new Date(log.createdAt), 'HH:mm:ss'),
    'Lead Company': log.leadId,
    'Outcome': log.outcome,
    'Duration (min)': log.callDuration ? Math.round(log.callDuration / 60 * 100) / 100 : '',
    'Intel Gathered': log.intel,
    'Best Talking Point': log.bestTalkingPoint,
    'Key Takeaway': log.keyTakeaway,
    'New Contacts': log.additionalInfo?.newContacts || '',
    'Referrals': log.additionalInfo?.referrals || '',
    'Company Insights': log.additionalInfo?.companyInsights || '',
    'Next Steps': log.additionalInfo?.nextSteps || '',
    'Meeting Type': log.additionalInfo?.meetingType || '',
    'Follow-up Date': log.additionalInfo?.followUpDate || ''
  }));

  const csv = convertToCSV(csvData, headers);
  downloadCSV(csv, `wolf-den-call-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`);
};

// Export performance metrics to CSV
export const exportPerformanceMetricsToCSV = (callLogs: CallLog[]): void => {
  const totalCalls = callLogs.length;
  const meetingsBooked = callLogs.filter(log => log.outcome === 'meeting-booked').length;
  const followUps = callLogs.filter(log => log.outcome === 'follow-up').length;
  const nurtures = callLogs.filter(log => log.outcome === 'nurture').length;
  const avgCallDuration = callLogs.length > 0 
    ? callLogs.reduce((sum, log) => sum + (log.callDuration || 0), 0) / callLogs.length 
    : 0;
  const successRate = totalCalls > 0 ? ((meetingsBooked + followUps) / totalCalls * 100) : 0;

  const headers = ['Metric', 'Value', 'Percentage'];
  const csvData = [
    { 'Metric': 'Total Calls', 'Value': totalCalls, 'Percentage': '100%' },
    { 'Metric': 'Meetings Booked', 'Value': meetingsBooked, 'Percentage': `${(meetingsBooked / Math.max(totalCalls, 1) * 100).toFixed(1)}%` },
    { 'Metric': 'Follow-ups Scheduled', 'Value': followUps, 'Percentage': `${(followUps / Math.max(totalCalls, 1) * 100).toFixed(1)}%` },
    { 'Metric': 'Nurture Prospects', 'Value': nurtures, 'Percentage': `${(nurtures / Math.max(totalCalls, 1) * 100).toFixed(1)}%` },
    { 'Metric': 'Success Rate (Meetings + Follow-ups)', 'Value': `${successRate.toFixed(1)}%`, 'Percentage': '-' },
    { 'Metric': 'Average Call Duration (minutes)', 'Value': `${(avgCallDuration / 60).toFixed(1)}`, 'Percentage': '-' },
    { 'Metric': 'Export Date', 'Value': format(new Date(), 'yyyy-MM-dd HH:mm:ss'), 'Percentage': '-' }
  ];

  const csv = convertToCSV(csvData, headers);
  downloadCSV(csv, `wolf-den-performance-${format(new Date(), 'yyyy-MM-dd')}.csv`);
};

// Export battle cards to CSV
export const exportBattleCardsToCSV = (battleCards: BattleCard[]): void => {
  const headers = [
    'Generated Date',
    'Lead Company',
    'Contact Name',
    'Industry',
    'Persona',
    'Selected Content Count',
    'Content Types',
    'Dynamic Intelligence Count'
  ];

  const csvData = battleCards.map(card => ({
    'Generated Date': format(new Date(card.generatedAt), 'yyyy-MM-dd HH:mm:ss'),
    'Lead Company': card.lead?.companyName || 'Unknown',
    'Contact Name': card.lead?.contactName || 'Unknown',
    'Industry': card.lead?.industry || 'Unknown',
    'Persona': card.lead?.persona || 'Unknown',
    'Selected Content Count': card.selectedContent.length,
    'Content Types': [...new Set(card.selectedContent.map(c => c.type))].join('; '),
    'Dynamic Intelligence Count': card.dynamicIntelligence.length
  }));

  const csv = convertToCSV(csvData, headers);
  downloadCSV(csv, `wolf-den-battle-cards-${format(new Date(), 'yyyy-MM-dd')}.csv`);
};

// Export complete dataset
export const exportCompleteDataset = (callLogs: CallLog[], battleCards: BattleCard[]): void => {
  // Create a comprehensive export with multiple sheets worth of data
  const timestamp = format(new Date(), 'yyyy-MM-dd-HHmm');
  
  // Export each dataset separately
  exportCallLogsToCSV(callLogs);
  exportPerformanceMetricsToCSV(callLogs);
  exportBattleCardsToCSV(battleCards);
  
  // Also create a summary file
  const summaryHeaders = ['Dataset', 'Records', 'Date Range', 'Export Time'];
  const summaryData = [
    {
      'Dataset': 'Call Logs',
      'Records': callLogs.length,
      'Date Range': callLogs.length > 0 
        ? `${format(new Date(Math.min(...callLogs.map(l => new Date(l.createdAt).getTime()))), 'yyyy-MM-dd')} to ${format(new Date(Math.max(...callLogs.map(l => new Date(l.createdAt).getTime()))), 'yyyy-MM-dd')}`
        : 'No data',
      'Export Time': format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    },
    {
      'Dataset': 'Battle Cards',
      'Records': battleCards.length,
      'Date Range': battleCards.length > 0 
        ? `${format(new Date(Math.min(...battleCards.map(b => new Date(b.generatedAt).getTime()))), 'yyyy-MM-dd')} to ${format(new Date(Math.max(...battleCards.map(b => new Date(b.generatedAt).getTime()))), 'yyyy-MM-dd')}`
        : 'No data',
      'Export Time': format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    }
  ];

  const summaryCsv = convertToCSV(summaryData, summaryHeaders);
  downloadCSV(summaryCsv, `wolf-den-export-summary-${timestamp}.csv`);
};

// Helper function to trigger CSV download
const downloadCSV = (csv: string, filename: string): void => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  downloadFile(blob, filename);
};

// Format duration helper
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Generate insights from call data
export const generateCallInsights = (callLogs: CallLog[]): string[] => {
  if (callLogs.length === 0) return ['No call data available for insights.'];

  const insights: string[] = [];
  const totalCalls = callLogs.length;
  const meetingsBooked = callLogs.filter(log => log.outcome === 'meeting-booked').length;
  const avgDuration = callLogs.reduce((sum, log) => sum + (log.callDuration || 0), 0) / totalCalls;

  if (meetingsBooked / totalCalls > 0.3) {
    insights.push('🎯 Excellent meeting booking rate! You\'re converting over 30% of calls.');
  } else if (meetingsBooked / totalCalls > 0.15) {
    insights.push('📈 Good meeting booking rate. Consider refining your closing techniques for even better results.');
  } else {
    insights.push('💡 Opportunity to improve meeting booking rate. Focus on stronger value propositions and closing techniques.');
  }

  if (avgDuration > 600) { // 10 minutes
    insights.push('⏰ Consider tightening your call structure - average duration is quite long.');
  } else if (avgDuration < 180) { // 3 minutes
    insights.push('🚀 Calls might be too short for proper relationship building. Try extending discovery phase.');
  }

  return insights;
};

// JSON Export Functions
export const exportToJSON = (callLogs: CallLog[], battleCards: BattleCard[]): void => {
  const exportData: ExportData = {
    callLogs,
    battleCards,
    performanceMetrics: calculatePerformanceMetrics(callLogs),
    exportVersion: '1.0',
    exportTimestamp: new Date().toISOString(),
    appVersion: 'W.O.L.F v1.0'
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
  const filename = `wolf-den-complete-backup-${format(new Date(), 'yyyy-MM-dd-HHmm')}.json`;
  
  downloadFile(blob, filename);
};

// Import Functions
export const importFromJSON = (fileContent: string): ImportResult => {
  try {
    const data = JSON.parse(fileContent) as ExportData;
    const validation = validateImportData(data);
    
    if (!validation.isValid) {
      return {
        success: false,
        message: 'Invalid data format',
        errors: validation.errors
      };
    }
    
    return {
      success: true,
      message: `Successfully imported ${data.callLogs.length} call logs and ${data.battleCards.length} battle cards`,
      data,
      errors: validation.warnings
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to parse JSON file',
      errors: [error instanceof Error ? error.message : 'Unknown error']
    };
  }
};

// Data Validation
const validateImportData = (data: unknown): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check required fields
  if (!data || typeof data !== 'object') {
    errors.push('Invalid data structure');
    return { isValid: false, errors, warnings };
  }
  
  const exportData = data as Record<string, unknown>;
  
  if (!Array.isArray(exportData.callLogs)) {
    errors.push('Call logs must be an array');
  }
  
  if (!Array.isArray(exportData.battleCards)) {
    errors.push('Battle cards must be an array');
  }
  
  // Validate call logs
  if (Array.isArray(exportData.callLogs)) {
    exportData.callLogs.forEach((log: Partial<CallLog>, index: number) => {
      if (!log.id || typeof log.id !== 'string') {
        errors.push(`Call log ${index + 1}: Missing or invalid ID`);
      }
      if (!log.leadId || typeof log.leadId !== 'string') {
        errors.push(`Call log ${index + 1}: Missing or invalid lead ID`);
      }
      if (!log.outcome || !['meeting-booked', 'nurture', 'disqualified', 'follow-up'].includes(log.outcome)) {
        errors.push(`Call log ${index + 1}: Invalid outcome`);
      }
      if (!log.createdAt) {
        errors.push(`Call log ${index + 1}: Missing creation date`);
      } else {
        try {
          new Date(log.createdAt);
        } catch {
          errors.push(`Call log ${index + 1}: Invalid date format`);
        }
      }
    });
  }
  
  // Validate battle cards
  if (Array.isArray(exportData.battleCards)) {
    exportData.battleCards.forEach((card: Partial<BattleCard>, index: number) => {
      if (!card.lead || typeof card.lead !== 'object') {
        errors.push(`Battle card ${index + 1}: Missing or invalid lead data`);
      }
      if (!Array.isArray(card.selectedContent)) {
        errors.push(`Battle card ${index + 1}: Selected content must be an array`);
      }
      if (!card.generatedAt) {
        errors.push(`Battle card ${index + 1}: Missing generation date`);
      }
    });
  }
  
  // Version compatibility check
  if (exportData.exportVersion && exportData.exportVersion !== '1.0') {
    warnings.push(`Data exported from version ${exportData.exportVersion}, compatibility not guaranteed`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Helper function to calculate performance metrics
const calculatePerformanceMetrics = (callLogs: CallLog[]): PerformanceMetrics => {
  const totalCalls = callLogs.length;
  const meetingsBooked = callLogs.filter(log => log.outcome === 'meeting-booked').length;
  const followUps = callLogs.filter(log => log.outcome === 'follow-up').length;
  const nurtures = callLogs.filter(log => log.outcome === 'nurture').length;
  const avgCallDuration = callLogs.length > 0 
    ? callLogs.reduce((sum, log) => sum + (log.callDuration || 0), 0) / callLogs.length 
    : 0;
  const successRate = totalCalls > 0 ? ((meetingsBooked + followUps) / totalCalls * 100) : 0;
  
  return {
    totalCalls,
    meetingsBooked,
    followUps,
    nurtures,
    successRate,
    avgCallDuration,
    exportDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
  };
};

// Enhanced download function
const downloadFile = (blob: Blob, filename: string): void => {
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

// File reading utility
export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('File reading error'));
    reader.readAsText(file);
  });
};

// Data migration utilities
export const migrateDataFormat = (data: unknown, fromVersion: string, toVersion: string): unknown => {
  // Future-proofing for data format changes
  if (fromVersion === toVersion) return data;
  
  // Add migration logic here as needed
  console.warn(`Data migration from ${fromVersion} to ${toVersion} not implemented`);
  return data;
};

// Backup validation
export const validateBackupFile = (file: File): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check file type
  if (!file.name.endsWith('.json')) {
    errors.push('File must be a JSON file');
  }
  
  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    errors.push('File size too large (max 10MB)');
  }
  
  // Check if file is empty
  if (file.size === 0) {
    errors.push('File is empty');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};