// components/AppLayout.tsx
import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      <Sidebar activePath="/category" />
      <div className="lg:ml-30 flex flex-col justify-around w-full">
        {children}
      </div>
    </div>
  );
};

// Make sure you have this default export
export default AppLayout;