'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { mockRequirements } from '@/lib/mockData';
import { Requirement } from '@/types';

type ViewMode = 'table' | 'traceability';

export default function RequirementsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null);

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

  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Requirements</h1>
            <p className="text-gray-600 mt-1">Manage product requirements and specifications</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'table' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              Table
            </Button>
            <Button
              variant={viewMode === 'traceability' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('traceability')}
            >
              Traceability
            </Button>
            <Button variant="primary">
              + New Requirement
            </Button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filter Panel */}
          <Card className="w-64 h-fit">
            <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Type</h4>
              <div className="space-y-2">
                {['functional', 'non-functional', 'business', 'technical'].map(type => (
                  <label key={type} className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
              <div className="space-y-2">
                {['draft', 'review', 'approved', 'in-dev', 'testing', 'completed'].map(status => (
                  <label key={status} className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm capitalize">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Priority</h4>
              <div className="space-y-2">
                {['critical', 'high', 'medium', 'low'].map(priority => (
                  <label key={priority} className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm capitalize">{priority}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <Button variant="ghost" size="sm" fullWidth>
                Clear Filters
              </Button>
            </div>
          </Card>

          {/* Main Content */}
          <div className="flex-1">
            {viewMode === 'table' && (
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Title</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Type</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Priority</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Owner</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Tags</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockRequirements.map((requirement) => (
                        <tr
                          key={requirement.id}
                          className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelectedRequirement(requirement)}
                        >
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">
                            {requirement.id}
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm font-medium text-gray-900">{requirement.title}</div>
                            <div className="text-xs text-gray-500">{requirement.description}</div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={getTypeVariant(requirement.type)} size="sm">
                              {requirement.type}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={getStatusVariant(requirement.status)} size="sm">
                              {requirement.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={getPriorityVariant(requirement.priority)} size="sm">
                              {requirement.priority}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {requirement.owner ? (
                              <span>{requirement.owner.avatar} {requirement.owner.name}</span>
                            ) : (
                              <span className="text-gray-400">Unassigned</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-1 flex-wrap">
                              {requirement.tags.map(tag => (
                                <Badge key={tag} variant="default" size="sm">{tag}</Badge>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {mockRequirements.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No requirements found
                  </div>
                )}
              </Card>
            )}

            {viewMode === 'traceability' && (
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Requirements Traceability</h3>
                <div className="space-y-6">
                  {mockRequirements.map((requirement) => (
                    <div key={requirement.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold text-gray-900">{requirement.id}</span>
                            <Badge variant={getTypeVariant(requirement.type)} size="sm">
                              {requirement.type}
                            </Badge>
                            <Badge variant={getStatusVariant(requirement.status)} size="sm">
                              {requirement.status}
                            </Badge>
                            <Badge variant={getPriorityVariant(requirement.priority)} size="sm">
                              {requirement.priority}
                            </Badge>
                          </div>
                          <h4 className="font-medium text-gray-900 mb-1">{requirement.title}</h4>
                          <p className="text-sm text-gray-600">{requirement.description}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <h5 className="text-xs font-semibold text-gray-500 mb-2 uppercase">
                            Stakeholder
                          </h5>
                          {requirement.stakeholder ? (
                            <div className="text-sm">
                              <div className="font-medium text-gray-900">
                                {requirement.stakeholder.name}
                              </div>
                              <div className="text-xs text-gray-600">{requirement.stakeholder.title}</div>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-400">Not assigned</div>
                          )}
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                          <h5 className="text-xs font-semibold text-gray-500 mb-2 uppercase">
                            Acceptance Criteria
                          </h5>
                          <div className="text-xs text-gray-700">
                            {requirement.acceptanceCriteria.length} criteria defined
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                          <h5 className="text-xs font-semibold text-gray-500 mb-2 uppercase">
                            Test Cases
                          </h5>
                          <div className="text-xs text-gray-700">
                            {requirement.testCases?.length || 0} test cases
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h5 className="text-xs font-semibold text-gray-500 mb-2 uppercase">
                          Acceptance Criteria
                        </h5>
                        <ul className="space-y-1">
                          {requirement.acceptanceCriteria.map((criteria, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-green-500 mt-0.5">✓</span>
                              <span>{criteria}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Requirement Details Modal/Drawer */}
        {selectedRequirement && viewMode === 'table' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
            <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">{selectedRequirement.id}</h2>
                    <Badge variant={getStatusVariant(selectedRequirement.status)}>
                      {selectedRequirement.status}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{selectedRequirement.title}</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedRequirement(null)}>
                  Close
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
                  <p className="text-gray-600">{selectedRequirement.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Type</div>
                    <Badge variant={getTypeVariant(selectedRequirement.type)}>
                      {selectedRequirement.type}
                    </Badge>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Priority</div>
                    <Badge variant={getPriorityVariant(selectedRequirement.priority)}>
                      {selectedRequirement.priority}
                    </Badge>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Owner</div>
                    <div className="font-medium text-gray-900">
                      {selectedRequirement.owner?.name || 'Unassigned'}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Stakeholder</div>
                    <div className="font-medium text-gray-900">
                      {selectedRequirement.stakeholder?.name || 'None'}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Acceptance Criteria</h4>
                  <ul className="space-y-2">
                    {selectedRequirement.acceptanceCriteria.map((criteria, index) => (
                      <li key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span className="text-gray-700">{criteria}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Tags</h4>
                  <div className="flex gap-2 flex-wrap">
                    {selectedRequirement.tags.map(tag => (
                      <Badge key={tag} variant="default">{tag}</Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Created:</span> {selectedRequirement.createdAt}
                  </div>
                  <div>
                    <span className="font-medium">Updated:</span> {selectedRequirement.updatedAt}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm">
                      Edit
                    </Button>
                    <Button variant="secondary" size="sm">
                      Add Test Case
                    </Button>
                    <Button variant="ghost" size="sm">
                      View History
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
