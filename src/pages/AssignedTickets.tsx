import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  LayoutGrid,
  Clock,
  List as ListIcon,
  Star,
  Share2,
  ChevronLeft
} from 'lucide-react';
import type { Ticket } from '../types/ticket';
import { Link } from 'react-router-dom';

interface AssignedTicketsProps {
  tickets: Ticket[];
}

export const AssignedTickets: React.FC<AssignedTicketsProps> = ({ tickets }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'open': true,
    'in-progress': true,
    'closed': true
  });

  const toggleSection = (status: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [status]: !prev[status]
    }));
  };

  const getPriorityStyle = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-600 border-red-100';
      case 'medium': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'low': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const getStatusLabel = (status: Ticket['status']) => {
    switch (status) {
      case 'open': return 'To-do';
      case 'in-progress': return 'On Progress';
      case 'closed': return 'In Review';
      default: return status;
    }
  };

  const groupedTickets = {
    'open': tickets.filter(t => t.status === 'open'),
    'in-progress': tickets.filter(t => t.status === 'in-progress'),
    'closed': tickets.filter(t => t.status === 'closed'),
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header / Breadcrumbs */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center text-gray-400 text-sm gap-2">
            <ChevronLeft size={16} />
            <ChevronRight size={16} />
            <span className="ml-2">My Pages /</span>
            <span className="text-gray-800 font-medium">Assigned Tickets</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-gray-400">
          <div className="flex items-center gap-1">
            <Plus size={18} />
            <span className="text-sm">New Tab</span>
          </div>
          <Star size={18} />
          <Share2 size={18} />
          <MoreHorizontal size={18} />
        </div>
      </div>

      {/* Project Title and Avatars */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#433878] rounded-lg flex items-center justify-center text-white font-bold text-xl">
            C
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Assigned Tickets</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {['AL', 'JD', 'SM'].map((init, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium">
                {init}
              </div>
            ))}
          </div>
          <button className="ml-4 flex items-center gap-2 text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium">
            <Plus size={16} /> Invite
          </button>
        </div>
      </div>

      {/* Tabs and Actions */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-0.5">
        <div className="flex gap-8">
          <button className="flex items-center gap-2 text-gray-400 pb-3 border-b-2 border-transparent">
            <LayoutGrid size={18} /> Kanban
          </button>
          <button className="flex items-center gap-2 text-gray-400 pb-3 border-b-2 border-transparent">
            <Clock size={18} /> Timeline
          </button>
          <button className="flex items-center gap-2 text-[#433878] font-medium pb-3 border-b-2 border-[#433878]">
            <ListIcon size={18} /> List
          </button>
        </div>
        <div className="flex items-center gap-3 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none w-48"
            />
          </div>
          <button className="flex items-center gap-2 text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg text-sm">
            <Filter size={16} /> Filter
          </button>
          <Link to="/new" className="bg-[#1D1E2C] text-white px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2">
            <Plus size={16} /> New Task
          </Link>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[40px_1.5fr_1fr_1.5fr_1fr_1fr_1fr_40px] gap-4 px-4 py-2 text-sm font-medium text-gray-400 border-b border-gray-50">
        <div><input type="checkbox" className="rounded" /></div>
        <div className="flex items-center gap-1"><span className="text-gray-300">@</span> Task Name</div>
        <div className="flex items-center gap-1"><ListIcon size={14} /> Description</div>
        <div className="flex items-center gap-1"><Clock size={14} /> Estimation</div>
        <div className="flex items-center gap-1"><LayoutGrid size={14} /> Type</div>
        <div className="flex items-center gap-1"><Share2 size={14} /> People</div>
        <div className="flex items-center gap-1"><Star size={14} /> Priority</div>
        <div></div>
      </div>

      {/* Grouped Sections */}
      {(['open', 'in-progress', 'closed'] as Ticket['status'][]).map(status => (
        <div key={status} className="mt-4">
          <button
            onClick={() => toggleSection(status)}
            className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-50 transition-colors group"
          >
            {expandedSections[status] ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
            <span className="font-bold text-gray-800">{getStatusLabel(status)}</span>
            <span className="bg-blue-100 text-blue-600 text-[10px] px-1.5 py-0.5 rounded-md ml-2">{groupedTickets[status].length}</span>
            <Plus size={16} className="ml-auto text-gray-300 opacity-0 group-hover:opacity-100" />
          </button>

          {expandedSections[status] && (
            <div className="mt-1">
              {groupedTickets[status].map(ticket => (
                <div key={ticket.id} className="grid grid-cols-[40px_1.5fr_1fr_1.5fr_1fr_1fr_1fr_40px] gap-4 px-4 py-3 text-sm items-center border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                  <div><input type="checkbox" className="rounded" /></div>
                  <div className="font-medium text-gray-900">{ticket.title}</div>
                  <div className="text-gray-500 truncate">{ticket.description || '-'}</div>
                  <div className="text-gray-500">{ticket.startDate} - {ticket.endDate}</div>
                  <div>
                    <span className="bg-purple-100 text-purple-600 px-2.5 py-1 rounded-lg text-xs font-medium border border-purple-200">
                      {ticket.product}
                    </span>
                  </div>
                  <div className="flex -space-x-1">
                    <div className="w-6 h-6 rounded-full bg-blue-100 border border-white flex items-center justify-center text-[10px] font-bold text-blue-600">
                      {ticket.assignee?.split(' ').map(n => n[0]).join('') || 'U'}
                    </div>
                  </div>
                  <div>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${getPriorityStyle(ticket.priority)}`}>
                      {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                    </span>
                  </div>
                  <div className="text-gray-400 flex justify-end">
                    <MoreHorizontal size={16} className="cursor-pointer" />
                  </div>
                </div>
              ))}
              {groupedTickets[status].length === 0 && (
                <div className="px-14 py-4 text-sm text-gray-400 italic">No tasks in this section</div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
