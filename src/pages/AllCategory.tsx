import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { categoryApi } from '../services/api';
import type { ComplaintCategoryResponse } from '../types/category';
import type { PagedResponse } from '../types/ticket';

export function AllCategory() {
  const [categories, setCategories] = useState<ComplaintCategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageInfo, setPageInfo] = useState<Omit<PagedResponse<ComplaintCategoryResponse>, 'content'>>({
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 10,
    last: true,
    first: true,
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchCategories = useCallback(async (page: number, search: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryApi.findAll(page, 10, search);
      setCategories(data.content || []);
      setPageInfo({
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        number: data.number,
        size: data.size,
        last: data.last,
        first: data.first,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearch]);

  useEffect(() => {
    fetchCategories(currentPage, debouncedSearch);
  }, [currentPage, debouncedSearch, fetchCategories]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const openAddModal = () => {
    setEditingId(null);
    setCategoryName('');
    setIsModalOpen(true);
  };

  const openEditModal = (category: ComplaintCategoryResponse) => {
    setEditingId(category.id);
    setCategoryName(category.name);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCategoryName('');
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    setSubmitting(true);
    try {
      if (editingId) {
        await categoryApi.update(editingId, { name: categoryName.trim() });
      } else {
        await categoryApi.create({ name: categoryName.trim() });
      }
      closeModal();
      fetchCategories(currentPage, debouncedSearch);
    } catch (err: any) {
      alert(err.message || 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await categoryApi.delete(id);
      fetchCategories(currentPage, debouncedSearch);
    } catch (err: any) {
      alert(err.message || 'Failed to delete category');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const { number: activePage, totalPages, totalElements, first, last } = pageInfo;
  
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }
    const start = Math.max(0, activePage - 2);
    const end = Math.min(totalPages - 1, activePage + 2);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Complaint Categories</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#2D336B] hover:bg-[#1E2248] text-white px-4 py-2 rounded-lg transition-colors font-medium"
        >
          <Plus size={18} />
          <span>Add Category</span>
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4 bg-gray-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D336B] focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-gray-400 font-medium">
              <div className="inline-block w-6 h-6 border-2 border-[#2D336B] border-t-transparent rounded-full animate-spin mb-3" />
              <p>Loading categories...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500 font-medium bg-red-50">
              ⚠️ {error}
            </div>
          ) : categories.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No categories found. {searchTerm ? 'Try a different search term.' : 'Click "Add Category" to create one.'}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
                  <th className="p-4 font-semibold">Complaint Category</th>
                  <th className="p-4 font-semibold">Created On</th>
                  <th className="p-4 font-semibold">Created By</th>
                  <th className="p-4 font-semibold">Last Updated On</th>
                  <th className="p-4 font-semibold">Last Updated By</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-medium text-gray-800">{category.name}</td>
                    <td className="p-4 text-gray-600">{formatDate(category.createdAt)}</td>
                    <td className="p-4 text-gray-600">{category.createdBy || '-'}</td>
                    <td className="p-4 text-gray-600">{formatDate(category.updatedAt)}</td>
                    <td className="p-4 text-gray-600">{category.updatedBy || '-'}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(category)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
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

        {/* Pagination Footer */}
        {!loading && !error && categories.length > 0 && (
          <div className="p-4 flex justify-between items-center border-t border-gray-100 bg-gray-50/50">
            <div className="text-sm text-gray-500 font-medium">
              Showing{' '}
              <span className="text-gray-900">{categories.length}</span>
              {' '}from{' '}
              <span className="text-gray-900">{totalElements}</span> results
              {totalPages > 1 && (
                <span className="text-gray-400"> — page {activePage + 1} of {totalPages}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(0)}
                disabled={first}
                className="p-1.5 text-gray-400 hover:text-[#433878] transition-colors rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                title="First page"
              >
                <ChevronsLeft size={18} />
              </button>
              <button
                onClick={() => handlePageChange(activePage - 1)}
                disabled={first}
                className="p-1.5 text-gray-400 hover:text-[#433878] transition-colors rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Previous page"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center gap-1 mx-2">
                {getPageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${pageNum === activePage
                      ? 'bg-[#2D336B] text-white'
                      : 'text-gray-500 hover:bg-gray-100'
                      }`}
                  >
                    {pageNum + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(activePage + 1)}
                disabled={last}
                className="p-1.5 text-gray-400 hover:text-[#433878] transition-colors rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Next page"
              >
                <ChevronRight size={18} />
              </button>
              <button
                onClick={() => handlePageChange(totalPages - 1)}
                disabled={last}
                className="p-1.5 text-gray-400 hover:text-[#433878] transition-colors rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Last page"
              >
                <ChevronsRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">
                {editingId ? 'Edit Category' : 'Add Category'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Enter category name"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D336B] focus:border-transparent"
                  required
                  autoFocus
                />
              </div>

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
                  disabled={submitting || !categoryName.trim()}
                >
                  {submitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
