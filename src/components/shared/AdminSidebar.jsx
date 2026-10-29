import React, { useState, useEffect } from 'react';
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
import { getSavedUserInfo } from '../../utils/getUserInof';

const BASE = '/admin-dashboard';

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
    const userInfo = getSavedUserInfo();

    const toggleSidebar = () => setIsOpen((prev) => !prev);
    const closeSidebar = () => setIsOpen(false);

    // Mobile e sidebar open thakle background page scroll lock
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Esc chaple sidebar bondho hobe
    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (e) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isOpen]);

    const handleLogout = () => {
        // Add your logout logic here
        console.log('Logging out...');
    };

    return (
        <>
            {/* ===== Mobile Top Bar (shudhu choto device e dekha jabe) ===== */}
            <header className="lg:hidden fixed top-0 inset-x-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm flex items-center justify-between px-4">
                {/* Menu open button */}
                <button
                    onClick={toggleSidebar}
                    className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 text-[#494453] border border-gray-200 hover:bg-[#FDE8E9] hover:text-[#EE1C25] hover:border-[#EE1C25]/30 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EE1C25]/40"
                    aria-label="Open navigation menu"
                    aria-expanded={isOpen}
                >
                    <FiMenu size={22} />
                </button>

                {/* Logo */}
                <Link to="/" aria-label="Photo Championship home" className="absolute left-1/2 -translate-x-1/2">
                    <img
                        src="/logo.png"
                        alt="Photo Championship"
                        className="h-10 w-auto object-contain"
                    />
                </Link>

                {/* Admin avatar -> Profile */}
                <Link to={`${BASE}/profile`} aria-label="Go to profile" className="shrink-0">
                    <img
                        src={userInfo?.image}
                        alt={userInfo?.name || 'Admin'}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white ring-1 ring-gray-200"
                    />
                </Link>
            </header>

            {/* ===== Backdrop Overlay (Mobile) ===== */}
            <div
                onClick={closeSidebar}
                className={`fixed inset-0 z-40 lg:hidden bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                aria-hidden="true"
            />

            {/* ===== Sidebar Container =====
                - Scrollbar hidden, tobe mouse wheel / touch diye scroll kora jay.
                - overscroll-contain: sidebar scroll korle bairer page scroll hobe na. */}
            <aside
                className={`fixed top-0 left-0 z-50 w-[270px] max-w-[85vw] h-screen bg-white border-r border-gray-100 transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col overflow-y-auto overscroll-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                    isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
                } lg:shadow-none`}
            >
                <div className="p-5 flex-1 flex flex-col">
                    {/* Mobile Close Button */}
                    <button
                        onClick={closeSidebar}
                        className="lg:hidden absolute top-4 right-4 flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-gray-600 hover:bg-[#FDE8E9] hover:text-[#EE1C25] active:scale-95 transition-all focus:outline-none"
                        aria-label="Close navigation menu"
                    >
                        <FiX size={20} />
                    </button>

                    {/* Logo Section */}
                    <div className="mb-6 pt-2">
                        <Link
                            to="/"
                            onClick={closeSidebar}
                            className="inline-block shrink-0"
                            aria-label="Photo Championship home"
                        >
                            <img
                                src="/logo.png"
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
                                src={userInfo?.image}
                                alt={userInfo?.name || 'Admin'}
                                className="w-10 h-10 rounded-full object-cover border border-gray-200"
                            />
                            <div className="overflow-hidden">
                                <h4 className="text-sm font-semibold text-gray-800 truncate leading-tight">
                                    {userInfo?.name}
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