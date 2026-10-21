import { useEffect, useMemo, useRef, useState } from "react";
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

const ADD_PROFILE_PATH = "/adminDashboard/demo-profiles/add"; // TODO: match your route

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
const MENU_WIDTH = 120;
const MENU_HEIGHT = 110;
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
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-medium ${s.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
};

const StatCard = ({ value, label, caption, Icon, iconBox }) => (
  <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-4 shadow-sm">
    <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${iconBox}`}>
      <Icon className="h-4 w-4" />
    </span>
    <div>
      <p className="text-lg font-bold leading-tight text-slate-900">{value}</p>
      <p className="text-[10px] font-semibold text-slate-800">{label}</p>
      <p className="text-[9px] text-gray-400">{caption}</p>
    </div>
  </div>
);

/* ------------------------------ Details modal ------------------------------ */

const ProfileDetailsModal = ({ profile, onClose, onToggleStatus }) => {
  const isActive = profile.status === "Active";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Profile details"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-sm overflow-y-auto rounded-xl bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <h2 className="text-xs font-semibold text-slate-900">Profile Details</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <FiX className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Cover + avatar */}
        <div className="relative">
          <img src={profile.cover} alt="" className="h-28 w-full object-cover" />
          <img
            src={profile.avatar}
            alt={profile.name}
            className="absolute -bottom-5 left-4 h-11 w-11 rounded-lg border-2 border-white object-cover shadow"
          />
        </div>

        <div className="px-4 pb-4 pt-7">
          {/* Name + status */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">{profile.name}</p>
              <p className="text-[10px] text-gray-400">@{profile.username}</p>
            </div>
            <StatusBadge status={profile.status} />
          </div>

          {/* Contact */}
          <p className="mb-2 mt-4 text-[9px] font-semibold uppercase tracking-wider text-gray-400">
            Contact Information
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 rounded-lg bg-gray-50 px-3 py-2">
              <FiPhone className="h-3 w-3 text-gray-400" />
              <div>
                <p className="text-[8px] text-gray-400">Phone Number</p>
                <p className="text-[10px] font-medium text-slate-800">{profile.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-lg bg-gray-50 px-3 py-2">
              <FiMail className="h-3 w-3 text-gray-400" />
              <div>
                <p className="text-[8px] text-gray-400">Email</p>
                <p className="text-[10px] font-medium text-slate-800">{profile.email}</p>
              </div>
            </div>
          </div>

          {/* About */}
          <p className="mb-1.5 mt-4 text-[9px] font-semibold uppercase tracking-wider text-gray-400">
            About
          </p>
          <p className="text-[10px] leading-relaxed text-gray-600">{profile.bio || "No bio added."}</p>

          {/* Social */}
          {profile.socialLinks?.length > 0 && (
            <>
              <p className="mb-1.5 mt-4 text-[9px] font-semibold uppercase tracking-wider text-gray-400">
                Social Media
              </p>
              <div className="space-y-1">
                {profile.socialLinks.map((link) => (
                  <a
                    key={link}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[10px] text-blue-600 hover:underline"
                  >
                    <FiExternalLink className="h-3 w-3" />
                    {prettyLink(link)}
                  </a>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-200 px-4 py-1.5 text-[10px] font-medium text-slate-700 transition hover:bg-gray-50"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => onToggleStatus(profile.id, isActive ? "Inactive" : "Active")}
            className={`rounded-md px-4 py-1.5 text-[10px] font-medium transition ${
              isActive
                ? "bg-red-50 text-red-600 hover:bg-red-100"
                : "bg-green-50 text-green-700 hover:bg-green-100"
            }`}
          >
            {isActive ? "Deactivate Profile" : "Activate Profile"}
          </button>
        </div>
      </div>
    </div>
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
  const setStatus = (id, status) => {
    // TODO: call your API here to update the profile status
    setProfiles((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    setMenu(null);
    setToast(`Profile marked as ${status}.`);
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
      {/* Header */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Demo Profiles</h1>
          <p className="mt-1 text-[10px] text-gray-500">
            Create and manage demo profiles for your photography platform.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(ADD_PROFILE_PATH)}
          className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3.5 py-2 text-[10px] font-medium text-white shadow-sm transition hover:bg-red-700"
        >
          <FiPlus className="h-3 w-3" />
          Add Demo Profile
        </button>
      </div>

      {/* Stat cards */}
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
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

      {/* Table card */}
      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="mb-3 flex justify-end">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by status"
            className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-[10px] text-slate-700 outline-none focus:border-indigo-400"
          >
            {STATUS_FILTERS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="w-full min-w-[800px] text-left text-[10px]">
            <thead>
              <tr className="bg-[#F6F9FD] text-[9px] font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-4 py-3">Profile</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Phone Number</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-t border-gray-100">
                  <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-800">{p.name}</td>
                  <td className="px-4 py-4 text-slate-600">@{p.username}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-600">{p.phone}</td>
                  <td className="px-4 py-4 text-slate-600">{p.email}</td>
                  <td className="px-4 py-4">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      type="button"
                      data-menu-trigger
                      onClick={(e) => openMenu(e, p.id)}
                      aria-label={`Actions for ${p.name}`}
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
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    No profiles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / pagination */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-[10px] text-indigo-600">
            Showing {from} to {to} of {filtered.length} results.
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
      {menu && menuProfile && (
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
            disabled={menuProfile.status === "Active"}
            onClick={() => setStatus(menu.id, "Active")}
            className="block w-full px-3 py-2 text-left text-slate-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Active
          </button>
          <button
            type="button"
            role="menuitem"
            disabled={menuProfile.status === "Inactive"}
            onClick={() => setStatus(menu.id, "Inactive")}
            className="block w-full px-3 py-2 text-left text-slate-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Inactive
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
        <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-xs text-white shadow-lg">
          <FiCheck className="h-4 w-4 text-green-400" />
          {toast}
        </div>
      )}
    </div>
  );
};

export default DemoProfiles;