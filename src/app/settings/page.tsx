'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getMockUsers } from '@/lib/mockData';

type SettingsTab = 'profile' | 'workspace' | 'notifications' | 'preferences' | 'team';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const mockUsers = getMockUsers();
  const currentUser = mockUsers[0];

  const tabs: { id: SettingsTab; label: string }[] = [
    { id: 'profile', label: 'Profile' },
    { id: 'workspace', label: 'Workspace' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'preferences', label: 'Preferences' },
    { id: 'team', label: 'Team Members' },
  ];

  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account and workspace preferences</p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <Card className="w-64 h-fit">
            <div className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </Card>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <Card>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>

                  <div className="space-y-6">
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-4xl">
                        {currentUser.avatar}
                      </div>
                      <div>
                        <Button variant="primary" size="sm">
                          Change Avatar
                        </Button>
                        <p className="text-xs text-gray-500 mt-2">
                          JPG, PNG or GIF. Max size 2MB
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          defaultValue={currentUser.name}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          defaultValue={currentUser.email}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Role
                        </label>
                        <input
                          type="text"
                          defaultValue={currentUser.role}
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 capitalize"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Time Zone
                        </label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option>UTC-8 (Pacific Time)</option>
                          <option>UTC-5 (Eastern Time)</option>
                          <option>UTC+0 (GMT)</option>
                          <option>UTC+1 (Central European Time)</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex gap-2">
                        <Button variant="primary">Save Changes</Button>
                        <Button variant="ghost">Cancel</Button>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Security</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <Button variant="primary">Update Password</Button>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'workspace' && (
              <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Workspace Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Workspace Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Product Management Workspace"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Workspace ID
                    </label>
                    <input
                      type="text"
                      defaultValue="pm-workspace-001"
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Sprint Duration
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>1 week</option>
                      <option selected>2 weeks</option>
                      <option>3 weeks</option>
                      <option>4 weeks</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Story Points Unit
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Fibonacci (1, 2, 3, 5, 8, 13, 21)</option>
                      <option>Linear (1, 2, 3, 4, 5, 6, 7, 8)</option>
                      <option>T-Shirt (XS, S, M, L, XL)</option>
                    </select>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <Button variant="primary">Save Changes</Button>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Email Notifications</h3>
                    <div className="space-y-3">
                      {[
                        { id: 'feature-updates', label: 'Feature updates', defaultChecked: true },
                        { id: 'sprint-changes', label: 'Sprint changes', defaultChecked: true },
                        { id: 'goal-progress', label: 'Goal progress updates', defaultChecked: true },
                        { id: 'release-notifications', label: 'Release notifications', defaultChecked: false },
                        { id: 'document-shares', label: 'Document shares', defaultChecked: true },
                        { id: 'comments-mentions', label: 'Comments and mentions', defaultChecked: true },
                      ].map((item) => (
                        <label key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">{item.label}</span>
                          <input type="checkbox" defaultChecked={item.defaultChecked} className="rounded" />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Push Notifications</h3>
                    <div className="space-y-3">
                      {[
                        { id: 'push-mentions', label: 'Mentions', defaultChecked: true },
                        { id: 'push-assignments', label: 'New assignments', defaultChecked: true },
                        { id: 'push-deadlines', label: 'Upcoming deadlines', defaultChecked: true },
                      ].map((item) => (
                        <label key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">{item.label}</span>
                          <input type="checkbox" defaultChecked={item.defaultChecked} className="rounded" />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <Button variant="primary">Save Preferences</Button>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'preferences' && (
              <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-6">UI Preferences</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Theme
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {['Light', 'Dark', 'System'].map((theme) => (
                        <button
                          key={theme}
                          className={`p-4 border-2 rounded-lg text-sm font-medium transition-colors ${
                            theme === 'Light'
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {theme}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Density
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {['Compact', 'Normal', 'Comfortable'].map((density) => (
                        <button
                          key={density}
                          className={`p-4 border-2 rounded-lg text-sm font-medium transition-colors ${
                            density === 'Normal'
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {density}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default View
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Dashboard</option>
                      <option>Backlog</option>
                      <option>Sprints</option>
                      <option>Goals</option>
                    </select>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Advanced Settings</h3>
                    <div className="space-y-3">
                      {[
                        { id: 'keyboard-shortcuts', label: 'Enable keyboard shortcuts', defaultChecked: true },
                        { id: 'animations', label: 'Enable animations', defaultChecked: true },
                        { id: 'auto-save', label: 'Auto-save changes', defaultChecked: true },
                        { id: 'compact-sidebar', label: 'Compact sidebar by default', defaultChecked: false },
                      ].map((item) => (
                        <label key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">{item.label}</span>
                          <input type="checkbox" defaultChecked={item.defaultChecked} className="rounded" />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <Button variant="primary">Save Preferences</Button>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'team' && (
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Team Members</h2>
                  <Button variant="primary" size="sm">
                    + Invite Member
                  </Button>
                </div>

                <div className="space-y-3">
                  {mockUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-2xl">
                          {user.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            user.role === 'admin'
                              ? 'error'
                              : user.role === 'manager'
                              ? 'warning'
                              : 'default'
                          }
                        >
                          {user.role}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Pending Invitations</h3>
                  <div className="text-sm text-gray-500 text-center py-4">
                    No pending invitations
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
