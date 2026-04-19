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

function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // handleAddTicket removed as it's now handled by CreateTicket API call

  // handleUpdateTicket removed as it's now handled by EditTicket API call


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
            <EditTicket />
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
