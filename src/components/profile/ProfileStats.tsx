import React, { useState, useEffect } from 'react';
import { Ticket as TicketIcon, Inbox, CheckCircle2 } from 'lucide-react';
import { ticketApi } from '../../services/api';

interface StatCardProps {
  label: string;
  value: number | null;
  loading: boolean;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  accent: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, loading, Icon, accent }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}>
      <Icon size={22} />
    </div>
    <div>
      <div className="text-2xl font-bold text-gray-900">
        {loading ? <span className="text-gray-300">—</span> : (value ?? 0).toLocaleString()}
      </div>
      <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">{label}</div>
    </div>
  </div>
);

export const ProfileStats: React.FC = () => {
  const [counts, setCounts] = useState<{ created: number; assigned: number; resolved: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadCounts = async () => {
      setLoading(true);
      try {
        const stats = await ticketApi.getMyTicketStats();
        if (cancelled) return;
        setCounts({
          created: stats.totalTickets,
          assigned: stats.assignedTickets,
          resolved: stats.resolvedTickets,
        });
      } catch {
        if (!cancelled) setCounts({ created: 0, assigned: 0, resolved: 0 });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadCounts();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        label="My Tickets"
        value={counts?.created ?? null}
        loading={loading}
        Icon={TicketIcon}
        accent="bg-[#433878]/10 text-[#433878]"
      />
      <StatCard
        label="Assigned to Me"
        value={counts?.assigned ?? null}
        loading={loading}
        Icon={Inbox}
        accent="bg-[#2D336B]/10 text-[#2D336B]"
      />
      <StatCard
        label="Resolved"
        value={counts?.resolved ?? null}
        loading={loading}
        Icon={CheckCircle2}
        accent="bg-[#10B981]/10 text-[#059669]"
      />
    </div>
  );
};
