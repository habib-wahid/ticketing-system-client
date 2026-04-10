import { Search, Menu, Settings, Bell, MessageSquare, Gift, ChevronDown } from 'lucide-react';

export const Header = () => {
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
      {/* Left side: Menu and Title */}
      <div className="flex items-center gap-4">
        <button className="text-gray-500 hover:text-gray-700 lg:hidden">
          <Menu size={24} />
        </button>
        <h2 className="text-xl font-bold text-gray-800">Customer</h2>
      </div>

      {/* Middle: Search Bar */}
      <div className="flex-1 max-w-xl px-8 hidden md:block">
        <div className="relative group">
          <input
            type="text"
            placeholder="Search here"
            className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#433878]/20 focus:border-[#433878] transition-all"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#433878]" size={18} />
        </div>
      </div>

      {/* Right side: Icons and Profile */}
      <div className="flex items-center gap-2 sm:gap-4">

        <button className="p-2 relative text-gray-400 hover:bg-gray-100 rounded-xl transition-colors">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-yellow-400 rounded-full border-2 border-white"></span>
        </button>


        {/* Profile Section */}
        <div className="ml-1 pl-2 sm:pl-4 border-l border-gray-100 flex items-center gap-2 sm:gap-3 cursor-pointer hover:bg-gray-50 p-1 rounded-xl transition-colors group">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="David"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-cover border-2 border-transparent group-hover:border-[#433878]/10 transition-all"
          />
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-sm font-bold text-gray-700 hidden sm:block">David</span>
            <ChevronDown size={16} className="text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
};
