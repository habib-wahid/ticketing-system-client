import type { Ticket } from '../types/ticket';
import { TicketList } from '../components/TicketList';

interface HomeProps {
  tickets: Ticket[];
  onDelete: (id: string) => void;
}

export function Home({ tickets, onDelete }: HomeProps) {
  return (
    <div className="w-full">
      <TicketList
        tickets={tickets}
        onDelete={onDelete}
      />
    </div>
  );
}
