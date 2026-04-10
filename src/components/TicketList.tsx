import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Ticket as TicketIcon, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Plus } from 'lucide-react';
import type { Ticket } from '../types/ticket';
import { TicketItem } from './TicketItem';

interface TicketListProps {
  tickets: Ticket[];
  onDelete: (id: string) => void;
}

export const TicketList: React.FC<TicketListProps> = ({ tickets, onDelete }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(tickets.map((t) => t.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  if (tickets.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-200 shadow-sm">
        <p className="text-gray-500">No tickets found. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap gap-4 items-center">
        <Link
          to="/new"
          className="bg-[#10B981] hover:bg-[#059669] text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={20} />
          New Ticket
        </Link>


        <div className="bg-white border border-gray-100 rounded-lg px-6 py-2 flex items-center gap-4 shadow-sm">
          <div className="p-2 bg-gray-50 rounded-full">
            <TicketIcon size={20} className="text-gray-400" />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Total Tickets</div>
            <div className="text-lg font-bold text-gray-900">{tickets.length.toLocaleString()} Tickets</div>
          </div>
        </div>


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
                <th className="py-4 px-4 text-sm font-semibold whitespace-nowrap">Cust. ID</th>
                <th className="py-4 px-4 text-sm font-semibold whitespace-nowrap">Date Join</th>
                <th className="py-4 px-4 text-sm font-semibold whitespace-nowrap">Customer Name</th>
                <th className="py-4 px-4 text-sm font-semibold whitespace-nowrap">Ticket Ordered</th>
                <th className="py-4 px-4 text-sm font-semibold whitespace-nowrap">Location</th>
                <th className="py-4 px-4 text-sm font-semibold whitespace-nowrap">Last Order</th>
                <th className="py-4 px-4 text-sm font-semibold whitespace-nowrap">Total Spent</th>
                <th className="py-4 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <TicketItem
                  key={ticket.id}
                  ticket={ticket}
                  onDelete={onDelete}
                  isSelected={selectedIds.includes(ticket.id)}
                  onSelect={handleSelectOne}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-6 flex justify-between items-center bg-white border-t border-gray-50">
          <div className="text-sm text-gray-500 font-medium">
            Showing <span className="text-gray-900">{Math.min(itemsPerPage, tickets.length)}</span> from <span className="text-gray-900">{tickets.length}</span> data
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-[#433878] transition-colors rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronsLeft size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-[#433878] transition-colors rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-1 mx-2">
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold bg-[#10B981] text-white">1</button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium text-gray-400 hover:bg-gray-50">2</button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium text-gray-400 hover:bg-gray-50">3</button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium text-gray-400 hover:bg-gray-50">4</button>
            </div>

            <button className="p-2 text-gray-400 hover:text-[#433878] transition-colors rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronRight size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-[#433878] transition-colors rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronsRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
