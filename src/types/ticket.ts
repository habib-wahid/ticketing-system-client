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
