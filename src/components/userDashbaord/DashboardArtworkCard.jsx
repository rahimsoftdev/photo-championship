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
} from "react-icons/fi";
import { useNavigate } from "react-router";
// import ArtworkDropdownMenu from "./ArtworkDropdownMenu";
// import EditArtworkModal from "./EditArtworkModal";
// import PromoteModal from "./PromoteModal";
// import DeleteConfirmModal from "./DeleteConfirmModal";
import ArtworkDropdownMenu from "./ArtworkDropdownMenu";
import DeleteConfirmModal from "./DeleteConfirmModal";
import EditArtworkModal from "./EditArtworkModal";
import PromoteModal from "./PromoteModal";

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
    className={`inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-80 max-[380px]:w-full ${color}`}
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
      <p className="mt-0.5 break-words text-[11px] leading-snug text-[#047857]">{text}</p>
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

  // Modals state (3ta alada modal)
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPromoteOpen, setIsPromoteOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

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
  // Edit modal Save korle card er data update hobe
  const handleEditSave = (values) => {
    setCurrentArtwork((prev) => ({ ...prev, ...values }));
  };

  // Promote confirm korle card e "Promoted" badge dekhabe
  const handlePromoted = () => {
    setCurrentArtwork((prev) => ({ ...prev, isPromoted: true }));
  };

  // Delete success feedback dekhanor por card remove hobe
  const handleDeleted = () => {
    setIsDeleteOpen(false);
    setIsDeleted(true);
    if (onDeleteSuccess) onDeleteSuccess(id);
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
      {/* ---------- Main Card UI ---------- */}
      <div className="group/card flex h-full w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 shadow-sm transition-shadow duration-200 hover:shadow-md">
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
              className={`absolute inset-0 h-full w-full object-cover object-center transition duration-500 group-hover/card:scale-105 ${imgLoaded ? "opacity-100" : "opacity-0"
                }`}
            />
          )}

          {/* gradients */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/45 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/25 to-transparent" />

          {/* top-left album badge (3 dots button er jonno jayga rakha hoyeche) */}
          <span className="pointer-events-none absolute left-2 top-2 inline-flex max-w-[calc(100%-3.5rem)] items-center gap-1.5 rounded-md bg-[#9333EA] px-2 py-1 text-[10px] font-semibold text-white shadow sm:left-2.5 sm:top-2.5 sm:px-2.5 sm:text-[11px]">
            <FiLayers size={12} className="shrink-0" />
            <span className="truncate">{getAlbumLabel(albumType, images.length)}</span>
          </span>

          {/* top-right 3 dots dropdown */}
          <div
            className="absolute right-2 top-2 z-10 sm:right-2.5 sm:top-2.5"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <ArtworkDropdownMenu
              onEdit={() => setIsEditOpen(true)}
              onPromote={() => setIsPromoteOpen(true)}
              onDelete={() => setIsDeleteOpen(true)}
            />
          </div>

          {/* bottom-left promoted */}
          {isPromoted && (
            <span className="pointer-events-none absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm sm:bottom-2.5 sm:left-2.5 sm:px-2.5 sm:text-[11px]">
              Promoted
            </span>
          )}

          {/* bottom-right +N photos */}
          {extraCount > 0 && (
            <span className="pointer-events-none absolute bottom-2 right-2 inline-flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm sm:bottom-2.5 sm:right-2.5 sm:px-2.5 sm:text-[11px]">
              <FiLayers size={12} />+{extraCount} photos
            </span>
          )}
        </div>

        {/* ---------- Body ---------- */}
        <div className="flex min-w-0 flex-1 flex-col px-1.5 pb-2 pt-3 sm:px-2">
          {/* category + date (choto screen e wrap hobe) */}
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[11px] text-gray-500">
            <span className="max-w-full truncate font-medium">{prettyCategory(category)}</span>
            <span className="inline-flex flex-wrap items-center gap-x-1 gap-y-0.5">
              <FiCalendar size={12} className="shrink-0" />
              <span>Uploaded {formatDate(info.createdAt)}</span>
              {isLive && (
                <>
                  <span className="mx-1 text-gray-300">|</span>
                  <FiClock size={12} className="shrink-0" />
                  <span>{formatTime(info.createdAt)}</span>
                </>
              )}
            </span>
          </div>

          {/* title */}
          <h3 className="mt-2 line-clamp-1 break-words text-sm font-bold leading-6 text-gray-900 sm:text-[15px]">
            {title}
          </h3>

          {/* description */}
          <p className="mt-0.5 line-clamp-2 min-h-[2.5rem] break-words text-xs leading-5 text-gray-500">
            {description}
          </p>

          {/* views + hearts (+ price if available) */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 border-b border-gray-100 pb-3 text-xs text-gray-600">
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
              <div className="rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] p-2.5 sm:p-3">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="line-clamp-1 min-w-0 text-sm font-semibold text-[#059669]">
                    {competitionName}
                  </h4>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#059669] px-2 py-0.5 text-[10px] font-bold text-white">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                    LIVE
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="rounded-lg border border-[#A7F3D0] bg-white py-2 text-center">
                    <p className="text-[11px] text-gray-500">Votes</p>
                    <p className="text-lg font-bold leading-7 text-[#059669] sm:text-xl">{votes}</p>
                  </div>
                  <div className="rounded-lg border border-[#A7F3D0] bg-white py-2 text-center">
                    <p className="text-[11px] text-gray-500">Rank</p>
                    <p className="text-lg font-bold leading-7 text-[#1D4ED8] sm:text-xl">
                      {rank ? `#${rank}` : "--"}
                    </p>
                  </div>
                </div>

                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#A7F3D0]/60">
                  <div className="h-full w-2/3 rounded-full bg-[#059669]" />
                </div>

                <div className="mt-2 flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5 text-[11px]">
                  <span className="text-gray-500">
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
                <div className="flex min-h-[76px] flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E9D5FF] bg-[#FAF5FF] p-3">
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
                <div className="flex min-h-[76px] flex-wrap items-center justify-between gap-3 rounded-xl bg-gray-100 p-3">
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

      {/* ---------- Modals (card er siblings) ---------- */}
      <EditArtworkModal
        open={isEditOpen}
        artwork={currentArtwork}
        onClose={() => setIsEditOpen(false)}
        onSave={handleEditSave}
      />

      <PromoteModal
        open={isPromoteOpen}
        onClose={() => setIsPromoteOpen(false)}
        onPromoted={handlePromoted}
      />

      <DeleteConfirmModal
        open={isDeleteOpen}
        artworkTitle={title}
        onCancel={() => setIsDeleteOpen(false)}
        onDeleted={handleDeleted}
      />
    </>
  );
};

export default DashboardArtworkCard;