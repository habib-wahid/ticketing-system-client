import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import type { Ticket } from './types/ticket';
import { MainLayout } from './components/MainLayout';
import { Home } from './pages/Home';
import { CreateTicket } from './pages/CreateTicket';
import { EditTicket } from './pages/EditTicket';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

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
    assignee: 'Sami Mansour',
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
    <Routes>
      {/* Auth Routes - No Sidebar/Header */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Main App Routes - With Sidebar/Header */}
      <Route
        path="/"
        element={
          <MainLayout>
            <Home tickets={tickets} onDelete={handleDeleteTicket} />
          </MainLayout>
        }
      />
      <Route
        path="/new"
        element={
          <MainLayout>
            <CreateTicket onAdd={handleAddTicket} />
          </MainLayout>
        }
      />
      <Route
        path="/edit/:id"
        element={
          <MainLayout>
            <EditTicket tickets={tickets} onUpdate={handleUpdateTicket} />
          </MainLayout>
        }
      />
    </Routes>
  );
}

export default App;
