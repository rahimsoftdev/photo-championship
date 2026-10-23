import React, { useState } from 'react';
import { Link, NavLink } from 'react-router';
import {
    FiGrid,
    FiEdit3,
    FiFileText,
    FiDollarSign,
    FiShoppingBag,
    FiBox,
    FiLayers,
    FiBookmark,
    FiHeart,
    FiBriefcase,
    FiMessageSquare,
    FiBell,
    FiAward,
    FiPhoneCall,
    FiUser,
    FiSettings,
    FiLogOut,
    FiMenu,
    FiX
} from 'react-icons/fi';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const navItems = [
        { name: 'Dashboard', path: '/user-dashboard', icon: <FiGrid size={18} /> },
        { name: 'Artwork Management', path: '/user-dashboard/artwork-management', icon: <FiEdit3 size={18} /> },
        { name: 'News & Message', path: '/user-dashboard/news-message', icon: <FiFileText size={18} /> },
        { name: 'Sell Photos', path: '/user-dashboard/sell-photos', icon: <FiDollarSign size={18} /> },
        { name: 'My Store', path: '/user-dashboard/my-store', icon: <FiShoppingBag size={18} /> },
        { name: 'Orders', path: '/user-dashboard/orders', icon: <FiBox size={18} /> },
        { name: 'My Orders', path: '/user-dashboard/my-orders', icon: <FiLayers size={18} /> },
        { name: 'Favourite Photographers', path: '/user-dashboard/favourite-photographers', icon: <FiBookmark size={18} /> },
        { name: 'Favourite Photos', path: '/user-dashboard/favourite-photos', icon: <FiHeart size={18} /> },
        { name: 'Business Link Photos', path: '/user-dashboard/business-link-photos', icon: <FiBriefcase size={18} /> },
        { name: 'Chat', path: '/user-dashboard/chat', icon: <FiMessageSquare size={18} /> },
        { name: 'Notifications', path: '/user-dashboard/notifications', icon: <FiBell size={18} /> },
        { name: 'Prize & Payments', path: '/user-dashboard/prize-payments', icon: <FiAward size={18} /> },
        { name: 'Contact Us', path: '/user-dashboard/contact-us', icon: <FiPhoneCall size={18} /> },
        { name: 'Profile', path: '/user-dashboard/photographers/user_105', icon: <FiUser size={18} /> },
        { name: 'Settings', path: '/user-dashboard/settings', icon: <FiSettings size={18} /> },
    ];

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
                    onClick={toggleSidebar}
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`fixed top-0 left-0 z-40 w-[270px] h-screen bg-white border-r border-gray-100 transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col justify-between overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="p-5 flex-1 flex flex-col">
                    {/* Logo Section */}
                    <div className="flex items-center gap-3 mb-6 pt-2">
                      
                        <div>
                            <Link
                                to="/"
                               
                                className="shrink-0"
                                aria-label="Photo Championship home"
                            >
                                <img
                                    src="/src/assets/images/logo.png"
                                    alt="Photo Championship"
                                    className="h-20 w-auto object-contain sm:h-14"
                                />
                            </Link>
                            <p className="text-[7px] text-gray-500 uppercase tracking-wider mt-0.5">
                                AS ABOVE SO BELOW - AS BELOW SO ABOVE
                            </p>
                        </div>
                    </div>

                    {/* Section Heading */}
                    <div className="text-xs text-gray-400 font-medium mb-3 px-2">
                        Main menu
                    </div>

                    {/* Navigation Links */}
                    <nav className="space-y-1 flex-1">
                        {navItems.map((item, index) => (
                            <NavLink
                                key={index}
                                to={item.path}
                                end={item.path === '/user-dashboard'}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-r-lg rounded-l-sm text-sm font-medium transition-all duration-150 border-l-4 ${isActive
                                        ? 'bg-[#FDE8E9] text-[#EE1C25] border-[#EE1C25] font-semibold'
                                        : 'text-[#494453] border-transparent hover:bg-gray-50 hover:text-gray-900'
                                    }`
                                }
                            >
                                <span className="shrink-0">{item.icon}</span>
                                <span className="truncate">{item.name}</span>
                            </NavLink>
                        ))}
                    </nav>

                    {/* User Profile Info Card */}
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
                                <p className="text-xs text-gray-500 truncate">User</p>
                            </div>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={() => {
                                // Add your logout logic here
                                console.log('Logging out...');
                            }}
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

export default Sidebar;