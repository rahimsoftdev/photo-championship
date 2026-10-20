import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { FiMoreVertical, FiChevronDown, FiX, FiCheckCircle } from 'react-icons/fi';
import useFetch from '../../hooks/useFetch';

/* ------------------------------------------------------------------ */
/*  CONFIG                                                             */
/* ------------------------------------------------------------------ */

const PAGE_SIZE = 7; // rows per page

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
        const onMouseDown = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) close();
        };
        const onKey = (e) => e.key === 'Escape' && close();
        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('keydown', onKey);
        window.addEventListener('scroll', close, true);
        window.addEventListener('resize', close);
        return () => {
            document.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('keydown', onKey);
            window.removeEventListener('scroll', close, true);
            window.removeEventListener('resize', close);
        };
    }, [menu]);

    // Close suspend modal on Escape
    useEffect(() => {
        if (!suspendTarget) return;
        const onKey = (e) => e.key === 'Escape' && closeSuspendModal();
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
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
        const menuWidth = 140;
        // Keep the menu inside the screen
        const left = Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 8);
        setMenu((prev) =>
            prev && prev.userId === userId
                ? null
                : { userId, top: rect.bottom + 6, left: Math.max(8, left) }
        );
    };

    const handleSeeDetails = (user) => {
        setMenu(null);
        // TODO: confirm this route (e.g. /adminDashboard/photographers/:id) in your router
        navigate(`/photographers/${user.id}`);
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
        <div className="min-h-screen bg-[#F6F7FB] px-4 sm:px-6 lg:px-8 py-6 pt-20 lg:pt-8">
            {/* Success toast */}
            <div
                className={`fixed top-5 right-5 z-[80] flex items-center gap-2 bg-white border border-green-200 text-green-700 text-sm font-medium px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
                    toast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none'
                }`}
            >
                <FiCheckCircle size={18} />
                <span>{toast}</span>
            </div>

            {/* Header */}
            <header className="mb-6">
                <p className="text-[11px] tracking-[0.2em] uppercase text-gray-500 font-semibold">
                    Community
                </p>
                <h1 className="mt-2 text-3xl sm:text-4xl font-light text-gray-900">Users Management</h1>
                <p className="mt-2 text-xs sm:text-sm text-gray-500">Manage Registered User</p>
            </header>

            {/* Sort / filter */}
            <div className="flex items-center justify-end gap-3 mb-4">
                <label htmlFor="statusFilter" className="text-[11px] text-gray-500">
                    Sort By:
                </label>
                <div className="relative">
                    <select
                        id="statusFilter"
                        value={statusFilter}
                        onChange={handleFilterChange}
                        className="appearance-none bg-white border border-gray-200 rounded-md text-xs text-gray-700 pl-3 pr-9 py-2.5 focus:outline-none cursor-pointer"
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

            {/* Table card */}
            <section className="bg-white rounded-lg border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left">
                        <thead>
                            <tr className="border-b border-gray-100 text-[11px] font-medium text-gray-600">
                                <th className="px-5 py-4 font-medium">Name</th>
                                <th className="px-3 py-4 font-medium">Email</th>
                                <th className="px-3 py-4 font-medium">Phone</th>
                                <th className="px-3 py-4 font-medium">Registered Date</th>
                                <th className="px-3 py-4 font-medium">Status</th>
                                <th className="px-5 py-4 font-medium text-center">Action</th>
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

                            {pageUsers.map((user) => {
                                const status = getStatus(user.id);
                                const style = statusStyles[status];
                                return (
                                    <tr
                                        key={user.id}
                                        className="border-b border-gray-100 last:border-b-0 text-[11px] text-gray-800"
                                    >
                                        <td className="px-5 py-4 font-medium">{user.name}</td>
                                        <td className="px-3 py-4 max-w-[170px] break-all">{user.email}</td>
                                        <td className="px-3 py-4 whitespace-nowrap">{user.phone}</td>
                                        <td className="px-3 py-4 whitespace-nowrap">{formatDate(user.joinedAt)}</td>
                                        <td className="px-3 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-[10px] font-semibold ${style.badge}`}
                                            >
                                                <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                                                {style.label}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-center">
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
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Footer: results + pagination */}
                <div className="flex items-center justify-between gap-3 flex-wrap px-4 sm:px-5 py-4 border-t border-gray-100">
                    <p className="text-[11px] text-[#4048CD]">
                        {filteredUsers.length === 0
                            ? 'Showing 0 results'
                            : `Showing ${showingFrom} to ${showingTo} of ${filteredUsers.length} results`}
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-1.5 text-[11px] font-medium text-[#4048CD] border border-[#4048CD] rounded-full hover:bg-[#4048CD]/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        <button
                            type="button"
                            onClick={() => setPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-1.5 text-[11px] font-medium text-[#4048CD] border border-[#4048CD] rounded-full hover:bg-[#4048CD]/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </section>

            {/* 3-dot action menu (fixed so the table scroll never clips it) */}
            {menu && menuUser && (
                <div
                    ref={menuRef}
                    style={{ top: menu.top, left: menu.left }}
                    className="fixed z-[60] w-[140px] bg-white rounded-md border border-gray-100 shadow-lg overflow-hidden text-xs"
                >
                    <button
                        type="button"
                        onClick={() => handleSeeDetails(menuUser)}
                        className="w-full text-left px-3 py-2.5 bg-[#4048CD] text-white hover:bg-[#343cb8] transition-colors"
                    >
                        See Details
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSetActive(menuUser)}
                        disabled={menuUserStatus === 'active'}
                        className="w-full text-left px-3 py-2.5 text-gray-800 hover:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                    >
                        Active
                    </button>
                    <button
                        type="button"
                        onClick={() => openSuspendModal(menuUser)}
                        disabled={menuUserStatus === 'suspended'}
                        className="w-full text-left px-3 py-2.5 text-gray-800 hover:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                    >
                        Suspend
                    </button>
                </div>
            )}

            {/* Suspend modal */}
            {suspendTarget && (
                <div
                    className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-4"
                    onClick={closeSuspendModal}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-md bg-white rounded-xl shadow-2xl p-5"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900">Suspend User</h3>
                            <button
                                type="button"
                                onClick={closeSuspendModal}
                                aria-label="Close"
                                className="text-gray-500 hover:text-gray-800"
                            >
                                <FiX size={16} />
                            </button>
                        </div>

                        <form onSubmit={handleConfirmSuspend} noValidate className="mt-4">
                            <label className="block mb-1.5 text-[11px] text-gray-600">
                                Reason <span className="text-[#EE1C25]">*</span>
                            </label>
                            <textarea
                                rows={4}
                                value={reason}
                                onChange={(e) => {
                                    setReason(e.target.value);
                                    setReasonError('');
                                }}
                                placeholder="Why Suspend this user"
                                className="w-full bg-[#F3F4F6] rounded-md px-3 py-2.5 text-xs text-gray-800 placeholder:text-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-[#EE1C25]/30"
                            />
                            {reasonError && <p className="mt-1.5 text-xs text-red-600">{reasonError}</p>}

                            <div className="mt-4 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={closeSuspendModal}
                                    className="px-4 py-2 text-[11px] font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-[11px] font-semibold text-white bg-[#EE1C25] hover:bg-[#d4161e] rounded-md transition-colors"
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