export type DocumentType = 'prd' | 'design-doc' | 'tech-spec' | 'meeting-notes' | 'retrospective' | 'proposal' | 'requirements' | 'tutorial' | 'guide' | 'other';
export type DocumentStatus = 'draft' | 'in-review' | 'approved' | 'archived';
export type DocumentCategory = 'product' | 'engineering' | 'design' | 'operations' | 'marketing' | 'sales' | 'other';

export interface DocumentTag {
  id: string;
  name: string;
  color: string;
}

export interface DocumentAccess {
  userId: string;
  userName: string;
  accessLevel: 'view' | 'comment' | 'edit' | 'owner';
  addedAt: string;
}

export interface DocumentVersion {
  id: string;
  versionNumber: number;
  createdAt: string;
  createdBy: string;
  changesSummary: string;
  fileSize: number;
  downloadUrl?: string;
}

export interface DocumentComment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  mentions?: string[];
  replies?: DocumentComment[];
}

export interface Document {
  id: string;
  title: string;
  description: string;
  type: DocumentType;
  category: DocumentCategory;
  status: DocumentStatus;
  
  content?: string;
  summary?: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
  
  // File Info
  fileSize: number; // in bytes
  fileType: string; // .pdf, .docx, .md, etc
  fileName: string;
  
  // Organization
  folder?: string;
  tags: DocumentTag[];
  relatedGoals?: string[]; // Goal IDs
  relatedFeatures?: string[]; // Feature IDs
  relatedReleases?: string[]; // Release IDs
  
  // Collaboration
  owner: string;
  collaborators: DocumentAccess[];
  
  // Versioning
  currentVersion: number;
  versions: DocumentVersion[];
  
  // Engagement
  viewCount: number;
  downloadCount: number;
  lastViewedAt?: string;
  lastViewedBy?: string;
  
  // Comments & Feedback
  comments: DocumentComment[];
  
  // Sharing
  isPublic: boolean;
  shareToken?: string;
  externalAccessible: boolean;
  
  // Additional
  isFavorite?: boolean;
  isPinned?: boolean;
  notes?: string;
}

export interface DocumentFolder {
  id: string;
  name: string;
  description?: string;
  parent?: string;
  createdBy: string;
  createdAt: string;
  documents: string[]; // Document IDs
  subFolders?: string[]; // Folder IDs
}

export interface DocumentFilter {
  type?: DocumentType[];
  category?: DocumentCategory[];
  status?: DocumentStatus[];
  owner?: string;
  tags?: string[];
}
