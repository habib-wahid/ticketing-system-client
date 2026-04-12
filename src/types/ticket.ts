export type TicketFilterStatus = 'PENDING' | 'RESOLVED';

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // current page (0-indexed)
  size: number;
  last: boolean;
  first: boolean;
}

export interface TicketCreatedBy {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface TicketSlaSummary {
  slaId: string;
  name: string;
}

export interface Ticket {
  // New API fields
  ticketId: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  createdBy?: TicketCreatedBy;
  assignedToUser?: string | null;
  assignedAt?: string | null;
  resolvedAt?: string | null;
  closedAt?: string | null;
  sla?: TicketSlaSummary | null;
  responseDeadline?: string | null;
  escalationDueAt?: string | null;
  nextReminderAt?: string | null;
  slaBreachedAt?: string | null;
  escalationLevel?: number;
  tags?: string[];
  customFields?: Record<string, any>;
  createdAt: string;
  updatedAt?: string | null;

  // Legacy fields for backward compatibility
  id?: string;
  employee?: string;
  amount?: number;
  startDate?: string;
  endDate?: string;
  product?: string;
  assignee?: string;
  location?: string;
  type?: string;
}

// ---- Full detail response (GET /api/tickets/{ticketId}) ----

export interface TicketAuthorDetail {
  userId: string;
  username?: string;
  email?: string;
}

export interface TicketCommentDetail {
  commentId: string;
  author: TicketAuthorDetail;
  text: string;
  internal: boolean;
  attachments?: string[];
  createdAt: string;
}

export interface TicketAttachmentDetail {
  attachmentId: string;
  filename: string;
  s3Url: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface TicketStatusHistoryDetail {
  fromStatus: string;
  toStatus: string;
  changedBy: string;
  changedAt: string;
  reason?: string;
}

export interface TicketSlaEventDetail {
  eventType: string;
  occurredAt: string;
  description?: string;
}

export interface TicketDetail {
  ticketId: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  createdBy?: { userId: string; role?: string };
  assignedToUserId?: string | null;
  assignedAt?: string | null;
  resolvedAt?: string | null;
  closedAt?: string | null;
  sla?: TicketSlaSummary | null;
  responseDeadline?: string | null;
  escalationDueAt?: string | null;
  nextReminderAt?: string | null;
  slaBreachedAt?: string | null;
  escalationLevel?: number;
  comments?: TicketCommentDetail[];
  attachments?: TicketAttachmentDetail[];
  statusHistory?: TicketStatusHistoryDetail[];
  slaEvents?: TicketSlaEventDetail[];
  tags?: string[];
  customFields?: Record<string, unknown>;
  createdAt: string;
  updatedAt?: string | null;
}
