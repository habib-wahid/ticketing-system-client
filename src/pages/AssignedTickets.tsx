import { useState, useEffect, useCallback } from 'react';
import type { Ticket, PagedResponse } from '../types/ticket';
import { TicketList } from '../components/TicketList';
import { ticketApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export function AssignedTickets() {
  const { user } = useAuth();
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
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async (page: number, currentFilters?: any) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const paged = await ticketApi.findMyAssignedTickets({
        page,
        size: 10,
        title: currentFilters?.title || undefined,
        categoryId: currentFilters?.categoryId !== 'all' ? currentFilters?.categoryId : undefined,
        priority: currentFilters?.priority !== 'all' ? currentFilters?.priority?.toUpperCase() : undefined,
        status: currentFilters?.status !== 'all' ? currentFilters?.status?.toUpperCase() : undefined,
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

  useEffect(() => {
    fetchTickets(0);
  }, [fetchTickets]);

  const handlePageChange = (page: number, filters?: any) => {
    fetchTickets(page, filters);
  };

  const handleDelete = (id: string) => {
    setTickets((prev) => prev.filter((t) => t.ticketId !== id));
  };

  return (
    <div className="w-full space-y-0 relative">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm font-medium">
          {error}
        </div>
      )}

      <TicketList
        tickets={tickets}
        onDelete={handleDelete}
        pageInfo={pageInfo}
        onPageChange={handlePageChange}
        hideManageActions
        enableTitleSearch
        hideAssignedToColumn
        hideAssignedToFilter
      />

      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
          <div className="text-center text-gray-400 font-medium">
            <div className="inline-block w-6 h-6 border-2 border-[#2D336B] border-t-transparent rounded-full animate-spin mb-3" />
            <p>Loading tickets...</p>
          </div>
        </div>
      )}
    </div>
  );
}
