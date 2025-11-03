'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-6xl mb-4">🚀</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">CRM Platform</h1>
        <p className="text-xl text-gray-600 mb-8">
          AI-Powered Product Management
        </p>
        <div className="space-y-3">
          <Link
            href="/login"
            className="inline-block px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Login
          </Link>
          <p className="text-gray-600">or</p>
          <Link
            href="/dashboard"
            className="inline-block px-8 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
          >
            View Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
