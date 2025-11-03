'use client';

import React, { useState } from 'react';
import { Feature } from '@/types';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface OverviewTabProps {
  feature: Feature;
  onUpdate: (feature: Feature) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ feature, onUpdate }) => {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionValue, setDescriptionValue] = useState(feature.description);

  const handleSaveDescription = () => {
    onUpdate({ ...feature, description: descriptionValue });
    setIsEditingDescription(false);
  };

  const handleCriterionToggle = (criterionId: string) => {
    const updatedCriteria = feature.acceptanceCriteria?.map(c =>
      c.id === criterionId ? { ...c, completed: !c.completed } : c
    );
    onUpdate({ ...feature, acceptanceCriteria: updatedCriteria });
  };

  const completedCount = feature.acceptanceCriteria?.filter(c => c.completed).length || 0;
  const totalCount = feature.acceptanceCriteria?.length || 0;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Description Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Description</h3>
          {!isEditingDescription && (
            <Button variant="secondary" size="sm" onClick={() => setIsEditingDescription(true)}>
              Edit
            </Button>
          )}
        </div>
        {isEditingDescription ? (
          <div className="space-y-4">
            <RichTextEditor
              value={descriptionValue}
              onChange={setDescriptionValue}
              placeholder="Write feature description..."
            />
            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={handleSaveDescription}>
                Save
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setDescriptionValue(feature.description);
                  setIsEditingDescription(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
            {feature.description}
          </div>
        )}
      </div>

      {/* Details Panel */}
      <Card className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <Badge variant="info">{feature.type || 'feature'}</Badge>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {feature.tags && feature.tags.length > 0 ? (
                feature.tags.map((tag) => (
                  <Badge key={tag} variant="info" className="text-xs">
                    {tag}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-gray-500">No tags</span>
              )}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
            <div className="text-sm text-gray-700">
              {feature.dueDate ? new Date(feature.dueDate).toLocaleDateString() : 'No due date'}
            </div>
          </div>

          {/* Team Members */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Team Members</label>
            <div className="flex items-center gap-2">
              {feature.team && feature.team.length > 0 ? (
                feature.team.map((member) => (
                  <div
                    key={member.id}
                    title={member.name}
                    className="text-xl"
                  >
                    {member.avatar || '👤'}
                  </div>
                ))
              ) : (
                <span className="text-sm text-gray-500">No team members</span>
              )}
            </div>
          </div>

          {/* Epic */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Parent Epic</label>
            <div className="text-sm text-gray-700">
              {feature.epic ? (
                <a href={`#${feature.epic}`} className="text-blue-600 hover:underline">
                  {feature.epic}
                </a>
              ) : (
                'None'
              )}
            </div>
          </div>

          {/* Sprint */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sprint</label>
            <div className="text-sm text-gray-700">
              {feature.sprint ? (
                <a href={`#${feature.sprint}`} className="text-blue-600 hover:underline">
                  {feature.sprint}
                </a>
              ) : (
                'Unscheduled'
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Acceptance Criteria Section */}
      {feature.acceptanceCriteria && feature.acceptanceCriteria.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Acceptance Criteria</h3>
            <div className="text-sm text-gray-600">
              {completedCount} of {totalCount} completed
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-green-500 h-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          {/* Criteria List */}
          <div className="space-y-3">
            {feature.acceptanceCriteria.map((criterion) => (
              <label key={criterion.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={criterion.completed}
                  onChange={() => handleCriterionToggle(criterion.id)}
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <div className="flex-1">
                  <div className={criterion.completed ? 'line-through text-gray-500' : 'text-gray-700'}>
                    {criterion.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Attachments Section */}
      {feature.attachments && feature.attachments.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {feature.attachments.map((attachment) => (
              <Card key={attachment.id} className="p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="text-2xl">{attachment.type === 'image' ? '🖼️' : '📄'}</div>
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Download
                  </a>
                </div>
                <div className="text-sm font-medium text-gray-900 truncate">{attachment.name}</div>
                <div className="text-xs text-gray-500">
                  by {attachment.uploadedBy.name} on{' '}
                  {new Date(attachment.uploadedAt).toLocaleDateString()}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
