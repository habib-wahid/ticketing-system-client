import { useNavigate, useParams, Link } from 'react-router-dom';
import type { Ticket } from '../types/ticket';
import { TicketForm } from '../components/TicketForm';

interface EditTicketProps {
  tickets: Ticket[];
  onUpdate: (id: string, ticket: Omit<Ticket, 'id' | 'createdAt'>) => void;
}

export function EditTicket({
  tickets,
  onUpdate,
}: EditTicketProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const ticket = tickets.find((t) => t.id === id);

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Ticket not found</p>
        <Link to="/" className="text-blue-600 hover:underline">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <TicketForm
        initialData={ticket}
        onSubmit={(data) => {
          onUpdate(ticket.id, data);
          navigate('/');
        }}
        onCancel={() => navigate('/')}
      />
    </div>
  );
}
