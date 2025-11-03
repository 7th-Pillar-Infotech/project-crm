// Goals and OKR Types
export type GoalType = 'okr' | 'kpi' | 'milestone';
export type GoalStatus = 'on-track' | 'at-risk' | 'off-track';
export type MeasurementType = 'number' | 'percentage' | 'currency' | 'boolean';
export type UpdateFrequency = 'daily' | 'weekly' | 'bi-weekly' | 'monthly';
export type Visibility = 'public' | 'team' | 'private';
export type Priority = 'critical' | 'high' | 'medium' | 'low';

export interface KeyResult {
  id: string;
  title: string;
  description?: string;
  measurementType: MeasurementType;
  startValue: number;
  targetValue: number;
  currentValue: number;
  owner?: string; // User ID
  weight: number; // 0-100, sum of all KRs should equal 100
  confidenceLevel: number; // 0-100
  status: GoalStatus;
  lastUpdated: string;
  progressHistory: ProgressUpdate[];
}

export interface ProgressUpdate {
  id: string;
  value: number;
  notes?: string;
  confidenceLevel?: number;
  timestamp: string;
  updatedBy: string; // User ID
}

export interface Goal {
  id: string;
  type: GoalType;
  title: string;
  description?: string;
  objective?: string;
  owner: string; // User ID
  contributors: string[]; // User IDs
  status: GoalStatus;
  progress: number; // 0-100

  // OKR specific
  keyResults?: KeyResult[];

  // Timeline
  startDate: string;
  targetDate: string;
  timePeriod?: string; // Q1 2025, Annual 2025, etc.

  // Organization
  organization: 'company' | 'department' | 'team';
  department?: string;
  team?: string;

  // Hierarchy
  parentGoalId?: string;
  childGoalIds: string[];

  // Tracking
  updateFrequency: UpdateFrequency;
  autoCalculateFromKPIs: boolean;
  dataSource?: 'analytics' | 'database' | 'manual';

  // Relations
  linkedFeatureIds: string[];
  linkedSprintIds: string[];
  linkedInitiativeIds: string[];

  // Metadata
  tags: string[];
  priority: Priority;
  visibility: Visibility;

  // Lifecycle
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;

  // Updates/Check-ins
  updates: ProgressUpdate[];
  comments: GoalComment[];
}

export interface GoalComment {
  id: string;
  authorId: string; // User ID
  content: string;
  mentions?: string[]; // User IDs
  createdAt: string;
  updatedAt?: string;
  replies?: GoalComment[];
}

export interface GoalCheckIn {
  id: string;
  goalId: string;
  authorId: string;
  timestamp: string;
  progressSnapshot: {
    currentProgress: number;
    keyResultsProgress: { [keyId: string]: number };
  };
  commentary?: string;
  confidenceChange?: number;
  reactions?: { [emoji: string]: string[] }; // emoji -> user IDs
}

export interface GoalFilter {
  status?: GoalStatus[];
  owners?: string[];
  type?: GoalType[];
  timePeriod?: string[];
  priority?: Priority[];
  visibility?: Visibility[];
}

export interface GoalSort {
  field: 'progress' | 'dueDate' | 'priority' | 'created';
  order: 'asc' | 'desc';
}
