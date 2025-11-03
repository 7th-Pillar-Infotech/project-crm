import { Document } from '@/types/documents';

export const mockDocuments: Document[] = [
  {
    id: 'DOC-001',
    title: 'Summer Update v2.0.0 - Product Requirements Document',
    description: 'Complete PRD for the Summer Update major release including new dashboard, advanced analytics, and performance improvements',
    type: 'prd',
    category: 'product',
    status: 'approved',
    
    content: 'This document outlines the complete requirements for Summer Update v2.0.0...',
    summary: 'Major release PRD with 3 key features and performance improvements',
    
    createdAt: '2025-04-01T09:00:00Z',
    updatedAt: '2025-05-10T14:30:00Z',
    createdBy: 'user-1',
    lastModifiedBy: 'user-1',
    
    fileSize: 2560000,
    fileType: '.docx',
    fileName: 'Summer_Update_PRD_v2.0.0.docx',
    
    folder: 'Product Specifications',
    tags: [
      { id: 'tag-1', name: 'release', color: '#3b82f6' },
      { id: 'tag-2', name: 'v2.0.0', color: '#8b5cf6' },
      { id: 'tag-3', name: 'approved', color: '#10b981' },
    ],
    relatedGoals: ['GOAL-001'],
    relatedFeatures: ['FEAT-001', 'FEAT-002', 'FEAT-003'],
    relatedReleases: ['REL-001'],
    
    owner: 'user-1',
    collaborators: [
      { userId: 'user-1', userName: 'Sarah Chen', accessLevel: 'owner', addedAt: '2025-04-01T09:00:00Z' },
      { userId: 'user-2', userName: 'Marcus Rodriguez', accessLevel: 'edit', addedAt: '2025-04-05T10:00:00Z' },
      { userId: 'user-3', userName: 'Emma Thompson', accessLevel: 'comment', addedAt: '2025-04-05T10:00:00Z' },
    ],
    
    currentVersion: 3,
    versions: [
      {
        id: 'ver-001',
        versionNumber: 1,
        createdAt: '2025-04-01T09:00:00Z',
        createdBy: 'user-1',
        changesSummary: 'Initial draft',
        fileSize: 2400000,
      },
      {
        id: 'ver-002',
        versionNumber: 2,
        createdAt: '2025-04-15T11:00:00Z',
        createdBy: 'user-2',
        changesSummary: 'Added technical specifications and implementation details',
        fileSize: 2500000,
      },
      {
        id: 'ver-003',
        versionNumber: 3,
        createdAt: '2025-05-10T14:30:00Z',
        createdBy: 'user-1',
        changesSummary: 'Final approval changes and sign-off',
        fileSize: 2560000,
      },
    ],
    
    viewCount: 47,
    downloadCount: 12,
    lastViewedAt: '2025-05-14T10:20:00Z',
    lastViewedBy: 'user-2',
    
    comments: [
      {
        id: 'cmt-001',
        authorId: 'user-2',
        authorName: 'Marcus Rodriguez',
        content: 'Looks good! Minor technical clarifications needed on the API design section.',
        createdAt: '2025-04-20T13:15:00Z',
        mentions: ['user-1'],
      },
      {
        id: 'cmt-002',
        authorId: 'user-1',
        authorName: 'Sarah Chen',
        content: '@user-2 Thanks for the feedback. Updated the API section with more details.',
        createdAt: '2025-04-22T09:30:00Z',
        mentions: ['user-2'],
      },
    ],
    
    isPublic: false,
    externalAccessible: false,
    isFavorite: true,
    isPinned: true,
    notes: 'Key document for Summer Update release. All stakeholders have approved.',
  },
  {
    id: 'DOC-002',
    title: 'New Dashboard UI - Design Specification Document',
    description: 'Comprehensive design specification for the new dashboard interface including wireframes, component specs, and interaction patterns',
    type: 'design-doc',
    category: 'design',
    status: 'approved',
    
    createdAt: '2025-04-05T14:00:00Z',
    updatedAt: '2025-05-08T11:45:00Z',
    createdBy: 'user-3',
    lastModifiedBy: 'user-3',
    
    fileSize: 5120000,
    fileType: '.pdf',
    fileName: 'Dashboard_Design_Spec.pdf',
    
    folder: 'Design Documents',
    tags: [
      { id: 'tag-4', name: 'ui-design', color: '#ec4899' },
      { id: 'tag-5', name: 'dashboard', color: '#f59e0b' },
      { id: 'tag-3', name: 'approved', color: '#10b981' },
    ],
    relatedFeatures: ['FEAT-001'],
    relatedReleases: ['REL-001'],
    
    owner: 'user-3',
    collaborators: [
      { userId: 'user-3', userName: 'Emma Thompson', accessLevel: 'owner', addedAt: '2025-04-05T14:00:00Z' },
      { userId: 'user-1', userName: 'Sarah Chen', accessLevel: 'view', addedAt: '2025-04-08T10:00:00Z' },
      { userId: 'user-2', userName: 'Marcus Rodriguez', accessLevel: 'comment', addedAt: '2025-04-08T10:00:00Z' },
    ],
    
    currentVersion: 2,
    versions: [
      {
        id: 'ver-004',
        versionNumber: 1,
        createdAt: '2025-04-05T14:00:00Z',
        createdBy: 'user-3',
        changesSummary: 'Initial design draft with wireframes',
        fileSize: 4800000,
      },
      {
        id: 'ver-005',
        versionNumber: 2,
        createdAt: '2025-05-08T11:45:00Z',
        createdBy: 'user-3',
        changesSummary: 'Added accessibility guidelines and high-fidelity mockups',
        fileSize: 5120000,
      },
    ],
    
    viewCount: 23,
    downloadCount: 8,
    lastViewedAt: '2025-05-12T15:30:00Z',
    lastViewedBy: 'user-1',
    
    comments: [
      {
        id: 'cmt-003',
        authorId: 'user-2',
        authorName: 'Marcus Rodriguez',
        content: 'Great design! Need to verify the responsiveness on mobile devices.',
        createdAt: '2025-04-12T10:00:00Z',
      },
    ],
    
    isPublic: false,
    externalAccessible: false,
    isFavorite: true,
    isPinned: false,
    notes: 'Design approved by all stakeholders. Ready for implementation.',
  },
  {
    id: 'DOC-003',
    title: 'Advanced Analytics - Technical Specification',
    description: 'Technical specification for Advanced Analytics feature including architecture, data models, and API design',
    type: 'tech-spec',
    category: 'engineering',
    status: 'approved',
    
    createdAt: '2025-04-10T10:00:00Z',
    updatedAt: '2025-05-12T16:00:00Z',
    createdBy: 'user-2',
    lastModifiedBy: 'user-2',
    
    fileSize: 1820000,
    fileType: '.md',
    fileName: 'Analytics_TechSpec.md',
    
    folder: 'Technical Specifications',
    tags: [
      { id: 'tag-6', name: 'backend', color: '#06b6d4' },
      { id: 'tag-7', name: 'analytics', color: '#84cc16' },
      { id: 'tag-3', name: 'approved', color: '#10b981' },
    ],
    relatedFeatures: ['FEAT-002'],
    relatedReleases: ['REL-001'],
    
    owner: 'user-2',
    collaborators: [
      { userId: 'user-2', userName: 'Marcus Rodriguez', accessLevel: 'owner', addedAt: '2025-04-10T10:00:00Z' },
      { userId: 'user-4', userName: 'David Kumar', accessLevel: 'view', addedAt: '2025-04-15T09:00:00Z' },
      { userId: 'user-1', userName: 'Sarah Chen', accessLevel: 'view', addedAt: '2025-04-15T09:00:00Z' },
    ],
    
    currentVersion: 4,
    versions: [
      {
        id: 'ver-006',
        versionNumber: 1,
        createdAt: '2025-04-10T10:00:00Z',
        createdBy: 'user-2',
        changesSummary: 'Initial tech spec draft',
        fileSize: 1600000,
      },
      {
        id: 'ver-007',
        versionNumber: 2,
        createdAt: '2025-04-18T14:00:00Z',
        createdBy: 'user-2',
        changesSummary: 'Added API endpoints and data model details',
        fileSize: 1700000,
      },
      {
        id: 'ver-008',
        versionNumber: 3,
        createdAt: '2025-04-25T11:30:00Z',
        createdBy: 'user-2',
        changesSummary: 'Performance optimization strategies and caching layer design',
        fileSize: 1750000,
      },
      {
        id: 'ver-009',
        versionNumber: 4,
        createdAt: '2025-05-12T16:00:00Z',
        createdBy: 'user-2',
        changesSummary: 'Final review updates and deployment considerations',
        fileSize: 1820000,
      },
    ],
    
    viewCount: 31,
    downloadCount: 6,
    lastViewedAt: '2025-05-13T09:15:00Z',
    lastViewedBy: 'user-4',
    
    comments: [],
    
    isPublic: false,
    externalAccessible: false,
    isFavorite: false,
    isPinned: false,
    notes: 'Comprehensive technical specification. Implementation in progress.',
  },
  {
    id: 'DOC-004',
    title: 'Q2 Planning Meeting - Meeting Notes & Action Items',
    description: 'Notes from Q2 planning meeting including decisions made, action items assigned, and next steps',
    type: 'meeting-notes',
    category: 'operations',
    status: 'in-review',
    
    createdAt: '2025-05-01T14:00:00Z',
    updatedAt: '2025-05-14T10:30:00Z',
    createdBy: 'user-1',
    lastModifiedBy: 'user-3',
    
    fileSize: 512000,
    fileType: '.docx',
    fileName: 'Q2_Planning_Meeting_Notes.docx',
    
    folder: 'Meeting Notes',
    tags: [
      { id: 'tag-8', name: 'planning', color: '#a855f7' },
      { id: 'tag-9', name: 'q2-2025', color: '#ef4444' },
      { id: 'tag-10', name: 'action-items', color: '#f97316' },
    ],
    relatedGoals: ['GOAL-001', 'GOAL-002'],
    
    owner: 'user-1',
    collaborators: [
      { userId: 'user-1', userName: 'Sarah Chen', accessLevel: 'owner', addedAt: '2025-05-01T14:00:00Z' },
      { userId: 'user-2', userName: 'Marcus Rodriguez', accessLevel: 'edit', addedAt: '2025-05-01T14:00:00Z' },
      { userId: 'user-3', userName: 'Emma Thompson', accessLevel: 'edit', addedAt: '2025-05-01T14:00:00Z' },
      { userId: 'user-5', userName: 'Lisa Anderson', accessLevel: 'view', addedAt: '2025-05-01T14:00:00Z' },
    ],
    
    currentVersion: 2,
    versions: [
      {
        id: 'ver-010',
        versionNumber: 1,
        createdAt: '2025-05-01T14:00:00Z',
        createdBy: 'user-1',
        changesSummary: 'Initial notes from meeting',
        fileSize: 480000,
      },
      {
        id: 'ver-011',
        versionNumber: 2,
        createdAt: '2025-05-14T10:30:00Z',
        createdBy: 'user-3',
        changesSummary: 'Added action item assignments and deadlines',
        fileSize: 512000,
      },
    ],
    
    viewCount: 18,
    downloadCount: 4,
    lastViewedAt: '2025-05-14T15:00:00Z',
    lastViewedBy: 'user-5',
    
    comments: [
      {
        id: 'cmt-004',
        authorId: 'user-2',
        authorName: 'Marcus Rodriguez',
        content: 'Can we clarify the timeline for action items #3 and #5? The deadlines seem tight.',
        createdAt: '2025-05-10T11:00:00Z',
        mentions: ['user-1'],
      },
    ],
    
    isPublic: false,
    externalAccessible: false,
    isFavorite: false,
    isPinned: false,
    notes: 'Awaiting final approval from all attendees.',
  },
  {
    id: 'DOC-005',
    title: 'Sprint 12 Retrospective - Team Reflection & Improvements',
    description: 'Retrospective analysis for Sprint 12 including what went well, challenges faced, and improvement opportunities',
    type: 'retrospective',
    category: 'operations',
    status: 'approved',
    
    createdAt: '2025-04-30T16:00:00Z',
    updatedAt: '2025-05-08T14:15:00Z',
    createdBy: 'user-2',
    lastModifiedBy: 'user-2',
    
    fileSize: 768000,
    fileType: '.docx',
    fileName: 'Sprint_12_Retro.docx',
    
    folder: 'Retrospectives',
    tags: [
      { id: 'tag-11', name: 'sprint-12', color: '#059669' },
      { id: 'tag-12', name: 'retrospective', color: '#0891b2' },
      { id: 'tag-13', name: 'improvements', color: '#d97706' },
    ],
    
    owner: 'user-2',
    collaborators: [
      { userId: 'user-2', userName: 'Marcus Rodriguez', accessLevel: 'owner', addedAt: '2025-04-30T16:00:00Z' },
      { userId: 'user-1', userName: 'Sarah Chen', accessLevel: 'view', addedAt: '2025-04-30T16:00:00Z' },
      { userId: 'user-3', userName: 'Emma Thompson', accessLevel: 'view', addedAt: '2025-04-30T16:00:00Z' },
      { userId: 'user-4', userName: 'David Kumar', accessLevel: 'view', addedAt: '2025-04-30T16:00:00Z' },
    ],
    
    currentVersion: 1,
    versions: [
      {
        id: 'ver-012',
        versionNumber: 1,
        createdAt: '2025-04-30T16:00:00Z',
        createdBy: 'user-2',
        changesSummary: 'Complete sprint retrospective with team feedback',
        fileSize: 768000,
      },
    ],
    
    viewCount: 12,
    downloadCount: 3,
    lastViewedAt: '2025-05-10T09:00:00Z',
    lastViewedBy: 'user-1',
    
    comments: [],
    
    isPublic: false,
    externalAccessible: false,
    isFavorite: false,
    isPinned: false,
    notes: 'Sprint completed successfully. Good foundation for Sprint 13 improvements.',
  },
  {
    id: 'DOC-006',
    title: 'API v2 Migration Guide - Developer Documentation',
    description: 'Comprehensive migration guide for developers moving from API v1 to API v2 with code examples and best practices',
    type: 'guide',
    category: 'engineering',
    status: 'draft',
    
    createdAt: '2025-05-05T13:00:00Z',
    updatedAt: '2025-05-13T15:45:00Z',
    createdBy: 'user-2',
    lastModifiedBy: 'user-2',
    
    fileSize: 1024000,
    fileType: '.md',
    fileName: 'API_v2_Migration_Guide.md',
    
    folder: 'Technical Documentation',
    tags: [
      { id: 'tag-14', name: 'api', color: '#3b82f6' },
      { id: 'tag-15', name: 'migration', color: '#f59e0b' },
      { id: 'tag-16', name: 'developer-docs', color: '#8b5cf6' },
    ],
    relatedReleases: ['REL-001'],
    
    owner: 'user-2',
    collaborators: [
      { userId: 'user-2', userName: 'Marcus Rodriguez', accessLevel: 'owner', addedAt: '2025-05-05T13:00:00Z' },
    ],
    
    currentVersion: 3,
    versions: [
      {
        id: 'ver-013',
        versionNumber: 1,
        createdAt: '2025-05-05T13:00:00Z',
        createdBy: 'user-2',
        changesSummary: 'Initial migration guide draft',
        fileSize: 800000,
      },
      {
        id: 'ver-014',
        versionNumber: 2,
        createdAt: '2025-05-08T10:00:00Z',
        createdBy: 'user-2',
        changesSummary: 'Added code examples and common pitfalls',
        fileSize: 950000,
      },
      {
        id: 'ver-015',
        versionNumber: 3,
        createdAt: '2025-05-13T15:45:00Z',
        createdBy: 'user-2',
        changesSummary: 'Added troubleshooting section and performance tips',
        fileSize: 1024000,
      },
    ],
    
    viewCount: 5,
    downloadCount: 1,
    lastViewedAt: '2025-05-13T16:00:00Z',
    lastViewedBy: 'user-2',
    
    comments: [],
    
    isPublic: false,
    externalAccessible: false,
    isFavorite: false,
    isPinned: false,
    notes: 'In progress. Needs review before publishing.',
  },
  {
    id: 'DOC-007',
    title: 'Product Roadmap 2025 - Strategic Overview',
    description: 'High-level product roadmap for 2025 showing quarterly releases, feature priorities, and strategic initiatives',
    type: 'proposal',
    category: 'product',
    status: 'approved',
    
    createdAt: '2025-03-15T11:00:00Z',
    updatedAt: '2025-05-01T14:30:00Z',
    createdBy: 'user-1',
    lastModifiedBy: 'user-1',
    
    fileSize: 3240000,
    fileType: '.pdf',
    fileName: 'Product_Roadmap_2025.pdf',
    
    folder: 'Strategic Documents',
    tags: [
      { id: 'tag-17', name: '2025-roadmap', color: '#7c3aed' },
      { id: 'tag-18', name: 'strategic', color: '#1e40af' },
      { id: 'tag-3', name: 'approved', color: '#10b981' },
    ],
    relatedGoals: ['GOAL-001', 'GOAL-002', 'GOAL-003'],
    relatedReleases: ['REL-001', 'REL-002'],
    
    owner: 'user-1',
    collaborators: [
      { userId: 'user-1', userName: 'Sarah Chen', accessLevel: 'owner', addedAt: '2025-03-15T11:00:00Z' },
      { userId: 'user-2', userName: 'Marcus Rodriguez', accessLevel: 'view', addedAt: '2025-03-20T10:00:00Z' },
      { userId: 'user-3', userName: 'Emma Thompson', accessLevel: 'view', addedAt: '2025-03-20T10:00:00Z' },
      { userId: 'user-5', userName: 'Lisa Anderson', accessLevel: 'view', addedAt: '2025-03-20T10:00:00Z' },
    ],
    
    currentVersion: 3,
    versions: [
      {
        id: 'ver-016',
        versionNumber: 1,
        createdAt: '2025-03-15T11:00:00Z',
        createdBy: 'user-1',
        changesSummary: 'Initial roadmap draft for 2025',
        fileSize: 2800000,
      },
      {
        id: 'ver-017',
        versionNumber: 2,
        createdAt: '2025-04-01T13:00:00Z',
        createdBy: 'user-1',
        changesSummary: 'Updated with Q2 refinements and stakeholder feedback',
        fileSize: 3100000,
      },
      {
        id: 'ver-018',
        versionNumber: 3,
        createdAt: '2025-05-01T14:30:00Z',
        createdBy: 'user-1',
        changesSummary: 'Final approval with executive sign-off',
        fileSize: 3240000,
      },
    ],
    
    viewCount: 62,
    downloadCount: 18,
    lastViewedAt: '2025-05-13T11:20:00Z',
    lastViewedBy: 'user-5',
    
    comments: [
      {
        id: 'cmt-005',
        authorId: 'user-5',
        authorName: 'Lisa Anderson',
        content: 'Excellent roadmap. Great alignment with our sales goals. Looking forward to these features!',
        createdAt: '2025-04-05T09:30:00Z',
      },
    ],
    
    isPublic: false,
    externalAccessible: false,
    isFavorite: true,
    isPinned: true,
    notes: 'Company-wide roadmap. Approved and finalized.',
  },
];
