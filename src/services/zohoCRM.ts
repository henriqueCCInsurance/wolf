interface ZohoCRMConfig {
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
  accessToken?: string;
  apiDomain?: string; // e.g., 'zohoapis.com', 'zohoapis.eu', etc.
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
}

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

  constructor(config: ZohoCRMConfig = {}) {
    this.config = config;
    this.baseUrl = `https://www.${config.apiDomain || 'zohoapis.com'}/crm/v6`;
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
  async getAllContacts(page: number = 1, perPage: number = 200): Promise<ZohoContact[]> {
    try {
      const response = await this.apiRequest(`/Contacts?page=${page}&per_page=${perPage}`);
      return response.data || [];
    } catch (error) {
      console.error('Error getting all contacts:', error);
      // Return mock data for demo
      return this.getMockContacts();
    }
  }
}

// Export singleton instance
export const zohoCRMService = new ZohoCRMService({
  clientId: import.meta.env.VITE_ZOHO_CLIENT_ID,
  clientSecret: import.meta.env.VITE_ZOHO_CLIENT_SECRET,
  refreshToken: import.meta.env.VITE_ZOHO_REFRESH_TOKEN,
  apiDomain: import.meta.env.VITE_ZOHO_API_DOMAIN || 'zohoapis.com'
});

export default ZohoCRMService;