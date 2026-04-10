import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AssignedTickets } from '../AssignedTickets';
import { Ticket } from '../../types/ticket';

const mockTickets: Ticket[] = [
  {
    id: '1',
    title: 'Test Ticket 1',
    description: 'Description 1',
    priority: 'high',
    status: 'open',
    product: 'Product A',
    employee: 'Employee A',
    company: 'Company A',
    startDate: '2023-10-01',
    endDate: '2023-10-10',
    assignee: 'Assignee A',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Test Ticket 2',
    description: 'Description 2',
    priority: 'medium',
    status: 'in-progress',
    product: 'Product B',
    employee: 'Employee B',
    company: 'Company B',
    startDate: '2023-10-05',
    endDate: '2023-10-15',
    assignee: 'Assignee B',
    createdAt: new Date().toISOString(),
  }
];

describe('AssignedTickets Page', () => {
  it('renders the page title and breadcrumbs', () => {
    render(
      <MemoryRouter>
        <AssignedTickets tickets={mockTickets} />
      </MemoryRouter>
    );
    expect(screen.getAllByText('Assigned Tickets').length).toBeGreaterThan(0);
    expect(screen.getByText('My Pages /')).toBeInTheDocument();
  });

  it('renders status sections', () => {
    render(
      <MemoryRouter>
        <AssignedTickets tickets={mockTickets} />
      </MemoryRouter>
    );
    expect(screen.getByText('To-do')).toBeInTheDocument();
    expect(screen.getByText('On Progress')).toBeInTheDocument();
    expect(screen.getByText('In Review')).toBeInTheDocument();
  });

  it('renders tickets in their respective sections', () => {
    render(
      <MemoryRouter>
        <AssignedTickets tickets={mockTickets} />
      </MemoryRouter>
    );
    expect(screen.getByText('Test Ticket 1')).toBeInTheDocument();
    expect(screen.getByText('Test Ticket 2')).toBeInTheDocument();
  });

  it('toggles sections on click', () => {
    render(
      <MemoryRouter>
        <AssignedTickets tickets={mockTickets} />
      </MemoryRouter>
    );
    
    const todoButton = screen.getByText('To-do').parentElement!;
    fireEvent.click(todoButton);
    
    expect(screen.queryByText('Test Ticket 1')).not.toBeInTheDocument();
    
    fireEvent.click(todoButton);
    expect(screen.getByText('Test Ticket 1')).toBeInTheDocument();
  });

  it('displays correct ticket count in status badges', () => {
    render(
      <MemoryRouter>
        <AssignedTickets tickets={mockTickets} />
      </MemoryRouter>
    );
    
    // "To-do" has 1 ticket, "On Progress" has 1 ticket, "In Review" has 0
    const badges = screen.getAllByText(/[0-9]/, { selector: 'span' });
    // This is a bit brittle, but let's check the ones next to status labels
    expect(screen.getByText('To-do').nextSibling?.textContent).toBe('1');
    expect(screen.getByText('On Progress').nextSibling?.textContent).toBe('1');
    expect(screen.getByText('In Review').nextSibling?.textContent).toBe('0');
  });
});
