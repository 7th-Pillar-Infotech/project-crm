'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Notification } from '@/types';

interface NotificationPanelProps {
  notifications: Notification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
}

const getNotificationGradient = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return 'from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-green-200';
    case 'error':
      return 'from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 border-red-200';
    case 'warning':
      return 'from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 border-amber-200';
    case 'mention':
      return 'from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-200';
    case 'reminder':
      return 'from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border-blue-200';
    case 'update':
      return 'from-cyan-50 to-teal-50 hover:from-cyan-100 hover:to-teal-100 border-cyan-200';
    case 'info':
    default:
      return 'from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100 border-gray-200';
  }
};

const getIconStyles = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return { bg: 'bg-gradient-to-br from-green-100 to-emerald-100', text: 'text-green-600' };
    case 'error':
      return { bg: 'bg-gradient-to-br from-red-100 to-rose-100', text: 'text-red-600' };
    case 'warning':
      return { bg: 'bg-gradient-to-br from-amber-100 to-yellow-100', text: 'text-amber-600' };
    case 'mention':
      return { bg: 'bg-gradient-to-br from-purple-100 to-pink-100', text: 'text-purple-600' };
    case 'reminder':
      return { bg: 'bg-gradient-to-br from-blue-100 to-cyan-100', text: 'text-blue-600' };
    case 'update':
      return { bg: 'bg-gradient-to-br from-cyan-100 to-teal-100', text: 'text-cyan-600' };
    case 'info':
    default:
      return { bg: 'bg-gradient-to-br from-gray-100 to-slate-100', text: 'text-gray-600' };
  }
};

const getTypeIcon = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return '✓';
    case 'error':
      return '✕';
    case 'warning':
      return '!';
    case 'mention':
      return '@';
    case 'reminder':
      return '⏰';
    case 'update':
      return '↻';
    case 'info':
    default:
      return 'ℹ';
  }
};

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const filteredNotifications =
    filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  if (!isOpen && !isAnimating) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-30 transition-opacity duration-300 ${
          isOpen ? 'bg-black/40 opacity-100' : 'bg-black/0 opacity-0 pointer-events-none'
        }`}
        onClick={() => {
          setIsAnimating(false);
          onClose();
        }}
      />

      {/* Side Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 h-screen w-full sm:w-[420px] bg-gradient-to-b from-white to-gray-50 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onTransitionEnd={() => {
          if (!isOpen) setIsAnimating(false);
        }}
      >
        {/* Top Action Bar */}
        <div className="flex-shrink-0 border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔔</span>
            <span className="text-sm font-semibold text-gray-700">
              {unreadCount > 0 && <span className="text-red-500">{unreadCount} new</span>}
              {unreadCount === 0 && <span className="text-gray-500">All caught up</span>}
            </span>
          </div>
          <button
            onClick={() => {
              setIsAnimating(false);
              onClose();
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            title="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex-shrink-0 border-b border-gray-200 bg-white px-4 py-2 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all relative ${
              filter === 'unread'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Unread
            {unreadCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-0.5 text-xs text-white font-bold min-w-[20px]">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-900 text-center font-semibold text-lg">
                {filter === 'unread' ? 'All caught up!' : 'No notifications'}
              </p>
              <p className="text-sm text-gray-500 text-center mt-2">
                {filter === 'unread'
                  ? 'You have no unread notifications'
                  : 'Check back later for updates'}
              </p>
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {filteredNotifications.map((notification) => {
                const iconStyles = getIconStyles(notification.type);
                return (
                  <div
                    key={notification.id}
                    onClick={() => {
                      if (!notification.read && onMarkAsRead) {
                        onMarkAsRead(notification.id);
                      }
                    }}
                    className={`bg-gradient-to-r ${getNotificationGradient(
                      notification.type
                    )} border rounded-2xl transition-all cursor-pointer duration-200 transform hover:scale-105 hover:shadow-md ${
                      !notification.read ? 'ring-1 ring-blue-300' : ''
                    }`}
                  >
                    <div className="px-5 py-4">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div
                          className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold ${iconStyles.bg} ${iconStyles.text} shadow-sm`}
                        >
                          {notification.icon || notification.avatar || getTypeIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pt-1">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-bold text-gray-900 text-sm leading-tight pr-2">
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <div className="h-2 w-2 flex-shrink-0 rounded-full bg-blue-600 mt-1.5" />
                            )}
                          </div>
                          <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed mb-3">
                            {notification.message}
                          </p>

                          {/* Footer - Time and Action */}
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs text-gray-500 font-medium">
                              {formatTime(notification.timestamp)}
                            </span>
                            {notification.actionUrl && notification.actionLabel && (
                              <Link
                                href={notification.actionUrl}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsAnimating(false);
                                  onClose();
                                }}
                                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors inline-flex items-center gap-1"
                              >
                                {notification.actionLabel}
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Button */}
        {notifications.length > 0 && unreadCount > 0 && (
          <div className="flex-shrink-0 border-t border-gray-200 bg-white px-6 py-4">
            <button
              onClick={() => {
                onMarkAllAsRead?.();
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              Mark all as read
            </button>
          </div>
        )}
      </div>
    </>
  );
};
