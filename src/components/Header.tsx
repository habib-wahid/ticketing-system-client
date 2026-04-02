import { Search, Globe } from 'lucide-react';

export const Header = () => {
  return (
    <header className="h-16 flex items-center justify-between px-8 bg-transparent">
      <div className="relative flex-1 max-w-md">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder="Search..."
          className="block w-full pl-10 pr-3 py-2 border-none bg-transparent focus:ring-0 text-gray-600 placeholder-gray-400"
        />
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 bg-[#EEF2FF] p-1 rounded">
          <Globe size={20} className="text-[#433878]" />
          <img src="https://flagcdn.com/w20/gb.png" alt="UK Flag" className="h-4" />
        </div>
        <div className="w-10 h-10 bg-[#433878] rounded-full flex items-center justify-center text-white font-bold">
          A
        </div>
      </div>
    </header>
  );
};
