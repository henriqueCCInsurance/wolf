import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileText, AlertCircle, CheckCircle, Download, Target, PhoneCall, Lock, Settings, Cloud } from 'lucide-react';
import Papa from 'papaparse';
import { Contact, DatabaseContact } from '@/types';
import Button from '@/components/common/Button';
import { useAppStore } from '@/store';
import { NetlifyDatabaseService } from '@/services/netlifyDb';
import { CompanyIntelligenceService } from '@/services/companyIntelligence';
import { zohoCRMService, ZohoFieldMapping } from '@/services/zohoCRM';
import ZohoFieldMapper from '@/components/crm/ZohoFieldMapper';
import { validateFile, validateCSVData, validateName, validateEmail, validatePhone } from '@/utils/inputValidation';

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
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview' | 'complete'>('upload');
  const [contactsLocked, setContactsLocked] = useState(false);
  const [gatheringIntelligence, setGatheringIntelligence] = useState(false);
  const [sourceType, setSourceType] = useState<'csv' | 'zoho'>('csv');
  const [, setZohoContacts] = useState<any[]>([]);
  const [showFieldMapper, setShowFieldMapper] = useState(false);
  const [zohoFieldMapping, setZohoFieldMapping] = useState<ZohoFieldMapping>(zohoCRMService.getFieldMapping());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const requiredFields = [
    { key: 'companyName', label: 'Company Name', required: true },
    { key: 'contactName', label: 'Contact Name', required: true },
    { key: 'industry', label: 'Industry', required: true },
    { key: 'position', label: 'Position/Title', required: false },
    { key: 'email', label: 'Email', required: false },
    { key: 'phone', label: 'Phone', required: false },
    { key: 'address', label: 'Address', required: false },
    { key: 'employeeCount', label: 'Employee Count', required: false },
    { key: 'revenue', label: 'Revenue', required: false },
    { key: 'persona', label: 'Persona Type', required: false },
    { key: 'tags', label: 'Tags', required: false },
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type and size
    const validation = validateFile(selectedFile, ['csv', 'text/csv'], 50); // 50MB max
    
    if (!validation.isValid) {
      setErrors([validation.error || 'Invalid file']);
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

        // Validate and sanitize CSV data
        const csvValidation = validateCSVData(results.data as string[][], 10000);
        
        if (!csvValidation.isValid) {
          setErrors(csvValidation.errors);
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
          if ((lowerHeader.includes('position') || lowerHeader.includes('title') || lowerHeader.includes('job')) && !autoMappings.position) autoMappings.position = header;
          if (lowerHeader.includes('email') && !autoMappings.email) autoMappings.email = header;
          if (lowerHeader.includes('phone') && !autoMappings.phone) autoMappings.phone = header;
          if (lowerHeader.includes('address') && !autoMappings.address) autoMappings.address = header;
          if ((lowerHeader.includes('employee') || lowerHeader.includes('size')) && !autoMappings.employeeCount) autoMappings.employeeCount = header;
          if ((lowerHeader.includes('revenue') || lowerHeader.includes('sales')) && !autoMappings.revenue) autoMappings.revenue = header;
          if (lowerHeader.includes('persona') && !autoMappings.persona) autoMappings.persona = header;
          if ((lowerHeader.includes('tag') || lowerHeader.includes('label')) && !autoMappings.tags) autoMappings.tags = header;
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
    const validationErrors: string[] = [];
    
    const contacts = csvData.slice(0, 100).map((row, index) => { // Limit to 100 contacts
      // Validate and sanitize company name
      const companyNameValidation = validateName(
        mappings.companyName ? row[mappings.companyName]?.trim() || '' : '',
        2, 100
      );
      if (!companyNameValidation.isValid && companyNameValidation.error) {
        validationErrors.push(`Row ${index + 1}: Company - ${companyNameValidation.error}`);
      }
      
      // Validate and sanitize contact name
      const contactNameValidation = validateName(
        mappings.contactName ? row[mappings.contactName]?.trim() || '' : '',
        2, 100
      );
      if (!contactNameValidation.isValid && contactNameValidation.error) {
        validationErrors.push(`Row ${index + 1}: Contact - ${contactNameValidation.error}`);
      }
      
      // Validate email if provided
      let sanitizedEmail: string | undefined;
      if (mappings.email && row[mappings.email]) {
        const emailValidation = validateEmail(row[mappings.email].trim());
        if (emailValidation.isValid) {
          sanitizedEmail = emailValidation.sanitized;
        } else {
          validationErrors.push(`Row ${index + 1}: Invalid email address`);
        }
      }
      
      // Validate phone if provided
      let sanitizedPhone: string | undefined;
      if (mappings.phone && row[mappings.phone]) {
        const phoneValidation = validatePhone(row[mappings.phone].trim());
        if (phoneValidation.isValid) {
          sanitizedPhone = phoneValidation.sanitized;
        } else {
          contactsWithoutPhone++;
        }
      } else {
        contactsWithoutPhone++;
      }
      
      return {
        id: `import-${Date.now()}-${index}`,
        companyName: companyNameValidation.sanitized,
        contactName: contactNameValidation.sanitized,
        industry: mappings.industry ? row[mappings.industry]?.trim() || '' : '',
        position: mappings.position ? row[mappings.position]?.trim() : undefined,
        title: mappings.position ? row[mappings.position]?.trim() : undefined,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        address: mappings.address ? row[mappings.address]?.trim() : undefined,
        employeeCount: mappings.employeeCount ? row[mappings.employeeCount]?.trim() : undefined,
        revenue: mappings.revenue ? row[mappings.revenue]?.trim() : undefined,
        persona: mappings.persona ? row[mappings.persona]?.trim() as any : undefined,
        notes: mappings.tags ? row[mappings.tags]?.trim() : undefined,
        source: sourceType === 'zoho' ? 'crm' as const : 'csv' as const,
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
    
    try {
      // Process contacts for database
      const contacts = processContacts();
      
      const userId = user?.id || 'current-user';
      
      // Save contacts to database
      const savedContacts = await NetlifyDatabaseService.contactService.bulkCreate(userId, contacts.map(contact => ({
        company: contact.companyName,
        name: contact.contactName,
        title: contact.position || contact.title,
        phone: contact.phone,
        email: contact.email,
        industry: contact.industry,
        employeeCount: contact.employeeCount,
        revenue: contact.revenue,
        personaType: contact.persona,
        status: 'new' as const,
        tags: [],
        notes: contact.notes
      })));
      
      // Create a call sequence for these contacts
      const sequence = await NetlifyDatabaseService.callSequenceService.create({
        userId,
        name: `Import ${new Date().toLocaleDateString()}`,
        contacts: savedContacts.map((c: DatabaseContact) => ({
          id: c.id,
          companyName: c.company,
          contactName: c.name,
          status: 'pending' as const,
          industry: c.industry || '',
          source: 'csv' as const
        })),
        contactIds: savedContacts.map((c: DatabaseContact) => c.id),
        totalContacts: savedContacts.length,
        status: 'planned' as const,
        sprintSize: Math.min(savedContacts.length, 25),
        mode: 'imported' as const,
        updatedAt: new Date(),
        contactedCount: 0,
        qualifiedCount: 0
      });
      
      // Store sequence ID in app store for navigation
      useAppStore.getState().setActiveSequence(sequence.id);
      
      // Gather intelligence for all contacts in the background
      const contactsAsProspects = contacts.map(contact => ({
        ...contact,
        persona: contact.persona || 'cost-conscious-employer' as const
      }));
      
      CompanyIntelligenceService.getMultipleCompanyIntelligence(contactsAsProspects)
        .then(async (intelligence) => {
          // Save intelligence to database cache
          for (const [company, intel] of intelligence) {
            await NetlifyDatabaseService.companyIntelligenceService.set({
              companyName: company,
              intelligenceData: intel,
              source: 'web-search',
              expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
              industry: null,
              employeeCount: null,
              revenue: null
            });
          }
          setGatheringIntelligence(false);
        })
        .catch(error => {
          console.error('Error gathering company intelligence:', error);
          setGatheringIntelligence(false);
        });
      
    } catch (error) {
      console.error('Error saving contacts to database:', error);
      setErrors([`Failed to save contacts: ${error instanceof Error ? error.message : String(error)}`]);
      setGatheringIntelligence(false);
      setContactsLocked(false);
      return;
    }
    
    // Navigate to call planner
    onClose();
    setCurrentModule('call-planner');
  };

  const downloadSampleCSV = () => {
    const sampleData = [
      {
        'Company Name': 'Acme Corporation',
        'Contact Name': 'John Smith',
        'Position': 'HR Director',
        'Industry': 'Technology',
        'Email': 'john.smith@acme.com',
        'Phone': '+1-555-0123',
        'Address': '123 Business St, City, State 12345',
        'Employee Count': '500-1000',
        'Revenue': '$10M-$50M',
        'Persona Type': 'cost-conscious-employer',
        'Tags': 'hot-lead, technology'
      },
      {
        'Company Name': 'Global Industries',
        'Contact Name': 'Sarah Johnson',
        'Position': 'CFO',
        'Industry': 'Manufacturing',
        'Email': 'sarah.j@global.com',
        'Phone': '+1-555-0124',
        'Address': '456 Industry Ave, City, State 12346',
        'Employee Count': '1000-5000',
        'Revenue': '$50M-$100M',
        'Persona Type': 'roi-focused-executive',
        'Tags': 'enterprise, manufacturing'
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
              <p className="text-sm text-gray-600 dark:text-gray-300">Upload CSV files or sync from Zoho CRM</p>
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
                {/* Source Type Selection */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Import Source:</span>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="csv"
                      checked={sourceType === 'csv'}
                      onChange={(e) => setSourceType(e.target.value as 'csv' | 'zoho')}
                      className="text-primary-600"
                    />
                    <span className="text-sm text-gray-700">CSV File</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="zoho"
                      checked={sourceType === 'zoho'}
                      onChange={(e) => setSourceType(e.target.value as 'csv' | 'zoho')}
                      className="text-primary-600"
                    />
                    <span className="text-sm text-gray-700">Zoho CRM</span>
                  </label>
                </div>
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

                {sourceType === 'csv' ? (
                  <>
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
                  </>
                ) : (
                  <>
                    {/* Zoho CRM Import */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Cloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Sync from Zoho CRM</h3>
                      <p className="text-gray-600 mb-4">
                        Connect to your Zoho CRM account to import contacts
                      </p>
                      
                      <div className="flex items-center gap-3 justify-center">
                        <Button
                          onClick={async () => {
                            setIsProcessing(true);
                            try {
                              const contacts = await zohoCRMService.getAllContacts(1, 100);
                              setZohoContacts(contacts);
                              // Convert to CSV-like format for processing
                              const csvLikeData = contacts.map(contact => ({
                                'Company Name': contact.companyName || '',
                                'Contact Name': contact.contactName || '',
                                'Position': contact.position || '',
                                'Industry': contact.industry || '',
                                'Email': contact.email || '',
                                'Phone': contact.phone || '',
                                'Address': contact.address || '',
                                'Employee Count': contact.employeeCount || '',
                                'Revenue': contact.revenue || '',
                                'Persona Type': contact.persona || '',
                                'Tags': Array.isArray(contact.tags) ? contact.tags.join(', ') : contact.tags || ''
                              }));
                              setCsvData(csvLikeData);
                              
                              // Auto-map fields
                              const autoMappings: Record<string, string> = {
                                companyName: 'Company Name',
                                contactName: 'Contact Name',
                                position: 'Position',
                                industry: 'Industry',
                                email: 'Email',
                                phone: 'Phone',
                                address: 'Address',
                                employeeCount: 'Employee Count',
                                revenue: 'Revenue',
                                persona: 'Persona Type',
                                tags: 'Tags'
                              };
                              setMappings(autoMappings);
                              
                              setStep('preview');
                            } catch (error) {
                              console.error('Error fetching Zoho contacts:', error);
                              setErrors(['Failed to fetch contacts from Zoho CRM. Please check your configuration.']);
                            }
                            setIsProcessing(false);
                          }}
                        >
                          <Cloud className="w-4 h-4" />
                          Fetch Contacts
                        </Button>
                        
                        <Button
                          variant="secondary"
                          onClick={() => setShowFieldMapper(true)}
                        >
                          <Settings className="w-4 h-4" />
                          Configure Fields
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                {/* Platform-specific instructions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Zoho CRM Sync</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Configure field mapping → Fetch contacts directly
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
                            Position
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Industry
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Phone
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Persona
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {processContacts().slice(0, 10).map((contact) => (
                          <tr key={contact.id}>
                            <td className="px-4 py-3 text-sm text-gray-900">{contact.companyName}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{contact.contactName}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{contact.position || 'N/A'}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{contact.industry}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{contact.phone || 'N/A'}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{contact.email || 'N/A'}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{contact.persona || 'N/A'}</td>
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
      
      {/* Zoho Field Mapper Modal */}
      <ZohoFieldMapper
        isOpen={showFieldMapper}
        onClose={() => setShowFieldMapper(false)}
        currentMapping={zohoFieldMapping}
        onMappingUpdate={(newMapping) => {
          setZohoFieldMapping(newMapping);
          zohoCRMService.updateFieldMapping(newMapping);
        }}
      />
    </AnimatePresence>
  );
};

export default ContactImporter;