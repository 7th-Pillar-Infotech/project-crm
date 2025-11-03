"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: "dashboard", label: "Dashboard", href: "/dashboard" },
  { icon: "backlog", label: "Backlog", href: "/backlog" },
  { icon: "sprint", label: "Sprints", href: "/sprints" },
  { icon: "goals", label: "Goals", href: "/goals" },
  { icon: "releases", label: "Releases", href: "/releases" },
  { icon: "documents", label: "Documents", href: "/documents" },
  { icon: "stakeholders", label: "Stakeholders", href: "/stakeholders" },
  { icon: "requirements", label: "Requirements", href: "/requirements" },
  { icon: "reports", label: "Reports", href: "/reports" },
];

const settingsItems = [
  { icon: "settings", label: "Settings", href: "/settings" },
];

// SVG Icons
const SvgIcons: Record<string, React.FC<{ className?: string }>> = {
  dashboard: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  backlog: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 1 0 4 0M9 5a2 2 0 1 1 4 0m-3 7h3m-3 4h3m-6-4h.01M6 15h.01" />
    </svg>
  ),
  sprint: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  goals: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  releases: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <polyline points="13 2 13 9 20 9" />
    </svg>
  ),
  documents: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="13" x2="12" y2="17" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  ),
  stakeholders: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  requirements: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
    </svg>
  ),
  reports: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <line x1="12" y1="2" x2="12" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  settings: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m3.08 3.08l4.24 4.24M1 12h6m6 0h6m-18.78 7.78l4.24-4.24m3.08-3.08l4.24-4.24" />
    </svg>
  ),
};

interface SidebarProps {
  isCollapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed = false,
  onCollapse,
}) => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(isCollapsed);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
    onCollapse?.(!collapsed);
  };

  const IconComponent = (iconName: string) => {
    const Icon = SvgIcons[iconName];
    return Icon ? <Icon className="w-5 h-5" /> : null;
  };

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] border-r border-blue-200 bg-gradient-to-b from-blue-50 via-white to-blue-50 transition-all duration-300 ease-in-out ${
        collapsed ? "w-20" : "w-64"
      } hidden md:flex md:flex-col overflow-y-auto`}
    >
      {/* Header */}
      <div className="border-b border-blue-200 px-4 py-4 flex items-center justify-between bg-white">
        {!collapsed && (
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Navigation</span>
        )}
        <button
          onClick={toggleCollapse}
          className="ml-auto p-2 rounded-lg hover:bg-blue-100 transition-colors text-blue-600 hover:text-blue-800"
          title={collapsed ? "Expand" : "Collapse"}
        >
          <svg
            className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Main Navigation Items */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-lg shadow-blue-200 hover:shadow-xl hover:from-blue-600 hover:to-blue-700 hover:text-white"
                  : "text-blue-700 hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-50 hover:text-blue-900"
              }`}
              title={collapsed ? item.label : ""}
            >

              {/* Icon */}
              <div className={`flex-shrink-0 transition-colors ${isActive ? "text-white" : "text-blue-600 group-hover:text-blue-700"}`}>
                {IconComponent(item.icon)}
              </div>

              {/* Label */}
              {!collapsed && (
                <span className="text-sm font-medium truncate">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Settings Section */}
      <div className="border-t border-blue-200 p-3 space-y-1 bg-white">
        {settingsItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-lg shadow-blue-200 hover:shadow-xl hover:from-blue-600 hover:to-blue-700 hover:text-white"
                  : "text-blue-700 hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-50 hover:text-blue-900"
              }`}
              title={collapsed ? item.label : ""}
            >

              {/* Icon */}
              <div className={`flex-shrink-0 transition-colors ${isActive ? "text-white" : "text-blue-600 group-hover:text-blue-700"}`}>
                {IconComponent(item.icon)}
              </div>

              {/* Label */}
              {!collapsed && (
                <span className="text-sm font-medium truncate">{item.label}</span>
              )}
            </Link>
          );
        })}
      </div>
    </aside>
  );
};
