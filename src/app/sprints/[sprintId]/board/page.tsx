'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  BackIcon,
  CalendarIcon,
  UsersIcon,
} from '@/components/icons';
import { Avatar } from '@/components/Avatar';
import { mockUsers } from '@/data/mockData';
import { Sprint } from '@/types/sprint';

// Mock sprint data
const MOCK_SPRINTS: Record<string, Sprint> = {
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
  { id: 'CM-001', userId: 'user-1', featureId: 'FEAT-001', content: 'Started implementing JWT authentication', createdAt: '2024-10-20T09:00:00Z' },
  { id: 'CM-002', userId: 'user-2', featureId: 'FEAT-001', content: 'Need to add refresh token logic', createdAt: '2024-10-20T10:30:00Z' },
  { id: 'CM-003', userId: 'user-3', featureId: 'FEAT-002', content: 'UI design looks good, proceeding with implementation', createdAt: '2024-10-20T11:00:00Z' },
  { id: 'CM-004', userId: 'user-1', featureId: 'FEAT-003', content: 'Filter logic completed and tested', createdAt: '2024-10-20T14:00:00Z' },
  { id: 'CM-005', userId: 'user-2', featureId: 'FEAT-004', content: 'Modal animations are smooth', createdAt: '2024-10-21T09:00:00Z' },
  { id: 'CM-006', userId: 'user-3', featureId: 'FEAT-005', content: 'Drag-drop functionality working perfectly', createdAt: '2024-10-21T10:30:00Z' },
  { id: 'CM-007', userId: 'user-1', featureId: 'FEAT-001', content: 'Tests passing, ready for code review', createdAt: '2024-10-21T15:00:00Z' },
];

// Mock activity data
const MOCK_ACTIVITY = [
  { id: 'ACT-001', userId: 'user-1', action: 'started task', featureId: 'FEAT-001', timestamp: '2024-10-20T09:00:00Z' },
  { id: 'ACT-002', userId: 'user-2', action: 'moved task to in-progress', featureId: 'FEAT-002', timestamp: '2024-10-20T09:30:00Z' },
  { id: 'ACT-003', userId: 'user-3', action: 'completed task', featureId: 'FEAT-003', timestamp: '2024-10-20T14:00:00Z' },
  { id: 'ACT-004', userId: 'user-1', action: 'moved task to review', featureId: 'FEAT-004', timestamp: '2024-10-21T09:00:00Z' },
  { id: 'ACT-005', userId: 'user-2', action: 'started task', featureId: 'FEAT-005', timestamp: '2024-10-21T10:00:00Z' },
  { id: 'ACT-006', userId: 'user-3', action: 'added comment', featureId: 'FEAT-001', timestamp: '2024-10-21T11:00:00Z' },
  { id: 'ACT-007', userId: 'user-1', action: 'approved task', featureId: 'FEAT-003', timestamp: '2024-10-21T15:30:00Z' },
];

// Mock features data
const MOCK_FEATURES = [
  { id: 'FEAT-001', title: 'User Authentication System', status: 'in-review' },
  { id: 'FEAT-002', title: 'Backlog List View', status: 'in-progress' },
  { id: 'FEAT-003', title: 'Filter Sidebar', status: 'completed' },
  { id: 'FEAT-004', title: 'Modal Implementation', status: 'completed' },
  { id: 'FEAT-005', title: 'Sprint Planning UI', status: 'in-progress' },
];

export default function SprintBoardPage() {
  const params = useParams();
  const router = useRouter();
  const sprintId = params.sprintId as string;

  const sprint = MOCK_SPRINTS[sprintId];
  const [activeTab, setActiveTab] = useState<'comments' | 'activity' | 'sprint-data'>('comments');

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

  return (
    <AppLayout>
      <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/sprints/${sprintId}`)}
              className="flex items-center gap-2"
            >
              <BackIcon size={18} />
              Back
            </Button>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{sprint.name} - Board</h1>
              <p className="text-sm text-gray-600 mt-2">{sprint.goal}</p>
            </div>
          </div>
        </div>

        {/* Sprint Info Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
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
                <p className="text-sm font-medium text-gray-900">{sprint.teamMembers.length} members</p>
              </div>
            </div>

            {/* Tasks */}
            <div>
              <p className="text-xs text-gray-500">Tasks</p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {sprint.completedTasks}/{sprint.totalTasks} completed
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
                  style={{ width: `${sprint.committedPoints ? Math.round((sprint.completedPoints / sprint.committedPoints) * 100) : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Health Score */}
            <div>
              <p className="text-xs text-gray-500">Health</p>
              <p className="text-sm font-medium text-gray-900 mt-1">Good</p>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div className="bg-green-600 h-1.5 rounded-full transition-all" style={{ width: '85%' }}></div>
              </div>
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
              📋 Activity ({MOCK_ACTIVITY.length})
            </button>
            <button
              onClick={() => setActiveTab('sprint-data')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'sprint-data'
                  ? 'text-blue-600 bg-gray-100 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              📊 Sprint Data
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
                  const feature = MOCK_FEATURES.find(f => f.id === comment.featureId);
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
                  const feature = MOCK_FEATURES.find(f => f.id === activity.featureId);
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

          {/* Sprint Data Tab with Graphs */}
          {activeTab === 'sprint-data' && (
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
                          <span className="text-sm font-bold text-gray-900">{item.points} pts</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${item.color} h-2 rounded-full`}
                            style={{ width: `${(item.points / 55) * 100}%` }}
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
                      { userId: 'user-1', name: 'Alice Johnson', tasks: 4, points: 15 },
                      { userId: 'user-2', name: 'Bob Smith', tasks: 4, points: 14 },
                      { userId: 'user-3', name: 'Charlie Brown', tasks: 4, points: 12 },
                    ].map((member) => (
                      <div key={member.userId}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Avatar name={member.name} size="sm" />
                            <span className="text-sm font-medium text-gray-700">{member.name}</span>
                          </div>
                          <span className="text-sm font-bold text-gray-900">{member.tasks} tasks / {member.points} pts</span>
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(member.tasks / 4) * 100}%` }}></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Tasks</p>
                          </div>
                          <div className="flex-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-600 h-2 rounded-full" style={{ width: `${(member.points / 15) * 100}%` }}></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Points</p>
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
                      { label: 'Low', count: 3, color: 'bg-green-600' },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                            <span className="text-sm font-medium text-gray-700">{item.label}</span>
                          </div>
                          <span className="text-sm font-bold text-gray-900">{item.count} tasks</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className={`${item.color} h-2 rounded-full`} style={{ width: `${(item.count / 12) * 100}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Sprint Summary */}
                <Card variant="outlined" padding="md" className="lg:col-span-2">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Sprint Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                      <p className="text-xs text-blue-600 font-semibold">Total Tasks</p>
                      <p className="text-2xl font-bold text-blue-900 mt-2">{sprint.totalTasks}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                      <p className="text-xs text-green-600 font-semibold">Completed</p>
                      <p className="text-2xl font-bold text-green-900 mt-2">{sprint.completedTasks}</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
                      <p className="text-xs text-orange-600 font-semibold">Total Points</p>
                      <p className="text-2xl font-bold text-orange-900 mt-2">{sprint.committedPoints}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                      <p className="text-xs text-purple-600 font-semibold">Completed Pts</p>
                      <p className="text-2xl font-bold text-purple-900 mt-2">{sprint.completedPoints}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <p className="text-xs text-gray-600 font-semibold">Task Completion Rate</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">
                        {sprint.totalTasks ? Math.round(((sprint.completedTasks || 0) / sprint.totalTasks) * 100) : 0}%
                      </p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <p className="text-xs text-gray-600 font-semibold">Points Completion Rate</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">
                        {sprint.committedPoints ? Math.round((sprint.completedPoints / sprint.committedPoints) * 100) : 0}%
                      </p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <p className="text-xs text-gray-600 font-semibold">Team Members</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">{sprint.teamMembers.length}</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
