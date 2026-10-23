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

const ArtworkCard = ({ artWorkData,dashboard }) => {
  const artwork = artWorkData;
  const navigate = useNavigate();

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
    if(dashboard === 'yes'){
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
  const formattedDate = artwork.date
    ? new Date(artwork.date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    : artwork.createdAt
      ? new Date(artwork.createdAt).toLocaleDateString("en-US", {
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
      <div className="relative h-[205px] w-full overflow-hidden bg-gray-100">
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
        <span className="absolute left-3 top-3 max-w-[75%] truncate rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-[#4048CD] shadow-sm">
          {albumLabel}
        </span>

        {/* Three-dot menu */}
        <div className="absolute right-2.5 top-2.5 z-10">
          <ReportPhotoModal photoTitle={artwork.title || "this photo"} />
        </div>

        {/* Save button */}
        <button
          type="button"
          onClick={handleSave}
          aria-pressed={isSaved}
          className={`absolute bottom-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${isSaved
            ? "bg-secondary text-white"
            : "bg-[#FDE8E9] text-bg-secondary hover:bg-[#FBD5D8]"
            }`}
        >
          <FiBookmark
            size={17}
            className={isSaved ? "fill-current" : ""}
          />
          {isSaved ? "Saved" : "Save"}
        </button>

        {/* Additional photo count */}
        {photoCount > 1 && (
          <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 rounded-md bg-[rgba(17,24,39,0.8)] px-2.5 py-1.5 text-xs font-semibold text-white">
            <FiImage size={13} />
            +{photoCount - 1} photos
          </span>
        )}
      </div>

      {/* Artwork information */}
      <div className="p-3">
        {/* Title */}
        <h2 className="truncate text-xl font-bold leading-7 text-[#111827]">
          {artwork.title || "Untitled artwork"}
        </h2>

        {/* Description limited to two lines */}
        <p className="mt-1 line-clamp-2 min-h-10 text-sm leading-5 text-[#374151]">
          {artwork.description || artwork.info || "No description available."}
        </p>

        {/* Love, views, and date */}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-xs text-subTitleText">
          {/* Love button */}
          <button
            type="button"
            onClick={handleLove}
            aria-label={isLoved ? "Remove love" : "Love artwork"}
            aria-pressed={isLoved}
            className="inline-flex shrink-0 items-center gap-1 transition hover:opacity-75"
          >
            <FiHeart
              size={17}
              className={
                isLoved
                  ? "fill-bg-secondary text-bg-secondary"
                  : "text-bg-secondary"
              }
            />
            <span>{formatCount(artwork.totalReact)}</span>
          </button>

          {/* View count */}
          <span className="inline-flex shrink-0 items-center gap-1">
            <FiEye size={17} />
            {formatCount(artwork.viewsCount)}
          </span>

          {/* Upload / creation date */}
          <span className="inline-flex items-center gap-1">
            <FiCalendar size={16} />
            {formattedDate}
          </span>
        </div>

        {
          artWorkData.price && <span className="text-[20px] text-primary font-bold my-2 inline-block">$ {artWorkData.price}</span>
        }

      </div>
    </article>
  );
};

export default ArtworkCard;
