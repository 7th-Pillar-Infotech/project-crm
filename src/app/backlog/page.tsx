'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { FiltersSidebar } from '@/components/backlog/FiltersSidebar';
import { KanbanBoard } from '@/components/backlog/KanbanBoard';
import { mockFeatures } from '@/lib/mockData';
import { Feature } from '@/types';
import {
  ListIcon,
  GridIcon,
  KanbanIcon,
  SearchIcon,
  RefreshIcon,
  ExportIcon,
  PlusIcon,
  MoreIcon,
  CalendarIcon,
  UsersIcon,
} from '@/components/icons';

type ViewMode = 'list' | 'grid' | 'kanban';
type GroupBy = 'none' | 'status' | 'priority';
type SortBy = 'priority' | 'dueDate' | 'updated' | 'alphabetical';

export default function BacklogPage() {
  const router = useRouter();

  // View & Layout State
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [groupBy, setGroupBy] = useState<GroupBy>('status');
  const [showFiltersSidebar, setShowFiltersSidebar] = useState(false);
  const [collapsedColumns, setCollapsedColumns] = useState<string[]>([]);

  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  // Filter State
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterPriority, setFilterPriority] = useState<string[]>([]);
  const [filterOwner, setFilterOwner] = useState<string[]>([]);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [filterDueDateRange, setFilterDueDateRange] = useState<[string, string]>(['', '']);
  const [filterEffortRange, setFilterEffortRange] = useState<[number, number]>([0, 13]);
  const [filterEpic, setFilterEpic] = useState<string>('');

  // Sort State
  const [sortBy, setSortBy] = useState<SortBy>('updated');

  // Features & Selection State
  const [features, setFeatures] = useState<Feature[]>(() => {
    // Initialize with current mockFeatures
    const allFeatures = [...mockFeatures];

    // Load any newly created features from localStorage
    if (typeof window !== 'undefined') {
      const newFeaturesJson = localStorage.getItem('new-features');
      if (newFeaturesJson) {
        try {
          const newFeatures = JSON.parse(newFeaturesJson);
          // Add new features that aren't already in the list
          newFeatures.forEach((newFeature: Feature) => {
            if (!allFeatures.find(f => f.id === newFeature.id)) {
              allFeatures.push(newFeature);
            }
          });
        } catch (e) {
          console.error('Failed to parse new features from localStorage', e);
        }
      }
    }

    return allFeatures;
  });
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // Sync with mockFeatures and localStorage when page loads/returns
  React.useEffect(() => {
    // Always sync with mockFeatures to pick up new features
    const allFeatures = [...mockFeatures];

    // Load any newly created features from localStorage
    if (typeof window !== 'undefined') {
      const newFeaturesJson = localStorage.getItem('new-features');
      if (newFeaturesJson) {
        try {
          const newFeatures = JSON.parse(newFeaturesJson);
          // Add new features that aren't already in the list
          newFeatures.forEach((newFeature: Feature) => {
            if (!allFeatures.find(f => f.id === newFeature.id)) {
              allFeatures.push(newFeature);
            }
          });
        } catch (e) {
          console.error('Failed to parse new features from localStorage', e);
        }
      }
    }

    setFeatures(allFeatures);
  }, []);

  // Listen for feature updates from modal
  React.useEffect(() => {
    const handleFeatureUpdate = (event: any) => {
      const { featureId, feature: updatedFeature } = event.detail;
      setFeatures(prev =>
        prev.map(f => f.id === featureId ? updatedFeature : f)
      );
    };

    const handleFeatureAdded = (event: any) => {
      const { feature: newFeature } = event.detail;
      setFeatures(prev => [...prev, newFeature]);
    };

    window.addEventListener('featureUpdated', handleFeatureUpdate);
    window.addEventListener('featureAdded', handleFeatureAdded);
    return () => {
      window.removeEventListener('featureUpdated', handleFeatureUpdate);
      window.removeEventListener('featureAdded', handleFeatureAdded);
    };
  }, []);

  // Form State for Add/Edit
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'feature' as Feature['type'],
    status: 'backlog' as Feature['status'],
    priority: 'medium' as Feature['priority'],
    storyPoints: '',
    dueDate: '',
  });

  // Get all unique values for filters
  const allOwners = useMemo(() => {
    const owners = new Set<string>();
    features.forEach(f => {
      if (f.owner) owners.add(f.owner.name);
    });
    return Array.from(owners);
  }, [features]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    features.forEach(f => f.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  }, [features]);

  const allEpics = useMemo(() => {
    const epics = new Set<string>();
    features.forEach(f => {
      if (f.epic) epics.add(f.epic);
    });
    return Array.from(epics);
  }, [features]);

  // Filter Features
  const filteredFeatures = useMemo(() => {
    return features.filter(feature => {
      if (filterStatus.length > 0 && !filterStatus.includes(feature.status)) return false;
      if (filterPriority.length > 0 && !filterPriority.includes(feature.priority)) return false;
      if (filterOwner.length > 0 && (!feature.owner || !filterOwner.includes(feature.owner.name))) return false;
      if (filterTags.length > 0 && !feature.tags.some(tag => filterTags.includes(tag))) return false;
      if (filterEpic && feature.epic !== filterEpic) return false;
      if (feature.storyPoints && (feature.storyPoints < filterEffortRange[0] || feature.storyPoints > filterEffortRange[1])) return false;
      if (filterDueDateRange[0] && feature.dueDate && feature.dueDate < filterDueDateRange[0]) return false;
      if (filterDueDateRange[1] && feature.dueDate && feature.dueDate > filterDueDateRange[1]) return false;
      return true;
    });
  }, [features, filterStatus, filterPriority, filterOwner, filterTags, filterEpic, filterEffortRange, filterDueDateRange]);

  // Sort Features
  const sortedFeatures = useMemo(() => {
    const sorted = [...filteredFeatures];
    if (sortBy === 'priority') {
      const priorityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
      sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (sortBy === 'dueDate') {
      sorted.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    } else if (sortBy === 'alphabetical') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      sorted.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }
    return sorted;
  }, [filteredFeatures, sortBy]);

  // Group Features
  const groupedFeatures = useMemo((): Record<string, Feature[]> => {
    if (groupBy === 'status') {
      return {
        'backlog': sortedFeatures.filter(f => f.status === 'backlog'),
        'planned': sortedFeatures.filter(f => f.status === 'planned'),
        'in-progress': sortedFeatures.filter(f => f.status === 'in-progress'),
        'done': sortedFeatures.filter(f => f.status === 'done'),
        'archived': sortedFeatures.filter(f => f.status === 'archived'),
      };
    } else if (groupBy === 'priority') {
      return {
        'critical': sortedFeatures.filter(f => f.priority === 'critical'),
        'high': sortedFeatures.filter(f => f.priority === 'high'),
        'medium': sortedFeatures.filter(f => f.priority === 'medium'),
        'low': sortedFeatures.filter(f => f.priority === 'low'),
      };
    }
    return { 'all': sortedFeatures };
  }, [sortedFeatures, groupBy]);

  // Helper Functions
  const getStatusVariant = (status: Feature['status']) => {
    const variants = {
      'backlog': 'default',
      'planned': 'info',
      'in-progress': 'warning',
      'done': 'success',
      'archived': 'default',
    };
    return variants[status] as any;
  };

  const getPriorityVariant = (priority: Feature['priority']) => {
    const variants = {
      'critical': 'error',
      'high': 'warning',
      'medium': 'info',
      'low': 'default',
    };
    return variants[priority] as any;
  };

  const clearAllFilters = () => {
    setFilterStatus([]);
    setFilterPriority([]);
    setFilterOwner([]);
    setFilterTags([]);
    setFilterDueDateRange(['', '']);
    setFilterEffortRange([0, 13]);
    setFilterEpic('');
  };

  const toggleColumnCollapse = (columnName: string) => {
    setCollapsedColumns(prev =>
      prev.includes(columnName)
        ? prev.filter(c => c !== columnName)
        : [...prev, columnName]
    );
  };

  const handleEditFeature = () => {
    if (!selectedFeature || !formData.title.trim()) return;

    setFeatures(features.map(f =>
      f.id === selectedFeature.id
        ? {
            ...f,
            title: formData.title,
            description: formData.description,
            type: formData.type,
            status: formData.status,
            priority: formData.priority,
            storyPoints: formData.storyPoints ? parseInt(formData.storyPoints) : undefined,
            dueDate: formData.dueDate || undefined,
            updatedAt: new Date().toISOString(),
          }
        : f
    ));
    resetForm();
    setIsEditModalOpen(false);
  };

  const handleDragFeature = (featureId: string, newStatus: string) => {
    setFeatures(features.map(f =>
      f.id === featureId
        ? { ...f, status: newStatus as Feature['status'] }
        : f
    ));
  };

  const openEditModal = (feature: Feature) => {
    setSelectedFeature(feature);
    setFormData({
      title: feature.title,
      description: feature.description,
      type: feature.type || 'feature',
      status: feature.status,
      priority: feature.priority,
      storyPoints: feature.storyPoints?.toString() || '',
      dueDate: feature.dueDate || '',
    });
    setIsEditModalOpen(true);
  };

  const openDetailModal = (feature: Feature) => {
    setSelectedFeature(feature);
    // Navigate to modal path
    router.push(`/backlog/modal/${feature.id}`);
  };

  const openAddModal = () => {
    // Navigate to the create new feature page with the full UI
    router.push('/backlog/modal/new');
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'feature',
      status: 'backlog',
      priority: 'medium',
      storyPoints: '',
      dueDate: '',
    });
  };

  const toggleFeatureSelection = (featureId: string) => {
    setSelectedFeatures(prev =>
      prev.includes(featureId) ? prev.filter(id => id !== featureId) : [...prev, featureId]
    );
  };

  const toggleAllFeatures = () => {
    if (selectedFeatures.length === sortedFeatures.length) {
      setSelectedFeatures([]);
    } else {
      setSelectedFeatures(sortedFeatures.map(f => f.id));
    }
  };

  const hasActiveFilters = filterStatus.length > 0 || filterPriority.length > 0 ||
                           filterOwner.length > 0 || filterTags.length > 0 ||
                           filterDueDateRange[0] !== '' || filterDueDateRange[1] !== '' ||
                           filterEpic !== '' || filterEffortRange[0] > 0 || filterEffortRange[1] < 13;

  return (
    <AppLayout>
      <div className="flex flex-col h-screen bg-gray-50 overflow-x-hidden">
        {/* Toolbar - Fixed at Top */}
        <div className="bg-white border-b border-gray-200 flex-shrink-0 shadow-sm">
          <div className="px-6 py-4 flex flex-wrap gap-4 items-center justify-between">
            {/* View Mode Buttons */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              <Button
                variant={viewMode === 'list' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-md flex items-center gap-2"
              >
                <ListIcon size={16} />
                List
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-md flex items-center gap-2"
              >
                <GridIcon size={16} />
                Grid
              </Button>
              <Button
                variant={viewMode === 'kanban' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setViewMode('kanban')}
                className="rounded-md flex items-center gap-2"
              >
                <KanbanIcon size={16} />
                Kanban
              </Button>
            </div>

            {/* Controls */}
            <div className="flex gap-3 items-center">
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:border-gray-400 transition-colors"
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value as GroupBy)}
              >
                <option value="none">Group: None</option>
                <option value="status">Group: Status</option>
                <option value="priority">Group: Priority</option>
              </select>

              <select
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:border-gray-400 transition-colors"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
              >
                <option value="updated">Sort: Updated</option>
                <option value="priority">Sort: Priority</option>
                <option value="dueDate">Sort: Due Date</option>
                <option value="alphabetical">Sort: Alphabetical</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant={showFiltersSidebar ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setShowFiltersSidebar(!showFiltersSidebar)}
                className="flex items-center gap-2"
              >
                <SearchIcon size={16} />
                Filters
                {hasActiveFilters && (
                  <Badge variant="error" size="sm" className="ml-2">
                    {[...filterStatus, ...filterPriority, ...filterOwner, ...filterTags].length}
                  </Badge>
                )}
              </Button>

              {/* Prioritization Tools */}
              <div className="flex gap-2 border-l border-gray-300 pl-2">
                <Link href="/backlog/prioritize/wsjf">
                  <Button variant="secondary" size="sm" title="WSJF Prioritization">
                    WSJF
                  </Button>
                </Link>
                <Link href="/backlog/prioritize/rice">
                  <Button variant="secondary" size="sm" title="RICE Prioritization">
                    RICE
                  </Button>
                </Link>
                <Link href="/backlog/prioritize/moscow">
                  <Button variant="secondary" size="sm" title="MoSCoW Categorization">
                    MoSCoW
                  </Button>
                </Link>
                <Link href="/backlog/prioritize/matrix">
                  <Button variant="secondary" size="sm" title="Priority Matrix">
                    Matrix
                  </Button>
                </Link>
              </div>

              <Button variant="secondary" size="sm" title="Refresh" className="flex items-center gap-2">
                <RefreshIcon size={16} />
                Refresh
              </Button>
              <Button variant="secondary" size="sm" title="Export" className="flex items-center gap-2">
                <ExportIcon size={16} />
                Export
              </Button>
              <Button variant="primary" size="sm" onClick={openAddModal} className="flex items-center gap-2">
                <PlusIcon size={16} />
                New Feature
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Area - Scrollable Flex Container */}
        <div className="flex flex-1 overflow-hidden min-h-0 overflow-x-hidden">
          {/* Filters Sidebar */}
          <FiltersSidebar
            isOpen={showFiltersSidebar}
            onToggle={() => setShowFiltersSidebar(!showFiltersSidebar)}
            statusOptions={[
              { value: 'backlog', label: 'Backlog', count: features.filter(f => f.status === 'backlog').length },
              { value: 'planned', label: 'Planned', count: features.filter(f => f.status === 'planned').length },
              { value: 'in-progress', label: 'In Progress', count: features.filter(f => f.status === 'in-progress').length },
              { value: 'done', label: 'Done', count: features.filter(f => f.status === 'done').length },
              { value: 'archived', label: 'Archived', count: features.filter(f => f.status === 'archived').length },
            ]}
            selectedStatus={filterStatus}
            onStatusChange={setFilterStatus}
            priorityOptions={[
              { value: 'critical', label: 'Critical', count: features.filter(f => f.priority === 'critical').length },
              { value: 'high', label: 'High', count: features.filter(f => f.priority === 'high').length },
              { value: 'medium', label: 'Medium', count: features.filter(f => f.priority === 'medium').length },
              { value: 'low', label: 'Low', count: features.filter(f => f.priority === 'low').length },
            ]}
            selectedPriority={filterPriority}
            onPriorityChange={setFilterPriority}
            ownerOptions={allOwners.map(owner => ({
              value: owner,
              label: owner,
              count: features.filter(f => f.owner?.name === owner).length,
            }))}
            selectedOwner={filterOwner}
            onOwnerChange={setFilterOwner}
            tagOptions={allTags.map(tag => ({
              value: tag,
              label: tag,
              count: features.filter(f => f.tags.includes(tag)).length,
            }))}
            selectedTags={filterTags}
            onTagsChange={setFilterTags}
            effortRange={filterEffortRange}
            onEffortChange={setFilterEffortRange}
            dueDateRange={filterDueDateRange}
            onDueDateChange={setFilterDueDateRange}
            epicOptions={allEpics.map(epic => ({
              value: epic,
              label: epic,
            }))}
            selectedEpic={filterEpic}
            onEpicChange={setFilterEpic}
            onClearAll={clearAllFilters}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            {viewMode === 'list' && (
              <Card className="rounded-none border-0 h-full">
                <div className="overflow-x-auto h-full">
                  <table className="w-full h-full">
                    <thead className="sticky top-0 bg-gray-50 z-10">
                      <tr className="border-b border-gray-200">
                        <th className="py-3 px-4 text-left">
                          <input
                            type="checkbox"
                            checked={selectedFeatures.length === sortedFeatures.length && sortedFeatures.length > 0}
                            onChange={toggleAllFeatures}
                            className="rounded"
                          />
                        </th>
                        <th className="py-3 px-4 text-left font-semibold text-sm text-gray-700">ID</th>
                        <th className="py-3 px-4 text-left font-semibold text-sm text-gray-700">Title</th>
                        <th className="py-3 px-4 text-left font-semibold text-sm text-gray-700">Status</th>
                        <th className="py-3 px-4 text-left font-semibold text-sm text-gray-700">Priority</th>
                        <th className="py-3 px-4 text-left font-semibold text-sm text-gray-700">Owner</th>
                        <th className="py-3 px-4 text-left font-semibold text-sm text-gray-700">Tags</th>
                        <th className="py-3 px-4 text-left font-semibold text-sm text-gray-700">Points</th>
                        <th className="py-3 px-4 text-left font-semibold text-sm text-gray-700">Due Date</th>
                        <th className="py-3 px-4 text-left font-semibold text-sm text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedFeatures.length > 0 ? (
                        sortedFeatures.map((feature) => (
                          <tr key={feature.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={selectedFeatures.includes(feature.id)}
                                onChange={() => toggleFeatureSelection(feature.id)}
                                className="rounded"
                              />
                            </td>
                            <td className="py-3 px-4 text-sm font-medium text-gray-900">{feature.id}</td>
                            <td className="py-3 px-4 cursor-pointer" onClick={() => openDetailModal(feature)}>
                              <div className="text-sm font-medium text-gray-900">{feature.title}</div>
                              <div className="text-xs text-gray-500 truncate">{feature.description}</div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant={getStatusVariant(feature.status)} size="sm">
                                {feature.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant={getPriorityVariant(feature.priority)} size="sm">
                                {feature.priority}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {feature.owner ? `${feature.owner.avatar} ${feature.owner.name}` : 'Unassigned'}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-1 flex-wrap">
                                {feature.tags.map(tag => (
                                  <Badge key={tag} variant="default" size="sm">{tag}</Badge>
                                ))}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">{feature.storyPoints || '-'}</td>
                            <td className="py-3 px-4 text-sm text-gray-600">{feature.dueDate || '-'}</td>
                            <td className="py-3 px-4 text-sm" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => openEditModal(feature)}
                                className="text-gray-400 hover:text-gray-600"
                                title="More actions"
                              >
                                <MoreIcon size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={10} className="py-8 px-4 text-center text-gray-500">
                            No features found. Try adjusting your filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {viewMode === 'grid' && (
              <div className="p-6 overflow-auto h-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedFeatures.length > 0 ? (
                    sortedFeatures.map((feature) => (
                      <Card
                        key={feature.id}
                        className="hover:shadow-lg transition-all cursor-pointer border border-gray-200 hover:border-blue-300"
                        onClick={() => openDetailModal(feature)}
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide">{feature.id}</div>
                            <h3 className="font-semibold text-gray-900 line-clamp-2 mt-1">{feature.title}</h3>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(feature);
                            }}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            title="More actions"
                          >
                            <MoreIcon size={16} />
                          </button>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{feature.description}</p>

                        {/* Status & Priority Badges */}
                        <div className="flex gap-2 mb-4 flex-wrap">
                          <Badge variant={getStatusVariant(feature.status)} size="sm">
                            {feature.status}
                          </Badge>
                          <Badge variant={getPriorityVariant(feature.priority)} size="sm">
                            {feature.priority}
                          </Badge>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-100 my-3 pt-3"></div>

                        {/* Details Grid */}
                        <div className="space-y-2 text-sm mb-4">
                          {/* Owner */}
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Owner:</span>
                            <span className="text-gray-900 font-medium">
                              {feature.owner ? `${feature.owner.avatar} ${feature.owner.name}` : '—'}
                            </span>
                          </div>

                          {/* Story Points */}
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500">Story Points:</span>
                            <span className="text-gray-900 font-medium bg-blue-50 px-2 py-1 rounded text-xs">
                              {feature.storyPoints || '—'}
                            </span>
                          </div>

                          {/* Due Date */}
                          {feature.dueDate && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500">Due:</span>
                              <span className="text-gray-900 font-medium">{new Date(feature.dueDate).toLocaleDateString()}</span>
                            </div>
                          )}

                          {/* Sprint */}
                          {feature.sprint && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500">Sprint:</span>
                              <span className="text-gray-900 font-medium text-xs bg-purple-50 px-2 py-1 rounded">
                                {feature.sprint}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Team Members */}
                        {feature.team && feature.team.length > 0 && (
                          <div className="mb-4">
                            <div className="text-xs text-gray-500 mb-2">Team ({feature.team.length}):</div>
                            <div className="flex gap-2 flex-wrap">
                              {feature.team.slice(0, 3).map(member => (
                                <div key={member.id} title={member.name} className="text-lg">
                                  {member.avatar}
                                </div>
                              ))}
                              {feature.team.length > 3 && (
                                <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                  +{feature.team.length - 3}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Tags */}
                        {feature.tags.length > 0 && (
                          <div className="mb-3">
                            <div className="flex gap-1 flex-wrap">
                              {feature.tags.map(tag => (
                                <Badge key={tag} variant="default" size="sm">{tag}</Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Footer Stats */}
                        <div className="border-t border-gray-100 pt-3 mt-3 flex items-center justify-between text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <CalendarIcon size={14} />
                            {new Date(feature.createdAt).toLocaleDateString()}
                          </span>
                          {feature.team && feature.team.length > 0 && (
                            <span className="flex items-center gap-1">
                              <UsersIcon size={14} />
                              {feature.team.length}
                            </span>
                          )}
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full py-8 text-center text-gray-500">
                      No features found. Try adjusting your filters.
                    </div>
                  )}
                </div>
              </div>
            )}

            {viewMode === 'kanban' && (
              <KanbanBoard
                groupedFeatures={groupedFeatures}
                collapsedColumns={collapsedColumns}
                onToggleCollapse={toggleColumnCollapse}
                onDragStart={() => {}}
                onDragFeature={handleDragFeature}
                onEditFeature={openEditModal}
                onDetailFeature={openDetailModal}
                getPriorityVariant={getPriorityVariant}
              />
            )}
          </div>
        </div>
      </div>


      {/* Edit Feature Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          resetForm();
        }}
        title={selectedFeature ? `Edit ${selectedFeature.id}` : 'Edit Feature'}
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setIsEditModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleEditFeature}
            >
              Save Changes
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Basic Information</h4>
            <Input
              label="Title"
              placeholder="Feature title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              fullWidth
            />
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <RichTextEditor
                value={formData.description}
                onChange={(content) => setFormData({ ...formData, description: content })}
                placeholder="Write feature description..."
              />
            </div>
          </div>

          {/* Classification */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Classification</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-base focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  value={formData.type || 'feature'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Feature['type'] })}
                >
                  <option value="feature">Feature</option>
                  <option value="epic">Epic</option>
                  <option value="user-story">User Story</option>
                  <option value="task">Task</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-base focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Feature['status'] })}
                >
                  <option value="backlog">Backlog</option>
                  <option value="planned">Planned</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-base focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as Feature['priority'] })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Story Points</label>
                <Input
                  type="number"
                  placeholder="e.g., 5"
                  value={formData.storyPoints}
                  onChange={(e) => setFormData({ ...formData, storyPoints: e.target.value })}
                  fullWidth
                />
              </div>
            </div>
          </div>

          {/* Planning */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Planning</h4>
            <Input
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              fullWidth
            />
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}
