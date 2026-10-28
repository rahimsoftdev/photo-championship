import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router';
import { FaHeart } from 'react-icons/fa';
import {
    FiEye,
    FiCalendar,
    FiList,
    FiCheckCircle,
    FiTrash2,
    FiX,
} from 'react-icons/fi';

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
 *  - imageData : one artwork object (id, albumType, images[], title,
 *                description, totalReact, viewsCount, info.createdAt ...)
 *  - onDelete  : optional callback(id). Called when the success modal is
 *                closed, so the parent can remove the item from its list.
 *
 * Delete flow:
 *  1. Click "Delete"      -> confirm modal (Cancel / Confirm Delete)
 *  2. Click "Cancel"      -> modal closes, nothing happens
 *  3. Click "Confirm"     -> data is deleted, modal switches to success message
 *  4. Close success modal -> card is removed from the list
 */
const AdminArtworkCard = ({ imageData = {}, onDelete }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

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

    // modalStep: null (closed) | 'confirm' | 'success'
    const [modalStep, setModalStep] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isRemoved, setIsRemoved] = useState(false);

    const isModalOpen = modalStep !== null;

    // Lock page scroll while the modal is open
    useEffect(() => {
        if (!isModalOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [isModalOpen]);

    // Close with the Escape key
    useEffect(() => {
        if (!isModalOpen) return;
        const onKey = (e) => {
            if (e.key === 'Escape') handleClose();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }); // eslint-disable-line react-hooks/exhaustive-deps

    const openConfirm = () => setModalStep('confirm');

    // Cancel / X / backdrop / Escape
    const handleClose = () => {
        if (isDeleting) return; // don't close while the delete is running

        if (modalStep === 'success') {
            // Data is already deleted, now remove the card from the list
            setModalStep(null);
            setIsRemoved(true);
            if (onDelete) onDelete(id);
            return;
        }

        // Confirm step: cancel does nothing else
        setModalStep(null);
    };

    const handleConfirmDelete = async () => {
        try {
            setIsDeleting(true);
            // TODO: call the real delete API here, for example:
            // await axiosSecure.delete(`/artworks/${id}`);
            await new Promise((resolve) => setTimeout(resolve, 600)); // fake delay, remove with the API
            setModalStep('success');
        } catch (error) {
            console.error('Delete failed:', error);
            // TODO: show an error message if needed
        } finally {
            setIsDeleting(false);
        }
    };

    // Image click -> current page path + "/:id"
    const handleImageClick = () => {
        const basePath = pathname.replace(/\/+$/, ''); // remove trailing slash
        navigate(`${basePath}/${id}`);
    };

    const handleImageKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleImageClick();
        }
    };

    const extraPhotos = images.length > 1 ? images.length - 1 : 0;

    if (isRemoved) return null;

    // ---------- Modal (rendered into document.body so it covers the whole screen) ----------
    const modal =
        isModalOpen &&
        createPortal(
            <div
                className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-modal-title"
            >
                {/* Blurred backdrop */}
                <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    onClick={handleClose}
                />

                {/* Panel: bottom sheet on mobile, centered card on tablet/desktop */}
                <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 sm:p-7 text-center max-h-[90vh] overflow-y-auto">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isDeleting}
                        aria-label="Close"
                        className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition disabled:opacity-40"
                    >
                        <FiX size={18} />
                    </button>

                    {modalStep === 'confirm' && (
                        <>
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-[#EE1C25]">
                                <FiTrash2 size={24} />
                            </div>

                            <h3
                                id="delete-modal-title"
                                className="text-lg sm:text-xl font-semibold text-gray-900"
                            >
                                Delete this artwork?
                            </h3>
                            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                                Are you sure you want to delete{' '}
                                <span className="font-semibold text-gray-800 break-words">
                                    {title ? `"${title}"` : 'this artwork'}
                                </span>
                                ? This action cannot be undone.
                            </p>

                            <div className="mt-6 flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={isDeleting}
                                    className="w-full sm:flex-1 border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmDelete}
                                    disabled={isDeleting}
                                    className="w-full sm:flex-1 bg-[#EE1C25] hover:bg-[#d4161e] text-white text-sm font-medium py-2.5 rounded-lg transition-colors disabled:opacity-70"
                                >
                                    {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                                </button>
                            </div>
                        </>
                    )}

                    {modalStep === 'success' && (
                        <>
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
                                <FiCheckCircle size={26} />
                            </div>

                            <h3
                                id="delete-modal-title"
                                className="text-lg sm:text-xl font-semibold text-gray-900"
                            >
                                Deleted successfully
                            </h3>
                            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                                The artwork has been deleted successfully.
                            </p>

                            <button
                                type="button"
                                onClick={handleClose}
                                className="mt-6 w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
                            >
                                Done
                            </button>
                        </>
                    )}
                </div>
            </div>,
            document.body
        );

    return (
        <>
            {modal}

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
                    <span className="absolute top-2.5 left-2.5 max-w-[80%] truncate bg-white/90 text-[#4048CD] text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded">
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

                    {/* Delete button -> opens the confirm modal */}
                    <button
                        type="button"
                        onClick={openConfirm}
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