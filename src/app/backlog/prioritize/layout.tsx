import { AppLayout } from '@/components/layout/AppLayout';
import Link from 'next/link';
import { ReactNode } from 'react';

export default function PrioritizeLayout({ children }: { children: ReactNode }) {
  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Back Button */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <Link
              href="/backlog"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition"
            >
              ← Back to Backlog
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-8">
              <Link
                href="/backlog/prioritize/wsjf"
                className="px-4 py-4 text-sm font-medium border-b-2 border-transparent hover:border-gray-300 transition whitespace-nowrap"
              >
                WSJF
              </Link>
              <Link
                href="/backlog/prioritize/rice"
                className="px-4 py-4 text-sm font-medium border-b-2 border-transparent hover:border-gray-300 transition whitespace-nowrap"
              >
                RICE
              </Link>
              <Link
                href="/backlog/prioritize/moscow"
                className="px-4 py-4 text-sm font-medium border-b-2 border-transparent hover:border-gray-300 transition whitespace-nowrap"
              >
                MoSCoW
              </Link>
              <Link
                href="/backlog/prioritize/matrix"
                className="px-4 py-4 text-sm font-medium border-b-2 border-transparent hover:border-gray-300 transition whitespace-nowrap"
              >
                Priority Matrix
              </Link>
            </div>
          </div>
        </div>

        {/* Content */}
        {children}
      </div>
    </AppLayout>
  );
}
