import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router';
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
    FiX,
    FiChevronsLeft,
    FiChevronsRight
} from 'react-icons/fi';
import { getSavedUserInfo } from '../../utils/getUserInof';

const COLLAPSE_KEY = 'sidebarCollapsed';
const WIDTH_EXPANDED = '270px';
const WIDTH_COLLAPSED = '80px';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false); // mobile open/close

    // Desktop collapse state - localStorage theke read kore, tai reload e ager moto thakbe
    const [isCollapsed, setIsCollapsed] = useState(() => {
        try {
            return localStorage.getItem(COLLAPSE_KEY) === 'true';
        } catch {
            return false;
        }
    });

    const navigate = useNavigate();
    const { pathname } = useLocation();
    const userInfo = getSavedUserInfo();
    const isFirstRender = useRef(true);

    // Collapse state save kora + CSS variable set kora (main content er margin er jonno)
    useLayoutEffect(() => {
        try {
            localStorage.setItem(COLLAPSE_KEY, String(isCollapsed));
        } catch {
            /* ignore */
        }
        document.documentElement.style.setProperty(
            '--sidebar-width',
            isCollapsed ? WIDTH_COLLAPSED : WIDTH_EXPANDED
        );
        return () => {
            document.documentElement.style.removeProperty('--sidebar-width');
        };
    }, [isCollapsed]);

    // Mobile e sidebar open thakle background page scroll lock
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Route change hole page smooth vabe upore scroll kore jabe
    // (prothom render e skip kore, tai reload e animation hobe na)
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, [pathname]);

    // Esc chaple sidebar bondho hobe
    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (e) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isOpen]);

    const toggleSidebar = () => setIsOpen((prev) => !prev);
    const toggleCollapse = () => setIsCollapsed((prev) => !prev);

    // Link click korle: mobile sidebar bondho + page smooth upore scroll
    // (ekoi page er link e click korleo upore jabe, tai onClick e o rakha hoyeche)
    const handleNavClick = () => {
        setIsOpen(false);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    };

    // Collapsed hole (shudhu desktop e) text hide korar class
    const hideWhenCollapsed = isCollapsed ? 'lg:hidden' : '';

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
        { name: 'Profile', path: '/user-dashboard/photographers/user_101', icon: <FiUser size={18} /> },
        { name: 'Settings', path: '/user-dashboard/settings', icon: <FiSettings size={18} /> },
    ];

    const handleLogout = () => {
        localStorage.removeItem("rememberedEmail");
        navigate("/login");
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
                    Home
                </Link>

                {/* User avatar -> Profile */}
                <Link
                    to={`/user-dashboard/photographers/${userInfo?.id}`}
                    aria-label="Go to profile"
                    className="shrink-0"
                >
                    <img
                        src={userInfo?.image}
                        alt={userInfo?.name || 'User'}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white ring-1 ring-gray-200"
                    />
                </Link>
            </header>

            {/* ===== Backdrop Overlay (Mobile) ===== */}
            <div
                onClick={() => setIsOpen(false)}
                className={`fixed inset-0 z-40 lg:hidden bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                aria-hidden="true"
            />

            {/* ===== Sidebar Container ===== */}
            <aside
                className={`fixed top-0 left-0 z-50 w-[270px] max-w-[85vw] ${isCollapsed ? 'lg:w-[80px]' : 'lg:w-[270px]'
                    } h-screen bg-white border-r border-gray-100 transition-[transform,width] duration-300 ease-in-out lg:translate-x-0 flex flex-col justify-between overflow-y-auto overscroll-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
                    } lg:shadow-none`}
            >
                <div className={`p-5 ${isCollapsed ? 'lg:p-3' : ''} flex-1 flex flex-col`}>
                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden absolute top-4 right-4 flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-gray-600 hover:bg-[#FDE8E9] hover:text-[#EE1C25] active:scale-95 transition-all focus:outline-none"
                        aria-label="Close navigation menu"
                    >
                        <FiX size={20} />
                    </button>

                    {/* Top Row: Logo + Desktop Collapse/Expand Toggle (pasha pashi) */}
                    <div
                        className={`flex items-center justify-between gap-2 mb-6 pt-2 ${isCollapsed ? 'lg:justify-center' : ''
                            }`}
                    >
                        {/* Logo + tagline */}
                        <div className={hideWhenCollapsed}>
                            <Link
                                to="/"
                                onClick={handleNavClick}
                                className="block shrink-0"
                                aria-label="Photo Championship home"
                            >
                                <img
                                    src="/logo.png"
                                    alt="Photo Championship"
                                    className="h-24 w-auto object-contain sm:h-14 lg:h-12"
                                />
                            </Link>
                            <p className="text-[7px] text-gray-500 uppercase tracking-wider mt-0.5">
                                AS ABOVE SO BELOW - AS BELOW SO ABOVE
                            </p>
                        </div>

                        {/* Desktop Collapse / Expand Toggle */}
                        <button
                            onClick={toggleCollapse}
                            className="hidden lg:flex shrink-0 items-center justify-center w-9 h-9 rounded-lg bg-gray-50 text-[#494453] border border-gray-200 hover:bg-[#FDE8E9] hover:text-[#EE1C25] hover:border-[#EE1C25]/30 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EE1C25]/40"
                            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                            aria-expanded={!isCollapsed}
                            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            {isCollapsed ? <FiChevronsRight size={18} /> : <FiChevronsLeft size={18} />}
                        </button>
                    </div>

                    {/* Section Heading */}
                    <div className={`text-xs text-gray-400 font-medium mb-3 px-2 ${hideWhenCollapsed}`}>
                        Main menu
                    </div>

                    {/* Navigation Links */}
                    <nav className="space-y-1 flex-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/user-dashboard'}
                                onClick={handleNavClick}
                                title={isCollapsed ? item.name : undefined}
                                aria-label={item.name}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-r-lg rounded-l-sm text-sm font-medium transition-all duration-150 border-l-4 ${isCollapsed ? 'lg:justify-center lg:gap-0 lg:px-0' : ''
                                    } ${isActive
                                        ? 'bg-[#FDE8E9] text-[#EE1C25] border-[#EE1C25] font-semibold'
                                        : 'text-[#494453] border-transparent hover:bg-gray-50 hover:text-gray-900'
                                    }`
                                }
                            >
                                <span className="shrink-0">{item.icon}</span>
                                <span className={`truncate ${hideWhenCollapsed}`}>{item.name}</span>
                            </NavLink>
                        ))}
                    </nav>

                    {/* User Profile Info Card */}
                    <div className="mt-6 pt-4 border-t border-gray-100">
                        <div
                            className={`flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl ${isCollapsed ? 'lg:justify-center lg:gap-0 lg:p-1.5' : ''
                                }`}
                            title={isCollapsed ? userInfo?.name : undefined}
                        >
                            <img
                                src={userInfo?.image}
                                alt={userInfo?.name || 'User'}
                                className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0"
                            />
                            <div className={`overflow-hidden ${hideWhenCollapsed}`}>
                                <h4 className="text-sm font-semibold text-gray-800 truncate leading-tight">
                                    {userInfo?.name}
                                </h4>
                                <p className="text-xs text-gray-500 truncate">User</p>
                            </div>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            title={isCollapsed ? 'Log Out' : undefined}
                            aria-label="Log Out"
                            className={`w-full mt-3 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#D00000] hover:bg-red-50 transition-colors ${isCollapsed ? 'lg:justify-center lg:gap-0 lg:px-0' : ''
                                }`}
                        >
                            <FiLogOut size={18} className="shrink-0" />
                            <span className={hideWhenCollapsed}>Log Out</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;