import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import {
  FiCheck,
  FiExternalLink,
  FiMail,
  FiMoreVertical,
  FiPhone,
  FiPlus,
  FiUserCheck,
  FiUsers,
  FiUserX,
  FiX,
} from "react-icons/fi";

const ADD_PROFILE_PATH = "/admin-dashboard/demo-profiles/add"; // TODO: match your route

/* ------------------------------------------------------------------ */
/*  TODO: Add real data                                                */
/*  Replace PROFILES with the data coming from your API.               */
/* ------------------------------------------------------------------ */
const cover = (seed) => `https://picsum.photos/seed/${seed}/800/300`;
const avatar = (n) => `https://i.pravatar.cc/120?img=${n}`;

const PROFILES = [
  {
    id: 1,
    name: "Elena Vasquez",
    username: "elenavasquez",
    phone: "+1 555 201 3344",
    email: "elena@photocraft.io",
    status: "Active",
    bio: "Award-winning landscape photographer with a decade of experience capturing the raw beauty of untouched wilderness. Based in the Pacific Northwest.",
    socialLinks: ["https://instagram.com/elenavasquez"],
    avatar: avatar(47),
    cover: cover("elena-cover"),
  },
  {
    id: 2,
    name: "Marcus Chen",
    username: "marcuschen",
    phone: "+1 555 309 7712",
    email: "marcus@lenswork.co",
    status: "Active",
    bio: "Street photographer documenting city life after dark.",
    socialLinks: ["https://instagram.com/marcuschen"],
    avatar: avatar(12),
    cover: cover("marcus-cover"),
  },
  {
    id: 3,
    name: "Amara Osei",
    username: "amaraosei",
    phone: "+1 555 418 9923",
    email: "amara@locustframe.net",
    status: "Active",
    bio: "Portrait and documentary photographer focused on everyday stories.",
    socialLinks: ["https://instagram.com/amaraosei"],
    avatar: avatar(38),
    cover: cover("amara-cover"),
  },
  {
    id: 4,
    name: "Ryan Kowalski",
    username: "ryankowalski",
    phone: "+1 555 527 4481",
    email: "ryan@shutterlux.com",
    status: "Inactive",
    bio: "Sports and action photographer chasing the perfect frame.",
    socialLinks: ["https://instagram.com/ryankowalski"],
    avatar: avatar(15),
    cover: cover("ryan-cover"),
  },
  {
    id: 5,
    name: "Sofia Andreou",
    username: "sofiaandreou",
    phone: "+1 555 634 5566",
    email: "sofia@pixelstory.gr",
    status: "Active",
    bio: "Travel photographer exploring the Mediterranean coast.",
    socialLinks: ["https://instagram.com/sofiaandreou"],
    avatar: avatar(32),
    cover: cover("sofia-cover"),
  },
  {
    id: 6,
    name: "James Okafor",
    username: "jamesokafor",
    phone: "+1 555 742 6677",
    email: "james@capturelight.ng",
    status: "Active",
    bio: "Wildlife photographer with a love for golden-hour light.",
    socialLinks: ["https://instagram.com/jamesokafor"],
    avatar: avatar(60),
    cover: cover("james-cover"),
  },
  {
    id: 7,
    name: "Priya Nair",
    username: "priyanair",
    phone: "+1 555 831 7788",
    email: "priya@goldenhour.in",
    status: "Inactive",
    bio: "Fine-art photographer blending color and texture.",
    socialLinks: ["https://instagram.com/priyanair"],
    avatar: avatar(5),
    cover: cover("priya-cover"),
  },
  {
    id: 8,
    name: "Leo Fontaine",
    username: "leofontaine",
    phone: "+1 555 960 8899",
    email: "leo@opticframe.fr",
    status: "Active",
    bio: "Architecture photographer shooting clean lines and bold shapes.",
    socialLinks: ["https://instagram.com/leofontaine"],
    avatar: avatar(18),
    cover: cover("leo-cover"),
  },
  {
    id: 9,
    name: "Natalia Reyes",
    username: "nataliareyes",
    phone: "+1 555 073 9900",
    email: "natalia@dialitadvisual.mx",
    status: "Active",
    bio: "Food and lifestyle photographer based in Mexico City.",
    socialLinks: ["https://instagram.com/nataliareyes"],
    avatar: avatar(9),
    cover: cover("natalia-cover"),
  },
  {
    id: 10,
    name: "Tom Eriksen",
    username: "tomeriksen",
    phone: "+1 555 182 0011",
    email: "tom@nordlens.no",
    status: "Inactive",
    bio: "Aurora and night-sky photographer from northern Norway.",
    socialLinks: ["https://instagram.com/tomeriksen"],
    avatar: avatar(53),
    cover: cover("tom-cover"),
  },
];

/* ------------------------------- Config ------------------------------- */

const PAGE_SIZE = 10;
const MENU_WIDTH = 160;
const MENU_HEIGHT = 150;
const STATUS_FILTERS = ["All Status", "Active", "Inactive"];

const STATUS_STYLES = {
  Active: { badge: "bg-green-50 text-green-700", dot: "bg-green-500" },
  Inactive: { badge: "bg-gray-100 text-gray-500", dot: "bg-gray-400" },
};

const prettyLink = (url) => url.replace(/^https?:\/\/(www\.)?/, "");

/* --------------------------- Small components --------------------------- */

const StatusBadge = ({ status }) => {
  const s = STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-medium 2xl:text-xs ${s.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
};

const StatCard = ({ value, label, caption, Icon, iconBox }) => (
  <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-4 shadow-sm 2xl:px-5 2xl:py-5">
    <span
      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg 2xl:h-11 2xl:w-11 ${iconBox}`}
    >
      <Icon className="h-5 w-5" />
    </span>
    <div className="min-w-0">
      <p className="text-xl font-bold leading-tight text-slate-900 2xl:text-2xl">{value}</p>
      <p className="text-xs font-semibold text-slate-800 2xl:text-sm">{label}</p>
      <p className="text-[11px] text-gray-400 2xl:text-xs">{caption}</p>
    </div>
  </div>
);

/* ------------------------------ Details modal ------------------------------ */

const ProfileDetailsModal = ({ profile, onClose, onToggleStatus }) => {
  const isActive = profile.status === "Active";

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

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center overscroll-contain bg-black/40 backdrop-blur-md sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Profile details"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92dvh] w-full flex-col overflow-y-auto overscroll-contain rounded-t-2xl bg-white pb-[env(safe-area-inset-bottom)] shadow-2xl sm:max-h-[90dvh] sm:max-w-md sm:rounded-2xl sm:pb-0"
      >
        {/* Mobile bottom-sheet handle */}
        <div className="mx-auto mt-2 h-1 w-10 flex-shrink-0 rounded-full bg-gray-200 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 sm:px-5">
          <h2 className="text-sm font-semibold text-slate-900 2xl:text-base">Profile Details</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>

        {/* Cover + avatar */}
        <div className="relative flex-shrink-0">
          <img src={profile.cover} alt="" className="h-28 w-full object-cover sm:h-32" />
          <img
            src={profile.avatar}
            alt={profile.name}
            className="absolute -bottom-6 left-4 h-14 w-14 rounded-lg border-2 border-white object-cover shadow sm:left-5"
          />
        </div>

        <div className="px-4 pb-4 pt-9 sm:px-5">
          {/* Name + status */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="break-words text-base font-semibold text-slate-900 2xl:text-lg">
                {profile.name}
              </p>
              <p className="text-xs text-gray-400 2xl:text-sm">@{profile.username}</p>
            </div>
            <StatusBadge status={profile.status} />
          </div>

          {/* Contact */}
          <p className="mb-2 mt-5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Contact Information
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2.5">
              <FiPhone className="h-4 w-4 flex-shrink-0 text-gray-400" />
              <div className="min-w-0">
                <p className="text-[11px] text-gray-400">Phone Number</p>
                <p className="text-xs font-medium text-slate-800 2xl:text-sm">{profile.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2.5">
              <FiMail className="h-4 w-4 flex-shrink-0 text-gray-400" />
              <div className="min-w-0">
                <p className="text-[11px] text-gray-400">Email</p>
                <p className="break-all text-xs font-medium text-slate-800 2xl:text-sm">
                  {profile.email}
                </p>
              </div>
            </div>
          </div>

          {/* About */}
          <p className="mb-1.5 mt-5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            About
          </p>
          <p className="text-xs leading-relaxed text-gray-600 2xl:text-sm">
            {profile.bio || "No bio added."}
          </p>

          {/* Social */}
          {profile.socialLinks?.length > 0 && (
            <>
              <p className="mb-1.5 mt-5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Social Media
              </p>
              <div className="space-y-1.5">
                {profile.socialLinks.map((link) => (
                  <a
                    key={link}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 break-all text-xs text-blue-600 hover:underline 2xl:text-sm"
                  >
                    <FiExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                    {prettyLink(link)}
                  </a>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto flex flex-col-reverse gap-2 border-t border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-200 px-4 py-2.5 text-xs font-medium text-slate-700 transition hover:bg-gray-50 sm:py-2 2xl:text-sm"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => onToggleStatus(profile.id, isActive ? "Inactive" : "Active")}
            className={`rounded-md px-4 py-2.5 text-xs font-medium transition sm:py-2 2xl:text-sm ${isActive
                ? "bg-red-50 text-red-600 hover:bg-red-100"
                : "bg-green-50 text-green-700 hover:bg-green-100"
              }`}
          >
            {isActive ? "Deactivate Profile" : "Activate Profile"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

/* ------------------------------- Main page ------------------------------- */

const DemoProfiles = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState(PROFILES);
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [page, setPage] = useState(1);
  const [menu, setMenu] = useState(null); // { id, top, left }
  const [detailsId, setDetailsId] = useState(null);
  const [toast, setToast] = useState("");
  const menuRef = useRef(null);
  const toastTimer = useRef(null);

  /* ----- derived ----- */
  const total = profiles.length;
  const activeCount = profiles.filter((p) => p.status === "Active").length;
  const inactiveCount = total - activeCount;

  const filtered = useMemo(
    () => profiles.filter((p) => statusFilter === "All Status" || p.status === statusFilter),
    [profiles, statusFilter]
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const from = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const to = Math.min(currentPage * PAGE_SIZE, filtered.length);

  const detailsProfile = detailsId ? profiles.find((p) => p.id === detailsId) : null;
  const menuProfile = menu ? profiles.find((p) => p.id === menu.id) : null;

  /* ----- actions ----- */
  const showToast = (message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2500);
  };

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const setStatus = (id, status) => {
    // TODO: call your API here to update the profile status
    setProfiles((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    setMenu(null);
    showToast(`Profile marked as ${status}.`);
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
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-slate-900 lg:text-2xl 2xl:text-3xl">
            Demo Profiles
          </h1>
          <p className="mt-1 text-xs text-gray-500 md:text-sm">
            Create and manage demo profiles for your photography platform.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(ADD_PROFILE_PATH)}
          className="inline-flex w-full flex-shrink-0 items-center justify-center gap-1.5 rounded-md bg-red-600 px-4 py-2.5 text-xs font-medium text-white shadow-sm transition hover:bg-red-700 sm:w-auto sm:py-2 2xl:text-sm"
        >
          <FiPlus className="h-3.5 w-3.5" />
          Add Demo Profile
        </button>
      </div>

      {/* Stat cards */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <StatCard
          value={total}
          label="Total Profiles"
          caption="Demo profiles created"
          Icon={FiUsers}
          iconBox="bg-blue-50 text-blue-600"
        />
        <StatCard
          value={activeCount}
          label="Active Profiles"
          caption="Currently active"
          Icon={FiUserCheck}
          iconBox="bg-green-100 text-green-600"
        />
        <StatCard
          value={inactiveCount}
          label="Inactive Profiles"
          caption="Currently inactive"
          Icon={FiUserX}
          iconBox="bg-gray-100 text-gray-500"
        />
      </div>

      {/* List card */}
      <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm sm:p-4 2xl:p-5">
        <div className="mb-3 flex sm:justify-end">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by status"
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-xs text-slate-700 outline-none focus:border-indigo-400 sm:w-auto sm:py-2 2xl:text-sm"
          >
            {STATUS_FILTERS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-100">
          {/* ===== Mobile: Card layout (< md) ===== */}
          <div className="divide-y divide-gray-100 md:hidden">
            {rows.map((p) => (
              <div key={p.id} className="space-y-3 p-4">
                {/* Top: avatar + name + action */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <img
                      src={p.avatar}
                      alt=""
                      className="h-11 w-11 flex-shrink-0 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">{p.name}</p>
                      <p className="truncate text-xs text-gray-400">@{p.username}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    data-menu-trigger
                    onClick={(e) => openMenu(e, p.id)}
                    aria-label={`Actions for ${p.name}`}
                    aria-haspopup="menu"
                    className="shrink-0 rounded-full p-2 text-slate-700 transition hover:bg-gray-100"
                  >
                    <FiMoreVertical className="h-5 w-5" />
                  </button>
                </div>

                <StatusBadge status={p.status} />

                {/* Contact */}
                <div className="space-y-2 rounded-md bg-[#F6F9FD] px-3 py-2.5 text-xs">
                  <p className="flex items-center gap-2 text-slate-700">
                    <FiPhone className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                    {p.phone}
                  </p>
                  <p className="flex items-center gap-2 break-all text-slate-700">
                    <FiMail className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                    {p.email}
                  </p>
                </div>

                {/* Quick action */}
                <button
                  type="button"
                  onClick={() => setDetailsId(p.id)}
                  className="w-full rounded-md border border-indigo-500 py-2.5 text-xs font-medium text-indigo-600 transition hover:bg-indigo-50"
                >
                  See Details
                </button>
              </div>
            ))}

            {rows.length === 0 && (
              <p className="px-4 py-12 text-center text-sm text-gray-400">No profiles found.</p>
            )}
          </div>

          {/* ===== Tablet / Desktop: Table (>= md) ===== */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[760px] text-left text-[11px] lg:text-xs 2xl:text-sm">
              <thead>
                <tr className="bg-[#F6F9FD] text-[10px] font-semibold uppercase tracking-wide text-gray-500 lg:text-[11px] 2xl:text-xs">
                  <th className="px-4 py-3 2xl:px-5 2xl:py-4">Profile</th>
                  <th className="px-4 py-3 2xl:px-5 2xl:py-4">Username</th>
                  <th className="px-4 py-3 2xl:px-5 2xl:py-4">Phone Number</th>
                  <th className="px-4 py-3 2xl:px-5 2xl:py-4">Email</th>
                  <th className="px-4 py-3 2xl:px-5 2xl:py-4">Status</th>
                  <th className="px-4 py-3 text-center 2xl:px-5 2xl:py-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t border-gray-100 transition hover:bg-slate-50/60"
                  >
                    <td className="whitespace-nowrap px-4 py-3.5 2xl:px-5 2xl:py-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={p.avatar}
                          alt=""
                          className="h-8 w-8 flex-shrink-0 rounded-full object-cover 2xl:h-9 2xl:w-9"
                        />
                        <button
                          type="button"
                          onClick={() => setDetailsId(p.id)}
                          className="font-medium text-slate-800 hover:text-indigo-600 hover:underline"
                        >
                          {p.name}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 2xl:px-5 2xl:py-4">@{p.username}</td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-slate-600 2xl:px-5 2xl:py-4">
                      {p.phone}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 2xl:px-5 2xl:py-4">
                      <span
                        className="block max-w-[160px] truncate lg:max-w-[220px] 2xl:max-w-[320px]"
                        title={p.email}
                      >
                        {p.email}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 2xl:px-5 2xl:py-4">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-4 py-3.5 text-center 2xl:px-5 2xl:py-4">
                      <button
                        type="button"
                        data-menu-trigger
                        onClick={(e) => openMenu(e, p.id)}
                        aria-label={`Actions for ${p.name}`}
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
                    <td
                      colSpan={6}
                      className="py-12 text-center text-gray-400 2xl:py-16 2xl:text-sm"
                    >
                      No profiles found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer / pagination */}
        <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <p className="text-center text-xs text-indigo-600 sm:text-left 2xl:text-sm">
            Showing {from} to {to} of {filtered.length} results.
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
      {menu && menuProfile && (
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
            disabled={menuProfile.status === "Active"}
            onClick={() => setStatus(menu.id, "Active")}
            className="block w-full px-3 py-2.5 text-left text-slate-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Mark Active
          </button>
          <button
            type="button"
            role="menuitem"
            disabled={menuProfile.status === "Inactive"}
            onClick={() => setStatus(menu.id, "Inactive")}
            className="block w-full px-3 py-2.5 text-left text-slate-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Mark Inactive
          </button>
        </div>
      )}

      {/* Details modal */}
      {detailsProfile && (
        <ProfileDetailsModal
          profile={detailsProfile}
          onClose={() => setDetailsId(null)}
          onToggleStatus={setStatus}
        />
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

export default DemoProfiles;