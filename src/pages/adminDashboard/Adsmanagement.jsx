import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiCheck, FiExternalLink, FiMoreVertical, FiX } from "react-icons/fi";

/* ------------------------------------------------------------------ */
/*  TODO: Add real data                                                */
/*  Replace ADS with the data coming from your API.                    */
/*  - price     : price per day (shown in the table)                   */
/*  - amount    : total amount shown in the details panel              */
/*  - startDate / endDate : "YYYY-MM-DD"                               */
/* ------------------------------------------------------------------ */
const adImage = (seed) => `https://picsum.photos/seed/${seed}/800/400`;

const ADS = [
  {
    id: 1,
    name: "Bessie Cooper",
    email: "almalawson@example.com",
    phone: "(209) 555-0104",
    accountType: "Business",
    businessType: "Online",
    businessName: "City Fitness Center",
    description: "Innovative technology solutions for modern businesses",
    website: "https://example-business5.com",
    pageName: "Home Screen",
    price: 35,
    amount: 369,
    startDate: "2026-04-14",
    endDate: "2026-04-28",
    status: "Published",
    image: adImage("ads-home"),
  },
  {
    id: 2,
    name: "Courtney Henry",
    email: "felicia.reid@example.com",
    phone: "(252) 555-0126",
    accountType: "Business",
    businessType: "Local",
    businessName: "Henry Web Supplies",
    description: "Local supplier of web hosting and shop tools",
    website: "https://henry-supplies.example.com",
    pageName: "Webshop Page",
    price: 60,
    amount: 840,
    startDate: "2026-04-14",
    endDate: "2026-04-28",
    status: "Pending",
    image: adImage("ads-webshop"),
  },
  {
    id: 3,
    name: "Albert Flores",
    email: "michelle.rivera@example.com",
    phone: "(808) 555-0111",
    accountType: "Individual",
    businessType: "Online",
    businessName: "Flores Studio",
    description: "Freelance design and branding services",
    website: "https://flores-studio.example.com",
    pageName: "Blog Details Page",
    price: 100,
    amount: 1400,
    startDate: "2026-04-14",
    endDate: "2026-04-28",
    status: "Rejected",
    image: adImage("ads-blog"),
  },
  {
    id: 4,
    name: "Dianne Russell",
    email: "debra.holt@example.com",
    phone: "(316) 555-0116",
    accountType: "Business",
    businessType: "Local",
    businessName: "Russell Bakery",
    description: "Fresh bread and pastries baked daily",
    website: "https://russell-bakery.example.com",
    pageName: "Community Page",
    price: 35,
    amount: 490,
    startDate: "2026-03-29",
    endDate: "2026-04-12",
    status: "Expired",
    image: adImage("ads-community-1"),
  },
  {
    id: 5,
    name: "Ronald Richards",
    email: "kenzi.lawson@example.com",
    phone: "(405) 555-0120",
    accountType: "Business",
    businessType: "Online",
    businessName: "Richards Finance",
    description: "Simple credit and budgeting tools for families",
    website: "https://richards-finance.example.com",
    pageName: "Credit Page",
    price: 60,
    amount: 840,
    startDate: "2026-04-14",
    endDate: "2026-04-28",
    status: "Rejected",
    image: adImage("ads-credit"),
  },
  {
    id: 6,
    name: "Arlene McCoy",
    email: "jessica.hanson@example.com",
    phone: "(208) 555-0112",
    accountType: "Individual",
    businessType: "Local",
    businessName: "McCoy Pet Care",
    description: "Pet sitting and grooming in your neighborhood",
    website: "https://mccoy-petcare.example.com",
    pageName: "Community Page",
    price: 100,
    amount: 1400,
    startDate: "2026-04-14",
    endDate: "2026-04-28",
    status: "Pending",
    image: adImage("ads-community-2"),
  },
  {
    id: 7,
    name: "Wade Warren",
    email: "wade.warren@example.com",
    phone: "(702) 555-0122",
    accountType: "Business",
    businessType: "Online",
    businessName: "Warren Logistics",
    description: "Reliable shipping and delivery for small businesses",
    website: "https://warren-logistics.example.com",
    pageName: "Home Screen",
    price: 35,
    amount: 490,
    startDate: "2026-04-14",
    endDate: "2026-04-28",
    status: "Published",
    image: adImage("ads-home-2"),
  },
];

/* ------------------------------- Config ------------------------------- */

const PAGE_SIZE = 10;
const DAY = 24 * 60 * 60 * 1000;
const MENU_WIDTH = 170;
const MENU_HEIGHT = 140;

const STATUS_STYLES = {
  Published: "bg-green-100 text-green-700",
  Pending: "bg-amber-100 text-amber-700",
  Rejected: "bg-red-100 text-red-600",
  Expired: "bg-gray-200 text-gray-600",
};

/* ------------------------------- Helpers ------------------------------- */

const formatDate = (iso) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US");
const getTotalDays = (start, end) =>
  Math.max(0, Math.round((new Date(end) - new Date(start)) / DAY));
const money = (n) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/* --------------------------- Small components --------------------------- */

const StatusBadge = ({ status }) => (
  <span
    className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-medium 2xl:text-xs ${STATUS_STYLES[status]}`}
  >
    {status}
  </span>
);

const DetailItem = ({ label, children }) => (
  <div>
    <p className="text-[11px] text-gray-400">{label}</p>
    <div className="mt-0.5 break-words text-xs font-medium text-slate-800 2xl:text-sm">
      {children}
    </div>
  </div>
);

const DarkBadge = ({ children }) => (
  <span className="inline-block rounded-full bg-slate-900 px-2.5 py-0.5 text-[11px] font-medium text-white">
    {children}
  </span>
);

const SummaryRow = ({ label, value }) => (
  <div className="flex items-center justify-between gap-3 text-xs 2xl:text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-slate-800">{value}</span>
  </div>
);

/* ------------------------------ Details panel ------------------------------ */
// Mobile: bottom sheet. sm and up: right side drawer.

const AdDetailsPanel = ({ ad, onClose }) => {
  const totalDays = getTotalDays(ad.startDate, ad.endDate);
  const subtotal = ad.price * totalDays;

  // Lock page scroll while the panel is open (without the page jumping sideways)
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

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center overscroll-contain bg-black/40 backdrop-blur-md sm:items-stretch sm:justify-end sm:p-3"
      onClick={onClose}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Ad details"
        onClick={(e) => e.stopPropagation()}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        className="flex max-h-[92dvh] w-full flex-col overflow-y-auto overscroll-contain rounded-t-2xl bg-white pb-[env(safe-area-inset-bottom)] shadow-2xl [&::-webkit-scrollbar]:hidden sm:max-h-none sm:max-w-sm sm:rounded-xl sm:pb-0 2xl:max-w-md"
      >
        {/* Mobile bottom-sheet handle */}
        <div className="mx-auto mt-2 h-1 w-10 flex-shrink-0 rounded-full bg-gray-200 sm:hidden" />

        <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:pt-5">
          <h2 className="text-base font-bold text-slate-900 2xl:text-lg">Ad Details</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-white transition hover:bg-slate-700"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3 px-4 pb-2 sm:px-5">
          <DetailItem label="Full Name">{ad.name}</DetailItem>
          <DetailItem label="Email">
            <span className="break-all">{ad.email}</span>
          </DetailItem>
          <DetailItem label="Phone">{ad.phone}</DetailItem>
          <DetailItem label="Business Type">
            <DarkBadge>{ad.accountType}</DarkBadge>
          </DetailItem>
          <DetailItem label="Business Name">{ad.businessName}</DetailItem>
          <DetailItem label="Type">
            <DarkBadge>{ad.businessType}</DarkBadge>
          </DetailItem>
          <DetailItem label="Description">
            <span className="font-normal text-slate-600">{ad.description}</span>
          </DetailItem>
          <DetailItem label="Website">
            <a
              href={ad.website}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all font-normal text-blue-600 hover:underline"
            >
              {ad.website}
            </a>
          </DetailItem>

          <div>
            <p className="text-[11px] text-gray-400">Amount</p>
            <p className="mt-0.5 text-2xl font-semibold text-slate-900">{money(ad.amount)}</p>
          </div>

          <DetailItem label="Ads Page">
            <span className="font-normal">{ad.pageName}</span>
          </DetailItem>
        </div>

        <div className="relative mx-4 mt-2 overflow-hidden rounded-lg sm:mx-5">
          <img
            src={ad.image}
            alt={`${ad.businessName} ad`}
            className="h-28 w-full object-cover sm:h-24 2xl:h-32"
          />
          <a
            href={ad.image}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open image in new tab"
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded bg-black/50 text-white transition hover:bg-black/70"
          >
            <FiExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="mx-4 mb-5 mt-4 space-y-2.5 border-t border-gray-100 pt-3 sm:mx-5">
          <SummaryRow label="Ads Start Date:" value={formatDate(ad.startDate)} />
          <SummaryRow label="Ads End Date:" value={formatDate(ad.endDate)} />
          <SummaryRow label="Total Days:" value={`${totalDays} Days`} />
          <SummaryRow label="Subtotal:" value={money(subtotal)} />
        </div>
      </aside>
    </div>,
    document.body
  );
};

/* ------------------------------- Main page ------------------------------- */

const AdsManagement = () => {
  const [ads, setAds] = useState(ADS);
  const [page, setPage] = useState(1);
  const [menu, setMenu] = useState(null); // { id, top, left }
  const [detailsId, setDetailsId] = useState(null);
  const [toast, setToast] = useState("");
  const menuRef = useRef(null);
  const toastTimer = useRef(null);

  const total = ads.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const rows = useMemo(
    () => ads.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [ads, currentPage]
  );
  const from = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const to = Math.min(currentPage * PAGE_SIZE, total);

  const detailsAd = detailsId ? ads.find((a) => a.id === detailsId) : null;
  const menuAd = menu ? ads.find((a) => a.id === menu.id) : null;

  const showToast = (message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2500);
  };

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const setStatus = (id, status) => {
    // TODO: call your API here to update the ad status
    setAds((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    setMenu(null);
    showToast(`Ad marked as ${status}.`);
  };

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

  // close the menu / panel on outside click, Escape, scroll, resize
  useEffect(() => {
    const onPointerDown = (e) => {
      if (menuRef.current?.contains(e.target)) return;
      if (e.target.closest("[data-menu-trigger]")) return;
      setMenu(null);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setMenu(null);
        setDetailsId(null);
      }
    };
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
      <h1 className="text-xl font-bold text-slate-900 lg:text-2xl 2xl:text-3xl">
        Adds Management
      </h1>
      <p className="mb-4 mt-1.5 text-xs text-gray-600 md:text-sm">
        Donor Advertisement Management Dashboard
      </p>

      <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
        {/* ===== Mobile: Card layout (< md) ===== */}
        <div className="divide-y divide-gray-100 md:hidden">
          {rows.map((ad) => (
            <div key={ad.id} className="space-y-3 p-4">
              {/* Top: name + action */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{ad.name}</p>
                  <p className="mt-0.5 break-all text-xs text-slate-500">{ad.email}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{ad.phone}</p>
                </div>
                <button
                  type="button"
                  data-menu-trigger
                  onClick={(e) => openMenu(e, ad.id)}
                  aria-label={`Actions for ${ad.name}`}
                  aria-haspopup="menu"
                  className="shrink-0 rounded-full p-2 text-slate-700 transition hover:bg-gray-100"
                >
                  <FiMoreVertical className="h-5 w-5" />
                </button>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={ad.status} />
                <span className="inline-block whitespace-nowrap rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                  {ad.businessType}
                </span>
              </div>

              {/* Details grid */}
              <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                <div>
                  <dt className="text-[11px] text-slate-400">Page Name</dt>
                  <dd className="mt-0.5 text-slate-700">{ad.pageName}</dd>
                </div>
                <div>
                  <dt className="text-[11px] text-slate-400">Price</dt>
                  <dd className="mt-0.5 font-medium text-indigo-600">${ad.price}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-[11px] text-slate-400">Expiry Date</dt>
                  <dd className="mt-0.5 text-slate-700">{formatDate(ad.endDate)}</dd>
                </div>
              </dl>

              {/* Quick action */}
              <button
                type="button"
                onClick={() => setDetailsId(ad.id)}
                className="w-full rounded-md border border-indigo-500 py-2.5 text-xs font-medium text-indigo-600 transition hover:bg-indigo-50"
              >
                See Details
              </button>
            </div>
          ))}

          {rows.length === 0 && (
            <p className="px-4 py-12 text-center text-sm text-gray-400">No ads found.</p>
          )}
        </div>

        {/* ===== Tablet / Desktop: Table (>= md) ===== */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[860px] text-left text-[11px] lg:text-xs 2xl:text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F6F9FD] text-slate-700">
                <th className="px-4 py-3 font-medium 2xl:px-5 2xl:py-4">Name</th>
                <th className="px-4 py-3 font-medium 2xl:px-5 2xl:py-4">Email</th>
                <th className="px-4 py-3 font-medium 2xl:px-5 2xl:py-4">Phone Number</th>
                <th className="px-4 py-3 font-medium 2xl:px-5 2xl:py-4">Business Type</th>
                <th className="px-4 py-3 font-medium 2xl:px-5 2xl:py-4">Page Name</th>
                <th className="px-4 py-3 font-medium 2xl:px-5 2xl:py-4">Price</th>
                <th className="px-4 py-3 font-medium 2xl:px-5 2xl:py-4">Expiry Date</th>
                <th className="px-4 py-3 font-medium 2xl:px-5 2xl:py-4">Status</th>
                <th className="px-4 py-3 text-center font-medium 2xl:px-5 2xl:py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((ad) => (
                <tr
                  key={ad.id}
                  className="border-b border-gray-100 transition last:border-b-0 hover:bg-slate-50/60"
                >
                  <td className="whitespace-nowrap px-4 py-4 2xl:px-5 2xl:py-5">
                    <button
                      type="button"
                      onClick={() => setDetailsId(ad.id)}
                      className="font-medium text-slate-800 hover:text-indigo-600 hover:underline"
                    >
                      {ad.name}
                    </button>
                  </td>
                  <td className="px-4 py-4 text-slate-700 2xl:px-5 2xl:py-5">
                    <span
                      className="block max-w-[130px] truncate lg:max-w-[190px] 2xl:max-w-[280px]"
                      title={ad.email}
                    >
                      {ad.email}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-700 2xl:px-5 2xl:py-5">
                    {ad.phone}
                  </td>
                  <td className="px-4 py-4 text-slate-700 2xl:px-5 2xl:py-5">{ad.businessType}</td>
                  <td className="px-4 py-4 text-slate-700 2xl:px-5 2xl:py-5">{ad.pageName}</td>
                  <td className="px-4 py-4 font-medium text-indigo-600 2xl:px-5 2xl:py-5">
                    ${ad.price}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-700 2xl:px-5 2xl:py-5">
                    {formatDate(ad.endDate)}
                  </td>
                  <td className="px-4 py-4 2xl:px-5 2xl:py-5">
                    <StatusBadge status={ad.status} />
                  </td>
                  <td className="px-4 py-4 text-center 2xl:px-5 2xl:py-5">
                    <button
                      type="button"
                      data-menu-trigger
                      onClick={(e) => openMenu(e, ad.id)}
                      aria-label={`Actions for ${ad.name}`}
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
                  <td colSpan={9} className="py-12 text-center text-gray-400 2xl:py-16 2xl:text-sm">
                    No ads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ===== Footer / pagination ===== */}
        <div className="flex flex-col items-center gap-3 border-t border-gray-100 px-4 py-3.5 sm:flex-row sm:justify-between 2xl:px-5 2xl:py-4">
          <p className="text-center text-xs text-indigo-600 sm:text-left 2xl:text-sm">
            Showing {from} to {to} of {total} results
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

      {/* Row actions dropdown (fixed, so the table's overflow never clips it) */}
      {menu && menuAd && (
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
              setDetailsId(menu.id);
              setMenu(null);
            }}
            className="block w-full px-3 py-2.5 text-left font-medium text-indigo-700 hover:bg-indigo-50"
          >
            See Details
          </button>
          <button
            type="button"
            role="menuitem"
            disabled={menuAd.status === "Published"}
            onClick={() => setStatus(menu.id, "Published")}
            className="block w-full px-3 py-2.5 text-left text-slate-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Mark Published
          </button>
          <button
            type="button"
            role="menuitem"
            disabled={menuAd.status === "Rejected"}
            onClick={() => setStatus(menu.id, "Rejected")}
            className="block w-full px-3 py-2.5 text-left text-slate-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Mark Rejected
          </button>
        </div>
      )}

      {/* Details panel */}
      {detailsAd && <AdDetailsPanel ad={detailsAd} onClose={() => setDetailsId(null)} />}

      {/* Toast */}
      {toast && (
        <div className="fixed inset-x-4 bottom-4 z-[60] flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-xs text-white shadow-lg sm:inset-x-auto sm:bottom-6 sm:left-6 2xl:text-sm">
          <FiCheck className="h-4 w-4 flex-shrink-0 text-green-400" />
          {toast}
        </div>
      )}
    </div>
  );
};

export default AdsManagement;