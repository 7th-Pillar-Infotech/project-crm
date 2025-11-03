'use client';

import React, { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { mockDocuments } from '@/lib/mockDocumentsData';
import { 
  Plus, Search, Filter, SortAsc, FileText, Clock, Eye, Download, 
  Share2, Trash2, MoreVertical, Star, Pin, ChevronDown, Tag, User, Calendar 
} from 'lucide-react';

type ViewMode = 'grid' | 'list' | 'detailed';

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
  'draft': 'bg-gray-100 text-gray-700',
  'in-review': 'bg-yellow-100 text-yellow-700',
  'approved': 'bg-green-100 text-green-700',
  'archived': 'bg-gray-300 text-gray-600',
};

const categoryColors: Record<string, string> = {
  'product': 'bg-blue-50 border-blue-200',
  'engineering': 'bg-purple-50 border-purple-200',
  'design': 'bg-pink-50 border-pink-200',
  'operations': 'bg-green-50 border-green-200',
  'marketing': 'bg-orange-50 border-orange-200',
  'sales': 'bg-red-50 border-red-200',
  'other': 'bg-gray-50 border-gray-200',
};

export default function DocumentsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'views' | 'name'>('updated');
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());
  const [favorites, setFavorites] = useState<Set<string>>(new Set(mockDocuments.filter(d => d.isFavorite).map(d => d.id)));

  const filteredDocuments = useMemo(() => {
    let docs = [...mockDocuments];

    if (searchQuery) {
      docs = docs.filter((d) =>
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (typeFilter) {
      docs = docs.filter((d) => d.type === typeFilter);
    }

    if (categoryFilter) {
      docs = docs.filter((d) => d.category === categoryFilter);
    }

    if (statusFilter) {
      docs = docs.filter((d) => d.status === statusFilter);
    }

    docs.sort((a, b) => {
      if (sortBy === 'updated') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      if (sortBy === 'created') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'views') return b.viewCount - a.viewCount;
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      return 0;
    });

    return docs;
  }, [searchQuery, typeFilter, categoryFilter, statusFilter, sortBy]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const toggleFavorite = (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavorites = new Set(favorites);
    if (newFavorites.has(docId)) {
      newFavorites.delete(docId);
    } else {
      newFavorites.add(docId);
    }
    setFavorites(newFavorites);
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
              <p className="text-gray-600 mt-2">Manage and organize your product documentation</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <Plus size={20} />
              Upload Document
            </button>
          </div>

          {/* Toolbar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="space-y-4">
              {/* Search & View Mode */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 relative">
                  <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search documents by title, description..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* View Mode Switcher */}
                <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1 bg-white">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                    title="Grid View"
                  >
                    <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                      <div className="bg-gray-600 rounded-sm"></div>
                      <div className="bg-gray-600 rounded-sm"></div>
                      <div className="bg-gray-600 rounded-sm"></div>
                      <div className="bg-gray-600 rounded-sm"></div>
                    </div>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                    title="List View"
                  >
                    <div className="space-y-1">
                      <div className="w-4 h-0.5 bg-gray-600"></div>
                      <div className="w-4 h-0.5 bg-gray-600"></div>
                    </div>
                  </button>
                  <button
                    onClick={() => setViewMode('detailed')}
                    className={`p-2 rounded transition ${viewMode === 'detailed' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                    title="Detailed View"
                  >
                    <FileText size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3 flex-wrap">
                <select
                  value={typeFilter || ''}
                  onChange={(e) => setTypeFilter(e.target.value || null)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="prd">PRD</option>
                  <option value="design-doc">Design Doc</option>
                  <option value="tech-spec">Tech Spec</option>
                  <option value="meeting-notes">Meeting Notes</option>
                  <option value="retrospective">Retrospective</option>
                  <option value="proposal">Proposal</option>
                  <option value="guide">Guide</option>
                </select>

                <select
                  value={categoryFilter || ''}
                  onChange={(e) => setCategoryFilter(e.target.value || null)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  <option value="product">Product</option>
                  <option value="engineering">Engineering</option>
                  <option value="design">Design</option>
                  <option value="operations">Operations</option>
                  <option value="marketing">Marketing</option>
                  <option value="sales">Sales</option>
                </select>

                <select
                  value={statusFilter || ''}
                  onChange={(e) => setStatusFilter(e.target.value || null)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="in-review">In Review</option>
                  <option value="approved">Approved</option>
                  <option value="archived">Archived</option>
                </select>

                <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <SortAsc size={16} className="text-gray-600" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent outline-none cursor-pointer"
                  >
                    <option value="updated">Recently Updated</option>
                    <option value="created">Recently Created</option>
                    <option value="views">Most Viewed</option>
                    <option value="name">Name A-Z</option>
                  </select>
                </div>

                <div className="text-sm text-gray-600 ml-auto">
                  {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className={`border-2 rounded-lg p-6 cursor-pointer transition hover:shadow-lg ${categoryColors[doc.category]}`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className="text-3xl">{documentTypeIcons[doc.type]}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate text-sm">{doc.title}</h3>
                        <p className="text-xs text-gray-600 line-clamp-2 mt-1">{doc.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => toggleFavorite(doc.id, e)}
                      className="p-1 hover:bg-white rounded transition"
                    >
                      <Star size={18} className={favorites.has(doc.id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'} />
                    </button>
                  </div>

                  {/* Tags & Status */}
                  <div className="mb-4 pb-4 border-b border-current border-opacity-10">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${statusColors[doc.status]}`}>
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1).replace('-', ' ')}
                      </span>
                      {doc.tags.slice(0, 2).map((tag) => (
                        <span key={tag.id} className="text-xs bg-white bg-opacity-60 px-2 py-1 rounded">
                          {tag.name}
                        </span>
                      ))}
                      {doc.tags.length > 2 && (
                        <span className="text-xs text-gray-600">+{doc.tags.length - 2}</span>
                      )}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="space-y-2 text-xs text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <User size={14} />
                      <span>{doc.createdBy}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      <span>{formatDate(doc.updatedAt)}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4 p-2 bg-white bg-opacity-60 rounded">
                    <div className="text-center">
                      <Eye size={14} className="mx-auto text-gray-600 mb-1" />
                      <p className="text-xs font-medium">{doc.viewCount}</p>
                    </div>
                    <div className="text-center">
                      <Download size={14} className="mx-auto text-gray-600 mb-1" />
                      <p className="text-xs font-medium">{doc.downloadCount}</p>
                    </div>
                    <div className="text-center">
                      <User size={14} className="mx-auto text-gray-600 mb-1" />
                      <p className="text-xs font-medium">{doc.collaborators.length}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-1.5 text-sm border border-gray-400 rounded hover:bg-white hover:bg-opacity-60 transition">
                      View
                    </button>
                    <button className="px-3 py-1.5 text-sm border border-gray-400 rounded hover:bg-white hover:bg-opacity-60 transition">
                      <Share2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="space-y-2">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <input type="checkbox" className="w-4 h-4 rounded" />
                    <span className="text-2xl">{documentTypeIcons[doc.type]}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                      <p className="text-sm text-gray-600">{doc.description.substring(0, 60)}...</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 ml-4 whitespace-nowrap">
                    <div className="text-right">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${statusColors[doc.status]}`}>
                        {doc.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div className="font-medium">{formatDate(doc.updatedAt)}</div>
                      <div className="text-xs">{doc.createdBy}</div>
                    </div>
                    <div className="text-center">
                      <Eye size={14} className="inline text-gray-400" />
                      <p className="text-sm font-medium text-gray-600">{doc.viewCount}</p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => toggleFavorite(doc.id, e)}
                        className="p-2 hover:bg-gray-100 rounded transition"
                      >
                        <Star size={16} className={favorites.has(doc.id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'} />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded transition">
                        <MoreVertical size={16} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Detailed View */}
          {viewMode === 'detailed' && (
            <div className="space-y-4">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
                  {/* Header */}
                  <div className={`px-6 py-4 border-b border-gray-200 ${categoryColors[doc.category]}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <span className="text-4xl">{documentTypeIcons[doc.type]}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900">{doc.title}</h3>
                          <p className="text-gray-600 mt-1">{doc.description}</p>
                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                            <span>By {doc.createdBy}</span>
                            <span>•</span>
                            <span>{formatDate(doc.updatedAt)}</span>
                            <span>•</span>
                            <span>{doc.currentVersion} version{doc.currentVersion !== 1 ? 's' : ''}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => toggleFavorite(doc.id, e)}
                        className="p-2 hover:bg-white hover:bg-opacity-60 rounded transition"
                      >
                        <Star size={20} className={favorites.has(doc.id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'} />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-6 py-4 grid grid-cols-4 gap-4">
                    {/* Status & Tags */}
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Status</p>
                      <span className={`text-xs font-medium px-2 py-1 rounded ${statusColors[doc.status]}`}>
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1).replace('-', ' ')}
                      </span>
                    </div>

                    {/* File Info */}
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-2">File</p>
                      <p className="text-sm font-medium text-gray-900">{doc.fileType}</p>
                      <p className="text-xs text-gray-600">{formatFileSize(doc.fileSize)}</p>
                    </div>

                    {/* Engagement */}
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Engagement</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Eye size={14} className="text-gray-600" />
                          <span>{doc.viewCount} views</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Download size={14} className="text-gray-600" />
                          <span>{doc.downloadCount} downloads</span>
                        </div>
                      </div>
                    </div>

                    {/* Collaboration */}
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Team</p>
                      <div className="flex -space-x-2">
                        {doc.collaborators.slice(0, 3).map((collab, idx) => (
                          <div
                            key={idx}
                            className="w-7 h-7 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold border border-white"
                            title={collab.userName}
                          >
                            {collab.userName.charAt(0)}
                          </div>
                        ))}
                        {doc.collaborators.length > 3 && (
                          <div className="w-7 h-7 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-bold border border-white">
                            +{doc.collaborators.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  {doc.tags.length > 0 && (
                    <div className="px-6 py-3 border-t border-gray-200 flex flex-wrap gap-2">
                      {doc.tags.map((tag) => (
                        <span key={tag.id} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                    <p className="text-xs text-gray-600">
                      Last viewed by {doc.lastViewedBy || 'No one'} on {doc.lastViewedAt ? formatDate(doc.lastViewedAt) : 'N/A'}
                    </p>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100 transition">
                        View
                      </button>
                      <button className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100 transition flex items-center gap-2">
                        <Share2 size={14} />
                        Share
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded transition">
                        <MoreVertical size={16} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
