import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';

describe('Ticketing App with Routing', () => {
  it('renders initial dummy tickets on home page', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Fix login bug')).toBeInTheDocument();
    expect(screen.getByText('Update documentation')).toBeInTheDocument();
  });

  it('navigates to create ticket page', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('Create A Task'));
    expect(screen.getByText('Create New Ticket')).toBeInTheDocument();
  });

  it('can create a new ticket and navigate back to home', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('Create A Task'));
    
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'New Test Ticket' } });
    fireEvent.change(screen.getByLabelText(/Task Description/i), { target: { value: 'New Test Description' } });
    
    fireEvent.click(screen.getByText('Create Ticket'));
    
    // Should be back on home page
    expect(screen.getByText('New Test Ticket')).toBeInTheDocument();
    expect(screen.getAllByText('Tickets')[0]).toBeInTheDocument();
  });

  it('can delete a ticket', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
    expect(screen.queryByText('Fix login bug')).not.toBeInTheDocument();
  });

  it('navigates to edit page and updates a ticket', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    const editLinks = screen.getAllByText('Edit');
    fireEvent.click(editLinks[0]);
    
    expect(screen.getByText('Edit Ticket')).toBeInTheDocument();
    
    const titleInput = screen.getByLabelText(/Title/i);
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
    
    fireEvent.click(screen.getByText('Update Ticket'));
    
    expect(screen.getByText('Updated Title')).toBeInTheDocument();
    expect(screen.queryByText('Fix login bug')).not.toBeInTheDocument();
  });
});
