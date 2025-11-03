'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { ArrowLeft, Plus, Trash2, CheckCircle } from 'lucide-react';

interface Deliverable {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  owner: string;
  dueDate: string;
}

interface MilestoneFormData {
  title: string;
  description: string;
  dueDate: string;
  parentGoalId: string;
  organization: 'company' | 'department' | 'team';
  owner: string;
  contributors: string[];
  deliverables: Deliverable[];
  linkedFeatureIds: string[];
  linkedSprintIds: string[];
  priority: 'critical' | 'high' | 'medium' | 'low';
  tags: string[];
}

export default function CreateMilestonePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<MilestoneFormData>({
    title: '',
    description: '',
    dueDate: '',
    parentGoalId: '',
    organization: 'company',
    owner: 'user-1',
    contributors: [],
    deliverables: [
      {
        id: 'del-1',
        title: '',
        description: '',
        status: 'pending',
        owner: 'user-1',
        dueDate: '',
      },
    ],
    linkedFeatureIds: [],
    linkedSprintIds: [],
    priority: 'high',
    tags: [],
  });

  const [currentTag, setCurrentTag] = useState('');

  const handleInputChange = (field: keyof MilestoneFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDeliverableChange = (delId: string, field: keyof Deliverable, value: any) => {
    setFormData((prev) => ({
      ...prev,
      deliverables: prev.deliverables.map((del) =>
        del.id === delId ? { ...del, [field]: value } : del
      ),
    }));
  };

  const addDeliverable = () => {
    const newDelId = `del-${Date.now()}`;
    setFormData((prev) => ({
      ...prev,
      deliverables: [
        ...prev.deliverables,
        {
          id: newDelId,
          title: '',
          description: '',
          status: 'pending',
          owner: 'user-1',
          dueDate: '',
        },
      ],
    }));
  };

  const removeDeliverable = (delId: string) => {
    if (formData.deliverables.length > 1) {
      setFormData((prev) => ({
        ...prev,
        deliverables: prev.deliverables.filter((d) => d.id !== delId),
      }));
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSave = () => {
    console.log('Saving Milestone:', formData);
    router.push('/goals');
  };

  const handlePublish = () => {
    console.log('Publishing Milestone:', formData);
    router.push('/goals');
  };

  const completedCount = formData.deliverables.filter((d) => d.status === 'completed').length;
  const completionPercent = Math.round((completedCount / formData.deliverables.length) * 100);

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition"
            >
              <ArrowLeft size={20} />
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Create Milestone</h1>
            <div className="w-20"></div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Milestone Info Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Milestone Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Milestone Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Launch API Version 2.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Describe the milestone objectives..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Target Date *</label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Priority *</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => handleInputChange('priority', e.target.value as 'critical' | 'high' | 'medium' | 'low')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Ownership Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Ownership & Alignment</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Parent Goal (if nested)</label>
                  <select
                    value={formData.parentGoalId}
                    onChange={(e) => handleInputChange('parentGoalId', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">None - Top Level</option>
                    <option value="GOAL-001">Improve Customer Satisfaction</option>
                    <option value="GOAL-002">Reduce Support Response Time</option>
                    <option value="GOAL-003">Monthly Active Users (MAU)</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Organization Level *</label>
                    <select
                      value={formData.organization}
                      onChange={(e) => handleInputChange('organization', e.target.value as 'company' | 'department' | 'team')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="company">Company</option>
                      <option value="department">Department</option>
                      <option value="team">Team</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Milestone Owner *</label>
                    <select
                      value={formData.owner}
                      onChange={(e) => handleInputChange('owner', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="user-1">User 1</option>
                      <option value="user-2">User 2</option>
                      <option value="user-3">User 3</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Contributors</label>
                  <div className="flex gap-2 flex-wrap">
                    {['user-1', 'user-2', 'user-3'].map((user) => (
                      <label key={user} className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={formData.contributors.includes(user)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleInputChange('contributors', [...formData.contributors, user]);
                            } else {
                              handleInputChange('contributors', formData.contributors.filter((c) => c !== user));
                            }
                          }}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                        {user}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Deliverables Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Deliverables</h2>
                <div className="text-sm text-gray-600">
                  <CheckCircle className="inline mr-1" size={16} />
                  {completedCount}/{formData.deliverables.length} completed ({completionPercent}%)
                </div>
              </div>

              <div className="space-y-4 mb-6">
                {formData.deliverables.map((deliverable, idx) => (
                  <div key={deliverable.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Deliverable {idx + 1}</h3>
                      {formData.deliverables.length > 1 && (
                        <button
                          onClick={() => removeDeliverable(deliverable.id)}
                          className="p-2 hover:bg-red-50 rounded transition text-red-600"
                          title="Remove"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                        <input
                          type="text"
                          value={deliverable.title}
                          onChange={(e) => handleDeliverableChange(deliverable.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Complete API documentation"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input
                          type="text"
                          value={deliverable.description}
                          onChange={(e) => handleDeliverableChange(deliverable.id, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Additional details..."
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                          <select
                            value={deliverable.status}
                            onChange={(e) => handleDeliverableChange(deliverable.id, 'status', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
                          <select
                            value={deliverable.owner}
                            onChange={(e) => handleDeliverableChange(deliverable.id, 'owner', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="user-1">User 1</option>
                            <option value="user-2">User 2</option>
                            <option value="user-3">User 3</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                          <input
                            type="date"
                            value={deliverable.dueDate}
                            onChange={(e) => handleDeliverableChange(deliverable.id, 'dueDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={addDeliverable}
                className="flex items-center gap-2 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
              >
                <Plus size={20} />
                Add Deliverable
              </button>
            </div>

            {/* Tags Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Tags & Metadata</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add a tag and press Enter"
                    />
                    <button
                      onClick={handleAddTag}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {formData.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-blue-900"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
              >
                Save Draft
              </button>
              <button
                onClick={handlePublish}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Publish Milestone
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
