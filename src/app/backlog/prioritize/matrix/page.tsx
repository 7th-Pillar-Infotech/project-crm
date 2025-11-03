'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch } from '@/hooks';
import { setAllPriorityMatrixScores, setPriorityMatrixScore } from '@/store/slices/prioritizationSlice';
import { mockFeatures, mockPriorityMatrixScores } from '@/data/mockData';
import { Button } from '@/components/ui/Button';

interface MatrixFeature {
  id: string;
  title: string;
  impact: number;
  effort: number;
  quadrant: 'quick-win' | 'major-project' | 'fill-in' | 'time-sink';
}

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;
const PADDING = 40;

export default function PriorityMatrixPage() {
  const dispatch = useAppDispatch();
  const [features, setFeatures] = useState<MatrixFeature[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize Priority Matrix scores
  useEffect(() => {
    dispatch(setAllPriorityMatrixScores(mockPriorityMatrixScores));

    const featuresList = mockFeatures.map((feature) => {
      const score = mockPriorityMatrixScores[feature.id] || { impact: 5, effort: 5 };
      const quadrant = getQuadrant(score.impact, score.effort);
      return {
        id: feature.id,
        title: feature.title,
        impact: score.impact,
        effort: score.effort,
        quadrant,
      };
    });

    setFeatures(featuresList);
  }, [dispatch]);

  // Draw canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw quadrant backgrounds
    const centerX = PADDING + (CANVAS_WIDTH - 2 * PADDING) / 2;
    const centerY = PADDING + (CANVAS_HEIGHT - 2 * PADDING) / 2;

    // Quick Wins (High Impact, Low Effort) - Top Left
    ctx.fillStyle = '#dcfce7';
    ctx.fillRect(PADDING, PADDING, centerX - PADDING, centerY - PADDING);

    // Major Projects (High Impact, High Effort) - Top Right
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(centerX, PADDING, CANVAS_WIDTH - centerX - PADDING, centerY - PADDING);

    // Fill-ins (Low Impact, Low Effort) - Bottom Left
    ctx.fillStyle = '#dbeafe';
    ctx.fillRect(PADDING, centerY, centerX - PADDING, CANVAS_HEIGHT - centerY - PADDING);

    // Time Sinks (Low Impact, High Effort) - Bottom Right
    ctx.fillStyle = '#fee2e2';
    ctx.fillRect(centerX, centerY, CANVAS_WIDTH - centerX - PADDING, CANVAS_HEIGHT - centerY - PADDING);

    // Draw axes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(PADDING, centerY);
    ctx.lineTo(CANVAS_WIDTH - PADDING, centerY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX, PADDING);
    ctx.lineTo(centerX, CANVAS_HEIGHT - PADDING);
    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Low Effort', PADDING + (centerX - PADDING) / 2, CANVAS_HEIGHT - 15);
    ctx.fillText('High Effort', centerX + (CANVAS_WIDTH - centerX - PADDING) / 2, CANVAS_HEIGHT - 15);

    ctx.save();
    ctx.translate(20, centerY);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('Low Impact', 0, 0);
    ctx.restore();

    ctx.save();
    ctx.translate(20, PADDING + (centerY - PADDING) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('High Impact', 0, 0);
    ctx.restore();

    // Draw feature dots
    features.forEach((feature) => {
      const x = PADDING + (CANVAS_WIDTH - 2 * PADDING) * (feature.effort / 10);
      const y = CANVAS_HEIGHT - PADDING - (CANVAS_HEIGHT - 2 * PADDING) * (feature.impact / 10);

      const isSelected = selectedFeature === feature.id;
      const radius = isSelected ? 8 : 6;
      const color = isSelected ? '#2563eb' : '#3b82f6';

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      if (isSelected) {
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    });
  }, [features, selectedFeature]);

  const getQuadrant = (impact: number, effort: number): MatrixFeature['quadrant'] => {
    const isHighImpact = impact >= 5;
    const isLowEffort = effort < 5;

    if (isHighImpact && isLowEffort) return 'quick-win';
    if (isHighImpact && !isLowEffort) return 'major-project';
    if (!isHighImpact && isLowEffort) return 'fill-in';
    return 'time-sink';
  };

  const handleScoreChange = (field: 'impact' | 'effort', value: number) => {
    if (!selectedFeature) return;

    const updated = features.map((f) =>
      f.id === selectedFeature
        ? {
            ...f,
            [field]: value,
            quadrant: getQuadrant(
              field === 'impact' ? value : f.impact,
              field === 'effort' ? value : f.effort
            ),
          }
        : f
    );

    setFeatures(updated);

    const feature = updated.find((f) => f.id === selectedFeature);
    if (feature) {
      dispatch(
        setPriorityMatrixScore({
          featureId: selectedFeature,
          impact: feature.impact,
          effort: feature.effort,
        })
      );
    }
  };

  const getQuadrantFeatures = (quadrant: MatrixFeature['quadrant']) => {
    return features.filter((f) => f.quadrant === quadrant);
  };

  const quadrantConfig = {
    'quick-win': {
      title: 'Quick Wins',
      description: 'High Impact, Low Effort - Do first!',
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    'major-project': {
      title: 'Major Projects',
      description: 'High Impact, High Effort - Plan carefully',
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
    'fill-in': {
      title: 'Fill-ins',
      description: 'Low Impact, Low Effort - Do when convenient',
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    'time-sink': {
      title: 'Time Sinks',
      description: 'Low Impact, High Effort - Avoid or reconsider',
      color: 'red',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
  };

  const selectedFeatureData = features.find((f) => f.id === selectedFeature);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Priority Matrix</h1>
        <p className="text-gray-600 mb-8">Impact vs Effort analysis</p>

        <div className="grid grid-cols-3 gap-8">
          {/* Left: Matrix Canvas and Controls */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Impact vs Effort</h2>
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="border border-gray-300 rounded-lg w-full cursor-pointer"
                onClick={(e) => {
                  const rect = canvasRef.current?.getBoundingClientRect();
                  if (!rect) return;

                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;

                  features.forEach((feature) => {
                    const featureX =
                      PADDING + (CANVAS_WIDTH - 2 * PADDING) * (feature.effort / 10);
                    const featureY =
                      CANVAS_HEIGHT -
                      PADDING -
                      (CANVAS_HEIGHT - 2 * PADDING) * (feature.impact / 10);

                    const distance = Math.sqrt((x - featureX) ** 2 + (y - featureY) ** 2);
                    if (distance < 10) {
                      setSelectedFeature(feature.id);
                    }
                  });
                }}
              />

              {selectedFeatureData && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <h3 className="font-medium text-gray-900 mb-4">{selectedFeatureData.title}</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Impact (1-10)
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={selectedFeatureData.impact}
                        onChange={(e) => handleScoreChange('impact', Number(e.target.value))}
                        className="w-full"
                      />
                      <div className="text-center text-sm font-medium text-gray-900 mt-1">
                        {selectedFeatureData.impact}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Effort (1-10)
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={selectedFeatureData.effort}
                        onChange={(e) => handleScoreChange('effort', Number(e.target.value))}
                        className="w-full"
                      />
                      <div className="text-center text-sm font-medium text-gray-900 mt-1">
                        {selectedFeatureData.effort}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Feature Lists by Quadrant */}
          <div className="col-span-2">
            <div className="grid grid-cols-2 gap-4">
              {(['quick-win', 'major-project', 'fill-in', 'time-sink'] as const).map((quadrant) => {
                const config = quadrantConfig[quadrant];
                const quadrantFeatures = getQuadrantFeatures(quadrant);

                return (
                  <div
                    key={quadrant}
                    className={`${config.bgColor} rounded-lg p-4 border-2 ${config.borderColor}`}
                  >
                    <h3 className={`font-bold text-${config.color}-900 mb-1`}>
                      {config.title}
                    </h3>
                    <p className="text-xs text-gray-600 mb-4">{config.description}</p>

                    <div className="space-y-2">
                      {quadrantFeatures.map((feature) => (
                        <button
                          key={feature.id}
                          onClick={() => setSelectedFeature(feature.id)}
                          className={`w-full text-left p-3 rounded-lg border-2 transition ${
                            selectedFeature === feature.id
                              ? 'border-blue-500 bg-white'
                              : 'border-transparent bg-white/50 hover:bg-white'
                          }`}
                        >
                          <div className="font-medium text-gray-900 text-sm truncate">
                            {feature.title}
                          </div>
                          <div className="text-xs text-gray-600">
                            Impact: {feature.impact}, Effort: {feature.effort}
                          </div>
                        </button>
                      ))}

                      {quadrantFeatures.length === 0 && (
                        <div className="text-center py-6 text-gray-400 text-sm">
                          No features
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4 mt-8 justify-end">
              <Button variant="secondary">Reset</Button>
              <Button variant="primary">Apply Matrix</Button>
              <Button variant="secondary">Export as Image</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
