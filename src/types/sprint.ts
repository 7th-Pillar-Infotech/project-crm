export type SprintType = 'regular' | 'hardening' | 'innovation';
export type SprintStatus = 'planning' | 'active' | 'completed' | 'archived';

export interface Sprint {
  id: string;
  name: string;
  goal: string;
  type: SprintType;
  status: SprintStatus;
  startDate: string;
  endDate: string;
  teamMembers: string[]; // User IDs
  totalCapacity: number;
  committedPoints: number;
  completedPoints: number;
  totalTasks?: number; // Total number of tasks
  completedTasks?: number; // Completed tasks count
  createdAt: string;
  updatedAt: string;
  teamCapacity?: Record<string, number>; // userId -> capacity points
  holidays?: string[]; // dates
  workingDays?: string[]; // Mon-Fri
  template?: string; // template name
}

export interface SprintTemplate {
  id: string;
  name: string;
  description: string;
  duration: number; // in days
  workingDays: string[];
  defaultTeamMembers: string[];
}

export interface SprintBoard {
  sprintId: string;
  columns: {
    id: string;
    title: string;
    cards: SprintCard[];
    wipLimit?: number;
  }[];
}

export interface SprintCardComment {
  id: string;
  userId: string; // User ID
  content: string;
  createdAt: string;
}

export interface SprintCard {
  id: string;
  featureId: string;
  title: string;
  description: string;
  storyPoints: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  assignee?: string; // User ID
  tags: string[];
  comments: SprintCardComment[];
  attachments: string[];
  blockers?: string[];
  status: string;
}
