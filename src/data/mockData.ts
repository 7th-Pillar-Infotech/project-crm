import {
  Feature,
  Sprint,
  User,
  Comment,
  FeatureActivity,
  Attachment,
  AcceptanceCriterion,
  TestCase,
  FeatureVersion,
  WSJFScore,
  RICEScore,
  MoSCoWCategory,
} from "@/types";

// Mock Users
export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "🧑‍💼",
    role: "manager",
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "👩‍💼",
    role: "user",
  },
  {
    id: "user-3",
    name: "Bob Johnson",
    email: "bob@example.com",
    avatar: "🧑‍💻",
    role: "user",
  },
  {
    id: "user-4",
    name: "Alice Wilson",
    email: "alice@example.com",
    avatar: "👩‍💻",
    role: "admin",
  },
];

// Mock Acceptance Criteria
export const mockAcceptanceCriteria: Record<string, AcceptanceCriterion[]> = {
  "FEAT-001": [
    {
      id: "ac-1",
      description: "User can sign up with email and password",
      completed: true,
      order: 1,
    },
    {
      id: "ac-2",
      description: "Email verification is required before account activation",
      completed: true,
      order: 2,
    },
    {
      id: "ac-3",
      description: "Password must be at least 8 characters long",
      completed: false,
      order: 3,
    },
  ],
  "FEAT-002": [
    {
      id: "ac-4",
      description: "Dashboard shows key metrics for current sprint",
      completed: true,
      order: 1,
    },
    {
      id: "ac-5",
      description: "Analytics can be filtered by date range",
      completed: false,
      order: 2,
    },
  ],
  "FEAT-005": [
    {
      id: "ac-6",
      description: "System sends email notifications for all feature updates",
      completed: false,
      order: 1,
    },
    {
      id: "ac-7",
      description: "Email templates support HTML formatting",
      completed: false,
      order: 2,
    },
    {
      id: "ac-8",
      description: "Users can customize notification preferences",
      completed: false,
      order: 3,
    },
  ],
  "FEAT-006": [
    {
      id: "ac-9",
      description: "Rate limiting is enforced on all API endpoints",
      completed: false,
      order: 1,
    },
    {
      id: "ac-10",
      description: "Different rate limits for different user tiers",
      completed: false,
      order: 2,
    },
  ],
  "FEAT-007": [
    {
      id: "ac-11",
      description: "Users can filter features by multiple criteria",
      completed: false,
      order: 1,
    },
    {
      id: "ac-12",
      description: "Search supports date range filtering",
      completed: false,
      order: 2,
    },
  ],
  "FEAT-008": [
    {
      id: "ac-13",
      description: "Users can upload and change profile avatar",
      completed: false,
      order: 1,
    },
    {
      id: "ac-14",
      description: "Notification settings can be customized",
      completed: false,
      order: 2,
    },
  ],
  "FEAT-009": [
    {
      id: "ac-15",
      description: "Export feature data to CSV format",
      completed: false,
      order: 1,
    },
    {
      id: "ac-16",
      description: "Include custom field filtering in export",
      completed: false,
      order: 2,
    },
  ],
  "FEAT-010": [
    {
      id: "ac-17",
      description: "Real-time presence indicators for collaborators",
      completed: false,
      order: 1,
    },
    {
      id: "ac-18",
      description: "Live editing with instant updates for all team members",
      completed: false,
      order: 2,
    },
    {
      id: "ac-19",
      description: "Conflict resolution for simultaneous edits",
      completed: false,
      order: 3,
    },
  ],
};

// Mock Attachments
export const mockAttachments: Record<string, Attachment[]> = {
  "FEAT-001": [
    {
      id: "att-1",
      name: "wireframe.png",
      type: "image",
      url: "https://via.placeholder.com/300x200",
      uploadedAt: "2024-11-01T10:00:00Z",
      uploadedBy: mockUsers[0],
    },
    {
      id: "att-2",
      name: "requirements.pdf",
      type: "document",
      url: "/docs/requirements.pdf",
      uploadedAt: "2024-11-01T09:00:00Z",
      uploadedBy: mockUsers[0],
    },
  ],
  "FEAT-002": [
    {
      id: "att-3",
      name: "design-mockup.figma",
      type: "document",
      url: "https://figma.com/file/xyz",
      uploadedAt: "2024-10-28T14:30:00Z",
      uploadedBy: mockUsers[1],
    },
  ],
  "FEAT-005": [
    {
      id: "att-4",
      name: "email-templates.zip",
      type: "document",
      url: "https://example.com/email-templates.zip",
      uploadedAt: "2024-11-01T14:00:00Z",
      uploadedBy: mockUsers[1],
    },
  ],
  "FEAT-006": [
    {
      id: "att-5",
      name: "rate-limiting-spec.pdf",
      type: "document",
      url: "https://example.com/rate-limiting-spec.pdf",
      uploadedAt: "2024-11-01T10:00:00Z",
      uploadedBy: mockUsers[2],
    },
  ],
  "FEAT-007": [],
  "FEAT-008": [
    {
      id: "att-6",
      name: "user-profile-mockup.png",
      type: "image",
      url: "https://via.placeholder.com/400x300",
      uploadedAt: "2024-11-01T09:00:00Z",
      uploadedBy: mockUsers[3],
    },
  ],
  "FEAT-009": [],
  "FEAT-010": [
    {
      id: "att-7",
      name: "websocket-architecture.pdf",
      type: "document",
      url: "https://example.com/websocket-architecture.pdf",
      uploadedAt: "2024-11-02T08:00:00Z",
      uploadedBy: mockUsers[0],
    },
  ],
};

// Mock Test Cases
export const mockTestCases: Record<string, TestCase[]> = {
  "FEAT-001": [
    {
      id: "test-1",
      name: "Sign up with valid credentials",
      description:
        "User should be able to sign up with valid email and password",
      status: "passed",
      executedDate: "2024-11-02T08:00:00Z",
      executedBy: mockUsers[2],
    },
    {
      id: "test-2",
      name: "Sign up with invalid email",
      description: "System should reject invalid email formats",
      status: "passed",
      executedDate: "2024-11-02T08:15:00Z",
      executedBy: mockUsers[2],
    },
    {
      id: "test-3",
      name: "Password validation",
      description: "System should validate password strength",
      status: "pending",
    },
  ],
  "FEAT-002": [
    {
      id: "test-4",
      name: "Dashboard loads without errors",
      description: "Dashboard page should load successfully",
      status: "passed",
      executedDate: "2024-11-01T16:00:00Z",
      executedBy: mockUsers[3],
    },
  ],
  "FEAT-005": [
    {
      id: "test-5",
      name: "Email notification sent on feature update",
      description: "System should send email when feature is updated",
      status: "pending",
    },
    {
      id: "test-6",
      name: "HTML email template rendering",
      description: "Email templates should render correctly with HTML",
      status: "pending",
    },
  ],
  "FEAT-006": [
    {
      id: "test-7",
      name: "Rate limiting enforced on API calls",
      description: "API should reject requests exceeding rate limit",
      status: "pending",
    },
  ],
  "FEAT-007": [
    {
      id: "test-8",
      name: "Advanced filter by date range",
      description: "Users should be able to filter features by date range",
      status: "pending",
    },
    {
      id: "test-9",
      name: "Multi-criteria search",
      description:
        "Search should support multiple filter criteria simultaneously",
      status: "pending",
    },
  ],
  "FEAT-008": [
    {
      id: "test-10",
      name: "Profile avatar upload",
      description: "Users should be able to upload profile avatar",
      status: "pending",
    },
  ],
  "FEAT-009": [
    {
      id: "test-11",
      name: "CSV export functionality",
      description: "Feature data should be exportable to CSV format",
      status: "pending",
    },
  ],
  "FEAT-010": [
    {
      id: "test-12",
      name: "Real-time presence indicator",
      description: "Collaborators should see presence of other users",
      status: "pending",
    },
    {
      id: "test-13",
      name: "Live editing synchronization",
      description: "Edits should be synchronized in real-time",
      status: "pending",
    },
  ],
};

// Mock Comments
export const mockComments: Record<string, Comment[]> = {
  "FEAT-001": [
    {
      id: "comment-1",
      author: mockUsers[1],
      content:
        "Great feature! Can we also add two-factor authentication in the future?",
      createdAt: "2024-11-02T14:00:00Z",
      resolved: false,
      replies: [
        {
          id: "comment-2",
          author: mockUsers[0],
          content: "Definitely! We have that in our roadmap for Q1 2025.",
          createdAt: "2024-11-02T14:30:00Z",
          resolved: false,
        },
        {
          id: "comment-2b",
          author: mockUsers[1],
          content:
            "Perfect! Let's discuss the implementation details in the next sprint planning.",
          createdAt: "2024-11-02T15:15:00Z",
          resolved: false,
        },
      ],
    },
    {
      id: "comment-3",
      author: mockUsers[2],
      content: "I noticed the password field should have a strength indicator.",
      createdAt: "2024-11-02T15:00:00Z",
      resolved: true,
      replies: [
        {
          id: "comment-3b",
          author: mockUsers[0],
          content:
            "Good catch! I've added a password strength meter to the acceptance criteria.",
          createdAt: "2024-11-02T15:45:00Z",
          resolved: true,
        },
      ],
    },
    {
      id: "comment-4",
      author: mockUsers[3],
      content: "We need to ensure GDPR compliance for user data storage.",
      createdAt: "2024-11-03T10:30:00Z",
      resolved: false,
      replies: [
        {
          id: "comment-4b",
          author: mockUsers[1],
          content:
            "Great point! I'll add that to the security requirements section.",
          createdAt: "2024-11-03T11:00:00Z",
          resolved: false,
        },
        {
          id: "comment-4c",
          author: mockUsers[0],
          content:
            "Let's also schedule a security review session with the team.",
          createdAt: "2024-11-03T11:30:00Z",
          resolved: false,
        },
      ],
    },
    {
      id: "comment-5",
      author: mockUsers[2],
      content:
        "Password validation needs improvement. Currently accepts weak passwords.",
      createdAt: "2024-11-03T14:30:00Z",
      resolved: false,
    },
  ],
  "FEAT-002": [
    {
      id: "comment-6",
      author: mockUsers[3],
      content: "Charts look beautiful! Can we add export functionality?",
      createdAt: "2024-11-01T17:00:00Z",
      resolved: false,
      replies: [
        {
          id: "comment-6b",
          author: mockUsers[1],
          content: "Good idea! We can add PDF and CSV export options.",
          createdAt: "2024-11-01T17:45:00Z",
          resolved: false,
        },
        {
          id: "comment-6c",
          author: mockUsers[3],
          content: "Perfect! That would be really useful for our reports.",
          createdAt: "2024-11-01T18:15:00Z",
          resolved: false,
        },
      ],
    },
    {
      id: "comment-7",
      author: mockUsers[0],
      content: "Dashboard performance is excellent! Loads in under 2 seconds.",
      createdAt: "2024-11-02T09:00:00Z",
      resolved: false,
    },
    {
      id: "comment-8",
      author: mockUsers[1],
      content: "Can we add dark mode support to the dashboard?",
      createdAt: "2024-11-03T13:00:00Z",
      resolved: false,
      replies: [
        {
          id: "comment-8b",
          author: mockUsers[3],
          content: "That's already in the backlog for the next phase.",
          createdAt: "2024-11-03T13:45:00Z",
          resolved: false,
        },
      ],
    },
    {
      id: "comment-9",
      author: mockUsers[2],
      content:
        "Need to add real-time data refresh. Currently shows 5-minute-old data.",
      createdAt: "2024-11-03T15:00:00Z",
      resolved: false,
    },
  ],
  "FEAT-005": [
    {
      id: "comment-10",
      author: mockUsers[2],
      content:
        "Need to support HTML templates for emails. Should we use a template engine?",
      createdAt: "2024-11-03T12:00:00Z",
      resolved: false,
      replies: [
        {
          id: "comment-10b",
          author: mockUsers[1],
          content: "Good point! Let's use Handlebars for template rendering.",
          createdAt: "2024-11-03T12:30:00Z",
          resolved: false,
        },
      ],
    },
  ],
  "FEAT-006": [
    {
      id: "comment-11",
      author: mockUsers[3],
      content: "How will we handle rate limiting for different user tiers?",
      createdAt: "2024-11-02T16:00:00Z",
      resolved: false,
    },
  ],
  "FEAT-009": [
    {
      id: "comment-12",
      author: mockUsers[0],
      content: "CSV export is great! Can we also support XLSX format?",
      createdAt: "2024-11-02T11:00:00Z",
      resolved: false,
    },
  ],
  "FEAT-010": [
    {
      id: "comment-13",
      author: mockUsers[1],
      content:
        "Real-time collaboration is critical for our workflow. When can we start on this?",
      createdAt: "2024-11-02T15:00:00Z",
      resolved: false,
      replies: [
        {
          id: "comment-13b",
          author: mockUsers[0],
          content:
            "Planning to start after current sprint. Will need to spike on WebSocket architecture.",
          createdAt: "2024-11-02T15:45:00Z",
          resolved: false,
        },
      ],
    },
  ],
};

// Mock Activities
export const mockActivities: Record<string, FeatureActivity[]> = {
  "FEAT-001": [
    {
      id: "activity-1",
      type: "status_changed",
      user: mockUsers[2],
      field: "status",
      oldValue: "in-progress",
      newValue: "in-progress",
      timestamp: "2024-11-03T14:30:00Z",
      description: "added a comment on the feature",
    },
    {
      id: "activity-2",
      type: "commented",
      user: mockUsers[2],
      timestamp: "2024-11-03T14:30:00Z",
      description: 'added comment: "Password validation needs improvement"',
    },
    {
      id: "activity-3",
      type: "status_changed",
      user: mockUsers[1],
      field: "status",
      oldValue: "planned",
      newValue: "in-progress",
      timestamp: "2024-11-02T10:00:00Z",
      description: "moved from Planned to In Progress",
    },
    {
      id: "activity-4",
      type: "assigned",
      user: mockUsers[0],
      timestamp: "2024-11-02T09:30:00Z",
      description: "assigned to Bob Johnson",
    },
    {
      id: "activity-5",
      type: "updated",
      user: mockUsers[0],
      field: "priority",
      oldValue: "high",
      newValue: "critical",
      timestamp: "2024-11-01T16:00:00Z",
      description: "changed priority from High to Critical",
    },
    {
      id: "activity-6",
      type: "assigned",
      user: mockUsers[0],
      timestamp: "2024-11-01T09:00:00Z",
      description: "assigned to John Doe",
    },
    {
      id: "activity-7",
      type: "updated",
      user: mockUsers[1],
      timestamp: "2024-10-31T11:00:00Z",
      description: 'added tag "security"',
    },
    {
      id: "activity-8",
      type: "created",
      user: mockUsers[0],
      timestamp: "2024-10-28T08:00:00Z",
      description: "created this feature",
    },
  ],
  "FEAT-002": [
    {
      id: "activity-9",
      type: "status_changed",
      user: mockUsers[3],
      field: "status",
      oldValue: "backlog",
      newValue: "planned",
      timestamp: "2024-11-03T10:00:00Z",
      description: "moved from Backlog to Planned",
    },
    {
      id: "activity-10",
      type: "updated",
      user: mockUsers[1],
      field: "description",
      timestamp: "2024-11-02T14:00:00Z",
      description: "updated the feature description",
    },
    {
      id: "activity-11",
      type: "assigned",
      user: mockUsers[1],
      timestamp: "2024-11-01T10:00:00Z",
      description: "assigned to Alice Wilson",
    },
    {
      id: "activity-12",
      type: "updated",
      user: mockUsers[0],
      field: "storyPoints",
      oldValue: "5",
      newValue: "8",
      timestamp: "2024-10-30T13:00:00Z",
      description: "changed story points from 5 to 8",
    },
    {
      id: "activity-13",
      type: "created",
      user: mockUsers[1],
      timestamp: "2024-10-25T10:00:00Z",
      description: "created this feature",
    },
  ],
  "FEAT-005": [
    {
      id: "activity-14",
      type: "status_changed",
      user: mockUsers[1],
      field: "status",
      oldValue: "backlog",
      newValue: "planned",
      timestamp: "2024-11-02T11:00:00Z",
      description: "moved from Backlog to Planned",
    },
    {
      id: "activity-15",
      type: "created",
      user: mockUsers[1],
      timestamp: "2024-10-29T10:00:00Z",
      description: "created this feature",
    },
  ],
  "FEAT-006": [
    {
      id: "activity-16",
      type: "status_changed",
      user: mockUsers[2],
      field: "status",
      oldValue: "planned",
      newValue: "in-progress",
      timestamp: "2024-11-02T09:00:00Z",
      description: "moved from Planned to In Progress",
    },
    {
      id: "activity-17",
      type: "assigned",
      user: mockUsers[0],
      timestamp: "2024-11-01T10:00:00Z",
      description: "assigned to Bob Johnson",
    },
    {
      id: "activity-18",
      type: "created",
      user: mockUsers[0],
      timestamp: "2024-10-30T08:00:00Z",
      description: "created this feature",
    },
  ],
  "FEAT-007": [
    {
      id: "activity-19",
      type: "created",
      user: mockUsers[0],
      timestamp: "2024-11-01T11:00:00Z",
      description: "created this feature",
    },
  ],
  "FEAT-008": [
    {
      id: "activity-20",
      type: "created",
      user: mockUsers[3],
      timestamp: "2024-11-01T10:00:00Z",
      description: "created this feature",
    },
  ],
  "FEAT-009": [
    {
      id: "activity-21",
      type: "status_changed",
      user: mockUsers[1],
      field: "status",
      oldValue: "backlog",
      newValue: "planned",
      timestamp: "2024-11-02T10:00:00Z",
      description: "moved from Backlog to Planned",
    },
    {
      id: "activity-22",
      type: "created",
      user: mockUsers[1],
      timestamp: "2024-10-31T14:00:00Z",
      description: "created this feature",
    },
  ],
  "FEAT-010": [
    {
      id: "activity-23",
      type: "created",
      user: mockUsers[0],
      timestamp: "2024-11-02T09:00:00Z",
      description: "created this feature",
    },
  ],
};

// Mock Feature Versions
export const mockFeatureVersions: Record<string, FeatureVersion[]> = {
  "FEAT-001": [
    {
      id: "v-1",
      featureId: "FEAT-001",
      version: 7,
      changes: [
        {
          field: "status",
          oldValue: "planned",
          newValue: "in-progress",
        },
      ],
      changedBy: mockUsers[1],
      changedDate: "2024-11-02T10:00:00Z",
    },
    {
      id: "v-2",
      featureId: "FEAT-001",
      version: 6,
      changes: [
        {
          field: "team",
          oldValue: "John Doe",
          newValue: "John Doe, Bob Johnson",
        },
      ],
      changedBy: mockUsers[0],
      changedDate: "2024-11-01T16:00:00Z",
    },
    {
      id: "v-3",
      featureId: "FEAT-001",
      version: 5,
      changes: [
        {
          field: "priority",
          oldValue: "high",
          newValue: "critical",
        },
      ],
      changedBy: mockUsers[1],
      changedDate: "2024-10-30T15:00:00Z",
    },
    {
      id: "v-4",
      featureId: "FEAT-001",
      version: 4,
      changes: [
        {
          field: "storyPoints",
          oldValue: "5",
          newValue: "8",
        },
      ],
      changedBy: mockUsers[0],
      changedDate: "2024-10-29T11:00:00Z",
    },
    {
      id: "v-5",
      featureId: "FEAT-001",
      version: 3,
      changes: [
        {
          field: "description",
          oldValue: "Basic auth system",
          newValue:
            "Comprehensive user authentication system with email verification and password reset functionality",
        },
      ],
      changedBy: mockUsers[1],
      changedDate: "2024-10-29T09:00:00Z",
    },
    {
      id: "v-6",
      featureId: "FEAT-001",
      version: 2,
      changes: [
        {
          field: "status",
          oldValue: "backlog",
          newValue: "planned",
        },
      ],
      changedBy: mockUsers[0],
      changedDate: "2024-10-28T14:00:00Z",
    },
    {
      id: "v-7",
      featureId: "FEAT-001",
      version: 1,
      changes: [
        {
          field: "created",
          oldValue: null,
          newValue: "User Authentication System",
        },
      ],
      changedBy: mockUsers[0],
      changedDate: "2024-10-28T08:00:00Z",
    },
  ],
  "FEAT-002": [
    {
      id: "v-8",
      featureId: "FEAT-002",
      version: 5,
      changes: [
        {
          field: "status",
          oldValue: "backlog",
          newValue: "planned",
        },
      ],
      changedBy: mockUsers[3],
      changedDate: "2024-11-03T10:00:00Z",
    },
    {
      id: "v-9",
      featureId: "FEAT-002",
      version: 4,
      changes: [
        {
          field: "storyPoints",
          oldValue: "5",
          newValue: "8",
        },
      ],
      changedBy: mockUsers[0],
      changedDate: "2024-10-30T13:00:00Z",
    },
    {
      id: "v-10",
      featureId: "FEAT-002",
      version: 3,
      changes: [
        {
          field: "owner",
          oldValue: "Unassigned",
          newValue: "Alice Wilson",
        },
      ],
      changedBy: mockUsers[1],
      changedDate: "2024-10-29T10:00:00Z",
    },
    {
      id: "v-11",
      featureId: "FEAT-002",
      version: 2,
      changes: [
        {
          field: "description",
          oldValue: "Dashboard with charts",
          newValue:
            "Interactive analytics dashboard with real-time metrics, charts, and performance indicators",
        },
      ],
      changedBy: mockUsers[1],
      changedDate: "2024-10-27T15:00:00Z",
    },
    {
      id: "v-12",
      featureId: "FEAT-002",
      version: 1,
      changes: [
        {
          field: "created",
          oldValue: null,
          newValue: "Dashboard Analytics",
        },
      ],
      changedBy: mockUsers[1],
      changedDate: "2024-10-25T10:00:00Z",
    },
  ],
  "FEAT-005": [
    {
      id: "v-13",
      featureId: "FEAT-005",
      version: 2,
      changes: [
        {
          field: "status",
          oldValue: "backlog",
          newValue: "planned",
        },
      ],
      changedBy: mockUsers[1],
      changedDate: "2024-11-02T11:00:00Z",
    },
    {
      id: "v-14",
      featureId: "FEAT-005",
      version: 1,
      changes: [
        {
          field: "created",
          oldValue: null,
          newValue: "Email Notifications",
        },
      ],
      changedBy: mockUsers[1],
      changedDate: "2024-10-29T10:00:00Z",
    },
  ],
  "FEAT-006": [
    {
      id: "v-15",
      featureId: "FEAT-006",
      version: 2,
      changes: [
        {
          field: "status",
          oldValue: "planned",
          newValue: "in-progress",
        },
      ],
      changedBy: mockUsers[2],
      changedDate: "2024-11-02T09:00:00Z",
    },
    {
      id: "v-16",
      featureId: "FEAT-006",
      version: 1,
      changes: [
        {
          field: "created",
          oldValue: null,
          newValue: "API Rate Limiting",
        },
      ],
      changedBy: mockUsers[0],
      changedDate: "2024-10-30T08:00:00Z",
    },
  ],
  "FEAT-007": [
    {
      id: "v-17",
      featureId: "FEAT-007",
      version: 1,
      changes: [
        {
          field: "created",
          oldValue: null,
          newValue: "Advanced Search Filters",
        },
      ],
      changedBy: mockUsers[0],
      changedDate: "2024-11-01T11:00:00Z",
    },
  ],
  "FEAT-008": [
    {
      id: "v-18",
      featureId: "FEAT-008",
      version: 1,
      changes: [
        {
          field: "created",
          oldValue: null,
          newValue: "User Profile Customization",
        },
      ],
      changedBy: mockUsers[3],
      changedDate: "2024-11-01T10:00:00Z",
    },
  ],
  "FEAT-009": [
    {
      id: "v-19",
      featureId: "FEAT-009",
      version: 2,
      changes: [
        {
          field: "status",
          oldValue: "backlog",
          newValue: "planned",
        },
      ],
      changedBy: mockUsers[1],
      changedDate: "2024-11-02T10:00:00Z",
    },
    {
      id: "v-20",
      featureId: "FEAT-009",
      version: 1,
      changes: [
        {
          field: "created",
          oldValue: null,
          newValue: "Data Export to CSV",
        },
      ],
      changedBy: mockUsers[1],
      changedDate: "2024-10-31T14:00:00Z",
    },
  ],
  "FEAT-010": [
    {
      id: "v-21",
      featureId: "FEAT-010",
      version: 1,
      changes: [
        {
          field: "created",
          oldValue: null,
          newValue: "Real-time Collaboration",
        },
      ],
      changedBy: mockUsers[0],
      changedDate: "2024-11-02T09:00:00Z",
    },
  ],
};

// Mock Features with extended data
export const mockFeatures: Feature[] = [
  {
    id: "FEAT-001",
    title: "User Authentication System",
    description:
      "Implement a secure user authentication system with email and password login, password reset functionality, and session management.",
    status: "in-progress",
    priority: "critical",
    type: "feature",
    owner: mockUsers[0],
    team: [mockUsers[0], mockUsers[2]],
    tags: ["authentication", "security", "backend"],
    storyPoints: 13,
    dueDate: "2024-11-15",
    epic: "EPIC-001",
    createdAt: "2024-10-28T08:00:00Z",
    updatedAt: "2024-11-02T10:00:00Z",
    acceptanceCriteria: mockAcceptanceCriteria["FEAT-001"],
    attachments: mockAttachments["FEAT-001"],
    comments: mockComments["FEAT-001"],
    activities: mockActivities["FEAT-001"],
    sprint: "SPRINT-001",
    blocks: ["FEAT-003"],
    blockedBy: [],
  },
  {
    id: "FEAT-002",
    title: "Dashboard Analytics",
    description:
      "Build an interactive dashboard that displays key analytics and metrics for the current sprint including velocity, burndown, and team productivity.",
    status: "planned",
    priority: "high",
    type: "feature",
    owner: mockUsers[1],
    team: [mockUsers[1], mockUsers[3]],
    tags: ["analytics", "dashboard", "frontend"],
    storyPoints: 8,
    dueDate: "2024-11-20",
    epic: "EPIC-002",
    createdAt: "2024-10-25T10:00:00Z",
    updatedAt: "2024-11-01T14:00:00Z",
    acceptanceCriteria: mockAcceptanceCriteria["FEAT-002"],
    attachments: mockAttachments["FEAT-002"],
    comments: mockComments["FEAT-002"],
    activities: mockActivities["FEAT-002"],
    sprint: "SPRINT-001",
    blocks: [],
    blockedBy: ["FEAT-001"],
  },
  {
    id: "FEAT-003",
    title: "Email Notifications",
    description:
      "Send email notifications for important events like task assignments, status changes, and comments.",
    status: "backlog",
    priority: "medium",
    type: "feature",
    owner: mockUsers[2],
    tags: ["notifications", "email", "backend"],
    storyPoints: 5,
    createdAt: "2024-10-20T12:00:00Z",
    updatedAt: "2024-10-20T12:00:00Z",
    activities: [],
    blocks: [],
    blockedBy: ["FEAT-001"],
  },
  {
    id: "FEAT-004",
    title: "Dark Mode Toggle",
    description:
      "Add a dark mode toggle to allow users to switch between light and dark themes.",
    status: "backlog",
    priority: "low",
    type: "feature",
    owner: mockUsers[3],
    tags: ["ui", "frontend", "accessibility"],
    storyPoints: 3,
    createdAt: "2024-11-01T09:00:00Z",
    updatedAt: "2024-11-01T09:00:00Z",
    activities: [],
    blocks: [],
    blockedBy: [],
  },
  {
    id: "FEAT-005",
    title: "Dark mode toggle",
    description:
      "Implement email notification system for important feature updates and user activities. Support for HTML templates and personalization.",
    status: "planned",
    priority: "high",
    type: "feature",
    owner: mockUsers[1],
    team: [mockUsers[1], mockUsers[2]],
    tags: ["notifications", "email", "backend"],
    storyPoints: 8,
    dueDate: "2024-11-20",
    sprint: "SPRINT-002",
    createdAt: "2024-10-29T10:00:00Z",
    updatedAt: "2024-11-02T14:00:00Z",
    activities: [],
    blocks: [],
    blockedBy: [],
  },
  {
    id: "FEAT-006",
    title: "API Rate Limiting",
    description:
      "Implement rate limiting on API endpoints to prevent abuse and ensure fair usage across clients.",
    status: "in-progress",
    priority: "high",
    type: "feature",
    owner: mockUsers[2],
    team: [mockUsers[2]],
    tags: ["api", "security", "backend"],
    storyPoints: 5,
    dueDate: "2024-11-15",
    sprint: "SPRINT-001",
    createdAt: "2024-10-30T08:00:00Z",
    updatedAt: "2024-11-03T09:00:00Z",
    activities: [],
    blocks: ["FEAT-007"],
    blockedBy: [],
  },
  {
    id: "FEAT-007",
    title: "Advanced Search Filters",
    description:
      "Add advanced filtering and search capabilities to allow users to find features by multiple criteria including date range, status, and custom tags.",
    status: "backlog",
    priority: "medium",
    type: "feature",
    owner: mockUsers[0],
    team: [mockUsers[0], mockUsers[1]],
    tags: ["search", "ui", "frontend"],
    storyPoints: 13,
    dueDate: "2024-12-01",
    createdAt: "2024-11-01T11:00:00Z",
    updatedAt: "2024-11-01T11:00:00Z",
    activities: [],
    blocks: [],
    blockedBy: ["FEAT-006"],
  },
  {
    id: "FEAT-008",
    title: "User Profile Customization",
    description:
      "Allow users to customize their profile settings including avatar, bio, preferences, and notification settings.",
    status: "backlog",
    priority: "low",
    type: "feature",
    owner: mockUsers[3],
    team: [mockUsers[3]],
    tags: ["user-profile", "frontend", "ui"],
    storyPoints: 5,
    createdAt: "2024-11-01T10:00:00Z",
    updatedAt: "2024-11-01T10:00:00Z",
    activities: [],
    blocks: [],
    blockedBy: [],
  },
  {
    id: "FEAT-009",
    title: "Data Export to CSV",
    description:
      "Implement functionality to export feature data and reports to CSV format for external analysis and reporting.",
    status: "planned",
    priority: "medium",
    type: "feature",
    owner: mockUsers[1],
    team: [mockUsers[1], mockUsers[3]],
    tags: ["export", "reporting", "backend"],
    storyPoints: 3,
    dueDate: "2024-11-25",
    sprint: "SPRINT-002",
    createdAt: "2024-10-31T14:00:00Z",
    updatedAt: "2024-11-02T10:00:00Z",
    activities: [],
    blocks: [],
    blockedBy: [],
  },
  {
    id: "FEAT-010",
    title: "Real-time Collaboration",
    description:
      "Enable real-time collaboration features including live editing, presence indicators, and instant updates for team members working on the same feature.",
    status: "backlog",
    priority: "critical",
    type: "feature",
    owner: mockUsers[0],
    team: [mockUsers[0], mockUsers[2], mockUsers[3]],
    tags: ["collaboration", "realtime", "websocket"],
    storyPoints: 21,
    dueDate: "2024-12-15",
    createdAt: "2024-11-02T09:00:00Z",
    updatedAt: "2024-11-02T09:00:00Z",
    activities: [],
    blocks: [],
    blockedBy: [],
  },
];

// Mock Sprints
export const mockSprints: Sprint[] = [
  {
    id: "SPRINT-001",
    name: "Sprint 1: Authentication & Analytics",
    goal: "Implement core authentication system and analytics dashboard",
    startDate: "2024-11-01",
    endDate: "2024-11-15",
    status: "active",
    features: [mockFeatures[0], mockFeatures[1]],
    velocity: 21,
    capacity: 40,
    createdAt: "2024-10-25T08:00:00Z",
  },
  {
    id: "SPRINT-002",
    name: "Sprint 2: Notifications & Polish",
    goal: "Add email notifications and UI improvements",
    startDate: "2024-11-16",
    endDate: "2024-11-30",
    status: "planning",
    features: [mockFeatures[2], mockFeatures[3]],
    velocity: 8,
    capacity: 30,
    createdAt: "2024-10-25T08:00:00Z",
  },
];

// Mock WSJF Scores
export const mockWSJFScores: Record<string, WSJFScore> = {
  "FEAT-001": {
    userBusinessValue: 9,
    timeCriticality: 10,
    riskReduction: 8,
    jobSize: 13,
    score: (9 + 10 + 8) / 13, // ~1.69
  },
  "FEAT-002": {
    userBusinessValue: 8,
    timeCriticality: 7,
    riskReduction: 6,
    jobSize: 8,
    score: (8 + 7 + 6) / 8, // ~2.625
  },
  "FEAT-003": {
    userBusinessValue: 6,
    timeCriticality: 5,
    riskReduction: 4,
    jobSize: 5,
    score: (6 + 5 + 4) / 5, // ~3.0
  },
  "FEAT-004": {
    userBusinessValue: 4,
    timeCriticality: 2,
    riskReduction: 3,
    jobSize: 3,
    score: (4 + 2 + 3) / 3, // ~3.0
  },
};

// Mock RICE Scores
export const mockRICEScores: Record<string, RICEScore> = {
  "FEAT-001": {
    reach: 10000,
    impact: 3,
    confidence: 100,
    effort: 13,
    score: (10000 * 3 * 1.0) / 13, // ~2307.69
  },
  "FEAT-002": {
    reach: 5000,
    impact: 2,
    confidence: 90,
    effort: 8,
    score: (5000 * 2 * 0.9) / 8, // ~1125.0
  },
  "FEAT-003": {
    reach: 8000,
    impact: 1,
    confidence: 85,
    effort: 5,
    score: (8000 * 1 * 0.85) / 5, // ~1360.0
  },
  "FEAT-004": {
    reach: 3000,
    impact: 0.5,
    confidence: 80,
    effort: 3,
    score: (3000 * 0.5 * 0.8) / 3, // ~400.0
  },
};

// Mock MoSCoW Categories
export const mockMoSCoWCategories: Record<string, MoSCoWCategory> = {
  "FEAT-001": {
    category: "must",
    justification: "Core authentication is critical for product launch",
  },
  "FEAT-002": {
    category: "must",
    justification: "Analytics are essential for stakeholder reporting",
  },
  "FEAT-003": {
    category: "should",
    justification: "Important for user engagement but can be delayed",
  },
  "FEAT-004": {
    category: "could",
    justification: "Nice-to-have feature for user experience enhancement",
  },
};

// Mock Priority Matrix Scores (Impact 1-10 vs Effort 1-10)
export const mockPriorityMatrixScores: Record<
  string,
  { impact: number; effort: number }
> = {
  "FEAT-001": { impact: 9, effort: 8 }, // Major Project (High Impact, High Effort)
  "FEAT-002": { impact: 8, effort: 5 }, // Quick Win (High Impact, Low Effort)
  "FEAT-003": { impact: 6, effort: 4 }, // Quick Win (Medium Impact, Low Effort)
  "FEAT-004": { impact: 3, effort: 2 }, // Fill-in (Low Impact, Low Effort)
};
