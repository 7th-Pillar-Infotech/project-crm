'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { ReleaseStatus } from '@/types/releases';
import { mockReleases } from '@/lib/mockReleasesData';
import { ChevronDown, Plus, Filter, SortAsc, List, Calendar, Search, TrendingUp } from 'lucide-react';

type ViewMode = 'timeline' | 'list' | 'roadmap';

const statusColors: Record<ReleaseStatus, string> = {
  'planning': 'bg-blue-50 text-blue-700 border-blue-200',
  'in-progress': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'complete': 'bg-green-50 text-green-700 border-green-200',
  'archived': 'bg-gray-50 text-gray-700 border-gray-200',
};

const statusBgColor: Record<ReleaseStatus, string> = {
  'planning': 'bg-blue-500',
  'in-progress': 'bg-yellow-500',
  'complete': 'bg-green-500',
  'archived': 'bg-gray-500',
};

const healthColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 50) return 'text-yellow-600';
  return 'text-red-600';
};

export default function ReleasesPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [statusFilter, setStatusFilter] = useState<ReleaseStatus | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'status'>('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  const filteredReleases = useMemo(() => {
    let releases = [...mockReleases];

    if (statusFilter) {
      releases = releases.filter((r) => r.status === statusFilter);
    }

    if (searchQuery) {
      releases = releases.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.version.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    releases.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.targetDate).getTime() - new Date(a.targetDate).getTime();
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return releases;
  }, [statusFilter, searchQuery, sortBy]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDaysUntil = (date: string) => {
    const target = new Date(date).getTime();
    const now = new Date().getTime();
    const days = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getMonthYear = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  };

  const timelineItems = useMemo(() => {
    return filteredReleases.sort(
      (a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
    );
  }, [filteredReleases]);

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Releases</h1>
              <p className="text-gray-600 mt-2">Manage product releases and deployment</p>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowCreateMenu(!showCreateMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Plus size={20} />
                  Create Release
                  <ChevronDown size={16} />
                </button>
                {showCreateMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                    <button
                      onClick={() => {
                        router.push('/releases/create');
                        setShowCreateMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-200"
                    >
                      <span className="text-lg">➕</span> Create New Release
                    </button>
                    <button
                      onClick={() => {
                        setShowCreateMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                    >
                      <span className="text-lg">📋</span> Create from Template
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* View Mode Switcher */}
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`p-2 rounded transition ${viewMode === 'timeline' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
                  title="Timeline View"
                >
                  <Calendar size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
                  title="List View"
                >
                  <List size={18} />
                </button>
                <button
                  onClick={() => setViewMode('roadmap')}
                  className={`p-2 rounded transition ${viewMode === 'roadmap' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
                  title="Roadmap View"
                >
                  <TrendingUp size={18} />
                </button>
              </div>

              {/* Search */}
              <div className="flex-1 max-w-xs relative">
                <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search releases..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Filter & Sort Controls */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button
                    onClick={() => setShowStatusFilter(!showStatusFilter)}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                    <Filter size={16} />
                    Status {statusFilter && <span className="ml-1">✓</span>}
                  </button>
                  {showStatusFilter && (
                    <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                      <button
                        onClick={() => {
                          setStatusFilter(null);
                          setShowStatusFilter(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
                      >
                        All Statuses
                      </button>
                      {(['planning', 'in-progress', 'complete'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setStatusFilter(status);
                            setShowStatusFilter(false);
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 border-t border-gray-100"
                        >
                          {status === 'planning' && '📋 Planning'}
                          {status === 'in-progress' && '🔄 In Progress'}
                          {status === 'complete' && '✓ Complete'}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white">
                  <SortAsc size={16} />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'status')}
                    className="bg-transparent outline-none cursor-pointer"
                  >
                    <option value="date">Date</option>
                    <option value="name">Name</option>
                    <option value="status">Status</option>
                  </select>
                </div>
              </div>

              {/* Count */}
              <div className="text-sm text-gray-600">
                {filteredReleases.length} release{filteredReleases.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Timeline View */}
          {viewMode === 'timeline' && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Release Timeline</h3>
                <div className="space-y-4">
                  {timelineItems.map((release) => {
                    const progress = release.progress;
                    const daysUntil = getDaysUntil(release.targetDate);
                    
                    return (
                      <div key={release.id} className="flex gap-4 items-start pb-4 border-b border-gray-200 last:border-0">
                        <div className="w-48 flex-shrink-0">
                          <h4 className="font-semibold text-gray-900">{release.name}</h4>
                          <p className="text-xs text-gray-500">{release.version}</p>
                          <p className="text-xs text-gray-500 mt-1">{formatDate(release.targetDate)}</p>
                        </div>

                        {/* Timeline Bar */}
                        <div className="flex-1">
                          <div
                            className={`relative h-8 ${statusBgColor[release.status]} opacity-40 rounded-lg overflow-hidden cursor-pointer hover:opacity-60 transition`}
                            onClick={() => router.push(`/releases/${release.id}`)}
                          >
                            <div
                              className={`h-full ${statusBgColor[release.status]} opacity-100`}
                              style={{ width: `${progress}%` }}
                            >
                              <div className="h-full flex items-center justify-center text-xs font-bold text-white">
                                {progress > 15 && `${progress}%`}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right Info */}
                        <div className="w-32 flex-shrink-0 text-right">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                              statusColors[release.status]
                            }`}
                          >
                            {release.status === 'planning' && '📋'}
                            {release.status === 'in-progress' && '🔄'}
                            {release.status === 'complete' && '✓'}
                            {' '}
                            {release.status.charAt(0).toUpperCase() + release.status.slice(1).replace('-', ' ')}
                          </span>
                          <p className={`text-sm font-bold mt-1 ${healthColor(release.healthScore)}`}>
                            Health: {release.healthScore}%
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {daysUntil > 0 ? `${daysUntil} days left` : `${Math.abs(daysUntil)} days overdue`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="grid gap-4 grid-cols-1">
              {filteredReleases.map((release) => {
                const daysUntil = getDaysUntil(release.targetDate);
                const featuresComplete = release.features.filter((f) => f.status === 'done').length;
                
                return (
                  <div
                    key={release.id}
                    onClick={() => router.push(`/releases/${release.id}`)}
                    className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow-lg transition"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{release.name}</h3>
                        <p className="text-sm text-gray-500">{release.version}</p>
                      </div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                          statusColors[release.status]
                        }`}
                      >
                        {release.status.charAt(0).toUpperCase() + release.status.slice(1).replace('-', ' ')}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">{release.description}</p>

                    <div className="grid grid-cols-5 gap-4 mb-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase">Target Date</p>
                        <p className="text-sm font-medium text-gray-900">{formatDate(release.targetDate)}</p>
                        <p className={`text-xs ${daysUntil > 0 ? 'text-gray-500' : 'text-red-600'}`}>
                          {daysUntil > 0 ? `${daysUntil} days left` : `${Math.abs(daysUntil)} days overdue`}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase">Progress</p>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${statusBgColor[release.status]}`}
                              style={{ width: `${release.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-8 text-right">{release.progress}%</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase">Features</p>
                        <p className="text-sm font-medium text-gray-900">{featuresComplete}/{release.features.length}</p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase">Health</p>
                        <p className={`text-sm font-bold ${healthColor(release.healthScore)}`}>{release.healthScore}%</p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase">Team</p>
                        <div className="flex gap-1 mt-1">
                          {release.teamMembers.slice(0, 3).map((member, idx) => (
                            <div
                              key={idx}
                              className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-bold"
                              title={member}
                            >
                              {member.charAt(member.length - 1)}
                            </div>
                          ))}
                          {release.teamMembers.length > 3 && (
                            <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-xs text-white font-bold">
                              +{release.teamMembers.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                      <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition">
                        View Details
                      </button>
                      <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition">
                        Edit
                      </button>
                      <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition">
                        ⋮
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Roadmap View */}
          {viewMode === 'roadmap' && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Release Roadmap</h3>
              <div className="overflow-x-auto">
                <div className="min-w-full">
                  {/* Quarters Header */}
                  <div className="flex gap-6 mb-8">
                    <div className="w-32 flex-shrink-0"></div>
                    {['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'].map((quarter, idx) => (
                      <div key={idx} className="flex-1 text-sm font-bold text-gray-700 text-center pb-2 border-b-2 border-gray-200">
                        {quarter}
                      </div>
                    ))}
                  </div>

                  {/* Roadmap Items */}
                  {filteredReleases.map((release) => (
                    <div key={release.id} className="flex gap-6 mb-6 items-center">
                      <div className="w-32 flex-shrink-0">
                        <h4 className="font-semibold text-gray-900 text-sm">{release.name}</h4>
                        <p className="text-xs text-gray-500">{release.version}</p>
                      </div>

                      {['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'].map((_, idx) => {
                        const isInQuarter = getMonthYear(release.targetDate).includes(['25', '25', '25', '25'][idx]);
                        return (
                          <div
                            key={idx}
                            className={`flex-1 h-10 rounded-lg flex items-center justify-center transition ${
                              isInQuarter ? `${statusBgColor[release.status]} opacity-80 cursor-pointer hover:opacity-100` : 'bg-gray-50'
                            }`}
                            onClick={() => isInQuarter && router.push(`/releases/${release.id}`)}
                          >
                            {isInQuarter && (
                              <span className="text-xs font-bold text-white">{release.progress}%</span>
                            )}
                          </div>
                        );
                      })}
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
