'use client';

// Mark this page as dynamic since it uses useSearchParams
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  BackIcon,
  CalendarIcon,
  UsersIcon,
  PlusIcon,
} from '@/components/icons';
import { Avatar } from '@/components/Avatar';
import { mockUsers } from '@/data/mockData';
import { Sprint } from '@/types/sprint';
import { Feature } from '@/types';

// Mock sprint data
const MOCK_SPRINTS: Record<string, Sprint> = {
  'SPRINT-001': {
    id: 'SPRINT-001',
    name: 'Sprint 1',
    goal: 'Implement core authentication and user management features',
    type: 'regular',
    status: 'completed',
    startDate: '2024-10-01',
    endDate: '2024-10-15',
    teamMembers: ['user-1', 'user-2'],
    totalCapacity: 40,
    committedPoints: 35,
    completedPoints: 35,
    totalTasks: 8,
    completedTasks: 8,
    createdAt: '2024-09-25T10:00:00Z',
    updatedAt: '2024-10-15T18:00:00Z',
  },
  'SPRINT-002': {
    id: 'SPRINT-002',
    name: 'Sprint 2',
    goal: 'Build backlog management system with filters and sorting',
    type: 'regular',
    status: 'active',
    startDate: '2024-10-16',
    endDate: '2024-10-30',
    teamMembers: ['user-1', 'user-2', 'user-3'],
    totalCapacity: 60,
    committedPoints: 55,
    completedPoints: 28,
    totalTasks: 12,
    completedTasks: 6,
    createdAt: '2024-10-10T10:00:00Z',
    updatedAt: new Date().toISOString(),
  },
};

// Mock comments data
const MOCK_COMMENTS = [
  { id: 'CM-001', userId: 'user-1', featureId: 'FEAT-001', content: 'Started implementing JWT authentication with refresh token support', createdAt: '2024-10-20T09:00:00Z' },
  { id: 'CM-002', userId: 'user-2', featureId: 'FEAT-001', content: 'Need to add refresh token logic and token expiration handling', createdAt: '2024-10-20T10:30:00Z' },
  { id: 'CM-003', userId: 'user-3', featureId: 'FEAT-002', content: 'Completed the backlog list view table structure', createdAt: '2024-10-20T14:15:00Z' },
  { id: 'CM-004', userId: 'user-1', featureId: 'FEAT-003', content: 'Added advanced filtering with multiple conditions', createdAt: '2024-10-20T16:45:00Z' },
  { id: 'CM-005', userId: 'user-2', featureId: 'FEAT-002', content: 'We should add sorting functionality as well for better UX', createdAt: '2024-10-21T09:20:00Z' },
  { id: 'CM-006', userId: 'user-3', featureId: 'FEAT-004', content: 'Modal component is ready for testing with different sizes', createdAt: '2024-10-21T11:10:00Z' },
  { id: 'CM-007', userId: 'user-1', featureId: 'FEAT-005', content: 'Sprint planning drag-drop interface working smoothly', createdAt: '2024-10-21T13:50:00Z' },
];

// Mock activity data
const MOCK_ACTIVITY = [
  { id: 'ACT-001', userId: 'user-1', action: 'started task', featureId: 'FEAT-001', timestamp: '2024-10-20T09:00:00Z' },
  { id: 'ACT-002', userId: 'user-2', action: 'moved to in-progress', featureId: 'FEAT-002', timestamp: '2024-10-20T10:00:00Z' },
  { id: 'ACT-003', userId: 'user-3', action: 'started task', featureId: 'FEAT-003', timestamp: '2024-10-20T11:30:00Z' },
  { id: 'ACT-004', userId: 'user-1', action: 'completed', featureId: 'FEAT-004', timestamp: '2024-10-20T15:00:00Z' },
  { id: 'ACT-005', userId: 'user-2', action: 'moved to in-progress', featureId: 'FEAT-005', timestamp: '2024-10-20T17:30:00Z' },
  { id: 'ACT-006', userId: 'user-3', action: 'commented on', featureId: 'FEAT-001', timestamp: '2024-10-21T08:00:00Z' },
  { id: 'ACT-007', userId: 'user-1', action: 'updated priority to high', featureId: 'FEAT-002', timestamp: '2024-10-21T10:45:00Z' },
];

// Mock features data for references in comments/activity
const MOCK_FEATURES_REFERENCE = [
  { id: 'FEAT-001', title: 'User Authentication System' },
  { id: 'FEAT-002', title: 'Backlog List View' },
  { id: 'FEAT-003', title: 'Filter Sidebar' },
  { id: 'FEAT-004', title: 'Modal Implementation' },
  { id: 'FEAT-005', title: 'Sprint Planning UI' },
];

// Mock features data for Sprint Features tab
const MOCK_SPRINT_FEATURES: Feature[] = [
  {
    id: 'FEAT-001',
    title: 'User Authentication System',
    description: 'Implement JWT-based authentication with refresh tokens',
    status: 'in-progress',
    priority: 'high',
    tags: ['auth', 'backend', 'security'],
    storyPoints: 8,
    dueDate: '2024-10-25',
    owner: mockUsers[0],
    team: [mockUsers[0], mockUsers[1]],
    createdAt: '2024-10-10T10:00:00Z',
    updatedAt: '2024-10-20T15:30:00Z',
  },
  {
    id: 'FEAT-002',
    title: 'Backlog List View',
    description: 'Create table view for backlog with sorting and filtering',
    status: 'planned',
    priority: 'high',
    tags: ['ui', 'frontend', 'backlog'],
    storyPoints: 5,
    dueDate: '2024-10-27',
    owner: mockUsers[1],
    team: [mockUsers[1], mockUsers[2]],
    createdAt: '2024-10-12T09:00:00Z',
    updatedAt: '2024-10-20T10:00:00Z',
  },
  {
    id: 'FEAT-003',
    title: 'Filter Sidebar',
    description: 'Implement advanced filtering with multiple criteria',
    status: 'planned',
    priority: 'medium',
    tags: ['ui', 'frontend', 'filters'],
    storyPoints: 3,
    dueDate: '2024-10-28',
    owner: mockUsers[2],
    team: [mockUsers[2], mockUsers[0]],
    createdAt: '2024-10-13T14:30:00Z',
    updatedAt: '2024-10-19T11:00:00Z',
  },
  {
    id: 'FEAT-004',
    title: 'Modal Implementation',
    description: 'Create reusable modal component with animations',
    status: 'done',
    priority: 'medium',
    tags: ['components', 'ui', 'reusable'],
    storyPoints: 4,
    dueDate: '2024-10-20',
    owner: mockUsers[0],
    team: [mockUsers[0]],
    createdAt: '2024-10-08T08:00:00Z',
    updatedAt: '2024-10-20T16:00:00Z',
  },
  {
    id: 'FEAT-005',
    title: 'Sprint Planning UI',
    description: 'Build drag-drop interface for sprint planning',
    status: 'in-progress',
    priority: 'high',
    tags: ['ui', 'frontend', 'sprint'],
    storyPoints: 6,
    dueDate: '2024-10-29',
    owner: mockUsers[1],
    team: [mockUsers[1], mockUsers[2], mockUsers[0]],
    createdAt: '2024-10-15T13:00:00Z',
    updatedAt: '2024-10-21T09:30:00Z',
  },
];

export default function SprintDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sprintId = params.sprintId as string;

  const sprint = MOCK_SPRINTS[sprintId];
  const [activeTab, setActiveTab] = useState<'comments' | 'activity' | 'matrix' | 'features'>('comments');
  const [sprintFeatures, setSprintFeatures] = useState<Feature[]>(MOCK_SPRINT_FEATURES);

  // Handle tab parameter from URL query string
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['comments', 'activity', 'matrix', 'features'].includes(tabParam)) {
      setActiveTab(tabParam as 'comments' | 'activity' | 'matrix' | 'features');
    }
  }, [searchParams]);

  if (!sprint) {
    return (
      <AppLayout>
        <div className="flex flex-col h-screen bg-gray-50 items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
            <p className="text-lg text-gray-600 mb-4">Sprint not found</p>
            <Button variant="primary" onClick={() => router.push('/sprints')}>
              Back to Sprints
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const getProgressPercentage = () => {
    if (sprint.committedPoints === 0) return 0;
    return Math.round((sprint.completedPoints / sprint.committedPoints) * 100);
  };

  const getStatusBorderColor = (status: Feature['status']) => {
    const colors = {
      'backlog': 'border-l-gray-400',
      'planned': 'border-l-blue-400',
      'in-progress': 'border-l-yellow-400',
      'done': 'border-l-green-400',
      'archived': 'border-l-slate-400',
    };
    return colors[status];
  };

  const handleFeatureCardClick = (feature: Feature, e: React.MouseEvent) => {
    // Only navigate if not clicking on interactive elements
    if ((e.target as HTMLElement).closest('select, button, input')) {
      return;
    }
    router.push(`/backlog/modal/${feature.id}`);
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/sprints')}
              className="flex items-center gap-2"
            >
              <BackIcon size={18} />
              Back
            </Button>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{sprint.name}</h1>
              <p className="text-sm text-gray-600 mt-2">{sprint.goal}</p>
              <div className="flex items-center gap-3 mt-3">
                <Badge variant="info" size="sm" className="capitalize">
                  {sprint.status}
                </Badge>
                <span className="text-xs text-gray-500">
                  {sprint.type.charAt(0).toUpperCase() + sprint.type.slice(1)} Sprint
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sprint Info Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Dates */}
            <div className="flex items-center gap-2">
              <CalendarIcon size={18} className="text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Duration</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Team */}
            <div className="flex items-center gap-2">
              <UsersIcon size={18} className="text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Team</p>
                <div className="flex gap-1 mt-1">
                  {sprint.teamMembers.slice(0, 3).map(memberId => {
                    const user = mockUsers.find(u => u.id === memberId);
                    return (
                      <div key={memberId}>
                        <Avatar name={user?.name || 'Unknown'} size="sm" />
                      </div>
                    );
                  })}
                  {sprint.teamMembers.length > 3 && (
                    <span className="text-xs text-gray-600 ml-1">
                      +{sprint.teamMembers.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Tasks */}
            <div>
              <p className="text-xs text-gray-500">Tasks</p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {sprint.completedTasks || 0}/{sprint.totalTasks || 0} completed
              </p>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div
                  className="bg-green-600 h-1.5 rounded-full transition-all"
                  style={{ width: `${sprint.totalTasks ? Math.round(((sprint.completedTasks || 0) / sprint.totalTasks) * 100) : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Points */}
            <div>
              <p className="text-xs text-gray-500">Points</p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {sprint.completedPoints}/{sprint.committedPoints} pts
              </p>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>

            {/* Completion % */}
            <div>
              <p className="text-xs text-gray-500">Task Completion</p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {sprint.totalTasks ? Math.round(((sprint.completedTasks || 0) / sprint.totalTasks) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('comments')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'comments'
                  ? 'text-blue-600 bg-gray-100 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              💬 Comments ({MOCK_COMMENTS.length})
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'activity'
                  ? 'text-blue-600 bg-gray-100 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              📊 Activity ({MOCK_ACTIVITY.length})
            </button>
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'matrix'
                  ? 'text-blue-600 bg-gray-100 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              📈 Matrix
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'features'
                  ? 'text-blue-600 bg-gray-100 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              ✨ Features ({sprintFeatures.length})
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {/* Comments Tab */}
          {activeTab === 'comments' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Sprint Comments</h2>
              <div className="space-y-4 max-w-4xl">
                {MOCK_COMMENTS.map((comment) => {
                  const user = mockUsers.find(u => u.id === comment.userId);
                  const feature = MOCK_FEATURES_REFERENCE.find(f => f.id === comment.featureId);
                  return (
                    <Card key={comment.id} variant="outlined" padding="md" className="hover:shadow-lg transition-all">
                      <div className="flex gap-4">
                        <Avatar name={user?.name || 'Unknown'} size="md" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-semibold text-gray-900">{user?.name}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                on {feature?.title} ({comment.featureId})
                              </p>
                            </div>
                            <p className="text-xs text-gray-500">
                              {new Date(comment.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <p className="text-sm text-gray-700 mt-3">{comment.content}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Sprint Activity Timeline</h2>
              <div className="space-y-4 max-w-4xl">
                {MOCK_ACTIVITY.map((activity, index) => {
                  const user = mockUsers.find(u => u.id === activity.userId);
                  const feature = MOCK_FEATURES_REFERENCE.find(f => f.id === activity.featureId);
                  const isLast = index === MOCK_ACTIVITY.length - 1;

                  return (
                    <div key={activity.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <Avatar name={user?.name || 'Unknown'} size="md" />
                        {!isLast && (
                          <div className="w-1 h-12 bg-gray-300 mt-2"></div>
                        )}
                      </div>
                      <Card variant="outlined" padding="md" className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              <span className="text-blue-600">{user?.name}</span>
                              {' '}
                              <span className="text-gray-700">{activity.action}</span>
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {feature?.title} ({activity.featureId})
                            </p>
                          </div>
                          <p className="text-xs text-gray-500 flex-shrink-0">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Matrix/Data Tab */}
          {activeTab === 'matrix' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Sprint Data & Analytics</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Task Distribution */}
                <Card variant="outlined" padding="md">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Task Distribution</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Completed', count: 6, color: 'bg-green-600' },
                      { label: 'In Progress', count: 3, color: 'bg-yellow-600' },
                      { label: 'In Review', count: 2, color: 'bg-blue-600' },
                      { label: 'To Do', count: 1, color: 'bg-gray-600' },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{item.label}</span>
                          <span className="text-sm font-bold text-gray-900">{item.count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${item.color} h-2 rounded-full`}
                            style={{ width: `${(item.count / 12) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Story Points Distribution */}
                <Card variant="outlined" padding="md">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Story Points Distribution</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Completed', points: 12, color: 'bg-green-600' },
                      { label: 'In Progress', points: 11, color: 'bg-yellow-600' },
                      { label: 'In Review', points: 7, color: 'bg-blue-600' },
                      { label: 'To Do', points: 8, color: 'bg-gray-600' },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{item.label}</span>
                          <span className="text-sm font-bold text-gray-900">{item.points}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${item.color} h-2 rounded-full`}
                            style={{ width: `${(item.points / 38) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Team Performance */}
                <Card variant="outlined" padding="md">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Team Performance</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Alice Johnson', tasks: 5, points: 13 },
                      { name: 'Bob Smith', tasks: 4, points: 11 },
                      { name: 'Carol White', tasks: 3, points: 14 },
                    ].map((member) => (
                      <div key={member.name} className="pb-3 border-b border-gray-200 last:pb-0 last:border-b-0">
                        <p className="text-sm font-semibold text-gray-900 mb-2">{member.name}</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-600">Tasks:</span>
                            <span className="ml-1 font-bold text-gray-900">{member.tasks}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Points:</span>
                            <span className="ml-1 font-bold text-gray-900">{member.points}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Priority Breakdown */}
                <Card variant="outlined" padding="md">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Priority Breakdown</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Critical', count: 1, color: 'bg-red-600' },
                      { label: 'High', count: 4, color: 'bg-orange-600' },
                      { label: 'Medium', count: 4, color: 'bg-yellow-600' },
                      { label: 'Low', count: 3, color: 'bg-blue-600' },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{item.label}</span>
                          <span className="text-sm font-bold text-gray-900">{item.count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${item.color} h-2 rounded-full`}
                            style={{ width: `${(item.count / 12) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Sprint Summary */}
                <Card variant="outlined" padding="md" className="lg:col-span-2">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Sprint Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 font-medium">Total Tasks</p>
                      <p className="text-2xl font-bold text-blue-600 mt-2">{sprint.totalTasks || 0}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 font-medium">Completed Tasks</p>
                      <p className="text-2xl font-bold text-green-600 mt-2">{sprint.completedTasks || 0}</p>
                      <p className="text-xs text-gray-600 mt-2">
                        {sprint.totalTasks ? Math.round(((sprint.completedTasks || 0) / sprint.totalTasks) * 100) : 0}%
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 font-medium">Total Points</p>
                      <p className="text-2xl font-bold text-purple-600 mt-2">{sprint.committedPoints}</p>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 font-medium">Completed Points</p>
                      <p className="text-2xl font-bold text-indigo-600 mt-2">{sprint.completedPoints}</p>
                      <p className="text-xs text-gray-600 mt-2">
                        {getProgressPercentage()}%
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Features Tab */}
          {activeTab === 'features' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Sprint Features</h2>
                <Button
                  variant="primary"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => router.push(`/backlog/modal/new?returnUrl=${encodeURIComponent(`/sprints/${sprintId}?tab=features`)}`)}
                >
                  <PlusIcon size={16} />
                  Add Feature
                </Button>
              </div>

              {sprintFeatures.length > 0 ? (
                <div className="space-y-3 max-w-5xl">
                  {sprintFeatures.map((feature) => (
                    <Card
                      key={feature.id}
                      variant="outlined"
                      padding="md"
                      className={`hover:shadow-lg transition-all border-l-4 ${getStatusBorderColor(feature.status)} cursor-pointer`}
                      onClick={(e) => handleFeatureCardClick(feature, e)}
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className="text-base font-semibold text-blue-600 line-clamp-1"
                            >
                              {feature.title}
                            </span>
                            <Badge
                              variant="info"
                              size="sm"
                              className="text-xs flex-shrink-0"
                            >
                              {feature.id}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-1">{feature.description}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
                        {/* Status - Editable Dropdown */}
                        <div>
                          <p className="text-xs text-gray-500 font-medium mb-0.5">Status</p>
                          <select
                            value={feature.status}
                            onChange={(e) => {
                              setSprintFeatures(prev =>
                                prev.map(f =>
                                  f.id === feature.id ? { ...f, status: e.target.value as Feature['status'] } : f
                                )
                              );
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full px-1.5 py-0.5 border border-gray-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="backlog">Backlog</option>
                            <option value="planned">Planned</option>
                            <option value="in-progress">In Prog</option>
                            <option value="done">Done</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>

                        {/* Priority */}
                        <div>
                          <p className="text-xs text-gray-500 font-medium mb-0.5">Priority</p>
                          <Badge
                            variant={
                              feature.priority === 'critical'
                                ? 'error'
                                : feature.priority === 'high'
                                ? 'warning'
                                : feature.priority === 'medium'
                                ? 'info'
                                : 'default'
                            }
                            size="sm"
                            className="capitalize text-xs"
                          >
                            {feature.priority}
                          </Badge>
                        </div>

                        {/* Story Points */}
                        <div>
                          <p className="text-xs text-gray-500 font-medium mb-0.5">Points</p>
                          <p className="text-xs font-bold text-gray-900">{feature.storyPoints || '-'}</p>
                        </div>

                        {/* Due Date */}
                        <div>
                          <p className="text-xs text-gray-500 font-medium mb-0.5">Due Date</p>
                          <p className="text-xs text-gray-900">
                            {feature.dueDate
                              ? new Date(feature.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                              : '-'}
                          </p>
                        </div>

                        {/* Owner */}
                        <div>
                          <p className="text-xs text-gray-500 font-medium mb-0.5">Owner</p>
                          <div className="flex items-center gap-1">
                            {feature.owner ? (
                              <>
                                <Avatar name={feature.owner.name} size="sm" />
                                <span className="text-xs text-gray-700 truncate">{feature.owner.name.split(' ')[0]}</span>
                              </>
                            ) : (
                              <span className="text-xs text-gray-500">-</span>
                            )}
                          </div>
                        </div>

                        {/* Assignees/Team */}
                        <div>
                          <p className="text-xs text-gray-500 font-medium mb-0.5">Team</p>
                          <div className="flex gap-0.5">
                            {feature.team && feature.team.slice(0, 2).map(member => (
                              <Avatar key={member.id} name={member.name} size="sm" />
                            ))}
                            {feature.team && feature.team.length > 2 && (
                              <span className="text-xs text-gray-500 flex items-center">+{feature.team.length - 2}</span>
                            )}
                          </div>
                        </div>

                        {/* Tags */}
                        <div>
                          <p className="text-xs text-gray-500 font-medium mb-0.5">Tags</p>
                          <div className="flex gap-0.5">
                            {feature.tags.slice(0, 1).map(tag => (
                              <Badge key={tag} variant="default" size="sm" className="text-xs py-0.5">
                                {tag}
                              </Badge>
                            ))}
                            {feature.tags.length > 1 && (
                              <span className="text-xs text-gray-500">+{feature.tags.length - 1}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-lg text-gray-500 mb-2">No features in this sprint</p>
                  <p className="text-sm text-gray-400 mb-4">
                    Add features to this sprint by creating new features in the backlog
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => router.push(`/backlog/modal/new?returnUrl=${encodeURIComponent(`/sprints/${sprintId}?tab=features`)}`)}
                  >
                    <PlusIcon size={16} />
                    Create First Feature
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
