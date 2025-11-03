'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

interface MetricDefinition {
  id: string;
  name: string;
  description: string;
  measurementType: 'number' | 'percentage' | 'currency' | 'boolean';
  unit: string;
  targetValue: number;
  currentValue: number;
}

interface KPIFormData {
  title: string;
  description: string;
  timePeriod: string;
  customStartDate: string;
  customEndDate: string;
  organization: 'company' | 'department' | 'team';
  owner: string;
  contributors: string[];
  metrics: MetricDefinition[];
  dataSource: 'analytics' | 'database' | 'manual';
  updateFrequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly';
  tags: string[];
}

export default function CreateKPIPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<KPIFormData>({
    title: '',
    description: '',
    timePeriod: 'Q1 2025',
    customStartDate: '',
    customEndDate: '',
    organization: 'company',
    owner: 'user-1',
    contributors: [],
    metrics: [
      {
        id: 'metric-1',
        name: '',
        description: '',
        measurementType: 'number',
        unit: '',
        targetValue: 0,
        currentValue: 0,
      },
    ],
    dataSource: 'manual',
    updateFrequency: 'weekly',
    tags: [],
  });

  const [currentTag, setCurrentTag] = useState('');

  const handleInputChange = (field: keyof KPIFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMetricChange = (metricId: string, field: keyof MetricDefinition, value: any) => {
    setFormData((prev) => ({
      ...prev,
      metrics: prev.metrics.map((metric) =>
        metric.id === metricId ? { ...metric, [field]: value } : metric
      ),
    }));
  };

  const addMetric = () => {
    const newMetricId = `metric-${Date.now()}`;
    setFormData((prev) => ({
      ...prev,
      metrics: [
        ...prev.metrics,
        {
          id: newMetricId,
          name: '',
          description: '',
          measurementType: 'number',
          unit: '',
          targetValue: 0,
          currentValue: 0,
        },
      ],
    }));
  };

  const removeMetric = (metricId: string) => {
    if (formData.metrics.length > 1) {
      setFormData((prev) => ({
        ...prev,
        metrics: prev.metrics.filter((m) => m.id !== metricId),
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
    console.log('Saving KPI:', formData);
    router.push('/goals');
  };

  const handlePublish = () => {
    console.log('Publishing KPI:', formData);
    router.push('/goals');
  };

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
            <h1 className="text-3xl font-bold text-gray-900">Create KPI</h1>
            <div className="w-20"></div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Title Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">KPI Definition</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">KPI Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Monthly Active Users (MAU)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Describe the KPI and why it's important..."
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

            {/* Ownership Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Ownership & Tracking</h2>
              <div className="space-y-4">
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">KPI Owner *</label>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Update Frequency *</label>
                  <select
                    value={formData.updateFrequency}
                    onChange={(e) => handleInputChange('updateFrequency', e.target.value as 'daily' | 'weekly' | 'bi-weekly' | 'monthly')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="bi-weekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Data Source *</label>
                  <select
                    value={formData.dataSource}
                    onChange={(e) => handleInputChange('dataSource', e.target.value as 'analytics' | 'database' | 'manual')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="analytics">Analytics</option>
                    <option value="database">Database</option>
                    <option value="manual">Manual</option>
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

            {/* Metrics Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Metrics</h2>
              <div className="space-y-4 mb-6">
                {formData.metrics.map((metric, idx) => (
                  <div key={metric.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Metric {idx + 1}</h3>
                      {formData.metrics.length > 1 && (
                        <button
                          onClick={() => removeMetric(metric.id)}
                          className="p-2 hover:bg-red-50 rounded transition text-red-600"
                          title="Remove"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Metric Name *</label>
                          <input
                            type="text"
                            value={metric.name}
                            onChange={(e) => handleMetricChange(metric.id, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Active Users"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                          <input
                            type="text"
                            value={metric.unit}
                            onChange={(e) => handleMetricChange(metric.id, 'unit', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., count, %, $"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input
                          type="text"
                          value={metric.description}
                          onChange={(e) => handleMetricChange(metric.id, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Describe this metric..."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Measurement Type</label>
                          <select
                            value={metric.measurementType}
                            onChange={(e) => handleMetricChange(metric.id, 'measurementType', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="number">Number</option>
                            <option value="percentage">Percentage</option>
                            <option value="currency">Currency</option>
                            <option value="boolean">Yes/No</option>
                          </select>
                        </div>
                        <div></div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Current Value</label>
                          <input
                            type="number"
                            value={metric.currentValue}
                            onChange={(e) => handleMetricChange(metric.id, 'currentValue', parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Target Value</label>
                          <input
                            type="number"
                            value={metric.targetValue}
                            onChange={(e) => handleMetricChange(metric.id, 'targetValue', parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={addMetric}
                className="flex items-center gap-2 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
              >
                <Plus size={20} />
                Add Metric
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
                Publish KPI
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
