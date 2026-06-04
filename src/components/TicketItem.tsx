import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, Eye, AlertTriangle } from 'lucide-react';
import type { Ticket } from '../types/ticket';

interface TicketItemProps {
  ticket: Ticket;
  onDelete: (id: string) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

interface DeleteConfirmDialogProps {
  ticketId: string;
  ticketTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteConfirmDialog({ ticketId, ticketTitle, onConfirm, onCancel }: DeleteConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">Delete Ticket</h3>
        </div>
        <p className="text-sm text-gray-600 mb-1">
          Are you sure you want to delete this ticket?
        </p>
        <p className="text-sm font-medium text-gray-800 truncate mb-1">"{ticketTitle}"</p>
        <p className="text-xs text-gray-400 mb-6">ID: {ticketId}</p>
        <p className="text-xs text-red-500 mb-6">This action cannot be undone.</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export const TicketItem: React.FC<TicketItemProps> = ({ ticket, onDelete, isSelected, onSelect }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
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
        <td className="py-4 px-4 text-sm font-medium text-gray-900">{ticket.category?.name || '-'}</td>
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
              onClick={() => setShowConfirm(true)}
              className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
              title="Delete ticket"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </td>
      </tr>

      {showConfirm && (
        <DeleteConfirmDialog
          ticketId={ticket.ticketId}
          ticketTitle={ticket.title}
          onConfirm={() => {
            setShowConfirm(false);
            onDelete(ticket.ticketId);
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
};
