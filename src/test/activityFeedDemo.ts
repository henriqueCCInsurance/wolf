import { useActivityStore } from '@/services/activityTracking';
import { User } from '@/types';

// Demo function to populate activity feed with sample data
export const populateActivityFeedDemo = () => {
  const { addActivity } = useActivityStore.getState();
  
  // Sample users
  const users: User[] = [
    {
      id: '1',
      email: 'john.smith@campbell.com',
      name: 'John Smith',
      role: 'salesperson',
      createdAt: new Date(),
    },
    {
      id: '2',
      email: 'sarah.jones@campbell.com',
      name: 'Sarah Jones',
      role: 'salesperson',
      createdAt: new Date(),
    },
    {
      id: '3',
      email: 'mike.wilson@campbell.com',
      name: 'Mike Wilson',
      role: 'salesperson',
      createdAt: new Date(),
    },
  ];
  
  // Add various activities with different timestamps
  const now = new Date();
  
  // Recent activities (last few minutes)
  addActivity('call-made', users[0], {
    companyName: 'TechCorp Solutions',
    contactName: 'Emily Chen',
    outcome: 'meeting-booked',
    duration: 720,
  });
  
  // 5 minutes ago
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
  addActivity('meeting-booked', users[1], {
    companyName: 'Global Industries Inc',
    contactName: 'Robert Taylor',
    meetingType: 'discovery',
  });
  
  // 15 minutes ago
  const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
  addActivity('battle-card-created', users[2], {
    companyName: 'StartupXYZ',
    contactName: 'Lisa Anderson',
    industry: 'technology',
  });
  
  // 30 minutes ago
  const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
  addActivity('success-celebration', users[0], {
    celebrationType: 'meeting-booked',
    milestone: 'Meeting Booked!',
  });
  
  // 1 hour ago
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  addActivity('lead-qualified', users[1], {
    companyName: 'Manufacturing Co',
    contactName: 'James Miller',
    score: 85,
  });
  
  // 2 hours ago
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  addActivity('call-made', users[2], {
    companyName: 'Retail Solutions Ltd',
    contactName: 'Maria Garcia',
    outcome: 'follow-up',
    duration: 420,
  });
  
  // 3 hours ago
  const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
  addActivity('sequence-completed', users[0], {
    sequenceName: 'Q1 Healthcare Prospects',
    totalContacts: 25,
    successRate: 32,
  });
  
  // Yesterday
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  addActivity('milestone-reached', users[1], {
    milestone: '50 Calls This Week',
    value: 50,
  });
  
  console.log('Activity feed populated with demo data!');
};

// Function to simulate real-time activities
export const simulateRealTimeActivities = () => {
  const { addActivity } = useActivityStore.getState();
  
  const users: User[] = [
    {
      id: '1',
      email: 'john.smith@campbell.com',
      name: 'John Smith',
      role: 'salesperson',
      createdAt: new Date(),
    },
    {
      id: '2',
      email: 'sarah.jones@campbell.com',
      name: 'Sarah Jones',
      role: 'salesperson',
      createdAt: new Date(),
    },
  ];
  
  const activities = [
    () => addActivity('call-made', users[Math.floor(Math.random() * users.length)], {
      companyName: 'Dynamic Corp',
      contactName: 'Alex Brown',
      outcome: Math.random() > 0.5 ? 'meeting-booked' : 'follow-up',
      duration: Math.floor(Math.random() * 900) + 300,
    }),
    () => addActivity('battle-card-created', users[Math.floor(Math.random() * users.length)], {
      companyName: 'Innovation Labs',
      contactName: 'Chris Davis',
      industry: 'technology',
    }),
    () => addActivity('meeting-booked', users[Math.floor(Math.random() * users.length)], {
      companyName: 'Enterprise Solutions',
      contactName: 'Pat Johnson',
      meetingType: 'benefits-review',
    }),
  ];
  
  // Add a random activity every 10-30 seconds
  setInterval(() => {
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    randomActivity();
  }, (Math.random() * 20 + 10) * 1000);
};