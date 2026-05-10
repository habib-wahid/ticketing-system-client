import React from 'react';
import { SlidersHorizontal, X, User as UserIcon, Calendar } from 'lucide-react';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    priority: string;
    category: string;
    status: string;
    flag: string;
    issuer: string;
    assignedTo: string;
    startDate: string;
    endDate: string;
  };
  setFilters: (filters: any) => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  filters,
  setFilters,
}) => {
  if (!isOpen) return null;

  const handleReset = () => {
    setFilters({
      priority: 'all',
      category: 'all',
      status: 'all',
      flag: 'all',
      issuer: '',
      assignedTo: '',
      startDate: '',
      endDate: '',
    });
  };

  const updateFilter = (key: string, value: string) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-[60]"
        onClick={onClose}
      />

      {/* Modal - Right Side Panel */}
      <div className="fixed right-0 top-0 h-full w-[400px] bg-white shadow-2xl z-[70] flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <SlidersHorizontal size={20} className="text-[#433878]" />
            <h3 className="text-xl font-bold text-gray-900">Filters</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Complaint Category */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Complaint Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#433878]/20 focus:border-[#433878] transition-all cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="technical">Technical</option>
              <option value="billing">Billing</option>
              <option value="general">General</option>
              <option value="feature">Feature Request</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Priority
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['all', 'low', 'medium', 'high', 'critical'].map((value) => (
                <button
                  key={value}
                  onClick={() => updateFilter('priority', value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all capitalize ${
                    filters.priority === value
                      ? 'bg-[#433878] border-[#433878] text-white'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-[#433878]/50'
                  }`}
                >
                  {value === 'all' ? 'All' : value}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              {['all', 'pending', 'in_process', 'resolved', 'closed'].map((value) => (
                <button
                  key={value}
                  onClick={() => updateFilter('status', value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all uppercase tracking-wider ${
                    filters.status === value
                      ? 'bg-[#433878] border-[#433878] text-white shadow-sm'
                      : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {value.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Flag */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Flag
            </label>
            <div className="flex gap-4">
              {['all', 'flagged', 'unflagged'].map((value) => (
                <label key={value} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="flag"
                    value={value}
                    checked={filters.flag === value}
                    onChange={(e) => updateFilter('flag', e.target.value)}
                    className="w-4 h-4 text-[#433878] border-gray-300 focus:ring-[#433878] cursor-pointer"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 capitalize">
                    {value}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Issuer (Searchable) */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Issuer
            </label>
            <div className="relative">
              <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search issuer..."
                value={filters.issuer}
                onChange={(e) => updateFilter('issuer', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#433878]/20 focus:border-[#433878] transition-all"
              />
            </div>
          </div>

          {/* Assigned To (Searchable) */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Assigned To
            </label>
            <div className="relative">
              <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search employee..."
                value={filters.assignedTo}
                onChange={(e) => updateFilter('assignedTo', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#433878]/20 focus:border-[#433878] transition-all"
              />
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Date Range
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => updateFilter('startDate', e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#433878]/20 focus:border-[#433878] transition-all"
                />
              </div>
              <div className="relative">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => updateFilter('endDate', e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#433878]/20 focus:border-[#433878] transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 flex gap-4 bg-gray-50/50">
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-white transition-all shadow-sm"
          >
            Reset All
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-[#433878] hover:bg-[#3a2d66] text-white rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};
