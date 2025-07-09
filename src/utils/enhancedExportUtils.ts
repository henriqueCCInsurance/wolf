import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { CallLog, BattleCard } from '@/types';
import { 
  exportCallLogsToCSV, 
  exportBattleCardsToCSV,
  exportPerformanceMetricsToCSV,
  PerformanceMetrics
} from './exportUtils';

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

// Excel Export Functions
export const exportToExcel = async (
  data: any,
  dataType: 'calls' | 'battlecards' | 'analytics' | 'complete',
  filename: string
) => {
  const wb = XLSX.utils.book_new();
  
  // Set workbook properties
  wb.Props = {
    Title: "W.O.L.F. Den Export",
    Subject: "Sales Performance Data",
    Author: "Campbell & Co. Group Benefits",
    Company: "Campbell & Co.",
    CreatedDate: new Date()
  };

  switch (dataType) {
    case 'calls':
      addCallLogsSheet(wb, data.callLogs || []);
      addPerformanceSheet(wb, data.callLogs || []);
      break;
      
    case 'battlecards':
      addBattleCardsSheet(wb, data.battleCards || []);
      break;
      
    case 'analytics':
      addAnalyticsSheets(wb, data);
      break;
      
    case 'complete':
      // Add all sheets for complete export
      if (data.callLogs) addCallLogsSheet(wb, data.callLogs);
      if (data.battleCards) addBattleCardsSheet(wb, data.battleCards);
      if (data.callLogs) addPerformanceSheet(wb, data.callLogs);
      if (data.analytics) addAnalyticsSheets(wb, data);
      addSummarySheet(wb, data);
      break;
  }

  // Generate Excel file
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  downloadFile(blob, `${filename}-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
};

// Add Call Logs Sheet
const addCallLogsSheet = (wb: XLSX.WorkBook, callLogs: CallLog[]) => {
  const data = callLogs.map(log => ({
    'Date': format(new Date(log.createdAt), 'yyyy-MM-dd'),
    'Time': format(new Date(log.createdAt), 'HH:mm:ss'),
    'Company': log.leadId,
    'Contact': log.contactId || '',
    'Outcome': log.outcome,
    'Duration (min)': log.callDuration ? Math.round(log.callDuration / 60 * 100) / 100 : 0,
    'Attempt #': log.attemptNumber || 1,
    'Intelligence': log.intel,
    'Best Talking Point': log.bestTalkingPoint,
    'Key Takeaway': log.keyTakeaway,
    'Next Steps': log.additionalInfo?.nextSteps || '',
    'Meeting Type': log.additionalInfo?.meetingType || '',
    'Follow-up Date': log.additionalInfo?.followUpDate || '',
    'New Contacts': log.additionalInfo?.newContacts || '',
    'Referrals': log.additionalInfo?.referrals || '',
    'Company Insights': log.additionalInfo?.companyInsights || ''
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  
  // Style the header row
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const address = XLSX.utils.encode_col(C) + "1";
    if (!ws[address]) continue;
    ws[address].s = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "7CA832" } },
      alignment: { horizontal: "center" }
    };
  }

  // Auto-size columns
  const colWidths = [
    { wch: 12 }, // Date
    { wch: 10 }, // Time
    { wch: 20 }, // Company
    { wch: 20 }, // Contact
    { wch: 15 }, // Outcome
    { wch: 12 }, // Duration
    { wch: 10 }, // Attempt
    { wch: 40 }, // Intelligence
    { wch: 30 }, // Best Talking Point
    { wch: 30 }, // Key Takeaway
    { wch: 30 }, // Next Steps
    { wch: 15 }, // Meeting Type
    { wch: 15 }, // Follow-up Date
    { wch: 20 }, // New Contacts
    { wch: 20 }, // Referrals
    { wch: 30 }  // Company Insights
  ];
  ws['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(wb, ws, "Call Logs");
};

// Add Performance Metrics Sheet
const addPerformanceSheet = (wb: XLSX.WorkBook, callLogs: CallLog[]) => {
  const metrics = calculatePerformanceMetrics(callLogs);
  
  // Create performance summary
  const summaryData = [
    { Metric: 'Total Calls', Value: metrics.totalCalls, Target: 100, 'Performance %': (metrics.totalCalls / 100 * 100).toFixed(1) + '%' },
    { Metric: 'Meetings Booked', Value: metrics.meetingsBooked, Target: 20, 'Performance %': (metrics.meetingsBooked / 20 * 100).toFixed(1) + '%' },
    { Metric: 'Follow-ups Scheduled', Value: metrics.followUps, Target: 30, 'Performance %': (metrics.followUps / 30 * 100).toFixed(1) + '%' },
    { Metric: 'Success Rate', Value: metrics.successRate.toFixed(1) + '%', Target: '25%', 'Performance %': (metrics.successRate / 25 * 100).toFixed(1) + '%' },
    { Metric: 'Avg Call Duration', Value: (metrics.avgCallDuration / 60).toFixed(1) + ' min', Target: '8 min', 'Performance %': '-' }
  ];

  const ws = XLSX.utils.json_to_sheet(summaryData);
  
  // Style the sheet
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
  
  // Header styling
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const address = XLSX.utils.encode_col(C) + "1";
    if (!ws[address]) continue;
    ws[address].s = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "A5CF4C" } },
      alignment: { horizontal: "center" }
    };
  }

  ws['!cols'] = [
    { wch: 25 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 }
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Performance Metrics");
};

// Add Battle Cards Sheet
const addBattleCardsSheet = (wb: XLSX.WorkBook, battleCards: BattleCard[]) => {
  const data = battleCards.map(card => ({
    'Generated Date': format(new Date(card.generatedAt), 'yyyy-MM-dd HH:mm'),
    'Company': card.lead?.companyName || '',
    'Contact': card.lead?.contactName || '',
    'Industry': card.lead?.industry || '',
    'Persona': card.lead?.persona || '',
    'Content Items': card.selectedContent.length,
    'Content Types': [...new Set(card.selectedContent.map(c => c.type))].join(', '),
    'Dynamic Intel': card.dynamicIntelligence.length,
    'Key Topics': card.selectedContent.slice(0, 3).map(c => c.content.substring(0, 50)).join('; ')
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  
  // Style header
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const address = XLSX.utils.encode_col(C) + "1";
    if (!ws[address]) continue;
    ws[address].s = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "2C3E50" } },
      alignment: { horizontal: "center" }
    };
  }

  ws['!cols'] = [
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 15 },
    { wch: 20 },
    { wch: 15 },
    { wch: 25 },
    { wch: 15 },
    { wch: 40 }
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Battle Cards");
};

// Add Analytics Sheets
const addAnalyticsSheets = (wb: XLSX.WorkBook, data: any) => {
  // Add various analytics sheets based on available data
  if (data.analytics?.callsByDay) {
    const ws = XLSX.utils.json_to_sheet(data.analytics.callsByDay);
    XLSX.utils.book_append_sheet(wb, ws, "Daily Activity");
  }

  if (data.analytics?.personaPerformance) {
    const ws = XLSX.utils.json_to_sheet(data.analytics.personaPerformance);
    XLSX.utils.book_append_sheet(wb, ws, "Persona Performance");
  }

  if (data.analytics?.industryPerformance) {
    const ws = XLSX.utils.json_to_sheet(data.analytics.industryPerformance);
    XLSX.utils.book_append_sheet(wb, ws, "Industry Performance");
  }
};

// Add Summary Sheet
const addSummarySheet = (wb: XLSX.WorkBook, data: any) => {
  const summaryData = [
    { Category: 'Export Information', Detail: '', Value: '' },
    { Category: 'Export Date', Detail: format(new Date(), 'MMMM dd, yyyy'), Value: format(new Date(), 'HH:mm:ss') },
    { Category: 'Organization', Detail: 'Campbell & Co. Group Benefits', Value: '' },
    { Category: 'System', Detail: 'W.O.L.F. Den Sales Enablement', Value: 'v1.2.0' },
    { Category: '', Detail: '', Value: '' },
    { Category: 'Data Summary', Detail: '', Value: '' },
    { Category: 'Total Call Logs', Detail: (data.callLogs?.length || 0).toString(), Value: '' },
    { Category: 'Total Battle Cards', Detail: (data.battleCards?.length || 0).toString(), Value: '' },
    { Category: 'Date Range', Detail: getDateRange(data.callLogs || []), Value: '' },
    { Category: '', Detail: '', Value: '' },
    { Category: 'Performance Highlights', Detail: '', Value: '' },
    { Category: 'Success Rate', Detail: getSuccessRate(data.callLogs || []), Value: '' },
    { Category: 'Top Performer', Detail: data.teamData?.topPerformer?.name || 'N/A', Value: data.teamData?.topPerformer?.successRate ? `${data.teamData.topPerformer.successRate}%` : '' }
  ];

  const ws = XLSX.utils.json_to_sheet(summaryData);
  
  // Style categories
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
  for (let R = range.s.r; R <= range.e.r; ++R) {
    const categoryCell = XLSX.utils.encode_cell({ r: R, c: 0 });
    if (ws[categoryCell]?.v && ['Export Information', 'Data Summary', 'Performance Highlights'].includes(ws[categoryCell].v)) {
      ws[categoryCell].s = {
        font: { bold: true, sz: 14 },
        fill: { fgColor: { rgb: "F8F9FA" } }
      };
    }
  }

  ws['!cols'] = [{ wch: 25 }, { wch: 35 }, { wch: 20 }];

  XLSX.utils.book_append_sheet(wb, ws, "Summary", true); // Add as first sheet
};

// PDF Export Functions
export const exportToPDF = async (
  data: any,
  dataType: 'calls' | 'battlecards' | 'analytics' | 'complete',
  filename: string
) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Add Campbell & Co. branding
  addPDFHeader(pdf);

  let yPosition = 40;

  switch (dataType) {
    case 'calls':
      yPosition = addCallLogsPDF(pdf, data.callLogs || [], yPosition);
      addPageNumbers(pdf);
      break;
      
    case 'battlecards':
      yPosition = addBattleCardsPDF(pdf, data.battleCards || [], yPosition);
      addPageNumbers(pdf);
      break;
      
    case 'analytics':
      yPosition = addAnalyticsPDF(pdf, data, yPosition);
      addPageNumbers(pdf);
      break;
      
    case 'complete':
      // Executive Summary
      yPosition = addExecutiveSummaryPDF(pdf, data, yPosition);
      
      // Add sections with page breaks
      if (data.callLogs?.length > 0) {
        pdf.addPage();
        yPosition = 40;
        addPDFHeader(pdf);
        yPosition = addCallLogsPDF(pdf, data.callLogs, yPosition);
      }
      
      if (data.battleCards?.length > 0) {
        pdf.addPage();
        yPosition = 40;
        addPDFHeader(pdf);
        yPosition = addBattleCardsPDF(pdf, data.battleCards, yPosition);
      }
      
      if (data.analytics) {
        pdf.addPage();
        yPosition = 40;
        addPDFHeader(pdf);
        yPosition = addAnalyticsPDF(pdf, data, yPosition);
      }
      
      addPageNumbers(pdf);
      break;
  }

  pdf.save(`${filename}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

// PDF Helper Functions
const addPDFHeader = (pdf: jsPDF) => {
  // Campbell & Co. branding
  pdf.setFillColor(165, 207, 76); // Brand primary color
  pdf.rect(0, 0, 210, 25, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('W.O.L.F. Den Sales Report', 15, 15);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Campbell & Co. Group Benefits', 15, 20);
  
  pdf.setTextColor(0, 0, 0);
};

const addCallLogsPDF = (pdf: jsPDF, callLogs: CallLog[], startY: number): number => {
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Call Activity Report', 15, startY);
  
  let y = startY + 10;
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  // Summary stats
  const metrics = calculatePerformanceMetrics(callLogs);
  pdf.text(`Total Calls: ${metrics.totalCalls}`, 15, y);
  pdf.text(`Success Rate: ${metrics.successRate.toFixed(1)}%`, 70, y);
  pdf.text(`Meetings Booked: ${metrics.meetingsBooked}`, 125, y);
  
  y += 15;
  
  // Recent calls table
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Recent Call Activity', 15, y);
  
  y += 8;
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  
  // Table headers
  pdf.setFont('helvetica', 'bold');
  pdf.text('Date', 15, y);
  pdf.text('Company', 40, y);
  pdf.text('Outcome', 90, y);
  pdf.text('Duration', 130, y);
  pdf.text('Key Takeaway', 155, y);
  
  y += 5;
  pdf.setLineWidth(0.5);
  pdf.line(15, y, 195, y);
  
  y += 5;
  pdf.setFont('helvetica', 'normal');
  
  // Add up to 10 recent calls
  const recentCalls = callLogs.slice(0, 10);
  recentCalls.forEach(log => {
    if (y > 270) {
      pdf.addPage();
      addPDFHeader(pdf);
      y = 40;
    }
    
    pdf.text(format(new Date(log.createdAt), 'MM/dd'), 15, y);
    pdf.text(log.leadId.substring(0, 20), 40, y);
    pdf.text(log.outcome.replace('-', ' '), 90, y);
    pdf.text(`${Math.round((log.callDuration || 0) / 60)}m`, 130, y);
    
    // Wrap text for key takeaway
    const takeaway = log.keyTakeaway.substring(0, 40) + (log.keyTakeaway.length > 40 ? '...' : '');
    pdf.text(takeaway, 155, y);
    
    y += 7;
  });
  
  return y + 10;
};

const addBattleCardsPDF = (pdf: jsPDF, battleCards: BattleCard[], startY: number): number => {
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Battle Cards Generated', 15, startY);
  
  let y = startY + 10;
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Total Battle Cards: ${battleCards.length}`, 15, y);
  
  y += 10;
  
  // Recent battle cards
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Recent Battle Cards', 15, y);
  
  y += 8;
  
  const recentCards = battleCards.slice(0, 5);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  
  recentCards.forEach(card => {
    if (y > 270) {
      pdf.addPage();
      addPDFHeader(pdf);
      y = 40;
    }
    
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${card.lead?.companyName || 'Unknown'} - ${card.lead?.contactName || 'Unknown'}`, 15, y);
    pdf.setFont('helvetica', 'normal');
    
    y += 5;
    pdf.text(`Industry: ${card.lead?.industry || 'N/A'} | Persona: ${card.lead?.persona || 'N/A'}`, 20, y);
    
    y += 5;
    pdf.text(`Generated: ${format(new Date(card.generatedAt), 'MMM dd, yyyy')} | Content Items: ${card.selectedContent.length}`, 20, y);
    
    y += 8;
  });
  
  return y + 10;
};

const addAnalyticsPDF = (pdf: jsPDF, data: any, startY: number): number => {
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Performance Analytics', 15, startY);
  
  let y = startY + 10;
  
  if (data.analytics?.outcomeDistribution) {
    pdf.setFontSize(12);
    pdf.text('Call Outcome Distribution', 15, y);
    
    y += 8;
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    
    data.analytics.outcomeDistribution.forEach((outcome: any) => {
      pdf.text(`${outcome.name}: ${outcome.value}%`, 20, y);
      y += 5;
    });
  }
  
  y += 10;
  
  if (data.analytics?.personaPerformance) {
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Performance by Persona', 15, y);
    
    y += 8;
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    
    data.analytics.personaPerformance.forEach((persona: any) => {
      pdf.text(`${persona.persona}: ${persona.successRate}% success (${persona.calls} calls)`, 20, y);
      y += 5;
    });
  }
  
  return y + 10;
};

const addExecutiveSummaryPDF = (pdf: jsPDF, data: any, startY: number): number => {
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Executive Summary', 15, startY);
  
  let y = startY + 12;
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  const metrics = calculatePerformanceMetrics(data.callLogs || []);
  
  // Key metrics box
  pdf.setFillColor(248, 249, 250);
  pdf.rect(15, y, 180, 40, 'F');
  
  y += 10;
  pdf.text(`Reporting Period: ${getDateRange(data.callLogs || [])}`, 20, y);
  
  y += 8;
  pdf.text(`Total Sales Activity: ${metrics.totalCalls} calls`, 20, y);
  pdf.text(`Success Rate: ${metrics.successRate.toFixed(1)}%`, 100, y);
  
  y += 8;
  pdf.text(`Meetings Booked: ${metrics.meetingsBooked}`, 20, y);
  pdf.text(`Follow-ups: ${metrics.followUps}`, 100, y);
  
  y += 8;
  pdf.text(`Battle Cards Generated: ${data.battleCards?.length || 0}`, 20, y);
  
  y += 20;
  
  // Key insights
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Key Insights', 15, y);
  
  y += 8;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  const insights = generateInsights(data);
  insights.forEach(insight => {
    if (y > 260) {
      pdf.addPage();
      addPDFHeader(pdf);
      y = 40;
    }
    
    const lines = pdf.splitTextToSize(`• ${insight}`, 170);
    lines.forEach((line: string) => {
      pdf.text(line, 20, y);
      y += 5;
    });
    y += 3;
  });
  
  return y + 10;
};

const addPageNumbers = (pdf: jsPDF) => {
  const pageCount = pdf.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(9);
    pdf.setTextColor(128, 128, 128);
    pdf.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
    pdf.text(format(new Date(), 'MMM dd, yyyy'), 195, 285, { align: 'right' });
  }
};

// CSV Export (reuse existing functions)
export const exportToCSV = async (
  data: any,
  dataType: 'calls' | 'battlecards' | 'analytics' | 'complete',
  _filename: string
) => {
  switch (dataType) {
    case 'calls':
      exportCallLogsToCSV(data.callLogs || []);
      break;
    case 'battlecards':
      exportBattleCardsToCSV(data.battleCards || []);
      break;
    case 'analytics':
      exportPerformanceMetricsToCSV(data.callLogs || []);
      break;
    case 'complete':
      // Export multiple CSV files
      if (data.callLogs) exportCallLogsToCSV(data.callLogs);
      if (data.battleCards) exportBattleCardsToCSV(data.battleCards);
      if (data.callLogs) exportPerformanceMetricsToCSV(data.callLogs);
      break;
  }
};

// JSON Export
export const exportToJSON = async (
  data: any,
  dataType: string,
  _filename: string
) => {
  const exportData = {
    exportType: dataType,
    exportDate: new Date().toISOString(),
    version: '2.0',
    organization: 'Campbell & Co. Group Benefits',
    data: data
  };
  
  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  downloadFile(blob, `${_filename}-${format(new Date(), 'yyyy-MM-dd')}.json`);
};

// Helper Functions
const getDateRange = (callLogs: CallLog[]): string => {
  if (callLogs.length === 0) return 'No data';
  
  const dates = callLogs.map(log => new Date(log.createdAt).getTime());
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));
  
  return `${format(minDate, 'MMM dd, yyyy')} - ${format(maxDate, 'MMM dd, yyyy')}`;
};

const getSuccessRate = (callLogs: CallLog[]): string => {
  if (callLogs.length === 0) return '0%';
  
  const successful = callLogs.filter(log => 
    log.outcome === 'meeting-booked' || log.outcome === 'follow-up'
  ).length;
  
  return `${((successful / callLogs.length) * 100).toFixed(1)}%`;
};

const generateInsights = (data: any): string[] => {
  const insights: string[] = [];
  const callLogs = data.callLogs || [];
  const battleCards = data.battleCards || [];
  
  if (callLogs.length > 0) {
    const metrics = calculatePerformanceMetrics(callLogs);
    
    if (metrics.successRate > 30) {
      insights.push('Outstanding performance with success rate exceeding 30%');
    } else if (metrics.successRate > 20) {
      insights.push('Solid performance with healthy conversion rates');
    } else {
      insights.push('Opportunity to improve conversion rates through enhanced targeting');
    }
    
    if (metrics.avgCallDuration > 900) { // 15 minutes
      insights.push('Long call durations indicate strong engagement but may impact volume');
    } else if (metrics.avgCallDuration < 300) { // 5 minutes
      insights.push('Short call durations suggest efficiency but may need deeper discovery');
    }
  }
  
  if (battleCards.length > 0) {
    const avgContentItems = battleCards.reduce((sum: number, card: BattleCard) => 
      sum + card.selectedContent.length, 0
    ) / battleCards.length;
    
    if (avgContentItems > 5) {
      insights.push('High battle card utilization shows strong preparation habits');
    }
  }
  
  if (data.analytics?.topPerformer) {
    insights.push(`${data.analytics.topPerformer.name} leads the team with ${data.analytics.topPerformer.successRate}% success rate`);
  }
  
  return insights.length > 0 ? insights : ['Insufficient data for detailed insights'];
};

const downloadFile = (blob: Blob, filename: string) => {
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};