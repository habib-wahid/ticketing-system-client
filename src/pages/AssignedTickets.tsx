import { useState, useEffect, useCallback } from 'react';
import type { Ticket, TicketFilterStatus, PagedResponse } from '../types/ticket';
import { TicketList } from '../components/TicketList';
import { apiClient } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface TabConfig {
  label: string;
  status: TicketFilterStatus;
}

const TABS: TabConfig[] = [
  { label: 'Pending', status: 'PENDING' },
  { label: 'Resolved', status: 'RESOLVED' },
];

export function AssignedTickets() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TicketFilterStatus>('PENDING');
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

  const fetchTickets = useCallback(async (status: TicketFilterStatus, page: number) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient<{ data: PagedResponse<Ticket> }>(
        `/api/tickets/assigned/${user.userId}?status=${status}&page=${page}&size=10`,
      );
      const paged = result.data;
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
    fetchTickets(activeTab, 0);
  }, [activeTab, fetchTickets]);

  const handleTabChange = (status: TicketFilterStatus) => {
    setActiveTab(status);
  };

  const handlePageChange = (page: number) => {
    fetchTickets(activeTab, page);
  };

  const handleDelete = (id: string) => {
    setTickets((prev) => prev.filter((t) => t.ticketId !== id));
  };

  return (
    <div className="w-full space-y-0">
      {/* Tab Bar */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.status;
          return (
            <button
              key={tab.status}
              onClick={() => handleTabChange(tab.status)}
              className={`px-6 py-3 text-sm font-semibold rounded-t-lg transition-all duration-150 focus:outline-none ${isActive
                ? 'bg-[#2D336B] text-white border border-b-0 border-[#2D336B]'
                : 'text-gray-500 hover:text-[#2D336B] hover:bg-gray-50 border border-transparent'
                }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading && (
        <div className="p-12 text-center text-gray-400 font-medium">
          <div className="inline-block w-6 h-6 border-2 border-[#2D336B] border-t-transparent rounded-full animate-spin mb-3" />
          <p>Loading tickets...</p>
        </div>
      )}

      {error && (
        <div className="p-8 text-center text-red-500 font-medium bg-red-50 rounded-lg border border-red-100">
          ⚠️ {error}
        </div>
      )}

      {!loading && !error && (
        <TicketList
          tickets={tickets}
          onDelete={handleDelete}
          pageInfo={pageInfo}
          onPageChange={handlePageChange}
          hideManageActions={true}
        />
      )}
    </div>
  );
}
