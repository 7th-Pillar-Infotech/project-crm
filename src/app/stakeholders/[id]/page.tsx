'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { mockStakeholders } from '@/lib/mockStakeholdersData';
import { StakeholderRole, EngagementLevel, SentimentScore } from '@/types/stakeholders';
import { ArrowLeft, Mail, Phone, MessageSquare, AlertCircle, TrendingUp, Users, Plus, Edit2 } from 'lucide-react';

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

const sentimentEmoji: Record<SentimentScore, string> = {
  'very-positive': '😍',
  'positive': '😊',
  'neutral': '😐',
  'negative': '😕',
  'very-negative': '😠',
};

const sentimentColors: Record<SentimentScore, string> = {
  'very-positive': 'text-green-600 bg-green-50',
  'positive': 'text-lime-600 bg-lime-50',
  'neutral': 'text-gray-600 bg-gray-50',
  'negative': 'text-orange-600 bg-orange-50',
  'very-negative': 'text-red-600 bg-red-50',
};

const engagementColors: Record<EngagementLevel, string> = {
  'high': 'bg-green-50 text-green-700 border-green-200',
  'medium': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'low': 'bg-red-50 text-red-700 border-red-200',
};

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

export default function StakeholderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const stakeholderId = params.id as string;
  const [activeTab, setActiveTab] = useState<'overview' | 'engagement' | 'feedback' | 'notes'>('overview');

  // Find stakeholder by ID
  const stakeholder = mockStakeholders.find((s) => s.id === stakeholderId);

  if (!stakeholder) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
            >
              <ArrowLeft size={20} />
              Back to Stakeholders
            </button>
            <div className="text-center py-12">
              <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900">Stakeholder not found</h2>
              <p className="text-gray-600 mt-2">The stakeholder you're looking for doesn't exist.</p>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-200 rounded-lg transition"
              title="Back"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {stakeholder.firstName} {stakeholder.lastName}
              </h1>
              <p className="text-gray-600">{stakeholder.title} • {stakeholder.department}</p>
            </div>
            <button className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
              <Edit2 size={16} />
              Edit
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                    {stakeholder.firstName.charAt(0)}{stakeholder.lastName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{roleIcons[stakeholder.role]}</span>
                      <div>
                        <p className="text-sm text-gray-600">Role</p>
                        <p className="font-semibold text-gray-900 capitalize">{stakeholder.role.replace('-', ' ')}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-600">Organization</p>
                        <p className="font-medium text-gray-900">{stakeholder.organization || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Timezone</p>
                        <p className="font-medium text-gray-900">{stakeholder.timezone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {stakeholder.bio && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-gray-700">{stakeholder.bio}</p>
                  </div>
                )}
              </div>

              {/* Engagement & Sentiment */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-600">Engagement Level</span>
                    <TrendingUp size={20} className="text-blue-600" />
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${engagementColors[stakeholder.engagementLevel]}`}>
                    {stakeholder.engagementLevel.charAt(0).toUpperCase() + stakeholder.engagementLevel.slice(1)}
                  </span>
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Engagement Score</span>
                      <span className="font-bold text-lg text-gray-900">{stakeholder.engagementScore}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-blue-600"
                        style={{ width: `${stakeholder.engagementScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-600">Overall Sentiment</span>
                    <span className="text-3xl">{sentimentEmoji[stakeholder.overallSentiment]}</span>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${sentimentColors[stakeholder.overallSentiment]}`}>
                    {stakeholder.overallSentiment.charAt(0).toUpperCase() + stakeholder.overallSentiment.slice(1)}
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-lg shadow">
                <div className="border-b border-gray-200 flex">
                  {(['overview', 'engagement', 'feedback', 'notes'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 px-6 py-4 text-sm font-medium transition-colors capitalize ${
                        activeTab === tab
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="p-6">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">Contact Information</h3>
                        <div className="space-y-3">
                          <a href={`mailto:${stakeholder.email}`} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
                            <Mail size={18} className="text-gray-600" />
                            <div>
                              <p className="text-xs text-gray-600">Email</p>
                              <p className="font-medium text-gray-900">{stakeholder.email}</p>
                            </div>
                          </a>
                          {stakeholder.contacts.map((contact, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
                              {contact.type === 'phone' && <Phone size={18} className="text-gray-600" />}
                              {contact.type === 'slack' && <MessageSquare size={18} className="text-gray-600" />}
                              {contact.type === 'email' && <Mail size={18} className="text-gray-600" />}
                              {contact.type === 'linkedin' && <Users size={18} className="text-gray-600" />}
                              {contact.type === 'twitter' && <Users size={18} className="text-gray-600" />}
                              <div>
                                <p className="text-xs text-gray-600 capitalize">{contact.type}</p>
                                <p className="font-medium text-gray-900">{contact.value}</p>
                              </div>
                              {contact.preferred && (
                                <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Preferred</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">Preferences</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-600">Communication</p>
                            <p className="font-medium text-gray-900 capitalize">{stakeholder.communicationPreference.replace('-', ' ')}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Available Hours</p>
                            <p className="font-medium text-gray-900">{stakeholder.availableHours || 'Not specified'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Engagement Tab */}
                  {activeTab === 'engagement' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-900">Engagement History</h3>
                        <button className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium">
                          <Plus size={16} />
                          Log Engagement
                        </button>
                      </div>
                      {stakeholder.engagementRecords.length > 0 ? (
                        <div className="space-y-3">
                          {stakeholder.engagementRecords.slice(0, 5).map((record) => (
                            <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">{record.subject}</p>
                                  <p className="text-sm text-gray-600 mt-1">{record.notes}</p>
                                  <div className="flex items-center gap-4 mt-3">
                                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded capitalize">{record.type}</span>
                                    <span className="text-xs text-gray-500">{getDaysSince(record.date)}</span>
                                  </div>
                                </div>
                                {record.sentiment && (
                                  <span className="text-lg ml-4">{sentimentEmoji[record.sentiment]}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center py-8 text-gray-500">No engagement records yet</p>
                      )}
                    </div>
                  )}

                  {/* Feedback Tab */}
                  {activeTab === 'feedback' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-900">Feedback & Concerns</h3>
                        <button className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium">
                          <Plus size={16} />
                          Add Feedback
                        </button>
                      </div>
                      {stakeholder.feedback.length > 0 ? (
                        <div className="space-y-3">
                          {stakeholder.feedback.map((item) => (
                            <div key={item.id} className={`border rounded-lg p-4 ${item.priority === 'critical' ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
                              <div className="flex items-start justify-between mb-2">
                                <p className="font-medium text-gray-900">{item.title}</p>
                                <span className={`text-xs px-2 py-1 rounded font-medium capitalize ${
                                  item.priority === 'critical' ? 'bg-red-100 text-red-700' :
                                  item.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {item.priority}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded capitalize">{item.category}</span>
                                <span className={`text-xs px-2 py-1 rounded capitalize ${
                                  item.status === 'closed' ? 'bg-green-100 text-green-700' :
                                  item.status === 'in-review' ? 'bg-blue-100 text-blue-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {item.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center py-8 text-gray-500">No feedback items</p>
                      )}
                    </div>
                  )}

                  {/* Notes Tab */}
                  {activeTab === 'notes' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-900">Notes</h3>
                        <button className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium">
                          <Plus size={16} />
                          Add Note
                        </button>
                      </div>
                      {stakeholder.notes ? (
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <p className="text-gray-700">{stakeholder.notes}</p>
                        </div>
                      ) : (
                        <p className="text-center py-8 text-gray-500">No notes yet</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Influence */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Influence</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-2">Decision Power</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium capitalize ${
                      stakeholder.influence.decisionPower === 'high' ? 'bg-green-50 text-green-700' :
                      stakeholder.influence.decisionPower === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {stakeholder.influence.decisionPower}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-2">Affected Areas</p>
                    <div className="flex flex-wrap gap-2">
                      {stakeholder.influence.affectedAreas.map((area) => (
                        <span key={area} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded capitalize">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Tags</h3>
                {stakeholder.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {stakeholder.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No tags</p>
                )}
              </div>

              {/* Key Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Key Information</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-600">Last Contacted</p>
                    <p className="font-medium text-gray-900">
                      {stakeholder.lastContactedAt ? getDaysSince(stakeholder.lastContactedAt) : 'Never'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Member Since</p>
                    <p className="font-medium text-gray-900">
                      {new Date(stakeholder.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Open Concerns</p>
                    <p className="font-medium text-gray-900">
                      {stakeholder.openConcerns.length} {stakeholder.openConcerns.length === 1 ? 'concern' : 'concerns'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
