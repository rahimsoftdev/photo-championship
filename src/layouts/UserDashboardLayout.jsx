import React from 'react';
import { Navigate, Outlet } from 'react-router';
import Sidebar from '../components/shared/UserSidebar';
import { getSavedUserInfo } from '../utils/getUserInof';

export default function UserDashboard() {
  const userInfo = getSavedUserInfo();

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      {/* Responsive Sidebar (mobile e top bar + slide-in menu) */}
      <Sidebar />

      {/* Main Content Area
      pt-24: mobile e fixed top bar (h-16) er niche content shuru hobe
      lg:pt-8: desktop e top bar nai
      lg:ml-[var(--sidebar-width,270px)]: sidebar collapse/expand hole content o sathe sathe adjust hobe */}
      <main className="flex-1 min-w-0 lg:ml-[var(--sidebar-width,270px)] pt-24 lg:pt-8 pb-8 transition-[margin] duration-300 max-sm:px-4 px-6">
        <Outlet />
      </main>
    </div>
  );
}