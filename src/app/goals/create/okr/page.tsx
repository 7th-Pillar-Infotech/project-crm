'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

interface KeyResultForm {
  id: string;
  title: string;
  description: string;
  measurementType: 'number' | 'percentage' | 'currency' | 'boolean';
  startValue: number;
  targetValue: number;
  owner: string;
  weight: number;
  confidenceLevel: number;
}

interface OKRFormData {
  objective: string;
  description: string;
  timePeriod: string;
  customStartDate: string;
  customEndDate: string;
  parentGoalId: string;
  organization: 'company' | 'department' | 'team';
  owner: string;
  contributors: string[];
  keyResults: KeyResultForm[];
  linkedFeatureIds: string[];
  linkedSprintIds: string[];
  tags: string[];
}

export default function CreateOKRPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<OKRFormData>({
    objective: '',
    description: '',
    timePeriod: 'Q1 2025',
    customStartDate: '',
    customEndDate: '',
    parentGoalId: '',
    organization: 'company',
    owner: 'user-1',
    contributors: [],
    keyResults: [
      {
        id: 'kr-1',
        title: '',
        description: '',
        measurementType: 'number',
        startValue: 0,
        targetValue: 0,
        owner: 'user-1',
        weight: 0,
        confidenceLevel: 0,
      },
    ],
    linkedFeatureIds: [],
    linkedSprintIds: [],
    tags: [],
  });

  const [currentTag, setCurrentTag] = useState('');

  const handleInputChange = (field: keyof OKRFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleKeyResultChange = (krId: string, field: keyof KeyResultForm, value: any) => {
    setFormData((prev) => ({
      ...prev,
      keyResults: prev.keyResults.map((kr) =>
        kr.id === krId ? { ...kr, [field]: value } : kr
      ),
    }));
  };

  const addKeyResult = () => {
    const newKRId = `kr-${Date.now()}`;
    setFormData((prev) => ({
      ...prev,
      keyResults: [
        ...prev.keyResults,
        {
          id: newKRId,
          title: '',
          description: '',
          measurementType: 'number',
          startValue: 0,
          targetValue: 0,
          owner: 'user-1',
          weight: 0,
          confidenceLevel: 0,
        },
      ],
    }));
  };

  const removeKeyResult = (krId: string) => {
    if (formData.keyResults.length > 1) {
      setFormData((prev) => ({
        ...prev,
        keyResults: prev.keyResults.filter((kr) => kr.id !== krId),
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
    console.log('Saving OKR:', formData);
    router.push('/goals');
  };

  const handlePublish = () => {
    console.log('Publishing OKR:', formData);
    router.push('/goals');
  };

  const totalWeight = formData.keyResults.reduce((sum, kr) => sum + kr.weight, 0);
  const isWeightValid = totalWeight === 100;

  return (
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
          <h1 className="text-3xl font-bold text-gray-900">Create OKR</h1>
          <div className="w-20"></div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Objective Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Objective</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Objective Title *</label>
                <input
                  type="text"
                  value={formData.objective}
                  onChange={(e) => handleInputChange('objective', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Improve customer satisfaction and retention"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Describe what you want to achieve and why it matters..."
                />
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Timeline</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Time Period *</label>
                <select
                  value={formData.timePeriod}
                  onChange={(e) => handleInputChange('timePeriod', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Q1 2025">Q1 2025</option>
                  <option value="Q2 2025">Q2 2025</option>
                  <option value="Q3 2025">Q3 2025</option>
                  <option value="Q4 2025">Q4 2025</option>
                  <option value="Annual 2025">Annual 2025</option>
                  <option value="Custom">Custom Date Range</option>
                </select>
              </div>
              {formData.timePeriod === 'Custom' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={formData.customStartDate}
                      onChange={(e) => handleInputChange('customStartDate', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={formData.customEndDate}
                      onChange={(e) => handleInputChange('customEndDate', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Alignment Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Alignment & Ownership</h2>
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
                </select>
              </div>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Goal Owner *</label>
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

          {/* Key Results Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Key Results</h2>
              {!isWeightValid && (
                <span className="text-sm text-red-600 font-medium">Weights must total 100% (currently {totalWeight}%)</span>
              )}
            </div>

            <div className="space-y-4 mb-6">
              {formData.keyResults.map((kr, idx) => (
                <div key={kr.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Key Result {idx + 1}</h3>
                    {formData.keyResults.length > 1 && (
                      <button
                        onClick={() => removeKeyResult(kr.id)}
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
                        value={kr.title}
                        onChange={(e) => handleKeyResultChange(kr.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Increase NPS from 45 to 60"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Measurement Type</label>
                        <select
                          value={kr.measurementType}
                          onChange={(e) => handleKeyResultChange(kr.id, 'measurementType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="number">Number</option>
                          <option value="percentage">Percentage</option>
                          <option value="currency">Currency</option>
                          <option value="boolean">Yes/No</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Value</label>
                        <input
                          type="number"
                          value={kr.startValue}
                          onChange={(e) => handleKeyResultChange(kr.id, 'startValue', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Target Value</label>
                        <input
                          type="number"
                          value={kr.targetValue}
                          onChange={(e) => handleKeyResultChange(kr.id, 'targetValue', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
                        <select
                          value={kr.owner}
                          onChange={(e) => handleKeyResultChange(kr.id, 'owner', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="user-1">User 1</option>
                          <option value="user-2">User 2</option>
                          <option value="user-3">User 3</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Weight %</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={kr.weight}
                          onChange={(e) => handleKeyResultChange(kr.id, 'weight', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confidence %</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={kr.confidenceLevel}
                          onChange={(e) => handleKeyResultChange(kr.id, 'confidenceLevel', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addKeyResult}
              className="flex items-center gap-2 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
            >
              <Plus size={20} />
              Add Key Result
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
                    placeholder="Add a tag and press Enter or click Add"
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
              disabled={!isWeightValid}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                isWeightValid
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              title={!isWeightValid ? 'Key Result weights must total 100%' : ''}
            >
              Publish OKR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
