import React from 'react';
import { Navigate, Outlet } from 'react-router';
import AdminSidebar from '../components/shared/AdminSidebar';
import { getSavedUserInfo } from '../utils/getUserInof';

const AdminDashboardLayout = () => {
    const userInfo = getSavedUserInfo()

    if (!userInfo) {
        return <Navigate to="/login" replace />;
    }
    console.log(userInfo.role)
    if (userInfo.role !== 'admin') {
        return <Navigate to={'/access-denied'} />
    }
    return (
        <div className="min-h-screen bg-[#F8F9FA] flex">
            {/* Dynamic Responsive Sidebar */}
            <AdminSidebar />

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-[270px] p-2 md:p-4 lg:p-6  transition-all duration-300">
                {/* Navbar space / top margin for mobile toggle button spacing */}
                {/* React Router Outlet where child page components render */}
                <Outlet />
            </main>
        </div>
    );
};

export default AdminDashboardLayout;