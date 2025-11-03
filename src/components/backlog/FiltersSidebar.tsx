'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { XIcon, HamburgerIcon, ChevronDownIcon, ChevronUpIcon } from '@/components/icons';

interface FilterItem {
  value: string;
  label: string;
  count?: number;
}

interface FiltersSidebarProps {
  isOpen: boolean;
  onToggle: () => void;

  // Status
  statusOptions: FilterItem[];
  selectedStatus: string[];
  onStatusChange: (status: string[]) => void;

  // Priority
  priorityOptions: FilterItem[];
  selectedPriority: string[];
  onPriorityChange: (priority: string[]) => void;

  // Owner
  ownerOptions: FilterItem[];
  selectedOwner: string[];
  onOwnerChange: (owner: string[]) => void;

  // Tags
  tagOptions: FilterItem[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;

  // Effort
  effortRange: [number, number];
  onEffortChange: (range: [number, number]) => void;

  // Due Date
  dueDateRange: [string, string];
  onDueDateChange: (range: [string, string]) => void;

  // Epic
  epicOptions: FilterItem[];
  selectedEpic: string;
  onEpicChange: (epic: string) => void;

  // Clear all
  onClearAll: () => void;
  hasActiveFilters: boolean;
}

export const FiltersSidebar: React.FC<FiltersSidebarProps> = ({
  isOpen,
  onToggle,
  statusOptions,
  selectedStatus,
  onStatusChange,
  priorityOptions,
  selectedPriority,
  onPriorityChange,
  ownerOptions,
  selectedOwner,
  onOwnerChange,
  tagOptions,
  selectedTags,
  onTagsChange,
  effortRange,
  onEffortChange,
  dueDateRange,
  onDueDateChange,
  epicOptions,
  selectedEpic,
  onEpicChange,
  onClearAll,
  hasActiveFilters,
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'status',
    'priority',
  ]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const toggleFilterItem = (items: string[], value: string) => {
    return items.includes(value)
      ? items.filter(item => item !== value)
      : [...items, value];
  };

  return (
    <>
      {/* Filter Toggle Button */}
      <div className="lg:hidden p-4">
        <Button
          variant={isOpen ? 'primary' : 'secondary'}
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2"
        >
          {isOpen ? (
            <>
              <XIcon size={16} />
              Close Filters
            </>
          ) : (
            <>
              <HamburgerIcon size={16} />
              Show Filters
            </>
          )}
        </Button>
      </div>

      {/* Filters Sidebar */}
      {isOpen && (
        <div className="w-full lg:w-80 bg-white border-r border-gray-200 rounded-none border-t-0 border-l-0 border-b-0 overflow-y-auto lg:overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <p className="text-xs text-gray-500 mt-1">Narrow down your features</p>
              </div>
              {hasActiveFilters && (
                <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                  {[
                    ...selectedStatus,
                    ...selectedPriority,
                    ...selectedOwner,
                    ...selectedTags,
                  ].length} Active
                </span>
              )}
            </div>
          </div>

          <div className="p-4 space-y-4">

            {/* Status Filter */}
            <FilterSection
              title="Status"
              isExpanded={expandedSections.includes('status')}
              onToggle={() => toggleSection('status')}
              count={selectedStatus.length}
            >
              <div className="space-y-2">
                {statusOptions.map(option => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStatus.includes(option.value)}
                      onChange={() =>
                        onStatusChange(toggleFilterItem(selectedStatus, option.value))
                      }
                      className="rounded w-4 h-4 cursor-pointer"
                    />
                    <span className="flex-1 text-sm text-gray-700">{option.label}</span>
                    {option.count !== undefined && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {option.count}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Priority Filter */}
            <FilterSection
              title="Priority"
              isExpanded={expandedSections.includes('priority')}
              onToggle={() => toggleSection('priority')}
              count={selectedPriority.length}
            >
              <div className="space-y-2">
                {priorityOptions.map(option => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPriority.includes(option.value)}
                      onChange={() =>
                        onPriorityChange(toggleFilterItem(selectedPriority, option.value))
                      }
                      className="rounded w-4 h-4 cursor-pointer"
                    />
                    <span className="flex-1 text-sm text-gray-700">{option.label}</span>
                    {option.count !== undefined && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {option.count}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Owner Filter */}
            {ownerOptions.length > 0 && (
              <FilterSection
                title="Owner"
                isExpanded={expandedSections.includes('owner')}
                onToggle={() => toggleSection('owner')}
                count={selectedOwner.length}
              >
                <div className="space-y-2">
                  {ownerOptions.map(option => (
                    <label
                      key={option.value}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedOwner.includes(option.value)}
                        onChange={() =>
                          onOwnerChange(toggleFilterItem(selectedOwner, option.value))
                        }
                        className="rounded w-4 h-4 cursor-pointer"
                      />
                      <span className="flex-1 text-sm text-gray-700">{option.label}</span>
                      {option.count !== undefined && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {option.count}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </FilterSection>
            )}

            {/* Tags Filter */}
            {tagOptions.length > 0 && (
              <FilterSection
                title="Tags"
                isExpanded={expandedSections.includes('tags')}
                onToggle={() => toggleSection('tags')}
                count={selectedTags.length}
              >
                <div className="flex flex-wrap gap-2">
                  {tagOptions.map(option => (
                    <Badge
                      key={option.value}
                      variant={selectedTags.includes(option.value) ? 'info' : 'default'}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() =>
                        onTagsChange(toggleFilterItem(selectedTags, option.value))
                      }
                    >
                      {option.label}
                      {option.count && ` (${option.count})`}
                    </Badge>
                  ))}
                </div>
              </FilterSection>
            )}

            {/* Effort/Story Points */}
            <FilterSection
              title="Story Points"
              isExpanded={expandedSections.includes('effort')}
              onToggle={() => toggleSection('effort')}
            >
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Min</span>
                    <span className="text-sm font-bold text-blue-600">{effortRange[0]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="13"
                    value={effortRange[0]}
                    onChange={(e) =>
                      onEffortChange([parseInt(e.target.value), effortRange[1]])
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Max</span>
                    <span className="text-sm font-bold text-blue-600">{effortRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="13"
                    value={effortRange[1]}
                    onChange={(e) =>
                      onEffortChange([effortRange[0], parseInt(e.target.value)])
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </FilterSection>

            {/* Due Date Range */}
            <FilterSection
              title="Due Date"
              isExpanded={expandedSections.includes('dueDate')}
              onToggle={() => toggleSection('dueDate')}
            >
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">From</label>
                  <input
                    type="date"
                    value={dueDateRange[0]}
                    onChange={(e) =>
                      onDueDateChange([e.target.value, dueDateRange[1]])
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">To</label>
                  <input
                    type="date"
                    value={dueDateRange[1]}
                    onChange={(e) =>
                      onDueDateChange([dueDateRange[0], e.target.value])
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </FilterSection>

            {/* Epic Filter */}
            {epicOptions.length > 0 && (
              <FilterSection
                title="Epic"
                isExpanded={expandedSections.includes('epic')}
                onToggle={() => toggleSection('epic')}
              >
                <select
                  value={selectedEpic}
                  onChange={(e) => onEpicChange(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
                >
                  <option value="">All Epics</option>
                  {epicOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FilterSection>
            )}

            {/* Clear All Filters */}
            {hasActiveFilters && (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onClearAll}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <XIcon size={14} />
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

/* Filter Section Component */
interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  count?: number;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  children,
  isExpanded,
  onToggle,
  count = 0,
}) => (
  <div className="border-t border-gray-200 pt-4">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between mb-3 hover:text-blue-600 transition-colors"
    >
      <span className="font-medium text-gray-900 text-sm flex items-center gap-2">
        {title}
        {count > 0 && (
          <Badge variant="info" size="sm">
            {count}
          </Badge>
        )}
      </span>
      {isExpanded ? (
        <ChevronUpIcon size={18} className="text-gray-600" />
      ) : (
        <ChevronDownIcon size={18} className="text-gray-600" />
      )}
    </button>
    {isExpanded && <div className="animate-in fade-in">{children}</div>}
  </div>
);
