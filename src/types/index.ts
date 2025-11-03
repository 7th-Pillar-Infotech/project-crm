/* Auth Types */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'user';
  workspace?: string;
}

/* Feature Types */
export interface Feature {
  id: string;
  title: string;
  description: string;
  status: 'backlog' | 'planned' | 'in-progress' | 'done' | 'archived';
  priority: 'critical' | 'high' | 'medium' | 'low';
  owner?: User;
  tags: string[];
  storyPoints?: number;
  dueDate?: string;
  epic?: string;
  createdAt: string;
  updatedAt: string;
  acceptanceCriteria?: AcceptanceCriterion[];
  blocks?: string[];
  blockedBy?: string[];
  relatedTo?: string[];
  team?: User[];
  reviewer?: User;
  type?: 'feature' | 'epic' | 'user-story' | 'task';
  sprint?: string;
  wsjf?: WSJFScore;
  rice?: RICEScore;
  moscow?: MoSCoWCategory;
  attachments?: Attachment[];
  comments?: Comment[];
  activities?: FeatureActivity[];
}

export interface WSJFScore {
  userBusinessValue: number; // 1-10
  timeCriticality: number; // 1-10
  riskReduction: number; // 1-10
  jobSize: number; // 1-10
  score?: number; // auto-calculated
}

export interface RICEScore {
  reach: number; // users per quarter
  impact: number; // 0.25, 0.5, 1, 2, 3
  confidence: number; // 0-100
  effort: number; // person-months
  score?: number; // auto-calculated
}

export interface MoSCoWCategory {
  category: 'must' | 'should' | 'could' | 'wont';
  justification: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
  uploadedBy: User;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: string;
  updatedAt?: string;
  replies?: Comment[];
  resolved?: boolean;
  reactions?: Record<string, string[]>;
}

export interface FeatureActivity {
  id: string;
  type: 'created' | 'updated' | 'status_changed' | 'assigned' | 'commented';
  user: User;
  field?: string;
  oldValue?: string;
  newValue?: string;
  timestamp: string;
  description: string;
}

/* Feature Details Extended Types */
export interface AcceptanceCriterion {
  id: string;
  description: string;
  completed: boolean;
  order: number;
}

export interface TestCase {
  id: string;
  name: string;
  description: string;
  status: 'passed' | 'failed' | 'pending';
  executedDate?: string;
  executedBy?: User;
}

export interface FeatureVersion {
  id: string;
  featureId: string;
  version: number;
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  changedBy: User;
  changedDate: string;
}

export interface CommentWithMentions extends Comment {
  mentions?: string[];
  reactions?: Record<string, string[]>;
}

/* Sprint Types */
export interface Sprint {
  id: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'active' | 'completed';
  features: Feature[];
  velocity?: number;
  capacity?: number;
  createdAt: string;
}

/* Goal Types */
export interface KeyResult {
  id: string;
  title: string;
  type: 'number' | 'percentage' | 'currency' | 'boolean';
  startValue: number;
  targetValue: number;
  currentValue: number;
  confidence: number;
  weight: number;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  type: 'okr' | 'kpi';
  status: 'on-track' | 'at-risk' | 'off-track';
  owner?: User;
  period: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'annual' | 'custom';
  keyResults: KeyResult[];
  progress: number;
  startDate: string;
  endDate: string;
  createdAt: string;
}

/* Release Types */
export interface Release {
  id: string;
  name: string;
  type: 'major' | 'minor' | 'patch' | 'hotfix';
  targetDate: string;
  status: 'planning' | 'in-progress' | 'testing' | 'released';
  features: Feature[];
  manager?: User;
  healthScore: number;
  createdAt: string;
}

/* Document Types */
export interface Document {
  id: string;
  title: string;
  content: string;
  type: 'doc' | 'prD' | 'retro' | 'meeting-notes' | 'design-doc';
  owner?: User;
  collaborators: User[];
  tags: string[];
  folderId?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

/* Stakeholder Types */
export interface Stakeholder {
  id: string;
  name: string;
  title: string;
  email: string;
  company: string;
  interestLevel: number; // 1-10
  influenceLevel: number; // 1-10
  sentiment: 'champion' | 'supporter' | 'neutral' | 'skeptic' | 'blocker';
  communicationPreference: string;
  avatar?: string;
  createdAt: string;
}

/* Requirement Types */
export interface Requirement {
  id: string;
  title: string;
  description: string;
  type: 'functional' | 'non-functional' | 'business' | 'technical';
  status: 'draft' | 'review' | 'approved' | 'in-dev' | 'testing' | 'completed' | 'rejected';
  priority: 'critical' | 'high' | 'medium' | 'low';
  owner?: User;
  stakeholder?: Stakeholder;
  acceptanceCriteria: string[];
  testCases?: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

/* Dashboard Activity Types */
export interface Activity {
  id: string;
  type: 'feature' | 'sprint' | 'goal' | 'release' | 'document' | 'stakeholder' | 'requirement';
  action: string;
  user: User;
  timestamp: string;
  details: {
    title: string;
    description?: string;
    icon: string;
  };
}
