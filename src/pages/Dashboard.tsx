import { useState, useEffect } from 'react';
import { AlertCircle, Clock, CheckCircle, TrendingUp, Calendar, ChevronDown } from 'lucide-react';
import {
  PieChart, Pie, Legend, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { apiClient } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface DashboardStats {
  openTickets: number;
  newTickets: number;
  inProcessTickets: number;
  closedTickets: number;
}

interface PriorityStats {
  low: number;
  medium: number;
  high: number;
  critical: number;
}

interface CategoryCount {
  categoryId: string;
  categoryName: string;
  count: number;
}

interface CategoryStats {
  categories: CategoryCount[];
}

interface DashboardData {
  stats: DashboardStats;
  priorityStats: PriorityStats;
  categoryStats: CategoryStats;
}

interface TicketDashboardApiResponse {
  openTickets: number;
  newTickets: number;
  inProcessTickets: number;
  closedTickets: number;
}

interface TicketPriorityApiResponse {
  low: number;
  medium: number;
  high: number;
  critical: number;
}

interface TicketCategoryApiResponse extends Array<CategoryCount> {}

interface DailyStatEntry {
  date: string;
  reportedCount: number;
  solvedCount: number;
}

type DateRange = { from: string; to: string };

export function Dashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Individual date ranges for each section
  const [statsDateRange, setStatsDateRange] = useState<DateRange>({ from: '', to: '' });
  const [priorityDateRange, setPriorityDateRange] = useState<DateRange>({ from: '', to: '' });
  const [categoryDateRange, setCategoryDateRange] = useState<DateRange>({ from: '', to: '' });

  // Daily stats state
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth()); // 0-indexed
  const [dailyStats, setDailyStats] = useState<DailyStatEntry[]>([]);
  const [dailyStatsLoading, setDailyStatsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        // Build query params for each date range
        const buildParams = (dateRange: DateRange) => {
          const params = new URLSearchParams();
          if (dateRange.from) params.append('from', new Date(dateRange.from).toISOString());
          if (dateRange.to) params.append('to', new Date(dateRange.to).toISOString());
          return params.toString();
        };

        const statsQueryString = buildParams(statsDateRange);
        const priorityQueryString = buildParams(priorityDateRange);
        const categoryQueryString = buildParams(categoryDateRange);

        // Fetch dashboard stats from three endpoints
        const [ticketResult, priorityResult, categoryResult] = await Promise.all([
          apiClient<{ data: TicketDashboardApiResponse }>(
            `/api/dashboard/tickets${statsQueryString ? '?' + statsQueryString : ''}`
          ),
          apiClient<{ data: TicketPriorityApiResponse }>(
            `/api/dashboard/tickets-by-priority${priorityQueryString ? '?' + priorityQueryString : ''}`
          ),
          apiClient<{ data: TicketCategoryApiResponse }>(
            `/api/dashboard/tickets-by-complaint-category${categoryQueryString ? '?' + categoryQueryString : ''}`
          ),
        ]);

        setDashboardData({
          stats: {
            openTickets: ticketResult.data.openTickets ?? 0,
            newTickets: ticketResult.data.newTickets ?? 0,
            inProcessTickets: ticketResult.data.inProcessTickets ?? 0,
            closedTickets: ticketResult.data.closedTickets ?? 0,
          },
          priorityStats: {
            low: priorityResult.data.low ?? 0,
            medium: priorityResult.data.medium ?? 0,
            high: priorityResult.data.high ?? 0,
            critical: priorityResult.data.critical ?? 0,
          },
          categoryStats: {
            categories: (Array.isArray(categoryResult.data) ? categoryResult.data : []) as CategoryCount[],
          },
        });
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, statsDateRange, priorityDateRange, categoryDateRange]);

  useEffect(() => {
    if (!user) return;
    const fetchDailyStats = async () => {
      setDailyStatsLoading(true);
      try {
        const from = new Date(selectedYear, selectedMonth, 1);
        const to = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59);
        const params = new URLSearchParams({
          from: from.toISOString(),
          to: to.toISOString(),
        });
        const result = await apiClient<{ data: DailyStatEntry[] }>(
          `/api/dashboard/daily-stats?${params.toString()}`
        );
        setDailyStats(Array.isArray(result.data) ? result.data : []);
      } catch {
        setDailyStats([]);
      } finally {
        setDailyStatsLoading(false);
      }
    };
    fetchDailyStats();
  }, [user, selectedYear, selectedMonth]);

  const handleDateChange = (setter: React.Dispatch<React.SetStateAction<DateRange>>, field: 'from' | 'to', value: string) => {
    setter(prev => ({ ...prev, [field]: value }));
  };

  const resetDateRange = (setter: React.Dispatch<React.SetStateAction<DateRange>>) => {
    setter({ from: '', to: '' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#433878] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-800">
        <AlertCircle className="inline mr-2" />
        {error}
      </div>
    );
  }

  if (!dashboardData) {
    return <div>No data available</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.firstName} {user?.lastName}! Here's your ticket overview.</p>
      </div>

      {/* Stats Cards Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Ticket Overview</h2>
          <DateRangeFilter
            dateRange={statsDateRange}
            onDateChange={(field, value) => handleDateChange(setStatsDateRange, field, value)}
            onReset={() => resetDateRange(setStatsDateRange)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Open Tickets"
            count={dashboardData.stats.openTickets}
            icon={AlertCircle}
            color="bg-blue-500"
            lightColor="bg-blue-50"
          />
          <StatCard
            title="New Tickets"
            count={dashboardData.stats.newTickets}
            icon={TrendingUp}
            color="bg-yellow-500"
            lightColor="bg-yellow-50"
          />
          <StatCard
            title="In-Process Tickets"
            count={dashboardData.stats.inProcessTickets}
            icon={Clock}
            color="bg-purple-500"
            lightColor="bg-purple-50"
          />
          <StatCard
            title="Closed Tickets"
            count={dashboardData.stats.closedTickets}
            icon={CheckCircle}
            color="bg-green-500"
            lightColor="bg-green-50"
          />
        </div>
      </div>

      {/* Daily Tickets Volume Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Daily Tickets Volume</h2>
          <MonthSelector
            year={selectedYear}
            month={selectedMonth}
            onChange={(y, m) => { setSelectedYear(y); setSelectedMonth(m); }}
          />
        </div>
        {dailyStatsLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#433878]"></div>
          </div>
        ) : dailyStats.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-400">No data for this period</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={dailyStats.map((d) => ({
                day: d.date.slice(-2).replace(/^0/, '') || d.date,
                newTicket: d.reportedCount,
                solved: d.solvedCount,
              }))}
              margin={{ top: 4, right: 8, left: 0, bottom: 4 }}
              barCategoryGap="20%"
              barGap={-8}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <Tooltip
                cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                formatter={(value, name) => [
                  value,
                  name === 'newTicket' ? 'New Ticket' : 'Solved',
                ]}
              />
              <Legend
                iconType="circle"
                iconSize={10}
                formatter={(value) => (
                  <span style={{ fontSize: 12, color: '#6b7280' }}>
                    {value === 'newTicket' ? 'New Ticket' : 'Solved'}
                  </span>
                )}
              />
              <Bar dataKey="solved" fill="#bfdbfe" radius={[3, 3, 0, 0]} barSize={18} />
              <Bar dataKey="newTicket" fill="#fca5a5" radius={[3, 3, 0, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tickets by Priority */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Tickets Volume by Priority</h2>
            <DateRangeFilter
              dateRange={priorityDateRange}
              onDateChange={(field, value) => handleDateChange(setPriorityDateRange, field, value)}
              onReset={() => resetDateRange(setPriorityDateRange)}
            />
          </div>

          <div className="mt-6 flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Critical', value: dashboardData.priorityStats.critical, fill: '#dc2626' },
                    { name: 'High', value: dashboardData.priorityStats.high, fill: '#f97316' },
                    { name: 'Medium', value: dashboardData.priorityStats.medium, fill: '#eab308' },
                    { name: 'Low', value: dashboardData.priorityStats.low, fill: '#16a34a' },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}  
                  outerRadius={80}
                  dataKey="value"
                />
                <Tooltip formatter={(value) => [`${value} tickets`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tickets by Category */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Category-wise Ticket Volume</h2>
            <DateRangeFilter
              dateRange={categoryDateRange}
              onDateChange={(field, value) => handleDateChange(setCategoryDateRange, field, value)}
              onReset={() => resetDateRange(setCategoryDateRange)}
            />
          </div>

          <div className="mt-6 flex justify-center">
            {dashboardData.categoryStats.categories.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboardData.categoryStats.categories.map((item, index) => ({
                      name: item.categoryName,
                      value: item.count,
                      fill: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f97316', '#6366f1'][index % 8],
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    dataKey="value"
                  />
                  <Tooltip formatter={(value) => [`${value} tickets`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500">No category data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  count: number;
  icon: React.ComponentType<{ size: number; className?: string }>;
  color: string;
  lightColor: string;
}

function StatCard({ title, count, icon: Icon, color, lightColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{count}</p>
        </div>
        <div className={`${lightColor} p-3 rounded-lg`}>
          <Icon size={24} className={`${color} text-white`} />
        </div>
      </div>
    </div>
  );
}

interface MonthSelectorProps {
  year: number;
  month: number; // 0-indexed
  onChange: (year: number, month: number) => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function MonthSelector({ year, month, onChange }: MonthSelectorProps) {
  const [open, setOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors text-gray-700 font-medium shadow-sm"
      >
        <span>{MONTH_NAMES[month]}, {String(year).slice(-2)}</span>
        <ChevronDown size={14} className="text-gray-500" />
      </button>
      {open && (
        <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-10 w-64">
          <div className="mb-3">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Year</label>
            <select
              value={year}
              onChange={(e) => onChange(Number(e.target.value), month)}
              className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-[#433878] outline-none"
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Month</label>
            <div className="grid grid-cols-3 gap-1">
              {MONTH_NAMES.map((name, idx) => (
                <button
                  key={name}
                  onClick={() => { onChange(year, idx); setOpen(false); }}
                  className={`px-2 py-1.5 text-xs rounded-md transition-colors ${
                    idx === month
                      ? 'bg-[#433878] text-white font-semibold'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {name.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface DateRangeFilterProps {
  dateRange: DateRange;
  onDateChange: (field: 'from' | 'to', value: string) => void;
  onReset: () => void;
}

function DateRangeFilter({ dateRange, onDateChange, onReset }: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors text-gray-700 font-medium shadow-sm"
      >
        <Calendar size={16} className="text-gray-500" />
        <span className="text-gray-600">
          {dateRange.from || dateRange.to 
            ? `${dateRange.from ? dateRange.from : 'Start'} - ${dateRange.to ? dateRange.to : 'End'}` 
            : 'Select Date Range'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border border-gray-300 p-4 z-10 w-96">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-700 mb-2">From Date</label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => onDateChange('from', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#433878] focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-700 mb-2">To Date</label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => onDateChange('to', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#433878] focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                onReset();
                setIsOpen(false);
              }}
              className="flex-1 px-3 py-2 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
            >
              Reset
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 px-3 py-2 text-xs font-medium bg-[#433878] hover:bg-[#3a2d66] text-white rounded-md transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
