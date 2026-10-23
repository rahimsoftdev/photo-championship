import { useEffect, useRef, useState } from "react";
import { FaHeart } from "react-icons/fa";
import {
  FiCalendar,
  FiCheck,
  FiClock,
  FiEye,
  FiImage,
  FiLayers,
  FiLoader,
  FiPlus,
  FiRefreshCw,
  FiX,
} from "react-icons/fi";
import { useNavigate } from "react-router";
import ArtworkDropdownMenu from "../userDashbaord/ArtworkDropdownMenu";

/* ---------- helpers ---------- */
const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const formatTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return "";
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
};

const addDays = (iso, days) => {
  const d = new Date(iso);
  if (isNaN(d)) return null;
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

const prettyCategory = (str = "") =>
  str
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const getAlbumLabel = (albumType, count) => {
  if (albumType === "twelve") return `${count} Photos · Full Zodiac Story`;
  if (count > 1) return `${count} Photos`;
  return "1 Photo";
};

/* ---------- small UI parts ---------- */
const ActionButton = ({ color, icon: Icon, label, loadingLabel, loading, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading}
    className={`inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-80 ${color}`}
  >
    {loading ? <FiLoader size={14} className="animate-spin" /> : <Icon size={14} />}
    {loading ? loadingLabel : label}
  </button>
);

const SuccessPanel = ({ heading, text, onUndo }) => (
  <div className="flex min-h-[76px] items-center gap-3 rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] p-3">
    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center">
      <span className="absolute inset-0 animate-ping rounded-full bg-[#059669]/25" />
      <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#059669] text-white shadow">
        <FiCheck size={20} strokeWidth={3} />
      </span>
    </span>

    <div className="min-w-0 flex-1">
      <p className="text-sm font-bold text-[#059669]">{heading}</p>
      <p className="mt-0.5 text-[11px] leading-snug text-[#047857]">{text}</p>
    </div>

    <button
      type="button"
      onClick={onUndo}
      className="shrink-0 rounded-md px-2 py-1 text-[11px] font-semibold text-[#059669] underline-offset-2 hover:underline"
    >
      Undo
    </button>
  </div>
);

/* ---------- main component ---------- */
const DashboardArtworkCard = ({ artWorkData, onDeleteSuccess }) => {
  const [currentArtwork, setCurrentArtwork] = useState(artWorkData);
  const [isDeleted, setIsDeleted] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    title: artWorkData.title || "",
    price: artWorkData.price || 0,
    description: artWorkData.description || "",
  });

  // Selected promotion plan
  const [selectedPlan, setSelectedPlan] = useState(40);

  // Card action state
  const [actionState, setActionState] = useState("idle");
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const {
    type,
    category,
    info = {},
    images = [],
    title,
    description,
    totalReact = 0,
    viewsCount = 0,
    isWinner,
    isPromoted,
    albumType,
    competition = {},
    id,
    price,
  } = currentArtwork;

  const isCompetition = type === "competition";
  const status = competition.status ?? (isWinner ? "ended" : "active");
  const isEnded = isCompetition && status === "ended";
  const isLive = isCompetition && !isEnded;

  const votes = competition.votes ?? totalReact;
  const rank = competition.rank;
  const competitionName = competition.name ?? "Monthly Photography Competition";
  const votingEndsAt = competition.votingEndsAt ?? addDays(info.createdAt, 30);
  const expiryAt = competition.expiryAt ?? addDays(info.createdAt, 60);

  const cover = images[0];
  const extraCount = Math.max(images.length - 1, 0);
  const navigate = useNavigate();

  /* ---------- handlers ---------- */
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleDelete = () => {
    setIsDeleted(true);
    showToast("Artwork deleted successfully!");
    if (onDeleteSuccess) onDeleteSuccess(id);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setCurrentArtwork((prev) => ({ ...prev, ...editForm }));
    setIsEditModalOpen(false);
    showToast("Artwork updated successfully!");
  };

  const handleImageClick = () => {
    navigate(`/user-dashboard/artwork-management/${id}`);
  };

  const handleAction = () => {
    if (actionState !== "idle") return;
    setActionState("loading");
    timerRef.current = setTimeout(() => setActionState("success"), 900);
  };

  const handleUndo = () => {
    clearTimeout(timerRef.current);
    setActionState("idle");
  };

  if (isDeleted) return null;

  const isLoading = actionState === "loading";
  const isSuccess = actionState === "success";

  return (
    <>
      {/* ---------- Success Toast Feedback ---------- */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 rounded-xl bg-gray-900 px-4 py-2.5 text-xs text-white shadow-lg animate-bounce">
          {toastMsg}
        </div>
      )}

      {/* ---------- Main Card UI ---------- */}
      <div className="group/card flex h-full w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 shadow-sm transition-shadow duration-200 hover:shadow-md">
        {/* ---------- Image ---------- */}
        <div
          role="button"
          tabIndex={0}
          onClick={handleImageClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleImageClick();
            }
          }}
          aria-label={`Open ${title}`}
          className="relative aspect-[4/3] w-full shrink-0 cursor-pointer overflow-hidden rounded-xl bg-gray-100 sm:aspect-[3/2]"
        >
          {/* skeleton while loading */}
          {!imgLoaded && !imgError && <div className="absolute inset-0 animate-pulse bg-gray-200" />}

          {/* fallback */}
          {(imgError || !cover) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-gray-400">
              <FiImage size={28} />
              <span className="text-[11px]">Image not available</span>
            </div>
          )}

          {cover && !imgError && (
            <img
              src={cover}
              alt={title}
              loading="lazy"
              decoding="async"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              className={`absolute inset-0 h-full w-full object-cover object-center transition duration-500 group-hover/card:scale-105 ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          {/* gradients */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/45 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/25 to-transparent" />

          {/* top-left album badge */}
          <span className="pointer-events-none absolute left-2.5 top-2.5 inline-flex max-w-[70%] items-center gap-1.5 truncate rounded-md bg-[#9333EA] px-2.5 py-1 text-[11px] font-semibold text-white shadow">
            <FiLayers size={12} className="shrink-0" />
            <span className="truncate">{getAlbumLabel(albumType, images.length)}</span>
          </span>

          {/* top-right 3 dots dropdown */}
          <div
            className="absolute right-2.5 top-2.5 z-10"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <ArtworkDropdownMenu
              artwork={currentArtwork}
              onEdit={() => setIsEditModalOpen(true)}
              onDelete={handleDelete}
              onPromote={() => setIsPromoteModalOpen(true)}
            />
          </div>

          {/* bottom-left promoted */}
          {isPromoted && (
            <span className="pointer-events-none absolute bottom-2.5 left-2.5 rounded-md bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
              Promoted
            </span>
          )}

          {/* bottom-right +N photos */}
          {extraCount > 0 && (
            <span className="pointer-events-none absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 rounded-md bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
              <FiLayers size={12} />+{extraCount} photos
            </span>
          )}
        </div>

        {/* ---------- Body ---------- */}
        <div className="flex flex-1 flex-col px-2 pb-2 pt-3">
          {/* category + date */}
          <div className="flex items-center justify-between gap-2 text-[11px] text-gray-500">
            <span className="truncate font-medium">{prettyCategory(category)}</span>
            <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap">
              <FiCalendar size={12} />
              Uploaded {formatDate(info.createdAt)}
              {isLive && (
                <>
                  <span className="mx-1 text-gray-300">|</span>
                  <FiClock size={12} />
                  {formatTime(info.createdAt)}
                </>
              )}
            </span>
          </div>

          {/* title */}
          <h3 className="mt-2 line-clamp-1 text-[15px] font-bold leading-6 text-gray-900">{title}</h3>

          {/* description */}
          <p className="mt-0.5 line-clamp-2 min-h-[2.5rem] text-xs leading-5 text-gray-500">
            {description}
          </p>

          {/* views + hearts (+ price if available) */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-gray-100 pb-3 text-xs text-gray-600">
            <span className="inline-flex items-center gap-1.5">
              <FiEye size={14} />
              {viewsCount} Views
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FaHeart size={13} className="text-red-500" />
              {totalReact} Heart
            </span>
            {price !== undefined && (
              <span className="font-bold text-gray-900">${Number(price).toFixed(2)}</span>
            )}
            {isLive && (
              <span className="inline-flex items-center gap-1 text-[11px] text-gray-500">
                <FiClock size={12} />
                Expiry {formatDate(expiryAt)}
              </span>
            )}
          </div>

          {/* ---------- Bottom Section ---------- */}
          <div className="mt-auto pt-3">
            {/* 1) Competition - LIVE */}
            {isLive && (
              <div className="rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] p-3">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="line-clamp-1 text-sm font-semibold text-[#059669]">
                    {competitionName}
                  </h4>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#059669] px-2 py-0.5 text-[10px] font-bold text-white">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                    LIVE
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-[#A7F3D0] bg-white py-2 text-center">
                    <p className="text-[11px] text-gray-500">Votes</p>
                    <p className="text-xl font-bold leading-7 text-[#059669]">{votes}</p>
                  </div>
                  <div className="rounded-lg border border-[#A7F3D0] bg-white py-2 text-center">
                    <p className="text-[11px] text-gray-500">Rank</p>
                    <p className="text-xl font-bold leading-7 text-[#1D4ED8]">
                      {rank ? `#${rank}` : "--"}
                    </p>
                  </div>
                </div>

                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#A7F3D0]/60">
                  <div className="h-full w-2/3 rounded-full bg-[#059669]" />
                </div>

                <div className="mt-2 flex items-center justify-between gap-2 text-[11px]">
                  <span className="truncate text-gray-500">
                    Voting ends: {votingEndsAt ? votingEndsAt.slice(0, 10) : "--"}
                  </span>
                  <span className="shrink-0 font-semibold text-[#059669]">Active Entry</span>
                </div>
              </div>
            )}

            {/* 2) Competition - ENDED */}
            {isEnded &&
              (isSuccess ? (
                <SuccessPanel
                  heading="Submitted Again!"
                  text="Your artwork is back in the competition."
                  onUndo={handleUndo}
                />
              ) : (
                <div className="flex min-h-[76px] items-center justify-between gap-3 rounded-xl border border-[#E9D5FF] bg-[#FAF5FF] p-3">
                  <div className="min-w-0">
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md bg-[#F3E8FF] px-2.5 py-1 text-[11px] font-semibold text-[#9333EA]">
                      <FiClock size={12} />
                      Competition Ended
                    </span>
                    <p className="mt-1.5 pl-1 text-[11px] text-[#9333EA]">{votes} votes</p>
                  </div>

                  <ActionButton
                    color="bg-[#9333EA]"
                    icon={FiRefreshCw}
                    label="Submit Again"
                    loadingLabel="Submitting..."
                    loading={isLoading}
                    onClick={handleAction}
                  />
                </div>
              ))}

            {/* 3) Gallery (profile only) */}
            {!isCompetition &&
              (isSuccess ? (
                <SuccessPanel
                  heading="Added to Competition!"
                  text="Your artwork will join this month's contest."
                  onUndo={handleUndo}
                />
              ) : (
                <div className="flex min-h-[76px] items-center justify-between gap-3 rounded-xl bg-gray-100 p-3">
                  <div className="min-w-0">
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-gray-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-600">
                      <FiClock size={12} />
                      Profile Only
                    </span>
                    <p className="mt-1.5 pl-1 text-[10px] text-gray-500">Not in monthly contest</p>
                  </div>

                  <ActionButton
                    color="bg-[#1D4ED8]"
                    icon={FiPlus}
                    label="Add to Competition"
                    loadingLabel="Adding..."
                    loading={isLoading}
                    onClick={handleAction}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* ---------- EDIT MODAL ---------- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <FiX size={20} />
            </button>
            <h3 className="mb-4 text-xl font-bold text-gray-900">Edit Artwork</h3>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">Price ($)</label>
                <input
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">Description</label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-xl bg-gray-100 px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------- SPONSORED PHOTO (PROMOTE) MODAL ---------- */}
      {isPromoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Sponsored Photo</h3>
              <button
                type="button"
                onClick={() => setIsPromoteModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
              >
                <FiX size={16} />
              </button>
            </div>

            <p className="mb-3 text-xs font-semibold text-gray-800">Price</p>

            <div className="mb-6 space-y-3">
              {[
                { price: 40, days: 7 },
                { price: 60, days: 15 },
                { price: 100, days: 30 },
              ].map((plan) => (
                <div
                  key={plan.price}
                  onClick={() => setSelectedPlan(plan.price)}
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition ${
                    selectedPlan === plan.price
                      ? "border-red-500 bg-red-50/40"
                      : "border-gray-200 bg-red-50/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        selectedPlan === plan.price ? "border-red-600" : "border-gray-400"
                      }`}
                    >
                      {selectedPlan === plan.price && (
                        <div className="h-2.5 w-2.5 rounded-full bg-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-base font-bold text-gray-900">${plan.price}</p>
                      <p className="text-xs text-gray-500">For {plan.days} days</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setIsPromoteModalOpen(false);
                showToast("Photo promoted successfully!");
              }}
              className="w-full rounded-xl bg-secondary py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
            >
              Confirm Promotion
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardArtworkCard;