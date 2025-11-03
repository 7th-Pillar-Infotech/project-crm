'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { mockSprints, mockGoals, mockReleases, mockFeatures } from '@/lib/mockData';

export default function ReportsPage() {
  const completedFeatures = mockFeatures.filter(f => f.status === 'done').length;
  const totalFeatures = mockFeatures.length;
  const completionRate = totalFeatures > 0 ? (completedFeatures / totalFeatures) * 100 : 0;

  const activeSprints = mockSprints.filter(s => s.status === 'active').length;
  const totalStoryPoints = mockFeatures.reduce((sum, f) => sum + (f.storyPoints || 0), 0);
  const avgStoryPoints = totalFeatures > 0 ? totalStoryPoints / totalFeatures : 0;

  const onTrackGoals = mockGoals.filter(g => g.status === 'on-track').length;
  const atRiskGoals = mockGoals.filter(g => g.status === 'at-risk').length;

  const avgReleaseHealth = mockReleases.reduce((sum, r) => sum + r.healthScore, 0) / mockReleases.length;

  const sprintData = mockSprints.map(sprint => ({
    name: sprint.name,
    velocity: sprint.velocity || 0,
    capacity: sprint.capacity || 0,
    completed: sprint.features.filter(f => f.status === 'done').length,
    total: sprint.features.length,
  }));

  const featuresByPriority = {
    critical: mockFeatures.filter(f => f.priority === 'critical').length,
    high: mockFeatures.filter(f => f.priority === 'high').length,
    medium: mockFeatures.filter(f => f.priority === 'medium').length,
    low: mockFeatures.filter(f => f.priority === 'low').length,
  };

  const featuresByStatus = {
    backlog: mockFeatures.filter(f => f.status === 'backlog').length,
    planned: mockFeatures.filter(f => f.status === 'planned').length,
    'in-progress': mockFeatures.filter(f => f.status === 'in-progress').length,
    done: mockFeatures.filter(f => f.status === 'done').length,
  };

  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-1">Track performance metrics and insights</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              Export Report
            </Button>
            <Button variant="primary" size="sm">
              Custom Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <div className="text-sm text-gray-500 mb-1">Total Features</div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{totalFeatures}</div>
            <div className="flex items-center gap-2">
              <Badge variant="success" size="sm">{completedFeatures} completed</Badge>
              <span className="text-xs text-gray-500">{Math.round(completionRate)}%</span>
            </div>
          </Card>

          <Card>
            <div className="text-sm text-gray-500 mb-1">Active Sprints</div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{activeSprints}</div>
            <div className="text-xs text-gray-500">
              {mockSprints.length} total sprints
            </div>
          </Card>

          <Card>
            <div className="text-sm text-gray-500 mb-1">Goals Status</div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{mockGoals.length}</div>
            <div className="flex items-center gap-2">
              <Badge variant="success" size="sm">{onTrackGoals} on-track</Badge>
              <Badge variant="warning" size="sm">{atRiskGoals} at-risk</Badge>
            </div>
          </Card>

          <Card>
            <div className="text-sm text-gray-500 mb-1">Avg Release Health</div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {Math.round(avgReleaseHealth)}%
            </div>
            <div className="text-xs text-gray-500">
              {mockReleases.length} releases tracked
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Sprint Analytics */}
          <Card>
            <h2 className="text-lg font-bold text-gray-900 mb-6">Sprint Performance</h2>
            <div className="space-y-4">
              {sprintData.map((sprint, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{sprint.name}</span>
                    <span className="text-sm text-gray-600">
                      {sprint.velocity} / {sprint.capacity} pts
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full"
                      style={{ width: `${(sprint.velocity / sprint.capacity) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Features: {sprint.completed} / {sprint.total}</span>
                    <span>Velocity: {Math.round((sprint.velocity / sprint.capacity) * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Feature Velocity */}
          <Card>
            <h2 className="text-lg font-bold text-gray-900 mb-6">Feature Velocity Trend</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm text-gray-500">Avg Story Points</div>
                  <div className="text-2xl font-bold text-gray-900">{avgStoryPoints.toFixed(1)}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Total Points</div>
                  <div className="text-2xl font-bold text-gray-900">{totalStoryPoints}</div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Last 30 Days</h3>
                <div className="h-32 flex items-end justify-between gap-2">
                  {[65, 59, 80, 81, 56, 75, 60].map((height, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600" style={{ height: `${height}%` }}></div>
                      <span className="text-xs text-gray-500">W{index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Features by Priority */}
          <Card>
            <h2 className="text-lg font-bold text-gray-900 mb-6">Features by Priority</h2>
            <div className="space-y-4">
              {Object.entries(featuresByPriority).map(([priority, count]) => {
                const percentage = totalFeatures > 0 ? (count / totalFeatures) * 100 : 0;
                const colors = {
                  critical: 'bg-red-500',
                  high: 'bg-orange-500',
                  medium: 'bg-yellow-500',
                  low: 'bg-green-500',
                };
                return (
                  <div key={priority}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 capitalize">{priority}</span>
                      <span className="text-sm text-gray-600">{count} features ({Math.round(percentage)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`${colors[priority as keyof typeof colors]} h-2.5 rounded-full`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Features by Status */}
          <Card>
            <h2 className="text-lg font-bold text-gray-900 mb-6">Features by Status</h2>
            <div className="space-y-4">
              {Object.entries(featuresByStatus).map(([status, count]) => {
                const percentage = totalFeatures > 0 ? (count / totalFeatures) * 100 : 0;
                const colors = {
                  backlog: 'bg-gray-500',
                  planned: 'bg-blue-500',
                  'in-progress': 'bg-yellow-500',
                  done: 'bg-green-500',
                };
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 capitalize">{status}</span>
                      <span className="text-sm text-gray-600">{count} features ({Math.round(percentage)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`${colors[status as keyof typeof colors]} h-2.5 rounded-full`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Goal Progress */}
        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-6">Goal Progress Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockGoals.map((goal) => (
              <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{goal.title}</h3>
                    <Badge
                      variant={
                        goal.status === 'on-track'
                          ? 'success'
                          : goal.status === 'at-risk'
                          ? 'warning'
                          : 'error'
                      }
                      size="sm"
                    >
                      {goal.status}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{goal.progress}%</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                  <div
                    className={`h-2.5 rounded-full ${
                      goal.status === 'on-track'
                        ? 'bg-green-500'
                        : goal.status === 'at-risk'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">
                  {goal.keyResults.length} key results • {goal.period}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Release Health */}
        <Card className="mt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Release Health Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockReleases.map((release) => {
              const completedFeatures = release.features.filter(f => f.status === 'done').length;
              const totalFeatures = release.features.length;
              const completionPercentage = totalFeatures > 0
                ? (completedFeatures / totalFeatures) * 100
                : 0;

              return (
                <div key={release.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{release.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant={release.status === 'released' ? 'success' : 'warning'} size="sm">
                          {release.status}
                        </Badge>
                        <span className="text-xs text-gray-500">{release.targetDate}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-2xl font-bold ${
                          release.healthScore >= 80
                            ? 'text-green-600'
                            : release.healthScore >= 60
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}
                      >
                        {release.healthScore}
                      </div>
                      <div className="text-xs text-gray-500">Health</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Features</span>
                      <span className="font-medium text-gray-900">
                        {completedFeatures} / {totalFeatures} ({Math.round(completionPercentage)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${completionPercentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Manager: {release.manager?.name}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
