import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { FiMoreVertical, FiChevronDown, FiX, FiCheckCircle } from 'react-icons/fi';
import useFetch from '../../hooks/useFetch';

/* ------------------------------------------------------------------ */
/*  CONFIG                                                             */
/* ------------------------------------------------------------------ */

const PAGE_SIZE = 7; // rows per page
const MENU_WIDTH = 160;
const MENU_HEIGHT = 132; // approx height of the 3-dot menu (used to flip it upwards)

// TODO: add real info or data (status filter options from API if needed)
const statusFilterOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Suspended', value: 'suspended' },
];

// Badge styles for each status
const statusStyles = {
    active: { label: 'Active', badge: 'bg-[#E6F6EC] text-[#1E8E4E]', dot: 'bg-[#1E8E4E]' },
    suspended: { label: 'Suspended', badge: 'bg-[#ECEBF6] text-[#5B5675]', dot: 'bg-[#5B5675]' },
};

// Formats "2025-11-12T08:00:00Z" -> "11/12/2025"
const formatDate = (iso) => {
    if (!iso) return '-';
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? '-' : d.toLocaleDateString('en-US');
};

/* ------------------------------------------------------------------ */
/*  SMALL PIECES                                                       */
/* ------------------------------------------------------------------ */

const StatusBadge = ({ status }) => {
    const style = statusStyles[status];
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-[10px] sm:text-[11px] font-semibold whitespace-nowrap ${style.badge}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
            {style.label}
        </span>
    );
};

/* ------------------------------------------------------------------ */
/*  MAIN COMPONENT                                                     */
/* ------------------------------------------------------------------ */

const UsersManagement = () => {
    const navigate = useNavigate();

    // Users come from /public/users.json
    // TODO: confirm the shape your useFetch hook returns ({ data, isLoading, error })
    const { data, isLoading, error } = useFetch('/users.json');

    // Local copy of users
    const [users, setUsers] = useState([]);

    // users.json has no status field, so status is kept locally. Missing = active.
    // TODO: add real info or data (read/write status from your API instead)
    const [statusMap, setStatusMap] = useState({});

    // Suspend reasons by user id
    // TODO: add real info or data (send the reason to your API)
    // eslint-disable-next-line no-unused-vars
    const [suspendReasons, setSuspendReasons] = useState({});

    // Filter + pagination
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);

    // 3-dot action menu: { userId, top, left } | null
    const [menu, setMenu] = useState(null);
    const menuRef = useRef(null);

    // Suspend modal
    const [suspendTarget, setSuspendTarget] = useState(null); // user object | null
    const [reason, setReason] = useState('');
    const [reasonError, setReasonError] = useState('');

    // Success toast
    const [toast, setToast] = useState('');

    /* ------------------------------- Effects -------------------------------- */

    // Copy fetched data into local state
    useEffect(() => {
        if (Array.isArray(data)) setUsers(data);
    }, [data]);

    // Auto-hide toast
    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(''), 2500);
        return () => clearTimeout(timer);
    }, [toast]);

    // Close 3-dot menu on outside click / scroll / resize / Escape
    useEffect(() => {
        if (!menu) return;
        const close = () => setMenu(null);
        const onPointerDown = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) close();
        };
        const onKey = (e) => e.key === 'Escape' && close();
        document.addEventListener('mousedown', onPointerDown);
        document.addEventListener('touchstart', onPointerDown);
        document.addEventListener('keydown', onKey);
        window.addEventListener('scroll', close, true);
        window.addEventListener('resize', close);
        return () => {
            document.removeEventListener('mousedown', onPointerDown);
            document.removeEventListener('touchstart', onPointerDown);
            document.removeEventListener('keydown', onKey);
            window.removeEventListener('scroll', close, true);
            window.removeEventListener('resize', close);
        };
    }, [menu]);

    // Close suspend modal on Escape + lock page scroll while the modal is open
    useEffect(() => {
        if (!suspendTarget) return;
        const onKey = (e) => e.key === 'Escape' && closeSuspendModal();
        window.addEventListener('keydown', onKey);

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [suspendTarget]);

    /* ------------------------------ Derived data ---------------------------- */

    const getStatus = (id) => statusMap[id] || 'active';

    const filteredUsers = users.filter(
        (u) => statusFilter === 'all' || getStatus(u.id) === statusFilter
    );

    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const pageUsers = filteredUsers.slice(startIndex, startIndex + PAGE_SIZE);

    const showingFrom = filteredUsers.length === 0 ? 0 : startIndex + 1;
    const showingTo = startIndex + pageUsers.length;

    /* -------------------------------- Actions ------------------------------- */

    const openMenu = (e, userId) => {
        const rect = e.currentTarget.getBoundingClientRect();

        // Keep the menu inside the screen (horizontally)
        const left = Math.max(
            8,
            Math.min(rect.right - MENU_WIDTH, window.innerWidth - MENU_WIDTH - 8)
        );

        // Open upwards if there is not enough space below
        const spaceBelow = window.innerHeight - rect.bottom;
        const top =
            spaceBelow < MENU_HEIGHT + 12
                ? Math.max(8, rect.top - MENU_HEIGHT - 6)
                : rect.bottom + 6;

        setMenu((prev) => (prev && prev.userId === userId ? null : { userId, top, left }));
    };

    const handleSeeDetails = (user) => {
        setMenu(null);
        // TODO: confirm this route (e.g. /adminDashboard/photographers/:id) in your router
        navigate(`/admin-dashboard/photographers/${user.id}`);
    };

    const handleSetActive = (user) => {
        setMenu(null);
        // TODO: call real activate-user API here
        setStatusMap((prev) => ({ ...prev, [user.id]: 'active' }));
        setToast(`${user.name} is now active`);
    };

    const openSuspendModal = (user) => {
        setMenu(null);
        setSuspendTarget(user);
        setReason('');
        setReasonError('');
    };

    function closeSuspendModal() {
        setSuspendTarget(null);
        setReason('');
        setReasonError('');
    }

    const handleConfirmSuspend = (e) => {
        e.preventDefault();
        const trimmed = reason.trim();
        if (!trimmed) return setReasonError('Please write a reason');

        // TODO: call real suspend-user API here (send the reason too)
        setStatusMap((prev) => ({ ...prev, [suspendTarget.id]: 'suspended' }));
        setSuspendReasons((prev) => ({ ...prev, [suspendTarget.id]: trimmed }));
        setToast(`${suspendTarget.name} suspended successfully`);
        closeSuspendModal();
    };

    const handleFilterChange = (e) => {
        setStatusFilter(e.target.value);
        setPage(1);
    };

    /* ---------------------------- Loading / error --------------------------- */

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F6F7FB] flex items-center justify-center text-sm text-gray-500">
                Loading users...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#F6F7FB] flex items-center justify-center px-4 text-sm text-red-600 text-center break-words">
                Error: {String(error)}
            </div>
        );
    }

    /* ---------------------------------- UI ---------------------------------- */

    const menuUser = menu ? users.find((u) => u.id === menu.userId) : null;
    const menuUserStatus = menuUser ? getStatus(menuUser.id) : null;

    return (
        <div className="w-full max-w-full">
            {/* Success toast */}
            <div
                role="status"
                aria-live="polite"
                className={`fixed top-4 left-4 right-4 sm:left-auto sm:right-5 sm:top-5 z-[80] flex items-center gap-2 bg-white border border-green-200 text-green-700 text-xs sm:text-sm font-medium px-4 py-3 rounded-lg shadow-lg transition-all duration-300 sm:max-w-sm ${
                    toast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none'
                }`}
            >
                <FiCheckCircle size={18} className="shrink-0" />
                <span className="break-words min-w-0">{toast}</span>
            </div>

            {/* Header */}
            <header className="mb-4 sm:mb-6">
                <p className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-gray-500 font-semibold">
                    Community
                </p>
                <h1 className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900">
                    Users Management
                </h1>
                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-500">Manage Registered User</p>
            </header>

            {/* Sort / filter */}
            <div className="flex items-center justify-between sm:justify-end gap-3 mb-4">
                <label htmlFor="statusFilter" className="text-xs sm:text-[11px] text-gray-500">
                    Sort By:
                </label>
                <div className="relative w-40 sm:w-auto">
                    <select
                        id="statusFilter"
                        value={statusFilter}
                        onChange={handleFilterChange}
                        className="w-full appearance-none bg-white border border-gray-200 rounded-md text-xs text-gray-700 pl-3 pr-9 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4048CD]/20 cursor-pointer"
                    >
                        {statusFilterOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <FiChevronDown
                        size={14}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none"
                    />
                </div>
            </div>

            {/* Table / list card */}
            <section className="bg-white rounded-lg border border-gray-100">
                {/* ---------- Desktop + tablet: table (md and up) ---------- */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full min-w-[720px] text-left">
                        <thead>
                            <tr className="border-b border-gray-100 text-[11px] font-medium text-gray-600">
                                <th className="px-4 lg:px-5 py-4 font-medium">Name</th>
                                <th className="px-3 py-4 font-medium">Email</th>
                                <th className="px-3 py-4 font-medium">Phone</th>
                                <th className="px-3 py-4 font-medium">Registered Date</th>
                                <th className="px-3 py-4 font-medium">Status</th>
                                <th className="px-4 lg:px-5 py-4 font-medium text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {pageUsers.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">
                                        No users found.
                                    </td>
                                </tr>
                            )}

                            {pageUsers.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b border-gray-100 last:border-b-0 text-[11px] lg:text-xs text-gray-800"
                                >
                                    <td className="px-4 lg:px-5 py-4 font-medium">{user.name}</td>
                                    <td className="px-3 py-4 max-w-[190px] break-all">{user.email}</td>
                                    <td className="px-3 py-4 whitespace-nowrap">{user.phone}</td>
                                    <td className="px-3 py-4 whitespace-nowrap">{formatDate(user.joinedAt)}</td>
                                    <td className="px-3 py-4">
                                        <StatusBadge status={getStatus(user.id)} />
                                    </td>
                                    <td className="px-4 lg:px-5 py-4 text-center">
                                        <button
                                            type="button"
                                            onClick={(e) => openMenu(e, user.id)}
                                            aria-label={`Actions for ${user.name}`}
                                            className="p-1.5 rounded-md text-gray-800 hover:bg-gray-100 transition-colors"
                                        >
                                            <FiMoreVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ---------- Mobile: card list (below md) ---------- */}
                <div className="md:hidden">
                    {pageUsers.length === 0 && (
                        <p className="px-4 py-10 text-center text-sm text-gray-400">No users found.</p>
                    )}

                    <ul className="divide-y divide-gray-100">
                        {pageUsers.map((user) => (
                            <li key={user.id} className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 break-words">
                                            {user.name}
                                        </p>
                                        <div className="mt-1.5">
                                            <StatusBadge status={getStatus(user.id)} />
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={(e) => openMenu(e, user.id)}
                                        aria-label={`Actions for ${user.name}`}
                                        className="shrink-0 p-2 -mr-2 -mt-1 rounded-md text-gray-800 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                                    >
                                        <FiMoreVertical size={18} />
                                    </button>
                                </div>

                                <dl className="mt-3 grid grid-cols-[88px_1fr] gap-x-3 gap-y-1.5 text-xs">
                                    <dt className="text-gray-500">Email</dt>
                                    <dd className="text-gray-800 break-all">{user.email}</dd>

                                    <dt className="text-gray-500">Phone</dt>
                                    <dd className="text-gray-800 break-words">{user.phone}</dd>

                                    <dt className="text-gray-500">Registered</dt>
                                    <dd className="text-gray-800">{formatDate(user.joinedAt)}</dd>
                                </dl>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Footer: results + pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-5 py-4 border-t border-gray-100">
                    <p className="text-[11px] sm:text-xs text-[#4048CD] text-center sm:text-left">
                        {filteredUsers.length === 0
                            ? 'Showing 0 results'
                            : `Showing ${showingFrom} to ${showingTo} of ${filteredUsers.length} results`}
                    </p>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={() => setPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="flex-1 sm:flex-none px-4 py-2 sm:py-1.5 text-xs sm:text-[11px] font-medium text-[#4048CD] border border-[#4048CD] rounded-full hover:bg-[#4048CD]/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        <button
                            type="button"
                            onClick={() => setPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="flex-1 sm:flex-none px-4 py-2 sm:py-1.5 text-xs sm:text-[11px] font-medium text-[#4048CD] border border-[#4048CD] rounded-full hover:bg-[#4048CD]/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </section>

            {/* 3-dot action menu (fixed so scrolling containers never clip it) */}
            {menu && menuUser && (
                <div
                    ref={menuRef}
                    style={{ top: menu.top, left: menu.left, width: MENU_WIDTH }}
                    className="fixed z-[60] bg-white rounded-md border border-gray-100 shadow-lg overflow-hidden text-xs sm:text-xs"
                >
                    <button
                        type="button"
                        onClick={() => handleSeeDetails(menuUser)}
                        className="w-full text-left px-3 py-3 sm:py-2.5 bg-[#4048CD] text-white hover:bg-[#343cb8] transition-colors"
                    >
                        See Details
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSetActive(menuUser)}
                        disabled={menuUserStatus === 'active'}
                        className="w-full text-left px-3 py-3 sm:py-2.5 text-gray-800 hover:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                    >
                        Active
                    </button>
                    <button
                        type="button"
                        onClick={() => openSuspendModal(menuUser)}
                        disabled={menuUserStatus === 'suspended'}
                        className="w-full text-left px-3 py-3 sm:py-2.5 text-gray-800 hover:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                    >
                        Suspend
                    </button>
                </div>
            )}

            {/* Suspend modal: bottom sheet on mobile, centered dialog on sm+ */}
            {suspendTarget && (
                <div
                    className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/40 sm:px-4"
                    onClick={closeSuspendModal}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="suspend-title"
                        onClick={(e) => e.stopPropagation()}
                        className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-xl shadow-2xl p-4 sm:p-5 max-h-[90vh] overflow-y-auto pb-[max(1rem,env(safe-area-inset-bottom))]"
                    >
                        <div className="flex items-center justify-between gap-3">
                            <h3 id="suspend-title" className="text-sm sm:text-base font-semibold text-gray-900 min-w-0 break-words">
                                Suspend User
                            </h3>
                            <button
                                type="button"
                                onClick={closeSuspendModal}
                                aria-label="Close"
                                className="shrink-0 p-1.5 -mr-1.5 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                            >
                                <FiX size={18} />
                            </button>
                        </div>

                        <p className="mt-1 text-xs text-gray-500 break-words">
                            {suspendTarget.name}
                        </p>

                        <form onSubmit={handleConfirmSuspend} noValidate className="mt-4">
                            <label htmlFor="suspendReason" className="block mb-1.5 text-xs sm:text-[11px] text-gray-600">
                                Reason <span className="text-[#EE1C25]">*</span>
                            </label>
                            {/* text-base on mobile stops iOS from zooming into the field */}
                            <textarea
                                id="suspendReason"
                                rows={4}
                                value={reason}
                                onChange={(e) => {
                                    setReason(e.target.value);
                                    setReasonError('');
                                }}
                                placeholder="Why Suspend this user"
                                className="w-full bg-[#F3F4F6] rounded-md px-3 py-2.5 text-base sm:text-xs text-gray-800 placeholder:text-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-[#EE1C25]/30"
                            />
                            {reasonError && <p className="mt-1.5 text-xs text-red-600">{reasonError}</p>}

                            <div className="mt-4 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={closeSuspendModal}
                                    className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-xs sm:text-[11px] font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-xs sm:text-[11px] font-semibold text-white bg-[#EE1C25] hover:bg-[#d4161e] rounded-md transition-colors"
                                >
                                    Suspend
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersManagement;