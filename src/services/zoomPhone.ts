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
   * Initiate a call using Zoom Phone URI scheme with fallback
   */
  async initiateCall(callData: CallData): Promise<{ success: boolean; method: 'zoom' | 'tel' | 'failed'; message?: string }> {
    try {
      // Format phone number (remove any non-numeric characters except +)
      const cleanNumber = callData.phoneNumber.replace(/[^\d+]/g, '');
      
      if (!cleanNumber) {
        return {
          success: false,
          method: 'failed',
          message: 'Invalid phone number provided'
        };
      }

      // Check if Zoom Phone is compatible first (synchronous check)
      if (!this.isZoomPhoneCompatible()) {
        console.log('Zoom Phone: Not compatible with this device, using fallback');
        return this.fallbackToTelLink(cleanNumber);
      }

      // Record call start time for duration tracking
      this.callStartTime = Date.now();
      
      // Create Zoom Phone URI
      const zoomUri = `zoomphonecall://${cleanNumber}`;
      
      // Attempt to open Zoom Phone with timeout
      const callAttempt = new Promise<boolean>((resolve) => {
        // Set up blur detection to see if Zoom Phone opened
        let hasBlurred = false;
        
        const handleBlur = () => {
          hasBlurred = true;
          resolve(true);
        };

        const handleFocus = () => {
          // If focus returns quickly, Zoom Phone likely didn't open
          setTimeout(() => {
            if (!hasBlurred) {
              resolve(false);
            }
          }, 500);
        };

        window.addEventListener('blur', handleBlur, { once: true });
        window.addEventListener('focus', handleFocus, { once: true });
        
        // Try to open Zoom Phone
        window.location.href = zoomUri;
        
        // Timeout after 2 seconds
        setTimeout(() => {
          if (!hasBlurred) {
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
            resolve(false);
          }
        }, 2000);
      });

      const zoomOpened = await callAttempt;
      
      if (zoomOpened) {
        // Log successful call attempt
        console.log('Zoom Phone call initiated successfully:', {
          number: cleanNumber,
          contact: callData.contactName,
          company: callData.companyName,
          leadId: callData.leadId
        });
        
        return {
          success: true,
          method: 'zoom',
          message: 'Call initiated via Zoom Phone'
        };
      } else {
        // Fallback to tel: link
        console.log('Zoom Phone: Failed to open, falling back to tel: link');
        return this.fallbackToTelLink(cleanNumber);
      }
      
    } catch (error) {
      console.error('Failed to initiate Zoom Phone call:', error);
      return {
        success: false,
        method: 'failed',
        message: `Failed to initiate call: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Fallback to standard tel: link for mobile or when Zoom Phone is unavailable
   */
  private fallbackToTelLink(phoneNumber: string): { success: boolean; method: 'tel'; message: string } {
    try {
      const telUri = `tel:${phoneNumber}`;
      window.location.href = telUri;
      
      return {
        success: true,
        method: 'tel',
        message: 'Call initiated via device phone app'
      };
    } catch (error) {
      return {
        success: false,
        method: 'tel' as const,
        message: 'Failed to initiate fallback call'
      };
    }
  }

  /**
   * Alternative method using Zoom Web SDK (requires setup)
   */
  async initiateCallWithSDK(callData: CallData): Promise<boolean> {
    try {
      // This would require Zoom Web SDK integration
      // For now, fallback to URI scheme
      const result = await this.initiateCall(callData);
      return result.success;
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
   * Check if Zoom Phone is likely installed and available
   */
  async isZoomPhoneAvailable(): Promise<boolean> {
    try {
      // Method 1: Check if we're on desktop (Zoom Phone is desktop-only)
      const userAgent = navigator.userAgent.toLowerCase();
      const isDesktop = !userAgent.includes('mobile') && !userAgent.includes('tablet');
      
      if (!isDesktop) {
        console.log('Zoom Phone: Not available - mobile/tablet device detected');
        return false;
      }

      // Method 2: Try to detect Zoom Phone protocol handler
      // This is a more sophisticated check using a hidden iframe
      return new Promise((resolve) => {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.style.position = 'absolute';
        iframe.style.top = '-1000px';
        
        let hasBlurred = false;
        
        // If Zoom Phone is available, the window will blur when the protocol is triggered
        const handleBlur = () => {
          hasBlurred = true;
          resolve(true);
        };

        // Timeout if no blur event occurs
        const timeout = setTimeout(() => {
          if (!hasBlurred) {
            console.log('Zoom Phone: Not detected - no protocol handler response');
            resolve(false);
          }
          window.removeEventListener('blur', handleBlur);
          document.body.removeChild(iframe);
        }, 1000);

        window.addEventListener('blur', handleBlur);
        document.body.appendChild(iframe);
        
        // Test with a dummy phone number
        iframe.src = 'zoomphonecall://test-availability-check';
        
        // Clean up if blur event fires
        if (hasBlurred) {
          clearTimeout(timeout);
          window.removeEventListener('blur', handleBlur);
          document.body.removeChild(iframe);
        }
      });
    } catch (error) {
      console.warn('Zoom Phone availability check failed:', error);
      return false;
    }
  }

  /**
   * Synchronous check for basic Zoom Phone compatibility
   */
  isZoomPhoneCompatible(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    const isDesktop = !userAgent.includes('mobile') && !userAgent.includes('tablet');
    
    // Check for supported platforms
    const isWindows = userAgent.includes('windows');
    const isMac = userAgent.includes('mac');
    const isLinux = userAgent.includes('linux') && !userAgent.includes('android');
    
    return isDesktop && (isWindows || isMac || isLinux);
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