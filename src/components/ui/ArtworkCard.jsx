import { useState } from "react";
import { useNavigate } from "react-router";
import {
  FiMoreVertical,
  FiBookmark,
  FiHeart,
  FiEye,
  FiCalendar,
  FiImage,
} from "react-icons/fi";
import ReportPhotoModal from "./ReportPhotoModal";

const SAVED_STORAGE_KEY = "my12photos-saved-artworks";
const LOVED_STORAGE_KEY = "my12photos-loved-artworks";

// Safely read saved artwork IDs from localStorage.
const readStorage = (key) => {
  try {
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

// Create a stable identifier for each artwork.
const getArtworkId = (artwork) =>
  String(
    artwork.id ??
    artwork._id ??
    `${artwork.userId ?? "user"}-${artwork.title ?? "artwork"}-${artwork.images?.[0] ?? ""}`
  );

const ArtworkCard = ({ artWorkData, dashboard, currentUserId, isFavorite }) => {
  const artwork = artWorkData;
  const navigate = useNavigate();

  console.log(artWorkData.userId)

  // Keep the initial state synchronized with localStorage.
  const [savedIds, setSavedIds] = useState(() =>
    readStorage(SAVED_STORAGE_KEY)
  );

  const [lovedIds, setLovedIds] = useState(() =>
    readStorage(LOVED_STORAGE_KEY)
  );

  if (!artwork) return null;

  const artworkId = getArtworkId(artwork);

  const isSaved = savedIds.includes(artworkId);
  const isLoved = lovedIds.includes(artworkId);

  // Support both the sidebar's album type names and JSON album type values.
  const albumType = String(artwork.albumType ?? "").toLowerCase();

  const photoCount =
    albumType === "single-photo" || albumType === "single"
      ? 1
      : albumType === "6-photo-story" ||
        albumType === "six" ||
        albumType === "6"
        ? 6
        : albumType === "12-photos-full-zodiac-story" ||
          albumType === "twelve" ||
          albumType === "12"
          ? 12
          : Array.isArray(artwork.images)
            ? artwork.images.length
            : 1;

  const albumLabel =
    photoCount === 1
      ? "SINGLE PHOTO"
      : photoCount === 6
        ? "6 PHOTOS STORY"
        : "12 Photos-Full Zodiac Story";

  // The first image is used as the card's cover image.
  const coverImage = Array.isArray(artwork.images)
    ? typeof artwork.images[0] === "string"
      ? artwork.images[0]
      : artwork.images[0]?.url ?? artwork.images[0]?.src ?? ""
    : "";

  // Navigate to artwork details.
  const handleCardClick = () => {
    const id = artwork.id ?? artwork._id;
    if (dashboard === 'yes') {
      navigate(`/user-dashboard/sell-photos/${id}`)
      return
    }

    if (!id) return;
    if (artwork.price) {
      navigate(`/bayimagedetails/${id}`)
      return
    }

    navigate(`/artwokrdetails/${id}`);
  };

  // Toggle Save without affecting any other artwork in localStorage.
  const handleSave = (event) => {
    event.stopPropagation();

    const currentIds = readStorage(SAVED_STORAGE_KEY);

    const updatedIds = currentIds.includes(artworkId)
      ? currentIds.filter((id) => id !== artworkId)
      : [...currentIds, artworkId];

    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(updatedIds));
    setSavedIds(updatedIds);
  };

  // Toggle Love independently from Save and other artwork cards.
  const handleLove = (event) => {
    event.stopPropagation();

    const currentIds = readStorage(LOVED_STORAGE_KEY);

    const updatedIds = currentIds.includes(artworkId)
      ? currentIds.filter((id) => id !== artworkId)
      : [...currentIds, artworkId];

    localStorage.setItem(LOVED_STORAGE_KEY, JSON.stringify(updatedIds));
    setLovedIds(updatedIds);
  };

  // TODO: add modal for the three-dot menu.
  const handleMenuClick = (event) => {
    event.stopPropagation();
    // Open the artwork actions modal here in the future.
  };

  // Display numeric values in a readable format.
  const formatCount = (value) =>
    Number(value ?? 0).toLocaleString("en-US");

  // Format artwork date with a readable fallback.
  const formattedDate = artwork.info?.createdAt
    ? new Date(artwork.info.createdAt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    : "Date unavailable";

  return (
    <article
      onKeyDown={(event) => {
        if (
          event.target === event.currentTarget &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault();
          handleCardClick();
        }
      }}
      role="link"
      tabIndex={0}
      aria-label={`View details for ${artwork.title || "artwork"}`}
      className="w-full min-w-0 cursor-pointer overflow-hidden rounded-xl border border-[#E5E7EB] bg-white transition-shadow duration-200 hover:shadow-md"
    >
      {/* Artwork cover and overlaid actions */}
      <div className="relative h-[170px] w-full overflow-hidden bg-gray-100 min-[360px]:h-[190px] sm:h-[205px]">
        {coverImage ? (
          <img
            onClick={handleCardClick}
            src={coverImage}
            alt={artwork.title || "Artwork"}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            <FiImage size={36} />
          </div>
        )}

        {/* Album type badge */}
        <span className="absolute left-2 top-2 max-w-[68%] truncate rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-semibold tracking-wide text-[#4048CD] shadow-sm min-[360px]:max-w-[72%] sm:left-3 sm:top-3 sm:max-w-[75%] sm:px-2.5 sm:py-1 sm:text-[10px]">
          {albumLabel}
        </span>

        {/* Three-dot menu */}
        <div className="absolute right-1.5 top-1.5 z-10 sm:right-2.5 sm:top-2.5">

          {artWorkData.userId !== currentUserId && !isFavorite && (
            <ReportPhotoModal
              photoTitle={artWorkData.title || "this photo"}
            />
          )}

        </div>

        {/* Save button */}
        <button
          type="button"
          onClick={handleSave}
          aria-pressed={isSaved}
          className={`absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition sm:bottom-2.5 sm:left-2.5 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-sm ${isSaved
            ? "bg-secondary text-white"
            : "bg-[#FDE8E9] text-bg-secondary hover:bg-[#FBD5D8]"
            }`}
        >
          <FiBookmark
            className={`h-3.5 w-3.5 sm:h-[17px] sm:w-[17px] ${isSaved ? "fill-current" : ""}`}
          />
          {isSaved ? "Saved" : "Save"}
        </button>

        {/* Additional photo count */}
        {photoCount > 1 && (
          <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-md bg-[rgba(17,24,39,0.8)] px-2 py-1 text-[10px] font-semibold text-white sm:bottom-2.5 sm:right-2.5 sm:gap-1.5 sm:px-2.5 sm:py-1.5 sm:text-xs">
            <FiImage className="h-3 w-3 sm:h-[13px] sm:w-[13px]" />
            +{photoCount - 1}
            <span className="hidden min-[360px]:inline">photos</span>
          </span>
        )}
      </div>

      {/* Artwork information */}
      <div className="p-2.5 sm:p-3">
        {/* Title */}
        <h2 className="truncate text-base font-bold leading-6 text-[#111827] sm:text-lg sm:leading-7 lg:text-xl">
          {artwork.title || "Untitled artwork"}
        </h2>

        {/* Description limited to two lines */}
        <p className="mt-1 line-clamp-2 min-h-8 break-words text-xs leading-4 text-[#374151] sm:min-h-10 sm:text-sm sm:leading-5">
          {artwork.description || artwork.info || "No description available."}
        </p>

        {/* Love, views, and date */}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 text-[11px] text-subTitleText sm:gap-x-3 sm:gap-y-2 sm:text-xs">
          {/* Love button */}
          <button
            type="button"
            onClick={handleLove}
            aria-label={isLoved ? "Remove love" : "Love artwork"}
            aria-pressed={isLoved}
            className="inline-flex shrink-0 items-center gap-1 transition hover:opacity-75"
          >
            <FiHeart
              className={`h-4 w-4 sm:h-[17px] sm:w-[17px] ${isLoved
                  ? "fill-bg-secondary text-bg-secondary"
                  : "text-bg-secondary"
                }`}
            />
            <span>{formatCount(artwork.totalReact)}</span>
          </button>

          {/* View count */}
          <span className="inline-flex shrink-0 items-center gap-1">
            <FiEye className="h-4 w-4 sm:h-[17px] sm:w-[17px]" />
            {formatCount(artwork.viewsCount)}
          </span>

          {/* Upload / creation date */}
          <span className="inline-flex shrink-0 items-center gap-1">
            <FiCalendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            {formattedDate}
          </span>
        </div>

        {artWorkData.price && (
          <span className="my-2 inline-block text-lg font-bold text-primary sm:text-[20px]">
            $ {artWorkData.price}
          </span>
        )}
      </div>
    </article>
  );
};

export default ArtworkCard;
