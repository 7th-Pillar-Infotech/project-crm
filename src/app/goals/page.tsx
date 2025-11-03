'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Goal, GoalStatus, GoalType } from '@/types/goals';
import { mockGoals } from '@/lib/mockGoalsData';
import { ChevronDown, Plus, Filter, SortAsc, Grid3x3, List, Layers, Calendar, TrendingUp } from 'lucide-react';

type ViewMode = 'list' | 'board' | 'tree' | 'timeline';

const goalTypeIcons: Record<GoalType, React.ReactNode> = {
  okr: '🎯',
  kpi: '📊',
  milestone: '🚀',
};

const statusColors: Record<GoalStatus, string> = {
  'on-track': 'bg-green-50 text-green-700 border-green-200',
  'at-risk': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'off-track': 'bg-red-50 text-red-700 border-red-200',
};

const statusBgLight: Record<GoalStatus, string> = {
  'on-track': 'bg-green-100',
  'at-risk': 'bg-yellow-100',
  'off-track': 'bg-red-100',
};

const progressBarColor: Record<GoalStatus, string> = {
  'on-track': 'bg-green-500',
  'at-risk': 'bg-yellow-500',
  'off-track': 'bg-red-500',
};

export default function GoalsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedGoals, setSelectedGoals] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<GoalStatus | null>(null);
  const [typeFilter, setTypeFilter] = useState<GoalType | null>(null);
  const [sortBy, setSortBy] = useState<'progress' | 'dueDate' | 'priority'>('progress');
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [showTypeFilter, setShowTypeFilter] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);

  const filteredGoals = useMemo(() => {
    let goals = [...mockGoals];

    if (statusFilter) {
      goals = goals.filter((g) => g.status === statusFilter);
    }
    if (typeFilter) {
      goals = goals.filter((g) => g.type === typeFilter);
    }

    goals.sort((a, b) => {
      if (sortBy === 'progress') return b.progress - a.progress;
      if (sortBy === 'dueDate') return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
      if (sortBy === 'priority') {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return 0;
    });

    return goals;
  }, [statusFilter, typeFilter, sortBy]);

  const goalsGroupedByStatus = useMemo(() => {
    const grouped: Record<GoalStatus, Goal[]> = {
      'on-track': [],
      'at-risk': [],
      'off-track': [],
    };
    filteredGoals.forEach((goal) => {
      grouped[goal.status].push(goal);
    });
    return grouped;
  }, [filteredGoals]);

  const goalsGroupedByParent = useMemo(() => {
    const grouped: Map<string | null, Goal[]> = new Map();
    
    filteredGoals.forEach((goal) => {
      const parentId = goal.parentGoalId || null;
      if (!grouped.has(parentId)) {
        grouped.set(parentId, []);
      }
      grouped.get(parentId)!.push(goal);
    });

    return grouped;
  }, [filteredGoals]);

  const timelineItems = useMemo(() => {
    return filteredGoals.map((goal) => ({
      id: goal.id,
      goal,
      startDate: new Date(goal.startDate),
      endDate: new Date(goal.targetDate),
    })).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }, [filteredGoals]);

  const toggleGoalSelection = (goalId: string) => {
    const newSelected = new Set(selectedGoals);
    if (newSelected.has(goalId)) {
      newSelected.delete(goalId);
    } else {
      newSelected.add(goalId);
    }
    setSelectedGoals(newSelected);
  };

  const toggleAllSelection = () => {
    if (selectedGoals.size === filteredGoals.length) {
      setSelectedGoals(new Set());
    } else {
      setSelectedGoals(new Set(filteredGoals.map((g) => g.id)));
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const renderTreeGoal = (goalId: string | null = null, level = 0) => {
    const goalsAtLevel = goalsGroupedByParent.get(goalId) || [];
    
    return (
      <div key={`level-${level}`}>
        {goalsAtLevel.map((goal) => (
          <div key={goal.id}>
            <div
              className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-l-4 border-gray-200 ml-4"
              style={{ marginLeft: `${level * 20}px` }}
              onClick={() => setExpandedGoalId(expandedGoalId === goal.id ? null : goal.id)}
            >
              <span className="text-lg">{goalTypeIcons[goal.type]}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{goal.title}</p>
                <p className="text-xs text-gray-500">{goal.timePeriod}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${progressBarColor[goal.status]}`}
                    style={{width: `${goal.progress}%`}}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-8 text-right">{goal.progress}%</span>
              </div>
              <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${statusColors[goal.status]}`}>
                {goal.status === 'on-track' && '✓'}
                {goal.status === 'at-risk' && '⚠'}
                {goal.status === 'off-track' && '✗'}
              </span>
            </div>
            {expandedGoalId === goal.id && goal.childGoalIds.length > 0 && (
              <div className="ml-4">
                {renderTreeGoal(goal.id, level + 1)}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const getMonthsBetween = (start: Date, end: Date): string[] => {
    const months = [];
    const current = new Date(start);
    while (current <= end) {
      months.push(current.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }));
      current.setMonth(current.getMonth() + 1);
    }
    return months;
  };

  const timelineMonths = useMemo(() => {
    if (timelineItems.length === 0) return [];
    const start = timelineItems[0].startDate;
    const end = timelineItems[timelineItems.length - 1].endDate;
    return getMonthsBetween(start, end);
  }, [timelineItems]);

  const getDayOffset = (goalStart: Date, timelineStart: Date, goalEnd: Date): { start: number; width: number } => {
    const totalDays = (timelineItems[timelineItems.length - 1]?.endDate.getTime() - timelineItems[0]?.startDate.getTime()) / (1000 * 60 * 60 * 24) || 1;
    const goalStartOffset = Math.max(0, (goalStart.getTime() - timelineStart.getTime()) / (1000 * 60 * 60 * 24));
    const goalDuration = (goalEnd.getTime() - goalStart.getTime()) / (1000 * 60 * 60 * 24);
    
    return {
      start: (goalStartOffset / totalDays) * 100,
      width: Math.max(2, (goalDuration / totalDays) * 100),
    };
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Goals & OKRs</h1>
              <p className="text-gray-600 mt-2">Track objectives, key results, and milestones</p>
            </div>
            <div className="flex gap-3">
              {/* Create Goal Button */}
              <div className="relative">
                <button
                  onClick={() => setShowCreateMenu(!showCreateMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Plus size={20} />
                  Create Goal
                  <ChevronDown size={16} />
                </button>
                {showCreateMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                    <button
                      onClick={() => {
                        router.push('/goals/create/okr');
                        setShowCreateMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-200"
                    >
                      <span className="text-lg">🎯</span> Create OKR
                    </button>
                    <button
                      onClick={() => {
                        router.push('/goals/create/kpi');
                        setShowCreateMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-200"
                    >
                      <span className="text-lg">📊</span> Create KPI
                    </button>
                    <button
                      onClick={() => {
                        router.push('/goals/create/milestone');
                        setShowCreateMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                    >
                      <span className="text-lg">🚀</span> Create Milestone
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 flex items-center justify-between flex-wrap gap-4">
            {/* View Mode Switcher */}
            <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
                title="List View"
              >
                <List size={18} />
              </button>
              <button
                onClick={() => setViewMode('board')}
                className={`p-2 rounded transition ${viewMode === 'board' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
                title="Board View"
              >
                <Grid3x3 size={18} />
              </button>
              <button
                onClick={() => setViewMode('tree')}
                className={`p-2 rounded transition ${viewMode === 'tree' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
                title="Tree View"
              >
                <Layers size={18} />
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`p-2 rounded transition ${viewMode === 'timeline' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
                title="Timeline View"
              >
                <Calendar size={18} />
              </button>
            </div>

            {/* Filter & Sort Controls */}
            <div className="flex items-center gap-3">
              {/* Status Filter */}
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
                    {(['on-track', 'at-risk', 'off-track'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setStatusFilter(status);
                          setShowStatusFilter(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 border-t border-gray-100"
                      >
                        {status === 'on-track' && '✓ On Track'}
                        {status === 'at-risk' && '⚠ At Risk'}
                        {status === 'off-track' && '✗ Off Track'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Type Filter */}
              <div className="relative">
                <button
                  onClick={() => setShowTypeFilter(!showTypeFilter)}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  <Filter size={16} />
                  Type {typeFilter && <span className="ml-1">✓</span>}
                </button>
                {showTypeFilter && (
                  <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                    <button
                      onClick={() => {
                        setTypeFilter(null);
                        setShowTypeFilter(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
                    >
                      All Types
                    </button>
                    {(['okr', 'kpi', 'milestone'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setTypeFilter(type);
                          setShowTypeFilter(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 border-t border-gray-100"
                      >
                        {goalTypeIcons[type]} {type.toUpperCase()}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white">
                <SortAsc size={16} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'progress' | 'dueDate' | 'priority')}
                  className="bg-transparent outline-none cursor-pointer"
                >
                  <option value="progress">Progress</option>
                  <option value="dueDate">Due Date</option>
                  <option value="priority">Priority</option>
                </select>
              </div>
            </div>

            {/* Count */}
            <div className="text-sm text-gray-600">
              {filteredGoals.length} goal{filteredGoals.length !== 1 ? 's' : ''}
              {selectedGoals.size > 0 && ` • ${selectedGoals.size} selected`}
            </div>
          </div>

          {/* Content Area */}
          {viewMode === 'list' && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedGoals.size === filteredGoals.length && filteredGoals.length > 0}
                        onChange={toggleAllSelection}
                        className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Goal</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Owner</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Progress</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Target Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Updated</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGoals.map((goal, idx) => (
                    <tr key={goal.id} className={`border-t border-gray-200 hover:bg-gray-50 transition ${idx % 2 === 0 ? '' : 'bg-gray-50'}`}>
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedGoals.has(goal.id)}
                          onChange={() => toggleGoalSelection(goal.id)}
                          className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4 text-2xl">{goalTypeIcons[goal.type]}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => router.push(`/goals/${goal.id}`)}
                          className="text-blue-600 hover:text-blue-700 font-medium transition"
                        >
                          {goal.title}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{goal.owner}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                            <div
                              className={`h-2 rounded-full ${progressBarColor[goal.status]}`}
                              style={{width: `${goal.progress}%`}}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-8 text-right">{goal.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[goal.status]}`}>
                          {goal.status === 'on-track' && '✓ On Track'}
                          {goal.status === 'at-risk' && '⚠ At Risk'}
                          {goal.status === 'off-track' && '✗ Off Track'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(goal.targetDate)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(goal.updatedAt)}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-gray-200 rounded transition" title="More actions">
                          ⋮
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {viewMode === 'board' && (
            <div className="grid grid-cols-3 gap-6">
              {(['on-track', 'at-risk', 'off-track'] as const).map((status) => (
                <div key={status} className="flex flex-col">
                  <div className="mb-4">
                    <h3 className={`text-sm font-semibold px-4 py-2 rounded-lg inline-block ${statusBgLight[status]}`}>
                      {status === 'on-track' && '✓ On Track'}
                      {status === 'at-risk' && '⚠ At Risk'}
                      {status === 'off-track' && '✗ Off Track'}
                      <span className="ml-2 text-gray-600">({goalsGroupedByStatus[status].length})</span>
                    </h3>
                  </div>
                  <div className="space-y-3 flex-1">
                    {goalsGroupedByStatus[status].map((goal) => (
                      <div
                        key={goal.id}
                        onClick={() => router.push(`/goals/${goal.id}`)}
                        className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md hover:border-blue-400 transition"
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <span className="text-lg">{goalTypeIcons[goal.type]}</span>
                          <h4 className="font-semibold text-gray-900 flex-1">{goal.title}</h4>
                        </div>
                        <p className="text-xs text-gray-600 mb-3">{goal.description}</p>
                        <div className="bg-gray-200 rounded-full h-2 mb-2">
                          <div
                            className={`h-2 rounded-full ${progressBarColor[status]}`}
                            style={{width: `${goal.progress}%`}}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-600">
                          <span className="font-medium">{goal.progress}%</span>
                          <span>{formatDate(goal.targetDate)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewMode === 'tree' && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUp size={18} />
                  Goal Hierarchy
                </h3>
              </div>
              <div className="p-4">
                {renderTreeGoal()}
              </div>
            </div>
          )}

          {viewMode === 'timeline' && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar size={18} />
                  Timeline View
                </h3>
              </div>
              <div className="overflow-x-auto p-6">
                {timelineItems.length === 0 ? (
                  <p className="text-center text-gray-600 py-8">No goals to display</p>
                ) : (
                  <div>
                    {/* Month Headers */}
                    <div className="flex gap-2 mb-6 ml-64">
                      {timelineMonths.map((month, idx) => (
                        <div key={idx} className="flex-1 text-xs font-semibold text-gray-600 text-center">
                          {month}
                        </div>
                      ))}
                    </div>

                    {/* Timeline Bars */}
                    <div className="space-y-4">
                      {timelineItems.map((item) => {
                        const offset = getDayOffset(item.startDate, timelineItems[0].startDate, item.endDate);
                        return (
                          <div key={item.id} className="flex items-center gap-4">
                            <div className="w-60 flex-shrink-0">
                              <p className="font-medium text-sm text-gray-900 truncate">{item.goal.title}</p>
                              <p className="text-xs text-gray-500">{item.goal.timePeriod}</p>
                            </div>
                            <div className="flex-1 relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                              <div
                                className={`h-full ${progressBarColor[item.goal.status]} opacity-80 rounded-lg transition-all flex items-center justify-center`}
                                style={{
                                  marginLeft: `${offset.start}%`,
                                  width: `${offset.width}%`,
                                }}
                              >
                                {offset.width > 10 && (
                                  <span className="text-xs font-medium text-white">{item.goal.progress}%</span>
                                )}
                              </div>
                              {offset.width <= 10 && (
                                <span className="absolute text-xs font-medium text-gray-700" style={{left: `${offset.start + offset.width + 2}%`}}>
                                  {item.goal.progress}%
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
