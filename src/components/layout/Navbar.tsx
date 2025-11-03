'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface NavbarProps {
  user?: {
    name: string;
    avatar?: string;
    email?: string;
  };
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center space-x-2 font-bold text-lg">
          <span className="text-2xl">🚀</span>
          <span className="hidden sm:inline">CRM</span>
        </Link>

        {/* Center - Search */}
        <div className="hidden flex-1 max-w-md mx-4 sm:block">
          <input
            type="search"
            placeholder="Search features, goals... (⌘K)"
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Right - Actions & User Menu */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative rounded-lg p-2 hover:bg-gray-100 transition-colors">
            <span className="text-xl">🔔</span>
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Help */}
          <button className="rounded-lg p-2 hover:bg-gray-100 transition-colors" title="Help">
            <span className="text-xl">❓</span>
          </button>

          {/* Settings */}
          <button className="rounded-lg p-2 hover:bg-gray-100 transition-colors" title="Settings">
            <span className="text-xl">⚙️</span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center space-x-2 rounded-lg p-2 hover:bg-gray-100 transition-colors"
            >
              <span className="text-2xl">{user?.avatar || '👤'}</span>
              <span className="hidden sm:inline text-sm font-medium text-gray-700">{user?.name || 'User'}</span>
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 p-3">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                </div>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Profile
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Settings
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Keyboard Shortcuts
                </button>
                <div className="border-t border-gray-200">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onLogout?.();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
