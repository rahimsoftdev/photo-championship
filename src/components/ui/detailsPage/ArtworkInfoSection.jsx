import React, { useState } from "react";
import { FiDownload, FiHeart, FiShare2 } from "react-icons/fi";
import { Link } from "react-router";

const ArtworkInfoSection = ({ artwork, onVote, hasVoted }) => {
  const [vote, setVote] = useState(false)
  const [copied, setCopied] = useState(false);

  const {
    title,
    description,
    category,
    subCategory,
    images,
    info,
    totalReact,
    viewsCount,
    imageDetails,
  } = artwork || {};
  console.log(artwork?.userId, 'is')

  // Format date nicely if available
  const formattedDate = info?.createdAt
    ? new Date(info.createdAt).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    : "01 June, 2026";

  // Handle Image Download
  const handleDownload = async () => {
    const imageUrl = images?.[0] || "";
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = title ? `${title.replace(/\s+/g, "_")}.jpg` : "artwork.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      // Fallback open in new tab if CORS prevents direct download
      window.open(imageUrl, "_blank");
    }
  };

  // Handle Share / Copy URL
  const handleShare = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="w-full space-y-5 pt-5  ">
      {/* Top Badges / Tags */}
      <div className="flex flex-wrap items-center gap-3">
        {images && images.length > 1 && (
          <span
            className="rounded-full px-2 md:px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary"
            style={{ backgroundColor: "rgba(236, 237, 250, 1)" }}
          >
            {images.length} Photos
          </span>
        )}
        {category && (
          <span
            className="rounded-full px-2 md:px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary"
            style={{ backgroundColor: "rgba(236, 237, 250, 1)" }}
          >
            {category}
          </span>
        )}
        {subCategory && (
          <span
            className="rounded-full px-2 md:px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary"
            style={{ backgroundColor: "rgba(236, 237, 250, 1)" }}
          >
            {subCategory}
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-xl font-bold text-gray-900 md:text-2xl lg:text-4xl">
        {title}
      </h1>

      {/* Description */}
      <p className="text-xs sm:text-sm md:text-lg leading-relaxed text-gray-600">{description}</p>

      {/* Image Details Box with justify-between and responsive layout */}
      <div
        className="rounded-2xl p-6 shadow-sm"
        style={{ backgroundColor: "rgba(236, 237, 250, 0.4)" }}
      >
        <h3 className="mb-4 text-base font-bold text-gray-900">Image Details</h3>

        <div className="flex flex-col justify-between gap-6 text-sm md:flex-row md:items-start">
          {/* Left Column Fields */}
          <div className="space-y-3 flex-1">
            <div className="flex justify-between md:justify-start md:gap-8">
              <span className="text-gray-500">Credit:</span>
              <span className="font-medium text-primary">
                {info?.author || "Unknown"}
              </span>
            </div>
            <div className="flex justify-between md:justify-start md:gap-8">
              <span className="text-gray-500">Creative #:</span>
              <span className="font-medium text-gray-800">
                {imageDetails?.creativeNo || "2278500954"}
              </span>
            </div>
            <div className="flex justify-between md:justify-start md:gap-8">
              <span className="text-gray-500">Resolution:</span>
              <span className="font-medium text-gray-800">
                {imageDetails?.width && imageDetails?.height
                  ? `${imageDetails.width}×${imageDetails.height}`
                  : "1200×800"}
              </span>
            </div>
            <div className="flex justify-between md:justify-start md:gap-8">
              <span className="text-gray-500">Quality:</span>
              <span className="font-medium text-gray-800">
                {imageDetails?.quality || "4K"}
              </span>
            </div>
          </div>

          {/* Right Column Fields */}
          <div className="space-y-3 flex-1">
            <div className="flex justify-between md:justify-start md:gap-8">
              <span className="text-gray-500">File Type:</span>
              <span className="font-medium text-gray-800 uppercase">
                {imageDetails?.format || "JPEG"}
              </span>
            </div>
            <div className="flex justify-between md:justify-start md:gap-8">
              <span className="text-gray-500">File size:</span>
              <span className="font-medium text-gray-800">
                {imageDetails?.size || "125 KB"}
              </span>
            </div>
            <div className="flex justify-between md:justify-start md:gap-8">
              <span className="text-gray-500">Upload date:</span>
              <span className="font-medium text-gray-800">{formattedDate}</span>
            </div>
            <div className="flex justify-between md:justify-start md:gap-8">
              <span className="text-gray-500">Categories:</span>
              <span className="font-medium text-primary">
                {category} {subCategory ? subCategory : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Votes and Views Count Section with border rgba(0, 0, 0, 0.08) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 border-b pb-7 border-gray-200">
        {/* Votes Received */}
        <div
          className="flex flex-col items-center justify-center rounded-2xl py-1 sm:py-2 md:py-3 text-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.08)",
            border: "1px solid rgba(0, 0, 0, 0.08)",
          }}
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Votes Received
          </span>
          <span className="mt-2 text-base md:text-xl font-bold text-gray-900">
            {totalReact || 0}
          </span>
        </div>

        {/* Views Counted */}
        <div
          className="flex flex-col items-center justify-center rounded-2xl py-1 sm:py-2 md:py-3 text-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.08)",
            border: "1px solid rgba(0, 0, 0, 0.08)",
          }}
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Views Counted
          </span>
          <span className="mt-2 text-base md:text-xl font-bold text-gray-900">
            {viewsCount || 0}
          </span>
        </div>
      </div>

      {/* Action Buttons: Vote, Download, Share */}
      <div className="flex flex-wrap items-center gap-3 pt-2 ">
        {/* Vote Button */}
        <button
          onClick={() => setVote(!vote)}
          className={`flex items-center gap-2 rounded-full px-5 py-1.5 md:py-2.5 text-xs font-semibold transition-opacity hover:opacity-90 shadow-sm  max-sm:w-full ${vote ? "bg-secondary text-white " : " text-secondary border border-secondary "}  `}
        >
          <FiHeart className="text-lg" />
          {vote ? "Voted" : "Cast Your Vote"}
        </button>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 rounded-full px-5 py-1.5 md:py-2.5 text-sm font-semibold text-white bg-primary transition-opacity hover:opacity-90 shadow-sm max-sm:w-full"
        >
          <FiDownload className="text-lg" />
          Download Photo
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="relative flex items-center gap-2 rounded-full px-5 py-1.5 md:py-2.5 text-sm font-semibold text-gray-800 transition-opacity hover:opacity-90 shadow-sm max-sm:w-full"
          style={{ backgroundColor: "rgba(253, 232, 233, 1)" }}
        >
          <FiShare2 className="text-lg" />
          {copied ? "Copied Link!" : "Share"}
        </button>
      </div>

      {/* Photographer Profile Section (As shown in screenshot) */}
      <div className="flex  items-start sm:items-center justify-between   gap-4">
        <div className="flex items-center gap-4">
          <img
            src={
              info?.authorAvatar ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            }
            alt={info?.author || "Photographer"}
            className="h-6 w-6 sm:w-12 sm:h-12 rounded-full object-cover shadow-sm"
          />
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              Photographer
            </span>
            <h4 className="text-base font-bold text-gray-900">
              {info?.author || "Wong Kar-Wai"}
            </h4>
          </div>
        </div>
        <Link
          to={`/photographers/${artwork?.userId}`}
          className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-1.5 md:py-2.5 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
        >
          View Profile
        </Link>


      </div>
    </div>
  );
};

export default ArtworkInfoSection;