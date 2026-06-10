import { useState, useEffect, useCallback } from 'react';
import type { Ticket, PagedResponse } from '../types/ticket';
import { TicketList } from '../components/TicketList';
import { ticketApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastProvider';

export function Home() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [pageInfo, setPageInfo] = useState<Omit<PagedResponse<Ticket>, 'content'>>({
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 10,
    last: true,
    first: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // used for fetch errors only

  const fetchTickets = useCallback(async (page: number, currentFilters?: any) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const paged = await ticketApi.findMyTickets({
        page,
        size: 10,
        categoryId: currentFilters?.categoryId !== 'all' ? currentFilters?.categoryId : undefined,
        priority: currentFilters?.priority !== 'all' ? currentFilters?.priority?.toUpperCase() : undefined,
        status: currentFilters?.status !== 'all' ? currentFilters?.status?.toUpperCase() : undefined,
        assignedTo: currentFilters?.assignedTo || undefined,
        createdBy: currentFilters?.issuer || undefined,
        startDate: currentFilters?.startDate || undefined,
        endDate: currentFilters?.endDate || undefined,
      });
      setTickets(paged.content ?? []);
      setPageInfo({
        totalElements: paged.totalElements,
        totalPages: paged.totalPages,
        number: paged.number,
        size: paged.size,
        last: paged.last,
        first: paged.first,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initial fetch
  useEffect(() => {
    fetchTickets(0);
  }, [fetchTickets]);

  const handlePageChange = (page: number, filters?: any) => {
    fetchTickets(page, filters);
  };

  const handleDelete = async (id: string) => {
    try {
      await ticketApi.delete(id);
      setTickets((prev) => prev.filter((t) => t.ticketId !== id));
      showToast('Ticket deleted successfully', 'success');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to delete ticket', 'error');
    }
  };

  return (
    <div className="w-full space-y-0">
      {/* Content */}
      {loading && (
        <div className="p-12 text-center text-gray-400 font-medium">
          <div className="inline-block w-6 h-6 border-2 border-[#2D336B] border-t-transparent rounded-full animate-spin mb-3" />
          <p>Loading tickets...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm font-medium">
          {error}
        </div>
      )}

      {!loading && !error && (
        <TicketList
          tickets={tickets}
          onDelete={handleDelete}
          pageInfo={pageInfo}
          onPageChange={handlePageChange}
          hideIssuerFilter={true}
        />
      )}
    </div>
  );
}
