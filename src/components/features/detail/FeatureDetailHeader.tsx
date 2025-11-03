'use client';

import React, { useState } from 'react';
import { Feature } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface FeatureDetailHeaderProps {
  feature: Feature;
  onTitleChange: (title: string) => void;
  onStatusChange: (status: Feature['status']) => void;
  onPriorityChange: (priority: Feature['priority']) => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const getPriorityColor = (priority: Feature['priority']) => {
  const colors: Record<Feature['priority'], string> = {
    critical: 'bg-red-100 text-red-900',
    high: 'bg-yellow-100 text-yellow-900',
    medium: 'bg-cyan-100 text-cyan-900',
    low: 'bg-gray-100 text-gray-900',
  };
  return colors[priority];
};

const getStatusColor = (status: Feature['status']) => {
  const colors: Record<Feature['status'], string> = {
    backlog: 'bg-gray-100 text-gray-900',
    planned: 'bg-blue-100 text-blue-900',
    'in-progress': 'bg-purple-100 text-purple-900',
    done: 'bg-green-100 text-green-900',
    archived: 'bg-slate-100 text-slate-900',
  };
  return colors[status];
};

export const FeatureDetailHeader: React.FC<FeatureDetailHeaderProps> = ({
  feature,
  onTitleChange,
  onStatusChange,
  onPriorityChange,
  onEdit,
  onDuplicate,
  onDelete,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(feature.title);
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  const handleSaveTitle = () => {
    if (titleValue.trim()) {
      onTitleChange(titleValue);
      setIsEditingTitle(false);
    }
  };

  return (
    <Card className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      {/* Feature ID and Badge */}
      <div className="flex items-center gap-3 mb-4">
        <Badge variant="info" className="font-mono text-sm">
          {feature.id}
        </Badge>
        {feature.epic && (
          <span className="text-xs text-gray-600">Part of {feature.epic}</span>
        )}
      </div>

      {/* Title Section */}
      <div className="mb-6">
        {isEditingTitle ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveTitle();
                if (e.key === 'Escape') setIsEditingTitle(false);
              }}
              className="flex-1 text-3xl font-bold text-gray-900 border border-blue-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <Button variant="primary" size="sm" onClick={handleSaveTitle}>
              Save
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setIsEditingTitle(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <h1
            className="text-3xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={() => setIsEditingTitle(true)}
          >
            {feature.title}
          </h1>
        )}
      </div>

      {/* Status and Priority Section */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <select
            value={feature.status}
            onChange={(e) => onStatusChange(e.target.value as Feature['status'])}
            className={`px-3 py-2 rounded-lg text-sm font-medium border-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${getStatusColor(feature.status)}`}
          >
            <option value="backlog">Backlog</option>
            <option value="planned">Planned</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Priority:</span>
          <select
            value={feature.priority}
            onChange={(e) => onPriorityChange(e.target.value as Feature['priority'])}
            className={`px-3 py-2 rounded-lg text-sm font-medium border-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${getPriorityColor(feature.priority)}`}
          >
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Owner and Details Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 py-4 border-y border-gray-200">
        {/* Owner */}
        <div>
          <div className="text-xs text-gray-600 font-semibold uppercase mb-2">Owner</div>
          {feature.owner ? (
            <div className="flex items-center gap-2">
              <span className="text-2xl">{feature.owner.avatar || '👤'}</span>
              <div className="text-sm">{feature.owner.name}</div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">Unassigned</div>
          )}
        </div>

        {/* Created Date */}
        <div>
          <div className="text-xs text-gray-600 font-semibold uppercase mb-2">Created</div>
          <div className="text-sm text-gray-700">{new Date(feature.createdAt).toLocaleDateString()}</div>
        </div>

        {/* Updated Date */}
        <div>
          <div className="text-xs text-gray-600 font-semibold uppercase mb-2">Updated</div>
          <div className="text-sm text-gray-700">{new Date(feature.updatedAt).toLocaleDateString()}</div>
        </div>

        {/* Story Points */}
        <div>
          <div className="text-xs text-gray-600 font-semibold uppercase mb-2">Story Points</div>
          <div className="text-sm text-gray-700 font-semibold">
            {feature.storyPoints ? `${feature.storyPoints} pts` : 'N/A'}
          </div>
        </div>
      </div>

      {/* Actions Menu */}
      <div className="flex items-center gap-2 relative">
        <Button variant="secondary" size="sm" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="secondary" size="sm" onClick={onDuplicate}>
          Duplicate
        </Button>
        <div className="relative">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowActionsMenu(!showActionsMenu)}
          >
            ⋮ More
          </Button>
          {showActionsMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                Move to Sprint
              </button>
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                Archive
              </button>
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                Export to PDF
              </button>
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                Copy Link
              </button>
              <hr className="my-2" />
              <button
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                onClick={onDelete}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
