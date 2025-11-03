'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  BackIcon,
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
    createdAt: '2024-10-10T10:00:00Z',
    updatedAt: new Date().toISOString(),
  },
};

// Mock historical sprint data for velocity chart
const HISTORICAL_SPRINTS = [
  { name: 'Sprint 1', velocity: 35, capacity: 40 },
  { name: 'Sprint 2', velocity: 28, capacity: 60 },
];

// Mock team performance data
const TEAM_PERFORMANCE = [
  { userId: 'user-1', name: 'Alice Johnson', tasksCompleted: 12, velocity: 25 },
  { userId: 'user-2', name: 'Bob Smith', tasksCompleted: 10, velocity: 21 },
  { userId: 'user-3', name: 'Charlie Brown', tasksCompleted: 6, velocity: 15 },
];

export default function SprintAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const sprintId = params.sprintId as string;

  const sprint = MOCK_SPRINTS[sprintId];

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

  // Calculate metrics
  const completionPercentage = Math.round((sprint.completedPoints / sprint.committedPoints) * 100);
  const velocityPercentageValue = (sprint.completedPoints / sprint.totalCapacity) * 100;
  const velocityPercentage = velocityPercentageValue.toFixed(1);
  const daysElapsed = Math.floor(
    (new Date(sprint.endDate).getTime() - new Date(sprint.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  const daysRemaining = Math.max(0, daysElapsed - Math.floor(daysElapsed / 2));

  // Sprint health score (0-100)
  const healthScore = Math.min(100, Math.round((completionPercentage * 0.6) + (velocityPercentageValue * 0.4)));

  // Average cycle time (in days)
  const avgCycleTime = (daysElapsed / sprint.completedPoints * 2).toFixed(1);

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
              Back to Sprint
            </Button>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">{sprint.name} - Analytics</h1>
            <p className="text-sm text-gray-600 mt-2">Sprint performance and metrics</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Completion Rate */}
              <Card variant="outlined" padding="md" className="border-t-4 border-t-blue-500">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-medium mb-1">Completion Rate</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold text-gray-900">{completionPercentage}%</p>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      {sprint.completedPoints}/{sprint.committedPoints} points
                    </p>
                  </div>
                  <div className="text-4xl text-blue-100">📊</div>
                </div>
              </Card>

              {/* Velocity */}
              <Card variant="outlined" padding="md" className="border-t-4 border-t-green-500">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-medium mb-1">Velocity</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold text-gray-900">{sprint.completedPoints}</p>
                      <span className="text-sm text-gray-600">pts</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      {velocityPercentage}% of capacity
                    </p>
                  </div>
                  <div className="text-4xl text-green-100">⚡</div>
                </div>
              </Card>

              {/* Capacity Utilization */}
              <Card variant="outlined" padding="md" className="border-t-4 border-t-purple-500">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-medium mb-1">Capacity Used</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold text-gray-900">{sprint.committedPoints}</p>
                      <span className="text-sm text-gray-600">/{sprint.totalCapacity}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      {Math.round((sprint.committedPoints / sprint.totalCapacity) * 100)}% utilization
                    </p>
                  </div>
                  <div className="text-4xl text-purple-100">🎯</div>
                </div>
              </Card>

              {/* Sprint Health Score */}
              <Card variant="outlined" padding="md" className="border-t-4 border-t-amber-500">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-medium mb-1">Sprint Health</p>
                    <div className="flex items-center gap-3">
                      <div className="relative w-16 h-16">
                        <svg className="w-16 h-16 transform -rotate-90">
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="4"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            fill="none"
                            stroke={
                              healthScore >= 80
                                ? '#10b981'
                                : healthScore >= 60
                                ? '#f59e0b'
                                : '#ef4444'
                            }
                            strokeWidth="4"
                            strokeDasharray={`${(healthScore / 100) * 175.93} 175.93`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-bold text-gray-900">{healthScore}</span>
                        </div>
                      </div>
                      <div>
                        <Badge
                          variant={
                            healthScore >= 80
                              ? 'success'
                              : healthScore >= 60
                              ? 'warning'
                              : 'error'
                          }
                          size="sm"
                          className="capitalize"
                        >
                          {healthScore >= 80 ? 'Good' : healthScore >= 60 ? 'Fair' : 'Poor'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Burndown Chart */}
              <Card variant="outlined" padding="md">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Sprint Burndown</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Progress Over Time</p>
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 h-64 flex items-end justify-between gap-2">
                      {/* Simple bar chart representation */}
                      {[
                        { day: 'Day 1', completed: 10, ideal: 55 },
                        { day: 'Day 2', completed: 15, ideal: 49 },
                        { day: 'Day 3', completed: 20, ideal: 43 },
                        { day: 'Day 4', completed: 28, ideal: 36 },
                      ].map((data, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                          <div className="relative w-full h-48 flex flex-col-reverse">
                            <div
                              className="bg-blue-500 rounded-t-sm w-full transition-all"
                              style={{ height: `${(data.completed / 55) * 100}%` }}
                            />
                            <div
                              className="border-t-2 border-orange-500 w-full absolute"
                              style={{ bottom: `${(data.ideal / 55) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-600 text-center">{data.day}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span className="text-gray-700">Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border-t-2 border-orange-500"></div>
                      <span className="text-gray-700">Ideal Trend</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Velocity Trend */}
              <Card variant="outlined" padding="md">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Velocity Trend</h3>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">Last 2 Sprints</p>
                  <div className="space-y-3">
                    {HISTORICAL_SPRINTS.map((sprint, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{sprint.name}</span>
                          <span className="text-sm font-bold text-gray-900">{sprint.velocity} pts</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                            style={{ width: `${(sprint.velocity / sprint.capacity) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-600">
                      Average Velocity:{' '}
                      <span className="font-bold text-gray-900">
                        {Math.round(
                          HISTORICAL_SPRINTS.reduce((sum, s) => sum + s.velocity, 0) /
                            HISTORICAL_SPRINTS.length
                        )}{' '}
                        pts
                      </span>
                    </p>
                  </div>
                </div>
              </Card>

              {/* Cycle Time */}
              <Card variant="outlined" padding="md">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Cycle Time Analysis</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Average Cycle Time</p>
                      <p className="text-2xl font-bold text-purple-900">{avgCycleTime} days</p>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Days Remaining</p>
                      <p className="text-2xl font-bold text-indigo-900">{daysRemaining} days</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-2">Time Distribution</p>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-1">In Progress</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '40%' }} />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-1">In Review</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '30%' }} />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-1">Completed</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Team Performance */}
              <Card variant="outlined" padding="md">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Team Performance</h3>
                <div className="space-y-3">
                  {TEAM_PERFORMANCE.map((member) => {
                    const user = mockUsers.find(u => u.id === member.userId);
                    return (
                      <div key={member.userId} className="flex items-start justify-between pb-3 border-b border-gray-200 last:border-b-0">
                        <div className="flex items-center gap-2">
                          <Avatar name={user?.name || member.name} size="sm" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user?.name || member.name}</p>
                            <p className="text-xs text-gray-500">{member.tasksCompleted} tasks completed</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">{member.velocity} pts</p>
                          <p className="text-xs text-gray-500">velocity</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card variant="outlined" padding="md">
                <p className="text-xs text-gray-500 font-medium mb-2">Sprint Duration</p>
                <div className="flex items-baseline gap-2 mb-3">
                  <p className="text-2xl font-bold text-gray-900">{daysElapsed}</p>
                  <span className="text-sm text-gray-600">days</span>
                </div>
                <p className="text-xs text-gray-600">
                  {new Date(sprint.startDate).toLocaleDateString()} -{' '}
                  {new Date(sprint.endDate).toLocaleDateString()}
                </p>
              </Card>

              <Card variant="outlined" padding="md">
                <p className="text-xs text-gray-500 font-medium mb-2">Team Size</p>
                <div className="flex items-baseline gap-2 mb-3">
                  <p className="text-2xl font-bold text-gray-900">{sprint.teamMembers.length}</p>
                  <span className="text-sm text-gray-600">members</span>
                </div>
                <div className="flex gap-1">
                  {sprint.teamMembers.map(memberId => {
                    const user = mockUsers.find(u => u.id === memberId);
                    return (
                      <Avatar
                        key={memberId}
                        name={user?.name || 'Unknown'}
                        size="sm"
                      />
                    );
                  })}
                </div>
              </Card>

              <Card variant="outlined" padding="md">
                <p className="text-xs text-gray-500 font-medium mb-2">Sprint Type</p>
                <div className="flex items-baseline gap-2 mb-3">
                  <p className="text-lg font-bold text-gray-900 capitalize">{sprint.type}</p>
                </div>
                <Badge variant="info" size="sm" className="capitalize">
                  {sprint.status}
                </Badge>
              </Card>
            </div>

            {/* Export Section */}
            <Card variant="outlined" padding="md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Export Report</h3>
                  <p className="text-sm text-gray-600 mt-1">Download sprint analytics as PDF or CSV</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">
                    📄 Export PDF
                  </Button>
                  <Button variant="secondary" size="sm">
                    📊 Export CSV
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
