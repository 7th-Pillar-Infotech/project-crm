import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Comment } from '@/types';

export interface CommentsState {
  comments: Record<string, Comment[]>; // featureId -> comments
  loading: boolean;
  error: string | null;
}

const initialState: CommentsState = {
  comments: {},
  loading: false,
  error: null,
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    setFeatureComments: (state, action: PayloadAction<{ featureId: string; comments: Comment[] }>) => {
      state.comments[action.payload.featureId] = action.payload.comments;
    },
    addComment: (state, action: PayloadAction<Comment>) => {
      const featureId = action.payload.id.split('-')[0];
      if (!state.comments[featureId]) {
        state.comments[featureId] = [];
      }
      state.comments[featureId].push(action.payload);
    },
    updateComment: (state, action: PayloadAction<Comment>) => {
      for (const featureId in state.comments) {
        const index = state.comments[featureId].findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.comments[featureId][index] = action.payload;
          break;
        }
      }
    },
    deleteComment: (state, action: PayloadAction<{ featureId: string; commentId: string }>) => {
      if (state.comments[action.payload.featureId]) {
        state.comments[action.payload.featureId] = state.comments[action.payload.featureId].filter(
          c => c.id !== action.payload.commentId
        );
      }
    },
    addReply: (state, action: PayloadAction<{ featureId: string; parentCommentId: string; reply: Comment }>) => {
      if (state.comments[action.payload.featureId]) {
        const parentComment = state.comments[action.payload.featureId].find(c => c.id === action.payload.parentCommentId);
        if (parentComment) {
          if (!parentComment.replies) {
            parentComment.replies = [];
          }
          parentComment.replies.push(action.payload.reply);
        }
      }
    },
    deleteReply: (state, action: PayloadAction<{ featureId: string; parentCommentId: string; replyId: string }>) => {
      if (state.comments[action.payload.featureId]) {
        const parentComment = state.comments[action.payload.featureId].find(c => c.id === action.payload.parentCommentId);
        if (parentComment && parentComment.replies) {
          parentComment.replies = parentComment.replies.filter(r => r.id !== action.payload.replyId);
        }
      }
    },
    toggleResolveComment: (state, action: PayloadAction<{ featureId: string; commentId: string }>) => {
      if (state.comments[action.payload.featureId]) {
        const comment = state.comments[action.payload.featureId].find(c => c.id === action.payload.commentId);
        if (comment) {
          comment.resolved = !comment.resolved;
        }
      }
    },
    addReaction: (state, action: PayloadAction<{ featureId: string; commentId: string; emoji: string; userId: string }>) => {
      if (state.comments[action.payload.featureId]) {
        const comment = state.comments[action.payload.featureId].find(c => c.id === action.payload.commentId);
        if (comment) {
          if (!comment.reactions) {
            comment.reactions = {};
          }
          if (!comment.reactions[action.payload.emoji]) {
            comment.reactions[action.payload.emoji] = [];
          }
          if (!comment.reactions[action.payload.emoji].includes(action.payload.userId)) {
            comment.reactions[action.payload.emoji].push(action.payload.userId);
          }
        }
      }
    },
    clearFeatureComments: (state, action: PayloadAction<string>) => {
      delete state.comments[action.payload];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setFeatureComments,
  addComment,
  updateComment,
  deleteComment,
  addReply,
  deleteReply,
  toggleResolveComment,
  addReaction,
  clearFeatureComments,
  setLoading,
  setError,
} = commentsSlice.actions;

export default commentsSlice.reducer;
