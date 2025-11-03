export type ReleaseStatus = 'planning' | 'in-progress' | 'complete' | 'archived';
export type ReleaseType = 'major' | 'minor' | 'patch' | 'hotfix';
export type RolloutStrategy = 'big-bang' | 'phased' | 'canary' | 'blue-green';
export type Environment = 'dev' | 'staging' | 'production';
export type HealthStatus = 'healthy' | 'at-risk' | 'critical';

export interface ReleaseMilestone {
  id: string;
  name: string;
  targetDate: string;
  criteria: string[];
  status: 'pending' | 'completed';
}

export interface ReleaseFeature {
  id: string;
  featureId: string;
  name: string;
  status: 'not-started' | 'in-development' | 'in-testing' | 'done';
  owner: string;
  storyPoints: number;
  completionPercent: number;
  dependencies: string[];
}

export interface ReadinessItem {
  id: string;
  category: 'development' | 'testing' | 'documentation' | 'operations';
  title: string;
  completed: boolean;
  owner: string;
  dueDate: string;
  notes: string;
}

export interface ReleaseRisk {
  id: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  mitigationPlan: string;
  owner: string;
  status: 'open' | 'mitigated';
}

export interface Release {
  id: string;
  name: string;
  version: string;
  type: ReleaseType;
  description: string;
  status: ReleaseStatus;
  targetDate: string;
  releaseDate?: string;
  progress: number; // 0-100
  healthScore: number; // 0-100
  releaseManager: string;
  teamMembers: string[];
  stakeholders: string[];
  features: ReleaseFeature[];
  milestones: ReleaseMilestone[];
  readinessItems: ReadinessItem[];
  risks: ReleaseRisk[];
  deploymentPlan: {
    environments: Environment[];
    rolloutStrategy: RolloutStrategy;
    rollbackPlan: string;
  };
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReleaseFilter {
  status?: ReleaseStatus[];
  team?: string[];
  quarter?: string[];
}
