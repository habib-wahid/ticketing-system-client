import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import type { Ticket } from './types/ticket';
import { MainLayout } from './components/MainLayout';
import { Home } from './pages/Home';
import { AssignedTickets } from './pages/AssignedTickets';
import { CreateTicket } from './pages/CreateTicket';
import { EditTicket } from './pages/EditTicket';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { TicketDetailPage } from './pages/TicketDetail';

const DUMMY_DATA: Ticket[] = [
  {
    ticketId: '0012451',
    title: 'The Story of Danau Toba (Musical Drama)',
    description: 'The Story of Danau Toba (Musical Drama)',
    category: 'GENERAL',
    priority: 'HIGH',
    status: 'OPEN',
    createdAt: '2017-11-21T00:00:00Z',
  },
  {
    ticketId: '0012452',
    title: 'The Powerfull Concert Festival London 2020',
    description: 'The Powerfull Concert Festival London 2020',
    category: 'TECHNICAL',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    createdAt: '2017-11-21T00:00:00Z',
  },
  {
    ticketId: '0012453',
    title: 'The Story of Danau Toba (Musical Drama)',
    description: 'The Story of Danau Toba (Musical Drama)',
    category: 'GENERAL',
    priority: 'LOW',
    status: 'CLOSED',
    createdAt: '2017-11-21T00:00:00Z',
  },
];

function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // handleAddTicket removed as it's now handled by CreateTicket API call

  const handleUpdateTicket = (ticketId: string, ticketData: Omit<Ticket, 'ticketId' | 'createdAt'>) => {
    const updatedTickets = tickets.map((t) =>
      t.ticketId === ticketId ? { ...t, ...ticketData } : t
    );
    setTickets(updatedTickets);
  };


  return (
    <Routes>
      {/* Auth Routes - No Sidebar/Header */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Main App Routes - With Sidebar/Header */}
      <Route
        path="/"
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />
      <Route
        path="/assigned"
        element={
          <MainLayout>
            <AssignedTickets tickets={tickets} />
          </MainLayout>
        }
      />
      <Route
        path="/new"
        element={
          <MainLayout fullScreen>
            <CreateTicket />
          </MainLayout>
        }
      />
      <Route
        path="/edit/:id"
        element={
          <MainLayout fullScreen>
            <EditTicket tickets={tickets} onUpdate={handleUpdateTicket} />
          </MainLayout>
        }
      />
      <Route
        path="/tickets/:ticketId"
        element={
          <MainLayout fullScreen>
            <TicketDetailPage />
          </MainLayout>
        }
      />
    </Routes>
  );
}

export default App;
