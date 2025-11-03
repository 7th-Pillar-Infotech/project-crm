'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { mockRequirements } from '@/lib/mockData';
import { Requirement } from '@/types';
import { Filter, Plus, Eye, Edit2, CheckCircle2, AlertCircle, Clock, Code2 } from 'lucide-react';

type ViewMode = 'table' | 'traceability';

export default function RequirementsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);

  const getStatusVariant = (status: Requirement['status']) => {
    const variants = {
      'draft': 'default',
      'review': 'info',
      'approved': 'success',
      'in-dev': 'warning',
      'testing': 'primary',
      'completed': 'success',
      'rejected': 'error',
    };
    return variants[status] as any;
  };

  const getPriorityVariant = (priority: Requirement['priority']) => {
    const variants = {
      'critical': 'error',
      'high': 'warning',
      'medium': 'info',
      'low': 'default',
    };
    return variants[priority] as any;
  };

  const getTypeVariant = (type: Requirement['type']) => {
    const variants = {
      'functional': 'primary',
      'non-functional': 'info',
      'business': 'warning',
      'technical': 'success',
    };
    return variants[type] as any;
  };

  const getTypeIcon = (type: Requirement['type']) => {
    const icons = {
      'functional': <Code2 className="w-4 h-4" />,
      'non-functional': <Clock className="w-4 h-4" />,
      'business': <AlertCircle className="w-4 h-4" />,
      'technical': <CheckCircle2 className="w-4 h-4" />,
    };
    return icons[type];
  };

  const toggleFilter = (category: 'type' | 'status' | 'priority', value: string) => {
    if (category === 'type') {
      setSelectedTypes(selectedTypes.includes(value)
        ? selectedTypes.filter(t => t !== value)
        : [...selectedTypes, value]
      );
    } else if (category === 'status') {
      setSelectedStatuses(selectedStatuses.includes(value)
        ? selectedStatuses.filter(s => s !== value)
        : [...selectedStatuses, value]
      );
    } else {
      setSelectedPriorities(selectedPriorities.includes(value)
        ? selectedPriorities.filter(p => p !== value)
        : [...selectedPriorities, value]
      );
    }
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedStatuses([]);
    setSelectedPriorities([]);
  };

  const filteredRequirements = mockRequirements.filter(req => {
    const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(req.type);
    const statusMatch = selectedStatuses.length === 0 || selectedStatuses.includes(req.status);
    const priorityMatch = selectedPriorities.length === 0 || selectedPriorities.includes(req.priority);
    return typeMatch && statusMatch && priorityMatch;
  });

  const activeFilterCount = selectedTypes.length + selectedStatuses.length + selectedPriorities.length;

  return (
    <AppLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Requirements</h1>
            <p className="text-gray-600 mt-1">Manage product requirements and specifications</p>
          </div>
          <Button variant="primary" size="sm" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Requirement
          </Button>
        </div>

        {/* View Mode Tabs */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'table'
                ? 'bg-blue-600 text-white border border-blue-600'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
            }`}
          >
            Table View
          </button>
          <button
            onClick={() => setViewMode('traceability')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'traceability'
                ? 'bg-blue-600 text-white border border-blue-600'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
            }`}
          >
            Traceability
          </button>
        </div>

        {/* Main Layout with Sidebar */}
        <div className="flex gap-6">
          {/* Left Sidebar - Filters */}
          <Card className="w-72 h-fit bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 sticky top-6">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-300">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" />
                Filters
              </h3>
              {activeFilterCount > 0 && (
                <span className="px-2.5 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </div>

            {/* Type Filter */}
            <div className="mb-5 pb-5 border-b border-gray-300">
              <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2 uppercase tracking-wider">
                <Code2 className="w-4 h-4 text-blue-600" />
                Type
              </h4>
              <div className="space-y-2">
                {['functional', 'non-functional', 'business', 'technical'].map(type => (
                  <label key={type} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/70 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => toggleFilter('type', type)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700 capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div className="mb-5 pb-5 border-b border-gray-300">
              <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2 uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 text-green-600" />
                Status
              </h4>
              <div className="space-y-2">
                {['draft', 'review', 'approved', 'in-dev', 'testing', 'completed'].map(status => (
                  <label key={status} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/70 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedStatuses.includes(status)}
                      onChange={() => toggleFilter('status', status)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700 capitalize">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Priority Filter */}
            <div className="mb-5">
              <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2 uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 text-red-600" />
                Priority
              </h4>
              <div className="space-y-2">
                {['critical', 'high', 'medium', 'low'].map(priority => (
                  <label key={priority} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/70 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedPriorities.includes(priority)}
                      onChange={() => toggleFilter('priority', priority)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700 capitalize">{priority}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-gray-300 flex gap-2">
              <button
                onClick={clearFilters}
                className="flex-1 px-3 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors border border-red-200"
              >
                Clear
              </button>
              <button
                onClick={() => {}}
                className="flex-1 px-3 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Apply
              </button>
            </div>
          </Card>

          {/* Main Content */}
          <div className="flex-1">
            {viewMode === 'table' && (
              <Card className="border border-gray-200 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                        <th className="text-left py-4 px-4 font-semibold text-sm text-gray-700">ID</th>
                        <th className="text-left py-4 px-4 font-semibold text-sm text-gray-700">Title</th>
                        <th className="text-left py-4 px-4 font-semibold text-sm text-gray-700">Type</th>
                        <th className="text-left py-4 px-4 font-semibold text-sm text-gray-700">Status</th>
                        <th className="text-left py-4 px-4 font-semibold text-sm text-gray-700">Priority</th>
                        <th className="text-left py-4 px-4 font-semibold text-sm text-gray-700">Owner</th>
                        <th className="text-left py-4 px-4 font-semibold text-sm text-gray-700">Tags</th>
                        <th className="text-left py-4 px-4 font-semibold text-sm text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRequirements.map((requirement) => (
                        <tr
                          key={requirement.id}
                          className="border-b border-gray-100 hover:bg-blue-50 transition-colors duration-150 cursor-pointer group"
                          onClick={() => router.push(`/requirements/${requirement.id}`)}
                        >
                          <td className="py-4 px-4 text-sm font-bold text-blue-600">
                            {requirement.id}
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                              {requirement.title}
                            </div>
                            <div className="text-xs text-gray-500 line-clamp-1">{requirement.description}</div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge variant={getTypeVariant(requirement.type)} size="sm" className="flex items-center gap-1 w-fit">
                              <span>{getTypeIcon(requirement.type)}</span>
                              {requirement.type}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <Badge variant={getStatusVariant(requirement.status)} size="sm">
                              {requirement.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <Badge variant={getPriorityVariant(requirement.priority)} size="sm">
                              {requirement.priority}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">
                            {requirement.owner ? (
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{requirement.owner.avatar}</span>
                                <span className="font-medium">{requirement.owner.name}</span>
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">Unassigned</span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex gap-1 flex-wrap">
                              {requirement.tags.map(tag => (
                                <Badge key={tag} variant="default" size="sm" className="bg-blue-100 text-blue-700">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/requirements/${requirement.id}`);
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-100 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredRequirements.length === 0 && (
                  <div className="text-center py-16">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-1">No requirements found</h3>
                    <p className="text-gray-500 text-sm">
                      {activeFilterCount > 0 ? 'Try adjusting your filters' : 'Create your first requirement to get started'}
                    </p>
                  </div>
                )}
              </Card>
            )}

            {viewMode === 'traceability' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements Traceability Matrix</h3>
                {filteredRequirements.map((requirement, index) => (
                  <Card
                    key={requirement.id}
                    className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-5 pb-4 border-b border-gray-200">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100">
                            <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                          </div>
                          <span className="font-bold text-blue-700 text-lg">{requirement.id}</span>
                          <Badge variant={getTypeVariant(requirement.type)} size="sm" className="flex items-center gap-1">
                            <span>{getTypeIcon(requirement.type)}</span>
                            {requirement.type}
                          </Badge>
                          <Badge variant={getStatusVariant(requirement.status)} size="sm">
                            {requirement.status}
                          </Badge>
                          <Badge variant={getPriorityVariant(requirement.priority)} size="sm">
                            {requirement.priority}
                          </Badge>
                        </div>
                        <h4 className="font-bold text-gray-900 text-lg mb-2">{requirement.title}</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{requirement.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200">
                        <h5 className="text-xs font-bold text-blue-700 mb-3 uppercase tracking-wider flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Stakeholder
                        </h5>
                        {requirement.stakeholder ? (
                          <div className="text-sm">
                            <div className="font-bold text-gray-900">{requirement.stakeholder.name}</div>
                            <div className="text-xs text-gray-600 mt-1">{requirement.stakeholder.title}</div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 italic">Not assigned</div>
                        )}
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4 border border-green-200">
                        <h5 className="text-xs font-bold text-green-700 mb-3 uppercase tracking-wider flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          Acceptance Criteria
                        </h5>
                        <div className="text-sm">
                          <span className="font-bold text-gray-900">{requirement.acceptanceCriteria.length}</span>
                          <span className="text-gray-600 ml-1">criteria defined</span>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-200">
                        <h5 className="text-xs font-bold text-purple-700 mb-3 uppercase tracking-wider flex items-center gap-2">
                          <Code2 className="w-4 h-4" />
                          Test Cases
                        </h5>
                        <div className="text-sm">
                          <span className="font-bold text-gray-900">{requirement.testCases?.length || 0}</span>
                          <span className="text-gray-600 ml-1">test cases</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-4 border border-amber-200">
                      <h5 className="text-xs font-bold text-amber-700 mb-3 uppercase tracking-wider">
                        Acceptance Criteria Details
                      </h5>
                      <ul className="space-y-2">
                        {requirement.acceptanceCriteria.map((criteria, i) => (
                          <li key={i} className="text-sm text-gray-700 flex items-start gap-3">
                            <span className="text-green-600 font-bold mt-0.5 flex-shrink-0">✓</span>
                            <span>{criteria}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                ))}

                {filteredRequirements.length === 0 && (
                  <Card className="text-center py-16">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-1">No requirements found</h3>
                    <p className="text-gray-500 text-sm">
                      {activeFilterCount > 0 ? 'Try adjusting your filters' : 'Create your first requirement to get started'}
                    </p>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
