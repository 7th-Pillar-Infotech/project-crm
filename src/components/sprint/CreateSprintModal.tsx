'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/Avatar';
import { mockUsers } from '@/data/mockData';
import { Sprint, SprintType } from '@/types/sprint';

interface CreateSprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSprint: (sprint: Omit<Sprint, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const DURATION_PRESETS = [
  { label: '1 Week', days: 7 },
  { label: '2 Weeks', days: 14 },
  { label: '3 Weeks', days: 21 },
];

const WORKING_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const CreateSprintModal: React.FC<CreateSprintModalProps> = ({
  isOpen,
  onClose,
  onCreateSprint,
}) => {
  const [currentStep, setCurrentStep] = useState<'basic' | 'schedule' | 'team'>('basic');
  const [formData, setFormData] = useState({
    name: '',
    goal: '',
    type: 'regular' as SprintType,
    startDate: '',
    endDate: '',
    teamMembers: [] as string[],
    workingDays: WORKING_DAYS,
    holidays: [] as string[],
  });

  const [teamCapacity, setTeamCapacity] = useState<Record<string, number>>({});

  const calculateDuration = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleDurationPreset = (days: number) => {
    if (!formData.startDate) return;
    const start = new Date(formData.startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + days);
    setFormData(prev => ({
      ...prev,
      endDate: end.toISOString().split('T')[0],
    }));
  };

  const handleAddTeamMember = (userId: string) => {
    if (formData.teamMembers.includes(userId)) return;
    setFormData(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, userId],
    }));
    // Default capacity of 5 points per team member
    setTeamCapacity(prev => ({
      ...prev,
      [userId]: 5,
    }));
  };

  const handleRemoveTeamMember = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter(id => id !== userId),
    }));
    setTeamCapacity(prev => {
      const newCapacity = { ...prev };
      delete newCapacity[userId];
      return newCapacity;
    });
  };

  const handleToggleWorkingDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter(d => d !== day)
        : [...prev.workingDays, day],
    }));
  };

  const totalCapacity = Object.values(teamCapacity).reduce((sum, cap) => sum + cap, 0);

  const handleCreateSprint = () => {
    if (!formData.name || !formData.goal || !formData.startDate || !formData.endDate) {
      alert('Please fill in all required fields');
      return;
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      alert('End date must be after start date');
      return;
    }

    if (formData.teamMembers.length === 0) {
      alert('Please select at least one team member');
      return;
    }

    onCreateSprint({
      name: formData.name,
      goal: formData.goal,
      type: formData.type,
      status: 'planning',
      startDate: formData.startDate,
      endDate: formData.endDate,
      teamMembers: formData.teamMembers,
      totalCapacity,
      committedPoints: 0,
      completedPoints: 0,
      teamCapacity,
      workingDays: formData.workingDays,
      holidays: formData.holidays,
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Sprint" size="lg">
      <div className="space-y-6">
        {/* Step Indicator */}
        <div className="flex gap-4">
          {(['basic', 'schedule', 'team'] as const).map((step, idx) => (
            <div key={step} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                  currentStep === step
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {idx + 1}
              </div>
              <span className="text-sm font-medium text-gray-700 capitalize">{step}</span>
            </div>
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {currentStep === 'basic' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sprint Name *
              </label>
              <Input
                placeholder="e.g., Sprint 1, Q4 Sprint A"
                value={formData.name}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, name: e.target.value }))
                }
                fullWidth
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sprint Goal * (200 chars max)
              </label>
              <textarea
                placeholder="What do you want to achieve in this sprint?"
                value={formData.goal}
                onChange={(e) =>
                  setFormData(prev => ({
                    ...prev,
                    goal: e.target.value.slice(0, 200),
                  }))
                }
                maxLength={200}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.goal.length}/200 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sprint Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData(prev => ({
                    ...prev,
                    type: e.target.value as SprintType,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="regular">Regular Sprint</option>
                <option value="hardening">Hardening Sprint</option>
                <option value="innovation">Innovation Sprint</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 2: Schedule */}
        {currentStep === 'schedule' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  fullWidth
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  fullWidth
                />
              </div>
            </div>

            {calculateDuration() > 0 && (
              <p className="text-sm text-gray-600">
                Duration: <strong>{calculateDuration()} days</strong>
              </p>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration Preset
              </label>
              <div className="flex gap-2">
                {DURATION_PRESETS.map((preset) => (
                  <Button
                    key={preset.days}
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDurationPreset(preset.days)}
                    disabled={!formData.startDate}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Working Days
              </label>
              <div className="grid grid-cols-5 gap-2">
                {WORKING_DAYS.map((day) => (
                  <label key={day} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.workingDays.includes(day)}
                      onChange={() => handleToggleWorkingDay(day)}
                      className="rounded cursor-pointer"
                    />
                    <span className="text-sm text-gray-700">{day.slice(0, 3)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Holidays/Exceptions
              </label>
              <p className="text-xs text-gray-500">Add holiday dates separated by commas</p>
              <Input
                placeholder="2024-12-25, 2024-01-01"
                value={formData.holidays.join(', ')}
                onChange={(e) =>
                  setFormData(prev => ({
                    ...prev,
                    holidays: e.target.value
                      .split(',')
                      .map(d => d.trim())
                      .filter(d => d),
                  }))
                }
                fullWidth
              />
            </div>
          </div>
        )}

        {/* Step 3: Team */}
        {currentStep === 'team' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team Members *
              </label>
              <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
                {mockUsers.length > 0 ? (
                  <div className="space-y-2">
                    {mockUsers.map((user) => (
                      <div
                        key={user.id}
                        className={`flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer ${
                          formData.teamMembers.includes(user.id)
                            ? 'bg-blue-50 border border-blue-200'
                            : ''
                        }`}
                        onClick={() =>
                          formData.teamMembers.includes(user.id)
                            ? handleRemoveTeamMember(user.id)
                            : handleAddTeamMember(user.id)
                        }
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <Avatar name={user.name} size="sm" />
                          <span className="text-sm font-medium text-gray-700">
                            {user.name}
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={formData.teamMembers.includes(user.id)}
                          onChange={() => {}}
                          className="rounded cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No users available</p>
                )}
              </div>
            </div>

            {formData.teamMembers.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Capacity (Story Points)
                </label>
                <div className="space-y-2 border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
                  {formData.teamMembers.map((userId) => {
                    const user = mockUsers.find(u => u.id === userId);
                    return (
                      <div key={userId} className="flex items-center gap-3">
                        <Avatar name={user?.name || 'Unknown'} size="sm" />
                        <span className="text-sm text-gray-700 flex-1">{user?.name}</span>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={teamCapacity[userId] || 0}
                          onChange={(e) =>
                            setTeamCapacity(prev => ({
                              ...prev,
                              [userId]: parseInt(e.target.value) || 0,
                            }))
                          }
                          className="w-20"
                        />
                        <span className="text-xs text-gray-500">pts</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-semibold text-blue-900">
                    Total Available Capacity: <span className="text-lg">{totalCapacity}</span> points
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={() => {
              if (currentStep === 'basic') {
                onClose();
              } else if (currentStep === 'schedule') {
                setCurrentStep('basic');
              } else {
                setCurrentStep('schedule');
              }
            }}
          >
            {currentStep === 'basic' ? 'Cancel' : 'Back'}
          </Button>

          <div className="flex gap-2">
            {currentStep !== 'team' && (
              <Button
                variant="primary"
                onClick={() => {
                  if (currentStep === 'basic') setCurrentStep('schedule');
                  else if (currentStep === 'schedule') setCurrentStep('team');
                }}
              >
                Next
              </Button>
            )}

            {currentStep === 'team' && (
              <>
                <Button variant="secondary" onClick={onClose}>
                  Save as Template
                </Button>
                <Button variant="primary" onClick={handleCreateSprint}>
                  Create Sprint
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
