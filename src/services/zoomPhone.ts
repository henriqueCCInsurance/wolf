interface ZoomPhoneConfig {
  apiKey?: string;
  apiSecret?: string;
  accountId?: string;
}

interface CallData {
  phoneNumber: string;
  contactName?: string;
  companyName?: string;
  leadId?: string;
}

interface CallEvent {
  type: 'call_started' | 'call_ended' | 'call_failed';
  duration?: number;
  recordingUrl?: string;
  transcriptUrl?: string;
}

class ZoomPhoneService {
  private config: ZoomPhoneConfig;
  private callStartTime: number | null = null;

  constructor(config: ZoomPhoneConfig = {}) {
    this.config = config;
  }

  /**
   * Initiate a call using Zoom Phone URI scheme
   * This works if Zoom Phone is installed on the user's device
   */
  initiateCall(callData: CallData): boolean {
    try {
      // Format phone number (remove any non-numeric characters except +)
      const cleanNumber = callData.phoneNumber.replace(/[^\d+]/g, '');
      
      // Create Zoom Phone URI
      const zoomUri = `zoomphonecall://${cleanNumber}`;
      
      // Record call start time for duration tracking
      this.callStartTime = Date.now();
      
      // Attempt to open Zoom Phone
      window.location.href = zoomUri;
      
      // Log call attempt
      console.log('Zoom Phone call initiated:', {
        number: cleanNumber,
        contact: callData.contactName,
        company: callData.companyName,
        leadId: callData.leadId
      });
      
      return true;
    } catch (error) {
      console.error('Failed to initiate Zoom Phone call:', error);
      return false;
    }
  }

  /**
   * Alternative method using Zoom Web SDK (requires setup)
   */
  async initiateCallWithSDK(callData: CallData): Promise<boolean> {
    try {
      // This would require Zoom Web SDK integration
      // For now, fallback to URI scheme
      return this.initiateCall(callData);
    } catch (error) {
      console.error('Failed to initiate call with SDK:', error);
      return false;
    }
  }

  /**
   * Get call duration since call started
   */
  getCallDuration(): number {
    if (!this.callStartTime) return 0;
    return Math.floor((Date.now() - this.callStartTime) / 1000);
  }

  /**
   * End call tracking
   */
  endCall(): CallEvent {
    const duration = this.getCallDuration();
    this.callStartTime = null;
    
    return {
      type: 'call_ended',
      duration
    };
  }

  /**
   * Check if Zoom Phone is likely installed
   */
  isZoomPhoneAvailable(): boolean {
    // This is a basic check - in production, you'd want more sophisticated detection
    const userAgent = navigator.userAgent.toLowerCase();
    const isDesktop = !userAgent.includes('mobile') && !userAgent.includes('tablet');
    
    // Zoom Phone is primarily a desktop application
    return isDesktop;
  }

  /**
   * Setup webhook endpoint for call events (for production)
   * This would be called during app initialization
   */
  setupWebhooks(webhookUrl: string): Promise<boolean> {
    // In production, this would register webhook endpoints with Zoom
    // For now, we'll simulate this
    console.log('Zoom Phone webhooks would be setup at:', webhookUrl);
    return Promise.resolve(true);
  }

  /**
   * Get call recordings (requires API credentials)
   */
  async getCallRecordings(_dateFrom: string, _dateTo: string): Promise<any[]> {
    if (!this.config.apiKey) {
      console.warn('Zoom API credentials not configured');
      return [];
    }

    // In production, this would make actual API calls to Zoom
    // For now, return mock data
    return [
      {
        id: 'recording_1',
        duration: 180,
        date: new Date().toISOString(),
        transcriptUrl: '/api/zoom/transcript/recording_1'
      }
    ];
  }

  /**
   * Get call transcript (requires API credentials)
   */
  async getCallTranscript(_recordingId: string): Promise<string | null> {
    if (!this.config.apiKey) {
      console.warn('Zoom API credentials not configured');
      return null;
    }

    // In production, this would fetch actual transcripts
    // For now, return mock transcript
    return `
      Speaker 1: Hello, this is John from Campbell & Co.
      Speaker 2: Hi John, thanks for calling.
      Speaker 1: I wanted to discuss your employee benefits program...
      Speaker 2: That sounds interesting, tell me more.
    `;
  }
}

// Export singleton instance
export const zoomPhoneService = new ZoomPhoneService({
  // These would be loaded from environment variables in production
  apiKey: import.meta.env.VITE_ZOOM_API_KEY,
  apiSecret: import.meta.env.VITE_ZOOM_API_SECRET,
  accountId: import.meta.env.VITE_ZOOM_ACCOUNT_ID
});

export default ZoomPhoneService;