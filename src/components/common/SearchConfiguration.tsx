import React, { useState, useEffect } from 'react';
import { Settings, Key, Globe, CheckCircle, AlertCircle, X, Eye, EyeOff } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import { EnhancedWebSearchService } from '@/services/enhancedWebSearch';

interface SearchConfigurationProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchConfig {
  provider: 'google' | 'bing' | 'serpapi' | 'mock';
  apiKey: string;
  searchEngineId: string;
  maxResults: number;
  timeout: number;
}

const SearchConfiguration: React.FC<SearchConfigurationProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<SearchConfig>({
    provider: 'mock',
    apiKey: '',
    searchEngineId: '',
    maxResults: 10,
    timeout: 10000
  });

  const [showApiKey, setShowApiKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Load saved configuration from localStorage
    const savedConfig = localStorage.getItem('wolf-den-search-config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig(parsed);
        EnhancedWebSearchService.configure(parsed);
      } catch (error) {
        console.error('Failed to load search configuration:', error);
      }
    }
  }, []);

  if (!isOpen) return null;

  const handleConfigChange = (field: keyof SearchConfig, value: string | number) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    try {
      // Save to localStorage
      localStorage.setItem('wolf-den-search-config', JSON.stringify(config));
      
      // Configure the service
      EnhancedWebSearchService.configure(config);
      
      setHasChanges(false);
      setTestResult({ success: true, message: 'Configuration saved successfully!' });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setTestResult(null);
      }, 3000);
    } catch (error) {
      setTestResult({ success: false, message: 'Failed to save configuration' });
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      // Temporarily configure the service for testing
      EnhancedWebSearchService.configure(config);
      
      // Perform a test search
      const results = await EnhancedWebSearchService.searchIndustryIntelligence('technology');
      
      if (results.length > 0) {
        setTestResult({ 
          success: true, 
          message: `Test successful! Found ${results.length} results.` 
        });
      } else {
        setTestResult({ 
          success: false, 
          message: 'Test completed but no results returned.' 
        });
      }
    } catch (error) {
      setTestResult({ 
        success: false, 
        message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      setTesting(false);
    }
  };

  const handleReset = () => {
    setConfig({
      provider: 'mock',
      apiKey: '',
      searchEngineId: '',
      maxResults: 10,
      timeout: 10000
    });
    setHasChanges(true);
    setTestResult(null);
  };

  const providerOptions = [
    { value: 'mock', label: 'Mock (Demo Data)' },
    { value: 'google', label: 'Google Custom Search' },
    { value: 'bing', label: 'Bing Search API' },
    { value: 'serpapi', label: 'SerpApi (Google)' }
  ];

  const getProviderDescription = (provider: string) => {
    switch (provider) {
      case 'google':
        return 'Use Google Custom Search API. Requires API key and search engine ID.';
      case 'bing':
        return 'Use Bing Search API. Requires API key from Azure Cognitive Services.';
      case 'serpapi':
        return 'Use SerpApi for Google results. Requires SerpApi key.';
      default:
        return 'Use mock/demo data for testing. No API key required.';
    }
  };

  const getSetupInstructions = (provider: string) => {
    switch (provider) {
      case 'google':
        return [
          '1. Go to Google Cloud Console and enable Custom Search API',
          '2. Create credentials and get your API key',
          '3. Set up a Custom Search Engine and get the engine ID',
          '4. Enter both values below'
        ];
      case 'bing':
        return [
          '1. Go to Azure Portal and create a Cognitive Services account',
          '2. Navigate to Bing Search v7 resource',
          '3. Copy the API key from Keys and Endpoint',
          '4. Enter the key below'
        ];
      case 'serpapi':
        return [
          '1. Sign up at serpapi.com',
          '2. Get your API key from the dashboard',
          '3. Enter the key below'
        ];
      default:
        return ['No setup required - uses demo data'];
    }
  };

  const requiresApiKey = config.provider !== 'mock';
  const requiresSearchEngineId = config.provider === 'google';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Settings className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-800">Search Configuration</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Provider Selection */}
          <Card className="mb-6">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-500" />
                Search Provider
              </h3>
              
              <div className="space-y-4">
                <Select
                  label="Provider"
                  value={config.provider}
                  onChange={(value) => handleConfigChange('provider', value)}
                  options={providerOptions}
                />
                
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    {getProviderDescription(config.provider)}
                  </p>
                </div>

                {config.provider !== 'mock' && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">Setup Instructions:</h4>
                    <ol className="text-sm text-gray-600 space-y-1">
                      {getSetupInstructions(config.provider).map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* API Configuration */}
          <Card className="mb-6">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Key className="w-5 h-5 mr-2 text-green-500" />
                API Configuration
              </h3>
              
              <div className="space-y-4">
                {requiresApiKey && (
                  <div className="relative">
                    <Input
                      label="API Key"
                      type={showApiKey ? 'text' : 'password'}
                      value={config.apiKey}
                      onChange={(value) => handleConfigChange('apiKey', value)}
                      placeholder="Enter your API key"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                )}

                {requiresSearchEngineId && (
                  <Input
                    label="Search Engine ID"
                    value={config.searchEngineId}
                    onChange={(value) => handleConfigChange('searchEngineId', value)}
                    placeholder="Enter your custom search engine ID"
                    required
                  />
                )}

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Max Results"
                    type="number"
                    value={config.maxResults.toString()}
                    onChange={(value) => handleConfigChange('maxResults', parseInt(value) || 10)}
                  />
                  
                  <Input
                    label="Timeout (ms)"
                    type="number"
                    value={config.timeout.toString()}
                    onChange={(value) => handleConfigChange('timeout', parseInt(value) || 10000)}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Test Results */}
          {testResult && (
            <Card className="mb-6">
              <div className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  {testResult.success ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className={`font-medium ${
                    testResult.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {testResult.success ? 'Test Successful' : 'Test Failed'}
                  </span>
                </div>
                <p className={`text-sm ${
                  testResult.success ? 'text-green-600' : 'text-red-600'
                }`}>
                  {testResult.message}
                </p>
              </div>
            </Card>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button
              onClick={handleReset}
              variant="outline"
              className="text-gray-600"
            >
              Reset to Default
            </Button>
            
            <div className="flex space-x-3">
              <Button
                onClick={handleTest}
                variant="outline"
                disabled={testing || (requiresApiKey && !config.apiKey)}
              >
                {testing ? 'Testing...' : 'Test Connection'}
              </Button>
              
              <Button
                onClick={handleSave}
                variant="primary"
                disabled={!hasChanges}
              >
                Save Configuration
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchConfiguration;