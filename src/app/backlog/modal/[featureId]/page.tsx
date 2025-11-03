'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { mockFeatures, mockUsers, mockSprints, mockTestCases, mockComments, mockActivities, mockFeatureVersions } from '@/data/mockData';
import { Feature, User } from '@/types';
import { Avatar } from '@/components/Avatar';
import { ChevronDownIcon } from '@/components/icons';
import 'react-quill/dist/quill.snow.css';

// Dynamic import for Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function FeatureDetailModal() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const featureId = params.featureId as string;

  // Get initial feature from mockData
  let initialFeature = mockFeatures.find(f => f.id === featureId);

  // If feature not found, try to parse from query params (for updated data)
  if (!initialFeature) {
    const featureData = searchParams.get('feature');
    if (featureData) {
      try {
        initialFeature = JSON.parse(decodeURIComponent(featureData));
      } catch (e) {
        console.error('Failed to parse feature data from URL');
      }
    }
  }

  const feature = initialFeature;
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'comments' | 'testing' | 'history'>('overview');
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [titleEditing, setTitleEditing] = useState(false);
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const [showSprintDropdown, setShowSprintDropdown] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const actionsMenuRef = useRef<HTMLDivElement>(null);
  const teamDropdownRef = useRef<HTMLDivElement>(null);
  const sprintDropdownRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Editable state - all fields editable
  const [editData, setEditData] = useState({
    title: feature?.title || '',
    description: feature?.description || '',
    status: feature?.status || 'backlog',
    priority: feature?.priority || 'medium',
    storyPoints: feature?.storyPoints || 0,
    dueDate: feature?.dueDate || '',
    sprint: feature?.sprint || '',
    owner: feature?.owner || undefined as User | undefined,
    team: feature?.team || [],
    tags: feature?.tags || [],
  });

  // Get related data
  const creator = feature?.activities?.find(a => a.type === 'created')?.user || mockUsers[0];
  const testCases = mockTestCases[featureId] || [];
  const comments = mockComments[featureId] || [];
  const activities = mockActivities[featureId] || [];
  const versions = mockFeatureVersions[featureId] || [];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target as Node)) {
        setShowActionsMenu(false);
      }
      if (teamDropdownRef.current && !teamDropdownRef.current.contains(event.target as Node)) {
        setShowTeamDropdown(false);
      }
      if (sprintDropdownRef.current && !sprintDropdownRef.current.contains(event.target as Node)) {
        setShowSprintDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus title input when editing
  useEffect(() => {
    if (titleEditing && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [titleEditing]);

  const getStatusVariant = (status: Feature['status']) => {
    const variants = {
      'backlog': 'default',
      'planned': 'info',
      'in-progress': 'warning',
      'done': 'success',
      'archived': 'default',
    };
    return variants[status] as any;
  };

  const getPriorityVariant = (priority: Feature['priority']) => {
    const variants = {
      'critical': 'error',
      'high': 'warning',
      'medium': 'info',
      'low': 'default',
    };
    return variants[priority] as any;
  };

  const getTestStatusVariant = (status: string) => {
    const variants: Record<string, string> = {
      'passed': 'success',
      'failed': 'error',
      'pending': 'warning',
      'skipped': 'default',
    };
    return (variants[status] || 'default') as any;
  };

  const handleClose = () => {
    router.back();
  };

  const handleAction = (action: string) => {
    setShowActionsMenu(false);

    switch (action) {
      case 'duplicate':
        if (feature) {
          alert(`Feature duplicated as ${feature.id}-COPY-${Date.now()}`);
        }
        break;
      case 'move-to-sprint':
        setShowSprintDropdown(true);
        break;
      case 'archive':
        if (feature) {
          alert(`Feature ${feature.id} archived`);
          setTimeout(handleClose, 500);
        }
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this feature? This action cannot be undone.')) {
          alert(`Feature ${feature?.id} deleted`);
          setTimeout(handleClose, 500);
        }
        break;
      case 'export-pdf':
        if (feature) {
          alert(`Exporting ${feature.id} to PDF...`);
        }
        break;
      case 'copy-link':
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
        break;
    }
  };

  const handleTeamToggle = (userId: string) => {
    setEditData(prev => {
      const user = mockUsers.find(u => u.id === userId);
      if (!user) return prev;

      const isSelected = prev.team.some(u => u.id === userId);
      const newTeam = isSelected
        ? prev.team.filter(u => u.id !== userId)
        : [...prev.team, user];

      return { ...prev, team: newTeam };
    });
  };

  const handleSprintSelect = (sprintId: string) => {
    setEditData(prev => ({
      ...prev,
      sprint: sprintId
    }));
    setShowSprintDropdown(false);
  };

  const handleTitleBlur = () => {
    setTitleEditing(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setTitleEditing(false);
      saveChanges();
    } else if (e.key === 'Escape') {
      setTitleEditing(false);
    }
  };

  // Save changes to localStorage and persist state
  const saveChanges = () => {
    if (!feature) return;

    // Update the feature in mockFeatures
    const featureIndex = mockFeatures.findIndex(f => f.id === feature.id);
    if (featureIndex !== -1) {
      // Create updated feature object
      const updatedFeature: Feature = {
        ...mockFeatures[featureIndex],
        title: editData.title,
        description: editData.description,
        status: editData.status,
        priority: editData.priority,
        storyPoints: editData.storyPoints,
        dueDate: editData.dueDate,
        sprint: editData.sprint,
        owner: editData.owner,
        team: editData.team,
        tags: editData.tags,
        updatedAt: new Date().toISOString(),
      };

      // Update mockFeatures array
      mockFeatures[featureIndex] = updatedFeature;

      // Store in sessionStorage for backlog to pick up
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`feature-${feature.id}`, JSON.stringify(updatedFeature));
        // Emit custom event so backlog can listen
        window.dispatchEvent(new CustomEvent('featureUpdated', {
          detail: { featureId: feature.id, feature: updatedFeature }
        }));
      }
    }
  };

  // File upload handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleFileRemove = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  if (!feature) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="max-w-md w-full">
          <div className="text-center py-8">
            <p className="text-gray-600">Feature not found</p>
            <Button variant="secondary" onClick={handleClose} className="mt-4">
              Close
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Full-screen Modal */}
      <div className="fixed inset-0 bg-white z-50 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleClose}
                className="hover:bg-gray-100"
              >
                ← Close
              </Button>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-500">{feature.id}</div>
                {titleEditing ? (
                  <input
                    ref={titleInputRef}
                    type="text"
                    value={editData.title}
                    onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                    onBlur={handleTitleBlur}
                    onKeyDown={handleTitleKeyDown}
                    className="text-2xl font-bold text-gray-900 border-b-2 border-blue-500 focus:outline-none bg-transparent w-full"
                  />
                ) : (
                  <h1
                    onClick={() => setTitleEditing(true)}
                    className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                    title="Click to edit"
                  >
                    {editData.title}
                  </h1>
                )}
              </div>
            </div>

            {/* Status & Priority & Actions */}
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <Badge variant={getStatusVariant(editData.status)}>
                  {editData.status}
                </Badge>
                <Badge variant={getPriorityVariant(editData.priority)}>
                  {editData.priority}
                </Badge>
              </div>

              <div className="relative" ref={actionsMenuRef}>
                <button
                  onClick={() => setShowActionsMenu(!showActionsMenu)}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                  title="More actions"
                >
                  ⋮
                </button>

                {/* Dropdown Menu */}
                {showActionsMenu && (
                  <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-48">
                    <button
                      onClick={() => handleAction('duplicate')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg"
                    >
                      ⎘ Duplicate
                    </button>
                    <button
                      onClick={() => handleAction('move-to-sprint')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      → Move to Sprint
                    </button>
                    <button
                      onClick={() => handleAction('archive')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      📦 Archive
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={() => handleAction('export-pdf')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      ↓ Export to PDF
                    </button>
                    <button
                      onClick={() => handleAction('copy-link')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      🔗 Copy Link
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={() => handleAction('delete')}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 last:rounded-b-lg"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="border-t border-gray-200 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-6 text-sm">
              <div>
                <span className="text-gray-500">Created by:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {creator ? `${creator.avatar} ${creator.name}` : 'Unknown'}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Created:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {new Date(feature.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Updated:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {new Date(feature.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-6 flex gap-8">
            {(['overview', 'activity', 'comments', 'testing', 'history'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-0 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="col-span-2 space-y-6">
                  {/* Description - Quill Rich Text Editor */}
                  <Card>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white quill-editor">
                      <ReactQuill
                        value={editData.description}
                        onChange={(value) => setEditData(prev => ({ ...prev, description: value }))}
                        modules={modules}
                        theme="snow"
                        placeholder="Write your feature description here..."
                        className="h-48"
                      />
                    </div>
                  </Card>

                  {/* Acceptance Criteria */}
                  <Card>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Acceptance Criteria</h2>
                    <div className="space-y-2">
                      {feature.acceptanceCriteria?.map((criterion) => (
                        <div key={criterion.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                          <input
                            type="checkbox"
                            defaultChecked={criterion.completed}
                            className="rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            defaultValue={criterion.description}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-gray-700 focus:border-blue-500 focus:outline-none"
                          />
                          <button className="text-red-600 hover:text-red-700 text-xs px-2">Delete</button>
                        </div>
                      ))}
                    </div>
                    <Button variant="secondary" size="sm" className="mt-3">
                      + Add Criterion
                    </Button>
                  </Card>

                  {/* Dependencies */}
                  <Card>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Dependencies</h2>
                    <div className="text-gray-600">
                      <p className="text-sm mb-2">
                        {feature.blocks && feature.blocks.length > 0
                          ? `Blocks: ${feature.blocks.join(', ')}`
                          : 'No dependencies'}
                      </p>
                      <Button variant="secondary" size="sm">
                        + Add Dependency
                      </Button>
                    </div>
                  </Card>

                  {/* Related Items */}
                  <Card>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Related Items</h2>
                    <div className="text-gray-600">
                      <p className="text-sm mb-2">No related items</p>
                      <Button variant="secondary" size="sm">
                        + Add Relationship
                      </Button>
                    </div>
                  </Card>

                  {/* Attachments - Drag & Drop */}
                  <Card>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Attachments</h2>

                    {/* Drag and Drop Area */}
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        dragActive
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <div className="space-y-2">
                        <div className="text-3xl">📁</div>
                        <p className="text-sm font-medium text-gray-900">Drag and drop your files here</p>
                        <p className="text-xs text-gray-500">or</p>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-block px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Click to browse
                        </button>
                        <p className="text-xs text-gray-400 mt-2">Max 10MB per file</p>
                      </div>
                    </div>

                    {/* Uploaded Files List */}
                    {uploadedFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h3 className="text-sm font-semibold text-gray-900">Uploaded Files</h3>
                        {uploadedFiles.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 border border-gray-200">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">📄</span>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleFileRemove(idx)}
                              className="text-red-600 hover:text-red-700 text-xs px-3 py-1 hover:bg-red-50 rounded"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Existing Attachments */}
                    {feature.attachments && feature.attachments.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h3 className="text-sm font-semibold text-gray-900">Existing Files</h3>
                        {feature.attachments.map(att => (
                          <div key={att.id} className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 border border-gray-200">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">📄</span>
                              <p className="text-sm font-medium text-gray-900">{att.name}</p>
                            </div>
                            <button className="text-red-600 hover:text-red-700 text-xs px-3 py-1 hover:bg-red-50 rounded">Delete</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>

                {/* Sidebar - Details Section */}
                <div className="space-y-4">
                  <Card>
                    <h3 className="font-semibold text-gray-900 mb-4">Details</h3>
                    <div className="space-y-4 text-sm">
                      {/* Status */}
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase block mb-2">Status</label>
                        <select
                          value={editData.status}
                          onChange={(e) => {
                            setEditData(prev => ({ ...prev, status: e.target.value as any }));
                            // Save after status change
                            setTimeout(() => {
                              setEditData(prev => {
                                const updated = { ...prev, status: e.target.value as any };
                                if (feature) {
                                  const featureIndex = mockFeatures.findIndex(f => f.id === feature.id);
                                  if (featureIndex !== -1) {
                                    mockFeatures[featureIndex] = {
                                      ...mockFeatures[featureIndex],
                                      status: updated.status as any,
                                      updatedAt: new Date().toISOString(),
                                    };
                                    if (typeof window !== 'undefined') {
                                      sessionStorage.setItem(`feature-${feature.id}`, JSON.stringify(mockFeatures[featureIndex]));
                                      window.dispatchEvent(new CustomEvent('featureUpdated', {
                                        detail: { featureId: feature.id, feature: mockFeatures[featureIndex] }
                                      }));
                                    }
                                  }
                                }
                                return updated;
                              });
                            }, 0);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white cursor-pointer focus:border-blue-500 focus:outline-none"
                        >
                          <option value="backlog">Backlog</option>
                          <option value="planned">Planned</option>
                          <option value="in-progress">In Progress</option>
                          <option value="done">Done</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>

                      {/* Priority */}
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase block mb-2">Priority</label>
                        <select
                          value={editData.priority}
                          onChange={(e) => setEditData(prev => ({ ...prev, priority: e.target.value as any }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white cursor-pointer focus:border-blue-500 focus:outline-none"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>

                      {/* Owner */}
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase block mb-2">Owner</label>
                        <select
                          value={editData.owner?.id || ''}
                          onChange={(e) => {
                            const user = mockUsers.find(u => u.id === e.target.value);
                            setEditData(prev => ({ ...prev, owner: user }));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white cursor-pointer focus:border-blue-500 focus:outline-none appearance-none bg-no-repeat bg-right"
                          style={{ paddingRight: '2rem' }}
                        >
                          <option value="">Unassigned</option>
                          {mockUsers.map(user => (
                            <option key={user.id} value={user.id}>
                              {user.name}
                            </option>
                          ))}
                        </select>
                        {editData.owner && (
                          <div className="mt-2 flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                            <Avatar name={editData.owner.name} size="sm" />
                            <span className="text-sm text-gray-700">{editData.owner.name}</span>
                          </div>
                        )}
                      </div>

                      {/* Team Members (Multiple Selection) */}
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase block mb-2">Team Members</label>
                        <div className="relative" ref={teamDropdownRef}>
                          <button
                            onClick={() => setShowTeamDropdown(!showTeamDropdown)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white hover:border-gray-400 cursor-pointer text-left flex items-center justify-between focus:border-blue-500 focus:outline-none"
                          >
                            <span>
                              {editData.team.length > 0
                                ? `${editData.team.length} selected`
                                : 'Select team members'}
                            </span>
                            <ChevronDownIcon size={16} className="text-gray-600" />
                          </button>

                          {showTeamDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                              {mockUsers.map((user) => (
                                <label
                                  key={user.id}
                                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={editData.team.some(u => u.id === user.id)}
                                    onChange={() => handleTeamToggle(user.id)}
                                    className="rounded cursor-pointer"
                                  />
                                  <Avatar name={user.name} size="sm" />
                                  <span>{user.name}</span>
                                </label>
                              ))}
                            </div>
                          )}

                          {/* Selected Team Members Tags */}
                          {editData.team.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {editData.team.map(user => (
                                <Badge key={user.id} variant="default" size="sm">
                                  {user.avatar} {user.name}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Sprint Dropdown */}
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase block mb-2">Sprint</label>
                        <div className="relative" ref={sprintDropdownRef}>
                          <button
                            onClick={() => setShowSprintDropdown(!showSprintDropdown)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white hover:border-gray-400 cursor-pointer text-left flex items-center justify-between focus:border-blue-500 focus:outline-none"
                          >
                            <span>
                              {editData.sprint
                                ? mockSprints.find(s => s.id === editData.sprint)?.name || editData.sprint
                                : 'No Sprint'}
                            </span>
                            <ChevronDownIcon size={16} className="text-gray-600" />
                          </button>

                          {showSprintDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                              <button
                                onClick={() => {
                                  setEditData(prev => ({ ...prev, sprint: '' }));
                                  setShowSprintDropdown(false);
                                }}
                                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                No Sprint
                              </button>
                              {mockSprints.map((sprint) => (
                                <button
                                  key={sprint.id}
                                  onClick={() => {
                                    handleSprintSelect(sprint.id);
                                  }}
                                  className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                                    editData.sprint === sprint.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700'
                                  }`}
                                >
                                  {sprint.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Story Points */}
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase block mb-2">Story Points</label>
                        <input
                          type="number"
                          value={editData.storyPoints}
                          onChange={(e) => setEditData(prev => ({ ...prev, storyPoints: parseInt(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:border-blue-500 focus:outline-none"
                        />
                      </div>

                      {/* Due Date */}
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase block mb-2">Due Date</label>
                        <input
                          type="date"
                          value={editData.dueDate}
                          onChange={(e) => {
                            setEditData(prev => ({ ...prev, dueDate: e.target.value }));
                            // Save after date change
                            setTimeout(() => {
                              if (feature) {
                                const featureIndex = mockFeatures.findIndex(f => f.id === feature.id);
                                if (featureIndex !== -1) {
                                  mockFeatures[featureIndex] = {
                                    ...mockFeatures[featureIndex],
                                    dueDate: e.target.value,
                                    updatedAt: new Date().toISOString(),
                                  };
                                  if (typeof window !== 'undefined') {
                                    sessionStorage.setItem(`feature-${feature.id}`, JSON.stringify(mockFeatures[featureIndex]));
                                    window.dispatchEvent(new CustomEvent('featureUpdated', {
                                      detail: { featureId: feature.id, feature: mockFeatures[featureIndex] }
                                    }));
                                  }
                                }
                              }
                            }, 0);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:border-blue-500 focus:outline-none"
                        />
                      </div>

                      {/* Tags */}
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase block mb-2">Tags</label>
                        <div className="flex flex-wrap gap-2">
                          {editData.tags.length > 0 ? (
                            editData.tags.map(tag => (
                              <Badge key={tag} variant="default" size="sm">{tag}</Badge>
                            ))
                          ) : (
                            <span className="text-xs text-gray-500">No tags</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h2>
                <div className="space-y-4">
                  {activities && activities.length > 0 ? (
                    activities.map((activity) => (
                      <div key={activity.id} className="flex gap-3 pb-4 border-b last:border-b-0">
                        <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {activity.description}
                            {activity.oldValue && activity.newValue && (
                              <span className="text-gray-600 font-normal">
                                {' '}from <span className="font-semibold">{activity.oldValue}</span> to{' '}
                                <span className="font-semibold">{activity.newValue}</span>
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-gray-500">
                            by {activity.user?.name} • {new Date(activity.timestamp).toLocaleDateString()} at {new Date(activity.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No activities yet</p>
                  )}
                </div>
              </Card>
            )}

            {activeTab === 'comments' && (
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Comments</h2>
                <div className="space-y-4">
                  {comments && comments.length > 0 ? (
                    comments.map((comment) => (
                      <div key={comment.id} className="border-b pb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">{comment.author.name}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                          {comment.resolved && (
                            <Badge variant="success" size="sm">Resolved</Badge>
                          )}
                        </div>
                        <p className="text-gray-700 mb-2">{comment.content}</p>

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="ml-6 mt-3 space-y-3 border-l-2 border-gray-200 pl-4">
                            {comment.replies.map(reply => (
                              <div key={reply.id}>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-gray-900 text-sm">{reply.author.name}</span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(reply.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-gray-700 text-sm">{reply.content}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 mb-4">No comments yet</p>
                  )}

                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-semibold text-gray-900 mb-3">Add Comment</h3>
                    <textarea
                      placeholder="Add a comment..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                      rows={3}
                    />
                    <Button variant="primary" size="sm" className="mt-2">
                      Post Comment
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'testing' && (
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Testing</h2>
                {testCases && testCases.length > 0 ? (
                  <div className="space-y-3">
                    {testCases.map(testCase => (
                      <div key={testCase.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{testCase.name}</h3>
                          <Badge variant={getTestStatusVariant(testCase.status)}>
                            {testCase.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{testCase.description}</p>
                        {testCase.executedDate && testCase.executedBy && (
                          <p className="text-xs text-gray-500">
                            Executed by {testCase.executedBy.avatar} {testCase.executedBy.name} on {new Date(testCase.executedDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No test cases linked</p>
                    <Button variant="secondary" size="sm" className="mt-3">
                      + Link Test Case
                    </Button>
                  </div>
                )}
              </Card>
            )}

            {activeTab === 'history' && (
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">History</h2>
                {versions && versions.length > 0 ? (
                  <div className="space-y-3">
                    {versions.map((version) => (
                      <div key={version.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">Version {version.version}</h3>
                          <span className="text-xs text-gray-500">
                            {new Date(version.changedDate).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Changed by {version.changedBy.avatar} {version.changedBy.name}</p>
                        <div className="space-y-1">
                          {version.changes.map((change) => (
                            <p key={`${version.id}-${change.field}`} className="text-xs text-gray-600">
                              <span className="font-medium">{change.field}:</span> {change.oldValue || 'created'} → {change.newValue}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No history available</p>
                )}
              </Card>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .quill-editor .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid #d1d5db !important;
          padding: 8px !important;
          background-color: #f9fafb !important;
        }
        .quill-editor .ql-container {
          border: none !important;
          font-size: 16px !important;
        }
        .quill-editor .ql-editor {
          min-height: 200px !important;
        }
      `}</style>
    </>
  );
}
