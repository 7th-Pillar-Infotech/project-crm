'use client';

import React, { useState } from 'react';
import { FeatureVersion } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface HistoryTabProps {
  versions: FeatureVersion[];
}

export const HistoryTab: React.FC<HistoryTabProps> = ({ versions }) => {
  const [compareMode, setCompareMode] = useState(false);
  const [selectedVersions, setSelectedVersions] = useState<[FeatureVersion | null, FeatureVersion | null]>([null, null]);

  const sortedVersions = [...versions].sort((a, b) => b.version - a.version);

  const toggleVersionSelect = (version: FeatureVersion) => {
    if (!selectedVersions[0]) {
      setSelectedVersions([version, null]);
    } else if (!selectedVersions[1]) {
      if (selectedVersions[0].version !== version.version) {
        setSelectedVersions([selectedVersions[0], version]);
        setCompareMode(true);
      }
    }
  };

  const handleRestore = (version: FeatureVersion) => {
    // This would be dispatched to Redux in real implementation
    console.log('Restoring version:', version.version);
  };

  return (
    <div className="space-y-6">
      {/* Comparison Mode */}
      {compareMode && selectedVersions[0] && selectedVersions[1] && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Comparing Versions</h3>
            <button
              onClick={() => {
                setCompareMode(false);
                setSelectedVersions([null, null]);
              }}
              className="text-gray-600 hover:text-gray-900 text-xl"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[selectedVersions[0], selectedVersions[1]].map((version, idx) => (
              <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="mb-4">
                  <Badge variant="info">Version {version!.version}</Badge>
                  <p className="text-xs text-gray-600 mt-2">
                    by {version!.changedBy.name} on {new Date(version!.changedDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="space-y-2">
                  {version!.changes.map((change, changeIdx) => (
                    <div key={changeIdx} className="text-sm">
                      <p className="font-medium text-gray-900">{change.field}</p>
                      <p className="text-gray-600 line-through text-xs">
                        Old: {JSON.stringify(change.oldValue)}
                      </p>
                      <p className="text-gray-700 font-medium text-xs">
                        New: {JSON.stringify(change.newValue)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-blue-200">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setCompareMode(false);
                setSelectedVersions([null, null]);
              }}
            >
              Clear Comparison
            </Button>
          </div>
        </div>
      )}

      {/* Version Timeline */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Version History</h3>

        {sortedVersions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-4xl mb-4">⏱️</div>
            <p className="text-gray-600">No version history available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedVersions.map((version, idx) => (
              <div
                key={version.id}
                className={`border rounded-lg p-4 transition-colors ${
                  selectedVersions.includes(version)
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    {/* Timeline dot */}
                    <div className="mt-1 flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white relative z-10"></div>
                      {idx < sortedVersions.length - 1 && (
                        <div className="w-0.5 h-12 bg-gray-300 my-1"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">
                        Version {version.version}
                        {idx === 0 && (
                          <Badge variant="info" className="ml-2 text-xs">
                            Current
                          </Badge>
                        )}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        by <span className="font-medium">{version.changedBy.name}</span> on{' '}
                        {new Date(version.changedDate).toLocaleDateString()} at{' '}
                        {new Date(version.changedDate).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>

                      {/* Changes Summary */}
                      <div className="mt-3 space-y-2 bg-gray-50 rounded p-3">
                        {version.changes.map((change, changeIdx) => (
                          <div key={changeIdx} className="text-xs">
                            <p className="font-medium text-gray-900">{change.field}</p>
                            <div className="flex items-center gap-2 text-gray-600 mt-1">
                              <span className="line-through text-red-600">
                                {JSON.stringify(change.oldValue)}
                              </span>
                              <span>→</span>
                              <span className="font-medium text-green-600">
                                {JSON.stringify(change.newValue)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex flex-col gap-2">
                    <button
                      onClick={() => toggleVersionSelect(version)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        selectedVersions.includes(version)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                      }`}
                    >
                      {selectedVersions.includes(version) ? '✓ Selected' : 'Select'}
                    </button>
                    {idx !== 0 && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleRestore(version)}
                        className="text-xs"
                      >
                        Restore
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
