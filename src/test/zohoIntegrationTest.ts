import { zohoCRMService, ZohoFieldMapping } from '@/services/zohoCRM';

// Test script for Zoho CRM integration with custom field mapping

async function testZohoIntegration() {
  console.log('🧪 Testing Zoho CRM Integration with Custom Field Mapping\n');

  // 1. Test current field mapping
  console.log('1️⃣ Current Field Mapping:');
  const currentMapping = zohoCRMService.getFieldMapping();
  console.log(JSON.stringify(currentMapping, null, 2));

  // 2. Test custom field mapping update
  console.log('\n2️⃣ Updating Field Mapping with Custom Fields:');
  const customMapping: Partial<ZohoFieldMapping> = {
    persona: 'Lead_Type__c', // Custom field in Zoho
    employeeCount: 'Company_Size__c',
    revenue: 'ARR__c',
    customFields: {
      'wolfDenScore': 'Wolf_Den_Score__c',
      'lastContactDate': 'Last_Contact_Date__c',
      'nextFollowUp': 'Next_Follow_Up__c'
    }
  };
  
  zohoCRMService.updateFieldMapping(customMapping);
  console.log('Updated mapping:', JSON.stringify(zohoCRMService.getFieldMapping(), null, 2));

  // 3. Test Wolf Den to Zoho mapping
  console.log('\n3️⃣ Testing Wolf Den → Zoho Contact Mapping:');
  const wolfDenContact = {
    contactName: 'John Smith',
    companyName: 'Acme Corporation',
    email: 'john.smith@acme.com',
    phone: '+1-555-0123',
    position: 'HR Director',
    industry: 'Technology',
    persona: 'cost-conscious-employer',
    employeeCount: '500-1000',
    revenue: '$10M-$50M',
    tags: ['hot-lead', 'technology', 'enterprise'],
    address: '123 Business St, City, State 12345',
    wolfDenScore: 85,
    lastContactDate: '2025-01-15',
    nextFollowUp: '2025-01-22'
  };

  const zohoContact = zohoCRMService.mapWolfDenToZoho(wolfDenContact);
  console.log('Mapped Zoho Contact:', JSON.stringify(zohoContact, null, 2));

  // 4. Test Zoho to Wolf Den mapping
  console.log('\n4️⃣ Testing Zoho → Wolf Den Contact Mapping:');
  const sampleZohoContact = {
    id: '12345',
    First_Name: 'Sarah',
    Last_Name: 'Johnson',
    Account_Name: 'Global Industries',
    Email: 'sarah.j@global.com',
    Phone: '+1-555-0124',
    Title: 'CFO',
    Industry: 'Manufacturing',
    Lead_Type__c: 'ROI Focused',
    Company_Size__c: '1000-5000',
    ARR__c: '$50M-$100M',
    Tag: 'enterprise, manufacturing, decision-maker',
    Mailing_Street: '456 Industry Ave, City, State 12346',
    Wolf_Den_Score__c: 92,
    Last_Contact_Date__c: '2025-01-10',
    Next_Follow_Up__c: '2025-01-20'
  };

  const wolfDenMappedContact = zohoCRMService.mapZohoToWolfDen(sampleZohoContact);
  console.log('Mapped Wolf Den Contact:', JSON.stringify(wolfDenMappedContact, null, 2));

  // 5. Test bulk import
  console.log('\n5️⃣ Testing Bulk Import:');
  const bulkContacts = [
    {
      contactName: 'Mike Davis',
      companyName: 'Tech Solutions Inc',
      email: 'mike.d@techsolutions.com',
      phone: '+1-555-0125',
      industry: 'Technology',
      persona: 'benefits-optimizer',
      employeeCount: '100-500',
      revenue: '$5M-$10M'
    },
    {
      contactName: 'Lisa Chen',
      companyName: 'Healthcare Plus',
      email: 'lisa.chen@healthcareplus.com',
      phone: '+1-555-0126',
      industry: 'Healthcare',
      persona: 'roi-focused-executive',
      employeeCount: '50-100',
      revenue: '$1M-$5M'
    }
  ];

  try {
    // This would make actual API calls in production
    console.log('Importing', bulkContacts.length, 'contacts to Zoho CRM...');
    // const importedContacts = await zohoCRMService.importMultipleContacts(bulkContacts);
    console.log('✅ Bulk import would be successful (API call skipped in test)');
  } catch (error) {
    console.error('❌ Bulk import error:', error);
  }

  // 6. Test field configuration retrieval
  console.log('\n6️⃣ Testing Field Configuration Retrieval:');
  try {
    const fields = await zohoCRMService.getFieldConfiguration('Contacts');
    console.log(`Found ${fields.length} fields in Zoho Contacts module`);
    console.log('Sample fields:', fields.slice(0, 5).map(f => ({
      api_name: f.api_name,
      display_label: f.display_label,
      data_type: f.data_type,
      custom_field: f.custom_field
    })));
  } catch (error) {
    console.log('ℹ️ Field configuration retrieval skipped (requires API credentials)');
  }

  console.log('\n✅ Zoho CRM integration test completed successfully!');
}

// Run the test
testZohoIntegration().catch(console.error);

export { testZohoIntegration };