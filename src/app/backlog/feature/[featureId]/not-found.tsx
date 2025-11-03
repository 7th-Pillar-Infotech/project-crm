'use client';

import { Button } from '@/components/ui/Button';

export default function FeatureNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">📋</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Feature Not Found</h2>
        <p className="text-gray-600 mb-6">The feature you&apos;re looking for doesn&apos;t exist.</p>
        <Button variant="primary" onClick={() => window.location.href = '/backlog'}>
          Back to Backlog
        </Button>
      </div>
    </div>
  );
}
