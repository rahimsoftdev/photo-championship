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
import {
  DETAILS_PATH,
  formatReportDate,
  getReportType,
  REPORTS,
  STATUS_STYLES,
} from "./Reportsdata.js";

const PAGE_SIZE = 10;
const MENU_WIDTH = 170;
const MENU_HEIGHT = 140;
const STATUS_OPTIONS = ["All Statuses", "Pending", "Under Review", "Resolved"];

/* --------------------------- Small components --------------------------- */

const StatusBadge = ({ status }) => (
  <span
    className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-medium 2xl:text-xs ${STATUS_STYLES[status].badge}`}
  >
    {status}
  </span>
);

const ReportCountBadge = ({ count }) => (
  <span className="inline-block whitespace-nowrap rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-medium text-pink-600 2xl:text-xs">
    {count} Reports
  </span>
);

const StatCard = ({ label, value, Icon, active, onClick, tone }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`relative flex flex-col justify-center items-start rounded-xl border px-4 py-4 text-left transition 2xl:px-5 2xl:py-5 ${tone.card} ${active ? tone.activeRing : "hover:shadow-sm"
      }`}
  >
    <FiArrowRight className="absolute right-3 top-3 h-3.5 w-3.5 text-gray-300 2xl:h-4 2xl:w-4" />
    <span
      className={`flex h-4 w-4 items-center justify-center rounded-full 2xl:h-6 2xl:w-6 ${tone.icon}`}
    >
      <Icon className="h-4 w-4 2xl:h-[18px] 2xl:w-[18px]" />
    </span>
    <div className="flex items-center gap-5 justify-center">
      <span className="mt-3 text-2xl font-bold text-slate-900 2xl:text-3xl">{value}</span>
      <span className="mt-0.5 text-xs font-semibold text-slate-800 2xl:text-sm">{label}</span>
    </div>
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
  const toastTimer = useRef(null);

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
  const showToast = (message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2500);
  };

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const setStatus = (id, status) => {
    // TODO: call your API here to update the report status
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    setMenu(null);
    showToast(`Report marked as ${status}.`);
  };

  const goToDetails = (id) => navigate(`${DETAILS_PATH}?id=${id}`);

  // Fixed-position menu: flips upward near the bottom, and stays inside the screen on small devices
  const openMenu = (e, id) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const openUp = rect.bottom + MENU_HEIGHT > window.innerHeight;
    const maxLeft = window.innerWidth - MENU_WIDTH - 8;
    setMenu((m) =>
      m?.id === id
        ? null
        : {
          id,
          top: openUp ? Math.max(8, rect.top - MENU_HEIGHT - 4) : rect.bottom + 4,
          left: Math.max(8, Math.min(rect.right - MENU_WIDTH, maxLeft)),
        }
    );
  };

  useEffect(() => {
    const onPointerDown = (e) => {
      if (menuRef.current?.contains(e.target)) return;
      if (e.target.closest("[data-menu-trigger]")) return;
      setMenu(null);
    };
    const onKeyDown = (e) => e.key === "Escape" && setMenu(null);
    const closeMenu = () => setMenu(null);

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", closeMenu, true);
    window.addEventListener("resize", closeMenu);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", closeMenu, true);
      window.removeEventListener("resize", closeMenu);
    };
  }, []);

  return (
    <div className="">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-slate-900 lg:text-2xl 2xl:text-3xl">
            Reports &amp; Moderation
          </h1>
          <p className="mt-1 max-w-md text-xs leading-relaxed text-gray-600 md:text-sm 2xl:max-w-xl">
            Review reported content and users, take appropriate action, and manage moderation cases
            across the Lab Unity healthcare and diagnostic network.
          </p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => changeFilter(e.target.value)}
          aria-label="Filter by status"
          className="w-full flex-shrink-0 rounded-md border border-gray-200 bg-white px-3 py-2.5 text-xs text-slate-700 outline-none focus:border-blue-400 sm:w-auto sm:py-2 2xl:text-sm"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      {/* Stat cards (click to filter) */}
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4 2xl:gap-4">
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

      {/* Reports list */}
      <div className="overflow-hidden rounded-lg border border-gray-100 bg-white">
        {/* ===== Mobile: Card layout (< md) ===== */}
        <div className="divide-y divide-gray-100 md:hidden">
          {rows.map((r) => (
            <div key={r.id} className="space-y-3 p-4">
              {/* Top: item + action */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 break-words text-sm font-semibold leading-snug text-slate-900">
                    {r.item.title}
                  </p>
                  <p className="mt-1 text-xs capitalize text-slate-500">
                    {getReportType(r.item.photos.length)}
                  </p>
                </div>
                <button
                  type="button"
                  data-menu-trigger
                  onClick={(e) => openMenu(e, r.id)}
                  aria-label={`Actions for report ${r.id}`}
                  aria-haspopup="menu"
                  className="shrink-0 rounded-full p-2 text-slate-700 transition hover:bg-gray-100"
                >
                  <FiMoreVertical className="h-5 w-5" />
                </button>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={r.status} />
                <ReportCountBadge count={r.reportedUser.totalReports} />
              </div>

              {/* Reason */}
              <div className="rounded-md bg-[#F6F9FD] px-3 py-2">
                <p className="text-[11px] text-slate-400">Reason</p>
                <p className="mt-0.5 text-xs text-slate-700">{r.reason}</p>
              </div>

              {/* Details grid */}
              <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                <div>
                  <dt className="text-[11px] text-slate-400">Reported By</dt>
                  <dd className="mt-0.5 break-words text-slate-800">{r.reportedBy.name}</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-slate-400">Reported User</dt>
                  <dd className="mt-0.5 break-words text-slate-800">{r.reportedUser.name}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-[11px] text-slate-400">Reported Date</dt>
                  <dd className="mt-0.5 text-slate-700">{formatReportDate(r.date)}</dd>
                </div>
              </dl>

              {/* Quick action */}
              <button
                type="button"
                onClick={() => goToDetails(r.id)}
                className="w-full rounded-md border border-blue-500 py-2.5 text-xs font-medium text-blue-600 transition hover:bg-blue-50"
              >
                View Details
              </button>
            </div>
          ))}

          {rows.length === 0 && (
            <p className="px-4 py-12 text-center text-sm text-gray-400">No reports found.</p>
          )}
        </div>

        {/* ===== Tablet / Desktop: Table (>= md) ===== */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[860px] text-left text-[11px] lg:text-xs 2xl:text-sm">
            <thead>
              <tr className="bg-[#F6F9FD] text-slate-700">
                <th className="px-4 py-3 font-medium 2xl:px-5 2xl:py-4">Reported By</th>
                <th className="px-4 py-3 font-medium 2xl:px-5 2xl:py-4">Reported Item</th>
                <th className="px-4 py-3 font-medium 2xl:px-5 2xl:py-4">Type</th>
                <th className="px-4 py-3 font-medium 2xl:px-5 2xl:py-4">Reason</th>
                <th className="px-4 py-3 font-medium 2xl:px-5 2xl:py-4">Reported User</th>
                <th className="px-4 py-3 font-medium 2xl:px-5 2xl:py-4">Reported Date</th>
                <th className="px-4 py-3 font-medium 2xl:px-5 2xl:py-4">Status</th>
                <th className="px-4 py-3 text-center font-medium 2xl:px-5 2xl:py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-gray-100 transition hover:bg-slate-50/60">
                  <td className="whitespace-nowrap px-4 py-4 text-slate-800 2xl:px-5 2xl:py-5">
                    {r.reportedBy.name}
                  </td>
                  <td className="px-4 py-4 text-slate-700 2xl:px-5 2xl:py-5">
                    <p
                      className="max-w-[130px] truncate lg:max-w-[170px] 2xl:max-w-[260px]"
                      title={r.item.title}
                    >
                      {r.item.title}
                    </p>
                  </td>
                  <td className="px-4 py-4 capitalize text-slate-700 2xl:px-5 2xl:py-5">
                    <span className="block max-w-[90px] 2xl:max-w-[120px]">
                      {getReportType(r.item.photos.length)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-700 2xl:px-5 2xl:py-5">
                    <span className="block max-w-[150px] lg:max-w-[200px] 2xl:max-w-[300px]">
                      {r.reason}
                    </span>
                  </td>
                  <td className="px-4 py-4 2xl:px-5 2xl:py-5">
                    <p className="whitespace-nowrap text-slate-800">{r.reportedUser.name}</p>
                    <span className="mt-1 inline-block">
                      <ReportCountBadge count={r.reportedUser.totalReports} />
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-700 2xl:px-5 2xl:py-5">
                    {formatReportDate(r.date)}
                  </td>
                  <td className="px-4 py-4 2xl:px-5 2xl:py-5">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-4 text-center 2xl:px-5 2xl:py-5">
                    <button
                      type="button"
                      data-menu-trigger
                      onClick={(e) => openMenu(e, r.id)}
                      aria-label={`Actions for report ${r.id}`}
                      aria-haspopup="menu"
                      className="rounded-full p-1.5 text-slate-700 transition hover:bg-gray-100"
                    >
                      <FiMoreVertical className="h-4 w-4 2xl:h-5 2xl:w-5" />
                    </button>
                  </td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400 2xl:py-16 2xl:text-sm">
                    No reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ===== Footer / pagination ===== */}
        <div className="flex flex-col items-center gap-3 border-t border-gray-100 px-4 py-3.5 sm:flex-row sm:justify-between 2xl:px-5 2xl:py-4">
          <p className="text-center text-xs text-blue-600 sm:text-left 2xl:text-sm">
            Showing {from} to {to} of {filtered.length} results
          </p>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <button
              type="button"
              onClick={() => setPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex-1 rounded-md border border-blue-500 px-4 py-2 text-xs font-medium text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none sm:px-3 sm:py-1.5 2xl:px-4 2xl:py-2 2xl:text-sm"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex-1 rounded-md border border-blue-500 px-4 py-2 text-xs font-medium text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none sm:px-3 sm:py-1.5 2xl:px-4 2xl:py-2 2xl:text-sm"
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
          className="fixed z-40 overflow-hidden rounded-md border border-gray-200 bg-white py-1 text-xs shadow-lg 2xl:text-sm"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setMenu(null);
              goToDetails(menu.id);
            }}
            className="block w-full px-3 py-2.5 text-left font-medium text-blue-700 hover:bg-blue-50"
          >
            View Details
          </button>
          <button
            type="button"
            role="menuitem"
            disabled={menuReport.status === "Under Review"}
            onClick={() => setStatus(menu.id, "Under Review")}
            className="block w-full px-3 py-2.5 text-left text-slate-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Mark Under Review
          </button>
          <button
            type="button"
            role="menuitem"
            disabled={menuReport.status === "Resolved"}
            onClick={() => setStatus(menu.id, "Resolved")}
            className="block w-full px-3 py-2.5 text-left text-slate-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Mark Resolved
          </button>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed inset-x-4 bottom-4 z-[60] flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-xs text-white shadow-lg sm:inset-x-auto sm:bottom-6 sm:right-6 2xl:text-sm">
          <FiCheck className="h-4 w-4 flex-shrink-0 text-green-400" />
          {toast}
        </div>
      )}
    </div>
  );
};

export default ReportsModeration;