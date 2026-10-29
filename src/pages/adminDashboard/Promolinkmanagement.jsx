import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
const MENU_WIDTH = 160;
const MENU_HEIGHT = 210;

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
const StatCard = ({ label, value, Icon, iconBox, valueClass = "text-slate-900", className = "" }) => (
  <div
    className={`flex items-start justify-between gap-2 rounded-xl border border-gray-100 bg-white px-4 py-3.5 shadow-sm 2xl:px-5 2xl:py-4 ${className}`}
  >
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 2xl:text-xs">
        {label}
      </p>
      <p className={`mt-1 text-2xl font-bold 2xl:text-3xl ${valueClass}`}>{value}</p>
    </div>
    <span
      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md 2xl:h-9 2xl:w-9 ${iconBox}`}
    >
      <Icon className="h-4 w-4 2xl:h-[18px] 2xl:w-[18px]" />
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
    className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-medium 2xl:text-xs ${STATUS_STYLES[status]}`}
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
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-medium 2xl:text-xs ${
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
    <span className="mb-1 block text-[11px] font-semibold text-slate-700 2xl:text-xs">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-indigo-100 bg-indigo-50/60 px-3 py-2 text-xs text-slate-700 outline-none focus:border-indigo-400 2xl:text-sm"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </label>
);

/* ===================================================================== */
/*                      ONE MODAL, THREE CONTENTS                         */
/* ===================================================================== */

const CloseButton = ({ onClose }) => (
  <button
    type="button"
    onClick={onClose}
    aria-label="Close"
    className="flex-shrink-0 rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
  >
    <FiX className="h-4 w-4" />
  </button>
);

const DetailRow = ({ label, children }) => (
  <div className="flex items-center justify-between gap-3 py-2.5 text-xs 2xl:text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="text-right font-medium text-slate-800">{children}</span>
  </div>
);

// 1) Generate: explains the link rules and asks the admin to confirm
const GenerateContent = ({ generating, onClose, onGenerate }) => (
  <>
    <div className="flex items-start gap-3 px-4 pt-4 sm:px-5 sm:pt-5">
      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
        <FiLink className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="text-base font-bold text-slate-900 2xl:text-lg">Generate Promotional Link</h2>
        <p className="mt-1 text-xs leading-relaxed text-gray-500 2xl:text-sm">
          Create a unique invitation link for a new participant. This link can only be used once
          and will expire after {VALIDITY_DAYS} days.
        </p>
      </div>
      <CloseButton onClose={onClose} />
    </div>

    <div className="mt-4 border-t border-gray-100 px-4 py-4 sm:px-5">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 2xl:text-xs">
        Link Settings
      </p>

      <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
          <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-indigo-600 2xl:text-xs">
            <FiClock className="h-3 w-3" />
            Validity
          </p>
          <p className="mt-1 text-sm font-bold text-slate-900 2xl:text-base">{VALIDITY_DAYS} Days</p>
          <p className="mt-0.5 text-[11px] text-gray-500 2xl:text-xs">
            Link expires automatically after {VALIDITY_DAYS} days.
          </p>
        </div>

        <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
          <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-green-600 2xl:text-xs">
            <FiShield className="h-3 w-3" />
            Usage
          </p>
          <p className="mt-1 text-sm font-bold text-slate-900 2xl:text-base">One-time use</p>
          <p className="mt-0.5 text-[11px] text-gray-500 2xl:text-xs">
            Only one participant can use this link.
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-start gap-2 rounded-lg bg-gray-50 px-3 py-2.5">
        <FiInfo className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-indigo-500" />
        <p className="text-[11px] leading-relaxed text-gray-500 2xl:text-xs">
          After generating the link, copy and securely send it to the participant. The link becomes
          bound to their session upon first verification.
        </p>
      </div>
    </div>

    <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <span className="hidden items-center gap-1.5 text-[11px] text-gray-500 sm:flex">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
        Production Ready
      </span>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md px-4 py-2.5 text-xs font-medium text-slate-700 transition hover:bg-gray-100 sm:py-2 2xl:text-sm"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onGenerate}
          disabled={generating}
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-indigo-600 px-4 py-2.5 text-xs font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:py-2 2xl:text-sm"
        >
          <FiZap className="h-3.5 w-3.5" />
          {generating ? "Generating..." : "Generate Link"}
        </button>
      </div>
    </div>
  </>
);

// 2) Share: shows the freshly generated URL with a copy button
const ShareContent = ({ url, onClose, onCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await onCopy(url);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="px-4 pb-5 pt-4 sm:px-5">
      <div className="flex items-start justify-between gap-2">
        <h2 className="flex items-center gap-1.5 text-base font-bold text-slate-900 2xl:text-lg">
          <HiSparkles className="h-4 w-4 text-indigo-600" />
          Your Promotional Link
        </h2>
        <CloseButton onClose={onClose} />
      </div>

      <p className="mt-1 text-xs leading-relaxed text-gray-500 2xl:text-sm">
        Share this unique link with the participant to grant prioritized contact onboarding &amp;
        rewards.
      </p>

      <div className="mt-4 flex flex-col gap-3 rounded-lg bg-gray-50 p-3 min-[420px]:flex-row min-[420px]:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <FiLink className="h-4 w-4 flex-shrink-0 text-gray-400" />
          <p className="min-w-0 flex-1 break-all font-mono text-[11px] font-semibold text-slate-800 2xl:text-xs">
            {url}
          </p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex flex-shrink-0 items-center justify-center gap-1.5 rounded-md bg-indigo-600 px-3 py-2.5 text-xs font-medium text-white transition hover:bg-indigo-700 2xl:text-sm"
        >
          {copied ? <FiCheck className="h-3.5 w-3.5" /> : <FiCopy className="h-3.5 w-3.5" />}
          {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>
    </div>
  );
};

// 3) Details: read-only summary of one link (opened from the row menu / link ID)
const DetailsContent = ({ link, onClose, onCopy }) => {
  const total = link.checklist?.total || 0;
  const progress = total ? Math.round((link.checklist.done / total) * 100) : 0;
  const expiresAt = new Date(new Date(link.issuedAt).getTime() + VALIDITY_DAYS * DAY).toISOString();

  return (
    <>
      <div className="flex items-center justify-between gap-2 border-b border-gray-100 px-4 py-4 sm:px-5">
        <div className="min-w-0">
          <h2 className="truncate text-base font-bold text-slate-900 2xl:text-lg">{link.id}</h2>
          <p className="text-[11px] text-gray-400 2xl:text-xs">Promotional link details</p>
        </div>
        <CloseButton onClose={onClose} />
      </div>

      <div className="divide-y divide-gray-50 px-4 py-2 sm:px-5">
        <DetailRow label="Status">
          <StatusBadge status={link.effectiveStatus} />
        </DetailRow>
        <DetailRow label="Date Issued">{formatDateTime(link.issuedAt)}</DetailRow>
        <DetailRow label="Expires">{formatDateTime(expiresAt)}</DetailRow>
        <DetailRow label="Validity">{getValidityLabel(link)}</DetailRow>
        <DetailRow label="Reward">{link.reward || "—"}</DetailRow>
      </div>

      {/* Checklist progress (only meaningful once the link has been used) */}
      <div className="px-4 pb-3 pt-2 sm:px-5">
        <div className="mb-1.5 flex items-center justify-between text-xs 2xl:text-sm">
          <span className="text-gray-500">Checklist</span>
          <ChecklistBadge checklist={link.checklist} />
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className={`h-full rounded-full transition-all ${
              progress === 100 ? "bg-green-500" : "bg-amber-400"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mx-4 mb-5 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2.5 sm:mx-5">
        <p className="min-w-0 flex-1 break-all font-mono text-[11px] text-slate-700 2xl:text-xs">
          {link.url}
        </p>
        <button
          type="button"
          onClick={() => onCopy(link.url)}
          aria-label="Copy link"
          className="flex-shrink-0 rounded-md p-2 text-indigo-600 transition hover:bg-indigo-50"
        >
          <FiCopy className="h-4 w-4" />
        </button>
      </div>
    </>
  );
};

const MODAL_META = {
  generate: { label: "Generate promotional link", width: "sm:max-w-md" },
  share: { label: "Your promotional link", width: "sm:max-w-sm" },
  details: { label: "Link details", width: "sm:max-w-sm" },
};

/**
 * type: "generate" | "share" | "details"
 *  generate -> generating, onGenerate
 *  share    -> url, onCopy
 *  details  -> link, onCopy
 */
const PromoLinkModal = ({ type, onClose, onCopy, generating, onGenerate, url, link }) => {
  // Lock page scroll while the modal is open (without the page jumping sideways)
  useEffect(() => {
    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const meta = MODAL_META[type];
  if (!meta) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center overscroll-contain bg-black/40 backdrop-blur-md sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={meta.label}
        onClick={(e) => e.stopPropagation()}
        className={`flex max-h-[92dvh] w-full flex-col overflow-y-auto overscroll-contain rounded-t-2xl bg-white pb-[env(safe-area-inset-bottom)] shadow-2xl sm:max-h-[90dvh] sm:rounded-2xl sm:pb-0 ${meta.width}`}
      >
        {/* Mobile bottom-sheet handle */}
        <div className="mx-auto mt-2 h-1 w-10 flex-shrink-0 rounded-full bg-gray-200 sm:hidden" />

        {type === "generate" && (
          <GenerateContent generating={generating} onClose={onClose} onGenerate={onGenerate} />
        )}
        {type === "share" && <ShareContent url={url} onClose={onClose} onCopy={onCopy} />}
        {type === "details" && link && (
          <DetailsContent link={link} onClose={onClose} onCopy={onCopy} />
        )}
      </div>
    </div>,
    document.body
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

  // Modal state: only one modal is open at a time -> null | "generate" | "share" | "details"
  const [modal, setModal] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState(null); // used by the "share" modal
  const [detailsId, setDetailsId] = useState(null); // used by the "details" modal

  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

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

  // Only render the modal when it has everything it needs
  const modalReady =
    modal === "generate" ||
    (modal === "share" && !!generatedUrl) ||
    (modal === "details" && !!detailsLink);

  /* ----- actions ----- */

  const showToast = (message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2500);
  };

  useEffect(() => () => clearTimeout(toastTimer.current), []);

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

  const openDetails = (id) => {
    setDetailsId(id);
    setModal("details");
  };

  const closeModal = () => {
    if (generating) return; // do not close while the link is being created
    setModal(null);
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
    setGeneratedUrl(newLink.url);
    setModal("share"); // switch to the "Your Promotional Link" content
    setPage(1);
  };

  const setReward = (id, reward) => {
    // TODO: call your API here to update the reward status
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, reward } : l)));
    setMenu(null);
    showToast(`Reward marked as ${reward}.`);
  };

  // The menu is rendered with position: fixed (not inside the table) so the table's
  // horizontal scroll never clips it. It flips upward when there is no room below,
  // and is kept inside the screen horizontally for small devices.
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

  // Close the row menu on outside click / Escape / scroll / resize
  useEffect(() => {
    const onPointerDown = (e) => {
      if (menuRef.current?.contains(e.target)) return;
      if (e.target.closest("[data-menu-trigger]")) return; // the trigger toggles on its own
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

  /* ------------------------------- render ------------------------------- */
  return (
    <div className="">
      {/* Page header + primary action */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-slate-900 lg:text-2xl 2xl:text-3xl">
            Promo Link Management
          </h1>
          <p className="mt-1 text-xs text-gray-500 md:text-sm">
            Generate and track one-time promotional links for new participants.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModal("generate")}
          className="inline-flex w-full flex-shrink-0 items-center justify-center gap-1.5 rounded-md bg-red-600 px-4 py-2.5 text-xs font-medium text-white shadow-sm transition hover:bg-red-700 sm:w-auto sm:py-2 2xl:text-sm"
        >
          <FiPlus className="h-3.5 w-3.5" />
          Generate new link
        </button>
      </div>

      {/* Summary stats (calculated from the data, so they always match the table) */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
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
          className="col-span-2 sm:col-span-1"
        />
      </div>

      {/* Filters */}
      <div className="mb-4 grid grid-cols-1 gap-3 rounded-lg border border-gray-100 bg-white p-3 shadow-sm min-[480px]:grid-cols-2 lg:grid-cols-4 2xl:p-4">
        <FilterSelect label="Status" value={filters.status} options={STATUS_OPTIONS} onChange={(v) => updateFilter("status", v)} />
        <FilterSelect label="Date Created" value={filters.date} options={DATE_OPTIONS} onChange={(v) => updateFilter("date", v)} />
        <FilterSelect label="Requirements" value={filters.requirements} options={REQUIREMENT_OPTIONS} onChange={(v) => updateFilter("requirements", v)} />
        <FilterSelect label="Reward Status" value={filters.reward} options={REWARD_OPTIONS} onChange={(v) => updateFilter("reward", v)} />
      </div>

      {/* Links table */}
      <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
        {/* ===== Mobile: Card layout (< md) ===== */}
        <div className="divide-y divide-gray-100 md:hidden">
          {rows.map((l) => (
            <div key={l.id} className="space-y-3 p-4">
              {/* Top: ID + action */}
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => openDetails(l.id)}
                  className="text-sm font-semibold text-blue-600 hover:underline"
                >
                  {l.id}
                </button>

                <button
                  type="button"
                  data-menu-trigger
                  onClick={(e) => openMenu(e, l.id)}
                  aria-label={`Actions for ${l.id}`}
                  aria-haspopup="menu"
                  className="rounded-full p-2 text-slate-700 transition hover:bg-gray-100"
                >
                  <FiMoreVertical className="h-5 w-5" />
                </button>
              </div>

              {/* URL + copy */}
              <div className="flex items-center justify-between gap-2 rounded-md bg-[#F6F9FD] px-3 py-2">
                <span className="min-w-0 break-all font-mono text-xs leading-snug text-slate-700">
                  {stripProtocol(l.url)}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(l.url)}
                  aria-label={`Copy link ${l.id}`}
                  className="shrink-0 rounded-md p-1.5 text-red-500 transition hover:bg-red-50 hover:text-red-700"
                >
                  <FiCopy className="h-4 w-4" />
                </button>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={l.effectiveStatus} />
                <ChecklistBadge checklist={l.checklist} />
              </div>

              {/* Details grid */}
              <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                <div>
                  <dt className="text-[11px] text-slate-400">Date Issued</dt>
                  <dd className="mt-0.5 text-slate-700">{formatDateTime(l.issuedAt)}</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-slate-400">Validity</dt>
                  <dd className="mt-0.5 text-slate-700">{getValidityLabel(l)}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-[11px] text-slate-400">Reward</dt>
                  <dd className="mt-0.5 text-slate-700">
                    {l.reward || <span className="text-gray-400">—</span>}
                  </dd>
                </div>
              </dl>
            </div>
          ))}

          {rows.length === 0 && (
            <p className="px-4 py-12 text-center text-sm text-gray-400">
              No promotional links match these filters.
            </p>
          )}
        </div>

        {/* ===== Tablet / Desktop: Table (>= md) ===== */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[860px] text-left text-[11px] lg:text-xs 2xl:text-sm">
            <thead>
              <tr className="bg-[#F6F9FD] text-slate-700">
                <th className="px-4 py-3 font-medium 2xl:px-5 2xl:py-4">Link ID</th>
                <th className="px-4 py-3 font-medium 2xl:px-5 2xl:py-4">Promotional URL</th>
                <th className="px-4 py-3 font-medium 2xl:px-5 2xl:py-4">Date Issued</th>
                <th className="px-4 py-3 font-medium 2xl:px-5 2xl:py-4">Validity</th>
                <th className="px-4 py-3 font-medium 2xl:px-5 2xl:py-4">Status</th>
                <th className="px-4 py-3 font-medium 2xl:px-5 2xl:py-4">Checklist</th>
                <th className="px-4 py-3 font-medium 2xl:px-5 2xl:py-4">Reward</th>
                <th className="px-4 py-3 text-center font-medium 2xl:px-5 2xl:py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((l) => (
                <tr key={l.id} className="border-t border-gray-100 transition hover:bg-slate-50/60">
                  {/* Clicking the ID is a shortcut to the details modal */}
                  <td className="px-4 py-3.5 2xl:px-5 2xl:py-4">
                    <button
                      type="button"
                      onClick={() => openDetails(l.id)}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {l.id}
                    </button>
                  </td>

                  {/* URL without protocol + quick copy icon */}
                  <td className="px-4 py-3.5 2xl:px-5 2xl:py-4">
                    <div className="flex items-center gap-2">
                      <span className="block max-w-[105px] break-all font-mono text-[10px] leading-snug text-slate-700 lg:max-w-[150px] 2xl:max-w-[240px] 2xl:text-xs">
                        {stripProtocol(l.url)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(l.url)}
                        aria-label={`Copy link ${l.id}`}
                        className="rounded p-1 text-red-500 transition hover:bg-red-50 hover:text-red-700"
                      >
                        <FiCopy className="h-3.5 w-3.5 2xl:h-4 2xl:w-4" />
                      </button>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-4 py-3.5 text-slate-700 2xl:px-5 2xl:py-4">
                    {formatDateTime(l.issuedAt)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-slate-700 2xl:px-5 2xl:py-4">
                    {getValidityLabel(l)}
                  </td>
                  <td className="px-4 py-3.5 2xl:px-5 2xl:py-4">
                    <StatusBadge status={l.effectiveStatus} />
                  </td>
                  <td className="px-4 py-3.5 2xl:px-5 2xl:py-4">
                    <ChecklistBadge checklist={l.checklist} />
                  </td>
                  <td className="px-4 py-3.5 text-slate-700 2xl:px-5 2xl:py-4">
                    {l.reward || <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-3.5 text-center 2xl:px-5 2xl:py-4">
                    <button
                      type="button"
                      data-menu-trigger
                      onClick={(e) => openMenu(e, l.id)}
                      aria-label={`Actions for ${l.id}`}
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
                    No promotional links match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ===== Footer: result range + pagination ===== */}
        <div className="flex flex-col items-center gap-3 border-t border-gray-100 px-4 py-3 sm:flex-row sm:justify-between 2xl:px-5 2xl:py-4">
          <p className="text-center text-xs text-indigo-600 sm:text-left 2xl:text-sm">
            Showing {from} to {to} of {filtered.length} results
          </p>

          <div className="flex w-full items-center gap-2 sm:w-auto">
            <button
              type="button"
              onClick={() => setPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex-1 rounded-md border border-indigo-500 px-4 py-2 text-xs font-medium text-indigo-600 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none sm:px-3 sm:py-1.5 2xl:px-4 2xl:py-2 2xl:text-sm"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex-1 rounded-md border border-indigo-500 px-4 py-2 text-xs font-medium text-indigo-600 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none sm:px-3 sm:py-1.5 2xl:px-4 2xl:py-2 2xl:text-sm"
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
          className="fixed z-40 overflow-hidden rounded-md border border-gray-200 bg-white py-1 text-xs shadow-lg 2xl:text-sm"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              openDetails(menu.id);
              setMenu(null);
            }}
            className="block w-full px-3 py-2.5 text-left font-medium text-indigo-700 hover:bg-indigo-50"
          >
            See Details
          </button>

          <p className="border-t border-gray-100 px-3 pb-1 pt-2 text-[11px] font-bold text-slate-900 2xl:text-xs">
            Reward
          </p>
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
                className="flex w-full items-center justify-between px-3 py-2 text-left text-slate-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {reward}
                {isCurrent && <FiCheck className="h-3.5 w-3.5 text-indigo-600" />}
              </button>
            );
          })}
        </div>
      )}

      {/* The single modal (generate / share / details) */}
      {modalReady && (
        <PromoLinkModal
          type={modal}
          onClose={closeModal}
          onCopy={modal === "share" ? copyToClipboard : handleCopy}
          generating={generating}
          onGenerate={handleGenerate}
          url={generatedUrl}
          link={detailsLink}
        />
      )}

      {/* Toast for quick feedback (copy, reward update) */}
      {toast && (
        <div className="fixed inset-x-4 bottom-4 z-[60] flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-xs text-white shadow-lg sm:inset-x-auto sm:bottom-6 sm:right-6 2xl:text-sm">
          <FiCheck className="h-4 w-4 flex-shrink-0 text-green-400" />
          {toast}
        </div>
      )}
    </div>
  );
};

export default PromoLinkManagement;