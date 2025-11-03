'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { mockDocuments } from '@/lib/mockDocumentsData';
import { ArrowLeft, Eye, Download, Share2, MoreVertical, Star, MessageSquare, Users, Lock, AlertCircle, Edit2, Trash2, Copy, FileText, Clock } from 'lucide-react';

const documentTypeIcons: Record<string, string> = {
  'prd': '📋',
  'design-doc': '🎨',
  'tech-spec': '⚙️',
  'meeting-notes': '📝',
  'retrospective': '🔍',
  'proposal': '💡',
  'requirements': '✓',
  'tutorial': '📚',
  'guide': '🗺️',
  'other': '📄',
};

const statusColors: Record<string, string> = {
  'draft': 'bg-gray-100 text-gray-700 border-gray-200',
  'in-review': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'approved': 'bg-green-100 text-green-700 border-green-200',
  'archived': 'bg-gray-300 text-gray-600 border-gray-300',
};

const accessLevelColors: Record<string, string> = {
  'owner': 'bg-red-50 text-red-700',
  'edit': 'bg-blue-50 text-blue-700',
  'comment': 'bg-yellow-50 text-yellow-700',
  'view': 'bg-gray-50 text-gray-700',
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatDateWithTime = (date: string) => {
  return new Date(date).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

const getAccessLevelLabel = (level: string) => {
  const labels: Record<string, string> = {
    'owner': 'Owner',
    'edit': 'Can edit',
    'comment': 'Can comment',
    'view': 'Can view',
  };
  return labels[level] || level;
};

export default function DocumentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const documentId = params.id as string;
  const [activeTab, setActiveTab] = useState<'overview' | 'collaborators' | 'versions' | 'comments'>('overview');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Find document by ID
  const document = mockDocuments.find((d) => d.id === documentId);

  if (!document) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
            >
              <ArrowLeft size={20} />
              Back to Documents
            </button>
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <AlertCircle size={64} className="mx-auto text-gray-300 mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Not Found</h2>
              <p className="text-gray-600">The document you're looking for doesn't exist or has been deleted.</p>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header with Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Documents
          </button>

          {/* Document Header Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-start gap-6 flex-1">
                <div className="text-5xl">{documentTypeIcons[document.type]}</div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{document.title}</h1>
                  <p className="text-gray-600 text-lg mb-4 leading-relaxed">{document.description}</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${statusColors[document.status]}`}>
                      {document.status.charAt(0).toUpperCase() + document.status.slice(1).replace('-', ' ')}
                    </span>
                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-full">
                      Version {document.currentVersion}
                    </span>
                    {document.isPinned && (
                      <span className="text-sm text-blue-600 bg-blue-100 px-3 py-2 rounded-full">📌 Pinned</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-3 hover:bg-gray-100 rounded-xl transition-colors group"
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Star size={20} className={`${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400 group-hover:text-gray-600'} transition-colors`} />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                    className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                    title="More options"
                  >
                    <MoreVertical size={20} className="text-gray-600" />
                  </button>
                  {showMoreMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-10 overflow-hidden">
                      <button className="w-full text-left px-4 py-3 hover:bg-gray-50 transition flex items-center gap-3 text-sm font-medium">
                        <Edit2 size={16} className="text-blue-600" />
                        <span>Edit</span>
                      </button>
                      <button className="w-full text-left px-4 py-3 hover:bg-gray-50 transition flex items-center gap-3 text-sm font-medium">
                        <Copy size={16} className="text-purple-600" />
                        <span>Duplicate</span>
                      </button>
                      <button className="w-full text-left px-4 py-3 hover:bg-gray-50 transition flex items-center gap-3 text-sm font-medium">
                        <Download size={16} className="text-green-600" />
                        <span>Download</span>
                      </button>
                      <div className="border-t border-gray-200"></div>
                      <button className="w-full text-left px-4 py-3 hover:bg-red-50 transition flex items-center gap-3 text-sm font-medium text-red-600">
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white rounded-xl shadow p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Views</p>
                      <p className="text-2xl font-bold text-gray-900">{document.viewCount}</p>
                    </div>
                    <Eye size={24} className="text-blue-500 opacity-20" />
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Downloads</p>
                      <p className="text-2xl font-bold text-gray-900">{document.downloadCount}</p>
                    </div>
                    <Download size={24} className="text-green-500 opacity-20" />
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Collaborators</p>
                      <p className="text-2xl font-bold text-gray-900">{document.collaborators.length}</p>
                    </div>
                    <Users size={24} className="text-purple-500 opacity-20" />
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Comments</p>
                      <p className="text-2xl font-bold text-gray-900">{document.comments?.length || 0}</p>
                    </div>
                    <MessageSquare size={24} className="text-orange-500 opacity-20" />
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="border-b border-gray-200 flex">
                  {(['overview', 'collaborators', 'versions', 'comments'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 px-6 py-4 text-sm font-semibold transition-all capitalize relative ${
                        activeTab === tab
                          ? 'text-blue-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-t-full"></div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="p-8">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <div className="space-y-8">
                      {document.summary && (
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-4">Summary</h3>
                          <p className="text-gray-700 leading-relaxed text-lg">{document.summary}</p>
                        </div>
                      )}

                      {document.content && (
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-4">Document Content</h3>
                          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                            <p className="text-gray-700 leading-relaxed line-clamp-8">{document.content}</p>
                            <button className="mt-4 text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 group">
                              <span>Read Full Document</span>
                              <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {document.tags.length > 0 && (
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-4">Tags</h3>
                          <div className="flex flex-wrap gap-2">
                            {document.tags.map((tag) => (
                              <span
                                key={tag.id}
                                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium"
                                style={{ backgroundColor: tag.color + '20', color: tag.color }}
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Related Items */}
                      {((document.relatedGoals?.length || 0) + (document.relatedFeatures?.length || 0) + (document.relatedReleases?.length || 0) > 0) && (
                        <div className="pt-8 border-t border-gray-200">
                          <h3 className="text-lg font-bold text-gray-900 mb-4">Related Items</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {document.relatedGoals && document.relatedGoals.length > 0 && (
                              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                <p className="text-sm font-bold text-blue-900 mb-3">🎯 Goals ({document.relatedGoals.length})</p>
                                <div className="flex flex-wrap gap-2">
                                  {document.relatedGoals.map((goal) => (
                                    <span key={goal} className="text-xs bg-white text-blue-700 px-3 py-1 rounded-lg font-medium border border-blue-200">
                                      {goal}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {document.relatedFeatures && document.relatedFeatures.length > 0 && (
                              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                                <p className="text-sm font-bold text-purple-900 mb-3">✨ Features ({document.relatedFeatures.length})</p>
                                <div className="flex flex-wrap gap-2">
                                  {document.relatedFeatures.map((feature) => (
                                    <span key={feature} className="text-xs bg-white text-purple-700 px-3 py-1 rounded-lg font-medium border border-purple-200">
                                      {feature}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {document.relatedReleases && document.relatedReleases.length > 0 && (
                              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                                <p className="text-sm font-bold text-green-900 mb-3">🚀 Releases ({document.relatedReleases.length})</p>
                                <div className="flex flex-wrap gap-2">
                                  {document.relatedReleases.map((release) => (
                                    <span key={release} className="text-xs bg-white text-green-700 px-3 py-1 rounded-lg font-medium border border-green-200">
                                      {release}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {document.notes && (
                        <div className="pt-8 border-t border-gray-200">
                          <h3 className="text-lg font-bold text-gray-900 mb-4">Notes</h3>
                          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                            <p className="text-gray-700">{document.notes}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Collaborators Tab */}
                  {activeTab === 'collaborators' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Team Members</h3>
                        <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                          + Add Collaborator
                        </button>
                      </div>
                      <div className="space-y-3">
                        {document.collaborators.map((collaborator) => (
                          <div key={collaborator.userId} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {collaborator.userName.charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{collaborator.userName}</p>
                                <p className="text-xs text-gray-500">Added {formatDate(collaborator.addedAt)}</p>
                              </div>
                            </div>
                            <span className={`text-xs font-bold px-3 py-2 rounded-lg ${accessLevelColors[collaborator.accessLevel]}`}>
                              {getAccessLevelLabel(collaborator.accessLevel)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Versions Tab */}
                  {activeTab === 'versions' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-6">Version History</h3>
                      {document.versions.map((version, idx) => (
                        <div key={version.id} className={`border-2 rounded-xl p-4 transition-all ${idx === 0 ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-lg font-bold text-gray-900">v{version.versionNumber}</span>
                                {idx === 0 && (
                                  <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-bold">Current</span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 font-medium">{version.changesSummary}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500 font-medium">{formatDateWithTime(version.createdAt)}</p>
                              <p className="text-xs text-gray-500">by {version.createdBy}</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">File size: {formatFileSize(version.fileSize)}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Comments Tab */}
                  {activeTab === 'comments' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Comments ({document.comments?.length || 0})</h3>
                        <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                          + Add Comment
                        </button>
                      </div>
                      {document.comments && document.comments.length > 0 ? (
                        <div className="space-y-4">
                          {document.comments.map((comment) => (
                            <div key={comment.id} className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition">
                              <div className="flex items-start gap-4 mb-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                  {comment.authorName.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <p className="font-semibold text-gray-900">{comment.authorName}</p>
                                    <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
                                  </div>
                                  <p className="text-gray-700">{comment.content}</p>
                                </div>
                              </div>
                              {comment.replies && comment.replies.length > 0 && (
                                <button className="text-blue-600 hover:text-blue-700 text-xs font-semibold ml-14">
                                  {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <MessageSquare size={48} className="mx-auto text-gray-300 mb-3" />
                          <p className="text-gray-500 font-medium">No comments yet</p>
                          <p className="text-sm text-gray-400">Be the first to comment on this document</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* File Information */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText size={18} className="text-blue-600" />
                  File Information
                </h3>
                <div className="space-y-4 text-sm">
                  <div className="pb-4 border-b border-gray-200">
                    <p className="text-xs text-gray-600 font-medium mb-1">File Name</p>
                    <p className="font-semibold text-gray-900 break-all">{document.fileName}</p>
                  </div>
                  <div className="pb-4 border-b border-gray-200">
                    <p className="text-xs text-gray-600 font-medium mb-1">File Type</p>
                    <p className="font-semibold text-gray-900 uppercase tracking-wide">{document.fileType}</p>
                  </div>
                  <div className="pb-4 border-b border-gray-200">
                    <p className="text-xs text-gray-600 font-medium mb-1">File Size</p>
                    <p className="font-semibold text-gray-900">{formatFileSize(document.fileSize)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium mb-1">Folder</p>
                    <p className="font-semibold text-gray-900">{document.folder || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-purple-600" />
                  Timeline
                </h3>
                <div className="space-y-4 text-sm">
                  <div className="pb-4 border-b border-gray-200">
                    <p className="text-xs text-gray-600 font-medium mb-2">Created</p>
                    <p className="font-semibold text-gray-900">{formatDateWithTime(document.createdAt)}</p>
                    <p className="text-xs text-gray-500 mt-1">by {document.createdBy}</p>
                  </div>
                  <div className="pb-4 border-b border-gray-200">
                    <p className="text-xs text-gray-600 font-medium mb-2">Last Updated</p>
                    <p className="font-semibold text-gray-900">{formatDateWithTime(document.updatedAt)}</p>
                    <p className="text-xs text-gray-500 mt-1">by {document.lastModifiedBy}</p>
                  </div>
                  {document.lastViewedAt && (
                    <div>
                      <p className="text-xs text-gray-600 font-medium mb-2">Last Viewed</p>
                      <p className="font-semibold text-gray-900">{formatDateWithTime(document.lastViewedAt)}</p>
                      <p className="text-xs text-gray-500 mt-1">by {document.lastViewedBy}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Access & Actions */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-6 border border-blue-200">
                <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <Lock size={18} />
                  Sharing & Access
                </h3>
                <p className="text-sm text-blue-800 mb-4">
                  Shared with <span className="font-bold">{document.collaborators.length}</span> collaborator{document.collaborators.length !== 1 ? 's' : ''}
                </p>
                <div className="space-y-2">
                  <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold text-sm flex items-center justify-center gap-2">
                    <Download size={16} />
                    Download
                  </button>
                  <button className="w-full px-4 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-xl hover:bg-blue-50 transition font-semibold text-sm flex items-center justify-center gap-2">
                    <Share2 size={16} />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
