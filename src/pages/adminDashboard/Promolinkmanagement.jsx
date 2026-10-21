import { useEffect, useMemo, useRef, useState } from "react";
import {
  FiCheck,
  FiCheckCircle,
  FiClipboard,
  FiClock,
  FiCopy,
  FiInfo,
  FiLink,
  FiMoreVertical,
  FiPlus,
  FiShield,
  FiUserCheck,
  FiX,
  FiZap,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

/* ==========================================================================
 * Promo Link Management  ->  /adminDashboard/promo-links
 *
 * What this page does:
 *  - Shows summary stats for all promotional links
 *  - Lets an admin filter links (status, date, requirements, reward)
 *  - Generates a new one-time link and shows it in a "copy link" modal
 *  - Lets an admin open link details and update the reward status
 * ========================================================================== */

/* ------------------------------- Config ------------------------------- */

const BASE_URL = "https://my12photos.com/join/promo/"; // public join URL prefix
const VALIDITY_DAYS = 10; // a link expires this many days after it is issued
const CHECKLIST_TOTAL = 9; // number of onboarding requirements a participant must finish
const PAGE_SIZE = 10;
const DAY = 24 * 60 * 60 * 1000;

const STATUS_OPTIONS = ["All Statuses", "Active", "Used", "Expired"];
const DATE_OPTIONS = ["Last 7 Days", "Last 30 Days", "Last 90 Days", "All Time"];
const REQUIREMENT_OPTIONS = ["All Stages", "Incomplete", "Completed"];
const REWARD_OPTIONS = ["All Payouts", "Not Eligible", "Under Review", "Paid"];

// Maps the "Date Created" dropdown to a number of days (Infinity = no limit)
const DATE_RANGE_DAYS = {
  "Last 7 Days": 7,
  "Last 30 Days": 30,
  "Last 90 Days": 90,
  "All Time": Infinity,
};

// Reward values an admin can assign from the row menu
const ASSIGNABLE_REWARDS = ["Not Eligible", "Paid", "Under Review"];

// Row menu size, used to decide whether the menu opens upward near the screen bottom
const MENU_WIDTH = 140;
const MENU_HEIGHT = 190;

/* ------------------------------------------------------------------ */
/*  TODO: Add real data                                                */
/*  Replace INITIAL_LINKS with the data coming from your API.          */
/*  - status    : stored status ("Active" | "Used" | "Expired")        */
/*  - issuedAt  : ISO date string; expiry is derived from it           */
/*  - checklist : { done, total } for used links, otherwise null       */
/*  - reward    : "Not Eligible" | "Under Review" | "Paid" | null      */
/* ------------------------------------------------------------------ */

// Mock helper: ISO date string for "N days ago" so the mock data stays inside the date filters
const ago = (days, hour = 10, minute = 42) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

const used = (id, code, daysAgo, done, reward) => ({
  id,
  code,
  status: "Used",
  issuedAt: ago(daysAgo),
  checklist: { done, total: CHECKLIST_TOTAL },
  reward,
});

const INITIAL_LINKS = [
  { id: "PL-0248", code: "8XK29P", status: "Active", issuedAt: ago(4), checklist: null, reward: null },
  { id: "PL-0247", code: "3QW7LD", status: "Active", issuedAt: ago(5), checklist: null, reward: null },
  { id: "PL-0246", code: "9TR4MB", status: "Expired", issuedAt: ago(12), checklist: null, reward: null },
  used("PL-0245", "K2V8ZN", 8, 6, "Not Eligible"),
  { id: "PL-0244", code: "6HJ1XC", status: "Active", issuedAt: ago(7), checklist: null, reward: null },
  used("PL-0243", "P5D3YF", 9, 9, "Paid"),
  used("PL-0242", "N7B2QS", 10, 9, "Under Review"),
  used("PL-0241", "W4C9RT", 11, 9, "Under Review"),
  used("PL-0240", "L8M6EG", 12, 9, "Paid"),
  used("PL-0239", "Z3F5HA", 13, 9, "Paid"),
  used("PL-0238", "Y9A1UK", 15, 9, "Under Review"),
  used("PL-0237", "G6S4OV", 17, 9, "Paid"),
  used("PL-0236", "D2X7IJ", 20, 9, "Under Review"),
].map((l) => ({ ...l, url: `${BASE_URL}${l.code}` }));

/* ------------------------------- Helpers ------------------------------- */

// Whole days left before expiry (never negative)
const getDaysLeft = (issuedAt) =>
  Math.max(0, Math.ceil((new Date(issuedAt).getTime() + VALIDITY_DAYS * DAY - Date.now()) / DAY));

// An "Active" link whose time ran out is shown as "Expired" even if the backend has not flipped it yet
const getEffectiveStatus = (link) =>
  link.status === "Active" && getDaysLeft(link.issuedAt) === 0 ? "Expired" : link.status;

// Text for the Validity column
const getValidityLabel = (link) => {
  if (link.effectiveStatus === "Used") return "used";
  if (link.effectiveStatus === "Expired") return "0 days";
  return `${link.daysLeft} ${link.daysLeft === 1 ? "day" : "days"} left`;
};

const isChecklistComplete = (checklist) => !!checklist && checklist.done === checklist.total;

// Business rule (assumed): only used links have a reward flow, and a participant with
// incomplete requirements can only be marked "Not Eligible". Remove if your rules differ.
const canSetReward = (link, reward) => {
  if (link.effectiveStatus !== "Used") return false;
  return isChecklistComplete(link.checklist) || reward === "Not Eligible";
};

const formatDateTime = (iso) =>
  new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const stripProtocol = (url) => url.replace(/^https?:\/\//, "");

// Next sequential ID like "PL-0249" based on the highest existing one
const getNextLinkId = (links) => {
  const max = links.reduce((m, l) => Math.max(m, parseInt(l.id.split("-")[1], 10) || 0), 0);
  return `PL-${String(max + 1).padStart(4, "0")}`;
};

// 6-character code without look-alike characters (0/O, 1/I).
// TODO: in production the backend should generate and guarantee unique codes.
const generateCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint32Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
};

// Clipboard write with a boolean result so callers can show success / failure
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

/* --------------------------- Small components --------------------------- */

// One of the five summary cards at the top
const StatCard = ({ label, value, Icon, iconBox, valueClass = "text-slate-900" }) => (
  <div className="flex items-start justify-between rounded-xl border border-gray-100 bg-white px-4 py-3.5 shadow-sm">
    <div>
      <p className="text-[8px] font-semibold uppercase tracking-wider text-gray-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${valueClass}`}>{value}</p>
    </div>
    <span className={`flex h-6 w-6 items-center justify-center rounded-md ${iconBox}`}>
      <Icon className="h-3 w-3" />
    </span>
  </div>
);

// Status pill for the link lifecycle (Active / Used / Expired)
const STATUS_STYLES = {
  Active: "bg-green-100 text-green-700",
  Used: "bg-indigo-600 text-white",
  Expired: "bg-gray-200 text-gray-600",
};
const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-medium ${STATUS_STYLES[status]}`}
  >
    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
    {status}
  </span>
);

// Checklist pill: "Incomplete (6/9)" or "Completed (9/9)"; "—" when there is no checklist yet
const ChecklistBadge = ({ checklist }) => {
  if (!checklist) return <span className="text-gray-400">—</span>;
  const complete = isChecklistComplete(checklist);
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[9px] font-medium ${
        complete ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
      }`}
    >
      {complete ? "Completed" : "Incomplete"} ({checklist.done}/{checklist.total})
    </span>
  );
};

// Labelled <select> used in the filter bar
const FilterSelect = ({ label, value, options, onChange }) => (
  <label className="block">
    <span className="mb-1 block text-[8px] font-semibold text-slate-700">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-indigo-100 bg-indigo-50/60 px-2.5 py-1.5 text-[10px] text-slate-700 outline-none focus:border-indigo-400"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </label>
);

// Generic centered modal: closes on Escape and on backdrop click
const ModalShell = ({ label, onClose, widthClass = "max-w-md", children }) => {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[1px]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${widthClass} rounded-2xl bg-white shadow-2xl`}
      >
        {children}
      </div>
    </div>
  );
};

/* ------------------------------ Modals ------------------------------ */

// Step 1: explains the link rules and asks the admin to confirm generation
const GenerateLinkModal = ({ generating, onClose, onGenerate }) => (
  <ModalShell label="Generate promotional link" onClose={onClose}>
    <div className="flex items-start gap-3 px-5 pt-5">
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
        <FiLink className="h-4 w-4" />
      </span>
      <div className="flex-1">
        <h2 className="text-sm font-bold text-slate-900">Generate Promotional Link</h2>
        <p className="mt-1 text-[10px] leading-relaxed text-gray-500">
          Create a unique invitation link for a new participant. This link can only be used once and
          will expire after {VALIDITY_DAYS} days.
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
      >
        <FiX className="h-3.5 w-3.5" />
      </button>
    </div>

    <div className="mt-4 border-t border-gray-100 px-5 py-4">
      <p className="mb-2 text-[8px] font-semibold uppercase tracking-wider text-gray-400">
        Link Settings
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
          <p className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-wide text-indigo-600">
            <FiClock className="h-2.5 w-2.5" />
            Validity
          </p>
          <p className="mt-1 text-sm font-bold text-slate-900">{VALIDITY_DAYS} Days</p>
          <p className="mt-0.5 text-[9px] text-gray-500">
            Link expires automatically after {VALIDITY_DAYS} days.
          </p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
          <p className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-wide text-green-600">
            <FiShield className="h-2.5 w-2.5" />
            Usage
          </p>
          <p className="mt-1 text-sm font-bold text-slate-900">One-time use</p>
          <p className="mt-0.5 text-[9px] text-gray-500">Only one participant can use this link.</p>
        </div>
      </div>

      <div className="mt-3 flex items-start gap-2 rounded-lg bg-gray-50 px-3 py-2.5">
        <FiInfo className="mt-0.5 h-3 w-3 flex-shrink-0 text-indigo-500" />
        <p className="text-[9px] leading-relaxed text-gray-500">
          After generating the link, copy and securely send it to the participant. The link becomes
          bound to their session upon first verification.
        </p>
      </div>
    </div>

    <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
      <span className="flex items-center gap-1.5 text-[9px] text-gray-500">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
        Production Ready
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1.5 text-[10px] font-medium text-slate-700 transition hover:text-slate-900"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onGenerate}
          disabled={generating}
          className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-4 py-2 text-[10px] font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiZap className="h-3 w-3" />
          {generating ? "Generating..." : "Generate Link"}
        </button>
      </div>
    </div>
  </ModalShell>
);

// Step 2: shows the freshly generated URL with a copy button
const ShareLinkModal = ({ url, onClose, onCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await onCopy(url);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <ModalShell label="Your promotional link" onClose={onClose} widthClass="max-w-sm">
      <div className="px-5 pb-5 pt-4">
        <div className="flex items-start justify-between">
          <h2 className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
            <HiSparkles className="h-3.5 w-3.5 text-indigo-600" />
            Your Promotional Link
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <FiX className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="mt-1 text-[10px] leading-relaxed text-gray-500">
          Share this unique link with the participant to grant prioritized contact onboarding &amp;
          rewards.
        </p>

        <div className="mt-4 flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-3">
          <FiLink className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
          <p className="min-w-0 flex-1 break-all font-mono text-[10px] font-semibold text-slate-800">
            {url}
          </p>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-2 text-[10px] font-medium text-white transition hover:bg-indigo-700"
          >
            {copied ? <FiCheck className="h-3 w-3" /> : <FiCopy className="h-3 w-3" />}
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
};

// "See Details" modal: read-only summary of one link (opened from the row menu)
const LinkDetailsModal = ({ link, onClose, onCopy }) => {
  const progress = link.checklist ? Math.round((link.checklist.done / link.checklist.total) * 100) : 0;
  const expiresAt = new Date(new Date(link.issuedAt).getTime() + VALIDITY_DAYS * DAY).toISOString();

  const Row = ({ label, children }) => (
    <div className="flex items-center justify-between py-2 text-[10px]">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-slate-800">{children}</span>
    </div>
  );

  return (
    <ModalShell label="Link details" onClose={onClose} widthClass="max-w-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">{link.id}</h2>
          <p className="text-[9px] text-gray-400">Promotional link details</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        >
          <FiX className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="divide-y divide-gray-50 px-5 py-2">
        <Row label="Status">
          <StatusBadge status={link.effectiveStatus} />
        </Row>
        <Row label="Date Issued">{formatDateTime(link.issuedAt)}</Row>
        <Row label="Expires">{formatDateTime(expiresAt)}</Row>
        <Row label="Validity">{getValidityLabel(link)}</Row>
        <Row label="Reward">{link.reward || "—"}</Row>
      </div>

      {/* Checklist progress (only meaningful once the link has been used) */}
      <div className="px-5 pb-3 pt-2">
        <div className="mb-1.5 flex items-center justify-between text-[10px]">
          <span className="text-gray-500">Checklist</span>
          <ChecklistBadge checklist={link.checklist} />
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
          <div
            className={`h-full rounded-full ${progress === 100 ? "bg-green-500" : "bg-amber-400"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mx-5 mb-5 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2.5">
        <p className="min-w-0 flex-1 break-all font-mono text-[9px] text-slate-700">{link.url}</p>
        <button
          type="button"
          onClick={() => onCopy(link.url)}
          aria-label="Copy link"
          className="rounded-md p-1.5 text-indigo-600 transition hover:bg-indigo-50"
        >
          <FiCopy className="h-3.5 w-3.5" />
        </button>
      </div>
    </ModalShell>
  );
};

/* ------------------------------- Main page ------------------------------- */

const PromoLinkManagement = () => {
  const [links, setLinks] = useState(INITIAL_LINKS);
  const [filters, setFilters] = useState({
    status: "All Statuses",
    date: "Last 30 Days",
    requirements: "All Stages",
    reward: "All Payouts",
  });
  const [page, setPage] = useState(1);

  // Row action menu position: { id, top, left }
  const [menu, setMenu] = useState(null);
  const menuRef = useRef(null);

  // Modal state: only one modal is open at a time
  const [showGenerate, setShowGenerate] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState(null); // set -> "Your Promotional Link" modal
  const [detailsId, setDetailsId] = useState(null);

  const [toast, setToast] = useState("");

  /* ----- derived data ----- */

  // Add computed fields (effective status, days left) once, so filters/table/stats all agree
  const enriched = useMemo(
    () =>
      links.map((l) => ({
        ...l,
        effectiveStatus: getEffectiveStatus(l),
        daysLeft: getDaysLeft(l.issuedAt),
      })),
    [links]
  );

  const stats = useMemo(
    () => ({
      total: enriched.length,
      active: enriched.filter((l) => l.effectiveStatus === "Active").length,
      used: enriched.filter((l) => l.effectiveStatus === "Used").length,
      expired: enriched.filter((l) => l.effectiveStatus === "Expired").length,
      // used links whose participant has not finished every requirement yet
      incomplete: enriched.filter(
        (l) => l.effectiveStatus === "Used" && l.checklist && !isChecklistComplete(l.checklist)
      ).length,
    }),
    [enriched]
  );

  const filtered = useMemo(() => {
    const maxAgeDays = DATE_RANGE_DAYS[filters.date];
    return enriched.filter((l) => {
      if (filters.status !== "All Statuses" && l.effectiveStatus !== filters.status) return false;
      if (Date.now() - new Date(l.issuedAt).getTime() > maxAgeDays * DAY) return false;
      if (filters.requirements === "Incomplete" && !(l.checklist && !isChecklistComplete(l.checklist)))
        return false;
      if (filters.requirements === "Completed" && !isChecklistComplete(l.checklist)) return false;
      if (filters.reward !== "All Payouts" && l.reward !== filters.reward) return false;
      return true;
    });
  }, [enriched, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const from = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const to = Math.min(currentPage * PAGE_SIZE, filtered.length);

  const menuLink = menu ? enriched.find((l) => l.id === menu.id) : null;
  const detailsLink = detailsId ? enriched.find((l) => l.id === detailsId) : null;

  /* ----- actions ----- */

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  };

  // Any filter change jumps back to page 1 so the user never lands on an empty page
  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleCopy = async (text) => {
    const ok = await copyToClipboard(text);
    showToast(ok ? "Link copied to clipboard." : "Could not copy the link.");
    return ok;
  };

  const handleGenerate = async () => {
    setGenerating(true);

    // TODO: call your API here. The server should create the link and return { id, code, url, issuedAt }.
    await new Promise((r) => setTimeout(r, 600)); // fake network delay
    const code = generateCode();
    const newLink = {
      id: getNextLinkId(links),
      code,
      url: `${BASE_URL}${code}`,
      status: "Active",
      issuedAt: new Date().toISOString(),
      checklist: null,
      reward: null,
    };

    setLinks((prev) => [newLink, ...prev]); // newest first
    setGenerating(false);
    setShowGenerate(false);
    setGeneratedUrl(newLink.url); // opens the "Your Promotional Link" modal
    setPage(1);
  };

  const setReward = (id, reward) => {
    // TODO: call your API here to update the reward status
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, reward } : l)));
    setMenu(null);
    showToast(`Reward marked as ${reward}.`);
  };

  // The menu is rendered with position: fixed (not inside the table) so the table's
  // horizontal scroll never clips it. It flips upward when there is no room below.
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

  // Close the row menu on outside click / Escape / scroll / resize
  useEffect(() => {
    const onMouseDown = (e) => {
      if (menuRef.current?.contains(e.target)) return;
      if (e.target.closest("[data-menu-trigger]")) return; // the trigger toggles on its own
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

  /* ------------------------------- render ------------------------------- */
  return (
    <div className="min-h-screen bg-[#F8F9FC] p-5 font-sans text-slate-800">
      {/* Page header + primary action */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-slate-900">Promo Link Management</h1>
          <p className="mt-1 text-[9px] text-gray-500">
            Generate and track one-time promotional links for new participants.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowGenerate(true)}
          className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3.5 py-2 text-[10px] font-medium text-white shadow-sm transition hover:bg-red-700"
        >
          <FiPlus className="h-3 w-3" />
          Generate new link
        </button>
      </div>

      {/* Summary stats (calculated from the data, so they always match the table) */}
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard label="Total Links" value={stats.total} Icon={FiLink} iconBox="bg-indigo-100 text-indigo-600" />
        <StatCard label="Active Links" value={stats.active} Icon={FiCheckCircle} iconBox="bg-green-100 text-green-600" />
        <StatCard
          label="Used Links"
          value={stats.used}
          Icon={FiUserCheck}
          iconBox="bg-indigo-100 text-indigo-600"
          valueClass="text-indigo-700"
        />
        <StatCard label="Expired Links" value={stats.expired} Icon={FiClock} iconBox="bg-gray-100 text-gray-500" />
        <StatCard
          label="Incomplete Req."
          value={stats.incomplete}
          Icon={FiClipboard}
          iconBox="bg-orange-100 text-orange-500"
          valueClass="text-orange-700"
        />
      </div>

      {/* Filters */}
      <div className="mb-4 grid grid-cols-2 gap-3 rounded-lg border border-gray-100 bg-white p-3 shadow-sm lg:grid-cols-4">
        <FilterSelect label="Status" value={filters.status} options={STATUS_OPTIONS} onChange={(v) => updateFilter("status", v)} />
        <FilterSelect label="Date Created" value={filters.date} options={DATE_OPTIONS} onChange={(v) => updateFilter("date", v)} />
        <FilterSelect label="Requirements" value={filters.requirements} options={REQUIREMENT_OPTIONS} onChange={(v) => updateFilter("requirements", v)} />
        <FilterSelect label="Reward Status" value={filters.reward} options={REWARD_OPTIONS} onChange={(v) => updateFilter("reward", v)} />
      </div>

      {/* Links table */}
      <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-[10px]">
            <thead>
              <tr className="bg-[#F6F9FD] text-slate-700">
                <th className="px-4 py-3 font-medium">Link ID</th>
                <th className="px-4 py-3 font-medium">Promotional URL</th>
                <th className="px-4 py-3 font-medium">Date Issued</th>
                <th className="px-4 py-3 font-medium">Validity</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Checklist</th>
                <th className="px-4 py-3 font-medium">Reward</th>
                <th className="px-4 py-3 text-center font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((l) => (
                <tr key={l.id} className="border-t border-gray-100">
                  {/* Clicking the ID is a shortcut to the details modal */}
                  <td className="px-4 py-3.5">
                    <button
                      type="button"
                      onClick={() => setDetailsId(l.id)}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {l.id}
                    </button>
                  </td>

                  {/* URL without protocol + quick copy icon */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="block max-w-[105px] break-all font-mono text-[8px] leading-snug text-slate-700">
                        {stripProtocol(l.url)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(l.url)}
                        aria-label={`Copy link ${l.id}`}
                        className="text-red-500 transition hover:text-red-700"
                      >
                        <FiCopy className="h-3 w-3" />
                      </button>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-4 py-3.5 text-slate-700">{formatDateTime(l.issuedAt)}</td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-slate-700">{getValidityLabel(l)}</td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={l.effectiveStatus} />
                  </td>
                  <td className="px-4 py-3.5">
                    <ChecklistBadge checklist={l.checklist} />
                  </td>
                  <td className="px-4 py-3.5 text-slate-700">{l.reward || <span className="text-gray-400">—</span>}</td>
                  <td className="px-4 py-3.5 text-center">
                    <button
                      type="button"
                      data-menu-trigger
                      onClick={(e) => openMenu(e, l.id)}
                      aria-label={`Actions for ${l.id}`}
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
                    No promotional links match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer: result range + pagination */}
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
          <p className="text-[9px] text-indigo-600">
            Showing {from} to {to} of {filtered.length} results
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="rounded-md border border-indigo-500 px-3 py-1 text-[10px] font-medium text-indigo-600 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="rounded-md border border-indigo-500 px-3 py-1 text-[10px] font-medium text-indigo-600 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Row action menu: "See Details" + reward options */}
      {menu && menuLink && (
        <div
          ref={menuRef}
          role="menu"
          style={{ top: menu.top, left: menu.left, width: MENU_WIDTH }}
          className="fixed z-40 overflow-hidden rounded-md border border-gray-200 bg-white py-1 text-[10px] shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setDetailsId(menu.id);
              setMenu(null);
            }}
            className="block w-full px-3 py-2 text-left font-medium text-indigo-700 hover:bg-indigo-50"
          >
            See Details
          </button>

          <p className="border-t border-gray-100 px-3 pb-1 pt-2 text-[10px] font-bold text-slate-900">Reward</p>
          {ASSIGNABLE_REWARDS.map((reward) => {
            const isCurrent = menuLink.reward === reward;
            return (
              <button
                key={reward}
                type="button"
                role="menuitem"
                // disabled when the rule says this link cannot get this reward (see canSetReward)
                disabled={isCurrent || !canSetReward(menuLink, reward)}
                onClick={() => setReward(menu.id, reward)}
                className="flex w-full items-center justify-between px-3 py-1.5 text-left text-slate-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {reward}
                {isCurrent && <FiCheck className="h-3 w-3 text-indigo-600" />}
              </button>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {showGenerate && (
        <GenerateLinkModal
          generating={generating}
          onClose={() => !generating && setShowGenerate(false)}
          onGenerate={handleGenerate}
        />
      )}
      {generatedUrl && (
        <ShareLinkModal url={generatedUrl} onClose={() => setGeneratedUrl(null)} onCopy={copyToClipboard} />
      )}
      {detailsLink && (
        <LinkDetailsModal link={detailsLink} onClose={() => setDetailsId(null)} onCopy={handleCopy} />
      )}

      {/* Toast for quick feedback (copy, reward update) */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-xs text-white shadow-lg">
          <FiCheck className="h-4 w-4 text-green-400" />
          {toast}
        </div>
      )}
    </div>
  );
};

export default PromoLinkManagement;