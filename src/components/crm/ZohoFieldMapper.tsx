import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, RefreshCw, Info, X } from 'lucide-react';
import Button from '@/components/common/Button';
import { zohoCRMService, ZohoFieldMapping, DEFAULT_ZOHO_FIELD_MAPPING } from '@/services/zohoCRM';

interface ZohoFieldMapperProps {
  isOpen: boolean;
  onClose: () => void;
  onMappingUpdate: (mapping: ZohoFieldMapping) => void;
  currentMapping?: ZohoFieldMapping;
}

interface ZohoField {
  api_name: string;
  display_label: string;
  data_type: string;
  required: boolean;
  custom_field: boolean;
}

const ZohoFieldMapper: React.FC<ZohoFieldMapperProps> = ({
  isOpen,
  onClose,
  onMappingUpdate,
  currentMapping
}) => {
  const [fieldMapping, setFieldMapping] = useState<ZohoFieldMapping>(
    currentMapping || DEFAULT_ZOHO_FIELD_MAPPING
  );
  const [zohoFields, setZohoFields] = useState<ZohoField[]>([]);
  const [loading, setLoading] = useState(false);
  const [customFields, setCustomFields] = useState<{ [key: string]: string }>({});
  const [newCustomFieldKey, setNewCustomFieldKey] = useState('');
  const [newCustomFieldValue, setNewCustomFieldValue] = useState('');

  const wolfDenFields = [
    { key: 'companyName', label: 'Company Name', required: true },
    { key: 'contactName', label: 'Contact Name', required: true },
    { key: 'email', label: 'Email', required: false },
    { key: 'phone', label: 'Phone', required: false },
    { key: 'position', label: 'Position/Title', required: false },
    { key: 'industry', label: 'Industry', required: true },
    { key: 'persona', label: 'Persona Type', required: false },
    { key: 'employeeCount', label: 'Employee Count', required: false },
    { key: 'revenue', label: 'Revenue', required: false },
    { key: 'tags', label: 'Tags', required: false },
    { key: 'address', label: 'Address', required: false },
  ];

  useEffect(() => {
    if (isOpen) {
      loadZohoFields();
    }
  }, [isOpen]);

  const loadZohoFields = async () => {
    setLoading(true);
    try {
      const fields = await zohoCRMService.getFieldConfiguration('Contacts');
      setZohoFields(fields);
    } catch (error) {
      console.error('Error loading Zoho fields:', error);
      // Use mock fields for demo
      setZohoFields(getMockZohoFields());
    }
    setLoading(false);
  };

  const getMockZohoFields = (): ZohoField[] => {
    return [
      { api_name: 'First_Name', display_label: 'First Name', data_type: 'text', required: true, custom_field: false },
      { api_name: 'Last_Name', display_label: 'Last Name', data_type: 'text', required: true, custom_field: false },
      { api_name: 'Account_Name', display_label: 'Account Name', data_type: 'text', required: false, custom_field: false },
      { api_name: 'Email', display_label: 'Email', data_type: 'email', required: false, custom_field: false },
      { api_name: 'Phone', display_label: 'Phone', data_type: 'phone', required: false, custom_field: false },
      { api_name: 'Title', display_label: 'Title', data_type: 'text', required: false, custom_field: false },
      { api_name: 'Industry', display_label: 'Industry', data_type: 'picklist', required: false, custom_field: false },
      { api_name: 'Lead_Source', display_label: 'Lead Source', data_type: 'picklist', required: false, custom_field: false },
      { api_name: 'No_of_Employees', display_label: 'No of Employees', data_type: 'integer', required: false, custom_field: false },
      { api_name: 'Annual_Revenue', display_label: 'Annual Revenue', data_type: 'currency', required: false, custom_field: false },
      { api_name: 'Tag', display_label: 'Tag', data_type: 'text', required: false, custom_field: false },
      { api_name: 'Mailing_Street', display_label: 'Mailing Street', data_type: 'text', required: false, custom_field: false },
      { api_name: 'Persona_Type__c', display_label: 'Persona Type', data_type: 'picklist', required: false, custom_field: true },
      { api_name: 'Wolf_Den_Score__c', display_label: 'Wolf Den Score', data_type: 'integer', required: false, custom_field: true },
    ];
  };

  const handleFieldChange = (wolfDenField: string, zohoField: string) => {
    setFieldMapping({
      ...fieldMapping,
      [wolfDenField]: zohoField
    });
  };

  const handleAddCustomField = () => {
    if (newCustomFieldKey && newCustomFieldValue) {
      const updatedCustomFields = {
        ...customFields,
        [newCustomFieldKey]: newCustomFieldValue
      };
      setCustomFields(updatedCustomFields);
      setFieldMapping({
        ...fieldMapping,
        customFields: updatedCustomFields
      });
      setNewCustomFieldKey('');
      setNewCustomFieldValue('');
    }
  };

  const handleRemoveCustomField = (key: string) => {
    const { [key]: removed, ...remaining } = customFields;
    console.log('Removing custom field:', key, removed);
    setCustomFields(remaining);
    setFieldMapping({
      ...fieldMapping,
      customFields: remaining
    });
  };

  const handleSave = () => {
    zohoCRMService.updateFieldMapping(fieldMapping);
    onMappingUpdate(fieldMapping);
    onClose();
  };

  const handleReset = () => {
    setFieldMapping(DEFAULT_ZOHO_FIELD_MAPPING);
    setCustomFields({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Zoho CRM Field Mapping</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900">Field Mapping Configuration</h3>
                <p className="text-sm text-blue-800 mt-1">
                  Map Wolf Den fields to your Zoho CRM fields. This ensures data is properly synchronized between systems.
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading Zoho fields...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Standard Field Mappings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Standard Field Mappings</h3>
                <div className="space-y-3">
                  {wolfDenFields.map((field) => (
                    <div key={field.key} className="flex items-center gap-4">
                      <div className="w-48">
                        <label className="text-sm font-medium text-gray-700">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                      </div>
                      
                      <select
                        value={
                          field.key === 'customFields' 
                            ? '' 
                            : (fieldMapping[field.key as keyof Omit<ZohoFieldMapping, 'customFields'>] || '')
                        }
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Select Zoho field...</option>
                        {zohoFields.map((zohoField) => (
                          <option key={zohoField.api_name} value={zohoField.api_name}>
                            {zohoField.display_label} ({zohoField.api_name})
                            {zohoField.custom_field && ' - Custom'}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Field Mappings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Custom Field Mappings</h3>
                
                {/* Existing custom fields */}
                {Object.entries(customFields).length > 0 && (
                  <div className="space-y-2 mb-4">
                    {Object.entries(customFields).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">{key}</span>
                        <span className="text-sm text-gray-500">→</span>
                        <span className="text-sm text-gray-900 flex-1">{value}</span>
                        <button
                          onClick={() => handleRemoveCustomField(key)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new custom field */}
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                  <input
                    type="text"
                    placeholder="Wolf Den field name"
                    value={newCustomFieldKey}
                    onChange={(e) => setNewCustomFieldKey(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <span className="text-gray-500">→</span>
                  <select
                    value={newCustomFieldValue}
                    onChange={(e) => setNewCustomFieldValue(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Zoho field...</option>
                    {zohoFields.map((zohoField) => (
                      <option key={zohoField.api_name} value={zohoField.api_name}>
                        {zohoField.display_label} ({zohoField.api_name})
                      </option>
                    ))}
                  </select>
                  <Button
                    onClick={handleAddCustomField}
                    size="sm"
                    disabled={!newCustomFieldKey || !newCustomFieldValue}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <Button variant="secondary" onClick={handleReset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
          
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Mapping
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ZohoFieldMapper;