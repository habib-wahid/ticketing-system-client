import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Minus,
  Square,
  X,
  Paperclip,
  MessageSquare,
  AlertCircle,
  User,
  CheckCircle2,
  History,
  Tag,
  Clock,
  Calendar,
} from 'lucide-react';
import type { TicketDetail } from '../types/ticket';

const BASE_URL = 'http://localhost:8080';

const PRIORITY_STYLES: Record<string, { badge: string; dot: string }> = {
  LOW: { badge: 'bg-emerald-100 text-emerald-700 border border-emerald-200', dot: 'bg-emerald-400' },
  MEDIUM: { badge: 'bg-amber-100 text-amber-700 border border-amber-200', dot: 'bg-amber-400' },
  HIGH: { badge: 'bg-rose-100 text-rose-700 border border-rose-200', dot: 'bg-rose-500' },
  CRITICAL: { badge: 'bg-purple-100 text-purple-700 border border-purple-200', dot: 'bg-purple-500' },
};

const STATUS_STYLES: Record<string, { badge: string; dot: string }> = {
  OPEN: { badge: 'bg-blue-100 text-blue-700 border border-blue-200', dot: 'bg-blue-400' },
  IN_PROGRESS: { badge: 'bg-orange-100 text-orange-700 border border-orange-200', dot: 'bg-orange-400' },
  RESOLVED: { badge: 'bg-green-100 text-green-700 border border-green-200', dot: 'bg-green-400' },
  CLOSED: { badge: 'bg-gray-100 text-gray-600 border border-gray-200', dot: 'bg-gray-400' },
  PENDING: { badge: 'bg-yellow-100 text-yellow-700 border border-yellow-200', dot: 'bg-yellow-400' },
};

const TicketIcon = ({ size, className, strokeWidth }: { size: number; className?: string; strokeWidth?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth || 2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
    <path d="M13 5v2" />
    <path d="M13 17v2" />
    <path d="M13 11v2" />
  </svg>
);

function formatDate(dt?: string | null) {
  if (!dt) return '—';
  return new Date(dt).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function SectionHeading({ label }: { label: string }) {
  return <div className="text-gray-500 font-bold text-xs tracking-widest uppercase mb-4">{label}</div>;
}

/** A coloured card used in the right sidebar */
function SideCard({
  accentColor,
  labelColor,
  label,
  children,
}: {
  accentColor: string;   // Tailwind bg class for the top strip
  labelColor: string;    // Tailwind text class for the label
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className={`px-5 py-3 border-b border-gray-100 ${accentColor}`}>
        <span className={`text-[10px] font-bold uppercase tracking-widest ${labelColor}`}>{label}</span>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

export function TicketDetailPage() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticketId) return;
    const fetch_ = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BASE_URL}/api/tickets/${ticketId}`);
        if (!res.ok) throw new Error(`Failed to fetch ticket (${res.status})`);
        const result = await res.json();
        setTicket(result.data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, [ticketId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-32">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <div className="w-8 h-8 border-2 border-[#2D336B] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full py-32">
        <div className="text-center space-y-3">
          <AlertCircle size={40} className="text-red-400 mx-auto" />
          <p className="text-red-500 font-medium">{error}</p>
          <Link to="/" className="text-sm text-[#2D336B] hover:underline font-semibold">← Back to tickets</Link>
        </div>
      </div>
    );
  }

  if (!ticket) return null;

  const priorityStyle = PRIORITY_STYLES[ticket.priority] ?? { badge: 'bg-gray-100 text-gray-600 border border-gray-200', dot: 'bg-gray-400' };
  const statusStyle = STATUS_STYLES[ticket.status] ?? { badge: 'bg-gray-100 text-gray-600 border border-gray-200', dot: 'bg-gray-400' };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full w-full overflow-hidden">

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="bg-[#10B981]/20 p-1.5 rounded-lg text-[#10B981]">
            <TicketIcon size={18} strokeWidth={3} />
          </div>
          <div>
            <h1 className="text-gray-900 font-bold text-lg leading-tight">{ticket.title}</h1>
            <p className="text-xs text-gray-400 font-mono">{ticket.ticketId}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-gray-400">
          <X size={20} className="cursor-pointer hover:text-red-500" onClick={() => navigate(-1)} />
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left column — message, attachments, comments, history ── */}
        <div className="flex-[1.5] flex flex-col border-r border-gray-100 bg-white overflow-y-auto">
          <div className="p-8 space-y-10">

            {/* Description */}
            <div>
              {/* <SectionHeading label="Message" /> */}
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs text-gray-400">From</span>
                <span className="text-sm text-gray-700 font-medium bg-gray-50 px-3 py-1.5 rounded-lg">
                  {ticket.createdBy?.name ?? 'Unknown'}
                </span>
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-snug mb-4">
                {ticket.title}
              </h2>
              <p className="text-gray-600 text-base leading-relaxed whitespace-pre-wrap">
                {ticket.description || 'No description provided.'}
              </p>
            </div>

            {/* Attachments */}
            {ticket.attachments && ticket.attachments.length > 0 && (
              <div>
                <SectionHeading label="Attachments" />
                <div className="space-y-2">
                  {ticket.attachments.map((att) => (
                    <a
                      key={att.attachmentId}
                      href={att.s3Url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-[#10B981] hover:bg-green-50/20 transition-all group"
                    >
                      <Paperclip size={16} className="text-gray-400 group-hover:text-[#10B981]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{att.filename}</p>
                        <p className="text-xs text-gray-400">{(att.fileSize / 1024).toFixed(1)} KB · {att.mimeType}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Comments */}
            <div>
              <SectionHeading label={`Comments (${ticket.comments?.length ?? 0})`} />
              {!ticket.comments?.length ? (
                <div className="flex flex-col items-center py-8 text-gray-300 gap-2">
                  <MessageSquare size={28} />
                  <p className="text-sm">No comments yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {ticket.comments.map((c) => (
                    <div
                      key={c.commentId}
                      className={`rounded-xl p-4 ${c.internal ? 'bg-yellow-50 border border-yellow-100' : 'bg-gray-50'}`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-600">{c.author?.fullName ?? 'Unknown'}</span>
                        <span className="text-xs text-gray-400">{formatDate(c.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{c.text}</p>
                      {c.internal && (
                        <span className="mt-2 inline-block text-xs text-yellow-600 font-semibold">Internal note</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Status History */}
            {ticket.statusHistory && ticket.statusHistory.length > 0 && (
              <div>
                <SectionHeading label="Status History" />
                <div className="space-y-2">
                  {ticket.statusHistory.map((h, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <History size={14} className="mt-0.5 text-gray-300 shrink-0" />
                      <div>
                        <span className="font-medium text-gray-700">{h.fromStatus} → {h.toStatus}</span>
                        <span className="text-gray-400 mx-2">·</span>
                        <span className="text-gray-500">{h.name}</span>
                        <span className="text-gray-400 mx-2">·</span>
                        <span className="text-gray-400">{formatDate(h.changedAt)}</span>
                        {h.reason && <p className="text-xs text-gray-400 mt-0.5">{h.reason}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ── Right column — coloured metadata cards ── */}
        <div className="flex-1 p-5 space-y-4 overflow-y-auto bg-gray-50/50">

          {/* Status card */}
          <SideCard accentColor="bg-gradient-to-r from-blue-50 to-transparent" labelColor="text-blue-600" label="Status">
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${statusStyle.dot}`} />
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${statusStyle.badge}`}>
                {ticket.status}
              </span>
            </div>
          </SideCard>

          {/* Priority card */}
          <SideCard accentColor="bg-gradient-to-r from-rose-50 to-transparent" labelColor="text-rose-600" label="Priority">
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${priorityStyle.dot}`} />
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${priorityStyle.badge}`}>
                {ticket.priority}
              </span>
            </div>
          </SideCard>

          {/* Category card */}
          <SideCard accentColor="bg-gradient-to-r from-violet-50 to-transparent" labelColor="text-violet-600" label="Category">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-violet-500">
                  <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-800">{ticket.category ?? '—'}</span>
            </div>
          </SideCard>

          {/* Assigned To card */}
          <SideCard accentColor="bg-gradient-to-r from-sky-50 to-transparent" labelColor="text-sky-600" label="Assigned To">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0">
                <User size={15} className="text-sky-500" />
              </div>
              {ticket.assignedTo ? (
                <div>
                  <p className="text-sm font-semibold text-gray-800">{ticket.assignedTo.name}</p>
                  {ticket.assignedAt && (
                    <p className="text-xs text-gray-400 mt-0.5">Since {formatDate(ticket.assignedAt)}</p>
                  )}
                </div>
              ) : (
                <span className="text-sm text-gray-400 italic">Unassigned</span>
              )}
            </div>
          </SideCard>

          {/* Dates card */}
          <SideCard accentColor="bg-gradient-to-r from-amber-50 to-transparent" labelColor="text-amber-600" label="Dates">
            <div className="space-y-3">
              {([
                { label: 'Created', value: ticket.createdAt, dot: 'bg-amber-400', icon: 'bg-amber-50 border-amber-100 text-amber-500' },
                { label: 'Updated', value: ticket.updatedAt, dot: 'bg-blue-400', icon: 'bg-blue-50 border-blue-100 text-blue-500' },
                ...(ticket.resolvedAt ? [{ label: 'Resolved', value: ticket.resolvedAt, dot: 'bg-green-400', icon: 'bg-green-50 border-green-100 text-green-500' }] : []),
                ...(ticket.closedAt ? [{ label: 'Closed', value: ticket.closedAt, dot: 'bg-gray-400', icon: 'bg-gray-50 border-gray-100 text-gray-400' }] : []),
              ] as { label: string; value?: string | null; dot: string; icon: string }[]).map(({ label, value, dot, icon }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${icon}`}>
                    <Calendar size={13} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                    <p className="text-xs font-semibold text-gray-700 mt-0.5">{formatDate(value)}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
                </div>
              ))}
            </div>
          </SideCard>

          {/* SLA card */}
          {ticket.sla && (
            <SideCard accentColor="bg-gradient-to-r from-red-50 to-transparent" labelColor="text-red-500" label="SLA">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                    <Clock size={14} className="text-red-400" />
                  </div>
                  <span className="text-sm font-semibold text-gray-800">SLA Policy</span>
                </div>

                {ticket.responseDeadline && (
                  <div className="flex items-start gap-2 pl-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-300 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Response Deadline</p>
                      <p className="text-xs font-semibold text-gray-700 mt-0.5">{formatDate(ticket.responseDeadline)}</p>
                    </div>
                  </div>
                )}
                {ticket.escalationDueAt && (
                  <div className="flex items-start gap-2 pl-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-300 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Escalation Due</p>
                      <p className="text-xs font-semibold text-gray-700 mt-0.5">{formatDate(ticket.escalationDueAt)}</p>
                    </div>
                  </div>
                )}
                {ticket.slaBreachedAt && (
                  <div className="flex items-center gap-2 bg-red-50 text-red-600 text-xs font-bold px-3 py-2 rounded-lg">
                    <AlertCircle size={13} />
                    SLA breached · {formatDate(ticket.slaBreachedAt)}
                  </div>
                )}
              </div>
            </SideCard>
          )}

          {/* Tags card */}
          {ticket.tags && ticket.tags.length > 0 && (
            <SideCard accentColor="bg-gradient-to-r from-teal-50 to-transparent" labelColor="text-teal-600" label="Tags">
              <div className="flex flex-wrap gap-2">
                {ticket.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 text-teal-700 text-xs font-semibold rounded-full border border-teal-100">
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>
            </SideCard>
          )}

        </div>
        {/* ── End right column ── */}
      </div>
      {/* ── End body ── */}

      {/* ── Footer ── */}
      <div className="bg-white border-t border-gray-100 px-8 py-5 flex justify-between items-center shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 font-semibold hover:text-gray-700 transition-colors flex items-center gap-2 text-sm"
        >
          <ArrowLeft size={16} />
          Back to list
        </button>
        <div className="flex items-center gap-3">
          {ticket.resolvedAt && (
            <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
              <CheckCircle2 size={16} />
              Resolved
            </div>
          )}
          <Link
            to={`/edit/${ticket.ticketId}`}
            className="bg-[#10B981] hover:bg-[#059669] text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-green-100 text-sm"
          >
            Edit Ticket
          </Link>
        </div>
      </div>

    </div>
  );
}
