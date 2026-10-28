import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { FiArrowLeft, FiCheck, FiCopy } from "react-icons/fi";
// import ArtworkImages from "./ArtworkImages";
// import ArtworkGalleryGrid from "./ArtworkGalleryGrid";
// import { ZODIACS, getAlbumById } from "./businessLinkPhotosData";
// import { ZODIACS, getAlbumById } from "./Businesslinkphotosdata.js";
import { ZODIACS, getAlbumById } from "./Businesslinkphotosdata.js";
import ArtworkImages from "../../components/ui/detailsPage/ArtworkImages";
import ArtworkGalleryGrid from "../../components/ui/detailsPage/ArtworkGalleryGrid";

const LIST_PATH = "/user-dashboard/business-link-photos";

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-[10px] text-gray-400">{label}</p>
    <p className="mt-0.5 text-[11px] font-medium text-slate-800">{value}</p>
  </div>
);

const BusinessLinkPhotoDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [copied, setCopied] = useState(false);

  // ?id=<albumId> -> which album to show  (?index=<n> is handled by the gallery components)
  const id = searchParams.get("id");
  const album = getAlbumById(id);

  console.log(album, 'alb')

  if (!album) {
    return (
      <div className="p-6 text-sm text-gray-500">
        Album not found.{" "}
        <Link to={LIST_PATH} className="text-indigo-600 underline">
          Back to list
        </Link>
      </div>
    );
  }

  const businessLink = `https://website.com/business/album-${album.albumId.split("-")[1]}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(businessLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link", businessLink);
    }
  };

  return (
    <div className="">
      <div className="">
        <button
          type="button"
          onClick={() => navigate(LIST_PATH)}
          className="mb-3 inline-flex items-center gap-1.5 text-[11px] text-gray-500 transition hover:text-slate-800"
        >
          <FiArrowLeft className="h-3.5 w-3.5" />
          Back to Business Link Photos
        </button>

        {/* ---------------- User info card ---------------- */}
        <div className="rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-600">
                {getInitials(album.user)}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">{album.user}</p>
                <p className="text-[10px] text-gray-500">{album.email}</p>
              </div>
            </div>
            <span className="rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-[10px] font-medium text-indigo-600">
              Business Link Photos
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 sm:grid-cols-4">
            <InfoItem label="Phone" value={album.phone} />
            <InfoItem label="Country" value={album.country} />
            <InfoItem label="Uploaded" value={album.uploadDate} />
            <InfoItem label="Album ID" value={album.albumId} />
          </div>
        </div>

        {/* ---------------- Main image carousel ---------------- */}
        <ArtworkImages images={album.photos} />

        {/* ---------------- Zodiac grid (curve + icons + thumbnails) ---------------- */}
        <ArtworkGalleryGrid
          images={album.photos}
          zodiacs={ZODIACS.map((z) => z.name)}
        />

        {/* ---------------- Title / tags / description ---------------- */}
        <h2 className="mt-2 text-lg font-bold text-slate-900">{album.title}</h2>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {album.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-indigo-50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-indigo-600"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-gray-600">{album.description}</p>

        {/* ---------------- Generated business link ---------------- */}
        <div className="mt-5 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[11px] font-semibold text-slate-800">Generated Business Link</p>
            <span className="text-[10px] text-gray-400">Auto-generated</span>
          </div>

          <div className="break-all rounded-md border border-gray-100 bg-gray-50 px-3 py-3 font-mono text-[11px] text-slate-700">
            {businessLink}
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="mt-3 inline-flex items-center gap-1.5 rounded bg-indigo-600 px-3 py-1.5 text-[11px] font-medium text-white transition hover:bg-indigo-700"
          >
            {copied ? <FiCheck className="h-3.5 w-3.5" /> : <FiCopy className="h-3.5 w-3.5" />}
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>

        {/* ---------------- Photographer ---------------- */}
        <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-[10px] font-semibold text-white">
              {getInitials(album.photographer)}
            </div>
            <div>
              <p className="text-[9px] text-gray-400">Photographer</p>
              <p className="text-[11px] font-semibold text-slate-900">{album.photographer}</p>
            </div>
          </div>
          <Link
          to={'/admin-dashboard/photographers/user_103'}
            type="button"
            // TODO: navigate to the photographer's profile
            className="rounded-md bg-indigo-600 px-4 py-2 text-[11px] font-medium text-white transition hover:bg-indigo-700"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BusinessLinkPhotoDetails;