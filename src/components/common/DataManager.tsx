import React, { useState, useRef } from 'react';
import { Download, Upload, FileText, AlertCircle, CheckCircle, X, Database, Shield, Settings } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import SearchConfiguration from './SearchConfiguration';
import { useAppStore } from '@/store';
import { 
  exportToJSON, 
  exportCallLogsToCSV, 
  exportPerformanceMetricsToCSV, 
  exportBattleCardsToCSV,
  exportCompleteDataset,
  importFromJSON,
  readFileAsText,
  validateBackupFile,
  ImportResult
} from '@/utils/exportUtils';

interface DataManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const DataManager: React.FC<DataManagerProps> = ({ isOpen, onClose }) => {
  const { callLogs, battleCards, addCallLog, addBattleCard } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showImportResult, setShowImportResult] = useState(false);
  const [showSearchConfig, setShowSearchConfig] = useState(false);

  if (!isOpen) return null;

  const handleExportJSON = () => {
    exportToJSON(callLogs, battleCards);
  };

  const handleExportCSV = (type: 'calls' | 'performance' | 'battlecards' | 'complete') => {
    switch (type) {
      case 'calls':
        exportCallLogsToCSV(callLogs);
        break;
      case 'performance':
        exportPerformanceMetricsToCSV(callLogs);
        break;
      case 'battlecards':
        exportBattleCardsToCSV(battleCards);
        break;
      case 'complete':
        exportCompleteDataset(callLogs, battleCards);
        break;
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateBackupFile(file);
    if (!validation.isValid) {
      setImportResult({
        success: false,
        message: 'Invalid file',
        errors: validation.errors
      });
      setShowImportResult(true);
      return;
    }

    setImporting(true);
    
    try {
      const fileContent = await readFileAsText(file);
      const result = importFromJSON(fileContent);
      
      if (result.success && result.data) {
        // Import successful - add data to store
        result.data.callLogs.forEach(log => addCallLog(log));
        result.data.battleCards.forEach(card => addBattleCard(card));
      }
      
      setImportResult(result);
      setShowImportResult(true);
    } catch (error) {
      setImportResult({
        success: false,
        message: 'Failed to import file',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      });
      setShowImportResult(true);
    } finally {
      setImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const closeImportResult = () => {
    setShowImportResult(false);
    setImportResult(null);
  };

  const totalRecords = callLogs.length + battleCards.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Database className="w-6 h-6 text-primary-500" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Data Management</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Data Overview */}
          <Card className="mb-6">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-500" />
                Current Data Summary
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary-500">{callLogs.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Call Logs</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-500">{battleCards.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Battle Cards</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-500">{totalRecords}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Total Records</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Export Section */}
          <Card className="mb-6">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Download className="w-5 h-5 mr-2 text-green-500" />
                Export Data
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">Complete Backup (JSON)</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Full data backup for importing later</div>
                  </div>
                  <Button
                    onClick={handleExportJSON}
                    variant="outline"
                    size="sm"
                    disabled={totalRecords === 0}
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    Export JSON
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">Call Logs (CSV)</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Detailed call history for analysis</div>
                  </div>
                  <Button
                    onClick={() => handleExportCSV('calls')}
                    variant="outline"
                    size="sm"
                    disabled={callLogs.length === 0}
                  >
                    Export CSV
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">Performance Metrics (CSV)</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Success rates and analytics</div>
                  </div>
                  <Button
                    onClick={() => handleExportCSV('performance')}
                    variant="outline"
                    size="sm"
                    disabled={callLogs.length === 0}
                  >
                    Export CSV
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">Battle Cards (CSV)</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Generated battle card history</div>
                  </div>
                  <Button
                    onClick={() => handleExportCSV('battlecards')}
                    variant="outline"
                    size="sm"
                    disabled={battleCards.length === 0}
                  >
                    Export CSV
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg border border-primary-200">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100 text-primary-700">Complete Dataset (All CSV)</div>
                    <div className="text-sm text-primary-600">All data in separate CSV files</div>
                  </div>
                  <Button
                    onClick={() => handleExportCSV('complete')}
                    variant="primary"
                    size="sm"
                    disabled={totalRecords === 0}
                  >
                    Export All
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Search Configuration Section */}
          <Card className="mb-6">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-purple-500" />
                Search Configuration
              </h3>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100 text-purple-700">Web Search Settings</div>
                  <div className="text-sm text-purple-600">Configure real-time industry intelligence sources</div>
                </div>
                <Button
                  onClick={() => setShowSearchConfig(true)}
                  variant="outline"
                  size="sm"
                >
                  <Settings className="w-4 h-4 mr-1" />
                  Configure
                </Button>
              </div>
            </div>
          </Card>

          {/* Import Section */}
          <Card>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Upload className="w-5 h-5 mr-2 text-blue-500" />
                Import Data
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center mb-2">
                    <AlertCircle className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="font-medium text-gray-900 dark:text-gray-100 text-blue-700">Import Guidelines</span>
                  </div>
                  <ul className="text-sm text-blue-600 space-y-1">
                    <li>• Only JSON backup files are supported for import</li>
                    <li>• Imported data will be added to existing data (not replaced)</li>
                    <li>• Maximum file size: 10MB</li>
                    <li>• Data will be validated before import</li>
                  </ul>
                </div>

                <div className="flex items-center justify-center">
                  <Button
                    onClick={handleImportClick}
                    variant="outline"
                    disabled={importing}
                    className="flex items-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{importing ? 'Importing...' : 'Select Backup File'}</span>
                  </Button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Import Result Modal */}
      {showImportResult && importResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {importResult.success ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-500" />
                  )}
                  <h3 className="text-lg font-semibold">
                    {importResult.success ? 'Import Successful' : 'Import Failed'}
                  </h3>
                </div>
                <button
                  onClick={closeImportResult}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 mb-2">{importResult.message}</p>
                
                {importResult.errors && importResult.errors.length > 0 && (
                  <div className="mt-3">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 text-red-700 mb-2">
                      {importResult.success ? 'Warnings:' : 'Errors:'}
                    </h4>
                    <ul className="text-sm text-red-600 space-y-1">
                      {importResult.errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button onClick={closeImportResult} variant="primary">
                  OK
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Configuration Modal */}
      <SearchConfiguration 
        isOpen={showSearchConfig} 
        onClose={() => setShowSearchConfig(false)} 
      />
    </div>
  );
};

export default DataManager;