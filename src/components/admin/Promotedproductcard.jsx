import React from 'react';
import { FaHeart } from 'react-icons/fa';
import { FiCalendar, FiClock, FiEye, FiList } from 'react-icons/fi';

/**
 * PromotedProductCard (display only, no click events)
 *
 * Props:
 *  - product : one promoted item object
 *      { id, albumType ('single' | 'six' | 'twelve'), category, title, description,
 *        images[], totalReact, viewsCount, price, uploadedAt, expiryDate }
 */

// Top-left badge for each album type
// TODO: add real info or data (extend if you add more album types)
const albumBadges = {
    single: { label: 'Single Photo', className: 'bg-white/90 text-[#4048CD] uppercase', icon: false },
    six: { label: '6 Photos', className: 'bg-[#4048CD] text-white', icon: true },
    twelve: { label: '12 Photos-Full Zodiac Story', className: 'bg-white/90 text-[#4048CD]', icon: false },
};

const toDate = (iso) => {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? null : d;
};

// "Aug 9, 2026"
const formatShortDate = (iso) => {
    const d = toDate(iso);
    return d ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-';
};

// "August 9, 2026"
const formatLongDate = (iso) => {
    const d = toDate(iso);
    return d ? d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '-';
};

// "12:03 PM"
const formatTime = (iso) => {
    const d = toDate(iso);
    return d ? d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '-';
};

// "8/12/2026"
const formatExpiry = (iso) => {
    const d = toDate(iso);
    return d ? d.toLocaleDateString('en-US') : '-';
};

const PromotedProductCard = ({ product = {} }) => {
    const {
        albumType = 'single',
        category,
        title,
        description,
        images = [],
        totalReact = 0,
        viewsCount = 0,
        price = 0,
        uploadedAt,
        expiryDate,
    } = product;

    const badge = albumBadges[albumType] || albumBadges.single;
    const isSingle = albumType === 'single';
    const isTwelve = albumType === 'twelve';
    const extraPhotos = images.length > 1 ? images.length - 1 : 0;

    return (
        <article className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
            {/* Image area */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                {images[0] && (
                    <img
                        src={images[0]}
                        alt={title || 'Promoted product'}
                        loading="lazy"
                        className="w-full h-full object-cover"
                    />
                )}

                {/* Album type badge (top-left) */}
                <span
                    className={`absolute top-2 left-2 inline-flex items-center gap-1 text-[8px] sm:text-[9px] font-semibold px-2 py-1 rounded ${badge.className}`}
                >
                    {badge.icon && <FiList size={10} />}
                    {badge.label}
                </span>

                {/* "Promoted" pill (bottom-left) - only for multi photo albums */}
                {!isSingle && (
                    <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[9px] font-medium px-2 py-1 rounded backdrop-blur-sm">
                        Promoted
                    </span>
                )}

                {/* "+N photos" pill (bottom-right) */}
                {extraPhotos > 0 && (
                    <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 bg-black/60 text-white text-[9px] font-medium px-2 py-1 rounded backdrop-blur-sm">
                        <FiList size={10} />+{extraPhotos} photos
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="p-3 sm:p-4 flex flex-col flex-1">
                {isSingle ? (
                    <>
                        {/* Single photo layout */}
                        <h3 className="text-sm sm:text-[15px] font-semibold text-gray-900 truncate">{title}</h3>

                        <div className="mt-3 flex items-center justify-between gap-2 text-[10px] sm:text-[11px] text-gray-700">
                            <span className="inline-flex items-center gap-1.5">
                                <FaHeart size={13} className="text-[#EE1C25]" />
                                {Number(totalReact).toLocaleString()}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <FiEye size={13} />
                                {Number(viewsCount).toLocaleString()}
                            </span>
                            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                                <FiCalendar size={13} />
                                {formatLongDate(uploadedAt)}
                            </span>
                        </div>

                        <p className="mt-3 text-base font-bold text-[#4048CD]">${Number(price).toFixed(2)}</p>

                        <p className="mt-2 inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] text-gray-700">
                            <FiCalendar size={13} />
                            Expiry {formatExpiry(expiryDate)}
                        </p>
                    </>
                ) : (
                    <>
                        {/* Six / Twelve photos layout */}
                        <div className="flex items-center justify-between gap-2 text-[10px] text-gray-600">
                            <span className="truncate">{category}</span>
                            <div className="flex items-center gap-3 shrink-0">
                                <span className="inline-flex items-center gap-1 whitespace-nowrap">
                                    <FiCalendar size={11} />
                                    Uploaded {formatShortDate(uploadedAt)}
                                </span>
                                {isTwelve && (
                                    <span className="inline-flex items-center gap-1 whitespace-nowrap">
                                        <FiClock size={11} />
                                        {formatTime(uploadedAt)}
                                    </span>
                                )}
                            </div>
                        </div>

                        <h3 className="mt-3 text-sm sm:text-[15px] font-semibold text-gray-900 truncate">{title}</h3>
                        <p className="mt-2 text-[11px] sm:text-xs text-gray-500 line-clamp-2">{description}</p>

                        <div className="mt-auto pt-3 flex items-center justify-between gap-2 text-[10px] text-gray-700">
                            <span className="inline-flex items-center gap-1 whitespace-nowrap">
                                <FiEye size={12} />
                                {viewsCount} Views
                            </span>
                            <span className="inline-flex items-center gap-1 whitespace-nowrap">
                                <FaHeart size={11} className="text-[#EE1C25]" />
                                {totalReact} Heart
                            </span>
                            <span className="inline-flex items-center gap-1 whitespace-nowrap">
                                <FiCalendar size={12} />
                                Expiry {formatExpiry(expiryDate)}
                            </span>
                        </div>
                    </>
                )}
            </div>
        </article>
    );
};

export default PromotedProductCard;