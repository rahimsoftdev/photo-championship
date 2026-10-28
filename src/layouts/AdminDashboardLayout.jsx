import React from 'react';
import { Navigate, Outlet } from 'react-router';
import AdminSidebar from '../components/shared/AdminSidebar';
import { getSavedUserInfo } from '../utils/getUserInof';

const AdminDashboardLayout = () => {
    const userInfo = getSavedUserInfo();

    if (!userInfo) {
        return <Navigate to="/login" replace />;
    }

    if (userInfo.role !== 'admin') {
        return <Navigate to="/access-denied" replace />;
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex">
            {/* Responsive Sidebar (mobile e top bar + slide-in menu) */}
            <AdminSidebar />

            {/* Main Content Area
                pt-20: mobile/tablet e fixed top bar (h-16) er niche content shuru hobe
                lg:pt-6: desktop e top bar nai */}
            <main className="flex-1 min-w-0 lg:ml-[270px] pt-24 lg:pt-8 pb-8 transition-all duration-300 max-sm:px-4 px-6">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminDashboardLayout;