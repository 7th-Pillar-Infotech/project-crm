'use client';

import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '@/hooks';
import { setAllMoSCoWCategories, setMoSCoWCategory } from '@/store/slices/prioritizationSlice';
import { mockFeatures, mockMoSCoWCategories } from '@/data/mockData';
import { Button } from '@/components/ui/Button';

type CategoryType = 'must' | 'should' | 'could' | 'wont';

interface MoSCoWFeature {
  id: string;
  title: string;
  category: CategoryType;
  justification: string;
}

export default function MoSCoWPage() {
  const dispatch = useAppDispatch();
  const [features, setFeatures] = useState<MoSCoWFeature[]>([]);
  const [draggedFeature, setDraggedFeature] = useState<string | null>(null);

  // Initialize MoSCoW categories from mock data
  useEffect(() => {
    dispatch(setAllMoSCoWCategories(mockMoSCoWCategories));

    const featuresList = mockFeatures.map((feature) => {
      const category = mockMoSCoWCategories[feature.id] || {
        category: 'could' as CategoryType,
        justification: '',
      };
      return {
        id: feature.id,
        title: feature.title,
        category: category.category,
        justification: category.justification,
      };
    });

    setFeatures(featuresList);
  }, [dispatch]);

  const handleCategoryChange = (featureId: string, newCategory: CategoryType) => {
    const updated = features.map((f) =>
      f.id === featureId ? { ...f, category: newCategory } : f
    );
    setFeatures(updated);

    // Update Redux
    const oldFeature = features.find((f) => f.id === featureId);
    if (oldFeature) {
      dispatch(
        setMoSCoWCategory({
          featureId,
          category: { category: newCategory, justification: oldFeature.justification },
        })
      );
    }
  };

  const handleJustificationChange = (featureId: string, justification: string) => {
    const updated = features.map((f) =>
      f.id === featureId ? { ...f, justification } : f
    );
    setFeatures(updated);

    const feature = updated.find((f) => f.id === featureId);
    if (feature) {
      dispatch(
        setMoSCoWCategory({
          featureId,
          category: { category: feature.category, justification },
        })
      );
    }
  };

  const handleDragStart = (featureId: string) => {
    setDraggedFeature(featureId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnCategory = (category: CategoryType) => {
    if (draggedFeature) {
      handleCategoryChange(draggedFeature, category);
      setDraggedFeature(null);
    }
  };

  const getFeaturesByCategory = (category: CategoryType) => {
    return features.filter((f) => f.category === category);
  };

  const categoryConfig = {
    must: {
      title: 'Must Have',
      description: 'Critical features required for product launch',
      color: 'red',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    should: {
      title: 'Should Have',
      description: 'Important features that should be included',
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
    could: {
      title: 'Could Have',
      description: 'Nice-to-have features for future releases',
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    wont: {
      title: "Won't Have",
      description: 'Features excluded from current roadmap',
      color: 'gray',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
    },
  };

  const calculatePercentage = (category: CategoryType) => {
    const count = getFeaturesByCategory(category).length;
    const total = features.length;
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">MoSCoW Prioritization</h1>
        <p className="text-gray-600 mb-8">Categorize features into Must, Should, Could, Won&apos;t have</p>

        {/* Breakdown Chart */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {(['must', 'should', 'could', 'wont'] as CategoryType[]).map((category) => {
            const config = categoryConfig[category];
            const percentage = calculatePercentage(category);
            return (
              <div key={category} className={`${config.bgColor} rounded-lg p-4 border-2 ${config.borderColor}`}>
                <h3 className={`text-lg font-bold text-${config.color}-900 capitalize`}>
                  {config.title}
                </h3>
                <div className={`text-3xl font-bold text-${config.color}-600 mt-2`}>
                  {getFeaturesByCategory(category).length}
                </div>
                <div className="text-sm text-gray-600 mt-1">{percentage}% of features</div>
              </div>
            );
          })}
        </div>

        {/* Drag & Drop Columns */}
        <div className="grid grid-cols-4 gap-6">
          {(['must', 'should', 'could', 'wont'] as CategoryType[]).map((category) => {
            const config = categoryConfig[category];
            const categoryFeatures = getFeaturesByCategory(category);

            return (
              <div
                key={category}
                onDragOver={handleDragOver}
                onDrop={() => handleDropOnCategory(category)}
                className={`${config.bgColor} rounded-lg p-6 min-h-96 border-2 ${config.borderColor}`}
              >
                <h2 className={`text-xl font-bold text-${config.color}-900 capitalize mb-2`}>
                  {config.title}
                </h2>
                <p className="text-sm text-gray-600 mb-6">{config.description.replace(/'/g, "&apos;")}</p>

                <div className="space-y-3">
                  {categoryFeatures.map((feature) => (
                    <div
                      key={feature.id}
                      draggable
                      onDragStart={() => handleDragStart(feature.id)}
                      className="bg-white p-4 rounded-lg border border-gray-200 cursor-move hover:shadow-md transition group"
                    >
                      <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition">
                        {feature.title}
                      </h3>
                      <input
                        type="text"
                        placeholder="Add justification..."
                        value={feature.justification}
                        onChange={(e) => handleJustificationChange(feature.id, e.target.value)}
                        className="w-full text-xs text-gray-600 mt-2 p-2 border border-gray-200 rounded bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}

                  {categoryFeatures.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                      <p>Drag features here</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-8 justify-end">
          <Button variant="secondary">Reset</Button>
          <Button variant="primary">Apply Categories</Button>
          <Button variant="secondary">Export Categories</Button>
        </div>
      </div>
    </div>
  );
}
