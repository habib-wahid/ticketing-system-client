import { LayoutDashboard, Ticket, Settings, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Ticket, label: 'Tickets', path: '/' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="w-64 bg-white min-h-screen border-r border-gray-100 flex flex-col p-6 shadow-sm">
      <div className="mb-12 flex flex-col items-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-2">
          <span className="text-white font-bold text-xs text-center leading-tight">ORCHIDA SOFT<br/>BUSINESS SOLUTIONS</span>
        </div>
      </div>

      <nav className="flex-1 space-y-4">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              location.pathname === item.path ? 'text-[#433878] font-bold' : 'text-[#7C7C7C]'
            }`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto space-y-6">
        <button className="w-full bg-[#B23B2B] text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#a03527] transition-colors">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};
