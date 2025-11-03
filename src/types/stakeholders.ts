export type StakeholderRole = 'executive' | 'manager' | 'developer' | 'qa' | 'product-owner' | 'designer' | 'marketing' | 'sales' | 'support' | 'other';
export type EngagementLevel = 'high' | 'medium' | 'low';
export type CommunicationPreference = 'email' | 'slack' | 'meeting' | 'chat' | 'none';
export type SentimentScore = 'very-positive' | 'positive' | 'neutral' | 'negative' | 'very-negative';

export interface StakeholderContact {
  type: 'email' | 'phone' | 'slack' | 'linkedin' | 'twitter';
  value: string;
  preferred?: boolean;
}

export interface EngagementRecord {
  id: string;
  date: string;
  type: 'meeting' | 'email' | 'call' | 'feedback' | 'update' | 'survey';
  subject: string;
  notes: string;
  sentiment?: SentimentScore;
  relatedItems?: string[]; // Goal/Feature/Release IDs
}

export interface InteractionHistory {
  id: string;
  timestamp: string;
  type: 'meeting' | 'email' | 'call' | 'message' | 'feedback';
  title: string;
  description: string;
  duration?: number; // in minutes
  attendees?: string[];
  outcome?: string;
}

export interface StakeholderInfluence {
  relatedGoals: string[]; // Goal IDs
  relatedFeatures: string[]; // Feature IDs
  relatedReleases: string[]; // Release IDs
  decisionPower: 'high' | 'medium' | 'low';
  affectedAreas: string[]; // business, technical, marketing, sales, etc.
}

export interface FeedbackItem {
  id: string;
  date: string;
  category: 'feature-request' | 'bug' | 'improvement' | 'general' | 'concern';
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'new' | 'acknowledged' | 'in-review' | 'addressed' | 'closed';
  relatedItem?: string; // Goal/Feature/Release ID
}

export interface Stakeholder {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  organization?: string;
  title: string;
  role: StakeholderRole;
  profileImage?: string;
  bio?: string;
  
  // Contact Information
  contacts: StakeholderContact[];
  communicationPreference: CommunicationPreference;
  
  // Engagement
  engagementLevel: EngagementLevel;
  engagementScore: number; // 0-100
  lastEngagement?: string;
  engagementRecords: EngagementRecord[];
  interactionHistory: InteractionHistory[];
  
  // Influence & Impact
  influence: StakeholderInfluence;
  overallSentiment: SentimentScore;
  
  // Feedback & Concerns
  feedback: FeedbackItem[];
  openConcerns: string[]; // concern IDs
  
  // Availability
  timezone: string;
  availableHours?: string; // e.g., "9AM-5PM EST"
  preferredMeetingDays?: string[]; // Mon, Tue, etc.
  
  // Metadata
  tags: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
  lastContactedAt?: string;
}

export interface StakeholderGroup {
  id: string;
  name: string;
  description: string;
  members: string[]; // Stakeholder IDs
  purpose: string;
  createdAt: string;
}

export interface StakeholderFilter {
  role?: StakeholderRole[];
  engagementLevel?: EngagementLevel[];
  department?: string[];
  sentiment?: SentimentScore[];
}
