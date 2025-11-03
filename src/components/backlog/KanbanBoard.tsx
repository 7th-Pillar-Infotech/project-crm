'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Feature } from '@/types';
import { EditIcon, CalendarIcon, StarIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@/components/icons';
import { Avatar } from '@/components/Avatar';

interface KanbanBoardProps {
  groupedFeatures: Record<string, Feature[]>;
  collapsedColumns: string[];
  onToggleCollapse: (columnName: string) => void;
  onDragStart: (featureId: string) => void;
  onDragFeature: (featureId: string, newStatus: string) => void;
  onEditFeature: (feature: Feature) => void;
  onDetailFeature: (feature: Feature) => void;
  getPriorityVariant: (priority: Feature['priority']) => string;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  groupedFeatures,
  collapsedColumns,
  onToggleCollapse,
  onDragStart,
  onDragFeature,
  onEditFeature,
  onDetailFeature,
  getPriorityVariant,
}) => {
  return (
    <div className="flex-1 overflow-hidden flex flex-col min-h-0">
      <style>{`
        .kanban-column-scroll::-webkit-scrollbar {
          height: 6px;
        }
        .kanban-column-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .kanban-column-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .kanban-column-scroll::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      {/* Kanban Columns Container - Horizontal Scroll */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden min-h-0 scroll-smooth">
        <div className="flex gap-6 h-full min-h-full min-w-min px-4 py-4">
          {Object.entries(groupedFeatures).map(([columnName, columnFeatures]) => {
            const isCollapsed = collapsedColumns.includes(columnName);

            return (
              <div
                key={columnName}
                className={`flex flex-col rounded-2xl transition-all duration-300 ${
                  isCollapsed ? 'w-20' : 'w-[400px]'
                } flex-shrink-0 shadow-lg hover:shadow-2xl overflow-hidden h-[calc(100vh-120px)]`}
              >
                {/* Column Header */}
                <div
                  className={`flex items-center justify-between p-4 font-semibold text-sm transition-all duration-300 flex-shrink-0 ${
                    isCollapsed
                      ? 'flex-col gap-2 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 text-white'
                      : 'bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white shadow-md'
                  }`}
                >
                  <button
                    onClick={() => onToggleCollapse(columnName)}
                    className={`transition-all duration-300 hover:scale-125 p-1 rounded-lg flex-shrink-0 ${
                      isCollapsed ? 'text-white hover:bg-blue-600' : 'text-white hover:bg-blue-700'
                    }`}
                    title={isCollapsed ? 'Expand' : 'Collapse'}
                  >
                    {isCollapsed ? <ChevronRightIcon size={18} /> : <ChevronLeftIcon size={18} />}
                  </button>

                  {!isCollapsed && (
                    <>
                      <div className="flex-1 min-w-0">
                        <h3 className="capitalize truncate text-center px-2 text-white font-bold">
                          {columnName}
                        </h3>
                        <p className="text-xs text-blue-100 text-center mt-1">
                          {columnFeatures.length} {columnFeatures.length === 1 ? 'item' : 'items'}
                        </p>
                      </div>
                    </>
                  )}

                  {isCollapsed && (
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <div
                        className="text-xs font-bold text-white rotate-180 leading-tight"
                        style={{ writingMode: 'vertical-rl' }}
                      >
                        {columnName}
                      </div>
                      <Badge variant="info" size="sm" className="bg-white text-blue-600 font-bold">
                        {columnFeatures.length}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Column Content - Independent Scroll */}
                {!isCollapsed && (
                  <div
                    className="flex-1 overflow-x-auto overflow-y-auto bg-gradient-to-b from-gray-50 via-white to-gray-50 space-y-3 p-4 flex flex-col kanban-column-scroll"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const featureId = e.dataTransfer.getData('featureId');
                      onDragFeature(featureId, columnName);
                    }}
                  >
                    {columnFeatures.length > 0 ? (
                      <>
                        {columnFeatures.map((feature) => (
                          <KanbanCard
                            key={feature.id}
                            feature={feature}
                            onDragStart={() => onDragStart(feature.id)}
                            onClick={() => onDetailFeature(feature)}
                            onEdit={() => onEditFeature(feature)}
                            getPriorityVariant={getPriorityVariant}
                          />
                        ))}
                      </>
                    ) : (
                      <div className="flex items-center justify-center flex-1 text-gray-400 text-sm rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:border-blue-300 hover:bg-blue-50 transition-colors duration-300">
                        <div className="text-center">
                          <div className="flex justify-center mb-2">
                            <ChevronDownIcon size={24} className="text-gray-400" />
                          </div>
                          <p className="font-medium">Drop cards here</p>
                          <p className="text-xs text-gray-400 mt-1">to add to {columnName}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Collapsed Column Content Area - Independent Scroll */}
                {isCollapsed && (
                  <div
                    className="flex-1 overflow-x-auto overflow-y-auto bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center flex-col p-2 hover:from-blue-100 hover:to-blue-200 transition-colors duration-300 kanban-column-scroll"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const featureId = e.dataTransfer.getData('featureId');
                      onDragFeature(featureId, columnName);
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface KanbanCardProps {
  feature: Feature;
  onDragStart: () => void;
  onClick: () => void;
  onEdit: () => void;
  getPriorityVariant: (priority: Feature['priority']) => string;
}

const KanbanCard: React.FC<KanbanCardProps> = ({
  feature,
  onDragStart,
  onClick,
  onEdit,
  getPriorityVariant,
}) => (
  <Card
    variant="outlined"
    padding="md"
    className="cursor-grab active:cursor-grabbing hover:shadow-lg transition-all duration-300 group border-l-4 border-l-blue-500 bg-white hover:bg-blue-50 rounded-lg"
    draggable
    onDragStart={(e) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('featureId', feature.id);
      onDragStart();
    }}
    onClick={onClick}
  >
    <div className="space-y-2">
      {/* Header Row: ID + Title + Edit Button */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            {feature.id}
          </div>
          <div className="font-semibold text-gray-900 text-sm line-clamp-1 hover:text-blue-600 transition-colors duration-200">
            {feature.title}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="text-gray-400 hover:text-white hover:bg-blue-600 p-1.5 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 flex-shrink-0 flex items-center justify-center"
          title="Edit feature"
        >
          <EditIcon size={12} />
        </button>
      </div>

      {/* Meta Row 1: Priority + Story Points */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant={getPriorityVariant(feature.priority) as any} size="sm" className="capitalize text-xs">
          {feature.priority}
        </Badge>
        {feature.storyPoints && (
          <div className="inline-flex items-center gap-0.5 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 text-xs font-bold px-1.5 py-0.5 rounded-full">
            <StarIcon size={10} />
            {feature.storyPoints}
          </div>
        )}
      </div>

      {/* Meta Row 2: Owner + Due Date */}
      <div className="flex items-center gap-3 flex-wrap text-xs">
        {feature.owner && (
          <div className="flex items-center gap-1">
            <Avatar name={feature.owner.name} size="sm" />
            <span className="text-gray-600 truncate">{feature.owner.name}</span>
          </div>
        )}
        {feature.dueDate && (
          <div className="flex items-center gap-0.5 text-gray-500">
            <CalendarIcon size={11} />
            <span>{new Date(feature.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        )}
      </div>

      {/* Meta Row 3: Sprint + Team */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        {feature.sprint && (
          <span className="bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">
            {feature.sprint}
          </span>
        )}
        {feature.team && feature.team.length > 0 && (
          <div className="flex items-center gap-0.5">
            <div className="flex gap-0.5">
              {feature.team.slice(0, 2).map((member) => (
                <Avatar key={member.id} name={member.name} size="sm" />
              ))}
            </div>
            {feature.team.length > 2 && (
              <span className="text-xs text-gray-600">+{feature.team.length - 2}</span>
            )}
          </div>
        )}
      </div>

      {/* Meta Row 4: Tags */}
      {feature.tags.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          {feature.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="default" size="sm" className="text-xs py-0.5">
              {tag}
            </Badge>
          ))}
          {feature.tags.length > 2 && (
            <span className="text-xs text-gray-500">+{feature.tags.length - 2}</span>
          )}
        </div>
      )}
    </div>
  </Card>
);
