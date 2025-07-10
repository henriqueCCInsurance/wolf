import { Activity, ActivityType, User } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ActivityStore {
  activities: Activity[];
  addActivity: (type: ActivityType, user: User, data: Activity['data']) => void;
  getRecentActivities: (limit?: number) => Activity[];
  getActivitiesByUser: (userId: string, limit?: number) => Activity[];
  getActivitiesByType: (type: ActivityType, limit?: number) => Activity[];
  clearOldActivities: (daysToKeep?: number) => void;
}

export const useActivityStore = create<ActivityStore>()(
  persist(
    (set, get) => ({
      activities: [],
      
      addActivity: (type, user, data) => {
        const newActivity: Activity = {
          id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type,
          userId: user.id,
          userName: user.name,
          userAvatar: user.avatar,
          timestamp: new Date(),
          data,
        };
        
        set((state) => ({
          activities: [newActivity, ...state.activities].slice(0, 500), // Keep last 500 activities
        }));
        
        // Broadcast to other tabs/windows
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('activity-update', { detail: newActivity }));
        }
      },
      
      getRecentActivities: (limit = 20) => {
        const { activities } = get();
        return activities.slice(0, limit);
      },
      
      getActivitiesByUser: (userId, limit = 20) => {
        const { activities } = get();
        return activities
          .filter((activity) => activity.userId === userId)
          .slice(0, limit);
      },
      
      getActivitiesByType: (type, limit = 20) => {
        const { activities } = get();
        return activities
          .filter((activity) => activity.type === type)
          .slice(0, limit);
      },
      
      clearOldActivities: (daysToKeep = 7) => {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
        
        set((state) => ({
          activities: state.activities.filter(
            (activity) => activity.timestamp > cutoffDate
          ),
        }));
      },
    }),
    {
      name: 'team-activities',
      partialize: (state) => ({ activities: state.activities }),
    }
  )
);

// Activity tracking helper functions
export const trackCallMade = (user: User, data: {
  companyName: string;
  contactName: string;
  outcome: string;
  duration?: number;
}) => {
  useActivityStore.getState().addActivity('call-made', user, data);
};

export const trackMeetingBooked = (user: User, data: {
  companyName: string;
  contactName: string;
  meetingType?: string;
}) => {
  useActivityStore.getState().addActivity('meeting-booked', user, data);
};

export const trackCallCardCreated = (user: User, data: {
  companyName: string;
  contactName: string;
  industry: string;
}) => {
  useActivityStore.getState().addActivity('battle-card-created', user, data);
};

export const trackSuccessCelebration = (user: User, data: {
  celebrationType: string;
  milestone?: string;
}) => {
  useActivityStore.getState().addActivity('success-celebration', user, data);
};

export const trackLeadQualified = (user: User, data: {
  companyName: string;
  contactName: string;
  score?: number;
}) => {
  useActivityStore.getState().addActivity('lead-qualified', user, data);
};

export const trackSequenceCompleted = (user: User, data: {
  sequenceName: string;
  totalContacts: number;
  successRate: number;
}) => {
  useActivityStore.getState().addActivity('sequence-completed', user, data);
};

export const trackMilestoneReached = (user: User, data: {
  milestone: string;
  value: number;
}) => {
  useActivityStore.getState().addActivity('milestone-reached', user, data);
};

// Format relative time
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
};

// Generate initials from name
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};