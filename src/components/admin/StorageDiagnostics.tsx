import React, { useState, useEffect } from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { Database, Trash2 } from 'lucide-react';
import { localStorageService } from '@/services/localStorageService';
import { useAppStore } from '@/store';

const StorageDiagnostics: React.FC = () => {
  const [storageInfo, setStorageInfo] = useState<{
    sizeInBytes: number;
    sizeInKB: number;
    itemCounts: Record<string, number>;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  const loadStorageInfo = () => {
    const info = localStorageService.getStorageInfo();
    setStorageInfo(info);
  };

  useEffect(() => {
    loadStorageInfo();
  }, []);

  const runDiagnostics = async () => {
    setLoading(true);
    setTestResults([]);
    const results: string[] = [];

    // Test 1: Check if localStorage is available
    try {
      localStorage.setItem('wolf-den-test', 'test');
      localStorage.removeItem('wolf-den-test');
      results.push('✅ localStorage is available');
    } catch {
      results.push('❌ localStorage is not available');
    }

    // Test 2: Check storage quota
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        const usagePercentage = estimate.usage && estimate.quota 
          ? Math.round((estimate.usage / estimate.quota) * 100)
          : 0;
        results.push(`✅ Storage usage: ${usagePercentage}% of quota`);
        
        if (usagePercentage > 80) {
          results.push('⚠️ Warning: Storage usage is above 80%');
        }
      } else {
        results.push('ℹ️ Storage quota API not available');
      }
    } catch (error) {
      results.push('❌ Error checking storage quota');
    }

    // Test 3: Validate stored data
    try {
      const data = localStorageService.loadState();
      if (data) {
        results.push('✅ Stored data is valid and loadable');
        
        // Check for data integrity
        if (data.callLogs && Array.isArray(data.callLogs)) {
          results.push(`✅ Call logs: ${data.callLogs.length} items`);
        }
        if (data.callCards && Array.isArray(data.callCards)) {
          results.push(`✅ Call cards: ${data.callCards.length} items`);
        }
      } else {
        results.push('ℹ️ No stored data found');
      }
    } catch (error) {
      results.push('❌ Error loading stored data - may be corrupted');
    }

    // Test 4: Check for orphaned localStorage keys
    let orphanedKeys = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('wolf-den-') && 
          key !== 'wolf-den-storage' &&
          key !== 'wolf-den-search-config' &&
          !key.startsWith('wolf-den-call-notes-') &&
          key !== 'wolf-den-competitive-encounters' &&
          key !== 'wolf-den-competitive-intelligence') {
        orphanedKeys++;
      }
    }
    if (orphanedKeys > 0) {
      results.push(`⚠️ Found ${orphanedKeys} orphaned localStorage keys`);
    } else {
      results.push('✅ No orphaned localStorage keys found');
    }

    setTestResults(results);
    setLoading(false);
    loadStorageInfo();
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all stored data? This cannot be undone.')) {
      localStorageService.clearAll();
      // Clear other localStorage items
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('wolf-den-')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Reset store state
      useAppStore.getState().resetAll();
      
      loadStorageInfo();
      setTestResults(['✅ All data cleared successfully']);
    }
  };

  const exportData = () => {
    try {
      const data = localStorageService.loadState();
      const exportData = {
        exportDate: new Date().toISOString(),
        version: 1,
        data
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wolf-den-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setTestResults(['✅ Data exported successfully']);
    } catch (error) {
      setTestResults(['❌ Failed to export data']);
    }
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-6 h-6 text-gray-600" />
          <h2 className="text-xl font-semibold">Storage Diagnostics</h2>
        </div>

        {storageInfo && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Storage Usage</h3>
            <div className="space-y-1 text-sm">
              <p>Total size: {storageInfo.sizeInKB} KB ({storageInfo.sizeInBytes} bytes)</p>
              {Object.entries(storageInfo.itemCounts).map(([key, count]) => (
                <p key={key}>{key}: {count} items</p>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3 mb-6">
          <Button
            onClick={runDiagnostics}
            loading={loading}
            className="w-full"
          >
            Run Diagnostics
          </Button>
          
          <div className="flex gap-3">
            <Button
              onClick={exportData}
              variant="secondary"
              className="flex-1"
            >
              Export Data
            </Button>
            
            <Button
              onClick={clearAllData}
              variant="secondary"
              className="flex-1 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Data
            </Button>
          </div>
        </div>

        {testResults.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium mb-2">Test Results</h3>
            {testResults.map((result, index) => (
              <div key={index} className="text-sm">
                {result}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StorageDiagnostics;