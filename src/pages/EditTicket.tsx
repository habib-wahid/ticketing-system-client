import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, X, Pencil, ChevronDown, Paperclip, Plus, Search, MessageSquare, History as HistoryIcon, AlertTriangle, Trash2
} from 'lucide-react';
import type { TicketDetail, TicketCommentDetail, TicketAttachmentDetail } from '../types/ticket';
import { apiClient, categoryApi, getStoredUser } from '../services/api';
import { useToast } from '../components/ToastProvider';
import type { ComplaintCategoryResponse } from '../types/category';

export function EditTicket() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sectional editing states
  const [editingField, setEditingField] = useState<string | null>(null);
  const [pendingValue, setPendingValue] = useState<any>(null);
  const [updatingField, setUpdatingField] = useState<string | null>(null);

  // Assignee search states
  const [searchQuery, setSearchQuery] = useState('');
  const [staffResults, setStaffResults] = useState<any[]>([]);
  const [isSearchingStaff, setIsSearchingStaff] = useState(false);
  const [categories, setCategories] = useState<ComplaintCategoryResponse[]>([]);
  const [fetchingCategories, setFetchingCategories] = useState(true);

  // Tag editing states
  const [newTag, setNewTag] = useState('');

  // Comment states
  const [newComment, setNewComment] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [isSavingComment, setIsSavingComment] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<TicketCommentDetail | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

  // Attachment states
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [attachmentToDelete, setAttachmentToDelete] = useState<TicketAttachmentDetail | null>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const data = await apiClient<{ data: TicketDetail }>(`/api/tickets/${id}`);
        setTicket(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    const fetchCategories = async () => {
      try {
        const data = await categoryApi.findAll(0, 100);
        setCategories(data.content || []);
      } catch (err) {
        console.error(err);
      } finally {
        setFetchingCategories(false);
      }
    };
    if (id) {
      fetchTicket();
      fetchCategories();
    }
  }, [id]);

  const { showToast } = useToast();

  const updateField = async (fieldName: string, value: any) => {
    setUpdatingField(fieldName);
    try {
      const updatedData = await apiClient<{ data: TicketDetail }>(`/api/tickets/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ [fieldName]: value }),
      });

      setTicket(updatedData.data);
      setEditingField(null);
    } catch (err: any) {
      showToast(err?.message || 'Failed to update field', 'error');
    } finally {
      setUpdatingField(null);
    }
  };

  const searchStaff = async (query: string) => {
    if (!query.trim()) {
      setStaffResults([]);
      return;
    }
    setIsSearchingStaff(true);
    try {
      const data = await apiClient<{ data: any[] }>(`/api/users/search?name=${encodeURIComponent(query)}`);
      setStaffResults(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearchingStaff(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (editingField === 'assignee') {
        searchStaff(searchQuery);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, editingField]);

  const addTag = (tag: string) => {
    if (!tag.trim() || !ticket) return;
    const trimmedTag = tag.trim().toUpperCase();
    if (ticket.tags?.includes(trimmedTag)) {
      setNewTag('');
      setEditingField(null);
      return;
    }
    const updatedTags = [...(ticket.tags || []), trimmedTag];
    updateField('tags', updatedTags);
    setNewTag('');
  };

  const removeTag = (tagToRemove: string) => {
    if (!ticket) return;
    const updatedTags = (ticket.tags || []).filter(t => t !== tagToRemove);
    updateField('tags', updatedTags);
  };

  const addComment = async () => {
    if (!newComment.trim() || !ticket) return;
    setIsPostingComment(true);
    try {
      await apiClient(`/api/tickets/${id}/comments`, {
        method: 'POST',
        body: JSON.stringify({
          content: newComment,
          authorUserId: ticket.createdBy?.userId || 'SYSTEM'
        }),
      });

      const updatedData = await apiClient<{ data: TicketDetail }>(`/api/tickets/${id}`);
      setTicket(updatedData.data);
      setNewComment('');
    } catch (err: any) {
      showToast(err?.message || 'Failed to add comment', 'error');
    } finally {
      setIsPostingComment(false);
    }
  };

  const actingUserId = () => getStoredUser()?.userId || ticket?.createdBy?.userId;

  const startEditComment = (comment: TicketCommentDetail) => {
    setEditingCommentId(comment.commentId);
    setEditingCommentText(comment.text);
  };

  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditingCommentText('');
  };

  const saveEditComment = async (commentId: string) => {
    if (!editingCommentText.trim() || !ticket) return;
    setIsSavingComment(true);
    try {
      await apiClient(`/api/tickets/${id}/comments/${commentId}`, {
        method: 'PUT',
        body: JSON.stringify({
          updatedByUserId: actingUserId(),
          text: editingCommentText,
        }),
      });
      const updated = await apiClient<{ data: TicketDetail }>(`/api/tickets/${id}`);
      setTicket(updated.data);
      cancelEditComment();
    } catch (err: any) {
      showToast(err?.message || 'Failed to update comment', 'error');
    } finally {
      setIsSavingComment(false);
    }
  };

  const confirmDeleteComment = async () => {
    if (!commentToDelete || !ticket) return;
    const comment = commentToDelete;
    setCommentToDelete(null);
    setDeletingCommentId(comment.commentId);
    try {
      await apiClient(`/api/tickets/${id}/comments/${comment.commentId}`, {
        method: 'DELETE',
        body: JSON.stringify({ deletedByUserId: actingUserId() }),
      });
      const updated = await apiClient<{ data: TicketDetail }>(`/api/tickets/${id}`);
      setTicket(updated.data);
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete comment', 'error');
    } finally {
      setDeletingCommentId(null);
    }
  };

  const handleAddFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList?.length || !ticket) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('ticket', new Blob([JSON.stringify({})], { type: 'application/json' }));
      Array.from(fileList).forEach((f) => formData.append('files', f));
      const updated = await apiClient<{ data: TicketDetail }>(`/api/tickets/${id}`, { method: 'PUT', body: formData });
      setTicket(updated.data);
    } catch (err: any) {
      showToast(err?.message || 'Failed to upload files', 'error');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
    if (!ticket) return;
    setDeletingId(attachmentId);
    try {
      const updated = await apiClient<{ data: TicketDetail }>(`/api/tickets/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ removeAttachmentIds: [attachmentId] }),
      });
      setTicket(updated.data);
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete attachment', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const confirmDeleteAttachment = async () => {
    if (!attachmentToDelete) return;
    const att = attachmentToDelete;
    setAttachmentToDelete(null);
    await handleDeleteAttachment(att.attachmentId);
  };

  if (error) return <div className="p-12 text-center text-red-500 font-bold">{error}</div>;
  if (loading) return <div className="p-12 text-center text-gray-500 animate-pulse">Loading jira-style editor...</div>;
  if (!ticket) return <div className="p-12 text-center">Ticket not found</div>;

  return (
    <div className="flex flex-col h-full bg-white font-sans text-gray-900">
      {/* Top Breadcrumb Header */}
      <div className="px-8 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <Link to="/" className="hover:text-gray-900 transition-colors">My Tickets</Link>
          <ChevronDown size={14} className="-rotate-90" strokeWidth={3} />
          <span className="text-gray-900 font-medium">{ticket.ticketId}</span>
        </div>
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all text-gray-400 hover:text-gray-900"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content (Left) */}
        <div className="flex-[2] overflow-y-auto p-12 space-y-12">

          {/* Title Section */}
          <section className="group relative">
            {editingField === 'title' ? (
              <div className="flex flex-col gap-3">
                <input
                  autoFocus
                  className="text-4xl font-extrabold text-gray-900 tracking-tight border-none focus:ring-0 p-0 w-full"
                  value={pendingValue}
                  onChange={(e) => setPendingValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && updateField('title', pendingValue)}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => updateField('title', pendingValue)}
                    className="bg-[#10B981] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-[#059669]"
                    disabled={updatingField === 'title'}
                  >
                    {updatingField === 'title' ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => setEditingField(null)}
                    className="text-gray-500 hover:text-gray-900 text-xs font-bold px-3 py-1.5"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => { setEditingField('title'); setPendingValue(ticket.title); }}
                className="cursor-pointer hover:bg-gray-50 rounded-xl -ml-4 pl-4 py-2 transition-all flex items-center justify-between"
              >
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">{ticket.title}</h1>
              </div>
            )}
          </section>

          {/* Description Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase">Description</h3>
              {editingField !== 'description' && (
                <button
                  onClick={() => { setEditingField('description'); setPendingValue(ticket.description); }}
                  className="text-xs font-bold text-[#10B981] hover:text-[#059669] flex items-center gap-1.5 transition-colors"
                >
                  <Pencil size={12} /> Edit
                </button>
              )}
            </div>

            {editingField === 'description' ? (
              <div className="flex flex-col gap-3">
                <textarea
                  autoFocus
                  className="w-full h-80 text-lg leading-relaxed text-gray-700 bg-gray-50 rounded-2xl p-6 border border-gray-100 focus:ring-2 focus:ring-[#10B981]/10 focus:border-[#10B981] transition-all resize-none"
                  value={pendingValue}
                  onChange={(e) => setPendingValue(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => updateField('description', pendingValue)}
                    className="bg-[#10B981] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-green-100 hover:bg-[#059669]"
                  >
                    {updatingField === 'description' ? 'Saving...' : 'Save Content'}
                  </button>
                  <button
                    onClick={() => setEditingField(null)}
                    className="text-gray-500 hover:text-gray-900 text-sm font-bold px-4 py-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="text-lg leading-relaxed text-gray-600 font-medium whitespace-pre-wrap px-1 cursor-pointer hover:bg-gray-50/50 rounded-lg py-2 transition-colors"
                onClick={() => { setEditingField('description'); setPendingValue(ticket.description); }}
              >
                {ticket.description || <span className="text-gray-300 italic">No description provided...</span>}
              </div>
            )}
          </section>

          {/* Attachments Section */}
          <section className="pt-12 border-t border-gray-50 space-y-6">
            <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase">Attachments ({ticket.attachments?.length || 0})</h3>
            <div className="grid grid-cols-2 gap-4">
              {ticket.attachments?.map((att) => (
                <div key={att.attachmentId} className="group p-4 rounded-2xl border border-gray-100 bg-white hover:border-[#10B981] transition-all flex items-center gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl text-gray-400 group-hover:text-[#10B981] group-hover:bg-[#10B981]/10 transition-colors">
                    <Paperclip size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{att.filename}</p>
                    <p className="text-xs text-gray-400 font-medium">{(att.fileSize / 1024).toFixed(1)} KB • {att.mimeType.split('/')[1]?.toUpperCase()}</p>
                  </div>
                  <button
                    onClick={() => setAttachmentToDelete(att)}
                    disabled={deletingId === att.attachmentId}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-100"
                  >
                    {deletingId === att.attachmentId ? (
                      <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <X size={16} />
                    )}
                  </button>
                </div>
              ))}
              <div
                onClick={() => { if (!isUploading) document.getElementById('edit-file-upload')?.click(); }}
                className="border-2 border-dashed border-gray-100 rounded-2xl p-4 flex items-center justify-center gap-2 text-gray-400 hover:border-[#10B981] hover:text-[#10B981] hover:bg-green-50/10 transition-all cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-bold">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    <span className="text-sm font-bold">Add Attachment</span>
                  </>
                )}
              </div>
              <input
                id="edit-file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleAddFiles}
              />
            </div>
          </section>

          {/* Comments Section */}
          <section className="pt-12 border-t border-gray-50 space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                <MessageSquare size={18} />
              </div>
              <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase">Comments ({ticket.comments?.length || 0})</h3>
            </div>

            {/* Comment Input */}
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center font-bold text-gray-300 text-xs border border-gray-100 uppercase">
                {ticket.createdBy?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 space-y-3">
                <textarea
                  className="w-full bg-transparent border-b border-gray-100 text-sm font-medium text-gray-700 placeholder-gray-400 py-2 focus:ring-0 focus:border-[#10B981] transition-all resize-none min-h-[40px]"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                {newComment.trim() && (
                  <div className="flex justify-end animate-in fade-in slide-in-from-top-1">
                    <button
                      onClick={addComment}
                      disabled={isPostingComment}
                      className="bg-[#10B981] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-[#059669] disabled:opacity-50 transition-all"
                    >
                      {isPostingComment ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {ticket.comments?.slice().reverse().map((comment: TicketCommentDetail) => (
                <div key={comment.commentId} className="group relative flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-xs border border-gray-100 uppercase">
                    {comment.author.fullName.charAt(0)}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-bold text-gray-900">{comment.author.fullName}</span>
                      <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">
                        {new Date(comment.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {editingCommentId === comment.commentId ? (
                      <div className="space-y-2">
                        <textarea
                          autoFocus
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 p-3 focus:ring-2 focus:ring-[#10B981]/10 focus:border-[#10B981] transition-all resize-none min-h-[60px]"
                          value={editingCommentText}
                          onChange={(e) => setEditingCommentText(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEditComment(comment.commentId)}
                            disabled={isSavingComment || !editingCommentText.trim()}
                            className="bg-[#10B981] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-[#059669] disabled:opacity-50 transition-all"
                          >
                            {isSavingComment ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={cancelEditComment}
                            className="text-gray-500 hover:text-gray-900 text-xs font-bold px-3 py-1.5"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600 leading-relaxed font-medium whitespace-pre-wrap">
                        {comment.text}
                      </div>
                    )}
                  </div>
                  {editingCommentId !== comment.commentId && (
                    <div className="flex items-start gap-1 opacity-0 group-hover:opacity-800 transition-opacity">
                      <button
                        onClick={() => startEditComment(comment)}
                        className="p-1.5 text-gray-700 hover:text-[#10B981] hover:bg-green-50 rounded-lg transition-all"
                        title="Edit comment"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setCommentToDelete(comment)}
                        disabled={deletingCommentId === comment.commentId}
                        className="p-1.5 text-gray-700 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-100"
                        title="Delete comment"
                      >
                        {deletingCommentId === comment.commentId ? (
                          <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {(!ticket.comments || ticket.comments.length === 0) && (
                <p className="text-center py-12 text-gray-300 font-bold text-sm italic">No comments yet. Start the conversation!</p>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar (Right) */}
        <div className="w-[400px] border-l border-gray-100 bg-gray-50/30 overflow-y-auto p-12 space-y-10">

          {/* Status Widget */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">Status</label>
            <div className="relative group">
              <select
                className={`w-full appearance-none bg-white border-2 rounded-full px-4 py-2 text-xs font-black tracking-widest transition-all cursor-pointer outline-none ${ticket.status === 'RESOLVED' || ticket.status === 'CLOSED'
                  ? 'bg-[#10B981]/10 border-[#10B981] text-[#10B981]'
                  : 'bg-[#433878]/5 border-[#433878]/20 text-[#433878]'
                  }`}
                value={ticket.status}
                onChange={(e) => updateField('status', e.target.value)}
                disabled={updatingField === 'status'}
              >
                <option value="NEW">NEW</option>
                <option value="ASSIGNED">ASSIGNED</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="WAITING_ON_CUSTOMER">WAITING ON CUSTOMER</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="CLOSED">CLOSED</option>
                <option value="REOPENED">REOPENED</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-gray-900 transition-colors">
                {updatingField === 'status' ? (
                  <div className="w-3 h-3 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ChevronDown size={14} />
                )}
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Priority Widget */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">Priority</label>
            <div className="grid grid-cols-2 gap-2">
              {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((p) => (
                <button
                  key={p}
                  onClick={() => updateField('priority', p)}
                  className={`px-3 py-2.5 rounded-xl text-[10px] font-bold tracking-wider border-2 transition-all ${ticket.priority === p
                    ? 'bg-white border-gray-900 text-gray-900 shadow-lg shadow-gray-200'
                    : 'bg-transparent border-gray-100 text-gray-400 hover:border-gray-200'
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <label className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">Category</label>
            <div className="relative">
              <select
                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 appearance-none focus:ring-0 focus:border-[#10B981] transition-all cursor-pointer disabled:opacity-50"
                value={ticket.category?.id || ''}
                onChange={(e) => updateField('complaintCategoryId', e.target.value)}
                disabled={fetchingCategories || updatingField === 'complaintCategoryId'}
              >
                {fetchingCategories ? (
                  <option>Loading...</option>
                ) : (
                  categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))
                )}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Assignee Information */}
          <div className="space-y-4 pt-4 relative">
            <label className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">Assignee</label>

            {editingField === 'assignee' ? (
              <div className="space-y-3 bg-white p-4 rounded-2xl border-2 border-[#10B981] shadow-xl shadow-green-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    autoFocus
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-0"
                    placeholder="Search staff by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {isSearchingStaff && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin" />
                  )}
                </div>

                <div className="max-h-48 overflow-y-scroll space-y-1 pr-1 custom-scrollbar">
                  {staffResults.length > 0 ? (
                    staffResults.map((user) => (
                      <button
                        key={user.userId}
                        onClick={() => updateField('assignedToUserId', user.userId)}
                        className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors group text-left"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#10B981] text-white flex items-center justify-center font-black text-xs">
                          {user.firstName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 group-hover:text-[#10B981] transition-colors">{user.firstName} {user.lastName}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{user.role}</p>
                        </div>
                      </button>
                    ))
                  ) : searchQuery ? (
                    <p className="text-center py-4 text-xs font-bold text-gray-400">No matching staff found</p>
                  ) : (
                    <p className="text-center py-4 text-xs font-bold text-gray-400 italic">Start typing to search...</p>
                  )}
                </div>

                <div className="pt-2 border-t border-gray-50 flex justify-end">
                  <button
                    onClick={() => setEditingField(null)}
                    className="text-gray-400 hover:text-gray-900 text-xs font-bold px-3 py-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => { setEditingField('assignee'); setSearchQuery(''); setStaffResults([]); }}
                className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-[#10B981] text-white flex items-center justify-center font-black text-sm">
                  {ticket.assignedTo?.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">{ticket.assignedTo?.name || 'Unassigned'}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{ticket.assignedTo?.role || 'Service Agent'}</p>
                </div>
                <ArrowLeft size={14} className="-rotate-90 text-gray-300 group-hover:text-gray-900 transition-colors" />
              </div>
            )}
          </div>

          {/* Tags Section */}
          <div className="space-y-4 pt-4">
            <label className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">Tags</label>
            <div className="flex flex-wrap gap-2">
              {ticket.tags?.map((tag, i) => (
                <span
                  key={i}
                  onClick={() => removeTag(tag)}
                  className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-500 flex items-center gap-1.5 group hover:border-red-200 hover:text-red-500 transition-all cursor-pointer"
                >
                  {tag}
                  <X size={10} className="text-gray-300 group-hover:text-red-500" />
                </span>
              ))}

              {editingField === 'tags' ? (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                  <input
                    autoFocus
                    className="w-24 px-2 py-1 bg-gray-50 border border-[#10B981] rounded-lg text-xs font-bold focus:ring-0 outline-none"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') addTag(newTag);
                      if (e.key === 'Escape') setEditingField(null);
                    }}
                    onBlur={() => {
                      if (!newTag.trim()) setEditingField(null);
                      else addTag(newTag);
                    }}
                  />
                </div>
              ) : (
                <button
                  onClick={() => setEditingField('tags')}
                  className="w-8 h-8 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 hover:border-[#10B981] hover:text-[#10B981] transition-all"
                >
                  <Plus size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="pt-10 space-y-4">
          {ticket.statusHistory && ticket.statusHistory.length > 0 && (
              <div>
                <SectionHeading label="Status History" />
                <div className="space-y-2">
                  {ticket.statusHistory.map((h, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <HistoryIcon size={14} className="mt-0.5 text-gray-300 shrink-0" />
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
      </div>

      {attachmentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setAttachmentToDelete(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">Delete Attachment</h3>
            </div>
            <p className="text-sm text-gray-600 mb-1">Are you sure you want to delete this file?</p>
            <p className="text-sm font-semibold text-gray-900 mb-5 truncate">{attachmentToDelete.filename}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setAttachmentToDelete(null)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAttachment}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {commentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCommentToDelete(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">Delete Comment</h3>
            </div>
            <p className="text-sm text-gray-600 mb-1">Are you sure you want to delete this comment?</p>
            <p className="text-sm text-gray-500 mb-5 line-clamp-3 italic">"{commentToDelete.text}"</p>
            <div className="flex gap-3">
              <button
                onClick={() => setCommentToDelete(null)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteComment}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionHeading({ label }: { label: string }) {
  return <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-3">{label}</h3>;
}

function formatDate(iso: string): string {
  if (!iso) return '-';
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}
