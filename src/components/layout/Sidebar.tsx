"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: "📊", label: "Dashboard", href: "/dashboard" },
  { icon: "📋", label: "Backlog", href: "/backlog" },
  { icon: "🏃", label: "Sprints", href: "/sprints" },
  { icon: "🎯", label: "Goals", href: "/goals" },
  { icon: "🚀", label: "Releases", href: "/releases" },
  { icon: "📝", label: "Documents", href: "/documents" },
  { icon: "👥", label: "Stakeholders", href: "/stakeholders" },
  { icon: "✅", label: "Requirements", href: "/requirements" },
  { icon: "📈", label: "Reports", href: "/reports" },
  { icon: "⚙️", label: "Settings", href: "/settings" },
];

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

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] border-r border-gray-200 bg-white transition-all duration-300 ease-in-out ${
        collapsed ? "w-20" : "w-64"
      } hidden md:block overflow-y-auto`}
    >
      {/* Collapse Button */}
      <div className="border-b border-gray-200 p-4 flex justify-between items-center">
        {!collapsed && (
          <span className="text-sm font-semibold text-gray-700">Menu</span>
        )}
        <button
          onClick={toggleCollapse}
          className="rounded-lg p-1 hover:bg-gray-100 transition-colors"
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="space-y-2 p-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 rounded-lg px-3 py-2 transition-colors duration-200 ${
                isActive
                  ? "bg-blue-50 text-blue-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              title={collapsed ? item.label : ""}
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Create Button */}
      {/* {!collapsed && (
        <div className="border-t border-gray-200 p-4 mt-auto">
          <button className="w-full rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors">
            + Create
          </button>
        </div>
      )} */}
    </aside>
  );
};
