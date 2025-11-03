import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WSJFScore, RICEScore, MoSCoWCategory } from '@/types';

export interface PrioritizationState {
  wsjfScores: Record<string, WSJFScore>;
  riceScores: Record<string, RICEScore>;
  moscowCategories: Record<string, MoSCoWCategory>;
  priorityMatrixScores: Record<string, { impact: number; effort: number }>;
}

const initialState: PrioritizationState = {
  wsjfScores: {},
  riceScores: {},
  moscowCategories: {},
  priorityMatrixScores: {},
};

const prioritizationSlice = createSlice({
  name: 'prioritization',
  initialState,
  reducers: {
    setWSJFScore: (
      state,
      action: PayloadAction<{ featureId: string; score: WSJFScore }>
    ) => {
      state.wsjfScores[action.payload.featureId] = action.payload.score;
    },
    updateWSJFScore: (
      state,
      action: PayloadAction<{
        featureId: string;
        field: keyof WSJFScore;
        value: number;
      }>
    ) => {
      const current = state.wsjfScores[action.payload.featureId] || {
        userBusinessValue: 0,
        timeCriticality: 0,
        riskReduction: 0,
        jobSize: 0,
      };
      current[action.payload.field] = action.payload.value;
      // Calculate WSJF score: (Value + Time Criticality + Risk Reduction) / Job Size
      const numerator =
        current.userBusinessValue +
        current.timeCriticality +
        current.riskReduction;
      current.score = current.jobSize > 0 ? numerator / current.jobSize : 0;
      state.wsjfScores[action.payload.featureId] = current;
    },
    setRICEScore: (
      state,
      action: PayloadAction<{ featureId: string; score: RICEScore }>
    ) => {
      state.riceScores[action.payload.featureId] = action.payload.score;
    },
    updateRICEScore: (
      state,
      action: PayloadAction<{
        featureId: string;
        field: keyof RICEScore;
        value: number;
      }>
    ) => {
      const current = state.riceScores[action.payload.featureId] || {
        reach: 0,
        impact: 1,
        confidence: 100,
        effort: 1,
      };
      current[action.payload.field] = action.payload.value;
      // Calculate RICE score: (Reach * Impact * Confidence) / Effort
      current.score =
        (current.reach * current.impact * (current.confidence / 100)) /
        current.effort;
      state.riceScores[action.payload.featureId] = current;
    },
    setMoSCoWCategory: (
      state,
      action: PayloadAction<{ featureId: string; category: MoSCoWCategory }>
    ) => {
      state.moscowCategories[action.payload.featureId] = action.payload.category;
    },
    setPriorityMatrixScore: (
      state,
      action: PayloadAction<{
        featureId: string;
        impact: number;
        effort: number;
      }>
    ) => {
      state.priorityMatrixScores[action.payload.featureId] = {
        impact: action.payload.impact,
        effort: action.payload.effort,
      };
    },
    setAllWSJFScores: (state, action: PayloadAction<Record<string, WSJFScore>>) => {
      state.wsjfScores = action.payload;
    },
    setAllRICEScores: (state, action: PayloadAction<Record<string, RICEScore>>) => {
      state.riceScores = action.payload;
    },
    setAllMoSCoWCategories: (
      state,
      action: PayloadAction<Record<string, MoSCoWCategory>>
    ) => {
      state.moscowCategories = action.payload;
    },
    setAllPriorityMatrixScores: (
      state,
      action: PayloadAction<Record<string, { impact: number; effort: number }>>
    ) => {
      state.priorityMatrixScores = action.payload;
    },
  },
});

export const {
  setWSJFScore,
  updateWSJFScore,
  setRICEScore,
  updateRICEScore,
  setMoSCoWCategory,
  setPriorityMatrixScore,
  setAllWSJFScores,
  setAllRICEScores,
  setAllMoSCoWCategories,
  setAllPriorityMatrixScores,
} = prioritizationSlice.actions;

export default prioritizationSlice.reducer;
