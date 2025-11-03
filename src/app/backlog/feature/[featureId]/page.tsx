'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  setSelectedFeature,
  updateFeatureTitle,
  updateFeatureStatus,
  updateFeaturePriority,
  deleteFeature,
} from '@/store/slices/featuresSlice';
import { setFeatureActivities } from '@/store/slices/activitiesSlice';
import { setFeatureComments } from '@/store/slices/commentsSlice';
import { mockFeatures, mockActivities, mockComments, mockTestCases, mockFeatureVersions } from '@/data/mockData';
import { FeatureDetailHeader } from '@/components/features/detail/FeatureDetailHeader';
import { DetailTabs } from '@/components/features/detail/DetailTabs';

export default function FeatureDetailPage() {
  const params = useParams();
  const featureId = params.featureId as string;
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const selectedFeature = useAppSelector((state) => state.features.selectedFeature);
  const activities = useAppSelector((state) => state.activities.activities[featureId] || []);
  const comments = useAppSelector((state) => state.comments.comments[featureId] || []);

  // Initialize data from mock data
  useEffect(() => {
    setIsLoading(true);
    const feature = mockFeatures.find(f => f.id === featureId);
    if (feature) {
      dispatch(setSelectedFeature(feature));

      // Load related data
      if (mockActivities[featureId]) {
        dispatch(setFeatureActivities({ featureId, activities: mockActivities[featureId] }));
      }
      if (mockComments[featureId]) {
        dispatch(setFeatureComments({ featureId, comments: mockComments[featureId] }));
      }
    }
    setIsLoading(false);
  }, [featureId, dispatch]);

  const testCases = useMemo(() => mockTestCases[featureId] || [], [featureId]);
  const versions = useMemo(() => mockFeatureVersions[featureId] || [], [featureId]);

  if (isLoading || !selectedFeature) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-gray-600">{isLoading ? 'Loading feature...' : 'Feature not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  const handleTitleChange = (title: string) => {
    dispatch(updateFeatureTitle({ featureId: selectedFeature.id, title }));
  };

  const handleStatusChange = (status: typeof selectedFeature.status) => {
    dispatch(updateFeatureStatus({ featureId: selectedFeature.id, status }));
  };

  const handlePriorityChange = (priority: typeof selectedFeature.priority) => {
    dispatch(updateFeaturePriority({ featureId: selectedFeature.id, priority }));
  };

  const handleEdit = () => {
    console.log('Edit feature:', selectedFeature.id);
    // Would open edit modal
  };

  const handleDuplicate = () => {
    console.log('Duplicate feature:', selectedFeature.id);
    // Would create a duplicate
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this feature?')) {
      dispatch(deleteFeature(selectedFeature.id));
      // Would redirect back to backlog
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <FeatureDetailHeader
          feature={selectedFeature}
          onTitleChange={handleTitleChange}
          onStatusChange={handleStatusChange}
          onPriorityChange={handlePriorityChange}
          onEdit={handleEdit}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
        />

        {/* Tabs */}
        <DetailTabs
          feature={selectedFeature}
          comments={comments}
          activities={activities}
          testCases={testCases}
          versions={versions}
          onUpdateFeature={(feature) => {
            dispatch(setSelectedFeature(feature));
          }}
        />
      </div>
    </div>
  );
}
