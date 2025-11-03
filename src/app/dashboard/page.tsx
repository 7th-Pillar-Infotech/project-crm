'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getMockFeatures, getMockSprints, getMockGoals, getMockActivities, getMockReleases } from '@/lib/mockData';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const features = getMockFeatures();
  const sprints = getMockSprints();
  const goals = getMockGoals();
  const activities = getMockActivities();
  const releases = getMockReleases();

  const activeSprint = sprints.find((s) => s.status === 'active');
  const nextRelease = releases[0];
  const activeFeatures = features.filter((f) => f.status === 'in-progress').length;
  const goalsOnTrack = goals.filter((g) => g.status === 'on-track').length;

  const velocityData = [
    { sprint: 'S1', velocity: 18 },
    { sprint: 'S2', velocity: 22 },
    { sprint: 'S3', velocity: 20 },
    { sprint: 'S4', velocity: 25 },
    { sprint: 'S5', velocity: 21 },
    { sprint: 'S6', velocity: 28 },
  ];

  const sprintProgress = activeSprint
    ? Math.round(
        (features.filter((f) => f.status === 'done').length /
          activeSprint.features.length) *
          100
      )
    : 0;

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-gray-600">Welcome! Here&apos;s your overview.</p>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card variant="elevated">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-600">Active Features</h3>
                  <span className="text-2xl">✨</span>
                </div>
                <div className="flex items-end space-x-2">
                  <span className="text-3xl font-bold text-gray-900">{activeFeatures}</span>
                  <Badge variant="success" size="sm">↑ 12%</Badge>
                </div>
              </div>
            </Card>

            <Card variant="elevated">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-600">Sprint Progress</h3>
                  <span className="text-2xl">🏃</span>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gray-900">{sprintProgress}%</div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600" style={{ width: `${sprintProgress}%` }} />
                  </div>
                </div>
              </div>
            </Card>

            <Card variant="elevated">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-600">Goals on Track</h3>
                  <span className="text-2xl">🎯</span>
                </div>
                <span className="text-3xl font-bold text-gray-900">{goalsOnTrack}/{goals.length}</span>
              </div>
            </Card>

            <Card variant="elevated">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-600">Next Release</h3>
                  <span className="text-2xl">🚀</span>
                </div>
                <div className="flex items-end space-x-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {Math.ceil((new Date(nextRelease.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}
                  </span>
                  <span className="text-xs text-gray-600">days</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="mb-8 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card variant="elevated" padding="lg">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Activity</h2>
                <div className="space-y-4">
                  {activities.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 border-b border-gray-100 pb-4 last:border-0">
                      <span className="flex-shrink-0 text-2xl">{activity.details.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.details.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.user.name} {activity.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="space-y-4">
              <Card variant="elevated" padding="lg">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Velocity Trend</h3>
                <ResponsiveContainer width="100%" height={150}>
                  <AreaChart data={velocityData}>
                    <defs>
                      <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="sprint" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Area type="monotone" dataKey="velocity" stroke="#3b82f6" fill="url(#colorVelocity)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              <Card variant="elevated" className="bg-gradient-to-br from-blue-50 to-blue-100">
                <p className="text-xs font-medium text-blue-700">AVG VELOCITY</p>
                <p className="mt-1 text-2xl font-bold text-blue-900">22.5 pts</p>
              </Card>
            </div>
          </div>

          <Card variant="elevated" padding="lg">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Upcoming Deadlines</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Feature</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Priority</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Due Date</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {features.filter((f) => f.dueDate).slice(0, 5).map((feature) => (
                    <tr key={feature.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900">{feature.title}</td>
                      <td className="px-4 py-3">
                        <Badge size="sm" variant={feature.priority === 'critical' ? 'error' : 'warning'}>
                          {feature.priority}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge size="sm" variant={feature.status === 'done' ? 'success' : 'info'}>
                          {feature.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(feature.dueDate!).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <Badge size="sm">{feature.storyPoints}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
