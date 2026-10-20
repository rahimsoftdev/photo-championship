import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { FaHeart } from 'react-icons/fa';
import { FiEye, FiCalendar, FiList, FiCheckCircle } from 'react-icons/fi';

// Label shown on the top-left badge for each album type
// TODO: add real info or data (extend if you add more album types)
const albumTypeLabels = {
    single: 'Single Photo',
    six: '6 Photos Story',
    twelve: '12 Photos-Full Zodiac Story',
};

// Formats "2026-10-01T08:30:00Z" -> "October 1, 2026"
const formatDate = (iso) => {
    if (!iso) return '-';
    const d = new Date(iso);
    return Number.isNaN(d.getTime())
        ? '-'
        : d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

/**
 * AdminArtworkCard
 *
 * Props:
 *  - imageData : one artwork object (same shape as in your artworks JSON:
 *                id, albumType, images[], title, description, totalReact,
 *                viewsCount, info.createdAt ...)
 *  - onDelete  : optional callback(id). Called after the "deleted successfully"
 *                message has been shown, so the parent can remove it from its list.
 */
const AdminArtworkCard = ({ imageData = {}, onDelete,isGallery }) => {
    const navigate = useNavigate();

    const {
        id,
        albumType = 'single',
        images = [],
        title,
        description,
        totalReact = 0,
        viewsCount = 0,
        info = {},
    } = imageData;

    const [isDeleted, setIsDeleted] = useState(false); // card is hidden after delete
    const [showToast, setShowToast] = useState(false); // success message

    // After delete: show the message for 2.5s, then tell the parent
    useEffect(() => {
        if (!isDeleted) return;
        const timer = setTimeout(() => {
            setShowToast(false);
            // TODO: call real delete API here (or do it inside the parent's onDelete)
            if (onDelete) onDelete(id);
        }, 2500);
        return () => clearTimeout(timer);
    }, [isDeleted]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleDelete = () => {
        setIsDeleted(true);
        setShowToast(true);
    };

    // Image click -> /adminDashboard/competitions/:id
    const handleImageClick = () => {
        if(isGallery){
            navigate(`/adminDashboard/gallery/${id}`)
            return
        }
        navigate(`/adminDashboard/competitions/${id}`);
    };

    const handleImageKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleImageClick();
        }
    };

    const extraPhotos = images.length > 1 ? images.length - 1 : 0;

    // Success toast (stays visible even after the card itself is hidden)
    const toast = (
        <div
            className={`fixed top-5 right-5 z-[80] flex items-center gap-2 bg-white border border-green-200 text-green-700 text-sm font-medium px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
                showToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none'
            }`}
        >
            <FiCheckCircle size={18} />
            <span>Artwork deleted successfully</span>
        </div>
    );

    // After delete: hide the card, keep only the toast until it disappears
    if (isDeleted) return toast;

    return (
        <>
            {toast}

            <article className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                {/* Image (clickable) */}
                <div
                    role="button"
                    tabIndex={0}
                    onClick={handleImageClick}
                    onKeyDown={handleImageKeyDown}
                    aria-label={`Open ${title || 'artwork'}`}
                    className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#EE1C25]/40"
                >
                    {images[0] && (
                        <img
                            src={images[0]}
                            alt={title || 'Artwork'}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    )}

                    {/* Album type badge (top-left) */}
                    <span className="absolute top-2.5 left-2.5 bg-white/90 text-[#4048CD] text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded">
                        {albumTypeLabels[albumType] || albumType}
                    </span>

                    {/* "+N photos" pill (bottom-right) */}
                    {extraPhotos > 0 && (
                        <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 bg-black/60 text-white text-[10px] sm:text-[11px] font-medium px-2.5 py-1 rounded backdrop-blur-sm">
                            <FiList size={12} />
                            +{extraPhotos} photos
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-sm sm:text-[15px] font-semibold text-gray-900 truncate">
                        {title}
                    </h3>
                    <p className="mt-2 text-xs text-gray-600 truncate">{description}</p>

                    {/* Stats */}
                    <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-gray-700">
                        <span className="inline-flex items-center gap-1.5">
                            <FaHeart size={14} className="text-[#EE1C25]" />
                            {Number(totalReact).toLocaleString()}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <FiEye size={14} />
                            {Number(viewsCount).toLocaleString()}
                        </span>
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                            <FiCalendar size={14} />
                            {formatDate(info.createdAt)}
                        </span>
                    </div>

                    {/* Delete button */}
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="mt-4 w-full bg-[#EE1C25] hover:bg-[#d4161e] text-white text-xs font-medium py-2.5 rounded-md transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </article>
        </>
    );
};

export default AdminArtworkCard;