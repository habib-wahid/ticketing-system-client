import { Menu, Bell, ChevronDown, LogOut, User, Mail, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const displayName = user ? `${user.firstName}` : 'Guest';
  const initials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : 'G';

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
      {/* Left side: Menu and Title */}
      <div className="flex items-center gap-4">
        <button className="text-gray-500 hover:text-gray-700 lg:hidden">
          <Menu size={24} />
        </button>
        <h2 className="text-xl font-bold text-gray-800">{user?.role ?? 'Customer'}</h2>
      </div>


      {/* Right side: Icons and Profile */}
      <div className="flex items-center gap-2 sm:gap-4">

        <button className="p-2 relative text-gray-400 hover:bg-gray-100 rounded-xl transition-colors">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-yellow-400 rounded-full border-2 border-white"></span>
        </button>


        {/* Profile Dropdown */}
        <div className="relative">
          <div
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="ml-1 pl-2 sm:pl-4 border-l border-gray-100 flex items-center gap-2 sm:gap-3 cursor-pointer hover:bg-gray-50 p-1 rounded-xl transition-colors group"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#2D336B] to-[#433878] flex items-center justify-center border-2 border-transparent group-hover:border-[#433878]/10 transition-all">
              <span className="text-white font-bold text-xs sm:text-sm">
                {initials}
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-sm font-bold text-gray-700 hidden sm:block">
                {displayName}
              </span>
              <ChevronDown
                size={16}
                className={`text-gray-400 transition-transform ${
                  isProfileOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
          </div>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
              {/* User Info Section */}
              <div className="pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2D336B] to-[#433878] flex items-center justify-center border-2 border-[#433878]/20">
                    <span className="text-white font-bold text-sm">
                      {initials}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {displayName}
                    </p>
                    <p className="text-xs text-gray-500">{user?.role}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-gray-400 flex-shrink-0" />
                    <p className="text-xs text-gray-600 break-all">{user?.email}</p>
                  </div>
                  {user?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-gray-400 flex-shrink-0" />
                      <p className="text-xs text-gray-600">{user?.phone}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-3 space-y-2">
                <button
                  onClick={() => {
                    navigate('/profile');
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <User size={16} className="text-gray-500" />
                  <span>View Profile</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
