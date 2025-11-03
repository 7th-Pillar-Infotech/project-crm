import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FeatureActivity } from '@/types';

export interface ActivitiesState {
  activities: Record<string, FeatureActivity[]>; // featureId -> activities
  loading: boolean;
  error: string | null;
}

const initialState: ActivitiesState = {
  activities: {},
  loading: false,
  error: null,
};

const activitiesSlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    setFeatureActivities: (state, action: PayloadAction<{ featureId: string; activities: FeatureActivity[] }>) => {
      state.activities[action.payload.featureId] = action.payload.activities;
    },
    addActivity: (state, action: PayloadAction<FeatureActivity>) => {
      const featureId = action.payload.id.split('-')[0];
      if (!state.activities[featureId]) {
        state.activities[featureId] = [];
      }
      state.activities[featureId].unshift(action.payload); // Add to beginning for latest first
    },
    clearFeatureActivities: (state, action: PayloadAction<string>) => {
      delete state.activities[action.payload];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setFeatureActivities, addActivity, clearFeatureActivities, setLoading, setError } = activitiesSlice.actions;

export default activitiesSlice.reducer;
