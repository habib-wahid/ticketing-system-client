import React from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import type { Ticket } from '../types/ticket';

interface TicketItemProps {
  ticket: Ticket;
  onDelete: (id: string) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const TicketItem: React.FC<TicketItemProps> = ({ ticket, onDelete, isSelected, onSelect }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB'); // DD/MM/YYYY
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <tr className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${isSelected ? 'bg-gray-50' : ''}`}>
      <td className="py-4 px-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(ticket.id)}
          className="w-4 h-4 rounded border-gray-300 text-[#433878] focus:ring-[#433878] cursor-pointer"
        />
      </td>
      <td className="py-4 px-4 text-sm text-gray-500 font-medium">#{ticket.id}</td>
      <td className="py-4 px-4 text-sm text-gray-500">{formatDate(ticket.createdAt)}</td>
      <td className="py-4 px-4 text-sm font-medium text-gray-900">{ticket.employee}</td>
      <td className="py-4 px-4 text-sm text-gray-600 max-w-[200px] truncate">{ticket.title}</td>
      <td className="py-4 px-4 text-sm text-gray-500">{ticket.location || '-'}</td>
      <td className="py-4 px-4 text-sm text-gray-500 whitespace-nowrap">
        {ticket.endDate ? formatDateTime(ticket.endDate) : '-'}
      </td>
      <td className="py-4 px-4 text-sm font-bold text-[#10B981]">
        ${ticket.amount?.toLocaleString() || '0'}
      </td>
      <td className="py-4 px-4">
        <div className="flex gap-3 justify-end">
          <Link
            to={`/edit/${ticket.id}`}
            className="text-gray-400 hover:text-[#433878] transition-colors"
          >
            <Pencil size={18} />
          </Link>
          <button
            onClick={() => onDelete(ticket.id)}
            className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};
