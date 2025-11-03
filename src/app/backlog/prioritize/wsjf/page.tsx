'use client';

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setAllWSJFScores, updateWSJFScore } from '@/store/slices/prioritizationSlice';
import { mockFeatures, mockWSJFScores } from '@/data/mockData';
import { Button } from '@/components/ui/Button';

interface WSJFFeature {
  featureId: string;
  title: string;
  currentScore: number;
}

export default function WSJFPrioritizationPage() {
  const dispatch = useAppDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [features, setFeatures] = useState<WSJFFeature[]>([]);
  const [sortedFeatures, setSortedFeatures] = useState<WSJFFeature[]>([]);

  const wsjfScores = useAppSelector((state) => state.prioritization.wsjfScores);

  // Initialize WSJF scores from mock data
  useEffect(() => {
    dispatch(setAllWSJFScores(mockWSJFScores));

    // Create features list with scores
    const featuresList = mockFeatures.map((feature) => ({
      featureId: feature.id,
      title: feature.title,
      currentScore: mockWSJFScores[feature.id]?.score || 0,
    }));

    setFeatures(featuresList);
    updateSortedList(featuresList);
  }, [dispatch]);

  const updateSortedList = (featuresList: WSJFFeature[]) => {
    const sorted = [...featuresList].sort((a, b) => b.currentScore - a.currentScore);
    setSortedFeatures(sorted);
  };

  const handleScoreChange = (
    field: 'userBusinessValue' | 'timeCriticality' | 'riskReduction' | 'jobSize',
    value: number
  ) => {
    if (currentIndex >= features.length) return;

    const featureId = features[currentIndex].featureId;
    dispatch(updateWSJFScore({ featureId, field, value }));

    // Update current feature score
    const updatedFeatures = [...features];
    const currentScore = wsjfScores[featureId]?.score || 0;
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
  const currentScore = wsjfScores[currentFeature.featureId];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">WSJF Prioritization</h1>

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
                        ? 'border-blue-500 bg-blue-50'
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
                <div className="mb-8 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <div className="text-sm font-medium text-gray-700 mb-2">WSJF Score</div>
                  <div className="text-3xl font-bold text-blue-600">{currentScore.score?.toFixed(2)}</div>
                  <div className="text-xs text-gray-600 mt-2">
                    = (V + T + R) / JS = ({currentScore.userBusinessValue} + {currentScore.timeCriticality} + {currentScore.riskReduction}) / {currentScore.jobSize}
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {/* User/Business Value */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    User/Business Value (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={currentScore?.userBusinessValue || 5}
                    onChange={(e) => handleScoreChange('userBusinessValue', Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Low</span>
                    <span className="font-medium text-gray-900">{currentScore?.userBusinessValue}</span>
                    <span>High</span>
                  </div>
                </div>

                {/* Time Criticality */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Time Criticality (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={currentScore?.timeCriticality || 5}
                    onChange={(e) => handleScoreChange('timeCriticality', Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Not Critical</span>
                    <span className="font-medium text-gray-900">{currentScore?.timeCriticality}</span>
                    <span>Very Critical</span>
                  </div>
                </div>

                {/* Risk Reduction */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Risk Reduction (1-10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={currentScore?.riskReduction || 5}
                    onChange={(e) => handleScoreChange('riskReduction', Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Low Risk</span>
                    <span className="font-medium text-gray-900">{currentScore?.riskReduction}</span>
                    <span>High Risk</span>
                  </div>
                </div>

                {/* Job Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Job Size (1-10) - Effort Required
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={currentScore?.jobSize || 5}
                    onChange={(e) => handleScoreChange('jobSize', Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Small</span>
                    <span className="font-medium text-gray-900">{currentScore?.jobSize}</span>
                    <span>Large</span>
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
                    <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-500 text-white rounded-full text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm truncate">{feature.title}</div>
                      <div className="text-xs text-gray-600">Score: {feature.currentScore.toFixed(2)}</div>
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
