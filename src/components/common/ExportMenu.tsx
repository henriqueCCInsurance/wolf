import React, { useState } from 'react';
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  FileJson,
  CheckCircle,
  Loader2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import { CallLog, BattleCard } from '@/types';
import { 
  exportToExcel,
  exportToPDF,
  exportToJSON as exportJSON,
  exportToCSV
} from '@/utils/enhancedExportUtils';

export type ExportFormat = 'excel' | 'pdf' | 'csv' | 'json';

export interface ExportOptions {
  format: ExportFormat;
  includeCharts?: boolean;
  includeSummary?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

interface ExportMenuProps {
  data: {
    callLogs?: CallLog[];
    battleCards?: BattleCard[];
    teamData?: any;
    analytics?: any;
    callSequence?: any;
    contacts?: any;
    [key: string]: any;
  };
  dataType: 'calls' | 'battlecards' | 'analytics' | 'complete';
  filename?: string;
  onExportComplete?: (format: ExportFormat) => void;
  className?: string;
}

const ExportMenu: React.FC<ExportMenuProps> = ({
  data,
  dataType,
  filename = 'wolf-den-export',
  onExportComplete,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat | null>(null);

  const exportFormats = [
    {
      format: 'excel' as ExportFormat,
      label: 'Excel (.xlsx)',
      description: 'Professional spreadsheet with formatting',
      icon: FileSpreadsheet,
      color: 'text-green-600'
    },
    {
      format: 'pdf' as ExportFormat,
      label: 'PDF Report',
      description: 'Executive-ready document with branding',
      icon: FileText,
      color: 'text-red-600'
    },
    {
      format: 'csv' as ExportFormat,
      label: 'CSV File',
      description: 'Simple data for analysis tools',
      icon: FileSpreadsheet,
      color: 'text-blue-600'
    },
    {
      format: 'json' as ExportFormat,
      label: 'JSON Data',
      description: 'Complete data for API integration',
      icon: FileJson,
      color: 'text-purple-600'
    }
  ];

  const handleExport = async (format: ExportFormat) => {
    setExporting(true);
    setSelectedFormat(format);

    try {
      switch (format) {
        case 'excel':
          await exportToExcel(data, dataType, filename);
          break;
        case 'pdf':
          await exportToPDF(data, dataType, filename);
          break;
        case 'csv':
          await exportToCSV(data, dataType, filename);
          break;
        case 'json':
          await exportJSON(data, dataType, filename);
          break;
      }

      setExportSuccess(true);
      onExportComplete?.(format);

      // Show success state for 2 seconds
      setTimeout(() => {
        setExportSuccess(false);
        setSelectedFormat(null);
        setIsOpen(false);
      }, 2000);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="secondary"
        className="flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        Export
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Export Options
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Choose your preferred export format
                </p>
              </div>

              <div className="p-2">
                {exportFormats.map((format) => {
                  const Icon = format.icon;
                  const isSelected = selectedFormat === format.format;
                  const isExportingThis = isSelected && exporting;
                  const isSuccessThis = isSelected && exportSuccess;

                  return (
                    <motion.button
                      key={format.format}
                      onClick={() => handleExport(format.format)}
                      disabled={exporting}
                      className={`
                        w-full p-3 rounded-lg text-left transition-all
                        ${exporting && !isSelected ? 'opacity-50' : ''}
                        ${isSelected ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-300' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}
                        border border-transparent
                      `}
                      whileHover={{ scale: exporting ? 1 : 1.02 }}
                      whileTap={{ scale: exporting ? 1 : 0.98 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 ${format.color}`}>
                          {isExportingThis ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : isSuccessThis ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Icon className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {format.label}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {isSuccessThis ? 'Export complete!' : format.description}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                  All exports include Campbell & Co. branding
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExportMenu;