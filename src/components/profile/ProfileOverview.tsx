import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket as TicketIcon } from 'lucide-react';
import type { AuthUser, UserResponse } from '../../types/auth';
import type { Ticket } from '../../types/ticket';
import { ticketApi } from '../../services/api';

interface ProfileOverviewProps {
  user: AuthUser;
  details: UserResponse | null;
}

const STATUS_STYLES: Record<string, string> = {
  NEW: 'bg-blue-50 text-blue-600',
  ASSIGNED: 'bg-indigo-50 text-indigo-600',
  IN_PROGRESS: 'bg-amber-50 text-amber-600',
  RESOLVED: 'bg-emerald-50 text-emerald-600',
  CLOSED: 'bg-gray-100 text-gray-500',
  REOPENED: 'bg-orange-50 text-orange-600',
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span
    className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
      STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-500'
    }`}
  >
    {status?.replace(/_/g, ' ') || '—'}
  </span>
);

const Field: React.FC<{ label: string; value?: string | null }> = ({ label, value }) => (
  <div>
    <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">{label}</div>
    <div className="text-sm font-medium text-gray-900 break-words">{value || '—'}</div>
  </div>
);

export const ProfileOverview: React.FC<ProfileOverviewProps> = ({ user, details }) => {
  const [recent, setRecent] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadRecent = async () => {
      setLoading(true);
      try {
        const paged = await ticketApi.findMyTickets({ page: 0, size: 5 });
        if (!cancelled) setRecent(paged.content ?? []);
      } catch {
        if (!cancelled) setRecent([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadRecent();
    return () => {
      cancelled = true;
    };
  }, []);

  const memberSince = details?.createdAt
    ? new Date(details.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  return (
    <div className="space-y-6">
      {/* Identity fieldset */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-5">Account Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
          <Field label="Full Name" value={`${user.firstName} ${user.lastName}`} />
          <Field label="Email" value={user.email} />
          <Field label="Phone" value={user.phone} />
          <Field label="Role" value={user.role} />
          <Field label="User ID" value={user.userId} />
          {details?.department && <Field label="Department" value={details.department} />}
          {memberSince && <Field label="Member Since" value={memberSince} />}
        </div>
      </div>

      {/* Recent tickets snapshot */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-6 pb-4">
          <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase">Recent Tickets</h3>
          <Link to="/" className="text-xs font-semibold text-[#433878] hover:underline">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="px-6 pb-8 pt-2 text-center text-gray-400 text-sm">
            <div className="inline-block w-5 h-5 border-2 border-[#2D336B] border-t-transparent rounded-full animate-spin mb-2" />
            <p>Loading recent tickets...</p>
          </div>
        ) : recent.length === 0 ? (
          <div className="px-6 pb-10 pt-2 text-center">
            <TicketIcon size={30} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500 font-medium">No tickets yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {recent.map((ticket) => (
              <li key={ticket.ticketId}>
                <Link
                  to={`/tickets/${ticket.ticketId}`}
                  className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{ticket.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {ticket.category?.name || 'Uncategorized'}
                      {ticket.createdAt && ` · ${new Date(ticket.createdAt).toLocaleDateString('en-GB')}`}
                    </p>
                  </div>
                  <StatusBadge status={ticket.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
