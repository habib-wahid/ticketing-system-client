import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AssignedTickets } from '../AssignedTickets';

const makePaged = (tickets: object[]) => ({
  data: {
    content: tickets,
    totalElements: tickets.length,
    totalPages: 1,
    number: 0,
    size: 10,
    last: true,
    first: true,
  },
});

const mockTickets = [
  {
    ticketId: 'T-001',
    title: 'Fix login bug',
    description: 'Login fails on mobile',
    category: 'Bug',
    priority: 'HIGH',
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  },
  {
    ticketId: 'T-002',
    title: 'Add dark mode',
    description: 'Dark mode support',
    category: 'Feature',
    priority: 'LOW',
    status: 'RESOLVED',
    createdAt: new Date().toISOString(),
  },
];

const pendingTickets = mockTickets.filter((t) => t.status === 'PENDING');
const resolvedTickets = mockTickets.filter((t) => t.status === 'RESOLVED');

beforeEach(() => {
  vi.restoreAllMocks();
});

function renderComponent() {
  return render(
    <MemoryRouter>
      <AssignedTickets />
    </MemoryRouter>
  );
}

describe('AssignedTickets Page', () => {
  it('shows loading spinner on mount', () => {
    vi.spyOn(globalThis, 'fetch').mockReturnValue(new Promise(() => {}));
    renderComponent();
    expect(screen.getByText('Loading tickets...')).toBeInTheDocument();
  });

  it('renders Pending tickets after fetch', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => makePaged(pendingTickets),
    } as Response);

    renderComponent();

    await waitFor(() => expect(screen.getByText('Fix login bug')).toBeInTheDocument());
    expect(screen.queryByText('Add dark mode')).not.toBeInTheDocument();
  });

  it('renders Resolved tickets when tab is clicked', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => makePaged(pendingTickets),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => makePaged(resolvedTickets),
      } as Response);

    renderComponent();

    await waitFor(() => screen.getByText('Fix login bug'));

    await userEvent.click(screen.getByRole('button', { name: 'Resolved' }));

    await waitFor(() => expect(screen.getByText('Add dark mode')).toBeInTheDocument());
    expect(screen.queryByText('Fix login bug')).not.toBeInTheDocument();
  });

  it('shows error message when fetch fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    renderComponent();

    await waitFor(() =>
      expect(screen.getByText(/Failed to fetch assigned tickets/i)).toBeInTheDocument()
    );
  });

  it('highlights the active tab', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => makePaged([]),
    } as Response);

    renderComponent();

    const pendingBtn = screen.getByRole('button', { name: 'Pending' });
    expect(pendingBtn.className).toContain('bg-[#2D336B]');

    const resolvedBtn = screen.getByRole('button', { name: 'Resolved' });
    expect(resolvedBtn.className).not.toContain('bg-[#2D336B]');
  });
});
