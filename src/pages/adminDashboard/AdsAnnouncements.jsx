import { useMemo, useState } from "react";
import {
    FiPlus,
    FiMoreHorizontal,
    FiCalendar,
    FiClock,
    FiX,
    FiChevronLeft,
    FiChevronRight,
    FiSearch,
} from "react-icons/fi";
import AnnouncementModal from "../../components/admin/AnnouncementModal";
// import AnnouncementModal from "../components/AnnouncementModal";

const initialAnnouncements = [
    {
        id: "ANN-1024",
        message: "🎉 May 2026 winners announced — View now →",
        type: "Winner Announcement",
        startDate: "2026-05-20",
        endDate: "2026-05-31",
        priority: "High",
        status: "Expired",
        icon: "🎉",
    },
    {
        id: "ANN-1025",
        message: "🚩 June competition is now open — Free to enter.",
        type: "Competition",
        startDate: "2026-06-01",
        endDate: "2026-06-30",
        priority: "High",
        status: "Expired",
        icon: "🚩",
    },
    {
        id: "ANN-1026",
        message: "🏆 This month's prize: $500 cash award",
        type: "Promotion",
        startDate: "2026-08-01",
        endDate: "2026-08-31",
        priority: "Medium",
        status: "Active",
        icon: "🏆",
    },
    {
        id: "ANN-1027",
        message: "🎁 Competition ends in 7 days — Submit your best shot!",
        type: "Competition",
        startDate: "2026-08-04",
        endDate: "2026-08-11",
        priority: "Low",
        status: "Active",
        icon: "🎁",
    },
    {
        id: "ANN-1028",
        message: "📸 New Photo Marketplace now live — Buy & sell prints",
        type: "General",
        startDate: "2026-09-01",
        endDate: "",
        priority: "Medium",
        status: "Scheduled",
        icon: "📸",
    },
    {
        id: "ANN-1029",
        message: "🌟 Scheduled: August winners to be revealed on Sep 10",
        type: "Winner Announcement",
        startDate: "2026-08-30",
        endDate: "2026-09-10",
        priority: "High",
        status: "Scheduled",
        icon: "🌟",
    },
    {
        id: "ANN-1030",
        message: "📢 Important: Platform maintenance on Aug 15, 2–4 AM",
        type: "Important Notice",
        startDate: "2026-08-13",
        endDate: "2026-08-15",
        priority: "High",
        status: "Inactive",
        icon: "📢",
    },
    {
        id: "ANN-1031",
        message: "🔥 Flash sale: Premium membership 50% off this week",
        type: "Promotion",
        startDate: "2026-07-12",
        endDate: "2026-07-14",
        priority: "High",
        status: "Expired",
        icon: "🔥",
    },
    {
        id: "ANN-1032",
        message: "🔒 Portfolio reviews open — Book a slot with our judges",
        type: "General",
        startDate: "2026-07-01",
        endDate: "2026-07-31",
        priority: "Medium",
        status: "Expired",
        icon: "🔒",
    },
    {
        id: "ANN-1033",
        message: "🎉 April competition results: 3 winners selected from",
        type: "Winner Announcement",
        startDate: "2026-04-28",
        endDate: "2026-05-10",
        priority: "Medium",
        status: "Expired",
        icon: "🎉",
    },
    {
        id: "ANN-1034",
        message: "📷 Share your latest photography with the community",
        type: "General",
        startDate: "2026-10-22",
        endDate: "2026-10-30",
        priority: "Low",
        status: "Scheduled",
        icon: "📷",
    },
    {
        id: "ANN-1035",
        message: "🏆 New photography challenge starts soon",
        type: "Competition",
        startDate: "2026-10-25",
        endDate: "2026-11-05",
        priority: "High",
        status: "Scheduled",
        icon: "🏆",
    },
    {
        id: "ANN-1036",
        message: "🎁 Special offers available for members",
        type: "Promotion",
        startDate: "2026-10-01",
        endDate: "2026-10-15",
        priority: "Medium",
        status: "Expired",
        icon: "🎁",
    },
    {
        id: "ANN-1037",
        message: "📢 Community guidelines have been updated",
        type: "Important Notice",
        startDate: "2026-10-05",
        endDate: "",
        priority: "High",
        status: "Inactive",
        icon: "📢",
    },
    {
        id: "ANN-1038",
        message: "✨ Welcome to our photography community",
        type: "General",
        startDate: "2026-09-15",
        endDate: "2026-09-20",
        priority: "Low",
        status: "Expired",
        icon: "✨",
    },
    {
        id: "ANN-1039",
        message: "📸 Monthly photo review is now open",
        type: "Competition",
        startDate: "2026-10-20",
        endDate: "2026-10-30",
        priority: "Medium",
        status: "Active",
        icon: "📸",
    },
    {
        id: "ANN-1040",
        message: "🎉 Congratulations to our community winners",
        type: "Winner Announcement",
        startDate: "2026-10-10",
        endDate: "2026-10-12",
        priority: "High",
        status: "Expired",
        icon: "🎉",
    },
    {
        id: "ANN-1041",
        message: "🚀 Discover new features on our platform",
        type: "General",
        startDate: "2026-10-18",
        endDate: "2026-10-25",
        priority: "Medium",
        status: "Active",
        icon: "🚀",
    },
    {
        id: "ANN-1042",
        message: "🏆 Photography contest registration is open",
        type: "Competition",
        startDate: "2026-10-21",
        endDate: "2026-11-01",
        priority: "High",
        status: "Active",
        icon: "🏆",
    },
    {
        id: "ANN-1043",
        message: "🔥 Limited-time premium membership offer",
        type: "Promotion",
        startDate: "2026-10-12",
        endDate: "2026-10-18",
        priority: "Medium",
        status: "Expired",
        icon: "🔥",
    },
    {
        id: "ANN-1044",
        message: "📢 Scheduled system update",
        type: "Important Notice",
        startDate: "2026-10-23",
        endDate: "2026-10-24",
        priority: "High",
        status: "Scheduled",
        icon: "📢",
    },
    {
        id: "ANN-1045",
        message: "✨ Explore this month's featured photographs",
        type: "General",
        startDate: "2026-10-01",
        endDate: "2026-10-10",
        priority: "Low",
        status: "Expired",
        icon: "✨",
    },
    {
        id: "ANN-1046",
        message: "🎁 Invite friends and earn rewards",
        type: "Promotion",
        startDate: "2026-10-21",
        endDate: "2026-10-31",
        priority: "Medium",
        status: "Active",
        icon: "🎁",
    },
    {
        id: "ANN-1047",
        message: "🏆 Next month's competition announcement",
        type: "Competition",
        startDate: "2026-11-01",
        endDate: "2026-11-30",
        priority: "High",
        status: "Scheduled",
        icon: "🏆",
    },
];

const statusStyles = {
    Active: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Scheduled: "border-blue-200 bg-blue-50 text-blue-600",
    Expired: "border-slate-200 bg-slate-50 text-slate-500",
    Inactive: "border-amber-200 bg-amber-50 text-amber-700",
};

const typeStyles = {
    "Winner Announcement": "bg-amber-50 text-amber-700 border-amber-200",
    Competition: "bg-violet-50 text-violet-700 border-violet-200",
    Promotion: "bg-rose-50 text-rose-600 border-rose-200",
    General: "bg-sky-50 text-sky-700 border-sky-200",
    "Important Notice": "bg-orange-50 text-orange-600 border-orange-200",
};

function formatDate(date) {
    if (!date) return "Until manually disabled";

    return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function StatusBadge({ status }) {
    const icons = {
        Active: "●",
        Scheduled: "◷",
        Expired: "×",
        Inactive: "▣",
    };

    return (
        <span
            className={`inline-flex whitespace-nowrap items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusStyles[status] || statusStyles.Inactive
                }`}
        >
            <span>{icons[status] || "●"}</span>
            {status}
        </span>
    );
}

function TypeBadge({ type }) {
    return (
        <span
            className={`inline-flex whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-medium ${typeStyles[type] || typeStyles.General
                }`}
        >
            {type}
        </span>
    );
}

function PriorityLabel({ priority }) {
    const styles = {
        High: "text-rose-600",
        Medium: "text-orange-600",
        Low: "text-slate-500",
    };

    const dots = {
        High: "●●●",
        Medium: "●●○",
        Low: "●○○",
    };

    return (
        <span
            className={`inline-flex items-center gap-1 whitespace-nowrap text-[11px] ${styles[priority] || styles.Low
                }`}
        >
            <span className="tracking-[-2px]">{dots[priority]}</span>
            {priority}
        </span>
    );
}

function StatCard({ title, value, subtitle, icon, color }) {
    return (
        <div className="min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
            <p className="text-[10px] font-medium text-slate-500">{title}</p>

            <div className="mt-1 flex items-center justify-between">
                <span className={`text-2xl font-semibold leading-7 ${color}`}>
                    {value}
                </span>
                <span className="text-slate-400">{icon}</span>
            </div>

            <p className="mt-1 truncate text-[10px] text-slate-400">{subtitle}</p>
        </div>
    );
}

export default function AdsAnnouncements() {
    const [announcements, setAnnouncements] = useState(initialAnnouncements);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [openMenu, setOpenMenu] = useState(null);

    const pageSize = 10;

    const filteredAnnouncements = useMemo(() => {
        return announcements.filter((item) => {
            const matchesSearch =
                item.message.toLowerCase().includes(search.toLowerCase()) ||
                item.id.toLowerCase().includes(search.toLowerCase()) ||
                item.type.toLowerCase().includes(search.toLowerCase());

            const matchesStatus =
                filterStatus === "All" || item.status === filterStatus;

            return matchesSearch && matchesStatus;
        });
    }, [announcements, search, filterStatus]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredAnnouncements.length / pageSize)
    );

    const visibleAnnouncements = filteredAnnouncements.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const stats = useMemo(() => {
        return {
            total: announcements.length,
            active: announcements.filter((item) => item.status === "Active").length,
            scheduled: announcements.filter((item) => item.status === "Scheduled")
                .length,
            expired: announcements.filter((item) => item.status === "Expired").length,
        };
    }, [announcements]);

    function handleCreateAnnouncement(newAnnouncement) {
        setAnnouncements((previous) => [newAnnouncement, ...previous]);
        setCurrentPage(1);
        setSearch("");
        setFilterStatus("All");
        setIsModalOpen(false);
    }

    function updateStatus(id, status) {
        setAnnouncements((previous) =>
            previous.map((item) => (item.id === id ? { ...item, status } : item))
        );
        setOpenMenu(null);
    }

    function deleteAnnouncement(id) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this announcement?"
        );

        if (!confirmed) return;

        setAnnouncements((previous) => previous.filter((item) => item.id !== id));
        setOpenMenu(null);
    }

    function handleFilterChange(value) {
        setFilterStatus(value);
        setCurrentPage(1);
    }

    function handleSearchChange(value) {
        setSearch(value);
        setCurrentPage(1);
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 font-sans text-slate-800 sm:p-6">
            <div className="mx-auto max-w-[1600px]">
                {/* Header */}
                <header className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                            Ads & Announcements
                        </h1>
                        <p className="mt-1 text-xs text-slate-500">
                            Create and manage announcements displayed above the website
                            navigation.
                        </p>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-600 px-4 py-2.5 text-xs font-medium text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                    >
                        <FiPlus size={15} />
                        Create Announcement
                    </button>
                </header>

                {/* Statistics */}
                <section className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Total Announcements"
                        value={stats.total}
                        subtitle="All announcements"
                        icon={<FiCalendar size={16} />}
                        color="text-slate-700"
                    />

                    <StatCard
                        title="Active"
                        value={stats.active}
                        subtitle="Currently visible"
                        icon={<span className="text-xs text-emerald-500">●</span>}
                        color="text-emerald-500"
                    />

                    <StatCard
                        title="Scheduled"
                        value={stats.scheduled}
                        subtitle="Scheduled to appear"
                        icon={<FiClock size={16} />}
                        color="text-blue-600"
                    />

                    <StatCard
                        title="Expired"
                        value={stats.expired}
                        subtitle="No longer active"
                        icon={<FiX size={16} />}
                        color="text-slate-400"
                    />
                </section>

                {/* Filters */}
                <section className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1 sm:max-w-sm">
                        <FiSearch
                            size={15}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => handleSearchChange(event.target.value)}
                            placeholder="Search announcements..."
                            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <select
                        value={filterStatus}
                        onChange={(event) => handleFilterChange(event.target.value)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-blue-400"
                    >
                        <option value="All">All statuses</option>
                        <option value="Active">Active</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Expired">Expired</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </section>

                {/* Table */}
                <section className="overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto rounded-xl">
                        <table className="w-full min-w-[900px] border-collapse text-left">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                                    <th className="px-3 py-3 font-medium">Announcement</th>
                                    <th className="px-3 py-3 font-medium">Type</th>
                                    <th className="px-3 py-3 font-medium">Schedule</th>
                                    <th className="px-3 py-3 font-medium">Priority</th>
                                    <th className="px-3 py-3 font-medium">Status</th>
                                    <th className="px-3 py-3 text-center font-medium">Action</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {visibleAnnouncements.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="transition hover:bg-slate-50/80"
                                    >
                                        <td className="max-w-[320px] px-3 py-2.5">
                                            <p
                                                className="truncate text-[11px] font-medium text-slate-800"
                                                title={item.message}
                                            >
                                                {item.message}
                                            </p>
                                            <p className="mt-1 text-[9px] text-slate-400">
                                                {item.id}
                                            </p>
                                        </td>

                                        <td className="px-3 py-2.5">
                                            <TypeBadge type={item.type} />
                                        </td>

                                        <td className="px-3 py-2.5">
                                            <p className="whitespace-nowrap text-[10px] text-slate-600">
                                                Start: {formatDate(item.startDate)}
                                            </p>
                                            <p className="mt-1 whitespace-nowrap text-[10px] text-slate-400">
                                                {item.endDate
                                                    ? `End: ${formatDate(item.endDate)}`
                                                    : "Until manually disabled"}
                                            </p>
                                        </td>

                                        <td className="px-3 py-2.5">
                                            <PriorityLabel priority={item.priority} />
                                        </td>

                                        <td className="px-3 py-2.5">
                                            <StatusBadge status={item.status} />
                                        </td>

                                        <td className="px-3 py-2.5 text-center">
                                            <div className="relative inline-block">
                                                <button
                                                    onClick={() =>
                                                        setOpenMenu(openMenu === item.id ? null : item.id)
                                                    }
                                                    aria-label={`Actions for ${item.id}`}
                                                    className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                                >
                                                    <FiMoreHorizontal size={17} />
                                                </button>

                                                {openMenu === item.id && (
                                                    <div className="absolute right-0 top-8 z-20 w-40 rounded-lg border border-slate-200 bg-white p-1 text-left shadow-xl">
                                                        {["Active", "Inactive", "Scheduled", "Expired"]
                                                            .filter((status) => status !== item.status)
                                                            .map((status) => (
                                                                <button
                                                                    key={status}
                                                                    onClick={() => updateStatus(item.id, status)}
                                                                    className="block w-full rounded-md px-3 py-2 text-left text-xs hover:bg-slate-50"
                                                                >
                                                                    Set {status}
                                                                </button>
                                                            ))}

                                                        <button
                                                            onClick={() => deleteAnnouncement(item.id)}
                                                            className="block w-full rounded-md px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {visibleAnnouncements.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-4 py-14 text-center text-sm text-slate-400"
                                        >
                                            No announcements found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <footer className="flex flex-col gap-3 border-t border-slate-100 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-[10px] text-slate-500">
                            Showing{" "}
                            {filteredAnnouncements.length
                                ? (currentPage - 1) * pageSize + 1
                                : 0}
                            –
                            {Math.min(currentPage * pageSize, filteredAnnouncements.length)}{" "}
                            of {filteredAnnouncements.length} announcements
                        </p>

                        <div className="flex items-center justify-end gap-1">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((page) => page - 1)}
                                className="rounded-md border border-slate-200 px-2 py-1.5 text-xs text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <FiChevronLeft size={14} />
                            </button>

                            {Array.from({ length: totalPages }, (_, index) => index + 1)
                                .filter(
                                    (page) =>
                                        page === 1 ||
                                        page === totalPages ||
                                        Math.abs(page - currentPage) <= 1
                                )
                                .map((page, index, pages) => (
                                    <span key={page} className="contents">
                                        {index > 0 && pages[index - 1] !== page - 1 && (
                                            <span className="px-1 text-xs text-slate-400">…</span>
                                        )}
                                        <button
                                            onClick={() => setCurrentPage(page)}
                                            className={`min-w-7 rounded-md border px-2 py-1.5 text-xs transition ${currentPage === page
                                                    ? "border-slate-900 bg-slate-900 text-white"
                                                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    </span>
                                ))}

                            <button
                                disabled={currentPage >= totalPages}
                                onClick={() => setCurrentPage((page) => page + 1)}
                                className="rounded-md border border-slate-200 px-2 py-1.5 text-xs text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <FiChevronRight size={14} />
                            </button>
                        </div>
                    </footer>
                </section>
            </div>

            {/* Create modal */}
            {isModalOpen && (
                <AnnouncementModal
                    onClose={() => setIsModalOpen(false)}
                    onCreate={handleCreateAnnouncement}
                />
            )}
        </div>
    );
}