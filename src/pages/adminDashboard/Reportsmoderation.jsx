import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  FiArrowRight,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiMoreVertical,
  FiShield,
} from "react-icons/fi";
// import { DETAILS_PATH, formatReportDate, getReportType, REPORTS, STATUS_STYLES } from "./reportsData";
// import {
import {
  DETAILS_PATH,
  formatReportDate,
  getReportType,
  REPORTS,
  STATUS_STYLES,
} from "./Reportsdata.js";
//   DETAILS_PATH,
//   formatReportDate,
//   getReportType,
//   REPORTS,
//   STATUS_STYLES,
// } from "./Reportsdata.js";
// import {
//   DETAILS_PATH,
//   REPORTS,
//   STATUS_STYLES,
//   formatReportDate,
//   getReportType,
// } from "./reportsData";

const PAGE_SIZE = 10;
const MENU_WIDTH = 150;
const MENU_HEIGHT = 110;
const STATUS_OPTIONS = ["All Statuses", "Pending", "Under Review", "Resolved"];

/* --------------------------- Small components --------------------------- */

const StatusBadge = ({ status }) => (
  <span
    className={`inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-[9px] font-medium ${STATUS_STYLES[status].badge}`}
  >
    {status}
  </span>
);

const StatCard = ({ label, value, Icon, active, onClick, tone }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`relative flex flex-col items-start rounded-xl border px-4 py-4 text-left transition ${tone.card} ${
      active ? tone.activeRing : "hover:shadow-sm"
    }`}
  >
    <FiArrowRight className="absolute right-3 top-3 h-3 w-3 text-gray-300" />
    <span className={`flex h-6 w-6 items-center justify-center rounded-full ${tone.icon}`}>
      <Icon className="h-3 w-3" />
    </span>
    <span className="mt-3 text-2xl font-bold text-slate-900">{value}</span>
    <span className="mt-0.5 text-[10px] font-semibold text-slate-800">{label}</span>
  </button>
);

const TONES = {
  all: {
    card: "border-gray-200 bg-white",
    activeRing: "border-blue-500 ring-1 ring-blue-500",
    icon: "bg-blue-50 text-blue-600",
  },
  pending: {
    card: "border-orange-100 bg-orange-50/50",
    activeRing: "border-orange-400 ring-1 ring-orange-400",
    icon: "bg-orange-100 text-orange-500",
  },
  review: {
    card: "border-blue-100 bg-blue-50/40",
    activeRing: "border-blue-500 ring-1 ring-blue-500",
    icon: "bg-blue-100 text-blue-600",
  },
  resolved: {
    card: "border-green-100 bg-green-50/40",
    activeRing: "border-green-500 ring-1 ring-green-500",
    icon: "bg-green-100 text-green-600",
  },
};

/* ------------------------------- Main page ------------------------------- */

const ReportsModeration = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState(REPORTS);
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [page, setPage] = useState(1);
  const [menu, setMenu] = useState(null); // { id, top, left }
  const [toast, setToast] = useState("");
  const menuRef = useRef(null);

  /* ----- derived ----- */
  const count = (s) => reports.filter((r) => r.status === s).length;
  const filtered = useMemo(
    () => reports.filter((r) => statusFilter === "All Statuses" || r.status === statusFilter),
    [reports, statusFilter]
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const from = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const to = Math.min(currentPage * PAGE_SIZE, filtered.length);
  const menuReport = menu ? reports.find((r) => r.id === menu.id) : null;

  const changeFilter = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  const cards = [
    { label: "Total Reports", value: reports.length, Icon: FiShield, filter: "All Statuses", tone: TONES.all },
    { label: "Pending Reports", value: count("Pending"), Icon: FiClock, filter: "Pending", tone: TONES.pending },
    { label: "Under Review", value: count("Under Review"), Icon: FiEye, filter: "Under Review", tone: TONES.review },
    { label: "Resolved Reports", value: count("Resolved"), Icon: FiCheckCircle, filter: "Resolved", tone: TONES.resolved },
  ];

  /* ----- actions ----- */
  const setStatus = (id, status) => {
    // TODO: call your API here to update the report status
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    setMenu(null);
    setToast(`Report marked as ${status}.`);
    setTimeout(() => setToast(""), 2500);
  };

  const goToDetails = (id) => navigate(`${DETAILS_PATH}?id=${id}`);

  const openMenu = (e, id) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const openUp = rect.bottom + MENU_HEIGHT > window.innerHeight;
    setMenu((m) =>
      m?.id === id
        ? null
        : {
            id,
            top: openUp ? rect.top - MENU_HEIGHT - 4 : rect.bottom + 4,
            left: Math.max(8, rect.right - MENU_WIDTH),
          }
    );
  };

  useEffect(() => {
    const onMouseDown = (e) => {
      if (menuRef.current?.contains(e.target)) return;
      if (e.target.closest("[data-menu-trigger]")) return;
      setMenu(null);
    };
    const onKeyDown = (e) => e.key === "Escape" && setMenu(null);
    const closeMenu = () => setMenu(null);

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", closeMenu, true);
    window.addEventListener("resize", closeMenu);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", closeMenu, true);
      window.removeEventListener("resize", closeMenu);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white p-6 font-sans text-slate-800">
      {/* Header */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Reports &amp; Moderation</h1>
          <p className="mt-1 max-w-md text-[11px] leading-relaxed text-gray-600">
            Review reported content and users, take appropriate action, and manage moderation cases
            across the Lab Unity healthcare and diagnostic network.
          </p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => changeFilter(e.target.value)}
          aria-label="Filter by status"
          className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-[10px] text-slate-700 outline-none focus:border-blue-400"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      {/* Stat cards (click to filter) */}
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c) => (
          <StatCard
            key={c.label}
            label={c.label}
            value={c.value}
            Icon={c.Icon}
            tone={c.tone}
            active={statusFilter === c.filter}
            onClick={() => changeFilter(c.filter)}
          />
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-100 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-[10px]">
            <thead>
              <tr className="bg-[#F6F9FD] text-slate-700">
                <th className="px-4 py-3 font-medium">Reported By</th>
                <th className="px-4 py-3 font-medium">Reported Item</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Reason</th>
                <th className="px-4 py-3 font-medium">Reported User</th>
                <th className="px-4 py-3 font-medium">Reported Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-center font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-gray-100">
                  <td className="whitespace-nowrap px-4 py-4 text-slate-800">{r.reportedBy.name}</td>
                  <td className="px-4 py-4 text-slate-700">
                    <p className="max-w-[130px] truncate">{r.item.title}</p>
                  </td>
                  <td className="px-4 py-4 capitalize text-slate-700">
                    <span className="block max-w-[80px]">{getReportType(r.item.photos.length)}</span>
                  </td>
                  <td className="px-4 py-4 text-slate-700">
                    <span className="block max-w-[150px]">{r.reason}</span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="whitespace-nowrap text-slate-800">{r.reportedUser.name}</p>
                    <span className="mt-1 inline-block rounded-full bg-pink-100 px-2 py-0.5 text-[8px] font-medium text-pink-600">
                      {r.reportedUser.totalReports} Reports
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-700">
                    {formatReportDate(r.date)}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      type="button"
                      data-menu-trigger
                      onClick={(e) => openMenu(e, r.id)}
                      aria-label={`Actions for report ${r.id}`}
                      aria-haspopup="menu"
                      className="rounded-full p-1 text-slate-700 transition hover:bg-gray-100"
                    >
                      <FiMoreVertical className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    No reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / pagination */}
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3.5">
          <p className="text-[10px] text-blue-600">
            Showing {from} to {to} of {filtered.length} results
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="rounded-md border border-blue-500 px-3 py-1 text-[10px] font-medium text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="rounded-md border border-blue-500 px-3 py-1 text-[10px] font-medium text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Row actions dropdown (fixed, so the table's overflow never clips it) */}
      {menu && menuReport && (
        <div
          ref={menuRef}
          role="menu"
          style={{ top: menu.top, left: menu.left, width: MENU_WIDTH }}
          className="fixed z-40 overflow-hidden rounded-md border border-gray-200 bg-white py-1 text-[10px] shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => goToDetails(menu.id)}
            className="block w-full px-3 py-2 text-left font-medium text-blue-700 hover:bg-blue-50"
          >
            View Details
          </button>
          <button
            type="button"
            role="menuitem"
            disabled={menuReport.status === "Under Review"}
            onClick={() => setStatus(menu.id, "Under Review")}
            className="block w-full px-3 py-2 text-left text-slate-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Mark Under Review
          </button>
          <button
            type="button"
            role="menuitem"
            disabled={menuReport.status === "Resolved"}
            onClick={() => setStatus(menu.id, "Resolved")}
            className="block w-full px-3 py-2 text-left text-slate-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Mark Resolved
          </button>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-xs text-white shadow-lg">
          <FiCheck className="h-4 w-4 text-green-400" />
          {toast}
        </div>
      )}
    </div>
  );
};

export default ReportsModeration;