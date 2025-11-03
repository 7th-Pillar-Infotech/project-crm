'use client';

import React from 'react';
import { FeatureActivity } from '@/types';

interface ActivityTabProps {
  activities: FeatureActivity[];
}

const getActivityIcon = (type: FeatureActivity['type']) => {
  const icons: Record<FeatureActivity['type'], string> = {
    created: '✨',
    updated: '✏️',
    status_changed: '🔄',
    assigned: '👤',
    commented: '💬',
  };
  return icons[type];
};

export const ActivityTab: React.FC<ActivityTabProps> = ({ activities }) => {
  if (activities.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">📝</div>
        <p className="text-gray-600">No activity yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
              {getActivityIcon(activity.type)}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  <span className="font-semibold">{activity.user.name}</span> {activity.description}
                </p>
                {activity.field && (
                  <p className="text-xs text-gray-600 mt-1">
                    {activity.field}: <span className="line-through">{activity.oldValue}</span> →{' '}
                    <span className="font-semibold">{activity.newValue}</span>
                  </p>
                )}
              </div>
              <span className="flex-shrink-0 text-xs text-gray-500">
                {new Date(activity.timestamp).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: new Date(activity.timestamp).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
                })}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
