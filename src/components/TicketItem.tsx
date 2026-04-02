import React from 'react';
import { Link } from 'react-router-dom';
import type { Ticket } from '../types/ticket';

interface TicketItemProps {
  ticket: Ticket;
  onDelete: (id: string) => void;
}

export const TicketItem: React.FC<TicketItemProps> = ({ ticket, onDelete }) => {
  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-gray-900">{ticket.title}</h3>
        <div className="flex gap-2">
          <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
            {ticket.priority.toUpperCase()}
          </span>
          <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(ticket.status)}`}>
            {ticket.status.toUpperCase()}
          </span>
        </div>
      </div>
      <p className="text-gray-600 mb-4">{ticket.description}</p>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
        <div className="flex gap-2">
          <Link
            to={`/edit/${ticket.id}`}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Edit
          </Link>
          <button
            onClick={() => onDelete(ticket.id)}
            className="text-red-600 hover:text-red-800 font-medium cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
