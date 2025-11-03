'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CreateSprintModal } from '@/components/sprint/CreateSprintModal';
import { PlusIcon, CalendarIcon, UsersIcon } from '@/components/icons';
import { Sprint } from '@/types/sprint';
import { mockUsers } from '@/data/mockData';

export default function SprintsPage() {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [sprints, setSprints] = useState<Sprint[]>([
    {
      id: 'SPRINT-001',
      name: 'Sprint 1',
      goal: 'Implement core authentication and user management features',
      type: 'regular',
      status: 'completed',
      startDate: '2024-10-01',
      endDate: '2024-10-15',
      teamMembers: ['user-1', 'user-2'],
      totalCapacity: 40,
      committedPoints: 35,
      completedPoints: 35,
      totalTasks: 8,
      completedTasks: 8,
      createdAt: '2024-09-25T10:00:00Z',
      updatedAt: '2024-10-15T18:00:00Z',
    },
    {
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
      totalTasks: 12,
      completedTasks: 6,
      createdAt: '2024-10-10T10:00:00Z',
      updatedAt: new Date().toISOString(),
    },
  ]);

  const [filterStatus, setFilterStatus] = useState<'all' | 'planning' | 'active' | 'completed'>('all');

  const filteredSprints = useMemo(() => {
    return sprints.filter(sprint =>
      filterStatus === 'all' || sprint.status === filterStatus
    );
  }, [sprints, filterStatus]);

  const handleCreateSprint = (sprintData: Omit<Sprint, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSprint: Sprint = {
      ...sprintData,
      id: `SPRINT-${String(sprints.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSprints([...sprints, newSprint]);
    setIsCreateModalOpen(false);
  };

  const getStatusBadgeVariant = (status: Sprint['status']) => {
    const variants = {
      planning: 'warning',
      active: 'success',
      completed: 'info',
      archived: 'default',
    };
    return variants[status] as any;
  };

  const getStatusColor = (status: Sprint['status']) => {
    const colors = {
      planning: 'bg-yellow-50 border-yellow-200',
      active: 'bg-green-50 border-green-200',
      completed: 'bg-blue-50 border-blue-200',
      archived: 'bg-gray-50 border-gray-200',
    };
    return colors[status];
  };

  const getProgressPercentage = (sprint: Sprint) => {
    if (sprint.committedPoints === 0) return 0;
    return Math.round((sprint.completedPoints / sprint.committedPoints) * 100);
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sprints</h1>
              <p className="text-sm text-gray-600 mt-1">Manage and track your sprints</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2"
            >
              <PlusIcon size={16} />
              Create Sprint
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
          <div className="flex gap-2">
            {(['all', 'planning', 'active', 'completed'] as const).map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setFilterStatus(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-6 py-6">
          {filteredSprints.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredSprints.map((sprint) => (
                <Card
                  key={sprint.id}
                  className={`cursor-pointer hover:shadow-lg transition-all border ${getStatusColor(
                    sprint.status
                  )}`}
                  onClick={() => router.push(`/sprints/${sprint.id}`)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{sprint.name}</h3>
                      <p className="text-xs font-semibold text-blue-600 mt-1 uppercase tracking-wide">
                        {sprint.id}
                      </p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(sprint.status)} size="sm">
                      {sprint.status}
                    </Badge>
                  </div>

                  {/* Goal */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{sprint.goal}</p>

                  {/* Divider */}
                  <div className="border-t border-gray-200 my-4"></div>

                  {/* Details */}
                  <div className="space-y-3 mb-4">
                    {/* Dates */}
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarIcon size={16} className="text-gray-500" />
                      <span className="text-gray-700">
                        {new Date(sprint.startDate).toLocaleDateString()} -{' '}
                        {new Date(sprint.endDate).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Team */}
                    <div className="flex items-center gap-2 text-sm">
                      <UsersIcon size={16} className="text-gray-500" />
                      <span className="text-gray-700">{sprint.teamMembers.length} members</span>
                      <div className="flex gap-1 ml-auto">
                        {sprint.teamMembers.slice(0, 3).map((memberId) => {
                          const user = mockUsers.find(u => u.id === memberId);
                          return (
                            <div
                              key={memberId}
                              className="text-lg"
                              title={user?.name}
                            >
                              {user?.avatar}
                            </div>
                          );
                        })}
                        {sprint.teamMembers.length > 3 && (
                          <span className="text-xs text-gray-600">
                            +{sprint.teamMembers.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {sprint.completedPoints}/{sprint.committedPoints} pts
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${getProgressPercentage(sprint)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 bg-gray-100 rounded">
                      <p className="text-gray-600">Velocity</p>
                      <p className="font-semibold text-gray-900 mt-1">
                        {sprint.completedPoints}
                      </p>
                    </div>
                    <div className="p-2 bg-gray-100 rounded">
                      <p className="text-gray-600">Capacity</p>
                      <p className="font-semibold text-gray-900 mt-1">
                        {sprint.totalCapacity}
                      </p>
                    </div>
                    <div className="p-2 bg-gray-100 rounded">
                      <p className="text-gray-600">Type</p>
                      <p className="font-semibold text-gray-900 mt-1 capitalize">
                        {sprint.type}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-lg font-semibold text-gray-900">No sprints found</h3>
              <p className="text-sm text-gray-600 mt-2">
                Create a new sprint to get started with sprint planning
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-4 flex items-center gap-2"
              >
                <PlusIcon size={16} />
                Create Your First Sprint
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Create Sprint Modal */}
      <CreateSprintModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateSprint={handleCreateSprint}
      />
    </AppLayout>
  );
}
