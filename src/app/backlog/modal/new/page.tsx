'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamicImport from 'next/dynamic';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { mockFeatures, mockUsers, mockSprints } from '@/data/mockData';
import { Feature, User } from '@/types';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamicImport(() => import('react-quill'), { ssr: false });

function CreateFeatureContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = (searchParams?.get('returnUrl')) || '/backlog';
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get next feature ID
  const getNextFeatureId = () => {
    const existingIds = mockFeatures.map(f => f.id).filter(id => id.startsWith('FEAT-'));
    const numbers = existingIds.map(id => parseInt(id.replace('FEAT-', '')));
    const maxNumber = Math.max(...numbers, 0);
    return `FEAT-${maxNumber + 1}`;
  };

  // Editable state - all fields editable for new feature
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    status: 'backlog' as Feature['status'],
    priority: 'medium' as Feature['priority'],
    storyPoints: 0,
    dueDate: '',
    sprint: '',
    owner: undefined as User | undefined,
    team: [] as User[],
    tags: [] as string[],
  });

  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const [showSprintDropdown, setShowSprintDropdown] = useState(false);
  const [newTag, setNewTag] = useState('');
  const teamDropdownRef = useRef<HTMLDivElement>(null);
  const sprintDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !editData.tags.includes(newTag.trim())) {
      setEditData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setEditData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleToggleTeamMember = (userId: string) => {
    setEditData(prev => {
      const user = mockUsers.find(u => u.id === userId);
      if (!user) return prev;

      const isSelected = prev.team.some(u => u.id === userId);
      return {
        ...prev,
        team: isSelected ? prev.team.filter(u => u.id !== userId) : [...prev.team, user]
      };
    });
  };

  const saveFeature = () => {
    if (!editData.title.trim()) {
      alert('Please enter a feature title');
      return;
    }

    const newFeature: Feature = {
      id: getNextFeatureId(),
      title: editData.title,
      description: editData.description,
      status: editData.status,
      priority: editData.priority,
      type: 'feature',
      owner: editData.owner,
      team: editData.team,
      tags: editData.tags,
      storyPoints: editData.storyPoints,
      dueDate: editData.dueDate || undefined,
      epic: undefined,
      sprint: editData.sprint || undefined,
      blocks: [],
      blockedBy: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      activities: [],
    };

    // Add to mockFeatures array
    mockFeatures.push(newFeature);

    // Store new feature in localStorage for persistence
    if (typeof window !== 'undefined') {
      // Get existing new features from localStorage
      const newFeaturesJson = localStorage.getItem('new-features');
      const newFeatures = newFeaturesJson ? JSON.parse(newFeaturesJson) : [];

      // Add this feature to the list
      newFeatures.push(newFeature);
      localStorage.setItem('new-features', JSON.stringify(newFeatures));

      // Also dispatch event for immediate sync if on same page
      window.dispatchEvent(new CustomEvent('featureAdded', {
        detail: { feature: newFeature }
      }));
    }

    // Navigate to return URL (default to backlog)
    router.push(returnUrl);
  };

  const handleCancel = () => {
    router.push(returnUrl);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Create New Feature</h1>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="primary" onClick={saveFeature}>
                Create Feature
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2 space-y-4">
            {/* Title Section */}
            <Card>
              <div className="border-b border-gray-200 pb-4 mb-4">
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter feature title..."
                  className="w-full text-2xl font-bold text-gray-900 bg-transparent focus:outline-none border-0 p-0"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-3">Description</label>
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
              </div>
            </Card>

            {/* Files Section */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Files</h3>
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleFileClick}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center">
                  <div className="text-4xl mb-2">📎</div>
                  <p className="text-sm font-medium text-gray-700">
                    Drag files here or click to browse
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, PDF or ZIP files
                  </p>
                </div>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Status & Priority */}
            <Card>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase block mb-2">Status</label>
                  <select
                    value={editData.status}
                    onChange={(e) => setEditData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white cursor-pointer focus:border-blue-500 focus:outline-none"
                  >
                    <option value="backlog">Backlog</option>
                    <option value="planned">Planned</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>

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
              </div>
            </Card>

            {/* Story Points & Due Date */}
            <Card>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase block mb-2">Story Points</label>
                  <input
                    type="number"
                    value={editData.storyPoints}
                    onChange={(e) => setEditData(prev => ({ ...prev, storyPoints: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase block mb-2">Due Date</label>
                  <input
                    type="date"
                    value={editData.dueDate}
                    onChange={(e) => setEditData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </Card>

            {/* Owner & Sprint */}
            <Card>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase block mb-2">Owner</label>
                  <select
                    value={editData.owner?.id || ''}
                    onChange={(e) => {
                      const user = mockUsers.find(u => u.id === e.target.value);
                      setEditData(prev => ({ ...prev, owner: user }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white cursor-pointer focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Unassigned</option>
                    {mockUsers.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.avatar} {user.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase block mb-2">Sprint</label>
                  <div className="relative" ref={sprintDropdownRef}>
                    <button
                      onClick={() => setShowSprintDropdown(!showSprintDropdown)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white cursor-pointer focus:border-blue-500 focus:outline-none text-left"
                    >
                      {editData.sprint || 'Select Sprint'}
                    </button>
                    {showSprintDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                        <button
                          onClick={() => {
                            setEditData(prev => ({ ...prev, sprint: '' }));
                            setShowSprintDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                        >
                          None
                        </button>
                        {mockSprints.map(sprint => (
                          <button
                            key={sprint.id}
                            onClick={() => {
                              setEditData(prev => ({ ...prev, sprint: sprint.id }));
                              setShowSprintDropdown(false);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                          >
                            {sprint.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Team Members */}
            <Card>
              <label className="text-xs font-semibold text-gray-500 uppercase block mb-3">Team Members</label>
              <div className="relative" ref={teamDropdownRef}>
                <button
                  onClick={() => setShowTeamDropdown(!showTeamDropdown)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white cursor-pointer focus:border-blue-500 focus:outline-none text-left text-sm"
                >
                  {editData.team.length > 0 ? `${editData.team.length} selected` : 'Select team members'}
                </button>
                {showTeamDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                    {mockUsers.map(user => (
                      <label key={user.id} className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editData.team.some(u => u.id === user.id)}
                          onChange={() => handleToggleTeamMember(user.id)}
                          className="mr-2"
                        />
                        <span className="text-sm">{user.avatar} {user.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              {editData.team.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {editData.team.map(user => (
                    <Badge key={user.id} variant="primary">
                      {user.avatar} {user.name}
                    </Badge>
                  ))}
                </div>
              )}
            </Card>

            {/* Tags */}
            <Card>
              <label className="text-xs font-semibold text-gray-500 uppercase block mb-3">Tags</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add tag..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleAddTag}
                >
                  Add
                </Button>
              </div>
              {editData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {editData.tags.map((tag, index) => (
                    <Badge key={index} variant="default">
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(index)}
                        className="ml-2 text-xs"
                      >
                        ✕
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateFeaturePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateFeatureContent />
    </Suspense>
  );
}
