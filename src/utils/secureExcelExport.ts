/**
 * Secure Excel export without vulnerable xlsx dependency
 * Uses CSV format with Excel-compatible formatting
 */

import { format } from 'date-fns';
import { CallLog, CallCard } from '@/types';

/**
 * Export data to Excel-compatible CSV format
 */
export function exportToExcelCSV(
  data: any[],
  columns: { key: string; label: string }[],
  filename: string
): void {
  // Create CSV content with proper escaping
  const headers = columns.map(col => escapeCSVValue(col.label)).join(',');
  
  const rows = data.map(item => {
    return columns.map(col => {
      const value = getNestedValue(item, col.key);
      return escapeCSVValue(formatValue(value));
    }).join(',');
  });
  
  const csvContent = [headers, ...rows].join('\n');
  
  // Add BOM for Excel to recognize UTF-8
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Download file
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Escape CSV values to prevent injection
 */
function escapeCSVValue(value: string): string {
  if (value == null) return '';
  
  // Convert to string
  const str = String(value);
  
  // Prevent formula injection
  if (str.startsWith('=') || str.startsWith('+') || str.startsWith('-') || str.startsWith('@')) {
    return `'${str}`;
  }
  
  // Escape quotes and wrap in quotes if contains special characters
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  
  return str;
}

/**
 * Get nested object value by path
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, prop) => current?.[prop], obj);
}

/**
 * Format value for display
 */
function formatValue(value: any): string {
  if (value == null) return '';
  if (value instanceof Date) return format(value, 'yyyy-MM-dd HH:mm:ss');
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

/**
 * Export call logs to Excel-compatible format
 */
export function exportCallLogsToExcel(callLogs: CallLog[], filename: string = 'call-logs'): void {
  const columns = [
    { key: 'createdAt', label: 'Date' },
    { key: 'leadId', label: 'Lead ID' },
    { key: 'outcome', label: 'Outcome' },
    { key: 'callDuration', label: 'Duration (min)' },
    { key: 'bestTalkingPoint', label: 'Best Talking Point' },
    { key: 'keyTakeaway', label: 'Key Takeaway' },
    { key: 'intel', label: 'Intelligence Gathered' },
    { key: 'attemptNumber', label: 'Attempt #' }
  ];
  
  const formattedData = callLogs.map(log => ({
    ...log,
    createdAt: log.createdAt ? format(new Date(log.createdAt), 'yyyy-MM-dd HH:mm') : '',
    callDuration: log.callDuration ? Math.round(log.callDuration / 60) : 0
  }));
  
  exportToExcelCSV(formattedData, columns, filename);
}

/**
 * Export battle cards to Excel-compatible format
 */
export function exportBattleCardsToExcel(battleCards: CallCard[], filename: string = 'battle-cards'): void {
  const columns = [
    { key: 'generatedAt', label: 'Generated Date' },
    { key: 'lead.companyName', label: 'Company' },
    { key: 'lead.contactName', label: 'Contact' },
    { key: 'lead.industry', label: 'Industry' },
    { key: 'lead.persona', label: 'Persona' },
    { key: 'contentCount', label: 'Content Items' },
    { key: 'hasIntelligence', label: 'Has Intelligence' }
  ];
  
  const formattedData = battleCards.map(card => ({
    ...card,
    generatedAt: card.generatedAt ? format(new Date(card.generatedAt), 'yyyy-MM-dd HH:mm') : '',
    contentCount: card.selectedContent?.length || 0,
    hasIntelligence: card.dynamicIntelligence && card.dynamicIntelligence.length > 0
  }));
  
  exportToExcelCSV(formattedData, columns, filename);
}

/**
 * Export performance summary to Excel-compatible format
 */
export function exportPerformanceSummaryToExcel(
  callLogs: CallLog[],
  battleCards: CallCard[],
  filename: string = 'performance-summary'
): void {
  const totalCalls = callLogs.length;
  const meetingsBooked = callLogs.filter(log => log.outcome === 'meeting-booked').length;
  const followUps = callLogs.filter(log => log.outcome === 'follow-up').length;
  const avgDuration = totalCalls > 0
    ? callLogs.reduce((sum, log) => sum + (log.callDuration || 0), 0) / totalCalls / 60
    : 0;
  
  const summaryData = [
    { metric: 'Total Calls', value: totalCalls },
    { metric: 'Meetings Booked', value: meetingsBooked },
    { metric: 'Follow-ups Scheduled', value: followUps },
    { metric: 'Success Rate', value: `${totalCalls > 0 ? ((meetingsBooked / totalCalls) * 100).toFixed(1) : 0}%` },
    { metric: 'Average Call Duration', value: `${avgDuration.toFixed(1)} minutes` },
    { metric: 'Battle Cards Created', value: battleCards.length },
    { metric: 'Export Date', value: format(new Date(), 'yyyy-MM-dd HH:mm:ss') }
  ];
  
  const columns = [
    { key: 'metric', label: 'Metric' },
    { key: 'value', label: 'Value' }
  ];
  
  exportToExcelCSV(summaryData, columns, filename);
}