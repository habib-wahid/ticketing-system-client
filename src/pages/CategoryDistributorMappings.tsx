import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { categoryApi, categoryDistributorMappingApi, userApi } from '../services/api';
import type { CategoryDistributorMappingResponse } from '../types/categoryDistributorMapping';
import type { ComplaintCategoryResponse } from '../types/category';
import type { AuthUser } from '../types/auth';

interface MappingForm {
  categoryId: string;
  distributorUserId: string;
  distributorLabel: string;
  active: boolean;
}

const emptyForm: MappingForm = {
  categoryId: '',
  distributorUserId: '',
  distributorLabel: '',
  active: true,
};

export function CategoryDistributorMappings() {
  const [mappings, setMappings] = useState<CategoryDistributorMappingResponse[]>([]);
  const [categories, setCategories] = useState<ComplaintCategoryResponse[]>([]);
  const [distributors, setDistributors] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<MappingForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CategoryDistributorMappingResponse | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchMappings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryDistributorMappingApi.findAll();
      setMappings(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch mappings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMappings();
  }, [fetchMappings]);

  useEffect(() => {
    categoryApi
      .findAll(0, 100)
      .then((data) => setCategories(data.content ?? []))
      .catch(() => setCategories([]));

    userApi
      .search('', 'DISTRIBUTOR')
      .then(setDistributors)
      .catch(() => setDistributors([]));
  }, []);

  const mappedCategoryIds = new Set(mappings.map((m) => m.categoryId));
  const availableCategories = editingId
    ? categories
    : categories.filter((c) => !mappedCategoryIds.has(c.id));

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (mapping: CategoryDistributorMappingResponse) => {
    setEditingId(mapping.id);
    setForm({
      categoryId: mapping.categoryId,
      distributorUserId: mapping.distributorUserId,
      distributorLabel: mapping.distributorName,
      active: mapping.active,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!editingId && !form.categoryId) {
      setFormError('Select a complaint category');
      return;
    }
    if (!form.distributorUserId) {
      setFormError('Select a distributor');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await categoryDistributorMappingApi.update(editingId, {
          distributorUserId: form.distributorUserId,
          active: form.active,
        });
      } else {
        await categoryDistributorMappingApi.create({
          categoryId: form.categoryId,
          distributorUserId: form.distributorUserId,
          active: form.active,
        });
      }
      closeModal();
      await fetchMappings();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to save mapping');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await categoryDistributorMappingApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      await fetchMappings();
    } catch (err: unknown) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete mapping');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Category Distributors</h1>
          <p className="text-sm text-gray-500 mt-1">
            Map each complaint category to exactly one distributor for auto-routing.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-[#433878] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#372e66] transition-colors"
        >
          <Plus size={18} />
          Add Mapping
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-gray-500">Loading mappings…</div>
      ) : mappings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center text-gray-500">
          No category–distributor mappings yet.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide">
              <tr>
                <th className="px-6 py-3 font-semibold">Category</th>
                <th className="px-6 py-3 font-semibold">Distributor</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mappings.map((mapping) => (
                <tr key={mapping.id} className="hover:bg-gray-50/60">
                  <td className="px-6 py-4 font-medium text-gray-900">{mapping.categoryName}</td>
                  <td className="px-6 py-4 text-gray-700">
                    <div>{mapping.distributorName}</div>
                    <div className="text-xs text-gray-400">{mapping.distributorUserId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                        mapping.active
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {mapping.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(mapping)}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-[#433878]"
                        aria-label="Edit mapping"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteError(null);
                          setDeleteTarget(mapping);
                        }}
                        className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600"
                        aria-label="Delete mapping"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">
                {editingId ? 'Edit Mapping' : 'Add Mapping'}
              </h2>
              <button type="button" onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {!editingId && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Complaint Category
                  </label>
                  <select
                    value={form.categoryId}
                    onChange={(e) => setForm((prev) => ({ ...prev, categoryId: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#433878]/30"
                  >
                    <option value="">Select category</option>
                    {availableCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {!editingId && availableCategories.length === 0 && (
                    <p className="mt-1 text-xs text-amber-600">
                      All categories already have a distributor mapped.
                    </p>
                  )}
                </div>
              )}

              {editingId && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                  <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                    {categories.find((c) => c.id === form.categoryId)?.name ?? form.categoryId}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Distributor</label>
                <select
                  value={form.distributorUserId}
                  onChange={(e) => {
                    const selected = distributors.find((d) => d.userId === e.target.value);
                    setForm((prev) => ({
                      ...prev,
                      distributorUserId: e.target.value,
                      distributorLabel: selected
                        ? `${selected.firstName} ${selected.lastName}`.trim()
                        : '',
                    }));
                  }}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#433878]/30"
                >
                  <option value="">Select distributor</option>
                  {distributors.map((user) => (
                    <option key={user.userId} value={user.userId}>
                      {user.firstName} {user.lastName} ({user.email})
                    </option>
                  ))}
                </select>
                {distributors.length === 0 && (
                  <p className="mt-1 text-xs text-amber-600">
                    No active users with role DISTRIBUTOR found. Create one first.
                  </p>
                )}
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.checked }))}
                  className="rounded border-gray-300 text-[#433878] focus:ring-[#433878]"
                />
                Active
              </label>

              {formError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {formError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#433878] text-white hover:bg-[#372e66] disabled:opacity-60"
                >
                  {submitting ? 'Saving…' : editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete mapping?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Remove distributor routing for <strong>{deleteTarget.categoryName}</strong>?
            </p>
            {deleteError && (
              <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {deleteError}
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
