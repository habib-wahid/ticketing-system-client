import { useNavigate } from 'react-router-dom';
import type { Ticket } from '../types/ticket';
import { TicketForm } from '../components/TicketForm';

interface CreateTicketProps {
  onAdd: (ticket: Omit<Ticket, 'id' | 'createdAt'>) => void;
}

export function CreateTicket({ onAdd }: CreateTicketProps) {
  const navigate = useNavigate();
  return (
    <div className="max-w-4xl mx-auto">
      <TicketForm
        onSubmit={(data) => {
          onAdd(data);
          navigate('/');
        }}
        onCancel={() => navigate('/')}
      />
    </div>
  );
}
