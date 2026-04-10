import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';

describe('Ticketing App with Routing', () => {
  it('renders login page', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('WELCOME BACK')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('example@orchida-soft.com')).toBeInTheDocument();
  });

  it('renders initial dummy tickets on home page', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getAllByText('The Story of Danau Toba (Musical Drama)')[0]).toBeInTheDocument();
    expect(screen.getByText('Cive Slauw')).toBeInTheDocument();
    expect(screen.getByText('The Powerfull Concert Festival London 2020')).toBeInTheDocument();
  });

  it('navigates to create ticket page', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText(/New Ticket/i));
    expect(screen.getByText('Create New Ticket')).toBeInTheDocument();
  });

  it('can create a new ticket and navigate back to home', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText(/New Ticket/i));
    
    // In new TicketForm, "Ticket Name" is the label for title
    fireEvent.change(screen.getAllByPlaceholderText(/Help me cancel my order/i)[0], { target: { value: 'New Test Ticket' } });
    
    fireEvent.click(screen.getByText(/Submit as New/i));
    
    // Should be back on home page
    expect(screen.getByText('New Test Ticket')).toBeInTheDocument();
  });

  it('can delete a ticket', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    // Find Trash icons
    const trashButtons = screen.getAllByRole('button').filter(btn => btn.querySelector('svg.lucide-trash2'));
    fireEvent.click(trashButtons[0]);
    expect(screen.queryByText('Cive Slauw')).not.toBeInTheDocument();
  });

  it('navigates to edit page and updates a ticket', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    // Find the pencil icon links
    const editLinks = screen.getAllByRole('link').filter(link => link.querySelector('svg.lucide-pencil'));
    fireEvent.click(editLinks[0]);
    
    expect(screen.getByText('Edit Ticket')).toBeInTheDocument();
    
    const titleInput = screen.getAllByPlaceholderText(/Help me cancel my order/i)[0];
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
    
    fireEvent.click(screen.getByText(/Update Ticket/i));
    
    expect(screen.getByText('Updated Title')).toBeInTheDocument();
  });
});
