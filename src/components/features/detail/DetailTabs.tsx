'use client';

import React, { useState } from 'react';
import { Feature, Comment, FeatureActivity, TestCase, FeatureVersion } from '@/types';
import { Card } from '@/components/ui/Card';
import { OverviewTab } from './tabs/OverviewTab';
import { ActivityTab } from './tabs/ActivityTab';
import { CommentsTab } from './tabs/CommentsTab';
import { TestingTab } from './tabs/TestingTab';
import { HistoryTab } from './tabs/HistoryTab';

interface DetailTabsProps {
  feature: Feature;
  comments: Comment[];
  activities: FeatureActivity[];
  testCases: TestCase[];
  versions: FeatureVersion[];
  onUpdateFeature: (feature: Feature) => void;
}

type TabType = 'overview' | 'activity' | 'comments' | 'testing' | 'history';

export const DetailTabs: React.FC<DetailTabsProps> = ({
  feature,
  comments,
  activities,
  testCases,
  versions,
  onUpdateFeature,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'activity', label: 'Activity', icon: '📝' },
    { id: 'comments', label: 'Comments', icon: '💬' },
    { id: 'testing', label: 'Testing', icon: '🧪' },
    { id: 'history', label: 'History', icon: '⏱️' },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <Card className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <OverviewTab feature={feature} onUpdate={onUpdateFeature} />
          )}
          {activeTab === 'activity' && <ActivityTab activities={activities} />}
          {activeTab === 'comments' && <CommentsTab comments={comments} featureId={feature.id} />}
          {activeTab === 'testing' && <TestingTab testCases={testCases} />}
          {activeTab === 'history' && <HistoryTab versions={versions} />}
        </div>
      </Card>
    </div>
  );
};
