import jsPDF from 'jspdf';
import { Prospect, ContentItem } from '@/types';
import { personas } from '@/data/personas';
import { industries } from '@/data/industries';

interface PDFGenerationOptions {
  prospect: Prospect;
  selectedContent: ContentItem[];
  dynamicIntelligence?: any[];
  successPrediction?: {
    score: number;
    confidence: string;
    bestTimeToCall: {
      dayOfWeek: string;
      timeRange: string;
    };
    recommendations: string[];
  };
}

export const generateCallCardPDF = (options: PDFGenerationOptions): jsPDF => {
  const { prospect, selectedContent, successPrediction } = options;
  
  // Create new PDF document
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Page dimensions
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;
  
  // Helper functions
  const addText = (text: string, x: number, y: number, options: any = {}) => {
    pdf.text(text, x, y, options);
  };
  
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number): number => {
    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(lines, x, y);
    return lines.length * 5; // Return height used
  };
  
  const checkPageBreak = (neededSpace: number) => {
    if (yPosition + neededSpace > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }
  };
  
  // Get persona and industry data
  const selectedPersona = personas.find(p => p.id === prospect.persona);
  const selectedIndustry = industries.find(i => i.id === prospect.industry);
  
  // Header
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  addText('W.O.L.F Call Card', margin, yPosition);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(100);
  addText('Campbell & Co. Group Benefits', pageWidth - margin - 50, yPosition, { align: 'right' });
  
  yPosition += 10;
  
  // Divider line
  pdf.setDrawColor(165, 207, 76); // Primary color
  pdf.setLineWidth(0.5);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 5;
  
  // Lead Information Section
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0);
  addText('Lead Profile', margin, yPosition);
  yPosition += 7;
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  const leadInfo = [
    `Company: ${prospect.companyName}`,
    `Contact: ${prospect.contactName}`,
    `Industry: ${selectedIndustry?.name || prospect.industry}`,
    `Persona: ${selectedPersona?.title || prospect.persona}`
  ];
  
  leadInfo.forEach(info => {
    addText(info, margin, yPosition);
    yPosition += 5;
  });
  
  yPosition += 5;
  
  // Success Prediction (if available)
  if (successPrediction) {
    checkPageBreak(30);
    
    pdf.setFillColor(59, 130, 246); // Blue background
    pdf.rect(margin, yPosition - 4, contentWidth, 20, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    addText('Success Prediction', margin + 2, yPosition);
    
    pdf.setFont('helvetica', 'normal');
    addText(`Score: ${successPrediction.score}% (${successPrediction.confidence} confidence)`, margin + 2, yPosition + 5);
    addText(`Best Time: ${successPrediction.bestTimeToCall.dayOfWeek}, ${successPrediction.bestTimeToCall.timeRange}`, margin + 2, yPosition + 10);
    
    pdf.setTextColor(0);
    yPosition += 25;
  }
  
  // Key Pressures Section
  if (selectedPersona) {
    checkPageBreak(40);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    addText('Key Pressures', margin, yPosition);
    yPosition += 6;
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    
    selectedPersona.keyPressures.slice(0, 3).forEach(pressure => {
      pdf.setFillColor(165, 207, 76);
      pdf.circle(margin + 2, yPosition - 1, 1, 'F');
      const height = addWrappedText(pressure, margin + 6, yPosition, contentWidth - 6);
      yPosition += height + 2;
    });
    
    yPosition += 5;
  }
  
  // Their Language Section
  if (selectedPersona) {
    checkPageBreak(25);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    addText('Their Language', margin, yPosition);
    yPosition += 6;
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    
    const languageTerms = selectedPersona.language.slice(0, 8).join(' • ');
    addWrappedText(languageTerms, margin, yPosition, contentWidth);
    yPosition += 10;
  }
  
  // Red Flags Section
  if (selectedPersona) {
    checkPageBreak(30);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(220, 38, 38); // Red color
    addText('Red Flags to Avoid', margin, yPosition);
    yPosition += 6;
    
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    
    selectedPersona.redFlags.slice(0, 3).forEach(flag => {
      pdf.setFillColor(220, 38, 38);
      pdf.circle(margin + 2, yPosition - 1, 1, 'F');
      const height = addWrappedText(flag, margin + 6, yPosition, contentWidth - 6);
      yPosition += height + 2;
    });
    
    pdf.setTextColor(0);
    yPosition += 5;
  }
  
  // Selected Content Section
  if (selectedContent.length > 0) {
    checkPageBreak(20);
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    addText('Strategic Content', margin, yPosition);
    yPosition += 8;
    
    selectedContent.forEach((item) => {
      checkPageBreak(30);
      
      // Content type header
      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin, yPosition - 3, contentWidth, 6, 'F');
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(100);
      addText(item.type.replace('-', ' ').toUpperCase(), margin + 2, yPosition);
      yPosition += 7;
      
      // Content
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0);
      pdf.setFontSize(10);
      const contentHeight = addWrappedText(item.content, margin, yPosition, contentWidth);
      yPosition += contentHeight + 2;
      
      // Context (if available)
      if (item.context) {
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(100);
        const contextHeight = addWrappedText(`Context: ${item.context}`, margin, yPosition, contentWidth);
        yPosition += contextHeight + 2;
      }
      
      // Source (if available)
      if (item.source) {
        pdf.setFontSize(8);
        pdf.setTextColor(150);
        addText(`Source: ${item.source}`, margin, yPosition);
        yPosition += 4;
      }
      
      pdf.setTextColor(0);
      yPosition += 3;
    });
  }
  
  // Footer on last page
  pdf.setFontSize(8);
  pdf.setTextColor(150);
  const footerY = pageHeight - 10;
  addText('Campbell & Co. - Your Trusted Insurance Partner', margin, footerY);
  addText(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - margin - 30, footerY);
  
  return pdf;
};

// Generate filename based on prospect info
export const generatePDFFilename = (prospect: Prospect): string => {
  const date = new Date().toISOString().split('T')[0];
  const companyName = prospect.companyName.replace(/[^a-zA-Z0-9]/g, '_');
  const contactName = prospect.contactName.replace(/[^a-zA-Z0-9]/g, '_');
  
  return `WOLF_CallCard_${companyName}_${contactName}_${date}.pdf`;
};