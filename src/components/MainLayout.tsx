import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
  fullScreen?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, fullScreen }) => {
  return (
    <div className="flex min-h-screen bg-[#F8F9FD]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className={`flex-1 overflow-hidden ${fullScreen ? '' : 'p-8'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};
