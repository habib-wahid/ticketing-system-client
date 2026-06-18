export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export const TICKET_PRIORITIES: TicketPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export interface SlaPolicyCategory {
  id: string;
  name: string;
}

export interface SlaPolicyResponse {
  id: string;
  name: string;
  category: SlaPolicyCategory | null;
  priority: TicketPriority;
  firstResponseTimeHours: number;
  resolutionTimeHours: number;
  escalationAfterHours: number;
  reminderThreshHoldHours: number;
  active: boolean;
  updatedBy: string | null;
  updatedAt: string | null;
  createdAt: string | null;
}

export interface SlaPolicyCreateRequest {
  name: string;
  complaintCategoryId: string;
  priority: TicketPriority;
  firstResponseTimeHours: number;
  resolutionTimeHours: number;
  escalationAfterHours: number;
  reminderThreshHoldHours: number;
  active?: boolean;
  updatedBy?: string;
}

// Note: the backend update endpoint uses legacy field names that map onto the
// same entity fields as the create request.
export interface SlaPolicyUpdateRequest {
  name?: string;
  responseTimeHours?: number;
  resolutionTimeHours?: number;
  escalationAfterHours?: number;
  reminderIntervalMinutes?: number;
  active?: boolean;
  updatedBy?: string;
}
