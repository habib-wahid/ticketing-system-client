
export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'closed';
  type?: 'incident' | 'problem' | 'question' | 'suggestion';
  product: string;
  employee: string;
  company: string;
  startDate: string;
  endDate: string;
  assignee?: string;
  createdAt: string;
  location?: string;
  amount?: number;
}
