import React from 'react';
import ReadyToCallIndicator from '@/components/callflow/ReadyToCallIndicator';
import Card from '@/components/common/Card';
import { Prospect } from '@/types';

const ReadyToCallIndicatorDemo: React.FC = () => {
  // Example prospects for each state
  const noProspect: Prospect | null = null;

  const prospectWithMissingRequired: Prospect = {
    companyName: 'Tech Corp',
    contactName: '', // Missing required field
    industry: 'Technology',
    persona: 'roi-focused-executive'
  };

  const prospectWithMissingOptional: Prospect = {
    companyName: 'Finance Inc',
    contactName: 'John Smith',
    industry: 'Financial Services',
    persona: 'cost-conscious-employer'
    // Missing optional contactPhone
  };

  const fullyReadyProspect: Prospect = {
    companyName: 'Healthcare Solutions',
    contactName: 'Jane Doe',
    contactPhone: '555-123-4567',
    industry: 'Healthcare',
    persona: 'benefits-optimizer'
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <Card title="Ready-to-Call Indicator Demo" subtitle="Showing all three states">
        <div className="space-y-6">
          {/* Red State - No Lead Selected */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Red State - No Lead Selected</h3>
            <ReadyToCallIndicator prospect={noProspect} />
            <p className="text-sm text-gray-600 mt-2">
              Shows when no prospect is selected. Clicking navigates to Call Planner.
            </p>
          </div>

          {/* Red State - Missing Required */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Red State - Missing Required Fields</h3>
            <ReadyToCallIndicator prospect={prospectWithMissingRequired} />
            <p className="text-sm text-gray-600 mt-2">
              Shows when required fields (contact name) are missing. Clicking navigates to Call Planner.
            </p>
          </div>

          {/* Yellow State - Missing Optional */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Yellow State - Missing Optional Info</h3>
            <ReadyToCallIndicator prospect={prospectWithMissingOptional} />
            <p className="text-sm text-gray-600 mt-2">
              Shows when basic requirements are met but optional fields (phone number) are missing. 
              Clicking navigates to Call Planner to complete the information.
            </p>
          </div>

          {/* Green State - Ready */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Green State - Ready to Call</h3>
            <ReadyToCallIndicator prospect={fullyReadyProspect} />
            <p className="text-sm text-gray-600 mt-2">
              Shows when all requirements are met. Not clickable as there's nothing to complete.
            </p>
          </div>
        </div>
      </Card>

      {/* Integration Example */}
      <Card title="Integration Example" subtitle="How it looks in context">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <div className="mb-4">
            <ReadyToCallIndicator prospect={prospectWithMissingOptional} />
          </div>
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              The indicator sits prominently near the timer in the Live Call Assistance view
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 rounded-lg shadow">
              <span className="text-2xl font-bold">00:00</span>
              <span className="text-sm text-gray-500">Call Timer</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReadyToCallIndicatorDemo;