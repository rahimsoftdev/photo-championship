import React from 'react';
import { Navigate, Outlet } from 'react-router';
import Sidebar from '../components/shared/UserSidebar';
import { getSavedUserInfo } from '../utils/getUserInof';
// import Sidebar from './Sidebar'; // আপনার সাইডবার কম্পোনেন্টটি ইমপোর্ট করুন

export default function UserDashboard() {

  const userInfo = getSavedUserInfo()

   if (!userInfo) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="min-h-screen bg-[#F9FAFB]  flex">
      {/* Dynamic Responsive Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1   lg:ml-[270px] pt-8  transition-all duration-300 max-sm:px-4 px-6">
        {/* Navbar space / top margin for mobile toggle button spacing */}

          {/* React Router Outlet where child page components render */}
          <Outlet />
        
      </main>
    </div>
  );
}