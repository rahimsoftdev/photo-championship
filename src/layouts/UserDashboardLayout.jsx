import React from 'react';
import { Outlet } from 'react-router';
import Sidebar from '../components/shared/UserSidebar';
// import Sidebar from './Sidebar'; // আপনার সাইডবার কম্পোনেন্টটি ইমপোর্ট করুন

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Dynamic Responsive Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-[270px] p-4 md:p-6 lg:p-8 transition-all duration-300">
        {/* Navbar space / top margin for mobile toggle button spacing */}
        <div className="pt-10 lg:pt-0">
          {/* React Router Outlet where child page components render */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}