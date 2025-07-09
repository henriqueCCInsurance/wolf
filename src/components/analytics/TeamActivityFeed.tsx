import React, { useEffect, useState } from 'react';
import Card from '@/components/common/Card';
import { 
  Phone, 
  Calendar, 
  FileText, 
  Trophy, 
  Target, 
  CheckCircle,
  Milestone,
  TrendingUp,
  Clock,
  Users
} from 'lucide-react';
import { Activity, ActivityType } from '@/types';
import { useActivityStore, formatRelativeTime, getInitials } from '@/services/activityTracking';
import { cn } from '@/lib/utils';

interface TeamActivityFeedProps {
  className?: string;
  limit?: number;
  userId?: string;
  activityType?: ActivityType;
  compact?: boolean;
}

const activityConfig: Record<ActivityType, {
  icon: React.ElementType;
  color: string;
  bgColor: string;
  getMessage: (activity: Activity) => string;
}> = {
  'call-made': {
    icon: Phone,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    getMessage: (activity) => {
      const { companyName, contactName, outcome, duration } = activity.data;
      const durationText = duration ? ` (${Math.round(duration / 60)} min)` : '';
      return `called ${contactName} at ${companyName}${durationText} - ${outcome}`;
    },
  },
  'meeting-booked': {
    icon: Calendar,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    getMessage: (activity) => {
      const { companyName, contactName, meetingType } = activity.data;
      const typeText = meetingType ? ` ${meetingType}` : '';
      return `booked a${typeText} meeting with ${contactName} at ${companyName}`;
    },
  },
  'battle-card-created': {
    icon: FileText,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    getMessage: (activity) => {
      const { companyName, contactName } = activity.data;
      return `created a battle card for ${contactName} at ${companyName}`;
    },
  },
  'success-celebration': {
    icon: Trophy,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    getMessage: (activity) => {
      const { celebrationType, milestone } = activity.data;
      return milestone 
        ? `achieved ${milestone} - ${celebrationType}`
        : `celebrated ${celebrationType}`;
    },
  },
  'lead-qualified': {
    icon: Target,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    getMessage: (activity) => {
      const { companyName, contactName, score } = activity.data;
      const scoreText = score ? ` (score: ${score})` : '';
      return `qualified ${contactName} at ${companyName}${scoreText}`;
    },
  },
  'sequence-completed': {
    icon: CheckCircle,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    getMessage: (activity) => {
      const { sequenceName, totalContacts, successRate } = activity.data;
      return `completed "${sequenceName}" - ${totalContacts} contacts, ${Math.round(successRate)}% success`;
    },
  },
  'milestone-reached': {
    icon: Milestone,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    getMessage: (activity) => {
      const { milestone, value } = activity.data;
      return `reached ${milestone}: ${value}`;
    },
  },
};

export const TeamActivityFeed: React.FC<TeamActivityFeedProps> = ({
  className,
  limit = 20,
  userId,
  activityType,
  compact = false,
}) => {
  const { getRecentActivities, getActivitiesByUser, getActivitiesByType } = useActivityStore();
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const loadActivities = () => {
      let fetchedActivities: Activity[];
      
      if (userId) {
        fetchedActivities = getActivitiesByUser(userId, limit);
      } else if (activityType) {
        fetchedActivities = getActivitiesByType(activityType, limit);
      } else {
        fetchedActivities = getRecentActivities(limit);
      }
      
      setActivities(fetchedActivities);
    };

    loadActivities();

    // Listen for real-time updates
    const handleActivityUpdate = () => {
      loadActivities();
    };

    window.addEventListener('activity-update', handleActivityUpdate);
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadActivities, 30000);

    return () => {
      window.removeEventListener('activity-update', handleActivityUpdate);
      clearInterval(interval);
    };
  }, [userId, activityType, limit, getRecentActivities, getActivitiesByUser, getActivitiesByType]);

  if (activities.length === 0) {
    return (
      <Card className={cn('p-6', className)}>
        <div className="text-center text-gray-500">
          <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">No recent activity</p>
          <p className="text-xs mt-1">Activities will appear here as the team makes progress</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-campbell-green" />
            Team Activity
          </h3>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Live feed
          </span>
        </div>
      </div>

      <div className={cn(
        'divide-y divide-gray-100 overflow-y-auto',
        compact ? 'max-h-96' : 'max-h-[600px]'
      )}>
        {activities.map((activity) => {
          const config = activityConfig[activity.type];
          const Icon = config.icon;

          return (
            <div
              key={activity.id}
              className="p-4 hover:bg-gray-50 transition-colors animate-fade-in"
            >
              <div className="flex gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {activity.userAvatar ? (
                    <img
                      src={activity.userAvatar}
                      alt={activity.userName}
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-campbell-green text-white flex items-center justify-center text-sm font-medium">
                      {getInitials(activity.userName)}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2">
                    <div className={cn(
                      'p-1.5 rounded-lg flex-shrink-0',
                      config.bgColor
                    )}>
                      <Icon className={cn('h-4 w-4', config.color)} />
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.userName}</span>
                        {' '}
                        <span className="text-gray-600">
                          {config.getMessage(activity)}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatRelativeTime(new Date(activity.timestamp))}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Success animation for certain activities */}
              {(activity.type === 'meeting-booked' || activity.type === 'success-celebration') && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 right-0 animate-ping">
                    <div className="h-2 w-2 bg-green-400 rounded-full" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!compact && activities.length >= limit && (
        <div className="p-3 bg-gray-50 text-center">
          <p className="text-xs text-gray-500">
            Showing most recent {limit} activities
          </p>
        </div>
      )}
    </Card>
  );
};