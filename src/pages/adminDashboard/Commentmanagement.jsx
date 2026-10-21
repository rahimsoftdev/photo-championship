import { useEffect, useMemo, useRef, useState } from "react";
import {
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiEye,
  FiEyeOff,
  FiMapPin,
  FiMessageSquare,
  FiMoreVertical,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import { FaThumbtack } from "react-icons/fa";

/* ------------------------------------------------------------------ */
/*  TODO: Add real data                                                */
/*  Replace COMMENTS (and TODAY_COUNT) with data coming from your API. */
/* ------------------------------------------------------------------ */
const img = (seed, w = 640, h = 320) => `https://picsum.photos/seed/${seed}/${w}/${h}`;
const avatar = (n) => `https://i.pravatar.cc/80?img=${n}`;

const TODAY_COUNT = 12; // TODO: Add real data ("+N today" on the Total Comments card)

const COMMENTS = [
  {
    id: 1,
    commentId: "CMT-0001",
    pinned: true,
    user: { name: "Elena Vasquez", country: "Spain", avatar: avatar(47) },
    photo: { title: "Golden Hour Peak", category: "Landscape", image: img("golden-peak") },
    type: "Single",
    comment:
      "Absolutely breathtaking composition! The way the light hits the mountain ridge is pure magic. This deserves to be in a gallery.",
    date: "2025-07-28",
    status: "Approved",
    photographer: {
      name: "Elena Vasquez",
      email: "elena.v@mail.com",
      location: "Spain",
      avatar: avatar(47),
      followers: 1240,
      upvotes: 38,
      visits: 5200,
    },
  },
  {
    id: 2,
    commentId: "CMT-0002",
    pinned: false,
    user: { name: "Marcus Chen", country: "Singapore", avatar: avatar(12) },
    photo: { title: "Urban Solitude", category: "Street", image: img("urban-solitude") },
    type: "8 Album",
    comment: "The reflection in this puddle creates a perfect symmetry. Love the moody tones.",
    date: "2025-07-28",
    status: "Approved",
    photographer: {
      name: "Daniel Reyes",
      email: "daniel.r@mail.com",
      location: "Philippines",
      avatar: avatar(15),
      followers: 860,
      upvotes: 21,
      visits: 3100,
    },
  },
  {
    id: 3,
    commentId: "CMT-0003",
    pinned: false,
    user: { name: "Priya Sharma", country: "India", avatar: avatar(5) },
    photo: { title: "Tiger at Dusk", category: "Wildlife", image: img("tiger-dusk") },
    type: "Zodiac",
    comment: "Buy my preset pack! 50% off today only, click the link in my bio.",
    date: "2025-07-28",
    status: "Deleted",
    photographer: {
      name: "Rohan Mehta",
      email: "rohan.m@mail.com",
      location: "India",
      avatar: avatar(33),
      followers: 2310,
      upvotes: 74,
      visits: 9800,
    },
  },
  {
    id: 4,
    commentId: "CMT-0004",
    pinned: false,
    user: { name: "James Okafor", country: "Nigeria", avatar: avatar(60) },
    photo: { title: "Market Morning", category: "Street", image: img("market-morning") },
    type: "Single",
    comment: "The colors are incredibly vivid. Did you use a polarizing filter?",
    date: "2025-07-27",
    status: "Pending",
    photographer: {
      name: "Amina Bello",
      email: "amina.b@mail.com",
      location: "Nigeria",
      avatar: avatar(25),
      followers: 640,
      upvotes: 15,
      visits: 2200,
    },
  },
  {
    id: 5,
    commentId: "CMT-0005",
    pinned: false,
    user: { name: "Sofia Andersson", country: "Sweden", avatar: avatar(32) },
    photo: { title: "Forest Cathedral", category: "Nature", image: img("forest-cathedral") },
    type: "8 Album",
    comment: "This is stolen from another photographer. I saw the same shot last year.",
    date: "2025-07-27",
    status: "Deleted",
    photographer: {
      name: "Lars Nilsson",
      email: "lars.n@mail.com",
      location: "Sweden",
      avatar: avatar(52),
      followers: 1520,
      upvotes: 49,
      visits: 6400,
    },
  },
  {
    id: 6,
    commentId: "CMT-0006",
    pinned: true,
    user: { name: "Yuki Tanaka", country: "Japan", avatar: avatar(44) },
    photo: { title: "Cherry Blossom Path", category: "Nature", image: img("cherry-path") },
    type: "Zodiac",
    comment: "The depth of field is perfect here. You can almost feel the breeze through the petals.",
    date: "2025-07-27",
    status: "Approved",
    photographer: {
      name: "Haruto Sato",
      email: "haruto.s@mail.com",
      location: "Japan",
      avatar: avatar(68),
      followers: 3480,
      upvotes: 112,
      visits: 14200,
    },
  },
  {
    id: 7,
    commentId: "CMT-0007",
    pinned: false,
    user: { name: "Ahmed Al-Rashid", country: "UAE", avatar: avatar(14) },
    photo: { title: "Sand Dune Abstract", category: "Landscape", image: img("sand-dune") },
    type: "Single",
    comment: "Terrible editing. The sky looks completely fake.",
    date: "2025-07-26",
    status: "Hidden",
    photographer: {
      name: "Omar Haddad",
      email: "omar.h@mail.com",
      location: "UAE",
      avatar: avatar(11),
      followers: 970,
      upvotes: 27,
      visits: 3900,
    },
  },
  {
    id: 8,
    commentId: "CMT-0008",
    pinned: false,
    user: { name: "Isabelle Laurent", country: "France", avatar: avatar(9) },
    photo: { title: "Macro Dewdrop", category: "Macro", image: img("macro-dewdrop") },
    type: "8 Album",
    comment: "The refraction inside the droplet shows incredible detail.",
    date: "2025-07-26",
    status: "Approved",
    photographer: {
      name: "Claire Dubois",
      email: "claire.d@mail.com",
      location: "France",
      avatar: avatar(23),
      followers: 1890,
      upvotes: 63,
      visits: 7300,
    },
  },
  {
    id: 9,
    commentId: "CMT-0009",
    pinned: false,
    user: { name: "Kofi Mensah", country: "Ghana", avatar: avatar(53) },
    photo: { title: "Portrait in Blue", category: "Portrait", image: img("portrait-blue") },
    type: "Single",
    comment: "Beautiful subject and lighting. The color grading is spot on.",
    date: "2025-07-25",
    status: "Pending",
    photographer: {
      name: "Nana Owusu",
      email: "nana.o@mail.com",
      location: "Ghana",
      avatar: avatar(36),
      followers: 720,
      upvotes: 18,
      visits: 2600,
    },
  },
  {
    id: 10,
    commentId: "CMT-0010",
    pinned: false,
    user: { name: "Natalia Petrov", country: "Russia", avatar: avatar(20) },
    photo: { title: "Ice Crystal Study", category: "Macro", image: img("ice-crystal") },
    type: "Zodiac",
    comment: "Follow me back please! I followed you first!",
    date: "2025-07-25",
    status: "Hidden",
    photographer: {
      name: "Ivan Volkov",
      email: "ivan.v@mail.com",
      location: "Russia",
      avatar: avatar(57),
      followers: 540,
      upvotes: 12,
      visits: 1900,
    },
  },
  {
    id: 11,
    commentId: "CMT-0011",
    pinned: false,
    user: { name: "Luca Bianchi", country: "Italy", avatar: avatar(18) },
    photo: { title: "Venice at Dawn", category: "Landscape", image: img("venice-dawn") },
    type: "8 Album",
    comment: "The mist over the canal creates such an atmospheric mood.",
    date: "2025-07-24",
    status: "Approved",
    photographer: {
      name: "Giulia Romano",
      email: "giulia.r@mail.com",
      location: "Italy",
      avatar: avatar(29),
      followers: 2050,
      upvotes: 81,
      visits: 8800,
    },
  },
  {
    id: 12,
    commentId: "CMT-0012",
    pinned: false,
    user: { name: "Amara Diallo", country: "Senegal", avatar: avatar(38) },
    photo: { title: "Baobab Silhouette", category: "Nature", image: img("baobab") },
    type: "Single",
    comment: "This tree is near my village! I recognize it instantly.",
    date: "2025-07-23",
    status: "Approved",
    photographer: {
      name: "Moussa Ndiaye",
      email: "moussa.n@mail.com",
      location: "Senegal",
      avatar: avatar(64),
      followers: 430,
      upvotes: 9,
      visits: 1500,
    },
  },
];

/* ------------------------------- Config ------------------------------- */

const PAGE_SIZE = 12;
const FILTERS = ["All", "Approved", "Pending", "Hidden", "Deleted"];

const STATUS_STYLES = {
  Approved: { badge: "bg-green-50 text-green-700", dot: "bg-green-500" },
  Pending: { badge: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  Hidden: { badge: "bg-gray-100 text-gray-600", dot: "bg-gray-500" },
  Deleted: { badge: "bg-red-50 text-red-600", dot: "bg-red-500" },
};

const TYPE_STYLES = {
  Single: "bg-blue-50 text-blue-600",
  "8 Album": "bg-green-50 text-green-600",
  Zodiac: "bg-purple-50 text-purple-600",
};

const MENU_WIDTH = 150;
const MENU_HEIGHT = 150;

/* --------------------------- Small components --------------------------- */

const StatusBadge = ({ status, size = "sm" }) => {
  const s = STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${s.badge} ${
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-[10px]"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
};

const StatCard = ({ label, value, sub, subClass, Icon, iconBox }) => (
  <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
    <div className="flex items-start justify-between">
      <p className="text-[11px] font-medium text-slate-700">{label}</p>
      <span className={`flex h-6 w-6 items-center justify-center rounded-md ${iconBox}`}>
        <Icon className="h-3 w-3" />
      </span>
    </div>
    <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    <p className={`mt-1 text-[10px] font-medium ${subClass}`}>{sub}</p>
  </div>
);

/* ------------------------------ Detail drawer ------------------------------ */

const CommentDrawer = ({ comment, onClose, onSetStatus }) => {
  const { photographer: p } = comment;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Comment details"
        onClick={(e) => e.stopPropagation()}
        className="h-full w-full max-w-[380px] overflow-y-auto bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-4 pb-3 pt-4">
          <div>
            <h2 className="text-xs font-semibold text-slate-900">Comment Details</h2>
            <p className="mt-0.5 text-[10px] text-gray-400">{comment.commentId}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={comment.status} />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-4 px-4 pb-6">
          {/* Photo */}
          <div className="relative overflow-hidden rounded-lg">
            <img src={comment.photo.image} alt={comment.photo.title} className="h-[110px] w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-2 left-3 text-white">
              <p className="text-[11px] font-semibold">{comment.photo.title}</p>
              <p className="text-[9px] opacity-80">{comment.photo.category}</p>
            </div>
          </div>

          {/* Comment */}
          <div>
            <p className="mb-2 text-[9px] font-semibold uppercase tracking-wider text-gray-400">Comment</p>
            <div className="border-l-2 border-indigo-500 bg-gray-50 px-3 py-3 text-[11px] leading-relaxed text-slate-700">
              {comment.comment}
            </div>
          </div>

          {/* Photographer profile */}
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="mb-3 text-[9px] font-semibold uppercase tracking-wider text-gray-400">
              Photographer Profile
            </p>
            <div className="flex items-center gap-2.5">
              <img src={p.avatar} alt={p.name} className="h-8 w-8 rounded-full object-cover" />
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-slate-900">{p.name}</p>
                <p className="truncate text-[9px] text-gray-400">{p.email}</p>
                <p className="mt-0.5 flex items-center gap-1 text-[9px] text-gray-500">
                  <FiMapPin className="h-2.5 w-2.5 text-red-500" />
                  {p.location}
                </p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                ["Followers", p.followers],
                ["Upvotes", p.upvotes],
                ["Visits", p.visits],
              ].map(([label, value]) => (
                <div key={label} className="rounded-md bg-white py-2 text-center shadow-sm">
                  <p className="text-xs font-bold text-slate-900">{value.toLocaleString()}</p>
                  <p className="text-[9px] text-gray-400">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Admin actions */}
          <div>
            <p className="mb-2 text-[9px] font-semibold uppercase tracking-wider text-gray-400">
              Admin Actions
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={comment.status === "Approved"}
                onClick={() => onSetStatus([comment.id], "Approved")}
                className="flex items-center justify-center gap-1.5 rounded-md bg-green-600 py-2 text-[11px] font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiCheck className="h-3 w-3" />
                Approve
              </button>
              <button
                type="button"
                disabled={comment.status === "Hidden"}
                onClick={() => onSetStatus([comment.id], "Hidden")}
                className="flex items-center justify-center gap-1.5 rounded-md bg-gray-100 py-2 text-[11px] font-medium text-slate-700 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiEyeOff className="h-3 w-3" />
                Hide
              </button>
            </div>
            <button
              type="button"
              disabled={comment.status === "Deleted"}
              onClick={() => onSetStatus([comment.id], "Deleted")}
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md bg-red-600 py-2 text-[11px] font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiTrash2 className="h-3 w-3" />
              {comment.status === "Deleted" ? "Deleted" : "Delete Comment"}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

/* ------------------------------- Main page ------------------------------- */

const CommentManagement = () => {
  const [comments, setComments] = useState(COMMENTS);
  const [activeFilter, setActiveFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [menu, setMenu] = useState(null); // { id, top, left }
  const [drawerId, setDrawerId] = useState(null);
  const [toast, setToast] = useState("");
  const menuRef = useRef(null);

  /* ----- derived data ----- */
  const total = comments.length;
  const approved = comments.filter((c) => c.status === "Approved").length;
  const pending = comments.filter((c) => c.status === "Pending").length;
  const hidden = comments.filter((c) => c.status === "Hidden").length;
  const approvedRate = total ? Math.round((approved / total) * 100) : 0;

  const stats = [
    { label: "Total Comments", value: total, sub: `+${TODAY_COUNT} today`, subClass: "text-blue-600", Icon: FiMessageSquare, iconBox: "bg-slate-100 text-slate-500" },
    { label: "Approved", value: approved, sub: `${approvedRate}% rate`, subClass: "text-green-600", Icon: FiCheck, iconBox: "bg-green-100 text-green-600" },
    { label: "Pending Review", value: pending, sub: "Needs attention", subClass: "text-amber-600", Icon: FiClock, iconBox: "bg-amber-100 text-amber-600" },
    { label: "Hidden", value: hidden, sub: "By moderation", subClass: "text-gray-500", Icon: FiEyeOff, iconBox: "bg-slate-100 text-slate-700" },
  ];

  const filtered = useMemo(
    () => comments.filter((c) => activeFilter === "All" || c.status === activeFilter),
    [comments, activeFilter]
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const allRowsSelected = rows.length > 0 && rows.every((r) => selectedIds.has(r.id));
  const drawerComment = drawerId ? comments.find((c) => c.id === drawerId) : null;
  const menuComment = menu ? comments.find((c) => c.id === menu.id) : null;

  /* ----- actions ----- */
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  };

  const setStatus = (ids, status) => {
    // TODO: call your API here to update the comment status(es)
    setComments((prev) => prev.map((c) => (ids.includes(c.id) ? { ...c, status } : c)));
    setSelectedIds(new Set());
    setMenu(null);
    showToast(`${ids.length} comment${ids.length > 1 ? "s" : ""} marked as ${status}.`);
  };

  const toggleRow = (id) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAllRows = () =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      rows.forEach((r) => (allRowsSelected ? next.delete(r.id) : next.add(r.id)));
      return next;
    });

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

  /* ----- close menu / drawer on outside click, Escape, scroll ----- */
  useEffect(() => {
    const onMouseDown = (e) => {
      if (menuRef.current?.contains(e.target)) return;
      if (e.target.closest("[data-menu-trigger]")) return;
      setMenu(null);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setMenu(null);
        setDrawerId(null);
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

  /* ------------------------------- render ------------------------------- */
  return (
    <div className="min-h-screen bg-[#F8F9FC] p-6 font-sans text-slate-800">
      <h1 className="text-2xl font-bold text-slate-900">Comment Management</h1>
      <p className="mb-5 mt-1.5 text-[11px] text-gray-500">
        Manage, review and moderate all user comments across photos and albums.
      </p>

      {/* Stat cards */}
      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Table card */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* Header + filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-4 py-3.5">
          <h2 className="text-xs font-semibold text-slate-900">
            All Comments <span className="font-normal text-gray-400">({total})</span>
          </h2>
          <div className="flex items-center gap-1.5">
            {FILTERS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setActiveFilter(tab);
                  setPage(1);
                }}
                className={`rounded px-3 py-1 text-[10px] font-medium transition ${
                  activeFilter === tab
                    ? "bg-indigo-600 text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk actions bar */}
        {selectedIds.size > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-b border-indigo-100 bg-indigo-50/60 px-4 py-2 text-[11px]">
            <span className="font-medium text-indigo-700">{selectedIds.size} selected</span>
            <button
              type="button"
              onClick={() => setStatus([...selectedIds], "Approved")}
              className="rounded bg-green-600 px-2.5 py-1 font-medium text-white transition hover:bg-green-700"
            >
              Approve
            </button>
            <button
              type="button"
              onClick={() => setStatus([...selectedIds], "Hidden")}
              className="rounded bg-gray-200 px-2.5 py-1 font-medium text-slate-700 transition hover:bg-gray-300"
            >
              Hide
            </button>
            <button
              type="button"
              onClick={() => setStatus([...selectedIds], "Deleted")}
              className="rounded bg-red-600 px-2.5 py-1 font-medium text-white transition hover:bg-red-700"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              className="ml-auto text-gray-500 hover:text-slate-800"
            >
              Clear
            </button>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-[11px]">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allRowsSelected}
                    onChange={toggleAllRows}
                    aria-label="Select all comments on this page"
                    className="h-3.5 w-3.5 accent-indigo-600"
                  />
                </th>
                <th className="px-3 py-3">Comment ID</th>
                <th className="px-3 py-3">User</th>
                <th className="px-3 py-3">Photo</th>
                <th className="px-3 py-3">Type</th>
                <th className="px-3 py-3">Comment</th>
                <th className="px-3 py-3">Date</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr
                  key={c.id}
                  className={`border-b border-gray-50 last:border-b-0 ${
                    selectedIds.has(c.id) ? "bg-indigo-50/40" : "hover:bg-gray-50/60"
                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(c.id)}
                      onChange={() => toggleRow(c.id)}
                      aria-label={`Select ${c.commentId}`}
                      className="h-3.5 w-3.5 accent-indigo-600"
                    />
                  </td>

                  <td className="whitespace-nowrap px-3 py-3 text-gray-600">
                    <span className="inline-flex items-center gap-1">
                      {c.pinned && <FaThumbtack className="h-2.5 w-2.5 -rotate-45 text-red-500" />}
                      {c.commentId}
                    </span>
                  </td>

                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <img src={c.user.avatar} alt={c.user.name} className="h-6 w-6 rounded-full object-cover" />
                      <div>
                        <p className="whitespace-nowrap text-[11px] font-semibold text-slate-800">{c.user.name}</p>
                        <p className="text-[9px] text-gray-400">{c.user.country}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <img src={c.photo.image} alt={c.photo.title} className="h-7 w-7 rounded object-cover" />
                      <div>
                        <p className="max-w-[110px] truncate text-[11px] font-semibold text-slate-800">
                          {c.photo.title}
                        </p>
                        <p className="text-[9px] text-gray-400">{c.photo.category}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-3">
                    <span
                      className={`whitespace-nowrap rounded px-2 py-0.5 text-[9px] font-medium ${TYPE_STYLES[c.type]}`}
                    >
                      {c.type}
                    </span>
                  </td>

                  <td className="px-3 py-3">
                    <p className="max-w-[200px] truncate text-slate-700">{c.comment}</p>
                  </td>

                  <td className="whitespace-nowrap px-3 py-3 text-gray-400">{c.date}</td>

                  <td className="px-3 py-3">
                    <StatusBadge status={c.status} />
                  </td>

                  <td className="px-3 py-3">
                    <button
                      type="button"
                      data-menu-trigger
                      onClick={(e) => openMenu(e, c.id)}
                      aria-label={`Actions for ${c.commentId}`}
                      aria-haspopup="menu"
                      className="rounded-md border border-gray-200 p-1 text-slate-700 transition hover:bg-gray-100"
                    >
                      <FiMoreVertical className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-400">
                    No comments found in {activeFilter}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / pagination */}
        <div className="flex items-center justify-between px-4 py-3.5">
          <p className="text-[10px] text-gray-400">
            Showing {rows.length} of {filtered.length} comments
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="flex h-6 w-6 items-center justify-center rounded border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:opacity-40"
            >
              <FiChevronLeft className="h-3 w-3" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                className={`h-6 w-6 rounded text-[10px] font-medium transition ${
                  n === currentPage
                    ? "bg-indigo-600 text-white"
                    : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="flex h-6 w-6 items-center justify-center rounded border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:opacity-40"
            >
              <FiChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Row actions dropdown (fixed so the table's overflow never clips it) */}
      {menu && menuComment && (
        <div
          ref={menuRef}
          role="menu"
          style={{ top: menu.top, left: menu.left, width: MENU_WIDTH }}
          className="fixed z-40 overflow-hidden rounded-md border border-gray-200 bg-white py-1 text-[11px] shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setDrawerId(menu.id);
              setMenu(null);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left font-medium text-indigo-700 hover:bg-indigo-50"
          >
            <FiEye className="h-3 w-3" />
            See Details
          </button>
          <button
            type="button"
            role="menuitem"
            disabled={menuComment.status === "Hidden"}
            onClick={() => setStatus([menu.id], "Hidden")}
            className="block w-full px-3 py-2 text-left text-slate-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Hide
          </button>
          <button
            type="button"
            role="menuitem"
            disabled={menuComment.status === "Approved"}
            onClick={() => setStatus([menu.id], "Approved")}
            className="block w-full px-3 py-2 text-left text-slate-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Approve
          </button>
          <button
            type="button"
            role="menuitem"
            disabled={menuComment.status === "Pending"}
            onClick={() => setStatus([menu.id], "Pending")}
            className="block w-full px-3 py-2 text-left text-slate-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Pending
          </button>
        </div>
      )}

      {/* Details drawer */}
      {drawerComment && (
        <CommentDrawer
          comment={drawerComment}
          onClose={() => setDrawerId(null)}
          onSetStatus={setStatus}
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

export default CommentManagement;