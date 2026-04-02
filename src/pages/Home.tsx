import { Link } from 'react-router-dom';
import { Ticket as TicketIcon } from 'lucide-react';
import type { Ticket } from '../types/ticket';
import { TicketList } from '../components/TicketList';

interface HomeProps {
  tickets: Ticket[];
  onDelete: (id: string) => void;
}

export function Home({ tickets, onDelete }: HomeProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-4 mb-8 flex justify-between items-center border border-gray-100 max-w-sm">
        <div className="flex items-center gap-2 text-[#433878] font-bold text-lg">
          <TicketIcon size={24} />
          Tickets
        </div>
        <Link
          to="/new"
          className="bg-[#2D336B] text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-[#232855] transition-colors"
        >
          Create A Task
        </Link>
      </div>
      <TicketList
        tickets={tickets}
        onDelete={onDelete}
      />
    </div>
  );
}
