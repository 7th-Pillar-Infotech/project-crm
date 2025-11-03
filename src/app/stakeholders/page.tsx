'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { StakeholderRole, EngagementLevel, SentimentScore } from '@/types/stakeholders';
import { mockStakeholders } from '@/lib/mockStakeholdersData';
import { Plus, Filter, SortAsc, Search, Grid3x3, List, BarChart3, Users, TrendingUp } from 'lucide-react';

type ViewMode = 'grid' | 'list' | 'table' | 'map';

const engagementColors: Record<EngagementLevel, string> = {
  'high': 'bg-green-50 text-green-700 border-green-200',
  'medium': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'low': 'bg-red-50 text-red-700 border-red-200',
};

const sentimentColors: Record<SentimentScore, string> = {
  'very-positive': 'text-green-600',
  'positive': 'text-lime-600',
  'neutral': 'text-gray-600',
  'negative': 'text-orange-600',
  'very-negative': 'text-red-600',
};

const sentimentEmoji: Record<SentimentScore, string> = {
  'very-positive': '😍',
  'positive': '😊',
  'neutral': '😐',
  'negative': '😕',
  'very-negative': '😠',
};

const roleIcons: Record<StakeholderRole, string> = {
  'executive': '👔',
  'manager': '📊',
  'developer': '💻',
  'qa': '✓',
  'product-owner': '🎯',
  'designer': '🎨',
  'marketing': '📢',
  'sales': '💼',
  'support': '🆘',
  'other': '👤',
};

export default function StakeholdersPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<StakeholderRole | null>(null);
  const [engagementFilter, setEngagementFilter] = useState<EngagementLevel | null>(null);
  const [sentimentFilter, setSentimentFilter] = useState<SentimentScore | null>(null);
  const [sortBy, setSortBy] = useState<'engagement' | 'name' | 'updated'>('engagement');
  const [showFilters, setShowFilters] = useState(false);

  const filteredStakeholders = useMemo(() => {
    let stakeholders = [...mockStakeholders];

    if (searchQuery) {
      stakeholders = stakeholders.filter(
        (s) =>
          s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (roleFilter) {
      stakeholders = stakeholders.filter((s) => s.role === roleFilter);
    }

    if (engagementFilter) {
      stakeholders = stakeholders.filter((s) => s.engagementLevel === engagementFilter);
    }

    if (sentimentFilter) {
      stakeholders = stakeholders.filter((s) => s.overallSentiment === sentimentFilter);
    }

    stakeholders.sort((a, b) => {
      if (sortBy === 'engagement') return b.engagementScore - a.engagementScore;
      if (sortBy === 'name') return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
      if (sortBy === 'updated') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      return 0;
    });

    return stakeholders;
  }, [searchQuery, roleFilter, engagementFilter, sentimentFilter, sortBy]);

  const engagementStats = useMemo(() => {
    return {
      high: mockStakeholders.filter((s) => s.engagementLevel === 'high').length,
      medium: mockStakeholders.filter((s) => s.engagementLevel === 'medium').length,
      low: mockStakeholders.filter((s) => s.engagementLevel === 'low').length,
    };
  }, []);

  const getDaysSince = (date: string) => {
    const now = new Date().getTime();
    const past = new Date(date).getTime();
    const days = Math.floor((now - past) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Stakeholders</h1>
              <p className="text-gray-600 mt-2">Manage and track stakeholder engagement and feedback</p>
            </div>
            <button
              onClick={() => router.push('/stakeholders/create')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus size={20} />
              Add Stakeholder
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6 border-t-4 border-blue-500">
              <p className="text-sm text-gray-600">Total Stakeholders</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{mockStakeholders.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-t-4 border-green-500">
              <p className="text-sm text-gray-600">High Engagement</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{engagementStats.high}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-t-4 border-yellow-500">
              <p className="text-sm text-gray-600">Medium Engagement</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">{engagementStats.medium}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-t-4 border-red-500">
              <p className="text-sm text-gray-600">Low Engagement</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{engagementStats.low}</p>
            </div>
          </div>

          {/* Toolbar */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* View Mode Switcher */}
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
                  title="Grid View"
                >
                  <Grid3x3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
                  title="List View"
                >
                  <List size={18} />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded transition ${viewMode === 'table' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
                  title="Table View"
                >
                  <BarChart3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-2 rounded transition ${viewMode === 'map' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
                  title="Map View"
                >
                  <Users size={18} />
                </button>
              </div>

              {/* Search */}
              <div className="flex-1 max-w-xs relative">
                <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search stakeholders..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Filter & Sort */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  <Filter size={16} />
                  Filters
                </button>

                <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white">
                  <SortAsc size={16} />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'engagement' | 'name' | 'updated')}
                    className="bg-transparent outline-none cursor-pointer"
                  >
                    <option value="engagement">Engagement</option>
                    <option value="name">Name</option>
                    <option value="updated">Recently Updated</option>
                  </select>
                </div>
              </div>

              {/* Count */}
              <div className="text-sm text-gray-600">
                {filteredStakeholders.length} stakeholder{filteredStakeholders.length !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={roleFilter || ''}
                    onChange={(e) => setRoleFilter((e.target.value as StakeholderRole) || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">All Roles</option>
                    {(['executive', 'manager', 'developer', 'qa', 'product-owner', 'designer', 'marketing', 'sales', 'support'] as const).map((role) => (
                      <option key={role} value={role}>
                        {roleIcons[role]} {role.charAt(0).toUpperCase() + role.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Engagement Level</label>
                  <select
                    value={engagementFilter || ''}
                    onChange={(e) => setEngagementFilter((e.target.value as EngagementLevel) || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">All Levels</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sentiment</label>
                  <select
                    value={sentimentFilter || ''}
                    onChange={(e) => setSentimentFilter((e.target.value as SentimentScore) || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">All Sentiments</option>
                    <option value="very-positive">Very Positive</option>
                    <option value="positive">Positive</option>
                    <option value="neutral">Neutral</option>
                    <option value="negative">Negative</option>
                    <option value="very-negative">Very Negative</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStakeholders.map((stakeholder) => (
                <div
                  key={stakeholder.id}
                  onClick={() => router.push(`/stakeholders/${stakeholder.id}`)}
                  className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow-lg hover:border-blue-400 transition"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {stakeholder.firstName.charAt(0)}{stakeholder.lastName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {stakeholder.firstName} {stakeholder.lastName}
                        </h3>
                        <p className="text-xs text-gray-500">{stakeholder.title}</p>
                      </div>
                    </div>
                    <span className="text-2xl">{roleIcons[stakeholder.role]}</span>
                  </div>

                  {/* Department & Email */}
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <p className="text-xs text-gray-600">{stakeholder.department}</p>
                    <p className="text-xs text-gray-500 truncate">{stakeholder.email}</p>
                  </div>

                  {/* Engagement & Sentiment */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${engagementColors[stakeholder.engagementLevel]}`}>
                        {stakeholder.engagementLevel.charAt(0).toUpperCase() + stakeholder.engagementLevel.slice(1)} Engagement
                      </span>
                      <span className={`text-xl ${sentimentColors[stakeholder.overallSentiment]}`}>
                        {sentimentEmoji[stakeholder.overallSentiment]}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${stakeholder.engagementScore}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{stakeholder.engagementScore}% Engagement Score</p>
                  </div>

                  {/* Last Contact */}
                  <div className="text-xs text-gray-600">
                    <p>Last contacted: {stakeholder.lastContactedAt ? getDaysSince(stakeholder.lastContactedAt) : 'Never'}</p>
                  </div>

                  {/* Concerns Badge */}
                  {stakeholder.openConcerns.length > 0 && (
                    <div className="mt-3 p-2 bg-red-50 rounded border border-red-200">
                      <p className="text-xs font-medium text-red-700">
                        ⚠️ {stakeholder.openConcerns.length} Open Concern{stakeholder.openConcerns.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="space-y-3">
              {filteredStakeholders.map((stakeholder) => (
                <div
                  key={stakeholder.id}
                  onClick={() => router.push(`/stakeholders/${stakeholder.id}`)}
                  className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {stakeholder.firstName.charAt(0)}{stakeholder.lastName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{stakeholder.firstName} {stakeholder.lastName}</h3>
                        <span className="text-lg">{roleIcons[stakeholder.role]}</span>
                      </div>
                      <p className="text-sm text-gray-600">{stakeholder.title} • {stakeholder.department}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{stakeholder.engagementScore}%</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${engagementColors[stakeholder.engagementLevel]}`}>
                        {stakeholder.engagementLevel}
                      </span>
                    </div>
                    <span className={`text-2xl ${sentimentColors[stakeholder.overallSentiment]}`}>
                      {sentimentEmoji[stakeholder.overallSentiment]}
                    </span>
                    {stakeholder.openConcerns.length > 0 && (
                      <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                        ⚠️ {stakeholder.openConcerns.length}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Table View */}
          {viewMode === 'table' && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Department</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Engagement</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Sentiment</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Last Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStakeholders.map((stakeholder, idx) => (
                    <tr
                      key={stakeholder.id}
                      onClick={() => router.push(`/stakeholders/${stakeholder.id}`)}
                      className={`border-t border-gray-200 hover:bg-gray-50 transition cursor-pointer ${idx % 2 === 0 ? '' : 'bg-gray-50'}`}
                    >
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {stakeholder.firstName.charAt(0)}{stakeholder.lastName.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900">{stakeholder.firstName} {stakeholder.lastName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {roleIcons[stakeholder.role]} {stakeholder.role.charAt(0).toUpperCase() + stakeholder.role.slice(1).replace('-', ' ')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{stakeholder.department}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{stakeholder.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${engagementColors[stakeholder.engagementLevel]}`}>
                          {stakeholder.engagementLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-lg">
                        <span className={sentimentColors[stakeholder.overallSentiment]}>
                          {sentimentEmoji[stakeholder.overallSentiment]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {stakeholder.lastContactedAt ? getDaysSince(stakeholder.lastContactedAt) : 'Never'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Map View (Placeholder) */}
          {viewMode === 'map' && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-center py-12">
                <TrendingUp size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Engagement Map</h3>
                <p className="text-gray-600">Shows stakeholder engagement by department and influence</p>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  {['Product', 'Engineering', 'Sales', 'Support'].map((dept, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4">
                      <p className="font-medium text-gray-900">{dept}</p>
                      <p className="text-sm text-gray-600 mt-1">{Math.floor(Math.random() * 4) + 1} stakeholders</p>
                      <div className="mt-2 h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 rounded-full bg-blue-500"
                          style={{ width: `${Math.floor(Math.random() * 100) + 20}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
