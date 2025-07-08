import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileText, AlertCircle, CheckCircle, Download, Target, PhoneCall, Lock } from 'lucide-react';
import Papa from 'papaparse';
import { Contact } from '@/types';
import Button from '@/components/common/Button';
import { useAppStore } from '@/store';

interface ContactImporterProps {
  isOpen: boolean;
  onClose: () => void;
  onContactsImported: (contacts: Contact[]) => void;
}

interface CSVRow {
  [key: string]: string;
}

const ContactImporter: React.FC<ContactImporterProps> = ({
  isOpen,
  onClose,
  onContactsImported
}) => {
  const { setCurrentModule } = useAppStore();
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview' | 'complete'>('upload');
  const [contactsLocked, setContactsLocked] = useState(false);
  const [gatheringIntelligence, setGatheringIntelligence] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const requiredFields = [
    { key: 'companyName', label: 'Company Name', required: true },
    { key: 'contactName', label: 'Contact Name', required: true },
    { key: 'industry', label: 'Industry', required: true },
    { key: 'email', label: 'Email', required: false },
    { key: 'phone', label: 'Phone', required: false },
    { key: 'address', label: 'Address', required: false },
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
      setErrors(['Please select a CSV file']);
      return;
    }

    setFile(selectedFile);
    setErrors([]);
    parseCSV(selectedFile);
  };

  const parseCSV = (file: File) => {
    setIsProcessing(true);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(), // Clean headers
      complete: (results) => {
        console.log('CSV Parse Results:', results);
        
        // Check if parsing detected too many fields (common with wrong delimiter)
        if (results.meta.fields && results.meta.fields.length > 50) {
          setErrors([
            'CSV parsing error: Too many columns detected.',
            'Please ensure your CSV file uses standard comma (,) or tab delimiters.',
            `Detected ${results.meta.fields.length} columns - this usually indicates a delimiter issue.`
          ]);
          setIsProcessing(false);
          return;
        }
        
        // Filter out non-critical errors
        const criticalErrors = results.errors.filter(err => 
          err.type === 'Delimiter' || err.type === 'Quotes'
        );
        
        if (criticalErrors.length > 0) {
          setErrors(criticalErrors.map(err => `Row ${(err.row || 0) + 1}: ${err.message}`));
          setIsProcessing(false);
          return;
        }

        const validData = (results.data as CSVRow[]).filter(row => 
          Object.values(row).some(value => value && value.trim())
        );

        if (validData.length === 0) {
          setErrors(['No valid data found in CSV file. Please check the file format.']);
          setIsProcessing(false);
          return;
        }

        // Check if we have reasonable headers
        const headers = Object.keys(validData[0]);
        if (headers.length === 0 || (headers.length === 1 && headers[0] === '')) {
          setErrors([
            'No column headers found in CSV file.',
            'Please ensure your CSV has a header row with column names.',
            'Download the sample CSV to see the expected format.'
          ]);
          setIsProcessing(false);
          return;
        }

        setCsvData(validData);
        setStep('mapping');
        setIsProcessing(false);
        
        // Auto-map common column names
        const autoMappings: Record<string, string> = {};
        
        headers.forEach(header => {
          const lowerHeader = header.toLowerCase().trim();
          if (lowerHeader.includes('company') && !autoMappings.companyName) autoMappings.companyName = header;
          if ((lowerHeader.includes('contact') || lowerHeader.includes('name')) && !lowerHeader.includes('company') && !autoMappings.contactName) autoMappings.contactName = header;
          if (lowerHeader.includes('industry') && !autoMappings.industry) autoMappings.industry = header;
          if (lowerHeader.includes('email') && !autoMappings.email) autoMappings.email = header;
          if (lowerHeader.includes('phone') && !autoMappings.phone) autoMappings.phone = header;
          if (lowerHeader.includes('address') && !autoMappings.address) autoMappings.address = header;
        });
        
        setMappings(autoMappings);
      },
      error: (error) => {
        console.error('CSV Parse Error:', error);
        setErrors([`CSV Parse Error: ${error.message}`]);
        setIsProcessing(false);
      }
    });
  };

  const handleMappingChange = (field: string, csvColumn: string) => {
    setMappings({ ...mappings, [field]: csvColumn });
  };

  const previewContacts = () => {
    const newErrors: string[] = [];
    
    // Validate required mappings
    requiredFields.forEach(field => {
      if (field.required && !mappings[field.key]) {
        newErrors.push(`${field.label} is required but not mapped`);
      }
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors([]);
    setStep('preview');
  };

  const processContacts = (): Contact[] => {
    let contactsWithoutPhone = 0;
    
    const contacts = csvData.slice(0, 100).map((row, index) => { // Limit to 100 contacts
      const phone = mappings.phone ? row[mappings.phone]?.trim() : undefined;
      
      // Check for missing or invalid phone
      if (!phone || phone === '') {
        contactsWithoutPhone++;
      }
      
      return {
        id: `import-${Date.now()}-${index}`,
        companyName: mappings.companyName ? row[mappings.companyName]?.trim() || '' : '',
        contactName: mappings.contactName ? row[mappings.contactName]?.trim() || '' : '',
        industry: mappings.industry ? row[mappings.industry]?.trim() || '' : '',
        email: mappings.email ? row[mappings.email]?.trim() : undefined,
        phone: phone,
        address: mappings.address ? row[mappings.address]?.trim() : undefined,
        source: 'csv' as const,
        status: 'pending' as const,
      };
    }).filter(contact => contact.companyName && contact.contactName);

    // Show phone number warnings
    if (contactsWithoutPhone > 0) {
      const warningMessage = `⚠️ Warning: ${contactsWithoutPhone} contacts imported without phone numbers. Manual enrichment may be needed for effective calling.`;
      setErrors([...errors, warningMessage]);
    }

    return contacts;
  };

  const handleImport = () => {
    const contacts = processContacts();
    onContactsImported(contacts);
    setStep('complete');
    
    // Reset after a delay
    setTimeout(() => {
      onClose();
      resetImporter();
    }, 2000);
  };

  const resetImporter = () => {
    setFile(null);
    setCsvData([]);
    setMappings({});
    setErrors([]);
    setStep('upload');
    setContactsLocked(false);
    setGatheringIntelligence(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLockContacts = async () => {
    setContactsLocked(true);
    setGatheringIntelligence(true);
    
    // Lock contacts for guided workflow
    const contacts = processContacts();
    localStorage.setItem('wolf-den-locked-contacts', JSON.stringify(contacts));
    
    // Trigger real-time company intelligence gathering
    try {
      const { CompanyIntelligenceService } = await import('@/services/companyIntelligence');
      
      // Start gathering intelligence for all contacts in the background
      // Cast contacts to prospects for intelligence gathering
      const contactsAsProspects = contacts.map(contact => ({
        ...contact,
        persona: contact.persona || 'cost-conscious-employer' as const
      }));
      const intelligencePromise = CompanyIntelligenceService.getMultipleCompanyIntelligence(contactsAsProspects);
      
      // Store the promise for later use
      localStorage.setItem('wolf-den-intelligence-loading', 'true');
      
      // Process intelligence in background
      intelligencePromise.then(intelligence => {
        localStorage.setItem('wolf-den-company-intelligence', JSON.stringify(Object.fromEntries(intelligence)));
        localStorage.removeItem('wolf-den-intelligence-loading');
        setGatheringIntelligence(false);
      }).catch(error => {
        console.error('Error gathering company intelligence:', error);
        localStorage.removeItem('wolf-den-intelligence-loading');
        setGatheringIntelligence(false);
      });
      
    } catch (error) {
      console.error('Error loading CompanyIntelligenceService:', error);
      setGatheringIntelligence(false);
    }
    
    // Set guided mode in store if available
    onClose();
    setCurrentModule('call-planner');
  };

  const downloadSampleCSV = () => {
    const sampleData = [
      {
        'Company Name': 'Acme Corporation',
        'Contact Name': 'John Smith',
        'Industry': 'Technology',
        'Email': 'john.smith@acme.com',
        'Phone': '+1-555-0123',
        'Address': '123 Business St, City, State 12345'
      },
      {
        'Company Name': 'Global Industries',
        'Contact Name': 'Sarah Johnson',
        'Industry': 'Manufacturing',
        'Email': 'sarah.j@global.com',
        'Phone': '+1-555-0124',
        'Address': '456 Industry Ave, City, State 12346'
      }
    ];

    const csv = Papa.unparse(sampleData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-contacts.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Import Contacts</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">Upload CSV files from Apollo, ZoomInfo, or other platforms</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* Step 1: Upload */}
            {step === 'upload' && (
              <div className="space-y-6">
                {/* Sample CSV Download */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-medium text-blue-900">Need a sample format?</h3>
                      <p className="text-sm text-blue-800 mt-1">
                        Download our sample CSV to see the expected format
                      </p>
                      <button
                        onClick={downloadSampleCSV}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <Download className="w-4 h-4 inline mr-1" />
                        Download Sample CSV
                      </button>
                    </div>
                  </div>
                </div>

                {/* File Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Upload CSV File</h3>
                  <p className="text-gray-600 mb-4">
                    Drag and drop your CSV file here, or click to browse
                  </p>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  <Button onClick={() => fileInputRef.current?.click()}>
                    Choose File
                  </Button>
                  
                  {file && (
                    <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                      Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </div>
                  )}
                </div>

                {/* Platform-specific instructions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Apollo.io Export</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Go to your saved contacts → Export → CSV format
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">ZoomInfo Export</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Select contacts → Export → Download CSV
                    </p>
                  </div>
                </div>

                {/* Errors */}
                {errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-900">Import Errors</h4>
                        <ul className="mt-1 text-sm text-red-800">
                          {errors.map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {isProcessing && (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="text-sm text-gray-600 mt-2">Processing CSV file...</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Field Mapping */}
            {step === 'mapping' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Map CSV Columns</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Match your CSV columns to the required fields. Found {csvData.length} rows.
                  </p>
                </div>

                <div className="space-y-4">
                  {requiredFields.map((field) => (
                    <div key={field.key} className="flex items-center gap-4">
                      <div className="w-32">
                        <label className="text-sm font-medium text-gray-900">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                      </div>
                      
                      <select
                        value={mappings[field.key] || ''}
                        onChange={(e) => handleMappingChange(field.key, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Select column...</option>
                        {Object.keys(csvData[0] || {}).map((column) => (
                          <option key={column} value={column}>
                            {column}
                          </option>
                        ))}
                      </select>
                      
                      {mappings[field.key] && csvData[0] && (
                        <div className="w-48 text-sm text-gray-600 truncate">
                          Sample: {csvData[0][mappings[field.key]]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Errors */}
                {errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-900">Mapping Errors</h4>
                        <ul className="mt-1 text-sm text-red-800">
                          {errors.map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="secondary" onClick={() => setStep('upload')}>
                    Back
                  </Button>
                  <Button onClick={previewContacts}>
                    Preview Contacts
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Preview */}
            {step === 'preview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Preview Contacts</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Review the contacts to be imported (showing first 10 of {processContacts().length})
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Company
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Industry
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {processContacts().slice(0, 10).map((contact) => (
                          <tr key={contact.id}>
                            <td className="px-4 py-3 text-sm text-gray-900">{contact.companyName}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{contact.contactName}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{contact.industry}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{contact.email || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="secondary" onClick={() => setStep('mapping')}>
                    Back to Mapping
                  </Button>
                  <Button onClick={handleImport}>
                    Import {processContacts().length} Contacts
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Complete */}
            {step === 'complete' && (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Import Complete!</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Successfully imported {processContacts().length} contacts
                </p>
                
                {/* Navigation buttons for next steps */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    onClick={handleLockContacts}
                    size="lg"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={contactsLocked || gatheringIntelligence}
                  >
                    <Lock className="w-5 h-5 mr-2" />
                    {gatheringIntelligence ? 'Gathering Intelligence...' : contactsLocked ? 'Contacts Locked' : 'Lock Contacts for Guide'}
                  </Button>
                  
                  <Button
                    onClick={() => {
                      onClose();
                      setCurrentModule('battle-card');
                    }}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Target className="w-5 h-5 mr-2" />
                    Generate Battle Cards
                  </Button>
                  
                  <Button
                    onClick={() => {
                      onClose();
                      setCurrentModule('live-call');
                    }}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <PhoneCall className="w-5 h-5 mr-2" />
                    Start Call Session
                  </Button>
                  
                  <Button
                    onClick={onClose}
                    variant="outline"
                    size="lg"
                  >
                    Continue Planning
                  </Button>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Next Steps:</strong> Lock contacts for guided workflow, generate battle cards for your contacts, then start your call session with live assistance and real-time intelligence.
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ContactImporter;