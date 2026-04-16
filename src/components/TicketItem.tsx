import React from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, Eye } from 'lucide-react';
import type { Ticket } from '../types/ticket';

interface TicketItemProps {
  ticket: Ticket;
  onDelete: (id: string) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const TicketItem: React.FC<TicketItemProps> = ({ ticket, onDelete, isSelected, onSelect }) => {
  return (
    <tr className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${isSelected ? 'bg-gray-50' : ''}`}>
      <td className="py-4 px-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(ticket.ticketId)}
          className="w-4 h-4 rounded border-gray-300 text-[#433878] focus:ring-[#433878] cursor-pointer"
        />
      </td>
      <td className="py-4 px-4 text-sm text-gray-500 font-medium">{ticket.ticketId}</td>
      <td className="py-4 px-4 text-sm text-gray-600 max-w-[200px] truncate">{ticket.title}</td>
      <td className="py-4 px-4 text-sm font-medium text-gray-900">{ticket.category || '-'}</td>
      <td className="py-4 px-4 text-sm text-gray-500">{ticket.priority || '-'}</td>
      <td className="py-4 px-4 text-sm text-gray-500">{ticket.status || '-'}</td>
      <td className="py-4 px-4 text-sm text-gray-500">
        {ticket.assignedTo?.name || 'Unassigned'}
      </td>
      <td className="py-4 px-4">
        <div className="flex gap-3 justify-end">
          <Link
            to={`/tickets/${ticket.ticketId}`}
            className="text-gray-400 hover:text-[#2D336B] transition-colors"
            title="View details"
          >
            <Eye size={18} />
          </Link>
          <Link
            to={`/edit/${ticket.ticketId}`}
            className="text-gray-400 hover:text-[#433878] transition-colors"
          >
            <Pencil size={18} />
          </Link>
          <button
            onClick={() => onDelete(ticket.ticketId)}
            className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};
