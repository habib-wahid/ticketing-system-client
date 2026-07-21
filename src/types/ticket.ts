export type TicketFilterStatus = 'PENDING' | 'RESOLVED';

export interface UserTicketStats {
  totalTickets: number;
  assignedTickets: number;
  resolvedTickets: number;
}

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
  name: string;
  role: string;
}

export interface TicketAssignedTo {
  userId: string;
  name: string;
  role: string;
}

export interface TicketSlaSummary {
  deadline: string;
  remainingMinutes: number;
  breached: boolean;
}

export interface TicketDistributedBy {
  userId: string;
  name: string;
  role: string;
}

export type TicketAssignmentAction =
  | 'AUTO_ROUTED'
  | 'DISTRIBUTED'
  | 'REASSIGNED'
  | 'RETURNED_TO_DISTRIBUTOR'
  | 'SYSTEM';

export interface TicketAssignmentHistoryDetail {
  userId: string;
  name: string;
  role: string;
  fromAt: string;
  toAt?: string | null;
  durationMinutes?: number | null;
  action: TicketAssignmentAction;
  actedByUserId: string;
  actedByName: string;
  reason?: string;
  distributedByUserId?: string | null;
}

export interface Ticket {
  ticketId: string;
  title: string;
  description: string;
  category: { id: string; name: string };
  priority: string;
  status: string;
  createdBy?: TicketCreatedBy | null;
  assignedTo?: TicketAssignedTo | null;
  distributedBy?: TicketDistributedBy | null;
  assignedAt?: string | null;
  resolvedAt?: string | null;
  closedAt?: string | null;
  slaPolicyId?: string | null;
  sla?: TicketSlaSummary | null;
  responseDeadline?: string | null;
  escalationDueAt?: string | null;
  nextReminderAt?: string | null;
  slaBreachedAt?: string | null;
  escalationLevel?: number;
  firstResponseMinutes?: number | null;
  responseBreached?: boolean | null;
  tags?: string[];
  attachments?: TicketAttachmentDetail[];
  customFields?: Record<string, unknown>;
  createdAt: string;
  updatedAt?: string | null;
}

// ---- Full detail response (GET /api/tickets/{ticketId}) ----

export interface TicketAuthorDetail {
  userId: string;
  fullName: string;
  role: string;
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
  filePath?: string;
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
  name: String;
  changedAt: string;
  reason?: string;
}

export interface TicketSlaEventDetail {
  eventType: string;
  triggeredAt: string;
  notifiedRoles: string[];
}

export interface TicketDetail {
  ticketId: string;
  title: string;
  description: string;
  category: { id: string; name: string };
  priority: string;
  status: string;
  createdBy?: TicketCreatedBy | null;
  assignedTo?: TicketAssignedTo | null;
  distributedBy?: TicketDistributedBy | null;
  assignedAt?: string | null;
  resolvedAt?: string | null;
  closedAt?: string | null;
  slaPolicyId?: string | null;
  sla?: TicketSlaSummary | null;
  responseDeadline?: string | null;
  escalationDueAt?: string | null;
  nextReminderAt?: string | null;
  slaBreachedAt?: string | null;
  escalationLevel?: number;
  comments?: TicketCommentDetail[];
  attachments?: TicketAttachmentDetail[];
  statusHistory?: TicketStatusHistoryDetail[];
  assignmentHistory?: TicketAssignmentHistoryDetail[];
  slaEvents?: TicketSlaEventDetail[];
  tags?: string[];
  customFields?: Record<string, unknown>;
  createdAt: string;
  updatedAt?: string | null;
}
