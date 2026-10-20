import React, { useState } from 'react';
import { Link, NavLink } from 'react-router';
import {
    FiGrid,
    FiAward,
    FiImage,
    FiDollarSign,
    FiPercent,
    FiUsers,
    FiBarChart2,
    FiFolder,
    FiStar,
    FiCreditCard,
    FiHelpCircle,
    FiBriefcase,
    FiMail,
    FiMessageCircle,
    FiPlus,
    FiUserCheck,
    FiAlertCircle,
    FiLink,
    FiSettings,
    FiUser,
    FiLogOut,
    FiMenu,
    FiX,
    FiChevronRight,
} from 'react-icons/fi';

const BASE = '/adminDashboard';

const menuSections = [
    {
        title: 'Workspace',
        items: [
            { name: 'Overview', path: BASE, icon: FiGrid, end: true },
            { name: 'Competitions', path: `${BASE}/competitions`, icon: FiAward },
            { name: 'Gallery', path: `${BASE}/gallery`, icon: FiImage },
            { name: 'Premium Photos', path: `${BASE}/premium-photos`, icon: FiDollarSign },
            { name: 'Promoted Albums', path: `${BASE}/promoted-albums`, icon: FiPercent },
            { name: 'Users', path: `${BASE}/users`, icon: FiUsers },
        ],
    },
    {
        title: 'Manage',
        items: [
            { name: 'Categories', path: `${BASE}/categories`, icon: FiBarChart2 },
            { name: 'Album types', path: `${BASE}/album-types`, icon: FiFolder },
            { name: 'Winners', path: `${BASE}/winners`, icon: FiStar },
            { name: 'Payouts', path: `${BASE}/payouts`, icon: FiCreditCard },
            { name: 'Support', path: `${BASE}/support`, icon: FiHelpCircle },
            { name: 'Business Link Photos', path: `${BASE}/business-link-photos`, icon: FiBriefcase },
            { name: 'Newsletter', path: `${BASE}/newsletter`, icon: FiMail },
            { name: 'Comment', path: `${BASE}/comment`, icon: FiMessageCircle },
            { name: 'Ads Management', path: `${BASE}/ads-management`, icon: FiPlus },
            { name: 'Demo Profile', path: `${BASE}/demo-profile`, icon: FiUserCheck },
            { name: 'Reports Resolved', path: `${BASE}/reports-resolved`, icon: FiAlertCircle },
            { name: 'Promo Links', path: `${BASE}/promo-links`, icon: FiLink },
        ],
    },
    {
        title: 'System',
        items: [
            { name: 'Settings', path: `${BASE}/settings`, icon: FiSettings },
            { name: 'Profile', path: `${BASE}/profile`, icon: FiUser },
        ],
    },
];

const AdminSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen((prev) => !prev);
    const closeSidebar = () => setIsOpen(false);

    const handleLogout = () => {
        // Add your logout logic here
        console.log('Logging out...');
    };

    return (
        <>
            {/* Small Device Toggle Button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={toggleSidebar}
                    className="p-2.5 bg-white text-[#494453] rounded-md shadow-md focus:outline-none border border-gray-200 hover:bg-gray-50 transition-all"
                    aria-label="Toggle Navigation"
                >
                    {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </div>

            {/* Backdrop Overlay for Mobile */}
            {isOpen && (
                <div
                    onClick={closeSidebar}
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`fixed top-0 left-0 z-40 w-[270px] h-screen bg-white border-r border-gray-100 transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col overflow-y-auto ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="p-5 flex-1 flex flex-col">
                    {/* Logo Section */}
                    <div className="mb-6 pt-2">
                        <Link
                            to="/"
                            onClick={closeSidebar}
                            className="inline-block shrink-0"
                            aria-label="Photo Championship home"
                        >
                            <img
                                src="/src/assets/images/logo.png"
                                alt="Photo Championship"
                                className="h-14 w-auto object-contain"
                            />
                        </Link>
                        <p className="text-[7px] text-gray-500 uppercase tracking-wider mt-0.5">
                            AS ABOVE SO BELOW - AS BELOW SO ABOVE
                        </p>
                    </div>

                    {/* Navigation Sections */}
                    <nav className="flex-1 space-y-5">
                        {menuSections.map((section) => (
                            <div key={section.title}>
                                <div className="text-xs text-gray-400 font-medium mb-2 px-2">
                                    {section.title}
                                </div>

                                <div className="space-y-1">
                                    {section.items.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <NavLink
                                                key={item.path}
                                                to={item.path}
                                                end={item.end}
                                                onClick={closeSidebar}
                                                className={({ isActive }) =>
                                                    `flex items-center gap-3 px-3 py-2.5 rounded-r-lg rounded-l-sm text-sm font-medium transition-all duration-150 border-l-4 ${
                                                        isActive
                                                            ? 'bg-[#FDE8E9] text-[#EE1C25] border-[#EE1C25] font-semibold'
                                                            : 'text-[#494453] border-transparent hover:bg-gray-50 hover:text-gray-900'
                                                    }`
                                                }
                                            >
                                                {({ isActive }) => (
                                                    <>
                                                        <span className="shrink-0">
                                                            <Icon size={18} />
                                                        </span>
                                                        <span className="truncate flex-1">{item.name}</span>
                                                        {isActive && (
                                                            <FiChevronRight size={16} className="shrink-0" />
                                                        )}
                                                    </>
                                                )}
                                            </NavLink>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </nav>

                    {/* Admin Profile Card + Logout */}
                    <div className="mt-6 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl">
                            <img
                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                                alt="Atik Adnan"
                                className="w-10 h-10 rounded-full object-cover border border-gray-200"
                            />
                            <div className="overflow-hidden">
                                <h4 className="text-sm font-semibold text-gray-800 truncate leading-tight">
                                    Atik Adnan
                                </h4>
                                <p className="text-xs text-gray-500 truncate">Admin</p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full mt-3 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#D00000] hover:bg-red-50 transition-colors"
                        >
                            <FiLogOut size={18} />
                            <span>Log Out</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;