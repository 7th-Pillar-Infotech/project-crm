'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockRequirements } from '@/lib/mockData';
import { Requirement } from '@/types';
import { ArrowLeft, Edit2, Plus, Clock, CheckCircle2, AlertCircle, Code2, Trash2, Share2 } from 'lucide-react';

export default function RequirementDetailPage() {
  const router = useRouter();
  const params = useParams();
  const requirementId = params.id as string;

  const requirement = mockRequirements.find(r => r.id === requirementId);

  if (!requirement) {
    return (
      <AppLayout>
        <div className="p-6">
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <Card className="text-center py-16">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Requirement Not Found</h2>
            <p className="text-gray-600">The requirement you're looking for doesn't exist.</p>
          </Card>
        </div>
      </AppLayout>
    );
  }

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

  return (
    <AppLayout>
      <div className="p-6">
        {/* Header with Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Requirements
        </button>

        {/* Top Card - Title and Status */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl font-bold text-blue-600">{requirement.id}</span>
                <Badge variant={getStatusVariant(requirement.status)} className="py-1.5 px-3 text-sm font-bold">
                  {requirement.status}
                </Badge>
                <Badge variant={getTypeVariant(requirement.type)} className="flex items-center gap-2 py-1.5 px-3 text-sm font-bold">
                  <span>{getTypeIcon(requirement.type)}</span>
                  {requirement.type}
                </Badge>
                <Badge variant={getPriorityVariant(requirement.priority)} className="py-1.5 px-3 text-sm font-bold">
                  {requirement.priority}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{requirement.title}</h1>
              <p className="text-gray-600 text-lg">{requirement.description}</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                <h3 className="text-xs font-bold text-purple-700 mb-3 uppercase tracking-wider">Owner</h3>
                {requirement.owner ? (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
                      {requirement.owner.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{requirement.owner.name}</div>
                      <div className="text-sm text-gray-600">Assigned</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 italic">Not assigned</div>
                )}
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                <h3 className="text-xs font-bold text-green-700 mb-3 uppercase tracking-wider">Stakeholder</h3>
                {requirement.stakeholder ? (
                  <div>
                    <div className="font-bold text-gray-900 mb-1">{requirement.stakeholder.name}</div>
                    <div className="text-sm text-gray-600">{requirement.stakeholder.title}</div>
                  </div>
                ) : (
                  <div className="text-gray-500 italic">Not assigned</div>
                )}
              </Card>
            </div>

            {/* Acceptance Criteria */}
            <Card className="border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Acceptance Criteria ({requirement.acceptanceCriteria.length})
              </h3>
              <div className="space-y-3">
                {requirement.acceptanceCriteria.map((criteria, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-md transition-shadow"
                  >
                    <span className="text-green-600 font-bold text-lg flex-shrink-0">✓</span>
                    <span className="text-gray-700 font-medium">{criteria}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Test Cases */}
            {requirement.testCases && requirement.testCases.length > 0 && (
              <Card className="border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-blue-600" />
                  Test Cases ({requirement.testCases.length})
                </h3>
                <div className="space-y-3">
                  {requirement.testCases.map((testCase, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
                    >
                      <div className="font-bold text-gray-900 mb-1">{testCase}</div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Tags */}
            {requirement.tags.length > 0 && (
              <Card className="border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Tags</h3>
                <div className="flex gap-2 flex-wrap">
                  {requirement.tags.map(tag => (
                    <Badge key={tag} variant="default" className="bg-blue-100 text-blue-700 font-medium px-3 py-1.5">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Metadata Card */}
            <Card className="border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-600" />
                Details
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Type</div>
                  <Badge variant={getTypeVariant(requirement.type)} className="w-full justify-start">
                    <span className="mr-2">{getTypeIcon(requirement.type)}</span>
                    {requirement.type}
                  </Badge>
                </div>

                <div>
                  <div className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Priority</div>
                  <Badge variant={getPriorityVariant(requirement.priority)} className="w-full justify-start">
                    {requirement.priority}
                  </Badge>
                </div>

                <div>
                  <div className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Status</div>
                  <Badge variant={getStatusVariant(requirement.status)} className="w-full justify-start">
                    {requirement.status}
                  </Badge>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Created</div>
                  <div className="text-sm font-medium text-gray-900">{requirement.createdAt}</div>
                </div>

                <div>
                  <div className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Updated</div>
                  <div className="text-sm font-medium text-gray-900">{requirement.updatedAt}</div>
                </div>
              </div>
            </Card>

            {/* Actions Card */}
            <Card className="border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
                  <Edit2 className="w-4 h-4" />
                  Edit Requirement
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-green-100 text-green-700 font-medium hover:bg-green-200 transition-colors border border-green-300">
                  <Plus className="w-4 h-4" />
                  Add Test Case
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors">
                  <Clock className="w-4 h-4" />
                  View History
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-red-100 text-red-700 font-medium hover:bg-red-200 transition-colors border border-red-300 mt-2">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
