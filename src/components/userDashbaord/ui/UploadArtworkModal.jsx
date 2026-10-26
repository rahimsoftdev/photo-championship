import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import { FiImage, FiLayers, FiX } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';

const UploadArtworkModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    // Modal open thakle background scroll lock + Esc chaple bondho
    useEffect(() => {
        if (!isOpen) return;

        const body = document.body;
        const prevOverflow = body.style.overflow;
        const prevPaddingRight = body.style.paddingRight;

        // Scrollbar gayeb hole layout jeno na lafay
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        body.style.overflow = 'hidden';
        if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

        const onKey = (e) => e.key === 'Escape' && onClose?.();
        window.addEventListener('keydown', onKey);

        return () => {
            body.style.overflow = prevOverflow;
            body.style.paddingRight = prevPaddingRight;
            window.removeEventListener('keydown', onKey);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // Option click handler with dynamic query params
    const handleSelectOption = (albumType) => {
        navigate(`/user-dashboard/sell-photos/new?albumType=${albumType}&bayphoto=yes`);
        onClose();
    };

    // Portal diye body-te render, jate sidebar, header shob kichu blur hoy
    return createPortal(
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="upload-format-title"
            onClick={onClose}
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-3 sm:p-4 bg-black/50 backdrop-blur-md animate-fade-in"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-w-lg w-full my-auto shadow-2xl relative border border-gray-100"
            >

                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-3 right-3 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition cursor-pointer"
                >
                    <FiX size={18} />
                </button>

                {/* Header Title */}
                <h3
                    id="upload-format-title"
                    className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 sm:mb-6 pr-10"
                >
                    SELECT ARTWORK FORMAT
                </h3>

                {/* Options List */}
                <div className="space-y-3 sm:space-y-4">

                    {/* Option 1: Single Photo */}
                    <div
                        onClick={() => handleSelectOption('single')}
                        className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/80 transition cursor-pointer group shadow-xs"
                    >
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                            <FiImage size={22} />
                        </div>
                        <div className="min-w-0">
                            <h4 className="text-sm font-bold text-gray-900 group-hover:text-secondary transition">
                                Upload Single Photo
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Upload one high-resolution photograph
                            </p>
                        </div>
                    </div>

                    {/* Option 2: 6 Photos */}
                    <div
                        onClick={() => handleSelectOption('six')}
                        className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/80 transition cursor-pointer group shadow-xs"
                    >
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                            <FiLayers size={22} />
                        </div>
                        <div className="min-w-0">
                            <h4 className="text-sm font-bold text-gray-900 group-hover:text-secondary transition">
                                Upload 6 Photos
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Create a cohesive 6-photo album story
                            </p>
                        </div>
                    </div>

                    {/* Option 3: 12 Photos */}
                    <div
                        onClick={() => handleSelectOption('twelve')}
                        className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/80 transition cursor-pointer group shadow-xs"
                    >
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                            <HiSparkles size={22} />
                        </div>
                        <div className="min-w-0">
                            <h4 className="text-sm font-bold text-gray-900 group-hover:text-secondary transition">
                                Upload 12 Photos
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Full Zodiac Story mapped to 12 signs
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>,
        document.body
    );
};

export default UploadArtworkModal;