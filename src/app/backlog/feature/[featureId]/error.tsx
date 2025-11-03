'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function FeatureDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Feature</h2>
        <p className="text-gray-600 mb-6">There was an error loading this feature.</p>
        <div className="flex gap-4 justify-center">
          <Button variant="primary" onClick={() => reset()}>
            Try again
          </Button>
          <Button variant="secondary" onClick={() => window.location.href = '/backlog'}>
            Back to Backlog
          </Button>
        </div>
      </div>
    </div>
  );
}
