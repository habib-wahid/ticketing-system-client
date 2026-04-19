import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import type { Ticket } from '../types/ticket';
import { TicketForm } from '../components/TicketForm';

const BASE_URL = 'http://localhost:8080';

export function EditTicket() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/tickets/${id}`);
        if (!response.ok) {
          throw new Error('Ticket not found or backend error');
        }
        const data = await response.json();
        setTicket(data.data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch ticket');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTicket();
  }, [id]);

  const handleSubmit = async (formData: any) => {
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/api/tickets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          priority: formData.priority,
          status: formData.status,
          assignedToUserId: formData.assignedToUserId || null,
          tags: formData.tags || [],
          customFields: formData.customFields || {}
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update ticket');
      }

      navigate('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">Loading ticket details...</p>
      </div>
    );
  }

  if (error && !ticket) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
        <div className="bg-red-50 p-4 rounded-full mb-6">
          <AlertCircle size={40} className="text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
        <p className="text-gray-500 mb-8 max-w-sm">{error}</p>
        <Link
          to="/"
          className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-all shadow-sm"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Ticket not found</p>
        <Link to="/" className="text-blue-600 hover:underline">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 mx-8 mt-4">
          <AlertCircle size={18} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {submitting && (
        <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-[2px] rounded-xl flex items-center justify-center animate-in fade-in duration-200">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-[#433878] border-t-transparent rounded-full animate-spin" />
            <p className="text-[#433878] font-bold text-sm tracking-wide">Saving Changes...</p>
          </div>
        </div>
      )}

      <TicketForm
        initialData={ticket}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/')}
      />
    </div>
  );
}
