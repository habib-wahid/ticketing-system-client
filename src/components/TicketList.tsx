import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket as TicketIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
} from 'lucide-react';
import type { Ticket, PagedResponse } from '../types/ticket';
import { TicketItem } from './TicketItem';

interface TicketListProps {
  tickets: Ticket[];
  onDelete: (id: string) => void;
  pageInfo: Omit<PagedResponse<Ticket>, 'content'>;
  onPageChange: (page: number) => void;
  hideManageActions?: boolean;
}

export const TicketList: React.FC<TicketListProps> = ({
  tickets,
  onDelete,
  pageInfo,
  onPageChange,
  hideManageActions = false,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { number: currentPage, totalPages, totalElements, first, last } = pageInfo;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(tickets.map((t) => t.ticketId));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Build page numbers to display (max 5 around current)
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }
    const start = Math.max(0, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  if (tickets.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-200 shadow-sm">
        <TicketIcon size={36} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">No tickets found in this category.</p>
        {!hideManageActions && (
          <Link
            to="/new"
            className="mt-4 inline-flex items-center gap-2 text-sm text-[#10B981] hover:underline font-semibold"
          >
            <Plus size={16} /> Create a new ticket
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap gap-4 items-center">
        {!hideManageActions && (
          <Link
            to="/new"
            className="bg-[#10B981] hover:bg-[#059669] text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={20} />
            New Ticket
          </Link>
        )}

        <div className="bg-white border border-gray-100 rounded-lg px-6 py-2 flex items-center gap-4 shadow-sm">
          <div className="p-2 bg-gray-50 rounded-full">
            <TicketIcon size={20} className="text-gray-400" />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Total Tickets</div>
            <div className="text-lg font-bold text-gray-900">{totalElements.toLocaleString()} Tickets</div>
          </div>
        </div>

        {!hideManageActions && (
          <>
            <div className="bg-white border border-gray-100 rounded-lg px-6 py-2 flex items-center gap-3 shadow-sm ml-auto">
              <input
                type="checkbox"
                checked={true}
                readOnly
                className="w-5 h-5 rounded border-gray-300 text-[#433878] focus:ring-[#433878]"
              />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </div>

            <button className="bg-[#F59E0B] hover:bg-[#D97706] text-white px-8 py-3 rounded-lg font-bold transition-colors shadow-sm">
              Edit
            </button>

            <button className="bg-[#EF4444] hover:bg-[#DC2626] text-white px-8 py-3 rounded-lg font-bold transition-colors shadow-sm">
              Delete
            </button>
          </>
        )}
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#2D336B] text-white">
                <th className="py-4 px-4 w-12">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedIds.length === tickets.length && tickets.length > 0}
                    className="w-4 h-4 rounded border-white/20 bg-white/10 text-white focus:ring-offset-0 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="py-4 px-4 text-sm font-semibold whitespace-nowrap">Ticket Id</th>
                <th className="py-4 px-4 text-sm font-semibold whitespace-nowrap">Title</th>
                <th className="py-4 px-4 text-sm font-semibold whitespace-nowrap">Category</th>
                <th className="py-4 px-4 text-sm font-semibold whitespace-nowrap">Priority</th>
                <th className="py-4 px-4 text-sm font-semibold whitespace-nowrap">Status</th>
                <th className="py-4 px-4 text-sm font-semibold whitespace-nowrap">Assigned To</th>
                <th className="py-4 px-4 text-sm font-semibold whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <TicketItem
                  key={ticket.ticketId}
                  ticket={ticket}
                  onDelete={onDelete}
                  isSelected={selectedIds.includes(ticket.ticketId)}
                  onSelect={handleSelectOne}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="p-6 flex justify-between items-center bg-white border-t border-gray-50">
          <div className="text-sm text-gray-500 font-medium">
            Showing{' '}
            <span className="text-gray-900">{tickets.length}</span>
            {' '}from{' '}
            <span className="text-gray-900">{totalElements}</span> results
            {totalPages > 1 && (
              <span className="text-gray-400"> — page {currentPage + 1} of {totalPages}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(0)}
              disabled={first}
              className="p-2 text-gray-400 hover:text-[#433878] transition-colors rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
              title="First page"
            >
              <ChevronsLeft size={20} />
            </button>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={first}
              className="p-2 text-gray-400 hover:text-[#433878] transition-colors rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Previous page"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-1 mx-2">
              {getPageNumbers().map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${pageNum === currentPage
                    ? 'bg-[#10B981] text-white'
                    : 'text-gray-400 hover:bg-gray-50'
                    }`}
                >
                  {pageNum + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={last}
              className="p-2 text-gray-400 hover:text-[#433878] transition-colors rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Next page"
            >
              <ChevronRight size={20} />
            </button>
            <button
              onClick={() => onPageChange(totalPages - 1)}
              disabled={last}
              className="p-2 text-gray-400 hover:text-[#433878] transition-colors rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Last page"
            >
              <ChevronsRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
