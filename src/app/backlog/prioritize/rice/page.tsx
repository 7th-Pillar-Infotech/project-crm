'use client';

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setAllRICEScores, updateRICEScore } from '@/store/slices/prioritizationSlice';
import { mockFeatures, mockRICEScores } from '@/data/mockData';
import { Button } from '@/components/ui/Button';

interface RICEFeature {
  featureId: string;
  title: string;
  currentScore: number;
}

export default function RICEPrioritizationPage() {
  const dispatch = useAppDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [features, setFeatures] = useState<RICEFeature[]>([]);
  const [sortedFeatures, setSortedFeatures] = useState<RICEFeature[]>([]);

  const riceScores = useAppSelector((state) => state.prioritization.riceScores);

  // Initialize RICE scores from mock data
  useEffect(() => {
    dispatch(setAllRICEScores(mockRICEScores));

    // Create features list with scores
    const featuresList = mockFeatures.map((feature) => ({
      featureId: feature.id,
      title: feature.title,
      currentScore: mockRICEScores[feature.id]?.score || 0,
    }));

    setFeatures(featuresList);
    updateSortedList(featuresList);
  }, [dispatch]);

  const updateSortedList = (featuresList: RICEFeature[]) => {
    const sorted = [...featuresList].sort((a, b) => b.currentScore - a.currentScore);
    setSortedFeatures(sorted);
  };

  const handleScoreChange = (
    field: 'reach' | 'impact' | 'confidence' | 'effort',
    value: number
  ) => {
    if (currentIndex >= features.length) return;

    const featureId = features[currentIndex].featureId;
    dispatch(updateRICEScore({ featureId, field, value }));

    // Update current feature score
    const updatedFeatures = [...features];
    const currentScore = riceScores[featureId]?.score || 0;
    updatedFeatures[currentIndex].currentScore = currentScore;
    setFeatures(updatedFeatures);
    updateSortedList(updatedFeatures);
  };

  const handleNext = () => {
    if (currentIndex < features.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (features.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const currentFeature = features[currentIndex];
  const currentScore = riceScores[currentFeature.featureId];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">RICE Prioritization</h1>
        <p className="text-gray-600 mb-8">Reach, Impact, Confidence, Effort scoring model</p>

        <div className="grid grid-cols-3 gap-8">
          {/* Left: Feature List */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Features to Score</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {features.map((feature, index) => (
                  <button
                    key={feature.featureId}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition ${
                      currentIndex === index
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900 truncate">{feature.title}</div>
                    <div className="text-sm text-gray-600">Score: {feature.currentScore.toFixed(2)}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center: Scoring Interface */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{currentFeature.title}</h2>

              {currentScore && (
                <div className="mb-8 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <div className="text-sm font-medium text-gray-700 mb-2">RICE Score</div>
                  <div className="text-3xl font-bold text-green-600">{currentScore.score?.toFixed(0)}</div>
                  <div className="text-xs text-gray-600 mt-2">
                    = (R × I × C) / E = ({currentScore.reach} × {currentScore.impact} × {currentScore.confidence}%) / {currentScore.effort}
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {/* Reach */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Reach (Users per Quarter)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={currentScore?.reach || 1000}
                    onChange={(e) => handleScoreChange('reach', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <div className="text-xs text-gray-500 mt-2">
                    How many users will this feature reach?
                  </div>
                </div>

                {/* Impact */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Impact (0.25 to 3)
                  </label>
                  <select
                    value={currentScore?.impact || 1}
                    onChange={(e) => handleScoreChange('impact', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value={0.25}>Minimal (0.25)</option>
                    <option value={0.5}>Minor (0.5)</option>
                    <option value={1}>Medium (1)</option>
                    <option value={2}>Major (2)</option>
                    <option value={3}>Massive (3)</option>
                  </select>
                  <div className="text-xs text-gray-500 mt-2">
                    Impact on user experience/satisfaction
                  </div>
                </div>

                {/* Confidence */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Confidence (0-100%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={currentScore?.confidence || 50}
                    onChange={(e) => handleScoreChange('confidence', Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Not Confident</span>
                    <span className="font-medium text-gray-900">{currentScore?.confidence}%</span>
                    <span>Very Confident</span>
                  </div>
                </div>

                {/* Effort */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Effort (Person-Months)
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.5"
                    value={currentScore?.effort || 1}
                    onChange={(e) => handleScoreChange('effort', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <div className="text-xs text-gray-500 mt-2">
                    Estimated effort required
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                <Button
                  variant="secondary"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="flex-1"
                >
                  Previous
                </Button>
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={currentIndex === features.length - 1}
                  className="flex-1"
                >
                  Next
                </Button>
              </div>

              <div className="text-center text-sm text-gray-600 mt-4">
                {currentIndex + 1} of {features.length}
              </div>
            </div>
          </div>

          {/* Right: Priority Queue */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Priority Queue</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {sortedFeatures.map((feature, index) => (
                  <div
                    key={feature.featureId}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-green-500 text-white rounded-full text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm truncate">{feature.title}</div>
                      <div className="text-xs text-gray-600">Score: {feature.currentScore.toFixed(0)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="primary" className="w-full mt-8">
                Apply to Backlog
              </Button>

              <Button variant="secondary" className="w-full mt-3">
                Export Priorities
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
