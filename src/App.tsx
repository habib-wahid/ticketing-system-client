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

const DUMMY_DATA: Ticket[] = [
  {
    id: '0012451',
    title: 'The Story of Danau Toba (Musical Drama)',
    description: 'The Story of Danau Toba (Musical Drama)',
    priority: 'high',
    status: 'open',
    product: 'E-Invoice',
    employee: 'Cive Slauw',
    company: 'Burger King',
    startDate: '2017-11-21',
    endDate: '2020-08-04',
    assignee: 'Sami Mansour',
    createdAt: '2017-11-21T00:00:00Z',
    location: 'London, United Kingdom',
    amount: 1300,
  },
  {
    id: '0012452',
    title: 'The Powerfull Concert Festival London 2020',
    description: 'The Powerfull Concert Festival London 2020',
    priority: 'medium',
    status: 'in-progress',
    product: 'API Gateway',
    employee: 'Bella Simatupang',
    company: 'Tech Solutions',
    startDate: '2017-11-21',
    endDate: '2020-08-04',
    createdAt: '2017-11-21T00:00:00Z',
    location: 'Sydney, Australia',
    amount: 623.55,
  },
  {
    id: '0012453',
    title: 'The Story of Danau Toba (Musical Drama)',
    description: 'The Story of Danau Toba (Musical Drama)',
    priority: 'low',
    status: 'closed',
    product: 'E-Invoice',
    employee: 'Andrew Stevano',
    company: 'Burger King',
    startDate: '2017-11-21',
    endDate: '2020-08-04',
    createdAt: '2017-11-21T00:00:00Z',
    location: 'Sydney, Australia',
    amount: 1300,
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
            <CreateTicket onAdd={handleAddTicket} />
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
    </Routes>
  );
}

export default App;
