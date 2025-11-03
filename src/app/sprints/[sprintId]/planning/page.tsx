'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  BackIcon,
  SearchIcon,
  CheckCircleIcon,
} from '@/components/icons';
import { Avatar } from '@/components/Avatar';
import { mockUsers } from '@/data/mockData';
import { Sprint, SprintCard as SprintCardType } from '@/types/sprint';

// Mock data
const MOCK_SPRINTS: Record<string, Sprint> = {
  'SPRINT-002': {
    id: 'SPRINT-002',
    name: 'Sprint 2',
    goal: 'Build backlog management system with filters and sorting',
    type: 'regular',
    status: 'active',
    startDate: '2024-10-16',
    endDate: '2024-10-30',
    teamMembers: ['user-1', 'user-2', 'user-3'],
    totalCapacity: 60,
    committedPoints: 55,
    completedPoints: 28,
    createdAt: '2024-10-10T10:00:00Z',
    updatedAt: new Date().toISOString(),
    teamCapacity: {
      'user-1': 20,
      'user-2': 20,
      'user-3': 20,
    },
  },
};

// All available backlog items
const MOCK_BACKLOG_ITEMS: SprintCardType[] = [
  {
    id: 'CARD-001',
    featureId: 'FEAT-001',
    title: 'User Authentication System',
    description: 'Implement JWT-based authentication with refresh tokens',
    storyPoints: 8,
    priority: 'high',
    assignee: 'user-1',
    tags: ['auth', 'backend'],
    comments: [],
    attachments: [],
    status: 'planning',
  },
  {
    id: 'CARD-002',
    featureId: 'FEAT-002',
    title: 'Backlog List View',
    description: 'Create table view for backlog with sorting and filtering',
    storyPoints: 5,
    priority: 'high',
    assignee: 'user-2',
    tags: ['ui', 'frontend'],
    comments: [],
    attachments: [],
    status: 'in-progress',
  },
  {
    id: 'CARD-003',
    featureId: 'FEAT-003',
    title: 'Filter Sidebar',
    description: 'Implement advanced filtering options for backlog items',
    storyPoints: 3,
    priority: 'medium',
    assignee: 'user-3',
    tags: ['ui', 'frontend'],
    comments: [],
    attachments: [],
    status: 'planning',
  },
  {
    id: 'CARD-004',
    featureId: 'FEAT-004',
    title: 'Modal Implementation',
    description: 'Create reusable modal component with animations',
    storyPoints: 4,
    priority: 'medium',
    assignee: 'user-1',
    tags: ['components', 'ui'],
    comments: [],
    attachments: [],
    status: 'planning',
  },
  {
    id: 'CARD-005',
    featureId: 'FEAT-005',
    title: 'Sprint Planning UI',
    description: 'Build drag-drop interface for sprint planning',
    storyPoints: 6,
    priority: 'high',
    assignee: 'user-2',
    tags: ['ui', 'frontend'],
    comments: [],
    attachments: [],
    status: 'planning',
  },
  {
    id: 'CARD-006',
    featureId: 'FEAT-006',
    title: 'API Error Handling',
    description: 'Implement centralized error handling for API calls',
    storyPoints: 5,
    priority: 'high',
    assignee: undefined,
    tags: ['backend', 'api'],
    comments: [],
    attachments: [],
    status: 'planning',
  },
  {
    id: 'CARD-007',
    featureId: 'FEAT-007',
    title: 'Database Optimization',
    description: 'Optimize database queries and add proper indexing',
    storyPoints: 8,
    priority: 'medium',
    assignee: undefined,
    tags: ['backend', 'database'],
    comments: [],
    attachments: [],
    status: 'planning',
  },
  {
    id: 'CARD-008',
    featureId: 'FEAT-008',
    title: 'Unit Tests',
    description: 'Write unit tests for core components',
    storyPoints: 5,
    priority: 'low',
    assignee: 'user-3',
    tags: ['testing', 'qa'],
    comments: [],
    attachments: [],
    status: 'planning',
  },
];

const MOCK_SPRINT_CARDS: Record<string, SprintCardType[]> = {
  'SPRINT-002': [
    MOCK_BACKLOG_ITEMS[0],
    MOCK_BACKLOG_ITEMS[1],
    MOCK_BACKLOG_ITEMS[4],
  ],
};

export default function SprintPlanningPage() {
  const params = useParams();
  const router = useRouter();
  const sprintId = params.sprintId as string;

  const sprint = MOCK_SPRINTS[sprintId];
  const [sprintCards, setSprintCards] = useState<SprintCardType[]>(
    MOCK_SPRINT_CARDS[sprintId] || []
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  // Get available backlog items (not in sprint)
  const sprintCardIds = sprintCards.map(c => c.id);
  const availableBacklogItems = MOCK_BACKLOG_ITEMS.filter(
    item => !sprintCardIds.includes(item.id)
  );

  // Filter backlog based on search
  const filteredBacklog = useMemo(() => {
    return availableBacklogItems.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.featureId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [availableBacklogItems, searchQuery]);

  if (!sprint) {
    return (
      <AppLayout>
        <div className="flex flex-col h-screen bg-gray-50 items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
            <p className="text-lg text-gray-600 mb-4">Sprint not found</p>
            <Button variant="primary" onClick={() => router.push('/sprints')}>
              Back to Sprints
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Calculate capacity
  const usedCapacity = sprintCards.reduce((sum, card) => sum + card.storyPoints, 0);
  const remainingCapacity = sprint.totalCapacity - usedCapacity;
  const capacityPercentage = (usedCapacity / sprint.totalCapacity) * 100;

  // Team capacity breakdown
  const teamCapacityBreakdown = sprint.teamCapacity || {};

  const handleDragStart = (itemId: string) => {
    setDraggedItem(itemId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropToSprint = () => {
    if (!draggedItem) return;

    const item = MOCK_BACKLOG_ITEMS.find(i => i.id === draggedItem);
    if (item) {
      setSprintCards([...sprintCards, item]);
      setDraggedItem(null);
    }
  };

  const handleRemoveFromSprint = (cardId: string) => {
    setSprintCards(sprintCards.filter(card => card.id !== cardId));
  };

  const getPriorityVariant = (priority: SprintCardType['priority']) => {
    const variants = {
      critical: 'error',
      high: 'warning',
      medium: 'info',
      low: 'default',
    };
    return variants[priority] as any;
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/sprints/${sprintId}`)}
              className="flex items-center gap-2"
            >
              <BackIcon size={18} />
              Back to Sprint
            </Button>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">{sprint.name} - Planning</h1>
            <p className="text-sm text-gray-600 mt-2">{sprint.goal}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex gap-6 p-6">
          {/* Left Panel: Backlog */}
          <div className="flex-1 flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            {/* Backlog Header */}
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Available Backlog</h2>
              <div className="relative">
                <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  fullWidth
                />
              </div>
            </div>

            {/* Backlog Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredBacklog.length > 0 ? (
                filteredBacklog.map(item => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => handleDragStart(item.id)}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-grab hover:shadow-md hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 active:cursor-grabbing"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                          {item.featureId}
                        </div>
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                          {item.title}
                        </h4>
                      </div>
                      <div className="font-bold text-amber-600 text-sm flex-shrink-0">
                        {item.storyPoints} pts
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={getPriorityVariant(item.priority)} size="sm" className="text-xs capitalize">
                        {item.priority}
                      </Badge>
                      {item.assignee && (
                        <Avatar name={mockUsers.find(u => u.id === item.assignee)?.name || ''} size="sm" />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-center text-gray-500">
                  <div>
                    <p className="text-sm font-medium">No items found</p>
                    {availableBacklogItems.length === 0 && (
                      <p className="text-xs text-gray-400 mt-1">All items are in the sprint</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Backlog Summary */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
              <p className="text-sm text-gray-600">
                {filteredBacklog.length} item{filteredBacklog.length !== 1 ? 's' : ''} available
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Total: {availableBacklogItems.reduce((sum, item) => sum + item.storyPoints, 0)} pts
              </p>
            </div>
          </div>

          {/* Right Panel: Sprint */}
          <div className="w-96 flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            {/* Sprint Info */}
            <div className="p-4 border-b border-gray-200 space-y-4 flex-shrink-0">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Sprint Capacity</h3>
              </div>

              {/* Capacity Gauge */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Used Capacity</span>
                  <span className="text-sm font-bold text-gray-900">
                    {usedCapacity}/{sprint.totalCapacity} pts
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      remainingCapacity < 0
                        ? 'bg-red-500'
                        : remainingCapacity < 5
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                  />
                </div>
                <p className={`text-xs font-medium mt-2 ${
                  remainingCapacity < 0
                    ? 'text-red-600'
                    : 'text-gray-600'
                }`}>
                  {remainingCapacity < 0
                    ? `Over capacity by ${Math.abs(remainingCapacity)} pts`
                    : `${remainingCapacity} pts remaining`}
                </p>
              </div>

              {/* Team Capacity */}
              <div className="pt-3 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Team Capacity</h4>
                <div className="space-y-2">
                  {Object.entries(teamCapacityBreakdown).map(([userId, capacity]) => {
                    const user = mockUsers.find(u => u.id === userId);
                    return (
                      <div key={userId} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar name={user?.name || 'Unknown'} size="sm" />
                          <span className="text-sm text-gray-700">{user?.name || 'Unknown'}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{capacity} pts</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sprint Items Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDropToSprint}
              className={`flex-1 overflow-y-auto p-4 space-y-2 transition-colors duration-300 ${
                draggedItem ? 'bg-blue-50 border-2 border-dashed border-blue-300' : 'bg-gray-50'
              }`}
            >
              {sprintCards.length > 0 ? (
                sprintCards.map(card => (
                  <div
                    key={card.id}
                    className="p-3 bg-white rounded-lg border border-green-200 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-green-600 uppercase tracking-wider">
                          {card.featureId}
                        </div>
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                          {card.title}
                        </h4>
                      </div>
                      <button
                        onClick={() => handleRemoveFromSprint(card.id)}
                        className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove from sprint"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <Badge variant={getPriorityVariant(card.priority)} size="sm" className="text-xs capitalize">
                        {card.priority}
                      </Badge>
                      <span className="font-bold text-amber-600 text-sm">
                        {card.storyPoints} pts
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-center text-gray-400">
                  <div>
                    <p className="text-sm font-medium">Drag items here</p>
                    <p className="text-xs text-gray-400 mt-1">to add them to the sprint</p>
                  </div>
                </div>
              )}
            </div>

            {/* Sprint Footer */}
            <div className="p-4 border-t border-gray-200 bg-white space-y-3 flex-shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Total Items</span>
                <span className="text-sm font-bold text-gray-900">{sprintCards.length}</span>
              </div>

              <Button variant="primary" fullWidth className="flex items-center justify-center gap-2">
                <CheckCircleIcon size={16} />
                Commit Sprint
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
