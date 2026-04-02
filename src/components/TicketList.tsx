import React from 'react';
import type { Ticket } from '../types/ticket';
import { TicketItem } from './TicketItem';

interface TicketListProps {
  tickets: Ticket[];
  onDelete: (id: string) => void;
}

export const TicketList: React.FC<TicketListProps> = ({ tickets, onDelete }) => {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-500">No tickets found. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <TicketItem
          key={ticket.id}
          ticket={ticket}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
