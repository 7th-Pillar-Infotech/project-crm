import { Stakeholder } from '@/types/stakeholders';

export const mockStakeholders: Stakeholder[] = [
  {
    id: 'STK-001',
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah.chen@company.com',
    title: 'Chief Product Officer',
    department: 'Product',
    organization: 'Company HQ',
    role: 'product-owner',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    bio: 'Visionary product leader with 15+ years in SaaS. Passionate about user-centric design and market innovation.',
    
    contacts: [
      { type: 'email', value: 'sarah.chen@company.com', preferred: true },
      { type: 'slack', value: '@sarah.chen' },
      { type: 'linkedin', value: 'linkedin.com/in/sarahchen' },
    ],
    communicationPreference: 'meeting',
    
    engagementLevel: 'high',
    engagementScore: 95,
    lastEngagement: '2025-05-14T14:30:00Z',
    engagementRecords: [
      {
        id: 'er-001',
        date: '2025-05-14T14:30:00Z',
        type: 'meeting',
        subject: 'Q2 Roadmap Review',
        notes: 'Approved Summer Update timeline and discussed new dashboard feature priorities',
        sentiment: 'very-positive',
        relatedItems: ['REL-001', 'GOAL-001'],
      },
      {
        id: 'er-002',
        date: '2025-05-10T10:00:00Z',
        type: 'email',
        subject: 'Features Feedback',
        notes: 'Provided detailed feedback on advanced analytics feature',
        sentiment: 'positive',
        relatedItems: ['FEAT-002'],
      },
      {
        id: 'er-003',
        date: '2025-05-05T15:00:00Z',
        type: 'meeting',
        subject: 'Strategic Planning',
        notes: 'Discussed long-term product vision and market positioning',
        sentiment: 'positive',
      },
    ],
    interactionHistory: [
      {
        id: 'ih-001',
        timestamp: '2025-05-14T14:30:00Z',
        type: 'meeting',
        title: 'Q2 Roadmap Review',
        description: 'Quarterly planning session with product leadership',
        duration: 90,
        attendees: ['STK-001', 'STK-002', 'STK-003'],
        outcome: 'Approved roadmap with timeline adjustments',
      },
    ],
    
    influence: {
      relatedGoals: ['GOAL-001', 'GOAL-002', 'GOAL-003'],
      relatedFeatures: ['FEAT-001', 'FEAT-002', 'FEAT-003', 'FEAT-004'],
      relatedReleases: ['REL-001', 'REL-002'],
      decisionPower: 'high',
      affectedAreas: ['business', 'product', 'strategy'],
    },
    overallSentiment: 'very-positive',
    
    feedback: [
      {
        id: 'fb-001',
        date: '2025-05-10T10:00:00Z',
        category: 'feature-request',
        title: 'Advanced Filtering Capabilities',
        description: 'Need more granular filtering options for large datasets',
        priority: 'high',
        status: 'in-review',
        relatedItem: 'FEAT-002',
      },
      {
        id: 'fb-002',
        date: '2025-04-28T11:30:00Z',
        category: 'improvement',
        title: 'Dashboard Performance',
        description: 'Dashboard loading time should be under 2 seconds',
        priority: 'high',
        status: 'addressed',
        relatedItem: 'FEAT-001',
      },
    ],
    openConcerns: [],
    
    timezone: 'America/Los_Angeles',
    availableHours: '9AM-5PM PST',
    preferredMeetingDays: ['Monday', 'Tuesday', 'Wednesday'],
    
    tags: ['executive', 'strategic', 'product-vision'],
    notes: 'Key decision maker for product direction. Strong advocate for user research.',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2025-05-14T14:30:00Z',
    lastContactedAt: '2025-05-14T14:30:00Z',
  },
  {
    id: 'STK-002',
    firstName: 'Marcus',
    lastName: 'Rodriguez',
    email: 'marcus.rodriguez@company.com',
    title: 'Engineering Manager',
    department: 'Engineering',
    role: 'manager',
    bio: 'Technical leader overseeing backend infrastructure and API development.',
    
    contacts: [
      { type: 'email', value: 'marcus.rodriguez@company.com', preferred: true },
      { type: 'slack', value: '@mrodriguez' },
    ],
    communicationPreference: 'slack',
    
    engagementLevel: 'high',
    engagementScore: 88,
    lastEngagement: '2025-05-13T11:00:00Z',
    engagementRecords: [
      {
        id: 'er-004',
        date: '2025-05-13T11:00:00Z',
        type: 'meeting',
        subject: 'Technical Architecture Review',
        notes: 'Reviewed API v2 implementation plan and deployment strategy',
        sentiment: 'positive',
        relatedItems: ['GOAL-004', 'REL-001'],
      },
      {
        id: 'er-005',
        date: '2025-05-08T09:30:00Z',
        type: 'email',
        subject: 'Performance Optimization Update',
        notes: 'Shared optimization results and upcoming improvements',
        sentiment: 'positive',
      },
    ],
    interactionHistory: [
      {
        id: 'ih-002',
        timestamp: '2025-05-13T11:00:00Z',
        type: 'meeting',
        title: 'Technical Architecture Review',
        description: 'Engineering team sync on API v2 implementation',
        duration: 60,
        attendees: ['STK-002', 'STK-004', 'STK-005'],
      },
    ],
    
    influence: {
      relatedGoals: ['GOAL-004'],
      relatedFeatures: ['FEAT-001', 'FEAT-003', 'FEAT-004'],
      relatedReleases: ['REL-001'],
      decisionPower: 'high',
      affectedAreas: ['technical', 'infrastructure'],
    },
    overallSentiment: 'positive',
    
    feedback: [
      {
        id: 'fb-003',
        date: '2025-05-08T09:30:00Z',
        category: 'improvement',
        title: 'API Rate Limiting',
        description: 'Suggest implementing adaptive rate limiting based on user tier',
        priority: 'medium',
        status: 'in-review',
        relatedItem: 'GOAL-004',
      },
    ],
    openConcerns: ['Scalability concerns with current database', 'Need more testing environments'],
    
    timezone: 'America/New_York',
    availableHours: '8AM-6PM EST',
    preferredMeetingDays: ['Tuesday', 'Wednesday', 'Thursday'],
    
    tags: ['technical', 'infrastructure', 'api'],
    notes: 'Critical for technical decisions. Prefers async communication with Slack updates.',
    createdAt: '2024-02-20T10:00:00Z',
    updatedAt: '2025-05-13T11:00:00Z',
    lastContactedAt: '2025-05-13T11:00:00Z',
  },
  {
    id: 'STK-003',
    firstName: 'Emma',
    lastName: 'Thompson',
    email: 'emma.thompson@company.com',
    title: 'Head of Design',
    department: 'Design',
    role: 'designer',
    bio: 'UX/UI specialist focused on creating intuitive and beautiful user experiences.',
    
    contacts: [
      { type: 'email', value: 'emma.thompson@company.com', preferred: true },
      { type: 'slack', value: '@emma.t' },
    ],
    communicationPreference: 'slack',
    
    engagementLevel: 'high',
    engagementScore: 85,
    lastEngagement: '2025-05-12T15:45:00Z',
    engagementRecords: [
      {
        id: 'er-006',
        date: '2025-05-12T15:45:00Z',
        type: 'email',
        subject: 'Design Review - New Dashboard',
        notes: 'Shared latest mockups and gathered feedback on new dashboard design',
        sentiment: 'positive',
        relatedItems: ['FEAT-001'],
      },
    ],
    interactionHistory: [],
    
    influence: {
      relatedGoals: ['GOAL-001'],
      relatedFeatures: ['FEAT-001', 'FEAT-004'],
      relatedReleases: ['REL-001'],
      decisionPower: 'medium',
      affectedAreas: ['design', 'user-experience'],
    },
    overallSentiment: 'positive',
    
    feedback: [
      {
        id: 'fb-004',
        date: '2025-05-12T15:45:00Z',
        category: 'improvement',
        title: 'Accessibility Standards',
        description: 'Ensure all components meet WCAG 2.1 AA standards',
        priority: 'high',
        status: 'acknowledged',
        relatedItem: 'FEAT-001',
      },
    ],
    openConcerns: ['Timeline constraints', 'Design system consistency'],
    
    timezone: 'Europe/London',
    availableHours: '9AM-5PM GMT',
    preferredMeetingDays: ['Monday', 'Wednesday', 'Thursday'],
    
    tags: ['design', 'ux', 'user-experience'],
    notes: 'Detail-oriented. Prefers async collaboration with design files shared in cloud.',
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2025-05-12T15:45:00Z',
    lastContactedAt: '2025-05-12T15:45:00Z',
  },
  {
    id: 'STK-004',
    firstName: 'David',
    lastName: 'Kumar',
    email: 'david.kumar@company.com',
    title: 'QA Lead',
    department: 'QA',
    role: 'qa',
    bio: 'Quality assurance specialist ensuring product reliability and user satisfaction.',
    
    contacts: [
      { type: 'email', value: 'david.kumar@company.com', preferred: true },
      { type: 'slack', value: '@dkumar' },
    ],
    communicationPreference: 'email',
    
    engagementLevel: 'medium',
    engagementScore: 72,
    lastEngagement: '2025-05-11T13:20:00Z',
    engagementRecords: [
      {
        id: 'er-007',
        date: '2025-05-11T13:20:00Z',
        type: 'email',
        subject: 'Test Coverage Report',
        notes: 'Shared Q2 test coverage metrics and improvement areas',
        sentiment: 'neutral',
        relatedItems: ['REL-001'],
      },
    ],
    interactionHistory: [],
    
    influence: {
      relatedGoals: [],
      relatedFeatures: ['FEAT-001', 'FEAT-002', 'FEAT-003', 'FEAT-004'],
      relatedReleases: ['REL-001'],
      decisionPower: 'medium',
      affectedAreas: ['quality', 'testing'],
    },
    overallSentiment: 'neutral',
    
    feedback: [
      {
        id: 'fb-005',
        date: '2025-05-11T13:20:00Z',
        category: 'concern',
        title: 'Test Coverage Gap',
        description: 'Current test coverage is at 78%, need to reach 85% minimum',
        priority: 'high',
        status: 'in-review',
        relatedItem: 'REL-001',
      },
    ],
    openConcerns: ['Automated testing infrastructure needs upgrade'],
    
    timezone: 'Asia/Kolkata',
    availableHours: '2PM-10PM IST',
    preferredMeetingDays: ['Wednesday', 'Thursday', 'Friday'],
    
    tags: ['quality', 'testing', 'qa'],
    notes: 'Methodical and detail-oriented. Appreciates structured communication.',
    createdAt: '2024-04-05T10:00:00Z',
    updatedAt: '2025-05-11T13:20:00Z',
    lastContactedAt: '2025-05-11T13:20:00Z',
  },
  {
    id: 'STK-005',
    firstName: 'Lisa',
    lastName: 'Anderson',
    email: 'lisa.anderson@company.com',
    title: 'VP Sales',
    department: 'Sales',
    role: 'sales',
    bio: 'Sales leader focused on customer acquisition and retention strategies.',
    
    contacts: [
      { type: 'email', value: 'lisa.anderson@company.com', preferred: true },
      { type: 'slack', value: '@lisa.a' },
      { type: 'linkedin', value: 'linkedin.com/in/lisaanderson' },
    ],
    communicationPreference: 'meeting',
    
    engagementLevel: 'medium',
    engagementScore: 68,
    lastEngagement: '2025-05-09T10:15:00Z',
    engagementRecords: [
      {
        id: 'er-008',
        date: '2025-05-09T10:15:00Z',
        type: 'meeting',
        subject: 'Feature Readiness for Sales',
        notes: 'Discussed release timeline and marketing readiness for new features',
        sentiment: 'positive',
        relatedItems: ['REL-001'],
      },
    ],
    interactionHistory: [],
    
    influence: {
      relatedGoals: ['GOAL-001', 'GOAL-003'],
      relatedFeatures: ['FEAT-001'],
      relatedReleases: ['REL-001'],
      decisionPower: 'medium',
      affectedAreas: ['business', 'sales', 'marketing'],
    },
    overallSentiment: 'positive',
    
    feedback: [
      {
        id: 'fb-006',
        date: '2025-05-09T10:15:00Z',
        category: 'feature-request',
        title: 'Customer Analytics Export',
        description: 'Need ability to export customer analytics for sales presentations',
        priority: 'high',
        status: 'acknowledged',
        relatedItem: 'FEAT-002',
      },
    ],
    openConcerns: ['Release timeline impacts sales pipeline', 'Need earlier feature previews'],
    
    timezone: 'America/Chicago',
    availableHours: '9AM-5PM CST',
    preferredMeetingDays: ['Monday', 'Tuesday', 'Friday'],
    
    tags: ['sales', 'business', 'customer-focused'],
    notes: 'Highly motivated by business outcomes. Appreciates early visibility into new features.',
    createdAt: '2024-05-12T10:00:00Z',
    updatedAt: '2025-05-09T10:15:00Z',
    lastContactedAt: '2025-05-09T10:15:00Z',
  },
  {
    id: 'STK-006',
    firstName: 'James',
    lastName: 'Wilson',
    email: 'james.wilson@company.com',
    title: 'Support Manager',
    department: 'Customer Support',
    role: 'support',
    bio: 'Customer support leader representing voice of the customer.',
    
    contacts: [
      { type: 'email', value: 'james.wilson@company.com', preferred: true },
      { type: 'slack', value: '@jwilson' },
    ],
    communicationPreference: 'slack',
    
    engagementLevel: 'low',
    engagementScore: 55,
    lastEngagement: '2025-05-06T14:30:00Z',
    engagementRecords: [
      {
        id: 'er-009',
        date: '2025-05-06T14:30:00Z',
        type: 'email',
        subject: 'Customer Pain Points Summary',
        notes: 'Shared monthly customer support ticket analysis and common issues',
        sentiment: 'negative',
        relatedItems: ['GOAL-002'],
      },
    ],
    interactionHistory: [],
    
    influence: {
      relatedGoals: ['GOAL-002'],
      relatedFeatures: [],
      relatedReleases: ['REL-001'],
      decisionPower: 'low',
      affectedAreas: ['customer-experience', 'support'],
    },
    overallSentiment: 'negative',
    
    feedback: [
      {
        id: 'fb-007',
        date: '2025-05-06T14:30:00Z',
        category: 'bug',
        title: 'Export Function Crashes',
        description: 'Customer reports that export function crashes with large datasets',
        priority: 'critical',
        status: 'new',
        relatedItem: 'FEAT-006',
      },
    ],
    openConcerns: ['High volume of support tickets', 'Product responsiveness issues', 'Need documentation improvements'],
    
    timezone: 'America/Denver',
    availableHours: '10AM-6PM MST',
    preferredMeetingDays: ['Tuesday', 'Thursday'],
    
    tags: ['support', 'customer-voice', 'feedback'],
    notes: 'Important for understanding customer satisfaction. Limited availability due to support workload.',
    createdAt: '2024-06-18T10:00:00Z',
    updatedAt: '2025-05-06T14:30:00Z',
    lastContactedAt: '2025-05-06T14:30:00Z',
  },
];
