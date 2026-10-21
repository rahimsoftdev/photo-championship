import { useEffect, useMemo, useRef, useState } from "react";
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
const MENU_WIDTH = 130;
const MENU_HEIGHT = 110;

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
    className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-medium ${STATUS_STYLES[status]}`}
  >
    {status}
  </span>
);

const DetailItem = ({ label, children }) => (
  <div>
    <p className="text-[9px] text-gray-400">{label}</p>
    <div className="mt-0.5 text-[11px] font-medium text-slate-800">{children}</div>
  </div>
);

const DarkBadge = ({ children }) => (
  <span className="inline-block rounded-full bg-slate-900 px-2 py-0.5 text-[9px] font-medium text-white">
    {children}
  </span>
);

const SummaryRow = ({ label, value }) => (
  <div className="flex items-center justify-between text-[9px]">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-slate-800">{value}</span>
  </div>
);

/* ------------------------------ Details panel ------------------------------ */

const AdDetailsPanel = ({ ad, onClose }) => {
  const totalDays = getTotalDays(ad.startDate, ad.endDate);
  const subtotal = ad.price * totalDays;

  return (
    <div className="fixed inset-0 z-50 bg-black/30" onClick={onClose}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Ad details"
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-3 right-3 top-3 w-[calc(100%-1.5rem)] max-w-[300px] overflow-y-auto rounded-xl bg-white p-4 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Add Ads</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-white transition hover:bg-slate-700"
          >
            <FiX className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          <DetailItem label="Full Name">{ad.name}</DetailItem>
          <DetailItem label="Email">{ad.email}</DetailItem>
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
              className="inline-flex items-center gap-1 font-normal text-blue-600 hover:underline"
            >
              {ad.website}
            </a>
          </DetailItem>

          <div>
            <p className="text-[9px] text-gray-400">Amount</p>
            <p className="mt-0.5 text-xl font-semibold text-slate-900">{money(ad.amount)}</p>
          </div>

          <DetailItem label="Ads Page">
            <span className="font-normal">{ad.pageName}</span>
          </DetailItem>
        </div>

        <div className="relative mt-3 overflow-hidden rounded-lg">
          <img src={ad.image} alt={`${ad.businessName} ad`} className="h-[72px] w-full object-cover" />
          <a
            href={ad.image}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open image in new tab"
            className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded bg-black/50 text-white transition hover:bg-black/70"
          >
            <FiExternalLink className="h-3 w-3" />
          </a>
        </div>

        <div className="mt-4 space-y-2 border-t border-gray-100 pt-3">
          <SummaryRow label="Ads Start Date:" value={formatDate(ad.startDate)} />
          <SummaryRow label="Ads End Date:" value={formatDate(ad.endDate)} />
          <SummaryRow label="Total Days:" value={`${totalDays} Days`} />
          <SummaryRow label="Subtotal:" value={money(subtotal)} />
        </div>
      </aside>
    </div>
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

  const setStatus = (id, status) => {
    // TODO: call your API here to update the ad status
    setAds((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    setMenu(null);
    setToast(`Ad marked as ${status}.`);
    setTimeout(() => setToast(""), 2500);
  };

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

  // close the menu / panel on outside click, Escape, scroll, resize
  useEffect(() => {
    const onMouseDown = (e) => {
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
    <div className="min-h-screen bg-[#F7F9FC] p-6 font-sans text-slate-800">
      <h1 className="text-2xl font-bold text-slate-900">Adds Management</h1>
      <p className="mb-4 mt-1.5 text-[10px] text-gray-600">
        Donor Advertisement Management Dashboard
      </p>

      <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-[10px]">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F6F9FD] text-slate-700">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone Number</th>
                <th className="px-4 py-3 font-medium">Business Type</th>
                <th className="px-4 py-3 font-medium">Page Name</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Expiry Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((ad) => (
                <tr key={ad.id} className="border-b border-gray-100 last:border-b-0">
                  <td className="whitespace-nowrap px-4 py-4 text-slate-800">{ad.name}</td>
                  <td className="max-w-[110px] break-all px-4 py-4 text-slate-700">{ad.email}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-700">{ad.phone}</td>
                  <td className="px-4 py-4 text-slate-700">{ad.businessType}</td>
                  <td className="px-4 py-4 text-slate-700">{ad.pageName}</td>
                  <td className="px-4 py-4 font-medium text-indigo-600">${ad.price}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-700">
                    {formatDate(ad.endDate)}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={ad.status} />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      type="button"
                      data-menu-trigger
                      onClick={(e) => openMenu(e, ad.id)}
                      aria-label={`Actions for ${ad.name}`}
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
                  <td colSpan={9} className="py-12 text-center text-gray-400">
                    No ads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / pagination */}
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3.5">
          <p className="text-[10px] text-indigo-600">
            Showing {from} to {to} of {total} results
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

      {/* Row actions dropdown (fixed, so the table's overflow never clips it) */}
      {menu && menuAd && (
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
          <button
            type="button"
            role="menuitem"
            disabled={menuAd.status === "Published"}
            onClick={() => setStatus(menu.id, "Published")}
            className="block w-full px-3 py-2 text-left text-slate-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Published
          </button>
          <button
            type="button"
            role="menuitem"
            disabled={menuAd.status === "Rejected"}
            onClick={() => setStatus(menu.id, "Rejected")}
            className="block w-full px-3 py-2 text-left text-slate-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Reject
          </button>
        </div>
      )}

      {/* Details panel */}
      {detailsAd && <AdDetailsPanel ad={detailsAd} onClose={() => setDetailsId(null)} />}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-6 z-[60] flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-xs text-white shadow-lg">
          <FiCheck className="h-4 w-4 text-green-400" />
          {toast}
        </div>
      )}
    </div>
  );
};

export default AdsManagement;