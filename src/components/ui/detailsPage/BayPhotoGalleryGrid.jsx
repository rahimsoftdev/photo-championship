import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { FaHeart, FaShareAlt, FaShoppingCart, FaDownload } from 'react-icons/fa';

// Dashboard layout-e album type-er sundor nam
const ALBUM_LABELS = {
    single: 'Single Photo',
    'single-photo': 'Single Photo',
    six: '6 Photo Story',
    '6-photo-story': '6 Photo Story',
    twelve: '12 Photos Full Zodiac Story',
    '12-photos-full-zodiac-story': '12 Photos Full Zodiac Story',
};

// user-dashboard ba admin dashboard route hole true
const DASHBOARD_PATH = /^\/(user-dashboard|admin-dashboard|admin)(\/|$)/;

// shudhu user-dashboard route hole true (ekhane Photographer row dekhabe na)
const USER_DASHBOARD_PATH = /^\/user-dashboard(\/|$)/;

const formatDate = (value) => {
    if (!value) return '01 June, 2026';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '01 June, 2026';
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
};

// dashboard prop ("yes" / true) diye force kora jay, na dile route theke auto detect hoy
const BayPhotoGalleryGrid = ({ images, zodiacs, bayPhoto, dashboard }) => {
    // Correct: useNavigate hook-ti component er top level e call kora holo
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const isDashboard =
        dashboard === 'yes' || dashboard === true || DASHBOARD_PATH.test(pathname);

    // User dashboard hole Photographer row (avatar, nam, View Profile) dekhabe na (admin dashboard-e dekhabe)
    const isUserDashboard = USER_DASHBOARD_PATH.test(pathname);

    // State for interactive features
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(bayPhoto?.totalReact || 2150);
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);

    // Download er image link. Nijer link boshaite chaile fallback ta change koro.
    const imageUrl =
        bayPhoto?.images?.[0] || "https://picsum.photos/seed/mountain-art-01/1200/800";

    // Handle Like Toggle
    const handleLikeToggle = () => {
        if (isLiked) {
            setIsLiked(false);
            setLikesCount(prev => prev - 1);
        } else {
            setIsLiked(true);
            setLikesCount(prev => prev + 1);
        }
    };

    // Handle Share (Copy Full URL)
    const handleShare = () => {
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl).then(() => {
            setCopied(true);
            // alert("Link copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    // Handle Download: image ta blob hishebe niye browser e save kore
    const handleDownload = async () => {
        if (downloading) return;
        setDownloading(true);

        try {
            const res = await fetch(imageUrl);
            if (!res.ok) throw new Error('Download failed');

            const blob = await res.blob();
            const ext = blob.type.split('/')[1] || 'jpg';
            const blobUrl = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = `${bayPhoto?.title || 'photo'}.${ext}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(blobUrl);
        } catch (err) {
            console.error('Download failed: ', err);
            // CORS block korle image new tab e khule jabe
            window.open(imageUrl, '_blank', 'noopener,noreferrer');
        } finally {
            setDownloading(false);
        }
    };

    // Handle Buy Photo Button Click
    const handleBuyPhoto = () => {
        const queryParams = new URLSearchParams({
            title: bayPhoto?.title || "Golden Sunrise Over the Mountains",
            author: bayPhoto?.info?.author || "Emma Wilson",
            price: "25.00",
            image: bayPhoto?.images?.[0] || "https://picsum.photos/seed/mountain-art-01/1200/800"
        }).toString();

        // Ekhon navigate function safely kaj korbe
        navigate(`/bayimagedetails/checkout?${queryParams}`);
    };

    /* =====================================================
       DASHBOARD LAYOUT (user-dashboard / admin dashboard)
       ===================================================== */
    if (isDashboard) {
        const albumKey = String(bayPhoto?.albumType ?? '').trim().toLowerCase();
        const albumLabel = ALBUM_LABELS[albumKey] || bayPhoto?.albumType;

        const detailRows = [
            {
                label: 'Credit:',
                value: bayPhoto?.info?.author || 'Wong kar-wai',
                valueClass: 'text-primary',
            },
            { label: 'Creative #:', value: bayPhoto?.creativeNo || '2278500954' },
            {
                label: 'Resolution:',
                value: `${bayPhoto?.imageDetails?.width || 1200}×${bayPhoto?.imageDetails?.height || 800}`,
            },
            {
                label: 'Format',
                value: bayPhoto?.imageDetails?.format || 'JPEG',
                valueClass: 'uppercase',
            },
            { label: 'Quality:', value: '4K' },
            { label: 'File size:', value: bayPhoto?.imageDetails?.size || '125 KB' },
            { label: 'Upload date:', value: formatDate(bayPhoto?.info?.createdAt) },
            {
                label: 'Categories:',
                value: [bayPhoto?.category, bayPhoto?.subCategory].filter(Boolean).join(' / ') || 'Stock Photos',
                valueClass: 'capitalize',
            },
        ];

        const stats = [
            { label: 'Likes Received', value: likesCount || 0 },
            { label: 'Views Counted', value: bayPhoto?.viewsCount || 0 },
            { label: 'Total Sell', value: bayPhoto?.totalSell ?? 0 },
        ];

        return (
            <div className="w-full my-4 sm:my-6 space-y-4 sm:space-y-6">
                {/* Top Badges / Tags */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {albumLabel && (
                        <span
                            className="rounded-full px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-primary"
                            style={{ backgroundColor: "rgba(236, 237, 250, 1)" }}
                        >
                            {albumLabel}
                        </span>
                    )}
                    {bayPhoto?.category && (
                        <span
                            className="rounded-full px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-primary"
                            style={{ backgroundColor: "rgba(236, 237, 250, 1)" }}
                        >
                            {bayPhoto.category}
                        </span>
                    )}
                </div>

                {/* Title/Price card + Image Details card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-start">
                    {/* Title & Price */}
                    <div className="md:col-span-2 min-w-0 bg-white border border-[#C6C6CD] rounded-2xl p-4 sm:p-6 shadow-sm">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#111827] leading-snug break-words">
                            {bayPhoto?.title || "Chasing the Neon Stream"}
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-600 mt-2 pb-3 sm:pb-4 border-b border-[#C6C6CD] break-words">
                            {bayPhoto?.description || "High-Resolution Digital Download"}
                        </p>
                        <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#111827] mt-3 sm:mt-4">
                            $25.00
                        </div>
                    </div>

                    {/* Image Details */}
                    <div className="md:col-span-1 min-w-0 bg-white border border-[#C6C6CD] rounded-2xl p-4 sm:p-5 shadow-sm">
                        <h3 className="text-base sm:text-lg font-semibold text-[#111827] mb-3 sm:mb-4">
                            Image Details
                        </h3>
                        <div className="space-y-2 sm:space-y-2.5 text-xs sm:text-[13px]">
                            {detailRows.map(({ label, value, valueClass = '' }) => (
                                <div key={label} className="flex items-start justify-between gap-3">
                                    <span className="shrink-0 text-gray-700">{label}</span>
                                    <span className={`min-w-0 text-right break-words text-[#111827] ${valueClass}`}>
                                        {value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 min-[480px]:grid-cols-3 gap-3 sm:gap-4">
                    {stats.map(({ label, value }) => (
                        <div
                            key={label}
                            className="flex flex-col items-center justify-center rounded-xl py-3 sm:py-4 text-center"
                            style={{
                                backgroundColor: "rgba(0, 0, 0, 0.04)",
                                border: "1px solid rgba(0, 0, 0, 0.08)",
                            }}
                        >
                            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-gray-500">
                                {label}
                            </span>
                            <span className="mt-1.5 text-base sm:text-lg font-bold text-gray-900">
                                {value}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Photographer row (user dashboard-e avatar, nam, View Profile kichui dekhabe na) */}
                {!isUserDashboard && (
                    <div className="flex items-center justify-between gap-3 border-t border-gray-200 pt-4 sm:pt-5">
                        <div className="flex items-center gap-3 min-w-0">
                            <img
                                src={bayPhoto?.info?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                                alt={bayPhoto?.info?.author || "Photographer"}
                                className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full object-cover border border-[#C6C6CD]"
                            />
                            <div className="min-w-0">
                                <p className="text-[11px] sm:text-xs text-gray-500">Photographer</p>
                                <h4 className="text-sm sm:text-base font-bold text-[#111827] truncate">
                                    {bayPhoto?.info?.author || "Wong Kar-Wai"}
                                </h4>
                            </div>
                        </div>

                        <Link
                            to={`/photographers/${bayPhoto?.userId}`}
                            className="shrink-0 inline-flex items-center justify-center rounded-full bg-primary px-4 sm:px-6 py-2 sm:py-2.5 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90 whitespace-nowrap"
                        >
                            View Profile
                        </Link>
                    </div>
                )}
            </div>
        );
    }

    /* =====================================================
       PUBLIC LAYOUT (ager moto-i)
       ===================================================== */
    return (
        <div className="w-full my-6 space-y-6">

            {/* Top Badges / Tags */}
            <div className="flex flex-wrap items-center gap-3">



                {bayPhoto?.category && (
                    <span
                        className="rounded-full px-2 md:px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary"
                        style={{ backgroundColor: "rgba(236, 237, 250, 1)" }}
                    >
                        {bayPhoto?.category}
                    </span>
                )}
                {bayPhoto?.albumType && (
                    <span
                        className="rounded-full px-2 md:px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary"
                        style={{ backgroundColor: "rgba(236, 237, 250, 1)" }}
                    >
                        {bayPhoto?.albumType}
                    </span>
                )}

            </div>

            {/* Main 3 Columns Grid Section matching the design */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* 1st Column: Title & Price Card */}
                <div className="bg-white border border-[#C6C6CD] rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                    <div>
                        <h1 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold text-[#111827] mb-2 leading-snug">
                            {bayPhoto?.title || "Chasing the Neon Stream"}
                        </h1>
                        <p className="text-sm text-gray-500 mb-6">
                            {bayPhoto?.description || "High-Resolution Digital Download"}
                        </p>
                    </div>
                    <div>
                        <div className="text-lg md:text-2xl lg:text-3xl font-bold text-[#111827] mb-4">
                            $25.00
                        </div>
                        <button
                            onClick={handleBuyPhoto}
                            className="w-full bg-secondary text-white py-1.5 md:py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-md cursor-pointer"
                        >
                            <FaShoppingCart /> Buy Photo
                        </button>
                    </div>
                </div>

                {/* 2nd Column: Creator Card */}
                <div className="bg-white border border-[#C6C6CD] rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                    <div>
                        <h3 className="text-lg font-semibold text-[#111827] pb-3 border-b border-[#C6C6CD] mb-6">
                            Creator
                        </h3>
                        <div className="flex items-center gap-4 mb-6">
                            <img
                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                                alt="Creator"
                                className="w-6 h-6  md:w-12 md:h-12 rounded-full object-cover border border-[#C6C6CD]"
                            />
                            <div>
                                <h4 className="font-bold text-[#111827]">
                                    {bayPhoto?.info?.author || "Emma Wilson"}
                                </h4>
                                <p className="text-xs text-gray-500">Professional Landscape Photographer</p>
                            </div>
                        </div>
                    </div>
                    <Link
                        to={`/photographers/${bayPhoto?.userId}`}
                        className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-1.5 md:py-2.5 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
                    >
                        View Profile
                    </Link>
                </div>

                {/* 3rd Column: Image Details */}
                <div className="bg-white border border-[#C6C6CD] rounded-2xl p-6 shadow-sm md:col-span-2 lg:col-span-1">
                    <h3 className="text-lg font-semibold text-[#111827] pb-3 border-b border-[#C6C6CD] mb-4">
                        Image Details
                    </h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Credit:</span>
                            <span className="text-primary font-medium">{bayPhoto?.info?.author || "Wong kar-wai"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Creative #:</span>
                            <span className="text-[#111827] font-medium">2278500954</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Resolution:</span>
                            <span className="text-[#111827] font-medium">
                                {bayPhoto?.imageDetails?.width || 1200}×{bayPhoto?.imageDetails?.height || 800}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Quality:</span>
                            <span className="text-primary font-medium">4K</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">File Type:</span>
                            <span className="text-[#111827] font-medium uppercase">{bayPhoto?.imageDetails?.format || "JPEG"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">File size:</span>
                            <span className="text-[#111827] font-medium">{bayPhoto?.imageDetails?.size || "125 KB"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Upload date:</span>
                            <span className="text-[#111827] font-medium">01 June, 2026</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Categories:</span>
                            <span className="text-[#111827] font-medium capitalize">{bayPhoto?.category || "Stock Photos"}</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Stats Row Cards */}
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
                        TOTAL REACT
                    </span>
                    <span className="mt-2 text-base md:text-xl font-bold text-gray-900">
                        {likesCount || 0}
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
                        {bayPhoto?.viewsCount || 0}
                    </span>
                </div>
            </div>



            {/* Action Buttons: Like, Download & Share */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
                {/* Like Button with Toggle Background */}
                <button
                    onClick={handleLikeToggle}
                    className={`flex items-center justify-center gap-2 rounded-full px-5 py-1.5 md:py-2.5 text-xs font-semibold transition-opacity hover:opacity-90 shadow-sm max-sm:w-full ${isLiked
                        ? 'bg-secondary text-white'
                        : 'bg-[#FDE8E9] text-secondary border border-secondary/30 hover:bg-secondary/10'
                        }`}
                >
                    <FaHeart className={isLiked ? 'text-white' : 'text-secondary'} />
                    <span>Like</span>
                </button>

                {/* Download Button */}
                <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="flex items-center justify-center gap-2 rounded-full px-5 py-1.5 md:py-2.5 text-xs font-semibold transition-opacity hover:opacity-90 shadow-sm max-sm:w-full disabled:cursor-not-allowed disabled:opacity-60 bg-primary text-white"
                >
                    <FaDownload />
                    <span>{downloading ? 'Downloading...' : 'Download'}</span>
                </button>

                {/* Share Button to Copy Link */}
                <button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 rounded-full px-5 py-1.5 md:py-2.5 text-xs font-semibold transition-opacity hover:opacity-90 shadow-sm max-sm:w-full bg-[#FDE8E9]"
                >
                    <FaShareAlt />
                    <span>{copied ? 'Copied!' : 'Share'}</span>
                </button>
            </div>

        </div>
    );
};

export default BayPhotoGalleryGrid;