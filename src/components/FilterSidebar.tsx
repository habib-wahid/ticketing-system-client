import React, { useEffect, useState, useRef } from 'react';
import { SlidersHorizontal, X, User as UserIcon, Calendar, Loader2 } from 'lucide-react';
import { categoryApi, userApi } from '../services/api';
import type { ComplaintCategoryResponse } from '../types/category';
import type { AuthUser } from '../types/auth';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    priority: string;
    category: string;
    status: string;
    flag: string;
    issuer: string;
    issuerName?: string;
    assignedTo: string;
    assignedToName?: string;
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
  const [categories, setCategories] = useState<ComplaintCategoryResponse[]>([]);
  
  // User Search State
  const [issuerSearch, setIssuerSearch] = useState(filters.issuerName || '');
  const [assignedSearch, setAssignedSearch] = useState(filters.assignedToName || '');
  const [issuerResults, setIssuerResults] = useState<AuthUser[]>([]);
  const [assignedResults, setAssignedResults] = useState<AuthUser[]>([]);
  const [isSearchingIssuer, setIsSearchingIssuer] = useState(false);
  const [isSearchingAssigned, setIsSearchingAssigned] = useState(false);
  const [showIssuerDropdown, setShowIssuerDropdown] = useState(false);
  const [showAssignedDropdown, setShowAssignedDropdown] = useState(false);

  const issuerRef = useRef<HTMLDivElement>(null);
  const assignedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (issuerRef.current && !issuerRef.current.contains(event.target as Node)) {
        setShowIssuerDropdown(false);
      }
      if (assignedRef.current && !assignedRef.current.contains(event.target as Node)) {
        setShowAssignedDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.findAll(0, 100);
        setCategories(response.content);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  // Debounced User Search for Issuer
  useEffect(() => {
    if (!issuerSearch || issuerSearch === filters.issuerName) {
      setIssuerResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingIssuer(true);
      try {
        const results = await userApi.search(issuerSearch);
        setIssuerResults(results);
        setShowIssuerDropdown(true);
      } catch (error) {
        console.error('Failed to search users:', error);
      } finally {
        setIsSearchingIssuer(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [issuerSearch, filters.issuerName]);

  // Debounced User Search for Assigned To
  useEffect(() => {
    if (!assignedSearch || assignedSearch === filters.assignedToName) {
      setAssignedResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingAssigned(true);
      try {
        const results = await userApi.search(assignedSearch);
        setAssignedResults(results);
        setShowAssignedDropdown(true);
      } catch (error) {
        console.error('Failed to search users:', error);
      } finally {
        setIsSearchingAssigned(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [assignedSearch, filters.assignedToName]);

  if (!isOpen) return null;

  const handleReset = () => {
    setIssuerSearch('');
    setAssignedSearch('');
    setFilters({
      priority: 'all',
      category: 'all',
      status: 'all',
      flag: 'all',
      issuer: '',
      issuerName: '',
      assignedTo: '',
      assignedToName: '',
      startDate: '',
      endDate: '',
    });
  };

  const updateFilter = (key: string, value: string) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  const selectUser = (type: 'issuer' | 'assignedTo', user: AuthUser) => {
    const fullName = `${user.firstName} ${user.lastName}`;
    if (type === 'issuer') {
      setIssuerSearch(fullName);
      setFilters((prev: any) => ({ 
        ...prev, 
        issuer: user.userId, 
        issuerName: fullName 
      }));
      setShowIssuerDropdown(false);
    } else {
      setAssignedSearch(fullName);
      setFilters((prev: any) => ({ 
        ...prev, 
        assignedTo: user.userId, 
        assignedToName: fullName 
      }));
      setShowAssignedDropdown(false);
    }
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
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Priority
            </label>
            <select
              value={filters.priority}
              onChange={(e) => updateFilter('priority', e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#433878]/20 focus:border-[#433878] transition-all cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => updateFilter('status', e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#433878]/20 focus:border-[#433878] transition-all cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_process">In Process</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
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
          <div ref={issuerRef}>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Issuer
            </label>
            <div className="relative">
              <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search issuer..."
                value={issuerSearch}
                onChange={(e) => setIssuerSearch(e.target.value)}
                onFocus={() => issuerResults.length > 0 && setShowIssuerDropdown(true)}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#433878]/20 focus:border-[#433878] transition-all"
              />
              {isSearchingIssuer && (
                <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />
              )}
              
              {showIssuerDropdown && issuerResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {issuerResults.map((user) => (
                    <button
                      key={user.userId}
                      onClick={() => selectUser('issuer', user)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-3 transition-colors border-b last:border-0 border-gray-50"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#433878]/10 text-[#433878] flex items-center justify-center text-xs font-bold uppercase">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {filters.issuer && (
              <button 
                onClick={() => {
                  setIssuerSearch('');
                  updateFilter('issuer', '');
                  updateFilter('issuerName', '');
                }}
                className="mt-2 text-xs text-red-500 hover:text-red-600 font-medium"
              >
                Clear Selection
              </button>
            )}
          </div>

          {/* Assigned To (Searchable) */}
          <div ref={assignedRef}>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Assigned To
            </label>
            <div className="relative">
              <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search employee..."
                value={assignedSearch}
                onChange={(e) => setAssignedSearch(e.target.value)}
                onFocus={() => assignedResults.length > 0 && setShowAssignedDropdown(true)}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#433878]/20 focus:border-[#433878] transition-all"
              />
              {isSearchingAssigned && (
                <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />
              )}

              {showAssignedDropdown && assignedResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {assignedResults.map((user) => (
                    <button
                      key={user.userId}
                      onClick={() => selectUser('assignedTo', user)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-3 transition-colors border-b last:border-0 border-gray-50"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#433878]/10 text-[#433878] flex items-center justify-center text-xs font-bold uppercase">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {filters.assignedTo && (
              <button 
                onClick={() => {
                  setAssignedSearch('');
                  updateFilter('assignedTo', '');
                  updateFilter('assignedToName', '');
                }}
                className="mt-2 text-xs text-red-500 hover:text-red-600 font-medium"
              >
                Clear Selection
              </button>
            )}
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
