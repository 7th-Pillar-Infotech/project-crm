'use client';

import React, { useState } from 'react';
import { Comment } from '@/types';
import { Button } from '@/components/ui/Button';
import { RichTextEditor } from '@/components/ui/RichTextEditor';

interface CommentsTabProps {
  comments: Comment[];
  featureId: string;
}

export const CommentsTab: React.FC<CommentsTabProps> = ({ comments }) => {
  const [newComment, setNewComment] = useState('');
  const [showResolvedFilter, setShowResolvedFilter] = useState(false);

  const visibleComments = showResolvedFilter
    ? comments.filter(c => !c.resolved)
    : comments;

  const handleAddComment = () => {
    if (newComment.trim()) {
      // This would be dispatched to Redux in real implementation
      console.log('Adding comment:', newComment);
      setNewComment('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Comments ({comments.length})</h3>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={showResolvedFilter}
            onChange={(e) => setShowResolvedFilter(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Hide resolved
        </label>
      </div>

      {/* New Comment Box */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-900 mb-2">Add a comment</p>
          <RichTextEditor
            value={newComment}
            onChange={setNewComment}
            placeholder="Share your thoughts... (use @ to mention someone)"
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setNewComment('')}
            disabled={!newComment.trim()}
          >
            Clear
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddComment}
            disabled={!newComment.trim()}
          >
            Comment
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {visibleComments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">💬</div>
            <p className="text-gray-600">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          visibleComments.map((comment) => (
            <div
              key={comment.id}
              className={`border rounded-lg p-4 transition-colors ${
                comment.resolved ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Comment Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{comment.author.avatar || '👤'}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{comment.author.name}</p>
                    <p className="text-xs text-gray-600">
                      {new Date(comment.createdAt).toLocaleDateString()} at{' '}
                      {new Date(comment.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                {comment.resolved && (
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                    Resolved
                  </span>
                )}
              </div>

              {/* Comment Content */}
              <div className={comment.resolved ? 'text-gray-600 line-through' : 'text-gray-700'}>
                {comment.content}
              </div>

              {/* Comment Actions */}
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-200 text-sm">
                <button className="text-gray-600 hover:text-gray-900 transition-colors">
                  👍 Like
                </button>
                <button className="text-gray-600 hover:text-gray-900 transition-colors">
                  💬 Reply
                </button>
                {!comment.resolved && (
                  <button className="text-gray-600 hover:text-gray-900 transition-colors">
                    ✓ Resolve
                  </button>
                )}
              </div>

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 space-y-3 pl-6 border-l-2 border-gray-200">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{reply.author.avatar || '👤'}</span>
                        <p className="font-medium text-gray-900">{reply.author.name}</p>
                        <p className="text-xs text-gray-600">
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-gray-700 ml-9">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
