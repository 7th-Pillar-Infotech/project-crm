import { Feature, Sprint, Goal, Release, Document, Stakeholder, Requirement, Activity, User } from '@/types';

const mockUsers: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    name: 'John Doe',
    role: 'admin',
    avatar: '🧑‍💼',
  },
  {
    id: '2',
    email: 'jane@example.com',
    name: 'Jane Smith',
    role: 'manager',
    avatar: '👩‍💼',
  },
  {
    id: '3',
    email: 'bob@example.com',
    name: 'Bob Johnson',
    role: 'user',
    avatar: '👨‍💻',
  },
  {
    id: '4',
    email: 'alice@example.com',
    name: 'Alice Williams',
    role: 'user',
    avatar: '👩‍💻',
  },
];

export const mockFeatures: Feature[] = [
  {
    id: 'FEAT-001',
    title: 'User Authentication System',
    description: 'Implement robust authentication with OAuth and JWT support',
    status: 'in-progress',
    priority: 'critical',
    owner: mockUsers[0],
    tags: ['auth', 'security'],
    storyPoints: 13,
    dueDate: '2025-11-15',
    createdAt: '2025-11-01',
    updatedAt: '2025-11-03',
  },
  {
    id: 'FEAT-002',
    title: 'Dashboard Analytics',
    description: 'Create comprehensive analytics dashboard with real-time data',
    status: 'planned',
    priority: 'high',
    owner: mockUsers[1],
    tags: ['analytics', 'dashboard'],
    storyPoints: 8,
    dueDate: '2025-11-20',
    createdAt: '2025-11-01',
    updatedAt: '2025-11-02',
  },
  {
    id: 'FEAT-003',
    title: 'Email Notifications',
    description: 'Set up email notification system for important events',
    status: 'backlog',
    priority: 'medium',
    tags: ['notifications', 'email'],
    storyPoints: 5,
    createdAt: '2025-11-01',
    updatedAt: '2025-11-01',
  },
  {
    id: 'FEAT-004',
    title: 'Mobile App Support',
    description: 'Build responsive mobile-first design',
    status: 'done',
    priority: 'high',
    owner: mockUsers[2],
    tags: ['mobile', 'responsive'],
    storyPoints: 21,
    createdAt: '2025-10-15',
    updatedAt: '2025-11-03',
  },
  {
    id: 'FEAT-005',
    title: 'Dark Mode Toggle',
    description: 'Implement system-wide dark mode support',
    status: 'backlog',
    priority: 'low',
    tags: ['ui', 'theme'],
    storyPoints: 3,
    createdAt: '2025-11-02',
    updatedAt: '2025-11-02',
  },
];

export const mockSprints: Sprint[] = [
  {
    id: 'SPRINT-001',
    name: 'Sprint 1 - Core Setup',
    goal: 'Establish authentication and basic dashboard',
    startDate: '2025-11-01',
    endDate: '2025-11-14',
    status: 'active',
    features: mockFeatures.slice(0, 2),
    velocity: 21,
    capacity: 40,
    createdAt: '2025-10-25',
  },
  {
    id: 'SPRINT-002',
    name: 'Sprint 2 - Features Expansion',
    goal: 'Add analytics and notification system',
    startDate: '2025-11-15',
    endDate: '2025-11-28',
    status: 'planning',
    features: mockFeatures.slice(2, 4),
    velocity: 13,
    capacity: 40,
    createdAt: '2025-11-01',
  },
];

export const mockGoals: Goal[] = [
  {
    id: 'GOAL-001',
    title: 'Increase User Engagement',
    description: 'Drive 40% increase in daily active users',
    type: 'okr',
    status: 'on-track',
    owner: mockUsers[0],
    period: 'Q4',
    keyResults: [
      {
        id: 'KR-001',
        title: 'Increase DAU to 10,000',
        type: 'number',
        startValue: 7000,
        targetValue: 10000,
        currentValue: 8500,
        confidence: 0.8,
        weight: 0.5,
      },
      {
        id: 'KR-002',
        title: 'Improve retention rate to 70%',
        type: 'percentage',
        startValue: 55,
        targetValue: 70,
        currentValue: 65,
        confidence: 0.7,
        weight: 0.5,
      },
    ],
    progress: 70,
    startDate: '2025-10-01',
    endDate: '2025-12-31',
    createdAt: '2025-10-01',
  },
  {
    id: 'GOAL-002',
    title: 'Improve System Performance',
    description: 'Reduce load times and increase throughput',
    type: 'okr',
    status: 'at-risk',
    owner: mockUsers[1],
    period: 'Q4',
    keyResults: [
      {
        id: 'KR-003',
        title: 'Reduce page load time to under 2s',
        type: 'number',
        startValue: 3500,
        targetValue: 2000,
        currentValue: 2800,
        confidence: 0.6,
        weight: 1,
      },
    ],
    progress: 50,
    startDate: '2025-10-01',
    endDate: '2025-12-31',
    createdAt: '2025-10-05',
  },
];

export const mockReleases: Release[] = [
  {
    id: 'REL-001',
    name: 'Version 1.0.0',
    type: 'major',
    targetDate: '2025-11-30',
    status: 'in-progress',
    features: mockFeatures.slice(0, 3),
    manager: mockUsers[0],
    healthScore: 85,
    createdAt: '2025-10-20',
  },
  {
    id: 'REL-002',
    name: 'Version 1.1.0',
    type: 'minor',
    targetDate: '2025-12-31',
    status: 'planning',
    features: mockFeatures.slice(3),
    manager: mockUsers[1],
    healthScore: 70,
    createdAt: '2025-11-01',
  },
];

export const mockDocuments: Document[] = [
  {
    id: 'DOC-001',
    title: 'Product Requirements Document',
    content: 'This is the main PRD for Q4 2025...',
    type: 'prD',
    owner: mockUsers[0],
    collaborators: [mockUsers[1], mockUsers[2]],
    tags: ['prd', 'q4-2025'],
    createdAt: '2025-10-15',
    updatedAt: '2025-11-03',
    version: 5,
  },
  {
    id: 'DOC-002',
    title: 'Sprint 1 Retrospective',
    content: 'Team retrospective notes for Sprint 1...',
    type: 'retro',
    owner: mockUsers[1],
    collaborators: [mockUsers[0], mockUsers[2], mockUsers[3]],
    tags: ['retro', 'sprint-1'],
    createdAt: '2025-11-02',
    updatedAt: '2025-11-02',
    version: 2,
  },
];

export const mockStakeholders: Stakeholder[] = [
  {
    id: 'STK-001',
    name: 'Michael Johnson',
    title: 'Chief Product Officer',
    email: 'michael@example.com',
    company: 'Acme Corp',
    interestLevel: 9,
    influenceLevel: 10,
    sentiment: 'champion',
    communicationPreference: 'email',
    avatar: '👔',
    createdAt: '2025-08-01',
  },
  {
    id: 'STK-002',
    name: 'Sarah Lee',
    title: 'VP of Engineering',
    email: 'sarah@example.com',
    company: 'Acme Corp',
    interestLevel: 8,
    influenceLevel: 9,
    sentiment: 'supporter',
    communicationPreference: 'meeting',
    avatar: '👩',
    createdAt: '2025-08-15',
  },
  {
    id: 'STK-003',
    name: 'David Brown',
    title: 'Sales Director',
    email: 'david@example.com',
    company: 'Acme Corp',
    interestLevel: 6,
    influenceLevel: 7,
    sentiment: 'neutral',
    communicationPreference: 'call',
    avatar: '👨',
    createdAt: '2025-09-01',
  },
];

export const mockRequirements: Requirement[] = [
  {
    id: 'REQ-001',
    title: 'User must be able to login with email and password',
    description: 'System shall support email/password authentication',
    type: 'functional',
    status: 'approved',
    priority: 'critical',
    owner: mockUsers[0],
    stakeholder: mockStakeholders[0],
    acceptanceCriteria: [
      'User can enter email and password',
      'System validates credentials',
      'JWT token is issued on success',
    ],
    tags: ['authentication', 'security'],
    createdAt: '2025-10-15',
    updatedAt: '2025-10-20',
  },
  {
    id: 'REQ-002',
    title: 'System shall support OAuth login',
    description: 'Enable login via Google and Microsoft accounts',
    type: 'functional',
    status: 'in-dev',
    priority: 'high',
    owner: mockUsers[1],
    acceptanceCriteria: [
      'Google OAuth flow works',
      'Microsoft OAuth flow works',
      'User data synced correctly',
    ],
    tags: ['authentication', 'oauth'],
    createdAt: '2025-10-20',
    updatedAt: '2025-11-01',
  },
];

export const mockActivities: Activity[] = [
  {
    id: 'ACT-001',
    type: 'feature',
    action: 'created',
    user: mockUsers[0],
    timestamp: '2025-11-03T10:30:00Z',
    details: {
      title: 'User Authentication System',
      description: 'New feature created',
      icon: '✨',
    },
  },
  {
    id: 'ACT-002',
    type: 'sprint',
    action: 'started',
    user: mockUsers[1],
    timestamp: '2025-11-03T09:15:00Z',
    details: {
      title: 'Sprint 1 - Core Setup',
      description: 'Sprint has started',
      icon: '🚀',
    },
  },
  {
    id: 'ACT-003',
    type: 'goal',
    action: 'updated',
    user: mockUsers[2],
    timestamp: '2025-11-02T14:45:00Z',
    details: {
      title: 'Increase User Engagement',
      description: 'Progress updated to 70%',
      icon: '📈',
    },
  },
  {
    id: 'ACT-004',
    type: 'document',
    action: 'shared',
    user: mockUsers[3],
    timestamp: '2025-11-02T11:20:00Z',
    details: {
      title: 'Product Requirements Document',
      description: 'Shared with team',
      icon: '📄',
    },
  },
];

// Helper functions to get mock data
export const getMockUsers = () => mockUsers;
export const getMockFeatures = () => mockFeatures;
export const getMockSprints = () => mockSprints;
export const getMockGoals = () => mockGoals;
export const getMockReleases = () => mockReleases;
export const getMockDocuments = () => mockDocuments;
export const getMockStakeholders = () => mockStakeholders;
export const getMockRequirements = () => mockRequirements;
export const getMockActivities = () => mockActivities;
