import { useState } from 'react';
import { Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import type { Ticket } from './types/ticket';
import { TicketList } from './components/TicketList';
import { TicketForm } from './components/TicketForm';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Ticket as TicketIcon } from 'lucide-react';

const DUMMY_DATA: Ticket[] = [
  {
    id: '1',
    title: 'Fix login bug',
    description: 'Users are unable to login with Google accounts.',
    priority: 'high',
    status: 'open',
    product: 'E-Invoice',
    employee: 'Ahmed Mahmoud',
    company: 'Burger King',
    startDate: '2023-10-27',
    endDate: '2023-11-27',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Update documentation',
    description: 'The API documentation is outdated.',
    priority: 'medium',
    status: 'in-progress',
    product: 'API Gateway',
    employee: 'Sara Ali',
    company: 'Tech Solutions',
    startDate: '2023-11-01',
    endDate: '2023-11-15',
    createdAt: new Date().toISOString(),
  },
];

function App() {
  const [tickets, setTickets] = useState<Ticket[]>(DUMMY_DATA);

  const handleAddTicket = (ticketData: Omit<Ticket, 'id' | 'createdAt'>) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    setTickets([...tickets, newTicket]);
  };

  const handleUpdateTicket = (id: string, ticketData: Omit<Ticket, 'id' | 'createdAt'>) => {
    const updatedTickets = tickets.map((t) =>
      t.id === id ? { ...t, ...ticketData } : t
    );
    setTickets(updatedTickets);
  };

  const handleDeleteTicket = (id: string) => {
    setTickets(tickets.filter((t) => t.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FD]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  tickets={tickets}
                  onDelete={handleDeleteTicket}
                />
              }
            />
            <Route
              path="/new"
              element={<CreateTicket onAdd={handleAddTicket} />}
            />
            <Route
              path="/edit/:id"
              element={
                <EditTicket
                  tickets={tickets}
                  onUpdate={handleUpdateTicket}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function Home({ tickets, onDelete }: { tickets: Ticket[]; onDelete: (id: string) => void }) {
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

function CreateTicket({ onAdd }: { onAdd: (ticket: Omit<Ticket, 'id' | 'createdAt'>) => void }) {
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

function EditTicket({
  tickets,
  onUpdate,
}: {
  tickets: Ticket[];
  onUpdate: (id: string, ticket: Omit<Ticket, 'id' | 'createdAt'>) => void;
}) {
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

export default App;
