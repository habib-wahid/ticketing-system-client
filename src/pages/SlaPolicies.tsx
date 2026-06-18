import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, X, Clock } from 'lucide-react';
import { slaPolicyApi, categoryApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { SlaPolicyResponse, TicketPriority } from '../types/sla';
import { TICKET_PRIORITIES } from '../types/sla';
import type { ComplaintCategoryResponse } from '../types/category';

const PRIORITY_STYLES: Record<TicketPriority, string> = {
  LOW: 'bg-gray-100 text-gray-600 border-gray-200',
  MEDIUM: 'bg-blue-50 text-blue-600 border-blue-200',
  HIGH: 'bg-orange-50 text-orange-600 border-orange-200',
  CRITICAL: 'bg-red-50 text-red-600 border-red-200',
};

interface PolicyForm {
  name: string;
  complaintCategoryId: string;
  priority: TicketPriority;
  firstResponseTimeHours: string;
  resolutionTimeHours: string;
  escalationAfterHours: string;
  reminderThreshHoldHours: string;
  active: boolean;
}

const emptyForm: PolicyForm = {
  name: '',
  complaintCategoryId: '',
  priority: 'MEDIUM',
  firstResponseTimeHours: '',
  resolutionTimeHours: '',
  escalationAfterHours: '',
  reminderThreshHoldHours: '',
  active: true,
};

export function SlaPolicies() {
  const { user } = useAuth();
  const [policies, setPolicies] = useState<SlaPolicyResponse[]>([]);
  const [categories, setCategories] = useState<ComplaintCategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PolicyForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SlaPolicyResponse | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchPolicies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await slaPolicyApi.findAll();
      setPolicies(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch SLA policies');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies]);

  // Load categories once (used by the create form's category picker)
  useEffect(() => {
    categoryApi
      .findAll(0, 100)
      .then((data) => setCategories(data.content ?? []))
      .catch(() => setCategories([]));
  }, []);

  const updateField = <K extends keyof PolicyForm>(key: K, value: PolicyForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (policy: SlaPolicyResponse) => {
    setEditingId(policy.id);
    setForm({
      name: policy.name ?? '',
      complaintCategoryId: policy.category?.id ?? '',
      priority: policy.priority,
      firstResponseTimeHours: String(policy.firstResponseTimeHours ?? ''),
      resolutionTimeHours: String(policy.resolutionTimeHours ?? ''),
      escalationAfterHours: String(policy.escalationAfterHours ?? ''),
      reminderThreshHoldHours: String(policy.reminderThreshHoldHours ?? ''),
      active: policy.active,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
  };

  const updatedByName = user ? `${user.firstName} ${user.lastName}`.trim() : undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const firstResponse = Number(form.firstResponseTimeHours);
    const resolution = Number(form.resolutionTimeHours);
    const escalation = Number(form.escalationAfterHours);
    const reminder = Number(form.reminderThreshHoldHours);

    if (!form.name.trim()) {
      setFormError('Please enter a policy name.');
      return;
    }
    if (!editingId && !form.complaintCategoryId) {
      setFormError('Please select a complaint category.');
      return;
    }
    if ([firstResponse, resolution, escalation, reminder].some((n) => !Number.isFinite(n) || n < 1)) {
      setFormError('All time values must be whole numbers of at least 1.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await slaPolicyApi.update(editingId, {
          name: form.name.trim(),
          responseTimeHours: firstResponse,
          resolutionTimeHours: resolution,
          escalationAfterHours: escalation,
          reminderIntervalMinutes: reminder,
          active: form.active,
          updatedBy: updatedByName,
        });
      } else {
        await slaPolicyApi.create({
          name: form.name.trim(),
          complaintCategoryId: form.complaintCategoryId,
          priority: form.priority,
          firstResponseTimeHours: firstResponse,
          resolutionTimeHours: resolution,
          escalationAfterHours: escalation,
          reminderThreshHoldHours: reminder,
          active: form.active,
          updatedBy: updatedByName,
        });
      }
      closeModal();
      fetchPolicies();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to save SLA policy');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (policy: SlaPolicyResponse) => {
    setDeleteTarget(policy);
    setDeleteError(null);
  };

  const cancelDelete = () => {
    if (deleting) return;
    setDeleteTarget(null);
    setDeleteError(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await slaPolicyApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      fetchPolicies();
    } catch (err: unknown) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete SLA policy');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">SLA Policies</h1>
          <p className="text-sm text-gray-500 mt-1">
            Define response, resolution, escalation and reminder targets per complaint category and priority.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#2D336B] hover:bg-[#1E2248] text-white px-4 py-2 rounded-lg transition-colors font-medium shrink-0"
        >
          <Plus size={18} />
          <span>Add Policy</span>
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-gray-400 font-medium">
              <div className="inline-block w-6 h-6 border-2 border-[#2D336B] border-t-transparent rounded-full animate-spin mb-3" />
              <p>Loading SLA policies...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500 font-medium bg-red-50">⚠️ {error}</div>
          ) : policies.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No SLA policies yet. Click "Add Policy" to create one.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
                  <th className="p-4 font-semibold">Policy Name</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Priority</th>
                  <th className="p-4 font-semibold text-center">First Response (hrs)</th>
                  <th className="p-4 font-semibold text-center">Resolution (hrs)</th>
                  <th className="p-4 font-semibold text-center">Escalate After (hrs)</th>
                  <th className="p-4 font-semibold text-center">Reminder (hrs)</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                  <th className="p-4 font-semibold">Updated By</th>
                  <th className="p-4 font-semibold">Updated On</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {policies.map((policy) => (
                  <tr key={policy.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-semibold text-gray-800">{policy.name || '-'}</td>
                    <td className="p-4 font-medium text-gray-700">{policy.category?.name ?? '-'}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${PRIORITY_STYLES[policy.priority]}`}
                      >
                        {policy.priority}
                      </span>
                    </td>
                    <td className="p-4 text-center text-gray-700">{policy.firstResponseTimeHours}</td>
                    <td className="p-4 text-center text-gray-700">{policy.resolutionTimeHours}</td>
                    <td className="p-4 text-center text-gray-700">{policy.escalationAfterHours}</td>
                    <td className="p-4 text-center text-gray-700">{policy.reminderThreshHoldHours}</td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          policy.active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {policy.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{policy.updatedBy || '-'}</td>
                    <td className="p-4 text-gray-600">{formatDate(policy.updatedAt)}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(policy)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => confirmDelete(policy)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Clock size={18} className="text-[#2D336B]" />
                {editingId ? 'Edit SLA Policy' : 'Add SLA Policy'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Policy Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="e.g. Billing - High Priority"
                  maxLength={100}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D336B] focus:border-transparent"
                  required
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Complaint Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.complaintCategoryId}
                    onChange={(e) => updateField('complaintCategoryId', e.target.value)}
                    disabled={!!editingId}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D336B] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                    required
                  >
                    <option value="">Select category</option>
                    {/* Keep the current category visible even if not in the first 100 */}
                    {editingId && form.complaintCategoryId &&
                      !categories.some((c) => c.id === form.complaintCategoryId) && (
                        <option value={form.complaintCategoryId}>
                          {policies.find((p) => p.id === editingId)?.category?.name ?? 'Current category'}
                        </option>
                      )}
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Priority <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.priority}
                    onChange={(e) => updateField('priority', e.target.value as TicketPriority)}
                    disabled={!!editingId}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D336B] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                  >
                    {TICKET_PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {editingId && (
                <p className="text-xs text-gray-400">
                  Category and priority identify the policy and cannot be changed. Delete and recreate to repoint.
                </p>
              )}

              <div className="grid grid-cols-2 gap-4">
                <NumberField
                  label="First Response (hrs)"
                  value={form.firstResponseTimeHours}
                  onChange={(v) => updateField('firstResponseTimeHours', v)}
                />
                <NumberField
                  label="Resolution (hrs)"
                  value={form.resolutionTimeHours}
                  onChange={(v) => updateField('resolutionTimeHours', v)}
                />
                <NumberField
                  label="Escalate After (hrs)"
                  value={form.escalationAfterHours}
                  onChange={(v) => updateField('escalationAfterHours', v)}
                />
                <NumberField
                  label="Reminder Threshold (hrs)"
                  value={form.reminderThreshHoldHours}
                  onChange={(v) => updateField('reminderThreshHoldHours', v)}
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => updateField('active', e.target.checked)}
                  className="w-4 h-4 accent-[#2D336B]"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>

              {formError && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {formError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-50 rounded-lg transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2D336B] hover:bg-[#1E2248] text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4"
          onClick={cancelDelete}
          role="presentation"
        >
          <div
            className="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden transform transition-all"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-sla-policy-title"
          >
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <h3 id="delete-sla-policy-title" className="text-lg font-bold text-gray-800 mb-2">
                Delete SLA Policy
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Are you sure you want to delete this SLA policy? This action cannot be undone.
              </p>
              <div className="bg-gray-50 rounded-lg px-4 py-3 mb-4 text-left text-sm">
                <p className="text-gray-500">
                  Policy:{' '}
                  <span className="font-semibold text-gray-800">{deleteTarget.name || 'Unnamed'}</span>
                </p>
                <p className="text-gray-500 mt-1">
                  Category:{' '}
                  <span className="font-semibold text-gray-800">
                    {deleteTarget.category?.name ?? 'Unknown'}
                  </span>
                </p>
                <p className="text-gray-500 mt-1">
                  Priority:{' '}
                  <span className="font-semibold text-gray-800">{deleteTarget.priority}</span>
                </p>
              </div>
              {deleteError && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
                  {deleteError}
                </div>
              )}
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={cancelDelete}
                  disabled={deleting}
                  className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors flex-1 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex-1 disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface NumberFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function NumberField({ label, value, onChange }: NumberFieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        type="number"
        min={1}
        step={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D336B] focus:border-transparent"
        required
      />
    </div>
  );
}
