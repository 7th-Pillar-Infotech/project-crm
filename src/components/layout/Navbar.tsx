'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Notification } from '@/types';
import { getMockNotifications } from '@/lib/mockData';
import { NotificationPanel } from './NotificationPanel';
import { LogoIcon } from '@/components/icons/LogoIcon';

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
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Load notifications from mock data
    setNotifications(getMockNotifications());
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(
      notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center space-x-2.5 group">
          <div className="p-1.5 rounded-xl bg-gradient-to-br from-cyan-100 to-teal-100 group-hover:shadow-lg transition-shadow">
            <LogoIcon />
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-sm font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              ConnectHub
            </span>
            <span className="text-xs text-gray-500 font-medium">CRM Platform</span>
          </div>
        </Link>

        {/* Right - Search, Notifications & User Menu */}
        <div className="flex items-center space-x-3">
          {/* Search */}
          <div className="hidden md:flex max-w-xs">
            <div className="relative w-full">
              <input
                type="search"
                placeholder="Search... (⌘K)"
                className="w-full rounded-xl border border-gray-300 bg-gray-50 pl-4 pr-10 py-2.5 text-sm placeholder-gray-500 focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold pointer-events-none">⌘K</span>
            </div>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative rounded-lg p-2 hover:bg-gray-100 transition-colors group"
              title="Notifications"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">🔔</span>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Panel */}
            <NotificationPanel
              notifications={notifications}
              isOpen={notificationsOpen}
              onClose={() => setNotificationsOpen(false)}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
            />
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="group flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-200"
            >
              <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 text-lg font-semibold group-hover:scale-110 transition-transform">
                {user?.avatar || '👤'}
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <p className="text-xs font-bold text-gray-900 leading-tight">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-white shadow-xl border border-gray-200 overflow-hidden z-50 backdrop-blur-sm bg-opacity-95">
                {/* User Info Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 text-white">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white text-2xl">
                      {user?.avatar || '👤'}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{user?.name || 'User'}</p>
                      <p className="text-xs text-blue-100">{user?.email || 'user@example.com'}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-2 space-y-1">
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-700 hover:bg-blue-50 transition-colors group">
                    <span className="text-lg">👤</span>
                    <div className="text-left">
                      <p className="font-medium">Profile</p>
                      <p className="text-xs text-gray-500">View and edit your profile</p>
                    </div>
                  </button>

                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-700 hover:bg-blue-50 transition-colors">
                    <span className="text-lg">⚙️</span>
                    <div className="text-left">
                      <p className="font-medium">Settings</p>
                      <p className="text-xs text-gray-500">Manage your preferences</p>
                    </div>
                  </button>

                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-700 hover:bg-blue-50 transition-colors">
                    <span className="text-lg">⌨️</span>
                    <div className="text-left">
                      <p className="font-medium">Keyboard Shortcuts</p>
                      <p className="text-xs text-gray-500">Learn quick commands</p>
                    </div>
                  </button>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200"></div>

                {/* Logout Button */}
                <div className="p-2">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onLogout?.();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                  >
                    <span className="text-lg">🚪</span>
                    <div className="text-left">
                      <p className="font-medium">Logout</p>
                      <p className="text-xs text-red-500">Sign out from your account</p>
                    </div>
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
