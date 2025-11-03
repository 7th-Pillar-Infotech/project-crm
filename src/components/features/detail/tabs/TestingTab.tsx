'use client';

import React from 'react';
import { TestCase } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface TestingTabProps {
  testCases: TestCase[];
}

const getStatusColor = (status: TestCase['status']) => {
  const colors: Record<TestCase['status'], string> = {
    passed: 'bg-green-100 text-green-900',
    failed: 'bg-red-100 text-red-900',
    pending: 'bg-yellow-100 text-yellow-900',
  };
  return colors[status];
};

const getStatusIcon = (status: TestCase['status']) => {
  const icons: Record<TestCase['status'], string> = {
    passed: '✅',
    failed: '❌',
    pending: '⏳',
  };
  return icons[status];
};

export const TestingTab: React.FC<TestingTabProps> = ({ testCases }) => {
  const passedCount = testCases.filter(t => t.status === 'passed').length;
  const failedCount = testCases.filter(t => t.status === 'failed').length;
  const coverage = testCases.length > 0 ? (passedCount / testCases.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Test Coverage Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="text-xs font-semibold text-blue-700 uppercase mb-2">Total Tests</div>
          <div className="text-3xl font-bold text-blue-900">{testCases.length}</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="text-xs font-semibold text-green-700 uppercase mb-2">Passed</div>
          <div className="text-3xl font-bold text-green-900">{passedCount}</div>
        </div>
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="text-xs font-semibold text-red-700 uppercase mb-2">Failed</div>
          <div className="text-3xl font-bold text-red-900">{failedCount}</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div className="text-xs font-semibold text-yellow-700 uppercase mb-2">Coverage</div>
          <div className="text-3xl font-bold text-yellow-900">{coverage.toFixed(0)}%</div>
        </div>
      </div>

      {/* Test Cases List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Test Cases</h3>
          <Button variant="primary" size="sm">
            + Add Test Case
          </Button>
        </div>

        {testCases.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-4xl mb-4">🧪</div>
            <p className="text-gray-600 mb-4">No test cases yet</p>
            <Button variant="primary" size="sm">
              + Add First Test Case
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {testCases.map((testCase) => (
              <div key={testCase.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-2xl flex-shrink-0">{getStatusIcon(testCase.status)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{testCase.name}</p>
                      <p className="text-sm text-gray-600 mt-1">{testCase.description}</p>
                    </div>
                  </div>
                  <Badge variant="info" className={getStatusColor(testCase.status)}>
                    {testCase.status === 'passed'
                      ? 'Passed'
                      : testCase.status === 'failed'
                      ? 'Failed'
                      : 'Pending'}
                  </Badge>
                </div>

                {testCase.executedDate && testCase.executedBy && (
                  <div className="text-xs text-gray-600 pt-3 border-t border-gray-200">
                    Last executed by <span className="font-medium">{testCase.executedBy.name}</span> on{' '}
                    {new Date(testCase.executedDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
