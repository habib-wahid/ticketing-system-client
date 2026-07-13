import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/MainLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Dashboard } from './pages/Dashboard';
import { Home } from './pages/Home';
import { AssignedTickets } from './pages/AssignedTickets';
import { AllTickets } from './pages/AllTickets';
import { CreateTicket } from './pages/CreateTicket';
import { EditTicket } from './pages/EditTicket';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { TicketDetailPage } from './pages/TicketDetail';
import { AllCategory } from './pages/AllCategory';
import { SlaPolicies } from './pages/SlaPolicies';
import { CategoryDistributorMappings } from './pages/CategoryDistributorMappings';
import { Profile } from './pages/Profile';

function App() {

  return (
    <Routes>
      {/* Auth Routes - No Sidebar/Header */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Main App Routes - With Sidebar/Header */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Home />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/assigned"
        element={
          <ProtectedRoute>
            <MainLayout>
              <AssignedTickets />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/all-tickets"
        element={
          <ProtectedRoute adminOnly>
            <MainLayout>
              <AllTickets />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/new"
        element={
          <ProtectedRoute>
            <MainLayout fullScreen>
              <CreateTicket />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit/:id"
        element={
          <ProtectedRoute>
            <MainLayout fullScreen>
              <EditTicket />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tickets/:ticketId"
        element={
          <ProtectedRoute>
            <MainLayout fullScreen>
              <TicketDetailPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/management/all-categories"
        element={
          <ProtectedRoute>
            <MainLayout>
              <AllCategory />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/management/sla-policies"
        element={
          <ProtectedRoute adminOnly>
            <MainLayout>
              <SlaPolicies />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/management/category-distributors"
        element={
          <ProtectedRoute adminOnly>
            <MainLayout>
              <CategoryDistributorMappings />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Profile />
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
