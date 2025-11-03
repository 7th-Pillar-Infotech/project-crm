import { configureStore } from '@reduxjs/toolkit';
import featuresReducer from './slices/featuresSlice';
import activitiesReducer from './slices/activitiesSlice';
import commentsReducer from './slices/commentsSlice';
import sprintsReducer from './slices/sprintsSlice';
import prioritizationReducer from './slices/prioritizationSlice';

export const store = configureStore({
  reducer: {
    features: featuresReducer,
    activities: activitiesReducer,
    comments: commentsReducer,
    sprints: sprintsReducer,
    prioritization: prioritizationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
