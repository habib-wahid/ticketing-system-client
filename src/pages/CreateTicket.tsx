import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { TicketForm } from '../components/TicketForm';
import { apiClient } from '../services/api';

export function CreateTicket() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      await apiClient('/api/tickets', {
        method: 'POST',
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          category: data.category,
          priority: data.priority,
          createdByUserId: data.createdByUserId,
          assignedToUserId: data.assignedToUserId || null,
          tags: data.tags || [],
          customFields: {}
        }),
      });

      navigate('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-full">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertCircle size={18} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-[2px] rounded-xl flex items-center justify-center animate-in fade-in duration-200">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin" />
            <p className="text-[#10B981] font-bold text-sm tracking-wide">Creating Ticket...</p>
          </div>
        </div>
      )}

      <TicketForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/')}
      />
    </div>
  );
}
