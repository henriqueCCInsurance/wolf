interface ZohoCRMConfig {
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
  accessToken?: string;
  apiDomain?: string; // e.g., 'zohoapis.com', 'zohoapis.eu', etc.
  fieldMapping?: ZohoFieldMapping;
}

interface ZohoContact {
  id?: string;
  First_Name: string;
  Last_Name: string;
  Account_Name?: string;
  Phone?: string;
  Email?: string;
  Industry?: string;
  Lead_Status?: string;
  Owner?: {
    name: string;
    id: string;
  };
  // Allow dynamic fields
  [key: string]: any;
}

// Field mapping configuration
export interface ZohoFieldMapping {
  // Wolf Den field -> Zoho field
  companyName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  position?: string;
  industry?: string;
  persona?: string;
  employeeCount?: string;
  revenue?: string;
  tags?: string;
  address?: string;
  // Custom fields
  customFields?: {
    [wolfDenField: string]: string; // Wolf Den field -> Zoho field
  };
}

// Default field mapping
export const DEFAULT_ZOHO_FIELD_MAPPING: ZohoFieldMapping = {
  companyName: 'Account_Name',
  contactName: 'Full_Name', // Will be parsed to First_Name/Last_Name
  email: 'Email',
  phone: 'Phone',
  position: 'Title',
  industry: 'Industry',
  persona: 'Lead_Source', // Or custom field
  employeeCount: 'No_of_Employees',
  revenue: 'Annual_Revenue',
  tags: 'Tag',
  address: 'Mailing_Street'
};

// interface ZohoLead {
//   id?: string;
//   First_Name: string;
//   Last_Name: string;
//   Company: string;
//   Phone?: string;
//   Email?: string;
//   Industry?: string;
//   Lead_Status?: string;
//   Lead_Source?: string;
//   Owner?: {
//     name: string;
//     id: string;
//   };
// }

interface CallActivity {
  Subject: string;
  Call_Type: 'Outbound' | 'Inbound';
  Call_Start_Time: string;
  Call_Duration: number;
  Call_Result: string;
  Description?: string;
  Who_Id?: string; // Contact/Lead ID
  What_Id?: string; // Account ID
}

class ZohoCRMService {
  private config: ZohoCRMConfig;
  private baseUrl: string;
  private fieldMapping: ZohoFieldMapping;

  constructor(config: ZohoCRMConfig = {}) {
    this.config = config;
    this.baseUrl = `https://www.${config.apiDomain || 'zohoapis.com'}/crm/v6`;
    this.fieldMapping = { ...DEFAULT_ZOHO_FIELD_MAPPING, ...config.fieldMapping };
  }

  /**
   * Get access token using refresh token
   */
  private async getAccessToken(): Promise<string> {
    if (this.config.accessToken) {
      return this.config.accessToken;
    }

    if (!this.config.refreshToken || !this.config.clientId || !this.config.clientSecret) {
      throw new Error('Zoho CRM credentials not configured');
    }

    try {
      const response = await fetch('https://accounts.zoho.com/oauth/v2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          refresh_token: this.config.refreshToken,
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          grant_type: 'refresh_token',
        }),
      });

      const data = await response.json();
      
      if (data.access_token) {
        this.config.accessToken = data.access_token;
        return data.access_token;
      } else {
        throw new Error('Failed to get access token');
      }
    } catch (error) {
      console.error('Error getting Zoho access token:', error);
      throw error;
    }
  }

  /**
   * Make authenticated API request to Zoho CRM
   */
  private async apiRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`Zoho API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Zoho API request error:', error);
      throw error;
    }
  }

  /**
   * Search for contacts in Zoho CRM
   */
  async searchContacts(searchTerm: string): Promise<ZohoContact[]> {
    try {
      const response = await this.apiRequest(
        `/Contacts/search?criteria=(First_Name:contains:${encodeURIComponent(searchTerm)})or(Last_Name:contains:${encodeURIComponent(searchTerm)})or(Account_Name:contains:${encodeURIComponent(searchTerm)})`
      );

      return response.data || [];
    } catch (error) {
      console.error('Error searching contacts:', error);
      // Return mock data for demo
      return this.getMockContacts().filter(contact => 
        contact.First_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.Last_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.Account_Name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }

  /**
   * Get contact by ID
   */
  async getContact(contactId: string): Promise<ZohoContact | null> {
    try {
      const response = await this.apiRequest(`/Contacts/${contactId}`);
      return response.data?.[0] || null;
    } catch (error) {
      console.error('Error getting contact:', error);
      return null;
    }
  }

  /**
   * Create or update contact
   */
  async upsertContact(contact: Partial<ZohoContact>): Promise<ZohoContact> {
    try {
      const payload = {
        data: [contact]
      };

      const response = await this.apiRequest('/Contacts/upsert', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      return response.data?.[0] || contact;
    } catch (error) {
      console.error('Error upserting contact:', error);
      throw error;
    }
  }

  /**
   * Create call activity
   */
  async createCallActivity(activity: CallActivity): Promise<any> {
    try {
      const payload = {
        data: [activity]
      };

      const response = await this.apiRequest('/Activities', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      return response.data?.[0];
    } catch (error) {
      console.error('Error creating call activity:', error);
      // For demo, just log the activity
      console.log('Call activity (demo):', activity);
      return { id: Date.now().toString(), ...activity };
    }
  }

  /**
   * Update lead status
   */
  async updateLeadStatus(leadId: string, status: string): Promise<boolean> {
    try {
      const payload = {
        data: [{
          id: leadId,
          Lead_Status: status
        }]
      };

      await this.apiRequest('/Leads', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      return true;
    } catch (error) {
      console.error('Error updating lead status:', error);
      return false;
    }
  }

  /**
   * Import contacts from Wolf Den prospect
   */
  async importProspect(prospect: any): Promise<ZohoContact> {
    const [firstName, ...lastNameParts] = prospect.contactName.split(' ');
    const lastName = lastNameParts.join(' ') || '';

    const contact: Partial<ZohoContact> = {
      First_Name: firstName,
      Last_Name: lastName,
      Account_Name: prospect.companyName,
      Phone: prospect.contactPhone,
      Industry: prospect.industry,
      Lead_Status: 'Not Contacted'
    };

    return await this.upsertContact(contact);
  }

  /**
   * Map Wolf Den contact to Zoho contact using field mapping
   */
  mapWolfDenToZoho(wolfDenContact: any): Partial<ZohoContact> {
    const zohoContact: Partial<ZohoContact> = {};

    // Handle name parsing
    if (wolfDenContact.contactName) {
      const [firstName, ...lastNameParts] = wolfDenContact.contactName.split(' ');
      zohoContact.First_Name = firstName;
      zohoContact.Last_Name = lastNameParts.join(' ') || '';
    }

    // Map standard fields
    if (wolfDenContact.companyName && this.fieldMapping.companyName) {
      zohoContact[this.fieldMapping.companyName] = wolfDenContact.companyName;
    }
    
    if (wolfDenContact.email && this.fieldMapping.email) {
      zohoContact[this.fieldMapping.email] = wolfDenContact.email;
    }
    
    if (wolfDenContact.phone && this.fieldMapping.phone) {
      zohoContact[this.fieldMapping.phone] = wolfDenContact.phone;
    }
    
    if (wolfDenContact.position && this.fieldMapping.position) {
      zohoContact[this.fieldMapping.position] = wolfDenContact.position;
    }
    
    if (wolfDenContact.industry && this.fieldMapping.industry) {
      zohoContact[this.fieldMapping.industry] = wolfDenContact.industry;
    }
    
    if (wolfDenContact.persona && this.fieldMapping.persona) {
      zohoContact[this.fieldMapping.persona] = this.mapPersonaToZoho(wolfDenContact.persona);
    }
    
    if (wolfDenContact.employeeCount && this.fieldMapping.employeeCount) {
      zohoContact[this.fieldMapping.employeeCount] = wolfDenContact.employeeCount;
    }
    
    if (wolfDenContact.revenue && this.fieldMapping.revenue) {
      zohoContact[this.fieldMapping.revenue] = wolfDenContact.revenue;
    }
    
    if (wolfDenContact.tags && this.fieldMapping.tags) {
      zohoContact[this.fieldMapping.tags] = Array.isArray(wolfDenContact.tags) 
        ? wolfDenContact.tags.join(', ') 
        : wolfDenContact.tags;
    }
    
    if (wolfDenContact.address && this.fieldMapping.address) {
      zohoContact[this.fieldMapping.address] = wolfDenContact.address;
    }

    // Map custom fields
    if (this.fieldMapping.customFields) {
      Object.entries(this.fieldMapping.customFields).forEach(([wolfDenField, zohoField]) => {
        if (wolfDenContact[wolfDenField] !== undefined) {
          zohoContact[zohoField] = wolfDenContact[wolfDenField];
        }
      });
    }

    // Always set Lead_Status if not already set
    if (!zohoContact.Lead_Status) {
      zohoContact.Lead_Status = 'Not Contacted';
    }

    return zohoContact;
  }

  /**
   * Map Zoho contact to Wolf Den format using field mapping
   */
  mapZohoToWolfDen(zohoContact: ZohoContact): any {
    const wolfDenContact: any = {
      id: zohoContact.id,
      source: 'crm' as const
    };

    // Map name
    wolfDenContact.contactName = `${zohoContact.First_Name || ''} ${zohoContact.Last_Name || ''}`.trim();

    // Reverse map standard fields
    Object.entries(this.fieldMapping).forEach(([wolfDenField, zohoField]) => {
      if (typeof zohoField === 'string' && zohoContact[zohoField] !== undefined) {
        if (wolfDenField === 'persona') {
          wolfDenContact[wolfDenField] = this.mapZohoToPersona(zohoContact[zohoField]);
        } else if (wolfDenField === 'tags' && typeof zohoContact[zohoField] === 'string') {
          wolfDenContact[wolfDenField] = zohoContact[zohoField].split(',').map(tag => tag.trim());
        } else {
          wolfDenContact[wolfDenField] = zohoContact[zohoField];
        }
      }
    });

    // Reverse map custom fields
    if (this.fieldMapping.customFields) {
      Object.entries(this.fieldMapping.customFields).forEach(([wolfDenField, zohoField]) => {
        if (zohoContact[zohoField] !== undefined) {
          wolfDenContact[wolfDenField] = zohoContact[zohoField];
        }
      });
    }

    return wolfDenContact;
  }

  /**
   * Map Wolf Den persona type to Zoho value
   */
  private mapPersonaToZoho(persona: string): string {
    const personaMapping: Record<string, string> = {
      'cost-conscious-employer': 'Cost Conscious',
      'benefits-optimizer': 'Benefits Optimizer',
      'roi-focused-executive': 'ROI Focused',
      'gatekeeper': 'Gatekeeper'
    };
    return personaMapping[persona] || persona;
  }

  /**
   * Map Zoho value to Wolf Den persona type
   */
  private mapZohoToPersona(zohoValue: string): string {
    const reverseMapping: Record<string, string> = {
      'Cost Conscious': 'cost-conscious-employer',
      'Benefits Optimizer': 'benefits-optimizer',
      'ROI Focused': 'roi-focused-executive',
      'Gatekeeper': 'gatekeeper'
    };
    return reverseMapping[zohoValue] || 'cost-conscious-employer';
  }

  /**
   * Import multiple Wolf Den contacts
   */
  async importMultipleContacts(contacts: any[]): Promise<ZohoContact[]> {
    try {
      const zohoContacts = contacts.map(contact => this.mapWolfDenToZoho(contact));
      
      const payload = {
        data: zohoContacts
      };

      const response = await this.apiRequest('/Contacts/upsert', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      return response.data || zohoContacts;
    } catch (error) {
      console.error('Error importing multiple contacts:', error);
      throw error;
    }
  }

  /**
   * Get field configuration from Zoho
   */
  async getFieldConfiguration(module: 'Contacts' | 'Leads' = 'Contacts'): Promise<any> {
    try {
      const response = await this.apiRequest(`/settings/fields?module=${module}`);
      return response.fields || [];
    } catch (error) {
      console.error('Error getting field configuration:', error);
      return [];
    }
  }

  /**
   * Update field mapping configuration
   */
  updateFieldMapping(newMapping: Partial<ZohoFieldMapping>): void {
    this.fieldMapping = { ...this.fieldMapping, ...newMapping };
    this.config.fieldMapping = this.fieldMapping;
  }

  /**
   * Get current field mapping
   */
  getFieldMapping(): ZohoFieldMapping {
    return { ...this.fieldMapping };
  }

  /**
   * Sync call results to CRM
   */
  async syncCallResults(prospect: any, callOutcome: string, notes?: string, duration?: number): Promise<boolean> {
    try {
      // Create call activity
      const activity: CallActivity = {
        Subject: `Call to ${prospect.contactName} at ${prospect.companyName}`,
        Call_Type: 'Outbound',
        Call_Start_Time: new Date().toISOString(),
        Call_Duration: duration || 0,
        Call_Result: callOutcome,
        Description: notes,
      };

      await this.createCallActivity(activity);

      // Update lead status based on outcome
      let newStatus = 'Contacted';
      switch (callOutcome) {
        case 'meeting-booked':
          newStatus = 'Qualified';
          break;
        case 'follow-up':
          newStatus = 'Working';
          break;
        case 'no-interest':
          newStatus = 'Not Interested';
          break;
        case 'not-a-fit':
          newStatus = 'Disqualified';
          break;
      }

      // In a real implementation, you'd get the actual lead/contact ID
      // For now, we'll just log the status update
      console.log(`Would update lead status to: ${newStatus}`);

      return true;
    } catch (error) {
      console.error('Error syncing call results:', error);
      return false;
    }
  }

  /**
   * Mock data for demo purposes
   */
  private getMockContacts(): ZohoContact[] {
    return [
      {
        id: '1',
        First_Name: 'John',
        Last_Name: 'Smith',
        Account_Name: 'ABC Manufacturing',
        Phone: '+1 (555) 123-4567',
        Email: 'john.smith@abcmfg.com',
        Industry: 'Manufacturing',
        Lead_Status: 'Not Contacted'
      },
      {
        id: '2',
        First_Name: 'Sarah',
        Last_Name: 'Johnson',
        Account_Name: 'TechCorp Solutions',
        Phone: '+1 (555) 987-6543',
        Email: 'sarah.johnson@techcorp.com',
        Industry: 'Technology',
        Lead_Status: 'Working'
      },
      {
        id: '3',
        First_Name: 'Mike',
        Last_Name: 'Davis',
        Account_Name: 'Healthcare Plus',
        Phone: '+1 (555) 456-7890',
        Email: 'mike.davis@healthcareplus.com',
        Industry: 'Healthcare',
        Lead_Status: 'Qualified'
      }
    ];
  }

  /**
   * Get all contacts (with pagination)
   */
  async getAllContacts(page: number = 1, perPage: number = 200): Promise<any[]> {
    try {
      const response = await this.apiRequest(`/Contacts?page=${page}&per_page=${perPage}`);
      const zohoContacts = response.data || [];
      // Map to Wolf Den format
      return zohoContacts.map((contact: ZohoContact) => this.mapZohoToWolfDen(contact));
    } catch (error) {
      console.error('Error getting all contacts:', error);
      // Return mock data for demo
      return this.getMockContacts().map(contact => this.mapZohoToWolfDen(contact));
    }
  }

  /**
   * Search contacts with field mapping
   */
  async searchContactsMapped(searchTerm: string): Promise<any[]> {
    try {
      const zohoContacts = await this.searchContacts(searchTerm);
      return zohoContacts.map(contact => this.mapZohoToWolfDen(contact));
    } catch (error) {
      console.error('Error searching contacts:', error);
      return [];
    }
  }
}

// Export singleton instance
export const zohoCRMService = new ZohoCRMService({
  clientId: import.meta.env.VITE_ZOHO_CLIENT_ID,
  clientSecret: import.meta.env.VITE_ZOHO_CLIENT_SECRET,
  refreshToken: import.meta.env.VITE_ZOHO_REFRESH_TOKEN,
  apiDomain: import.meta.env.VITE_ZOHO_API_DOMAIN || 'zohoapis.com',
  fieldMapping: DEFAULT_ZOHO_FIELD_MAPPING
});

export default ZohoCRMService;
export type { ZohoContact };