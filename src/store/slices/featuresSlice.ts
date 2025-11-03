import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Feature, AcceptanceCriterion, Attachment } from '@/types';

export interface FeaturesState {
  features: Feature[];
  selectedFeatureId: string | null;
  selectedFeature: Feature | null;
  loading: boolean;
  error: string | null;
}

const initialState: FeaturesState = {
  features: [],
  selectedFeatureId: null,
  selectedFeature: null,
  loading: false,
  error: null,
};

const featuresSlice = createSlice({
  name: 'features',
  initialState,
  reducers: {
    setFeatures: (state, action: PayloadAction<Feature[]>) => {
      state.features = action.payload;
    },
    addFeature: (state, action: PayloadAction<Feature>) => {
      state.features.push(action.payload);
    },
    updateFeature: (state, action: PayloadAction<Feature>) => {
      const index = state.features.findIndex(f => f.id === action.payload.id);
      if (index !== -1) {
        state.features[index] = action.payload;
      }
      if (state.selectedFeature?.id === action.payload.id) {
        state.selectedFeature = action.payload;
      }
    },
    deleteFeature: (state, action: PayloadAction<string>) => {
      state.features = state.features.filter(f => f.id !== action.payload);
      if (state.selectedFeatureId === action.payload) {
        state.selectedFeatureId = null;
        state.selectedFeature = null;
      }
    },
    selectFeature: (state, action: PayloadAction<string>) => {
      state.selectedFeatureId = action.payload;
      state.selectedFeature = state.features.find(f => f.id === action.payload) || null;
    },
    setSelectedFeature: (state, action: PayloadAction<Feature | null>) => {
      state.selectedFeature = action.payload;
      state.selectedFeatureId = action.payload?.id || null;
    },
    updateFeatureStatus: (state, action: PayloadAction<{ featureId: string; status: Feature['status'] }>) => {
      const feature = state.features.find(f => f.id === action.payload.featureId);
      if (feature) {
        feature.status = action.payload.status;
        feature.updatedAt = new Date().toISOString();
      }
      if (state.selectedFeature?.id === action.payload.featureId) {
        state.selectedFeature.status = action.payload.status;
        state.selectedFeature.updatedAt = new Date().toISOString();
      }
    },
    updateFeaturePriority: (state, action: PayloadAction<{ featureId: string; priority: Feature['priority'] }>) => {
      const feature = state.features.find(f => f.id === action.payload.featureId);
      if (feature) {
        feature.priority = action.payload.priority;
        feature.updatedAt = new Date().toISOString();
      }
      if (state.selectedFeature?.id === action.payload.featureId) {
        state.selectedFeature.priority = action.payload.priority;
        state.selectedFeature.updatedAt = new Date().toISOString();
      }
    },
    updateFeatureTitle: (state, action: PayloadAction<{ featureId: string; title: string }>) => {
      const feature = state.features.find(f => f.id === action.payload.featureId);
      if (feature) {
        feature.title = action.payload.title;
        feature.updatedAt = new Date().toISOString();
      }
      if (state.selectedFeature?.id === action.payload.featureId) {
        state.selectedFeature.title = action.payload.title;
        state.selectedFeature.updatedAt = new Date().toISOString();
      }
    },
    updateFeatureDescription: (state, action: PayloadAction<{ featureId: string; description: string }>) => {
      const feature = state.features.find(f => f.id === action.payload.featureId);
      if (feature) {
        feature.description = action.payload.description;
        feature.updatedAt = new Date().toISOString();
      }
      if (state.selectedFeature?.id === action.payload.featureId) {
        state.selectedFeature.description = action.payload.description;
        state.selectedFeature.updatedAt = new Date().toISOString();
      }
    },
    updateFeatureOwner: (state, action: PayloadAction<{ featureId: string; owner: Feature['owner'] }>) => {
      const feature = state.features.find(f => f.id === action.payload.featureId);
      if (feature) {
        feature.owner = action.payload.owner;
        feature.updatedAt = new Date().toISOString();
      }
      if (state.selectedFeature?.id === action.payload.featureId) {
        state.selectedFeature.owner = action.payload.owner;
        state.selectedFeature.updatedAt = new Date().toISOString();
      }
    },
    updateFeatureTeam: (state, action: PayloadAction<{ featureId: string; team: Feature['team'] }>) => {
      const feature = state.features.find(f => f.id === action.payload.featureId);
      if (feature) {
        feature.team = action.payload.team;
        feature.updatedAt = new Date().toISOString();
      }
      if (state.selectedFeature?.id === action.payload.featureId) {
        state.selectedFeature.team = action.payload.team;
        state.selectedFeature.updatedAt = new Date().toISOString();
      }
    },
    updateAcceptanceCriteria: (state, action: PayloadAction<{ featureId: string; criteria: AcceptanceCriterion[] }>) => {
      const feature = state.features.find(f => f.id === action.payload.featureId);
      if (feature) {
        feature.acceptanceCriteria = action.payload.criteria;
        feature.updatedAt = new Date().toISOString();
      }
      if (state.selectedFeature?.id === action.payload.featureId) {
        state.selectedFeature.acceptanceCriteria = action.payload.criteria;
        state.selectedFeature.updatedAt = new Date().toISOString();
      }
    },
    addAttachment: (state, action: PayloadAction<{ featureId: string; attachment: Attachment }>) => {
      const feature = state.features.find(f => f.id === action.payload.featureId);
      if (feature) {
        if (!feature.attachments) feature.attachments = [];
        feature.attachments.push(action.payload.attachment);
        feature.updatedAt = new Date().toISOString();
      }
      if (state.selectedFeature?.id === action.payload.featureId) {
        if (!state.selectedFeature.attachments) state.selectedFeature.attachments = [];
        state.selectedFeature.attachments.push(action.payload.attachment);
        state.selectedFeature.updatedAt = new Date().toISOString();
      }
    },
    removeAttachment: (state, action: PayloadAction<{ featureId: string; attachmentId: string }>) => {
      const feature = state.features.find(f => f.id === action.payload.featureId);
      if (feature && feature.attachments) {
        feature.attachments = feature.attachments.filter(a => a.id !== action.payload.attachmentId);
        feature.updatedAt = new Date().toISOString();
      }
      if (state.selectedFeature?.id === action.payload.featureId && state.selectedFeature.attachments) {
        state.selectedFeature.attachments = state.selectedFeature.attachments.filter(a => a.id !== action.payload.attachmentId);
        state.selectedFeature.updatedAt = new Date().toISOString();
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
  setFeatures,
  addFeature,
  updateFeature,
  deleteFeature,
  selectFeature,
  setSelectedFeature,
  updateFeatureStatus,
  updateFeaturePriority,
  updateFeatureTitle,
  updateFeatureDescription,
  updateFeatureOwner,
  updateFeatureTeam,
  updateAcceptanceCriteria,
  addAttachment,
  removeAttachment,
  setLoading,
  setError,
} = featuresSlice.actions;

export default featuresSlice.reducer;
