'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { KeyResult } from '@/types/goals';
import { mockGoals } from '@/lib/mockGoalsData';
import { ArrowLeft, Edit2, Trash2, Share2, MessageCircle, Calendar, TrendingUp } from 'lucide-react';

const goalTypeIcons: Record<string, string> = {
  okr: '🎯',
  kpi: '📊',
  milestone: '🚀',
};

const statusColors: Record<string, string> = {
  'on-track': 'bg-green-50 text-green-700 border-green-200',
  'at-risk': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'off-track': 'bg-red-50 text-red-700 border-red-200',
};

const progressBarColor: Record<string, string> = {
  'on-track': 'bg-green-500',
  'at-risk': 'bg-yellow-500',
  'off-track': 'bg-red-500',
};

export default function GoalDetailPage() {
  const router = useRouter();
  const params = useParams();
  const goalId = params?.goalId as string;

  const goal = useMemo(() => {
    return mockGoals.find((g) => g.id === goalId);
  }, [goalId]);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateValue, setUpdateValue] = useState('');
  const [expandedKeyResults, setExpandedKeyResults] = useState<Set<string>>(new Set());

  if (!goal) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-600">Goal not found</p>
          </div>
        </div>
      </div>
    );
  }

  const toggleKeyResultExpanded = (krId: string) => {
    const newExpanded = new Set(expandedKeyResults);
    if (newExpanded.has(krId)) {
      newExpanded.delete(krId);
    } else {
      newExpanded.add(krId);
    }
    setExpandedKeyResults(newExpanded);
  };

  const handleUpdateProgress = () => {
    setShowUpdateModal(false);
    setUpdateValue('');
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const calculateKRProgress = (kr: KeyResult) => {
    const range = kr.targetValue - kr.startValue;
    if (range === 0) return 0;
    const progress = ((kr.currentValue - kr.startValue) / range) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition"
          >
            <ArrowLeft size={20} />
            Back to Goals
          </button>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-200 rounded transition" title="Share">
              <Share2 size={20} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-200 rounded transition" title="Edit">
              <Edit2 size={20} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-200 rounded transition" title="Delete">
              <Trash2 size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Main Goal Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{goalTypeIcons[goal.type]}</span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusColors[goal.status]}`}>
                  {goal.status === 'on-track' && '✓ On Track'}
                  {goal.status === 'at-risk' && '⚠ At Risk'}
                  {goal.status === 'off-track' && '✗ Off Track'}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{goal.title}</h1>
              <p className="text-gray-600 max-w-2xl">{goal.description}</p>
            </div>

            {/* Progress Circle */}
            <div className="ml-8">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke={progressBarColor[goal.status]}
                    strokeWidth="8"
                    strokeDasharray={`${(goal.progress / 100) * (2 * Math.PI * 50)} ${2 * Math.PI * 50}`}
                    strokeLinecap="round"
                    style={{
                      transform: 'rotate(-90deg)',
                      transformOrigin: '60px 60px',
                      transition: 'stroke-dasharray 0.5s ease',
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-gray-900">{goal.progress}%</div>
                  <div className="text-xs text-gray-600">Progress</div>
                </div>
              </div>
            </div>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-4 gap-4 pt-6 border-t border-gray-200">
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Timeline</p>
              <p className="text-sm text-gray-900">{goal.timePeriod}</p>
              <p className="text-xs text-gray-500">{formatDate(goal.startDate)} - {formatDate(goal.targetDate)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Owner</p>
              <p className="text-sm text-gray-900">{goal.owner}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Contributors</p>
              <p className="text-sm text-gray-900">{goal.contributors.length} team members</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Priority</p>
              <span className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">{goal.priority.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Key Results Section */}
        {goal.keyResults && goal.keyResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp size={24} />
              Key Results
            </h2>
            <div className="space-y-4">
              {goal.keyResults.map((kr) => {
                const krProgress = calculateKRProgress(kr);
                const isExpanded = expandedKeyResults.has(kr.id);

                return (
                  <div key={kr.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div
                      onClick={() => toggleKeyResultExpanded(kr.id)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{kr.title}</h3>
                          <p className="text-xs text-gray-600 mt-1">Owner: {kr.owner}</p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[kr.status]}`}>
                          {kr.status === 'on-track' && '✓'}
                          {kr.status === 'at-risk' && '⚠'}
                          {kr.status === 'off-track' && '✗'}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex-1">
                          <div className="bg-gray-200 rounded-full h-2 mb-1">
                            <div
                              className={`h-2 rounded-full ${progressBarColor[kr.status]}`}
                              style={{width: `${krProgress}%`}}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>{kr.startValue} → {kr.currentValue}</span>
                            <span>{kr.targetValue}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-gray-900">{Math.round(krProgress)}%</div>
                          <div className="text-xs text-gray-500">Weight: {kr.weight}%</div>
                        </div>
                      </div>
                    </div>

                    {isExpanded && kr.progressHistory && kr.progressHistory.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Progress History</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {kr.progressHistory.map((ph) => (
                            <div key={ph.id} className="flex justify-between text-xs text-gray-600 bg-gray-50 p-2 rounded">
                              <span>{formatDate(ph.timestamp)}</span>
                              <span className="font-medium text-gray-900">{ph.value}</span>
                              <span className="text-gray-500">Confidence: {ph.confidenceLevel || 0}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowUpdateModal(true)}
              className="mt-6 w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Update Progress
            </button>
          </div>
        )}

        {/* Updates & Check-ins Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Calendar size={24} />
            Updates & Check-ins
          </h2>
          {goal.updates.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No updates yet. Start tracking progress!</p>
          ) : (
            <div className="space-y-4">
              {goal.updates.map((update) => (
                <div key={update.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-gray-900">Update by {update.updatedBy}</p>
                    <span className="text-xs text-gray-600">{formatDate(update.timestamp)}</span>
                  </div>
                  <p className="text-gray-600">{update.notes}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MessageCircle size={24} />
            Discussion
          </h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {goal.comments.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No comments yet. Start a conversation!</p>
            ) : (
              goal.comments.map((comment) => (
                <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-gray-900">{comment.authorId}</p>
                    <span className="text-xs text-gray-600">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-gray-700 text-sm">{comment.content}</p>
                </div>
              ))
            )}
          </div>
          <textarea
            className="w-full mt-4 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add a comment..."
            rows={3}
          />
          <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
            Post Comment
          </button>
        </div>
      </div>

      {/* Update Progress Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Update Progress</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Value</label>
                <input
                  type="number"
                  value={updateValue}
                  onChange={(e) => setUpdateValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new value"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Add notes about this update..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProgress}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
