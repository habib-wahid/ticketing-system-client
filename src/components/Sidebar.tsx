import { LayoutDashboard, Ticket, Settings, LogOut, ChevronDown, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export const Sidebar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({ Management: true });

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    ...(user?.role === 'ADMIN' ? [{ icon: Ticket, label: 'All-Tickets', path: '/all-tickets' }] : []),
    { icon: Ticket, label: 'My Tickets', path: '/' },
    { icon: Ticket, label: 'Assigned Tickets', path: '/assigned' },
    ...(user?.role === 'ADMIN' ? [{
      icon: Settings,
      label: 'Management',
      children: [
        { label: 'All-Categories', path: '/management/all-categories' },
        { label: 'SLA Policies', path: '/management/sla-policies' },
        { label: 'Category Distributors', path: '/management/category-distributors' },
      ]
    }] : []),
  ];

  const renderMenuItem = (item: any) => {
    const hasChildren = !!item.children;
    const isExpanded = expandedMenus[item.label];

    // Check if current path starts with any child path to highlight parent
    const isChildActive = hasChildren && item.children.some((child: any) => location.pathname.startsWith(child.path));
    const isActive = location.pathname === item.path || isChildActive;

    return (
      <div key={item.label} className="w-full">
        {hasChildren ? (
          <button
            onClick={() => toggleMenu(item.label)}
            className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${isActive ? 'text-[#433878] font-bold' : 'text-[#7C7C7C]'}`}
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} />
              <span>{item.label}</span>
            </div>
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        ) : (
          <Link
            to={item.path}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${location.pathname === item.path ? 'text-[#433878] font-bold' : 'text-[#7C7C7C]'}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        )}

        {hasChildren && isExpanded && (
          <div className="ml-8 mt-2 space-y-2 border-l-2 border-gray-100 pl-4">
            {item.children.map((child: any) => (
              <Link
                key={child.label}
                to={child.path}
                className={`block py-1 transition-colors ${location.pathname === child.path ? 'text-[#433878] font-semibold' : 'text-[#7C7C7C] hover:text-[#433878]'}`}
              >
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-white min-h-screen border-r border-gray-100 flex flex-col p-6 shadow-sm">
      <div className="mb-12 flex flex-col items-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-2">
          <span className="text-white font-bold text-xs text-center leading-tight">ORCHIDA SOFT<br />BUSINESS SOLUTIONS</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map(renderMenuItem)}
      </nav>

      <div className="mt-auto space-y-6">
        <button
          onClick={logout}
          className="w-full bg-[#B23B2B] text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#a03527] transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};
