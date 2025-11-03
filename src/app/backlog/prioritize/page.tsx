'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { mockFeatures } from '@/lib/mockData';
import { Feature, WSJFScore, RICEScore, MoSCoWCategory } from '@/types';

type PrioritizationMethod = 'wsjf' | 'rice' | 'moscow' | 'matrix';

export default function PrioritizePage() {
  const router = useRouter();
  const [method, setMethod] = useState<PrioritizationMethod>('wsjf');
  const [features] = useState<Feature[]>(mockFeatures);
  const [scores, setScores] = useState<{ [key: string]: WSJFScore | RICEScore | MoSCoWCategory }>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  // Calculate WSJF Score
  const calculateWSJF = (score: WSJFScore) => {
    const costOfDelay = (score.userBusinessValue + score.timeCriticality + score.riskReduction) / score.jobSize;
    return Math.round(costOfDelay * 100) / 100;
  };

  // Calculate RICE Score
  const calculateRICE = (score: RICEScore) => {
    return (score.reach * score.impact * score.confidence) / score.effort;
  };

  // Sort features by score
  const sortedFeatures = useMemo(() => {
    const sorted = [...features].sort((a, b) => {
      const scoreA = scores[a.id];
      const scoreB = scores[b.id];

      if (!scoreA || !scoreB) return 0;

      if (method === 'wsjf') {
        const calcA = calculateWSJF(scoreA as WSJFScore);
        const calcB = calculateWSJF(scoreB as WSJFScore);
        return calcB - calcA;
      } else if (method === 'rice') {
        const calcA = calculateRICE(scoreA as RICEScore);
        const calcB = calculateRICE(scoreB as RICEScore);
        return calcB - calcA;
      }
      return 0;
    });
    return sorted;
  }, [features, scores, method]);

  const getPriorityVariant = (priority: Feature['priority']) => {
    const variants = {
      'critical': 'error',
      'high': 'warning',
      'medium': 'info',
      'low': 'default',
    };
    return variants[priority] as any;
  };

  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Prioritization</h1>
          <p className="text-gray-600 mt-1">Score and prioritize your features</p>
        </div>

        {/* Method Selector */}
        <Card className="mb-6">
          <div className="flex gap-3">
            <Button
              variant={method === 'wsjf' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setMethod('wsjf')}
            >
              WSJF
            </Button>
            <Button
              variant={method === 'rice' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setMethod('rice')}
            >
              RICE
            </Button>
            <Button
              variant={method === 'moscow' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setMethod('moscow')}
            >
              MoSCoW
            </Button>
            <Button
              variant={method === 'matrix' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setMethod('matrix')}
            >
              Impact Matrix
            </Button>
          </div>
        </Card>

        {/* WSJF Prioritization */}
        {method === 'wsjf' && (
          <div className="grid grid-cols-3 gap-6">
            {/* Feature Card */}
            <Card className="col-span-2">
              {features.length > 0 && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {currentIndex + 1} / {features.length}
                    </h2>
                    <h3 className="text-2xl font-bold text-gray-900">{features[currentIndex].title}</h3>
                    <p className="text-gray-600 mt-2">{features[currentIndex].description}</p>
                  </div>

                  {/* WSJF Scoring */}
                  <div className="space-y-6">
                    {/* User/Business Value */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        User/Business Value: {((scores[features[currentIndex].id] as WSJFScore)?.userBusinessValue || 5)}
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={(scores[features[currentIndex].id] as WSJFScore)?.userBusinessValue || 5}
                        onChange={(e) => {
                          const id = features[currentIndex].id;
                          setScores({
                            ...scores,
                            [id]: {
                              ...(scores[id] as WSJFScore || { timeCriticality: 5, riskReduction: 5, jobSize: 5 }),
                              userBusinessValue: parseInt(e.target.value),
                            }
                          });
                        }}
                        className="w-full"
                      />
                    </div>

                    {/* Time Criticality */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Time Criticality: {((scores[features[currentIndex].id] as WSJFScore)?.timeCriticality || 5)}
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={(scores[features[currentIndex].id] as WSJFScore)?.timeCriticality || 5}
                        onChange={(e) => {
                          const id = features[currentIndex].id;
                          setScores({
                            ...scores,
                            [id]: {
                              ...(scores[id] as WSJFScore || { userBusinessValue: 5, riskReduction: 5, jobSize: 5 }),
                              timeCriticality: parseInt(e.target.value),
                            }
                          });
                        }}
                        className="w-full"
                      />
                    </div>

                    {/* Risk Reduction */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Risk Reduction/Opportunity: {((scores[features[currentIndex].id] as WSJFScore)?.riskReduction || 5)}
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={(scores[features[currentIndex].id] as WSJFScore)?.riskReduction || 5}
                        onChange={(e) => {
                          const id = features[currentIndex].id;
                          setScores({
                            ...scores,
                            [id]: {
                              ...(scores[id] as WSJFScore || { userBusinessValue: 5, timeCriticality: 5, jobSize: 5 }),
                              riskReduction: parseInt(e.target.value),
                            }
                          });
                        }}
                        className="w-full"
                      />
                    </div>

                    {/* Job Size */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Job Size: {((scores[features[currentIndex].id] as WSJFScore)?.jobSize || 5)}
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={(scores[features[currentIndex].id] as WSJFScore)?.jobSize || 5}
                        onChange={(e) => {
                          const id = features[currentIndex].id;
                          setScores({
                            ...scores,
                            [id]: {
                              ...(scores[id] as WSJFScore || { userBusinessValue: 5, timeCriticality: 5, riskReduction: 5 }),
                              jobSize: parseInt(e.target.value),
                            }
                          });
                        }}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Score Display */}
                  {scores[features[currentIndex].id] && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">WSJF Score</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {calculateWSJF(scores[features[currentIndex].id] as WSJFScore).toFixed(2)}
                      </p>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="mt-6 flex gap-3">
                    <Button
                      variant="secondary"
                      onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                      disabled={currentIndex === 0}
                      className="flex-1"
                    >
                      ← Previous
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => setCurrentIndex(Math.min(features.length - 1, currentIndex + 1))}
                      disabled={currentIndex === features.length - 1}
                      className="flex-1"
                    >
                      Next →
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            {/* Priority Queue */}
            <Card className="h-fit sticky top-6">
              <h3 className="font-semibold text-gray-900 mb-4">Priority Queue</h3>
              <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                {sortedFeatures.map((feature, idx) => (
                  <div
                    key={feature.id}
                    className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setCurrentIndex(features.indexOf(feature))}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-gray-900">#{idx + 1}</span>
                      <Badge variant={getPriorityVariant(feature.priority)} size="sm">
                        {feature.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">{feature.title}</p>
                    {scores[feature.id] && (
                      <p className="text-sm font-bold text-blue-600">
                        {calculateWSJF(scores[feature.id] as WSJFScore).toFixed(2)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* RICE Prioritization */}
        {method === 'rice' && (
          <div className="grid grid-cols-3 gap-6">
            <Card className="col-span-2">
              {features.length > 0 && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {currentIndex + 1} / {features.length}
                    </h2>
                    <h3 className="text-2xl font-bold text-gray-900">{features[currentIndex].title}</h3>
                    <p className="text-gray-600 mt-2">{features[currentIndex].description}</p>
                  </div>

                  <div className="space-y-6">
                    {/* Reach */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reach (users per quarter)
                      </label>
                      <input
                        type="number"
                        value={(scores[features[currentIndex].id] as RICEScore)?.reach || 1000}
                        onChange={(e) => {
                          const id = features[currentIndex].id;
                          setScores({
                            ...scores,
                            [id]: {
                              ...(scores[id] as RICEScore || { impact: 1, confidence: 50, effort: 1 }),
                              reach: parseInt(e.target.value),
                            }
                          });
                        }}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        placeholder="e.g., 1000"
                      />
                    </div>

                    {/* Impact */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Impact</label>
                      <select
                        value={(scores[features[currentIndex].id] as RICEScore)?.impact || 1}
                        onChange={(e) => {
                          const id = features[currentIndex].id;
                          setScores({
                            ...scores,
                            [id]: {
                              ...(scores[id] as RICEScore || { reach: 1000, confidence: 50, effort: 1 }),
                              impact: parseFloat(e.target.value),
                            }
                          });
                        }}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
                      >
                        <option value={0.25}>Minimal - 0.25</option>
                        <option value={0.5}>Low - 0.5</option>
                        <option value={1}>Medium - 1</option>
                        <option value={2}>High - 2</option>
                        <option value={3}>Massive - 3</option>
                      </select>
                    </div>

                    {/* Confidence */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Confidence: {((scores[features[currentIndex].id] as RICEScore)?.confidence || 50)}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={(scores[features[currentIndex].id] as RICEScore)?.confidence || 50}
                        onChange={(e) => {
                          const id = features[currentIndex].id;
                          setScores({
                            ...scores,
                            [id]: {
                              ...(scores[id] as RICEScore || { reach: 1000, impact: 1, effort: 1 }),
                              confidence: parseInt(e.target.value),
                            }
                          });
                        }}
                        className="w-full"
                      />
                    </div>

                    {/* Effort */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Effort (person-months)
                      </label>
                      <input
                        type="number"
                        value={(scores[features[currentIndex].id] as RICEScore)?.effort || 1}
                        onChange={(e) => {
                          const id = features[currentIndex].id;
                          setScores({
                            ...scores,
                            [id]: {
                              ...(scores[id] as RICEScore || { reach: 1000, impact: 1, confidence: 50 }),
                              effort: parseFloat(e.target.value),
                            }
                          });
                        }}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        placeholder="e.g., 2"
                      />
                    </div>
                  </div>

                  {/* Score Display */}
                  {scores[features[currentIndex].id] && (
                    <div className="mt-6 p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">RICE Score</p>
                      <p className="text-3xl font-bold text-green-600">
                        {calculateRICE(scores[features[currentIndex].id] as RICEScore).toFixed(2)}
                      </p>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="mt-6 flex gap-3">
                    <Button
                      variant="secondary"
                      onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                      disabled={currentIndex === 0}
                      className="flex-1"
                    >
                      ← Previous
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => setCurrentIndex(Math.min(features.length - 1, currentIndex + 1))}
                      disabled={currentIndex === features.length - 1}
                      className="flex-1"
                    >
                      Next →
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            <Card className="h-fit sticky top-6">
              <h3 className="font-semibold text-gray-900 mb-4">Priority Queue</h3>
              <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                {sortedFeatures.map((feature, idx) => (
                  <div
                    key={feature.id}
                    className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setCurrentIndex(features.indexOf(feature))}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-gray-900">#{idx + 1}</span>
                      <Badge variant={getPriorityVariant(feature.priority)} size="sm">
                        {feature.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">{feature.title}</p>
                    {scores[feature.id] && (
                      <p className="text-sm font-bold text-green-600">
                        {calculateRICE(scores[feature.id] as RICEScore).toFixed(2)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* MoSCoW Categorization */}
        {method === 'moscow' && (
          <div className="grid grid-cols-4 gap-6">
            {['must', 'should', 'could', 'wont'].map((category) => (
              <Card key={category}>
                <h3 className="font-semibold text-gray-900 mb-4 capitalize">{category}</h3>
                <div className="space-y-3 min-h-[400px]">
                  {features
                    .filter(f => (scores[f.id] as MoSCoWCategory)?.category === category)
                    .map((feature) => (
                      <Card
                        key={feature.id}
                        variant="outlined"
                        padding="sm"
                        className="cursor-move hover:shadow-md"
                      >
                        <p className="text-sm font-medium text-gray-900 mb-1">{feature.title}</p>
                        <Badge variant={getPriorityVariant(feature.priority)} size="sm">
                          {feature.priority}
                        </Badge>
                      </Card>
                    ))}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Impact Matrix */}
        {method === 'matrix' && (
          <Card>
            <div className="grid grid-cols-3 gap-4 h-[500px]">
              {/* Y-Axis Labels */}
              <div className="flex flex-col justify-between pr-4 border-r">
                <div className="text-center text-sm font-semibold text-gray-700">High Impact</div>
                <div className="text-center text-sm font-semibold text-gray-700">Medium Impact</div>
                <div className="text-center text-sm font-semibold text-gray-700">Low Impact</div>
              </div>

              {/* Matrix Grid */}
              <div className="col-span-2 grid grid-cols-2 gap-4 border-b border-r">
                {/* High Impact, Low Effort (Top Left - Quick Wins) */}
                <div className="border rounded-lg p-4 bg-green-50">
                  <h4 className="font-semibold text-green-900 mb-3">Quick Wins</h4>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {features
                      .filter(f => f.storyPoints && f.storyPoints <= 5 && f.priority === 'high')
                      .map((feature) => (
                        <Card key={feature.id} variant="outlined" padding="sm">
                          <p className="text-xs text-gray-900">{feature.title}</p>
                          <Badge variant="success" size="sm" className="mt-1">
                            {feature.storyPoints} pts
                          </Badge>
                        </Card>
                      ))}
                  </div>
                </div>

                {/* High Impact, High Effort (Top Right - Major Projects) */}
                <div className="border rounded-lg p-4 bg-yellow-50">
                  <h4 className="font-semibold text-yellow-900 mb-3">Major Projects</h4>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {features
                      .filter(f => f.storyPoints && f.storyPoints > 5 && f.priority === 'high')
                      .map((feature) => (
                        <Card key={feature.id} variant="outlined" padding="sm">
                          <p className="text-xs text-gray-900">{feature.title}</p>
                          <Badge variant="warning" size="sm" className="mt-1">
                            {feature.storyPoints} pts
                          </Badge>
                        </Card>
                      ))}
                  </div>
                </div>

                {/* Low Impact, Low Effort (Bottom Left - Fill-ins) */}
                <div className="border rounded-lg p-4 bg-blue-50">
                  <h4 className="font-semibold text-blue-900 mb-3">Fill-ins</h4>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {features
                      .filter(f => f.storyPoints && f.storyPoints <= 5 && f.priority === 'low')
                      .map((feature) => (
                        <Card key={feature.id} variant="outlined" padding="sm">
                          <p className="text-xs text-gray-900">{feature.title}</p>
                          <Badge variant="info" size="sm" className="mt-1">
                            {feature.storyPoints} pts
                          </Badge>
                        </Card>
                      ))}
                  </div>
                </div>

                {/* Low Impact, High Effort (Bottom Right - Time Sinks) */}
                <div className="border rounded-lg p-4 bg-red-50">
                  <h4 className="font-semibold text-red-900 mb-3">Time Sinks</h4>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {features
                      .filter(f => f.storyPoints && f.storyPoints > 5 && f.priority === 'low')
                      .map((feature) => (
                        <Card key={feature.id} variant="outlined" padding="sm">
                          <p className="text-xs text-gray-900">{feature.title}</p>
                          <Badge variant="error" size="sm" className="mt-1">
                            {feature.storyPoints} pts
                          </Badge>
                        </Card>
                      ))}
                  </div>
                </div>
              </div>

              {/* X-Axis Labels */}
              <div />
              <div className="col-span-2 grid grid-cols-2 gap-4 pt-2">
                <div className="text-center text-sm font-semibold text-gray-700">Low Effort →</div>
                <div className="text-center text-sm font-semibold text-gray-700">← High Effort</div>
              </div>
            </div>
          </Card>
        )}

        {/* Apply Button */}
        <div className="mt-6 flex gap-3">
          <Button variant="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button variant="primary">
            Apply {method.toUpperCase()} Prioritization
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
