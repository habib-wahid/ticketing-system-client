import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-[#505278] flex items-center justify-center p-4">
      {/* Container */}
      <div className="max-w-6xl w-full bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] relative">
        
        {/* Language Selector Placeholder (Top Right) */}
        <div className="absolute top-4 right-4 z-10 bg-white/10 rounded-md p-1 border border-gray-100 shadow-sm flex items-center gap-1 cursor-pointer">
           <img src="https://flagcdn.com/w20/gb.png" alt="UK Flag" className="w-5 h-4 object-cover" />
           <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </div>

        {/* Left Section - Form */}
        <div className="w-full md:w-1/2 p-12 flex flex-col items-center justify-center">
          <div className="w-full max-w-md">
            <h1 className="text-4xl font-black text-black tracking-wider text-center mb-4 uppercase">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-600 text-center mb-12 font-medium">
                {subtitle}
              </p>
            )}
            {children}
          </div>
        </div>

        {/* Right Section - Illustration */}
        <div className="hidden md:flex w-1/2 bg-[#F1F1F1] items-center justify-center p-12 relative">
          <div className="flex flex-col items-center">
             {/* Mock Illustration - Representing the complex UI in the image */}
             <div className="relative w-80 h-80">
                {/* Laptop/Screen base */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 h-48 bg-white rounded-lg shadow-xl border-4 border-[#2D336B] flex items-center justify-center">
                   <div className="w-16 h-16 bg-[#2D336B]/10 rounded-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-[#2D336B]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                   </div>
                </div>
                {/* Floating elements/Bubbles representation */}
                <div className="absolute top-10 right-0 w-16 h-16 bg-[#2D336B] rounded-lg shadow-lg flex items-center justify-center">
                   <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </div>
                <div className="absolute top-20 left-0 w-16 h-16 bg-[#E89E44] rounded-lg shadow-lg flex items-center justify-center">
                   <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                   <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.477.859h4z" /></svg>
                </div>
             </div>

             {/* Badge */}
             <div className="mt-8 bg-[#2D336B] text-white px-8 py-3 rounded-xl shadow-lg font-bold text-2xl tracking-wide">
               Ticketing System
             </div>
          </div>

          {/* Abstract background shapes */}
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#433878]/5 rounded-tl-full"></div>
          <div className="absolute top-0 left-0 w-24 h-24 bg-[#E89E44]/5 rounded-br-full"></div>
        </div>
      </div>
    </div>
  );
};
