import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Sprint } from '@/types';

export interface SprintsState {
  sprints: Sprint[];
  selectedSprintId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: SprintsState = {
  sprints: [],
  selectedSprintId: null,
  loading: false,
  error: null,
};

const sprintsSlice = createSlice({
  name: 'sprints',
  initialState,
  reducers: {
    setSprints: (state, action: PayloadAction<Sprint[]>) => {
      state.sprints = action.payload;
    },
    addSprint: (state, action: PayloadAction<Sprint>) => {
      state.sprints.push(action.payload);
    },
    updateSprint: (state, action: PayloadAction<Sprint>) => {
      const index = state.sprints.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.sprints[index] = action.payload;
      }
    },
    deleteSprint: (state, action: PayloadAction<string>) => {
      state.sprints = state.sprints.filter(s => s.id !== action.payload);
      if (state.selectedSprintId === action.payload) {
        state.selectedSprintId = null;
      }
    },
    selectSprint: (state, action: PayloadAction<string>) => {
      state.selectedSprintId = action.payload;
    },
    addFeatureToSprint: (state, action: PayloadAction<{ sprintId: string; featureId: string }>) => {
      const sprint = state.sprints.find(s => s.id === action.payload.sprintId);
      if (sprint) {
        if (!sprint.features) {
          sprint.features = [];
        }
        if (!sprint.features.some(f => f.id === action.payload.featureId)) {
          // This would normally be populated with actual feature data
          sprint.features.push({ id: action.payload.featureId } as any);
        }
      }
    },
    removeFeatureFromSprint: (state, action: PayloadAction<{ sprintId: string; featureId: string }>) => {
      const sprint = state.sprints.find(s => s.id === action.payload.sprintId);
      if (sprint && sprint.features) {
        sprint.features = sprint.features.filter(f => f.id !== action.payload.featureId);
      }
    },
    updateSprintStatus: (state, action: PayloadAction<{ sprintId: string; status: Sprint['status'] }>) => {
      const sprint = state.sprints.find(s => s.id === action.payload.sprintId);
      if (sprint) {
        sprint.status = action.payload.status;
      }
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
  setSprints,
  addSprint,
  updateSprint,
  deleteSprint,
  selectSprint,
  addFeatureToSprint,
  removeFeatureFromSprint,
  updateSprintStatus,
  setLoading,
  setError,
} = sprintsSlice.actions;

export default sprintsSlice.reducer;
